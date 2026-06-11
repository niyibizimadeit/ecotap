import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { ArrowRight } from "lucide-react";

export default function PricingPage() {
  return (
    <section className="py-28 bg-ivory">
      <div className="max-w-6xl mx-auto px-6">
        <SectionHeader
          eyebrow="Pricing"
          title={<>Flexible plans for<br /><em className="text-gold">every team size</em></>}
          subtitle="Per-employee pricing — pay only for what you use. Contact us for a custom quote."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto mt-16">
          {[
            {
              cycle: "Monthly",
              badge: null,
              description: "Pay month to month. Scale up or down anytime.",
              perks: ["Per-employee billing", "Full dashboard access", "Card ordering included", "Email support"],
              cta: "Get your card — Corporate",
              href: "/org/register",
              highlight: false,
            },
            {
              cycle: "Annual",
              badge: "Save more",
              description: "Commit annually and get our best per-employee rate.",
              perks: ["Everything in monthly", "Discounted rate", "Priority support", "Dedicated account manager"],
              cta: "Get your card — Corporate",
              href: "/org/register",
              highlight: true,
            },
          ].map((plan) => (
            <div
              key={plan.cycle}
              className={`relative rounded-3xl p-8 border transition-all duration-200 ${
                plan.highlight
                  ? "bg-emerald-deep text-ivory border-emerald-deep shadow-card-xl"
                  : "bg-cream border-cream-dark shadow-card hover:shadow-card-lg"
              }`}
            >
              {plan.badge && (
                <span className="absolute -top-3 left-8 bg-gold text-ivory text-xs font-mono tracking-wide px-3 py-1 rounded-full">
                  {plan.badge}
                </span>
              )}
              <p className={`text-xs font-mono tracking-widest uppercase mb-3 ${plan.highlight ? "text-emerald-light" : "text-ink-light"}`}>
                {plan.cycle}
              </p>
              <p className={`font-serif text-display-sm font-semibold mb-1 ${plan.highlight ? "text-ivory" : "text-emerald-deep"}`}>
                Contact us
              </p>
              <p className={`text-sm mb-6 ${plan.highlight ? "text-ivory/60" : "text-ink-light"}`}>
                {plan.description}
              </p>
              <ul className="space-y-2.5 mb-8">
                {plan.perks.map((perk) => (
                  <li key={perk} className="flex items-center gap-2.5 text-sm">
                    <svg width="14" height="11" viewBox="0 0 14 11" fill="none">
                      <path d="M1.5 5.5l4 4 7-8" stroke={plan.highlight ? "#A7F3D0" : "#059669"} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    <span className={plan.highlight ? "text-ivory/80" : "text-ink-mid"}>{perk}</span>
                  </li>
                ))}
              </ul>
              <Link href={plan.href}>
                <Button
                  variant={plan.highlight ? "secondary" : "primary"}
                  size="lg"
                  className="w-full"
                  rightIcon={<ArrowRight className="h-4 w-4" />}
                >
                  {plan.cta}
                </Button>
              </Link>
            </div>
          ))}
        </div>

        <p className="text-center text-sm text-ink-light mt-8">
          Individual and freelancer plans available.{" "}
          <Link href="/register" className="text-emerald-bright underline underline-offset-4 hover:text-emerald-mid transition-colors">
            Get your card — Individual →
          </Link>
        </p>
      </div>
    </section>
  );
}

/* ── Shared helpers ─────────────────────────────────────────────────────────── */

function SectionHeader({
  eyebrow,
  title,
  subtitle,
}: {
  eyebrow: string;
  title: React.ReactNode;
  subtitle: string;
}) {
  return (
    <div className="text-center max-w-2xl mx-auto">
      <p className="text-xs font-mono tracking-widest uppercase mb-4 text-emerald-bright">
        {eyebrow}
      </p>
      <h2 className="font-serif text-display-md leading-tight mb-4 text-emerald-deep">
        {title}
      </h2>
      <p className="text-base leading-relaxed text-ink-light">
        {subtitle}
      </p>
    </div>
  );
}
