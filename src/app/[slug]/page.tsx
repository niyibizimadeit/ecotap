// src/app/[slug]/page.tsx
//
// Handles both individual card pages (ecotap.rw/[username])
// and company landing pages (ecotap.rw/[company-slug]).
//
// Resolution order:
//   1. Active profile with matching username → render individual card
//   2. Active company with matching slug     → render company page
//   3. Neither                               → not-found

import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { resolveSlug } from "@/app/actions/public.actions";
import CompanyPublicPage from "@/app/dashboard/company/_components/CompanyPublicPage";

// ── Individual card imports (your existing component) ─────────────────────────
// Keep whatever you already import for the individual card render.
// Adjust this import path to match your actual file location.
import { PublicCardLayout } from "@/components/cards/PublicCardLayout";
import { getServiceSupabase } from "@/lib/supabase/server";

// ─── Page ─────────────────────────────────────────────────────────────────────

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const result = await resolveSlug(slug);

  if (result.type === "company") {
    const { name, industry, description } = result.data;
    return {
      title: `${name}${industry ? ` — ${industry}` : ""} on EcoTap`,
      description: description ?? `Meet the team at ${name}.`,
    };
  }

  // Individual card metadata is handled downstream; return a safe default here
  return {
    title: "EcoTap",
  };
}

export default async function SlugPage({ params }: Props) {
  const { slug } = await params;
  const result = await resolveSlug(slug);

  if (result.type === "not_found") {
    notFound();
  }

  if (result.type === "company") {
    return <CompanyPublicPage company={result.data} />;
  }

  // ── Individual profile card ────────────────────────────────────────────────
  // Fetch the full card data for the individual profile and render your
  // existing PublicCardLayout. Adjust this block to match however your
  // current individual card page fetches its data.
  const service = getServiceSupabase();

  const { data: profile } = await service
    .from("profiles")
    .select("id, full_name, avatar_url, username")
    .eq("username", slug)
    .eq("status", "active")
    .single();

  if (!profile) notFound();

  const { data: card } = await service
    .from("cards")
    .select("*")
    .eq("profile_id", profile.id)
    .eq("is_public", true)
    .single();

  if (!card) notFound();

  // Fetch primary company for the badge (optional)
  const { data: companyLink } = await service
    .from("profile_companies")
    .select("job_title, department_id, company:companies(name, logo_url, brand_color, slug, social_links)")
    .eq("profile_id", profile.id)
    .eq("is_primary", true)
    .maybeSingle();

  const companyData = Array.isArray(companyLink?.company) ? companyLink!.company[0] : companyLink?.company;
  const primaryCompany = companyData
    ? {
        name:         (companyData as Record<string, string>).name ?? "",
        logo_url:     (companyData as Record<string, string | null>).logo_url ?? null,
        brand_color:  (companyData as Record<string, string>).brand_color ?? "#064E3B",
        slug:         (companyData as Record<string, string>).slug ?? "",
        social_links: (companyData as Record<string, unknown>).social_links ?? null,
        job_title:    (companyLink!.job_title as string) ?? null,
        department:   (companyLink!.department_id as string) ?? null,
      }
    : null;

  // Build a PublicCard object for the existing layout
  const publicCard = {
    ...card,
    profile: {
      id:         profile.id,
      username:   profile.username,
      full_name:  profile.full_name,
      email:      card.email_public ?? "",
      avatar_url: profile.avatar_url,
      role:       "individual" as const,
    },
    primary_company: primaryCompany
      ? {
          id:           "",
          name:         primaryCompany.name,
          slug:         primaryCompany.slug,
          logo_url:     primaryCompany.logo_url ?? null,
          brand_color:  primaryCompany.brand_color ?? "#064E3B",
          theme_locked: false,
          social_links: primaryCompany.social_links as Record<string, string> | null,
        }
      : null,
    primary_job_title: primaryCompany?.job_title ?? card.job_title ?? null,
    all_companies:     [],
  };

  return <PublicCardLayout card={publicCard} />;
}