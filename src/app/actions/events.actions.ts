"use server";

// ─────────────────────────────────────────────────────────────────────────────
// Events server actions.
//
// Thin by design: resolve capabilities → validate → call the service → map the
// result to ActionResult. No business logic lives here.
//
// The host identity is ALWAYS taken from the caller's own session via
// getEventCapabilities(). No action accepts a host or company id as an
// argument, so there is no path where a client can act as someone else.
// ─────────────────────────────────────────────────────────────────────────────

import { revalidatePath } from "next/cache";
import { getEventCapabilities } from "@/lib/supabase/event-access";
import * as eventsService from "@/lib/services/events.service";
import {
  createEventSchema, checkInSchema, resolveExitSchema, endEventSchema, goLiveSchema,
} from "@/lib/validations/events";
import type {
  ActionResult, EcoEvent, EcoEventWithHost, EventVisit, TapOutcome,
} from "@/types";

const NOT_AUTHENTICATED = "Not authenticated.";

/** Actions can only be performed by someone who can actually host. */
async function requireHost() {
  const caps = await getEventCapabilities();
  if (!caps.authenticated || !caps.hostProfileId) return null;
  return caps;
}

function revalidateEvents() {
  revalidatePath("/dashboard/employee/events");
  revalidatePath("/dashboard/company/events");
  revalidatePath("/dashboard/admin/events");
}

// ── Hosting ──────────────────────────────────────────────────────────────────

export async function createEventAction(
  input: unknown
): Promise<ActionResult<EcoEvent>> {
  const caps = await requireHost();
  if (!caps) return { success: false, error: NOT_AUTHENTICATED };

  const parsed = createEventSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? "Check the form and try again." };
  }

  const result = await eventsService.createEvent({
    hostProfileId:    caps.hostProfileId!,
    title:            parsed.data.title,
    venue:            parsed.data.venue ?? null,
    scheduledStartAt: parsed.data.scheduled_start_at,
  });

  if (result.success) revalidateEvents();
  return result;
}

export async function goLiveAction(input: unknown): Promise<ActionResult<EcoEvent>> {
  const caps = await requireHost();
  if (!caps) return { success: false, error: NOT_AUTHENTICATED };

  const parsed = goLiveSchema.safeParse(input);
  if (!parsed.success) return { success: false, error: "Unknown event." };

  const result = await eventsService.goLive({
    hostProfileId:     caps.hostProfileId!,
    eventId:           parsed.data.eventId,
    closeLiveEventId:  parsed.data.closeLiveEventId ?? null,
  });

  // "LIVE_EVENT_EXISTS" is a code, not a sentence — the UI turns it into a
  // confirmation naming the event that would be closed.
  if (result.success) revalidateEvents();
  return result;
}

export async function closeEventAction(input: unknown): Promise<ActionResult<EcoEvent>> {
  const caps = await requireHost();
  if (!caps) return { success: false, error: NOT_AUTHENTICATED };

  const parsed = endEventSchema.safeParse(input);
  if (!parsed.success) return { success: false, error: "Unknown event." };

  const result = await eventsService.closeEvent({
    hostProfileId: caps.hostProfileId!,
    eventId:       parsed.data.eventId,
    mode:          parsed.data.mode,
  });

  if (result.success) revalidateEvents();
  return result;
}

// ── The door ─────────────────────────────────────────────────────────────────

export interface TapActionResult {
  outcome:     TapOutcome;
  insideCount: number;
}

export async function checkInTapAction(
  eventId: string,
  input:   unknown
): Promise<ActionResult<TapActionResult>> {
  const caps = await requireHost();
  if (!caps) return { success: false, error: NOT_AUTHENTICATED };

  const parsed = checkInSchema.safeParse(input);
  if (!parsed.success) return { success: false, error: "Nothing was scanned." };

  // Deliberately no revalidatePath here: the door is high-churn and
  // invalidating the route cache on every tap would add latency at the door.
  // The client holds the returned state.
  return eventsService.recordTap({
    eventId,
    hostProfileId: caps.hostProfileId!,
    raw:           parsed.data.raw,
    method:        parsed.data.method,
  });
}

export async function resolveVisitExitAction(
  input: unknown
): Promise<ActionResult<TapActionResult>> {
  const caps = await requireHost();
  if (!caps) return { success: false, error: NOT_AUTHENTICATED };

  const parsed = resolveExitSchema.safeParse(input);
  if (!parsed.success) return { success: false, error: "Unknown visit." };

  return eventsService.resolveVisitExit({
    visitId:       parsed.data.visitId,
    hostProfileId: caps.hostProfileId!,
    decision:      parsed.data.decision,
  });
}

/** Manual exit for someone who leaves without their card. */
export async function recordManualExitAction(
  visitId: string
): Promise<ActionResult<TapActionResult>> {
  const caps = await requireHost();
  if (!caps) return { success: false, error: NOT_AUTHENTICATED };

  return eventsService.resolveVisitExit({
    visitId,
    hostProfileId: caps.hostProfileId!,
    decision:      "confirm",
  });
}

// ── Reads ────────────────────────────────────────────────────────────────────

export async function getMyEventsAction(): Promise<ActionResult<eventsService.EventSummary[]>> {
  const caps = await requireHost();
  if (!caps) return { success: false, error: NOT_AUTHENTICATED };
  return { success: true, data: await eventsService.getMyEvents(caps.hostProfileId!) };
}

export async function getEventVisitsAction(eventId: string): Promise<ActionResult<EventVisit[]>> {
  const caps = await requireHost();
  if (!caps) return { success: false, error: NOT_AUTHENTICATED };
  // Host-scoped: reading with the service role means ownership must be
  // verified here, not assumed from the fact that the caller hosts *something*.
  return { success: true, data: await eventsService.getEventVisitsForHost(eventId, caps.hostProfileId!) };
}

export async function getOpenVisitsAction(eventId: string): Promise<ActionResult<EventVisit[]>> {
  const caps = await requireHost();
  if (!caps) return { success: false, error: NOT_AUTHENTICATED };
  return { success: true, data: await eventsService.getOpenVisitsForHost(eventId, caps.hostProfileId!) };
}

export async function getAdminEventsAction(): Promise<ActionResult<EcoEventWithHost[]>> {
  const caps = await getEventCapabilities();
  if (!caps.authenticated) return { success: false, error: NOT_AUTHENTICATED };
  // Platform-wide event data is admin-only; this is not merely "signed in".
  if (!caps.isPlatformAdmin && !caps.isCountryRep) {
    return { success: false, error: "FORBIDDEN" };
  }
  return { success: true, data: await eventsService.getAdminEventSummaries() };
}

/** Live-event count for the admin sidebar badge. */
export async function getLiveEventCountAction(): Promise<ActionResult<number>> {
  const caps = await getEventCapabilities();
  if (!caps.authenticated) return { success: false, error: NOT_AUTHENTICATED };
  return { success: true, data: await eventsService.countLiveEvents() };
}
