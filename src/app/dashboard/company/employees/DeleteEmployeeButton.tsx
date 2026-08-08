"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";
import { deleteEmployeeAction } from "@/app/actions/company.actions";

interface Props {
  employeeId: string;
  employeeName: string;
}

export function DeleteEmployeeButton({ employeeId, employeeName }: Props) {
  const router = useRouter();
  const [confirm, setConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleDelete() {
    setDeleting(true);
    setError(null);
    const result = await deleteEmployeeAction(employeeId);
    setDeleting(false);
    if (result.success) {
      router.refresh();
    } else {
      setError(result.error ?? "Failed to delete employee.");
      // Keep confirm mode open so the error is visible
    }
  }

  if (!confirm) {
    return (
      <button
        onClick={() => { setConfirm(true); setError(null); }}
        className="p-1.5 rounded-lg hover:bg-red-50 text-ink-light hover:text-red-500 transition-colors"
        title={`Delete ${employeeName}`}
      >
        <Trash2 className="h-3.5 w-3.5" />
      </button>
    );
  }

  return (
    <div className="flex items-center gap-1">
      {error && <span className="text-[10px] text-red-600 mr-1">{error}</span>}
      <button
        onClick={handleDelete}
        disabled={deleting}
        className="px-2 py-1 text-[10px] font-medium rounded-md bg-red-500 text-white hover:bg-red-600 transition-colors disabled:opacity-50"
      >
        {deleting ? "…" : "Delete"}
      </button>
      <button
        onClick={() => { setConfirm(false); setError(null); }}
        disabled={deleting}
        className="px-2 py-1 text-[10px] font-medium rounded-md border border-gray-300 text-ink-light hover:bg-gray-50 transition-colors disabled:opacity-50"
      >
        ✕
      </button>
    </div>
  );
}
