import { NextResponse } from "next/server";
import { generateVcf } from "@/lib/vcf/generator";
import { MOCK_INDIVIDUAL_CARD, MOCK_EMPLOYEE_CARD } from "@/lib/mock/cards";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function GET(_req: Request, { params }: Props) {
  const { slug } = await params;

  // Phase 12: replace with real DB fetch
  // const card = await getPublicCardBySlug(slug);
  // if (!card) return NextResponse.json({ error: "Not found" }, { status: 404 });

  // Mock: return whichever mock matches, else 404
  const card =
    slug === MOCK_INDIVIDUAL_CARD.slug ? MOCK_INDIVIDUAL_CARD :
    slug === MOCK_EMPLOYEE_CARD.slug   ? MOCK_EMPLOYEE_CARD   :
    null;

  if (!card) {
    return NextResponse.json({ error: "Card not found" }, { status: 404 });
  }

  const vcf = generateVcf(card);

  return new NextResponse(vcf, {
    status: 200,
    headers: {
      "Content-Type":        "text/vcard; charset=utf-8",
      "Content-Disposition": `attachment; filename="${card.profile.username}.vcf"`,
      "Cache-Control":       "no-store",
    },
  });
}