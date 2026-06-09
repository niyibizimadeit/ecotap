"use client";

import { useEffect, useRef } from "react";
import { recordPageView } from "@/app/actions/analytics.actions";

type PageViewTrackerProps = {
  cardId: string;
};

export function PageViewTracker({ cardId }: PageViewTrackerProps) {
  const fired = useRef(false);

  useEffect(() => {
    if (fired.current) return;
    fired.current = true;

    // Fire-and-forget — never blocks the page render
    recordPageView(cardId);
  }, [cardId]);

  return null;
}
