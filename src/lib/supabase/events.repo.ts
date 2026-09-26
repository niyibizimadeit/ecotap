// ─────────────────────────────────────────────────────────────────────────────
// Events repository — SSOT for all events table queries.
// ─────────────────────────────────────────────────────────────────────────────

import { getSupabase, getServiceSupabase } from "@/lib/supabase/server";
import type { EcoEvent, EcoEventWithHost, EventStatus, ExportScope } from "@/types";

// ── Reads ────────────────────────────────────────────────────────────────────

export async function getEventById(id: string): Promise<EcoEvent | null> {
  const supabase = await getSupabase();
  // Explicitly load the session — @supabase/ssr does not auto-initialize auth context.
  await supabase.auth.getSession();
  const { data } = await supabase
    .from("events")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  return data;
}

export async function getEventsByHost(hostProfileId: string): Promise<EcoEvent[]> {
  const supabase = await getSupabase();
  await supabase.auth.getSession();
  const { data } = await supabase
    .from("events")
    .select("*")
    .eq("host_profile_id", hostProfileId)
    .order("created_at", { ascending: false });
  return data ?? [];
}

// ── Service-role reads ───────────────────────────────────────────────────────
// These bypass RLS, so callers MUST verify ownership before acting on them.

export async function getEventByIdService(id: string): Promise<EcoEvent | null> {
  const supabase = getServiceSupabase();
  const { data } = await supabase
    .from("events")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  return data;
}

/** The single live event for a host, if any. The partial unique index guarantees at most one. */
export async function getLiveEventByHostService(
  hostProfileId: string
): Promise<EcoEvent | null> {
  const supabase = getServiceSupabase();
  const { data } = await supabase
    .from("events")
    .select("*")
    .eq("host_profile_id", hostProfileId)
    .eq("status", "live")
    .maybeSingle();
  return data;
}

export async function getEventWithHostService(
  id: string
): Promise<EcoEventWithHost | null> {
  const supabase = getServiceSupabase();
  const { data } = await supabase
    .from("events")
    .select("*, host:profiles!events_host_profile_id_fkey(id, username, full_name, email, avatar_url)")
    .eq("id", id)
    .maybeSingle();
  return data;
}

/**
 * Events for a bulk export scope, newest first, paged.
 * Only ended events are exportable — a live event has no finished attendance.
 */
export async function getEventsPageForScopeService(
  scope: ExportScope,
  opts: { limit: number; offset: number }
): Promise<EcoEvent[]> {
  if (scope.kind === "none") return [];
  const supabase = getServiceSupabase();

  // Hosts whose PRIMARY company is this one. Non-primary links don't count —
  // anyone can add any company to their card without approval.
  if (scope.kind === "company") {
    const { data: members } = await supabase
      .from("profile_companies")
      .select("profile_id")
      .eq("company_id", scope.companyId)
      .eq("is_primary", true);
    const hostIds = (members ?? []).map((m: { profile_id: string }) => m.profile_id);
    if (hostIds.length === 0) return [];

    const { data } = await supabase
      .from("events")
      .select("*")
      .in("status", ["closed", "cancelled"])
      .in("host_profile_id", hostIds)
      .order("created_at", { ascending: false })
      .range(opts.offset, opts.offset + opts.limit - 1);
    return data ?? [];
  }

  let query = supabase
    .from("events")
    .select("*")
    .in("status", ["closed", "cancelled"])
    .order("created_at", { ascending: false })
    .range(opts.offset, opts.offset + opts.limit - 1);

  if (scope.kind === "host") {
    query = query.eq("host_profile_id", scope.profileId);
  }
  // scope.kind === "all" applies no host filter.

  const { data } = await query;
  return data ?? [];
}

export async function getEventsByIdsService(ids: string[]): Promise<EcoEventWithHost[]> {
  if (ids.length === 0) return [];
  const supabase = getServiceSupabase();
  const { data } = await supabase
    .from("events")
    .select("*, host:profiles!events_host_profile_id_fkey(id, username, full_name, email, avatar_url)")
    .in("id", ids);
  return data ?? [];
}

// ── Writes ───────────────────────────────────────────────────────────────────

export async function createEvent(input: {
  host_profile_id: string;
  title: string;
  venue?: string | null;
  scheduled_start_at: string;
}): Promise<EcoEvent | null> {
  const supabase = await getSupabase();
  await supabase.auth.getSession();
  const { data } = await supabase
    .from("events")
    .insert({
      host_profile_id:    input.host_profile_id,
      title:              input.title,
      venue:              input.venue ?? null,
      scheduled_start_at: input.scheduled_start_at,
      status:             "scheduled",
    })
    .select()
    .single();
  return data;
}

/**
 * Flip a scheduled event to live. Guarded on the current status so a
 * double-click is a no-op rather than a second transition.
 * Throws 23505 if the host already has a live event — the partial unique
 * index is the backstop, not this query.
 */
export async function setEventLive(
  id: string
): Promise<{ event: EcoEvent | null; conflict: boolean }> {
  const supabase = getServiceSupabase();
  const { data, error } = await supabase
    .from("events")
    .update({ status: "live", starts_at: new Date().toISOString() })
    .eq("id", id)
    .eq("status", "scheduled")
    .select()
    .maybeSingle();

  // 23505 here means the partial unique index caught a second live event for
  // this host — the backstop for the "one event at a time" rule.
  return { event: data, conflict: error?.code === "23505" };
}

/**
 * End a live event. Guarded on `status = 'live'` so closing twice does not
 * re-stamp ends_at.
 */
export async function endEvent(input: {
  id: string;
  status: Extract<EventStatus, "closed" | "cancelled">;
  ends_at: string;
}): Promise<EcoEvent | null> {
  const supabase = getServiceSupabase();
  const { data } = await supabase
    .from("events")
    .update({ status: input.status, ends_at: input.ends_at })
    .eq("id", input.id)
    .eq("status", "live")
    .select()
    .maybeSingle();
  return data;
}

export async function updateEventDetails(input: {
  id: string;
  title?: string;
  venue?: string | null;
  scheduled_start_at?: string;
}): Promise<EcoEvent | null> {
  const supabase = await getSupabase();
  await supabase.auth.getSession();
  const patch: Record<string, unknown> = {};
  if (input.title !== undefined)              patch.title = input.title;
  if (input.venue !== undefined)              patch.venue = input.venue;
  if (input.scheduled_start_at !== undefined) patch.scheduled_start_at = input.scheduled_start_at;

  const { data } = await supabase
    .from("events")
    .update(patch)
    .eq("id", input.id)
    .select()
    .maybeSingle();
  return data;
}

// ── Counts (admin sidebar badge, overview stats) ──────────────────────────────

export async function countLiveEventsService(): Promise<number> {
  const supabase = getServiceSupabase();
  const { count } = await supabase
    .from("events")
    .select("id", { count: "exact", head: true })
    .eq("status", "live");
  return count ?? 0;
}

export async function countLiveEventsByHostService(
  hostProfileId: string
): Promise<number> {
  const supabase = getServiceSupabase();
  const { count } = await supabase
    .from("events")
    .select("id", { count: "exact", head: true })
    .eq("status", "live")
    .eq("host_profile_id", hostProfileId);
  return count ?? 0;
}

// ── Listings (all statuses) ──────────────────────────────────────────────────
// Distinct from getEventsPageForScopeService, which deliberately returns only
// ENDED events because it feeds exports. These power the dashboards, where a
// scheduled or live event must be visible.

const HOST_JOIN =
  "*, host:profiles!events_host_profile_id_fkey(id, username, full_name, email, avatar_url)";

export async function getEventsForCompanyService(
  companyId: string,
  limit = 200
): Promise<EcoEventWithHost[]> {
  const supabase = getServiceSupabase();

  // Hosts whose PRIMARY company is this one — see isPrimaryMemberOfCompany.
  const { data: members } = await supabase
    .from("profile_companies")
    .select("profile_id")
    .eq("company_id", companyId)
    .eq("is_primary", true);

  const hostIds = (members ?? []).map((m: { profile_id: string }) => m.profile_id);
  if (hostIds.length === 0) return [];

  const { data } = await supabase
    .from("events")
    .select(HOST_JOIN)
    .in("host_profile_id", hostIds)
    .order("created_at", { ascending: false })
    .limit(limit);
  return data ?? [];
}

export async function getAllEventsService(limit = 200): Promise<EcoEventWithHost[]> {
  const supabase = getServiceSupabase();
  const { data } = await supabase
    .from("events")
    .select(HOST_JOIN)
    .order("created_at", { ascending: false })
    .limit(limit);
  return data ?? [];
}
