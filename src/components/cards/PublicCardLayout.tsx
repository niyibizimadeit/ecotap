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
  const { profile, primary_company: company, primary_job_title: job_title, phone, bio, social_links, theme_color } = card;
  const accent   = theme_color  ?? "#064E3B";
  const initials = getInitials(profile.full_name);

  return (
    <div className="min-h-screen bg-ivory flex flex-col">

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
              <img src={profile.avatar_url} alt={profile.full_name} className="w-full h-full object-cover" />
            ) : (
              <span className="font-serif text-3xl font-semibold" style={{ color: "#FEFCE8" }}>
                {initials}
              </span>
            )}
          </div>

          {/* Company logo or badge */}
          {company && (
            <div
              className="mb-1 px-3 py-1.5 rounded-xl border text-xs font-mono tracking-wide"
              style={{
                backgroundColor: "#FEF9EF",
                borderColor: "rgba(6,78,59,0.12)",
                color: "#65A30D",
              }}
            >
              {company.name}
            </div>
          )}
        </div>

        {/* Name & title */}
        <div className="mb-5">
          <h1 className="font-serif text-display-sm text-emerald-deep mb-1 leading-tight">
            {profile.full_name}
          </h1>
          {job_title && (
            <p className="text-sm font-medium text-ink-mid">{job_title}</p>
          )}
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
          {company && !card.show_organization && (
            <p className="text-sm text-ink-light">{company.name}</p>
          )}
        </div>

        {/* Contact row */}
        {phone && (
          <a
            href={`tel:${phone}`}
            className="inline-flex items-center gap-2 text-sm font-medium mb-5 transition-colors hover:text-emerald-mid"
            style={{ color: accent }}
          >
            <PhoneIcon />
            {phone}
          </a>
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
