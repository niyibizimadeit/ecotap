// ─────────────────────────────────────────────────────────────────────────────
// Billing repository — SSOT for all billing_plans & company_subscriptions queries.
// ─────────────────────────────────────────────────────────────────────────────

import { getSupabase, getServiceSupabase } from "@/lib/supabase/server";
import type { BillingPlan, CompanySubscription, SubscriptionStatus } from "@/types";

// ── Billing plans ────────────────────────────────────────────────────────────

export async function getActivePlans(): Promise<BillingPlan[]> {
  const supabase = await getSupabase();
  const { data } = await supabase
    .from("billing_plans")
    .select("*")
    .eq("is_active", true)
    .order("price_per_employee");
  return data ?? [];
}

export async function getAllPlans(): Promise<BillingPlan[]> {
  const supabase = await getSupabase();
  const { data } = await supabase
    .from("billing_plans")
    .select("*")
    .order("price_per_employee");
  return data ?? [];
}

export async function getPlanById(id: string): Promise<BillingPlan | null> {
  const supabase = await getSupabase();
  const { data } = await supabase
    .from("billing_plans")
    .select("*")
    .eq("id", id)
    .single();
  return data;
}

export async function upsertPlan(plan: {
  id?: string;
  name: string;
  billing_cycle: "monthly" | "annual";
  price_per_employee: number;
  is_active?: boolean;
}): Promise<BillingPlan | null> {
  const supabase = await getSupabase();
  const { data } = await supabase
    .from("billing_plans")
    .upsert({
      id:                 plan.id,
      name:               plan.name,
      billing_cycle:      plan.billing_cycle,
      price_per_employee: plan.price_per_employee,
      is_active:          plan.is_active ?? true,
    })
    .select()
    .single();
  return data;
}

export async function deletePlan(id: string): Promise<void> {
  const supabase = await getSupabase();
  await supabase.from("billing_plans").delete().eq("id", id);
}

// ── Company subscriptions ────────────────────────────────────────────────────

export async function getSubscriptionByCompanyId(
  companyId: string
): Promise<CompanySubscription | null> {
  const supabase = await getSupabase();
  const { data } = await supabase
    .from("company_subscriptions")
    .select("*")
    .eq("company_id", companyId)
    .maybeSingle();
  return data;
}

export async function getSubscriptionById(
  id: string
): Promise<CompanySubscription | null> {
  const supabase = await getSupabase();
  const { data } = await supabase
    .from("company_subscriptions")
    .select("*")
    .eq("id", id)
    .single();
  return data;
}

export async function getAllSubscriptions(filters?: {
  status?: SubscriptionStatus;
}): Promise<CompanySubscription[]> {
  const supabase = await getSupabase();
  let query = supabase.from("company_subscriptions").select("*");

  if (filters?.status) query = query.eq("status", filters.status);

  const { data } = await query.order("created_at", { ascending: false });
  return data ?? [];
}

/**
 * All subscriptions enriched with company + plan info.
 * Used by the admin dashboard for subscription management.
 */
export async function getAllSubscriptionsEnriched(): Promise<
  Array<CompanySubscription & {
    company: { id: string; name: string; slug: string } | null;
    plan: { name: string; price_per_employee: number; billing_cycle: string } | null;
  }>
> {
  const supabase = getServiceSupabase();
  const { data: subs } = await supabase
    .from("company_subscriptions")
    .select("*")
    .order("created_at", { ascending: false });

  if (!subs?.length) return [];

  // Batch-lookup companies and plans
  const companyIds = [...new Set(subs.map((s: Record<string, unknown>) => s.company_id))];
  const planIds = [...new Set(subs.map((s: Record<string, unknown>) => s.plan_id))];

  const [{ data: companies }, { data: plans }] = await Promise.all([
    supabase.from("companies").select("id, name, slug").in("id", companyIds as string[]),
    supabase.from("billing_plans").select("name, price_per_employee, billing_cycle").in("id", planIds as string[]),
  ]);

  const companyMap = new Map((companies ?? []).map((c: Record<string, unknown>) => [c.id, c]));
  const planMap = new Map((plans ?? []).map((p: Record<string, unknown>, i: number) => [planIds[i] as string, p]));

  return subs.map((s: Record<string, unknown>) => ({
    ...s,
    company: companyMap.get(s.company_id as string) ?? null,
    plan: planMap.get(s.plan_id as string) ?? null,
  })) as Array<CompanySubscription & {
    company: { id: string; name: string; slug: string } | null;
    plan: { name: string; price_per_employee: number; billing_cycle: string } | null;
  }>;
}

/**
 * Create a new subscription with payment info.
 * Uses service role — the service layer (subscription.service.ts) handles
 * all authorization checks (company ownership, plan validity, duplicate check).
 * This avoids RLS issues since company_subscriptions has no INSERT policy
 * for non-admin users (same pattern as contact_exchanges.repo.ts).
 *
 * Status defaults to 'pending_approval' — super admin must verify payment
 * before the subscription becomes 'active'.
 */
export async function createSubscription(sub: {
  company_id: string;
  plan_id: string;
  employee_count?: number;
  payment_amount?: number;
  payment_currency?: string;
  payment_screenshot_url?: string;
}): Promise<CompanySubscription | null> {
  const supabase = getServiceSupabase();
  const { data } = await supabase
    .from("company_subscriptions")
    .insert({
      company_id:              sub.company_id,
      plan_id:                 sub.plan_id,
      employee_count:          sub.employee_count ?? 0,
      status:                  "pending_approval",
      payment_status:          sub.payment_screenshot_url ? "paid" : "unpaid",
      payment_amount:          sub.payment_amount ?? null,
      payment_currency:        sub.payment_currency ?? "RWF",
      payment_screenshot_url:  sub.payment_screenshot_url ?? null,
      started_at:              new Date().toISOString(),
      next_billing_date:       null,
    })
    .select()
    .single();
  return data;
}

export async function updateSubscription(
  id: string,
  updates: Partial<
    Pick<CompanySubscription, "plan_id" | "status" | "employee_count" | "next_billing_date" | "started_at" | "payment_status" | "payment_screenshot_url" | "payment_amount" | "payment_currency">
  >
): Promise<CompanySubscription | null> {
  const supabase = getServiceSupabase();
  const { data } = await supabase
    .from("company_subscriptions")
    .update(updates)
    .eq("id", id)
    .select()
    .single();
  return data;
}

export async function cancelSubscription(companyId: string): Promise<CompanySubscription | null> {
  const supabase = await getSupabase();
  const { data } = await supabase
    .from("company_subscriptions")
    .update({ status: "cancelled" })
    .eq("company_id", companyId)
    .select()
    .single();
  return data;
}
