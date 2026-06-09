"use server";

import { getServiceSupabase } from "@/lib/supabase/server";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface PublicEmployee {
  username: string;
  full_name: string;
  avatar_url: string | null;
  job_title: string;
  theme_color: string;
}

export interface PublicCompanyData {
  id: string;
  name: string;
  slug: string;
  logo_url: string | null;
  brand_color: string;
  industry: string | null;
  website: string | null;
  description: string | null;
  employees: PublicEmployee[];
}

// ─── Reads ────────────────────────────────────────────────────────────────────

/**
 * Used by app/[slug]/page.tsx to determine what to render.
 * Returns "profile" if the slug matches a profile username,
 * "company" if it matches a company slug, or "not_found".
 */
export async function resolveSlug(
  slug: string
): Promise<
  | { type: "profile" }
  | { type: "company"; data: PublicCompanyData }
  | { type: "not_found" }
> {
  const service = getServiceSupabase();

  // Check profile first — the common case, and profiles have a unique username index
  const { data: profile } = await service
    .from("profiles")
    .select("id")
    .eq("username", slug)
    .eq("status", "active")
    .maybeSingle();

  if (profile) return { type: "profile" };

  // Check companies
  const { data: company } = await service
    .from("companies")
    .select("id, name, slug, logo_url, brand_color, industry, website, description")
    .eq("slug", slug)
    .eq("status", "active")
    .maybeSingle();

  if (!company) return { type: "not_found" };

  // Fetch all active employees for this company with their card data
  const { data: links } = await service
    .from("profile_companies")
    .select("profile_id, job_title")
    .eq("company_id", company.id);

  const profileIds = (links ?? []).map((l) => l.profile_id);

  let employees: PublicEmployee[] = [];

  if (profileIds.length > 0) {
    const [profilesResult, cardsResult] = await Promise.all([
      service
        .from("profiles")
        .select("id, full_name, username, avatar_url, status")
        .in("id", profileIds)
        .eq("status", "active"),
      service
        .from("cards")
        .select("profile_id, theme_color, job_title, is_public")
        .in("profile_id", profileIds)
        .eq("is_public", true),
    ]);

    const profiles = profilesResult.data ?? [];
    const cards = cardsResult.data ?? [];

    employees = profiles.map((p) => {
      const card = cards.find((c) => c.profile_id === p.id);
      const link = (links ?? []).find((l) => l.profile_id === p.id);
      return {
        username: p.username,
        full_name: p.full_name,
        avatar_url: p.avatar_url ?? null,
        // card job_title takes precedence, then the profile_companies job_title
        job_title: card?.job_title ?? (link?.job_title as string) ?? "",
        theme_color: card?.theme_color ?? company.brand_color ?? "#064E3B",
      };
    });
  }

  return {
    type: "company",
    data: {
      id: company.id,
      name: company.name,
      slug: company.slug,
      logo_url: company.logo_url ?? null,
      brand_color: company.brand_color ?? "#064E3B",
      industry: company.industry ?? null,
      website: company.website ?? null,
      description: company.description ?? null,
      employees,
    },
  };
}