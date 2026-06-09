"use server";

// ─────────────────────────────────────────────────────────────────────────────
// Admin server actions — super admin operations.
// Called from the admin dashboard. All actions check for super_admin role.
// ─────────────────────────────────────────────────────────────────────────────

import { getSupabase } from "@/lib/supabase/server";
import * as onboardingService from "@/lib/services/onboarding.service";
import * as adminService from "@/lib/services/admin.service";
import type { ActionResult } from "@/types";

// ── Guard ────────────────────────────────────────────────────────────────────

async function requireSuperAdmin(): Promise<boolean> {
  const supabase = await getSupabase();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return false;

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  return profile?.role === "super_admin";
}

// ── Approvals ────────────────────────────────────────────────────────────────

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyActionResult = ActionResult<any>;

export async function approveCompany(companyId: string): Promise<AnyActionResult> {
  if (!(await requireSuperAdmin())) {
    return { success: false, error: "Unauthorized. Super admin only." };
  }
  return onboardingService.approveCompany(companyId);
}

export async function approveIndividual(profileId: string): Promise<AnyActionResult> {
  if (!(await requireSuperAdmin())) {
    return { success: false, error: "Unauthorized. Super admin only." };
  }
  return onboardingService.approveIndividual(profileId);
}

export async function rejectUser(profileId: string): Promise<AnyActionResult> {
  if (!(await requireSuperAdmin())) {
    return { success: false, error: "Unauthorized. Super admin only." };
  }
  return onboardingService.rejectUser(profileId);
}

// ── Card designs ─────────────────────────────────────────────────────────────

export async function createDesign(formData: FormData): Promise<AnyActionResult> {
  if (!(await requireSuperAdmin())) {
    return { success: false, error: "Unauthorized. Super admin only." };
  }

  return adminService.createDesign({
    name:         formData.get("name") as string,
    description:  (formData.get("description") as string) ?? undefined,
    accent_color: (formData.get("accent_color") as string) ?? undefined,
    pattern:      (formData.get("pattern") as string) ?? undefined,
    is_active:    formData.get("is_active") === "on",
  });
}

export async function updateDesign(
  id: string,
  data: Record<string, unknown>
): Promise<AnyActionResult> {
  if (!(await requireSuperAdmin())) {
    return { success: false, error: "Unauthorized. Super admin only." };
  }
  return adminService.updateDesign(id, data as Parameters<typeof adminService.updateDesign>[1]);
}

export async function deleteDesign(id: string): Promise<AnyActionResult> {
  if (!(await requireSuperAdmin())) {
    return { success: false, error: "Unauthorized. Super admin only." };
  }
  return adminService.deleteDesign(id);
}

// ── Billing plans ────────────────────────────────────────────────────────────

export async function upsertPlan(formData: FormData): Promise<AnyActionResult> {
  if (!(await requireSuperAdmin())) {
    return { success: false, error: "Unauthorized. Super admin only." };
  }

  return adminService.upsertPlan({
    name:               formData.get("name") as string,
    billing_cycle:      (formData.get("billing_cycle") as "monthly" | "annual"),
    price_per_employee: parseInt(formData.get("price_per_employee") as string, 10),
    is_active:          formData.get("is_active") === "on",
  });
}

export async function deletePlan(id: string): Promise<AnyActionResult> {
  if (!(await requireSuperAdmin())) {
    return { success: false, error: "Unauthorized. Super admin only." };
  }
  return adminService.deletePlan(id);
}

// ── Order management ─────────────────────────────────────────────────────────

export async function approveOrder(orderId: string): Promise<AnyActionResult> {
  if (!(await requireSuperAdmin())) {
    return { success: false, error: "Unauthorized. Super admin only." };
  }
  const { approveOrder: approve } = await import("@/lib/services/orders.service");
  return approve(orderId);
}

export async function markOrderShipped(
  orderId: string,
  trackingInfo?: string
): Promise<AnyActionResult> {
  if (!(await requireSuperAdmin())) {
    return { success: false, error: "Unauthorized. Super admin only." };
  }
  const { markShipped } = await import("@/lib/services/orders.service");
  return markShipped(orderId, trackingInfo);
}

export async function markOrderDelivered(orderId: string): Promise<AnyActionResult> {
  if (!(await requireSuperAdmin())) {
    return { success: false, error: "Unauthorized. Super admin only." };
  }
  const { markDelivered } = await import("@/lib/services/orders.service");
  return markDelivered(orderId);
}

// ── Data fetching (server-action safe for client components) ─────────────────

export async function fetchOrders(): Promise<AnyActionResult> {
  if (!(await requireSuperAdmin())) {
    return { success: false, error: "Unauthorized." };
  }
  const { getAllOrdersAdmin } = await import("@/lib/services/admin.service");
  return getAllOrdersAdmin();
}

export async function fetchPendingQueue(): Promise<AnyActionResult> {
  if (!(await requireSuperAdmin())) {
    return { success: false, error: "Unauthorized." };
  }
  const { getPendingQueue } = await import("@/lib/services/admin.service");
  return getPendingQueue();
}

export async function fetchPlans(): Promise<AnyActionResult> {
  if (!(await requireSuperAdmin())) {
    return { success: false, error: "Unauthorized." };
  }
  const { getAllPlansAdmin } = await import("@/lib/services/admin.service");
  return getAllPlansAdmin();
}

export async function fetchUsers(): Promise<AnyActionResult> {
  if (!(await requireSuperAdmin())) {
    return { success: false, error: "Unauthorized." };
  }
  const { getAllUsers } = await import("@/lib/services/admin.service");
  return getAllUsers();
}

export async function fetchDesigns(): Promise<AnyActionResult> {
  if (!(await requireSuperAdmin())) {
    return { success: false, error: "Unauthorized." };
  }
  const { getAllDesignsAdmin } = await import("@/lib/services/admin.service");
  return getAllDesignsAdmin();
}

export async function deletePlanAction(id: string): Promise<AnyActionResult> {
  if (!(await requireSuperAdmin())) {
    return { success: false, error: "Unauthorized." };
  }
  const { deletePlan } = await import("@/lib/services/admin.service");
  return deletePlan(id);
}

// ── Company settings ────────────────────────────────────────────────────────

export async function updateCompany(
  companyId: string,
  data: Record<string, unknown>
): Promise<AnyActionResult> {
  if (!(await requireSuperAdmin())) {
    return { success: false, error: "Unauthorized." };
  }
  const { getServiceSupabase } = await import("@/lib/supabase/server");
  const supabase = getServiceSupabase();
  const { error } = await supabase
    .from("companies")
    .update({
      name:         data.name,
      industry:     data.industry,
      website:      data.website,
      description:  data.description,
      brand_color:  data.brand_color,
    })
    .eq("id", companyId);

  if (error) return { success: false, error: error.message };
  return { success: true };
}
