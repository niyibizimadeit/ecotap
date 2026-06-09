// ─────────────────────────────────────────────────────────────────────────────
// Card orders repository — SSOT for all card_orders table queries.
// ─────────────────────────────────────────────────────────────────────────────

import { getSupabase } from "@/lib/supabase/server";
import type { CardOrder, CardOrderWithDesign, OrderStatus } from "@/types";

// ── Reads ────────────────────────────────────────────────────────────────────

export async function getOrdersByProfileId(
  profileId: string
): Promise<CardOrder[]> {
  const supabase = await getSupabase();
  const { data } = await supabase
    .from("card_orders")
    .select("*")
    .eq("profile_id", profileId)
    .order("created_at", { ascending: false });
  return data ?? [];
}

export async function getAllOrders(filters?: {
  status?: OrderStatus;
}): Promise<CardOrderWithDesign[]> {
  const supabase = await getSupabase();
  let query = supabase.from("card_orders").select(`
    *,
    design:card_designs!card_orders_design_id_fkey (*)
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
      design:card_designs!card_orders_design_id_fkey (*)
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

export async function deleteOrder(id: string): Promise<void> {
  const supabase = await getSupabase();
  await supabase.from("card_orders").delete().eq("id", id);
}
