"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight, Mail, CheckCircle2 } from "lucide-react";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { requestPasswordReset } from "@/app/actions/auth.actions";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [noAccount, setNoAccount] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;
    setLoading(true);
    setError(null);
    setNoAccount(false);
    const result = await requestPasswordReset(email);
    setLoading(false);
    if (result.success) {
      setSent(true);
    } else if (result.error === "NO_ACCOUNT") {
      setNoAccount(true);
    } else {
      setError(result.error ?? "Something went wrong. Please try again.");
    }
  }

  function handleContinue() {
    router.push(`/verify-reset?email=${encodeURIComponent(email)}`);
  }

  if (sent) {
    return (
      <AuthLayout quote="A 6-digit code is on its way to your inbox." quoteAuthor="EcoTap Support">
        <div className="w-full max-w-md mx-auto">
          <div className="bg-emerald-pale/50 border border-emerald-light/50 rounded-3xl p-8 text-center space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-emerald-pale flex items-center justify-center mx-auto">
              <CheckCircle2 className="h-7 w-7 text-emerald-bright" />
            </div>
            <h1 className="font-serif text-lg font-semibold text-emerald-deep">Code sent</h1>
            <p className="text-sm text-ink-light leading-relaxed">
              We&apos;ve sent a 6-digit code to <strong>{email}</strong>. The code expires in 10 minutes.
            </p>
            <Button variant="primary" size="lg" className="w-full" onClick={handleContinue} rightIcon={<ArrowRight className="h-4 w-4" />}>
              Enter reset code
            </Button>
            <p className="text-xs text-ink-light">
              Didn&apos;t get it?{" "}
              <button onClick={() => { setSent(false); setError(null); }} className="text-emerald-bright underline hover:text-emerald-mid">
                Send a new code
              </button>
            </p>
          </div>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout quote="We'll send a 6-digit code to your email." quoteAuthor="EcoTap Support">
      <div className="w-full max-w-md mx-auto">
        <div className="mb-8">
          <h1 className="font-serif text-display-sm text-emerald-deep mb-1">Forgot password?</h1>
          <p className="text-sm text-ink-light">
            Enter your email and we&apos;ll send you a code to reset your password.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <Input
            label="Email address"
            type="email"
            required
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          {noAccount && (
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
              <p className="text-sm text-amber-800 mb-3">
                We couldn&apos;t find an account with <strong>{email}</strong>.
              </p>
              <Link
                href={`/register`}
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-emerald-bright hover:text-emerald-mid transition-colors"
              >
                Create an account <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          <Button type="submit" variant="primary" size="lg" className="w-full" loading={loading} rightIcon={<Mail className="h-4 w-4" />}>
            Send reset code
          </Button>
        </form>

        <p className="text-center text-sm text-ink-light mt-8">
          <Link href="/login" className="inline-flex items-center gap-1.5 text-emerald-bright underline underline-offset-4 hover:text-emerald-mid transition-colors font-medium">
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to sign in
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
}
