"use server";

import { getServiceSupabase } from "@/lib/supabase/server";

/**
 * Record a card page view. Fire-and-forget from client components.
 * Uses service role because public visitors aren't authenticated.
 */
export async function recordPageView(cardId: string): Promise<void> {
  try {
    const supabase = getServiceSupabase();
    await supabase.from("card_events").insert({
      card_id:    cardId,
      event_type: "view",
      source:     "direct",
      device_type: "unknown",
    });
  } catch {
    // Silently fail — analytics must never block the page
  }
}
