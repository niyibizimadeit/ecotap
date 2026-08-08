"use client";

import { useState, useEffect } from "react";
import { PageHeader } from "@/components/dashboard/DashboardShared";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { Input } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import { Plus, Pencil, Eye, EyeOff } from "lucide-react";

interface Design {
  id:      string;
  name:    string;
  color:   string;
  pattern: string;
  active:  boolean;
  orders:  number;
}

const INITIAL_DESIGNS: Design[] = [];

const PRESET_COLORS = ["#064E3B","#1a1a2e","#1e3a5f","#7c2d12","#3d6b4f","#0f0f0f","#6b21a8","#b45309","#0f766e","#374151"];

export default function DesignsPage() {
  const [designs,    setDesigns]    = useState<Design[]>([]);
  const [isReadOnly, setIsReadOnly] = useState(false);

  useEffect(() => {
    async function init() {
      const { getCurrentUser } = await import("@/app/actions/auth.actions");
      const user = await getCurrentUser();
      setIsReadOnly(user?.role !== "super_admin");
    }
    init();
  }, []);

  useEffect(() => {
    async function load() {
      const { fetchDesigns } = await import("@/app/actions/admin.actions");
      const result = await fetchDesigns();
      if (result.success && result.data) {
        setDesigns((result.data as any[]).map((d: any) => ({
          id: d.id, name: d.name, color: d.accent_color ?? "#064E3B",
          pattern: d.pattern ?? "solid", active: d.is_active ?? true, orders: 0,
        })));
      }
    }
    load();
  }, []);
  const [modalOpen,  setModalOpen]  = useState(false);
  const [editDesign, setEditDesign] = useState<Design | null>(null);
  const [formName,   setFormName]   = useState("");
  const [formColor,  setFormColor]  = useState(PRESET_COLORS[0]);

  function openCreate() {
    setEditDesign(null);
    setFormName("");
    setFormColor(PRESET_COLORS[0]);
    setModalOpen(true);
  }

  function openEdit(d: Design) {
    setEditDesign(d);
    setFormName(d.name);
    setFormColor(d.color);
    setModalOpen(true);
  }

  async function save() {
    if (!formName.trim()) return;
    const { createDesign, updateDesign } = await import("@/app/actions/admin.actions");
    const fd = new FormData();
    fd.set("name", formName);
    fd.set("accent_color", formColor);

    if (editDesign) {
      // Preserve existing pattern and active state when editing
      fd.set("pattern", editDesign.pattern);
      fd.set("is_active", String(editDesign.active));
      const result = await updateDesign(editDesign.id, Object.fromEntries(fd) as Record<string, unknown>);
      if (!result.success) return; // don't close modal on failure
    } else {
      fd.set("pattern", "dots");
      fd.set("is_active", "on");
      const result = await createDesign(fd);
      if (!result.success) return;
    }
    setModalOpen(false);
    // Reload
    const { fetchDesigns } = await import("@/app/actions/admin.actions");
    const result = await fetchDesigns();
    if (result.success && result.data) {
      setDesigns((result.data as any[]).map((d: any) => ({
        id: d.id, name: d.name, color: d.accent_color ?? "#064E3B",
        pattern: d.pattern ?? "solid", active: d.is_active ?? true, orders: 0,
      })));
    }
  }

  async function toggleActive(id: string) {
    const d = designs.find(d => d.id === id);
    if (!d) return;
    const { updateDesign } = await import("@/app/actions/admin.actions");
    const result = await updateDesign(id, { is_active: !d.active });
    if (result.success) {
      setDesigns(ds => ds.map(d => d.id === id ? { ...d, active: !d.active } : d));
    }
  }

  const activeCount   = designs.filter(d => d.active).length;
  const inactiveCount = designs.filter(d => !d.active).length;

  return (
    <div>
      <PageHeader
        eyebrow="Designs"
        title="Card designs"
        subtitle={`${activeCount} active · ${inactiveCount} inactive`}
        action={
          !isReadOnly ? (
          <Button variant="primary" size="sm" leftIcon={<Plus className="h-3.5 w-3.5" />} onClick={openCreate}>
            Add design
          </Button>
          ) : undefined
        }
      />

      {/* Active designs */}
      <div className="mb-2">
        <p className="text-xs font-mono tracking-widest text-ink-light uppercase mb-3">Active — visible to users</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          {designs.filter(d => d.active).map(d => (
            <DesignCard key={d.id} design={d} onEdit={() => openEdit(d)} onToggle={() => toggleActive(d.id)} readOnly={isReadOnly} />
          ))}
          {!isReadOnly && (
          <button
            onClick={openCreate}
            className="rounded-2xl border-2 border-dashed p-6 flex flex-col items-center justify-center gap-2 text-ink-light hover:text-emerald-bright hover:border-emerald-bright transition-all min-h-[160px]"
            style={{ borderColor: "rgba(6,78,59,0.15)" }}
          >
            <Plus className="h-6 w-6" />
            <span className="text-sm font-medium">New design</span>
          </button>
          )}
        </div>
      </div>

      {/* Inactive designs */}
      {inactiveCount > 0 && (
        <div>
          <p className="text-xs font-mono tracking-widest text-ink-light uppercase mb-3">Inactive — hidden from users</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {designs.filter(d => !d.active).map(d => (
              <DesignCard key={d.id} design={d} onEdit={() => openEdit(d)} onToggle={() => toggleActive(d.id)} readOnly={isReadOnly} />
            ))}
          </div>
        </div>
      )}

      {/* Modal */}
      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editDesign ? "Edit design" : "New card design"}
        description={editDesign ? "Update the design name and colour." : "Create a new design option for users to choose from."}
        size="sm"
      >
        <div className="space-y-4">
          <Input
            label="Design name"
            placeholder="e.g. Classic Emerald"
            required
            value={formName}
            onChange={e => setFormName(e.target.value)}
          />

          <div>
            <p className="text-sm font-medium text-ink-mid mb-2">Accent colour</p>
            <div className="flex flex-wrap gap-2 mb-3">
              {PRESET_COLORS.map(c => (
                <button
                  key={c}
                  onClick={() => setFormColor(c)}
                  className="w-8 h-8 rounded-lg border-2 transition-all hover:scale-110"
                  style={{
                    backgroundColor: c,
                    borderColor: formColor === c ? "#059669" : "transparent",
                    boxShadow:   formColor === c ? "0 0 0 2px rgba(5,150,105,0.3)" : "none",
                  }}
                />
              ))}
            </div>
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={formColor}
                onChange={e => setFormColor(e.target.value)}
                className="w-10 h-10 rounded-xl border border-cream-dark cursor-pointer p-0.5"
              />
              <span className="text-xs font-mono text-ink-light">{formColor}</span>
              {/* Preview swatch */}
              <div className="flex-1 h-10 rounded-xl" style={{ backgroundColor: formColor }} />
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <Button variant="secondary" size="md" className="flex-1" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="md" className="flex-1" onClick={save}>
              {editDesign ? "Save changes" : "Create design"}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

function DesignCard({ design, onEdit, onToggle, readOnly }: { design: Design; onEdit: () => void; onToggle: () => void; readOnly?: boolean }) {
  return (
    <div
      className="rounded-2xl border overflow-hidden transition-all hover:shadow-card-lg"
      style={{
        borderColor:     "rgba(6,78,59,0.08)",
        backgroundColor: "#FEF9EF",
        opacity: design.active ? 1 : 0.65,
      }}
    >
      {/* Design preview */}
      <div className="relative h-24 overflow-hidden" style={{ backgroundColor: design.color }}>
        <div
          className="absolute inset-0 opacity-[0.08]"
          style={{
            backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)",
            backgroundSize: "16px 16px",
          }}
        />
        {/* NFC ripple */}
        <div className="absolute top-3 right-3 flex items-center justify-center">
          <div className="w-8 h-8 rounded-full border border-white/25 flex items-center justify-center">
            <div className="w-4 h-4 rounded-full border border-white/35 flex items-center justify-center">
              <div className="w-1.5 h-1.5 rounded-full bg-white/40" />
            </div>
          </div>
        </div>
        {/* Status badge overlay */}
        <div className="absolute top-3 left-3">
          <Badge variant={design.active ? "active" : "draft"} dot={false}>
            {design.active ? "Active" : "Inactive"}
          </Badge>
        </div>
      </div>

      {/* Info */}
      <div className="p-4">
        <div className="flex items-start justify-between gap-2 mb-3">
          <div>
            <p className="font-semibold text-emerald-deep text-sm">{design.name}</p>
            <p className="text-xs text-ink-light mt-0.5">{design.orders} orders placed</p>
          </div>
          <div className="w-5 h-5 rounded-lg flex-shrink-0" style={{ backgroundColor: design.color }} />
        </div>

        {!readOnly && (
        <div className="flex gap-2">
          <button
            onClick={onEdit}
            className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-medium border transition-all hover:bg-emerald-pale"
            style={{ borderColor: "rgba(6,78,59,0.12)", color: "#065F46" }}
          >
            <Pencil className="h-3 w-3" /> Edit
          </button>
          <button
            onClick={onToggle}
            className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-medium border transition-all"
            style={{
              borderColor:     design.active ? "rgba(239,68,68,0.2)" : "rgba(5,150,105,0.2)",
              color:           design.active ? "#dc2626" : "#059669",
              backgroundColor: design.active ? "rgba(239,68,68,0.04)" : "rgba(5,150,105,0.04)",
            }}
          >
            {design.active
              ? <><EyeOff className="h-3 w-3" /> Deactivate</>
              : <><Eye    className="h-3 w-3" /> Activate</>
            }
          </button>
        </div>
        )}
      </div>
    </div>
  );
}