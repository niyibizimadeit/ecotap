// ─────────────────────────────────────────────────────────────────────────────
// GET /api/events/export — every exportable event as a .zip of spreadsheets.
//
// One spreadsheet per event, never a combined sheet.
//
// Scope comes from the caller's own capabilities, never from a parameter:
//   platform admin → every event on the platform
//   company admin  → every event run by their company's primary members
//   anyone else    → their own events
//
// NOTE: this static `export` segment sits alongside the sibling dynamic
// `[id]` route. Next resolves the literal segment first, which is what makes
// /api/events/export reach this handler and /api/events/<id>/export reach the
// other one. Don't "simplify" it by renaming.
// ─────────────────────────────────────────────────────────────────────────────

import { NextResponse } from "next/server";
import { getEventCapabilities } from "@/lib/supabase/event-access";
import * as eventsService from "@/lib/services/events.service";
import { writeAttendanceWorkbook } from "@/lib/export/xlsx";
import { createZipStream, safeEntryName } from "@/lib/export/zip";
import { exportError, attachmentHeader, NO_STORE } from "../export-shared";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const caps = await getEventCapabilities();
  if (!caps.authenticated) {
    return NextResponse.json({ error: "UNAUTHENTICATED", message: "Sign in first." }, { status: 401 });
  }

  const scope = eventsService.scopeFromCapabilities(caps);
  const planned = await eventsService.planBulkExport(scope);
  if ("error" in planned) return exportError(planned.error);

  const { events } = planned.plan;

  // Build the archive as it is produced: each workbook is generated, written
  // into the zip, and its compressed bytes flow out to the response. Only one
  // event's rows are ever in memory at a time.
  const zip = createZipStream();

  const produce = (async () => {
    try {
      for (let i = 0; i < events.length; i++) {
        const event = events[i];
        const rows  = await eventsService.collectExportRows(event.id);
        const xlsx  = await writeAttendanceWorkbook(rows);
        zip.add(
          safeEntryName(i, event.title, event.starts_at ?? event.created_at),
          new Uint8Array(xlsx)
        );
      }
    } finally {
      await zip.end();
    }
  })();

  // Surface a build failure rather than hanging the response.
  produce.catch((err) => {
    console.error("Bulk event export failed:", err);
  });

  const stamp = new Date().toISOString().slice(0, 10);
  return new NextResponse(zip.stream, {
    status: 200,
    headers: {
      "Content-Type":        "application/zip",
      "Content-Disposition": attachmentHeader(`ecotap-events-${stamp}.zip`, `EcoTap events ${stamp}.zip`),
      ...NO_STORE,
    },
  });
}
