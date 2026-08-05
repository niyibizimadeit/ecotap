// ─────────────────────────────────────────────────────────────────────────────
// Card orders repository — SSOT for all card_orders table queries.
// ─────────────────────────────────────────────────────────────────────────────

import { getSupabase, getServiceSupabase } from "@/lib/supabase/server";
import type { CardOrder, CardOrderWithDesign, OrderStatus } from "@/types";

// ── Reads ────────────────────────────────────────────────────────────────────

export async function getOrdersByProfileId(
  profileId: string,
  page = 1,
  pageSize = 10
): Promise<{ orders: CardOrderWithDesign[]; total: number; page: number; totalPages: number }> {
  const supabase = await getSupabase();
  const offset = (page - 1) * pageSize;

  const query = supabase
    .from("card_orders")
    .select(
      `*,
      design:card_designs!card_orders_design_id_fkey (*)`,
      { count: "exact" }
    )
    .eq("profile_id", profileId)
    .order("created_at", { ascending: false })
    .range(offset, offset + pageSize - 1);

  const { data, count } = await query;
  const total = count ?? 0;

  return {
    orders: (data ?? []) as CardOrderWithDesign[],
    total,
    page,
    totalPages: Math.max(1, Math.ceil(total / pageSize)),
  };
}

export async function getAllOrders(filters?: {
  status?: OrderStatus;
}): Promise<CardOrderWithDesign[]> {
  const supabase = await getSupabase();
  let query = supabase.from("card_orders").select(`
    *,
    design:card_designs!card_orders_design_id_fkey (*),
    profile:profiles!card_orders_profile_id_fkey (full_name, email)
  `);

  if (filters?.status) query = query.eq("status", filters.status);

  const { data } = await query.order("created_at", { ascending: false });
  return (data ?? []) as CardOrderWithDesign[];
}

export async function getOrderById(
  id: string
): Promise<CardOrderWithDesign | null> {
  const supabase = await getSupabase();
  const { data } = await supabase
    .from("card_orders")
    .select(`
      *,
      design:card_designs!card_orders_design_id_fkey (*),
      profile:profiles!card_orders_profile_id_fkey (full_name, email)
    `)
    .eq("id", id)
    .single();
  return data as CardOrderWithDesign | null;
}

// ── Writes ───────────────────────────────────────────────────────────────────

export async function createOrder(order: {
  profile_id: string;
  design_id: string;
  quantity: number;
  shipping_address: Record<string, unknown>;
  payment_amount?: number;
  payment_currency?: string;
  momo_phone?: string;
}): Promise<CardOrder | null> {
  const supabase = await getSupabase();
  const { data } = await supabase
    .from("card_orders")
    .insert({
      profile_id:       order.profile_id,
      design_id:        order.design_id,
      quantity:         order.quantity,
      shipping_address: order.shipping_address,
      status:           "pending",
      payment_amount:   order.payment_amount ?? null,
      payment_currency: order.payment_currency ?? "USD",
      momo_phone:       order.momo_phone ?? null,
    })
    .select()
    .single();
  return data;
}

export async function updateOrderStatus(
  id: string,
  status: OrderStatus,
  trackingInfo?: string,
  adminNotes?: string
): Promise<CardOrder | null> {
  const supabase = await getSupabase();
  const updates: Record<string, unknown> = { status };
  if (trackingInfo !== undefined) updates.tracking_info = trackingInfo;
  if (adminNotes !== undefined) updates.admin_notes = adminNotes;

  const { data } = await supabase
    .from("card_orders")
    .update(updates)
    .eq("id", id)
    .select()
    .single();
  return data;
}

export async function updateOrderPayment(
  id: string,
  data: {
    payment_screenshot_url?: string;
    payment_status?: string;
  }
): Promise<CardOrder | null> {
  // Use service-role client to bypass RLS — regular users don't have UPDATE
  // policy on card_orders, but they should be able to attach payment proof.
  const supabase = getServiceSupabase();
  const updates: Record<string, unknown> = {};
  if (data.payment_screenshot_url !== undefined) updates.payment_screenshot_url = data.payment_screenshot_url;
  if (data.payment_status !== undefined) updates.payment_status = data.payment_status;

  const { data: updated } = await supabase
    .from("card_orders")
    .update(updates)
    .eq("id", id)
    .select()
    .single();
  return updated;
}

export async function deleteOrder(id: string): Promise<void> {
  const supabase = await getSupabase();
  await supabase.from("card_orders").delete().eq("id", id);
}
