// src/app/[slug]/_components/CompanyPublicPage.tsx
//
// Rendered when a slug resolves to a company (not an individual profile).
// Shows company identity + a grid of active employee cards.

import Link from "next/link";
import { Globe, Building2 } from "lucide-react";
import type { PublicCompanyData } from "@/app/actions/public.actions";

interface Props {
  company: PublicCompanyData;
}

export default function CompanyPublicPage({ company }: Props) {
  const { name, slug, logo_url, brand_color, industry, website, description, employees } = company;

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#FEFCE8" }}>

      {/* ── Company header banner ── */}
      <div
        className="w-full h-28 sm:h-36"
        style={{ backgroundColor: brand_color }}
      />

      <div className="max-w-3xl mx-auto px-5 pb-16">

        {/* ── Company identity block ── */}
        <div className="relative -mt-12 sm:-mt-14 mb-8">
          {/* Logo */}
          <div
            className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl border-4 overflow-hidden flex items-center justify-center"
            style={{ backgroundColor: brand_color, borderColor: "#FEFCE8" }}
          >
            {logo_url ? (
              <img
                src={logo_url}
                alt={`${name} logo`}
                className="object-cover w-full h-full"
              />
            ) : (
              <span
                className="font-serif font-bold text-3xl"
                style={{ color: "#FEFCE8" }}
              >
                {name
                  .split(" ")
                  .map((w) => w[0])
                  .join("")
                  .slice(0, 2)}
              </span>
            )}
          </div>

          {/* Name + meta */}
          <div className="mt-4">
            <h1 className="font-serif text-3xl sm:text-4xl font-bold text-emerald-deep leading-tight">
              {name}
            </h1>
            <div className="flex flex-wrap items-center gap-3 mt-2">
              {industry && (
                <span className="flex items-center gap-1.5 text-sm text-ink-light">
                  <Building2 className="h-3.5 w-3.5" />
                  {industry}
                </span>
              )}
              {website && (
                <a
                  href={website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-sm hover:underline transition-colors"
                  style={{ color: brand_color }}
                >
                  <Globe className="h-3.5 w-3.5" />
                  {website.replace(/^https?:\/\//, "")}
                </a>
              )}
            </div>
            {description && (
              <p className="mt-3 text-sm text-ink-mid leading-relaxed max-w-xl">
                {description}
              </p>
            )}
          </div>
        </div>

        {/* ── Divider ── */}
        <div
          className="h-px mb-8"
          style={{ backgroundColor: "rgba(6,78,59,0.08)" }}
        />

        {/* ── Employee grid ── */}
        {employees.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-4xl mb-3">👥</p>
            <p className="font-serif text-lg font-semibold text-emerald-deep">
              No active cards yet
            </p>
            <p className="text-sm text-ink-light mt-1">
              Employee cards will appear here once activated.
            </p>
          </div>
        ) : (
          <>
            <h2 className="font-serif text-lg font-semibold text-emerald-deep mb-4">
              {employees.length} team member{employees.length === 1 ? "" : "s"}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {employees.map((emp) => (
                <Link
                  key={emp.username}
                  href={`/${slug}/${emp.username}`}
                  className="group flex items-center gap-4 p-4 rounded-2xl border transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg"
                  style={{
                    backgroundColor: "#FEF9EF",
                    borderColor: "rgba(6,78,59,0.08)",
                  }}
                >
                  {/* Avatar */}
                  <div
                    className="w-12 h-12 rounded-xl flex-shrink-0 flex items-center justify-center font-serif font-semibold text-base overflow-hidden border-2"
                    style={{
                      backgroundColor: emp.theme_color,
                      borderColor: "rgba(255,255,255,0.3)",
                      color: "#FEFCE8",
                    }}
                  >
                    {emp.avatar_url ? (
                      <img
                        src={emp.avatar_url}
                        alt={emp.full_name}
                        className="object-cover w-full h-full"
                      />
                    ) : (
                      emp.full_name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .slice(0, 2)
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-emerald-deep truncate group-hover:text-emerald-mid transition-colors">
                      {emp.full_name}
                    </p>
                    {emp.job_title && (
                      <p className="text-xs text-ink-light truncate mt-0.5">
                        {emp.job_title}
                      </p>
                    )}
                  </div>

                  {/* Accent stripe */}
                  <div
                    className="w-1 h-10 rounded-full flex-shrink-0 opacity-60"
                    style={{ backgroundColor: emp.theme_color }}
                  />
                </Link>
              ))}
            </div>
          </>
        )}

        {/* ── Footer ── */}
        <div className="mt-16 text-center">
          <a
            href="https://ecotap.rw"
            className="inline-flex items-center gap-2 text-xs text-ink-light hover:text-emerald-deep transition-colors"
          >
            <span
              className="inline-flex items-center justify-center w-5 h-5 rounded-md text-white text-xs font-bold"
              style={{ backgroundColor: "#064E3B" }}
            >
              E
            </span>
            Powered by EcoTap
          </a>
        </div>
      </div>
    </div>
  );
}