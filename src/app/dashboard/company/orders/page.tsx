import Link from "next/link";
import { PageHeader, SectionCard, EmptyState } from "@/components/dashboard/DashboardShared";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Package, ArrowRight, MapPin, Calendar, ShoppingBag } from "lucide-react";
import { getMyOrders } from "@/app/actions/orders.actions";
import type { CardOrder, OrderStatus } from "@/types";

const STATUS_BADGE: Record<OrderStatus, "delivered" | "shipped" | "approved" | "pending"> = {
  delivered: "delivered",
  shipped:   "shipped",
  approved:  "approved",
  pending:   "pending",
};

const STATUS_STEP: Record<OrderStatus, number> = {
  pending: 1, approved: 2, shipped: 3, delivered: 4,
};

export default async function CompanyOrdersPage() {
  const result = await getMyOrders();
  const orders = (result.success ? result.data : []) ?? [];

  return (
    <div>
      <PageHeader
        eyebrow="Card Orders"
        title="Company card orders"
        subtitle="Order physical NFC cards for your team with your company branding."
        action={
          <Link href="/dashboard/company/orders/new">
            <Button variant="primary" size="sm" rightIcon={<ArrowRight className="h-3.5 w-3.5" />}>
              Order cards
            </Button>
          </Link>
        }
      />

      {/* CTA banner */}
      <div
        className="rounded-2xl p-5 mb-6 flex items-center gap-5 border"
        style={{ backgroundColor: "#ECFDF5", borderColor: "rgba(5,150,105,0.15)" }}
      >
        <div
          className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0"
          style={{ backgroundColor: "#064E3B" }}
        >
          <Package className="h-6 w-6" style={{ color: "#FEFCE8" }} />
        </div>
        <div className="flex-1">
          <p className="text-sm font-semibold text-emerald-deep">Bulk orders for your team</p>
          <p className="text-xs text-ink-light mt-0.5">
            Corporate pricing from $25/card (≈ 37,500 RWF). Volume discounts available for 100+ cards.
          </p>
        </div>
        <Link href="/dashboard/company/orders/new">
          <Button variant="primary" size="sm">Order now</Button>
        </Link>
      </div>

      {/* Order history */}
      <SectionCard
        title="Order history"
        subtitle={`${orders.length} orders placed`}
      >
        {orders.length === 0 ? (
          <EmptyState
            icon={<ShoppingBag className="h-8 w-8" />}
            title="No orders yet"
            description="Your first company order will appear here once you place it."
          />
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <OrderCard key={order.id} order={order} />
            ))}
          </div>
        )}
      </SectionCard>
    </div>
  );
}

/* ── Order card sub-component ── */
function OrderCard({ order }: { order: CardOrder }) {
  const status = order.status as OrderStatus;
  const shippingAddr = order.shipping_address as unknown as Record<string, string>;
  const address = shippingAddr ? `${shippingAddr.street ?? ""}, ${shippingAddr.city ?? ""}` : "—";
  const date = order.created_at
    ? new Date(order.created_at).toLocaleDateString("en-GB", {
        day: "numeric", month: "short", year: "numeric",
      })
    : "—";

  return (
    <div
      className="rounded-2xl border overflow-hidden"
      style={{ borderColor: "rgba(6,78,59,0.08)" }}
    >
      {/* Order header */}
      <div
        className="px-5 py-4 flex items-center justify-between gap-3 border-b"
        style={{ backgroundColor: "#FEFCE8", borderColor: "rgba(6,78,59,0.08)" }}
      >
        <div className="flex items-center gap-3">
          <span className="text-xs font-mono text-ink-light">{order.id.slice(0, 8)}</span>
          <Badge variant={STATUS_BADGE[status]}>{status}</Badge>
        </div>
        <div className="flex items-center gap-4 text-xs text-ink-light">
          <span className="flex items-center gap-1"><Calendar className="h-3 w-3" /> {date}</span>
        </div>
      </div>

      {/* Order details */}
      <div className="px-5 py-4" style={{ backgroundColor: "#FEF9EF" }}>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4">
          <div>
            <p className="text-xs text-ink-light mb-1">Design</p>
            <p className="text-sm font-medium text-ink">{order.design_id.slice(0, 8)}</p>
          </div>
          <div>
            <p className="text-xs text-ink-light mb-1">Quantity</p>
            <p className="text-sm font-medium text-ink">{order.quantity} cards</p>
          </div>
          <div>
            <p className="text-xs text-ink-light mb-1">Shipping to</p>
            <p className="text-sm font-medium text-ink flex items-center gap-1">
              <MapPin className="h-3 w-3" /> {address}
            </p>
          </div>
          {order.tracking_info && (
            <div>
              <p className="text-xs text-ink-light mb-1">Tracking</p>
              <p className="text-sm font-mono text-emerald-mid">{order.tracking_info}</p>
            </div>
          )}
        </div>

        {/* Progress bar */}
        <div>
          <div className="flex justify-between mb-2">
            {["Ordered", "Approved", "Shipped", "Delivered"].map((step, i) => {
              const stepNum = i + 1;
              const active  = STATUS_STEP[status] >= stepNum;
              return (
                <div key={step} className="flex flex-col items-center gap-1">
                  <div
                    className="w-6 h-6 rounded-full flex items-center justify-center text-xs transition-all"
                    style={{
                      backgroundColor: active ? "#064E3B" : "#F0E6D3",
                      color: active ? "#FEFCE8" : "#78716C",
                    }}
                  >
                    {STATUS_STEP[status] > stepNum ? (
                      <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                        <path d="M1 4l3 3 5-6" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    ) : stepNum}
                  </div>
                  <span className="text-[10px] text-ink-light hidden sm:block">{step}</span>
                </div>
              );
            })}
          </div>
          <div className="relative h-1 rounded-full" style={{ backgroundColor: "#F0E6D3" }}>
            <div
              className="absolute left-0 top-0 h-full rounded-full transition-all"
              style={{
                backgroundColor: "#064E3B",
                width: `${((STATUS_STEP[status] - 1) / 3) * 100}%`,
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
