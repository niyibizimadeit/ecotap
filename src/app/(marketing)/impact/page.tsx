import { Trees, Wind, Trash2, Droplets, GraduationCap, Leaf } from "lucide-react";

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
              Every EcoTap card makes a measurable difference. Here's what we're achieving together.
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
            {[
              { number: "5M+", label: "Trees saved annually", icon: <Trees className="h-6 w-6" /> },
              { number: "1.2kg", label: "CO₂ saved per professional", icon: <Wind className="h-6 w-6" /> },
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
              One EcoTap card prevents 1.2kg of carbon over its lifespan and replaces up to 1,000 paper cards. That's a forest saved, one tap at a time.
            </p>
          </div>

          {/* Environmental Savings */}
          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { icon: <Leaf className="h-5 w-5" />, title: "Zero Deforestation", desc: "No trees cut for paper cards. Our recycled PVC material keeps forests standing." },
              { icon: <Droplets className="h-5 w-5" />, title: "Water Conservation", desc: "Paper production consumes thousands of liters — EcoTap cards use zero water in their digital operation." },
              { icon: <Wind className="h-5 w-5" />, title: "Carbon Neutral", desc: "From production to delivery, we offset every gram of CO₂ through verified reforestation projects." },
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
