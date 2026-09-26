"use client";

import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { formatDuration } from "@/lib/utils";
import type { VisitAttendee } from "@/types";

interface Props {
  open:          boolean;
  attendee:      VisitAttendee | null;
  sinceEntryMs:  number;
  busy?:         boolean;
  onConfirm:     () => void;
  onIgnore:      () => void;
}

/**
 * The second tap inside the ambiguity window writes nothing — this asks the
 * host which of the two things just happened.
 *
 * Deliberately never auto-dismisses on a timer. If the host walks away, the
 * visit stays open, which is the correct state: that person is still inside.
 */
export function ConfirmExitPrompt({
  open, attendee, sinceEntryMs, busy, onConfirm, onIgnore,
}: Props) {
  return (
    <Modal
      open={open}
      onClose={onIgnore}
      title="Leaving, or an accidental tap?"
      description={
        attendee
          ? `${attendee.fullName} checked in ${formatDuration(sinceEntryMs)} ago.`
          : undefined
      }
      size="sm"
    >
      <div className="flex flex-col gap-2 pt-2">
        <Button variant="primary" className="w-full" loading={busy} onClick={onConfirm}>
          They&apos;re leaving — record exit
        </Button>
        <Button variant="secondary" className="w-full" disabled={busy} onClick={onIgnore}>
          Accidental tap — keep checked in
        </Button>
      </div>
    </Modal>
  );
}
