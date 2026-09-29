// ─────────────────────────────────────────────────────────────────────────────
// Streaming ZIP writer built on fflate.
//
// One spreadsheet per event, never a combined sheet. Entries are pushed one at
// a time and their compressed bytes flow straight out to the response, so a
// large archive never has to exist in memory as a whole.
// ─────────────────────────────────────────────────────────────────────────────

import { Zip, ZipPassThrough } from "fflate";

export interface ZipStreamWriter {
  stream: ReadableStream<Uint8Array>;
  add:    (filename: string, data: Uint8Array) => void;
  end:    () => Promise<void>;
}

export function createZipStream(): ZipStreamWriter {
  let controller: ReadableStreamDefaultController<Uint8Array> | null = null;
  let settled = false;

  let resolveDone!: () => void;
  const done = new Promise<void>((resolve) => { resolveDone = resolve; });

  const zip = new Zip((err, chunk, final) => {
    if (err) {
      if (!settled) {
        settled = true;
        controller?.error(err);
        resolveDone();
      }
      return;
    }
    if (chunk) controller?.enqueue(chunk);
    if (final && !settled) {
      settled = true;
      controller?.close();
      resolveDone();
    }
  });

  const stream = new ReadableStream<Uint8Array>({
    start(c) { controller = c; },
  });

  return {
    stream,

    add(filename: string, data: Uint8Array) {
      const entry = new ZipPassThrough(filename);
      zip.add(entry);
      entry.push(data, true);
    },

    async end() {
      zip.end();
      await done;
    },
  };
}

/**
 * Name one event's spreadsheet inside the archive.
 *
 * Forward and back slashes have to go: a ZIP entry name containing either is
 * read as a directory path, so a title like "Q4 / Q1 review" would quietly
 * produce a nested folder instead of a file. The other Windows-reserved
 * characters go with them so the archive extracts cleanly on any OS.
 *
 * Spaces and accents are left alone. fflate sets the ZIP UTF-8 flag by itself
 * whenever a name's byte length outruns its string length, so "Q4 Kickoff —
 * Kigali" survives extraction with the em dash and the "é" intact.
 *
 * The date stays in the name because ZIP records no ordering of its own and two
 * events can share a title.
 */
export function safeEntryName(title: string, dateIso: string): string {
  const stem = title
    .replace(/[\\/:*?"<>|]/g, "-")           // path separators + Windows-reserved
    .replace(/[\u0000-\u001f\u007f]/g, "")   // control characters
    .replace(/\s+/g, " ")
    .replace(/^[.\s]+|[.\s]+$/g, "")         // Windows also rejects trailing dots/spaces
    .slice(0, 80)
    .trim();

  return `${stem || "event"} — ${dateIso.slice(0, 10)}.xlsx`;
}

/**
 * Hand out ZIP entry names that are unique within one archive.
 *
 * Two events can share both a title and a start date — two companies each
 * running an "Open Day" on the same morning — and an archive holding two
 * identically-named entries loses one of them on extraction, usually without
 * warning. The second and later collisions get a " (2)" suffix instead.
 */
export function uniqueEntryNamer(): (base: string) => string {
  const used = new Set<string>();
  return (base) => {
    if (!used.has(base)) {
      used.add(base);
      return base;
    }
    const stem = base.replace(/\.xlsx$/, "");
    let n = 2;
    while (used.has(`${stem} (${n}).xlsx`)) n++;
    const name = `${stem} (${n}).xlsx`;
    used.add(name);
    return name;
  };
}
