import { Leaf, Trees, Zap, Cloud, Heart, BarChart3, Globe, Shield, Eye, Target } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="bg-ivory">
      {/* Hero Banner */}
      <section className="pt-28 pb-16">
        <div className="max-w-6xl mx-auto px-6">
          <div className="bg-emerald-deep rounded-[32px] p-10 text-ivory">
            <span className="inline-block bg-ivory/20 text-ivory text-xs font-mono tracking-wide px-3 py-1 rounded-full mb-4">
              ♻️ The Future of Networking
            </span>
            <h1 className="font-serif text-4xl font-semibold mb-4">EcoTap: Your Eco-Friendly Business Card</h1>
            <p className="text-ivory/80 text-lg max-w-2xl leading-relaxed">
              A single, sustainable NFC card that replaces thousands of paper cards. Smart, circular, and built for the modern professional who cares about the planet.
            </p>
          </div>
        </div>
      </section>

      {/* Why Greenest Choice */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="font-serif text-3xl text-emerald-deep font-semibold mb-10 text-center">
            Why EcoTap is the Greenest Choice for Professionals
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: <Leaf className="h-6 w-6" />, title: "100% Recycled Materials", desc: "Our cards are manufactured from post-consumer recycled PVC (rPVC), diverting plastic waste from landfills and eliminating virgin plastic production entirely." },
              { icon: <Trees className="h-6 w-6" />, title: "Carbon Negative Production", desc: "Every EcoTap card is produced using renewable energy sources. For every card sold, we plant one tree through our partnership with reforestation projects in Rwanda's Gishwati Forest." },
              { icon: <Zap className="h-6 w-6" />, title: "Battery-Free Technology", desc: "The NTAG213 NFC chip is passive — it draws no power and requires no charging. One card lasts a lifetime of networking without any electronic waste." },
              { icon: <Cloud className="h-6 w-6" />, title: "Zero Re-Printing Waste", desc: "Change jobs, titles, or phone numbers? Update your digital profile instantly — no need to discard and reprint physical cards ever again." },
              { icon: <Heart className="h-6 w-6" />, title: "Ethical Supply Chain", desc: "All manufacturing partners are audited for fair labor practices, and 5% of profits support environmental education programs in Rwandan schools." },
              { icon: <BarChart3 className="h-6 w-6" />, title: "Measurable Impact Dashboard", desc: "Track your personal environmental savings: trees preserved, water conserved, and CO₂ emissions avoided — visible right inside your EcoTap profile." },
            ].map((f) => (
              <div key={f.title} className="bg-emerald-pale/30 border border-emerald-light/50 rounded-3xl p-7 hover:shadow-card-lg hover:-translate-y-1 transition-all duration-200">
                <div className="w-10 h-10 rounded-xl bg-emerald-pale flex items-center justify-center text-emerald-deep mb-5">
                  {f.icon}
                </div>
                <h3 className="font-serif text-lg font-semibold text-emerald-deep mb-2">{f.title}</h3>
                <p className="text-sm text-ink-light leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* The Power Behind EcoTap */}
      <section className="py-16 bg-cream">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="font-serif text-3xl text-emerald-deep font-semibold mb-10 text-center">The Power Behind EcoTap</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-emerald-pale/30 border border-emerald-light/50 rounded-3xl p-8 hover:shadow-card-lg transition-all duration-200">
              <div className="w-10 h-10 rounded-xl bg-emerald-pale flex items-center justify-center text-emerald-deep mb-4">
                <Leaf className="h-5 w-5" />
              </div>
              <h3 className="font-serif text-xl font-semibold text-emerald-deep mb-3">Team Environment Rwanda</h3>
              <p className="text-sm text-ink-light leading-relaxed">Premier environmental advocacy organization. Oversees circular material chains, carbon auditing metrics, and national environmental compliance frameworks.</p>
            </div>
            <div className="bg-emerald-pale/30 border border-emerald-light/50 rounded-3xl p-8 hover:shadow-card-lg transition-all duration-200">
              <div className="w-10 h-10 rounded-xl bg-emerald-pale flex items-center justify-center text-emerald-deep mb-4">
                <Globe className="h-5 w-5" />
              </div>
              <h3 className="font-serif text-xl font-semibold text-emerald-deep mb-3">Rwanda Digital Marketing Co.</h3>
              <p className="text-sm text-ink-light leading-relaxed">Market-leading technology enterprise specializing in scalable corporate digital architecture, secure cloud engineering, and data-driven branding.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Vision & Mission */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-6">
          <div className="bg-emerald-pale/50 rounded-[36px] p-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <Eye className="h-6 w-6 text-emerald-deep" />
                  <h3 className="font-serif text-xl font-semibold text-emerald-deep">Our Vision</h3>
                </div>
                <p className="text-sm text-ink-light leading-relaxed">To establish a fully paperless corporate networking ecosystem across the African continent, positioning Rwanda as the foundational global benchmark for tech-enabled environmental conservation and advanced sustainable digital enterprise.</p>
              </div>
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <Target className="h-6 w-6 text-emerald-deep" />
                  <h3 className="font-serif text-xl font-semibold text-emerald-deep">Our Mission</h3>
                </div>
                <p className="text-sm text-ink-light leading-relaxed">To systematically eradicate paper business card waste by equipping millions of professionals with smart, recycled-material alternatives — simultaneously lowering corporate operational overheads while driving quantifiable, verified reductions in regional deforestation and industrial carbon footprints.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Comparison Table */}
      <section className="py-16 bg-cream">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="font-serif text-3xl text-emerald-deep font-semibold mb-8 text-center">Paper Card vs EcoTap: The Clear Winner</h2>
          <div className="overflow-x-auto bg-emerald-pale/20 rounded-3xl shadow-card">
            <table className="w-full border-collapse">
              <thead className="bg-emerald-deep text-ivory">
                <tr>
                  <th className="p-5 text-left text-sm font-semibold">Feature</th>
                  <th className="p-5 text-left text-sm font-semibold">Paper Business Card</th>
                  <th className="p-5 text-left text-sm font-semibold">EcoTap Smart Card</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ["Material Source", "Virgin wood pulp (trees)", "100% Recycled PVC (rPVC)"],
                  ["Lifespan", "Days to weeks", "10+ years / 100,000+ uses"],
                  ["Updateable Info", "❌ No (reprint needed)", "✅ Real-time digital updates"],
                  ["Waste Generated", "88% discarded within 1 week", "Zero waste — one card forever"],
                  ["Carbon Footprint", "11.4g CO₂ per card × 1000 cards", "1.2kg CO₂ saved over lifetime"],
                  ["Analytics & Tracking", "❌ No data", "✅ Full tap analytics & lead capture"],
                ].map(([feature, paper, ecotap], i) => (
                  <tr key={feature} className={i % 2 === 0 ? "bg-emerald-pale/30" : "bg-emerald-pale/10"}>
                    <td className="p-5 text-sm font-semibold text-ink">{feature}</td>
                    <td className="p-5 text-sm text-ink-light">{paper}</td>
                    <td className="p-5 text-sm font-semibold text-emerald-deep">{ecotap}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Certification Badges */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex flex-wrap justify-center gap-8 bg-emerald-pale/30 rounded-3xl p-10 shadow-card">
            {[
              { icon: <Shield className="h-8 w-8" />, title: "Certified B Corp", sub: "Pending" },
              { icon: <Globe className="h-8 w-8" />, title: "Made in Rwanda", sub: "Local Assembly" },
              { icon: <Leaf className="h-8 w-8" />, title: "100% Recyclable", sub: "End-of-life program" },
              { icon: <Trees className="h-8 w-8" />, title: "1 Card = 1 Tree", sub: "Reforestation pledge" },
            ].map((b) => (
              <div key={b.title} className="text-center">
                <div className="text-emerald-deep mb-2 flex justify-center">{b.icon}</div>
                <p className="font-semibold text-emerald-deep text-sm">{b.title}</p>
                <p className="text-xs text-ink-light">{b.sub}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
