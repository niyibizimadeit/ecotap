import Link from "next/link";
import { PageHeader, StatCard } from "@/components/dashboard/DashboardShared";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Clock, Users, Package, CreditCard, ArrowRight, Building2, User } from "lucide-react";

const STATS = [
  { label: "Pending approvals", value: 3,   sub: "Needs action",       icon: <Clock      className="h-5 w-5" />, accent: "#D97706" },
  { label: "Active users",      value: 142,  sub: "Companies + individuals", icon: <Users      className="h-5 w-5" /> },
  { label: "Open card orders",  value: 2,   sub: "Awaiting approval",  icon: <Package    className="h-5 w-5" />, accent: "#D97706" },
  { label: "Active companies",  value: 18,  sub: "On platform",        icon: <Building2  className="h-5 w-5" /> },
];

const PENDING_APPROVALS = [
  { type: "company",    name: "Kigali Tech Hub",    detail: "Technology · 11–50 employees", time: "2 hours ago"  },
  { type: "individual", name: "Jean-Paul Habimana", detail: "Freelance developer",           time: "5 hours ago"  },
  { type: "company",    name: "Inyange Industries",  detail: "Manufacturing · 51–200 employees", time: "Yesterday" },
];

const RECENT_ORDERS = [
  { user: "Ntwali Frankie",  design: "Classic Emerald", qty: 50, status: "pending"  as const, time: "1 hour ago"  },
  { user: "Amara Uwimana",    design: "Midnight Dark",   qty: 10, status: "approved" as const, time: "3 hours ago" },
];

export default function AdminOverviewPage() {
  return (
    <div>
      <PageHeader
        eyebrow="Super Admin"
        title="Platform overview"
        subtitle="Everything happening on EcoTap right now."
      />

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {STATS.map(s => (
          <StatCard key={s.label} label={s.label} value={s.value} sub={s.sub} icon={s.icon} accent={s.accent} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Pending approvals */}
        <div
          className="rounded-2xl border overflow-hidden"
          style={{ backgroundColor: "#FEF9EF", borderColor: "rgba(6,78,59,0.08)" }}
        >
          <div className="px-6 py-4 border-b flex items-center justify-between" style={{ borderColor: "rgba(6,78,59,0.08)" }}>
            <div className="flex items-center gap-2">
              <h2 className="font-serif text-lg font-semibold text-emerald-deep">Pending approvals</h2>
              <span
                className="text-xs font-mono px-2 py-0.5 rounded-full"
                style={{ backgroundColor: "#FEF3C7", color: "#92400E" }}
              >
                {PENDING_APPROVALS.length}
              </span>
            </div>
            <Link href="/dashboard/admin/approvals">
              <span className="text-xs text-emerald-bright hover:text-emerald-mid underline underline-offset-4 transition-colors cursor-pointer">
                View all
              </span>
            </Link>
          </div>
          <div className="divide-y" style={{ borderColor: "rgba(6,78,59,0.06)" }}>
            {PENDING_APPROVALS.map((item, i) => (
              <div key={i} className="px-6 py-4 flex items-center gap-3">
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: item.type === "company" ? "#ECFDF5" : "#FEF3C7" }}
                >
                  {item.type === "company"
                    ? <Building2 className="h-4 w-4" style={{ color: "#065F46" }} />
                    : <User      className="h-4 w-4" style={{ color: "#92400E" }} />
                  }
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-ink truncate">{item.name}</p>
                  <p className="text-xs text-ink-light truncate">{item.detail}</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <Badge variant="pending" className="mb-1">{item.type}</Badge>
                  <p className="text-xs text-ink-light">{item.time}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="px-6 py-3 border-t" style={{ borderColor: "rgba(6,78,59,0.06)" }}>
            <Link href="/dashboard/admin/approvals">
              <Button variant="primary" size="sm" className="w-full" rightIcon={<ArrowRight className="h-3.5 w-3.5" />}>
                Review approvals
              </Button>
            </Link>
          </div>
        </div>

        {/* Recent orders */}
        <div
          className="rounded-2xl border overflow-hidden"
          style={{ backgroundColor: "#FEF9EF", borderColor: "rgba(6,78,59,0.08)" }}
        >
          <div className="px-6 py-4 border-b flex items-center justify-between" style={{ borderColor: "rgba(6,78,59,0.08)" }}>
            <h2 className="font-serif text-lg font-semibold text-emerald-deep">Card orders</h2>
            <Link href="/dashboard/admin/orders">
              <span className="text-xs text-emerald-bright hover:text-emerald-mid underline underline-offset-4 transition-colors cursor-pointer">
                View all
              </span>
            </Link>
          </div>
          <div className="divide-y" style={{ borderColor: "rgba(6,78,59,0.06)" }}>
            {RECENT_ORDERS.map((order, i) => (
              <div key={i} className="px-6 py-4 flex items-center gap-3">
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 font-medium text-xs"
                  style={{ backgroundColor: "#ECFDF5", color: "#065F46" }}
                >
                  {order.user.split(" ").map(n => n[0]).join("")}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-ink truncate">{order.user}</p>
                  <p className="text-xs text-ink-light">{order.design} · {order.qty} cards</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <Badge variant={order.status} className="mb-1">{order.status}</Badge>
                  <p className="text-xs text-ink-light">{order.time}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="px-6 py-3 border-t" style={{ borderColor: "rgba(6,78,59,0.06)" }}>
            <Link href="/dashboard/admin/orders">
              <Button variant="secondary" size="sm" className="w-full" rightIcon={<ArrowRight className="h-3.5 w-3.5" />}>
                Manage orders
              </Button>
            </Link>
          </div>
        </div>

        {/* Quick links */}
        <div className="lg:col-span-2 grid grid-cols-2 lg:grid-cols-4 gap-3">
          {[
            { label: "Manage designs",  href: "/dashboard/admin/designs", icon: "🎨", sub: "Add or toggle card designs" },
            { label: "All users",       href: "/dashboard/admin/users",   icon: "👥", sub: "Search and manage accounts" },
            { label: "Billing plans",   href: "/dashboard/admin/billing", icon: "💳", sub: "Edit pricing plans" },
            { label: "View home page",  href: "/",                        icon: "🌍", sub: "See EcoTap as a visitor" },
          ].map(item => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-2xl border p-4 flex flex-col gap-2 group hover:-translate-y-0.5 transition-all hover:shadow-card-lg"
              style={{ backgroundColor: "#FEF9EF", borderColor: "rgba(6,78,59,0.08)" }}
            >
              <span className="text-2xl">{item.icon}</span>
              <p className="text-sm font-semibold text-emerald-deep">{item.label}</p>
              <p className="text-xs text-ink-light">{item.sub}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}