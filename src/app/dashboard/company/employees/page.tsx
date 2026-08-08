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
      {/* Desktop: table view */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr
              className="border-b"
              style={{ borderColor: "rgba(6,78,59,0.08)" }}
            >
              {[
                { label: "Name",    className: "px-4 py-3" },
                { label: "Email",   className: "px-4 py-3" },
                { label: "Status",  className: "px-4 py-3" },
                { label: "Joined",  className: "px-4 py-3" },
                { label: "Card",    className: "px-4 py-3 text-right" },
                { label: "Actions", className: "px-4 py-3 text-right" },
              ].map(({ label, className }) => (
                <th
                  key={label}
                  scope="col"
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
                <td className="px-4 py-3 text-sm text-ink-light">
                  {emp.email}
                </td>

                {/* Status badge */}
                <td className="px-4 py-3">
                  <Badge variant={emp.status}>{emp.status}</Badge>
                </td>

                {/* Joined date */}
                <td className="px-4 py-3 text-sm text-ink-light">
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

      {/* Mobile: card view */}
      <div className="md:hidden space-y-3">
        {employees.map((emp) => (
          <div
            key={emp.id}
            className="rounded-2xl border p-4"
            style={{ backgroundColor: "#FEFCE8", borderColor: "rgba(6,78,59,0.08)" }}
          >
            {/* Top row: avatar + name + status */}
            <div className="flex items-start justify-between gap-3 mb-3">
              <div className="flex items-center gap-3 min-w-0">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 font-medium text-sm"
                  style={{ backgroundColor: "#ECFDF5", color: "#065F46" }}
                >
                  {emp.name.split(" ").map((n) => n[0]).join("")}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-ink truncate">{emp.name}</p>
                  <p className="text-xs text-ink-light truncate">{emp.title}</p>
                </div>
              </div>
              <Badge variant={emp.status}>{emp.status}</Badge>
            </div>

            {/* Detail rows */}
            <div className="space-y-1.5 mb-3 text-sm">
              <div className="flex items-center gap-2">
                <span className="text-xs text-ink-light w-10 flex-shrink-0">Email</span>
                <span className="text-ink-mid truncate">{emp.email}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-ink-light w-10 flex-shrink-0">Joined</span>
                <span className="text-ink-mid">{emp.joined}</span>
              </div>
            </div>

            {/* Bottom row: card link + actions */}
            <div className="flex items-center justify-between pt-2 border-t" style={{ borderColor: "rgba(6,78,59,0.06)" }}>
              <a
                href={`/${emp.username}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-xs text-emerald-bright hover:text-emerald-mid transition-colors"
              >
                <ExternalLink className="h-3 w-3" />
                View card
              </a>
              <div className="flex items-center gap-1">
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
            </div>
          </div>
        ))}
      </div>
    </SectionCard>
  );
}