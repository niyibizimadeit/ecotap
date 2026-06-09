import Link from "next/link";
import { Users, CreditCard, Package, ArrowRight, CheckCircle2, Clock, AlertCircle, UserPlus, Palette } from "lucide-react";
import { StatCard, PageHeader } from "@/components/dashboard/DashboardShared";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";

const MOCK_EMPLOYEES = [
  { name: "Amara Uwimana",     title: "Creative Director", status: "active"  as const, dept: "Creative"   },
  { name: "Eric Hakizimana",   title: "Dev Lead",          status: "active"  as const, dept: "Engineering" },
  { name: "Grace Uwase",       title: "Account Manager",   status: "active"  as const, dept: "Sales"       },
  { name: "James Karekezi",    title: "Designer",          status: "pending" as const, dept: "Creative"    },
  { name: "Diane Mukamana",    title: "Marketing Lead",    status: "active"  as const, dept: "Marketing"   },
];

const MOCK_ALERTS = [
  { type: "warning", text: "James Karekezi's account is pending approval." },
  { type: "info",    text: "Subscription renews in 12 days." },
];

export default function CompanyOverviewPage() {
  const activeCount  = MOCK_EMPLOYEES.filter(e => e.status === "active").length;
  const pendingCount = MOCK_EMPLOYEES.filter(e => e.status === "pending").length;

  return (
    <div>
      <PageHeader
        eyebrow="Company Dashboard"
        title="RDMC Ltd"
        subtitle="Manage your team's digital business cards."
        action={
          <Link href="/dashboard/company/employees">
            <Button variant="primary" size="sm" rightIcon={<ArrowRight className="h-3.5 w-3.5" />}>
              Manage employees
            </Button>
          </Link>
        }
      />

      {/* Alerts */}
      {MOCK_ALERTS.map((alert, i) => (
        <div
          key={i}
          className="rounded-2xl border p-4 mb-3 flex items-center gap-3"
          style={{
            backgroundColor: alert.type === "warning" ? "#FEF3C7" : "#ECFDF5",
            borderColor:     alert.type === "warning" ? "rgba(146,64,14,0.2)" : "rgba(5,150,105,0.2)",
          }}
        >
          {alert.type === "warning"
            ? <AlertCircle className="h-4 w-4 flex-shrink-0" style={{ color: "#D97706" }} />
            : <CheckCircle2 className="h-4 w-4 flex-shrink-0" style={{ color: "#059669" }} />
          }
          <p className="text-sm" style={{ color: alert.type === "warning" ? "#92400E" : "#065F46" }}>
            {alert.text}
          </p>
        </div>
      ))}

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-2 mb-6">
        <StatCard label="Active cards"     value={activeCount}  sub="Employees with live cards" icon={<Users      className="h-5 w-5" />} />
        <StatCard label="Pending approval" value={pendingCount} sub="Awaiting activation"        icon={<Clock      className="h-5 w-5" />} accent="#D97706" />
        <StatCard label="Subscription"     value="Active"       sub="Monthly plan"               icon={<CreditCard className="h-5 w-5" />} accent="#059669" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Employee list preview */}
        <div
          className="rounded-2xl border overflow-hidden"
          style={{ backgroundColor: "#FEF9EF", borderColor: "rgba(6,78,59,0.08)" }}
        >
          <div className="px-6 py-4 border-b flex items-center justify-between" style={{ borderColor: "rgba(6,78,59,0.08)" }}>
            <h2 className="font-serif text-lg font-semibold text-emerald-deep">Team</h2>
            <Link href="/dashboard/company/employees">
              <span className="text-xs text-emerald-bright hover:text-emerald-mid underline underline-offset-4 transition-colors cursor-pointer">
                View all
              </span>
            </Link>
          </div>
          <div className="divide-y" style={{ borderColor: "rgba(6,78,59,0.06)" }}>
            {MOCK_EMPLOYEES.map((emp) => (
              <div key={emp.name} className="px-6 py-3.5 flex items-center gap-3">
                <div
                  className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 font-medium text-xs"
                  style={{ backgroundColor: "#ECFDF5", color: "#065F46" }}
                >
                  {emp.name.split(" ").map(n => n[0]).join("")}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-ink truncate">{emp.name}</p>
                  <p className="text-xs text-ink-light">{emp.title} · {emp.dept}</p>
                </div>
                <Badge variant={emp.status}>{emp.status}</Badge>
              </div>
            ))}
          </div>
        </div>

        {/* Quick actions */}
        <div className="space-y-3">
          <h2 className="font-serif text-lg font-semibold text-emerald-deep">Quick actions</h2>
          {[
            { title: "Add employee",         sub: "Invite a new team member",             href: "/dashboard/company/employees",   icon: <UserPlus className="h-5 w-5" />, color: "#ECFDF5" },
            { title: "Manage departments",   sub: "Organise your team structure",         href: "/dashboard/company/departments", icon: <Package className="h-5 w-5" />, color: "#FEF3C7" },
            { title: "Company branding",     sub: "Update logo and accent colour",        href: "/dashboard/company/settings",    icon: <Palette className="h-5 w-5" />, color: "#ECFDF5" },
            { title: "Billing & plan",       sub: "View subscription and usage",          href: "/dashboard/company/subscription",icon: <CreditCard className="h-5 w-5" />, color: "#FEF3C7" },
          ].map(item => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-4 p-4 rounded-2xl border group hover:-translate-y-0.5 transition-all duration-200 hover:shadow-card-lg"
              style={{ backgroundColor: "#FEF9EF", borderColor: "rgba(6,78,59,0.08)" }}
            >
              <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: item.color }}>
                <span className="text-emerald-mid">{item.icon}</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-emerald-deep">{item.title}</p>
                <p className="text-xs text-ink-light mt-0.5">{item.sub}</p>
              </div>
              <ArrowRight className="h-4 w-4 text-ink-light group-hover:text-emerald-bright transition-colors flex-shrink-0" />
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}