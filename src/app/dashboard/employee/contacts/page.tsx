import { Suspense } from "react";
import { PageHeader, SectionCard, TableSkeleton, EmptyState } from "@/components/dashboard/DashboardShared";
import { getSupabase } from "@/lib/supabase/server";
import * as contactsService from "@/lib/services/contacts.service";
import { Mail, Phone, Calendar, AlertTriangle, Inbox } from "lucide-react";
import { ContactsClient } from "./ContactsClient";

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

  return <ContactsClient initialContacts={contacts} />;
}
