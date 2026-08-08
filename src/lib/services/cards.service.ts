// ─────────────────────────────────────────────────────────────────────────────
// Cards service — business logic for card CRUD and public card page rendering.
// Calls repositories only — never queries Supabase directly.
// ─────────────────────────────────────────────────────────────────────────────

import * as cardsRepo from "@/lib/supabase/cards.repo";
import * as profilesRepo from "@/lib/supabase/profiles.repo";
import * as analyticsRepo from "@/lib/supabase/analytics.repo";
import type { ActionResult, Card, CardProfileForm, PublicCard } from "@/types";

// ── Card management ──────────────────────────────────────────────────────────

/**
 * Create a card for a profile. Called automatically when a profile
 * is activated (via trigger), but can also be called manually.
 * Slug defaults to the profile's username.
 */
export async function createCardForProfile(
  profileId: string
): Promise<ActionResult<Card>> {
  const profile = await profilesRepo.getProfileById(profileId);

  if (!profile) return { success: false, error: "Profile not found." };
  if (profile.status !== "active") {
    return { success: false, error: "Cannot create card for non-active profile." };
  }

  // Check if card already exists
  const existing = await cardsRepo.getCardByProfileId(profileId);
  if (existing) return { success: true, data: existing };

  const card = await cardsRepo.createCard({
    profile_id:   profileId,
    slug:         profile.username,
    email_public: profile.email,
  });

  if (!card) return { success: false, error: "Failed to create card." };

  // Log activity
  await analyticsRepo.recordProfileActivity({
    profile_id:    profileId,
    activity_type: "card_edit",
    description:   "Card created",
  });

  return { success: true, data: card };
}

/**
 * Update a card's profile fields. Validates theme_color format.
 * Theme lock (company-enforced) is handled at the application layer
 * because it requires company-subscription context.
 */
export async function updateCard(
  profileId: string,
  data: CardProfileForm
): Promise<ActionResult<Card>> {
  const card = await cardsRepo.getCardByProfileId(profileId);

  if (!card) return { success: false, error: "Card not found." };

  // Validate theme_color format
  if (data.theme_color && !/^#[0-9a-fA-F]{6}$/.test(data.theme_color)) {
    return { success: false, error: "Invalid theme color format. Use #RRGGBB." };
  }

  const updated = await cardsRepo.updateCard(card.id, {
    theme_color:      data.theme_color,
    bio:              data.bio || null,
    job_title:        data.job_title || null,
    phone:            data.phone || null,
    whatsapp:         data.whatsapp || null,
    email_public:     data.email_public || null,
    social_links:     data.social_links,
    show_organization: data.show_organization,
  });

  if (!updated) return { success: false, error: "Failed to update card." };

  // Log activity with what changed
  const changedFields = Object.entries(data).filter(
    ([, v]) => v !== undefined
  );
  await analyticsRepo.recordProfileActivity({
    profile_id:    profileId,
    activity_type: "card_edit",
    description:   `Updated: ${changedFields.map(([k]) => k).join(", ")}`,
    metadata:      { changed: Object.fromEntries(changedFields) },
  });

  return { success: true, data: updated };
}

/**
 * Get the full public card page data by slug.
 * Returns everything needed to render a public card page.
 */
export async function getPublicCard(
  slug: string
): Promise<ActionResult<PublicCard>> {
  const card = await cardsRepo.getPublicCard(slug);

  if (!card) return { success: false, error: "Card not found." };
  if (!card.is_public) return { success: false, error: "This card is private." };

  return { success: true, data: card };
}

/**
 * Get the authenticated user's own card data for editing.
 * Unlike getPublicCard, this works even when the card is not public.
 */
export async function getOwnCard(
  slug: string
): Promise<ActionResult<PublicCard>> {
  const card = await cardsRepo.getPublicCard(slug, { includePrivate: true });

  if (!card) return { success: false, error: "Card not found." };

  return { success: true, data: card };
}
