// ─────────────────────────────────────────────────────────────────────────────
// Contact exchanges repository — SSOT for all contact_exchanges queries.
// ─────────────────────────────────────────────────────────────────────────────

import { getSupabase, getServiceSupabase } from "@/lib/supabase/server";
import type { ContactExchange, DeviceType } from "@/types";

// ── Reads ────────────────────────────────────────────────────────────────────

export async function getExchangesByCardId(
  cardId: string
): Promise<ContactExchange[]> {
  const supabase = await getSupabase();
  const { data } = await supabase
    .from("contact_exchanges")
    .select("*")
    .eq("card_id", cardId)
    .order("created_at", { ascending: false });
  return data ?? [];
}

export async function getExchangeById(
  id: string
): Promise<ContactExchange | null> {
  const supabase = await getSupabase();
  const { data } = await supabase
    .from("contact_exchanges")
    .select("*")
    .eq("id", id)
    .single();
  return data;
}

/**
 * All exchanges for cards owned by the given profile.
 * Used by the employee dashboard inbox.
 */
export async function getExchangesByProfileId(
  profileId: string
): Promise<ContactExchange[]> {
  const supabase = await getSupabase();

  // Get card IDs for this profile first
  const { data: cards } = await supabase
    .from("cards")
    .select("id")
    .eq("profile_id", profileId);

  if (!cards?.length) return [];

  const cardIds = cards.map((c) => c.id);
  const { data } = await supabase
    .from("contact_exchanges")
    .select("*")
    .in("card_id", cardIds)
    .order("created_at", { ascending: false });
  return data ?? [];
}

// ── Writes ───────────────────────────────────────────────────────────────────

export async function createExchange(exchange: {
  card_id: string;
  visitor_name: string;
  visitor_email?: string;
  visitor_phone?: string;
  visitor_organization?: string;
  message?: string;
  event_id?: string;
  device_type?: DeviceType;
  referrer?: string;
  country?: string;
}): Promise<ContactExchange | null> {
  // Use service role — public visitors aren't authenticated, RLS blocks anon inserts
  const supabase = getServiceSupabase();
  const { data } = await supabase
    .from("contact_exchanges")
    .insert({
      card_id:              exchange.card_id,
      visitor_name:         exchange.visitor_name,
      visitor_email:        exchange.visitor_email ?? null,
      visitor_phone:        exchange.visitor_phone ?? null,
      visitor_organization: exchange.visitor_organization ?? null,
      message:              exchange.message ?? null,
      event_id:             exchange.event_id ?? null,
      device_type:          exchange.device_type ?? "unknown",
      referrer:             exchange.referrer ?? null,
      country:              exchange.country ?? null,
    })
    .select()
    .single();
  return data;
}

export async function deleteExchange(id: string): Promise<void> {
  const supabase = await getSupabase();
  await supabase.from("contact_exchanges").delete().eq("id", id);
}
