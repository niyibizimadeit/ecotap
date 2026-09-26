import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { EventDoorScreen } from "@/components/events/EventDoorScreen";
import { getEventCapabilities } from "@/lib/supabase/event-access";
import * as eventsService from "@/lib/services/events.service";

export const metadata: Metadata = { title: "Door" };

interface Props { params: Promise<{ id: string }> }

export default async function DoorPage({ params }: Props) {
  const { id } = await params;

  const caps = await getEventCapabilities();
  if (!caps.hostProfileId) notFound();

  const event = await eventsService.getEventWithHost(id);
  if (!event || event.host_profile_id !== caps.hostProfileId) notFound();

  // The door only exists while the event is running.
  if (event.status !== "live") redirect(`/dashboard/employee/events/${id}`);

  const inside = await eventsService.getOpenVisitsForHost(id, caps.hostProfileId);

  return (
    <>
      <div className="mb-4 text-center">
        <p className="text-xs font-mono tracking-widest text-ink-light uppercase">Door</p>
        <h1 className="font-serif text-2xl text-emerald-deep">{event.title}</h1>
      </div>
      <EventDoorScreen event={event} initialInside={inside} />
    </>
  );
}
