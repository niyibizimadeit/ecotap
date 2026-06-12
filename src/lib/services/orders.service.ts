// ─────────────────────────────────────────────────────────────────────────────
// Orders service — guarded status transitions for card ordering lifecycle.
// Calls repositories only — never queries Supabase directly.
// ─────────────────────────────────────────────────────────────────────────────

import * as ordersRepo from "@/lib/supabase/card_orders.repo";
import * as profilesRepo from "@/lib/supabase/profiles.repo";
import * as analyticsRepo from "@/lib/supabase/analytics.repo";
import type { ActionResult, CardOrder, CardOrderWithDesign, OrderForm, OrderStatus } from "@/types";

// ── Guards ───────────────────────────────────────────────────────────────────

const VALID_TRANSITIONS: Record<OrderStatus, OrderStatus[]> = {
  pending:   ["approved"],
  approved:  ["shipped"],
  shipped:   ["delivered"],
  delivered: [],  // Terminal state
};

function canTransition(from: OrderStatus, to: OrderStatus): boolean {
  return VALID_TRANSITIONS[from]?.includes(to) ?? false;
}

// ── Order placement ──────────────────────────────────────────────────────────

export async function placeOrder(
  profileId: string,
  data: OrderForm
): Promise<ActionResult<CardOrder>> {
  // Validate profile is active
  const profile = await profilesRepo.getProfileById(profileId);
  if (!profile) return { success: false, error: "Profile not found." };
  if (profile.status !== "active") {
    return { success: false, error: "Only active users can place orders." };
  }

  // Validate quantity
  if (data.quantity < 1 || data.quantity > 100) {
    return { success: false, error: "Quantity must be between 1 and 100." };
  }

  const order = await ordersRepo.createOrder({
    profile_id:       profileId,
    design_id:        data.design_id,
    quantity:         data.quantity,
    shipping_address: data.shipping_address as unknown as Record<string, unknown>,
    payment_amount:   data.payment_amount,
    payment_currency: data.payment_currency,
    momo_phone:       data.momo_phone,
  });

  if (!order) return { success: false, error: "Failed to place order." };

  // Log activity
  await analyticsRepo.recordProfileActivity({
    profile_id:    profileId,
    activity_type: "order_placed",
    description:   `Ordered ${data.quantity}x card(s)`,
    metadata:      { order_id: order.id, design_id: data.design_id, quantity: data.quantity },
  });

  return { success: true, data: order };
}

// ── Status transitions ───────────────────────────────────────────────────────

async function transitionOrderStatus(
  orderId: string,
  to: OrderStatus,
  trackingInfo?: string
): Promise<ActionResult<CardOrder>> {
  const order = await ordersRepo.getOrderById(orderId);

  if (!order) return { success: false, error: "Order not found." };

  if (!canTransition(order.status as OrderStatus, to)) {
    return {
      success: false,
      error: `Cannot transition from ${order.status} to ${to}.`,
    };
  }

  const updated = await ordersRepo.updateOrderStatus(orderId, to, trackingInfo);
  if (!updated) return { success: false, error: `Failed to mark order as ${to}.` };

  return { success: true, data: updated };
}

export async function approveOrder(
  orderId: string
): Promise<ActionResult<CardOrder>> {
  return transitionOrderStatus(orderId, "approved");
}

export async function markShipped(
  orderId: string,
  trackingInfo?: string
): Promise<ActionResult<CardOrder>> {
  return transitionOrderStatus(orderId, "shipped", trackingInfo);
}

export async function markDelivered(
  orderId: string
): Promise<ActionResult<CardOrder>> {
  return transitionOrderStatus(orderId, "delivered");
}

// ── Reads ────────────────────────────────────────────────────────────────────

export async function getUserOrders(
  profileId: string
): Promise<ActionResult<CardOrder[]>> {
  const orders = await ordersRepo.getOrdersByProfileId(profileId);
  return { success: true, data: orders };
}

export async function getAllOrders(
  filters?: { status?: OrderStatus }
): Promise<ActionResult<CardOrderWithDesign[]>> {
  const orders = await ordersRepo.getAllOrders(filters);
  return { success: true, data: orders };
}

// ── Payment ────────────────────────────────────────────────────────────────────

export async function uploadPaymentScreenshot(
  orderId: string,
  screenshotUrl: string
): Promise<ActionResult<CardOrder>> {
  const order = await ordersRepo.getOrderById(orderId);
  if (!order) return { success: false, error: "Order not found." };

  if (order.payment_status === "verified") {
    return { success: false, error: "Payment already verified. Cannot change screenshot." };
  }

  const updated = await ordersRepo.updateOrderPayment(orderId, {
    payment_screenshot_url: screenshotUrl,
    payment_status: "paid",
  });

  if (!updated) return { success: false, error: "Failed to update payment." };
  return { success: true, data: updated };
}

export async function verifyPayment(
  orderId: string
): Promise<ActionResult<CardOrder>> {
  const order = await ordersRepo.getOrderById(orderId);
  if (!order) return { success: false, error: "Order not found." };

  if (order.payment_status !== "paid") {
    return { success: false, error: "Order must be in 'paid' status before verification." };
  }

  const updated = await ordersRepo.updateOrderPayment(orderId, {
    payment_status: "verified",
  });

  if (!updated) return { success: false, error: "Failed to verify payment." };
  return { success: true, data: updated };
}
