"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, Building2 } from "lucide-react";

import { AuthLayout } from "@/components/auth/AuthLayout";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { loginSchema, type LoginData } from "@/lib/validations/auth";

export default function OrgLoginPage() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginData>({
    resolver: zodResolver(loginSchema),
  });

  async function onSubmit(data: LoginData) {
    // TODO Phase 11: Wire to Supabase Auth
    await new Promise((r) => setTimeout(r, 800));
    router.push("/dashboard/company");
  }

  return (
    <AuthLayout
      quote="Welcome back. Your team's digital cards are ready when you are."
      quoteAuthor="EcoTap for Teams"
    >
      <div className="w-full max-w-md mx-auto">
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 bg-emerald-pale border border-emerald-light rounded-full px-3 py-1 mb-4">
            <Building2 className="h-3 w-3 text-emerald-bright" />
            <span className="text-xs font-mono tracking-widest text-emerald-mid uppercase">For organisations</span>
          </div>
          <h1 className="font-serif text-display-sm text-emerald-deep mb-1">Sign in to your organisation</h1>
          <p className="text-sm text-ink-light">Access your company dashboard, manage employees, and track orders.</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <Input
            label="Work email"
            required
            type="email"
            placeholder="prince@azsoftsolutions.com"
            error={errors.email?.message}
            {...register("email")}
          />

          <Input
            label="Password"
            required
            type="password"
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
          Don&apos;t have an organisation account?{" "}
          <Link
            href="/org/register"
            className="text-emerald-bright underline underline-offset-4 hover:text-emerald-mid transition-colors font-medium"
          >
            Register here
          </Link>
        </p>

        <p className="text-center text-sm text-ink-light mt-3">
          Signing in as an individual?{" "}
          <Link
            href="/login"
            className="text-emerald-bright underline underline-offset-4 hover:text-emerald-mid transition-colors font-medium"
          >
            Individual sign in
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
}
