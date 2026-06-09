"use client";

import { useEffect, useRef, useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import { PageHeader, SectionCard } from "@/components/dashboard/DashboardShared";
import { Button } from "@/components/ui/Button";
import { Download, ExternalLink, Copy, CheckCircle2 } from "lucide-react";
import { getMyCard } from "@/app/actions/cards.actions";

export default function QrPage() {
  const qrRef  = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [cardUrl, setCardUrl] = useState<string | null>(null);
  const [username, setUsername] = useState<string>("you");
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    async function fetchCard() {
      const result = await getMyCard();
      if (result.success && result.data) {
        const card = result.data;
        const url = card.primary_company
          ? `https://ecotap.rw/${card.primary_company.slug}/${card.profile.username}`
          : `https://ecotap.rw/${card.profile.username}`;
        setCardUrl(url);
        setUsername(card.profile.username);
      }
      setLoading(false);
    }
    fetchCard();
  }, []);

  function copyUrl() {
    if (!cardUrl) return;
    navigator.clipboard.writeText(cardUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function downloadPng() {
    const svg = qrRef.current?.querySelector("svg");
    if (!svg || !cardUrl) return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const svgData = new XMLSerializer().serializeToString(svg);
    const img = new Image();
    const blob = new Blob([svgData], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(blob);

    img.onload = () => {
      canvas.width = 512;
      canvas.height = 512;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      ctx.fillStyle = "#FFFFFF";
      ctx.fillRect(0, 0, 512, 512);
      ctx.drawImage(img, 0, 0, 512, 512);
      URL.revokeObjectURL(url);

      canvas.toBlob((pngBlob) => {
        if (!pngBlob) return;
        const pngUrl = URL.createObjectURL(pngBlob);
        const a = document.createElement("a");
        a.href = pngUrl;
        a.download = `${username}-ecotap-qr.png`;
        a.click();
        URL.revokeObjectURL(pngUrl);
      }, "image/png");
    };
    img.src = url;
  }

  return (
    <div>
      <PageHeader
        eyebrow="QR Code"
        title="Your QR code"
        subtitle="Scan to open your card. Print it, share it, put it anywhere."
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-3xl">
        <SectionCard title="Scan me">
          <div className="flex flex-col items-center gap-6">
            {loading ? (
              <div className="w-[200px] h-[200px] rounded-2xl skeleton" />
            ) : cardUrl ? (
              <>
                <div ref={qrRef} className="p-5 rounded-2xl border shadow-card" style={{ backgroundColor: "white", borderColor: "rgba(6,78,59,0.08)" }}>
                  <QRCodeSVG
                    value={cardUrl}
                    size={200}
                    level="M"
                    fgColor="#064E3B"
                    bgColor="#FFFFFF"
                    includeMargin
                  />
                </div>

                <div className="w-full rounded-xl border px-4 py-3 flex items-center justify-between gap-2" style={{ backgroundColor: "#ECFDF5", borderColor: "rgba(5,150,105,0.15)" }}>
                  <span className="text-xs font-mono text-emerald-mid truncate">{cardUrl}</span>
                  <button onClick={copyUrl} className="flex items-center gap-1.5 text-xs font-medium flex-shrink-0 transition-colors" style={{ color: copied ? "#059669" : "#064E3B" }}>
                    {copied ? <><CheckCircle2 className="h-3.5 w-3.5" /> Copied</> : <><Copy className="h-3.5 w-3.5" /> Copy</>}
                  </button>
                </div>

                <div className="flex gap-3 w-full">
                  <Button variant="primary" size="md" className="flex-1" leftIcon={<Download className="h-4 w-4" />} onClick={downloadPng}>
                    Download PNG
                  </Button>
                  <a href={cardUrl} target="_blank" rel="noopener noreferrer" className="flex-1">
                    <Button variant="secondary" size="md" className="w-full" leftIcon={<ExternalLink className="h-4 w-4" />}>Open card</Button>
                  </a>
                </div>
              </>
            ) : (
              <p className="text-sm text-ink-light text-center py-8">No card found. Set up your profile first.</p>
            )}
          </div>
        </SectionCard>

        <SectionCard title="How to use your QR code" subtitle="Get the most out of your digital card">
          <div className="space-y-4">
            {[
              { emoji: "🖨️", title: "Print it", desc: "Add to email signatures, printed materials, or a desk stand." },
              { emoji: "💬", title: "Share digitally", desc: "Screenshot and share in WhatsApp, LinkedIn, or any chat app." },
              { emoji: "📲", title: "Display on screen", desc: "Show on your laptop at events — anyone can scan and connect." },
              { emoji: "🏷️", title: "Combine with NFC", desc: "Your NFC card and QR both point to the same live profile." },
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

      {/* Hidden canvas for PNG export */}
      <canvas ref={canvasRef} style={{ display: "none" }} />
    </div>
  );
}
