import { Users, Smartphone, Zap, ArrowRight } from "lucide-react";

export default function HowItWorksPage() {
  const steps = [
    {
      number: "01",
      title: "Register & get approved",
      description: "Sign up as an organisation or individual. Our team reviews your application and activates your account within 24 hours.",
      icon: <Users className="h-5 w-5" />,
    },
    {
      number: "02",
      title: "Design your card",
      description: "Customise your digital profile — photo, title, bio, social links. Choose a card design. We print and ship your Eco tap card.",
      icon: <Smartphone className="h-5 w-5" />,
    },
    {
      number: "03",
      title: "Tap, share, connect",
      description: "Tap your Eco tap card on any phone. Visitors see your profile instantly — no app required. They save your contact with one tap.",
      icon: <Zap className="h-5 w-5" />,
    },
  ];

  return (
    <section className="py-28 bg-ivory">
      <div className="max-w-6xl mx-auto px-6">
        <SectionHeader
          eyebrow="How it works"
          title={<>Three steps to your<br /><em className="text-gold">Eco tap card</em></>}
          subtitle="From registration to your first tap — it's simpler than you think."
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16 relative">
          {/* Connecting line */}
          <div className="hidden md:block absolute top-10 left-1/6 right-1/6 h-px bg-gradient-to-r from-transparent via-emerald-light to-transparent" />

          {steps.map((step, i) => (
            <div key={step.number} className="relative">
              <div className="bg-cream border border-cream-dark rounded-3xl p-8 h-full hover:shadow-card-lg hover:-translate-y-1 transition-all duration-200">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-deep flex items-center justify-center text-ivory">
                    {step.icon}
                  </div>
                  <span className="font-mono text-3xl font-medium text-ink-light/30">{step.number}</span>
                </div>
                <h3 className="font-serif text-xl font-semibold text-emerald-deep mb-3">{step.title}</h3>
                <p className="text-sm text-ink-light leading-relaxed">{step.description}</p>
              </div>
              {/* Arrow between steps */}
              {i < steps.length - 1 && (
                <div className="hidden md:flex absolute top-10 -right-3 z-10 w-6 h-6 rounded-full bg-emerald-pale border border-emerald-light items-center justify-center">
                  <ArrowRight className="h-3 w-3 text-emerald-bright" />
                </div>
              )}
            </div>
          ))}
        </div>
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
