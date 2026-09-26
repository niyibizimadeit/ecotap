// ─────────────────────────────────────────────────────────────────────────────
// Events validation schemas.
//
// Server-side validation, validated in the action before the service is
// called. (src/lib/validations/auth.ts is currently the only other schema and
// is used client-side via zodResolver; this is the first server-side use.)
// ─────────────────────────────────────────────────────────────────────────────

import { z } from "zod";
import { MAX_EVENT_TITLE_LENGTH } from "@/constants";

export const createEventSchema = z.object({
  title: z
    .string()
    .min(1, "Give the event a title.")
    .max(MAX_EVENT_TITLE_LENGTH, `Title must be ${MAX_EVENT_TITLE_LENGTH} characters or fewer.`),
  venue: z.string().max(160, "Venue must be 160 characters or fewer.").nullish(),
  scheduled_start_at: z
    .string()
    .min(1, "Pick a date and time.")
    .refine((v) => !Number.isNaN(Date.parse(v)), "That start time isn't valid."),
});

export type CreateEventInput = z.infer<typeof createEventSchema>;

export const checkInSchema = z.object({
  // Whatever the camera or NFC reader produced. Generous upper bound — a
  // scanned URL is short, but a reader can emit trailing whitespace or noise.
  raw:    z.string().min(1, "Nothing was scanned.").max(2048),
  method: z.enum(["nfc", "qr"]),
});

export type CheckInInput = z.infer<typeof checkInSchema>;

export const resolveExitSchema = z.object({
  visitId:  z.string().uuid("Unknown visit."),
  decision: z.enum(["confirm", "ignore"]),
});

export const endEventSchema = z.object({
  eventId: z.string().uuid("Unknown event."),
  mode:    z.enum(["close", "cancel"]),
});

export const goLiveSchema = z.object({
  eventId:           z.string().uuid("Unknown event."),
  closeLiveEventId:  z.string().uuid().nullish(),
});
