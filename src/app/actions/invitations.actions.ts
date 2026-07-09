"use server";

// ─────────────────────────────────────────────────────────────────────────────
// Invitation server actions — manage employee invite links.
// Called from the company admin dashboard.
// ─────────────────────────────────────────────────────────────────────────────

import { getSupabase, getServiceSupabase } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import * as invitationsService from "@/lib/services/invitations.service";
import type { ActionResult, Invitation } from "@/types";

// ── Guard ────────────────────────────────────────────────────────────────────

async function resolveCompanyId(): Promise<string | null> {
  try {
    const supabase = await getSupabase();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return null;

    const { data: link } = await supabase
      .from("profile_companies")
      .select("company_id")
      .eq("profile_id", user.id)
      .eq("is_primary", true)
      .single();

    return link?.company_id ?? null;
  } catch {
    return null;
  }
}

// ── Create invitation ────────────────────────────────────────────────────────

export async function createInvitationAction(
  formData: FormData
): Promise<ActionResult<{ inviteUrl: string }>> {
  const supabase = await getSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "Not authenticated." };
  }

  const companyId = await resolveCompanyId();
  if (!companyId) {
    return { success: false, error: "No company linked to your account." };
  }

  const email = (formData.get("email") as string)?.trim() || null;

  const result = await invitationsService.createInvite({
    companyId,
    createdBy: user.id,
    email,
  });

  if (!result.success || !result.data) {
    return { success: false, error: result.error ?? "Failed to create invitation." };
  }

  revalidatePath("/dashboard/company/employees");
  return { success: true, data: { inviteUrl: result.data.inviteUrl } };
}

// ── Validate invite token (public — called from registration page) ───────────

export async function validateInviteTokenAction(
  token: string
): Promise<ActionResult<invitationsService.ValidatedInvite>> {
  return invitationsService.validateInviteToken(token);
}

// ── Accept invite (called after registration) ────────────────────────────────

export async function acceptInvitationAction(
  token: string
): Promise<ActionResult<{ companyId: string }>> {
  const supabase = await getSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "Not authenticated." };
  }

  const result = await invitationsService.acceptInvite(token, user.id);

  if (result.success) {
    revalidatePath("/dashboard/employee");
  }

  return result;
}

// ── Get company invitations ──────────────────────────────────────────────────

export async function getCompanyInvitationsAction(): Promise<
  ActionResult<Invitation[]>
> {
  const companyId = await resolveCompanyId();
  if (!companyId) {
    return { success: false, error: "No company linked to your account." };
  }

  return invitationsService.getCompanyInvites(companyId);
}

// ── Revoke invitation ────────────────────────────────────────────────────────

export async function revokeInvitationAction(
  invitationId: string
): Promise<ActionResult<void>> {
  const companyId = await resolveCompanyId();
  if (!companyId) {
    return { success: false, error: "No company linked to your account." };
  }

  // Verify the invitation belongs to this company
  const supabase = getServiceSupabase();
  const { data: invite } = await supabase
    .from("invitations")
    .select("id, company_id")
    .eq("id", invitationId)
    .single();

  if (!invite || invite.company_id !== companyId) {
    return { success: false, error: "Invitation not found." };
  }

  const { revokeInvitation } = await import(
    "@/lib/supabase/invitations.repo"
  );
  await revokeInvitation(invitationId);

  revalidatePath("/dashboard/company/employees");
  return { success: true };
}
