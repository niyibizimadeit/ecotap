// Presentational event list. Server-safe (no hooks) — the only client piece it
// renders is EventActions, and only in "host" mode.
//
// Dual rendering: a real table on desktop, stacked cards on mobile. This
// mirrors the convention used by the employees and orders pages.

import { SectionCard, EmptyState } from "@/components/dashboard/DashboardShared";
import { Avatar } from "@/components/ui/Avatar";
import { EventStatusBadge } from "./EventStatusBadge";
import { DownloadEventButton } from "./DownloadEventButton";
import { EventActions } from "./EventActions";
import { formatDate, formatClockTime } from "@/lib/utils";
import type { EcoEvent, EcoEventWithHost } from "@/types";

export interface EventListRow extends EcoEvent {
  visitCount?:  number;
  insideCount?: number;
  host?: { full_name: string; username: string; avatar_url: string | null } | null;
}

/** Adapt a host-joined event (snake_case counts) to the list row shape. */
export function toListRow(e: EcoEventWithHost): EventListRow {
  return { ...e, visitCount: e.visit_count ?? 0, insideCount: e.inside_count ?? 0 };
}

interface Props {
  events:     EventListRow[];
  mode:       "host" | "company" | "admin";
  hrefBase:   string;
  /** The host's own currently-live event, for the "going live closes it" prompt. */
  liveEvent?: { id: string; title: string } | null;
  emptyIcon?: string;
  emptyTitle?: string;
  emptyDescription?: string;
}

/** An event can only be exported once it has ended. */
function isExportable(e: EcoEvent): boolean {
  return e.status === "closed" || e.status === "cancelled";
}

export function EventList({
  events, mode, hrefBase, liveEvent,
  emptyIcon = "📅",
  emptyTitle = "No events yet",
  emptyDescription = "Create an event, then run the door from your phone.",
}: Props) {
  if (events.length === 0) {
    return <EmptyState icon={emptyIcon} title={emptyTitle} description={emptyDescription} />;
  }

  const showHost = mode !== "host";

  return (
    <SectionCard
      title={`${events.length} event${events.length === 1 ? "" : "s"}`}
      subtitle={mode === "host" ? "Events you host" : undefined}
    >
      {/* ── Desktop ── */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr>
              {[
                { label: "Event",   className: "" },
                { label: "Status",  className: "" },
                ...(showHost ? [{ label: "Host", className: "" }] : []),
                { label: "Date",    className: "" },
                { label: "Visits",  className: "" },
                { label: "Inside",  className: "" },
                { label: "",        className: "text-right" },
              ].map((col, i) => (
                <th
                  key={i}
                  className={`px-4 py-3 text-xs font-mono tracking-widest text-ink-light uppercase ${col.className}`}
                >
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y" style={{ borderColor: "rgba(6,78,59,0.08)" }}>
            {events.map((e) => (
              <tr key={e.id} className="hover:bg-emerald-pale/30 transition-colors">
                <td className="px-4 py-3">
                  <a
                    href={`${hrefBase}/${e.id}`}
                    className="font-medium text-ink hover:text-emerald-bright transition-colors"
                  >
                    {e.title}
                  </a>
                  {e.venue && <p className="text-xs text-ink-light mt-0.5">{e.venue}</p>}
                </td>
                <td className="px-4 py-3"><EventStatusBadge status={e.status} /></td>
                {showHost && (
                  <td className="px-4 py-3">
                    {e.host ? (
                      <div className="flex items-center gap-2">
                        <Avatar src={e.host.avatar_url} name={e.host.full_name} size="xs" />
                        <span className="text-sm text-ink-mid">{e.host.full_name}</span>
                      </div>
                    ) : (
                      <span className="text-sm text-ink-light">—</span>
                    )}
                  </td>
                )}
                <td className="px-4 py-3 text-sm text-ink-mid whitespace-nowrap">
                  {formatDate(e.starts_at ?? e.scheduled_start_at)}
                  {(e.starts_at ?? e.scheduled_start_at) && (
                    <span className="text-ink-light ml-1.5">
                      {formatClockTime(e.starts_at ?? e.scheduled_start_at)}
                    </span>
                  )}
                </td>
                <td className="px-4 py-3 text-sm text-ink-mid">{e.visitCount ?? 0}</td>
                <td className="px-4 py-3 text-sm">
                  {e.status === "live" ? (
                    <span className="font-medium text-emerald-deep">{e.insideCount ?? 0}</span>
                  ) : (
                    <span className="text-ink-light">—</span>
                  )}
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-2">
                    {mode === "host" ? (
                      <EventActions
                        event={e}
                        otherLiveEvent={liveEvent && liveEvent.id !== e.id ? liveEvent : null}
                        doorHref={`${hrefBase}/${e.id}/door`}
                        compact
                      />
                    ) : null}
                    {isExportable(e) && <DownloadEventButton eventId={e.id} variant={mode === "host" ? "quiet" : "primary"} />}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ── Mobile ── */}
      <div className="md:hidden space-y-3">
        {events.map((e) => (
          <div
            key={e.id}
            className="rounded-2xl border p-4"
            style={{ backgroundColor: "#FEFCE8", borderColor: "rgba(6,78,59,0.08)" }}
          >
            <div className="flex items-start justify-between gap-3 mb-2">
              <a
                href={`${hrefBase}/${e.id}`}
                className="font-medium text-ink hover:text-emerald-bright transition-colors"
              >
                {e.title}
              </a>
              <EventStatusBadge status={e.status} />
            </div>

            {showHost && e.host && (
              <div className="flex items-center gap-2 mb-3">
                <Avatar src={e.host.avatar_url} name={e.host.full_name} size="xs" />
                <span className="text-xs text-ink-mid">{e.host.full_name}</span>
              </div>
            )}

            <div className="space-y-1.5 mb-3">
              <Row label="Date"   value={formatDate(e.starts_at ?? e.scheduled_start_at)} />
              <Row label="Time"   value={formatClockTime(e.starts_at ?? e.scheduled_start_at)} />
              <Row label="Visits" value={String(e.visitCount ?? 0)} />
              {e.status === "live" && <Row label="Inside" value={String(e.insideCount ?? 0)} />}
            </div>

            <div className="flex flex-wrap items-center gap-2 pt-3 border-t" style={{ borderColor: "rgba(6,78,59,0.08)" }}>
              {mode === "host" && (
                <EventActions
                  event={e}
                  otherLiveEvent={liveEvent && liveEvent.id !== e.id ? liveEvent : null}
                  doorHref={`${hrefBase}/${e.id}/door`}
                  compact
                />
              )}
              {isExportable(e) && <DownloadEventButton eventId={e.id} variant={mode === "host" ? "quiet" : "primary"} />}
            </div>
          </div>
        ))}
      </div>
    </SectionCard>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center gap-2 text-sm">
      <span className="w-14 text-xs font-mono tracking-wide text-ink-light uppercase">{label}</span>
      <span className="text-ink-mid">{value}</span>
    </div>
  );
}
