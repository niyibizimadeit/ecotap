// ─────────────────────────────────────────────────────────────────────────────
// Shared helpers for the event export route handlers.
//
// Both routes live under /api/, which src/middleware.ts treats as fully public
// and never matches on (matcher is /dashboard/:path*). Every access check
// therefore has to happen inside the handler itself — there is no middleware
// backstop behind these.
// ─────────────────────────────────────────────────────────────────────────────

import { NextResponse } from "next/server";
import type { ExportDenial } from "@/lib/services/events.service";

export const EXPORT_ERROR_STATUS: Record<ExportDenial | "EMPTY", number> = {
  FORBIDDEN:       403,
  EVENT_NOT_FOUND: 404,
  EVENT_NOT_ENDED: 409,
  TOO_LARGE:       413,
  EMPTY:           200,   // handled as an empty archive, not an error
};

export function exportError(error: ExportDenial | "EMPTY") {
  const status = EXPORT_ERROR_STATUS[error];
  const message =
    error === "FORBIDDEN"       ? "You don't have access to this export." :
    error === "EVENT_NOT_FOUND" ? "Event not found." :
    error === "EVENT_NOT_ENDED" ? "This event hasn't finished yet." :
    error === "TOO_LARGE"       ? "This export is too large to build in one file. Export a single event instead." :
                                  "Nothing to export yet.";
  return NextResponse.json({ error, message }, { status });
}

/**
 * Build a Content-Disposition header that is safe to emit.
 *
 * The ASCII `filename=` fallback is stripped to [A-Za-z0-9._-] so a title can
 * never inject a header, and the real (possibly non-ASCII) name goes in the
 * RFC 5987 `filename*` parameter, which browsers prefer when present.
 */
export function attachmentHeader(asciiName: string, realName: string): string {
  const ascii = asciiName.replace(/[^A-Za-z0-9._-]/g, "_").slice(0, 120) || "export";
  return `attachment; filename="${ascii}"; filename*=UTF-8''${encodeURIComponent(realName)}`;
}

/**
 * Name an event's spreadsheet after the event itself.
 *
 * The returned value is used twice: `attachmentHeader` sanitises it for the
 * ASCII `filename=` fallback and percent-encodes it for `filename*`, so the
 * only job here is choosing a sane stem.
 *
 * A title with no ASCII alphanumerics at all ("日本語イベント", or one that is
 * pure emoji) would sanitise down to a row of underscores on the fallback path,
 * so it gets a generic name instead. Browsers that honour `filename*` — every
 * current one — still see the real title regardless.
 */
export function exportFilename(title: string): string {
  return /[A-Za-z0-9]/.test(title) ? `${title}.xlsx` : "event-export.xlsx";
}

export const XLSX_CONTENT_TYPE =
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";

export const NO_STORE = {
  "Cache-Control": "no-store, no-cache, must-revalidate",
} as const;
