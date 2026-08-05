"use client";

// src/app/dashboard/company/_components/CompanySidebar.tsx
//
// Pure presentation — no data fetching. Company identity is passed as props
// from the Server Component layout, so there is no useEffect waterfall.

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { BrandLogo } from "@/components/brand/BrandLogo";
import { signOut } from "@/app/actions/auth.actions";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Users,
  Settings,
  CreditCard,
  LogOut,
  Menu,
  X,
  ExternalLink,
  ChevronRight,
  Package,
} from "lucide-react";

const NAV = [
  { label: "Overview",     href: "/dashboard/company",              icon: LayoutDashboard },
  { label: "Employees",    href: "/dashboard/company/employees",    icon: Users           },
  { label: "Order Cards",  href: "/dashboard/company/orders",       icon: Package         },
  { label: "Settings",     href: "/dashboard/company/settings",     icon: Settings        },
  { label: "Subscription", href: "/dashboard/company/subscription", icon: CreditCard      },
];

interface Props {
  companyName: string;
  companySlug: string;
  companyInitials: string;
}

export default function CompanySidebar({
  companyName,
  companySlug,
  companyInitials,
}: Props) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  const CompanyPill = () => (
    <div
      className="flex items-center gap-3 px-3 py-3 rounded-2xl"
      style={{ backgroundColor: "#ECFDF5" }}
    >
      <div
        className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 font-serif font-semibold text-sm"
        style={{ backgroundColor: "#064E3B", color: "#FEFCE8" }}
      >
        {companyInitials}
      </div>
      <div className="min-w-0">
        <p className="text-sm font-semibold text-emerald-deep truncate">
          {companyName}
        </p>
        <p className="text-xs text-ink-light">Admin</p>
      </div>
    </div>
  );

  const NavLinks = ({ onClick }: { onClick?: () => void }) => (
    <>
      {NAV.map((item) => {
        const active = pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onClick}
            className={cn(
              "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150",
              active
                ? "text-ivory"
                : "text-ink-mid hover:text-emerald-deep hover:bg-emerald-pale"
            )}
            style={active ? { backgroundColor: "#064E3B" } : {}}
          >
            <item.icon className="h-4 w-4 flex-shrink-0" />
            {item.label}
            {active && (
              <ChevronRight className="h-3 w-3 ml-auto opacity-60" />
            )}
          </Link>
        );
      })}
    </>
  );

  return (
    <>
      {/* ── Desktop sidebar ── */}
      <aside
        className="hidden lg:flex flex-col w-64 min-h-screen fixed top-0 left-0 z-30 border-r"
        style={{ backgroundColor: "#FEF9EF", borderColor: "rgba(6,78,59,0.08)" }}
      >
        <div
          className="px-6 py-5 border-b"
          style={{ borderColor: "rgba(6,78,59,0.08)" }}
        >
          <BrandLogo variant="light" iconSize="md" />
        </div>

        <div
          className="px-4 py-4 border-b"
          style={{ borderColor: "rgba(6,78,59,0.08)" }}
        >
          <CompanyPill />
        </div>

        <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
          <NavLinks />
        </nav>

        <div
          className="px-3 py-4 border-t space-y-0.5"
          style={{ borderColor: "rgba(6,78,59,0.08)" }}
        >
          <a
            href={`/${companySlug}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-ink-light hover:text-emerald-deep hover:bg-emerald-pale transition-all"
          >
            <ExternalLink className="h-4 w-4" />
            View company page
          </a>
          <SignOutButton />
        </div>
      </aside>

      {/* ── Mobile header ── */}
      <div
        className="lg:hidden fixed top-0 inset-x-0 z-40 flex items-center justify-between px-5 h-14 border-b"
        style={{
          backgroundColor: "rgba(254,252,232,0.95)",
          backdropFilter: "blur(12px)",
          borderColor: "rgba(6,78,59,0.08)",
        }}
      >
        <div className="flex items-center gap-2.5">
          <div
            className="w-7 h-7 rounded-lg flex items-center justify-center font-serif text-xs font-semibold"
            style={{ backgroundColor: "#064E3B", color: "#FEFCE8" }}
          >
            {companyInitials}
          </div>
          <span className="font-serif text-base font-semibold text-emerald-deep">
            {companyName}
          </span>
        </div>
        <button
          onClick={() => setMobileOpen((v) => !v)}
          className="p-2 rounded-lg text-ink-mid hover:bg-emerald-pale transition-colors"
          aria-label="Toggle navigation"
        >
          {mobileOpen ? (
            <X className="h-5 w-5" />
          ) : (
            <Menu className="h-5 w-5" />
          )}
        </button>
      </div>

      {/* ── Mobile drawer ── */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-30">
          <div
            className="absolute inset-0 bg-ink/20 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
          />
          <div
            className="absolute top-14 inset-x-0 border-b shadow-card-lg animate-fade-up"
            style={{
              backgroundColor: "#FEF9EF",
              borderColor: "rgba(6,78,59,0.08)",
            }}
          >
            <div className="px-4 py-3 space-y-0.5">
              <NavLinks onClick={() => setMobileOpen(false)} />
              <div
                className="pt-2 border-t space-y-0.5"
                style={{ borderColor: "rgba(6,78,59,0.08)" }}
              >
                <a
                  href={`/${companySlug}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-ink-light"
                >
                  <ExternalLink className="h-4 w-4" />
                  View company page
                </a>
                <SignOutButton />
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

/** Sign-out button with accidental-click protection. */
function SignOutButton() {
  const [confirming, setConfirming] = useState(false);

  if (!confirming) {
    return (
      <button
        onClick={() => setConfirming(true)}
        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-ink-light hover:text-red-600 hover:bg-red-50 transition-all"
      >
        <LogOut className="h-4 w-4" />
        Sign out
      </button>
    );
  }

  return (
    <div className="flex items-center gap-2 px-3 py-2.5">
      <button
        onClick={() => signOut()}
        className="flex-1 px-3 py-1.5 text-xs font-medium rounded-lg bg-red-500 text-white hover:bg-red-600 transition-colors"
      >
        Confirm sign out
      </button>
      <button
        onClick={() => setConfirming(false)}
        className="px-3 py-1.5 text-xs font-medium rounded-lg border border-gray-300 text-ink-light hover:bg-gray-50 transition-colors"
      >
        Cancel
      </button>
    </div>
  );
}