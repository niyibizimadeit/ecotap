import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PublicCardLayout } from "@/components/cards/PublicCardLayout";
import { MOCK_INDIVIDUAL_CARD, MOCK_EMPLOYEE_CARD } from "@/lib/mock/cards";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;

  // Phase 12: replace with real DB fetch
  // Try individual card first, then company
  const card =
    slug === MOCK_INDIVIDUAL_CARD.profile.username ? MOCK_INDIVIDUAL_CARD :
    slug === MOCK_EMPLOYEE_CARD.primary_company?.slug ? null : // company slug → no card at this level
    null;

  if (!card) {
    return { title: "Card not found | EcoTap" };
  }

  const name      = card.profile.full_name;
  const titleStr  = card.job_title ? `${name} — ${card.job_title}` : name;

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

export default async function SlugPage({ params }: Props) {
  const { slug } = await params;

  // Phase 12: replace with real fetch
  // 1. Try individual card / freelancer by username
  // 2. If slug matches a company, redirect to company overview (future feature)
  const card =
    slug === MOCK_INDIVIDUAL_CARD.profile.username ? MOCK_INDIVIDUAL_CARD : null;

  if (!card) notFound();

  return <PublicCardLayout card={card} />;
}