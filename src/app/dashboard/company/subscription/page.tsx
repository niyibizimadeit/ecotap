// src/app/dashboard/company/subscription/page.tsx

import { Suspense } from "react";
import Link from "next/link";
import { PageHeader, SectionCard, EmptyState } from "@/components/dashboard/DashboardShared";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Users, Calendar, Mail, CreditCard, ArrowRight, Clock, Image as ImageIcon } from "lucide-react";
import { getCompanyDashboardData } from "@/app/actions/company.actions";

export default function SubscriptionPage() {
  return (
    <div>
      <PageHeader
        eyebrow="Billing"
        title="Subscription"
        subtitle="Your current plan and usage."
      />
      <Suspense
        fallback={
          <div className="space-y-4">
            {Array.from({ length: 2 }).map((_, i) => (
              <div key={i} className="h-24 rounded-2xl skeleton" />
            ))}
          </div>
        }
      >
        <SubscriptionContent />
      </Suspense>
    </div>
  );
}

async function SubscriptionContent() {
  const result = await getCompanyDashboardData();

  if (!result.success) {
    return (
      <EmptyState
        icon="💳"
        title="No company linked"
        description="Your account is not linked to a company."
      />
    );
  }

  const { subscription } = result.data;

  if (!subscription) {
    return (
      <div className="max-w-2xl">
        <EmptyState
          icon="💳"
          title="No active subscription"
          description="Subscribe to a plan to unlock employee management, card ordering, and more."
        />
        <div className="flex justify-center mt-4">
          <Link href="/dashboard/company/subscription/new">
            <Button variant="primary" size="md" rightIcon={<ArrowRight className="h-4 w-4" />}>
              Choose a plan
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const { plan } = subscription;
  const isPending = subscription.status === "pending_approval";
  const paymentStatus = (subscription as Record<string, unknown>).payment_status as string ?? "unpaid";

  return (
    <div className="space-y-6 max-w-2xl">
      {/* Pending approval banner */}
      {isPending && (
        <div className="rounded-2xl border p-4 flex items-center gap-3" style={{ backgroundColor: "#FEF3C7", borderColor: "rgba(146,64,14,0.15)" }}>
          <Clock className="h-5 w-5 flex-shrink-0" style={{ color: "#92400E" }} />
          <div>
            <p className="text-sm font-semibold" style={{ color: "#92400E" }}>Awaiting approval</p>
            <p className="text-xs" style={{ color: "rgba(146,64,14,0.8)" }}>
              Your payment screenshot is being reviewed. The EcoTap team will activate your subscription shortly.
            </p>
          </div>
        </div>
      )}

      <SectionCard>
        {/* Plan header */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="font-serif text-display-sm text-emerald-deep font-semibold">
              {plan?.name ?? "Standard Plan"}
            </p>
            <p className="text-sm text-ink-light mt-1">
              {plan
                ? `${plan.billing_cycle} · ${plan.price_per_employee.toLocaleString()} RWF / employee`
                : subscription.billing_cycle}
            </p>
          </div>
          <Badge variant={isPending ? "pending" : "active"}>
            {isPending ? "pending approval" : subscription.status}
          </Badge>
        </div>

        {/* Stat grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-cream rounded-xl p-4 flex items-center gap-3">
            <Users className="h-4 w-4 text-emerald-bright flex-shrink-0" />
            <div>
              <p className="text-xs text-ink-light">Active employees</p>
              <p className="text-sm font-semibold text-ink">
                {subscription.employee_count} cards
              </p>
            </div>
          </div>

          <div className="bg-cream rounded-xl p-4 flex items-center gap-3">
            <Calendar className="h-4 w-4 text-emerald-bright flex-shrink-0" />
            <div>
              <p className="text-xs text-ink-light">Next billing</p>
              <p className="text-sm font-semibold text-ink">
                {subscription.next_billing_date
                  ? new Date(subscription.next_billing_date).toLocaleDateString(
                      "en-GB",
                      { day: "numeric", month: "short", year: "numeric" }
                    )
                  : isPending ? "Starts on approval" : "—"}
              </p>
            </div>
          </div>

          <div className="bg-cream rounded-xl p-4 flex items-center gap-3">
            <Mail className="h-4 w-4 text-emerald-bright flex-shrink-0" />
            <div>
              <p className="text-xs text-ink-light">Billing cycle</p>
              <p className="text-sm font-semibold text-ink capitalize">
                {subscription.billing_cycle}
              </p>
            </div>
          </div>
        </div>

        {/* {plan.billing_cycle} cost estimate */}
        {plan && subscription.employee_count > 0 && (
          <div
            className="mt-4 rounded-xl p-4 border"
            style={{
              backgroundColor: "#ECFDF5",
              borderColor: "rgba(6,78,59,0.1)",
            }}
          >
            <p className="text-xs text-ink-light mb-1">
              Estimated {plan.billing_cycle === "annual" ? "annual" : "monthly"} cost
            </p>
            <p className="text-lg font-semibold text-emerald-deep font-serif">
              {(
                subscription.employee_count * plan.price_per_employee
              ).toLocaleString()}{" "}
              RWF
            </p>
            <p className="text-xs text-ink-light mt-0.5">
              {subscription.employee_count} employees ×{" "}
              {plan.price_per_employee.toLocaleString()} RWF
            </p>
          </div>
        )}

        {/* Payment info */}
        {subscription.payment_screenshot_url && (
          <div className="mt-4 rounded-xl border p-3 flex items-center gap-3" style={{ borderColor: "rgba(6,78,59,0.08)" }}>
            <ImageIcon className="h-4 w-4 text-ink-light flex-shrink-0" />
            <div>
              <p className="text-xs text-ink-light">Payment receipt uploaded</p>
              <p className="text-xs font-medium capitalize" style={{ color: paymentStatus === "verified" ? "#065F46" : paymentStatus === "paid" ? "#1E3A8A" : "#92400E" }}>
                {paymentStatus}
              </p>
            </div>
          </div>
        )}
      </SectionCard>

      {/* Billing footer note */}
      {!isPending && (
        <p className="text-xs text-ink-light text-center">
          To change your plan or cancel, contact{" "}
          <a
            href="mailto:billing@ecotap.rw"
            className="text-emerald-bright hover:underline"
          >
            billing@ecotap.rw
          </a>
          .
        </p>
      )}
    </div>
  );
}