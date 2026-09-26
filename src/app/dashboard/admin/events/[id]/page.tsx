import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageHeader, SectionCard, StatCard, EmptyState } from "@/components/dashboard/DashboardShared";
import { EventStatusBadge } from "@/components/events/EventStatusBadge";
import { DownloadEventButton } from "@/components/events/DownloadEventButton";
import { getEventCapabilities } from "@/lib/supabase/event-access";
import * as eventsService from "@/lib/services/events.service";
import { formatDuration, formatClockTime } from "@/lib/utils";

export const metadata: Metadata = { title: "Event" };

interface Props { params: Promise<{ id: string }> }

export default async function AdminEventDetailPage({ params }: Props) {
  const { id } = await params;

  const caps = await getEventCapabilities();
  if (!caps.authenticated) notFound();

  const event = await eventsService.getEventWithHost(id);
  if (!event) notFound();

  const visits = await eventsService.getEventVisits(id);
  const ended = event.status === "closed" || event.status === "cancelled";

  return (
    <>
      <PageHeader
        eyebrow={event.host?.full_name ?? "Event"}
        title={event.title}
        subtitle={event.venue ?? undefined}
        action={<EventStatusBadge status={event.status} />}
      />

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        <StatCard label="Visits"  value={visits.length} icon="👥" />
        <StatCard label="Host"    value={event.host?.full_name ?? "—"} icon="🎤" />
        <StatCard label="Started" value={event.starts_at ? formatClockTime(event.starts_at) : "—"} icon="▶" />
        <StatCard label="Ended"   value={event.ends_at ? formatClockTime(event.ends_at) : "—"} icon="⏹" />
      </div>

      <div className="mb-6">
        {/* country_rep is read-only across the whole admin dashboard, and
            export is data egress — the route enforces this too. */}
        {caps.isCountryRep ? (
          <p className="text-xs text-ink-light">
            Country representatives have read-only access and can&apos;t export attendance data.
          </p>
        ) : (
          <>
            <DownloadEventButton eventId={event.id} disabled={!ended} />
            {!ended && <p className="text-xs text-ink-light mt-2">Available once the event has ended.</p>}
          </>
        )}
      </div>

      {visits.length === 0 ? (
        <EmptyState icon="👥" title="No visits recorded" />
      ) : (
        <SectionCard title="Attendance" subtitle={`${visits.length} visit${visits.length === 1 ? "" : "s"}`}>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr>
                  {["Name", "Company", "Entry", "Exit", "Duration"].map((h) => (
                    <th key={h} className="px-4 py-3 text-xs font-mono tracking-widest text-ink-light uppercase">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y" style={{ borderColor: "rgba(6,78,59,0.08)" }}>
                {visits.map((v) => (
                  <tr key={v.id} className="hover:bg-emerald-pale/30 transition-colors">
                    <td className="px-4 py-3 text-sm text-ink">{v.full_name}</td>
                    <td className="px-4 py-3 text-sm text-ink-mid">{v.company_name ?? "—"}</td>
                    <td className="px-4 py-3 text-sm text-ink-mid">{formatClockTime(v.entry_at)}</td>
                    <td className="px-4 py-3 text-sm text-ink-mid">
                      {v.exit_at ? formatClockTime(v.exit_at) : <span className="text-emerald-bright">inside</span>}
                    </td>
                    <td className="px-4 py-3 text-sm text-ink-mid">
                      {v.exit_at ? formatDuration(Date.parse(v.exit_at) - Date.parse(v.entry_at)) : "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </SectionCard>
      )}
    </>
  );
}
