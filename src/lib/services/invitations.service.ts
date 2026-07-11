// ─────────────────────────────────────────────────────────────────────────────
// Invitations service — business logic for employee invite flow.
// ─────────────────────────────────────────────────────────────────────────────

import * as invitationsRepo from "@/lib/supabase/invitations.repo";
import { getServiceSupabase } from "@/lib/supabase/server";
import type { ActionResult, Invitation } from "@/types";

// ── Create invite ────────────────────────────────────────────────────────────

export interface CreateInviteInput {
  companyId: string;
  createdBy: string;
  email?: string | null;
}

export interface InviteResult {
  invitation: Invitation;
  inviteUrl: string;
}

export async function createInvite(
  input: CreateInviteInput
): Promise<ActionResult<InviteResult>> {
  // Check that the company exists and is active
  const supabase = getServiceSupabase();
  const { data: company } = await supabase
    .from("companies")
    .select("id, name, slug, status")
    .eq("id", input.companyId)
    .single();

  if (!company) {
    return { success: false, error: "Company not found." };
  }

  if (company.status !== "active") {
    return {
      success: false,
      error: "Company must be active before inviting employees.",
    };
  }

  // If email provided, check that it's not already in the company
  if (input.email) {
    const { data: existingProfile } = await supabase
      .from("profiles")
      .select("id")
      .eq("email", input.email)
      .maybeSingle();

    if (existingProfile) {
      // Check if already linked to this company
      const { data: existingLink } = await supabase
        .from("profile_companies")
        .select("id")
        .eq("profile_id", existingProfile.id)
        .eq("company_id", input.companyId)
        .maybeSingle();

      if (existingLink) {
        return {
          success: false,
          error: "A user with this email is already a member of your company.",
        };
      }
    }
  }

  const invitation = await invitationsRepo.createInvitation({
    company_id: input.companyId,
    created_by: input.createdBy,
    email: input.email ?? null,
  });

  if (!invitation) {
    return { success: false, error: "Failed to create invitation." };
  }

  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL ??
    (process.env.NEXT_PUBLIC_VERCEL_URL
      ? `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`
      : "https://ecotap.rw");
  const inviteUrl = `${siteUrl}/register?invite=${invitation.token}`;

  return {
    success: true,
    data: {
      invitation,
      inviteUrl,
    },
  };
}

// ── Validate invite token ────────────────────────────────────────────────────

export interface ValidatedInvite {
  token: string;
  company: {
    id: string;
    name: string;
    slug: string;
  };
  email: string | null;
  expiresAt: string;
}

export async function validateInviteToken(
  token: string
): Promise<ActionResult<ValidatedInvite>> {
  if (!token || token.length < 10) {
    return { success: false, error: "Invalid invitation link." };
  }

  const invitation = await invitationsRepo.getInvitationByToken(token);

  if (!invitation) {
    return { success: false, error: "INVITE_NOT_FOUND" };
  }

  if (invitation.status === "accepted") {
    return { success: false, error: "INVITE_ALREADY_USED" };
  }

  if (invitation.status === "expired") {
    return { success: false, error: "INVITE_EXPIRED" };
  }

  // Check if expired by date
  if (new Date(invitation.expires_at) < new Date()) {
    // Auto-expire it
    await invitationsRepo.revokeInvitation(invitation.id);
    return { success: false, error: "INVITE_EXPIRED" };
  }

  // Fetch company info
  const supabase = getServiceSupabase();
  const { data: company } = await supabase
    .from("companies")
    .select("id, name, slug")
    .eq("id", invitation.company_id)
    .single();

  if (!company) {
    return { success: false, error: "INVITE_COMPANY_NOT_FOUND" };
  }

  return {
    success: true,
    data: {
      token: invitation.token,
      company: {
        id: company.id,
        name: company.name,
        slug: company.slug,
      },
      email: invitation.email ?? null,
      expiresAt: invitation.expires_at,
    },
  };
}

// ── Accept invite ────────────────────────────────────────────────────────────

export async function acceptInvite(
  token: string,
  profileId: string
): Promise<ActionResult<{ companyId: string }>> {
  const invitation = await invitationsRepo.getInvitationByToken(token);

  if (!invitation) {
    return { success: false, error: "Invitation not found." };
  }

  if (invitation.status !== "pending") {
    return { success: false, error: "This invitation is no longer valid." };
  }

  if (new Date(invitation.expires_at) < new Date()) {
    await invitationsRepo.revokeInvitation(invitation.id);
    return { success: false, error: "This invitation has expired." };
  }

  // Link the profile to the company
  const supabase = getServiceSupabase();

  // Check if already linked
  const { data: existingLink } = await supabase
    .from("profile_companies")
    .select("id")
    .eq("profile_id", profileId)
    .eq("company_id", invitation.company_id)
    .maybeSingle();

  if (!existingLink) {
    const { error: linkError } = await supabase
      .from("profile_companies")
      .insert({
        profile_id: profileId,
        company_id: invitation.company_id,
        is_primary: false,
      });

    if (linkError) {
      return { success: false, error: "Failed to link to company." };
    }
  }

  // Mark invitation as accepted
  await invitationsRepo.acceptInvitation(token, profileId);

  return {
    success: true,
    data: { companyId: invitation.company_id },
  };
}

// ── Get company invites ──────────────────────────────────────────────────────

export async function getCompanyInvites(
  companyId: string
): Promise<ActionResult<Invitation[]>> {
  const invites = await invitationsRepo.getInvitationsByCompany(companyId);
  return { success: true, data: invites };
}
