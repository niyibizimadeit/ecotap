"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Mail, CheckCircle2 } from "lucide-react";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { requestPasswordReset } from "@/app/actions/auth.actions";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;
    setLoading(true);
    setError(null);
    const result = await requestPasswordReset(email);
    setLoading(false);
    if (result.success) {
      setSent(true);
    } else {
      setError(result.error ?? "Something went wrong. Please try again.");
    }
  }

  return (
    <AuthLayout
      quote="We'll get you back in. Just let us know where to send the reset link."
      quoteAuthor="EcoTap Support"
    >
      <div className="w-full max-w-md mx-auto">
        <div className="mb-8">
          <h1 className="font-serif text-display-sm text-emerald-deep mb-1">Forgot password?</h1>
          <p className="text-sm text-ink-light">
            Enter your email and we&apos;ll send you a link to reset your password.
          </p>
        </div>

        {sent ? (
          <div className="bg-emerald-pale/50 border border-emerald-light/50 rounded-3xl p-8 text-center space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-emerald-pale flex items-center justify-center mx-auto">
              <CheckCircle2 className="h-7 w-7 text-emerald-bright" />
            </div>
            <h2 className="font-serif text-lg font-semibold text-emerald-deep">Check your email</h2>
            <p className="text-sm text-ink-light leading-relaxed">
              We&apos;ve sent a password reset link to <strong>{email}</strong>. Click the link in the email to set a new password.
            </p>
            <p className="text-xs text-ink-light">
              Didn&apos;t get it? Check your spam folder or{" "}
              <button onClick={() => { setSent(false); setError(null); }} className="text-emerald-bright underline hover:text-emerald-mid">
                try again
              </button>
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <Input
              label="Email address"
              type="email"
              required
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}

            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full"
              loading={loading}
              rightIcon={<Mail className="h-4 w-4" />}
            >
              Send reset link
            </Button>
          </form>
        )}

        <p className="text-center text-sm text-ink-light mt-8">
          <Link
            href="/login"
            className="inline-flex items-center gap-1.5 text-emerald-bright underline underline-offset-4 hover:text-emerald-mid transition-colors font-medium"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to sign in
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
}
