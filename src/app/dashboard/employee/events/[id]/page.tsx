import { Suspense } from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageHeader, TableSkeleton, SectionCard, EmptyState, StatCard } from "@/components/dashboard/DashboardShared";
import { EventStatusBadge } from "@/components/events/EventStatusBadge";
import { EventActions } from "@/components/events/EventActions";
import { DownloadEventButton } from "@/components/events/DownloadEventButton";
import { getEventCapabilities } from "@/lib/supabase/event-access";
import * as eventsService from "@/lib/services/events.service";
import { formatDuration, formatClockTime, formatDate } from "@/lib/utils";

export const metadata: Metadata = { title: "Event" };

interface Props { params: Promise<{ id: string }> }

export default async function EventDetailPage({ params }: Props) {
  const { id } = await params;
  return (
    <>
      <Suspense fallback={<TableSkeleton rows={5} />}>
        <DetailContent id={id} />
      </Suspense>
    </>
  );
}

async function DetailContent({ id }: { id: string }) {
  const caps = await getEventCapabilities();
  if (!caps.hostProfileId) notFound();

  const event = await eventsService.getEventWithHost(id);
  // A host may only open their own event here.
  if (!event || event.host_profile_id !== caps.hostProfileId) notFound();

  const visits = await eventsService.getEventVisits(id);
  const inside = visits.filter((v) => !v.exit_at);
  const stored = await eventsService.getMyEvents(caps.hostProfileId);
  const otherLive = stored.find((e) => e.status === "live" && e.id !== id) ?? null;

  const ended = event.status === "closed" || event.status === "cancelled";

  return (
    <>
      <PageHeader
        eyebrow="Event"
        title={event.title}
        subtitle={event.venue ?? undefined}
        action={<EventStatusBadge status={event.status} />}
      />

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        <StatCard label="Visits"  value={visits.length} icon="👥" />
        <StatCard label="Inside"  value={event.status === "live" ? inside.length : 0} icon="🟢" />
        <StatCard label="Started" value={event.starts_at ? formatClockTime(event.starts_at) : "—"} icon="▶" />
        <StatCard label="Ended"   value={event.ends_at ? formatClockTime(event.ends_at) : "—"} icon="⏹" />
      </div>

      <div className="flex flex-wrap items-center gap-3 mb-6">
        <EventActions
          event={event}
          otherLiveEvent={otherLive ? { id: otherLive.id, title: otherLive.title } : null}
          doorHref={`/dashboard/employee/events/${event.id}/door`}
        />
        {ended && <DownloadEventButton eventId={event.id} />}
      </div>

      {visits.length === 0 ? (
        <EmptyState
          icon="👥"
          title="Nobody has checked in yet"
          description={event.status === "live" ? "Open the door to start scanning." : "This event has no visits recorded."}
        />
      ) : (
        <SectionCard title="Attendance" subtitle={`${visits.length} visit${visits.length === 1 ? "" : "s"}`}>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr>
                  {["Name", "Entry", "Exit", "Duration"].map((h) => (
                    <th key={h} className="px-4 py-3 text-xs font-mono tracking-widest text-ink-light uppercase">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y" style={{ borderColor: "rgba(6,78,59,0.08)" }}>
                {visits.map((v) => (
                  <tr key={v.id} className="hover:bg-emerald-pale/30 transition-colors">
                    <td className="px-4 py-3 text-sm text-ink">
                      {v.full_name}
                      {v.company_name && <p className="text-xs text-ink-light">{v.company_name}</p>}
                    </td>
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
