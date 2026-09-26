import { Suspense } from "react";
import type { Metadata } from "next";
import { PageHeader, TableSkeleton, EmptyState } from "@/components/dashboard/DashboardShared";
import { EventList, toListRow } from "@/components/events/EventList";
import { BulkExportButton } from "@/components/events/BulkExportButton";
import { getEventCapabilities } from "@/lib/supabase/event-access";
import * as eventsService from "@/lib/services/events.service";

export const metadata: Metadata = { title: "Events" };

export default function AdminEventsPage() {
  return (
    <>
      <PageHeader
        eyebrow="Platform"
        title="Events"
        subtitle="Every event across EcoTap."
        action={<BulkExportButton label="Export all events" />}
      />
      <Suspense fallback={<TableSkeleton rows={5} />}>
        <EventsContent />
      </Suspense>
    </>
  );
}

async function EventsContent() {
  const caps = await getEventCapabilities();
  // country_rep sees the list read-only; the export route refuses them.
  const events = await eventsService.getAdminEventSummaries();

  return (
    <EventList
      events={events.map(toListRow)}
      mode="admin"
      hrefBase="/dashboard/admin/events"
      emptyIcon="📅"
      emptyTitle="No events yet"
      emptyDescription="Events hosted by any cardholder appear here."
    />
  );
}
