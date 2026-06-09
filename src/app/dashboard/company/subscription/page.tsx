import { PageHeader, SectionCard } from "@/components/dashboard/DashboardShared";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { CheckCircle2, Users, Calendar, Mail, ArrowRight } from "lucide-react";

const MOCK_SUB = { plan: "", status: "active" as const, employee_count: 0, billing_cycle: "monthly", next_billing: "", contact_email: "" };

const PLAN_FEATURES = [
  "Per-employee billing — pay only for active cards",
  "Full company admin dashboard",
  "Unlimited card design changes",
  "Physical NFC card ordering",
  "Team and department management",
  "Contact exchange inbox for all employees",
  "Email support",
];

export default function SubscriptionPage() {
  return (
    <div>
      <PageHeader
        eyebrow="Subscription"
        title="Billing & plan"
        subtitle="Your current plan and usage details."
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 max-w-3xl">

        {/* Current plan */}
        <SectionCard title="Current plan">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-serif text-display-sm text-emerald-deep font-semibold">{MOCK_SUB.plan}</p>
                <p className="text-xs text-ink-light">Billed monthly · per employee</p>
              </div>
              <Badge variant={MOCK_SUB.status}>{MOCK_SUB.status}</Badge>
            </div>

            <div className="h-px" style={{ backgroundColor: "rgba(6,78,59,0.08)" }} />

            <div className="space-y-3">
              {[
                { icon: <Users     className="h-4 w-4" />, label: "Active employees",  value: `${MOCK_SUB.employee_count} cards` },
                { icon: <Calendar  className="h-4 w-4" />, label: "Next billing date", value: MOCK_SUB.next_billing },
                { icon: <Mail      className="h-4 w-4" />, label: "Billing contact",   value: MOCK_SUB.contact_email },
              ].map(row => (
                <div key={row.label} className="flex items-center gap-3">
                  <div
                    className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: "#ECFDF5", color: "#065F46" }}
                  >
                    {row.icon}
                  </div>
                  <div className="flex-1 flex items-center justify-between">
                    <p className="text-xs text-ink-light">{row.label}</p>
                    <p className="text-sm font-medium text-ink">{row.value}</p>
                  </div>
                </div>
              ))}
            </div>

            <div
              className="rounded-xl p-3 text-xs leading-relaxed"
              style={{ backgroundColor: "#FEF3C7", color: "#92400E" }}
            >
              Pricing is managed by the EcoTap team. Contact us to adjust your plan or discuss volume discounts.
            </div>

            <a href="mailto:billing@ecotap.rw">
              <Button variant="secondary" size="md" className="w-full" rightIcon={<ArrowRight className="h-4 w-4" />}>
                Contact billing
              </Button>
            </a>
          </div>
        </SectionCard>

        {/* Plan features */}
        <SectionCard title="What's included">
          <ul className="space-y-3">
            {PLAN_FEATURES.map(f => (
              <li key={f} className="flex items-start gap-2.5">
                <div
                  className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                  style={{ backgroundColor: "#ECFDF5" }}
                >
                  <CheckCircle2 className="h-3 w-3" style={{ color: "#059669" }} />
                </div>
                <span className="text-sm text-ink-mid leading-relaxed">{f}</span>
              </li>
            ))}
          </ul>

          <div className="mt-6 pt-5 border-t" style={{ borderColor: "rgba(6,78,59,0.08)" }}>
            <p className="text-xs text-ink-light mb-3">Want to switch to annual and save?</p>
            <a href="mailto:billing@ecotap.rw">
              <Button variant="primary" size="md" className="w-full">
                Talk to us about annual billing
              </Button>
            </a>
          </div>
        </SectionCard>

        {/* Usage bar */}
        <div
          className="lg:col-span-2 rounded-2xl border p-5"
          style={{ backgroundColor: "#FEF9EF", borderColor: "rgba(6,78,59,0.08)" }}
        >
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm font-semibold text-emerald-deep">Employee card usage</p>
            <span className="text-xs font-mono text-ink-light">{MOCK_SUB.employee_count} active cards</span>
          </div>
          <div className="h-3 rounded-full overflow-hidden" style={{ backgroundColor: "#F0E6D3" }}>
            <div
              className="h-full rounded-full transition-all"
              style={{ width: `${(MOCK_SUB.employee_count / 20) * 100}%`, backgroundColor: "#064E3B" }}
            />
          </div>
          <p className="text-xs text-ink-light mt-2">
            {MOCK_SUB.employee_count} of your current employees have active NFC cards.
            Add more employees any time — billing adjusts automatically.
          </p>
        </div>
      </div>
    </div>
  );
}