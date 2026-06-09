"use server";

import { getSupabase } from "@/lib/supabase/server";
import { uploadProfilePhoto, uploadCompanyLogo, uploadDesignPreview, deleteFromR2, keyFromUrl } from "@/lib/r2/upload";
import type { ActionResult } from "@/types";

// ── Guard ────────────────────────────────────────────────────────────────────

async function getCurrentProfileId(): Promise<string | null> {
  const supabase = await getSupabase();
  const { data: { user } } = await supabase.auth.getUser();
  return user?.id ?? null;
}

// ── Profile photo ────────────────────────────────────────────────────────────

export async function updateProfilePhoto(
  formData: FormData
): Promise<ActionResult<{ url: string }>> {
  const profileId = await getCurrentProfileId();
  if (!profileId) return { success: false, error: "Not authenticated." };

  const file = formData.get("file") as File | null;
  if (!file || file.size === 0) {
    return { success: false, error: "No file provided." };
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const result = await uploadProfilePhoto(buffer, file.name, file.type, profileId);

  if (!result.success || !result.url) {
    return { success: false, error: result.error ?? "Upload failed." };
  }

  // Update profile avatar_url in DB
  const supabase = await getSupabase();
  const { error } = await supabase
    .from("profiles")
    .update({ avatar_url: result.url })
    .eq("id", profileId);

  if (error) return { success: false, error: "Failed to save photo URL." };

  return { success: true, data: { url: result.url } };
}

// ── Company logo ─────────────────────────────────────────────────────────────

export async function updateCompanyLogo(
  companyId: string,
  formData: FormData
): Promise<ActionResult<{ url: string }>> {
  const profileId = await getCurrentProfileId();
  if (!profileId) return { success: false, error: "Not authenticated." };

  const file = formData.get("file") as File | null;
  if (!file || file.size === 0) {
    return { success: false, error: "No file provided." };
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const result = await uploadCompanyLogo(buffer, file.name, file.type, companyId);

  if (!result.success || !result.url) {
    return { success: false, error: result.error ?? "Upload failed." };
  }

  // Update company logo_url in DB
  const supabase = await getSupabase();
  const { error } = await supabase
    .from("companies")
    .update({ logo_url: result.url })
    .eq("id", companyId);

  if (error) return { success: false, error: "Failed to save logo URL." };

  return { success: true, data: { url: result.url } };
}

// ── Design preview ───────────────────────────────────────────────────────────

export async function uploadDesignImage(
  designId: string,
  formData: FormData
): Promise<ActionResult<{ url: string }>> {
  const profileId = await getCurrentProfileId();
  if (!profileId) return { success: false, error: "Not authenticated." };

  const file = formData.get("file") as File | null;
  if (!file || file.size === 0) {
    return { success: false, error: "No file provided." };
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const result = await uploadDesignPreview(buffer, file.name, file.type, designId);

  if (!result.success || !result.url) {
    return { success: false, error: result.error ?? "Upload failed." };
  }

  // Update design preview_url in DB
  const supabase = await getSupabase();
  const { error } = await supabase
    .from("card_designs")
    .update({ preview_url: result.url })
    .eq("id", designId);

  if (error) return { success: false, error: "Failed to save preview URL." };

  return { success: true, data: { url: result.url } };
}

// ── Delete ───────────────────────────────────────────────────────────────────

export async function deleteUpload(url: string): Promise<ActionResult> {
  const profileId = await getCurrentProfileId();
  if (!profileId) return { success: false, error: "Not authenticated." };

  const key = keyFromUrl(url);
  if (!key) return { success: false, error: "Invalid file URL." };

  const deleted = await deleteFromR2(key);
  if (!deleted) return { success: false, error: "Failed to delete file." };

  return { success: true };
}
