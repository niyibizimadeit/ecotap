import { Eye, Users, Package, CheckCircle2, Clock, BadgeCheck } from "lucide-react";
import Link from "next/link";
import { getSupabase } from "@/lib/supabase/server";
import * as analyticsService from "@/lib/services/analytics.service";
import * as contactsService from "@/lib/services/contacts.service";
import * as ordersService from "@/lib/services/orders.service";
import { StatCard, EmptyState } from "@/components/dashboard/DashboardShared";
import { Badge } from "@/components/ui/Badge";

export async function EmployeeOverviewContent() {
  // ── Get current user + profile ────────────────────────────────────────
  const supabase = await getSupabase();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return null; // Shouldn't happen — proxy protects this route

  const { data: profile } = await supabase
    .from("profiles")
    .select("id, username, status")
    .eq("id", user.id)
    .single();

  const profileId = profile?.id;
  const username = profile?.username ?? "you";

  if (!profileId) {
    return <EmptyState icon="👤" title="Profile not found" description="Please contact support." />;
  }

  // ── Fetch card ────────────────────────────────────────────────────────
  const { data: card } = await supabase
    .from("cards")
    .select("id, is_public")
    .eq("profile_id", profileId)
    .single();

  const cardId = card?.id;
  const isActive = profile?.status === "active" && card?.is_public;

  // ── Fetch stats in parallel ───────────────────────────────────────────
  const [eventCounts, contactsResult, ordersResult, recentActivity] = await Promise.all([
    cardId
      ? analyticsService.getCardEventCounts(cardId)
      : Promise.resolve({ success: true as const, data: {} }),
    contactsService.getInbox(profileId),
    ordersService.getUserOrders(profileId),
    analyticsService.getUserActivity(profileId, 5),
  ]);

  const eventData = eventCounts.data as Record<string, number> | undefined;
  const views = eventData?.view ?? 0;
  const contacts = contactsResult.success ? contactsResult.data?.length ?? 0 : 0;
  const orders = ordersResult.success ? ordersResult.data ?? [] : [];
  const latestOrder = orders[0];
  const activity = recentActivity.success ? recentActivity.data ?? [] : [];
  const recentContacts = contactsResult.success ? (contactsResult.data ?? []).slice(0, 4) : [];

  // ── Relative time helper ──────────────────────────────────────────────
  function relativeTime(dateStr: string): string {
    const now = Date.now();
    const then = new Date(dateStr).getTime();
    const diffMs = now - then;
    const mins = Math.floor(diffMs / 60000);
    if (mins < 1) return "Just now";
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    const days = Math.floor(hrs / 24);
    if (days < 7) return `${days}d ago`;
    return new Date(dateStr).toLocaleDateString();
  }

  return (
    <>
      {/* Status banner */}
      <div
        className="rounded-2xl p-4 mb-6 flex items-center gap-3 border"
        style={{ backgroundColor: isActive ? "#ECFDF5" : "#FEF3C7", borderColor: isActive ? "rgba(5,150,105,0.2)" : "rgba(217,119,6,0.2)" }}
      >
        {isActive
          ? <CheckCircle2 className="h-5 w-5 flex-shrink-0" style={{ color: "#059669" }} />
          : <Clock className="h-5 w-5 flex-shrink-0" style={{ color: "#D97706" }} />
        }
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium" style={{ color: isActive ? "#064E3B" : "#92400E" }}>
            {isActive ? "Your card is active and public" : "Your card is not yet public"}
          </p>
          <p className="text-xs text-ink-light">
            ecotap.rw/{username}{latestOrder ? ` · ${latestOrder.status === "delivered" ? "NFC card delivered" : "Order: " + latestOrder.status}` : ""}
          </p>
        </div>
        <Badge variant={isActive ? "active" : "pending"}>{isActive ? "Active" : "Pending"}</Badge>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <StatCard label="Card views" value={views} sub="All time" icon={<Eye className="h-5 w-5" />} />
        <StatCard label="Contacts received" value={contacts} sub="From your card page" icon={<Users className="h-5 w-5" />} accent="#D97706" />
        <StatCard
          label="Card order"
          value={latestOrder ? (latestOrder.status ?? "None").charAt(0).toUpperCase() + (latestOrder.status ?? "none").slice(1) : "None"}
          sub={latestOrder ? `Physical NFC card` : "No orders yet"}
          icon={<Package className="h-5 w-5" />}
          accent={latestOrder?.status === "delivered" ? "#059669" : "#D97706"}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent contacts */}
        <div className="rounded-2xl border overflow-hidden" style={{ backgroundColor: "#FEF9EF", borderColor: "rgba(6,78,59,0.08)" }}>
          <div className="px-6 py-4 border-b flex items-center justify-between" style={{ borderColor: "rgba(6,78,59,0.08)" }}>
            <h2 className="font-serif text-lg font-semibold text-emerald-deep">Recent contacts</h2>
            <Link href="/dashboard/employee/contacts" className="text-xs text-emerald-bright hover:text-emerald-mid underline underline-offset-4 transition-colors">View all</Link>
          </div>
          {recentContacts.length === 0 ? (
            <EmptyState icon="📭" title="No contacts yet" description="Visitors who submit their info on your card page will appear here." />
          ) : (
            <div className="divide-y" style={{ borderColor: "rgba(6,78,59,0.06)" }}>
              {recentContacts.map((c) => (
                <div key={c.id} className="px-6 py-3.5 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 font-medium text-xs" style={{ backgroundColor: "#ECFDF5", color: "#065F46" }}>
                    {c.visitor_name.split(" ").map(n => n[0]).join("")}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-ink truncate">{c.visitor_name}</p>
                    <p className="text-xs text-ink-light truncate">{c.visitor_email ?? c.visitor_phone ?? "No contact info"}</p>
                  </div>
                  <span className="text-xs text-ink-light flex-shrink-0">{relativeTime(c.created_at)}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Activity feed */}
        <div className="rounded-2xl border overflow-hidden" style={{ backgroundColor: "#FEF9EF", borderColor: "rgba(6,78,59,0.08)" }}>
          <div className="px-6 py-4 border-b" style={{ borderColor: "rgba(6,78,59,0.08)" }}>
            <h2 className="font-serif text-lg font-semibold text-emerald-deep">Recent activity</h2>
          </div>
          {activity.length === 0 ? (
            <EmptyState icon="📋" title="No activity yet" description="Your recent actions and card interactions will appear here." />
          ) : (
            <div className="px-6 py-4 space-y-4">
              {activity.map((a) => (
                <div key={a.id} className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5" style={{ backgroundColor: "#ECFDF5" }}>
                    <BadgeCheck className="h-3.5 w-3.5" style={{ color: "#059669" }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-ink-mid">{a.description ?? a.activity_type}</p>
                    <p className="text-xs text-ink-light mt-0.5">{relativeTime(a.created_at)}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
