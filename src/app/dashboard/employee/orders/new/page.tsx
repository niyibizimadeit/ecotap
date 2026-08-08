"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { PageHeader } from "@/components/dashboard/DashboardShared";
import { DesignGallery, dbDesignToOption, type CardDesignOption } from "@/components/orders/DesignGallery";
import { placeOrder, getActiveDesigns } from "@/app/actions/orders.actions";
import { uploadPaymentScreenshot, linkPaymentToOrder } from "@/app/actions/uploads.actions";
import { OrderSummary } from "@/components/orders/OrderSummary";
import { Button } from "@/components/ui/Button";
import { Input, Textarea } from "@/components/ui/Input";
import { cn } from "@/lib/utils";
import { CARD_PRICES, USD_TO_RWF_RATE, MOMO_PAY, usdToRwf } from "@/constants";
import { ArrowLeft, ArrowRight, Package, Copy, Check, Upload, Banknote, Smartphone } from "lucide-react";
import type { ShippingAddress } from "@/types";

/* ── Types ── */
type Step = 1 | 2 | 3 | 4;
type Currency = "USD" | "RWF";

interface OrderForm {
  design_id:        string;
  quantity:         number;
  shipping_address: ShippingAddress;
  currency:         Currency;
  screenshot_url:   string | null;
  momo_phone:       string;
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
  { number: 3, label: "Payment"          },
  { number: 4, label: "Review & place"   },
];

/* ── Price helpers ── */
function getPricePerCard(currency: Currency): number {
  return currency === "USD" ? CARD_PRICES.individual : usdToRwf(CARD_PRICES.individual);
}

function formatCurrency(amount: number, currency: Currency): string {
  if (currency === "USD") return `$${amount}`;
  return `${amount.toLocaleString()} RWF`;
}

/* ── Main component ── */
export default function NewOrderPage() {
  const router = useRouter();

  const [step,    setStep]    = useState<Step>(1);
  const [loading, setLoading] = useState(false);
  const [errors,  setErrors]  = useState<Record<string, string>>({});
  const [designs, setDesigns] = useState<CardDesignOption[]>([]);
  const [screenshotUploading, setScreenshotUploading] = useState(false);
  const [copied, setCopied]   = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState<OrderForm>({
    design_id:        "",
    quantity:         1,
    shipping_address: EMPTY_ADDRESS,
    currency:         "RWF",
    screenshot_url:   null,
    momo_phone:       "",
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
  const pricePerCard   = getPricePerCard(form.currency);
  const totalPrice     = pricePerCard * form.quantity;

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

  function validateStep3(): boolean {
    if (!form.screenshot_url) {
      setErrors({ screenshot: "Please upload your payment screenshot before continuing." });
      return false;
    }
    setErrors({});
    return true;
  }

  function next() {
    if (step === 1 && !validateStep1()) return;
    if (step === 2 && !validateStep2()) return;
    if (step === 3 && !validateStep3()) return;
    setStep(s => (s + 1) as Step);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function back() {
    setStep(s => (s - 1) as Step);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  /* screenshot upload */
  async function handleScreenshotUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setScreenshotUploading(true);
    setErrors({});

    const fd = new FormData();
    fd.append("file", file);

    const result = await uploadPaymentScreenshot(fd);

    setScreenshotUploading(false);

    if (result.success && result.data) {
      setForm(f => ({ ...f, screenshot_url: result.data!.url }));
    } else {
      setErrors({ screenshot: result.error ?? "Upload failed. Please try again." });
    }
  }

  /* copy momo ussd code */
  async function copyMomoCode() {
    await navigator.clipboard.writeText(MOMO_PAY.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  /* place order */
  async function handlePlaceOrder() {
    setLoading(true);
    const result = await placeOrder({
      design_id:        form.design_id,
      quantity:         form.quantity,
      shipping_address: form.shipping_address,
      payment_currency: form.currency,
      payment_amount:   totalPrice,
      momo_phone:       form.currency === "RWF" ? (form.momo_phone || undefined) : undefined,
    });
    if (result.success && result.data) {
      // Link the payment screenshot to the newly created order
      if (form.screenshot_url) {
        const linkResult = await linkPaymentToOrder(result.data.id, form.screenshot_url);
        if (!linkResult.success) {
          setErrors({ ...errors, submit: `Order placed but payment proof failed to attach: ${linkResult.error}. Please contact support.` });
          setLoading(false);
          return;
        }
      }
      router.push(`/dashboard/employee/orders/success?order=${result.data.id}`);
    } else {
      setLoading(false);
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
                  Continue to payment
                </Button>
              </div>
            </div>
          )}

          {/* Step 3 — Payment */}
          {step === 3 && selectedDesign && (
            <div className="animate-fade-up space-y-5">
              <SectionHeading
                number={3}
                title="Complete your payment"
                subtitle="Pay via mobile money or bank transfer, then upload your receipt."
              />

              {/* Currency toggle */}
              <div
                className="rounded-2xl border p-5"
                style={{ backgroundColor: "#FEF9EF", borderColor: "rgba(6,78,59,0.08)" }}
              >
                <p className="text-sm font-semibold text-emerald-deep mb-3">Select currency</p>
                <div className="flex gap-2">
                  {(["RWF", "USD"] as Currency[]).map(c => (
                    <button
                      key={c}
                      onClick={() => setForm(f => ({ ...f, currency: c, screenshot_url: null }))}
                      className={cn(
                        "flex-1 py-3 px-4 rounded-xl text-sm font-semibold border transition-all",
                        form.currency === c
                          ? "border-emerald-deep text-ivory"
                          : "border-emerald-light/50 text-emerald-deep hover:bg-emerald-pale/50"
                      )}
                      style={form.currency === c ? { backgroundColor: "#064E3B" } : { backgroundColor: "transparent" }}
                    >
                      {c === "RWF" ? "RWF (MoMo)" : "USD (Bank)"}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price summary */}
              <div
                className="rounded-2xl border p-5"
                style={{ backgroundColor: form.currency === "RWF" ? "#ECFDF5" : "#EFF6FF", borderColor: "rgba(6,78,59,0.08)" }}
              >
                <p className="text-xs font-mono tracking-widest text-ink-light uppercase mb-3">Order total</p>
                <div className="flex items-baseline justify-between">
                  <div>
                    <p className="font-serif text-3xl font-bold text-emerald-deep">
                      {formatCurrency(totalPrice, form.currency)}
                    </p>
                    <p className="text-sm text-ink-light mt-0.5">
                      {form.quantity} card{form.quantity !== 1 ? "s" : ""} × {formatCurrency(pricePerCard, form.currency)} each
                    </p>
                  </div>
                  {form.currency === "RWF" && (
                    <p className="text-xs text-ink-light text-right">
                      ≈ ${CARD_PRICES.individual * form.quantity} USD
                    </p>
                  )}
                </div>
              </div>

              {/* Payment instructions */}
              {form.currency === "RWF" ? (
                <div
                  className="rounded-2xl border p-5 space-y-4"
                  style={{ backgroundColor: "#FEF9EF", borderColor: "rgba(6,78,59,0.08)" }}
                >
                  <div className="flex items-center gap-2">
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center"
                      style={{ backgroundColor: "#064E3B" }}
                    >
                      <Smartphone className="h-4 w-4" style={{ color: "#FEFCE8" }} />
                    </div>
                    <p className="text-sm font-semibold text-emerald-deep">MoMo Pay</p>
                  </div>

                  {/* USSD code display */}
                  <div
                    className="rounded-xl border-2 border-dashed p-4 text-center"
                    style={{ borderColor: "rgba(6,78,59,0.2)", backgroundColor: "#FEFCE8" }}
                  >
                    <p className="text-xs text-ink-light mb-1">Dial this USSD code</p>
                    <p className="font-mono text-2xl font-bold text-emerald-deep tracking-wider">
                      {MOMO_PAY.code}
                    </p>
                    <p className="text-xs text-ink-light mt-1">{MOMO_PAY.name}</p>
                    <button
                      onClick={copyMomoCode}
                      className="mt-3 inline-flex items-center gap-1.5 text-xs font-medium transition-colors"
                      style={{ color: copied ? "#059669" : "#064E3B" }}
                    >
                      {copied ? (
                        <><Check className="h-3.5 w-3.5" /> Copied</>
                      ) : (
                        <><Copy className="h-3.5 w-3.5" /> Copy code</>
                      )}
                    </button>
                  </div>

                  <p className="text-xs text-ink-light leading-relaxed">
                    {MOMO_PAY.instructions}
                  </p>
                </div>
              ) : (
                <div
                  className="rounded-2xl border p-5 space-y-3"
                  style={{ backgroundColor: "#EFF6FF", borderColor: "rgba(37,99,235,0.15)" }}
                >
                  <div className="flex items-center gap-2">
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center"
                      style={{ backgroundColor: "#1E40AF" }}
                    >
                      <Banknote className="h-4 w-4" style={{ color: "#FEFCE8" }} />
                    </div>
                    <p className="text-sm font-semibold" style={{ color: "#1E3A8A" }}>Bank Transfer / Card</p>
                  </div>
                  <p className="text-xs leading-relaxed" style={{ color: "#1E40AF" }}>
                    For USD payments, call or WhatsApp us at{" "}
                    <a href="tel:+250783757699" className="font-semibold underline hover:opacity-80">+250 783 757 699</a>
                    {" "}for bank details. Once you&apos;ve made the transfer,
                    upload your confirmation below.
                  </p>
                </div>
              )}

              {/* Screenshot upload */}
              <div
                className="rounded-2xl border p-5 space-y-3"
                style={{ backgroundColor: "#FEF9EF", borderColor: "rgba(6,78,59,0.08)" }}
              >
                <p className="text-sm font-semibold text-emerald-deep">
                  Upload payment confirmation
                </p>

                {form.screenshot_url ? (
                  <div className="space-y-3">
                    <img
                      src={form.screenshot_url}
                      alt="Payment screenshot"
                      className="w-full max-w-sm rounded-xl border"
                      style={{ borderColor: "rgba(6,78,59,0.1)" }}
                    />
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setForm(f => ({ ...f, screenshot_url: null }))}
                      >
                        Remove
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div
                    className="rounded-xl border-2 border-dashed p-8 text-center cursor-pointer transition-all hover:border-emerald-bright/40"
                    style={{ borderColor: "rgba(6,78,59,0.15)" }}
                    onClick={() => fileInputRef.current?.click()}
                  >
                    {screenshotUploading ? (
                      <div className="space-y-2">
                        <div
                          className="w-8 h-8 border-2 border-t-transparent rounded-full animate-spin mx-auto"
                          style={{ borderColor: "rgba(6,78,59,0.2)", borderTopColor: "#064E3B" }}
                        />
                        <p className="text-xs text-ink-light">Uploading…</p>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <Upload className="h-8 w-8 mx-auto text-ink-light" />
                        <p className="text-sm text-ink-mid">Click to upload screenshot</p>
                        <p className="text-xs text-ink-light">JPEG, PNG, or WebP — max 5MB</p>
                      </div>
                    )}
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      className="hidden"
                      onChange={handleScreenshotUpload}
                    />
                  </div>
                )}

                {errors.screenshot && (
                  <p className="text-sm text-red-600">{errors.screenshot}</p>
                )}
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

          {/* Step 4 — Review */}
          {step === 4 && selectedDesign && (
            <div className="animate-fade-up space-y-5">
              <SectionHeading
                number={4}
                title="Review your order"
                subtitle="Check everything looks right before placing."
              />
              <OrderSummary
                design={selectedDesign}
                quantity={form.quantity}
                address={form.shipping_address}
              />

              {/* Payment summary */}
              <div
                className="rounded-2xl border p-4 space-y-3"
                style={{ backgroundColor: "#FEF9EF", borderColor: "rgba(6,78,59,0.08)" }}
              >
                <p className="text-xs font-mono tracking-widest text-ink-light uppercase">Payment</p>
                <div className="flex items-center justify-between">
                  <p className="text-sm text-ink">Amount</p>
                  <p className="text-sm font-semibold text-emerald-deep">
                    {formatCurrency(totalPrice, form.currency)}
                  </p>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-sm text-ink">Method</p>
                  <p className="text-sm font-medium text-ink">
                    {form.currency === "RWF" ? "MoMo Pay" : "Bank Transfer"}
                  </p>
                </div>
                {form.screenshot_url && (
                  <div>
                    <p className="text-xs text-ink-light mb-1.5">Receipt</p>
                    <img
                      src={form.screenshot_url}
                      alt="Payment receipt"
                      className="w-full max-w-[200px] rounded-lg border"
                      style={{ borderColor: "rgba(6,78,59,0.1)" }}
                    />
                  </div>
                )}
              </div>

              <div
                className="rounded-2xl border p-4 text-sm"
                style={{ backgroundColor: "#FEF3C7", borderColor: "rgba(146,64,14,0.15)", color: "#92400E" }}
              >
                <p className="font-medium mb-0.5">What happens next</p>
                <p className="text-xs leading-relaxed" style={{ color: "rgba(146,64,14,0.8)" }}>
                  Your payment screenshot will be reviewed by the EcoTap team. Once verified, your order
                  will be approved for production. You&apos;ll receive updates as your cards are printed and shipped.
                </p>
              </div>

              {errors.submit && (
                <p className="text-sm text-red-600 text-center">{errors.submit}</p>
              )}

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

            {/* Price */}
            {step >= 3 && (
              <div
                className="rounded-2xl border px-4 py-3"
                style={{ backgroundColor: "#ECFDF5", borderColor: "rgba(6,78,59,0.08)" }}
              >
                <p className="text-xs text-ink-light mb-0.5">Total ({form.currency})</p>
                <p className="font-serif text-xl font-semibold text-emerald-deep">
                  {formatCurrency(totalPrice, form.currency)}
                </p>
              </div>
            )}

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

            {/* Payment status in sidebar */}
            {step >= 3 && (
              <div
                className="rounded-2xl border px-4 py-3"
                style={{ backgroundColor: form.screenshot_url ? "#ECFDF5" : "#FEF9EF", borderColor: "rgba(6,78,59,0.08)" }}
              >
                <p className="text-xs text-ink-light mb-1">Payment proof</p>
                <p className={`text-xs font-medium ${form.screenshot_url ? "text-emerald-bright" : "text-gold"}`}>
                  {form.screenshot_url ? "✓ Uploaded" : "○ Pending"}
                </p>
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
    <div className="flex items-center gap-0 mb-2 overflow-x-auto">
      {STEPS.map((s, i) => {
        const done   = current > s.number;
        const active = current === s.number;
        return (
          <div key={s.number} className="flex items-center flex-shrink-0">
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
                className="h-px w-4 sm:w-6 mx-1 sm:mx-2 transition-all duration-300"
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
