"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, Lock, CheckCircle2 } from "lucide-react";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { Button } from "@/components/ui/Button";
import { PasswordInput } from "@/components/ui/PasswordInput";
import { resetPassword } from "@/app/actions/auth.actions";

export default function ResetPasswordPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    const result = await resetPassword(password);
    setLoading(false);

    if (result.success) {
      setDone(true);
    } else {
      setError(result.error ?? "Failed to reset password. The link may have expired. Please request a new one.");
    }
  }

  if (done) {
    return (
      <AuthLayout
        quote="You're all set. Your new password is ready."
        quoteAuthor="EcoTap Security"
      >
        <div className="w-full max-w-md mx-auto">
          <div className="bg-emerald-pale/50 border border-emerald-light/50 rounded-3xl p-8 text-center space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-emerald-pale flex items-center justify-center mx-auto">
              <CheckCircle2 className="h-7 w-7 text-emerald-bright" />
            </div>
            <h1 className="font-serif text-xl font-semibold text-emerald-deep">Password updated</h1>
            <p className="text-sm text-ink-light leading-relaxed">
              Your password has been successfully reset. You can now sign in with your new password.
            </p>
            <Link href="/login">
              <Button variant="primary" size="lg" className="w-full mt-2" rightIcon={<ArrowRight className="h-4 w-4" />}>
                Sign in
              </Button>
            </Link>
          </div>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout
      quote="Choose a strong password you haven't used before."
      quoteAuthor="EcoTap Security"
    >
      <div className="w-full max-w-md mx-auto">
        <div className="mb-8">
          <h1 className="font-serif text-display-sm text-emerald-deep mb-1">Reset your password</h1>
          <p className="text-sm text-ink-light">
            Enter a new password for your account.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <PasswordInput
            label="New password"
            required
            placeholder="At least 8 characters"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <PasswordInput
            label="Confirm new password"
            required
            placeholder="Re-enter your new password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
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
            rightIcon={<Lock className="h-4 w-4" />}
          >
            Reset password
          </Button>
        </form>

        <p className="text-center text-sm text-ink-light mt-8">
          <Link
            href="/forgot-password"
            className="text-emerald-bright underline underline-offset-4 hover:text-emerald-mid transition-colors font-medium"
          >
            Request a new reset link
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
}
