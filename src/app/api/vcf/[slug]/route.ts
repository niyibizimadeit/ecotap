import { NextResponse } from "next/server";
import { generateVcf } from "@/lib/vcf/generator";
import { getPublicCard } from "@/app/actions/cards.actions";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function GET(_req: Request, { params }: Props) {
  const { slug } = await params;
  const result = await getPublicCard(slug);

  if (!result.success || !result.data) {
    return NextResponse.json({ error: "Card not found" }, { status: 404 });
  }

  const card = result.data;
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
