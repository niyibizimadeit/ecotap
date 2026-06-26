"use client";

import { useState, useMemo } from "react";
import { SectionCard } from "@/components/dashboard/DashboardShared";
import { updateContactExchange } from "@/app/actions/contacts.actions";
import type { ContactExchange } from "@/types";
import { Mail, Phone, Calendar, Star, ChevronDown, MessageSquare, Search, ArrowUpDown } from "lucide-react";

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

  // ── Mutations ──────────────────────────────────────────────────────────────

  async function toggleFavorite(c: ContactExchange) {
    const newVal = !c.is_favorite;
    // Optimistic update
    setContacts((prev) => prev.map((x) => (x.id === c.id ? { ...x, is_favorite: newVal } : x)));
    await updateContactExchange(c.id, { is_favorite: newVal });
  }

  async function setLeadLevel(c: ContactExchange, level: string) {
    setContacts((prev) => prev.map((x) => (x.id === c.id ? { ...x, lead_level: level as ContactExchange["lead_level"] } : x)));
    await updateContactExchange(c.id, { lead_level: level });
  }

  async function saveNotes(c: ContactExchange, notes: string) {
    setContacts((prev) => prev.map((x) => (x.id === c.id ? { ...x, owner_notes: notes || null } : x)));
    await updateContactExchange(c.id, { owner_notes: notes || null });
  }

  async function saveGroup(c: ContactExchange, group: string) {
    setContacts((prev) => prev.map((x) => (x.id === c.id ? { ...x, lead_group: group || null } : x)));
    setEditingGroup(null);
    await updateContactExchange(c.id, { lead_group: group || null });
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
      if (sortField === "favorites") return ((b.is_favorite ? 1 : 0) - (a.is_favorite ? 1 : 0)) * dir;
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
      {/* Stat cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {[
          { label: "Total received", value: contacts.length },
          { label: "Favorites", value: favorites },
          { label: "With email", value: withEmail },
          { label: "With phone", value: withPhone },
        ].map((s) => (
          <div key={s.label} className="rounded-2xl border p-4 text-center" style={{ backgroundColor: "#FEF9EF", borderColor: "rgba(6,78,59,0.08)" }}>
            <p className="font-serif text-2xl font-semibold text-emerald-deep">{s.value}</p>
            <p className="text-xs text-ink-light mt-0.5">{s.label}</p>
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

      {/* Group filter chips */}
      {groups.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {groups.map((g) => (
            <button
              key={g}
              onClick={() => setSearch(g!)}
              className="px-3 py-1 rounded-full text-xs font-medium border border-emerald-light/40 bg-emerald-pale/40 text-emerald-deep hover:bg-emerald-pale transition-colors"
            >
              {g}
            </button>
          ))}
        </div>
      )}

      {/* Contacts list */}
      <SectionCard title="All contacts" subtitle={`${filtered.length} contact${filtered.length !== 1 ? "s" : ""}`}>
        {/* Header */}
        <div className="hidden md:grid grid-cols-12 gap-3 px-4 py-2 rounded-xl mb-2 text-xs font-mono tracking-wide text-ink-light uppercase" style={{ backgroundColor: "#F0E6D3" }}>
          <div className="col-span-1"></div>
          <div className="col-span-3">Name</div>
          <div className="col-span-3">Contact</div>
          <div className="col-span-2">Lead Level</div>
          <div className="col-span-2">Date</div>
          <div className="col-span-1"></div>
        </div>

        <div className="space-y-1.5">
          {filtered.map((c) => {
            const leadCfg = LEAD_LEVELS.find((l) => l.value === (c.lead_level || "normal")) ?? LEAD_LEVELS[3];
            const isExpanded = expandedNotes.has(c.id);

            return (
              <div key={c.id} className="rounded-xl border transition-all hover:shadow-card" style={{ backgroundColor: "#FEFCE8", borderColor: "rgba(6,78,59,0.06)" }}>
                {/* Main row */}
                <div className="flex items-center gap-2 md:gap-3 px-3 md:px-4 py-3">
                  {/* Favorite star */}
                  <button onClick={() => toggleFavorite(c)} className="flex-shrink-0 transition-colors hover:scale-110" title={c.is_favorite ? "Remove favorite" : "Add favorite"}>
                    <Star className={`h-4 w-4 ${c.is_favorite ? "fill-gold text-gold" : "text-ink-light/30"}`} />
                  </button>

                  {/* Name + org — takes remaining space */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 min-w-0">
                      <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 font-medium text-xs" style={{ backgroundColor: "#ECFDF5", color: "#065F46" }}>
                        {c.visitor_name.split(" ").map((n) => n[0]).join("")}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-ink truncate">{c.visitor_name}</p>
                        {c.visitor_organization && <p className="text-xs text-ink-light truncate">{c.visitor_organization}</p>}
                      </div>
                    </div>
                  </div>

                  {/* Contact info — desktop only */}
                  <div className="hidden md:flex md:flex-col md:gap-0.5 md:min-w-0 md:w-1/5 md:flex-shrink-0">
                    {c.visitor_email && (
                      <a href={`mailto:${c.visitor_email}`} className="flex items-center gap-1.5 text-xs text-ink-mid hover:text-emerald-bright transition-colors truncate">
                        <Mail className="h-3 w-3 flex-shrink-0" /><span className="truncate">{c.visitor_email}</span>
                      </a>
                    )}
                    {c.visitor_phone && (
                      <a href={`tel:${c.visitor_phone}`} className="flex items-center gap-1.5 text-xs text-ink-light hover:text-emerald-bright transition-colors">
                        <Phone className="h-3 w-3 flex-shrink-0" />{c.visitor_phone}
                      </a>
                    )}
                    {c.message && <p className="text-xs text-ink-light/60 italic truncate">{c.message}</p>}
                  </div>

                  {/* Lead level dropdown — desktop only */}
                  <div className="hidden md:block md:flex-shrink-0" style={{ width: "110px" }}>
                    <div className="relative">
                      <select
                        value={c.lead_level || "normal"}
                        onChange={(e) => setLeadLevel(c, e.target.value)}
                        className="w-full px-2 py-1.5 rounded-lg text-xs font-medium border cursor-pointer appearance-none focus:outline-none focus:ring-2 focus:ring-emerald-mid/30"
                        style={{ backgroundColor: leadCfg.bg, color: leadCfg.color, borderColor: leadCfg.color + "30" }}
                      >
                        {LEAD_LEVELS.map((l) => (
                          <option key={l.value} value={l.value}>{l.label}</option>
                        ))}
                      </select>
                      <ChevronDown className="absolute right-1.5 top-1/2 -translate-y-1/2 h-3 w-3 pointer-events-none" style={{ color: leadCfg.color }} />
                    </div>
                  </div>

                  {/* Date — desktop only */}
                  <div className="hidden md:flex items-center gap-1.5 text-xs text-ink-light flex-shrink-0" style={{ width: "90px" }}>
                    <Calendar className="h-3 w-3 flex-shrink-0" />
                    <span className="whitespace-nowrap">{new Date(c.created_at).toLocaleDateString()}</span>
                  </div>

                  {/* Expand/actions */}
                  <button
                    onClick={() => setExpandedNotes((s) => {
                      const next = new Set(s);
                      isExpanded ? next.delete(c.id) : next.add(c.id);
                      return next;
                    })}
                    className={`flex-shrink-0 p-1.5 rounded-lg transition-colors ${isExpanded ? "bg-emerald-pale text-emerald-deep" : "text-ink-light/40 hover:text-ink-mid"}`}
                    title="Notes"
                  >
                    <MessageSquare className="h-4 w-4" />
                  </button>
                </div>

                {/* Mobile lead level + date */}
                <div className="md:hidden px-3 pb-2 flex items-center gap-3">
                  <div className="relative">
                    <select
                      value={c.lead_level || "normal"}
                      onChange={(e) => setLeadLevel(c, e.target.value)}
                      className="px-2 py-1 rounded-lg text-xs font-medium border cursor-pointer appearance-none focus:outline-none"
                      style={{ backgroundColor: leadCfg.bg, color: leadCfg.color, borderColor: leadCfg.color + "30" }}
                    >
                      {LEAD_LEVELS.map((l) => (
                        <option key={l.value} value={l.value}>{l.label}</option>
                      ))}
                    </select>
                  </div>
                  <span className="text-xs text-ink-light flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {new Date(c.created_at).toLocaleDateString()}
                  </span>
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
