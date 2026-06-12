// ─────────────────────────────────────────────────────────────────────────────
// Cards repository — SSOT for all cards table queries.
// ─────────────────────────────────────────────────────────────────────────────

import { getSupabase, getServiceSupabase } from "@/lib/supabase/server";
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
 * Uses simple queries to avoid FK-join naming issues.
 */
export async function getPublicCard(
  slug: string
): Promise<PublicCard | null> {
  const supabase = getServiceSupabase();

  // 1. Fetch card
  const { data: card } = await supabase
    .from("cards")
    .select("*")
    .eq("slug", slug)
    .eq("is_public", true)
    .single();

  if (!card) return null;

  // 2. Fetch profile + company associations in parallel
  const [profileResult, pcResult] = await Promise.all([
    supabase
      .from("profiles")
      .select("id, username, full_name, email, avatar_url, role")
      .eq("id", card.profile_id)
      .single(),
    supabase
      .from("profile_companies")
      .select("is_primary, job_title, company_id, department_id")
      .eq("profile_id", card.profile_id),
  ]);

  const profile = profileResult.data;
  if (!profile) return null;

  const profileCompanies = pcResult.data;

  // 3. Fetch companies (if any profile-company links exist)
  let allCompanies: PublicCard["all_companies"] = [];
  let primaryCompany: PublicCard["primary_company"] = null;
  let primaryJobTitle: string | null = null;

  if (profileCompanies && profileCompanies.length > 0) {
    const companyIds = [...new Set(profileCompanies.map((pc: Record<string, unknown>) => pc.company_id))];
    const deptIds = [...new Set(profileCompanies.map((pc: Record<string, unknown>) => pc.department_id).filter(Boolean))];

    const [companiesResult, deptsResult] = await Promise.all([
      supabase.from("companies").select("*").in("id", companyIds as string[]),
      deptIds.length > 0
        ? supabase.from("departments").select("id, name").in("id", deptIds as string[])
        : Promise.resolve({ data: [] }),
    ]);

    const companies = companiesResult.data;
    const departments = deptsResult.data;

    if (companies) {
      const companyMap = new Map(companies.map((c) => [c.id, c]));
      const deptMap = new Map((departments ?? []).map((d) => [d.id, d.name]));

      allCompanies = (profileCompanies as unknown as Array<Record<string, unknown>>)
        .filter((pc) => companyMap.has(pc.company_id as string))
        .map((pc) => ({
          company:    companyMap.get(pc.company_id as string)!,
          job_title:  (pc.job_title as string) ?? null,
          department: deptMap.get(pc.department_id as string) ?? null,
          is_primary: (pc.is_primary as boolean) ?? false,
        })) as unknown as PublicCard["all_companies"];

      const primary = allCompanies.find((c) => c.is_primary) ?? allCompanies[0] ?? null;
      primaryCompany = (primary?.company ?? null) as PublicCard["primary_company"];
      primaryJobTitle = primary?.job_title ?? card.job_title ?? null;
    }
  }

  return {
    ...card,
    profile: {
      id:         profile.id,
      username:   profile.username,
      full_name:  profile.full_name,
      email:      profile.email,
      avatar_url: profile.avatar_url,
      role:       profile.role,
    },
    primary_company:   primaryCompany,
    primary_job_title: primaryJobTitle,
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
      | "show_organization"
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
