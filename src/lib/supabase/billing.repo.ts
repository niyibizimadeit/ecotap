// ─────────────────────────────────────────────────────────────────────────────
// Billing repository — SSOT for all billing_plans & company_subscriptions queries.
// ─────────────────────────────────────────────────────────────────────────────

import { getSupabase } from "@/lib/supabase/server";
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

export async function createSubscription(sub: {
  company_id: string;
  plan_id: string;
  employee_count?: number;
}): Promise<CompanySubscription | null> {
  const supabase = await getSupabase();
  const { data } = await supabase
    .from("company_subscriptions")
    .insert({
      company_id:      sub.company_id,
      plan_id:         sub.plan_id,
      employee_count:  sub.employee_count ?? 0,
      status:          "active",
      started_at:      new Date().toISOString(),
      next_billing_date: null,
    })
    .select()
    .single();
  return data;
}

export async function updateSubscription(
  id: string,
  updates: Partial<
    Pick<CompanySubscription, "plan_id" | "status" | "employee_count" | "next_billing_date">
  >
): Promise<CompanySubscription | null> {
  const supabase = await getSupabase();
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
