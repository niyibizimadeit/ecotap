import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { ArrowRight, Zap, Shield, Users, Smartphone, QrCode, Mail } from "lucide-react";

export default function FeaturesPage() {
  return (
    <div>
      <FeaturesSection />
      <CardShowcase />
    </div>
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
      title: "Eco tap card included",
      description: "We design, print, and ship premium Eco tap cards to your door. Order any quantity — one for yourself or hundreds for your team.",
      color: "bg-gold-pale text-gold",
    },
    {
      icon: <Zap className="h-5 w-5" />,
      title: "Always up to date",
      description: "Update your profile anytime — your card URL never changes. No reprinting needed when details change.",
      color: "bg-blue-50 text-blue-600",
    },
  ];

  return (
    <section className="py-28 bg-ivory">
      <div className="max-w-6xl mx-auto px-6">
        <SectionHeader
          eyebrow="Features"
          title={<>Everything{" "}<em className="text-gold">you need</em></>}
          subtitle="Built for modern professionals and teams across the world."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-16">
          {features.map((f) => (
            <div
              key={f.title}
              className="bg-emerald-deep border border-emerald-mid rounded-3xl p-7 hover:shadow-card-xl hover:-translate-y-0.5 transition-all duration-200 group"
            >
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-5 bg-ivory/10`}>
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
              Onboard your employees with their own Eco tap cards, under your company brand. Manage everyone from a single admin dashboard.
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
                Get your card — Corporate
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
