"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { Spinner } from "@/components/ui/Spinner";
import { formatDuration, formatClockTime } from "@/lib/utils";
import type { EventVisit } from "@/types";

interface Props {
  visits:     EventVisit[];
  now:        number;
  busyId?:    string | null;
  onExit:     (visitId: string) => void;
}

/**
 * Who is currently inside, collapsed by default so the door screen stays a
 * one-glance instrument. The per-row exit is the escape hatch for someone who
 * leaves without their card.
 */
export function InsideNowList({ visits, now, busyId, onExit }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <div
      className="rounded-2xl border overflow-hidden"
      style={{ backgroundColor: "#FEF9EF", borderColor: "rgba(6,78,59,0.08)" }}
    >
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-emerald-pale/40 transition-colors"
      >
        <span className="text-sm font-medium text-ink">
          Inside now: <span className="font-mono text-emerald-deep">{visits.length}</span>
        </span>
        {open
          ? <ChevronUp className="h-4 w-4 text-ink-light" aria-hidden="true" />
          : <ChevronDown className="h-4 w-4 text-ink-light" aria-hidden="true" />}
      </button>

      {open && (
        <div className="border-t max-h-64 overflow-y-auto" style={{ borderColor: "rgba(6,78,59,0.08)" }}>
          {visits.length === 0 ? (
            <p className="px-4 py-4 text-sm text-ink-light">Nobody is inside yet.</p>
          ) : (
            <ul className="divide-y" style={{ borderColor: "rgba(6,78,59,0.06)" }}>
              {visits.map((v) => (
                <li key={v.id} className="flex items-center justify-between gap-3 px-4 py-2.5">
                  <div className="min-w-0">
                    <p className="text-sm text-ink truncate">{v.full_name}</p>
                    <p className="text-xs text-ink-light">
                      in at {formatClockTime(v.entry_at)} · {formatDuration(now - Date.parse(v.entry_at))}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => onExit(v.id)}
                    disabled={busyId === v.id}
                    className="shrink-0 text-xs font-medium px-2.5 py-1.5 rounded-lg transition-colors disabled:opacity-50"
                    style={{ backgroundColor: "#ECFDF5", color: "#065F46" }}
                  >
                    {busyId === v.id ? <Spinner size="sm" /> : "Record exit"}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
