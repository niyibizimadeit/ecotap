"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { QRCodeSVG } from "qrcode.react";
import { PageHeader, SectionCard, EmptyState } from "@/components/dashboard/DashboardShared";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import {
  Search, Download, Printer, User as UserIcon,
  Copy, CheckCircle2, ExternalLink, Palette,
} from "lucide-react";
import type { Profile } from "@/types";

// Foreground (QR code dot) color presets — for printing on different card colors
const FG_COLORS = [
  { name: "EcoTap Green", value: "#064E3B" },
  { name: "Black", value: "#000000" },
  { name: "Navy", value: "#1E3A5F" },
  { name: "Burgundy", value: "#800020" },
  { name: "Forest Green", value: "#2D5016" },
  { name: "Charcoal", value: "#333333" },
  { name: "Deep Purple", value: "#3B1F6E" },
];

// Background color presets — match common card stock colors
const BG_COLORS = [
  { name: "White", value: "#FFFFFF" },
  { name: "Cream", value: "#FEFCE8" },
  { name: "Ivory", value: "#FEF9EF" },
  { name: "Light Gray", value: "#F5F5F5" },
  { name: "Light Green", value: "#ECFDF5" },
  { name: "Light Blue", value: "#EFF6FF" },
  { name: "Clear", value: "transparent" },
];

interface UserMatch {
  id: string;
  username: string;
  full_name: string;
  email: string;
}

export default function AdminQrPage() {
  const qrRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [query, setQuery] = useState("");
  const [results, setResults] = useState<UserMatch[]>([]);
  const [searching, setSearching] = useState(false);

  const [selectedUser, setSelectedUser] = useState<UserMatch | null>(null);
  const [cardUrl, setCardUrl] = useState<string | null>(null);
  const [loadingCard, setLoadingCard] = useState(false);

  const [fgColor, setFgColor] = useState("#064E3B");
  const [bgColor, setBgColor] = useState("#FFFFFF");
  const [copied, setCopied] = useState(false);

  // Debounced search
  useEffect(() => {
    if (!query || query.trim().length < 2) { setResults([]); return; }
    const timer = setTimeout(async () => {
      setSearching(true);
      const { lookupUserForQR } = await import("@/app/actions/admin.actions");
      const result = await lookupUserForQR(query.trim());
      if (result.success && result.data) setResults(result.data as UserMatch[]);
      setSearching(false);
    }, 300);
    return () => clearTimeout(timer);
  }, [query]);

  // Fetch card URL when user selected
  const selectUser = useCallback(async (user: UserMatch) => {
    setSelectedUser(user);
    setResults([]);
    setQuery(user.full_name);
    setLoadingCard(true);
    setCardUrl(null);

    const { fetchUserCardUrl } = await import("@/app/actions/admin.actions");
    const result = await fetchUserCardUrl(user.id);
    if (result.success && result.data) {
      setCardUrl(result.data.cardUrl);
    }
    setLoadingCard(false);
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
      // Use the selected background color (or white if transparent)
      ctx.fillStyle = bgColor === "transparent" ? "#FFFFFF" : bgColor;
      ctx.fillRect(0, 0, 512, 512);
      ctx.drawImage(img, 0, 0, 512, 512);
      URL.revokeObjectURL(url);

      canvas.toBlob((pngBlob) => {
        if (!pngBlob) return;
        const pngUrl = URL.createObjectURL(pngBlob);
        const a = document.createElement("a");
        a.href = pngUrl;
        a.download = `${selectedUser?.username ?? "user"}-ecotap-qr.png`;
        a.click();
        URL.revokeObjectURL(pngUrl);
      }, "image/png");
    };
    img.src = url;
  }

  function handlePrint() {
    const svg = qrRef.current?.querySelector("svg");
    if (!svg) return;
    const svgHtml = new XMLSerializer().serializeToString(svg);
    const printWindow = window.open("", "_blank", "width=600,height=600");
    if (!printWindow) return;

    printWindow.document.write(`<!DOCTYPE html>
      <html><head><title>QR Code — ${selectedUser?.full_name ?? "EcoTap"}</title>
      <style>
        @page { margin: 0.25in; size: auto; }
        body { margin: 0; display: flex; align-items: center; justify-content: center; min-height: 100vh; }
        svg { max-width: 95vmin; max-height: 95vmin; }
      </style></head>
      <body>${svgHtml}</body></html>
    `);
    printWindow.document.close();
    printWindow.focus();
    // Delay print slightly to allow rendering
    setTimeout(() => printWindow.print(), 300);
  }

  return (
    <div>
      <PageHeader
        eyebrow="QR Codes"
        title="Generate printable QR codes"
        subtitle="Search for any user, customize colors for different card stocks, download or print."
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-4xl">
        {/* Left: Search + Controls */}
        <SectionCard title="Search & customize">
          <div className="space-y-5">
            {/* Search input */}
            <div className="relative">
              <Input
                placeholder="Search by name, email, or username…"
                value={query}
                onChange={e => {
                  setQuery(e.target.value);
                  if (selectedUser && e.target.value !== selectedUser.full_name) {
                    setSelectedUser(null);
                    setCardUrl(null);
                  }
                }}
                leftElement={<Search className="h-4 w-4" />}
                rightElement={searching ? <div className="h-4 w-4 rounded-full border-2 border-emerald-bright border-t-transparent animate-spin" /> : undefined}
              />

              {/* Results dropdown */}
              {results.length > 0 && (
                <div
                  className="absolute top-full mt-1 inset-x-0 z-20 rounded-xl border shadow-card-lg max-h-56 overflow-y-auto"
                  style={{ backgroundColor: "#FEFCE8", borderColor: "rgba(6,78,59,0.08)" }}
                >
                  {results.map(p => (
                    <button
                      key={p.id}
                      onClick={() => selectUser(p)}
                      className="w-full flex items-center gap-3 px-4 py-3 text-sm hover:bg-emerald-pale transition-colors text-left border-b last:border-0"
                      style={{ borderColor: "rgba(6,78,59,0.06)" }}
                    >
                      <UserIcon className="h-4 w-4 text-ink-light flex-shrink-0" />
                      <div className="min-w-0">
                        <p className="font-medium text-ink truncate">{p.full_name}</p>
                        <p className="text-xs text-ink-light truncate">{p.email} · @{p.username}</p>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Foreground color picker */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Palette className="h-3.5 w-3.5 text-ink-light" />
                <p className="text-xs font-mono tracking-wider text-ink-light uppercase">QR Code Color</p>
                <span className="text-xs text-ink-light">(for different card colors)</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {FG_COLORS.map(c => (
                  <button
                    key={c.value}
                    onClick={() => setFgColor(c.value)}
                    className="w-9 h-9 rounded-xl border-2 transition-all relative"
                    style={{
                      backgroundColor: c.value,
                      borderColor: fgColor === c.value ? "#064E3B" : "transparent",
                      boxShadow: fgColor === c.value ? "0 0 0 2px #064E3B, 0 0 0 4px rgba(6,78,59,0.15)" : "none",
                    }}
                    title={c.name}
                    aria-label={`QR color: ${c.name}`}
                  />
                ))}
              </div>
            </div>

            {/* Background color picker */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Palette className="h-3.5 w-3.5 text-ink-light" />
                <p className="text-xs font-mono tracking-wider text-ink-light uppercase">Background Color</p>
                <span className="text-xs text-ink-light">(match card stock)</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {BG_COLORS.map(c => (
                  <button
                    key={c.value}
                    onClick={() => setBgColor(c.value)}
                    className="w-9 h-9 rounded-xl border-2 transition-all relative"
                    style={{
                      backgroundColor: c.value === "transparent" ? "#FFFFFF" : c.value,
                      borderColor: bgColor === c.value ? "#064E3B" : "rgba(6,78,59,0.12)",
                      boxShadow: bgColor === c.value ? "0 0 0 2px #064E3B, 0 0 0 4px rgba(6,78,59,0.15)" : "none",
                    }}
                    title={c.name}
                    aria-label={`Background: ${c.name}`}
                  >
                    {c.value === "transparent" && (
                      <div className="absolute inset-1 rounded-lg diagonal-stripe" />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Action buttons */}
            {cardUrl && (
              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <Button variant="primary" size="md" className="flex-1" leftIcon={<Download className="h-4 w-4" />} onClick={downloadPng}>
                  Download PNG
                </Button>
                <Button variant="secondary" size="md" className="flex-1" leftIcon={<Printer className="h-4 w-4" />} onClick={handlePrint}>
                  Print QR
                </Button>
              </div>
            )}
          </div>
        </SectionCard>

        {/* Right: QR Code Display */}
        <SectionCard title="Preview">
          <div className="flex flex-col items-center gap-4 py-4">
            {loadingCard ? (
              <div className="w-[220px] h-[220px] rounded-2xl skeleton" />
            ) : cardUrl ? (
              <>
                <div
                  ref={qrRef}
                  className="p-5 rounded-2xl border shadow-card"
                  style={{
                    backgroundColor: "white",
                    borderColor: "rgba(6,78,59,0.08)",
                  }}
                >
                  <QRCodeSVG
                    value={cardUrl}
                    size={200}
                    level="M"
                    fgColor={fgColor}
                    bgColor={bgColor === "transparent" ? "#FFFFFF" : bgColor}
                    includeMargin
                  />
                </div>

                {/* Card URL + copy */}
                <div
                  className="w-full rounded-xl border px-4 py-3 flex items-center justify-between gap-2"
                  style={{ backgroundColor: "#ECFDF5", borderColor: "rgba(5,150,105,0.15)" }}
                >
                  <span className="text-xs font-mono text-emerald-mid truncate">{cardUrl}</span>
                  <button
                    onClick={copyUrl}
                    className="flex items-center gap-1.5 text-xs font-medium flex-shrink-0 transition-colors"
                    style={{ color: copied ? "#059669" : "#064E3B" }}
                  >
                    {copied ? <><CheckCircle2 className="h-3.5 w-3.5" /> Copied</> : <><Copy className="h-3.5 w-3.5" /> Copy</>}
                  </button>
                </div>

                {/* Open card link */}
                <a
                  href={cardUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-xs text-ink-light hover:text-emerald-bright transition-colors"
                >
                  <ExternalLink className="h-3.5 w-3.5" />
                  Open card page
                </a>

                {/* User info */}
                <div className="text-center">
                  <p className="text-sm font-semibold text-emerald-deep">{selectedUser?.full_name}</p>
                  <p className="text-xs text-ink-light font-mono">@{selectedUser?.username}</p>
                </div>
              </>
            ) : selectedUser ? (
              <div className="py-12 text-center">
                <p className="text-sm text-ink-light">No card found for this user.</p>
              </div>
            ) : (
              <div className="py-12">
                <EmptyState
                  icon={<Search className="h-8 w-8 text-ink-light" />}
                  title="No user selected"
                  description="Search for a user on the left to view and print their QR code."
                />
              </div>
            )}
          </div>
        </SectionCard>
      </div>

      {/* Hidden canvas for PNG export */}
      <canvas ref={canvasRef} style={{ display: "none" }} />
    </div>
  );
}
