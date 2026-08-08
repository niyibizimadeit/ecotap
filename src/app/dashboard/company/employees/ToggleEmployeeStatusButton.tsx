"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Pause, Play } from "lucide-react";
import { suspendEmployeeAction, activateEmployeeAction } from "@/app/actions/company.actions";

interface Props {
  employeeId: string;
  employeeName: string;
  currentStatus: "active" | "pending" | "suspended";
}

export function ToggleEmployeeStatusButton({ employeeId, employeeName, currentStatus }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [confirm, setConfirm] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // No toggle for pending employees
  if (currentStatus === "pending") return null;

  const isActive = currentStatus === "active";

  async function handleToggle() {
    setLoading(true);
    setError(null);
    const result = isActive
      ? await suspendEmployeeAction(employeeId)
      : await activateEmployeeAction(employeeId);
    setLoading(false);
    if (result.success) {
      router.refresh();
    } else {
      setError(result.error ?? "Failed.");
      // Keep confirm mode open so the error is visible
    }
  }

  if (!confirm) {
    return (
      <button
        onClick={() => { setConfirm(true); setError(null); }}
        className="p-1.5 rounded-lg hover:bg-amber-50 text-ink-light hover:text-amber-600 transition-colors"
        title={isActive ? `Suspend ${employeeName}` : `Reactivate ${employeeName}`}
      >
        {isActive ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
      </button>
    );
  }

  return (
    <div className="flex items-center gap-1">
      {error && <span className="text-[10px] text-red-600 mr-1">{error}</span>}
      <button
        onClick={handleToggle}
        disabled={loading}
        className={`px-2 py-1 text-[10px] font-medium rounded-md text-white transition-colors disabled:opacity-50 ${
          isActive ? "bg-amber-500 hover:bg-amber-600" : "bg-emerald-600 hover:bg-emerald-700"
        }`}
      >
        {loading ? "…" : isActive ? "Suspend" : "Activate"}
      </button>
      <button
        onClick={() => { setConfirm(false); setError(null); }}
        disabled={loading}
        className="px-2 py-1 text-[10px] font-medium rounded-md border border-gray-300 text-ink-light hover:bg-gray-50 transition-colors disabled:opacity-50"
      >
        ✕
      </button>
    </div>
  );
}
