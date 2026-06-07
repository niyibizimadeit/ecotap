"use client";

import { useState } from "react";
import { PageHeader, SectionCard } from "@/components/dashboard/DashboardShared";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Search, ExternalLink, MoreHorizontal, UserPlus } from "lucide-react";
import type { UserStatus } from "@/types";

interface Employee {
  id:     string;
  name:   string;
  title:  string;
  dept:   string;
  email:  string;
  status: UserStatus;
  slug:   string;
  joined: string;
}

const MOCK_EMPLOYEES: Employee[] = [
  { id:"1", name:"Amara Uwimana",      title:"Creative Director", dept:"Creative",    email:"amara@rdmc.rw",    status:"active",    slug:"amara-uwimana",      joined:"Jan 2026" },
  { id:"2", name:"Eric Hakizimana",    title:"Dev Lead",          dept:"Engineering", email:"eric@rdmc.rw",     status:"active",    slug:"eric-hakizimana",    joined:"Jan 2026" },
  { id:"3", name:"Grace Uwase",        title:"Account Manager",   dept:"Sales",       email:"grace@rdmc.rw",    status:"active",    slug:"grace-uwase",        joined:"Feb 2026" },
  { id:"4", name:"James Karekezi",     title:"Designer",          dept:"Creative",    email:"james@rdmc.rw",    status:"pending",   slug:"james-karekezi",     joined:"Jun 2026" },
  { id:"5", name:"Diane Mukamana",     title:"Marketing Lead",    dept:"Marketing",   email:"diane@rdmc.rw",    status:"active",    slug:"diane-mukamana",     joined:"Mar 2026" },
  { id:"6", name:"Patrick Nzeyimana", title:"Sales Executive",   dept:"Sales",       email:"patrick@rdmc.rw",  status:"active",    slug:"patrick-nzeyimana",  joined:"Mar 2026" },
  { id:"7", name:"Sandrine Iradukunda",title:"Events Manager",    dept:"Events",      email:"sandrine@rdmc.rw", status:"active",    slug:"sandrine-iradukunda",joined:"Apr 2026" },
  { id:"8", name:"Claude Nkurikiye",   title:"Engineer",          dept:"Engineering", email:"claude@rdmc.rw",   status:"suspended", slug:"claude-nkurikiye",   joined:"Feb 2026" },
];

const DEPTS = ["All", "Creative", "Engineering", "Sales", "Marketing", "Events"];

export default function EmployeesPage() {
  const [search,     setSearch]     = useState("");
  const [deptFilter, setDeptFilter] = useState("All");
  const [statusFilter,setStatusFilter] = useState<"all"|UserStatus>("all");
  const [menuOpen,   setMenuOpen]   = useState<string | null>(null);

  const filtered = MOCK_EMPLOYEES.filter(e => {
    const matchSearch = e.name.toLowerCase().includes(search.toLowerCase()) ||
                        e.email.toLowerCase().includes(search.toLowerCase()) ||
                        e.title.toLowerCase().includes(search.toLowerCase());
    const matchDept   = deptFilter === "All" || e.dept === deptFilter;
    const matchStatus = statusFilter === "all" || e.status === statusFilter;
    return matchSearch && matchDept && matchStatus;
  });

  return (
    <div>
      <PageHeader
        eyebrow="Employees"
        title="Team members"
        subtitle={`${MOCK_EMPLOYEES.length} employees · ${MOCK_EMPLOYEES.filter(e=>e.status==="active").length} active`}
        action={
          <Button variant="primary" size="sm" leftIcon={<UserPlus className="h-3.5 w-3.5" />}>
            Invite employee
          </Button>
        }
      />

      <SectionCard>
        {/* Filters row */}
        <div className="flex flex-col sm:flex-row gap-3 mb-5">
          <div className="flex-1">
            <Input
              placeholder="Search by name, email or title…"
              value={search}
              onChange={e => setSearch(e.target.value)}
              leftElement={<Search className="h-4 w-4" />}
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            {/* Status filter */}
            {(["all","active","pending","suspended"] as const).map(s => (
              <button
                key={s}
                onClick={() => setStatusFilter(s)}
                className="px-3 py-1.5 rounded-xl text-xs font-medium capitalize border transition-all"
                style={{
                  backgroundColor: statusFilter === s ? "#064E3B" : "#FEFCE8",
                  color:           statusFilter === s ? "#FEFCE8" : "#78716C",
                  borderColor:     statusFilter === s ? "#064E3B" : "rgba(6,78,59,0.12)",
                }}
              >
                {s === "all" ? "All status" : s}
              </button>
            ))}
          </div>
        </div>

        {/* Dept tabs */}
        <div className="flex gap-1.5 flex-wrap mb-5">
          {DEPTS.map(d => (
            <button
              key={d}
              onClick={() => setDeptFilter(d)}
              className="px-3 py-1 rounded-lg text-xs font-mono tracking-wide transition-all border"
              style={{
                backgroundColor: deptFilter === d ? "#ECFDF5" : "transparent",
                color:           deptFilter === d ? "#065F46" : "#78716C",
                borderColor:     deptFilter === d ? "rgba(5,150,105,0.3)" : "transparent",
              }}
            >
              {d}
            </button>
          ))}
        </div>

        {/* Table header */}
        <div
          className="grid grid-cols-12 gap-3 px-4 py-2 rounded-xl mb-2 text-xs font-mono tracking-wide text-ink-light uppercase"
          style={{ backgroundColor: "#F0E6D3" }}
        >
          <div className="col-span-5">Employee</div>
          <div className="col-span-2 hidden md:block">Department</div>
          <div className="col-span-2 hidden sm:block">Status</div>
          <div className="col-span-2 hidden lg:block">Joined</div>
          <div className="col-span-1"></div>
        </div>

        {/* Rows */}
        <div className="space-y-1.5">
          {filtered.length === 0 ? (
            <div className="text-center py-12 text-ink-light text-sm">
              No employees match your search.
            </div>
          ) : filtered.map(emp => (
            <div
              key={emp.id}
              className="grid grid-cols-12 gap-3 px-4 py-3.5 rounded-xl border items-center transition-all hover:shadow-card group relative"
              style={{ backgroundColor: "#FEFCE8", borderColor: "rgba(6,78,59,0.06)" }}
            >
              {/* Name */}
              <div className="col-span-5 flex items-center gap-3 min-w-0">
                <div
                  className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 font-medium text-xs"
                  style={{ backgroundColor: "#ECFDF5", color: "#065F46" }}
                >
                  {emp.name.split(" ").map(n => n[0]).join("")}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-ink truncate">{emp.name}</p>
                  <p className="text-xs text-ink-light truncate">{emp.title}</p>
                </div>
              </div>

              {/* Dept */}
              <div className="col-span-2 hidden md:block">
                <span
                  className="text-xs px-2 py-1 rounded-lg font-mono"
                  style={{ backgroundColor: "#F0E6D3", color: "#78716C" }}
                >
                  {emp.dept}
                </span>
              </div>

              {/* Status */}
              <div className="col-span-2 hidden sm:block">
                <Badge variant={emp.status}>{emp.status}</Badge>
              </div>

              {/* Joined */}
              <div className="col-span-2 hidden lg:block text-xs text-ink-light">{emp.joined}</div>

              {/* Actions */}
              <div className="col-span-7 sm:col-span-3 md:col-span-1 flex justify-end items-center gap-1">
                <a
                  href={`/rdmc/${emp.slug}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-1.5 rounded-lg text-ink-light hover:text-emerald-bright hover:bg-emerald-pale transition-all opacity-0 group-hover:opacity-100"
                  title="View card"
                >
                  <ExternalLink className="h-3.5 w-3.5" />
                </a>
                <div className="relative">
                  <button
                    onClick={() => setMenuOpen(menuOpen === emp.id ? null : emp.id)}
                    className="p-1.5 rounded-lg text-ink-light hover:text-emerald-deep hover:bg-emerald-pale transition-all opacity-0 group-hover:opacity-100"
                  >
                    <MoreHorizontal className="h-3.5 w-3.5" />
                  </button>
                  {menuOpen === emp.id && (
                    <div
                      className="absolute right-0 top-8 z-10 w-36 rounded-xl border shadow-card-lg py-1"
                      style={{ backgroundColor: "#FEF9EF", borderColor: "rgba(6,78,59,0.1)" }}
                    >
                      {[
                        { label: "View card", action: () => window.open(`/rdmc/${emp.slug}`, "_blank") },
                        { label: "Edit profile", action: () => {} },
                        { label: emp.status === "suspended" ? "Activate" : "Suspend", action: () => {}, danger: emp.status !== "suspended" },
                      ].map(item => (
                        <button
                          key={item.label}
                          onClick={() => { item.action(); setMenuOpen(null); }}
                          className="w-full text-left px-3 py-2 text-xs transition-colors hover:bg-emerald-pale"
                          style={{ color: item.danger ? "#dc2626" : "#44403C" }}
                        >
                          {item.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        <p className="text-xs text-ink-light text-center mt-5 font-mono">
          {filtered.length} of {MOCK_EMPLOYEES.length} employees shown
        </p>
      </SectionCard>
    </div>
  );
}