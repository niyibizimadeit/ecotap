// ─────────────────────────────────────────────────────────────────────────────
// Minimal ambient declarations for the Web NFC API.
//
// NDEFReader ships in no @types package, so without this the feature simply
// would not compile. Only the surface this app actually uses is declared.
//
// Supported in Chrome on Android only. iOS Safari has no browser NFC reading
// at all, which is why the door falls back to camera scanning there.
// ─────────────────────────────────────────────────────────────────────────────

interface NDEFRecordLike {
  recordType: string;
  mediaType?: string;
  encoding?: string;
  lang?: string;
  data?: DataView;
  toText?: () => string;
}

interface NDEFMessageLike {
  records: NDEFRecordLike[];
}

interface NDEFReadingEventLike extends Event {
  serialNumber: string;
  message: NDEFMessageLike;
}

declare class NDEFReader extends EventTarget {
  constructor();
  scan(options?: { signal?: AbortSignal }): Promise<void>;
  onreading: ((event: NDEFReadingEventLike) => void) | null;
  onreadingerror: ((event: Event) => void) | null;
}

interface Window {
  NDEFReader?: typeof NDEFReader;
}
