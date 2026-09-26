import { Badge } from "@/components/ui/Badge";
import { EVENT_STATUS_LABELS } from "@/constants";
import type { EventStatus } from "@/types";

/** Status is displayed as a badge; "live" gets the emerald variant. */
const VARIANT: Record<EventStatus, "live" | "pending" | "active" | "draft"> = {
  scheduled: "pending",
  live:      "live",
  closed:    "active",
  cancelled: "draft",
};

export function EventStatusBadge({ status }: { status: EventStatus }) {
  return <Badge variant={VARIANT[status]}>{EVENT_STATUS_LABELS[status]}</Badge>;
}
