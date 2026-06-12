"use server";

import { getSupabase, getServiceSupabase } from "@/lib/supabase/server";
import * as cardsService from "@/lib/services/cards.service";
import { updateCompanySocialLinks } from "@/lib/supabase/companies.repo";
import type { ActionResult, PublicCard, Card, CardProfileForm, SocialLinks } from "@/types";

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
  data: CardProfileForm & {
    full_name?: string;
    company?: string;
    department?: string;
    company_social_links?: SocialLinks;
  }
): Promise<ActionResult<Card>> {
  const supabase = await getSupabase();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { success: false, error: "Not authenticated." };

  const serviceClient = getServiceSupabase();

  // 1. Update profile full_name if provided
  if (data.full_name?.trim()) {
    await serviceClient
      .from("profiles")
      .update({ full_name: data.full_name.trim() })
      .eq("id", user.id);
  }

  // 2. Update card fields (includes show_organization toggle)
  const cardResult = await cardsService.updateCard(user.id, {
    job_title:         data.job_title,
    phone:             data.phone,
    email_public:      data.email_public,
    bio:               data.bio,
    theme_color:       data.theme_color,
    social_links:      data.social_links,
    show_organization: data.show_organization,
  });

  if (!cardResult.success) return cardResult;

  // 3. Handle company association if provided
  if (data.company?.trim()) {
    const companyName = data.company.trim();

    // Find or create the company
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
        .replace(/(-+)/g, "-")
        .replace(/(^-|-$)/g, "");
      const { data: created } = await serviceClient
        .from("companies")
        .insert({ name: companyName, slug, status: "pending" })
        .select("id")
        .single();
      if (!created) return { success: false, error: "Failed to create company." };
      companyId = created.id;
    }

    // Check if already linked via profile_companies
    const { data: existingLink } = await serviceClient
      .from("profile_companies")
      .select("id")
      .eq("profile_id", user.id)
      .eq("company_id", companyId)
      .single();

    if (existingLink) {
      // Update existing link with latest job_title and department
      await serviceClient
        .from("profile_companies")
        .update({
          job_title: data.job_title || null,
          department_id: data.department || null,
        })
        .eq("id", existingLink.id);
    } else {
      // Create new link
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

    // 4. Update company social links if provided
    if (data.company_social_links) {
      await updateCompanySocialLinks(companyId, data.company_social_links);
    }
  }

  return cardResult;
}
