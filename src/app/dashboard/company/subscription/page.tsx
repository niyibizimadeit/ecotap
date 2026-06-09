import { Suspense } from "react";
import { PageHeader, SectionCard, EmptyState } from "@/components/dashboard/DashboardShared";
import { Badge } from "@/components/ui/Badge";
import { Users, Calendar, Mail } from "lucide-react";
import { getSupabase, getServiceSupabase } from "@/lib/supabase/server";

export default function SubscriptionPage() {
  return (
    <div>
      <PageHeader eyebrow="Billing" title="Subscription" subtitle="Your current plan and usage." />
      <Suspense fallback={<div className="space-y-4">{Array.from({ length: 2 }).map((_, i) => <div key={i} className="h-24 rounded-2xl skeleton" />)}</div>}>
        <SubscriptionContent />
      </Suspense>
    </div>
  );
}

async function SubscriptionContent() {
  const supabase = await getSupabase();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: link } = await supabase
    .from("profile_companies")
    .select("company_id")
    .eq("profile_id", user.id)
    .eq("is_primary", true)
    .single();

  if (!link?.company_id) {
    return <EmptyState icon="💳" title="No company linked" description="Your account is not linked to a company." />;
  }

  const serviceClient = getServiceSupabase();

  const [subResult, planResult] = await Promise.all([
    serviceClient.from("company_subscriptions").select("*").eq("company_id", link.company_id).eq("status", "active").single(),
    serviceClient.from("billing_plans").select("*").eq("is_active", true).limit(1).single(),
  ]);

  const sub = subResult.data;
  const plan = planResult.data;

  if (!sub) {
    return <EmptyState icon="💳" title="No active subscription" description="Contact EcoTap to set up a billing plan for your company." />;
  }

  return (
    <div className="space-y-6 max-w-2xl">
      <SectionCard>
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="font-serif text-display-sm text-emerald-deep font-semibold">{plan?.name ?? "Plan"}</p>
            <p className="text-sm text-ink-light mt-1">{plan ? `${plan.billing_cycle} · ${plan.price_per_employee} RWF / employee` : sub.billing_cycle}</p>
          </div>
          <Badge variant="active">{sub.status}</Badge>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-cream rounded-xl p-4 flex items-center gap-3">
            <Users className="h-4 w-4 text-emerald-bright" />
            <div><p className="text-xs text-ink-light">Active employees</p><p className="text-sm font-semibold text-ink">{sub.employee_count ?? 0} cards</p></div>
          </div>
          <div className="bg-cream rounded-xl p-4 flex items-center gap-3">
            <Calendar className="h-4 w-4 text-emerald-bright" />
            <div><p className="text-xs text-ink-light">Next billing</p><p className="text-sm font-semibold text-ink">{sub.next_billing_date ? new Date(sub.next_billing_date).toLocaleDateString() : "—"}</p></div>
          </div>
          <div className="bg-cream rounded-xl p-4 flex items-center gap-3">
            <Mail className="h-4 w-4 text-emerald-bright" />
            <div><p className="text-xs text-ink-light">Billing cycle</p><p className="text-sm font-semibold text-ink capitalize">{sub.billing_cycle ?? "—"}</p></div>
          </div>
        </div>
      </SectionCard>
    </div>
  );
}
