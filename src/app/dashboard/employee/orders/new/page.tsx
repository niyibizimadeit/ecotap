"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { PageHeader } from "@/components/dashboard/DashboardShared";
import { DesignGallery, MOCK_DESIGNS, dbDesignToOption, type CardDesignOption } from "@/components/orders/DesignGallery";
import { placeOrder, getActiveDesigns } from "@/app/actions/orders.actions";
import { OrderSummary } from "@/components/orders/OrderSummary";
import { Button } from "@/components/ui/Button";
import { Input, Textarea } from "@/components/ui/Input";
import { cn } from "@/lib/utils";
import { ArrowLeft, ArrowRight, Package } from "lucide-react";
import type { ShippingAddress } from "@/types";

/* ── Types ── */
type Step = 1 | 2 | 3;

interface OrderForm {
  design_id:        string;
  quantity:         number;
  shipping_address: ShippingAddress;
}

const EMPTY_ADDRESS: ShippingAddress = {
  street:      "",
  city:        "",
  country:     "Rwanda",
  postal_code: "",
  notes:       "",
};

const STEPS = [
  { number: 1, label: "Choose design"   },
  { number: 2, label: "Shipping details" },
  { number: 3, label: "Review & place"  },
];

/* ── Main component ── */
export default function NewOrderPage() {
  const router = useRouter();

  const [step,    setStep]    = useState<Step>(1);
  const [loading, setLoading] = useState(false);
  const [errors,  setErrors]  = useState<Record<string, string>>({});
  const [designs, setDesigns] = useState<CardDesignOption[]>(MOCK_DESIGNS);

  const [form, setForm] = useState<OrderForm>({
    design_id:        "",
    quantity:         1,
    shipping_address: EMPTY_ADDRESS,
  });

  // Fetch active designs from DB on mount
  useEffect(() => {
    getActiveDesigns().then((result) => {
      if (result.success && result.data) {
        setDesigns(result.data.map(dbDesignToOption));
      }
    });
  }, []);

  /* helpers */
  const selectedDesign = designs.find(d => d.id === form.design_id) as CardDesignOption | undefined;

  const setAddress = (field: keyof ShippingAddress) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm(f => ({ ...f, shipping_address: { ...f.shipping_address, [field]: e.target.value } }));

  /* validation */
  function validateStep1(): boolean {
    if (!form.design_id) {
      setErrors({ design: "Please select a card design." });
      return false;
    }
    setErrors({});
    return true;
  }

  function validateStep2(): boolean {
    const errs: Record<string, string> = {};
    if (!form.shipping_address.street.trim()) errs.street  = "Street address is required.";
    if (!form.shipping_address.city.trim())   errs.city    = "City is required.";
    if (!form.shipping_address.country.trim())errs.country = "Country is required.";
    if (form.quantity < 1 || form.quantity > 100)
      errs.quantity = "Quantity must be between 1 and 100.";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  function next() {
    if (step === 1 && !validateStep1()) return;
    if (step === 2 && !validateStep2()) return;
    setStep(s => (s + 1) as Step);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function back() {
    setStep(s => (s - 1) as Step);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function handlePlaceOrder() {
    setLoading(true);
    const result = await placeOrder({
      design_id:        form.design_id,
      quantity:         form.quantity,
      shipping_address: form.shipping_address,
    });
    setLoading(false);
    if (result.success && result.data) {
      router.push(`/dashboard/employee/orders/success?order=${result.data.id}`);
    } else {
      setErrors({ submit: result.error ?? "Failed to place order. Please try again." });
    }
  }

  return (
    <div>
      <PageHeader
        eyebrow="Order Cards"
        title="Order NFC cards"
        subtitle="Physical cards shipped to your door."
        action={
          <Button variant="ghost" size="sm" leftIcon={<ArrowLeft className="h-3.5 w-3.5" />} onClick={() => router.push("/dashboard/employee/orders")}>
            Back to orders
          </Button>
        }
      />

      {/* Step indicator */}
      <StepIndicator current={step} />

      <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* ── Main panel ── */}
        <div className="lg:col-span-2">

          {/* Step 1 — Design */}
          {step === 1 && (
            <div className="animate-fade-up">
              <SectionHeading
                number={1}
                title="Choose your card design"
                subtitle="Select the design that best represents you."
              />
              <DesignGallery
                selected={form.design_id}
                onSelect={id => {
                  setForm(f => ({ ...f, design_id: id }));
                  setErrors({});
                }}
                designs={designs}
              />
              {errors.design && (
                <p className="text-sm text-red-600 mt-3">{errors.design}</p>
              )}
              <div className="mt-6">
                <Button
                  variant="primary"
                  size="lg"
                  className="w-full sm:w-auto"
                  rightIcon={<ArrowRight className="h-4 w-4" />}
                  onClick={next}
                >
                  Continue to shipping
                </Button>
              </div>
            </div>
          )}

          {/* Step 2 — Shipping */}
          {step === 2 && (
            <div className="animate-fade-up space-y-5">
              <SectionHeading
                number={2}
                title="Shipping details"
                subtitle="Where should we send your cards?"
              />

              {/* Quantity */}
              <div
                className="rounded-2xl border p-5"
                style={{ backgroundColor: "#FEF9EF", borderColor: "rgba(6,78,59,0.08)" }}
              >
                <p className="text-sm font-semibold text-emerald-deep mb-4">How many cards?</p>
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => setForm(f => ({ ...f, quantity: Math.max(1, f.quantity - 1) }))}
                    className="w-10 h-10 rounded-xl border text-lg font-medium transition-all hover:bg-emerald-pale"
                    style={{ borderColor: "rgba(6,78,59,0.15)", color: "#064E3B" }}
                  >
                    −
                  </button>
                  <div className="text-center min-w-[60px]">
                    <p className="font-serif text-3xl font-semibold text-emerald-deep">{form.quantity}</p>
                    <p className="text-xs text-ink-light">card{form.quantity !== 1 ? "s" : ""}</p>
                  </div>
                  <button
                    onClick={() => setForm(f => ({ ...f, quantity: Math.min(100, f.quantity + 1) }))}
                    className="w-10 h-10 rounded-xl border text-lg font-medium transition-all hover:bg-emerald-pale"
                    style={{ borderColor: "rgba(6,78,59,0.15)", color: "#064E3B" }}
                  >
                    +
                  </button>
                  <div className="flex-1">
                    <input
                      type="range"
                      min={1}
                      max={100}
                      value={form.quantity}
                      onChange={e => setForm(f => ({ ...f, quantity: Number(e.target.value) }))}
                      className="w-full accent-emerald-bright"
                    />
                    <div className="flex justify-between text-xs text-ink-light mt-0.5">
                      <span>1</span>
                      <span>100</span>
                    </div>
                  </div>
                </div>
                {errors.quantity && <p className="text-sm text-red-600 mt-2">{errors.quantity}</p>}
              </div>

              {/* Address */}
              <div
                className="rounded-2xl border p-5 space-y-4"
                style={{ backgroundColor: "#FEF9EF", borderColor: "rgba(6,78,59,0.08)" }}
              >
                <p className="text-sm font-semibold text-emerald-deep">Shipping address</p>
                <Input
                  label="Street address"
                  placeholder="KG 123 St, Gasabo"
                  required
                  value={form.shipping_address.street}
                  onChange={setAddress("street")}
                  error={errors.street}
                />
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label="City"
                    placeholder="Kigali"
                    required
                    value={form.shipping_address.city}
                    onChange={setAddress("city")}
                    error={errors.city}
                  />
                  <Input
                    label="Country"
                    required
                    value={form.shipping_address.country}
                    onChange={setAddress("country")}
                    error={errors.country}
                  />
                </div>
                <Input
                  label="Postal code"
                  placeholder="Optional"
                  value={form.shipping_address.postal_code ?? ""}
                  onChange={setAddress("postal_code")}
                />
                <Textarea
                  label="Delivery notes"
                  placeholder="Landmark, gate code, best time to deliver..."
                  value={form.shipping_address.notes ?? ""}
                  onChange={setAddress("notes")}
                  className="min-h-[72px]"
                  hint="Optional"
                />
              </div>

              <div className="flex gap-3">
                <Button variant="secondary" size="lg" leftIcon={<ArrowLeft className="h-4 w-4" />} onClick={back}>
                  Back
                </Button>
                <Button variant="primary" size="lg" rightIcon={<ArrowRight className="h-4 w-4" />} onClick={next} className="flex-1">
                  Review order
                </Button>
              </div>
            </div>
          )}

          {/* Step 3 — Review */}
          {step === 3 && selectedDesign && (
            <div className="animate-fade-up space-y-5">
              <SectionHeading
                number={3}
                title="Review your order"
                subtitle="Check everything looks right before placing."
              />
              <OrderSummary
                design={selectedDesign}
                quantity={form.quantity}
                address={form.shipping_address}
              />
              <div
                className="rounded-2xl border p-4 text-sm"
                style={{ backgroundColor: "#FEF3C7", borderColor: "rgba(146,64,14,0.15)", color: "#92400E" }}
              >
                <p className="font-medium mb-0.5">Pricing note</p>
                <p className="text-xs leading-relaxed" style={{ color: "rgba(146,64,14,0.8)" }}>
                  Pricing is calculated based on your subscription plan and quantity. The Super Admin will confirm the cost when approving your order.
                </p>
              </div>
              <div className="flex gap-3">
                <Button variant="secondary" size="lg" leftIcon={<ArrowLeft className="h-4 w-4" />} onClick={back}>
                  Back
                </Button>
                <Button
                  variant="primary"
                  size="lg"
                  className="flex-1"
                  loading={loading}
                  onClick={handlePlaceOrder}
                  leftIcon={!loading ? <Package className="h-4 w-4" /> : undefined}
                >
                  {loading ? "Placing order…" : "Place order"}
                </Button>
              </div>
              <p className="text-xs text-ink-light text-center">
                Your order will be reviewed and approved by the EcoTap team before production begins.
              </p>
            </div>
          )}
        </div>

        {/* ── Right sidebar — live summary ── */}
        <div className="hidden lg:block">
          <div className="sticky top-8 space-y-4">
            <p className="text-xs font-mono tracking-widest text-ink-light uppercase">Your selection</p>

            {/* Selected design preview */}
            {selectedDesign ? (
              <div
                className="rounded-2xl border p-4"
                style={{ backgroundColor: "#FEF9EF", borderColor: "rgba(6,78,59,0.08)" }}
              >
                <div
                  className="w-full h-20 rounded-xl mb-3"
                  style={{ backgroundColor: selectedDesign.accent }}
                />
                <p className="text-sm font-semibold text-emerald-deep">{selectedDesign.name}</p>
                <p className="text-xs text-ink-light mt-0.5">{selectedDesign.description}</p>
              </div>
            ) : (
              <div
                className="rounded-2xl border p-4 text-center"
                style={{ backgroundColor: "#FEF9EF", borderColor: "rgba(6,78,59,0.08)" }}
              >
                <p className="text-xs text-ink-light">No design selected yet</p>
              </div>
            )}

            {/* Quantity */}
            <div
              className="rounded-2xl border px-4 py-3 flex items-center justify-between"
              style={{ backgroundColor: "#FEF9EF", borderColor: "rgba(6,78,59,0.08)" }}
            >
              <p className="text-xs text-ink-light">Quantity</p>
              <p className="font-serif text-xl font-semibold text-emerald-deep">{form.quantity}</p>
            </div>

            {/* Shipping */}
            {form.shipping_address.city && (
              <div
                className="rounded-2xl border px-4 py-3"
                style={{ backgroundColor: "#FEF9EF", borderColor: "rgba(6,78,59,0.08)" }}
              >
                <p className="text-xs text-ink-light mb-1">Shipping to</p>
                <p className="text-sm font-medium text-ink">{form.shipping_address.city}, {form.shipping_address.country}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Sub-components ── */

function StepIndicator({ current }: { current: Step }) {
  return (
    <div className="flex items-center gap-0 mb-2">
      {STEPS.map((s, i) => {
        const done   = current > s.number;
        const active = current === s.number;
        return (
          <div key={s.number} className="flex items-center">
            <div className="flex items-center gap-2">
              <div
                className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium transition-all duration-300"
                )}
                style={{
                  backgroundColor: done || active ? "#064E3B" : "#F0E6D3",
                  color:           done || active ? "#FEFCE8" : "#78716C",
                }}
              >
                {done
                  ? <svg width="10" height="8" viewBox="0 0 10 8" fill="none"><path d="M1 4l3 3 5-6" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  : s.number
                }
              </div>
              <span className={cn("text-xs font-medium hidden sm:block", active ? "text-emerald-deep" : "text-ink-light")}>
                {s.label}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <div
                className="h-px w-6 mx-2 transition-all duration-300"
                style={{ backgroundColor: done ? "#064E3B" : "#F0E6D3" }}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

function SectionHeading({ number, title, subtitle }: { number: number; title: string; subtitle: string }) {
  return (
    <div className="mb-5">
      <div className="flex items-center gap-3 mb-1">
        <div
          className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium flex-shrink-0"
          style={{ backgroundColor: "#064E3B", color: "#FEFCE8" }}
        >
          {number}
        </div>
        <h2 className="font-serif text-xl font-semibold text-emerald-deep">{title}</h2>
      </div>
      <p className="text-sm text-ink-light ml-9">{subtitle}</p>
    </div>
  );
}