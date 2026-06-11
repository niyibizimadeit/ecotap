import Link from "next/link";
import { BrandLogo } from "@/components/brand/BrandLogo";

const FOOTER_LINKS = {
  Product: [
    { label: "About Us", href: "/about" },
    { label: "Pricing",  href: "/pricing" },
    { label: "Impact",   href: "/impact" },
  ],
  Company: [
    { label: "Contact Us", href: "/contact" },
    { label: "Enterprise", href: "/contact" },
  ],
  Legal: [
    { label: "Privacy Policy",   href: "/privacy" },
    { label: "Terms of Service",  href: "/terms" },
  ],
};

export function Footer() {
  return (
    <footer className="bg-emerald-deep text-ivory/80">
      <div className="max-w-6xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-12 mb-12">

          {/* Brand */}
          <div className="md:col-span-2">
            <div className="mb-4">
              <BrandLogo variant="white" iconSize="md" />
            </div>
            <p className="text-sm text-ivory/60 leading-relaxed max-w-xs">
              Eco-friendly digital business cards for companies and individuals across the world.
            </p>
            <p className="text-xs text-ivory/40 mt-6 font-mono tracking-wide">
              Eco-friendly business cards — one tap, zero waste, across the world.
            </p>
          </div>

          {/* Links */}
          {Object.entries(FOOTER_LINKS).map(([section, links]) => (
            <div key={section}>
              <h3 className="text-xs font-mono tracking-widest uppercase text-ivory/40 mb-4">{section}</h3>
              <ul className="space-y-3">
                {links.map((l) => (
                  <li key={l.label}>
                    <Link
                      href={l.href}
                      className="text-sm text-ivory/60 hover:text-ivory transition-colors duration-150"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-ivory/10">
          <p className="text-xs text-ivory/40 text-center">
            © {new Date().getFullYear()} EcoTap. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
