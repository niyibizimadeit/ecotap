"use client";

import { useState } from "react";
import { PageHeader } from "@/components/dashboard/DashboardShared";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { CheckCircle2, Truck, PackageCheck, MapPin, Calendar } from "lucide-react";
import type { OrderStatus } from "@/types";

interface AdminOrder {
  id: string; user: string; company: string | null;
  design: string; designColor: string;
  quantity: number; address: string; city: string;
  status: OrderStatus; submitted: string;
}

const INITIAL_ORDERS: AdminOrder[] = [
  { id:"ORD-2026-001", user:"Ntwali Frankie",     company:null,       design:"Classic Emerald", designColor:"#064E3B", quantity:50, address:"KG 123 St, Gasabo", city:"Kigali", status:"pending",   submitted:"1 hour ago"   },
  { id:"ORD-2026-002", user:"Amara Uwimana",        company:"RDMC Ltd", design:"Midnight Dark",   designColor:"#1a1a2e", quantity:10, address:"KN 12 Ave, Nyarugenge", city:"Kigali", status:"approved",  submitted:"3 hours ago"  },
  { id:"ORD-2026-003", user:"Eric Hakizimana",      company:"RDMC Ltd", design:"Royal Navy",      designColor:"#1e3a5f", quantity:5,  address:"KK 15 Rd, Kicukiro",   city:"Kigali", status:"shipped",   submitted:"2 days ago"   },
  { id:"ORD-2026-004", user:"Grace Uwase",           company:"RDMC Ltd", design:"Classic Emerald", designColor:"#064E3B", quantity:20, address:"KG 9 Ave, Gasabo",     city:"Kigali", status:"delivered", submitted:"1 week ago"   },
  { id:"ORD-2026-005", user:"Jean-Paul Habimana",   company:null,       design:"Terracotta",      designColor:"#7c2d12", quantity:2,  address:"KN 3 St, Nyarugenge",  city:"Kigali", status:"pending",   submitted:"Yesterday"    },
];

const STATUS_NEXT: Partial<Record<OrderStatus, { label: string; next: OrderStatus; icon: React.ReactNode }>> = {
  pending:  { label: "Approve",      next: "approved",  icon: <CheckCircle2 className="h-3.5 w-3.5" /> },
  approved: { label: "Mark shipped", next: "shipped",   icon: <Truck        className="h-3.5 w-3.5" /> },
  shipped:  { label: "Mark delivered",next:"delivered", icon: <PackageCheck className="h-3.5 w-3.5" /> },
};

const STATUS_COLORS: Record<OrderStatus, string> = {
  pending:   "#FEF3C7",
  approved:  "#ECFDF5",
  shipped:   "#EFF6FF",
  delivered: "#F0FDF4",
};

export default function AdminOrdersPage() {
  const [orders,       setOrders]       = useState(INITIAL_ORDERS);
  const [filter,       setFilter]       = useState<OrderStatus|"all">("all");
  const [loadingId,    setLoadingId]    = useState<string|null>(null);

  const filtered = filter === "all" ? orders : orders.filter(o => o.status === filter);

  async function advance(id: string, nextStatus: OrderStatus) {
    setLoadingId(id);
    await new Promise(r => setTimeout(r, 800));
    setOrders(os => os.map(o => o.id === id ? { ...o, status: nextStatus } : o));
    setLoadingId(null);
  }

  const counts = orders.reduce((acc, o) => {
    acc[o.status] = (acc[o.status] ?? 0) + 1;
    return acc;
  }, {} as Record<OrderStatus, number>);

  return (
    <div>
      <PageHeader
        eyebrow="Card Orders"
        title="Order management"
        subtitle={`${orders.length} total orders · ${counts.pending ?? 0} pending review`}
      />

      {/* Status filter tabs */}
      <div className="flex gap-2 flex-wrap mb-6">
        {(["all","pending","approved","shipped","delivered"] as const).map(s => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className="px-3 py-1.5 rounded-xl text-xs font-medium capitalize border transition-all"
            style={{
              backgroundColor: filter === s ? "#064E3B" : "#FEF9EF",
              color:           filter === s ? "#FEFCE8" : "#78716C",
              borderColor:     filter === s ? "#064E3B" : "rgba(6,78,59,0.12)",
            }}
          >
            {s === "all" ? "All orders" : s}
            {s !== "all" && counts[s] ? (
              <span className="ml-1.5 font-mono">{counts[s]}</span>
            ) : null}
          </button>
        ))}
      </div>

      <div className="space-y-4">
        {filtered.map(order => {
          const nextAction = STATUS_NEXT[order.status];
          return (
            <div
              key={order.id}
              className="rounded-2xl border overflow-hidden"
              style={{ backgroundColor: "#FEF9EF", borderColor: "rgba(6,78,59,0.08)" }}
            >
              {/* Header */}
              <div
                className="px-6 py-3.5 border-b flex items-center justify-between gap-3"
                style={{ backgroundColor: STATUS_COLORS[order.status], borderColor: "rgba(6,78,59,0.06)" }}
              >
                <div className="flex items-center gap-3">
                  <span className="text-xs font-mono text-ink-light">{order.id}</span>
                  {order.company && (
                    <span
                      className="text-xs font-mono px-2 py-0.5 rounded-lg"
                      style={{ backgroundColor: "rgba(6,78,59,0.08)", color: "#065F46" }}
                    >
                      {order.company}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-ink-light flex items-center gap-1">
                    <Calendar className="h-3 w-3" /> {order.submitted}
                  </span>
                  <Badge variant={order.status}>{order.status}</Badge>
                </div>
              </div>

              {/* Body */}
              <div className="px-6 py-4 grid grid-cols-2 md:grid-cols-5 gap-4 items-center">
                {/* User */}
                <div className="col-span-2 md:col-span-1 flex items-center gap-2">
                  <div
                    className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 text-xs font-medium"
                    style={{ backgroundColor: "#ECFDF5", color: "#065F46" }}
                  >
                    {order.user.split(" ").map(n => n[0]).join("")}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-ink truncate">{order.user}</p>
                    <p className="text-xs text-ink-light">Cardholder</p>
                  </div>
                </div>

                {/* Design */}
                <div className="flex items-center gap-2">
                  <div className="w-8 h-5 rounded flex-shrink-0" style={{ backgroundColor: order.designColor }} />
                  <div>
                    <p className="text-xs text-ink-light">Design</p>
                    <p className="text-sm font-medium text-ink">{order.design}</p>
                  </div>
                </div>

                {/* Qty */}
                <div>
                  <p className="text-xs text-ink-light">Quantity</p>
                  <p className="text-sm font-medium text-ink">{order.quantity} cards</p>
                </div>

                {/* Address */}
                <div>
                  <p className="text-xs text-ink-light flex items-center gap-1"><MapPin className="h-3 w-3" />Ship to</p>
                  <p className="text-sm text-ink truncate">{order.city}</p>
                  <p className="text-xs text-ink-light truncate">{order.address}</p>
                </div>

                {/* Action */}
                <div className="flex justify-end">
                  {nextAction ? (
                    <Button
                      variant="primary"
                      size="sm"
                      loading={loadingId === order.id}
                      leftIcon={loadingId !== order.id ? nextAction.icon : undefined}
                      onClick={() => advance(order.id, nextAction.next)}
                    >
                      {nextAction.label}
                    </Button>
                  ) : (
                    <span
                      className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-xl"
                      style={{ backgroundColor: "#ECFDF5", color: "#065F46" }}
                    >
                      <PackageCheck className="h-3.5 w-3.5" /> Complete
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}

        {filtered.length === 0 && (
          <div
            className="rounded-2xl border p-16 text-center"
            style={{ backgroundColor: "#FEF9EF", borderColor: "rgba(6,78,59,0.08)" }}
          >
            <p className="font-serif text-xl text-emerald-deep mb-1">No {filter} orders</p>
            <p className="text-sm text-ink-light">Orders will appear here as they come in.</p>
          </div>
        )}
      </div>
    </div>
  );
}