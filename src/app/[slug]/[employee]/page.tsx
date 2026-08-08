import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PublicCardLayout } from "@/components/cards/PublicCardLayout";
import { PageViewTracker } from "@/components/analytics/PageViewTracker";
import { getPublicCard } from "@/app/actions/cards.actions";

interface Props {
  params: Promise<{ slug: string; employee: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { employee } = await params;
  const result = await getPublicCard(employee);

  if (!result.success || !result.data) {
    return { title: "Card not found" };
  }

  const card = result.data;
  const name     = card.profile.full_name;
  const titleStr = card.job_title
    ? `${name} — ${card.job_title} at ${card.primary_company?.name}`
    : name;

  return {
    title: titleStr,
    description: card.bio ?? `View ${name}'s digital business card on EcoTap.`,
    openGraph: {
      title: titleStr,
      description: card.bio ?? `View ${name}'s digital business card on EcoTap.`,
      url: `https://ecotap.rw/${result.data.primary_company?.slug || employee}/${employee}`,
      type: "profile",
    },
  };
}

export default async function EmployeeCardPage({ params }: Props) {
  const { employee } = await params;
  const result = await getPublicCard(employee);

  if (!result.success || !result.data) notFound();

  return (
    <>
      <PageViewTracker cardId={result.data.id} />
      <PublicCardLayout card={result.data} />
    </>
  );
}
