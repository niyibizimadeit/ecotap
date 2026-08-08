"use client";

import { useState, useMemo, useCallback } from "react";
import { SectionCard } from "@/components/dashboard/DashboardShared";
import { updateContactExchange } from "@/app/actions/contacts.actions";
import type { ContactExchange } from "@/types";
import { Mail, Phone, Calendar, Star, ChevronDown, MessageSquare, Search, ArrowUpDown, AlertCircle, X } from "lucide-react";

type SortField = "date" | "name" | "lead_level" | "favorites";
type SortDir = "asc" | "desc";

const LEAD_LEVELS = [
  { value: "hot", label: "Hot", color: "#EF4444", bg: "#FEE2E2" },
  { value: "warm", label: "Warm", color: "#F59E0B", bg: "#FEF3C7" },
  { value: "cold", label: "Cold", color: "#3B82F6", bg: "#DBEAFE" },
  { value: "normal", label: "Normal", color: "#6B7280", bg: "#F3F4F6" },
] as const;

interface Props {
  initialContacts: ContactExchange[];
}

export function ContactsClient({ initialContacts }: Props) {
  const [contacts, setContacts] = useState(initialContacts);
  const [search, setSearch] = useState("");
  const [sortField, setSortField] = useState<SortField>("date");
  const [sortDir, setSortDir] = useState<SortDir>("desc");
  const [expandedNotes, setExpandedNotes] = useState<Set<string>>(new Set());
  const [editingGroup, setEditingGroup] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  // ── Toast helper ─────────────────────────────────────────────────────────
  const showToast = useCallback((msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 4000);
  }, []);

  // ── Mutations (with rollback on failure) ─────────────────────────────────

  async function toggleFavorite(c: ContactExchange) {
    const prevVal = c.is_favorite;
    const newVal = !prevVal;
    // Optimistic update
    setContacts((prev) => prev.map((x) => (x.id === c.id ? { ...x, is_favorite: newVal } : x)));
    try {
      const result = await updateContactExchange(c.id, { is_favorite: newVal });
      if (!result.success) throw new Error(result.error ?? "Update failed");
    } catch {
      // Rollback on failure
      setContacts((prev) => prev.map((x) => (x.id === c.id ? { ...x, is_favorite: prevVal } : x)));
      showToast("Failed to update favorite. Please try again.");
    }
  }

  async function setLeadLevel(c: ContactExchange, level: string) {
    const prevLevel = c.lead_level;
    setContacts((prev) => prev.map((x) => (x.id === c.id ? { ...x, lead_level: level as ContactExchange["lead_level"] } : x)));
    try {
      const result = await updateContactExchange(c.id, { lead_level: level });
      if (!result.success) throw new Error(result.error ?? "Update failed");
    } catch {
      setContacts((prev) => prev.map((x) => (x.id === c.id ? { ...x, lead_level: prevLevel } : x)));
      showToast("Failed to update lead level. Please try again.");
    }
  }

  async function saveNotes(c: ContactExchange, notes: string) {
    const prevNotes = c.owner_notes;
    setContacts((prev) => prev.map((x) => (x.id === c.id ? { ...x, owner_notes: notes || null } : x)));
    try {
      const result = await updateContactExchange(c.id, { owner_notes: notes || null });
      if (!result.success) throw new Error(result.error ?? "Update failed");
    } catch {
      setContacts((prev) => prev.map((x) => (x.id === c.id ? { ...x, owner_notes: prevNotes } : x)));
      showToast("Failed to save notes. Please try again.");
    }
  }

  async function saveGroup(c: ContactExchange, group: string) {
    const prevGroup = c.lead_group;
    setContacts((prev) => prev.map((x) => (x.id === c.id ? { ...x, lead_group: group || null } : x)));
    setEditingGroup(null);
    try {
      const result = await updateContactExchange(c.id, { lead_group: group || null });
      if (!result.success) throw new Error(result.error ?? "Update failed");
    } catch {
      setContacts((prev) => prev.map((x) => (x.id === c.id ? { ...x, lead_group: prevGroup } : x)));
      showToast("Failed to update group. Please try again.");
    }
  }

  // ── Filter & sort ──────────────────────────────────────────────────────────

  const filtered = useMemo(() => {
    let list = contacts;
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (c) =>
          c.visitor_name.toLowerCase().includes(q) ||
          c.visitor_email?.toLowerCase().includes(q) ||
          c.visitor_phone?.toLowerCase().includes(q) ||
          c.visitor_organization?.toLowerCase().includes(q) ||
          c.lead_group?.toLowerCase().includes(q)
      );
    }
    return list.sort((a, b) => {
      const dir = sortDir === "asc" ? 1 : -1;
      if (sortField === "favorites") return ((a.is_favorite ? 1 : 0) - (b.is_favorite ? 1 : 0)) * dir;
      if (sortField === "lead_level") {
        const order = { hot: 0, warm: 1, normal: 2, cold: 3 };
        return ((order[a.lead_level ?? "normal"] ?? 2) - (order[b.lead_level ?? "normal"] ?? 2)) * dir;
      }
      if (sortField === "name") return a.visitor_name.localeCompare(b.visitor_name) * dir;
      return (new Date(a.created_at).getTime() - new Date(b.created_at).getTime()) * dir;
    });
  }, [contacts, search, sortField, sortDir]);

  // Unique groups for filter
  const groups = useMemo(() => [...new Set(contacts.map((c) => c.lead_group).filter(Boolean))] as string[], [contacts]);

  // Stats
  const withEmail = contacts.filter((c) => c.visitor_email).length;
  const withPhone = contacts.filter((c) => c.visitor_phone).length;
  const favorites = contacts.filter((c) => c.is_favorite).length;

  return (
    <>
      {/* Toast error banner */}
      {toast && (
        <div className="fixed top-4 right-4 z-50 max-w-sm animate-fade-up">
          <div className="flex items-start gap-2.5 bg-red-50 border border-red-200 rounded-xl p-3 shadow-card-lg">
            <AlertCircle className="h-4 w-4 text-red-500 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-red-700 flex-1">{toast}</p>
            <button onClick={() => setToast(null)} className="flex-shrink-0 text-red-400 hover:text-red-600">
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {/* Stat cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {[
          { label: "Total received", value: contacts.length, sub: null },
          { label: "Favorites", value: favorites, sub: contacts.length > 0 ? `${Math.round((favorites / contacts.length) * 100)}%` : null },
          { label: "With email", value: withEmail, sub: contacts.length > 0 ? `${Math.round((withEmail / contacts.length) * 100)}%` : null },
          { label: "With phone", value: withPhone, sub: contacts.length > 0 ? `${Math.round((withPhone / contacts.length) * 100)}%` : null },
        ].map((s) => (
          <div key={s.label} className="rounded-2xl border p-4 text-center" style={{ backgroundColor: "#FEF9EF", borderColor: "rgba(6,78,59,0.08)" }}>
            <p className="font-serif text-2xl font-semibold text-emerald-deep">{s.value}</p>
            <p className="text-xs text-ink-light mt-0.5">{s.label}</p>
            {s.sub && <p className="text-[10px] text-ink-light/60">{s.sub}</p>}
          </div>
        ))}
      </div>

      {/* Search & sort bar */}
      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-ink-light" />
          <input
            type="text"
            placeholder="Search by name, email, phone, group..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 rounded-xl border text-sm bg-white border-cream-dark focus:outline-none focus:ring-2 focus:ring-emerald-mid/30"
          />
        </div>
        <div className="flex gap-2">
          <select
            value={sortField}
            onChange={(e) => setSortField(e.target.value as SortField)}
            className="px-3 py-2.5 rounded-xl border text-sm bg-white border-cream-dark focus:outline-none focus:ring-2 focus:ring-emerald-mid/30"
          >
            <option value="date">Date</option>
            <option value="name">Name</option>
            <option value="lead_level">Lead Level</option>
            <option value="favorites">Favorites First</option>
          </select>
          <button
            onClick={() => setSortDir((d) => (d === "asc" ? "desc" : "asc"))}
            className="px-3 py-2.5 rounded-xl border text-sm bg-white border-cream-dark hover:bg-cream transition-colors"
            title={`Sort ${sortDir === "asc" ? "descending" : "ascending"}`}
          >
            <ArrowUpDown className="h-4 w-4 text-ink-light" />
          </button>
        </div>
      </div>

      {/* Group filter chips — scrollable on mobile */}
      {groups.length > 0 && (
        <div className="flex flex-nowrap gap-2 mb-4 overflow-x-auto pb-1 -mx-1 px-1">
          {groups.map((g) => (
            <button
              key={g}
              onClick={() => setSearch(g!)}
              className="px-4 py-2 rounded-full text-xs font-medium border border-emerald-light/40 bg-emerald-pale/40 text-emerald-deep hover:bg-emerald-pale transition-colors whitespace-nowrap flex-shrink-0 min-h-[36px]"
            >
              {g}
            </button>
          ))}
          {search && groups.includes(search) && (
            <button
              onClick={() => setSearch("")}
              className="px-4 py-2 rounded-full text-xs font-medium border border-cream-dark bg-white text-ink-light hover:bg-cream transition-colors whitespace-nowrap flex-shrink-0 min-h-[36px]"
            >
              ✕ Clear filter
            </button>
          )}
        </div>
      )}

      {/* Contacts list */}
      <SectionCard title="All contacts" subtitle={`${filtered.length} contact${filtered.length !== 1 ? "s" : ""}`}>

        <div className="space-y-1.5">
          {filtered.map((c) => {
            const leadCfg = LEAD_LEVELS.find((l) => l.value === (c.lead_level || "normal")) ?? LEAD_LEVELS[3];
            const isExpanded = expandedNotes.has(c.id);

            return (
              <div key={c.id} className="rounded-xl border transition-all hover:shadow-card" style={{ backgroundColor: "#FEFCE8", borderColor: "rgba(6,78,59,0.06)" }}>
                {/* Main row — name + quick actions */}
                <div className="flex items-center gap-2 px-3 py-3">
                  {/* Favorite star — large touch target */}
                  <button onClick={() => toggleFavorite(c)} className="flex-shrink-0 p-2 -m-1 transition-colors hover:scale-110 min-w-[44px] min-h-[44px] flex items-center justify-center" title={c.is_favorite ? "Remove favorite" : "Add favorite"}>
                    <Star className={`h-5 w-5 ${c.is_favorite ? "fill-gold text-gold" : "text-ink-light/30"}`} />
                  </button>

                  {/* Avatar + Name + org */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 min-w-0">
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 font-medium text-xs" style={{ backgroundColor: "#ECFDF5", color: "#065F46" }}>
                        {c.visitor_name.split(" ").map((n) => n[0]).join("")}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-ink truncate">{c.visitor_name}</p>
                        {c.visitor_organization && <p className="text-xs text-ink-light truncate">{c.visitor_organization}</p>}
                      </div>
                    </div>

                    {/* Contact info — visible on ALL screen sizes */}
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5 mt-1.5 ml-10">
                      {c.visitor_email && (
                        <a href={`mailto:${c.visitor_email}`} className="flex items-center gap-1 text-xs text-emerald-bright hover:text-emerald-mid transition-colors truncate max-w-[200px]">
                          <Mail className="h-3 w-3 flex-shrink-0" /><span className="truncate">{c.visitor_email}</span>
                        </a>
                      )}
                      {c.visitor_phone && (
                        <a href={`tel:${c.visitor_phone}`} className="flex items-center gap-1 text-xs text-emerald-bright hover:text-emerald-mid transition-colors">
                          <Phone className="h-3 w-3 flex-shrink-0" />{c.visitor_phone}
                        </a>
                      )}
                      {c.message && <p className="text-xs text-ink-light/60 italic truncate max-w-[180px]">{c.message}</p>}
                    </div>

                    {/* Lead level + date — visible on ALL screen sizes */}
                    <div className="flex items-center gap-3 mt-1.5 ml-10">
                      <div className="relative">
                        <select
                          value={c.lead_level || "normal"}
                          onChange={(e) => setLeadLevel(c, e.target.value)}
                          className="pl-2 pr-6 py-1.5 rounded-lg text-xs font-medium border cursor-pointer appearance-none focus:outline-none focus:ring-2 focus:ring-emerald-mid/30 min-h-[32px]"
                          style={{ backgroundColor: leadCfg.bg, color: leadCfg.color, borderColor: leadCfg.color + "30" }}
                        >
                          {LEAD_LEVELS.map((l) => (
                            <option key={l.value} value={l.value}>{l.label}</option>
                          ))}
                        </select>
                        <ChevronDown className="absolute right-1.5 top-1/2 -translate-y-1/2 h-3 w-3 pointer-events-none" style={{ color: leadCfg.color }} />
                      </div>
                      <span className="text-xs text-ink-light flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {new Date(c.created_at).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  {/* Expand/notes button — large touch target */}
                  <button
                    onClick={() => setExpandedNotes((s) => {
                      const next = new Set(s);
                      if (isExpanded) {
                        next.delete(c.id);
                      } else {
                        next.add(c.id);
                      }
                      return next;
                    })}
                    className={`flex-shrink-0 p-2 -m-1 rounded-lg transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center ${isExpanded ? "bg-emerald-pale text-emerald-deep" : "text-ink-light/40 hover:text-ink-mid"}`}
                    title="Notes"
                  >
                    <MessageSquare className="h-5 w-5" />
                  </button>
                </div>

                {/* Expanded section: notes + group */}
                {isExpanded && (
                  <div className="px-4 pb-4 border-t border-cream-dark space-y-3 pt-3">
                    {/* Notes */}
                    <div>
                      <p className="text-xs font-medium text-ink-light mb-1.5">Your notes</p>
                      <textarea
                        defaultValue={c.owner_notes ?? ""}
                        onBlur={(e) => saveNotes(c, e.target.value)}
                        placeholder="Add private notes about this contact..."
                        className="w-full px-3 py-2 rounded-lg border border-cream-dark text-sm bg-white resize-none focus:outline-none focus:ring-2 focus:ring-emerald-mid/30 min-h-[60px]"
                      />
                    </div>

                    {/* Group */}
                    <div>
                      <p className="text-xs font-medium text-ink-light mb-1.5">Group</p>
                      {editingGroup === c.id ? (
                        <div className="flex gap-2">
                          <input
                            type="text"
                            defaultValue={c.lead_group ?? ""}
                            onKeyDown={(e) => {
                              if (e.key === "Enter") saveGroup(c, (e.target as HTMLInputElement).value);
                              if (e.key === "Escape") setEditingGroup(null);
                            }}
                            placeholder="e.g., Conference 2026, VIP Clients..."
                            className="flex-1 px-3 py-1.5 rounded-lg border border-cream-dark text-sm bg-white focus:outline-none focus:ring-2 focus:ring-emerald-mid/30"
                            autoFocus
                          />
                          <button onClick={() => setEditingGroup(null)} className="px-3 py-1.5 text-xs text-ink-light hover:text-ink border border-cream-dark rounded-lg">Cancel</button>
                        </div>
                      ) : (
                        <button
                          onClick={() => setEditingGroup(c.id)}
                          className="px-3 py-1.5 rounded-lg text-xs border border-dashed border-cream-dark text-ink-light hover:text-ink hover:border-ink-light/30 transition-colors"
                        >
                          {c.lead_group || "+ Add group"}
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {filtered.length === 0 && (
          <p className="text-sm text-ink-light text-center py-8">No contacts match your search.</p>
        )}

        <p className="text-xs text-ink-light text-center mt-6 font-mono">Contacts are collected from your public card page — no action needed from you.</p>
      </SectionCard>
    </>
  );
}
