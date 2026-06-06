"use client";

import { useState } from "react";
import { downloadVcf } from "@/lib/vcf/generator";
import type { PublicCard } from "@/types";
import { Download, CheckCircle2 } from "lucide-react";

interface SaveContactButtonProps {
  card: PublicCard;
  accentColor: string;
}

export function SaveContactButton({ card, accentColor }: SaveContactButtonProps) {
  const [saved, setSaved] = useState(false);

  function handleSave() {
    downloadVcf(card);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  }

  return (
    <button
      onClick={handleSave}
      className="w-full flex items-center justify-between px-5 py-4 rounded-2xl transition-all duration-200 active:scale-[0.98] hover:opacity-90"
      style={{ backgroundColor: accentColor }}
    >
      <div className="text-left">
        <p className="text-sm font-semibold" style={{ color: "#FEFCE8" }}>
          {saved ? "Saved to contacts!" : "Save contact"}
        </p>
        <p className="text-xs" style={{ color: "rgba(254,252,232,0.65)" }}>
          {saved ? "Check your contacts app" : "Download .vcf file"}
        </p>
      </div>
      <div
        className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
        style={{ backgroundColor: "rgba(254,252,232,0.15)" }}
      >
        {saved
          ? <CheckCircle2 className="h-5 w-5" style={{ color: "#FEFCE8" }} />
          : <Download    className="h-5 w-5" style={{ color: "#FEFCE8" }} />
        }
      </div>
    </button>
  );
}