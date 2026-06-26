"use server";

import { cache } from "react";
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
 *
 * Wrapped in React cache() — deduplicates calls from generateMetadata()
 * and the page component that happen in the same HTTP request.
 */
export const resolveSlug = cache(async (
  slug: string
): Promise<
  | { type: "profile" }
  | { type: "company"; data: PublicCompanyData }
  | { type: "not_found" }
> => {
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

  // Fetch active employees for this company with their card data.
  // Capped at 100 to keep the company public page fast — pagination can be added later.
  const MAX_EMPLOYEES = 100;
  const { data: links } = await service
    .from("profile_companies")
    .select("profile_id, job_title")
    .eq("company_id", company.id)
    .limit(MAX_EMPLOYEES);

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

    // Build lookup maps for O(1) access instead of O(n²) with .find()
    const cardsByProfileId = new Map(cards.map((c) => [c.profile_id, c]));
    const linksByProfileId = new Map((links ?? []).map((l) => [l.profile_id, l]));

    employees = profiles.map((p) => {
      const card = cardsByProfileId.get(p.id);
      const link = linksByProfileId.get(p.id);
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
});