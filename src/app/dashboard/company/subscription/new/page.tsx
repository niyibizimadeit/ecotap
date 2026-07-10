"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { PageHeader } from "@/components/dashboard/DashboardShared";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import { MOMO_PAY } from "@/constants";
import { subscribeAction } from "@/app/actions/subscription.actions";
import { getActivePlansAction } from "@/app/actions/subscription.actions";
import { uploadPaymentScreenshot } from "@/app/actions/uploads.actions";
import type { BillingPlan } from "@/types";
import { ArrowLeft, ArrowRight, Copy, Check, Upload, Smartphone, Banknote, CreditCard } from "lucide-react";

/* ── Types ── */
type Step = 1 | 2 | 3;
type Currency = "RWF" | "USD";

interface SubscriptionForm {
  plan_id: string;
  currency: Currency;
  screenshot_url: string | null;
}

const STEPS = [
  { number: 1, label: "Choose plan" },
  { number: 2, label: "Payment" },
  { number: 3, label: "Review & submit" },
];

export default function NewSubscriptionPage() {
  const router = useRouter();

  const [step, setStep] = useState<Step>(1);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [plans, setPlans] = useState<BillingPlan[]>([]);
  const [plansLoading, setPlansLoading] = useState(true);
  const [screenshotUploading, setScreenshotUploading] = useState(false);
  const [copied, setCopied] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState<SubscriptionForm>({
    plan_id: "",
    currency: "RWF",
    screenshot_url: null,
  });

  useEffect(() => {
    getActivePlansAction().then((result) => {
      if (result.success && result.data) {
        setPlans(result.data);
      }
      setPlansLoading(false);
    });
  }, []);

  const selectedPlan = plans.find((p) => p.id === form.plan_id);

  function validateStep1(): boolean {
    if (!form.plan_id) { setErrors({ plan: "Please select a plan." }); return false; }
    setErrors({}); return true;
  }

  function validateStep2(): boolean {
    if (!form.screenshot_url) { setErrors({ screenshot: "Please upload your payment screenshot." }); return false; }
    setErrors({}); return true;
  }

  function next() {
    if (step === 1 && !validateStep1()) return;
    if (step === 2 && !validateStep2()) return;
    setStep((s) => (s + 1) as Step);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function back() {
    setStep((s) => (s - 1) as Step);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

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
      setForm((f) => ({ ...f, screenshot_url: result.data!.url }));
    } else {
      setErrors({ screenshot: result.error ?? "Upload failed." });
    }
  }

  async function copyMomoCode() {
    await navigator.clipboard.writeText(MOMO_PAY.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  async function handleSubmit() {
    if (!selectedPlan) return;
    setLoading(true);
    setErrors({});

    const formData = new FormData();
    formData.append("plan_id", form.plan_id);
    formData.append("payment_currency", form.currency);
    formData.append("payment_amount", String(selectedPlan.price_per_employee));
    if (form.screenshot_url) {
      formData.append("payment_screenshot_url", form.screenshot_url);
    }

    const result = await subscribeAction(formData);
    if (result.success) {
      router.push("/dashboard/company/subscription?subscribed=true");
    } else {
      setErrors({ submit: result.error ?? "Failed to submit subscription." });
      setLoading(false);
    }
  }

  function getPricePerCycle(plan: BillingPlan): string {
    return `${plan.price_per_employee.toLocaleString()} RWF / employee / ${plan.billing_cycle === "monthly" ? "month" : "year"}`;
  }

  return (
    <div>
      <PageHeader
        eyebrow="Subscription"
        title="Subscribe to a plan"
        subtitle="Choose your billing plan and complete payment to activate your company subscription."
        action={
          <Button variant="ghost" size="sm" leftIcon={<ArrowLeft className="h-3.5 w-3.5" />} onClick={() => router.push("/dashboard/company/subscription")}>
            Back
          </Button>
        }
      />

      <StepIndicator current={step} />

      <div className="mt-8 max-w-2xl">
        {/* Step 1 — Choose plan */}
        {step === 1 && (
          <div className="animate-fade-up space-y-5">
            <SectionHeading number={1} title="Select your billing plan" subtitle="Choose a plan that fits your company size and billing preference." />

            {plansLoading ? (
              <div className="space-y-3">
                {[1, 2].map((i) => (
                  <div key={i} className="h-28 rounded-2xl skeleton animate-pulse" />
                ))}
              </div>
            ) : plans.length === 0 ? (
              <div className="text-center py-12 text-sm text-ink-light">
                No plans are currently available. Please contact support.
              </div>
            ) : (
              <div className="space-y-3">
                {plans.map((plan) => {
                  const selected = form.plan_id === plan.id;
                  return (
                    <button
                      key={plan.id}
                      onClick={() => { setForm((f) => ({ ...f, plan_id: plan.id })); setErrors({}); }}
                      className={cn(
                        "w-full text-left rounded-2xl border-2 p-5 transition-all",
                        selected
                          ? "border-emerald-deep bg-emerald-pale/30"
                          : "border-transparent bg-cream hover:border-emerald-light/40"
                      )}
                      style={selected ? {} : { backgroundColor: "#FEF9EF" }}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="flex items-center gap-3">
                            <div className={cn(
                              "w-5 h-5 rounded-full border-2 flex items-center justify-center",
                              selected ? "border-emerald-deep" : "border-cream-dark"
                            )}>
                              {selected && <div className="w-2.5 h-2.5 rounded-full bg-emerald-deep" />}
                            </div>
                            <p className="font-serif text-lg font-semibold text-emerald-deep">{plan.name}</p>
                          </div>
                          <p className="text-xs text-ink-light ml-8 mt-0.5 capitalize">{plan.billing_cycle} billing</p>
                        </div>
                        <div className="text-right">
                          <p className="font-serif text-xl font-semibold text-emerald-deep">
                            {plan.price_per_employee.toLocaleString()} RWF
                          </p>
                          <p className="text-xs text-ink-light">per employee</p>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}

            {errors.plan && <p className="text-sm text-red-600">{errors.plan}</p>}

            <Button variant="primary" size="lg" className="w-full sm:w-auto" rightIcon={<ArrowRight className="h-4 w-4" />} onClick={next}>
              Continue to payment
            </Button>
          </div>
        )}

        {/* Step 2 — Payment */}
        {step === 2 && selectedPlan && (
          <div className="animate-fade-up space-y-5">
            <SectionHeading number={2} title="Complete your payment" subtitle="Pay via mobile money or bank transfer, then upload your receipt." />

            {/* Currency toggle */}
            <div className="rounded-2xl border p-5" style={{ backgroundColor: "#FEF9EF", borderColor: "rgba(6,78,59,0.08)" }}>
              <p className="text-sm font-semibold text-emerald-deep mb-3">Select currency</p>
              <div className="flex gap-2">
                {(["RWF", "USD"] as Currency[]).map((c) => (
                  <button key={c} onClick={() => setForm((f) => ({ ...f, currency: c, screenshot_url: null }))}
                    className={cn("flex-1 py-3 px-4 rounded-xl text-sm font-semibold border transition-all",
                      form.currency === c ? "border-emerald-deep text-ivory" : "border-emerald-light/50 text-emerald-deep hover:bg-emerald-pale/50")}
                    style={form.currency === c ? { backgroundColor: "#064E3B" } : { backgroundColor: "transparent" }}>
                    {c === "RWF" ? "RWF (MoMo)" : "USD (Bank)"}
                  </button>
                ))}
              </div>
            </div>

            {/* Price summary */}
            <div className="rounded-2xl border p-5" style={{ backgroundColor: form.currency === "RWF" ? "#ECFDF5" : "#EFF6FF", borderColor: "rgba(6,78,59,0.08)" }}>
              <p className="text-xs font-mono tracking-widest text-ink-light uppercase mb-3">Subscription cost</p>
              <div>
                <p className="font-serif text-3xl font-bold text-emerald-deep">
                  {selectedPlan.price_per_employee.toLocaleString()} RWF
                </p>
                <p className="text-sm text-ink-light mt-0.5">per employee · {selectedPlan.billing_cycle}</p>
              </div>
              <p className="text-xs text-ink-light mt-3">
                Billing will start once the super admin verifies your payment and approves your subscription.
              </p>
            </div>

            {/* Payment instructions */}
            {form.currency === "RWF" ? (
              <div className="rounded-2xl border p-5 space-y-4" style={{ backgroundColor: "#FEF9EF", borderColor: "rgba(6,78,59,0.08)" }}>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: "#064E3B" }}>
                    <Smartphone className="h-4 w-4" style={{ color: "#FEFCE8" }} />
                  </div>
                  <p className="text-sm font-semibold text-emerald-deep">MoMo Pay</p>
                </div>
                <div className="rounded-xl border-2 border-dashed p-4 text-center" style={{ borderColor: "rgba(6,78,59,0.2)", backgroundColor: "#FEFCE8" }}>
                  <p className="text-xs text-ink-light mb-1">Dial this USSD code</p>
                  <p className="font-mono text-2xl font-bold text-emerald-deep tracking-wider">{MOMO_PAY.code}</p>
                  <p className="text-xs text-ink-light mt-1">{MOMO_PAY.name}</p>
                  <button onClick={copyMomoCode} className="mt-3 inline-flex items-center gap-1.5 text-xs font-medium transition-colors"
                    style={{ color: copied ? "#059669" : "#064E3B" }}>
                    {copied ? <><Check className="h-3.5 w-3.5" /> Copied</> : <><Copy className="h-3.5 w-3.5" /> Copy code</>}
                  </button>
                </div>
                <p className="text-xs text-ink-light leading-relaxed">{MOMO_PAY.instructions}</p>
              </div>
            ) : (
              <div className="rounded-2xl border p-5 space-y-3" style={{ backgroundColor: "#EFF6FF", borderColor: "rgba(37,99,235,0.15)" }}>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: "#1E40AF" }}>
                    <Banknote className="h-4 w-4" style={{ color: "#FEFCE8" }} />
                  </div>
                  <p className="text-sm font-semibold" style={{ color: "#1E3A8A" }}>Bank Transfer / Card</p>
                </div>
                <p className="text-xs leading-relaxed" style={{ color: "#1E40AF" }}>
                  For USD payments, call or WhatsApp us at{" "}
                  <a href="tel:+250783757699" className="font-semibold underline hover:opacity-80">+250 783 757 699</a>
                  {" "}for bank details. Upload your confirmation below.
                </p>
              </div>
            )}

            {/* Screenshot upload */}
            <div className="rounded-2xl border p-5 space-y-3" style={{ backgroundColor: "#FEF9EF", borderColor: "rgba(6,78,59,0.08)" }}>
              <p className="text-sm font-semibold text-emerald-deep">Upload payment confirmation</p>
              {form.screenshot_url ? (
                <div className="space-y-3">
                  <img src={form.screenshot_url} alt="Payment screenshot" className="w-full max-w-sm rounded-xl border" style={{ borderColor: "rgba(6,78,59,0.1)" }} />
                  <Button variant="ghost" size="sm" onClick={() => setForm((f) => ({ ...f, screenshot_url: null }))}>Remove</Button>
                </div>
              ) : (
                <div className="rounded-xl border-2 border-dashed p-8 text-center cursor-pointer transition-all hover:border-emerald-bright/40"
                  style={{ borderColor: "rgba(6,78,59,0.15)" }} onClick={() => fileInputRef.current?.click()}>
                  {screenshotUploading ? (
                    <div className="space-y-2">
                      <div className="w-8 h-8 border-2 border-t-transparent rounded-full animate-spin mx-auto" style={{ borderColor: "rgba(6,78,59,0.2)", borderTopColor: "#064E3B" }} />
                      <p className="text-xs text-ink-light">Uploading…</p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <Upload className="h-8 w-8 mx-auto text-ink-light" />
                      <p className="text-sm text-ink-mid">Click to upload screenshot</p>
                      <p className="text-xs text-ink-light">JPEG, PNG, or WebP — max 5MB</p>
                    </div>
                  )}
                  <input ref={fileInputRef} type="file" accept="image/jpeg,image/png,image/webp" className="hidden" onChange={handleScreenshotUpload} />
                </div>
              )}
              {errors.screenshot && <p className="text-sm text-red-600">{errors.screenshot}</p>}
            </div>

            <div className="flex gap-3">
              <Button variant="secondary" size="lg" leftIcon={<ArrowLeft className="h-4 w-4" />} onClick={back}>Back</Button>
              <Button variant="primary" size="lg" rightIcon={<ArrowRight className="h-4 w-4" />} onClick={next} className="flex-1">Review &amp; submit</Button>
            </div>
          </div>
        )}

        {/* Step 3 — Review */}
        {step === 3 && selectedPlan && (
          <div className="animate-fade-up space-y-5">
            <SectionHeading number={3} title="Review your subscription" subtitle="Check everything looks right before submitting." />

            <div className="rounded-2xl border p-5 space-y-4" style={{ backgroundColor: "#FEF9EF", borderColor: "rgba(6,78,59,0.08)" }}>
              <div className="flex items-center justify-between">
                <p className="text-sm text-ink">Plan</p>
                <p className="text-sm font-semibold text-emerald-deep">{selectedPlan.name}</p>
              </div>
              <div className="flex items-center justify-between">
                <p className="text-sm text-ink">Billing</p>
                <p className="text-sm font-medium text-ink capitalize">{selectedPlan.billing_cycle}</p>
              </div>
              <div className="flex items-center justify-between">
                <p className="text-sm text-ink">Price</p>
                <p className="text-sm font-semibold text-emerald-deep">{getPricePerCycle(selectedPlan)}</p>
              </div>
              <div className="flex items-center justify-between">
                <p className="text-sm text-ink">Payment method</p>
                <p className="text-sm font-medium text-ink">{form.currency === "RWF" ? "MoMo Pay" : "Bank Transfer"}</p>
              </div>
              {form.screenshot_url && (
                <div>
                  <p className="text-xs text-ink-light mb-1.5">Payment receipt</p>
                  <img src={form.screenshot_url} alt="Payment receipt" className="w-full max-w-[200px] rounded-lg border" style={{ borderColor: "rgba(6,78,59,0.1)" }} />
                </div>
              )}
            </div>

            <div className="rounded-2xl border p-4 text-sm" style={{ backgroundColor: "#FEF3C7", borderColor: "rgba(146,64,14,0.15)", color: "#92400E" }}>
              <p className="font-medium mb-0.5">What happens next</p>
              <p className="text-xs leading-relaxed" style={{ color: "rgba(146,64,14,0.8)" }}>
                Your payment screenshot will be reviewed by the EcoTap team. Once verified, your subscription will be activated and you can start inviting employees.
              </p>
            </div>

            {errors.submit && <p className="text-sm text-red-600 text-center">{errors.submit}</p>}

            <div className="flex gap-3">
              <Button variant="secondary" size="lg" leftIcon={<ArrowLeft className="h-4 w-4" />} onClick={back}>Back</Button>
              <Button variant="primary" size="lg" className="flex-1" loading={loading} onClick={handleSubmit}
                leftIcon={!loading ? <CreditCard className="h-4 w-4" /> : undefined}>
                {loading ? "Submitting…" : "Submit for approval"}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ── Sub-components ── */

function StepIndicator({ current }: { current: Step }) {
  return (
    <div className="flex items-center gap-0 mb-2 overflow-x-auto">
      {STEPS.map((s, i) => {
        const done = current > s.number;
        const active = current === s.number;
        return (
          <div key={s.number} className="flex items-center flex-shrink-0">
            <div className="flex items-center gap-2">
              <div className={cn("w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium transition-all duration-300")}
                style={{ backgroundColor: done || active ? "#064E3B" : "#F0E6D3", color: done || active ? "#FEFCE8" : "#78716C" }}>
                {done ? <svg width="10" height="8" viewBox="0 0 10 8" fill="none"><path d="M1 4l3 3 5-6" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg> : s.number}
              </div>
              <span className={cn("text-xs font-medium hidden sm:block", active ? "text-emerald-deep" : "text-ink-light")}>{s.label}</span>
            </div>
            {i < STEPS.length - 1 && (
              <div className="h-px w-4 sm:w-6 mx-1 sm:mx-2 transition-all duration-300" style={{ backgroundColor: done ? "#064E3B" : "#F0E6D3" }} />
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
        <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium flex-shrink-0" style={{ backgroundColor: "#064E3B", color: "#FEFCE8" }}>{number}</div>
        <h2 className="font-serif text-xl font-semibold text-emerald-deep">{title}</h2>
      </div>
      <p className="text-sm text-ink-light ml-9">{subtitle}</p>
    </div>
  );
}
