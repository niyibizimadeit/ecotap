"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { goLiveAction, closeEventAction } from "@/app/actions/events.actions";
import type { EcoEvent } from "@/types";

interface Props {
  event: EcoEvent;
  /** The host's other live event, if any — going live closes it first. */
  otherLiveEvent?: { id: string; title: string } | null;
  /** Where to send the host once the door opens. */
  doorHref: string;
  compact?: boolean;
}

export function EventActions({ event, otherLiveEvent, doorHref, compact }: Props) {
  const router = useRouter();
  const [busy, setBusy]         = useState(false);
  const [error, setError]       = useState<string | null>(null);
  const [confirm, setConfirm]   = useState<null | "goLive" | "close" | "cancel">(null);

  const size = compact ? "sm" : "md";

  async function run(fn: () => Promise<{ success: boolean; error?: string }>) {
    setBusy(true);
    setError(null);
    const result = await fn();
    setBusy(false);
    setConfirm(null);
    if (!result.success) {
      setError(result.error ?? "Something went wrong.");
      return;
    }
    router.refresh();
  }

  const handleGoLive = () =>
    run(async () => {
      const result = await goLiveAction({
        eventId: event.id,
        closeLiveEventId: otherLiveEvent?.id ?? null,
      });
      if (result.success) router.push(doorHref);
      return result;
    });

  // ── Scheduled ─────────────────────────────────────────────────────────────
  if (event.status === "scheduled") {
    return (
      <>
        <Button
          variant="primary"
          size={size}
          loading={busy}
          onClick={() => (otherLiveEvent ? setConfirm("goLive") : handleGoLive())}
        >
          Go live
        </Button>
        {error && <ErrorLine message={error} />}

        <Modal
          open={confirm === "goLive"}
          onClose={() => setConfirm(null)}
          title="Close your other event?"
          description={`"${otherLiveEvent?.title ?? "Your other event"}" is still live. Starting this one will close it and give everyone still inside an exit time.`}
          size="sm"
        >
          <div className="flex gap-3 pt-2">
            <Button variant="secondary" className="flex-1" onClick={() => setConfirm(null)}>
              Keep it open
            </Button>
            <Button variant="primary" className="flex-1" loading={busy} onClick={handleGoLive}>
              Close and start
            </Button>
          </div>
        </Modal>
      </>
    );
  }

  // ── Live ──────────────────────────────────────────────────────────────────
  if (event.status === "live") {
    return (
      <>
        <div className="flex flex-wrap items-center gap-2">
          <Button variant="primary" size={size} onClick={() => router.push(doorHref)}>
            Open the door
          </Button>
          <Button variant="secondary" size={size} onClick={() => setConfirm("close")}>
            Close
          </Button>
          <Button variant="ghost" size={size} onClick={() => setConfirm("cancel")}>
            Cancel
          </Button>
        </div>
        {error && <ErrorLine message={error} />}

        <Modal
          open={confirm === "close"}
          onClose={() => setConfirm(null)}
          title="Close this event?"
          description="Anyone still inside gets an exit time equal to the close. The attendance sheet becomes available afterwards."
          size="sm"
        >
          <div className="flex gap-3 pt-2">
            <Button variant="secondary" className="flex-1" onClick={() => setConfirm(null)}>
              Not yet
            </Button>
            <Button
              variant="primary"
              className="flex-1"
              loading={busy}
              onClick={() => run(() => closeEventAction({ eventId: event.id, mode: "close" }))}
            >
              Close event
            </Button>
          </div>
        </Modal>

        <Modal
          open={confirm === "cancel"}
          onClose={() => setConfirm(null)}
          title="Cancel this event?"
          description="Everyone who already checked in is kept in the record — nothing is discarded. The event stays in your list."
          size="sm"
        >
          <div className="flex gap-3 pt-2">
            <Button variant="secondary" className="flex-1" onClick={() => setConfirm(null)}>
              Keep going
            </Button>
            <Button
              variant="danger"
              className="flex-1"
              loading={busy}
              onClick={() => run(() => closeEventAction({ eventId: event.id, mode: "cancel" }))}
            >
              Cancel event
            </Button>
          </div>
        </Modal>
      </>
    );
  }

  return null;
}

function ErrorLine({ message }: { message: string }) {
  return (
    <p className="text-xs text-red-700 mt-2" role="alert">
      {message}
    </p>
  );
}
