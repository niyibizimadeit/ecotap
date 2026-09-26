// ─────────────────────────────────────────────────────────────────────────────
// Attendance workbook writer.
//
// The ONLY module that imports write-excel-file. It is imported exclusively by
// route handlers — never by a client component, which would pull the writer
// into the browser bundle.
// ─────────────────────────────────────────────────────────────────────────────

import writeXlsxFile from "write-excel-file/node";
import type { SheetData } from "write-excel-file/node";
import { EVENT_EXPORT_COLUMNS } from "@/constants";
import type { ExportRow } from "@/types";

const HEADER_BACKGROUND = "#064E3B";
const HEADER_TEXT         = "#FEFCE8";

/** Wide enough that a default-width sheet isn't unreadable. */
const COLUMN_WIDTHS = [26, 18, 30, 26, 20, 22, 18, 18];

/**
 * Build an attendance workbook: one row per visit, header on row 1.
 *
 * There is deliberately no title row above the header — it breaks naive
 * parsers (including Excel's own "insert table"). Row 1 is the header so the
 * sheet can be sorted and filtered straight away.
 *
 * Times arrive already formatted as Africa/Kigali strings (see
 * `formatExportTime`) rather than Date objects, so the value written is
 * exactly what the host saw at the door regardless of the server's zone.
 */
export async function writeAttendanceWorkbook(rows: ExportRow[]): Promise<Buffer> {
  const header = EVENT_EXPORT_COLUMNS.map((label) => ({
    value:             label,
    fontWeight:        "bold" as const,
    backgroundColor:   HEADER_BACKGROUND,
    textColor:         HEADER_TEXT,
    align:             "left" as const,
    alignVertical:     "center" as const,
    height:            24,
    wrap:              true,
  }));

  const body = rows.map((r) => [
    { value: r.full_name,  type: String, align: "left" as const },
    { value: r.phone,      type: String, align: "left" as const },
    { value: r.email,      type: String, align: "left" as const },
    { value: r.company,    type: String, align: "left" as const },
    { value: r.department, type: String, align: "left" as const },
    { value: r.job_title,  type: String, align: "left" as const },
    { value: r.entry_at,   type: String, align: "left" as const },
    { value: r.exit_at,    type: String, align: "left" as const },
  ]);

  const sheet: SheetData = [header, ...body];

  return writeXlsxFile(sheet, {
    columns:         COLUMN_WIDTHS.map((width) => ({ width })),
    stickyRowsCount: 1,
  }).toBuffer();
}
