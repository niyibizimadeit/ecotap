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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {[
            {
              name: "Personal Tier",
              price: "Free",
              desc: "Free Forever — Independent professionals, freelancers, students.",
              features: ["Personal Executive Dashboard access", "Dynamic live web profile (portfolio + social links)", "Standard QR code for digital sharing", "Basic lead generation & contact-capture forms"],
              cta: "Get Started Free",
              href: "/register",
              highlight: false,
            },
            {
              name: "Premium Personal Hardware",
              price: "$40",
              desc: "One-off purchase (≈ 50,000 RWF) — Executives, consultants, entrepreneurs.",
              features: ["1× Premium rPVC Smart Card", "NTAG213 NFC chip (100,000+ taps)", "Laser-engraved EcoTap professional branding", "Full sync with free Personal Dashboard"],
              cta: "Order Your Card",
              href: "/org/register",
              highlight: true,
            },
            {
              name: "Corporate Hardware Matrix",
              price: "$28/card",
              desc: "(≈ 35,000 RWF/card) — Teams, SMEs, enterprises.",
              features: ["Custom-branded rPVC cards (your logo & colors)", "Bulk deployment codes for instant setup", "Virgin-plastic-free manufacturing", "Volume: 20–99: $28 | 100–499: $25 | 500+: $22/card"],
              cta: "Request Bulk Quote",
              href: "/org/register",
              highlight: false,
            },
            {
              name: "Corporate SaaS + HR",
              price: "$99/yr",
              desc: "Flat base rate — HR managers, operations leads.",
              features: ["Full Corporate/Enterprise Dashboard", "Centralized brand control & HR sync", "Advanced team analytics & event ROI tracking", "ESG Carbon Reporting engine"],
              cta: "Contact Sales",
              href: "/org/register",
              highlight: false,
            },
            {
              name: "White‑Label",
              price: "Custom",
              desc: "Enterprises, conglomerates, multinationals.",
              features: ["Domain routing: tap.yourcompany.rw", "Custom API endpoints → Salesforce, HubSpot", "Dedicated RDMC technical account manager", "Full white-label branding"],
              cta: "Request Quote",
              href: "/contact",
              highlight: false,
            },
            {
              name: "Country Representative",
              price: "Custom",
              desc: "Regional eco-alliances, tech distributors, entrepreneurs.",
              features: ["Exclusive territorial distribution rights", "Localized white-label sub-administration", "Tiered wholesale margins on rPVC hardware", "Zero-waste baselines certification"],
              cta: "Become a Representative",
              href: "/contact",
              highlight: false,
            },
          ].map((plan) => (
            <div
              key={plan.name}
              className={`relative rounded-3xl p-7 border transition-all duration-200 hover:-translate-y-1 flex flex-col ${
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
              <p className={`text-sm mb-5 min-h-[40px] ${plan.highlight ? "text-ivory/60" : "text-ink-light"}`}>
                {plan.desc}
              </p>
              <ul className="space-y-2.5 mb-8 flex-1">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-2.5 text-sm">
                    <Check className={`h-4 w-4 flex-shrink-0 mt-0.5 ${plan.highlight ? "text-emerald-light" : "text-emerald-bright"}`} />
                    <span className={plan.highlight ? "text-ivory/80" : "text-ink-mid"}>{f}</span>
                  </li>
                ))}
              </ul>
              <Link href={plan.href} className="mt-auto">
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
          * Baseline single profiles are free forever. Premium hardware from $40 (one-off). Corporate SaaS from $99/year. Bulk cards from $28/card.
        </p>
      </div>
    </section>
  );
}
