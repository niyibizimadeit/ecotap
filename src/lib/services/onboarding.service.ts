// ─────────────────────────────────────────────────────────────────────────────
// Onboarding service — company and individual registration, approval, rejection.
// All business logic: validation, guarded status transitions, cross-table ops.
// Calls repositories only — never queries Supabase directly.
// ─────────────────────────────────────────────────────────────────────────────

import * as profilesRepo from "@/lib/supabase/profiles.repo";
import * as companiesRepo from "@/lib/supabase/companies.repo";
import * as billingRepo from "@/lib/supabase/billing.repo";
import * as analyticsRepo from "@/lib/supabase/analytics.repo";
import type { ActionResult, Profile, Company, UserStatus } from "@/types";

// ── Guards ───────────────────────────────────────────────────────────────────

const VALID_TRANSITIONS: Record<UserStatus, UserStatus[]> = {
  pending:   ["active", "suspended"],
  active:    ["suspended"],
  suspended: ["active"],
};

function canTransition(from: UserStatus, to: UserStatus): boolean {
  return VALID_TRANSITIONS[from]?.includes(to) ?? false;
}

// ── Registration ─────────────────────────────────────────────────────────────

export async function registerCompany(data: {
  company_name: string;
  slug: string;
  industry?: string;
  website?: string;
  size?: string;
  admin_name: string;
  admin_email: string;
  admin_id: string;
  plan_id: string;
  legal_rep_confirmed: boolean;
}): Promise<
  ActionResult<{ company: Company; profile: Profile }>
> {
  // 1. Create the company (status = pending)
  const company = await companiesRepo.createCompany({
    name:                data.company_name,
    slug:                data.slug,
    industry:            data.industry,
    website:             data.website,
    size:                data.size,
    legal_rep_confirmed: data.legal_rep_confirmed,
  });

  if (!company) return { success: false, error: "Failed to create company." };

  // 2. Set the admin profile role to company_admin (profile created by DB trigger)
  const profile = await profilesRepo.updateProfileRole(data.admin_id, "company_admin");

  if (!profile) {
    // Rollback: delete the company
    await companiesRepo.deleteCompany(company.id);
    return { success: false, error: "Failed to update admin profile." };
  }

  // 3. Create default subscription
  await billingRepo.createSubscription({
    company_id: company.id,
    plan_id:    data.plan_id,
  });

  // 4. Log activity
  await analyticsRepo.recordProfileActivity({
    profile_id:    data.admin_id,
    activity_type: "login",
    description:   "Company registration submitted",
  });

  return { success: true, data: { company, profile } };
}

export async function registerIndividual(data: {
  full_name: string;
  email: string;
  username: string;
  profile_id: string;
}): Promise<ActionResult<Profile>> {
  const profile = await profilesRepo.updateProfileRole(data.profile_id, "individual");

  if (!profile) return { success: false, error: "Failed to register individual." };

  await analyticsRepo.recordProfileActivity({
    profile_id:    data.profile_id,
    activity_type: "login",
    description:   "Individual registration submitted",
  });

  return { success: true, data: profile };
}

// ── Approval & rejection ─────────────────────────────────────────────────────

export async function approveCompany(
  companyId: string
): Promise<ActionResult<Company>> {
  const company = await companiesRepo.getCompanyById(companyId);

  if (!company) return { success: false, error: "Company not found." };

  if (!canTransition(company.status, "active")) {
    return {
      success: false,
      error: `Cannot approve a company that is already ${company.status}.`,
    };
  }

  const updated = await companiesRepo.updateCompanyStatus(companyId, "active");
  if (!updated) return { success: false, error: "Failed to approve company." };

  return { success: true, data: updated };
}

export async function approveIndividual(
  profileId: string
): Promise<ActionResult<Profile>> {
  const profile = await profilesRepo.getProfileById(profileId);

  if (!profile) return { success: false, error: "Profile not found." };

  if (!canTransition(profile.status, "active")) {
    return {
      success: false,
      error: `Cannot approve a user that is already ${profile.status}.`,
    };
  }

  const updated = await profilesRepo.updateProfileStatus(profileId, "active");
  if (!updated) return { success: false, error: "Failed to approve user." };

  return { success: true, data: updated };
}

export async function rejectUser(
  profileId: string
): Promise<ActionResult<Profile>> {
  const profile = await profilesRepo.getProfileById(profileId);

  if (!profile) return { success: false, error: "Profile not found." };

  const updated = await profilesRepo.updateProfileStatus(profileId, "suspended");
  if (!updated) return { success: false, error: "Failed to reject user." };

  return { success: true, data: updated };
}

export async function suspendUser(
  profileId: string
): Promise<ActionResult<Profile>> {
  const profile = await profilesRepo.getProfileById(profileId);

  if (!profile) return { success: false, error: "Profile not found." };
  if (profile.status === "suspended") {
    return { success: false, error: "User is already suspended." };
  }

  const updated = await profilesRepo.updateProfileStatus(profileId, "suspended");
  if (!updated) return { success: false, error: "Failed to suspend user." };

  return { success: true, data: updated };
}
