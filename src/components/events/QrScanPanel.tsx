"use client";

import { useEffect, useRef, useState } from "react";
import QrScanner from "qr-scanner";
import { Button } from "@/components/ui/Button";

/**
 * Turn a getUserMedia rejection into something a host can act on.
 * The generic fallback matters: the raw DOMException text is not useful to
 * someone standing at a door with a queue behind them.
 */
function readableCameraError(err: unknown): string {
  const name = err instanceof Error ? err.name : "";
  if (name === "NotAllowedError")  return "Camera permission was denied. Allow it in your browser settings and try again.";
  if (name === "NotFoundError")    return "No camera found on this device.";
  if (name === "NotReadableError") return "The camera is already in use by another app.";
  if (name === "NotSupportedError") return "This browser can't open the camera. Try Chrome or Safari over a secure connection.";
  return "Couldn't start the camera. Try again, or use NFC if your phone supports it.";
}

interface Props {
  onScan:  (raw: string, method: "qr") => void;
  onClose: () => void;
}

export function QrScanPanel({ onScan, onClose }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [error, setError] = useState<string | null>(null);

  // Hold the callback in a ref so the scanner isn't torn down and rebuilt on
  // every parent render — restarting the camera mid-scan is very visible.
  const onScanRef = useRef(onScan);
  useEffect(() => { onScanRef.current = onScan; }, [onScan]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    let scanner: QrScanner | null = null;
    let cancelled = false;

    // Both construction and start() are wrapped in one async task so a failure
    // in either path is reported the same way, and so no state is set
    // synchronously while the effect is running.
    void (async () => {
      try {
        scanner = new QrScanner(
          video,
          (result) => {
            if (result?.data) onScanRef.current(result.data, "qr");
          },
          {
            // Native BarcodeDetector is used automatically where available
            // (fast on Android Chrome); qr-scanner falls back to its own worker
            // decoder elsewhere, which is what makes iOS Safari work.
            preferredCamera: "environment",
            highlightScanRegion: true,
            highlightCodeOutline: true,
            // Throttled deliberately: this runs for hours at a door on battery.
            maxScansPerSecond: 5,
          }
        );

        await scanner.start();
      } catch (err) {
        if (!cancelled) setError(readableCameraError(err));
      }
    })();

    return () => {
      cancelled = true;
      scanner?.destroy();
    };
  }, []);

  return (
    <div>
      <div
        className="relative rounded-2xl overflow-hidden mb-3 bg-black"
        style={{ aspectRatio: "1 / 1" }}
      >
        <video
          ref={videoRef}
          className="w-full h-full object-cover"
          playsInline
          muted
        />
        {error && (
          <div className="absolute inset-0 flex items-center justify-center p-6 bg-black/80">
            <p className="text-sm text-white text-center" role="alert">{error}</p>
          </div>
        )}
      </div>

      <p className="text-xs text-ink-light text-center mb-3">
        Point the camera at the attendee&apos;s QR code — on their card, or on their own phone
        if they forgot it.
      </p>

      <Button variant="secondary" size="sm" className="w-full" onClick={onClose}>
        Stop scanning
      </Button>
    </div>
  );
}
