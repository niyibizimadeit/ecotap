import { Trees, Wind, Trash2, Droplets, GraduationCap, Leaf } from "lucide-react";

// Pure static page — no data dependencies.
export const dynamic = "force-static";

export default function ImpactPage() {
  return (
    <div className="bg-ivory">
      <section className="pt-28 pb-20">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <p className="text-xs font-mono tracking-widest uppercase mb-4 text-emerald-bright">Impact</p>
            <h1 className="font-serif text-display-md leading-tight mb-4 text-emerald-deep">
              Community &{" "}
              <em className="text-gold">Environmental</em>{" "}
              Impact
            </h1>
            <p className="text-base leading-relaxed text-ink-light">
              Every EcoTap card makes a measurable difference. Here&apos;s what we&apos;re achieving together.
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
            {[
              { number: "7,000+ kg", label: "CO₂ prevented per card lifetime", icon: <Wind className="h-6 w-6" /> },
              { number: "40,000+", label: "Paper cards replaced", icon: <Trees className="h-6 w-6" /> },
              { number: "88%", label: "Reduction in card waste", icon: <Trash2 className="h-6 w-6" /> },
            ].map((stat) => (
              <div key={stat.label} className="bg-emerald-pale/50 rounded-3xl p-8 text-center hover:shadow-card-lg transition-all duration-200">
                <div className="w-12 h-12 rounded-2xl bg-emerald-deep flex items-center justify-center text-ivory mx-auto mb-4">
                  {stat.icon}
                </div>
                <p className="text-4xl font-bold text-emerald-deep mb-2">{stat.number}</p>
                <p className="text-sm text-ink-light">{stat.label}</p>
              </div>
            ))}
          </div>

          {/* The Problem & Solution */}
          <div className="max-w-3xl mx-auto mb-16">
            <div className="bg-cream border border-cream-dark rounded-3xl p-8 md:p-10">
              <h2 className="font-serif text-2xl text-emerald-deep font-semibold mb-4 text-center">
                One Card for a 40+ Year Career
              </h2>
              <p className="text-sm text-ink-light leading-relaxed mb-4">
                An average person uses <strong>300–1,000 paper cards per year</strong> — approximately{" "}
                <strong>12,000–40,000 cards</strong> during a 40-year career. But with EcoTap, you only need{" "}
                <strong>one card</strong> for a 40+ year lifetime, disregarding physical damage.
              </p>
              <p className="text-sm text-ink-light leading-relaxed">
                Now let&apos;s break it down. Here&apos;s what one card equates to:
              </p>
            </div>
          </div>

          {/* Environmental Footprint Table */}
          <div className="mb-16">
            <h2 className="font-serif text-2xl text-emerald-deep font-semibold mb-6 text-center">
              Environmental Footprint Comparison
            </h2>
            <div className="overflow-x-auto bg-white border border-emerald-light/30 rounded-3xl shadow-card">
              <table className="w-full border-collapse">
                <thead className="bg-emerald-deep text-ivory">
                  <tr>
                    <th className="p-4 text-left text-sm font-semibold">Number of Cards</th>
                    <th className="p-4 text-left text-sm font-semibold">Trees Consumed</th>
                    <th className="p-4 text-left text-sm font-semibold">CO₂ Released (kg)</th>
                    <th className="p-4 text-left text-sm font-semibold">Water Used (Litres)</th>
                    <th className="p-4 text-left text-sm font-semibold">Waste Impact</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { cards: "1 Paper Card", trees: "0.0625%", co2: "0.19", water: "2.5", waste: "1 Card (88% in landfill)" },
                    { cards: "100 Paper Cards", trees: "6.25%", co2: "18.93", water: "250", waste: "88 cards" },
                    { cards: "1,000 Paper Cards", trees: "62.5%", co2: "189.30", water: "2,500", waste: "880 cards" },
                    { cards: "40,000 Paper Cards", trees: "2,500% (25 trees)", co2: "7,572.00", water: "100,000", waste: "35,200 cards" },
                    { cards: "1 EcoTap Card", trees: "0%", co2: "0.05", water: "0.5", waste: <span className="text-emerald-bright font-semibold">Fully recyclable · 40+ years</span> },
                  ].map((row, i) => (
                    <tr key={row.cards} className={i % 2 === 0 ? "bg-emerald-pale/20" : "bg-emerald-pale/10"}>
                      <td className="p-4 text-sm font-semibold text-ink">{row.cards}</td>
                      <td className="p-4 text-sm text-ink-light">{row.trees}</td>
                      <td className="p-4 text-sm text-ink-light">{row.co2}</td>
                      <td className="p-4 text-sm text-ink-light">{row.water}</td>
                      <td className="p-4 text-sm text-ink-light">{row.waste}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Lifetime Comparison */}
          <div className="mb-16">
            <h2 className="font-serif text-2xl text-emerald-deep font-semibold mb-6 text-center">
              The Lifetime Comparison: 1 PVC Card vs. Paper Equivalent
            </h2>
            <div className="bg-emerald-deep rounded-3xl p-8 md:p-10 text-ivory">
              <p className="text-ivory/70 text-sm leading-relaxed mb-6">
                If one professional uses a single PVC card over a 5-year career instead of traditional paper cards, look at the net positive savings:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  { number: "5,000", label: "Paper Cards Replaced" },
                  { number: "3.125", label: "Trees Saved" },
                  { number: "946.5 kg", label: "CO₂ Prevented" },
                  { number: "12,500 L", label: "Water Preserved" },
                ].map((item) => (
                  <div key={item.label} className="text-center bg-ivory/5 rounded-2xl p-5">
                    <p className="text-3xl font-bold text-gold mb-2">{item.number}</p>
                    <p className="text-xs text-ivory/60">{item.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Impact Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            <div className="bg-emerald-pale/30 border border-emerald-light/50 rounded-3xl p-8 hover:shadow-card-lg transition-all duration-200">
              <div className="w-10 h-10 rounded-xl bg-emerald-pale flex items-center justify-center text-emerald-deep mb-4">
                <Trash2 className="h-5 w-5" />
              </div>
              <h3 className="font-serif text-xl font-semibold text-emerald-deep mb-3">Municipal Waste Mitigation</h3>
              <p className="text-sm text-ink-light leading-relaxed">
                Thousands of pounds of garbage diverted from landfills. By eliminating paper business cards, we prevent toxic ink and coating chemicals from entering soil and water systems.
              </p>
            </div>
            <div className="bg-emerald-pale/30 border border-emerald-light/50 rounded-3xl p-8 hover:shadow-card-lg transition-all duration-200">
              <div className="w-10 h-10 rounded-xl bg-emerald-pale flex items-center justify-center text-emerald-deep mb-4">
                <GraduationCap className="h-5 w-5" />
              </div>
              <h3 className="font-serif text-xl font-semibold text-emerald-deep mb-3">Green Tech Jobs</h3>
              <p className="text-sm text-ink-light leading-relaxed">
                Localized assembly, printing, and software roles for Rwandan youth. Our manufacturing and fulfillment operations create skilled green-tech employment opportunities across the region.
              </p>
            </div>
          </div>

          {/* Did You Know */}
          <div className="bg-emerald-deep rounded-3xl p-10 text-center">
            <div className="w-14 h-14 rounded-2xl bg-ivory/10 flex items-center justify-center mx-auto mb-5">
              <Droplets className="h-7 w-7 text-ivory" />
            </div>
            <h3 className="font-serif text-2xl font-semibold text-ivory mb-3">Did you know?</h3>
            <p className="text-ivory/70 text-lg max-w-2xl mx-auto leading-relaxed">
              One EcoTap card prevents over <strong className="text-ivory">7,000+ kg of carbon</strong> over its lifespan and replaces up to{" "}
              <strong className="text-ivory">40,000+ paper cards</strong>. That&apos;s a forest saved, one tap at a time.
            </p>
          </div>

          {/* Environmental Savings */}
          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { icon: <Leaf className="h-5 w-5" />, title: "Zero Deforestation", desc: "No trees cut for paper cards. Our recycled PVC material keeps forests standing." },
              { icon: <Droplets className="h-5 w-5" />, title: "Water Conservation", desc: "Paper production consumes thousands of litres — EcoTap cards use zero water in their digital operation." },
              { icon: <Wind className="h-5 w-5" />, title: "Carbon Negative", desc: "From production to delivery, every card sold plants one tree, making our process carbon negative." },
            ].map((item) => (
              <div key={item.title} className="bg-emerald-pale/30 border border-emerald-light/50 rounded-3xl p-7 hover:shadow-card-lg transition-all duration-200 text-center">
                <div className="w-10 h-10 rounded-xl bg-emerald-pale flex items-center justify-center text-emerald-deep mx-auto mb-4">
                  {item.icon}
                </div>
                <h3 className="font-serif text-lg font-semibold text-emerald-deep mb-2">{item.title}</h3>
                <p className="text-sm text-ink-light leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
