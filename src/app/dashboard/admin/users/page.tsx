"use client";

import { useState, useEffect } from "react";
import { PageHeader } from "@/components/dashboard/DashboardShared";
import { Input } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { Spinner } from "@/components/ui/Spinner";
import {
  Search, ExternalLink, AlertTriangle, Trash2, Shield, XCircle,
  UserCheck, Building, Package, CreditCard, ChevronRight,
  Mail, Calendar, Briefcase, Palette, Globe,
} from "lucide-react";
import type { UserRole, UserStatus, ProfileFull } from "@/types";
import { ROLE_LABELS } from "@/constants";

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

const ALL_ROLES: UserRole[] = ["super_admin", "country_rep", "company_admin", "employee", "individual"];

export default function UsersPage() {
  const [users,        setUsers]        = useState<AdminUser[]>([]);
  const [search,       setSearch]       = useState("");
  const [roleFilter,   setRoleFilter]   = useState<UserRole|"all">("all");
  const [statusFilter, setStatusFilter] = useState<UserStatus|"all">("all");

  // Detail modal
  const [selectedUser,    setSelectedUser]    = useState<AdminUser | null>(null);
  const [userDetail,      setUserDetail]      = useState<ProfileFull | null>(null);
  const [detailLoading,   setDetailLoading]   = useState(false);
  const [detailError,     setDetailError]     = useState<string | null>(null);

  // Action states
  const [actionLoading,   setActionLoading]   = useState<string | null>(null);
  const [toast,           setToast]           = useState<{ message: string; type: "success" | "error" } | null>(null);
  const [confirmDeleteUser, setConfirmDeleteUser] = useState<AdminUser | null>(null);
  const [confirmDeleteCompany, setConfirmDeleteCompany] = useState<{ companyId: string; companyName: string } | null>(null);

  useEffect(() => { loadUsers(); }, []);

  async function loadUsers() {
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

  async function openUserDetail(user: AdminUser) {
    setSelectedUser(user);
    setDetailLoading(true);
    setDetailError(null);
    setUserDetail(null);

    const { fetchUserProfile } = await import("@/app/actions/admin.actions");
    const result = await fetchUserProfile(user.id);
    if (result.success && result.data) {
      setUserDetail(result.data as ProfileFull);
    } else {
      setDetailError(result.error ?? "Failed to load user details.");
    }
    setDetailLoading(false);
  }

  function closeDetail() {
    setSelectedUser(null);
    setUserDetail(null);
    setDetailError(null);
  }

  async function handleRoleChange(profileId: string, newRole: string) {
    setActionLoading("role");
    const { updateUserRoleAction } = await import("@/app/actions/admin.actions");
    const result = await updateUserRoleAction(profileId, newRole);
    showToast(result.success ? "Role updated." : (result.error ?? "Failed."), result.success ? "success" : "error");
    if (result.success) {
      await loadUsers();
      // Refresh detail
      const { fetchUserProfile } = await import("@/app/actions/admin.actions");
      const detailResult = await fetchUserProfile(profileId);
      if (detailResult.success && detailResult.data) setUserDetail(detailResult.data as ProfileFull);
    }
    setActionLoading(null);
  }

  async function handleToggleStatus(profileId: string) {
    setActionLoading("status");
    const { toggleUserStatusAction } = await import("@/app/actions/admin.actions");
    const result = await toggleUserStatusAction(profileId);
    showToast(result.success ? "Status toggled." : (result.error ?? "Failed."), result.success ? "success" : "error");
    if (result.success) {
      await loadUsers();
      const { fetchUserProfile } = await import("@/app/actions/admin.actions");
      const detailResult = await fetchUserProfile(profileId);
      if (detailResult.success && detailResult.data) setUserDetail(detailResult.data as ProfileFull);
    }
    setActionLoading(null);
  }

  async function handleDeleteUser(profileId: string) {
    setActionLoading("delete-user");
    setConfirmDeleteUser(null);
    const { deleteUserAction } = await import("@/app/actions/admin.actions");
    const result = await deleteUserAction(profileId);
    showToast(result.success ? "User deleted." : (result.error ?? "Failed."), result.success ? "success" : "error");
    if (result.success) {
      closeDetail();
      await loadUsers();
    }
    setActionLoading(null);
  }

  async function handleDeleteCompany(companyId: string) {
    setActionLoading("delete-company");
    setConfirmDeleteCompany(null);
    const { deleteCompanyAction } = await import("@/app/actions/admin.actions");
    const result = await deleteCompanyAction(companyId);
    showToast(result.success ? "Company deleted." : (result.error ?? "Failed."), result.success ? "success" : "error");
    if (result.success && selectedUser) {
      const { fetchUserProfile } = await import("@/app/actions/admin.actions");
      const detailResult = await fetchUserProfile(selectedUser.id);
      if (detailResult.success && detailResult.data) setUserDetail(detailResult.data as ProfileFull);
    }
    setActionLoading(null);
  }

  function showToast(message: string, type: "success" | "error") {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  }

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

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 px-4 py-3 rounded-xl text-sm font-medium shadow-card-lg animate-fade-up"
          style={{
            backgroundColor: toast.type === "success" ? "#ECFDF5" : "#FEF2F2",
            color: toast.type === "success" ? "#065F46" : "#991B1B",
            border: `1px solid ${toast.type === "success" ? "rgba(5,150,105,0.3)" : "rgba(239,68,68,0.3)"}`,
          }}
        >
          {toast.message}
        </div>
      )}

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
        <div className="col-span-8 sm:col-span-5">User</div>
        <div className="col-span-2 hidden sm:block">Role</div>
        <div className="col-span-2 hidden sm:block">Status</div>
        <div className="col-span-3 hidden lg:block">Company</div>
        <div className="col-span-4 sm:col-span-1"></div>
      </div>

      {/* Rows */}
      <div className="space-y-1.5">
        {filtered.length === 0 ? (
          <div className="text-center py-12 text-sm text-ink-light">No users match your search.</div>
        ) : filtered.map(user => (
          <button
            key={user.id}
            onClick={() => openUserDetail(user)}
            className="grid grid-cols-12 gap-3 px-4 py-3.5 rounded-xl border items-center transition-all hover:shadow-card group w-full text-left cursor-pointer"
            style={{ backgroundColor: "#FEFCE8", borderColor: "rgba(6,78,59,0.06)" }}
          >
            {/* Name — takes most of the row on mobile */}
            <div className="col-span-8 sm:col-span-5 flex items-center gap-3 min-w-0">
              <div
                className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 font-medium text-xs"
                style={{ backgroundColor: "#ECFDF5", color: "#065F46" }}
              >
                {user.name.split(" ").map(n => n[0]).join("")}
              </div>
              <div className="min-w-0">
                <p className="text-sm font-medium text-ink truncate">{user.name}</p>
                <p className="text-xs text-ink-light truncate">{user.email}</p>
                {/* Mobile-only: inline role + status */}
                <p className="text-xs text-ink-light mt-0.5 sm:hidden">
                  {ROLE_LABELS[user.role]} · {user.status}
                </p>
              </div>
            </div>

            {/* Role */}
            <div className="col-span-2 hidden sm:block">
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

            {/* Chevron — compact on mobile */}
            <div className="col-span-4 sm:col-span-1 flex justify-end items-center gap-2">
              <a
                href={user.role === "employee" && user.company
                  ? `/rdmc/${user.slug}`
                  : `/${user.slug}`
                }
                target="_blank"
                rel="noopener noreferrer"
                onClick={e => e.stopPropagation()}
                className="p-1.5 rounded-lg text-ink-light hover:text-emerald-bright hover:bg-emerald-pale transition-all opacity-0 group-hover:opacity-100"
                title="View card"
              >
                <ExternalLink className="h-3.5 w-3.5" />
              </a>
              <ChevronRight className="h-3.5 w-3.5 text-ink-light opacity-40 group-hover:opacity-100 transition-opacity" />
            </div>
          </button>
        ))}
      </div>

      <p className="text-xs text-ink-light text-center mt-5 font-mono">
        {filtered.length} of {users.length} users shown
      </p>

      {/* ── User Detail Modal ── */}
      <Modal open={!!selectedUser} onClose={closeDetail} size="lg">
        {detailLoading ? (
          <div className="py-16 flex justify-center"><Spinner size="lg" /></div>
        ) : detailError ? (
          <div className="py-12 text-center space-y-3">
            <AlertTriangle className="h-8 w-8 text-amber-600 mx-auto" />
            <p className="text-sm text-ink-mid">{detailError}</p>
            <Button variant="secondary" size="sm" onClick={() => selectedUser && openUserDetail(selectedUser)}>Retry</Button>
          </div>
        ) : userDetail ? (
          <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center gap-4">
              <div
                className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 font-serif text-lg font-semibold"
                style={{ backgroundColor: "#ECFDF5", color: "#065F46" }}
              >
                {selectedUser?.name.split(" ").map(n => n[0]).join("")}
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="text-lg font-serif font-semibold text-ink">{selectedUser?.name}</h3>
                <p className="text-sm text-ink-light">{selectedUser?.email}</p>
              </div>
              <Badge variant={userDetail.status}>{userDetail.status}</Badge>
            </div>

            {/* Profile section */}
            <div className="rounded-2xl border p-5 space-y-3" style={{ backgroundColor: "#FEF9EF", borderColor: "rgba(6,78,59,0.08)" }}>
              <p className="text-xs font-mono tracking-wide text-ink-light uppercase">Profile</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                <div className="flex items-center gap-2">
                  <UserCheck className="h-4 w-4 text-ink-light flex-shrink-0" />
                  <span className="text-ink-light">Role:</span>
                  <span className="font-medium text-ink">{ROLE_LABELS[userDetail.role]}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-ink-light flex-shrink-0" />
                  <span className="text-ink-light">Joined:</span>
                  <span className="font-medium text-ink">
                    {userDetail.created_at ? new Date(userDetail.created_at).toLocaleDateString() : "—"}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Globe className="h-4 w-4 text-ink-light flex-shrink-0" />
                  <span className="text-ink-light">Username:</span>
                  <span className="font-medium text-ink">@{userDetail.username}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Shield className="h-4 w-4 text-ink-light flex-shrink-0" />
                  <span className="text-ink-light">ID:</span>
                  <span className="font-mono text-xs text-ink-mid">{userDetail.id.slice(0, 8)}…</span>
                </div>
              </div>
            </div>

            {/* Card section */}
            <div className="rounded-2xl border p-5 space-y-3" style={{ backgroundColor: "#FEF9EF", borderColor: "rgba(6,78,59,0.08)" }}>
              <p className="text-xs font-mono tracking-wide text-ink-light uppercase">Digital Card</p>
              {userDetail.card ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                  <div className="flex items-center gap-2">
                    <Palette className="h-4 w-4 text-ink-light flex-shrink-0" />
                    <span className="text-ink-light">Theme:</span>
                    <div className="w-4 h-4 rounded-full border" style={{ backgroundColor: userDetail.card.theme_color ?? "#064E3B" }} />
                  </div>
                  <div className="flex items-center gap-2">
                    <Briefcase className="h-4 w-4 text-ink-light flex-shrink-0" />
                    <span className="text-ink-light">Job title:</span>
                    <span className="font-medium text-ink">{userDetail.card.job_title ?? "—"}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Globe className="h-4 w-4 text-ink-light flex-shrink-0" />
                    <span className="text-ink-light">Public:</span>
                    <span className={userDetail.card.is_public ? "text-emerald-bright font-medium" : "text-ink-light"}>{userDetail.card.is_public ? "Yes" : "No"}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-ink-light flex-shrink-0" />
                    <span className="text-ink-light">Phone:</span>
                    <span className="font-medium text-ink">{userDetail.card.phone ?? "—"}</span>
                  </div>
                  {userDetail.card.bio && (
                    <div className="sm:col-span-2">
                      <p className="text-xs text-ink-light mb-1">Bio</p>
                      <p className="text-sm text-ink-mid">{userDetail.card.bio}</p>
                    </div>
                  )}
                </div>
              ) : (
                <p className="text-sm text-ink-light italic">No card created</p>
              )}
            </div>

            {/* Companies section */}
            <div className="rounded-2xl border p-5 space-y-3" style={{ backgroundColor: "#FEF9EF", borderColor: "rgba(6,78,59,0.08)" }}>
              <p className="text-xs font-mono tracking-wide text-ink-light uppercase">Companies ({userDetail.companies?.length ?? 0})</p>
              {userDetail.companies && userDetail.companies.length > 0 ? (
                <div className="space-y-2">
                  {userDetail.companies.map((pc: any) => (
                    <div key={pc.company?.id ?? pc.company_id} className="flex items-center justify-between gap-3 py-2 border-b last:border-0"
                      style={{ borderColor: "rgba(6,78,59,0.06)" }}>
                      <div className="flex items-center gap-3 min-w-0">
                        <Building className="h-4 w-4 text-ink-light flex-shrink-0" />
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-ink truncate">{pc.company?.name ?? "Unknown company"}</p>
                          <p className="text-xs text-ink-light">
                            {pc.job_title && <span>{pc.job_title}</span>}
                            {pc.department && <span> · {pc.department.name ?? pc.department}</span>}
                            {pc.is_primary && <span className="ml-1 text-emerald-bright font-medium">· Primary</span>}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => setConfirmDeleteCompany({
                          companyId: pc.company?.id ?? pc.company_id,
                          companyName: pc.company?.name ?? "this company",
                        })}
                        disabled={actionLoading === "delete-company"}
                        className="p-1.5 rounded-lg text-ink-light hover:text-red-600 hover:bg-red-50 transition-all flex-shrink-0"
                        title="Delete company"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-ink-light italic">No company associations</p>
              )}
            </div>

            {/* Orders section */}
            <div className="rounded-2xl border p-5 space-y-3" style={{ backgroundColor: "#FEF9EF", borderColor: "rgba(6,78,59,0.08)" }}>
              <p className="text-xs font-mono tracking-wide text-ink-light uppercase">Order History ({userDetail.orders?.length ?? 0})</p>
              {userDetail.orders && userDetail.orders.length > 0 ? (
                <div className="space-y-2">
                  {userDetail.orders.map((order: any) => (
                    <div key={order.id} className="flex items-center justify-between gap-3 py-2 border-b last:border-0"
                      style={{ borderColor: "rgba(6,78,59,0.06)" }}>
                      <div className="flex items-center gap-3 min-w-0">
                        <Package className="h-4 w-4 text-ink-light flex-shrink-0" />
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-ink">
                            {order.design?.name ?? "Order"} · Qty {order.quantity}
                          </p>
                          <p className="text-xs text-ink-light">
                            {order.created_at ? new Date(order.created_at).toLocaleDateString() : "—"}
                          </p>
                        </div>
                      </div>
                      <Badge variant={order.status}>{order.status}</Badge>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-ink-light italic">No orders</p>
              )}
            </div>

            {/* Actions bar */}
            <div className="border-t pt-5 space-y-4" style={{ borderColor: "rgba(6,78,59,0.08)" }}>
              {/* Role change */}
              <div className="flex items-center gap-3 flex-wrap">
                <span className="text-sm text-ink-light">Change role:</span>
                <select
                  value={userDetail.role}
                  onChange={e => handleRoleChange(userDetail.id, e.target.value)}
                  disabled={actionLoading !== null}
                  className="text-sm px-3 py-1.5 rounded-xl border text-ink"
                  style={{ backgroundColor: "#FEFCE8", borderColor: "rgba(6,78,59,0.15)" }}
                >
                  {ALL_ROLES.map(r => (
                    <option key={r} value={r}>{ROLE_LABELS[r]}</option>
                  ))}
                </select>
                {actionLoading === "role" && <Spinner size="sm" />}
              </div>

              {/* Status toggle */}
              <div>
                <Button
                  variant={userDetail.status === "active" ? "danger" : "primary"}
                  size="md"
                  loading={actionLoading === "status"}
                  onClick={() => handleToggleStatus(userDetail.id)}
                  leftIcon={userDetail.status === "active" ? <XCircle className="h-4 w-4" /> : <UserCheck className="h-4 w-4" />}
                >
                  {userDetail.status === "active" ? "Suspend user" : userDetail.status === "pending" ? "Activate user" : "Reactivate user"}
                </Button>
              </div>

              {/* Delete user */}
              <div>
                <Button
                  variant="ghost"
                  size="md"
                  loading={actionLoading === "delete-user"}
                  onClick={() => setConfirmDeleteUser(selectedUser)}
                  leftIcon={<Trash2 className="h-4 w-4" />}
                >
                  Delete this user
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <div className="py-12 text-center text-sm text-ink-light">No data available.</div>
        )}
      </Modal>

      {/* ── Confirm Delete User ── */}
      <Modal open={!!confirmDeleteUser} onClose={() => setConfirmDeleteUser(null)} size="sm">
        <div className="space-y-4 text-center">
          <div className="w-12 h-12 rounded-full mx-auto flex items-center justify-center" style={{ backgroundColor: "#FEF2F2" }}>
            <Trash2 className="h-6 w-6 text-red-600" />
          </div>
          <div>
            <h3 className="text-lg font-serif font-semibold text-ink">Delete user?</h3>
            <p className="text-sm text-ink-light mt-2">
              This will permanently delete <strong>{confirmDeleteUser?.name}</strong>&apos;s account, card, orders, and all associated data. This cannot be undone.
            </p>
          </div>
          <div className="flex gap-3 justify-center">
            <Button variant="secondary" size="md" onClick={() => setConfirmDeleteUser(null)}>Cancel</Button>
            <Button variant="danger" size="md" loading={actionLoading === "delete-user"} onClick={() => confirmDeleteUser && handleDeleteUser(confirmDeleteUser.id)}>
              Delete
            </Button>
          </div>
        </div>
      </Modal>

      {/* ── Confirm Delete Company ── */}
      <Modal open={!!confirmDeleteCompany} onClose={() => setConfirmDeleteCompany(null)} size="sm">
        <div className="space-y-4 text-center">
          <div className="w-12 h-12 rounded-full mx-auto flex items-center justify-center" style={{ backgroundColor: "#FEF2F2" }}>
            <Building className="h-6 w-6 text-red-600" />
          </div>
          <div>
            <h3 className="text-lg font-serif font-semibold text-ink">Delete company?</h3>
            <p className="text-sm text-ink-light mt-2">
              This will delete <strong>{confirmDeleteCompany?.companyName}</strong> and all related data (departments, subscriptions, member links). This cannot be undone.
            </p>
          </div>
          <div className="flex gap-3 justify-center">
            <Button variant="secondary" size="md" onClick={() => setConfirmDeleteCompany(null)}>Cancel</Button>
            <Button variant="danger" size="md" loading={actionLoading === "delete-company"} onClick={() => confirmDeleteCompany && handleDeleteCompany(confirmDeleteCompany.companyId)}>
              Delete company
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
