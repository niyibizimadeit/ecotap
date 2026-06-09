"use client";

import { useState } from "react";
import { PageHeader } from "@/components/dashboard/DashboardShared";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Building2, User, CheckCircle2, XCircle, ExternalLink, Clock } from "lucide-react";

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

const MOCK_COMPANIES: PendingCompany[] = [];

const MOCK_INDIVIDUALS: PendingIndividual[] = [];

export default function ApprovalsPage() {
  const [tab,          setTab]          = useState<"companies"|"individuals">("companies");
  const [companies,    setCompanies]    = useState(MOCK_COMPANIES);
  const [individuals,  setIndividuals]  = useState(MOCK_INDIVIDUALS);
  const [actionStates, setActionStates] = useState<Record<string, "approving"|"rejecting"|"done_approve"|"done_reject">>({});

  async function handleAction(id: string, action: "approve"|"reject") {
    setActionStates(s => ({ ...s, [id]: action === "approve" ? "approving" : "rejecting" }));
    await new Promise(r => setTimeout(r, 900));
    setActionStates(s => ({ ...s, [id]: action === "approve" ? "done_approve" : "done_reject" }));
    await new Promise(r => setTimeout(r, 600));
    if (tab === "companies") setCompanies(cs => cs.filter(c => c.id !== id));
    else setIndividuals(is => is.filter(i => i.id !== id));
    setActionStates(s => { const n={...s}; delete n[id]; return n; });
  }

  const items: PendingItem[] = tab === "companies" ? companies : individuals;

  return (
    <div>
      <PageHeader
        eyebrow="Approvals"
        title="Pending approvals"
        subtitle={`${companies.length + individuals.length} applications waiting for review.`}
      />

      {/* Tabs */}
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

      {/* Cards */}
      {items.length === 0 ? (
        <div
          className="rounded-2xl border p-16 text-center"
          style={{ backgroundColor: "#FEF9EF", borderColor: "rgba(6,78,59,0.08)" }}
        >
          <CheckCircle2 className="h-10 w-10 mx-auto mb-3" style={{ color: "#059669" }} />
          <p className="font-serif text-xl text-emerald-deep mb-1">All clear!</p>
          <p className="text-sm text-ink-light">No pending {tab} to review.</p>
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
                </div>
              </div>
            );
          })}
        </div>
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