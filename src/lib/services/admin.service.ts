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
import * as exchangesRepo from "@/lib/supabase/contact_exchanges.repo";

import type {
  ActionResult,
  Profile,
  ProfileFull,
  Company,
  CardOrderWithDesign,
  CardDesign,
  BillingPlan,
  CompanySubscription,
  ContactExchangeWithOwner,
  PaginatedResult,
  UserRole,
  UserStatus,
  OrderStatus,
  SubscriptionStatus,
} from "@/types";

// ── Status transition guard (mirrors onboarding.service.ts) ───────────────────

const VALID_TRANSITIONS: Record<UserStatus, UserStatus[]> = {
  pending:   ["active", "suspended"],
  active:    ["suspended"],
  suspended: ["active"],
};

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

  // Include company_admin profiles — they show in the Individuals tab.
  // Approving a company_admin profile triggers the on_company_admin_activated
  // DB trigger which auto-creates the company + subscription.
  const individualsOnly = individuals.filter(
    (p) => p.role === "individual" || p.role === "employee" || p.role === "company_admin"
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
  const [pendingUsers, activeUsers, companies, pendingOrders, pendingCompanies] =
    await Promise.all([
      profilesRepo.getAllPending(),
      profilesRepo.getAllProfiles({ status: "active" }),
      companiesRepo.getAllCompanies(),
      ordersRepo.getAllOrders({ status: "pending" }),
      companiesRepo.getAllPendingCompanies(),
    ]);

  // Include company_admin profiles in pending count (same as getPendingQueue)
  const pendingIndividuals = pendingUsers.filter(
    (p) => p.role === "individual" || p.role === "employee" || p.role === "company_admin"
  );

  return {
    success: true,
    data: {
      pendingApprovals: pendingIndividuals.length + pendingCompanies.length,
      activeUsers:      activeUsers.length,
      totalCompanies:   companies.length,
      pendingOrders:    pendingOrders.length,
    },
  };
}

// ── User management (CRUD) ────────────────────────────────────────────────────

/** Full profile detail with card, orders, and companies */
export async function getUserProfileFull(
  profileId: string
): Promise<ActionResult<ProfileFull>> {
  const result = await profilesRepo.getProfileFull(profileId);
  if (!result) return { success: false, error: "User not found." };

  // Flatten: repo returns { profile, card, orders, companies }, ProfileFull extends Profile
  const { profile, card, orders, companies } = result as {
    profile: Record<string, unknown>;
    card: unknown;
    orders: unknown;
    companies: unknown;
  };

  const flat = {
    ...profile,
    card: card ?? null,
    orders: orders ?? [],
    companies: companies ?? [],
  } as ProfileFull;

  return { success: true, data: flat };
}

/** Change a user's role (super admin only). Prevents demoting the last super_admin. */
export async function updateUserRole(
  profileId: string,
  newRole: UserRole
): Promise<ActionResult<Profile>> {
  const profile = await profilesRepo.getProfileById(profileId);
  if (!profile) return { success: false, error: "User not found." };

  // Prevent demoting the last super_admin
  if (profile.role === "super_admin" && newRole !== "super_admin") {
    const allAdmins = await profilesRepo.getAllProfiles({ role: "super_admin" });
    if (allAdmins.length <= 1) {
      return { success: false, error: "Cannot change role: this is the last super admin." };
    }
  }

  const updated = await profilesRepo.updateProfileRoleService(profileId, newRole);
  if (!updated) return { success: false, error: "Failed to update role." };
  return { success: true, data: updated };
}

/** Toggle a user between active and suspended status */
export async function toggleUserStatus(
  profileId: string
): Promise<ActionResult<Profile>> {
  const profile = await profilesRepo.getProfileById(profileId);
  if (!profile) return { success: false, error: "User not found." };

  const newStatus: UserStatus = profile.status === "active" ? "suspended" : "active";

  if (!VALID_TRANSITIONS[profile.status]?.includes(newStatus)) {
    return { success: false, error: `Cannot transition from ${profile.status} to ${newStatus}.` };
  }

  const updated = await profilesRepo.updateProfileStatus(profileId, newStatus);
  if (!updated) return { success: false, error: "Failed to update status." };
  return { success: true, data: updated };
}

/**
 * Shared helper: delete all data for a profile, including the auth user.
 * Used by super-admin delete, self-delete, and company employee removal.
 *
 * DELETION ORDER (critical for FK constraints):
 *   1. card_orders          — ON DELETE RESTRICT on profiles (must go before profile/auth)
 *   2. profile_companies    — track linked companies for orphan cleanup
 *   3. profile_activity     — no restrictive FKs
 *   4. contact_exchanges    — explicit cleanup (belt-and-suspenders on top of cascade)
 *   5. auth user            — cascades to profiles → cards → card_events, daily_card_stats,
 *                              card_scores, card_groups, ab_test_assignments
 *   6. orphaned companies   — clean up companies with no remaining members
 *
 * Deleting the auth user FIRST (after removing restrict-FK data) is intentional:
 * the cascade handles profiles, cards, and all card-related tables automatically.
 * This ensures the Supabase Auth record is truly removed and the email can be reused.
 *
 * Returns a list of error strings (empty = success).
 */
export async function deleteProfileCascade(profileId: string): Promise<string[]> {
  const errors: string[] = [];
  const supabase = (await import("@/lib/supabase/server")).getServiceSupabase();
  let linkedCompanyIds: string[] = [];

  // 1. Delete card orders — these have ON DELETE RESTRICT on profiles,
  //    so they MUST be removed before we can delete the profile/auth user.
  try {
    await supabase.from("card_orders").delete().eq("profile_id", profileId);
  } catch (err) {
    errors.push(`card_orders: ${err instanceof Error ? err.message : String(err)}`);
  }

  // 2. Find and delete profile_companies links (track linked companies for orphan cleanup).
  try {
    const { data: links } = await supabase
      .from("profile_companies")
      .select("company_id")
      .eq("profile_id", profileId);

    linkedCompanyIds = links?.map((l) => l.company_id) ?? [];

    await supabase.from("profile_companies").delete().eq("profile_id", profileId);
  } catch (err) {
    errors.push(`profile_companies: ${err instanceof Error ? err.message : String(err)}`);
  }

  // 3. Delete profile activity.
  try {
    await supabase.from("profile_activity").delete().eq("profile_id", profileId);
  } catch (err) {
    errors.push(`profile_activity: ${err instanceof Error ? err.message : String(err)}`);
  }

  // 4. Delete contact_exchanges for this user's cards (belt-and-suspenders —
  //    the cascade will also clean these, but explicit cleanup avoids edge cases).
  try {
    const { data: userCards } = await supabase
      .from("cards")
      .select("id")
      .eq("profile_id", profileId);

    if (userCards && userCards.length > 0) {
      const cardIds = userCards.map((c: { id: string }) => c.id);
      await supabase.from("contact_exchanges").delete().in("card_id", cardIds);
    }
  } catch (err) {
    errors.push(`contact_exchanges: ${err instanceof Error ? err.message : String(err)}`);
  }

  // 5. Delete the auth user — this cascades to profiles (ON DELETE CASCADE),
  //    which cascades to cards, which cascades to card_events, daily_card_stats,
  //    card_scores, card_groups, ab_test_assignments.
  //    This is the CRITICAL step for email reuse — the auth record MUST be fully purged.
  try {
    const { error: authError } = await supabase.auth.admin.deleteUser(profileId);
    if (authError) throw authError;

    // Verify the auth user is truly gone
    const { data: verifyUser } = await supabase.auth.admin.getUserById(profileId);
    if (verifyUser?.user) {
      // User still exists — the SDK may have soft-deleted; retry
      const { error: retryError } = await supabase.auth.admin.deleteUser(profileId);
      if (retryError) throw retryError;
    }
  } catch (err) {
    errors.push(`auth_user: ${err instanceof Error ? err.message : String(err)}`);
  }

  // 6. Clean up orphaned companies (no remaining profile_companies links).
  if (linkedCompanyIds.length > 0) {
    try {
      const { data: stillLinked } = await supabase
        .from("profile_companies")
        .select("company_id")
        .in("company_id", linkedCompanyIds);

      const stillLinkedIds = new Set(stillLinked?.map((l) => l.company_id) ?? []);
      const orphanedIds = linkedCompanyIds.filter((id) => !stillLinkedIds.has(id));

      if (orphanedIds.length > 0) {
        const { deleteCompanyCascade } = await import("@/lib/supabase/companies.repo");
        for (const companyId of orphanedIds) {
          try {
            await deleteCompanyCascade(companyId);
          } catch (err) {
            errors.push(`orphaned_company(${companyId}): ${err instanceof Error ? err.message : String(err)}`);
          }
        }
      }
    } catch (err) {
      errors.push(`orphan_cleanup: ${err instanceof Error ? err.message : String(err)}`);
    }
  }

  return errors;
}

/** Delete a user and all associated data. Prevents self-delete and deleting the last super_admin. */
export async function deleteUser(
  currentUserId: string,
  targetProfileId: string
): Promise<ActionResult<void>> {
  // Prevent self-delete
  if (currentUserId === targetProfileId) {
    return { success: false, error: "You cannot delete your own account." };
  }

  const profile = await profilesRepo.getProfileById(targetProfileId);
  if (!profile) return { success: false, error: "User not found." };

  // Prevent deleting the last super_admin
  if (profile.role === "super_admin") {
    const allAdmins = await profilesRepo.getAllProfiles({ role: "super_admin" });
    if (allAdmins.length <= 1) {
      return { success: false, error: "Cannot delete the last super admin." };
    }
  }

  const errors = await deleteProfileCascade(targetProfileId);

  if (errors.length > 0) {
    return { success: false, error: `Partial deletion: ${errors.join("; ")}` };
  }

  return { success: true };
}

/**
 * Delete the currently-authenticated user's own account.
 * No self-delete guard — this is intentionally a self-delete.
 */
export async function deleteOwnAccount(profileId: string): Promise<ActionResult<void>> {
  const profile = await profilesRepo.getProfileById(profileId);
  if (!profile) return { success: false, error: "Profile not found." };

  const errors = await deleteProfileCascade(profileId);

  if (errors.length > 0) {
    return { success: false, error: `Partial deletion: ${errors.join("; ")}` };
  }

  return { success: true };
}

/** Delete a company and all related records (profile_companies, departments, subscriptions, etc.) */
export async function deleteCompany(
  companyId: string
): Promise<ActionResult<{ errors: string[] }>> {
  const result = await companiesRepo.deleteCompanyCascade(companyId);
  if (!result.success) {
    return { success: false, error: `Partial deletion: ${result.errors.join("; ")}`, data: { errors: result.errors } };
  }
  return { success: true, data: { errors: [] } };
}

// ── Contact exchanges (admin-wide) ────────────────────────────────────────────

/** Total count of contact exchanges (no filters) */
export async function getContactExchangesCount(): Promise<ActionResult<number>> {
  const count = await exchangesRepo.getExchangesCount();
  return { success: true, data: count };
}

/** Paginated list of all contact exchanges, enriched with card owner info */
export async function getAllContactExchangesAdmin(options: {
  search?: string;
  page?: number;
  pageSize?: number;
  sortDir?: "asc" | "desc";
}): Promise<ActionResult<PaginatedResult<ContactExchangeWithOwner>>> {
  const { search, page = 1, pageSize = 25, sortDir = "desc" } = options;
  const offset = (page - 1) * pageSize;

  const [exchanges, total] = await Promise.all([
    exchangesRepo.getAllExchangesAdmin({ search, limit: pageSize, offset, sortDir }),
    exchangesRepo.getExchangesCount({ search }),
  ]);

  return {
    success: true,
    data: {
      data: exchanges as ContactExchangeWithOwner[],
      total,
      page,
      totalPages: Math.ceil(total / pageSize),
    },
  };
}

// ── QR code lookup (admin) ────────────────────────────────────────────────────

/** Search profiles by username or email — for QR code lookup */
export async function lookupUserByQuery(
  query: string
): Promise<ActionResult<Pick<Profile, "id" | "username" | "full_name" | "email">[]>> {
  const results = await profilesRepo.searchProfilesByQuery(query.trim());
  return { success: true, data: results as Pick<Profile, "id" | "username" | "full_name" | "email">[] };
}

/** Construct a user's public card URL for QR code generation */
export async function getUserCardUrl(
  profileId: string
): Promise<ActionResult<{ cardUrl: string; profile: Profile; card: CardDesign | null }>> {
  const result = await profilesRepo.getProfileFull(profileId);
  if (!result) return { success: false, error: "User not found." };

  const profile = result.profile as Profile;

  // Determine primary company slug from profile_companies
  let companySlug: string | null = null;
  const companies = result.companies as Array<Record<string, unknown>>;
  if (companies?.length > 0) {
    const primary = companies.find((c) => c.is_primary === true) ?? companies[0];
    const company = primary?.company as Record<string, unknown> | undefined;
    companySlug = (company?.slug as string) ?? null;
  }

  const cardUrl = companySlug
    ? `https://ecotap.rw/${companySlug}/${profile.username}`
    : `https://ecotap.rw/${profile.username}`;

  return {
    success: true,
    data: {
      cardUrl,
      profile,
      card: (result.card ?? null) as CardDesign | null,
    },
  };
}
