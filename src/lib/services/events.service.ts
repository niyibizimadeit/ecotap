// ─────────────────────────────────────────────────────────────────────────────
// Events service — business logic for live event check-in.
// Calls repositories only — never queries Supabase directly.
// ─────────────────────────────────────────────────────────────────────────────

import * as eventsRepo  from "@/lib/supabase/events.repo";
import * as visitsRepo  from "@/lib/supabase/event_visits.repo";
import * as profilesRepo from "@/lib/supabase/profiles.repo";
import * as cardsRepo   from "@/lib/supabase/cards.repo";
import {
  AMBIGUOUS_EXIT_WINDOW_MS,
  MAX_EVENT_TITLE_LENGTH,
  MAX_EVENTS_PER_ZIP,
  MAX_VISITS_PER_ZIP,
  EVENT_EXPORT_TIMEZONE,
} from "@/constants";
import type {
  ActionResult, EcoEvent, EcoEventWithHost, EventCapabilities, EventStatus,
  EventVisit, CheckInMethod, CheckInFailure, ExportScope, ExportRow, TapOutcome,
  VisitAttendee,
} from "@/types";

// ── Scanned identifier parsing ───────────────────────────────────────────────

/**
 * Mirrors the profiles.username_format check constraint, so a syntactically
 * impossible username is rejected without a database round trip.
 */
const USERNAME_RE = /^[a-z0-9][a-z0-9\-]{1,48}[a-z0-9]$/;

/**
 * Turn whatever the camera or NFC reader produced into a candidate username.
 *
 * Card QR codes encode a bare absolute URL and nothing else, in one of two
 * shapes:
 *   https://ecotap.rw/{company-slug}/{username}   (employee)
 *   https://ecotap.rw/{username}                  (individual)
 *
 * The LAST path segment is the username in both cases — the public card route
 * ignores the company segment and resolves by the employee segment alone.
 *
 * Tolerates: trailing slashes, query strings, fragments, a scheme-less
 * "ecotap.rw/john-doe", a .vcf suffix, and a bare "john-doe".
 * Returns null when nothing username-shaped can be recovered.
 */
export function parseScannedIdentifier(raw: string): string | null {
  if (!raw) return null;
  const cleaned = raw.replace(/\s+/g, "");
  if (!cleaned) return null;

  let candidate = cleaned;

  if (cleaned.includes("/") || cleaned.includes(":")) {
    try {
      // The base makes scheme-less input parse as a relative path rather than
      // throwing, which also strips any query string and fragment for us.
      const url = new URL(cleaned, "https://ecotap.rw");
      const segments = url.pathname.split("/").filter(Boolean);
      candidate = segments[segments.length - 1] ?? "";
    } catch {
      return null;
    }
  }

  try {
    candidate = decodeURIComponent(candidate);
  } catch {
    // Malformed percent-encoding — fall through and let the regex reject it.
  }

  candidate = candidate.split(".")[0].toLowerCase().trim();
  return USERNAME_RE.test(candidate) ? candidate : null;
}

// ── Attendee resolution ──────────────────────────────────────────────────────

export type ResolvedAttendee =
  | { ok: true;  attendee: VisitAttendee }
  | { ok: false; reason: CheckInFailure };

/**
 * Resolve a scan to the person it belongs to, and snapshot the fields the
 * attendance sheet needs.
 *
 * The gate is "has a card and is active" — deliberately NOT card.is_public,
 * which governs whether the public card page renders. A private card is
 * still a card: "anyone with an EcoTap card can attend any event".
 */
export async function resolveAttendee(raw: string): Promise<ResolvedAttendee> {
  const username = parseScannedIdentifier(raw);
  if (!username) return { ok: false, reason: "UNPARSEABLE" };

  const profile = await profilesRepo.getProfileByUsernameService(username);
  if (!profile) return { ok: false, reason: "NOT_FOUND" };

  const card = await cardsRepo.getCardByProfileIdService(profile.id);
  if (!card) return { ok: false, reason: "NO_CARD" };

  if (profile.status === "suspended") return { ok: false, reason: "SUSPENDED" };
  if (profile.status !== "active")    return { ok: false, reason: "INACTIVE" };

  const primary = await profilesRepo.getPrimaryCompanyInfoService(profile.id);

  return {
    ok: true,
    attendee: {
      profileId:  profile.id,
      cardId:     card.id,
      fullName:   profile.full_name,
      phone:      card.phone ?? null,
      email:      profile.email,
      company:    primary.companyName,
      department: primary.department,
      jobTitle:   primary.jobTitle ?? card.job_title ?? null,
    },
  };
}

function attendeeFromVisit(v: EventVisit): VisitAttendee {
  return {
    profileId:  v.attendee_profile_id ?? "",
    cardId:     v.attendee_card_id ?? "",
    fullName:   v.full_name,
    phone:      v.phone,
    email:      v.email,
    company:    v.company_name,
    department: v.department,
    jobTitle:   v.job_title,
  };
}

function durationOf(v: EventVisit): number {
  if (!v.exit_at) return 0;
  return Math.max(0, Date.parse(v.exit_at) - Date.parse(v.entry_at));
}

// ── The door: recording a tap ────────────────────────────────────────────────

export interface TapResult {
  outcome:     TapOutcome;
  insideCount: number;
}

/**
 * Record one tap or scan at the door.
 *
 *   1st tap of a visit          → entry
 *   2nd tap, >= 5 min later     → exit, recorded automatically
 *   2nd tap, <  5 min later     → confirm_exit: NOTHING is written, the host
 *                                 is asked whether they are leaving or the
 *                                 card double-tapped
 *   tap after a recorded exit   → a brand new visit row
 *
 * hostProfileId must be server-derived by the caller. A client can never
 * name the host.
 */
export async function recordTap(input: {
  eventId:       string;
  hostProfileId: string;
  raw:           string;
  method:        CheckInMethod;
}): Promise<ActionResult<TapResult>> {
  const event = await eventsRepo.getEventByIdService(input.eventId);
  if (!event) return { success: false, error: "Event not found." };
  if (event.host_profile_id !== input.hostProfileId) return { success: false, error: "FORBIDDEN" };
  if (event.status !== "live") return { success: false, error: "EVENT_NOT_LIVE" };

  const resolved = await resolveAttendee(input.raw);
  if (!resolved.ok) return { success: false, error: resolved.reason };
  const attendee = resolved.attendee;

  const now = Date.now();
  const open = await visitsRepo.getOpenVisitService(event.id, attendee.profileId);

  // ── No open visit → this is an entry ──────────────────────────────────────
  if (!open) {
    const { visit, conflict } = await visitsRepo.insertVisitService({
      event_id:            event.id,
      attendee_profile_id: attendee.profileId,
      attendee_card_id:    attendee.cardId,
      full_name:           attendee.fullName,
      phone:               attendee.phone,
      email:               attendee.email,
      company_name:        attendee.company,
      department:          attendee.department,
      job_title:           attendee.jobTitle,
      check_in_method:     input.method,
    });

    if (conflict) {
      // Lost a race with a concurrent tap for the same person. Degrading to
      // the confirm prompt is exactly the right behaviour for a double-tap.
      const existing = await visitsRepo.getOpenVisitService(event.id, attendee.profileId);
      if (!existing) return { success: false, error: "Could not record this tap. Please try again." };
      return {
        success: true,
        data: {
          outcome: { kind: "confirm_exit", visit: existing, attendee, sinceEntryMs: now - Date.parse(existing.entry_at) },
          insideCount: await visitsRepo.countOpenVisitsService(event.id),
        },
      };
    }

    if (!visit) return { success: false, error: "Could not record this tap. Please try again." };

    return {
      success: true,
      data: {
        outcome: { kind: "entry", visit, attendee },
        insideCount: await visitsRepo.countOpenVisitsService(event.id),
      },
    };
  }

  const sinceEntryMs = now - Date.parse(open.entry_at);

  // ── Open visit, past the ambiguity window → record the exit ───────────────
  if (sinceEntryMs >= AMBIGUOUS_EXIT_WINDOW_MS) {
    const closed = await visitsRepo.closeVisitService(open.id, "manual");
    if (!closed) {
      // A concurrent request already closed it — report the settled state
      // rather than erroring.
      const fresh = await visitsRepo.getVisitByIdService(open.id);
      if (fresh?.exit_at) {
        return {
          success: true,
          data: {
            outcome: { kind: "exit", visit: fresh, attendee, durationMs: durationOf(fresh) },
            insideCount: await visitsRepo.countOpenVisitsService(event.id),
          },
        };
      }
      return { success: false, error: "Could not record this exit. Please try again." };
    }

    return {
      success: true,
      data: {
        outcome: { kind: "exit", visit: closed, attendee, durationMs: durationOf(closed) },
        insideCount: await visitsRepo.countOpenVisitsService(event.id),
      },
    };
  }

  // ── Open visit, inside the window → ask. Write nothing. ───────────────────
  return {
    success: true,
    data: {
      outcome: { kind: "confirm_exit", visit: open, attendee, sinceEntryMs },
      insideCount: await visitsRepo.countOpenVisitsService(event.id),
    },
  };
}

/**
 * Resolve a pending "leaving or accidental?" prompt.
 * Idempotent — confirming twice returns the settled state instead of erroring.
 */
export async function resolveVisitExit(input: {
  visitId:       string;
  hostProfileId: string;
  decision:      "confirm" | "ignore";
}): Promise<ActionResult<TapResult>> {
  const visit = await visitsRepo.getVisitByIdService(input.visitId);
  if (!visit) return { success: false, error: "Visit not found." };

  const event = await eventsRepo.getEventByIdService(visit.event_id);
  if (!event) return { success: false, error: "Event not found." };
  if (event.host_profile_id !== input.hostProfileId) return { success: false, error: "FORBIDDEN" };

  const attendee = attendeeFromVisit(visit);

  // Already settled — a double-confirm is a no-op.
  if (visit.exit_at) {
    return {
      success: true,
      data: {
        outcome: { kind: "exit", visit, attendee, durationMs: durationOf(visit) },
        insideCount: await visitsRepo.countOpenVisitsService(event.id),
      },
    };
  }

  if (input.decision === "ignore") {
    return {
      success: true,
      data: {
        outcome: { kind: "already_inside", visit, attendee, sinceEntryMs: Date.now() - Date.parse(visit.entry_at) },
        insideCount: await visitsRepo.countOpenVisitsService(event.id),
      },
    };
  }

  const closed = await visitsRepo.closeVisitService(visit.id, "manual");
  const settled = closed ?? (await visitsRepo.getVisitByIdService(visit.id)) ?? visit;

  return {
    success: true,
    data: {
      outcome: { kind: "exit", visit: settled, attendee, durationMs: durationOf(settled) },
      insideCount: await visitsRepo.countOpenVisitsService(event.id),
    },
  };
}

// ── Lifecycle ────────────────────────────────────────────────────────────────

export async function createEvent(input: {
  hostProfileId:    string;
  title:            string;
  venue?:           string | null;
  scheduledStartAt: string;
}): Promise<ActionResult<EcoEvent>> {
  const title = input.title.trim();
  if (!title) return { success: false, error: "Give the event a title." };
  if (title.length > MAX_EVENT_TITLE_LENGTH) {
    return { success: false, error: `Title must be ${MAX_EVENT_TITLE_LENGTH} characters or fewer.` };
  }

  const parsed = Date.parse(input.scheduledStartAt);
  if (Number.isNaN(parsed)) return { success: false, error: "That start time isn't valid." };

  const event = await eventsRepo.createEvent({
    host_profile_id:    input.hostProfileId,
    title,
    venue:              input.venue?.trim() || null,
    scheduled_start_at: new Date(parsed).toISOString(),
  });

  if (!event) return { success: false, error: "Failed to create the event." };
  return { success: true, data: event };
}

/**
 * Take an event live. A host runs one event at a time, so when they start a
 * second the first is closed — everyone still inside it is given an exit
 * time equal to the close.
 */
export async function goLive(input: {
  hostProfileId:      string;
  eventId:            string;
  closeLiveEventId?:  string | null;
}): Promise<ActionResult<EcoEvent>> {
  const target = await eventsRepo.getEventByIdService(input.eventId);
  if (!target) return { success: false, error: "Event not found." };
  if (target.host_profile_id !== input.hostProfileId) return { success: false, error: "FORBIDDEN" };
  if (target.status === "live") return { success: true, data: target };
  if (target.status !== "scheduled") {
    return { success: false, error: "Only a scheduled event can go live." };
  }

  // Close the host's other live event first, if they asked us to.
  if (input.closeLiveEventId) {
    const closed = await closeEvent({
      hostProfileId: input.hostProfileId,
      eventId:       input.closeLiveEventId,
      mode:          "close",
    });
    if (!closed.success) return { success: false, error: closed.error ?? "Couldn't close your other event." };
  } else {
    const existing = await eventsRepo.getLiveEventByHostService(input.hostProfileId);
    if (existing) {
      return { success: false, error: "LIVE_EVENT_EXISTS" };
    }
  }

  const { event, conflict } = await eventsRepo.setEventLive(input.eventId);
  if (conflict) return { success: false, error: "LIVE_EVENT_EXISTS" };
  if (!event)   return { success: false, error: "Couldn't start this event. Please try again." };
  return { success: true, data: event };
}

/**
 * End a live event.
 *
 *   "close"    — normal ending. Everyone still inside gets an exit time equal
 *                to the close, and the attendance sheet becomes available.
 *   "cancel"   — keeps the partial record of whoever checked in first rather
 *                than discarding it; the event stays in the host's list.
 */
export async function closeEvent(input: {
  hostProfileId: string;
  eventId:       string;
  mode:          "close" | "cancel";
}): Promise<ActionResult<EcoEvent>> {
  const event = await eventsRepo.getEventByIdService(input.eventId);
  if (!event) return { success: false, error: "Event not found." };
  if (event.host_profile_id !== input.hostProfileId) return { success: false, error: "FORBIDDEN" };

  if (event.status === "closed" || event.status === "cancelled") {
    return { success: true, data: event };
  }
  if (event.status !== "live") {
    return { success: false, error: "Only a live event can be ended." };
  }

  const endedAt = new Date().toISOString();
  const status: EventStatus = input.mode === "close" ? "closed" : "cancelled";

  // Stamp everyone still inside with the event's end time, so nobody is left
  // with a permanently blank exit.
  await visitsRepo.closeAllOpenVisitsService(
    event.id,
    endedAt,
    input.mode === "close" ? "auto_close" : "auto_cancel"
  );

  // Guarded on status = 'live' inside the repo, so a double-close is a no-op.
  const ended = await eventsRepo.endEvent({ id: event.id, status, ends_at: endedAt });
  if (!ended) {
    const current = await eventsRepo.getEventByIdService(event.id);
    return current ? { success: true, data: current } : { success: false, error: "Couldn't end this event." };
  }
  return { success: true, data: ended };
}

// ── Reads ────────────────────────────────────────────────────────────────────

export interface EventSummary extends EcoEvent {
  visitCount:  number;
  insideCount: number;
}

export async function getMyEvents(hostProfileId: string): Promise<EventSummary[]> {
  const events = await eventsRepo.getEventsByHost(hostProfileId);
  return Promise.all(
    events.map(async (e) => ({
      ...e,
      visitCount:  await visitsRepo.countVisitsByEventService(e.id),
      insideCount: e.status === "live" ? await visitsRepo.countOpenVisitsService(e.id) : 0,
    }))
  );
}

export async function getEventVisits(eventId: string): Promise<EventVisit[]> {
  return visitsRepo.getVisitsByEvent(eventId);
}

/**
 * "Who is inside right now" for one event.
 *
 * Reads with the service role, so ownership is verified here rather than
 * trusted — without this any authenticated user could enumerate the door
 * roster (names, emails, phones) of any event on the platform by passing an
 * event id.
 */
export async function getOpenVisitsForHost(
  eventId: string,
  hostProfileId: string
): Promise<EventVisit[]> {
  const event = await eventsRepo.getEventByIdService(eventId);
  if (!event || event.host_profile_id !== hostProfileId) return [];
  return visitsRepo.getOpenVisitsService(eventId);
}

/** Host-scoped visit history for a single event. */
export async function getEventVisitsForHost(
  eventId: string,
  hostProfileId: string
): Promise<EventVisit[]> {
  const event = await eventsRepo.getEventByIdService(eventId);
  if (!event || event.host_profile_id !== hostProfileId) return [];
  return visitsRepo.getVisitsByEvent(eventId);
}

async function decorate(events: EcoEventWithHost[]): Promise<EcoEventWithHost[]> {
  return Promise.all(
    events.map(async (e) => ({
      ...e,
      visit_count:  await visitsRepo.countVisitsByEventService(e.id),
      inside_count: e.status === "live" ? await visitsRepo.countOpenVisitsService(e.id) : 0,
    }))
  );
}

/** Every event on the platform, all statuses. Admin dashboard only. */
export async function getAdminEventSummaries(): Promise<EcoEventWithHost[]> {
  return decorate(await eventsRepo.getAllEventsService());
}

/** Events hosted by a company's primary members, all statuses. */
export async function getCompanyEventSummaries(companyId: string): Promise<EcoEventWithHost[]> {
  return decorate(await eventsRepo.getEventsForCompanyService(companyId));
}

/** One event plus its host, for the company/admin detail pages. */
export async function getEventWithHost(eventId: string): Promise<EcoEventWithHost | null> {
  return eventsRepo.getEventWithHostService(eventId);
}

export async function countLiveEvents(): Promise<number> {
  return eventsRepo.countLiveEventsService();
}

// ── Export access ────────────────────────────────────────────────────────────

export type ExportDenial =
  | "FORBIDDEN"
  | "EVENT_NOT_FOUND"
  | "EVENT_NOT_ENDED"
  | "TOO_LARGE";

/**
 * The single gate every export route goes through.
 *
 * Reads the event with the service role (which bypasses RLS), so ownership is
 * re-verified here on every call rather than trusted from RLS. This is the
 * shape of the B5 fix: a service-role read is never a substitute for a check.
 */
export async function assertCanExportEvent(
  eventId: string,
  caps: EventCapabilities
): Promise<{ event: EcoEvent } | { error: ExportDenial }> {
  if (!caps.authenticated || caps.isCountryRep) return { error: "FORBIDDEN" };

  const event = await eventsRepo.getEventByIdService(eventId);
  if (!event) return { error: "EVENT_NOT_FOUND" };

  if (event.status !== "closed" && event.status !== "cancelled") {
    return { error: "EVENT_NOT_ENDED" };
  }

  const isHost = !!caps.hostProfileId && event.host_profile_id === caps.hostProfileId;
  const isCompanyAdmin = caps.companyId
    ? await profilesRepo.isPrimaryMemberOfCompany(event.host_profile_id, caps.companyId)
    : false;

  if (!isHost && !isCompanyAdmin && !caps.isPlatformAdmin) return { error: "FORBIDDEN" };

  return { event };
}

/**
 * May this company view this event? True when the host is a PRIMARY member of
 * the company — the same rule the RLS policy and the export gate apply.
 *
 * Exposed as a service call so pages don't reach into the repository layer.
 */
export async function canCompanyViewEvent(
  eventId: string,
  companyId: string
): Promise<EcoEventWithHost | null> {
  const event = await eventsRepo.getEventWithHostService(eventId);
  if (!event) return null;
  const member = await profilesRepo.isPrimaryMemberOfCompany(event.host_profile_id, companyId);
  return member ? event : null;
}

/** Which set of events a bulk export covers, given the caller's capabilities. */
export function scopeFromCapabilities(caps: EventCapabilities): ExportScope {
  if (!caps.authenticated || caps.isCountryRep) return { kind: "none" };
  if (caps.isPlatformAdmin) return { kind: "all" };
  if (caps.companyId)       return { kind: "company", companyId: caps.companyId };
  if (caps.hostProfileId)   return { kind: "host", profileId: caps.hostProfileId };
  return { kind: "none" };
}

// ── Export rows ──────────────────────────────────────────────────────────────

/**
 * Format an instant for the spreadsheet.
 *
 * Written as a STRING in Africa/Kigali, never as a Date object: a Date bakes
 * the server's zone into the serial, and Vercel runs UTC — the sheet would
 * show hosts times two hours behind what they saw at the door. ISO-ordered
 * strings also sort correctly in Excel.
 */
export function formatExportTime(iso: string | null): string {
  if (!iso) return "";
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: EVENT_EXPORT_TIMEZONE,
    year: "numeric", month: "2-digit", day: "2-digit",
    hour: "2-digit", minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(new Date(iso));
  const get = (t: string) => parts.find((p) => p.type === t)?.value ?? "";
  return `${get("year")}-${get("month")}-${get("day")} ${get("hour")}:${get("minute")}`;
}

export function visitToExportRow(v: EventVisit): ExportRow {
  return {
    full_name:  v.full_name,
    phone:      v.phone ?? "",
    email:      v.email ?? "",
    company:    v.company_name ?? "",
    department: v.department ?? "",
    job_title:  v.job_title ?? "",
    entry_at:   formatExportTime(v.entry_at),
    exit_at:    formatExportTime(v.exit_at),
  };
}

export const EXPORT_PAGE_SIZE = 1000;

/** One event's visits, paged so a large event never loads all at once. */
export async function getExportRowsPage(
  eventId: string,
  offset: number
): Promise<{ rows: ExportRow[]; done: boolean }> {
  const visits = await visitsRepo.getVisitsPageService(eventId, {
    limit: EXPORT_PAGE_SIZE,
    offset,
  });
  return {
    rows: visits.map(visitToExportRow),
    done: visits.length < EXPORT_PAGE_SIZE,
  };
}

/** Every row for one event, paged so a large event never loads all at once. */
export async function collectExportRows(eventId: string): Promise<ExportRow[]> {
  const all: ExportRow[] = [];
  let offset = 0;
  for (;;) {
    const { rows, done } = await getExportRowsPage(eventId, offset);
    all.push(...rows);
    if (done) break;
    offset += EXPORT_PAGE_SIZE;
  }
  return all;
}

export interface BulkExportPlan {
  events:    EcoEvent[];
  visitCount: number;
}

/**
 * Resolve the events a bulk export should contain, and refuse politely when
 * the result is too large to build in memory rather than timing out opaquely.
 */
export async function planBulkExport(
  scope: ExportScope
): Promise<{ plan: BulkExportPlan } | { error: ExportDenial | "EMPTY" }> {
  if (scope.kind === "none") return { error: "FORBIDDEN" };

  const events = await eventsRepo.getEventsPageForScopeService(scope, {
    limit: MAX_EVENTS_PER_ZIP + 1,
    offset: 0,
  });

  if (events.length === 0) return { error: "EMPTY" };
  if (events.length > MAX_EVENTS_PER_ZIP) return { error: "TOO_LARGE" };

  const visitCount = await visitsRepo.countVisitsByEventsService(events.map((e) => e.id));
  if (visitCount > MAX_VISITS_PER_ZIP) return { error: "TOO_LARGE" };

  return { plan: { events, visitCount } };
}
