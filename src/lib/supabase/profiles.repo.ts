// ─────────────────────────────────────────────────────────────────────────────
// Profiles repository — SSOT for all profiles table queries.
// No other file in the project queries profiles directly.
// ─────────────────────────────────────────────────────────────────────────────

import { getSupabase, getServiceSupabase } from "@/lib/supabase/server";
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
  const supabase = getServiceSupabase();
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

// ── Admin / service-role operations ────────────────────────────────────────────

/** Update profile role using service role (bypasses RLS for admin actions) */
export async function updateProfileRoleService(
  id: string,
  role: UserRole
): Promise<Profile | null> {
  const supabase = getServiceSupabase();
  const { data } = await supabase
    .from("profiles")
    .update({ role })
    .eq("id", id)
    .select()
    .single();
  return data;
}

/** Delete profile using service role (bypasses RLS for admin actions) */
export async function deleteProfileService(id: string): Promise<void> {
  const supabase = getServiceSupabase();
  await supabase.from("profiles").delete().eq("id", id);
}

/**
 * Full profile detail — profile + card + orders + company associations.
 * Uses multiple queries joined client-side for reliability.
 */
export async function getProfileFull(profileId: string) {
  const supabase = getServiceSupabase();

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", profileId)
    .single();

  if (!profile) return null;

  const [cardResult, ordersResult, pcResult] = await Promise.all([
    supabase.from("cards").select("*").eq("profile_id", profileId).maybeSingle(),
    supabase
      .from("card_orders")
      .select("*, design:card_designs(*)")
      .eq("profile_id", profileId)
      .order("created_at", { ascending: false }),
    supabase
      .from("profile_companies")
      .select("*")
      .eq("profile_id", profileId),
  ]);

  // Resolve companies + departments for profile-company links
  let companies: Array<Record<string, unknown>> = [];
  const pcRows = pcResult.data;
  if (pcRows && pcRows.length > 0) {
    const companyIds = [...new Set(pcRows.map((pc: Record<string, unknown>) => pc.company_id))];
    const deptIds = [...new Set(pcRows.map((pc: Record<string, unknown>) => pc.department_id).filter(Boolean))];

    const [compResult, deptResult] = await Promise.all([
      supabase.from("companies").select("*").in("id", companyIds as string[]),
      deptIds.length > 0
        ? supabase.from("departments").select("id, name").in("id", deptIds as string[])
        : Promise.resolve({ data: [] }),
    ]);

    const compMap = new Map((compResult.data ?? []).map((c: Record<string, unknown>) => [c.id, c]));
    const deptMap = new Map((deptResult.data ?? []).map((d: Record<string, unknown>) => [d.id, d]));

    companies = pcRows.map((pc: Record<string, unknown>) => ({
      ...pc,
      company: compMap.get(pc.company_id as string) ?? null,
      department: deptMap.get(pc.department_id as string) ?? null,
    }));
  }

  return {
    profile,
    card: cardResult.data ?? null,
    orders: ordersResult.data ?? [],
    companies,
  };
}

/** Search profiles by name, username, or email (ilike), limited to 10 results */
export async function searchProfilesByQuery(query: string): Promise<Profile[]> {
  const supabase = getServiceSupabase();
  const q = `%${query}%`;

  const [byEmail, byUsername, byName] = await Promise.all([
    supabase.from("profiles").select("*").ilike("email", q).limit(10),
    supabase.from("profiles").select("*").ilike("username", q).limit(10),
    supabase.from("profiles").select("*").ilike("full_name", q).limit(10),
  ]);

  // Deduplicate by id, preferring email matches first, then name
  const seen = new Set<string>();
  const results: Profile[] = [];
  for (const p of [...(byEmail.data ?? []), ...(byName.data ?? []), ...(byUsername.data ?? [])]) {
    if (!seen.has(p.id)) {
      seen.add(p.id);
      results.push(p as Profile);
    }
  }
  return results.slice(0, 10);
}
