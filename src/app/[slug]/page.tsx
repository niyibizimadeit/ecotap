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
import { getPublicCard } from "@/app/actions/cards.actions";
import CompanyPublicPage from "@/app/dashboard/company/_components/CompanyPublicPage";
import { PublicCardLayout } from "@/components/cards/PublicCardLayout";

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

  // For individual cards, fetch full card data for richer metadata
  if (result.type === "profile") {
    const cardResult = await getPublicCard(slug);
    if (cardResult.success && cardResult.data) {
      const card = cardResult.data;
      const name = card.profile.full_name;
      const titleStr = card.primary_job_title
        ? `${name} — ${card.primary_job_title}${card.primary_company ? ` at ${card.primary_company.name}` : ""}`
        : name;
      return {
        title: `${titleStr} | EcoTap`,
        description: card.bio ?? `View ${name}'s digital business card on EcoTap.`,
        openGraph: {
          title: titleStr,
          description: card.bio ?? `View ${name}'s digital business card on EcoTap.`,
          url: `https://ecotap.rw/${slug}`,
          type: "profile",
        },
      };
    }
  }

  return { title: "EcoTap" };
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
  // Use the shared getPublicCard which fetches card + profile + company +
  // card_groups in one place, keeping the data layer consistent.
  const cardResult = await getPublicCard(slug);

  if (!cardResult.success || !cardResult.data) notFound();

  return <PublicCardLayout card={cardResult.data} />;
}