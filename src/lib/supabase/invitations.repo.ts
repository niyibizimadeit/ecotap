// ─────────────────────────────────────────────────────────────────────────────
// Invitations repository — SSOT for all invitations table queries.
// ─────────────────────────────────────────────────────────────────────────────

import { getSupabase, getServiceSupabase } from "@/lib/supabase/server";
import type { Invitation } from "@/types";

// ── Reads ────────────────────────────────────────────────────────────────────

export async function getInvitationByToken(
  token: string
): Promise<Invitation | null> {
  const supabase = getServiceSupabase();
  const { data } = await supabase
    .from("invitations")
    .select("*")
    .eq("token", token)
    .single();
  return data;
}

export async function getInvitationsByCompany(
  companyId: string
): Promise<Invitation[]> {
  const supabase = await getSupabase();
  const { data } = await supabase
    .from("invitations")
    .select("*")
    .eq("company_id", companyId)
    .order("created_at", { ascending: false });
  return data ?? [];
}

export async function getPendingInvitationsByCompany(
  companyId: string
): Promise<Invitation[]> {
  const supabase = await getSupabase();
  const { data } = await supabase
    .from("invitations")
    .select("*")
    .eq("company_id", companyId)
    .eq("status", "pending")
    .order("created_at", { ascending: false });
  return data ?? [];
}

// ── Writes ───────────────────────────────────────────────────────────────────

export async function createInvitation(invite: {
  company_id: string;
  created_by: string;
  email?: string | null;
}): Promise<Invitation | null> {
  const supabase = getServiceSupabase();
  const { data } = await supabase
    .from("invitations")
    .insert({
      company_id: invite.company_id,
      created_by: invite.created_by,
      email: invite.email ?? null,
    })
    .select()
    .single();
  return data;
}

export async function acceptInvitation(
  token: string,
  profileId: string
): Promise<Invitation | null> {
  const supabase = getServiceSupabase();
  const { data } = await supabase
    .from("invitations")
    .update({
      status: "accepted",
      accepted_by: profileId,
    })
    .eq("token", token)
    .eq("status", "pending")
    .select()
    .single();
  return data;
}

export async function revokeInvitation(id: string): Promise<void> {
  const supabase = getServiceSupabase();
  await supabase
    .from("invitations")
    .update({ status: "expired" })
    .eq("id", id);
}

export async function deleteInvitation(id: string): Promise<void> {
  const supabase = getServiceSupabase();
  await supabase.from("invitations").delete().eq("id", id);
}
