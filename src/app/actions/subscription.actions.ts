"use server";

// ─────────────────────────────────────────────────────────────────────────────
// Subscription server actions — company admin subscribes to a plan.
// Follows the same patterns as orders.actions.ts for the payment flow.
// ─────────────────────────────────────────────────────────────────────────────

import { getSupabase, getServiceSupabase, resolveCompanyId } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import * as subscriptionService from "@/lib/services/subscription.service";
import type { ActionResult, BillingPlan, CompanySubscription } from "@/types";

// ── Subscribe ────────────────────────────────────────────────────────────────

export async function subscribeAction(
  formData: FormData
): Promise<ActionResult<CompanySubscription>> {
  const companyId = await resolveCompanyId();
  if (!companyId) return { success: false, error: "No company linked to your account." };

  const planId = formData.get("plan_id") as string;
  const paymentCurrency = (formData.get("payment_currency") as string) ?? "RWF";
  const paymentAmountStr = formData.get("payment_amount") as string;
  const paymentAmount = paymentAmountStr ? parseInt(paymentAmountStr, 10) : undefined;
  const employeeCountStr = formData.get("employee_count") as string;
  const employeeCount = employeeCountStr ? parseInt(employeeCountStr, 10) : 1;
  const paymentScreenshotUrl = (formData.get("payment_screenshot_url") as string) ?? undefined;

  if (!planId) return { success: false, error: "Please select a plan." };

  const result = await subscriptionService.subscribe({
    companyId,
    planId,
    paymentAmount,
    paymentCurrency,
    employeeCount,
    paymentScreenshotUrl,
  });

  if (result.success) {
    revalidatePath("/dashboard/company/subscription");
  }

  return result;
}

// ── Upload payment screenshot ────────────────────────────────────────────────

export async function uploadSubscriptionScreenshotAction(
  subscriptionId: string,
  screenshotUrl: string
): Promise<ActionResult<CompanySubscription>> {
  const supabase = await getSupabase();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { success: false, error: "Not authenticated." };

  // Verify the subscription belongs to the caller's company
  const companyId = await resolveCompanyId();
  if (!companyId) return { success: false, error: "No company linked to your account." };

  const serviceClient = getServiceSupabase();
  const { data: sub } = await serviceClient
    .from("company_subscriptions")
    .select("company_id, payment_status")
    .eq("id", subscriptionId)
    .single();

  if (!sub || sub.company_id !== companyId) {
    return { success: false, error: "Subscription not found." };
  }

  const result = await subscriptionService.uploadSubscriptionPaymentScreenshot(
    subscriptionId,
    screenshotUrl
  );

  if (result.success) {
    revalidatePath("/dashboard/company/subscription");
  }

  return result;
}

// ── Current subscription ─────────────────────────────────────────────────────

export async function getMySubscriptionAction(): Promise<
  ActionResult<CompanySubscription | null>
> {
  const companyId = await resolveCompanyId();
  if (!companyId) return { success: false, error: "No company linked to your account." };

  return subscriptionService.getCompanySubscription(companyId);
}

// ── Active plans (public — for subscription flow) ────────────────────────────

export async function getActivePlansAction(): Promise<ActionResult<BillingPlan[]>> {
  const { getActivePlans } = await import("@/lib/supabase/billing.repo");
  const plans = await getActivePlans();
  return { success: true, data: plans };
}

// ── Admin: approve / verify / reject ─────────────────────────────────────────

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

export async function verifySubscriptionPaymentAction(
  subscriptionId: string
): Promise<ActionResult<CompanySubscription>> {
  if (!(await requireSuperAdmin())) {
    return { success: false, error: "Unauthorized. Super admin only." };
  }

  const result = await subscriptionService.verifySubscriptionPayment(subscriptionId);
  if (result.success) {
    revalidatePath("/dashboard/admin/billing");
  }
  return result;
}

export async function approveSubscriptionAction(
  subscriptionId: string
): Promise<ActionResult<CompanySubscription>> {
  if (!(await requireSuperAdmin())) {
    return { success: false, error: "Unauthorized. Super admin only." };
  }

  const result = await subscriptionService.approveSubscription(subscriptionId);
  if (result.success) {
    revalidatePath("/dashboard/admin/billing");
    revalidatePath("/dashboard/admin");
  }
  return result;
}

export async function rejectSubscriptionAction(
  subscriptionId: string
): Promise<ActionResult<CompanySubscription>> {
  if (!(await requireSuperAdmin())) {
    return { success: false, error: "Unauthorized. Super admin only." };
  }

  const result = await subscriptionService.rejectSubscription(subscriptionId);
  if (result.success) {
    revalidatePath("/dashboard/admin/billing");
    revalidatePath("/dashboard/admin");
  }
  return result;
}

export async function fetchAllSubscriptionsAdminAction(): Promise<
  ActionResult<subscriptionService.SubscriptionEnriched[]>
> {
  if (!(await requireSuperAdmin())) {
    return { success: false, error: "Unauthorized." };
  }

  return subscriptionService.getAllSubscriptionsAdmin();
}
