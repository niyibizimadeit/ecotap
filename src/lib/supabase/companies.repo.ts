// ─────────────────────────────────────────────────────────────────────────────
// Companies repository — SSOT for all companies table queries.
// ─────────────────────────────────────────────────────────────────────────────

import { getSupabase, getServiceSupabase } from "@/lib/supabase/server";
import type { Company, UserStatus } from "@/types";

// ── Reads ────────────────────────────────────────────────────────────────────

export async function getCompanyById(id: string): Promise<Company | null> {
  const supabase = await getSupabase();
  const { data } = await supabase
    .from("companies")
    .select("*")
    .eq("id", id)
    .single();
  return data;
}

export async function getCompanyBySlug(slug: string): Promise<Company | null> {
  const supabase = await getSupabase();
  const { data } = await supabase
    .from("companies")
    .select("*")
    .eq("slug", slug)
    .single();
  return data;
}

export async function getAllCompanies(filters?: {
  status?: UserStatus;
}): Promise<Company[]> {
  const supabase = await getSupabase();
  let query = supabase.from("companies").select("*");

  if (filters?.status) query = query.eq("status", filters.status);

  const { data } = await query.order("created_at", { ascending: false });
  return data ?? [];
}

export async function getAllPendingCompanies(): Promise<Company[]> {
  return getAllCompanies({ status: "pending" });
}

// ── Writes ───────────────────────────────────────────────────────────────────

export async function createCompany(company: {
  name: string;
  slug: string;
  industry?: string;
  website?: string;
  size?: string;
  brand_color?: string;
  legal_rep_confirmed?: boolean;
}): Promise<Company | null> {
  const supabase = await getSupabase();
  const { data } = await supabase
    .from("companies")
    .insert({
      name:                company.name,
      slug:                company.slug,
      industry:            company.industry ?? null,
      website:             company.website ?? null,
      size:                company.size ?? null,
      brand_color:         company.brand_color ?? "#064E3B",
      legal_rep_confirmed: company.legal_rep_confirmed ?? false,
      status:              "pending",
    })
    .select()
    .single();
  return data;
}

export async function updateCompany(
  id: string,
  updates: Partial<Pick<Company, "name" | "logo_url" | "brand_color" | "industry" | "website" | "size" | "description" | "theme_locked">>
): Promise<Company | null> {
  const supabase = await getSupabase();
  const { data } = await supabase
    .from("companies")
    .update(updates)
    .eq("id", id)
    .select()
    .single();
  return data;
}

export async function updateCompanyStatus(
  id: string,
  status: UserStatus
): Promise<Company | null> {
  const supabase = getServiceSupabase();
  const { data } = await supabase
    .from("companies")
    .update({ status })
    .eq("id", id)
    .select()
    .single();
  return data;
}

export async function deleteCompany(id: string): Promise<void> {
  const supabase = getServiceSupabase();
  await supabase.from("companies").delete().eq("id", id);
}
