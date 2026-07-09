"use client";

import { useState, useEffect, Suspense } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowRight, User, AlertCircle, Building2, CheckCircle } from "lucide-react";

import { AuthLayout } from "@/components/auth/AuthLayout";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { PasswordInput } from "@/components/ui/PasswordInput";
import { Spinner } from "@/components/ui/Spinner";
import { individualRegisterSchema, type IndividualRegisterData } from "@/lib/validations/auth";
import { signUp } from "@/app/actions/auth.actions";
import { validateInviteTokenAction, acceptInvitationAction } from "@/app/actions/invitations.actions";

export default function IndividualRegisterPage() {
  return (
    <Suspense fallback={
      <AuthLayout
        quote="One tap. That's all it takes to share who you are and what you do."
        quoteAuthor="EcoTap for Individuals"
      >
        <div className="w-full max-w-md mx-auto py-20 flex justify-center">
          <Spinner size="lg" />
        </div>
      </AuthLayout>
    }>
      <RegisterForm />
    </Suspense>
  );
}

function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const inviteToken = searchParams.get("invite");

  const [serverError, setServerError] = useState<string | null>(null);
  const [inviteInfo, setInviteInfo] = useState<{
    companyName: string;
    email: string | null;
  } | null>(null);
  const [inviteLoading, setInviteLoading] = useState(!!inviteToken);
  const [inviteError, setInviteError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<IndividualRegisterData>({
    resolver: zodResolver(individualRegisterSchema),
    defaultValues: {
      terms_accepted: false as unknown as true,
    },
  });

  // Validate invite token on mount
  useEffect(() => {
    if (!inviteToken) return;

    async function validate() {
      const result = await validateInviteTokenAction(inviteToken!);
      if (result.success && result.data) {
        setInviteInfo({
          companyName: result.data.company.name,
          email: result.data.email,
        });
        if (result.data.email) {
          setValue("email", result.data.email);
        }
      } else {
        const code = result.error;
        if (code === "INVITE_EXPIRED") {
          setInviteError("This invitation link has expired. Please ask your company admin for a new one.");
        } else if (code === "INVITE_ALREADY_USED") {
          setInviteError("This invitation link has already been used.");
        } else if (code === "INVITE_NOT_FOUND") {
          setInviteError("This invitation link is invalid.");
        } else {
          setInviteError(result.error ?? "Invalid invitation link.");
        }
      }
      setInviteLoading(false);
    }

    validate();
  }, [inviteToken, setValue]);

  async function onSubmit(data: IndividualRegisterData) {
    setServerError(null);
    const formData = new FormData();
    formData.append("email", data.email);
    formData.append("password", data.password);
    formData.append("full_name", data.full_name);
    formData.append("username", data.username);
    formData.append("role", "individual");
    formData.append("phone", data.phone);
    formData.append("age", String(data.age));
    if (data.company_name) {
      formData.append("company_name", data.company_name);
    }
    formData.append("terms_accepted", String(data.terms_accepted));

    const result = await signUp(formData);
    if (!result.success) {
      setServerError(result.error ?? "Registration failed. Please try again.");
    } else {
      // If registering via invite, accept the invitation
      if (inviteToken) {
        await acceptInvitationAction(inviteToken);
      }
      router.push(`/verify?email=${encodeURIComponent(data.email)}`);
    }
  }

  // Invite loading state
  if (inviteLoading) {
    return (
      <AuthLayout
        quote="One tap. That's all it takes to share who you are and what you do."
        quoteAuthor="EcoTap for Individuals"
      >
        <div className="w-full max-w-md mx-auto py-20 flex justify-center">
          <Spinner size="lg" />
        </div>
      </AuthLayout>
    );
  }

  // Invite error state
  if (inviteError) {
    return (
      <AuthLayout
        quote="One tap. That's all it takes to share who you are and what you do."
        quoteAuthor="EcoTap for Individuals"
      >
        <div className="w-full max-w-md mx-auto">
          <div className="text-center space-y-4 py-12">
            <div className="w-14 h-14 rounded-2xl bg-red-50 flex items-center justify-center mx-auto">
              <AlertCircle className="h-7 w-7 text-red-500" />
            </div>
            <h1 className="font-serif text-xl font-semibold text-ink">Invalid invitation</h1>
            <p className="text-sm text-ink-light">{inviteError}</p>
            <Link href="/register">
              <Button variant="primary" size="md">
                Register without invitation
              </Button>
            </Link>
          </div>
        </div>
      </AuthLayout>
    );
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

        {/* Invite banner */}
        {inviteInfo && (
          <div className="mb-6 rounded-2xl border p-4 flex items-center gap-3"
            style={{ backgroundColor: "#ECFDF5", borderColor: "rgba(5,150,105,0.3)" }}>
            <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ backgroundColor: "#064E3B" }}>
              <Building2 className="h-5 w-5" style={{ color: "#ECFDF5" }} />
            </div>
            <div>
              <p className="text-sm font-medium text-emerald-deep">
                You&apos;ve been invited to join
              </p>
              <p className="text-base font-semibold text-emerald-deep">
                {inviteInfo.companyName}
              </p>
              <p className="text-xs text-emerald-mid mt-0.5 flex items-center gap-1">
                <CheckCircle className="h-3 w-3" />
                Your account will be linked automatically
              </p>
            </div>
          </div>
        )}

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
            required
            placeholder="+250788123456"
            hint="Your WhatsApp or mobile number"
            error={errors.phone?.message}
            {...register("phone")}
          />

          <Input
            label="Age"
            required
            type="number"
            placeholder="e.g., 28"
            hint="You must be at least 18 years old"
            error={errors.age?.message}
            {...register("age", { valueAsNumber: true })}
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

          {/* Terms & Privacy acceptance */}
          <div className="bg-cream border border-cream-dark rounded-2xl p-4">
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                className="mt-0.5 h-4 w-4 rounded border-cream-dark text-emerald-bright focus:ring-emerald-mid cursor-pointer"
                {...register("terms_accepted")}
              />
              <span className="text-sm text-ink-light leading-relaxed">
                I agree to all{" "}
                <Link href="/terms" className="text-emerald-bright underline hover:text-emerald-mid" target="_blank">
                  Terms and Conditions
                </Link>{" "}
                and{" "}
                <Link href="/privacy" className="text-emerald-bright underline hover:text-emerald-mid" target="_blank">
                  Privacy Policy
                </Link>
              </span>
            </label>
            {errors.terms_accepted && (
              <p className="text-red-500 text-sm mt-2">{errors.terms_accepted.message}</p>
            )}
          </div>

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

        {!inviteInfo && (
          <p className="text-center text-sm text-ink-light mt-3">
            Registering an organisation?{" "}
            <Link
              href="/org/register"
              className="text-emerald-bright underline underline-offset-4 hover:text-emerald-mid transition-colors font-medium"
            >
              Organisation registration
            </Link>
          </p>
        )}
      </div>
    </AuthLayout>
  );
}
