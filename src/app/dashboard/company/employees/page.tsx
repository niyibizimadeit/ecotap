// src/app/dashboard/company/employees/page.tsx

import { Suspense } from "react";
import {
  PageHeader,
  SectionCard,
  EmptyState,
  TableSkeleton,
} from "@/components/dashboard/DashboardShared";
import { Badge } from "@/components/ui/Badge";
import { ExternalLink } from "lucide-react";
import { getCompanyDashboardData } from "@/app/actions/company.actions";
import { DeleteEmployeeButton } from "./DeleteEmployeeButton";
import { ToggleEmployeeStatusButton } from "./ToggleEmployeeStatusButton";
import { InviteButton } from "./InviteButton";

export default function EmployeesPage() {
  return (
    <div>
      <PageHeader
        eyebrow="Team"
        title="Employees"
        subtitle="Manage your team's cards and access."
        action={<InviteButton />}
      />
      <Suspense fallback={<TableSkeleton rows={5} />}>
        <EmployeesContent />
      </Suspense>
    </div>
  );
}

async function EmployeesContent() {
  const result = await getCompanyDashboardData();

  if (!result.success) {
    return (
      <EmptyState
        icon="🏢"
        title="No company linked"
        description="Your account is not linked to a company."
      />
    );
  }

  const { employees, stats } = result.data;

  if (employees.length === 0) {
    return (
      <EmptyState
        icon="👥"
        title="No employees yet"
        description="Invite team members to get started."
      />
    );
  }

  return (
    <SectionCard
      title={`${stats.total} employee${stats.total === 1 ? "" : "s"}`}
      subtitle={`${stats.active} active`}
    >
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr
              className="border-b"
              style={{ borderColor: "rgba(6,78,59,0.08)" }}
            >
              {[
                { label: "Name",    className: "px-4 py-3" },
                { label: "Email",   className: "px-4 py-3 hidden sm:table-cell" },
                { label: "Status",  className: "px-4 py-3" },
                { label: "Joined",  className: "px-4 py-3 hidden md:table-cell" },
                { label: "Card",    className: "px-4 py-3 text-right" },
                { label: "Actions", className: "px-4 py-3 text-right" },
              ].map(({ label, className }) => (
                <th
                  key={label}
                  className={`${className} text-xs font-mono tracking-widest text-ink-light uppercase`}
                >
                  {label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody
            className="divide-y"
            style={{ borderColor: "rgba(6,78,59,0.06)" }}
          >
            {employees.map((emp) => (
              <tr
                key={emp.id}
                className="hover:bg-emerald-pale/30 transition-colors"
              >
                {/* Name + title */}
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 font-medium text-xs"
                      style={{ backgroundColor: "#ECFDF5", color: "#065F46" }}
                    >
                      {emp.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-ink">{emp.name}</p>
                      <p className="text-xs text-ink-light">{emp.title}</p>
                    </div>
                  </div>
                </td>

                {/* Email */}
                <td className="px-4 py-3 text-sm text-ink-light hidden sm:table-cell">
                  {emp.email}
                </td>

                {/* Status badge */}
                <td className="px-4 py-3">
                  <Badge variant={emp.status}>{emp.status}</Badge>
                </td>

                {/* Joined date */}
                <td className="px-4 py-3 text-sm text-ink-light hidden md:table-cell">
                  {emp.joined}
                </td>

                {/* Card link */}
                <td className="px-4 py-3 text-right">
                  <a
                    href={`/${emp.username}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs text-emerald-bright hover:text-emerald-mid transition-colors"
                  >
                    <ExternalLink className="h-3 w-3" />
                    View
                  </a>
                </td>

                {/* Actions: Suspend/Activate + Delete */}
                <td className="px-2 py-3">
                  <div className="flex items-center justify-end gap-1">
                    <ToggleEmployeeStatusButton
                      employeeId={emp.id}
                      employeeName={emp.name}
                      currentStatus={emp.status}
                    />
                    <DeleteEmployeeButton
                      employeeId={emp.id}
                      employeeName={emp.name}
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </SectionCard>
  );
}