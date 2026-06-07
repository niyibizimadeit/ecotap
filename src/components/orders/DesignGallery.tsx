"use client";

import { cn } from "@/lib/utils";
import { CheckCircle2 } from "lucide-react";

export interface CardDesignOption {
  id:          string;
  name:        string;
  description: string;
  accent:      string;
  pattern:     "dots" | "lines" | "grid" | "waves" | "minimal" | "bold";
}

export const MOCK_DESIGNS: CardDesignOption[] = [
  {
    id:          "design-001",
    name:        "Classic Emerald",
    description: "Clean and professional. The signature EcoTap look.",
    accent:      "#064E3B",
    pattern:     "dots",
  },
  {
    id:          "design-002",
    name:        "Midnight Dark",
    description: "Deep charcoal with subtle texture. Bold and modern.",
    accent:      "#1a1a2e",
    pattern:     "grid",
  },
  {
    id:          "design-003",
    name:        "Royal Navy",
    description: "Deep navy with gold undertones. Confident and sharp.",
    accent:      "#1e3a5f",
    pattern:     "lines",
  },
  {
    id:          "design-004",
    name:        "Terracotta",
    description: "Warm earthy tones. Stands out in the right way.",
    accent:      "#7c2d12",
    pattern:     "waves",
  },
  {
    id:          "design-005",
    name:        "Sage & Stone",
    description: "Muted sage with warm cream. Calm and refined.",
    accent:      "#3d6b4f",
    pattern:     "minimal",
  },
  {
    id:          "design-006",
    name:        "Obsidian",
    description: "Pure black with clean lines. Maximum impact.",
    accent:      "#0f0f0f",
    pattern:     "bold",
  },
];

/* Tiny SVG card preview for each design */
function CardDesignPreview({ design }: { design: CardDesignOption }) {
  const w = 120;
  const h = 76;

  const pattern = (() => {
    switch (design.pattern) {
      case "dots":
        return (
          <pattern id={`p-${design.id}`} x="0" y="0" width="8" height="8" patternUnits="userSpaceOnUse">
            <circle cx="4" cy="4" r="1" fill="white" opacity="0.12" />
          </pattern>
        );
      case "grid":
        return (
          <pattern id={`p-${design.id}`} x="0" y="0" width="12" height="12" patternUnits="userSpaceOnUse">
            <path d="M12 0H0M0 0v12" stroke="white" strokeWidth="0.4" opacity="0.1" />
          </pattern>
        );
      case "lines":
        return (
          <pattern id={`p-${design.id}`} x="0" y="0" width="8" height="8" patternUnits="userSpaceOnUse">
            <path d="M0 8L8 0" stroke="white" strokeWidth="0.5" opacity="0.1" />
          </pattern>
        );
      case "waves":
        return (
          <pattern id={`p-${design.id}`} x="0" y="0" width="20" height="10" patternUnits="userSpaceOnUse">
            <path d="M0 5 Q5 0 10 5 Q15 10 20 5" stroke="white" strokeWidth="0.6" fill="none" opacity="0.12" />
          </pattern>
        );
      case "minimal":
        return (
          <pattern id={`p-${design.id}`} x="0" y="0" width="1" height="1" patternUnits="userSpaceOnUse">
            <rect width="1" height="1" fill="white" opacity="0.03" />
          </pattern>
        );
      case "bold":
        return (
          <pattern id={`p-${design.id}`} x="0" y="0" width="16" height="16" patternUnits="userSpaceOnUse">
            <rect x="0" y="0" width="8" height="8" fill="white" opacity="0.04" />
          </pattern>
        );
    }
  })();

  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} className="rounded-xl overflow-hidden flex-shrink-0">
      <rect width={w} height={h} fill={design.accent} />
      <defs>{pattern}</defs>
      <rect width={w} height={h} fill={`url(#p-${design.id})`} />
      {/* NFC ripple */}
      <circle cx={w - 14} cy={14} r={10} fill="none" stroke="white" strokeWidth="0.8" opacity="0.3" />
      <circle cx={w - 14} cy={14} r={6}  fill="none" stroke="white" strokeWidth="0.8" opacity="0.4" />
      <circle cx={w - 14} cy={14} r={2}  fill="white" opacity="0.4" />
      {/* Avatar placeholder */}
      <rect x={10} y={h - 30} width={20} height={20} rx="5" fill="white" opacity="0.15" />
      {/* Name lines */}
      <rect x={36} y={h - 26} width={40} height={4} rx="2" fill="white" opacity="0.5" />
      <rect x={36} y={h - 18} width={28} height={3} rx="1.5" fill="white" opacity="0.3" />
    </svg>
  );
}

interface DesignGalleryProps {
  selected:  string;
  onSelect:  (id: string) => void;
}

export function DesignGallery({ selected, onSelect }: DesignGalleryProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      {MOCK_DESIGNS.map((design) => {
        const isSelected = selected === design.id;
        return (
          <button
            key={design.id}
            onClick={() => onSelect(design.id)}
            className={cn(
              "flex items-center gap-4 p-4 rounded-2xl border text-left transition-all duration-200",
              "hover:-translate-y-0.5 hover:shadow-card-lg active:scale-[0.98]"
            )}
            style={{
              backgroundColor: isSelected ? "#ECFDF5" : "#FEFCE8",
              borderColor:     isSelected ? "#059669" : "rgba(6,78,59,0.1)",
              boxShadow:       isSelected ? "0 0 0 2px rgba(5,150,105,0.2)" : "none",
            }}
          >
            <CardDesignPreview design={design} />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <p className="text-sm font-semibold text-emerald-deep">{design.name}</p>
                {isSelected && (
                  <CheckCircle2 className="h-4 w-4 flex-shrink-0" style={{ color: "#059669" }} />
                )}
              </div>
              <p className="text-xs text-ink-light leading-relaxed">{design.description}</p>
              <div
                className="mt-2 w-6 h-2.5 rounded-full"
                style={{ backgroundColor: design.accent }}
              />
            </div>
          </button>
        );
      })}
    </div>
  );
}