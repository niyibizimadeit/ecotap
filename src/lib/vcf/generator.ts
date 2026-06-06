import type { PublicCard } from "@/types";

/**
 * Generates a vCard 3.0 string from a PublicCard object.
 * Used by the /api/vcf/[slug] route and the "Save contact" button.
 */
export function generateVcf(card: PublicCard): string {
  const { profile, company, job_title, phone, social_links, bio } = card;

  const lines: string[] = [
    "BEGIN:VCARD",
    "VERSION:3.0",
    `FN:${profile.full_name}`,
    `N:${profile.full_name.split(" ").slice(1).join(" ")};${profile.full_name.split(" ")[0]};;;`,
  ];

  if (job_title) lines.push(`TITLE:${job_title}`);
  if (company)   lines.push(`ORG:${company.name}`);
  if (phone)     lines.push(`TEL;TYPE=CELL:${phone}`);
  if (profile.email) lines.push(`EMAIL:${profile.email}`);

  if (social_links.website)  lines.push(`URL:${social_links.website}`);
  if (social_links.linkedin) lines.push(`X-SOCIALPROFILE;type=linkedin:${social_links.linkedin}`);
  if (social_links.twitter)  lines.push(`X-SOCIALPROFILE;type=twitter:${social_links.twitter}`);

  if (bio) {
    // vCard NOTE field — fold long lines at 75 chars
    const note = `NOTE:${bio.replace(/\n/g, "\\n")}`;
    lines.push(foldLine(note));
  }

  // Card URL
  const slug = card.slug;
  const cardUrl = company
    ? `https://ecotap.rw/${company.slug}/${profile.username}`
    : `https://ecotap.rw/${profile.username}`;
  lines.push(`URL;type=EcoTap:${cardUrl}`);

  lines.push(`REV:${new Date().toISOString()}`);
  lines.push("END:VCARD");

  return lines.join("\r\n");
}

/** Fold vCard lines longer than 75 octets per RFC 6350 */
function foldLine(line: string): string {
  if (line.length <= 75) return line;
  const chunks: string[] = [];
  chunks.push(line.slice(0, 75));
  let i = 75;
  while (i < line.length) {
    chunks.push(" " + line.slice(i, i + 74));
    i += 74;
  }
  return chunks.join("\r\n");
}

/** Triggers a browser download of the .vcf file */
export function downloadVcf(card: PublicCard): void {
  const vcf  = generateVcf(card);
  const blob = new Blob([vcf], { type: "text/vcard;charset=utf-8" });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement("a");
  a.href     = url;
  a.download = `${card.profile.username}.vcf`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}