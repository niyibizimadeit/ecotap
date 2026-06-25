import { Mail, Phone, MapPin, MessageCircle, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input, Textarea } from "@/components/ui/Input";

export default function ContactPage() {
  return (
    <div className="bg-ivory">
      <section className="pt-28 pb-20">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <p className="text-xs font-mono tracking-widest uppercase mb-4 text-emerald-bright">Contact Us</p>
            <h1 className="font-serif text-display-md leading-tight mb-4 text-emerald-deep">
              Let&apos;s{" "}
              <em className="text-gold">connect</em>
            </h1>
            <p className="text-base leading-relaxed text-ink-light">
              Ready to go green? Have questions about EcoTap for your team? We&apos;re here to help.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-5xl mx-auto">
            {/* Contact Form */}
            <div className="bg-emerald-pale/30 border border-emerald-light/50 rounded-3xl p-8 shadow-card">
              <h2 className="font-serif text-xl font-semibold text-emerald-deep mb-6">Send us a message</h2>
              <form className="space-y-5">
                <Input label="Full name" placeholder="Your full name" required />
                <Input label="Email address" type="email" placeholder="you@company.com" required />
                <Input label="Phone number" type="tel" placeholder="+250 7XX XXX XXX" />
                <Input label="Company" placeholder="Your company name" />
                <Textarea label="Message" placeholder="Tell us about your needs..." required />
                <Button type="submit" variant="primary" size="lg" className="w-full" rightIcon={<ArrowRight className="h-4 w-4" />}>
                  Send message
                </Button>
              </form>
            </div>

            {/* Contact Info */}
            <div className="space-y-6">
              <div className="bg-emerald-pale/30 border border-emerald-light/50 rounded-3xl p-8 shadow-card">
                <h2 className="font-serif text-xl font-semibold text-emerald-deep mb-6">Get in touch</h2>
                <div className="space-y-5">
                  {[
                    { icon: <Mail className="h-5 w-5" />, label: "Email", value: "ecotap@rdmc.rw", href: "mailto:ecotap@rdmc.rw" },
                    { icon: <Phone className="h-5 w-5" />, label: "Phone", value: "+250 783 757 699", href: "tel:+250783757699" },
                    { icon: <MapPin className="h-5 w-5" />, label: "Location", value: "Kigali, Rwanda", href: null },
                    { icon: <MessageCircle className="h-5 w-5" />, label: "WhatsApp", value: "+250 783 757 699", href: "https://wa.me/250783757699" },
                  ].map((item) => (
                    <div key={item.label} className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-xl bg-emerald-pale flex items-center justify-center text-emerald-deep flex-shrink-0">
                        {item.icon}
                      </div>
                      <div>
                        <p className="text-xs text-ink-light uppercase tracking-wide">{item.label}</p>
                        {item.href ? (
                          <a href={item.href} className="text-sm font-medium text-emerald-deep hover:text-emerald-bright transition-colors">
                            {item.value}
                          </a>
                        ) : (
                          <p className="text-sm font-medium text-ink">{item.value}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Enterprise CTA */}
              <div className="bg-emerald-deep rounded-3xl p-8 text-ivory">
                <h3 className="font-serif text-xl font-semibold mb-3">Enterprise Solutions</h3>
                <p className="text-ivory/70 text-sm leading-relaxed mb-4">
                  Need custom branding, bulk orders, or a dedicated account manager? Our enterprise team will build a tailored package for your organisation.
                </p>
                <a href="mailto:ecotap@rdmc.rw" className="text-sm font-semibold text-emerald-light hover:text-ivory transition-colors flex items-center gap-1">
                  ecotap@rdmc.rw <ArrowRight className="h-3.5 w-3.5" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
