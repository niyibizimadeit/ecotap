"use client";

import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import {
  checkInTapAction, resolveVisitExitAction, recordManualExitAction, closeEventAction,
} from "@/app/actions/events.actions";
import { formatDuration, formatClockTime } from "@/lib/utils";
import { NfcTapPanel } from "./NfcTapPanel";
import { QrScanPanel } from "./QrScanPanel";
import { ConfirmExitPrompt } from "./ConfirmExitPrompt";
import { InsideNowList } from "./InsideNowList";
import type { EcoEvent, EventVisit, VisitAttendee } from "@/types";

// ── Band state ───────────────────────────────────────────────────────────────

type Band =
  | { kind: "idle" }
  | { kind: "entry";   name: string; at: string }
  | { kind: "exit";    name: string; durationMs: number }
  | { kind: "info";    name: string; sinceEntryMs: number }
  | { kind: "error";   message: string };

const ERROR_COPY: Record<string, string> = {
  UNPARSEABLE:    "Couldn't read that code — it doesn't look like an EcoTap card.",
  NOT_FOUND:      "Card not recognised — no account with that username.",
  NO_CARD:        "That account doesn't have a card yet.",
  INACTIVE:       "That account isn't active yet.",
  SUSPENDED:      "That account is suspended.",
  EVENT_NOT_LIVE: "This event is no longer live.",
  FORBIDDEN:      "You're not the host of this event.",
};

// Web NFC is a browser capability, so it is read with useSyncExternalStore
// rather than a mount effect: the server snapshot is `false`, so the first
// client render matches the server and there is no hydration mismatch.
const subscribeToNothing = () => () => {};
const getNfcSnapshot = () => typeof window !== "undefined" && "NDEFReader" in window;
const getNfcServerSnapshot = () => false;

const BAND_STYLE: Record<Band["kind"], { bg: string; fg: string }> = {
  idle:  { bg: "#FEF9EF", fg: "#44403C" },
  entry: { bg: "#ECFDF5", fg: "#064E3B" },
  exit:  { bg: "#F5EDD8", fg: "#1C1917" },
  info:  { bg: "#FEF3C7", fg: "#92400E" },
  error: { bg: "#FEF2F2", fg: "#B91C1C" },
};

interface Props {
  event:         EcoEvent;
  initialInside: EventVisit[];
}

export function EventDoorScreen({ event, initialInside }: Props) {
  const router = useRouter();

  const [band, setBand]         = useState<Band>({ kind: "idle" });
  const [inside, setInside]     = useState<EventVisit[]>(initialInside);
  const [pending, setPending]   = useState<{ visit: EventVisit; attendee: VisitAttendee; sinceEntryMs: number } | null>(null);
  const [mode, setMode]         = useState<"nfc" | "qr">("nfc");
  const [busy, setBusy]         = useState(false);
  const [exitBusyId, setExitBusyId] = useState<string | null>(null);
  const [confirmClose, setConfirmClose] = useState(false);
  const [now, setNow]           = useState(() => Date.now());

  // Keep elapsed times in the roster roughly current without thrashing.
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 30_000);
    return () => clearInterval(id);
  }, []);

  // ── Band with auto-fade ────────────────────────────────────────────────────
  const fadeRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const showBand = useCallback((next: Band, fade = true) => {
    if (fadeRef.current) clearTimeout(fadeRef.current);
    setBand(next);
    if (fade) {
      fadeRef.current = setTimeout(() => setBand({ kind: "idle" }), 3000);
    }
  }, []);

  useEffect(() => () => { if (fadeRef.current) clearTimeout(fadeRef.current); }, []);

  // ── A tap or scan ──────────────────────────────────────────────────────────
  const inFlight = useRef(false);

  const handleScan = useCallback(async (raw: string, method: "nfc" | "qr") => {
    // Drop taps while a request is outstanding. Double-taps are the common
    // case at a door, and the server would otherwise see a burst.
    if (inFlight.current) return;
    inFlight.current = true;

    try {
      const result = await checkInTapAction(event.id, { raw, method });

      if (!result.success || !result.data) {
        const code = result.error ?? "";
        showBand({ kind: "error", message: ERROR_COPY[code] ?? "Couldn't record that. Try again." });
        return;
      }

      const { outcome } = result.data;

      switch (outcome.kind) {
        case "entry":
          setInside((list) => [outcome.visit, ...list]);
          showBand({ kind: "entry", name: outcome.attendee.fullName, at: formatClockTime(outcome.visit.entry_at) });
          break;

        case "exit":
          setInside((list) => list.filter((v) => v.id !== outcome.visit.id));
          showBand({ kind: "exit", name: outcome.attendee.fullName, durationMs: outcome.durationMs });
          break;

        case "already_inside":
          showBand({ kind: "info", name: outcome.attendee.fullName, sinceEntryMs: outcome.sinceEntryMs });
          break;

        case "confirm_exit":
          // Writes nothing — the host decides. The elapsed time is captured
          // here so the prompt never calls Date.now() during render.
          setPending({
            visit: outcome.visit,
            attendee: outcome.attendee,
            sinceEntryMs: outcome.sinceEntryMs,
          });
          break;
      }
    } finally {
      inFlight.current = false;
    }
  }, [event.id, showBand]);

  // ── Resolving the prompt ───────────────────────────────────────────────────
  async function decide(decision: "confirm" | "ignore") {
    if (!pending || busy) return;
    setBusy(true);

    const result = await resolveVisitExitAction({ visitId: pending.visit.id, decision });
    setBusy(false);

    if (!result.success || !result.data) {
      showBand({ kind: "error", message: "Couldn't update that visit. Try again." });
      return;
    }

    const { outcome } = result.data;

    if (outcome.kind === "already_inside") {
      showBand({ kind: "info", name: outcome.attendee.fullName, sinceEntryMs: outcome.sinceEntryMs });
    } else if (outcome.kind === "exit") {
      setInside((list) => list.filter((v) => v.id !== outcome.visit.id));
      showBand({ kind: "exit", name: outcome.attendee.fullName, durationMs: outcome.durationMs });
    }

    setPending(null);
  }

  // ── Manual exit from the roster ────────────────────────────────────────────
  async function manualExit(visitId: string) {
    setExitBusyId(visitId);
    const result = await recordManualExitAction(visitId);
    setExitBusyId(null);

    if (!result.success || !result.data) {
      showBand({ kind: "error", message: "Couldn't record that exit. Try again." });
      return;
    }
    const { outcome } = result.data;
    if (outcome.kind === "exit") {
      setInside((list) => list.filter((v) => v.id !== outcome.visit.id));
      showBand({ kind: "exit", name: outcome.attendee.fullName, durationMs: outcome.durationMs });
    }
  }

  // ── Close the event ────────────────────────────────────────────────────────
  async function closeEvent() {
    setBusy(true);
    const result = await closeEventAction({ eventId: event.id, mode: "close" });
    setBusy(false);

    if (!result.success) {
      showBand({ kind: "error", message: result.error ?? "Couldn't close the event." });
      return;
    }
    router.push(`/dashboard/employee/events/${event.id}`);
    router.refresh();
  }

  // Only Android Chrome has Web NFC. Rather than flipping `mode` from an
  // effect (which would render twice and could mismatch on hydration), the
  // effective mode is derived — a phone without NFC simply can never be in
  // NFC mode.
  const hasNfc       = useSyncExternalStore(subscribeToNothing, getNfcSnapshot, getNfcServerSnapshot);
  const effectiveMode = hasNfc ? mode : "qr";

  const style = BAND_STYLE[band.kind];

  return (
    <div className="max-w-lg mx-auto">
      {/* ── Status band — the one thing that must be unmissable ── */}
      <div
        className="rounded-2xl border p-6 mb-4 flex flex-col justify-center transition-colors duration-200"
        style={{ backgroundColor: style.bg, borderColor: "rgba(6,78,59,0.10)", minHeight: 180 }}
        role="status"
        aria-live="assertive"
      >
        <BandContent band={band} />
      </div>

      {/* ── Scan controls ── */}
      <div className="mb-4">
        {effectiveMode === "qr" ? (
          <QrScanPanel onScan={handleScan} onClose={() => setMode("nfc")} />
        ) : (
          <div className="space-y-3">
            <NfcTapPanel
              onScan={handleScan}
              onError={(message) => showBand({ kind: "error", message })}
            />
            <Button variant="secondary" size="sm" className="w-full" onClick={() => setMode("qr")}>
              Scan QR instead
            </Button>
          </div>
        )}
      </div>

      {/* ── Roster ── */}
      <div className="mb-6">
        <InsideNowList visits={inside} now={now} busyId={exitBusyId} onExit={manualExit} />
      </div>

      {/* ── Ending ── */}
      <div className="text-center">
        <button
          type="button"
          onClick={() => setConfirmClose(true)}
          className="text-sm text-ink-light hover:text-ink-mid underline-offset-4 hover:underline transition-colors"
        >
          Close event
        </button>
      </div>

      <ConfirmExitPrompt
        open={pending !== null}
        attendee={pending?.attendee ?? null}
        sinceEntryMs={pending?.sinceEntryMs ?? 0}
        busy={busy}
        onConfirm={() => decide("confirm")}
        onIgnore={() => decide("ignore")}
      />

      <Modal
        open={confirmClose}
        onClose={() => setConfirmClose(false)}
        title="Close this event?"
        description={`${inside.length} ${inside.length === 1 ? "person is" : "people are"} still inside. They'll be given an exit time equal to now.`}
        size="sm"
      >
        <div className="flex gap-3 pt-2">
          <Button variant="secondary" className="flex-1" onClick={() => setConfirmClose(false)}>
            Keep going
          </Button>
          <Button variant="primary" className="flex-1" loading={busy} onClick={closeEvent}>
            Close event
          </Button>
        </div>
      </Modal>
    </div>
  );
}

function BandContent({ band }: { band: Band }) {
  switch (band.kind) {
    case "idle":
      return (
        <div className="text-center">
          <p className="font-serif text-2xl text-ink-mid">Ready</p>
          <p className="text-sm text-ink-light mt-1">Tap a card or scan a code to check someone in.</p>
        </div>
      );
    case "entry":
      return (
        <div className="text-center">
          <p className="text-xs font-mono tracking-widest text-emerald-bright uppercase mb-2">Checked in</p>
          <p className="font-serif text-3xl text-emerald-deep leading-tight">{band.name}</p>
          <p className="text-sm text-ink-mid mt-2">Entry recorded at {band.at}</p>
        </div>
      );
    case "exit":
      return (
        <div className="text-center">
          <p className="text-xs font-mono tracking-widest text-ink-light uppercase mb-2">Checked out</p>
          <p className="font-serif text-3xl text-ink leading-tight">{band.name}</p>
          <p className="text-sm text-ink-mid mt-2">Visited for {formatDuration(band.durationMs)}</p>
        </div>
      );
    case "info":
      return (
        <div className="text-center">
          <p className="text-xs font-mono tracking-widest uppercase mb-2" style={{ color: "#92400E" }}>
            Still checked in
          </p>
          <p className="font-serif text-2xl leading-tight" style={{ color: "#92400E" }}>{band.name}</p>
          <p className="text-sm mt-2" style={{ color: "#92400E" }}>
            Inside for {formatDuration(band.sinceEntryMs)}
          </p>
        </div>
      );
    case "error":
      return (
        <div className="text-center">
          <p className="text-xs font-mono tracking-widest uppercase mb-2">Not recorded</p>
          <p className="text-base font-medium leading-snug">{band.message}</p>
          <p className="text-xs text-ink-light mt-2">Nothing was saved. The next tap will work.</p>
        </div>
      );
  }
}
