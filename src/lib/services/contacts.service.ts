// ─────────────────────────────────────────────────────────────────────────────
// Contacts service — visitor contact exchange recording and inbox retrieval.
// Calls repositories only — never queries Supabase directly.
// ─────────────────────────────────────────────────────────────────────────────

import * as exchangesRepo from "@/lib/supabase/contact_exchanges.repo";
import * as analyticsRepo from "@/lib/supabase/analytics.repo";
import * as cardsRepo from "@/lib/supabase/cards.repo";
import type { ActionResult, ContactExchange, DeviceType } from "@/types";

// ── Exchange recording ───────────────────────────────────────────────────────

export async function recordExchange(data: {
  card_id: string;
  visitor_name: string;
  visitor_email?: string;
  visitor_phone?: string;
  visitor_organization?: string;
  message?: string;
  event_id?: string;
  device_type?: DeviceType;
  referrer?: string;
  country?: string;
}): Promise<ActionResult<ContactExchange>> {
  // Validate: must have at least one contact method
  if (!data.visitor_email && !data.visitor_phone) {
    return {
      success: false,
      error: "At least one contact method (email or phone) is required.",
    };
  }

  const exchange = await exchangesRepo.createExchange({
    card_id:              data.card_id,
    visitor_name:         data.visitor_name,
    visitor_email:        data.visitor_email,
    visitor_phone:        data.visitor_phone,
    visitor_organization: data.visitor_organization,
    message:              data.message,
    event_id:             data.event_id,
    device_type:          data.device_type,
    referrer:             data.referrer,
    country:              data.country,
  });

  if (!exchange) return { success: false, error: "Failed to record contact exchange." };

  // Also record the analytics event
  await analyticsRepo.recordEvent({
    card_id:    data.card_id,
    event_type: "contact_exchange",
    session_id: exchange.id, // Use exchange ID to link
    source:     "direct",
    referrer:   data.referrer,
    device_type: data.device_type ?? "unknown",
    country:    data.country,
  });

  return { success: true, data: exchange };
}

// ── Inbox retrieval ──────────────────────────────────────────────────────────

/**
 * Get all contact exchanges submitted by visitors for a card owner's cards.
 * This is the employee dashboard inbox.
 */
export async function getInbox(
  profileId: string
): Promise<ActionResult<ContactExchange[]>> {
  const exchanges = await exchangesRepo.getExchangesByProfileId(profileId);
  return { success: true, data: exchanges };
}

/**
 * Get all contact exchanges for a specific card.
 */
export async function getCardExchanges(
  cardId: string
): Promise<ActionResult<ContactExchange[]>> {
  const exchanges = await exchangesRepo.getExchangesByCardId(cardId);
  return { success: true, data: exchanges };
}

/**
 * Delete a contact exchange entry.
 */
export async function deleteExchange(
  id: string
): Promise<ActionResult<void>> {
  await exchangesRepo.deleteExchange(id);
  return { success: true };
}

/**
 * Update contact exchange metadata (favorite, lead level, notes, group).
 * Validates that the exchange belongs to a card owned by the given profile.
 */
export async function updateExchange(
  id: string,
  profileId: string,
  updates: {
    is_favorite?: boolean;
    lead_level?: string;
    owner_notes?: string | null;
    lead_group?: string | null;
  }
): Promise<ActionResult<ContactExchange>> {
  // Verify ownership: get the exchange, then check its card belongs to this profile
  const exchange = await exchangesRepo.getExchangeById(id);
  if (!exchange) return { success: false, error: "Contact not found." };

  // Get the card to verify ownership
  const card = await cardsRepo.getCardById(exchange.card_id);
  if (!card || card.profile_id !== profileId) {
    return { success: false, error: "You do not own this contact." };
  }

  const updated = await exchangesRepo.updateExchange(id, updates);
  if (!updated) return { success: false, error: "Failed to update contact." };

  return { success: true, data: updated };
}
