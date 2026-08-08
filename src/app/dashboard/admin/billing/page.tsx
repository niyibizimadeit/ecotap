"use client";

import { useState, useEffect } from "react";
import { PageHeader } from "@/components/dashboard/DashboardShared";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { Input } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import { Plus, Pencil, CheckCircle2, ShieldCheck, XCircle, CreditCard, Building2, Calendar, Image as ImageIcon } from "lucide-react";
import {
  fetchAllSubscriptionsAdminAction,
  verifySubscriptionPaymentAction,
  approveSubscriptionAction,
  rejectSubscriptionAction,
} from "@/app/actions/subscription.actions";
import type { BillingCycle } from "@/types";

interface Plan {
  id:                 string;
  name:               string;
  billing_cycle:      BillingCycle;
  price_per_employee: number;
  is_active:          boolean;
  companies:          number;
}

interface SubInfo {
  id: string;
  company: { id: string; name: string; slug: string } | null;
  plan: { name: string; price_per_employee: number; billing_cycle: string } | null;
  status: string;
  payment_status: string;
  payment_amount: number | null;
  payment_currency: string;
  payment_screenshot_url: string | null;
  employee_count: number;
  started_at: string;
  created_at: string;
}

const INITIAL_PLANS: Plan[] = [];

const PLAN_FEATURES = [
  "Full company admin dashboard",
  "Unlimited card profile edits",
  "Physical NFC card ordering",
  "Department management",
  "Contact exchange inbox",
  "Email support",
];

const PAYMENT_LABELS: Record<string, string> = {
  unpaid:   "Unpaid",
  paid:     "Paid",
  verified: "Verified",
};

const PAYMENT_COLORS: Record<string, string> = {
  unpaid:   "#FEF3C7",
  paid:     "#EFF6FF",
  verified: "#ECFDF5",
};

export default function BillingPage() {
  const [plans,      setPlans]      = useState(INITIAL_PLANS);
  const [modalOpen,  setModalOpen]  = useState(false);
  const [editPlan,   setEditPlan]   = useState<Plan | null>(null);
  const [formName,   setFormName]   = useState("");
  const [formCycle,  setFormCycle]  = useState<BillingCycle>("monthly");
  const [formPrice,  setFormPrice]  = useState("");
  const [saving,     setSaving]     = useState(false);

  // Subscription management
  const [subscriptions, setSubscriptions] = useState<SubInfo[]>([]);
  const [subsLoading,   setSubsLoading]   = useState(true);
  const [subFilter,     setSubFilter]     = useState<string>("pending_approval");
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [previewImage,  setPreviewImage]  = useState<string | null>(null);

  function openCreate() {
    setEditPlan(null);
    setFormName("");
    setFormCycle("monthly");
    setFormPrice("");
    setModalOpen(true);
  }

  function openEdit(p: Plan) {
    setEditPlan(p);
    setFormName(p.name);
    setFormCycle(p.billing_cycle);
    setFormPrice(String(p.price_per_employee));
    setModalOpen(true);
  }

  useEffect(() => {
    async function load() {
      const { fetchPlans } = await import("@/app/actions/admin.actions");
      const result = await fetchPlans();
      if (result.success && result.data) {
        setPlans(result.data.map((p: Record<string, unknown>) => ({
          id: p.id as string, name: (p.name as string) ?? "",
          billing_cycle: (p.billing_cycle as BillingCycle) ?? "monthly",
          price_per_employee: (p.price_per_employee as number) ?? 0,
          is_active: (p.is_active as boolean) ?? true, features: [],
        })));
      }
    }
    load();
    loadSubscriptions();
  }, []);

  async function loadSubscriptions() {
    setSubsLoading(true);
    const result = await fetchAllSubscriptionsAdminAction();
    if (result.success && result.data) {
      setSubscriptions(result.data as unknown as SubInfo[]);
    }
    setSubsLoading(false);
  }

  async function handleVerifyPayment(subId: string) {
    setActionLoading(subId);
    const result = await verifySubscriptionPaymentAction(subId);
    if (result.success) {
      setSubscriptions((ss) => ss.map((s) => s.id === subId ? { ...s, payment_status: "verified" } : s));
    }
    setActionLoading(null);
  }

  async function handleApprove(subId: string) {
    setActionLoading(subId);
    const result = await approveSubscriptionAction(subId);
    if (result.success) {
      setSubscriptions((ss) => ss.map((s) => s.id === subId ? { ...s, status: "active" } : s));
    }
    setActionLoading(null);
  }

  async function handleReject(subId: string) {
    setActionLoading(subId);
    const result = await rejectSubscriptionAction(subId);
    if (result.success) {
      setSubscriptions((ss) => ss.map((s) => s.id === subId ? { ...s, status: "cancelled" } : s));
    }
    setActionLoading(null);
  }

  async function save() {
    if (!formName.trim() || !formPrice) return;
    setSaving(true);
    const { upsertPlan } = await import("@/app/actions/admin.actions");
    const fd = new FormData();
    if (editPlan) fd.set("id", editPlan.id);
    fd.set("name", formName);
    fd.set("billing_cycle", formCycle);
    fd.set("price_per_employee", String(formPrice));
    fd.set("is_active", editPlan ? String(editPlan.is_active) : "on");
    const result = await upsertPlan(fd);
    if (result.success && result.data) {
      const p = result.data as Record<string, unknown>;
      if (editPlan) {
        setPlans(ps => ps.map(pl => pl.id === editPlan.id
          ? { ...pl, name: formName, billing_cycle: formCycle, price_per_employee: Number(formPrice) }
          : pl
        ));
      } else {
        setPlans(ps => [...ps, {
          id:                 p.id as string,
          name:               formName,
          billing_cycle:      formCycle,
          price_per_employee: Number(formPrice),
          is_active:          true,
          companies:          0,
        }]);
      }
      setModalOpen(false);
    }
    setSaving(false);
  }

  async function toggleActive(id: string, currentActive: boolean) {
    const { togglePlanActive } = await import("@/app/actions/admin.actions");
    const result = await togglePlanActive(id, !currentActive);
    if (result.success) {
      setPlans(ps => ps.map(p => p.id === id ? { ...p, is_active: !currentActive } : p));
    }
  }

  const filteredSubs = subFilter === "all"
    ? subscriptions
    : subscriptions.filter((s) => s.status === subFilter);

  const pendingCount = subscriptions.filter((s) => s.status === "pending_approval").length;

  function formatAmount(sub: SubInfo): string {
    if (!sub.payment_amount) return "—";
    if (sub.payment_currency === "RWF") return `${sub.payment_amount.toLocaleString()} RWF`;
    return `$${sub.payment_amount}`;
  }

  return (
    <div>
      <PageHeader
        eyebrow="Billing"
        title="Billing plans"
        subtitle={`Manage pricing plans · ${pendingCount} subscription${pendingCount !== 1 ? "s" : ""} pending approval`}
        action={
          <Button variant="primary" size="sm" leftIcon={<Plus className="h-3.5 w-3.5" />} onClick={openCreate}>
            Add plan
          </Button>
        }
      />

      {/* Plans grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-8">
        {plans.map(plan => (
          <div
            key={plan.id}
            className="rounded-2xl border overflow-hidden transition-all hover:shadow-card-lg"
            style={{
              backgroundColor: "#FEF9EF",
              borderColor:     plan.is_active ? "rgba(5,150,105,0.2)" : "rgba(6,78,59,0.08)",
              opacity:         plan.is_active ? 1 : 0.65,
            }}
          >
            <div
              className="px-5 py-4 border-b"
              style={{
                backgroundColor: plan.is_active ? "#ECFDF5" : "#F0E6D3",
                borderColor:     "rgba(6,78,59,0.06)",
              }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-serif text-lg font-semibold text-emerald-deep">{plan.name}</p>
                  <p className="text-xs font-mono text-ink-light capitalize">{plan.billing_cycle}</p>
                </div>
                <Badge variant={plan.is_active ? "active" : "draft"}>
                  {plan.is_active ? "Active" : "Inactive"}
                </Badge>
              </div>
            </div>

            <div className="px-5 py-4 border-b" style={{ borderColor: "rgba(6,78,59,0.06)" }}>
              <p className="text-xs text-ink-light mb-1">Per employee · {plan.billing_cycle}</p>
              <div className="flex items-baseline gap-1">
                <span className="font-serif text-display-sm font-semibold text-emerald-deep">
                  {plan.price_per_employee.toLocaleString()}
                </span>
                <span className="text-sm text-ink-light">RWF</span>
              </div>
              <p className="text-xs text-ink-light mt-1">
                {plan.companies} {plan.companies === 1 ? "company" : "companies"} on this plan
              </p>
            </div>

            <div className="px-5 py-4 border-b" style={{ borderColor: "rgba(6,78,59,0.06)" }}>
              <ul className="space-y-1.5">
                {PLAN_FEATURES.slice(0, 4).map(f => (
                  <li key={f} className="flex items-center gap-2 text-xs text-ink-mid">
                    <CheckCircle2 className="h-3 w-3 flex-shrink-0" style={{ color: "#059669" }} />
                    {f}
                  </li>
                ))}
              </ul>
            </div>

            <div className="px-5 py-3 flex gap-2">
              <button
                onClick={() => openEdit(plan)}
                className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-medium border transition-all hover:bg-emerald-pale"
                style={{ borderColor: "rgba(6,78,59,0.12)", color: "#065F46" }}
              >
                <Pencil className="h-3 w-3" /> Edit
              </button>
              <button
                onClick={() => toggleActive(plan.id, plan.is_active)}
                className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-medium border transition-all"
                style={{
                  borderColor:     plan.is_active ? "rgba(239,68,68,0.2)" : "rgba(5,150,105,0.2)",
                  color:           plan.is_active ? "#dc2626" : "#059669",
                  backgroundColor: plan.is_active ? "rgba(239,68,68,0.04)" : "rgba(5,150,105,0.04)",
                }}
              >
                {plan.is_active ? "Deactivate" : "Activate"}
              </button>
            </div>
          </div>
        ))}

        <button
          onClick={openCreate}
          className="rounded-2xl border-2 border-dashed p-6 flex flex-col items-center justify-center gap-2 text-ink-light hover:text-emerald-bright hover:border-emerald-bright transition-all min-h-[280px]"
          style={{ borderColor: "rgba(6,78,59,0.15)" }}
        >
          <Plus className="h-6 w-6" />
          <span className="text-sm font-medium">New plan</span>
        </button>
      </div>

      {/* ── Subscription Management Section ── */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="font-serif text-xl font-semibold text-emerald-deep">Subscription approvals</h2>
            <p className="text-sm text-ink-light mt-0.5">Review and approve company subscription payments.</p>
          </div>
          <Button variant="ghost" size="sm" onClick={loadSubscriptions} loading={subsLoading}>
            Refresh
          </Button>
        </div>

        {/* Filter tabs */}
        <div className="flex gap-2 flex-wrap mb-4">
          {([
            { key: "pending_approval", label: "Pending approval" },
            { key: "active", label: "Active" },
            { key: "cancelled", label: "Cancelled" },
            { key: "all", label: "All" },
          ]).map((f) => (
            <button
              key={f.key}
              onClick={() => setSubFilter(f.key)}
              className="px-3 py-1.5 rounded-xl text-xs font-medium border transition-all"
              style={{
                backgroundColor: subFilter === f.key ? "#064E3B" : "#FEF9EF",
                color:           subFilter === f.key ? "#FEFCE8" : "#78716C",
                borderColor:     subFilter === f.key ? "#064E3B" : "rgba(6,78,59,0.12)",
              }}
            >
              {f.label}
              {f.key === "pending_approval" && pendingCount > 0 && (
                <span className="ml-1.5 font-mono">{pendingCount}</span>
              )}
            </button>
          ))}
        </div>

        {/* Image preview modal */}
        {previewImage && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
            onClick={() => setPreviewImage(null)}
          >
            <div className="max-w-2xl max-h-[90vh] p-2">
              <img src={previewImage} alt="Payment screenshot" className="max-w-full max-h-[85vh] rounded-2xl shadow-2xl" />
              <button onClick={() => setPreviewImage(null)} className="mt-3 mx-auto block text-xs text-white/70 hover:text-white">
                Click anywhere to close
              </button>
            </div>
          </div>
        )}

        {subsLoading ? (
          <div className="space-y-3">
            {[1, 2].map((i) => (
              <div key={i} className="h-32 rounded-2xl skeleton animate-pulse" />
            ))}
          </div>
        ) : filteredSubs.length === 0 ? (
          <div className="rounded-2xl border p-12 text-center" style={{ backgroundColor: "#FEF9EF", borderColor: "rgba(6,78,59,0.08)" }}>
            <p className="text-sm text-ink-light">No subscriptions match this filter.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredSubs.map((sub) => {
              const isPending = sub.status === "pending_approval";
              const companyName = sub.company?.name ?? "Unknown company";

              return (
                <div key={sub.id} className="rounded-2xl border overflow-hidden" style={{ backgroundColor: "#FEF9EF", borderColor: "rgba(6,78,59,0.08)" }}>
                  {/* Header */}
                  <div className="px-5 py-3 border-b flex items-center justify-between gap-3 flex-wrap"
                    style={{ backgroundColor: isPending ? "#FEF3C7" : "#ECFDF5", borderColor: "rgba(6,78,59,0.06)" }}>
                    <div className="flex items-center gap-3">
                      <Building2 className="h-4 w-4 text-ink-light flex-shrink-0" />
                      <div>
                        <p className="text-sm font-semibold text-ink">{companyName}</p>
                        <p className="text-xs text-ink-light">{sub.plan?.name ?? "—"} · {sub.plan?.billing_cycle ?? "—"}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-ink-light flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {sub.created_at ? new Date(sub.created_at).toLocaleDateString() : "—"}
                      </span>
                      <Badge variant={isPending ? "pending" : sub.status === "active" ? "active" : "draft"}>
                        {sub.status.replace(/_/g, " ")}
                      </Badge>
                    </div>
                  </div>

                  {/* Body */}
                  <div className="px-5 py-3 space-y-3">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                      <div>
                        <p className="text-xs text-ink-light">Price</p>
                        <p className="font-medium text-ink">
                          {sub.plan ? `${sub.plan.price_per_employee.toLocaleString()} RWF` : "—"}
                          <span className="text-xs text-ink-light"> /emp</span>
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-ink-light">Employees</p>
                        <p className="font-medium text-ink">{sub.employee_count}</p>
                      </div>
                      <div>
                        <p className="text-xs text-ink-light">Amount paid</p>
                        <p className="font-medium text-ink">{formatAmount(sub)}</p>
                      </div>
                      <div>
                        <p className="text-xs text-ink-light">Payment</p>
                        <span className="text-xs font-medium px-2 py-0.5 rounded-full" style={{
                          backgroundColor: PAYMENT_COLORS[sub.payment_status] ?? "#FEF9EF",
                          color: sub.payment_status === "verified" ? "#065F46" : sub.payment_status === "paid" ? "#1E3A8A" : "#92400E",
                        }}>
                          {PAYMENT_LABELS[sub.payment_status] ?? sub.payment_status}
                        </span>
                      </div>
                    </div>

                    {/* Payment row */}
                    <div className="rounded-xl border px-4 py-2.5 flex items-center gap-3 flex-wrap"
                      style={{ backgroundColor: PAYMENT_COLORS[sub.payment_status] ?? "#FEF9EF", borderColor: "rgba(6,78,59,0.08)" }}>
                      <CreditCard className="h-4 w-4 text-ink-light flex-shrink-0" />
                      <span className="text-xs text-ink-light">
                        {sub.payment_currency} · {PAYMENT_LABELS[sub.payment_status] ?? sub.payment_status}
                      </span>

                      {sub.payment_screenshot_url ? (
                        <button onClick={() => setPreviewImage(sub.payment_screenshot_url)}
                          className="flex items-center gap-1.5 text-xs font-medium transition-colors hover:opacity-80"
                          style={{ color: "#064E3B" }}>
                          <ImageIcon className="h-3.5 w-3.5" />
                          View receipt
                        </button>
                      ) : (
                        <span className="text-xs text-ink-light">No receipt</span>
                      )}

                      <div className="flex-1" />

                      {/* Action buttons */}
                      {isPending && (
                        <div className="flex gap-2">
                          {sub.payment_status === "paid" && (
                            <Button variant="primary" size="sm" loading={actionLoading === sub.id}
                              leftIcon={actionLoading !== sub.id ? <ShieldCheck className="h-3.5 w-3.5" /> : undefined}
                              onClick={() => handleVerifyPayment(sub.id)}>
                              Verify payment
                            </Button>
                          )}
                          {sub.payment_status === "verified" && (
                            <Button variant="primary" size="sm" loading={actionLoading === sub.id}
                              leftIcon={actionLoading !== sub.id ? <CheckCircle2 className="h-3.5 w-3.5" /> : undefined}
                              onClick={() => handleApprove(sub.id)}>
                              Approve
                            </Button>
                          )}
                          <Button variant="ghost" size="sm" loading={actionLoading === sub.id}
                            onClick={() => handleReject(sub.id)}
                            leftIcon={actionLoading !== sub.id ? <XCircle className="h-3.5 w-3.5" /> : undefined}>
                            Reject
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Note */}
      <div className="rounded-2xl border p-5 max-w-lg" style={{ backgroundColor: "#FEF3C7", borderColor: "rgba(146,64,14,0.15)" }}>
        <p className="text-sm font-semibold" style={{ color: "#92400E" }}>Pricing note</p>
        <p className="text-xs leading-relaxed mt-1" style={{ color: "rgba(146,64,14,0.8)" }}>
          Prices are in Rwandan Francs (RWF). Companies subscribe through the dashboard, upload payment proof, and the Super Admin verifies and approves each subscription.
        </p>
      </div>

      {/* Create / Edit modal */}
      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editPlan ? "Edit plan" : "New billing plan"}
        description={editPlan ? "Update the plan name, cycle, and pricing." : "Create a new pricing plan for companies."}
        size="sm"
      >
        <div className="space-y-4">
          <Input label="Plan name" placeholder="e.g. Monthly Standard" required value={formName} onChange={e => setFormName(e.target.value)} />
          <div>
            <p className="text-sm font-medium text-ink-mid mb-2">Billing cycle</p>
            <div className="grid grid-cols-2 gap-2">
              {(["monthly","annual"] as const).map(c => (
                <button key={c} onClick={() => setFormCycle(c)}
                  className="py-2.5 rounded-xl text-sm font-medium capitalize border transition-all"
                  style={{
                    backgroundColor: formCycle === c ? "#064E3B" : "#FEFCE8",
                    color: formCycle === c ? "#FEFCE8" : "#78716C",
                    borderColor: formCycle === c ? "#064E3B" : "rgba(6,78,59,0.12)",
                  }}>
                  {c}
                </button>
              ))}
            </div>
          </div>
          <Input label="Price per employee (RWF)" placeholder="e.g. 5000" type="number" min="0" required
            value={formPrice} onChange={e => setFormPrice(e.target.value)}
            hint={formPrice ? `= ${Number(formPrice).toLocaleString()} RWF per employee per ${formCycle === "monthly" ? "month" : "year"}` : ""} />
          <div className="flex gap-3 pt-2">
            <Button variant="secondary" size="md" className="flex-1" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button variant="primary" size="md" className="flex-1" loading={saving} onClick={save}>
              {editPlan ? "Save changes" : "Create plan"}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}