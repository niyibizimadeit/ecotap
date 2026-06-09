// ─────────────────────────────────────────────────────────────────────────────
// Admin service — super admin dashboard operations.
// Aggregation, filtering, and bulk operations across multiple tables.
// Calls repositories only — never queries Supabase directly.
// ─────────────────────────────────────────────────────────────────────────────

import * as profilesRepo from "@/lib/supabase/profiles.repo";
import * as companiesRepo from "@/lib/supabase/companies.repo";
import * as ordersRepo from "@/lib/supabase/card_orders.repo";
import * as designsRepo from "@/lib/supabase/card_designs.repo";
import * as billingRepo from "@/lib/supabase/billing.repo";
import type {
  ActionResult,
  Profile,
  Company,
  CardOrderWithDesign,
  CardDesign,
  BillingPlan,
  CompanySubscription,
  UserRole,
  UserStatus,
  OrderStatus,
  SubscriptionStatus,
} from "@/types";

// ── Pending queue ────────────────────────────────────────────────────────────

export interface PendingQueue {
  companies: Company[];
  individuals: Profile[];
}

export async function getPendingQueue(): Promise<ActionResult<PendingQueue>> {
  const [companies, individuals] = await Promise.all([
    companiesRepo.getAllPendingCompanies(),
    profilesRepo.getAllPending(),
  ]);

  // Filter to only individual registrations (company admins go through company approval)
  const individualsOnly = individuals.filter(
    (p) => p.role === "individual" || p.role === "employee"
  );

  return { success: true, data: { companies, individuals: individualsOnly } };
}

// ── Users ────────────────────────────────────────────────────────────────────

export interface UserFilters {
  role?: UserRole;
  status?: UserStatus;
}

export async function getAllUsers(
  filters?: UserFilters
): Promise<ActionResult<Profile[]>> {
  const users = await profilesRepo.getAllProfiles(filters);
  return { success: true, data: users };
}

export async function getUserById(id: string): Promise<ActionResult<Profile>> {
  const user = await profilesRepo.getProfileById(id);
  if (!user) return { success: false, error: "User not found." };
  return { success: true, data: user };
}

// ── Orders ───────────────────────────────────────────────────────────────────

export async function getAllOrdersAdmin(filters?: {
  status?: OrderStatus;
}): Promise<ActionResult<CardOrderWithDesign[]>> {
  const orders = await ordersRepo.getAllOrders(filters);
  return { success: true, data: orders };
}

// ── Designs ──────────────────────────────────────────────────────────────────

export async function getAllDesignsAdmin(): Promise<
  ActionResult<CardDesign[]>
> {
  const designs = await designsRepo.getAllDesigns();
  return { success: true, data: designs };
}

export async function createDesign(
  data: Parameters<typeof designsRepo.createDesign>[0]
): Promise<ActionResult<CardDesign>> {
  const design = await designsRepo.createDesign(data);
  if (!design) return { success: false, error: "Failed to create design." };
  return { success: true, data: design };
}

export async function updateDesign(
  id: string,
  data: Parameters<typeof designsRepo.updateDesign>[1]
): Promise<ActionResult<CardDesign>> {
  const design = await designsRepo.updateDesign(id, data);
  if (!design) return { success: false, error: "Failed to update design." };
  return { success: true, data: design };
}

export async function deleteDesign(id: string): Promise<ActionResult<void>> {
  await designsRepo.deleteDesign(id);
  return { success: true };
}

// ── Billing plans ────────────────────────────────────────────────────────────

export async function getAllPlansAdmin(): Promise<ActionResult<BillingPlan[]>> {
  const plans = await billingRepo.getAllPlans();
  return { success: true, data: plans };
}

export async function upsertPlan(
  plan: Parameters<typeof billingRepo.upsertPlan>[0]
): Promise<ActionResult<BillingPlan>> {
  const result = await billingRepo.upsertPlan(plan);
  if (!result) return { success: false, error: "Failed to upsert plan." };
  return { success: true, data: result };
}

export async function deletePlan(id: string): Promise<ActionResult<void>> {
  await billingRepo.deletePlan(id);
  return { success: true };
}

// ── Subscriptions ────────────────────────────────────────────────────────────

export async function getAllSubscriptionsAdmin(filters?: {
  status?: SubscriptionStatus;
}): Promise<ActionResult<CompanySubscription[]>> {
  const subs = await billingRepo.getAllSubscriptions(filters);
  return { success: true, data: subs };
}

// ── Dashboard overview ───────────────────────────────────────────────────────

export interface AdminOverview {
  pendingApprovals: number;
  activeUsers: number;
  totalCompanies: number;
  pendingOrders: number;
}

export async function getAdminOverview(): Promise<ActionResult<AdminOverview>> {
  const [pendingUsers, activeUsers, companies, pendingOrders] =
    await Promise.all([
      profilesRepo.getAllPending(),
      profilesRepo.getAllProfiles({ status: "active" }),
      companiesRepo.getAllCompanies(),
      ordersRepo.getAllOrders({ status: "pending" }),
    ]);

  return {
    success: true,
    data: {
      pendingApprovals: pendingUsers.length + (await companiesRepo.getAllPendingCompanies()).length,
      activeUsers:      activeUsers.length,
      totalCompanies:   companies.length,
      pendingOrders:    pendingOrders.length,
    },
  };
}
