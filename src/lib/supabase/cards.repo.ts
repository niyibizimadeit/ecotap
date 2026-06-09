// ─────────────────────────────────────────────────────────────────────────────
// Cards repository — SSOT for all cards table queries.
// ─────────────────────────────────────────────────────────────────────────────

import { getSupabase } from "@/lib/supabase/server";
import type { Card, SocialLinks, PublicCard } from "@/types";

// ── Reads ────────────────────────────────────────────────────────────────────

export async function getCardById(id: string): Promise<Card | null> {
  const supabase = await getSupabase();
  const { data } = await supabase
    .from("cards")
    .select("*")
    .eq("id", id)
    .single();
  return data;
}

export async function getCardBySlug(slug: string): Promise<Card | null> {
  const supabase = await getSupabase();
  const { data } = await supabase
    .from("cards")
    .select("*")
    .eq("slug", slug)
    .single();
  return data;
}

export async function getCardByProfileId(
  profileId: string
): Promise<Card | null> {
  const supabase = await getSupabase();
  const { data } = await supabase
    .from("cards")
    .select("*")
    .eq("profile_id", profileId)
    .single();
  return data;
}

/**
 * Full public card page data — card + profile + primary company + all companies.
 * Single query using Supabase joins via foreign key relationships.
 */
export async function getPublicCard(
  slug: string
): Promise<PublicCard | null> {
  const supabase = await getSupabase();

  // Fetch card with profile joined
  const { data: card } = await supabase
    .from("cards")
    .select(`
      *,
      profile:profiles!cards_profile_id_fkey (
        id, username, full_name, email, avatar_url, role
      )
    `)
    .eq("slug", slug)
    .eq("is_public", true)
    .single();

  if (!card) return null;

  // Fetch company associations
  const { data: profileCompanies } = await supabase
    .from("profile_companies")
    .select(`
      is_primary,
      job_title,
      company:companies!profile_companies_company_id_fkey (
        id, name, slug, logo_url, brand_color, theme_locked
      )
    `)
    .eq("profile_id", card.profile_id);

  const allCompanies = (profileCompanies ?? []).map((pc: Record<string, unknown>) => ({
    company:    pc.company as PublicCard["all_companies"][number]["company"],
    job_title:  (pc.job_title as string) ?? null,
    is_primary: (pc.is_primary as boolean) ?? false,
  }));

  const primary = allCompanies.find((c) => c.is_primary) ?? allCompanies[0] ?? null;

  return {
    ...card,
    profile:           card.profile as PublicCard["profile"],
    primary_company:   primary?.company ?? null,
    primary_job_title: primary?.job_title ?? card.job_title ?? null,
    all_companies:     allCompanies,
  } as PublicCard;
}

// ── Writes ───────────────────────────────────────────────────────────────────

export async function createCard(card: {
  profile_id: string;
  slug: string;
  theme_color?: string;
  email_public?: string;
}): Promise<Card | null> {
  const supabase = await getSupabase();
  const { data } = await supabase
    .from("cards")
    .insert({
      profile_id:   card.profile_id,
      slug:         card.slug,
      theme_color:  card.theme_color ?? "#064E3B",
      email_public: card.email_public ?? null,
    })
    .select()
    .single();
  return data;
}

export async function updateCard(
  id: string,
  updates: Partial<
    Pick<
      Card,
      | "theme_color"
      | "bio"
      | "job_title"
      | "phone"
      | "email_public"
      | "social_links"
      | "is_public"
    >
  >
): Promise<Card | null> {
  const supabase = await getSupabase();
  const { data } = await supabase
    .from("cards")
    .update(updates)
    .eq("id", id)
    .select()
    .single();
  return data;
}

export async function deleteCard(id: string): Promise<void> {
  const supabase = await getSupabase();
  await supabase.from("cards").delete().eq("id", id);
}
