// src/app/dashboard/company/layout.tsx
//
// Server Component wrapper. Fetches company identity once, then passes it
// into the client sidebar via props. No useEffect waterfall, no flash of "—".

import { getCompanyDashboardData } from "@/app/actions/company.actions";
import CompanySidebar from "./_components/CompanySidebar";

export default async function CompanyDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const result = await getCompanyDashboardData();

  // If no company is linked, render a fallback layout instead of redirecting.
  // Redirecting to /dashboard/employee causes a loop because the middleware
  // only allows company_admin at /dashboard/company — it bounces them right back.
  if (!result.success) {
    return (
      <div className="min-h-screen flex" style={{ backgroundColor: "#FEFCE8" }}>
        <div className="flex-1 flex flex-col min-h-screen">
          <main className="flex-1 pt-14 lg:pt-0 px-5 lg:px-8 py-8 max-w-5xl w-full mx-auto">
            <div className="flex items-center justify-center min-h-[60vh]">
              <div className="text-center max-w-md">
                <div className="w-14 h-14 rounded-2xl bg-amber-50 flex items-center justify-center mx-auto mb-5">
                  <span className="text-2xl">🏢</span>
                </div>
                <h2 className="text-xl font-serif font-semibold text-emerald-deep mb-2">
                  No company linked
                </h2>
                <p className="text-sm text-ink-light mb-2">
                  Your account is not linked to a company yet.
                </p>
                <p className="text-xs text-ink-light">
                  If you just registered, your account may still be under review.
                  Please contact support if this issue persists.
                </p>
              </div>
            </div>
          </main>
        </div>
      </div>
    );
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