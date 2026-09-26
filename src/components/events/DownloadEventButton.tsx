// A plain anchor, not a fetch: the export route sets Content-Disposition and
// the browser handles the download natively. No JavaScript required.

interface Props {
  eventId:   string;
  variant?:  "primary" | "quiet";
  label?:    string;
  disabled?: boolean;
}

const BASE =
  "inline-flex items-center gap-2 rounded-xl font-medium transition-all duration-150 active:scale-[0.98]";

export function DownloadEventButton({
  eventId, variant = "primary", label = "Download spreadsheet", disabled,
}: Props) {
  const style = variant === "primary"
    ? { backgroundColor: "#064E3B", color: "#FEFCE8" }
    : { backgroundColor: "#ECFDF5", color: "#065F46" };

  if (disabled) {
    return (
      <span
        className={`${BASE} px-3.5 py-2 text-xs opacity-50 cursor-not-allowed`}
        style={{ backgroundColor: "#F5EDD8", color: "#78716C" }}
        title="This event hasn't finished yet"
      >
        {label}
      </span>
    );
  }

  return (
    <a
      href={`/api/events/${eventId}/export`}
      className={`${BASE} px-3.5 py-2 text-xs hover:opacity-90`}
      style={style}
      download
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
