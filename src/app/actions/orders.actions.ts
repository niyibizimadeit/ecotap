"use server";

import { getSupabase } from "@/lib/supabase/server";
import * as ordersService from "@/lib/services/orders.service";
import type { ActionResult, CardOrder, OrderForm } from "@/types";

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

export async function getMyOrders(): Promise<ActionResult<CardOrder[]>> {
  const profileId = await getCurrentProfileId();
  if (!profileId) return { success: false, error: "Not authenticated." };
  return ordersService.getUserOrders(profileId);
}
