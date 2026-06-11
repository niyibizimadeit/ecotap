import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { ArrowRight, Check } from "lucide-react";

export default function PricingPage() {
  return (
    <section className="pt-28 pb-20 bg-ivory">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <p className="text-xs font-mono tracking-widest uppercase mb-4 text-emerald-bright">Pricing</p>
          <h1 className="font-serif text-display-md leading-tight mb-4 text-emerald-deep">
            Revenue & Pricing{" "}
            <em className="text-gold">Architecture</em>
          </h1>
          <p className="text-base leading-relaxed text-ink-light">
            Flexible plans for every professional and team. Baseline profiles are free forever.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
          {[
            {
              name: "Personal Tier",
              price: "Free",
              desc: "Baseline personal dashboard, live profile links, contact-capture forms.",
              features: ["Free digital profile", "QR code sharing", "Contact exchange form", "Basic analytics"],
              cta: "Get Started Free",
              href: "/register",
              highlight: false,
            },
            {
              name: "Direct Hardware",
              price: "Bulk",
              desc: "Custom rPVC cards with your corporate design. One‑off purchase.",
              features: ["Custom card design", "Bulk ordering", "NFC + QR enabled", "Premium rPVC material"],
              cta: "Order Cards",
              href: "/org/register",
              highlight: false,
            },
            {
              name: "Corporate SaaS",
              price: "Annual",
              desc: "Enterprise Dashboard, HR sync, onboarding, advanced analytics.",
              features: ["Everything in Personal", "Team management", "HR system sync", "Advanced analytics", "Priority support"],
              cta: "Go Corporate",
              href: "/org/register",
              highlight: true,
            },
            {
              name: "White‑Label",
              price: "Custom",
              desc: "Full domain routing (ecotap.yourcompany.rw) & dedicated support.",
              features: ["Everything in Corporate", "Custom domain", "White-label branding", "Dedicated account manager", "API access"],
              cta: "Contact Sales",
              href: "/contact",
              highlight: false,
            },
          ].map((plan) => (
            <div
              key={plan.name}
              className={`relative rounded-3xl p-7 border transition-all duration-200 hover:-translate-y-1 ${
                plan.highlight
                  ? "bg-emerald-deep text-ivory border-emerald-deep shadow-card-xl"
                  : "bg-emerald-pale/30 border-emerald-light/50 shadow-card hover:shadow-card-lg"
              }`}
            >
              {plan.highlight && (
                <span className="absolute -top-3 left-6 bg-gold text-ivory text-xs font-mono tracking-wide px-3 py-1 rounded-full">
                  Most Popular
                </span>
              )}
              <h3 className={`font-serif text-xl font-semibold mb-1 ${plan.highlight ? "text-ivory" : "text-emerald-deep"}`}>
                {plan.name}
              </h3>
              <p className={`text-3xl font-bold mb-2 ${plan.highlight ? "text-ivory" : "text-emerald-deep"}`}>
                {plan.price}
              </p>
              <p className={`text-sm mb-6 ${plan.highlight ? "text-ivory/60" : "text-ink-light"}`}>
                {plan.desc}
              </p>
              <ul className="space-y-2.5 mb-8">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-center gap-2.5 text-sm">
                    <Check className={`h-4 w-4 flex-shrink-0 ${plan.highlight ? "text-emerald-light" : "text-emerald-bright"}`} />
                    <span className={plan.highlight ? "text-ivory/80" : "text-ink-mid"}>{f}</span>
                  </li>
                ))}
              </ul>
              <Link href={plan.href}>
                <Button
                  variant={plan.highlight ? "secondary" : "primary"}
                  size="md"
                  className="w-full"
                  rightIcon={<ArrowRight className="h-4 w-4" />}
                >
                  {plan.cta}
                </Button>
              </Link>
            </div>
          ))}
        </div>

        <p className="text-center text-sm text-ink-light mt-10">
          * Baseline single profiles are free forever. Corporate subscriptions from $99/year.
        </p>
      </div>
    </section>
  );
}
