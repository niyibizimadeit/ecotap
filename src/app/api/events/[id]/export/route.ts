// ─────────────────────────────────────────────────────────────────────────────
// GET /api/events/[id]/export — one event's attendance as .xlsx
//
// Generated on demand and streamed straight back. Nothing is stored, so there
// is no artefact to expire and no public URL holding attendee names, emails
// and phone numbers.
// ─────────────────────────────────────────────────────────────────────────────

import { NextResponse } from "next/server";
import { getEventCapabilities } from "@/lib/supabase/event-access";
import * as eventsService from "@/lib/services/events.service";
import { writeAttendanceWorkbook } from "@/lib/export/xlsx";
import {
  exportError, attachmentHeader, exportFilename, XLSX_CONTENT_TYPE, NO_STORE,
} from "../../export-shared";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{ id: string }>;
}

export async function GET(_req: Request, { params }: Props) {
  const { id } = await params;

  // Middleware never runs on /api/*, so this is the only gate.
  const caps = await getEventCapabilities();
  if (!caps.authenticated) {
    return NextResponse.json({ error: "UNAUTHENTICATED", message: "Sign in first." }, { status: 401 });
  }

  const gate = await eventsService.assertCanExportEvent(id, caps);
  if ("error" in gate) return exportError(gate.error);

  const event = gate.event;

  try {
    const rows   = await eventsService.collectExportRows(event.id);
    const buffer = await writeAttendanceWorkbook(rows, event.title);
    const name   = exportFilename(event.title);

    return new NextResponse(new Uint8Array(buffer), {
      status: 200,
      headers: {
        "Content-Type":        XLSX_CONTENT_TYPE,
        "Content-Disposition": attachmentHeader(name, name),
        "Content-Length":      String(buffer.length),
        ...NO_STORE,
      },
    });
  } catch (err) {
    console.error("Event export failed:", err);
    return NextResponse.json(
      { error: "EXPORT_FAILED", message: "Couldn't build the spreadsheet. Please try again." },
      { status: 500 }
    );
  }
}
