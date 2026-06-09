import { Suspense } from "react";
import Link from "next/link";
import { PageHeader, SectionCard, EmptyState, TableSkeleton } from "@/components/dashboard/DashboardShared";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Search, ExternalLink, UserPlus } from "lucide-react";
import { getSupabase, getServiceSupabase } from "@/lib/supabase/server";

export default function EmployeesPage() {
  return (
    <div>
      <PageHeader
        eyebrow="Team"
        title="Employees"
        subtitle="Manage your team's cards and access."
        action={
          <Link href="/dashboard/company/employees">
            <Button variant="primary" size="sm" leftIcon={<UserPlus className="h-3.5 w-3.5" />}>
              Invite employee
            </Button>
          </Link>
        }
      />
      <Suspense fallback={<TableSkeleton rows={5} />}>
        <EmployeesContent />
      </Suspense>
    </div>
  );
}

async function EmployeesContent() {
  const supabase = await getSupabase();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: link } = await supabase
    .from("profile_companies")
    .select("company_id")
    .eq("profile_id", user.id)
    .eq("is_primary", true)
    .single();

  if (!link?.company_id) {
    return <EmptyState icon="🏢" title="No company linked" description="Your account is not linked to a company." />;
  }

  const serviceClient = getServiceSupabase();

  const { data: links } = await serviceClient
    .from("profile_companies")
    .select("profile_id, job_title, is_primary")
    .eq("company_id", link.company_id);

  if (!links?.length) {
    return <EmptyState icon="👥" title="No employees yet" description="Invite team members to get started." />;
  }

  const profileIds = links.map(l => l.profile_id);
  const { data: profiles } = await serviceClient
    .from("profiles")
    .select("id, full_name, email, status, username, created_at")
    .in("id", profileIds);

  const employees = (profiles ?? []).map(p => {
    const l = links.find(link => link.profile_id === p.id);
    return {
      id: p.id,
      name: p.full_name,
      title: (l?.job_title as string) ?? "—",
      email: p.email,
      status: p.status as "active" | "pending" | "suspended",
      slug: p.username,
      joined: p.created_at ? new Date(p.created_at).toLocaleDateString() : "—",
    };
  });

  return (
    <SectionCard title={`${employees.length} employees`} subtitle={`${employees.filter(e => e.status === "active").length} active`}>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b" style={{ borderColor: "rgba(6,78,59,0.08)" }}>
              <th className="px-4 py-3 text-xs font-mono tracking-widest text-ink-light uppercase">Name</th>
              <th className="px-4 py-3 text-xs font-mono tracking-widest text-ink-light uppercase hidden sm:table-cell">Email</th>
              <th className="px-4 py-3 text-xs font-mono tracking-widest text-ink-light uppercase">Status</th>
              <th className="px-4 py-3 text-xs font-mono tracking-widest text-ink-light uppercase hidden md:table-cell">Joined</th>
              <th className="px-4 py-3 text-xs font-mono tracking-widest text-ink-light uppercase text-right">Card</th>
            </tr>
          </thead>
          <tbody className="divide-y" style={{ borderColor: "rgba(6,78,59,0.06)" }}>
            {employees.map(emp => (
              <tr key={emp.id} className="hover:bg-emerald-pale/30 transition-colors">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 font-medium text-xs" style={{ backgroundColor: "#ECFDF5", color: "#065F46" }}>
                      {emp.name.split(" ").map((n: string) => n[0]).join("")}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-ink">{emp.name}</p>
                      <p className="text-xs text-ink-light">{emp.title}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 text-sm text-ink-light hidden sm:table-cell">{emp.email}</td>
                <td className="px-4 py-3"><Badge variant={emp.status}>{emp.status}</Badge></td>
                <td className="px-4 py-3 text-sm text-ink-light hidden md:table-cell">{emp.joined}</td>
                <td className="px-4 py-3 text-right">
                  <a href={`/${emp.slug}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-xs text-emerald-bright hover:text-emerald-mid transition-colors">
                    <ExternalLink className="h-3 w-3" /> View
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </SectionCard>
  );
}
