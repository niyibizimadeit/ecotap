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
 * Make an event title safe to use as a ZIP entry name and as a
 * Content-Disposition filename.
 *
 * A title interpolated raw into a header is an injection vector, so anything
 * outside [a-z0-9] collapses to a dash and the result is length-capped. The
 * leading index keeps extraction order matching chronological order — ZIP has
 * no inherent ordering of its own.
 */
export function safeEntryName(index: number, title: string, dateIso: string): string {
  const slug = title
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60) || "event";

  const date = dateIso.slice(0, 10);
  const n = String(index + 1).padStart(3, "0");
  return `${n}-${slug}-${date}.xlsx`;
}
