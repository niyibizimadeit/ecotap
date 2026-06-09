import Link from "next/link";
import { Eye, Users, Package, ArrowRight, CheckCircle2, Clock } from "lucide-react";
import { StatCard, PageHeader } from "@/components/dashboard/DashboardShared";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";

const MOCK_STATS = {
  cardViews:   142,
  contacts:    18,
  orderStatus: "delivered" as const,
};

const MOCK_RECENT_CONTACTS = [
  { name: "Alice Mutoni",   email: "alice@kigali.co",   time: "2 hours ago"  },
  { name: "Eric Habimana",  email: "eric@bnr.rw",        time: "Yesterday"    },
  { name: "Grace Uwase",    email: "grace@moh.gov.rw",   time: "2 days ago"   },
  { name: "James Karekezi", email: "james@bk.rw",        time: "3 days ago"   },
];

const MOCK_ACTIVITY = [
  { text: "Card viewed by someone in Kigali",  time: "10 min ago", done: true  },
  { text: "Alice Mutoni saved your contact",   time: "2 hrs ago",  done: true  },
  { text: "Your NFC card was delivered",       time: "Yesterday",  done: true  },
  { text: "Profile last updated",              time: "3 days ago", done: false },
];

export default function EmployeeOverviewPage() {
  return (
    <div>
      <PageHeader
        eyebrow="Dashboard"
        title="Welcome back, Frankie"
        subtitle="Here's how your card is performing."
        action={
          <Link href={`/ntwali-frankie`} target="_blank">
            <Button variant="secondary" size="sm" rightIcon={<ArrowRight className="h-3.5 w-3.5" />}>
              View my card
            </Button>
          </Link>
        }
      />

      {/* Status banner */}
      <div
        className="rounded-2xl p-4 mb-6 flex items-center gap-3 border"
        style={{ backgroundColor: "#ECFDF5", borderColor: "rgba(5,150,105,0.2)" }}
      >
        <CheckCircle2 className="h-5 w-5 flex-shrink-0" style={{ color: "#059669" }} />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-emerald-deep">Your card is active and public</p>
          <p className="text-xs text-ink-light">
            ecotap.rw/ntwali-frankie · NFC card delivered
          </p>
        </div>
        <Badge variant="active">Active</Badge>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <StatCard
          label="Card views"
          value={MOCK_STATS.cardViews}
          sub="All time"
          icon={<Eye className="h-5 w-5" />}
        />
        <StatCard
          label="Contacts received"
          value={MOCK_STATS.contacts}
          sub="From your card page"
          icon={<Users className="h-5 w-5" />}
          accent="#D97706"
        />
        <StatCard
          label="Card order"
          value="Delivered"
          sub="Physical NFC card"
          icon={<Package className="h-5 w-5" />}
          accent="#059669"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Recent contacts */}
        <div
          className="rounded-2xl border overflow-hidden"
          style={{ backgroundColor: "#FEF9EF", borderColor: "rgba(6,78,59,0.08)" }}
        >
          <div className="px-6 py-4 border-b flex items-center justify-between" style={{ borderColor: "rgba(6,78,59,0.08)" }}>
            <h2 className="font-serif text-lg font-semibold text-emerald-deep">Recent contacts</h2>
            <Link href="/dashboard/employee/contacts">
              <button className="text-xs text-emerald-bright hover:text-emerald-mid underline underline-offset-4 transition-colors">
                View all
              </button>
            </Link>
          </div>
          <div className="divide-y" style={{ borderColor: "rgba(6,78,59,0.06)" }}>
            {MOCK_RECENT_CONTACTS.map((c) => (
              <div key={c.email} className="px-6 py-3.5 flex items-center gap-3">
                <div
                  className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 font-medium text-xs"
                  style={{ backgroundColor: "#ECFDF5", color: "#065F46" }}
                >
                  {c.name.split(" ").map(n => n[0]).join("")}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-ink truncate">{c.name}</p>
                  <p className="text-xs text-ink-light truncate">{c.email}</p>
                </div>
                <span className="text-xs text-ink-light flex-shrink-0">{c.time}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Activity feed */}
        <div
          className="rounded-2xl border overflow-hidden"
          style={{ backgroundColor: "#FEF9EF", borderColor: "rgba(6,78,59,0.08)" }}
        >
          <div className="px-6 py-4 border-b" style={{ borderColor: "rgba(6,78,59,0.08)" }}>
            <h2 className="font-serif text-lg font-semibold text-emerald-deep">Recent activity</h2>
          </div>
          <div className="px-6 py-4 space-y-4">
            {MOCK_ACTIVITY.map((a, i) => (
              <div key={i} className="flex items-start gap-3">
                <div
                  className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                  style={{ backgroundColor: a.done ? "#ECFDF5" : "#F0E6D3" }}
                >
                  {a.done
                    ? <CheckCircle2 className="h-3.5 w-3.5" style={{ color: "#059669" }} />
                    : <Clock        className="h-3.5 w-3.5" style={{ color: "#D97706" }} />
                  }
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-ink-mid">{a.text}</p>
                  <p className="text-xs text-ink-light mt-0.5">{a.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick links */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
        {[
          {
            title: "Edit your card",
            sub:   "Update your profile, bio, and social links",
            href:  "/dashboard/employee/profile",
            icon:  "✏️",
          },
          {
            title: "Order more cards",
            sub:   "Get additional NFC cards for yourself",
            href:  "/dashboard/employee/orders",
            icon:  "📦",
          },
        ].map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="rounded-2xl border p-5 flex items-center gap-4 group hover:-translate-y-0.5 transition-all duration-200 hover:shadow-card-lg"
            style={{ backgroundColor: "#FEF9EF", borderColor: "rgba(6,78,59,0.08)" }}
          >
            <span className="text-2xl">{item.icon}</span>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-emerald-deep">{item.title}</p>
              <p className="text-xs text-ink-light mt-0.5">{item.sub}</p>
            </div>
            <ArrowRight className="h-4 w-4 text-ink-light group-hover:text-emerald-bright transition-colors flex-shrink-0" />
          </Link>
        ))}
      </div>
    </div>
  );
}