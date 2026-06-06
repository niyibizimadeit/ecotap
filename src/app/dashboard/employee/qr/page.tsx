"use client";

import { useRef } from "react";
import { PageHeader, SectionCard } from "@/components/dashboard/DashboardShared";
import { Button } from "@/components/ui/Button";
import { Download, ExternalLink, Copy, CheckCircle2 } from "lucide-react";
import { useState } from "react";

const CARD_URL = "https://ecotap.rw/prince-niyibizi";

/* Simple QR code rendered as SVG using a basic matrix pattern for mock purposes.
   Phase 13 wires qrcode.react for real generation. */
function MockQrCode({ url, size = 200 }: { url: string; size?: number }) {
  // Deterministic cell pattern based on URL length
  const cells = 21;
  const cell  = size / cells;

  // Fixed finder patterns + pseudo-random interior
  const isFinderPattern = (r: number, c: number) =>
    (r < 7 && c < 7) ||
    (r < 7 && c >= cells - 7) ||
    (r >= cells - 7 && c < 7);

  const isFinderBorder = (r: number, c: number) =>
    (r === 7 && c <= 7) || (r <= 7 && c === 7) ||
    (r === 7 && c >= cells - 8) || (r <= 7 && c === cells - 8) ||
    (r === cells - 8 && c <= 7) || (r >= cells - 8 && c === 7);

  const isDark = (r: number, c: number): boolean => {
    if (isFinderPattern(r, c)) {
      const ir = r < 7 ? r : r - (cells - 7);
      const ic = c < 7 ? c : c - (cells - 7);
      const inner = ir > 0 && ir < 6 && ic > 0 && ic < 6;
      const border = ir === 0 || ir === 6 || ic === 0 || ic === 6;
      const core   = ir >= 2 && ir <= 4 && ic >= 2 && ic <= 4;
      return border || core;
    }
    if (isFinderBorder(r, c)) return false;
    // timing pattern
    if (r === 6 || c === 6) return (r + c) % 2 === 0;
    // pseudo-random fill based on URL
    const hash = (r * 31 + c * 17 + url.charCodeAt((r * cells + c) % url.length)) % 3;
    return hash < 1.4;
  };

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect width={size} height={size} fill="white" />
      {Array.from({ length: cells }, (_, r) =>
        Array.from({ length: cells }, (_, c) =>
          isDark(r, c) ? (
            <rect
              key={`${r}-${c}`}
              x={c * cell}
              y={r * cell}
              width={cell}
              height={cell}
              fill="#064E3B"
            />
          ) : null
        )
      )}
    </svg>
  );
}

export default function QrPage() {
  const qrRef  = useRef<HTMLDivElement>(null);
  const [copied, setCopied] = useState(false);

  function copyUrl() {
    navigator.clipboard.writeText(CARD_URL);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function downloadQr() {
    // Phase 13: canvas toDataURL for real qrcode.react download
    const svg = qrRef.current?.querySelector("svg");
    if (!svg) return;
    const xml  = new XMLSerializer().serializeToString(svg);
    const blob = new Blob([xml], { type: "image/svg+xml" });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement("a");
    a.href     = url;
    a.download = "ecotap-qr.svg";
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div>
      <PageHeader
        eyebrow="QR Code"
        title="Your QR code"
        subtitle="Scan to open your card. Print it, share it, put it anywhere."
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-3xl">

        {/* QR display */}
        <SectionCard title="Scan me">
          <div className="flex flex-col items-center gap-6">
            <div
              ref={qrRef}
              className="p-5 rounded-2xl border shadow-card"
              style={{ backgroundColor: "white", borderColor: "rgba(6,78,59,0.08)" }}
            >
              <MockQrCode url={CARD_URL} size={200} />
            </div>

            <div
              className="w-full rounded-xl border px-4 py-3 flex items-center justify-between gap-2"
              style={{ backgroundColor: "#ECFDF5", borderColor: "rgba(5,150,105,0.15)" }}
            >
              <span className="text-xs font-mono text-emerald-mid truncate">{CARD_URL}</span>
              <button
                onClick={copyUrl}
                className="flex items-center gap-1.5 text-xs font-medium flex-shrink-0 transition-colors"
                style={{ color: copied ? "#059669" : "#064E3B" }}
              >
                {copied
                  ? <><CheckCircle2 className="h-3.5 w-3.5" /> Copied</>
                  : <><Copy className="h-3.5 w-3.5" /> Copy</>
                }
              </button>
            </div>

            <div className="flex gap-3 w-full">
              <Button
                variant="primary"
                size="md"
                className="flex-1"
                leftIcon={<Download className="h-4 w-4" />}
                onClick={downloadQr}
              >
                Download SVG
              </Button>
              <a href={CARD_URL} target="_blank" rel="noopener noreferrer" className="flex-1">
                <Button
                  variant="secondary"
                  size="md"
                  className="w-full"
                  leftIcon={<ExternalLink className="h-4 w-4" />}
                >
                  Open card
                </Button>
              </a>
            </div>
          </div>
        </SectionCard>

        {/* Tips */}
        <SectionCard title="How to use your QR code" subtitle="Get the most out of your digital card">
          <div className="space-y-4">
            {[
              {
                emoji: "🖨️",
                title: "Print it",
                desc: "Add to email signatures, printed materials, or a desk stand.",
              },
              {
                emoji: "💬",
                title: "Share digitally",
                desc: "Screenshot and share in WhatsApp, LinkedIn, or any chat app.",
              },
              {
                emoji: "📲",
                title: "Display on screen",
                desc: "Show on your laptop at events — anyone can scan and connect.",
              },
              {
                emoji: "🏷️",
                title: "Combine with NFC",
                desc: "Your NFC card and QR both point to the same live profile.",
              },
            ].map((tip) => (
              <div key={tip.title} className="flex items-start gap-3">
                <span className="text-xl flex-shrink-0">{tip.emoji}</span>
                <div>
                  <p className="text-sm font-semibold text-emerald-deep">{tip.title}</p>
                  <p className="text-xs text-ink-light leading-relaxed mt-0.5">{tip.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </SectionCard>
      </div>
    </div>
  );
}