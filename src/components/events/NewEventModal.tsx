"use client";

import { useEffect, useRef, useState } from "react";
import { Modal } from "@/components/ui/Modal";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { createEventAction } from "@/app/actions/events.actions";
import { MAX_EVENT_TITLE_LENGTH } from "@/constants";

/** Now, rounded up to the next half hour — the spec's "suggested starting point". */
function defaultStart(): string {
  const d = new Date();
  d.setSeconds(0, 0);
  d.setMinutes(d.getMinutes() < 30 ? 30 : 60);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

interface Props {
  open:     boolean;
  onClose:  () => void;
  onCreated?: () => void;
}

export function NewEventModal({ open, onClose, onCreated }: Props) {
  const [title,   setTitle]   = useState("");
  const [venue,   setVenue]   = useState("");
  const [startAt, setStartAt] = useState(defaultStart);
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState<string | null>(null);

  // Reset on open only — guards against stale form state without re-running
  // on every render.
  const prevOpen = useRef(false);
  useEffect(() => {
    if (open && !prevOpen.current) {
      setTitle("");
      setVenue("");
      setStartAt(defaultStart());
      setError(null);
      setLoading(false);
    }
    prevOpen.current = open;
  }, [open]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (loading) return;

    if (!title.trim()) {
      setError("Give the event a title.");
      return;
    }

    setLoading(true);
    setError(null);

    const result = await createEventAction({
      title: title.trim(),
      venue: venue.trim() || null,
      scheduled_start_at: startAt,
    });

    setLoading(false);

    if (!result.success) {
      setError(result.error ?? "Couldn't create the event.");
      return;
    }

    onCreated?.();
    onClose();
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="New event"
      description="You'll run the door from your own phone."
      size="md"
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        <Input
          label="Event title"
          placeholder="e.g. Annual General Meeting"
          value={title}
          maxLength={MAX_EVENT_TITLE_LENGTH}
          onChange={(e) => setTitle(e.target.value)}
          autoFocus
        />

        <Input
          label="Date and time"
          type="datetime-local"
          value={startAt}
          onChange={(e) => setStartAt(e.target.value)}
          hint="You can go live whenever you're ready — this is just a label."
        />

        <Input
          label="Venue"
          placeholder="Optional"
          value={venue}
          onChange={(e) => setVenue(e.target.value)}
        />

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <div className="flex gap-3 pt-2">
          <Button type="button" variant="secondary" className="flex-1" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" className="flex-1" loading={loading}>
            Create event
          </Button>
        </div>
      </form>
    </Modal>
  );
}
