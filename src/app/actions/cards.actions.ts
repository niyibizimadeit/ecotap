"use server";

import { getSupabase } from "@/lib/supabase/server";
import * as cardsService from "@/lib/services/cards.service";
import type { ActionResult, PublicCard, Card, CardProfileForm } from "@/types";

// ── Guard ────────────────────────────────────────────────────────────────────

async function getCurrentProfileId(): Promise<string | null> {
  const supabase = await getSupabase();
  const { data: { user } } = await supabase.auth.getUser();
  return user?.id ?? null;
}

// ── Public card ──────────────────────────────────────────────────────────────

export async function getPublicCard(
  slug: string
): Promise<ActionResult<PublicCard>> {
  return cardsService.getPublicCard(slug);
}

// ── Own card ─────────────────────────────────────────────────────────────────

export async function getMyCard(): Promise<ActionResult<PublicCard>> {
  const profileId = await getCurrentProfileId();
  if (!profileId) return { success: false, error: "Not authenticated." };

  const { getSupabase } = await import("@/lib/supabase/server");
  const supabase = await getSupabase();
  const { data: profile } = await supabase
    .from("profiles")
    .select("username")
    .eq("id", profileId)
    .single();

  if (!profile?.username) return { success: false, error: "Profile not found." };
  return cardsService.getPublicCard(profile.username);
}

// ── Update card ─────────────────────────────────────────────────────────────

export async function updateMyCard(
  data: CardProfileForm
): Promise<ActionResult<Card>> {
  const profileId = await getCurrentProfileId();
  if (!profileId) return { success: false, error: "Not authenticated." };
  return cardsService.updateCard(profileId, data);
}
