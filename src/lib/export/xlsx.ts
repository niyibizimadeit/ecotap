// ─────────────────────────────────────────────────────────────────────────────
// Attendance workbook writer.
//
// The ONLY module that imports write-excel-file. It is imported exclusively by
// route handlers — never by a client component, which would pull the writer
// into the browser bundle.
// ─────────────────────────────────────────────────────────────────────────────

import writeXlsxFile from "write-excel-file/node";
import type { Row, SheetData } from "write-excel-file/node";
import { EVENT_EXPORT_COLUMNS } from "@/constants";
import type { ExportRow } from "@/types";

const HEADER_BACKGROUND = "#064E3B";
const HEADER_TEXT         = "#FEFCE8";

/** Wide enough that a default-width sheet isn't unreadable. */
const COLUMN_WIDTHS = [26, 18, 30, 26, 20, 22, 18, 18];

const TITLE_FONT_SIZE  = 20;
const TITLE_ROW_HEIGHT = 34;

/** Excel caps sheet names here and rejects `: \ / ? * [ ]` outright. */
const SHEET_NAME_MAX = 31;

/**
 * Turn an event title into something Excel will accept as a sheet (tab) name.
 *
 * Banned characters become spaces rather than being deleted, so "Q4/Q1 review"
 * doesn't silently become "Q4Q1 review". A title consisting entirely of banned
 * characters would otherwise yield an empty name, which Excel rejects.
 */
function sheetName(title: string): string {
  const cleaned = title
    .replace(/[:\\/?*[\]]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/^'+|'+$/g, "")   // Excel also rejects a leading/trailing apostrophe
    .slice(0, SHEET_NAME_MAX)
    .trim();
  return cleaned || "Attendance";
}

/**
 * Build an attendance workbook: a large centred title, the header on row 2,
 * one row per visit below that.
 *
 * The title is merged across every column, which deliberately pushes the header
 * off row 1 — anything re-importing this file must start at row 2. The trade
 * was made for readability: a host who opens this to check who came should see
 * which event it is without reading the filename. Both rows are frozen so the
 * header stays visible while scrolling a long guest list.
 *
 * Times arrive already formatted as Africa/Kigali strings (see
 * `formatExportTime`) rather than Date objects, so the value written is
 * exactly what the host saw at the door regardless of the server's zone.
 */
export async function writeAttendanceWorkbook(rows: ExportRow[], title: string): Promise<Buffer> {
  // A `columnSpan`-ning cell must be followed by `null`s covering the columns
  // it swallows — write-excel-file throws if those cells hold anything else.
  const titleRow: Row = [
    {
      value:         title,
      type:          String,
      columnSpan:    EVENT_EXPORT_COLUMNS.length,
      fontSize:      TITLE_FONT_SIZE,
      fontWeight:    "bold" as const,
      textColor:     HEADER_BACKGROUND,
      align:         "center" as const,
      alignVertical: "center" as const,
      height:        TITLE_ROW_HEIGHT,
    },
    ...Array<null>(EVENT_EXPORT_COLUMNS.length - 1).fill(null),
  ];

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

  const sheet: SheetData = [titleRow, header, ...body];

  return writeXlsxFile(sheet, {
    sheet:           sheetName(title),
    columns:         COLUMN_WIDTHS.map((width) => ({ width })),
    stickyRowsCount: 2,
  }).toBuffer();
}
