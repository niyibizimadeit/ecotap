// ─────────────────────────────────────────────────────────────────────────────
// Card designs repository — SSOT for all card_designs table queries.
// ─────────────────────────────────────────────────────────────────────────────

import { getSupabase } from "@/lib/supabase/server";
import type { CardDesign } from "@/types";

// ── Reads ────────────────────────────────────────────────────────────────────

export async function getActiveDesigns(): Promise<CardDesign[]> {
  const supabase = await getSupabase();
  const { data } = await supabase
    .from("card_designs")
    .select("*")
    .eq("is_active", true)
    .order("created_at", { ascending: false });
  return data ?? [];
}

export async function getAllDesigns(): Promise<CardDesign[]> {
  const supabase = await getSupabase();
  const { data } = await supabase
    .from("card_designs")
    .select("*")
    .order("created_at", { ascending: false });
  return data ?? [];
}

export async function getDesignById(
  id: string
): Promise<CardDesign | null> {
  const supabase = await getSupabase();
  const { data } = await supabase
    .from("card_designs")
    .select("*")
    .eq("id", id)
    .single();
  return data;
}

// ── Writes ───────────────────────────────────────────────────────────────────

export async function createDesign(design: {
  name: string;
  description?: string;
  preview_url?: string;
  accent_color?: string;
  pattern?: string;
  is_active?: boolean;
}): Promise<CardDesign | null> {
  const supabase = await getSupabase();
  const { data } = await supabase
    .from("card_designs")
    .insert({
      name:         design.name,
      description:  design.description ?? null,
      preview_url:  design.preview_url ?? null,
      accent_color: design.accent_color ?? "#064E3B",
      pattern:      design.pattern ?? "dots",
      is_active:    design.is_active ?? true,
    })
    .select()
    .single();
  return data;
}

export async function updateDesign(
  id: string,
  updates: Partial<
    Pick<CardDesign, "name" | "description" | "preview_url" | "accent_color" | "pattern" | "is_active">
  >
): Promise<CardDesign | null> {
  const supabase = await getSupabase();
  const { data } = await supabase
    .from("card_designs")
    .update(updates)
    .eq("id", id)
    .select()
    .single();
  return data;
}

export async function deleteDesign(id: string): Promise<void> {
  const supabase = await getSupabase();
  await supabase.from("card_designs").delete().eq("id", id);
}
