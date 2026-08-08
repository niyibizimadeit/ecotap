"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { BrandLogo } from "@/components/brand/BrandLogo";
import { signOut } from "@/app/actions/auth.actions";
import { ROLE_LABELS } from "@/constants";
import type { UserRole } from "@/types";

import {
  LayoutDashboard, Clock, Package, Palette,
  Users, CreditCard, LogOut, Menu, X, ChevronRight, Shield,
  MessageCircle, QrCode,
} from "lucide-react";

const NAV = [
  { label: "Overview",   href: "/dashboard/admin",           icon: LayoutDashboard, badge: null },
  { label: "Approvals",  href: "/dashboard/admin/approvals", icon: Clock,           badge: null },
  { label: "Card orders",href: "/dashboard/admin/orders",    icon: Package,         badge: null },
  { label: "Designs",    href: "/dashboard/admin/designs",   icon: Palette,         badge: null },
  { label: "Users",      href: "/dashboard/admin/users",     icon: Users,           badge: null },
  { label: "Contacts",   href: "/dashboard/admin/contacts",  icon: MessageCircle,   badge: null },
  { label: "QR Codes",   href: "/dashboard/admin/qr-codes",  icon: QrCode,          badge: null },
  { label: "Billing",    href: "/dashboard/admin/billing",   icon: CreditCard,      badge: null },
];

export default function AdminDashboardLayout({ children }: { children: React.ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [role, setRole] = useState<UserRole | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    async function load() {
      const { getCurrentUser } = await import("@/app/actions/auth.actions");
      const user = await getCurrentUser();
      if (user) setRole(user.role as UserRole);
    }
    load();
  }, []);

  return (
    <div className="min-h-screen flex" style={{ backgroundColor: "#FEFCE8" }}>

      {/* ── Sidebar desktop ── */}
      <aside
        className="hidden lg:flex flex-col w-64 min-h-screen fixed top-0 left-0 z-30 border-r"
        style={{ backgroundColor: "#064E3B" }}
      >
        {/* Logo */}
        <div className="px-6 py-5 border-b" style={{ borderColor: "rgba(255,255,255,0.08)" }}>
          <BrandLogo variant="dark" iconSize="md" />
        </div>

        {/* Admin pill */}
        <div className="px-4 py-4 border-b" style={{ borderColor: "rgba(255,255,255,0.08)" }}>
          <div
            className="flex items-center gap-3 px-3 py-3 rounded-2xl"
            style={{ backgroundColor: "rgba(255,255,255,0.08)" }}
          >
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ backgroundColor: "rgba(255,255,255,0.15)" }}
            >
              <Shield className="h-4 w-4" style={{ color: "#D1FAE5" }} />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold truncate" style={{ color: "#FEFCE8" }}>
                {role ? ROLE_LABELS[role] : "Admin"}
              </p>
              <p className="text-xs truncate" style={{ color: "rgba(254,252,232,0.5)" }}>
                {role === "country_rep" ? "Read-only access" : "Platform owner"}
              </p>
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
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150"
                style={{
                  backgroundColor: active ? "rgba(255,255,255,0.15)" : "transparent",
                  color: active ? "#FEFCE8" : "rgba(254,252,232,0.6)",
                }}
                onMouseEnter={e => { if (!active) (e.currentTarget as HTMLElement).style.backgroundColor = "rgba(255,255,255,0.08)"; }}
                onMouseLeave={e => { if (!active) (e.currentTarget as HTMLElement).style.backgroundColor = "transparent"; }}
              >
                <item.icon className="h-4 w-4 flex-shrink-0" />
                <span className="flex-1">{item.label}</span>
                {item.badge && (
                  <span
                    className="text-[10px] font-mono font-semibold px-1.5 py-0.5 rounded-full"
                    style={{ backgroundColor: "#D97706", color: "#FEFCE8" }}
                  >
                    {item.badge}
                  </span>
                )}
                {active && <ChevronRight className="h-3 w-3 opacity-50" />}
              </Link>
            );
          })}
        </nav>

        {/* Bottom */}
        <div className="px-3 py-4 border-t" style={{ borderColor: "rgba(255,255,255,0.08)" }}>
          <button
            onClick={() => signOut()}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all"
            style={{ color: "rgba(254,252,232,0.5)" }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = "#fca5a5"; (e.currentTarget as HTMLElement).style.backgroundColor = "rgba(239,68,68,0.1)"; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = "rgba(254,252,232,0.5)"; (e.currentTarget as HTMLElement).style.backgroundColor = "transparent"; }}
          >
            <LogOut className="h-4 w-4" />
            Sign out
          </button>
        </div>
      </aside>

      {/* ── Mobile header ── */}
      <div
        className="lg:hidden fixed top-0 inset-x-0 z-40 flex items-center justify-between px-5 h-14 border-b"
        style={{ backgroundColor: "#064E3B", borderColor: "rgba(255,255,255,0.08)" }}
      >
        <div className="flex items-center gap-2">
          <Shield className="h-4 w-4" style={{ color: "#D1FAE5" }} />
          <span className="font-serif text-base font-semibold" style={{ color: "#FEFCE8" }}>Admin</span>
        </div>
        <button
          onClick={() => setMobileOpen(v => !v)}
          className="p-2 rounded-lg transition-colors"
          style={{ color: "rgba(254,252,232,0.7)" }}
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-30">
          <div className="absolute inset-0 bg-ink/20 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
          <div
            className="absolute top-14 inset-x-0 border-b shadow-card-lg animate-fade-up max-h-[80vh] overflow-y-auto"
            style={{ backgroundColor: "#064E3B", borderColor: "rgba(255,255,255,0.08)" }}
          >
            <div className="px-4 py-3 space-y-0.5">
              {NAV.map((item) => {
                const active = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all"
                    style={{
                      backgroundColor: active ? "rgba(255,255,255,0.15)" : "transparent",
                      color: active ? "#FEFCE8" : "rgba(254,252,232,0.6)",
                    }}
                  >
                    <item.icon className="h-4 w-4" />
                    <span className="flex-1">{item.label}</span>
                    {item.badge && (
                      <span className="text-[10px] font-mono px-1.5 py-0.5 rounded-full" style={{ backgroundColor: "#D97706", color: "#FEFCE8" }}>
                        {item.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>

            {/* Bottom */}
            <div
              className="px-4 py-3 border-t"
              style={{ borderColor: "rgba(255,255,255,0.08)" }}
            >
              <button
                onClick={() => signOut()}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm"
                style={{ color: "rgba(254,252,232,0.5)" }}
              >
                <LogOut className="h-4 w-4" />
                Sign out
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Main content ── */}
      <div className="flex-1 lg:ml-64 flex flex-col min-h-screen">
        <main className="flex-1 pt-14 lg:pt-0 px-5 lg:px-8 py-8 max-w-6xl w-full mx-auto overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
