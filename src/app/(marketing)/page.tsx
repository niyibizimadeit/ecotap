import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { ArrowRight, Users, Smartphone, Zap } from "lucide-react";

export default function HomePage() {
  return (
    <div className="overflow-x-hidden">
      <HeroSection />
      <LogoBar />
      <HowItWorksSection />
      <CtaSection />
    </div>
  );
}

/* ── Hero ──────────────────────────────────────────────────────────────────── */

function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center bg-ivory pt-16 overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-32 -right-32 w-[600px] h-[600px] rounded-full bg-emerald-pale opacity-60" />
        <div className="absolute top-1/3 right-1/4 w-3 h-3 rounded-full bg-gold-light opacity-40" />
        <div
          className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage: "linear-gradient(#064E3B 1px, transparent 1px), linear-gradient(90deg, #064E3B 1px, transparent 1px)",
            backgroundSize: "64px 64px",
          }}
        />
        <div className="absolute bottom-0 inset-x-0 h-32 bg-gradient-to-t from-ivory to-transparent" />
      </div>

      <div className="relative max-w-6xl mx-auto px-6 py-24 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        <div>
          <h1 className="font-serif text-display-xl text-emerald-deep leading-[1.05] tracking-tight mb-6">
            Your eco-friendly<br />
            business{" "}
            <em className="text-gold not-italic border-b-2 border-gold/40">card.</em>
          </h1>
          <p className="text-lg text-ink-mid font-light leading-relaxed mb-10 max-w-md">
            NFC + QR eco-friendly digital business cards for companies and individuals. With one tap, share your story and protect the environment.
          </p>
          <p className="text-sm font-semibold text-ink-mid mb-3">Get your card</p>
          <div className="flex flex-col sm:flex-row gap-3">
            <Link href="/org/register">
              <Button variant="primary" size="lg" rightIcon={<ArrowRight className="h-4 w-4" />}>
                Corporate
              </Button>
            </Link>
            <Link href="/register">
              <Button variant="secondary" size="lg">
                Individual
              </Button>
            </Link>
          </div>
          <p className="text-xs text-ink-light mt-6 font-mono">
            Eco tap card included · No technical setup required
          </p>
        </div>
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
      <div className="absolute inset-0 bg-emerald-bright/10 rounded-[40px] blur-3xl scale-110" />
      <div className="relative bg-emerald-deep rounded-[32px] p-8 shadow-card-xl text-ivory overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 opacity-[0.07]"
          style={{
            backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)",
            backgroundSize: "16px 16px",
          }}
        />
        <div className="absolute top-6 right-6 flex items-center justify-center">
          <div className="w-10 h-10 rounded-full border border-ivory/20 flex items-center justify-center">
            <div className="w-6 h-6 rounded-full border border-ivory/30 flex items-center justify-center">
              <div className="w-2 h-2 rounded-full bg-ivory/40" />
            </div>
          </div>
        </div>
        <div className="w-16 h-16 rounded-2xl bg-ivory/10 border border-ivory/20 flex items-center justify-center mb-6">
          <span className="font-serif text-2xl font-semibold text-ivory">NF</span>
        </div>
        <div className="mb-6">
          <h3 className="font-serif text-2xl font-semibold text-ivory mb-1">Ntwali Frankie</h3>
          <p className="text-ivory/60 text-sm">Founder & CEO</p>
          <p className="text-emerald-light/80 text-sm font-mono tracking-wide mt-0.5">ABC Group</p>
        </div>
        <div className="flex gap-3 mb-6">
          {["in", "𝕏", "◎"].map((icon) => (
            <div key={icon} className="w-8 h-8 rounded-lg bg-ivory/10 border border-ivory/15 flex items-center justify-center text-xs text-ivory/70 font-mono">
              {icon}
            </div>
          ))}
        </div>
        <div className="bg-ivory/10 border border-ivory/15 rounded-2xl px-5 py-3 flex items-center justify-between">
          <span className="text-sm text-ivory/80">Save contact</span>
          <div className="w-7 h-7 rounded-lg bg-ivory flex items-center justify-center">
            <ArrowRight className="h-3.5 w-3.5 text-emerald-deep" />
          </div>
        </div>
        <div className="absolute bottom-4 right-4 opacity-20">
          <div className="w-12 h-12 grid grid-cols-3 gap-0.5">
            {Array.from({ length: 9 }).map((_, i) => (
              <div key={i} className={`rounded-sm ${[0,2,4,6,8].includes(i) ? "bg-ivory" : "bg-transparent"}`} />
            ))}
          </div>
        </div>
      </div>
      <div className="absolute -bottom-4 -left-4 bg-cream border border-cream-dark rounded-2xl px-4 py-3 shadow-card-lg">
        <p className="text-xs text-ink-light font-mono">Tap to share</p>
        <p className="text-sm font-semibold text-emerald-deep">ecotap.rw/ntwali</p>
      </div>
    </div>
  );
}

/* ── Logo bar ──────────────────────────────────────────────────────────────── */

function LogoBar() {
  const companies = [
    { name: "RDMC Ltd", url: "https://rdmc.rw" },
    { name: "Team Environment", url: "https://teamenvironment.org" },
    { name: "KMNC Africa", url: "https://kmnc.africa" },
    { name: "Ubumuntu Health Labs", url: "https://ubumuntuhealthlabs.rw" },
    { name: "ICBNA", url: "https://icbna.org" },
  ];

  return (
    <div className="border-y border-cream-dark bg-cream py-8">
      <div className="max-w-6xl mx-auto px-6">
        <p className="text-center text-xs font-mono tracking-widest text-ink-light uppercase mb-6">
          Trusted by teams across the world
        </p>
        <div className="flex flex-wrap items-center justify-center gap-8 md:gap-12">
          {companies.map(({ name, url }) => (
            <a
              key={name}
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="font-serif text-base text-ink-light/50 hover:text-emerald-deep whitespace-nowrap transition-colors duration-150"
            >
              {name}
            </a>
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
        <div className="text-center max-w-2xl mx-auto">
          <p className="text-xs font-mono tracking-widest uppercase mb-4 text-emerald-bright">How it works</p>
          <h2 className="font-serif text-display-md leading-tight mb-4 text-emerald-deep">
            Three steps to your<br /><em className="text-gold">Eco tap card</em>
          </h2>
          <p className="text-base leading-relaxed text-ink-light">
            From registration to your first tap — it's simpler than you think.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16 relative">
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

/* ── CTA section ───────────────────────────────────────────────────────────── */

function CtaSection() {
  return (
    <section className="py-28 bg-cream">
      <div className="max-w-3xl mx-auto px-6 text-center">
        <p className="text-xs font-mono tracking-widest text-emerald-bright uppercase mb-6">Ready to go green with us</p>
        <h2 className="font-serif text-display-lg text-emerald-deep mb-6">
          Join companies who have{" "}
          <em className="text-gold">switched to eco-friendly</em>{" "}
          business cards
        </h2>
        <p className="text-ink-light leading-relaxed mb-10 max-w-md mx-auto">
          Upgrade your networking. One tap, zero waste — make every introduction count while protecting the planet.
        </p>
        <p className="text-sm font-semibold text-ink-mid mb-4">Get your card</p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/org/register">
            <Button variant="primary" size="xl" rightIcon={<ArrowRight className="h-4 w-4" />}>
              Corporate
            </Button>
          </Link>
          <Link href="/register">
            <Button variant="secondary" size="xl">
              Individual
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
