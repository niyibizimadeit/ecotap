// ─────────────────────────────────────────────────────────────────────────────
// Departments repository — SSOT for all departments table queries.
// ─────────────────────────────────────────────────────────────────────────────

import { getSupabase } from "@/lib/supabase/server";
import type { Department } from "@/types";

// ── Reads ────────────────────────────────────────────────────────────────────

export async function getDepartmentsByCompany(
  companyId: string
): Promise<Department[]> {
  const supabase = await getSupabase();
  const { data } = await supabase
    .from("departments")
    .select("*")
    .eq("company_id", companyId)
    .order("name");
  return data ?? [];
}

export async function getDepartmentById(
  id: string
): Promise<Department | null> {
  const supabase = await getSupabase();
  const { data } = await supabase
    .from("departments")
    .select("*")
    .eq("id", id)
    .single();
  return data;
}

// ── Writes ───────────────────────────────────────────────────────────────────

export async function createDepartment(department: {
  company_id: string;
  name: string;
  color?: string;
}): Promise<Department | null> {
  const supabase = await getSupabase();
  const { data } = await supabase
    .from("departments")
    .insert({
      company_id: department.company_id,
      name:       department.name,
      color:      department.color ?? null,
    })
    .select()
    .single();
  return data;
}

export async function updateDepartment(
  id: string,
  updates: Partial<Pick<Department, "name" | "color">>
): Promise<Department | null> {
  const supabase = await getSupabase();
  const { data } = await supabase
    .from("departments")
    .update(updates)
    .eq("id", id)
    .select()
    .single();
  return data;
}

export async function deleteDepartment(id: string): Promise<void> {
  const supabase = await getSupabase();
  await supabase.from("departments").delete().eq("id", id);
}
