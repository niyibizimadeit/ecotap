import Link from "next/link";
import type { PublicCard } from "@/types";
import { SocialIconRow }      from "./SocialIconRow";
import { SaveContactButton }  from "./SaveContactButton";
import { ContactExchangeForm } from "./ContactExchangeForm";
import { getInitials }        from "@/lib/utils";
import { BrandIcon } from "@/components/brand/BrandIcon";
import { Building2 } from "lucide-react";

interface PublicCardLayoutProps {
  card: PublicCard;
}

export function PublicCardLayout({ card }: PublicCardLayoutProps) {
  const { profile, primary_company: company, primary_job_title: job_title, phone, whatsapp, bio, social_links, theme_color } = card;
  const accent   = theme_color  ?? "#064E3B";
  const initials = getInitials(profile.full_name);

  return (
    <div className="grain-bg min-h-screen bg-ivory flex flex-col">

      {/* ── Top colour band ── */}
      <div className="h-40 relative flex-shrink-0 overflow-hidden" style={{ backgroundColor: accent }}>
        {/* Dot-grid texture */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.08) 1px, transparent 1px)",
            backgroundSize: "20px 20px",
          }}
        />
        {/* Fade to page bg at bottom */}
        <div
          className="absolute bottom-0 inset-x-0 h-16"
          style={{ background: `linear-gradient(to bottom, transparent, #FEFCE8)` }}
        />
      </div>

      {/* ── Card content ── */}
      <div className="flex-1 max-w-md mx-auto w-full px-5 pb-16 -mt-16 relative">

        {/* Avatar floated over the band */}
        <div className="flex items-end justify-between mb-5">
          <div
            className="w-24 h-24 rounded-3xl border-4 flex items-center justify-center shadow-card-lg flex-shrink-0 overflow-hidden"
            style={{ backgroundColor: profile.avatar_url ? "#FEFCE8" : accent, borderColor: "#FEFCE8" }}
          >
            {profile.avatar_url ? (
              <img
                src={profile.avatar_url}
                alt={profile.full_name}
                width={96}
                height={96}
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="font-serif text-3xl font-semibold" style={{ color: "#FEFCE8" }}>
                {initials}
              </span>
            )}
          </div>

        </div>

        {/* Name & title */}
        <div className="mb-5">
          <h1 className="font-serif text-display-sm text-emerald-deep mb-1 leading-tight">
            {profile.full_name}
          </h1>
          {/* Only show job title when show_organization is off AND no company */}
          {job_title && !(company && card.show_organization) && (
            <p className="text-sm font-medium text-ink-mid">{job_title}</p>
          )}
          {/* Show company + primary job title only when show_organization is ON */}
          {company && card.show_organization && (
            <div className="mt-1.5 space-y-1">
              <div className="flex items-center gap-1.5">
                <Building2 className="h-3.5 w-3.5 flex-shrink-0" style={{ color: accent }} />
                <p className="text-sm font-medium" style={{ color: accent }}>{company.name}</p>
                <span className="text-[10px] px-1.5 py-px rounded-full" style={{ backgroundColor: accent, color: "#FEFCE8" }}>org</span>
              </div>
              {card.primary_job_title && (
                <p className="text-xs text-ink-light ml-5">{card.primary_job_title}</p>
              )}
            </div>
          )}
          {/* When show_organization is OFF: show nothing for company — it is hidden */}
        </div>

        {/* Contact row */}
        {(phone || whatsapp) && (
          <div className="mb-5 space-y-3">
            {phone && (
              <a
                href={`tel:${phone}`}
                className="flex items-center gap-2 text-sm font-medium py-1 transition-colors hover:text-emerald-mid"
                style={{ color: accent }}
              >
                <PhoneIcon />
                {phone}
              </a>
            )}
            {whatsapp && whatsapp !== phone && (
              <a
                href={`https://wa.me/${whatsapp.replace(/\D/g, "")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm font-medium py-1 transition-colors hover:opacity-80"
                style={{ color: "#25D366" }}
              >
                <WhatsAppIcon />
                {whatsapp}
              </a>
            )}
          </div>
        )}

        {/* Bio */}
        {bio && (
          <div
            className="rounded-2xl p-5 mb-5 border"
            style={{ backgroundColor: "#FEF9EF", borderColor: "rgba(6,78,59,0.08)" }}
          >
            <p className="text-sm text-ink-mid leading-relaxed">{bio}</p>
          </div>
        )}

        {/* Social links */}
        {Object.values(social_links).some(Boolean) && (
          <div className="mb-5">
            <p className="text-xs font-mono tracking-widest text-ink-light uppercase mb-3">Connect</p>
            <SocialIconRow links={social_links} accentColor={accent} />
          </div>
        )}

        {/* Company social links (when org display is on) */}
        {card.show_organization && company?.social_links && Object.values(company.social_links).some(Boolean) && (
          <div className="mb-5">
            <p className="text-xs font-mono tracking-widest text-ink-light uppercase mb-3">
              {company.name}
            </p>
            <SocialIconRow links={company.social_links} accentColor={accent} />
          </div>
        )}

        {/* Card groups (additional affiliations) */}
        {card.card_groups?.filter(g => g.show_on_card).map((group, i) => (
          <div key={group.id ?? i} className="mb-4">
            <div className="flex items-center gap-1.5 mb-1">
              <Building2 className="h-3.5 w-3.5 flex-shrink-0" style={{ color: accent }} />
              <p className="text-sm font-medium" style={{ color: accent }}>{group.organization_name}</p>
              <span className="text-[10px] px-1.5 py-px rounded-full" style={{ backgroundColor: accent, color: "#FEFCE8" }}>org</span>
            </div>
            {group.job_title && (
              <p className="text-xs text-ink-light ml-5">{group.job_title}</p>
            )}
            {/* Group social links */}
            {Object.values(group.social_links).some(Boolean) && (
              <div className="mt-2 ml-5">
                <SocialIconRow links={group.social_links} accentColor={accent} />
              </div>
            )}
          </div>
        ))}

        {/* Divider */}
        <div className="h-px bg-cream-dark mb-5" />

        {/* Save contact CTA */}
        <div className="mb-3">
          <SaveContactButton card={card} accentColor={accent} />
        </div>

        {/* Contact exchange form */}
        <ContactExchangeForm
          cardId={card.id}
          accentColor={accent}
          ownerName={profile.full_name}
        />

        {/* EcoTap attribution */}
        <div className="mt-10 text-center">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs text-ink-light hover:text-emerald-bright transition-colors"
          >
            <BrandIcon className="w-3.5 h-3.5" />
            <span className="text-ink-light">Powered by <strong>Eco</strong>Tap</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

/* ── Inline SVG icons ── */

function PhoneIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 8.81 19.79 19.79 0 01.11 2.18 2 2 0 012.11 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/>
    </svg>
  );
}

function WhatsAppIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
    </svg>
  );
}
