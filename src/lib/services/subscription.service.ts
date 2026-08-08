// ─────────────────────────────────────────────────────────────────────────────
// Subscription service — business logic for company subscription lifecycle.
// Follows the same pattern as orders.service.ts for payment + approval flow.
// ─────────────────────────────────────────────────────────────────────────────

import * as billingRepo from "@/lib/supabase/billing.repo";
import * as companiesRepo from "@/lib/supabase/companies.repo";
import { getServiceSupabase } from "@/lib/supabase/server";
import type { ActionResult, CompanySubscription } from "@/types";

// ── Types ──────────────────────────────────────────────────────────────────────

export interface SubscribeInput {
  companyId: string;
  planId: string;
  paymentAmount?: number;
  paymentCurrency?: string;
  employeeCount?: number;
  paymentScreenshotUrl?: string;
}

export interface SubscriptionEnriched extends CompanySubscription {
  company: { id: string; name: string; slug: string } | null;
  plan: { name: string; price_per_employee: number; billing_cycle: string } | null;
}

// ── Subscribe ──────────────────────────────────────────────────────────────────

export async function subscribe(
  input: SubscribeInput
): Promise<ActionResult<CompanySubscription>> {
  // Validate company exists and is active
  const company = await companiesRepo.getCompanyById(input.companyId);
  if (!company) return { success: false, error: "Company not found." };
  if (company.status !== "active") {
    return { success: false, error: "Company must be active before subscribing to a plan." };
  }

  // Validate plan exists and is active
  const plan = await billingRepo.getPlanById(input.planId);
  if (!plan) return { success: false, error: "Plan not found." };
  if (!plan.is_active) return { success: false, error: "This plan is no longer available." };

  // Check if company already has an active or pending subscription
  const supabase = getServiceSupabase();
  const { data: existingSub } = await supabase
    .from("company_subscriptions")
    .select("id, status")
    .eq("company_id", input.companyId)
    .in("status", ["active", "pending_approval"])
    .maybeSingle();

  if (existingSub) {
    if (existingSub.status === "active") {
      return { success: false, error: "Your company already has an active subscription. Contact support to change plans." };
    }
    if (existingSub.status === "pending_approval") {
      return { success: false, error: "You already have a subscription awaiting approval." };
    }
  }

  const subscription = await billingRepo.createSubscription({
    company_id:              input.companyId,
    plan_id:                 input.planId,
    employee_count:          input.employeeCount ?? 0,
    payment_amount:          input.paymentAmount,
    payment_currency:        input.paymentCurrency,
    payment_screenshot_url:  input.paymentScreenshotUrl,
  });

  if (!subscription) return { success: false, error: "Failed to create subscription." };

  return { success: true, data: subscription };
}

// ── Payment ────────────────────────────────────────────────────────────────────

export async function uploadSubscriptionPaymentScreenshot(
  subscriptionId: string,
  screenshotUrl: string
): Promise<ActionResult<CompanySubscription>> {
  const sub = await billingRepo.getSubscriptionById(subscriptionId);
  if (!sub) return { success: false, error: "Subscription not found." };

  if (sub.payment_status === "verified") {
    return { success: false, error: "Payment already verified. Cannot change screenshot." };
  }

  const updated = await billingRepo.updateSubscription(subscriptionId, {
    payment_screenshot_url: screenshotUrl,
    payment_status: "paid",
  });

  if (!updated) return { success: false, error: "Failed to update payment." };
  return { success: true, data: updated };
}

// ── Admin: approve / verify ────────────────────────────────────────────────────

export async function verifySubscriptionPayment(
  subscriptionId: string
): Promise<ActionResult<CompanySubscription>> {
  const sub = await billingRepo.getSubscriptionById(subscriptionId);
  if (!sub) return { success: false, error: "Subscription not found." };

  if (sub.payment_status !== "paid") {
    return { success: false, error: "Payment must be marked as 'paid' before verification." };
  }

  const updated = await billingRepo.updateSubscription(subscriptionId, {
    payment_status: "verified",
  });

  if (!updated) return { success: false, error: "Failed to verify payment." };
  return { success: true, data: updated };
}

export async function approveSubscription(
  subscriptionId: string
): Promise<ActionResult<CompanySubscription>> {
  const sub = await billingRepo.getSubscriptionById(subscriptionId);
  if (!sub) return { success: false, error: "Subscription not found." };

  if (sub.status !== "pending_approval") {
    return { success: false, error: `Cannot approve subscription with status '${sub.status}'.` };
  }

  if (sub.payment_status !== "verified") {
    return { success: false, error: "Payment must be verified before approving the subscription." };
  }

  // Determine billing cycle from the plan
  const plan = await billingRepo.getPlanById(sub.plan_id);
  const isAnnual = plan?.billing_cycle === "annual";

  const now = new Date();
  const nextBilling = new Date(now);
  if (isAnnual) {
    nextBilling.setFullYear(nextBilling.getFullYear() + 1);
  } else {
    nextBilling.setMonth(nextBilling.getMonth() + 1);
  }
  const nextBillingDate = nextBilling.toISOString().slice(0, 10);

  const updated = await billingRepo.updateSubscription(subscriptionId, {
    status: "active",
    started_at: now.toISOString(),
    next_billing_date: nextBillingDate,
  });

  if (!updated) return { success: false, error: "Failed to approve subscription." };
  return { success: true, data: updated };
}

export async function rejectSubscription(
  subscriptionId: string
): Promise<ActionResult<CompanySubscription>> {
  const sub = await billingRepo.getSubscriptionById(subscriptionId);
  if (!sub) return { success: false, error: "Subscription not found." };

  if (sub.status !== "pending_approval") {
    return { success: false, error: `Cannot reject subscription with status '${sub.status}'.` };
  }

  const updated = await billingRepo.updateSubscription(subscriptionId, {
    status: "cancelled",
  });

  if (!updated) return { success: false, error: "Failed to reject subscription." };
  return { success: true, data: updated };
}

// ── Reads ────────────────────────────────────────────────────────────────────

export async function getCompanySubscription(
  companyId: string
): Promise<ActionResult<CompanySubscription | null>> {
  const sub = await billingRepo.getSubscriptionByCompanyId(companyId);
  return { success: true, data: sub };
}

export async function getAllSubscriptionsAdmin(): Promise<
  ActionResult<SubscriptionEnriched[]>
> {
  const subs = await billingRepo.getAllSubscriptionsEnriched();
  return { success: true, data: subs };
}

export async function getPendingSubscriptionsCount(): Promise<number> {
  const pending = await billingRepo.getAllSubscriptions({ status: "pending_approval" });
  return pending.length;
}
