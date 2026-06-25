"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowRight, ArrowLeft } from "lucide-react";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { Button } from "@/components/ui/Button";
import { verifyRecoveryOtp } from "@/app/actions/auth.actions";

export default function VerifyResetPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email") ?? "";

  const [code, setCode] = useState<string[]>(Array(6).fill(""));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (!email) router.replace("/forgot-password");
  }, [email, router]);

  const handleChange = useCallback((index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    const newCode = [...code];
    const digits = value.replace(/\D/g, "").split("");
    digits.forEach((digit, i) => {
      if (index + i < 6) newCode[index + i] = digit;
    });
    setCode(newCode);
    const nextIndex = Math.min(index + digits.length, 5);
    if (nextIndex < 6 && digits.length > 0) inputRefs.current[nextIndex]?.focus();
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
    pasted.split("").forEach((digit, i) => { newCode[i] = digit; });
    setCode(newCode);
    inputRefs.current[Math.min(pasted.length, 5)]?.focus();
  }, []);

  const fullCode = code.join("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (fullCode.length !== 6) return;
    setLoading(true);
    setError(null);
    const result = await verifyRecoveryOtp(email, fullCode);
    setLoading(false);
    if (result.success) {
      router.push("/new-password");
    } else {
      setError(result.error ?? "Invalid or expired code. Please request a new one.");
    }
  }

  return (
    <AuthLayout quote="Enter the code we sent to your email." quoteAuthor="EcoTap Security">
      <div className="w-full max-w-md mx-auto">
        <div className="mb-8">
          <h1 className="font-serif text-display-sm text-emerald-deep mb-1">Check your email</h1>
          <p className="text-sm text-ink-light">
            We sent a <strong>6-digit code</strong> to{" "}
            <span className="text-ink font-medium">{email}</span>.
            Enter it below to continue.
          </p>
          <p className="text-xs text-ink-light mt-2">
            The code expires in <strong className="text-ink">10 minutes</strong>.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex justify-center gap-2" onPaste={handlePaste}>
            {code.map((digit, i) => (
              <input
                key={i}
                ref={(el) => { inputRefs.current[i] = el; }}
                type="text" inputMode="numeric" autoComplete="one-time-code"
                maxLength={1} value={digit}
                onChange={(e) => handleChange(i, e.target.value)}
                onKeyDown={(e) => handleKeyDown(i, e)}
                autoFocus={i === 0}
                className="w-12 h-14 text-center font-mono text-xl font-semibold text-emerald-deep bg-emerald-pale border-2 border-emerald-light rounded-xl focus:border-emerald-bright focus:bg-white focus:outline-none transition-colors"
                aria-label={`Digit ${i + 1}`}
              />
            ))}
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          <Button type="submit" variant="primary" size="lg" className="w-full" loading={loading} disabled={fullCode.length !== 6} rightIcon={<ArrowRight className="h-4 w-4" />}>
            Verify code
          </Button>
        </form>

        <div className="text-center mt-6 space-y-3">
          <p className="text-sm text-ink-light">
            Wrong email?{" "}
            <Link href="/forgot-password" className="text-emerald-bright underline underline-offset-4 hover:text-emerald-mid transition-colors font-medium">
              Go back
            </Link>
          </p>
          <Link href="/login" className="inline-flex items-center gap-1.5 text-xs text-ink-light hover:text-ink-mid transition-colors">
            <ArrowLeft className="h-3 w-3" />
            Back to sign in
          </Link>
        </div>
      </div>
    </AuthLayout>
  );
}
