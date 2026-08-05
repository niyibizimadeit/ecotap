"use server";

import { getSupabase, getServiceSupabase } from "@/lib/supabase/server";
import * as ordersService from "@/lib/services/orders.service";
import type { ActionResult, CardOrder, CardOrderWithDesign, CardDesign, OrderForm } from "@/types";

// ── Guard ────────────────────────────────────────────────────────────────────

async function getCurrentProfileId(): Promise<string | null> {
  const supabase = await getSupabase();
  const { data: { user } } = await supabase.auth.getUser();
  return user?.id ?? null;
}

// ── Place order ──────────────────────────────────────────────────────────────

export async function placeOrder(
  data: OrderForm
): Promise<ActionResult<CardOrder>> {
  const profileId = await getCurrentProfileId();
  if (!profileId) return { success: false, error: "Not authenticated." };
  return ordersService.placeOrder(profileId, data);
}

// ── My orders ────────────────────────────────────────────────────────────────

export async function getMyOrders(
  page = 1,
  pageSize = 10
): Promise<ActionResult<{ orders: CardOrderWithDesign[]; total: number; page: number; totalPages: number }>> {
  const profileId = await getCurrentProfileId();
  if (!profileId) return { success: false, error: "Not authenticated." };
  return ordersService.getUserOrders(profileId, page, pageSize);
}

// ── Active card designs (public) ─────────────────────────────────────────────

/**
 * Returns all active card designs. Used by the order flow to populate the
 * design gallery. No auth required — designs are public.
 */
export async function getActiveDesigns(): Promise<ActionResult<CardDesign[]>> {
  const supabase = getServiceSupabase();
  const { data, error } = await supabase
    .from("card_designs")
    .select("*")
    .eq("is_active", true)
    .order("name");

  if (error) return { success: false, error: error.message };
  return { success: true, data: data ?? [] };
}
