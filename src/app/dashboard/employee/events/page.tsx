import { Suspense } from "react";
import type { Metadata } from "next";
import { PageHeader, TableSkeleton, EmptyState } from "@/components/dashboard/DashboardShared";
import { NewEventButton } from "@/components/events/NewEventButton";
import { EventList } from "@/components/events/EventList";
import { getEventCapabilities } from "@/lib/supabase/event-access";
import * as eventsService from "@/lib/services/events.service";

export const metadata: Metadata = { title: "Events" };

export default function EventsPage() {
  return (
    <>
      <PageHeader
        eyebrow="Host"
        title="Events"
        subtitle="Run the door from your phone and export who came."
        action={<NewEventButton />}
      />
      <Suspense fallback={<TableSkeleton rows={4} />}>
        <EventsContent />
      </Suspense>
    </>
  );
}

async function EventsContent() {
  const caps = await getEventCapabilities();

  if (!caps.hostProfileId) {
    return (
      <EmptyState
        icon="📅"
        title="Hosting isn't available on this account"
        description="You need a card to host an event."
      />
    );
  }

  const events = await eventsService.getMyEvents(caps.hostProfileId);
  const live = events.find((e) => e.status === "live") ?? null;

  return (
    <EventList
      events={events}
      mode="host"
      hrefBase="/dashboard/employee/events"
      liveEvent={live ? { id: live.id, title: live.title } : null}
    />
  );
}
