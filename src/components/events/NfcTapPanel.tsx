"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Spinner } from "@/components/ui/Spinner";
import { Button } from "@/components/ui/Button";

/**
 * Pull usable text out of an NDEF record.
 *
 * A URL record's payload may or may not carry a leading URI-prefix byte
 * depending on the writer, so leading control characters are stripped before
 * handing the string on. The server-side parser then handles every URL shape
 * and rejects anything that isn't username-shaped.
 */
function decodeRecord(record: NDEFRecordLike): string | null {
  try {
    if (typeof record.toText === "function") {
      const text = record.toText();
      if (text) return text;
    }
    if (!record.data) return null;
    const bytes = new Uint8Array(
      record.data.buffer, record.data.byteOffset, record.data.byteLength
    );
    return new TextDecoder(record.encoding ?? "utf-8").decode(bytes);
  } catch {
    return null;
  }
}

interface Props {
  onScan:    (raw: string, method: "nfc") => void;
  onError?:  (message: string) => void;
}

// The parent renders this only while NFC mode is selected, so there is no
// `active` flag to react to — unmounting is what disarms the reader.
export function NfcTapPanel({ onScan, onError }: Props) {
  const [arming, setArming]   = useState(false);
  const [armed, setArmed]     = useState(false);
  const [error, setError]     = useState<string | null>(null);

  // Keep the latest callback without re-arming the reader on every render.
  const onScanRef  = useRef(onScan);
  const onErrorRef = useRef(onError);
  useEffect(() => { onScanRef.current = onScan; }, [onScan]);
  useEffect(() => { onErrorRef.current = onError; }, [onError]);

  const abortRef = useRef<AbortController | null>(null);

  const stop = useCallback(() => {
    abortRef.current?.abort();
    abortRef.current = null;
    setArmed(false);
    setArming(false);
  }, []);

  useEffect(() => () => abortRef.current?.abort(), []);

  async function arm() {
    if (!("NDEFReader" in window)) {
      setError("This phone can't read NFC cards. Scan the QR code instead.");
      return;
    }

    setArming(true);
    setError(null);

    try {
      const controller = new AbortController();
      abortRef.current = controller;

      const reader = new NDEFReader();
      // The button press is the user gesture Web NFC requires — arm on press,
      // never automatically on mount.
      await reader.scan({ signal: controller.signal });

      reader.onreading = (event) => {
        const record = event.message.records.find(
          (r) => r.recordType === "url" || r.recordType === "text" || r.recordType === "absolute-url"
        );
        const raw = record ? decodeRecord(record) : null;
        if (raw) onScanRef.current(raw, "nfc");
      };

      reader.onreadingerror = () => {
        const message = "That card couldn't be read. Try again or scan the QR code.";
        setError(message);
        onErrorRef.current?.(message);
      };

      setArmed(true);
      setArming(false);
    } catch (err) {
      setArming(false);
      const message =
        err instanceof Error && err.name === "NotAllowedError"
          ? "NFC permission was denied. Enable it in your browser settings, or scan the QR code."
          : "Couldn't start NFC on this phone. Scan the QR code instead.";
      setError(message);
      onErrorRef.current?.(message);
    }
  }

  if (armed) {
    return (
      <div className="text-center">
        <div
          className="rounded-2xl border p-6 mb-3"
          style={{ backgroundColor: "#ECFDF5", borderColor: "rgba(5,150,105,0.3)" }}
          role="status"
          aria-live="polite"
        >
          <div className="flex justify-center mb-3 text-emerald-bright">
            <Spinner size="md" />
          </div>
          <p className="font-medium text-emerald-deep">Ready — tap a card</p>
          <p className="text-sm text-ink-mid mt-1">
            Hold the attendee&apos;s card against the back of your phone.
          </p>
        </div>
        <Button variant="ghost" size="sm" onClick={stop}>Stop listening</Button>
      </div>
    );
  }

  return (
    <div>
      <Button variant="primary" size="lg" className="w-full" loading={arming} onClick={arm}>
        Tap card
      </Button>
      {error && (
        <p className="text-xs text-red-700 mt-2 text-center" role="alert">{error}</p>
      )}
    </div>
  );
}
