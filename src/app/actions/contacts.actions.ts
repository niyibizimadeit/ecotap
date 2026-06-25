"use server";

import { getSupabase } from "@/lib/supabase/server";
import * as contactsService from "@/lib/services/contacts.service";
import type { ActionResult, ContactExchange, DeviceType } from "@/types";

// ── Guard ────────────────────────────────────────────────────────────────────

async function getCurrentProfileId(): Promise<string | null> {
  const supabase = await getSupabase();
  const { data: { user } } = await supabase.auth.getUser();
  return user?.id ?? null;
}

// ── Record exchange (public — no auth required) ──────────────────────────────

export async function submitContactExchange(data: {
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
  return contactsService.recordExchange(data);
}

// ── My inbox ─────────────────────────────────────────────────────────────────

export async function getMyInbox(): Promise<ActionResult<ContactExchange[]>> {
  const profileId = await getCurrentProfileId();
  if (!profileId) return { success: false, error: "Not authenticated." };
  return contactsService.getInbox(profileId);
}

// ── Update contact metadata ───────────────────────────────────────────────────

export async function updateContactExchange(
  id: string,
  updates: {
    is_favorite?: boolean;
    lead_level?: string;
    owner_notes?: string | null;
    lead_group?: string | null;
  }
): Promise<ActionResult<ContactExchange>> {
  const profileId = await getCurrentProfileId();
  if (!profileId) return { success: false, error: "Not authenticated." };
  return contactsService.updateExchange(id, profileId, updates);
}
