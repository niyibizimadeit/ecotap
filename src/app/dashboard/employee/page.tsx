import { Suspense } from "react";
import Link from "next/link";
import { Eye, Users, Package, ArrowRight } from "lucide-react";
import { StatCard, PageHeader, StatCardSkeleton } from "@/components/dashboard/DashboardShared";
import { EmployeeOverviewContent } from "./OverviewContent";

export default function EmployeeOverviewPage() {
  return (
    <div>
      <PageHeader
        eyebrow="Dashboard"
        title="Welcome back"
        subtitle="Here's how your card is performing."
        action={
          <Link href="/dashboard/employee/profile">
            <span className="text-xs text-emerald-bright underline underline-offset-4 hover:text-emerald-mid transition-colors">
              View my card
            </span>
          </Link>
        }
      />

      <Suspense
        fallback={
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            <StatCardSkeleton />
            <StatCardSkeleton />
            <StatCardSkeleton />
          </div>
        }
      >
        <EmployeeOverviewContent />
      </Suspense>

      {/* Quick links — static, always shown */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
        {[
          { title: "Edit your card", sub: "Update your profile, bio, and social links", href: "/dashboard/employee/profile", icon: "✏️" },
          { title: "Order more cards", sub: "Get additional NFC cards for yourself", href: "/dashboard/employee/orders", icon: "📦" },
        ].map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="rounded-2xl border p-5 flex items-center gap-4 group hover:-translate-y-0.5 transition-all duration-200 hover:shadow-card-lg"
            style={{ backgroundColor: "#FEF9EF", borderColor: "rgba(6,78,59,0.08)" }}
          >
            <span className="text-2xl">{item.icon}</span>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-emerald-deep">{item.title}</p>
              <p className="text-xs text-ink-light mt-0.5">{item.sub}</p>
            </div>
            <ArrowRight className="h-4 w-4 text-ink-light group-hover:text-emerald-bright transition-colors flex-shrink-0" />
          </Link>
        ))}
      </div>
    </div>
  );
}
