// src/app/dashboard/company/layout.tsx
//
// Server Component wrapper. Fetches company identity once, then passes it
// into the client sidebar via props. No useEffect waterfall, no flash of "—".

import { redirect } from "next/navigation";
import { getCompanyDashboardData } from "@/app/actions/company.actions";
import CompanySidebar from "./_components/CompanySidebar";

export default async function CompanyDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const result = await getCompanyDashboardData();

  if (!result.success) {
    // NO_COMPANY_LINKED means this user has no company — send them to employee
    redirect("/dashboard/employee");
  }

  const { company } = result.data;

  const initials = company.name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="min-h-screen flex" style={{ backgroundColor: "#FEFCE8" }}>
      <CompanySidebar
        companyName={company.name}
        companySlug={company.slug}
        companyInitials={initials}
      />

      {/* Main content — offset by sidebar width on desktop */}
      <div className="flex-1 lg:ml-64 flex flex-col min-h-screen">
        <main className="flex-1 pt-14 lg:pt-0 px-5 lg:px-8 py-8 max-w-5xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}