import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { ArrowRight, Zap, Shield, Users, Smartphone, QrCode, Mail } from "lucide-react";

export default function HomePage() {
  return (
    <div className="overflow-x-hidden">
      <HeroSection />
      <LogoBar />
      <HowItWorksSection />
      <FeaturesSection />
      <CardShowcase />
      <PricingSection />
      <CtaSection />
    </div>
  );
}

/* ── Hero ──────────────────────────────────────────────────────────────────── */

function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center bg-ivory pt-16 overflow-hidden">

      {/* Background decorations */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Large emerald circle top-right */}
        <div className="absolute -top-32 -right-32 w-[600px] h-[600px] rounded-full bg-emerald-pale opacity-60" />
        {/* Small gold dot */}
        <div className="absolute top-1/3 right-1/4 w-3 h-3 rounded-full bg-gold-light opacity-40" />
        {/* Grid lines */}
        <div
          className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage: "linear-gradient(#064E3B 1px, transparent 1px), linear-gradient(90deg, #064E3B 1px, transparent 1px)",
            backgroundSize: "64px 64px",
          }}
        />
        {/* Bottom fade */}
        <div className="absolute bottom-0 inset-x-0 h-32 bg-gradient-to-t from-ivory to-transparent" />
      </div>

      <div className="relative max-w-6xl mx-auto px-6 py-24 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

        {/* Left — copy */}
        <div>

          <h1 className="font-serif text-display-xl text-emerald-deep leading-[1.05] tracking-tight mb-6">
            Your business<br />
            card,{" "}
            <em className="text-gold not-italic border-b-2 border-gold/40">reinvented.</em>
          </h1>

          <p className="text-lg text-ink-mid font-light leading-relaxed mb-10 max-w-md">
            NFC + QR digital business cards for companies and individuals. One tap — your contact, your story, your brand.
          </p>

          <div className="flex flex-col sm:flex-row gap-3">
            <Link href="/org/register">
              <Button variant="primary" size="lg" rightIcon={<ArrowRight className="h-4 w-4" />}>
                For organisations
              </Button>
            </Link>
            <Link href="/register">
              <Button variant="secondary" size="lg">
                For individuals
              </Button>
            </Link>
          </div>

          <p className="text-xs text-ink-light mt-6 font-mono">
            Physical NFC card included · No technical setup required
          </p>
        </div>

        {/* Right — card mockup */}
        <div className="relative flex items-center justify-center">
          <CardMockup />
        </div>
      </div>
    </section>
  );
}

function CardMockup() {
  return (
    <div className="relative w-full max-w-sm">
      {/* Glow */}
      <div className="absolute inset-0 bg-emerald-bright/10 rounded-[40px] blur-3xl scale-110" />

      {/* Card */}
      <div className="relative bg-emerald-deep rounded-[32px] p-8 shadow-card-xl text-ivory overflow-hidden">
        {/* Card pattern */}
        <div className="absolute top-0 right-0 w-64 h-64 opacity-[0.07]"
          style={{
            backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)",
            backgroundSize: "16px 16px",
          }}
        />

        {/* NFC ripple */}
        <div className="absolute top-6 right-6 flex items-center justify-center">
          <div className="w-10 h-10 rounded-full border border-ivory/20 flex items-center justify-center">
            <div className="w-6 h-6 rounded-full border border-ivory/30 flex items-center justify-center">
              <div className="w-2 h-2 rounded-full bg-ivory/40" />
            </div>
          </div>
        </div>

        {/* Avatar */}
        <div className="w-16 h-16 rounded-2xl bg-ivory/10 border border-ivory/20 flex items-center justify-center mb-6">
          <span className="font-serif text-2xl font-semibold text-ivory">NF</span>
        </div>

        {/* Info */}
        <div className="mb-6">
          <h3 className="font-serif text-2xl font-semibold text-ivory mb-1">Ntwali Frankie</h3>
          <p className="text-ivory/60 text-sm">Founder & CEO</p>
          <p className="text-emerald-light/80 text-sm font-mono tracking-wide mt-0.5">ABC Group</p>
        </div>

        {/* Social icons */}
        <div className="flex gap-3 mb-6">
          {["in", "𝕏", "◎"].map((icon) => (
            <div key={icon} className="w-8 h-8 rounded-lg bg-ivory/10 border border-ivory/15 flex items-center justify-center text-xs text-ivory/70 font-mono">
              {icon}
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="bg-ivory/10 border border-ivory/15 rounded-2xl px-5 py-3 flex items-center justify-between">
          <span className="text-sm text-ivory/80">Save contact</span>
          <div className="w-7 h-7 rounded-lg bg-ivory flex items-center justify-center">
            <ArrowRight className="h-3.5 w-3.5 text-emerald-deep" />
          </div>
        </div>

        {/* QR corner */}
        <div className="absolute bottom-4 right-4 opacity-20">
          <div className="w-12 h-12 grid grid-cols-3 gap-0.5">
            {Array.from({ length: 9 }).map((_, i) => (
              <div key={i} className={`rounded-sm ${[0,2,4,6,8].includes(i) ? "bg-ivory" : "bg-transparent"}`} />
            ))}
          </div>
        </div>
      </div>

      {/* Floating badge */}
      <div className="absolute -bottom-4 -left-4 bg-cream border border-cream-dark rounded-2xl px-4 py-3 shadow-card-lg">
        <p className="text-xs text-ink-light font-mono">Tap to share</p>
        <p className="text-sm font-semibold text-emerald-deep">ecotap.rw/ntwali</p>
      </div>
    </div>
  );
}

/* ── Logo bar ──────────────────────────────────────────────────────────────── */

function LogoBar() {
  const companies = ["RDMC Ltd", "Ubumuntu Health", "BK Arena", "RDB", "MTN Rwanda", "Kigali City"];
  return (
    <div className="border-y border-cream-dark bg-cream py-8">
      <div className="max-w-6xl mx-auto px-6">
        <p className="text-center text-xs font-mono tracking-widest text-ink-light uppercase mb-6">
          Trusted by teams across Rwanda
        </p>
        <div className="flex flex-wrap items-center justify-center gap-8 md:gap-12">
          {companies.map((name) => (
            <span key={name} className="font-serif text-base text-ink-light/50 whitespace-nowrap">
              {name}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ── How it works ──────────────────────────────────────────────────────────── */

function HowItWorksSection() {
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
      description: "Customise your digital profile — photo, title, bio, social links. Choose a card design. We print and ship your NFC card.",
      icon: <Smartphone className="h-5 w-5" />,
    },
    {
      number: "03",
      title: "Tap, share, connect",
      description: "Tap your NFC card on any phone. Visitors see your profile instantly — no app required. They save your contact with one tap.",
      icon: <Zap className="h-5 w-5" />,
    },
  ];

  return (
    <section id="how-it-works" className="py-28 bg-ivory">
      <div className="max-w-6xl mx-auto px-6">
        <SectionHeader
          eyebrow="How it works"
          title={<>Three steps to your<br /><em className="text-gold">smart card</em></>}
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

/* ── Features ──────────────────────────────────────────────────────────────── */

function FeaturesSection() {
  const features = [
    {
      icon: <QrCode className="h-5 w-5" />,
      title: "NFC + QR, both",
      description: "Every card works with tap (NFC) and scan (QR). Works on all modern phones — iPhone, Android — no app download needed.",
      color: "bg-emerald-pale text-emerald-mid",
    },
    {
      icon: <Shield className="h-5 w-5" />,
      title: "Company branding",
      description: "Your logo, your brand color, your domain. Employee cards reflect your company identity — consistent and professional.",
      color: "bg-gold-pale text-gold",
    },
    {
      icon: <Mail className="h-5 w-5" />,
      title: "Contact exchange",
      description: "Visitors can submit their own contact details directly from your card page. You receive them in your dashboard inbox.",
      color: "bg-blue-50 text-blue-600",
    },
    {
      icon: <Users className="h-5 w-5" />,
      title: "Team management",
      description: "Company admins manage all employees from one dashboard. Add departments, assign cards, track activity.",
      color: "bg-emerald-pale text-emerald-mid",
    },
    {
      icon: <Smartphone className="h-5 w-5" />,
      title: "Physical card included",
      description: "We design, print, and ship premium NFC cards to your door. Order any quantity — one for yourself or hundreds for your team.",
      color: "bg-gold-pale text-gold",
    },
    {
      icon: <Zap className="h-5 w-5" />,
      title: "Always up to date",
      description: "Update your profile anytime — your NFC card URL never changes. No reprinting needed when details change.",
      color: "bg-blue-50 text-blue-600",
    },
  ];

  return (
    <section id="features" className="py-28 bg-emerald-deep">
      <div className="max-w-6xl mx-auto px-6">
        <SectionHeader
          eyebrow="Features"
          title={<><em className="not-italic text-ivory">Everything</em>{" "}<span className="text-ivory/50">you need</span></>}
          subtitle="Built for modern professionals and teams in Rwanda."
          light
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-16">
          {features.map((f) => (
            <div
              key={f.title}
              className="bg-ivory/5 border border-ivory/10 rounded-3xl p-7 hover:bg-ivory/8 hover:border-ivory/20 transition-all duration-200 group"
            >
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-5 ${f.color} bg-opacity-20`}>
                {f.icon}
              </div>
              <h3 className="font-serif text-lg font-semibold text-ivory mb-2">{f.title}</h3>
              <p className="text-sm text-ivory/50 leading-relaxed">{f.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── Card showcase ─────────────────────────────────────────────────────────── */

function CardShowcase() {
  return (
    <section className="py-28 bg-cream overflow-hidden">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

          {/* Left — copy */}
          <div>
            <p className="text-xs font-mono tracking-widest text-emerald-bright uppercase mb-4">For organisations</p>
            <h2 className="font-serif text-display-md text-emerald-deep leading-tight mb-6">
              One account.<br />Your whole team.
            </h2>
            <p className="text-ink-light leading-relaxed mb-8 max-w-md">
              Onboard your employees with their own NFC cards, under your company brand. Manage everyone from a single admin dashboard.
            </p>
            <ul className="space-y-3 mb-10">
              {[
                "Custom company branding on every card",
                "Department and team management",
                "Bulk card ordering",
                "Employee activity and contact exchange tracking",
              ].map((item) => (
                <li key={item} className="flex items-start gap-3 text-sm text-ink-mid">
                  <span className="mt-0.5 w-5 h-5 rounded-full bg-emerald-pale border border-emerald-light flex items-center justify-center flex-shrink-0">
                    <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                      <path d="M1 4l3 3 5-6" stroke="#059669" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </span>
                  {item}
                </li>
              ))}
            </ul>
            <Link href="/org/register">
              <Button variant="primary" size="lg" rightIcon={<ArrowRight className="h-4 w-4" />}>
                Register your organisation
              </Button>
            </Link>
          </div>

          {/* Right — mini dashboard mockup */}
          <div className="relative">
            <div className="bg-ivory border border-cream-dark rounded-3xl shadow-card-xl overflow-hidden">
              {/* Topbar */}
              <div className="flex items-center gap-2 px-5 py-4 border-b border-cream-dark bg-cream">
                <div className="w-3 h-3 rounded-full bg-red-300" />
                <div className="w-3 h-3 rounded-full bg-gold-pale" />
                <div className="w-3 h-3 rounded-full bg-emerald-light" />
                <span className="ml-3 text-xs font-mono text-ink-light">dashboard.ecotap.rw</span>
              </div>
              {/* Content */}
              <div className="p-5">
                <div className="flex items-center justify-between mb-4">
                  <span className="font-serif text-sm font-semibold text-emerald-deep">Team cards</span>
                  <span className="text-xs font-mono text-ink-light">12 active</span>
                </div>
                {[
                  { name: "Ntwali Frankie",  role: "CEO",        status: "active" },
                  { name: "Amara Uwimana",    role: "Designer",   status: "active" },
                  { name: "Eric Hakizimana",  role: "Dev Lead",   status: "pending" },
                ].map((emp) => (
                  <div key={emp.name} className="flex items-center gap-3 py-3 border-b border-cream-dark last:border-0">
                    <div className="w-8 h-8 rounded-xl bg-emerald-pale flex items-center justify-center text-xs font-medium text-emerald-mid">
                      {emp.name.split(" ").map(n => n[0]).join("")}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-ink truncate">{emp.name}</p>
                      <p className="text-xs text-ink-light">{emp.role}</p>
                    </div>
                    <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full border ${
                      emp.status === "active"
                        ? "bg-emerald-pale text-emerald-mid border-emerald-light"
                        : "bg-gold-pale text-gold border-gold/20"
                    }`}>
                      {emp.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ── Pricing ───────────────────────────────────────────────────────────────── */

function PricingSection() {
  return (
    <section id="pricing" className="py-28 bg-ivory">
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
              cta: "Get started",
              href: "/org/register",
              highlight: false,
            },
            {
              cycle: "Annual",
              badge: "Save more",
              description: "Commit annually and get our best per-employee rate.",
              perks: ["Everything in monthly", "Discounted rate", "Priority support", "Dedicated account manager"],
              cta: "Get started",
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
            Sign up here →
          </Link>
        </p>
      </div>
    </section>
  );
}

/* ── CTA section ───────────────────────────────────────────────────────────── */

function CtaSection() {
  return (
    <section className="py-28 bg-cream">
      <div className="max-w-3xl mx-auto px-6 text-center">
        <p className="text-xs font-mono tracking-widest text-emerald-bright uppercase mb-6">Get started today</p>
        <h2 className="font-serif text-display-lg text-emerald-deep mb-6">
          Ready to make your<br />
          <em className="text-gold">first impression</em> count?
        </h2>
        <p className="text-ink-light leading-relaxed mb-10 max-w-md mx-auto">
          Join companies and individuals across Rwanda who have already upgraded to smart digital business cards.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/org/register">
            <Button variant="primary" size="xl" rightIcon={<ArrowRight className="h-4 w-4" />}>
              Register your organisation
            </Button>
          </Link>
          <Link href="/register">
            <Button variant="secondary" size="xl">
              Individual sign up
            </Button>
          </Link>
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
  light = false,
}: {
  eyebrow: string;
  title: React.ReactNode;
  subtitle: string;
  light?: boolean;
}) {
  return (
    <div className="text-center max-w-2xl mx-auto">
      <p className={`text-xs font-mono tracking-widest uppercase mb-4 ${light ? "text-emerald-light" : "text-emerald-bright"}`}>
        {eyebrow}
      </p>
      <h2 className={`font-serif text-display-md leading-tight mb-4 ${light ? "text-ivory" : "text-emerald-deep"}`}>
        {title}
      </h2>
      <p className={`text-base leading-relaxed ${light ? "text-ivory/50" : "text-ink-light"}`}>
        {subtitle}
      </p>
    </div>
  );
}
