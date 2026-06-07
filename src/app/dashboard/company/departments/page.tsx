"use client";

import { useState } from "react";
import { PageHeader, SectionCard } from "@/components/dashboard/DashboardShared";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Modal } from "@/components/ui/Modal";
import { Plus, Pencil, Trash2, Users } from "lucide-react";

interface Department {
  id:       string;
  name:     string;
  members:  string[];
  color:    string;
}

const DEPT_COLORS = ["#064E3B","#1e3a5f","#7c2d12","#3d6b4f","#1a1a2e","#374151"];

const INITIAL_DEPTS: Department[] = [
  { id:"1", name:"Creative",    members:["Amara Uwimana","James Karekezi"],               color:"#064E3B" },
  { id:"2", name:"Engineering", members:["Eric Hakizimana","Claude Nkurikiye"],           color:"#1e3a5f" },
  { id:"3", name:"Sales",       members:["Grace Uwase","Patrick Nzeyimana"],              color:"#7c2d12" },
  { id:"4", name:"Marketing",   members:["Diane Mukamana"],                               color:"#3d6b4f" },
  { id:"5", name:"Events",      members:["Sandrine Iradukunda"],                          color:"#1a1a2e" },
];

const ALL_EMPLOYEES = [
  "Amara Uwimana","Eric Hakizimana","Grace Uwase","James Karekezi",
  "Diane Mukamana","Patrick Nzeyimana","Sandrine Iradukunda","Claude Nkurikiye",
];

export default function DepartmentsPage() {
  const [depts,     setDepts]     = useState<Department[]>(INITIAL_DEPTS);
  const [modalOpen, setModalOpen] = useState(false);
  const [editDept,  setEditDept]  = useState<Department | null>(null);
  const [formName,  setFormName]  = useState("");
  const [formColor, setFormColor] = useState(DEPT_COLORS[0]);
  const [formMembers,setFormMembers] = useState<string[]>([]);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  function openCreate() {
    setEditDept(null);
    setFormName("");
    setFormColor(DEPT_COLORS[0]);
    setFormMembers([]);
    setModalOpen(true);
  }

  function openEdit(dept: Department) {
    setEditDept(dept);
    setFormName(dept.name);
    setFormColor(dept.color);
    setFormMembers([...dept.members]);
    setModalOpen(true);
  }

  function save() {
    if (!formName.trim()) return;
    if (editDept) {
      setDepts(ds => ds.map(d => d.id === editDept.id
        ? { ...d, name: formName, color: formColor, members: formMembers }
        : d
      ));
    } else {
      setDepts(ds => [...ds, {
        id:      String(Date.now()),
        name:    formName,
        color:   formColor,
        members: formMembers,
      }]);
    }
    setModalOpen(false);
  }

  function deleteDept(id: string) {
    setDepts(ds => ds.filter(d => d.id !== id));
    setDeleteConfirm(null);
  }

  function toggleMember(name: string) {
    setFormMembers(ms =>
      ms.includes(name) ? ms.filter(m => m !== name) : [...ms, name]
    );
  }

  return (
    <div>
      <PageHeader
        eyebrow="Departments"
        title="Team structure"
        subtitle="Organise employees into departments for better card management."
        action={
          <Button variant="primary" size="sm" leftIcon={<Plus className="h-3.5 w-3.5" />} onClick={openCreate}>
            Add department
          </Button>
        }
      />

      {/* Dept grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        {depts.map(dept => (
          <div
            key={dept.id}
            className="rounded-2xl border overflow-hidden transition-all hover:shadow-card-lg hover:-translate-y-0.5"
            style={{ borderColor: "rgba(6,78,59,0.08)" }}
          >
            {/* Color bar */}
            <div className="h-2" style={{ backgroundColor: dept.color }} />

            <div className="p-5" style={{ backgroundColor: "#FEF9EF" }}>
              <div className="flex items-start justify-between gap-2 mb-4">
                <div>
                  <h3 className="font-serif text-lg font-semibold text-emerald-deep">{dept.name}</h3>
                  <p className="text-xs text-ink-light mt-0.5 flex items-center gap-1">
                    <Users className="h-3 w-3" />
                    {dept.members.length} member{dept.members.length !== 1 ? "s" : ""}
                  </p>
                </div>
                <div className="flex gap-1">
                  <button
                    onClick={() => openEdit(dept)}
                    className="p-1.5 rounded-lg text-ink-light hover:text-emerald-deep hover:bg-emerald-pale transition-all"
                  >
                    <Pencil className="h-3.5 w-3.5" />
                  </button>
                  <button
                    onClick={() => setDeleteConfirm(dept.id)}
                    className="p-1.5 rounded-lg text-ink-light hover:text-red-600 hover:bg-red-50 transition-all"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>

              {/* Member avatars */}
              {dept.members.length > 0 ? (
                <div className="flex flex-wrap gap-1.5">
                  {dept.members.map(m => (
                    <div
                      key={m}
                      className="flex items-center gap-1.5 px-2 py-1 rounded-lg text-xs"
                      style={{ backgroundColor: "#ECFDF5", color: "#065F46" }}
                    >
                      <div
                        className="w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-semibold"
                        style={{ backgroundColor: dept.color, color: "#FEFCE8" }}
                      >
                        {m.split(" ").map(n => n[0]).join("")}
                      </div>
                      <span className="truncate max-w-[80px]">{m.split(" ")[0]}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-ink-light italic">No members yet</p>
              )}
            </div>
          </div>
        ))}

        {/* Add dept card */}
        <button
          onClick={openCreate}
          className="rounded-2xl border-2 border-dashed p-5 flex flex-col items-center justify-center gap-2 text-ink-light hover:text-emerald-bright hover:border-emerald-bright transition-all min-h-[140px]"
          style={{ borderColor: "rgba(6,78,59,0.15)" }}
        >
          <Plus className="h-6 w-6" />
          <span className="text-sm font-medium">New department</span>
        </button>
      </div>

      {/* Unassigned employees */}
      <SectionCard title="Unassigned employees" subtitle="Not yet in any department.">
        {(() => {
          const assigned = new Set(depts.flatMap(d => d.members));
          const unassigned = ALL_EMPLOYEES.filter(e => !assigned.has(e));
          return unassigned.length === 0 ? (
            <p className="text-sm text-ink-light text-center py-4">All employees are assigned to departments.</p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {unassigned.map(name => (
                <div
                  key={name}
                  className="flex items-center gap-2 px-3 py-2 rounded-xl border text-sm"
                  style={{ backgroundColor: "#FEFCE8", borderColor: "rgba(6,78,59,0.1)", color: "#44403C" }}
                >
                  <div
                    className="w-6 h-6 rounded-lg flex items-center justify-center text-[10px] font-semibold"
                    style={{ backgroundColor: "#F0E6D3", color: "#78716C" }}
                  >
                    {name.split(" ").map(n => n[0]).join("")}
                  </div>
                  {name}
                </div>
              ))}
            </div>
          );
        })()}
      </SectionCard>

      {/* Create / Edit modal */}
      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editDept ? "Edit department" : "New department"}
        description={editDept ? "Update the department name, colour, and members." : "Create a new department and assign employees."}
        size="md"
      >
        <div className="space-y-4">
          <Input
            label="Department name"
            placeholder="e.g. Engineering"
            required
            value={formName}
            onChange={e => setFormName(e.target.value)}
          />

          {/* Color picker */}
          <div>
            <p className="text-sm font-medium text-ink-mid mb-2">Colour</p>
            <div className="flex gap-2 flex-wrap">
              {DEPT_COLORS.map(c => (
                <button
                  key={c}
                  onClick={() => setFormColor(c)}
                  className="w-8 h-8 rounded-lg border-2 transition-all hover:scale-110"
                  style={{
                    backgroundColor: c,
                    borderColor: formColor === c ? "#059669" : "transparent",
                    boxShadow: formColor === c ? "0 0 0 2px rgba(5,150,105,0.3)" : "none",
                  }}
                />
              ))}
            </div>
          </div>

          {/* Members */}
          <div>
            <p className="text-sm font-medium text-ink-mid mb-2">Members</p>
            <div className="flex flex-wrap gap-2">
              {ALL_EMPLOYEES.map(name => {
                const selected = formMembers.includes(name);
                return (
                  <button
                    key={name}
                    onClick={() => toggleMember(name)}
                    className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs border transition-all"
                    style={{
                      backgroundColor: selected ? "#ECFDF5" : "#FEFCE8",
                      borderColor:     selected ? "rgba(5,150,105,0.3)" : "rgba(6,78,59,0.1)",
                      color:           selected ? "#065F46" : "#78716C",
                    }}
                  >
                    <div
                      className="w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-semibold"
                      style={{ backgroundColor: selected ? formColor : "#F0E6D3", color: selected ? "#FEFCE8" : "#78716C" }}
                    >
                      {name.split(" ").map(n => n[0]).join("")}
                    </div>
                    {name.split(" ")[0]}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <Button variant="secondary" size="md" className="flex-1" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="md" className="flex-1" onClick={save}>
              {editDept ? "Save changes" : "Create department"}
            </Button>
          </div>
        </div>
      </Modal>

      {/* Delete confirm modal */}
      <Modal
        open={!!deleteConfirm}
        onClose={() => setDeleteConfirm(null)}
        title="Delete department?"
        description="This will not delete the employees — they'll become unassigned."
        size="sm"
      >
        <div className="flex gap-3">
          <Button variant="secondary" size="md" className="flex-1" onClick={() => setDeleteConfirm(null)}>Cancel</Button>
          <Button variant="danger"    size="md" className="flex-1" onClick={() => deleteConfirm && deleteDept(deleteConfirm)}>Delete</Button>
        </div>
      </Modal>
    </div>
  );
}