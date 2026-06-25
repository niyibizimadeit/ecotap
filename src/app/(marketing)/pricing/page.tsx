import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { ArrowRight, Check } from "lucide-react";
import { CARD_ORIGINAL_PRICES } from "@/constants";

export default function PricingPage() {
  return (
    <section className="pt-28 pb-20 bg-ivory">
      <div className="max-w-6xl mx-auto px-6">

        {/* ── Sponsorship Announcement ── */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h1 className="font-serif text-display-md leading-tight mb-4 text-emerald-deep">
            A Huge Thank You to{" "}
            <em className="text-gold not-italic">Team Environment Rwanda!</em>
          </h1>

          <p className="text-base leading-relaxed text-ink-mid mb-4">
            We are incredibly proud to announce our official partnership with{" "}
            <strong>Team Environment Rwanda</strong>, a dedicated NGO championing
            environmental conservation. To drive real action on environmental
            conservation policies, Team Environment Rwanda has decided to sponsor
            25% to 50% of our card prices.
          </p>
          <p className="text-base leading-relaxed text-ink-mid">
            Thanks to their incredible support and some fantastic advice from our
            community, we are passing these massive savings directly on to you to
            help foster eco-friendly business practices.
          </p>
        </div>

        {/* ── Pricing Cards ── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {[
            {
              name: "Individual Card",
              originalPrice: `$${CARD_ORIGINAL_PRICES.individual} USD`,
              price: "$30 USD",
              priceNote: "≈ 45,000 RWF",
              desc: "Premium NFC business card for professionals, freelancers, and consultants.",
              features: [
                "1× Premium Recycled PVC Smart Card",
                "NTAG213 NFC chip (100,000+ taps)",
                "Laser-engraved EcoTap professional branding",
                "Personal Executive Dashboard",
                "Dynamic live web profile with social links",
                "QR code for digital sharing",
                "Basic lead generation & contact-capture forms",
                "25% sponsored by Team Environment Rwanda",
              ],
              cta: "Order Your Card",
              href: "/register",
              highlight: true,
            },
            {
              name: "Corporate Account",
              originalPrice: `$${CARD_ORIGINAL_PRICES.corporate} USD`,
              price: "$25 USD",
              priceNote: "per card · ≈ 37,500 RWF",
              desc: "Custom-branded cards for teams, SMEs, and enterprises — with bulk savings.",
              features: [
                "Custom-branded Recycled PVC cards (your logo & colors)",
                "Bulk deployment codes for instant team setup",
                "Centralized Corporate Dashboard",
                "Brand control & employee card management",
                "Advanced team analytics & event ROI tracking",
                "ESG Carbon Reporting engine",
                "Virgin-plastic-free manufacturing",
                "Up to 50% sponsored by Team Environment Rwanda",
              ],
              cta: "Request Bulk Quote",
              href: "/org/register",
              highlight: false,
            },
            {
              name: "HR System Integration",
              price: "By Quotation",
              priceNote: "Tailored to your organization",
              desc: "Full white-label HR integration for enterprises, conglomerates, and multinationals.",
              features: [
                "Domain routing: tap.yourcompany.rw",
                "Custom API endpoints → Salesforce, HubSpot, SAP",
                "Centralized HR sync & employee onboarding automation",
                "Full white-label branding & customization",
                "Dedicated technical account manager",
                "Exclusive territorial distribution rights (optional)",
                "Zero-waste baselines certification",
                "Priority support & SLA",
              ],
              cta: "Contact Sales",
              href: "/contact",
              highlight: false,
            },
          ].map((plan) => (
            <div
              key={plan.name}
              className={`relative rounded-3xl p-7 border transition-all duration-200 hover:-translate-y-1 flex flex-col ${
                plan.highlight
                  ? "bg-emerald-deep text-ivory border-emerald-deep shadow-card-xl"
                  : "bg-white border-cream-dark/60 shadow-card hover:shadow-card-lg"
              }`}
            >
              {plan.highlight && (
                <span className="absolute -top-3 left-6 bg-gold text-ivory text-xs font-mono tracking-wide px-3 py-1 rounded-full">
                  Best Value
                </span>
              )}

              <h3 className={`font-serif text-xl font-semibold mb-3 ${plan.highlight ? "text-ivory" : "text-emerald-deep"}`}>
                {plan.name}
              </h3>

              {/* Price with original crossed out */}
              {"originalPrice" in plan && plan.originalPrice && (
                <p className={`text-sm line-through mb-1 ${plan.highlight ? "text-ivory/40" : "text-ink-light/50"}`}>
                  {plan.originalPrice}
                </p>
              )}
              <p className={`text-3xl font-bold mb-1 ${plan.highlight ? "text-ivory" : "text-emerald-deep"}`}>
                {plan.price}
              </p>
              <p className={`text-xs mb-4 font-mono ${plan.highlight ? "text-ivory/50" : "text-ink-light"}`}>
                {plan.priceNote}
              </p>

              <p className={`text-sm mb-5 min-h-[36px] ${plan.highlight ? "text-ivory/60" : "text-ink-light"}`}>
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

        {/* ── Footer note ── */}
        <div className="text-center max-w-2xl mx-auto mt-12">
          <div
            className="rounded-2xl p-6 border"
            style={{ backgroundColor: "#FEF9EF", borderColor: "rgba(6,78,59,0.08)" }}
          >
            <p className="text-sm text-ink-mid leading-relaxed">
              <strong>Free profiles are forever.</strong> Every user gets a personal dashboard
              with a dynamic web profile, QR code, and contact-capture forms at no cost.
              Premium hardware is a one-off purchase — no subscriptions, no hidden fees.
              Corporate accounts unlock bulk pricing, brand control, team analytics,
              and ESG carbon reporting.
            </p>
            <p className="text-xs text-ink-light mt-3">
              Sponsored rates made possible by{" "}
              <strong className="text-emerald-deep">Team Environment Rwanda</strong> —
              championing environmental conservation through eco-friendly business practices.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
