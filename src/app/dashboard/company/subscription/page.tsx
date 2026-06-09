// src/app/dashboard/company/subscription/page.tsx

import { Suspense } from "react";
import { PageHeader, SectionCard, EmptyState } from "@/components/dashboard/DashboardShared";
import { Badge } from "@/components/ui/Badge";
import { Users, Calendar, Mail } from "lucide-react";
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
      <EmptyState
        icon="💳"
        title="No active subscription"
        description="Contact EcoTap to set up a billing plan for your company."
      />
    );
  }

  const { plan } = subscription;

  return (
    <div className="space-y-6 max-w-2xl">
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
          <Badge variant="active">{subscription.status}</Badge>
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
                  : "—"}
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

        {/* Monthly cost estimate */}
        {plan && subscription.employee_count > 0 && (
          <div
            className="mt-4 rounded-xl p-4 border"
            style={{
              backgroundColor: "#ECFDF5",
              borderColor: "rgba(6,78,59,0.1)",
            }}
          >
            <p className="text-xs text-ink-light mb-1">Estimated monthly cost</p>
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
      </SectionCard>

      {/* Billing footer note */}
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
    </div>
  );
}