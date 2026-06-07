import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { ArrowRight, Package, Clock, CheckCircle2 } from "lucide-react";

export default function OrderSuccessPage() {
  // In Phase 12 this receives a real order ID from the action result
  const ORDER_ID = "ORD-2026-003";

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">

        {/* Icon */}
        <div className="flex justify-center mb-8">
          <div className="relative">
            <div
              className="w-20 h-20 rounded-3xl flex items-center justify-center shadow-card-lg"
              style={{ backgroundColor: "#064E3B" }}
            >
              <Package className="h-9 w-9" style={{ color: "#FEFCE8" }} />
            </div>
            <div
              className="absolute -top-1 -right-1 w-7 h-7 rounded-full border-2 flex items-center justify-center"
              style={{ backgroundColor: "#059669", borderColor: "#FEFCE8" }}
            >
              <CheckCircle2 className="h-4 w-4" style={{ color: "#FEFCE8" }} />
            </div>
          </div>
        </div>

        <p className="text-xs font-mono tracking-widest text-emerald-bright uppercase mb-3">
          Order placed
        </p>
        <h1 className="font-serif text-display-md text-emerald-deep mb-3">
          You're all set!
        </h1>
        <p className="text-ink-light leading-relaxed mb-2">
          Your card order has been submitted for review.
        </p>
        <p
          className="inline-flex items-center gap-2 text-sm font-mono px-4 py-2 rounded-xl mb-8"
          style={{ backgroundColor: "#ECFDF5", color: "#065F46" }}
        >
          <span>Order ref:</span>
          <span className="font-semibold">{ORDER_ID}</span>
        </p>

        {/* Timeline */}
        <div
          className="rounded-2xl border p-5 text-left mb-8"
          style={{ backgroundColor: "#FEF9EF", borderColor: "rgba(6,78,59,0.08)" }}
        >
          <p className="text-xs font-mono tracking-widest text-ink-light uppercase mb-4">What happens next</p>
          <div className="space-y-4">
            {[
              {
                icon: <CheckCircle2 className="h-4 w-4" style={{ color: "#059669" }} />,
                title: "Order submitted",
                desc:  "Your order is in the queue for review.",
                done:  true,
              },
              {
                icon: <Clock className="h-4 w-4" style={{ color: "#D97706" }} />,
                title: "Admin approval",
                desc:  "Our team will review and approve within 24 hours.",
                done:  false,
              },
              {
                icon: <Package className="h-4 w-4" style={{ color: "#78716C" }} />,
                title: "Production & shipping",
                desc:  "Cards printed and shipped to your address in 3–5 days.",
                done:  false,
              },
            ].map((step, i) => (
              <div key={i} className="flex items-start gap-3">
                <div
                  className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: step.done ? "#ECFDF5" : "#F0E6D3" }}
                >
                  {step.icon}
                </div>
                <div>
                  <p className={`text-sm font-medium ${step.done ? "text-emerald-mid" : "text-ink"}`}>
                    {step.title}
                  </p>
                  <p className="text-xs text-ink-light mt-0.5">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Link href="/dashboard/employee/orders" className="flex-1">
            <Button variant="secondary" size="lg" className="w-full">
              View order history
            </Button>
          </Link>
          <Link href="/dashboard/employee" className="flex-1">
            <Button variant="primary" size="lg" className="w-full" rightIcon={<ArrowRight className="h-4 w-4" />}>
              Back to dashboard
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}