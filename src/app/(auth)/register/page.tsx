"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, User } from "lucide-react";

import { AuthLayout } from "@/components/auth/AuthLayout";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { individualRegisterSchema, type IndividualRegisterData } from "@/lib/validations/auth";

export default function IndividualRegisterPage() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<IndividualRegisterData>({
    resolver: zodResolver(individualRegisterSchema),
  });

  async function onSubmit(data: IndividualRegisterData) {
    // TODO Phase 11: Wire to Supabase Auth + onboarding service
    await new Promise((r) => setTimeout(r, 800));
    router.push("/pending");
  }

  return (
    <AuthLayout
      quote="One tap. That's all it takes to share who you are and what you do."
      quoteAuthor="EcoTap for Individuals"
    >
      <div className="w-full max-w-md mx-auto">
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 bg-emerald-pale border border-emerald-light rounded-full px-3 py-1 mb-4">
            <User className="h-3 w-3 text-emerald-bright" />
            <span className="text-xs font-mono tracking-widest text-emerald-mid uppercase">For individuals</span>
          </div>
          <h1 className="font-serif text-display-sm text-emerald-deep mb-1">Create your account</h1>
          <p className="text-sm text-ink-light">Get your digital business card — one tap to share your contact with anyone.</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input
            label="Full name"
            required
            placeholder="e.g., Prince Niyibizi"
            error={errors.full_name?.message}
            {...register("full_name")}
          />

          <Input
            label="Username"
            required
            placeholder="prince"
            hint="This becomes your card URL: ecotap.rw/prince"
            leftElement={<span className="text-ink-light text-sm">@</span>}
            error={errors.username?.message}
            {...register("username")}
          />

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
            placeholder="At least 8 characters"
            error={errors.password?.message}
            {...register("password")}
          />

          <Input
            label="Company name"
            placeholder="Optional — your current employer"
            hint="Leave blank if you're a freelancer or student"
            error={errors.company_name?.message}
            {...register("company_name")}
          />

          <Button
            type="submit"
            variant="primary"
            size="lg"
            className="w-full"
            loading={isSubmitting}
            rightIcon={<ArrowRight className="h-4 w-4" />}
          >
            Create account
          </Button>
        </form>

        <p className="text-center text-sm text-ink-light mt-8">
          Already have an account?{" "}
          <Link
            href="/login"
            className="text-emerald-bright underline underline-offset-4 hover:text-emerald-mid transition-colors font-medium"
          >
            Sign in
          </Link>
        </p>

        <p className="text-center text-sm text-ink-light mt-3">
          Registering an organisation?{" "}
          <Link
            href="/org/register"
            className="text-emerald-bright underline underline-offset-4 hover:text-emerald-mid transition-colors font-medium"
          >
            Organisation registration
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
}
