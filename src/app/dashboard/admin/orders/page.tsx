"use client";

import { useState, useEffect } from "react";
import { PageHeader } from "@/components/dashboard/DashboardShared";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { CheckCircle2, Truck, PackageCheck, MapPin, Calendar, ShieldCheck, CreditCard, Image as ImageIcon } from "lucide-react";
import { approveOrder, markOrderShipped, markOrderDelivered, verifyPayment, fetchOrders } from "@/app/actions/admin.actions";
import type { OrderStatus } from "@/types";

/* Raw shape coming from the enriched getAllOrders query */
interface RawOrder {
  id: string;
  profile_id: string;
  design_id: string;
  quantity: number;
  shipping_address: Record<string, unknown>;
  status: OrderStatus;
  tracking_info: string | null;
  admin_notes: string | null;
  created_at: string;
  updated_at: string;
  payment_status: string;
  payment_amount: number | null;
  payment_currency: string;
  payment_screenshot_url: string | null;
  momo_phone: string | null;
  profile: { full_name: string; email: string } | null;
  design: { name: string; accent_color: string } | null;
}

interface AdminOrder {
  id: string;
  user: string;
  initials: string;
  design: string;
  designColor: string;
  quantity: number;
  address: string;
  city: string;
  status: OrderStatus;
  submitted: string;
  payment_status: string;
  payment_amount: number | null;
  payment_currency: string;
  payment_screenshot_url: string | null;
}

function mapOrder(raw: RawOrder): AdminOrder {
  const addr = (raw.shipping_address ?? {}) as Record<string, string>;
  const user = raw.profile?.full_name ?? raw.profile?.email ?? "Unknown";
  const initials = user === "Unknown" ? "?" : user.split(" ").map((n: string) => n[0]).join("").slice(0, 2).toUpperCase();
  const date = raw.created_at
    ? new Date(raw.created_at).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })
    : "—";

  return {
    id: raw.id,
    user,
    initials,
    design: raw.design?.name ?? "—",
    designColor: raw.design?.accent_color ?? "#cccccc",
    quantity: raw.quantity,
    address: addr.street ?? "—",
    city: addr.city ?? "—",
    status: raw.status,
    submitted: date,
    payment_status: raw.payment_status ?? "unpaid",
    payment_amount: raw.payment_amount,
    payment_currency: raw.payment_currency ?? "USD",
    payment_screenshot_url: raw.payment_screenshot_url,
  };
}

const STATUS_NEXT: Partial<Record<OrderStatus, { label: string; next: OrderStatus; icon: React.ReactNode }>> = {
  pending:   { label: "Approve",       next: "approved",  icon: <CheckCircle2 className="h-3.5 w-3.5" /> },
  approved:  { label: "Mark shipped",  next: "shipped",   icon: <Truck        className="h-3.5 w-3.5" /> },
  shipped:   { label: "Mark delivered",next: "delivered", icon: <PackageCheck className="h-3.5 w-3.5" /> },
};

const STATUS_COLORS: Record<OrderStatus, string> = {
  pending:   "#FEF3C7",
  approved:  "#ECFDF5",
  shipped:   "#EFF6FF",
  delivered: "#F0FDF4",
};

const PAYMENT_COLORS: Record<string, string> = {
  unpaid:   "#FEF3C7",
  paid:     "#EFF6FF",
  verified: "#ECFDF5",
};

const PAYMENT_LABELS: Record<string, string> = {
  unpaid:   "Unpaid",
  paid:     "Paid",
  verified: "Verified",
};

export default function AdminOrdersPage() {
  const [orders,    setOrders]    = useState<AdminOrder[]>([]);
  const [filter,    setFilter]    = useState<OrderStatus | "all">("all");
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const filtered = filter === "all" ? orders : orders.filter(o => o.status === filter);

  useEffect(() => {
    async function load() {
      const result = await fetchOrders();
      if (result.success && result.data) {
        setOrders((result.data as unknown as RawOrder[]).map(mapOrder));
      }
    }
    load();
  }, []);

  async function handleVerifyPayment(id: string) {
    setLoadingId(id);
    const result = await verifyPayment(id);
    if (result.success) {
      setOrders(os => os.map(o => o.id === id ? { ...o, payment_status: "verified" } : o));
    }
    setLoadingId(null);
  }

  async function advance(id: string, nextStatus: OrderStatus) {
    setLoadingId(id);
    const action = nextStatus === "approved" ? approveOrder : nextStatus === "shipped" ? markOrderShipped : markOrderDelivered;
    const result = await action(id);
    if (result.success) {
      setOrders(os => os.map(o => o.id === id ? { ...o, status: nextStatus } : o));
    } else {
      alert(result.error ?? "Action failed.");
    }
    setLoadingId(null);
  }

  const counts = orders.reduce((acc, o) => {
    acc[o.status] = (acc[o.status] ?? 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  function formatAmount(order: AdminOrder): string {
    if (!order.payment_amount) return "—";
    if (order.payment_currency === "RWF") return `${order.payment_amount.toLocaleString()} RWF`;
    return `$${order.payment_amount}`;
  }

  return (
    <div>
      <PageHeader
        eyebrow="Card Orders"
        title="Order management"
        subtitle={`${orders.length} total orders · ${counts.pending ?? 0} pending review`}
      />

      {/* Status filter tabs */}
      <div className="flex gap-2 flex-wrap mb-6">
        {(["all", "pending", "approved", "shipped", "delivered"] as const).map(s => (
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

      {/* Image preview modal */}
      {previewImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
          onClick={() => setPreviewImage(null)}
        >
          <div className="max-w-2xl max-h-[90vh] p-2">
            <img
              src={previewImage}
              alt="Payment screenshot"
              className="max-w-full max-h-[85vh] rounded-2xl shadow-2xl"
            />
            <button
              onClick={() => setPreviewImage(null)}
              className="mt-3 mx-auto block text-xs text-white/70 hover:text-white"
            >
              Click anywhere to close
            </button>
          </div>
        </div>
      )}

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
                className="px-6 py-3.5 border-b flex items-center justify-between gap-3 flex-wrap"
                style={{ backgroundColor: STATUS_COLORS[order.status], borderColor: "rgba(6,78,59,0.06)" }}
              >
                <div className="flex items-center gap-3">
                  <span className="text-xs font-mono text-ink-light">{order.id.slice(0, 8)}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-ink-light flex items-center gap-1">
                    <Calendar className="h-3 w-3" /> {order.submitted}
                  </span>
                  <Badge variant={order.status}>{order.status}</Badge>
                </div>
              </div>

              {/* Body */}
              <div className="px-6 py-4 space-y-4">
                {/* Order info row */}
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4 items-center">
                  <div className="col-span-2 md:col-span-1 flex items-center gap-2">
                    <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 text-xs font-medium"
                      style={{ backgroundColor: "#ECFDF5", color: "#065F46" }}>
                      {order.initials}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-ink truncate">{order.user}</p>
                      <p className="text-xs text-ink-light">Cardholder</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="w-8 h-5 rounded flex-shrink-0" style={{ backgroundColor: order.designColor }} />
                    <div>
                      <p className="text-xs text-ink-light">Design</p>
                      <p className="text-sm font-medium text-ink">{order.design}</p>
                    </div>
                  </div>

                  <div>
                    <p className="text-xs text-ink-light">Quantity</p>
                    <p className="text-sm font-medium text-ink">{order.quantity} cards</p>
                  </div>

                  <div>
                    <p className="text-xs text-ink-light flex items-center gap-1"><MapPin className="h-3 w-3" />Ship to</p>
                    <p className="text-sm text-ink truncate">{order.city}</p>
                    <p className="text-xs text-ink-light truncate">{order.address}</p>
                  </div>

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
                      <span className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-xl"
                        style={{ backgroundColor: "#ECFDF5", color: "#065F46" }}>
                        <PackageCheck className="h-3.5 w-3.5" /> Complete
                      </span>
                    )}
                  </div>
                </div>

                {/* Payment row */}
                <div
                  className="rounded-xl border px-4 py-3 flex items-center gap-4 flex-wrap"
                  style={{ backgroundColor: PAYMENT_COLORS[order.payment_status] ?? "#FEF9EF", borderColor: "rgba(6,78,59,0.08)" }}
                >
                  <div className="flex items-center gap-2">
                    <CreditCard className="h-4 w-4 text-ink-light" />
                    <p className="text-xs text-ink-light">Payment</p>
                  </div>

                  <span
                    className="text-xs font-medium px-2.5 py-0.5 rounded-full capitalize"
                    style={{
                      backgroundColor: order.payment_status === "verified" ? "#D1FAE5" : order.payment_status === "paid" ? "#DBEAFE" : "#FEF3C7",
                      color: order.payment_status === "verified" ? "#065F46" : order.payment_status === "paid" ? "#1E3A8A" : "#92400E",
                    }}
                  >
                    {PAYMENT_LABELS[order.payment_status] ?? order.payment_status}
                  </span>

                  <span className="text-sm font-semibold text-emerald-deep">
                    {formatAmount(order)}
                  </span>

                  <span className="text-xs text-ink-light">
                    {order.payment_currency}
                  </span>

                  {/* Screenshot thumbnail */}
                  {order.payment_screenshot_url ? (
                    <button
                      onClick={() => setPreviewImage(order.payment_screenshot_url)}
                      className="flex items-center gap-1.5 text-xs font-medium transition-colors hover:opacity-80"
                      style={{ color: "#064E3B" }}
                    >
                      <ImageIcon className="h-3.5 w-3.5" />
                      View receipt
                    </button>
                  ) : (
                    <span className="text-xs text-ink-light">No receipt</span>
                  )}

                  <div className="flex-1" />

                  {/* Verify payment button */}
                  {order.payment_status === "paid" && (
                    <Button
                      variant="primary"
                      size="sm"
                      loading={loadingId === order.id}
                      leftIcon={loadingId !== order.id ? <ShieldCheck className="h-3.5 w-3.5" /> : undefined}
                      onClick={() => handleVerifyPayment(order.id)}
                    >
                      Verify payment
                    </Button>
                  )}
                </div>
              </div>
            </div>
          );
        })}

        {filtered.length === 0 && (
          <div className="rounded-2xl border p-16 text-center"
            style={{ backgroundColor: "#FEF9EF", borderColor: "rgba(6,78,59,0.08)" }}>
            <p className="font-serif text-xl text-emerald-deep mb-1">No {filter} orders</p>
            <p className="text-sm text-ink-light">Orders will appear here as they come in.</p>
          </div>
        )}
      </div>
    </div>
  );
}
