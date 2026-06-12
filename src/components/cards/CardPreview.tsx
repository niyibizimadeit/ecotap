"use client";

import { getInitials } from "@/lib/utils";
import { Building2 } from "lucide-react";
import type { SocialLinks } from "@/types";

const SOCIAL_LABELS: Record<keyof SocialLinks, string> = {
  linkedin:  "in",
  twitter:   "x",
  whatsapp:  "wa",
  instagram: "ig",
  website:   "web",
};

interface CardPreviewProps {
  name:                string;
  jobTitle:            string;
  company:             string;
  bio:                 string;
  phone:               string;
  accentColor:         string;
  socialLinks:         SocialLinks;
  companySocialLinks?:  SocialLinks;
  cardSlug?:            string;
  avatarUrl?:           string | null;
  showOrganization?:    boolean;
}

export function CardPreview({
  name, jobTitle, company, bio, phone, accentColor, socialLinks, companySocialLinks, cardSlug, avatarUrl, showOrganization,
}: CardPreviewProps) {
  const initials    = getInitials(name || "?");
  const activeSocial = (Object.entries(socialLinks) as [keyof SocialLinks, string][])
    .filter(([, v]) => v.trim());

  return (
    <div className="w-full max-w-xs mx-auto">
      {/* Phone frame */}
      <div
        className="relative rounded-[36px] p-2 shadow-card-xl"
        style={{ backgroundColor: "#1C1917" }}
      >
        {/* Screen */}
        <div
          className="rounded-[28px] overflow-hidden"
          style={{ backgroundColor: "#FEFCE8", minHeight: "540px" }}
        >
          {/* Top band */}
          <div className="h-28 relative" style={{ backgroundColor: accentColor }}>
            <div
              className="absolute inset-0 opacity-[0.06]"
              style={{
                backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)",
                backgroundSize: "16px 16px",
              }}
            />
          </div>

          {/* Content */}
          <div className="px-5 pb-6 -mt-10 relative">
            {/* Avatar */}
            <div
              className="w-20 h-20 rounded-2xl border-4 flex items-center justify-center mb-3 shadow-card overflow-hidden"
              style={{ backgroundColor: avatarUrl ? "#FEFCE8" : accentColor, borderColor: "#FEFCE8" }}
            >
              {avatarUrl ? (
                <img src={avatarUrl} alt={name} className="w-full h-full object-cover" />
              ) : (
                <span className="font-serif text-2xl font-semibold" style={{ color: "#FEFCE8" }}>
                  {initials}
                </span>
              )}
            </div>

            {/* Name */}
            <h3 className="font-serif text-xl font-semibold text-emerald-deep leading-tight">
              {name || <span className="text-ink-light opacity-40">Your name</span>}
            </h3>

            {/* Title & company */}
            {(jobTitle || company) && (
              <div className="mt-0.5 mb-3">
                {jobTitle && <p className="text-xs font-medium text-ink-mid">{jobTitle}</p>}
                {company && showOrganization ? (
                  <div className="flex items-center gap-1.5 mt-1">
                    <Building2 className="h-3 w-3 flex-shrink-0" style={{ color: accentColor }} />
                    <p className="text-xs font-medium" style={{ color: accentColor }}>{company}</p>
                    <span className="text-[10px] px-1.5 py-px rounded-full" style={{ backgroundColor: accentColor, color: "#FEFCE8" }}>org</span>
                  </div>
                ) : company ? (
                  <p className="text-xs text-ink-light">{company}</p>
                ) : null}
              </div>
            )}

            {/* Phone */}
            {phone && (
              <p className="text-xs mb-3" style={{ color: accentColor }}>{phone}</p>
            )}

            {/* Bio */}
            {bio && (
              <div
                className="rounded-xl p-3 mb-3 border"
                style={{ backgroundColor: "#FEF9EF", borderColor: "rgba(6,78,59,0.08)" }}
              >
                <p className="text-xs text-ink-mid leading-relaxed line-clamp-3">{bio}</p>
              </div>
            )}

            {/* Personal social */}
            {activeSocial.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mb-3">
                {activeSocial.map(([key]) => (
                  <div
                    key={key}
                    className="w-7 h-7 rounded-lg flex items-center justify-center text-[10px] border"
                    style={{ backgroundColor: "#FEF9EF", borderColor: "rgba(6,78,59,0.1)", color: "#78716C" }}
                  >
                    {SOCIAL_LABELS[key]}
                  </div>
                ))}
              </div>
            )}

            {/* Company social links (when org display is on) */}
            {showOrganization && companySocialLinks && Object.values(companySocialLinks).some(v => v?.trim()) && (
              <div className="mb-4">
                <p className="text-[10px] font-mono tracking-widest text-ink-light uppercase mb-1.5">Company</p>
                <div className="flex flex-wrap gap-1.5">
                  {(Object.entries(companySocialLinks) as [keyof SocialLinks, string][])
                    .filter(([, v]) => v?.trim())
                    .map(([key]) => (
                      <div
                        key={`co-${key}`}
                        className="w-7 h-7 rounded-lg flex items-center justify-center text-[10px] border"
                        style={{ backgroundColor: accentColor, borderColor: "transparent", color: "#FEFCE8", opacity: 0.75 }}
                      >
                        {SOCIAL_LABELS[key]}
                      </div>
                    ))}
                </div>
              </div>
            )}

            {/* Save contact CTA */}
            <div
              className="flex items-center justify-between rounded-xl px-4 py-3"
              style={{ backgroundColor: accentColor }}
            >
              <span className="text-xs font-medium" style={{ color: "#FEFCE8" }}>Save contact</span>
              <div
                className="w-6 h-6 rounded-lg flex items-center justify-center"
                style={{ backgroundColor: "rgba(254,252,232,0.15)" }}
              >
                <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                  <path d="M2 5h6M5 2l3 3-3 3" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Home indicator */}
        <div className="flex justify-center pt-2 pb-1">
          <div className="w-20 h-1 rounded-full" style={{ backgroundColor: "rgba(255,255,255,0.25)" }} />
        </div>
      </div>

      {/* URL badge */}
      <div className="text-center mt-4">
        <span className="text-xs font-mono text-ink-light">
          ecotap.rw/<span style={{ color: "#059669" }}>{cardSlug || "you"}</span>
        </span>
      </div>
    </div>
  );
}