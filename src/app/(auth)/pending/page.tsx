import Link from "next/link";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { Button } from "@/components/ui/Button";
import { Clock, ArrowRight } from "lucide-react";

export default function PendingPage() {
  return (
    <AuthLayout quote="Great things take time. We're reviewing your account to make sure everything is in order." quoteAuthor="EcoTap Team">
      <div className="w-full max-w-md mx-auto text-center">
        {/* Icon */}
        <div className="w-16 h-16 rounded-2xl bg-emerald-pale border border-emerald-light flex items-center justify-center mx-auto mb-6">
          <Clock className="h-8 w-8 text-emerald-bright" />
        </div>

        <h1 className="font-serif text-display-sm text-emerald-deep mb-3">Your account is under review</h1>

        <p className="text-sm text-ink-light leading-relaxed mb-2">
          We are reviewing your registration. This usually takes{" "}
          <span className="font-medium text-ink-mid">less than 24 hours</span>.
        </p>
        <p className="text-sm text-ink-light leading-relaxed mb-8">
          Once approved, you will receive an email and can sign in to your dashboard.
        </p>

        {/* Timeline */}
        <div className="bg-cream border border-cream-dark rounded-2xl p-5 mb-8 text-left">
          <p className="text-xs font-mono tracking-widest uppercase text-emerald-bright mb-4">What happens next</p>
          <div className="space-y-3">
            {[
              { label: "Registration submitted", done: true },
              { label: "Team reviews your application", done: false },
              { label: "Account activated — you get an email", done: false },
              { label: "Sign in and set up your card", done: false },
            ].map((item, i) => (
              <div key={item.label} className="flex items-start gap-3">
                <div
                  className={`mt-0.5 w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 ${
                    item.done
                      ? "bg-emerald-bright border border-emerald-bright"
                      : "bg-cream-dark border border-cream-dark"
                  }`}
                >
                  {item.done ? (
                    <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                      <path d="M1 4l3 3 5-6" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  ) : (
                    <span className="text-[10px] text-ink-light">{i + 1}</span>
                  )}
                </div>
                <span className={`text-sm ${item.done ? "text-ink font-medium" : "text-ink-light"}`}>
                  {item.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <Link href="/">
            <Button variant="primary" size="lg" className="w-full" rightIcon={<ArrowRight className="h-4 w-4" />}>
              Back to home
            </Button>
          </Link>
          <p className="text-xs text-ink-light">
            Questions?{" "}
            <a href="mailto:support@ecotap.rw" className="text-emerald-bright underline underline-offset-4 hover:text-emerald-mid transition-colors">
              Contact support
            </a>
          </p>
        </div>
      </div>
    </AuthLayout>
  );
}
