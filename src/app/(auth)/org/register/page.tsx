"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, ArrowLeft, Building2, User, CheckCircle, AlertCircle } from "lucide-react";

import { AuthLayout } from "@/components/auth/AuthLayout";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Input";
import { PasswordInput } from "@/components/ui/PasswordInput";
import {
  orgRegisterStep1Schema,
  orgRegisterStep2Schema,
  type OrgRegisterStep1Data,
  type OrgRegisterStep2Data,
} from "@/lib/validations/auth";
import { COMPANY_SIZES, INDUSTRIES } from "@/constants";
import { signUpOrg } from "@/app/actions/auth.actions";

const STEPS = [
  { label: "Company info", icon: Building2 },
  { label: "Admin account", icon: User },
  { label: "Review & submit", icon: CheckCircle },
];

export default function OrgRegisterPage() {
  const [step, setStep] = useState(1);
  const [step1Data, setStep1Data] = useState<OrgRegisterStep1Data | null>(null);
  const [step2Data, setStep2Data] = useState<OrgRegisterStep2Data | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const router = useRouter();

  return (
    <AuthLayout
      quote="The best business cards don't get lost in a drawer. They live on every phone you tap."
      quoteAuthor="EcoTap for Teams"
    >
      <div className="w-full max-w-md mx-auto">
        {/* Step indicator */}
        <div className="flex items-center gap-3 mb-10">
          {STEPS.map((s, i) => (
            <div key={s.label} className="flex items-center gap-3 flex-1 last:flex-none">
              <div className="flex items-center gap-2">
                <div
                  className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-mono font-medium transition-all duration-200 ${
                    i + 1 <= step
                      ? "bg-emerald-deep text-ivory"
                      : "bg-cream border border-cream-dark text-ink-light"
                  }`}
                >
                  {i + 1 < step ? <CheckCircle className="h-4 w-4" /> : i + 1}
                </div>
                <span
                  className={`text-xs font-medium hidden sm:block ${
                    i + 1 <= step ? "text-emerald-deep" : "text-ink-light"
                  }`}
                >
                  {s.label}
                </span>
              </div>
              {i < STEPS.length - 1 && (
                <div
                  className={`flex-1 h-px ${
                    i + 1 < step ? "bg-emerald-light" : "bg-cream-dark"
                  }`}
                />
              )}
            </div>
          ))}
        </div>

        {/* Step content */}
        {step === 1 && (
          <Step1CompanyInfo
            defaultValues={step1Data}
            onNext={(data) => {
              setStep1Data(data);
              setStep(2);
            }}
          />
        )}
        {step === 2 && (
          <Step2AdminAccount
            onBack={() => setStep(1)}
            onNext={(data) => {
              setStep2Data(data);
              setStep(3);
            }}
          />
        )}
        {step === 3 && step1Data && step2Data && (
          <Step3Review
            data={{ ...step1Data, ...step2Data }}
            onBack={() => { setStep(2); setServerError(null); }}
            isSubmitting={isSubmitting}
            serverError={serverError}
            onSubmit={async (legalConfirmed: boolean, termsAccepted: boolean) => {
              setIsSubmitting(true);
              setServerError(null);

              const formData = new FormData();
              formData.append("company_name", step1Data.company_name);
              formData.append("industry", step1Data.industry);
              formData.append("size", step1Data.size);
              if (step1Data.website) formData.append("website", step1Data.website);
              formData.append("admin_name", step2Data.admin_name);
              formData.append("email", step2Data.email);
              formData.append("password", step2Data.password);
              formData.append("phone", step2Data.phone);
              formData.append("age", String(step2Data.age));
              formData.append("legal_rep_confirmed", legalConfirmed ? "on" : "off");
              formData.append("terms_accepted", termsAccepted ? "true" : "false");

              const result = await signUpOrg(formData);
              if (!result.success) {
                setServerError(result.error ?? "Registration failed. Please try again.");
                setIsSubmitting(false);
              } else {
                router.push(`/verify?email=${encodeURIComponent(step2Data.email)}`);
              }
            }}
          />
        )}

        {/* Footer link */}
        <p className="text-center text-sm text-ink-light mt-8">
          Already have an account?{" "}
          <Link
            href="/org/login"
            className="text-emerald-bright underline underline-offset-4 hover:text-emerald-mid transition-colors font-medium"
          >
            Sign in
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
}

/* ── Step 1: Company info ─────────────────────────────────────────────────────── */

function Step1CompanyInfo({
  defaultValues,
  onNext,
}: {
  defaultValues: OrgRegisterStep1Data | null;
  onNext: (data: OrgRegisterStep1Data) => void;
}) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<OrgRegisterStep1Data>({
    resolver: zodResolver(orgRegisterStep1Schema),
    defaultValues: defaultValues ?? {},
  });

  return (
    <form onSubmit={handleSubmit(onNext)} className="space-y-5">
      <div>
        <h1 className="font-serif text-display-sm text-emerald-deep mb-1">Register your organisation</h1>
        <p className="text-sm text-ink-light">Tell us about your company — we will review and activate your account within 24 hours.</p>
      </div>

      <Input
        label="Company name"
        required
        placeholder="e.g., RDMC Ltd"
        error={errors.company_name?.message}
        {...register("company_name")}
      />

      <Select
        label="Industry"
        required
        placeholder="Select industry"
        options={INDUSTRIES.map((i) => ({ value: i, label: i }))}
        error={errors.industry?.message}
        {...register("industry")}
      />

      <Select
        label="Company size"
        required
        placeholder="Select size"
        options={COMPANY_SIZES.map((s) => ({ value: s.value, label: s.label }))}
        error={errors.size?.message}
        {...register("size")}
      />

      <Input
        label="Website"
        hint="Optional — your company URL or domain"
        placeholder="e.g., rdmc.rw"
        error={errors.website?.message}
        {...register("website")}
      />

      <Button type="submit" variant="primary" size="lg" className="w-full" rightIcon={<ArrowRight className="h-4 w-4" />}>
        Continue to admin account
      </Button>
    </form>
  );
}

/* ── Step 2: Admin account ────────────────────────────────────────────────────── */

function Step2AdminAccount({
  onBack,
  onNext,
}: {
  onBack: () => void;
  onNext: (data: OrgRegisterStep2Data) => void;
}) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<OrgRegisterStep2Data>({
    resolver: zodResolver(orgRegisterStep2Schema),
  });

  return (
    <form onSubmit={handleSubmit(onNext)} className="space-y-5">
      <div>
        <h1 className="font-serif text-display-sm text-emerald-deep mb-1">Admin account</h1>
        <p className="text-sm text-ink-light">This person will manage the company dashboard, employees, and billing.</p>
      </div>

      <Input
        label="Full name"
        required
        placeholder="e.g., Ntwali Frankie"
        error={errors.admin_name?.message}
        {...register("admin_name")}
      />

      <Input
        label="Work email"
        required
        type="email"
        placeholder="ntwali@rdmc.rw"
        error={errors.email?.message}
        {...register("email")}
      />

      <Input
        label="Phone number"
        required
        placeholder="+250788123456"
        hint="Your contact number"
        error={errors.phone?.message}
        {...register("phone")}
      />

      <Input
        label="Age"
        required
        type="number"
        placeholder="e.g., 35"
        hint="You must be at least 18 years old"
        error={errors.age?.message}
        {...register("age", { valueAsNumber: true })}
      />

      <PasswordInput
        label="Password"
        required
        placeholder="At least 8 characters"
        error={errors.password?.message}
        {...register("password")}
      />

      <PasswordInput
        label="Confirm password"
        required
        placeholder="Re-enter your password"
        error={errors.confirm_password?.message}
        {...register("confirm_password")}
      />

      <div className="flex gap-3 pt-2">
        <Button type="button" variant="secondary" size="lg" onClick={onBack} leftIcon={<ArrowLeft className="h-4 w-4" />}>
          Back
        </Button>
        <Button type="submit" variant="primary" size="lg" className="flex-1" rightIcon={<ArrowRight className="h-4 w-4" />}>
          Review details
        </Button>
      </div>
    </form>
  );
}

/* ── Step 3: Review ───────────────────────────────────────────────────────────── */

function Step3Review({
  data,
  onBack,
  isSubmitting,
  serverError,
  onSubmit,
}: {
  data: OrgRegisterStep1Data & OrgRegisterStep2Data;
  onBack: () => void;
  isSubmitting: boolean;
  serverError: string | null;
  onSubmit: (legalConfirmed: boolean, termsAccepted: boolean) => void;
}) {
  const [legalConfirmed, setLegalConfirmed] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);

  return (
    <div className="space-y-5">
      <div>
        <h1 className="font-serif text-display-sm text-emerald-deep mb-1">Review your details</h1>
        <p className="text-sm text-ink-light">Everything look correct? You can go back to edit any section.</p>
      </div>

      {/* Company info card */}
      <div className="bg-cream border border-cream-dark rounded-2xl p-5 space-y-3">
        <div className="flex items-center gap-2 mb-3">
          <Building2 className="h-4 w-4 text-emerald-bright" />
          <span className="text-xs font-mono tracking-widest uppercase text-emerald-bright">Company</span>
        </div>
        <ReviewRow label="Name" value={data.company_name} />
        <ReviewRow label="Industry" value={data.industry} />
        <ReviewRow label="Size" value={COMPANY_SIZES.find((s) => s.value === data.size)?.label ?? data.size} />
        <ReviewRow label="Website" value={data.website || "—"} />
      </div>

      {/* Admin info card */}
      <div className="bg-cream border border-cream-dark rounded-2xl p-5 space-y-3">
        <div className="flex items-center gap-2 mb-3">
          <User className="h-4 w-4 text-emerald-bright" />
          <span className="text-xs font-mono tracking-widest uppercase text-emerald-bright">Admin</span>
        </div>
        <ReviewRow label="Name" value={data.admin_name} />
        <ReviewRow label="Email" value={data.email} />
        <ReviewRow label="Phone" value={data.phone || "—"} />
        <ReviewRow label="Password" value={"•".repeat(12)} />
      </div>

      {/* Legal rep confirmation */}
      <div className="bg-cream border border-cream-dark rounded-2xl p-4">
        <label className="flex items-start gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={legalConfirmed}
            onChange={(e) => setLegalConfirmed(e.target.checked)}
            className="mt-0.5 h-4 w-4 rounded border-cream-dark text-emerald-bright focus:ring-emerald-mid cursor-pointer"
          />
          <span className="text-sm text-ink-light leading-relaxed">
            I confirm that I am the legal representative of{" "}
            <strong className="text-ink">{data.company_name}</strong> and have the authority to register this organisation on EcoTap.
          </span>
        </label>
      </div>

      {/* Terms & Privacy acceptance */}
      <div className="bg-cream border border-cream-dark rounded-2xl p-4">
        <label className="flex items-start gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={termsAccepted}
            onChange={(e) => setTermsAccepted(e.target.checked)}
            className="mt-0.5 h-4 w-4 rounded border-cream-dark text-emerald-bright focus:ring-emerald-mid cursor-pointer"
          />
          <span className="text-sm text-ink-light leading-relaxed">
            I agree to all{" "}
            <Link href="/terms" className="text-emerald-bright underline hover:text-emerald-mid" target="_blank">
              Terms and Conditions
            </Link>{" "}
            and{" "}
            <Link href="/privacy" className="text-emerald-bright underline hover:text-emerald-mid" target="_blank">
              Privacy Policy
            </Link>
          </span>
        </label>
      </div>

      <div className="bg-gold-pale border border-gold/20 rounded-2xl p-4">
        <p className="text-xs text-gold leading-relaxed">
          Your account will be reviewed within 24 hours. Once approved, you can access the company dashboard, add employees, and order cards.
        </p>
      </div>

      {serverError && (
        <div className="flex items-start gap-2.5 bg-red-50 border border-red-200 rounded-xl p-3">
          <AlertCircle className="h-4 w-4 text-red-500 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-red-700">{serverError}</p>
        </div>
      )}

      <div className="flex gap-3 pt-2">
        <Button type="button" variant="secondary" size="lg" onClick={onBack} leftIcon={<ArrowLeft className="h-4 w-4" />}>
          Edit
        </Button>
        <Button
          type="button"
          variant="primary"
          size="lg"
          className="flex-1"
          loading={isSubmitting}
          disabled={!legalConfirmed || !termsAccepted}
          onClick={() => onSubmit(legalConfirmed, termsAccepted)}
          rightIcon={<CheckCircle className="h-4 w-4" />}
        >
          Submit registration
        </Button>
      </div>
    </div>
  );
}

/* ── Review row ───────────────────────────────────────────────────────────────── */

function ReviewRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between items-center py-1">
      <span className="text-xs text-ink-light">{label}</span>
      <span className="text-sm font-medium text-ink text-right">{value}</span>
    </div>
  );
}
