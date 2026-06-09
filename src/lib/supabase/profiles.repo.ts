// ─────────────────────────────────────────────────────────────────────────────
// Profiles repository — SSOT for all profiles table queries.
// No other file in the project queries profiles directly.
// ─────────────────────────────────────────────────────────────────────────────

import { getSupabase } from "@/lib/supabase/server";
import type { Profile, UserRole, UserStatus } from "@/types";

// ── Reads ────────────────────────────────────────────────────────────────────

export async function getProfileById(
  id: string
): Promise<Profile | null> {
  const supabase = await getSupabase();
  const { data } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", id)
    .single();
  return data;
}

export async function getProfileByUsername(
  username: string
): Promise<Profile | null> {
  const supabase = await getSupabase();
  const { data } = await supabase
    .from("profiles")
    .select("*")
    .eq("username", username)
    .single();
  return data;
}

export async function getProfileByEmail(
  email: string
): Promise<Profile | null> {
  const supabase = await getSupabase();
  const { data } = await supabase
    .from("profiles")
    .select("*")
    .eq("email", email)
    .single();
  return data;
}

export async function getAllProfiles(filters?: {
  role?: UserRole;
  status?: UserStatus;
}): Promise<Profile[]> {
  const supabase = await getSupabase();
  let query = supabase.from("profiles").select("*");

  if (filters?.role)   query = query.eq("role", filters.role);
  if (filters?.status) query = query.eq("status", filters.status);

  const { data } = await query.order("created_at", { ascending: false });
  return data ?? [];
}

export async function getAllPending(): Promise<Profile[]> {
  return getAllProfiles({ status: "pending" });
}

// ── Writes ───────────────────────────────────────────────────────────────────

export async function createProfile(
  profile: Pick<Profile, "id" | "email" | "full_name" | "username" | "role">
): Promise<Profile | null> {
  const supabase = await getSupabase();
  const { data } = await supabase
    .from("profiles")
    .insert({
      id:        profile.id,
      email:     profile.email,
      full_name: profile.full_name,
      username:  profile.username,
      role:      profile.role,
      status:    "pending",
    })
    .select()
    .single();
  return data;
}

export async function updateProfile(
  id: string,
  updates: Partial<Pick<Profile, "full_name" | "username" | "avatar_url">>
): Promise<Profile | null> {
  const supabase = await getSupabase();
  const { data } = await supabase
    .from("profiles")
    .update(updates)
    .eq("id", id)
    .select()
    .single();
  return data;
}

export async function updateProfileStatus(
  id: string,
  status: UserStatus
): Promise<Profile | null> {
  const supabase = await getSupabase();
  const { data } = await supabase
    .from("profiles")
    .update({ status })
    .eq("id", id)
    .select()
    .single();
  return data;
}

export async function updateProfileRole(
  id: string,
  role: UserRole
): Promise<Profile | null> {
  const supabase = await getSupabase();
  const { data } = await supabase
    .from("profiles")
    .update({ role })
    .eq("id", id)
    .select()
    .single();
  return data;
}

export async function deleteProfile(id: string): Promise<void> {
  const supabase = await getSupabase();
  await supabase.from("profiles").delete().eq("id", id);
}
