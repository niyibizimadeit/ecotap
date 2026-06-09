"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowRight, Mail, AlertCircle, ArrowLeft } from "lucide-react";

import { AuthLayout } from "@/components/auth/AuthLayout";
import { Button } from "@/components/ui/Button";
import { verifyOtp, resendOtp } from "@/app/actions/auth.actions";

export default function VerifyEmailForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email") ?? "";

  const [code, setCode] = useState<string[]>(Array(6).fill(""));
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Redirect to register if no email provided
  useEffect(() => {
    if (!email) {
      router.replace("/register");
    }
  }, [email, router]);

  const handleChange = useCallback((index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;

    const newCode = [...code];
    const digits = value.replace(/\D/g, "").split("");
    digits.forEach((digit, i) => {
      if (index + i < 6) {
        newCode[index + i] = digit;
      }
    });
    setCode(newCode);

    const nextIndex = Math.min(index + digits.length, 5);
    if (nextIndex < 6 && digits.length > 0) {
      inputRefs.current[nextIndex]?.focus();
    }
  }, [code]);

  const handleKeyDown = useCallback((index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === "ArrowLeft" && index > 0) {
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === "ArrowRight" && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  }, [code]);

  const handlePaste = useCallback((e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    const newCode = [...Array(6).fill("")];
    pasted.split("").forEach((digit, i) => {
      newCode[i] = digit;
    });
    setCode(newCode);
    const nextFocus = Math.min(pasted.length, 5);
    inputRefs.current[nextFocus]?.focus();
  }, []);

  const fullCode = code.join("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (fullCode.length !== 6) return;

    setIsSubmitting(true);
    setError(null);

    const result = await verifyOtp(email, fullCode, "signup");

    if (!result.success) {
      setError(result.error ?? "Verification failed. Please check your code and try again.");
      setIsSubmitting(false);
    } else {
      router.push("/pending");
    }
  }

  async function handleResend() {
    setError(null);
    const result = await resendOtp(email, "signup");
    const hint = document.getElementById("resend-hint");
    if (result.success && hint) {
      hint.textContent = "Code resent — check your inbox.";
      setTimeout(() => { if (hint) hint.textContent = ""; }, 4000);
    } else if (hint) {
      hint.textContent = result.error ?? "Could not resend. Please wait a moment and try again.";
    }
  }

  if (!email) return null;

  return (
    <AuthLayout
      quote="Security is invisible. One code, six digits — your account, verified."
      quoteAuthor="EcoTap"
    >
      <div className="w-full max-w-md mx-auto">
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 bg-emerald-pale border border-emerald-light rounded-full px-3 py-1 mb-4">
            <Mail className="h-3 w-3 text-emerald-bright" />
            <span className="text-xs font-mono tracking-widest text-emerald-mid uppercase">Check your inbox</span>
          </div>
          <h1 className="font-serif text-display-sm text-emerald-deep mb-1">Verify your email</h1>
          <p className="text-sm text-ink-light">
            We sent a <strong>6-digit code</strong> to{" "}
            <span className="text-ink font-medium">{email}</span>.
            Enter it below to confirm your email address.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* OTP Inputs */}
          <div className="flex justify-center gap-2" onPaste={handlePaste}>
            {code.map((digit, i) => (
              <input
                key={i}
                ref={(el) => { inputRefs.current[i] = el; }}
                type="text"
                inputMode="numeric"
                autoComplete="one-time-code"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(i, e.target.value)}
                onKeyDown={(e) => handleKeyDown(i, e)}
                autoFocus={i === 0}
                className="w-12 h-14 text-center font-mono text-xl font-semibold text-emerald-deep bg-emerald-pale border-2 border-emerald-light rounded-xl focus:border-emerald-bright focus:bg-white focus:outline-none transition-colors"
                aria-label={`Digit ${i + 1}`}
              />
            ))}
          </div>

          {/* Error */}
          {error && (
            <div className="flex items-start gap-2.5 bg-red-50 border border-red-200 rounded-xl p-3">
              <AlertCircle className="h-4 w-4 text-red-500 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          {/* Resend hint */}
          <p id="resend-hint" className="text-xs text-emerald-bright text-center min-h-[1em]" />

          {/* Submit */}
          <Button
            type="submit"
            variant="primary"
            size="lg"
            className="w-full"
            loading={isSubmitting}
            disabled={fullCode.length !== 6}
            rightIcon={<ArrowRight className="h-4 w-4" />}
          >
            Verify email
          </Button>
        </form>

        {/* Resend & go back */}
        <div className="text-center mt-8 space-y-3">
          <p className="text-sm text-ink-light">
            Didn&rsquo;t receive the code?{" "}
            <button
              type="button"
              onClick={handleResend}
              className="text-emerald-bright underline underline-offset-4 hover:text-emerald-mid transition-colors font-medium"
            >
              Resend code
            </button>
          </p>
          <Link
            href="/register"
            className="inline-flex items-center gap-1.5 text-xs text-ink-light hover:text-ink-mid transition-colors"
          >
            <ArrowLeft className="h-3 w-3" />
            Back to registration
          </Link>
        </div>
      </div>
    </AuthLayout>
  );
}
