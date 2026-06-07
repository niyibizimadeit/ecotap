"use client";

import { useState } from "react";
import { PageHeader } from "@/components/dashboard/DashboardShared";
import { Input } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import { Search, ExternalLink } from "lucide-react";
import type { UserRole, UserStatus } from "@/types";

interface AdminUser {
  id:      string;
  name:    string;
  email:   string;
  role:    UserRole;
  status:  UserStatus;
  company: string | null;
  joined:  string;
  slug:    string;
}

const MOCK_USERS: AdminUser[] = [
  { id:"1",  name:"Prince Niyibizi",      email:"prince@azsoftsolutions.com", role:"individual",    status:"active",    company:null,            joined:"Jan 2026", slug:"prince-niyibizi"       },
  { id:"2",  name:"Amara Uwimana",         email:"amara@rdmc.rw",              role:"company_admin", status:"active",    company:"RDMC Ltd",       joined:"Jan 2026", slug:"amara-uwimana"         },
  { id:"3",  name:"Eric Hakizimana",       email:"eric@rdmc.rw",               role:"employee",      status:"active",    company:"RDMC Ltd",       joined:"Jan 2026", slug:"eric-hakizimana"       },
  { id:"4",  name:"Grace Uwase",           email:"grace@rdmc.rw",              role:"employee",      status:"active",    company:"RDMC Ltd",       joined:"Feb 2026", slug:"grace-uwase"           },
  { id:"5",  name:"James Karekezi",        email:"james@rdmc.rw",              role:"employee",      status:"pending",   company:"RDMC Ltd",       joined:"Jun 2026", slug:"james-karekezi"        },
  { id:"6",  name:"Jean-Paul Habimana",    email:"jp@freelance.rw",            role:"individual",    status:"pending",   company:null,             joined:"Jun 2026", slug:"jeanpaul-h"            },
  { id:"7",  name:"Vestine Murekatete",    email:"vestine@gmail.com",          role:"individual",    status:"pending",   company:null,             joined:"Jun 2026", slug:"vestine-m"             },
  { id:"8",  name:"Claude Nkurikiye",      email:"claude@rdmc.rw",             role:"employee",      status:"suspended", company:"RDMC Ltd",       joined:"Feb 2026", slug:"claude-nkurikiye"      },
  { id:"9",  name:"Diane Mukamana",        email:"diane@rdmc.rw",              role:"employee",      status:"active",    company:"RDMC Ltd",       joined:"Mar 2026", slug:"diane-mukamana"        },
  { id:"10", name:"Sandrine Iradukunda",   email:"sandrine@rdmc.rw",           role:"employee",      status:"active",    company:"RDMC Ltd",       joined:"Apr 2026", slug:"sandrine-iradukunda"   },
  { id:"11", name:"David Mugisha",         email:"david@kigalitechhub.rw",     role:"company_admin", status:"pending",   company:"Kigali Tech Hub",joined:"Jun 2026", slug:"david-mugisha"         },
  { id:"12", name:"Marie Uwera",           email:"marie@inyange.rw",           role:"company_admin", status:"pending",   company:"Inyange Industries",joined:"Jun 2026",slug:"marie-uwera"          },
];

const ROLE_LABELS: Record<UserRole, string> = {
  super_admin:   "Super Admin",
  company_admin: "Company Admin",
  employee:      "Employee",
  individual:    "Individual",
};

export default function UsersPage() {
  const [search,       setSearch]       = useState("");
  const [roleFilter,   setRoleFilter]   = useState<UserRole|"all">("all");
  const [statusFilter, setStatusFilter] = useState<UserStatus|"all">("all");

  const filtered = MOCK_USERS.filter(u => {
    const q = search.toLowerCase();
    const matchSearch = u.name.toLowerCase().includes(q) ||
                        u.email.toLowerCase().includes(q) ||
                        (u.company?.toLowerCase().includes(q) ?? false);
    const matchRole   = roleFilter === "all"   || u.role   === roleFilter;
    const matchStatus = statusFilter === "all" || u.status === statusFilter;
    return matchSearch && matchRole && matchStatus;
  });

  const counts = {
    all:       MOCK_USERS.length,
    active:    MOCK_USERS.filter(u => u.status === "active").length,
    pending:   MOCK_USERS.filter(u => u.status === "pending").length,
    suspended: MOCK_USERS.filter(u => u.status === "suspended").length,
  };

  return (
    <div>
      <PageHeader
        eyebrow="Users"
        title="All users"
        subtitle={`${MOCK_USERS.length} total · ${counts.active} active · ${counts.pending} pending`}
      />

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <div className="flex-1">
          <Input
            placeholder="Search by name, email, or company…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            leftElement={<Search className="h-4 w-4" />}
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {(["all","company_admin","employee","individual"] as const).map(r => (
            <button
              key={r}
              onClick={() => setRoleFilter(r)}
              className="px-3 py-1.5 rounded-xl text-xs font-medium border transition-all"
              style={{
                backgroundColor: roleFilter === r ? "#064E3B" : "#FEF9EF",
                color:           roleFilter === r ? "#FEFCE8" : "#78716C",
                borderColor:     roleFilter === r ? "#064E3B" : "rgba(6,78,59,0.12)",
              }}
            >
              {r === "all" ? "All roles" : ROLE_LABELS[r]}
            </button>
          ))}
        </div>
      </div>

      {/* Status tabs */}
      <div className="flex gap-2 mb-5">
        {(["all","active","pending","suspended"] as const).map(s => (
          <button
            key={s}
            onClick={() => setStatusFilter(s)}
            className="px-3 py-1.5 rounded-xl text-xs font-mono tracking-wide border transition-all capitalize"
            style={{
              backgroundColor: statusFilter === s ? "#ECFDF5" : "transparent",
              color:           statusFilter === s ? "#065F46" : "#78716C",
              borderColor:     statusFilter === s ? "rgba(5,150,105,0.3)" : "transparent",
            }}
          >
            {s === "all" ? `All (${counts.all})` : `${s} (${counts[s]})`}
          </button>
        ))}
      </div>

      {/* Table header */}
      <div
        className="grid grid-cols-12 gap-3 px-4 py-2 rounded-xl mb-2 text-xs font-mono tracking-wide text-ink-light uppercase"
        style={{ backgroundColor: "#F0E6D3" }}
      >
        <div className="col-span-4">User</div>
        <div className="col-span-2 hidden md:block">Role</div>
        <div className="col-span-2 hidden sm:block">Status</div>
        <div className="col-span-3 hidden lg:block">Company</div>
        <div className="col-span-1"></div>
      </div>

      {/* Rows */}
      <div className="space-y-1.5">
        {filtered.length === 0 ? (
          <div className="text-center py-12 text-sm text-ink-light">No users match your search.</div>
        ) : filtered.map(user => (
          <div
            key={user.id}
            className="grid grid-cols-12 gap-3 px-4 py-3.5 rounded-xl border items-center transition-all hover:shadow-card group"
            style={{ backgroundColor: "#FEFCE8", borderColor: "rgba(6,78,59,0.06)" }}
          >
            {/* Name */}
            <div className="col-span-4 flex items-center gap-3 min-w-0">
              <div
                className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 font-medium text-xs"
                style={{ backgroundColor: "#ECFDF5", color: "#065F46" }}
              >
                {user.name.split(" ").map(n => n[0]).join("")}
              </div>
              <div className="min-w-0">
                <p className="text-sm font-medium text-ink truncate">{user.name}</p>
                <p className="text-xs text-ink-light truncate">{user.email}</p>
              </div>
            </div>

            {/* Role */}
            <div className="col-span-2 hidden md:block">
              <span
                className="text-xs px-2 py-1 rounded-lg font-mono"
                style={{ backgroundColor: "#F0E6D3", color: "#78716C" }}
              >
                {ROLE_LABELS[user.role]}
              </span>
            </div>

            {/* Status */}
            <div className="col-span-2 hidden sm:block">
              <Badge variant={user.status}>{user.status}</Badge>
            </div>

            {/* Company */}
            <div className="col-span-3 hidden lg:block text-sm text-ink-mid truncate">
              {user.company ?? <span className="text-ink-light italic">—</span>}
            </div>

            {/* Action */}
            <div className="col-span-8 sm:col-span-6 md:col-span-4 lg:col-span-1 flex justify-end">
              <a
                href={user.role === "employee" && user.company
                  ? `/rdmc/${user.slug}`
                  : `/${user.slug}`
                }
                target="_blank"
                rel="noopener noreferrer"
                className="p-1.5 rounded-lg text-ink-light hover:text-emerald-bright hover:bg-emerald-pale transition-all opacity-0 group-hover:opacity-100"
                title="View card"
              >
                <ExternalLink className="h-3.5 w-3.5" />
              </a>
            </div>
          </div>
        ))}
      </div>

      <p className="text-xs text-ink-light text-center mt-5 font-mono">
        {filtered.length} of {MOCK_USERS.length} users shown
      </p>
    </div>
  );
}