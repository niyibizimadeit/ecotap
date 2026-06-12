import { Suspense } from "react";
import { PageHeader, SectionCard, TableSkeleton, EmptyState } from "@/components/dashboard/DashboardShared";
import { getSupabase } from "@/lib/supabase/server";
import * as contactsService from "@/lib/services/contacts.service";
import { Mail, Phone, Calendar, AlertTriangle, Inbox } from "lucide-react";

export default function ContactsPage() {
  return (
    <div>
      <PageHeader
        eyebrow="Contacts"
        title="Contact inbox"
        subtitle="People who have shared their contact via your card."
      />
      <Suspense fallback={<ContactsSkeleton />}>
        <ContactsContent />
      </Suspense>
    </div>
  );
}

function ContactsSkeleton() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-3 gap-4">
        <div className="h-20 rounded-2xl skeleton" />
        <div className="h-20 rounded-2xl skeleton" />
        <div className="h-20 rounded-2xl skeleton" />
      </div>
      <SectionCard title="All contacts"><TableSkeleton rows={5} /></SectionCard>
    </div>
  );
}

async function ContactsContent() {
  const supabase = await getSupabase();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const result = await contactsService.getInbox(user.id);
  if (!result.success || !result.data) {
    return <EmptyState icon={<AlertTriangle className="h-8 w-8 text-gold-light" />} title="Could not load contacts" description="Please try again later." />;
  }

  const contacts = result.data;

  if (contacts.length === 0) {
    return <EmptyState icon={<Inbox className="h-8 w-8 text-ink-light" />} title="No contacts yet" description="When visitors submit their info on your card page, they'll appear here." />;
  }

  const withEmail = contacts.filter(c => c.visitor_email).length;
  const withPhone = contacts.filter(c => c.visitor_phone).length;

  return (
    <>
      <div className="grid grid-cols-3 gap-4 mb-6">
        {[
          { label: "Total received", value: contacts.length },
          { label: "With email",     value: withEmail },
          { label: "With phone",     value: withPhone },
        ].map(s => (
          <div key={s.label} className="rounded-2xl border p-4 text-center" style={{ backgroundColor: "#FEF9EF", borderColor: "rgba(6,78,59,0.08)" }}>
            <p className="font-serif text-2xl font-semibold text-emerald-deep">{s.value}</p>
            <p className="text-xs text-ink-light mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      <SectionCard title="All contacts" subtitle="Everyone who shared their details on your card page.">
        <div className="grid grid-cols-12 gap-3 px-4 py-2 rounded-xl mb-2 text-xs font-mono tracking-wide text-ink-light uppercase" style={{ backgroundColor: "#F0E6D3" }}>
          <div className="col-span-4">Name</div>
          <div className="col-span-4 hidden sm:block">Contact</div>
          <div className="col-span-3 hidden md:block">Date</div>
          <div className="col-span-1"></div>
        </div>

        <div className="space-y-1.5">
          {contacts.map((c) => (
            <div key={c.id} className="grid grid-cols-12 gap-3 px-4 py-3.5 rounded-xl border items-center transition-all hover:shadow-card group" style={{ backgroundColor: "#FEFCE8", borderColor: "rgba(6,78,59,0.06)" }}>
              <div className="col-span-4 flex items-center gap-3 min-w-0">
                <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 font-medium text-xs" style={{ backgroundColor: "#ECFDF5", color: "#065F46" }}>
                  {c.visitor_name.split(" ").map(n => n[0]).join("")}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-ink truncate">{c.visitor_name}</p>
                  {c.visitor_organization && <p className="text-xs text-ink-light truncate">{c.visitor_organization}</p>}
                  {c.message && <p className="text-xs text-ink-light truncate italic">{c.message}</p>}
                </div>
              </div>
              <div className="col-span-4 hidden sm:block space-y-0.5 min-w-0">
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
              </div>
              <div className="col-span-3 hidden md:flex items-center gap-1.5 text-xs text-ink-light">
                <Calendar className="h-3 w-3" />
                {new Date(c.created_at).toLocaleDateString()}
              </div>
              <div className="col-span-8 sm:col-span-4 md:col-span-1 flex justify-end">
                <a href={c.visitor_email ? `mailto:${c.visitor_email}` : c.visitor_phone ? `tel:${c.visitor_phone}` : "#"} className="text-xs font-medium px-3 py-1.5 rounded-lg border transition-all opacity-0 group-hover:opacity-100" style={{ borderColor: "rgba(6,78,59,0.15)", color: "#064E3B", backgroundColor: "#ECFDF5" }}>
                  Reply
                </a>
              </div>
            </div>
          ))}
        </div>
        <p className="text-xs text-ink-light text-center mt-6 font-mono">Contacts are collected from your public card page — no action needed from you.</p>
      </SectionCard>
    </>
  );
}
