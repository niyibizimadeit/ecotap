"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { ArrowRight, AlertCircle, UserPlus } from "lucide-react";

import { AuthLayout } from "@/components/auth/AuthLayout";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { PasswordInput } from "@/components/ui/PasswordInput";
import { loginSchema, type LoginData } from "@/lib/validations/auth";
import { signIn } from "@/app/actions/auth.actions";

export default function IndividualLoginPage() {
  const [serverError, setServerError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginData>({
    resolver: zodResolver(loginSchema),
  });

  async function onSubmit(data: LoginData) {
    setServerError(null);
    const formData = new FormData();
    formData.append("email", data.email);
    formData.append("password", data.password);

    const result = await signIn(formData);
    // Only reaches here on error — success triggers a server-side redirect
    if (result && !result.success) {
      setServerError(result.error ?? "Sign in failed. Please try again.");
    }
  }

  return (
    <AuthLayout
      quote="Pick up right where you left off. Your digital card, your contacts — all in one place."
      quoteAuthor="EcoTap"
    >
      <div className="w-full max-w-md mx-auto">
        <div className="mb-8">
          <h1 className="font-serif text-display-sm text-emerald-deep mb-1">Welcome back</h1>
          <p className="text-sm text-ink-light">Sign in to manage your card, check your contacts, and update your profile.</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {serverError && (
            <>
              <div className="flex items-start gap-2.5 bg-red-50 border border-red-200 rounded-xl p-3">
                <AlertCircle className="h-4 w-4 text-red-500 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-red-700">{serverError}</p>
              </div>
              {serverError.includes("Don't have an account") && (
                <div className="flex items-center justify-between gap-3 bg-amber-50 border border-amber-300 rounded-xl p-4">
                  <div className="flex items-center gap-2.5">
                    <UserPlus className="h-5 w-5 text-amber-600 flex-shrink-0" />
                    <p className="text-sm font-medium text-amber-800">
                      Don&apos;t have an account yet?
                    </p>
                  </div>
                  <Link
                    href="/register"
                    className="inline-flex items-center gap-1.5 text-sm font-semibold text-emerald-bright hover:text-emerald-mid transition-colors whitespace-nowrap"
                  >
                    Create one <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              )}
            </>
          )}

          <Input
            label="Email"
            required
            type="email"
            placeholder="ntwali@example.com"
            error={errors.email?.message}
            {...register("email")}
          />

          <PasswordInput
            label="Password"
            required
            placeholder="Enter your password"
            error={errors.password?.message}
            {...register("password")}
          />

          <Button
            type="submit"
            variant="primary"
            size="lg"
            className="w-full"
            loading={isSubmitting}
            rightIcon={<ArrowRight className="h-4 w-4" />}
          >
            Sign in
          </Button>
        </form>

        <p className="text-center text-sm text-ink-light mt-8">
          Don&apos;t have an account?{" "}
          <Link
            href="/register"
            className="text-emerald-bright underline underline-offset-4 hover:text-emerald-mid transition-colors font-medium"
          >
            Create one
          </Link>
        </p>

        <p className="text-center text-sm text-ink-light mt-3">
          Signing in as an organisation?{" "}
          <Link
            href="/org/login"
            className="text-emerald-bright underline underline-offset-4 hover:text-emerald-mid transition-colors font-medium"
          >
            Organisation sign in
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
}
