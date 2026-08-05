// src/app/dashboard/employee/layout.tsx
//
// Server Component wrapper. Fetches user identity once, then passes it
// into the client sidebar via props. No useEffect waterfall, no flash of "—".

import { getSupabase } from "@/lib/supabase/server";
import { EmployeeSidebar } from "./_components/EmployeeSidebar";

export default async function EmployeeDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await getSupabase();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return <>{children}</>; // Middleware guards this route

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, role, username")
    .eq("id", user.id)
    .single();

  // Also fetch the card's job_title for the primary company
  const { data: pcLink } = await supabase
    .from("profile_companies")
    .select("job_title, company_id")
    .eq("profile_id", user.id)
    .eq("is_primary", true)
    .maybeSingle();

  const userName = profile?.full_name ?? "";
  const userRole = pcLink?.job_title ?? profile?.role ?? "";
  const username = profile?.username ?? "";

  const initials = userName
    .split(" ")
    .map((n: string) => n[0])
    .join("")
    .slice(0, 2);

  return (
    <EmployeeSidebar
      userName={userName}
      userRole={userRole}
      username={username}
      userInitials={initials}
    >
      {children}
    </EmployeeSidebar>
  );
}
