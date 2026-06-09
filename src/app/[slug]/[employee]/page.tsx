import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PublicCardLayout } from "@/components/cards/PublicCardLayout";
import { MOCK_EMPLOYEE_CARD } from "@/lib/mock/cards";

interface Props {
  params: Promise<{ slug: string; employee: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug, employee } = await params;

  // Phase 12: replace with real DB fetch
  const card =
    slug === MOCK_EMPLOYEE_CARD.primary_company?.slug &&
    employee === MOCK_EMPLOYEE_CARD.profile.username
      ? MOCK_EMPLOYEE_CARD
      : null;

  if (!card) return { title: "Card not found | EcoTap" };

  const name     = card.profile.full_name;
  const titleStr = card.job_title
    ? `${name} — ${card.job_title} at ${card.primary_company?.name}`
    : name;

  return {
    title: `${titleStr} | EcoTap`,
    description: card.bio ?? `View ${name}'s digital business card on EcoTap.`,
    openGraph: {
      title: titleStr,
      description: card.bio ?? `View ${name}'s digital business card on EcoTap.`,
      url: `https://ecotap.rw/${slug}/${employee}`,
      type: "profile",
    },
  };
}

export default async function EmployeeCardPage({ params }: Props) {
  const { slug, employee } = await params;

  // Phase 12: replace with real DB fetch
  const card =
    slug === MOCK_EMPLOYEE_CARD.primary_company?.slug &&
    employee === MOCK_EMPLOYEE_CARD.profile.username
      ? MOCK_EMPLOYEE_CARD
      : null;

  if (!card) notFound();

  return <PublicCardLayout card={card} />;
}