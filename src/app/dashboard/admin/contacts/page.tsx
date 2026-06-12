"use client";

import { useState, useEffect, useCallback } from "react";
import { PageHeader, SectionCard, EmptyState } from "@/components/dashboard/DashboardShared";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import {
  Search, Mail, Phone, Calendar, Inbox, User,
  Building, ArrowUpDown, ChevronLeft, ChevronRight, AlertTriangle,
} from "lucide-react";
import type { ContactExchangeWithOwner } from "@/types";

export default function AdminContactsPage() {
  const [exchanges, setExchanges] = useState<ContactExchangeWithOwner[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [sortDir, setSortDir] = useState<"desc" | "asc">("desc");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const pageSize = 25;

  const loadExchanges = useCallback(async () => {
    setLoading(true);
    setError(null);
    const { fetchAllContactExchanges } = await import("@/app/actions/admin.actions");
    const result = await fetchAllContactExchanges({ search, page, pageSize, sortDir });
    if (result.success && result.data) {
      setExchanges(result.data.data);
      setTotal(result.data.total);
      setTotalPages(result.data.totalPages);
    } else {
      setError(result.error ?? "Failed to load contacts.");
    }
    setLoading(false);
  }, [search, page, pageSize, sortDir]);

  useEffect(() => { loadExchanges(); }, [loadExchanges]);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => setSearch(searchInput), 300);
    return () => clearTimeout(timer);
  }, [searchInput]);

  // Reset to page 1 when search or sort changes
  useEffect(() => { setPage(1); }, [search, sortDir]);

  // Stats
  const now = new Date();
  const thisMonth = exchanges.filter(e => {
    const d = new Date(e.created_at);
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  }).length;
  const withEmail = exchanges.filter(e => e.visitor_email).length;

  return (
    <div>
      <PageHeader
        eyebrow="Contacts"
        title="All contact exchanges"
        subtitle={`${total} total across the platform`}
      />

      {/* Stats row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        {[
          { label: "Total received", value: total, icon: <Inbox className="h-4 w-4" /> },
          { label: "With email", value: withEmail, icon: <Mail className="h-4 w-4" /> },
          { label: "This month", value: thisMonth, icon: <Calendar className="h-4 w-4" /> },
        ].map(stat => (
          <Card key={stat.label} className="flex items-center gap-4 p-5" padding="none">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ backgroundColor: "#ECFDF5", color: "#064E3B" }}
            >
              {stat.icon}
            </div>
            <div>
              <p className="text-xs font-mono tracking-wide text-ink-light uppercase">{stat.label}</p>
              <p className="text-xl font-serif font-semibold text-ink">{stat.value}</p>
            </div>
          </Card>
        ))}
      </div>

      {/* Search + controls */}
      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <div className="flex-1">
          <Input
            placeholder="Search by visitor name or email…"
            value={searchInput}
            onChange={e => setSearchInput(e.target.value)}
            leftElement={<Search className="h-4 w-4" />}
          />
        </div>
        <button
          onClick={() => setSortDir(d => d === "desc" ? "asc" : "desc")}
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl border text-xs font-medium transition-all"
          style={{ backgroundColor: "#FEF9EF", borderColor: "rgba(6,78,59,0.12)", color: "#78716C" }}
        >
          <ArrowUpDown className="h-3.5 w-3.5" />
          {sortDir === "desc" ? "Newest first" : "Oldest first"}
        </button>
      </div>

      {/* Error state */}
      {error && (
        <div className="mb-5 rounded-xl border px-4 py-3 flex items-center justify-between gap-3"
          style={{ backgroundColor: "#FEF2F2", borderColor: "rgba(239,68,68,0.2)" }}>
          <div className="flex items-center gap-2 text-sm" style={{ color: "#991B1B" }}>
            <AlertTriangle className="h-4 w-4" />
            {error}
          </div>
          <Button variant="secondary" size="sm" onClick={loadExchanges}>Retry</Button>
        </div>
      )}

      <SectionCard title="Exchanges">
        {loading ? (
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-[72px] rounded-xl skeleton" />
            ))}
          </div>
        ) : exchanges.length === 0 ? (
          search ? (
            <EmptyState icon={<Search className="h-8 w-8" />} title="No matches" description="No contacts match your search. Try a different query." />
          ) : (
            <EmptyState icon={<Inbox className="h-8 w-8" />} title="No contacts yet" description="When visitors submit their details on card pages, they'll appear here." />
          )
        ) : (
          <>
            {/* Table header */}
            <div
              className="grid grid-cols-12 gap-3 px-4 py-2 rounded-xl mb-2 text-xs font-mono tracking-wide text-ink-light uppercase"
              style={{ backgroundColor: "#F0E6D3" }}
            >
              <div className="col-span-4 sm:col-span-3">Visitor</div>
              <div className="col-span-4 sm:col-span-3">Card Owner</div>
              <div className="col-span-2 sm:col-span-2 hidden sm:block">Contact</div>
              <div className="col-span-2 sm:col-span-2 hidden md:block">Date</div>
              <div className="col-span-2 sm:col-span-2 hidden lg:block">Message</div>
            </div>

            {/* Rows */}
            <div className="space-y-1.5">
              {exchanges.map((exchange) => (
                <div
                  key={exchange.id}
                  className="grid grid-cols-12 gap-3 px-4 py-3 rounded-xl border items-start transition-all hover:shadow-card"
                  style={{ backgroundColor: "#FEFCE8", borderColor: "rgba(6,78,59,0.06)" }}
                >
                  {/* Visitor */}
                  <div className="col-span-4 sm:col-span-3 min-w-0">
                    <p className="text-sm font-medium text-ink truncate">{exchange.visitor_name}</p>
                    {exchange.visitor_organization && (
                      <p className="flex items-center gap-1 text-xs text-ink-light truncate">
                        <Building className="h-3 w-3" />
                        {exchange.visitor_organization}
                      </p>
                    )}
                  </div>

                  {/* Card owner */}
                  <div className="col-span-4 sm:col-span-3 min-w-0">
                    {exchange.card_owner ? (
                      <>
                        <p className="text-sm text-ink-mid truncate">{exchange.card_owner.full_name}</p>
                        <p className="text-xs text-ink-light truncate">@{exchange.card_owner.username}</p>
                      </>
                    ) : (
                      <span className="text-xs text-ink-light italic">Unknown</span>
                    )}
                  </div>

                  {/* Contact info */}
                  <div className="col-span-2 sm:col-span-2 hidden sm:flex flex-col gap-0.5 min-w-0">
                    {exchange.visitor_email && (
                      <span className="flex items-center gap-1 text-xs text-ink-mid truncate">
                        <Mail className="h-3 w-3 flex-shrink-0" />
                        {exchange.visitor_email}
                      </span>
                    )}
                    {exchange.visitor_phone && (
                      <span className="flex items-center gap-1 text-xs text-ink-mid truncate">
                        <Phone className="h-3 w-3 flex-shrink-0" />
                        {exchange.visitor_phone}
                      </span>
                    )}
                    {!exchange.visitor_email && !exchange.visitor_phone && (
                      <span className="text-xs text-ink-light italic">—</span>
                    )}
                  </div>

                  {/* Date */}
                  <div className="col-span-2 sm:col-span-2 hidden md:block">
                    <p className="text-xs text-ink-light font-mono">
                      {exchange.created_at ? new Date(exchange.created_at).toLocaleDateString() : "—"}
                    </p>
                  </div>

                  {/* Message */}
                  <div className="col-span-2 sm:col-span-2 hidden lg:block">
                    <p className="text-xs text-ink-light truncate">
                      {exchange.message ?? <span className="italic">—</span>}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between mt-6 pt-4 border-t" style={{ borderColor: "rgba(6,78,59,0.08)" }}>
              <p className="text-xs text-ink-light font-mono">
                Page {page} of {totalPages} · {total} total
              </p>
              <div className="flex gap-2">
                <Button
                  variant="secondary"
                  size="sm"
                  disabled={page <= 1}
                  onClick={() => setPage(p => p - 1)}
                  leftIcon={<ChevronLeft className="h-4 w-4" />}
                >
                  Previous
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  disabled={page >= totalPages}
                  onClick={() => setPage(p => p + 1)}
                  rightIcon={<ChevronRight className="h-4 w-4" />}
                >
                  Next
                </Button>
              </div>
            </div>
          </>
        )}
      </SectionCard>
    </div>
  );
}
