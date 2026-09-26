import { Suspense } from "react";
import type { Metadata } from "next";
import { PageHeader, TableSkeleton, EmptyState } from "@/components/dashboard/DashboardShared";
import { EventList, toListRow } from "@/components/events/EventList";
import { BulkExportButton } from "@/components/events/BulkExportButton";
import { resolveCompanyId } from "@/lib/supabase/server";
import * as eventsService from "@/lib/services/events.service";

export const metadata: Metadata = { title: "Events" };

export default function CompanyEventsPage() {
  return (
    <>
      <PageHeader
        eyebrow="Company"
        title="Events"
        subtitle="Events run by your team, and their attendance records."
        action={<BulkExportButton />}
      />
      <Suspense fallback={<TableSkeleton rows={4} />}>
        <EventsContent />
      </Suspense>
    </>
  );
}

async function EventsContent() {
  const companyId = await resolveCompanyId();
  if (!companyId) {
    return <EmptyState icon="🏢" title="No company linked" description="Your account isn't linked to a company." />;
  }

  const events = await eventsService.getCompanyEventSummaries(companyId);
  return (
    <EventList
      events={events.map(toListRow)}
      mode="company"
      hrefBase="/dashboard/company/events"
      emptyIcon="📅"
      emptyTitle="No team events yet"
      emptyDescription="When someone on your team hosts an event, it appears here."
    />
  );
}
