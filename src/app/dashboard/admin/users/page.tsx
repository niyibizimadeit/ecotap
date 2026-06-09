"use client";

import { useState, useEffect } from "react";
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

const users: AdminUser[] = [];

const ROLE_LABELS: Record<UserRole, string> = {
  super_admin:   "Super Admin",
  country_rep:   "Country Rep",
  company_admin: "Company Admin",
  employee:      "Employee",
  individual:    "Individual",
};

export default function UsersPage() {
  const [users,        setUsers]        = useState<AdminUser[]>([]);
  const [search,       setSearch]       = useState("");
  const [roleFilter,   setRoleFilter]   = useState<UserRole|"all">("all");
  const [statusFilter, setStatusFilter] = useState<UserStatus|"all">("all");

  useEffect(() => {
    async function load() {
      const { fetchUsers } = await import("@/app/actions/admin.actions");
      const result = await fetchUsers();
      if (result.success && result.data) {
        setUsers((result.data as any[]).map((u: any) => ({
          id: u.id, name: u.full_name ?? u.email, email: u.email,
          role: u.role, status: u.status, company: u.company_name ?? u.company ?? null,
          joined: u.created_at ? new Date(u.created_at).toLocaleDateString() : "—",
          slug: u.username ?? "—",
        })));
      }
    }
    load();
  }, []);

  const filtered = users.filter(u => {
    const q = search.toLowerCase();
    const matchSearch = u.name.toLowerCase().includes(q) ||
                        u.email.toLowerCase().includes(q) ||
                        (u.company?.toLowerCase().includes(q) ?? false);
    const matchRole   = roleFilter === "all"   || u.role   === roleFilter;
    const matchStatus = statusFilter === "all" || u.status === statusFilter;
    return matchSearch && matchRole && matchStatus;
  });

  const counts = {
    all:       users.length,
    active:    users.filter(u => u.status === "active").length,
    pending:   users.filter(u => u.status === "pending").length,
    suspended: users.filter(u => u.status === "suspended").length,
  };

  return (
    <div>
      <PageHeader
        eyebrow="Users"
        title="All users"
        subtitle={`${users.length} total · ${counts.active} active · ${counts.pending} pending`}
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
        {filtered.length} of {users.length} users shown
      </p>
    </div>
  );
}