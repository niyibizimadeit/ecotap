"use client";

import { useState, useEffect } from "react";
import { PageHeader } from "@/components/dashboard/DashboardShared";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { Input } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import { Plus, Pencil, CheckCircle2 } from "lucide-react";
import type { BillingCycle } from "@/types";

interface Plan {
  id:                 string;
  name:               string;
  billing_cycle:      BillingCycle;
  price_per_employee: number;
  is_active:          boolean;
  companies:          number;
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

export default function BillingPage() {
  const [plans,      setPlans]      = useState(INITIAL_PLANS);
  const [modalOpen,  setModalOpen]  = useState(false);
  const [editPlan,   setEditPlan]   = useState<Plan | null>(null);
  const [formName,   setFormName]   = useState("");
  const [formCycle,  setFormCycle]  = useState<BillingCycle>("monthly");
  const [formPrice,  setFormPrice]  = useState("");
  const [saving,     setSaving]     = useState(false);

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
  }, []);

  async function save() {
    if (!formName.trim() || !formPrice) return;
    setSaving(true);
    const { upsertPlan } = await import("@/app/actions/admin.actions");
    const fd = new FormData();
    fd.set("name", formName);
    fd.set("billing_cycle", formCycle);
    fd.set("price_per_employee", String(formPrice));
    fd.set("is_active", "on");
    await upsertPlan(fd);
    if (editPlan) {
      setPlans(ps => ps.map(p => p.id === editPlan.id
        ? { ...p, name: formName, billing_cycle: formCycle, price_per_employee: Number(formPrice) }
        : p
      ));
    } else {
      setPlans(ps => [...ps, {
        id:                 String(Date.now()),
        name:               formName,
        billing_cycle:      formCycle,
        price_per_employee: Number(formPrice),
        is_active:          true,
        companies:          0,
      }]);
    }
    setSaving(false);
    setModalOpen(false);
  }

  function toggleActive(id: string) {
    setPlans(ps => ps.map(p => p.id === id ? { ...p, is_active: !p.is_active } : p));
  }

  return (
    <div>
      <PageHeader
        eyebrow="Billing"
        title="Billing plans"
        subtitle="Manage pricing plans available to companies."
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
            {/* Header */}
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

            {/* Price */}
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

            {/* Features */}
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

            {/* Actions */}
            <div className="px-5 py-3 flex gap-2">
              <button
                onClick={() => openEdit(plan)}
                className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-medium border transition-all hover:bg-emerald-pale"
                style={{ borderColor: "rgba(6,78,59,0.12)", color: "#065F46" }}
              >
                <Pencil className="h-3 w-3" /> Edit
              </button>
              <button
                onClick={() => toggleActive(plan.id)}
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

        {/* Add plan card */}
        <button
          onClick={openCreate}
          className="rounded-2xl border-2 border-dashed p-6 flex flex-col items-center justify-center gap-2 text-ink-light hover:text-emerald-bright hover:border-emerald-bright transition-all min-h-[280px]"
          style={{ borderColor: "rgba(6,78,59,0.15)" }}
        >
          <Plus className="h-6 w-6" />
          <span className="text-sm font-medium">New plan</span>
        </button>
      </div>

      {/* Note */}
      <div
        className="rounded-2xl border p-5 max-w-lg"
        style={{ backgroundColor: "#FEF3C7", borderColor: "rgba(146,64,14,0.15)" }}
      >
        <p className="text-sm font-semibold" style={{ color: "#92400E" }}>Pricing note</p>
        <p className="text-xs leading-relaxed mt-1" style={{ color: "rgba(146,64,14,0.8)" }}>
          Prices are in Rwandan Francs (RWF). Billing is managed manually — the Super Admin confirms pricing with each company during onboarding. Automated payment integration can be added in a future phase.
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
          <Input
            label="Plan name"
            placeholder="e.g. Monthly Standard"
            required
            value={formName}
            onChange={e => setFormName(e.target.value)}
          />

          <div>
            <p className="text-sm font-medium text-ink-mid mb-2">Billing cycle</p>
            <div className="grid grid-cols-2 gap-2">
              {(["monthly","annual"] as const).map(c => (
                <button
                  key={c}
                  onClick={() => setFormCycle(c)}
                  className="py-2.5 rounded-xl text-sm font-medium capitalize border transition-all"
                  style={{
                    backgroundColor: formCycle === c ? "#064E3B" : "#FEFCE8",
                    color:           formCycle === c ? "#FEFCE8" : "#78716C",
                    borderColor:     formCycle === c ? "#064E3B" : "rgba(6,78,59,0.12)",
                  }}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

          <Input
            label="Price per employee (RWF)"
            placeholder="e.g. 5000"
            type="number"
            min="0"
            required
            value={formPrice}
            onChange={e => setFormPrice(e.target.value)}
            hint={formPrice ? `= ${Number(formPrice).toLocaleString()} RWF per employee per ${formCycle === "monthly" ? "month" : "year"}` : ""}
          />

          <div className="flex gap-3 pt-2">
            <Button variant="secondary" size="md" className="flex-1" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="md" className="flex-1" loading={saving} onClick={save}>
              {editPlan ? "Save changes" : "Create plan"}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}