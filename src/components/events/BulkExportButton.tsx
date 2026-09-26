// Same anchor pattern as DownloadEventButton — scope is resolved server-side
// from the caller's capabilities, never from a query parameter.

interface Props {
  label?: string;
}

export function BulkExportButton({ label = "Download all as ZIP" }: Props) {
  return (
    <a
      href="/api/events/export"
      download
      className="inline-flex items-center gap-2 rounded-xl border px-3.5 py-2 text-xs font-medium transition-all duration-150 hover:bg-emerald-pale active:scale-[0.98]"
      style={{ borderColor: "rgba(6,78,59,0.15)", color: "#065F46", backgroundColor: "#FEFCE8" }}
    >
      <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
           strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
        <polyline points="7 10 12 15 17 10" />
        <line x1="12" y1="15" x2="12" y2="3" />
      </svg>
      {label}
    </a>
  );
}
