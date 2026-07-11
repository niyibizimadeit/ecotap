"use server";

import { cache } from "react";
import { getSupabase, getServiceSupabase } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import type { ActionResult } from "@/types";

// ─── Types ───────────────────────────────────────────────────────────────────

export interface CompanyEmployee {
  id: string;
  name: string;
  email: string;
  title: string;
  status: "active" | "pending" | "suspended";
  username: string;
  joined: string;
}

export interface CompanyDashboardData {
  company: {
    id: string;
    name: string;
    slug: string;
    logo_url: string | null;
    brand_color: string;
    industry: string | null;
    website: string | null;
    description: string | null;
    theme_locked: boolean;
  };
  employees: CompanyEmployee[];
  subscription: {
    id: string;
    status: string;
    billing_cycle: string;
    employee_count: number;
    next_billing_date: string | null;
    started_at: string;
    payment_status: string;
    payment_screenshot_url: string | null;
    payment_amount: number | null;
    payment_currency: string;
    plan: {
      name: string;
      price_per_employee: number;
      billing_cycle: string;
    } | null;
  } | null;
  stats: {
    active: number;
    pending: number;
    suspended: number;
    total: number;
  };
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

/**
 * Resolves the company_id for the currently authenticated company_admin.
 * Returns null if the user has no primary company association.
 */
async function resolveCompanyId(): Promise<string | null> {
  try {
    const supabase = await getSupabase();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return null;

    const { data: link } = await supabase
      .from("profile_companies")
      .select("company_id")
      .eq("profile_id", user.id)
      .eq("is_primary", true)
      .single();

    return link?.company_id ?? null;
  } catch (error) {
    console.error("resolveCompanyId failed:", error);
    return null;
  }
}

// ─── Reads ────────────────────────────────────────────────────────────────────

/**
 * Returns all data needed to render the company admin dashboard.
 * Single round-trip pattern: one action call per page load.
 * Uses React.cache() to deduplicate multiple calls from layout + pages
 * within the same request (5 pages → 1 Supabase query).
 */
const _getCompanyDashboardData = cache(async (
  companyId: string
): Promise<
  { success: true; data: CompanyDashboardData } | { success: false; error: string }
> => {
  try {
    const service = getServiceSupabase();

    // Parallel fetch: company + employee links + subscription (with plan)
    const [companyResult, linksResult, subResult] = await Promise.all([
      service.from("companies").select("*").eq("id", companyId).single(),
      service
        .from("profile_companies")
        .select("profile_id, job_title")
        .eq("company_id", companyId),
      service
        .from("company_subscriptions")
        .select("*, plan:billing_plans(*)")
        .eq("company_id", companyId)
        .in("status", ["active", "pending_approval"])
        .maybeSingle(),
    ]);

    if (companyResult.error || !companyResult.data) {
      return { success: false, error: "COMPANY_NOT_FOUND" };
    }

    const company = companyResult.data;
    const links = linksResult.data ?? [];
    const sub = subResult.data ?? null;

    // Fetch employee profiles using ids from the join table
    const profileIds = links.map((l) => l.profile_id);
    const { data: profiles } = profileIds.length
      ? await service
          .from("profiles")
          .select("id, full_name, email, status, username, created_at")
          .in("id", profileIds)
      : { data: [] };

    const employees: CompanyEmployee[] = (profiles ?? []).map((p) => {
      const link = links.find((l) => l.profile_id === p.id);
      return {
        id: p.id,
        name: p.full_name,
        email: p.email,
        title: (link?.job_title as string) ?? "—",
        status: (p.status as CompanyEmployee["status"]) ?? "pending",
        username: p.username,
        joined: p.created_at
          ? new Date(p.created_at).toLocaleDateString("en-GB", {
              day: "numeric",
              month: "short",
              year: "numeric",
            })
          : "—",
      };
    });

    const stats = {
      total: employees.length,
      active: employees.filter((e) => e.status === "active").length,
      pending: employees.filter((e) => e.status === "pending").length,
      suspended: employees.filter((e) => e.status === "suspended").length,
    };

    // Normalise the Supabase join shape for subscription + plan
    let subscription: CompanyDashboardData["subscription"] = null;
    if (sub) {
      const plan = Array.isArray(sub.plan) ? sub.plan[0] : sub.plan;
      subscription = {
        id: sub.id,
        status: sub.status,
        billing_cycle: sub.billing_cycle ?? plan?.billing_cycle ?? "—",
        employee_count: sub.employee_count ?? 0,
        next_billing_date: sub.next_billing_date ?? null,
        started_at: sub.started_at,
        payment_status: (sub as Record<string, unknown>).payment_status as string ?? "unpaid",
        payment_screenshot_url: (sub as Record<string, unknown>).payment_screenshot_url as string ?? null,
        payment_amount: (sub as Record<string, unknown>).payment_amount as number ?? null,
        payment_currency: (sub as Record<string, unknown>).payment_currency as string ?? "RWF",
        plan: plan
          ? {
              name: plan.name,
              price_per_employee: plan.price_per_employee,
              billing_cycle: plan.billing_cycle,
            }
          : null,
      };
    }

    return {
      success: true,
      data: {
        company: {
          id: company.id,
          name: company.name,
          slug: company.slug,
          logo_url: company.logo_url ?? null,
          brand_color: company.brand_color ?? "#064E3B",
          industry: company.industry ?? null,
          website: company.website ?? null,
          description: company.description ?? null,
          theme_locked: company.theme_locked ?? false,
        },
        employees,
        subscription,
        stats,
      },
    };
  } catch {
    return { success: false, error: "UNEXPECTED_ERROR" };
  }
});

/**
 * Public wrapper: resolves the company ID from the authenticated user,
 * then delegates to the cached implementation for deduplication.
 */
export async function getCompanyDashboardData(): Promise<
  { success: true; data: CompanyDashboardData } | { success: false; error: string }
> {
  const companyId = await resolveCompanyId();
  if (!companyId) return { success: false, error: "NO_COMPANY_LINKED" };
  return _getCompanyDashboardData(companyId);
}

// ─── Mutations ────────────────────────────────────────────────────────────────

export interface UpdateCompanyInput {
  name: string;
  slug: string;
  industry?: string;
  website?: string;
  description?: string;
  brand_color?: string;
  theme_locked?: boolean;
}

export async function updateMyCompany(
  input: UpdateCompanyInput
): Promise<{ success: boolean; error?: string }> {
  try {
    const companyId = await resolveCompanyId();
    if (!companyId) return { success: false, error: "NO_COMPANY_LINKED" };

    // Guard: slug format
    if (!/^[a-z0-9][a-z0-9\-]{1,48}[a-z0-9]$/.test(input.slug)) {
      return { success: false, error: "INVALID_SLUG_FORMAT" };
    }

    // Guard: brand_color hex format
    if (input.brand_color && !/^#[0-9a-fA-F]{6}$/.test(input.brand_color)) {
      return { success: false, error: "INVALID_COLOR_FORMAT" };
    }

    const service = getServiceSupabase();
    const { error } = await service
      .from("companies")
      .update({
        name: input.name,
        slug: input.slug,
        industry: input.industry ?? null,
        website: input.website ?? null,
        description: input.description ?? null,
        brand_color: input.brand_color ?? "#064E3B",
        theme_locked: input.theme_locked ?? false,
      })
      .eq("id", companyId);

    if (error) return { success: false, error: error.message };

    revalidatePath("/dashboard/company");
    revalidatePath("/dashboard/company/settings");
    return { success: true };
  } catch {
    return { success: false, error: "UNEXPECTED_ERROR" };
  }
}

// ── Employee management ────────────────────────────────────────────────────────

/**
 * Permanently delete an employee from the company and the platform.
 * Only callable by a company admin / HR of the same company.
 */
export async function deleteEmployeeAction(
  employeeProfileId: string
): Promise<ActionResult<void>> {
  const supabase = await getSupabase();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { success: false, error: "Not authenticated." };

  // Ensure the caller is a company admin
  const companyId = await resolveCompanyId();
  if (!companyId) return { success: false, error: "No company linked to your account." };

  // Verify the target employee belongs to the same company
  const { data: employeeLink } = await (await import("@/lib/supabase/server")).getServiceSupabase()
    .from("profile_companies")
    .select("id")
    .eq("profile_id", employeeProfileId)
    .eq("company_id", companyId)
    .single();

  if (!employeeLink) {
    return { success: false, error: "Employee not found in your company." };
  }

  // Prevent self-delete via this route
  if (employeeProfileId === user.id) {
    return { success: false, error: "Use account settings to delete your own account." };
  }

  const { deleteProfileCascade } = await import("@/lib/services/admin.service");
  const errors = await deleteProfileCascade(employeeProfileId);

  if (errors.length > 0) {
    return { success: false, error: `Partial deletion: ${errors.join("; ")}` };
  }

  revalidatePath("/dashboard/company/employees");
  return { success: true };
}

// ── Suspend / Activate employee ─────────────────────────────────────────────

/**
 * Suspend an employee — sets their profile status to "suspended".
 * Only callable by a company admin whose company the employee belongs to.
 */
export async function suspendEmployeeAction(
  employeeProfileId: string
): Promise<ActionResult<void>> {
  const supabase = await getSupabase();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { success: false, error: "Not authenticated." };

  const companyId = await resolveCompanyId();
  if (!companyId) return { success: false, error: "No company linked to your account." };

  // Verify the target employee belongs to the same company
  const service = getServiceSupabase();
  const { data: employeeLink } = await service
    .from("profile_companies")
    .select("id")
    .eq("profile_id", employeeProfileId)
    .eq("company_id", companyId)
    .single();

  if (!employeeLink) {
    return { success: false, error: "Employee not found in your company." };
  }

  // Prevent self-suspend
  if (employeeProfileId === user.id) {
    return { success: false, error: "You cannot suspend your own account." };
  }

  // Verify current status is "active"
  const { data: targetProfile } = await service
    .from("profiles")
    .select("status")
    .eq("id", employeeProfileId)
    .single();

  if (!targetProfile || targetProfile.status !== "active") {
    return { success: false, error: "Employee must be active to suspend." };
  }

  const { error } = await service
    .from("profiles")
    .update({ status: "suspended" })
    .eq("id", employeeProfileId);

  if (error) return { success: false, error: error.message };

  revalidatePath("/dashboard/company/employees");
  return { success: true };
}

/**
 * Reactivate a suspended employee — sets their profile status back to "active".
 * Only callable by a company admin whose company the employee belongs to.
 */
export async function activateEmployeeAction(
  employeeProfileId: string
): Promise<ActionResult<void>> {
  const supabase = await getSupabase();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { success: false, error: "Not authenticated." };

  const companyId = await resolveCompanyId();
  if (!companyId) return { success: false, error: "No company linked to your account." };

  // Verify the target employee belongs to the same company
  const service = getServiceSupabase();
  const { data: employeeLink } = await service
    .from("profile_companies")
    .select("id")
    .eq("profile_id", employeeProfileId)
    .eq("company_id", companyId)
    .single();

  if (!employeeLink) {
    return { success: false, error: "Employee not found in your company." };
  }

  // Prevent self-activate (edge case)
  if (employeeProfileId === user.id) {
    return { success: false, error: "You cannot modify your own account." };
  }

  // Verify current status is "suspended"
  const { data: targetProfile } = await service
    .from("profiles")
    .select("status")
    .eq("id", employeeProfileId)
    .single();

  if (!targetProfile || targetProfile.status !== "suspended") {
    return { success: false, error: "Employee must be suspended to reactivate." };
  }

  const { error } = await service
    .from("profiles")
    .update({ status: "active" })
    .eq("id", employeeProfileId);

  if (error) return { success: false, error: error.message };

  revalidatePath("/dashboard/company/employees");
  return { success: true };
}