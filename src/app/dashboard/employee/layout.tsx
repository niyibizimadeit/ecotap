"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { BrandLogo } from "@/components/brand/BrandLogo";
import { getMyCard } from "@/app/actions/cards.actions";
import { signOut } from "@/app/actions/auth.actions";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard, User, QrCode, Mail, Package,
  LogOut, Menu, X, ExternalLink, ChevronRight,
} from "lucide-react";

const NAV = [
  { label: "Overview",  href: "/dashboard/employee",          icon: LayoutDashboard },
  { label: "My Card",   href: "/dashboard/employee/profile",  icon: User            },
  { label: "QR Code",   href: "/dashboard/employee/qr",       icon: QrCode          },
  { label: "Contacts",  href: "/dashboard/employee/contacts", icon: Mail            },
  { label: "Order Card",href: "/dashboard/employee/orders",   icon: Package         },
];

export default function EmployeeDashboardLayout({ children }: { children: React.ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userData, setUserData] = useState<{ name: string; role: string; username: string }>({ name: "", role: "", username: "" });
  const pathname = usePathname();

  useEffect(() => {
    async function load() {
      const result = await getMyCard();
      if (result.success && result.data) {
        setUserData({
          name: result.data.profile.full_name,
          role: result.data.job_title ?? result.data.profile.role,
          username: result.data.profile.username,
        });
      }
    }
    load();
  }, []);

  return (
    <div className="min-h-screen flex" style={{ backgroundColor: "#FEFCE8" }}>

      {/* ── Sidebar — desktop ── */}
      <aside
        className="hidden lg:flex flex-col w-64 min-h-screen fixed top-0 left-0 z-30 border-r"
        style={{ backgroundColor: "#FEF9EF", borderColor: "rgba(6,78,59,0.08)" }}
      >
        {/* Logo */}
        <div className="px-6 py-5 border-b" style={{ borderColor: "rgba(6,78,59,0.08)" }}>
          <BrandLogo variant="light" iconSize="md" />
        </div>

        {/* User pill */}
        <div className="px-4 py-4 border-b" style={{ borderColor: "rgba(6,78,59,0.08)" }}>
          <div className="flex items-center gap-3 px-3 py-3 rounded-2xl" style={{ backgroundColor: "#ECFDF5" }}>
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 font-serif font-semibold text-sm"
              style={{ backgroundColor: "#064E3B", color: "#FEFCE8" }}
            >
              {(userData.name || "—").split(" ").map(n => n[0]).join("")}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-medium text-emerald-deep truncate">{(userData.name || "—")}</p>
              <p className="text-xs text-ink-light truncate">{(userData.role || "—")}</p>
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
                  active
                    ? "text-ivory"
                    : "text-ink-mid hover:text-emerald-deep hover:bg-emerald-pale"
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

        {/* Bottom actions */}
        <div className="px-3 py-4 border-t space-y-0.5" style={{ borderColor: "rgba(6,78,59,0.08)" }}>
          <a
            href={`/${userData.username || "you"}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-ink-light hover:text-emerald-deep hover:bg-emerald-pale transition-all duration-150"
          >
            <ExternalLink className="h-4 w-4" />
            View my card
          </a>
          <button onClick={() => signOut()} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-ink-light hover:text-red-600 hover:bg-red-50 transition-all duration-150">
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
        <BrandLogo variant="light" iconSize="sm" />
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
              <div className="pt-2 border-t space-y-0.5" style={{ borderColor: "rgba(6,78,59,0.08)" }}>
                <a
                  href={`/${userData.username || "you"}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-ink-light"
                >
                  <ExternalLink className="h-4 w-4" />
                  View my card
                </a>
                <button
                  onClick={() => signOut()}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-ink-light hover:text-red-600 hover:bg-red-50 transition-all"
                >
                  <LogOut className="h-4 w-4" />
                  Sign out
                </button>
              </div>
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
