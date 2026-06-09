"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { BrandLogo } from "@/components/brand/BrandLogo";
import { signOut } from "@/app/actions/auth.actions";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard, Users, Building2, Settings,
  CreditCard, LogOut, Menu, X, ExternalLink, ChevronRight,
} from "lucide-react";

const NAV = [
  { label: "Overview",     href: "/dashboard/company",              icon: LayoutDashboard },
  { label: "Employees",    href: "/dashboard/company/employees",    icon: Users           },
  { label: "Departments",  href: "/dashboard/company/departments",  icon: Building2       },
  { label: "Settings",     href: "/dashboard/company/settings",     icon: Settings        },
  { label: "Subscription", href: "/dashboard/company/subscription", icon: CreditCard      },
];

export default function CompanyDashboardLayout({ children }: { children: React.ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [companyData, setCompanyData] = useState<{ name: string; slug: string; initials: string }>({ name: "", slug: "", initials: "" });

  useEffect(() => {
    async function load() {
      const { getMyCard } = await import("@/app/actions/cards.actions");
      const result = await getMyCard();
      if (result.success && result.data?.primary_company) {
        const c = result.data.primary_company;
        setCompanyData({
          name: c.name,
          slug: c.slug,
          initials: c.name.split(" ").map((w: string) => w[0]).join("").slice(0, 2).toUpperCase(),
        });
      }
    }
    load();
  }, []);
  const pathname = usePathname();

  return (
    <div className="min-h-screen flex" style={{ backgroundColor: "#FEFCE8" }}>

      {/* ── Sidebar desktop ── */}
      <aside
        className="hidden lg:flex flex-col w-64 min-h-screen fixed top-0 left-0 z-30 border-r"
        style={{ backgroundColor: "#FEF9EF", borderColor: "rgba(6,78,59,0.08)" }}
      >
        {/* Logo */}
        <div className="px-6 py-5 border-b" style={{ borderColor: "rgba(6,78,59,0.08)" }}>
          <BrandLogo variant="light" iconSize="md" />
        </div>

        {/* Company pill */}
        <div className="px-4 py-4 border-b" style={{ borderColor: "rgba(6,78,59,0.08)" }}>
          <div className="flex items-center gap-3 px-3 py-3 rounded-2xl" style={{ backgroundColor: "#ECFDF5" }}>
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 font-serif font-semibold text-sm"
              style={{ backgroundColor: "#064E3B", color: "#FEFCE8" }}
            >
              {(companyData.initials || "—")}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-emerald-deep truncate">{(companyData.name || "—")}</p>
              <p className="text-xs text-ink-light truncate">{"Admin"}</p>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
          {NAV.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150",
                  active ? "text-ivory" : "text-ink-mid hover:text-emerald-deep hover:bg-emerald-pale"
                )}
                style={active ? { backgroundColor: "#064E3B" } : {}}
              >
                <item.icon className="h-4 w-4 flex-shrink-0" />
                {item.label}
                {active && <ChevronRight className="h-3 w-3 ml-auto opacity-60" />}
              </Link>
            );
          })}
        </nav>

        {/* Bottom */}
        <div className="px-3 py-4 border-t space-y-0.5" style={{ borderColor: "rgba(6,78,59,0.08)" }}>
          <a
            href={`/${(companyData.slug || "company")}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-ink-light hover:text-emerald-deep hover:bg-emerald-pale transition-all"
          >
            <ExternalLink className="h-4 w-4" />
            View company page
          </a>
          <button onClick={() => signOut()} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-ink-light hover:text-red-600 hover:bg-red-50 transition-all">
            <LogOut className="h-4 w-4" />
            Sign out
          </button>
        </div>
      </aside>

      {/* ── Mobile header ── */}
      <div
        className="lg:hidden fixed top-0 inset-x-0 z-40 flex items-center justify-between px-5 h-14 border-b"
        style={{ backgroundColor: "rgba(254,252,232,0.95)", backdropFilter: "blur(12px)", borderColor: "rgba(6,78,59,0.08)" }}
      >
        <div className="flex items-center gap-2.5">
          <div
            className="w-7 h-7 rounded-lg flex items-center justify-center font-serif text-xs font-semibold"
            style={{ backgroundColor: "#064E3B", color: "#FEFCE8" }}
          >
            {(companyData.initials || "—")}
          </div>
          <span className="font-serif text-base font-semibold text-emerald-deep">{(companyData.name || "—")}</span>
        </div>
        <button
          onClick={() => setMobileOpen(v => !v)}
          className="p-2 rounded-lg text-ink-mid hover:bg-emerald-pale transition-colors"
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-30">
          <div className="absolute inset-0 bg-ink/20 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
          <div
            className="absolute top-14 inset-x-0 border-b shadow-card-lg animate-fade-up"
            style={{ backgroundColor: "#FEF9EF", borderColor: "rgba(6,78,59,0.08)" }}
          >
            <div className="px-4 py-3 space-y-0.5">
              {NAV.map((item) => {
                const active = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all",
                      active ? "text-ivory" : "text-ink-mid"
                    )}
                    style={active ? { backgroundColor: "#064E3B" } : {}}
                  >
                    <item.icon className="h-4 w-4" />
                    {item.label}
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ── Main content ── */}
      <div className="flex-1 lg:ml-64 flex flex-col min-h-screen">
        <main className="flex-1 pt-14 lg:pt-0 px-5 lg:px-8 py-8 max-w-5xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
