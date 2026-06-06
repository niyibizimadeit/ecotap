import Link from "next/link";
import type { PublicCard } from "@/types";
import { SocialIconRow }      from "./SocialIconRow";
import { SaveContactButton }  from "./SaveContactButton";
import { ContactExchangeForm } from "./ContactExchangeForm";
import { getInitials }        from "@/lib/utils";

interface PublicCardLayoutProps {
  card: PublicCard;
}

export function PublicCardLayout({ card }: PublicCardLayoutProps) {
  const { profile, company, job_title, phone, bio, social_links, accent_color } = card;
  const accent   = accent_color  ?? "#064E3B";
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
            className="w-24 h-24 rounded-3xl border-4 flex items-center justify-center shadow-card-lg flex-shrink-0"
            style={{ backgroundColor: accent, borderColor: "#FEFCE8" }}
          >
            <span
              className="font-serif text-3xl font-semibold"
              style={{ color: "#FEFCE8" }}
            >
              {initials}
            </span>
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
          {company && (
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
            <NfcIcon />
            <span>Powered by <strong className="font-medium">EcoTap</strong></span>
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

function NfcIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
      <rect x="2" y="2" width="5" height="5" rx="1.5" opacity=".8"/>
      <rect x="9" y="2" width="5" height="5" rx="1.5" opacity=".45"/>
      <rect x="2" y="9" width="5" height="5" rx="1.5" opacity=".45"/>
      <rect x="9" y="9" width="5" height="5" rx="1.5" opacity=".2"/>
    </svg>
  );
}