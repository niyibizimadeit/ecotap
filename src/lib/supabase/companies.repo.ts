// ─────────────────────────────────────────────────────────────────────────────
// Companies repository — SSOT for all companies table queries.
// ─────────────────────────────────────────────────────────────────────────────

import { getSupabase, getServiceSupabase } from "@/lib/supabase/server";
import type { Company, SocialLinks, UserStatus } from "@/types";

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

export async function updateCompanySocialLinks(
  id: string,
  socialLinks: SocialLinks
): Promise<Company | null> {
  const supabase = getServiceSupabase();
  const { data } = await supabase
    .from("companies")
    .update({ social_links: socialLinks as unknown as Record<string, unknown> })
    .eq("id", id)
    .select()
    .single();
  return data;
}

export async function deleteCompany(id: string): Promise<void> {
  const supabase = getServiceSupabase();
  await supabase.from("companies").delete().eq("id", id);
}

/**
 * Cascade-delete a company and all its related records.
 *
 * `success` means the companies row is actually GONE. The four pre-steps are
 * belt-and-braces: every FK into companies (departments, profile_companies,
 * invitations, company_subscriptions, environmental_reports) is ON DELETE
 * CASCADE, so their failures are recorded for diagnostics but are not fatal.
 * The authoritative step is the final companies delete.
 *
 * NOTE ON THE GUARDS: PostgREST errors RESOLVE, they do not throw — the Supabase
 * client's `shouldThrowOnError` defaults to false and `throwOnError` is used
 * nowhere in this codebase. The `try/catch` this replaced could therefore never
 * fire, which made `success` permanently true and reported every failed company
 * deletion as a clean success. Do not reintroduce try/catch around these calls.
 */
export async function deleteCompanyCascade(companyId: string): Promise<{
  success: boolean;
  errors: string[];
}> {
  const supabase = getServiceSupabase();
  const errors: string[] = [];

  const steps = [
    { name: "profile_companies", fn: () => supabase.from("profile_companies").delete().eq("company_id", companyId) },
    { name: "departments",        fn: () => supabase.from("departments").delete().eq("company_id", companyId) },
    { name: "company_subscriptions", fn: () => supabase.from("company_subscriptions").delete().eq("company_id", companyId) },
    { name: "environmental_reports", fn: () => supabase.from("environmental_reports").delete().eq("company_id", companyId) },
  ];

  for (const step of steps) {
    const { error } = await step.fn();
    if (error) {
      errors.push(`${step.name}: ${error.message}`);
      console.error(`deleteCompanyCascade ${step.name} failed:`, error);
    }
  }

  // The authoritative step. `.select("id")` matters: an RLS-blocked delete comes
  // back as a 204 with no error and zero rows, so a bare delete would report
  // success for a no-op.
  const { data: deleted, error: deleteError } = await supabase
    .from("companies")
    .delete()
    .eq("id", companyId)
    .select("id");

  if (deleteError) {
    errors.push(`company: ${deleteError.message}`);
    console.error("deleteCompanyCascade company delete failed:", deleteError);
    return { success: false, errors };
  }

  if (!deleted || deleted.length === 0) {
    errors.push("company: no row deleted (not found, or the delete was not permitted)");
    console.error("deleteCompanyCascade deleted 0 rows for", companyId);
    return { success: false, errors };
  }

  return { success: true, errors };
}
