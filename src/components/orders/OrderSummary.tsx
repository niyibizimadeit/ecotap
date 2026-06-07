import type { CardDesignOption } from "./DesignGallery";
import type { ShippingAddress }  from "@/types";

interface OrderSummaryProps {
  design:   CardDesignOption;
  quantity: number;
  address:  ShippingAddress;
}

export function OrderSummary({ design, quantity, address }: OrderSummaryProps) {
  return (
    <div
      className="rounded-2xl border overflow-hidden"
      style={{ borderColor: "rgba(6,78,59,0.08)" }}
    >
      {/* Header */}
      <div
        className="px-5 py-3 border-b"
        style={{ backgroundColor: "#ECFDF5", borderColor: "rgba(6,78,59,0.08)" }}
      >
        <p className="text-xs font-mono tracking-widest text-emerald-mid uppercase">Order summary</p>
      </div>

      <div className="divide-y" style={{ borderColor: "rgba(6,78,59,0.06)" }}>
        {/* Design */}
        <div className="px-5 py-4 flex items-center gap-4">
          {/* Mini design swatch */}
          <div
            className="w-14 h-9 rounded-xl flex-shrink-0"
            style={{ backgroundColor: design.accent }}
          />
          <div>
            <p className="text-xs text-ink-light">Design</p>
            <p className="text-sm font-semibold text-ink">{design.name}</p>
          </div>
        </div>

        {/* Quantity */}
        <div className="px-5 py-4 flex items-center justify-between">
          <div>
            <p className="text-xs text-ink-light">Quantity</p>
            <p className="text-sm font-semibold text-ink">{quantity} card{quantity !== 1 ? "s" : ""}</p>
          </div>
          <div
            className="px-3 py-1.5 rounded-xl text-xs font-mono"
            style={{ backgroundColor: "#FEF3C7", color: "#92400E" }}
          >
            Pricing on approval
          </div>
        </div>

        {/* Shipping */}
        <div className="px-5 py-4">
          <p className="text-xs text-ink-light mb-1.5">Shipping to</p>
          <p className="text-sm font-medium text-ink">{address.street}</p>
          <p className="text-sm text-ink-mid">{address.city}{address.postal_code ? `, ${address.postal_code}` : ""}</p>
          <p className="text-sm text-ink-mid">{address.country}</p>
          {address.notes && (
            <p className="text-xs text-ink-light mt-1 italic">Note: {address.notes}</p>
          )}
        </div>

        {/* Timeline */}
        <div className="px-5 py-4">
          <p className="text-xs text-ink-light mb-2">What happens next</p>
          <div className="space-y-2">
            {[
              "Super Admin reviews and approves your order",
              "We design and print your NFC cards",
              "Cards shipped to your address (3–5 days)",
            ].map((step, i) => (
              <div key={i} className="flex items-start gap-2.5">
                <div
                  className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-medium flex-shrink-0 mt-0.5"
                  style={{ backgroundColor: "#064E3B", color: "#FEFCE8" }}
                >
                  {i + 1}
                </div>
                <p className="text-xs text-ink-mid leading-relaxed">{step}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}