// src/app/dashboard/company/page.tsx

import { Suspense } from "react";
import Link from "next/link";
import { Users, CreditCard, ArrowRight, UserPlus, Palette, Clock, Building2 } from "lucide-react";
import {
  StatCard,
  PageHeader,
  StatCardSkeleton,
  EmptyState,
} from "@/components/dashboard/DashboardShared";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { getCompanyDashboardData } from "@/app/actions/company.actions";

export default function CompanyOverviewPage() {
  return (
    <div>
      <PageHeader
        eyebrow="Company Dashboard"
        title="Your Company"
        subtitle="Manage your team's digital business cards."
        action={
          <Link href="/dashboard/company/employees">
            <Button
              variant="primary"
              size="sm"
              rightIcon={<ArrowRight className="h-3.5 w-3.5" />}
            >
              Manage employees
            </Button>
          </Link>
        }
      />

      <Suspense fallback={<OverviewSkeleton />}>
        <CompanyOverviewContent />
      </Suspense>

      {/* Quick actions */}
      <div className="space-y-3 mt-6">
        <h2 className="font-serif text-lg font-semibold text-emerald-deep">
          Quick actions
        </h2>
        {[
          {
            title: "Add employee",
            sub: "Invite a new team member",
            href: "/dashboard/company/employees",
            icon: <UserPlus className="h-5 w-5" />,
            color: "#ECFDF5",
          },
          {
            title: "Company branding",
            sub: "Update logo and accent colour",
            href: "/dashboard/company/settings",
            icon: <Palette className="h-5 w-5" />,
            color: "#ECFDF5",
          },
          {
            title: "Billing & plan",
            sub: "View subscription and usage",
            href: "/dashboard/company/subscription",
            icon: <CreditCard className="h-5 w-5" />,
            color: "#FEF3C7",
          },
        ].map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="flex items-center gap-4 p-4 rounded-2xl border group hover:-translate-y-0.5 transition-all duration-200 hover:shadow-card-lg"
            style={{
              backgroundColor: "#FEF9EF",
              borderColor: "rgba(6,78,59,0.08)",
            }}
          >
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ backgroundColor: item.color }}
            >
              <span className="text-emerald-mid">{item.icon}</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-emerald-deep">
                {item.title}
              </p>
              <p className="text-xs text-ink-light mt-0.5">{item.sub}</p>
            </div>
            <ArrowRight className="h-4 w-4 text-ink-light group-hover:text-emerald-bright transition-colors flex-shrink-0" />
          </Link>
        ))}
      </div>
    </div>
  );
}

function OverviewSkeleton() {
  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-2 mb-6">
        {Array.from({ length: 3 }).map((_, i) => (
          <StatCardSkeleton key={i} />
        ))}
      </div>
      <div className="h-48 rounded-2xl skeleton" />
    </>
  );
}

async function CompanyOverviewContent() {
  const result = await getCompanyDashboardData();

  if (!result.success) {
    return (
      <EmptyState
        icon={<Building2 className="h-8 w-8 text-ink-light mx-auto" />}
        title="No company linked"
        description="Your account is not linked to a company yet."
      />
    );
  }

  const { company, employees, subscription, stats } = result.data;

  return (
    <>
      {/* Stats row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-2 mb-6">
        <StatCard
          label="Active employees"
          value={stats.active}
          sub="Team members with live cards"
          icon={<Users className="h-5 w-5" />}
        />
        <StatCard
          label="Pending"
          value={stats.pending}
          sub="Awaiting activation"
          icon={<Clock className="h-5 w-5" />}
          accent="#D97706"
        />
        <StatCard
          label="Subscription"
          value={subscription ? "Active" : "None"}
          sub={
            subscription?.plan
              ? `${subscription.plan.name} · ${subscription.billing_cycle}`
              : "No active plan"
          }
          icon={<CreditCard className="h-5 w-5" />}
          accent="#059669"
        />
      </div>

      {/* Employee preview */}
      <div
        className="rounded-2xl border overflow-hidden"
        style={{
          backgroundColor: "#FEF9EF",
          borderColor: "rgba(6,78,59,0.08)",
        }}
      >
        <div
          className="px-6 py-4 border-b flex items-center justify-between"
          style={{ borderColor: "rgba(6,78,59,0.08)" }}
        >
          <h2 className="font-serif text-lg font-semibold text-emerald-deep">
            Team
          </h2>
          <Link
            href="/dashboard/company/employees"
            className="text-xs text-emerald-bright hover:text-emerald-mid underline underline-offset-4 transition-colors"
          >
            View all
          </Link>
        </div>

        {employees.length === 0 ? (
          <EmptyState
            icon="👥"
            title="No employees yet"
            description="Invite team members to get started."
          />
        ) : (
          <div
            className="divide-y"
            style={{ borderColor: "rgba(6,78,59,0.06)" }}
          >
            {employees
              .sort((a, b) => {
                const order = { active: 0, pending: 1, suspended: 2 };
                return (order[a.status] ?? 3) - (order[b.status] ?? 3);
              })
              .slice(0, 5)
              .map((emp) => (
              <div
                key={emp.id}
                className="px-6 py-3.5 flex items-center gap-3"
              >
                <div
                  className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 font-medium text-xs"
                  style={{ backgroundColor: "#ECFDF5", color: "#065F46" }}
                >
                  {emp.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-ink truncate">
                    {emp.name}
                  </p>
                  <p className="text-xs text-ink-light">{emp.title}</p>
                </div>
                <Badge variant={emp.status}>{emp.status}</Badge>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
