import { PageHeader, SectionCard } from "@/components/dashboard/DashboardShared";
import { Mail, Phone, Calendar } from "lucide-react";

const MOCK_CONTACTS = [
  { id: "1", name: "Alice Mutoni",    email: "alice@kigali.co",  phone: "+250 788 001 001", date: "Jun 6, 2026",  note: "Met at Rwanda Tech Summit" },
  { id: "2", name: "Eric Habimana",   email: "eric@bnr.rw",       phone: "+250 788 002 002", date: "Jun 5, 2026",  note: "" },
  { id: "3", name: "Grace Uwase",     email: "grace@moh.gov.rw",  phone: "",                date: "Jun 4, 2026",  note: "Interested in GiraXpress" },
  { id: "4", name: "James Karekezi",  email: "james@bk.rw",       phone: "+250 788 004 004", date: "Jun 3, 2026",  note: "" },
  { id: "5", name: "Diane Mukamana",  email: "diane@rbc.gov.rw",  phone: "+250 788 005 005", date: "Jun 2, 2026",  note: "Follow up re: health tech" },
  { id: "6", name: "Patrick Nzeyimana",email:"patrick@sanlam.rw", phone: "+250 788 006 006", date: "May 30, 2026", note: "" },
  { id: "7", name: "Sandrine Iradukunda", email: "sandrine@rdb.rw",phone:"",               date: "May 28, 2026", note: "RDB Digital Innovation dept" },
  { id: "8", name: "Claude Nkurikiye", email: "claude@bralirwa.rw",phone:"+250 788 008 008",date: "May 25, 2026", note: "" },
];

export default function ContactsPage() {
  return (
    <div>
      <PageHeader
        eyebrow="Contacts"
        title="Contact inbox"
        subtitle={`${MOCK_CONTACTS.length} people have shared their contact via your card.`}
      />

      {/* Summary row */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {[
          { label: "Total received", value: MOCK_CONTACTS.length },
          { label: "With email",     value: MOCK_CONTACTS.filter(c => c.email).length },
          { label: "With phone",     value: MOCK_CONTACTS.filter(c => c.phone).length },
        ].map(s => (
          <div
            key={s.label}
            className="rounded-2xl border p-4 text-center"
            style={{ backgroundColor: "#FEF9EF", borderColor: "rgba(6,78,59,0.08)" }}
          >
            <p className="font-serif text-2xl font-semibold text-emerald-deep">{s.value}</p>
            <p className="text-xs text-ink-light mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      <SectionCard title="All contacts" subtitle="Everyone who shared their details on your card page.">
        {/* Table header */}
        <div
          className="grid grid-cols-12 gap-3 px-4 py-2 rounded-xl mb-2 text-xs font-mono tracking-wide text-ink-light uppercase"
          style={{ backgroundColor: "#F0E6D3" }}
        >
          <div className="col-span-4">Name</div>
          <div className="col-span-4 hidden sm:block">Contact</div>
          <div className="col-span-3 hidden md:block">Date</div>
          <div className="col-span-1"></div>
        </div>

        <div className="space-y-1.5">
          {MOCK_CONTACTS.map((c) => (
            <div
              key={c.id}
              className="grid grid-cols-12 gap-3 px-4 py-3.5 rounded-xl border items-center transition-all hover:shadow-card group"
              style={{ backgroundColor: "#FEFCE8", borderColor: "rgba(6,78,59,0.06)" }}
            >
              {/* Name + note */}
              <div className="col-span-4 flex items-center gap-3 min-w-0">
                <div
                  className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 font-medium text-xs"
                  style={{ backgroundColor: "#ECFDF5", color: "#065F46" }}
                >
                  {c.name.split(" ").map(n => n[0]).join("")}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-ink truncate">{c.name}</p>
                  {c.note && (
                    <p className="text-xs text-ink-light truncate italic">{c.note}</p>
                  )}
                </div>
              </div>

              {/* Email + phone */}
              <div className="col-span-4 hidden sm:block space-y-0.5 min-w-0">
                {c.email && (
                  <a
                    href={`mailto:${c.email}`}
                    className="flex items-center gap-1.5 text-xs text-ink-mid hover:text-emerald-bright transition-colors truncate"
                  >
                    <Mail className="h-3 w-3 flex-shrink-0" />
                    <span className="truncate">{c.email}</span>
                  </a>
                )}
                {c.phone && (
                  <a
                    href={`tel:${c.phone}`}
                    className="flex items-center gap-1.5 text-xs text-ink-light hover:text-emerald-bright transition-colors"
                  >
                    <Phone className="h-3 w-3 flex-shrink-0" />
                    {c.phone}
                  </a>
                )}
              </div>

              {/* Date */}
              <div className="col-span-3 hidden md:flex items-center gap-1.5 text-xs text-ink-light">
                <Calendar className="h-3 w-3" />
                {c.date}
              </div>

              {/* Actions */}
              <div className="col-span-8 sm:col-span-4 md:col-span-1 flex justify-end">
                <a
                  href={c.email ? `mailto:${c.email}` : `tel:${c.phone}`}
                  className="text-xs font-medium px-3 py-1.5 rounded-lg border transition-all opacity-0 group-hover:opacity-100"
                  style={{
                    borderColor: "rgba(6,78,59,0.15)",
                    color: "#064E3B",
                    backgroundColor: "#ECFDF5",
                  }}
                >
                  Reply
                </a>
              </div>
            </div>
          ))}
        </div>

        {/* Empty state note */}
        <p className="text-xs text-ink-light text-center mt-6 font-mono">
          Contacts are collected from your public card page — no action needed from you.
        </p>
      </SectionCard>
    </div>
  );
}