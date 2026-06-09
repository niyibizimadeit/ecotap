import { Suspense } from "react";
import Link from "next/link";
import { PageHeader, StatCard, StatCardSkeleton, EmptyState } from "@/components/dashboard/DashboardShared";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Clock, Users, Package, ArrowRight, Building2, User } from "lucide-react";
import * as adminService from "@/lib/services/admin.service";

export default function AdminOverviewPage() {
  return (
    <div>
      <PageHeader
        eyebrow="Super Admin"
        title="Platform overview"
        subtitle="Everything happening on EcoTap right now."
      />

      <Suspense fallback={<AdminOverviewSkeleton />}>
        <AdminOverviewContent />
      </Suspense>

      {/* Quick links — static */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mt-6">
        {[
          { label: "Manage designs",  href: "/dashboard/admin/designs", icon: "🎨", sub: "Add or toggle card designs" },
          { label: "All users",       href: "/dashboard/admin/users",   icon: "👥", sub: "Search and manage accounts" },
          { label: "Billing plans",   href: "/dashboard/admin/billing", icon: "💳", sub: "Edit pricing plans" },
          { label: "View home page",  href: "/",                        icon: "🌍", sub: "See EcoTap as a visitor" },
        ].map(item => (
          <Link key={item.href} href={item.href} className="rounded-2xl border p-4 flex flex-col gap-2 group hover:-translate-y-0.5 transition-all hover:shadow-card-lg" style={{ backgroundColor: "#FEF9EF", borderColor: "rgba(6,78,59,0.08)" }}>
            <span className="text-2xl">{item.icon}</span>
            <p className="text-sm font-semibold text-emerald-deep">{item.label}</p>
            <p className="text-xs text-ink-light">{item.sub}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}

function AdminOverviewSkeleton() {
  return (
    <>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {Array.from({ length: 4 }).map((_, i) => <StatCardSkeleton key={i} />)}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="h-64 rounded-2xl skeleton" />
        <div className="h-64 rounded-2xl skeleton" />
      </div>
    </>
  );
}

async function AdminOverviewContent() {
  const [overview, queue, orders] = await Promise.all([
    adminService.getAdminOverview(),
    adminService.getPendingQueue(),
    adminService.getAllOrdersAdmin({ status: "pending" }),
  ]);

  const stats = overview.success ? overview.data : null;
  const pendingItems = queue.success ? [
    ...(queue.data?.companies ?? []).map(c => ({ type: "company" as const, name: c.name, detail: `${c.industry ?? "Unknown"} · ${c.size ?? "?"}`, time: c.created_at })),
    ...(queue.data?.individuals ?? []).map(p => ({ type: "individual" as const, name: p.full_name, detail: p.email, time: p.created_at })),
  ].slice(0, 3) : [];
  const recentOrders = orders.success ? (orders.data ?? []).slice(0, 3) : [];

  function relativeTime(d: string) {
    const diff = Date.now() - new Date(d).getTime();
    const h = Math.floor(diff / 3600000);
    if (h < 1) return "Just now";
    if (h < 24) return `${h}h ago`;
    const days = Math.floor(h / 24);
    return `${days}d ago`;
  }

  return (
    <>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard label="Pending approvals" value={stats?.pendingApprovals ?? 0} sub="Needs action" icon={<Clock className="h-5 w-5" />} accent="#D97706" />
        <StatCard label="Active users" value={stats?.activeUsers ?? 0} sub="Companies + individuals" icon={<Users className="h-5 w-5" />} />
        <StatCard label="Open card orders" value={stats?.pendingOrders ?? 0} sub="Awaiting approval" icon={<Package className="h-5 w-5" />} accent="#D97706" />
        <StatCard label="Active companies" value={stats?.totalCompanies ?? 0} sub="On platform" icon={<Building2 className="h-5 w-5" />} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pending approvals */}
        <div className="rounded-2xl border overflow-hidden" style={{ backgroundColor: "#FEF9EF", borderColor: "rgba(6,78,59,0.08)" }}>
          <div className="px-6 py-4 border-b flex items-center justify-between" style={{ borderColor: "rgba(6,78,59,0.08)" }}>
            <div className="flex items-center gap-2">
              <h2 className="font-serif text-lg font-semibold text-emerald-deep">Pending approvals</h2>
              <span className="text-xs font-mono px-2 py-0.5 rounded-full" style={{ backgroundColor: "#FEF3C7", color: "#92400E" }}>{pendingItems.length}</span>
            </div>
            <Link href="/dashboard/admin/approvals" className="text-xs text-emerald-bright hover:text-emerald-mid underline underline-offset-4 transition-colors">View all</Link>
          </div>
          {pendingItems.length === 0 ? (
            <EmptyState icon="✅" title="All clear" description="No pending approvals right now." />
          ) : (
            <div className="divide-y" style={{ borderColor: "rgba(6,78,59,0.06)" }}>
              {pendingItems.map((item, i) => (
                <div key={i} className="px-6 py-4 flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: item.type === "company" ? "#ECFDF5" : "#FEF3C7" }}>
                    {item.type === "company" ? <Building2 className="h-4 w-4" style={{ color: "#065F46" }} /> : <User className="h-4 w-4" style={{ color: "#92400E" }} />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-ink truncate">{item.name}</p>
                    <p className="text-xs text-ink-light truncate">{item.detail}</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <Badge variant="pending" className="mb-1">{item.type}</Badge>
                    <p className="text-xs text-ink-light">{relativeTime(item.time)}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
          <div className="px-6 py-3 border-t" style={{ borderColor: "rgba(6,78,59,0.06)" }}>
            <Link href="/dashboard/admin/approvals"><Button variant="primary" size="sm" className="w-full" rightIcon={<ArrowRight className="h-3.5 w-3.5" />}>Review approvals</Button></Link>
          </div>
        </div>

        {/* Recent orders */}
        <div className="rounded-2xl border overflow-hidden" style={{ backgroundColor: "#FEF9EF", borderColor: "rgba(6,78,59,0.08)" }}>
          <div className="px-6 py-4 border-b flex items-center justify-between" style={{ borderColor: "rgba(6,78,59,0.08)" }}>
            <h2 className="font-serif text-lg font-semibold text-emerald-deep">Card orders</h2>
            <Link href="/dashboard/admin/orders" className="text-xs text-emerald-bright hover:text-emerald-mid underline underline-offset-4 transition-colors">View all</Link>
          </div>
          {recentOrders.length === 0 ? (
            <EmptyState icon="📦" title="No orders yet" description="Orders will appear here once customers place them." />
          ) : (
            <div className="divide-y" style={{ borderColor: "rgba(6,78,59,0.06)" }}>
              {recentOrders.map((order) => (
                <div key={order.id} className="px-6 py-4 flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 font-medium text-xs" style={{ backgroundColor: "#ECFDF5", color: "#065F46" }}>ORD</div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-ink truncate">Order #{order.id.slice(0, 8)}</p>
                    <p className="text-xs text-ink-light">{order.quantity} cards</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <Badge variant={order.status}>{order.status}</Badge>
                    <p className="text-xs text-ink-light mt-1">{relativeTime(order.created_at)}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
          <div className="px-6 py-3 border-t" style={{ borderColor: "rgba(6,78,59,0.06)" }}>
            <Link href="/dashboard/admin/orders"><Button variant="secondary" size="sm" className="w-full" rightIcon={<ArrowRight className="h-3.5 w-3.5" />}>Manage orders</Button></Link>
          </div>
        </div>
      </div>
    </>
  );
}
