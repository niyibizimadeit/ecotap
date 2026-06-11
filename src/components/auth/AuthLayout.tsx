import Link from "next/link";
import { BrandLogo } from "@/components/brand/BrandLogo";

interface AuthLayoutProps {
  children: React.ReactNode;
  /** Quote shown on the left panel */
  quote?: string;
  quoteAuthor?: string;
}

export function AuthLayout({ children, quote, quoteAuthor }: AuthLayoutProps) {
  return (
    <div className="min-h-screen flex">

      {/* Left panel — emerald brand panel */}
      <div className="hidden lg:flex lg:w-[45%] bg-emerald-deep flex-col justify-between p-12 relative overflow-hidden">

        {/* Background decoration */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-emerald-mid/50" />
          <div className="absolute -bottom-16 -left-16 w-72 h-72 rounded-full bg-emerald-mid/30" />
          <div
            className="absolute inset-0 opacity-[0.04]"
            style={{
              backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)",
              backgroundSize: "24px 24px",
            }}
          />
        </div>

        {/* Logo */}
        <BrandLogo variant="dark" iconSize="lg" />

        {/* Quote / feature callout */}
        <div className="relative">
          {quote ? (
            <>
              <div className="font-serif text-5xl text-ivory/20 leading-none mb-4">"</div>
              <p className="font-serif text-xl text-ivory/80 leading-relaxed italic mb-6">{quote}</p>
              {quoteAuthor && (
                <p className="text-sm font-mono text-ivory/40 tracking-wide">{quoteAuthor}</p>
              )}
            </>
          ) : (
            <div className="space-y-4">
              {[
                { label: "NFC + QR ready",        sub: "Works on all phones" },
                { label: "Eco tap card included", sub: "We print & ship" },
                { label: "Team management",        sub: "One dashboard for all" },
              ].map((item) => (
                <div key={item.label} className="flex items-start gap-3">
                  <div className="mt-0.5 w-5 h-5 rounded-full bg-emerald-bright/20 border border-emerald-light/20 flex items-center justify-center flex-shrink-0">
                    <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                      <path d="M1 4l3 3 5-6" stroke="#6EE7B7" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-ivory/80">{item.label}</p>
                    <p className="text-xs text-ivory/40">{item.sub}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <p className="relative text-xs font-mono text-ivory/30 tracking-wide">
          Eco-friendly business cards
        </p>
      </div>

      {/* Right panel — form */}
      <div className="flex-1 flex flex-col bg-ivory">
        {/* Mobile logo */}
        <div className="lg:hidden px-6 py-5 border-b border-cream-dark">
          <BrandLogo variant="light" iconSize="md" />
        </div>

        <div className="flex-1 flex items-center justify-center px-6 py-12">
          <div className="w-full max-w-md">{children}</div>
        </div>
      </div>
    </div>
  );
}
