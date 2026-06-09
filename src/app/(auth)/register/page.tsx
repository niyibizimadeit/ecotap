"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, User, AlertCircle } from "lucide-react";

import { AuthLayout } from "@/components/auth/AuthLayout";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { PasswordInput } from "@/components/ui/PasswordInput";
import { individualRegisterSchema, type IndividualRegisterData } from "@/lib/validations/auth";
import { signUp } from "@/app/actions/auth.actions";

export default function IndividualRegisterPage() {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<IndividualRegisterData>({
    resolver: zodResolver(individualRegisterSchema),
  });

  async function onSubmit(data: IndividualRegisterData) {
    setServerError(null);
    const formData = new FormData();
    formData.append("email", data.email);
    formData.append("password", data.password);
    formData.append("full_name", data.full_name);
    formData.append("username", data.username);
    formData.append("role", "individual");
    if (data.phone) formData.append("phone", data.phone);
    if (data.company_name) {
      formData.append("company_name", data.company_name);
    }

    const result = await signUp(formData);
    if (!result.success) {
      setServerError(result.error ?? "Registration failed. Please try again.");
    } else {
      router.push(`/verify?email=${encodeURIComponent(data.email)}`);
    }
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
          {serverError && (
            <div className="flex items-start gap-2.5 bg-red-50 border border-red-200 rounded-xl p-3">
              <AlertCircle className="h-4 w-4 text-red-500 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-700">{serverError}</p>
            </div>
          )}

          <Input
            label="Full name"
            required
            placeholder="e.g., Ntwali Frankie"
            error={errors.full_name?.message}
            {...register("full_name")}
          />

          <Input
            label="Username"
            required
            placeholder="ntwali-frankie"
            hint="This becomes your card URL: ecotap.rw/ntwali-frankie"
            leftElement={<span className="text-ink-light text-sm">@</span>}
            error={errors.username?.message}
            {...register("username")}
          />

          <Input
            label="Email"
            required
            type="email"
            placeholder="ntwali@example.com"
            error={errors.email?.message}
            {...register("email")}
          />

          <Input
            label="Phone number"
            placeholder="+250788123456"
            hint="Optional — your WhatsApp or mobile number"
            error={errors.phone?.message}
            {...register("phone")}
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
