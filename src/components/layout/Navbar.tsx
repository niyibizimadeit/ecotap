"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { Menu, X } from "lucide-react";

const NAV_LINKS = [
  { label: "How it works", href: "#how-it-works" },
  { label: "Features",     href: "#features" },
  { label: "Pricing",      href: "#pricing" },
];

export function Navbar() {
  const [scrolled,    setScrolled]    = useState(false);
  const [mobileOpen,  setMobileOpen]  = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <header
        className={cn(
          "fixed top-0 inset-x-0 z-50 transition-all duration-300",
          scrolled
            ? "bg-ivory/90 backdrop-blur-md border-b border-emerald-deep/8 shadow-card"
            : "bg-transparent"
        )}
      >
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 bg-emerald-deep rounded-lg flex items-center justify-center transition-transform group-hover:scale-105">
              <NfcIcon />
            </div>
            <span className="font-serif text-xl font-semibold text-emerald-deep tracking-tight">
              EcoTap
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-8">
            {NAV_LINKS.map((l) => (
              <a
                key={l.href}
                href={l.href}
                className="text-sm text-ink-mid hover:text-emerald-deep transition-colors duration-150 font-medium"
              >
                {l.label}
              </a>
            ))}
          </nav>

          {/* Desktop CTAs */}
          <div className="hidden md:flex items-center gap-3">
            <Link href="/login">
              <Button variant="ghost" size="sm">Sign in</Button>
            </Link>
            <Link href="/org/register">
              <Button variant="primary" size="sm">Get started</Button>
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2 rounded-lg text-ink-mid hover:text-emerald-deep hover:bg-emerald-pale transition-colors"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </header>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div
            className="absolute inset-0 bg-ink/20 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
          />
          <div className="absolute top-16 inset-x-0 bg-cream border-b border-cream-dark shadow-card-lg animate-fade-up">
            <div className="px-6 py-6 flex flex-col gap-1">
              {NAV_LINKS.map((l) => (
                <a
                  key={l.href}
                  href={l.href}
                  onClick={() => setMobileOpen(false)}
                  className="py-3 text-sm font-medium text-ink-mid hover:text-emerald-deep border-b border-cream-dark last:border-0 transition-colors"
                >
                  {l.label}
                </a>
              ))}
              <div className="flex flex-col gap-2 pt-4">
                <Link href="/login" onClick={() => setMobileOpen(false)}>
                  <Button variant="secondary" size="md" className="w-full">Sign in</Button>
                </Link>
                <Link href="/org/register" onClick={() => setMobileOpen(false)}>
                  <Button variant="primary" size="md" className="w-full">Get started</Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function NfcIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <rect x="2" y="2" width="5" height="5" rx="1.5" fill="white" />
      <rect x="9" y="2" width="5" height="5" rx="1.5" fill="white" opacity=".55" />
      <rect x="2" y="9" width="5" height="5" rx="1.5" fill="white" opacity=".55" />
      <rect x="9" y="9" width="5" height="5" rx="1.5" fill="white" opacity=".25" />
    </svg>
  );
}
