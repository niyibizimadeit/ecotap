// ─────────────────────────────────────────────────────────────────────────────
// Cards repository — SSOT for all cards table queries.
// ─────────────────────────────────────────────────────────────────────────────

import { getSupabase, getServiceSupabase } from "@/lib/supabase/server";
import type { Card, SocialLinks, PublicCard, CardGroup } from "@/types";

// ── Reads ────────────────────────────────────────────────────────────────────

export async function getCardById(id: string): Promise<Card | null> {
  const supabase = await getSupabase();
  // Explicitly load the session — @supabase/ssr does not auto-initialize auth context.
  await supabase.auth.getSession();
  const { data } = await supabase
    .from("cards")
    .select("*")
    .eq("id", id)
    .single();
  return data;
}

export async function getCardBySlug(slug: string): Promise<Card | null> {
  const supabase = await getSupabase();
  await supabase.auth.getSession();
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
  await supabase.auth.getSession();
  const { data } = await supabase
    .from("cards")
    .select("*")
    .eq("profile_id", profileId)
    .single();
  return data;
}

/**
 * Full public card page data — card + profile + primary company + all companies.
 * Set includePrivate to true when loading the authenticated user's own card
 * for editing (skips the is_public filter).
 */
export async function getPublicCard(
  slug: string,
  options?: { includePrivate?: boolean }
): Promise<PublicCard | null> {
  const supabase = getServiceSupabase();
  const includePrivate = options?.includePrivate ?? false;

  // 1. Fetch card
  let cardQuery = supabase
    .from("cards")
    .select("*")
    .eq("slug", slug);

  if (!includePrivate) {
    cardQuery = cardQuery.eq("is_public", true);
  }

  const { data: card } = await cardQuery.single();

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

  // 4. Fetch card groups
  const { data: cardGroups, error: groupsError } = await supabase
    .from("card_groups")
    .select("*")
    .eq("card_id", card.id)
    .order("sort_order", { ascending: true });

  if (groupsError) {
    console.error("getPublicCard: failed to fetch card_groups:", groupsError);
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
    card_groups:       (cardGroups as CardGroup[]) ?? [],
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
  await supabase.auth.getSession();
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
  await supabase.auth.getSession();
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
  await supabase.auth.getSession();
  await supabase.from("cards").delete().eq("id", id);
}

// ── Admin / service-role operations ────────────────────────────────────────────

/** Get card by profile_id using service role (bypasses RLS for admin use) */
export async function getCardByProfileIdService(profileId: string): Promise<Card | null> {
  const supabase = getServiceSupabase();
  const { data } = await supabase
    .from("cards")
    .select("*")
    .eq("profile_id", profileId)
    .maybeSingle();
  return data;
}

/** Delete card using service role (bypasses RLS for admin use) */
export async function deleteCardService(id: string): Promise<void> {
  const supabase = getServiceSupabase();
  await supabase.from("cards").delete().eq("id", id);
}

// ── Card Groups ───────────────────────────────────────────────────

export async function getCardGroups(cardId: string): Promise<CardGroup[]> {
  const supabase = getServiceSupabase();
  const { data } = await supabase
    .from("card_groups")
    .select("*")
    .eq("card_id", cardId)
    .order("sort_order", { ascending: true });
  return (data as CardGroup[]) ?? [];
}

export async function upsertCardGroup(
  cardId: string,
  group: {
    id?: string;
    organization_name: string;
    job_title?: string | null;
    social_links: SocialLinks;
    show_on_card: boolean;
    sort_order: number;
  }
): Promise<CardGroup | null> {
  const supabase = getServiceSupabase();
  const payload = {
    card_id: cardId,
    organization_name: group.organization_name,
    job_title: group.job_title ?? null,
    social_links: group.social_links as unknown as Record<string, unknown>,
    show_on_card: group.show_on_card,
    sort_order: group.sort_order,
  };

  if (group.id) {
    const { data } = await supabase
      .from("card_groups")
      .update(payload)
      .eq("id", group.id)
      .select()
      .single();
    return data as CardGroup | null;
  } else {
    const { data } = await supabase
      .from("card_groups")
      .insert(payload)
      .select()
      .single();
    return data as CardGroup | null;
  }
}

export async function deleteCardGroup(id: string): Promise<void> {
  const supabase = getServiceSupabase();
  await supabase.from("card_groups").delete().eq("id", id);
}

/** Replace all groups for a card atomically — deletes existing and inserts new ones. */
export async function syncCardGroups(
  cardId: string,
  groups: Array<{
    id?: string;
    organization_name: string;
    job_title?: string | null;
    social_links: SocialLinks;
    show_on_card: boolean;
  }>,
  supabaseClient?: Awaited<ReturnType<typeof getSupabase>>
): Promise<{ success: boolean; error?: string }> {
  const supabase = supabaseClient ?? await getSupabase();

  // CRITICAL: With @supabase/ssr skipAutoInitialize, we must explicitly load
  // the session before making DB requests. Without this, the client acts as
  // anonymous and RLS policies that check auth.uid() will fail silently.
  if (!supabaseClient) {
    await supabase.auth.getSession();
  }

  // Delete all existing groups for this card
  const { error: deleteError } = await supabase
    .from("card_groups")
    .delete()
    .eq("card_id", cardId);

  if (deleteError) {
    console.error("syncCardGroups delete error:", deleteError);
    return { success: false, error: deleteError.message };
  }

  // Insert the new set
  if (groups.length > 0) {
    const rows = groups.map((g, i) => ({
      card_id: cardId,
      organization_name: g.organization_name,
      job_title: g.job_title ?? null,
      social_links: g.social_links as unknown as Record<string, unknown>,
      show_on_card: g.show_on_card,
      sort_order: i,
    }));

    const { error: insertError } = await supabase
      .from("card_groups")
      .insert(rows);

    if (insertError) {
      console.error("syncCardGroups insert error:", insertError);
      return { success: false, error: insertError.message };
    }
  }

  return { success: true };
}
