"use client";

import { useState, useEffect } from "react";
import { PageHeader } from "@/components/dashboard/DashboardShared";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Building2, User, CheckCircle2, XCircle, ExternalLink, Clock, AlertTriangle } from "lucide-react";

interface PendingCompany {
  id: string; type: "company";
  name: string; industry: string; size: string; website: string;
  admin: string; email: string; submitted: string;
}

interface PendingIndividual {
  id: string; type: "individual";
  name: string; username: string; email: string;
  company?: string; submitted: string;
}

type PendingItem = PendingCompany | PendingIndividual;

export default function ApprovalsPage() {
  const [tab,          setTab]          = useState<"companies"|"individuals">("companies");
  const [companies,    setCompanies]    = useState<PendingCompany[]>([]);
  const [individuals,  setIndividuals]  = useState<PendingIndividual[]>([]);
  const [actionStates, setActionStates] = useState<Record<string, "approving"|"rejecting"|"done_approve"|"done_reject">>({});
  const [isLoading,    setIsLoading]    = useState(true);
  const [error,        setError]        = useState<string | null>(null);
  const [retryCount,   setRetryCount]   = useState(0);
  const [actionError,  setActionError]  = useState<string | null>(null);
  const [isReadOnly,   setIsReadOnly]   = useState(false);

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
      setIsLoading(true);
      setError(null);
      try {
        const { fetchPendingQueue } = await import("@/app/actions/admin.actions");
        const result = await fetchPendingQueue();
        if (result.success && result.data) {
          const mappedCompanies = (result.data.companies ?? []).map((c: Record<string, unknown>) => ({
            id: c.id as string, type: "company" as const, name: c.name as string,
            industry: (c.industry as string) ?? "", size: (c.size as string) ?? "",
            website: (c.website as string) ?? "", admin: "", email: "", submitted: (c.created_at as string) ?? "",
          }));
          const mappedIndividuals = (result.data.individuals ?? []).map((p: Record<string, unknown>) => ({
            id: p.id as string, type: "individual" as const, name: (p.full_name as string) ?? "",
            username: (p.username as string) ?? "", email: (p.email as string) ?? "",
            company: "", submitted: (p.created_at as string) ?? "",
          }));
          setCompanies(mappedCompanies);
          setIndividuals(mappedIndividuals);
          // Auto-select the tab that has items
          if (mappedCompanies.length > 0) {
            setTab("companies");
          } else if (mappedIndividuals.length > 0) {
            setTab("individuals");
          }
        } else {
          setError(result.error ?? "Failed to load pending approvals.");
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "An unexpected error occurred.");
      } finally {
        setIsLoading(false);
      }
    }
    load();
  }, [retryCount]);

  async function handleAction(id: string, action: "approve"|"reject") {
    setActionError(null);
    setActionStates(s => ({ ...s, [id]: action === "approve" ? "approving" : "rejecting" }));
    const { approveCompany, approveIndividual, rejectUser, rejectCompany } = await import("@/app/actions/admin.actions");
    let result;
    if (action === "approve") {
      result = tab === "companies" ? await approveCompany(id) : await approveIndividual(id);
    } else {
      result = tab === "companies" ? await rejectCompany(id) : await rejectUser(id);
    }
    if (!result.success) {
      setActionError(result.error ?? `Failed to ${action} this application.`);
      setActionStates(s => { const n = { ...s }; delete n[id]; return n; });
      return;
    }
    setActionStates(s => ({ ...s, [id]: action === "approve" ? "done_approve" : "done_reject" }));
    await new Promise(r => setTimeout(r, 600));
    if (tab === "companies") setCompanies(cs => cs.filter(c => c.id !== id));
    else setIndividuals(is => is.filter(i => i.id !== id));
    setActionStates(s => { const n={...s}; delete n[id]; return n; });
  }

  const items: PendingItem[] = tab === "companies" ? companies : individuals;
  const totalCount = companies.length + individuals.length;
  const otherTab = tab === "companies" ? "individuals" : "companies";
  const otherCount = tab === "companies" ? individuals.length : companies.length;

  return (
    <div>
      <PageHeader
        eyebrow="Approvals"
        title="Pending approvals"
        subtitle={isLoading ? "Loading…" : error ? "Failed to load" : `${totalCount} application${totalCount !== 1 ? "s" : ""} waiting for review.`}
      />

      {/* Error banner */}
      {error && (
        <div
          className="rounded-2xl border p-4 mb-5 flex items-center gap-3"
          style={{ backgroundColor: "#FEF2F2", borderColor: "rgba(239,68,68,0.3)" }}
        >
          <AlertTriangle className="h-5 w-5 flex-shrink-0" style={{ color: "#EF4444" }} />
          <div className="flex-1">
            <p className="text-sm font-medium" style={{ color: "#991B1B" }}>{error}</p>
          </div>
          <Button variant="secondary" size="sm" onClick={() => setRetryCount(c => c + 1)}>Retry</Button>
        </div>
      )}

      {/* Action error toast */}
      {actionError && (
        <div
          className="rounded-2xl border p-4 mb-5 flex items-center gap-3"
          style={{ backgroundColor: "#FEF2F2", borderColor: "rgba(239,68,68,0.3)" }}
        >
          <AlertTriangle className="h-5 w-5 flex-shrink-0" style={{ color: "#EF4444" }} />
          <div className="flex-1">
            <p className="text-sm font-medium" style={{ color: "#991B1B" }}>{actionError}</p>
          </div>
          <button
            onClick={() => setActionError(null)}
            className="text-xs font-medium px-3 py-1.5 rounded-lg hover:opacity-80 transition-opacity"
            style={{ color: "#991B1B", backgroundColor: "rgba(239,68,68,0.1)" }}
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Loading skeleton */}
      {isLoading && (
        <div className="space-y-4">
          {[1, 2].map(i => (
            <div
              key={i}
              className="rounded-2xl border p-8 animate-pulse"
              style={{ backgroundColor: "#FEF9EF", borderColor: "rgba(6,78,59,0.08)" }}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl skeleton" />
                <div className="space-y-2 flex-1">
                  <div className="h-4 w-48 rounded skeleton" />
                  <div className="h-3 w-32 rounded skeleton" />
                </div>
              </div>
              <div className="grid grid-cols-4 gap-4">
                {[1, 2, 3, 4].map(j => (
                  <div key={j} className="space-y-1">
                    <div className="h-3 w-16 rounded skeleton" />
                    <div className="h-4 w-24 rounded skeleton" />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tabs — only show when data is loaded */}
      {!isLoading && !error && (
      <div className="flex gap-2 mb-6">
        {(["companies","individuals"] as const).map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium border transition-all capitalize"
            style={{
              backgroundColor: tab === t ? "#064E3B" : "#FEF9EF",
              color:           tab === t ? "#FEFCE8" : "#78716C",
              borderColor:     tab === t ? "#064E3B" : "rgba(6,78,59,0.12)",
            }}
          >
            {t === "companies" ? <Building2 className="h-4 w-4" /> : <User className="h-4 w-4" />}
            {t}
            <span
              className="text-[10px] font-mono px-1.5 py-0.5 rounded-full"
              style={{
                backgroundColor: tab === t ? "rgba(255,255,255,0.2)" : "#F0E6D3",
                color:           tab === t ? "#FEFCE8" : "#78716C",
              }}
            >
              {t === "companies" ? companies.length : individuals.length}
            </span>
          </button>
        ))}
      </div>
      )}

      {/* Cards — only render when not loading and no error */}
      {!isLoading && !error && (
        <>
          {items.length === 0 ? (
            <div
              className="rounded-2xl border p-16 text-center"
              style={{ backgroundColor: "#FEF9EF", borderColor: "rgba(6,78,59,0.08)" }}
            >
              <CheckCircle2 className="h-10 w-10 mx-auto mb-3" style={{ color: "#059669" }} />
              <p className="font-serif text-xl text-emerald-deep mb-1">
                {totalCount === 0 ? "All clear!" : `No pending ${tab}`}
              </p>
              <p className="text-sm text-ink-light">
                {totalCount === 0
                  ? "No pending applications to review."
                  : `${otherCount} pending ${otherTab} — `}
                {otherCount > 0 && (
                  <button
                    onClick={() => setTab(otherTab)}
                    className="text-emerald-bright hover:text-emerald-mid underline underline-offset-4 transition-colors font-medium"
                  >
                    switch to {otherTab} tab
                  </button>
                )}
              </p>
            </div>
          ) : (
        <div className="space-y-4">
          {items.map(item => {
            const state = actionStates[item.id];
            const isDone = state === "done_approve" || state === "done_reject";
            return (
              <div
                key={item.id}
                className="rounded-2xl border overflow-hidden transition-all"
                style={{
                  backgroundColor: isDone ? (state === "done_approve" ? "#ECFDF5" : "#FEF2F2") : "#FEF9EF",
                  borderColor: isDone ? (state === "done_approve" ? "rgba(5,150,105,0.3)" : "rgba(239,68,68,0.3)") : "rgba(6,78,59,0.08)",
                  opacity: isDone ? 0.7 : 1,
                }}
              >
                {/* Header */}
                <div
                  className="px-6 py-4 border-b flex items-center justify-between gap-3"
                  style={{ borderColor: "rgba(6,78,59,0.06)", backgroundColor: "rgba(6,78,59,0.02)" }}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: item.type === "company" ? "#ECFDF5" : "#FEF3C7" }}
                    >
                      {item.type === "company"
                        ? <Building2 className="h-5 w-5" style={{ color: "#065F46" }} />
                        : <User      className="h-5 w-5" style={{ color: "#92400E" }} />
                      }
                    </div>
                    <div>
                      <p className="font-semibold text-emerald-deep">{item.name}</p>
                      <p className="text-xs text-ink-light flex items-center gap-1">
                        <Clock className="h-3 w-3" /> {item.submitted}
                      </p>
                    </div>
                  </div>
                  <Badge variant="pending">Pending</Badge>
                </div>

                {/* Details */}
                <div className="px-6 py-4 grid grid-cols-2 md:grid-cols-4 gap-4">
                  {item.type === "company" ? (
                    <>
                      <Detail label="Industry"  value={item.industry} />
                      <Detail label="Size"       value={item.size} />
                      <Detail label="Admin"      value={item.admin} />
                      <Detail label="Email"      value={item.email} />
                    </>
                  ) : (
                    <>
                      <Detail label="Username"  value={`@${item.username}`} />
                      <Detail label="Email"     value={item.email} />
                      <Detail label="Company"   value={item.company || "—"} />
                      <Detail label="Card URL"  value={`ecotap.rw/${item.username}`} />
                    </>
                  )}
                </div>

                {/* Actions */}
                <div
                  className="px-6 py-4 border-t flex items-center justify-between gap-3"
                  style={{ borderColor: "rgba(6,78,59,0.06)" }}
                >
                  {item.type === "company" && (
                    <a
                      href={(item as PendingCompany).website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 text-xs text-ink-light hover:text-emerald-bright transition-colors"
                    >
                      <ExternalLink className="h-3.5 w-3.5" /> Visit website
                    </a>
                  )}
                  {item.type === "individual" && (
                    <span className="text-xs text-ink-light font-mono">
                      ecotap.rw/{(item as PendingIndividual).username}
                    </span>
                  )}
                  {!isReadOnly && (
                  <div className="flex gap-2 ml-auto">
                    <Button
                      variant="danger"
                      size="sm"
                      loading={state === "rejecting"}
                      disabled={!!state}
                      leftIcon={state !== "rejecting" ? <XCircle className="h-3.5 w-3.5" /> : undefined}
                      onClick={() => handleAction(item.id, "reject")}
                    >
                      Reject
                    </Button>
                    <Button
                      variant="primary"
                      size="sm"
                      loading={state === "approving"}
                      disabled={!!state}
                      leftIcon={state !== "approving" ? <CheckCircle2 className="h-3.5 w-3.5" /> : undefined}
                      onClick={() => handleAction(item.id, "approve")}
                      style={{ backgroundColor: "#059669" }}
                    >
                      Approve
                    </Button>
                  </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
          )}
        </>
      )}
    </div>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs text-ink-light mb-0.5">{label}</p>
      <p className="text-sm font-medium text-ink truncate">{value}</p>
    </div>
  );
}