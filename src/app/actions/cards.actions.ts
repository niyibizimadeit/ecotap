"use server";

import { getSupabase, getServiceSupabase } from "@/lib/supabase/server";
import * as cardsService from "@/lib/services/cards.service";
import type { ActionResult, PublicCard, Card, CardProfileForm } from "@/types";

// ── Public card ──────────────────────────────────────────────────────────────

export async function getPublicCard(
  slug: string
): Promise<ActionResult<PublicCard>> {
  return cardsService.getPublicCard(slug);
}

// ── Own card ─────────────────────────────────────────────────────────────────

export async function getMyCard(): Promise<ActionResult<PublicCard>> {
  const supabase = await getSupabase();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { success: false, error: "Not authenticated." };

  const { data: profile } = await supabase
    .from("profiles")
    .select("username")
    .eq("id", user.id)
    .single();

  if (!profile?.username) return { success: false, error: "Profile not found." };
  return cardsService.getPublicCard(profile.username);
}

// ── Update card ─────────────────────────────────────────────────────────────

export async function updateMyCard(
  data: CardProfileForm & { full_name?: string; company?: string }
): Promise<ActionResult<Card>> {
  const supabase = await getSupabase();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { success: false, error: "Not authenticated." };

  // 1. Update profile full_name if provided
  if (data.full_name?.trim()) {
    const serviceClient = getServiceSupabase();
    await serviceClient
      .from("profiles")
      .update({ full_name: data.full_name.trim() })
      .eq("id", user.id);
  }

  // 2. Update card fields
  const cardResult = await cardsService.updateCard(user.id, {
    job_title:    data.job_title,
    phone:        data.phone,
    email_public: data.email_public,
    bio:          data.bio,
    theme_color:  data.theme_color,
    social_links: data.social_links,
  });

  if (!cardResult.success) return cardResult;

  // 2. Handle company association if provided
  if (data.company?.trim()) {
    const companyName = data.company.trim();
    const serviceClient = getServiceSupabase();

    // Find or create the company (status: pending — requires admin approval)
    let companyId: string;
    const { data: existing } = await serviceClient
      .from("companies")
      .select("id")
      .ilike("name", companyName)
      .single();

    if (existing) {
      companyId = existing.id;
    } else {
      const slug = companyName
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(-+)/g, "-")       // collapse consecutive hyphens
        .replace(/(^-|-$)/g, "");
      const { data: created } = await serviceClient
        .from("companies")
        .insert({ name: companyName, slug, status: "pending" })  // MUST be pending — admin must approve
        .select("id")
        .single();
      if (!created) return { success: false, error: "Failed to create company." };
      companyId = created.id;
    }

    // Check if already linked
    const { data: existingLink } = await serviceClient
      .from("profile_companies")
      .select("id")
      .eq("profile_id", user.id)
      .eq("company_id", companyId)
      .single();

    if (!existingLink) {
      // Check if this is the user's first company (make it primary)
      const { data: allLinks } = await serviceClient
        .from("profile_companies")
        .select("id")
        .eq("profile_id", user.id);

      const isPrimary = !allLinks || allLinks.length === 0;

      await serviceClient
        .from("profile_companies")
        .insert({
          profile_id: user.id,
          company_id: companyId,
          job_title:  data.job_title || null,
          is_primary: isPrimary,
        });
    }
  }

  return cardResult;
}
