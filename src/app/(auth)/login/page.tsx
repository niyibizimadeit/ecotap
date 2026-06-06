"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight } from "lucide-react";

import { AuthLayout } from "@/components/auth/AuthLayout";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { loginSchema, type LoginData } from "@/lib/validations/auth";

export default function IndividualLoginPage() {
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
    router.push("/dashboard/employee");
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
          <Input
            label="Email"
            required
            type="email"
            placeholder="prince@example.com"
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
