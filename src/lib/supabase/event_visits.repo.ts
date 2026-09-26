// ─────────────────────────────────────────────────────────────────────────────
// Event visits repository — SSOT for all event_visits table queries.
// One row per VISIT, not per person.
// ─────────────────────────────────────────────────────────────────────────────

import { getSupabase, getServiceSupabase } from "@/lib/supabase/server";
import type { EventVisit, CheckInMethod, VisitExitSource } from "@/types";

// ── Reads ────────────────────────────────────────────────────────────────────

/** The attendee's currently-open visit, if they are still inside. */
export async function getOpenVisitService(
  eventId: string,
  attendeeProfileId: string
): Promise<EventVisit | null> {
  const supabase = getServiceSupabase();
  const { data } = await supabase
    .from("event_visits")
    .select("*")
    .eq("event_id", eventId)
    .eq("attendee_profile_id", attendeeProfileId)
    .is("exit_at", null)
    .maybeSingle();
  return data;
}

export async function getVisitByIdService(id: string): Promise<EventVisit | null> {
  const supabase = getServiceSupabase();
  const { data } = await supabase
    .from("event_visits")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  return data;
}

export async function getVisitById(id: string): Promise<EventVisit | null> {
  const supabase = await getSupabase();
  await supabase.auth.getSession();
  const { data } = await supabase
    .from("event_visits")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  return data;
}

/** Everyone still inside — powers the "Inside now" roster on the door screen. */
export async function getOpenVisitsService(eventId: string): Promise<EventVisit[]> {
  const supabase = getServiceSupabase();
  const { data } = await supabase
    .from("event_visits")
    .select("*")
    .eq("event_id", eventId)
    .is("exit_at", null)
    .order("entry_at", { ascending: false });
  return data ?? [];
}

export async function getVisitsByEvent(eventId: string): Promise<EventVisit[]> {
  const supabase = await getSupabase();
  await supabase.auth.getSession();
  const { data } = await supabase
    .from("event_visits")
    .select("*")
    .eq("event_id", eventId)
    .order("entry_at", { ascending: true });
  return data ?? [];
}

/** Paged read for exports — one event's visits, entry order. */
export async function getVisitsPageService(
  eventId: string,
  opts: { limit: number; offset: number }
): Promise<EventVisit[]> {
  const supabase = getServiceSupabase();
  const { data } = await supabase
    .from("event_visits")
    .select("*")
    .eq("event_id", eventId)
    .order("entry_at", { ascending: true })
    .range(opts.offset, opts.offset + opts.limit - 1);
  return data ?? [];
}

export async function countVisitsByEventService(eventId: string): Promise<number> {
  const supabase = getServiceSupabase();
  const { count } = await supabase
    .from("event_visits")
    .select("id", { count: "exact", head: true })
    .eq("event_id", eventId);
  return count ?? 0;
}

export async function countOpenVisitsService(eventId: string): Promise<number> {
  const supabase = getServiceSupabase();
  const { count } = await supabase
    .from("event_visits")
    .select("id", { count: "exact", head: true })
    .eq("event_id", eventId)
    .is("exit_at", null);
  return count ?? 0;
}

export async function countVisitsByEventsService(eventIds: string[]): Promise<number> {
  if (eventIds.length === 0) return 0;
  const supabase = getServiceSupabase();
  const { count } = await supabase
    .from("event_visits")
    .select("id", { count: "exact", head: true })
    .in("event_id", eventIds);
  return count ?? 0;
}

// ── Writes ───────────────────────────────────────────────────────────────────

export interface InsertVisitInput {
  event_id:            string;
  attendee_profile_id: string;
  attendee_card_id:    string;
  full_name:           string;
  phone:               string | null;
  email:               string | null;
  company_name:        string | null;
  department:          string | null;
  job_title:           string | null;
  check_in_method:     CheckInMethod;
}

/**
 * Open a new visit.
 *
 * `conflict` is true when the partial unique index
 * (event_visits_one_open_per_attendee) rejected the insert with 23505 —
 * i.e. a concurrent request already opened a visit for this attendee.
 * The caller degrades to the confirm-exit prompt rather than erroring.
 */
export async function insertVisitService(
  input: InsertVisitInput
): Promise<{ visit: EventVisit | null; conflict: boolean }> {
  const supabase = getServiceSupabase();
  const { data, error } = await supabase
    .from("event_visits")
    .insert({
      event_id:            input.event_id,
      attendee_profile_id: input.attendee_profile_id,
      attendee_card_id:    input.attendee_card_id,
      full_name:           input.full_name,
      phone:               input.phone,
      email:               input.email,
      company_name:        input.company_name,
      department:          input.department,
      job_title:           input.job_title,
      check_in_method:     input.check_in_method,
      entry_at:            new Date().toISOString(),
    })
    .select()
    .single();

  if (error) {
    return { visit: null, conflict: error.code === "23505" };
  }
  return { visit: data, conflict: false };
}

/**
 * Record an exit. Guarded on `exit_at is null` so it is idempotent —
 * a double-confirm returns null rather than rewriting the exit time.
 */
export async function closeVisitService(
  visitId: string,
  source: VisitExitSource,
  exitAt?: string
): Promise<EventVisit | null> {
  const supabase = getServiceSupabase();
  const { data } = await supabase
    .from("event_visits")
    .update({ exit_at: exitAt ?? new Date().toISOString(), exit_source: source })
    .eq("id", visitId)
    .is("exit_at", null)
    .select()
    .maybeSingle();
  return data;
}

/**
 * Stamp every still-open visit with the event's end time.
 * Everyone inside when the event ends gets an exit equal to the close time,
 * so nobody is left with a permanently blank exit.
 */
export async function closeAllOpenVisitsService(
  eventId: string,
  endedAt: string,
  source: Extract<VisitExitSource, "auto_close" | "auto_cancel">
): Promise<number> {
  const supabase = getServiceSupabase();
  const { data } = await supabase
    .from("event_visits")
    .update({ exit_at: endedAt, exit_source: source })
    .eq("event_id", eventId)
    .is("exit_at", null)
    .select("id");
  return data?.length ?? 0;
}
