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

export async function updateExchange(
  id: string,
  updates: {
    is_favorite?: boolean;
    lead_level?: string;
    owner_notes?: string | null;
    lead_group?: string | null;
  }
): Promise<ContactExchange | null> {
  const supabase = await getSupabase();
  const { data } = await supabase
    .from("contact_exchanges")
    .update(updates)
    .eq("id", id)
    .select()
    .single();
  return data;
}

// ── Admin queries (service role — platform-wide, no auth filter) ───────────────

export interface AdminExchangeOptions {
  search?: string;
  limit?: number;
  offset?: number;
  sortDir?: "asc" | "desc";
}

/** All contact exchanges across the platform, enriched with card owner info */
export async function getAllExchangesAdmin(
  options: AdminExchangeOptions = {}
) {
  const supabase = getServiceSupabase();
  const { search, limit = 25, offset = 0, sortDir = "desc" } = options;

  // Build the main query
  let query = supabase
    .from("contact_exchanges")
    .select("*")
    .order("created_at", { ascending: sortDir === "asc" })
    .range(offset, offset + limit - 1);

  if (search) {
    const q = `%${search}%`;
    query = query.or(`visitor_name.ilike.${q},visitor_email.ilike.${q}`);
  }

  const { data: exchanges } = await query;

  if (!exchanges?.length) return [];

  // Enrich with card owner info — fetch all unique card_ids then batch-lookup
  const cardIds = [...new Set(exchanges.map((e: Record<string, unknown>) => e.card_id))];
  const { data: cards } = await supabase
    .from("cards")
    .select("id, profile_id")
    .in("id", cardIds as string[]);

  const profileIds = [...new Set((cards ?? []).map((c: Record<string, unknown>) => c.profile_id))];
  const { data: profiles } = await supabase
    .from("profiles")
    .select("id, full_name, email, username")
    .in("id", profileIds as string[]);

  const cardToProfile = new Map<string, Record<string, unknown> | null>();
  const profileMap = new Map<string, Record<string, unknown>>();
  (profiles ?? []).forEach((p: Record<string, unknown>) => profileMap.set(p.id as string, p));
  (cards ?? []).forEach((c: Record<string, unknown>) => {
    cardToProfile.set(c.id as string, profileMap.get(c.profile_id as string) ?? null);
  });

  return exchanges.map((e: Record<string, unknown>) => {
    const owner = cardToProfile.get(e.card_id as string) ?? null;
    return {
      ...e,
      card_owner: owner
        ? {
            profile_id: owner.id,
            full_name: owner.full_name,
            email: owner.email,
            username: owner.username,
          }
        : null,
    };
  });
}

/** Count of contact exchanges matching optional search filter */
export async function getExchangesCount(options: { search?: string } = {}): Promise<number> {
  const supabase = getServiceSupabase();
  const { search } = options;

  let query = supabase.from("contact_exchanges").select("*", { count: "exact", head: true });

  if (search) {
    const q = `%${search}%`;
    query = query.or(`visitor_name.ilike.${q},visitor_email.ilike.${q}`);
  }

  const { count } = await query;
  return count ?? 0;
}
