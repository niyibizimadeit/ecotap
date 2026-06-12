"use server";

import { getSupabase, getServiceSupabase } from "@/lib/supabase/server";
import { uploadProfilePhoto, uploadCompanyLogo, uploadDesignPreview, uploadToR2, deleteFromR2, keyFromUrl } from "@/lib/r2/upload";
import { uploadPaymentScreenshot as uploadPaymentScreenshotService } from "@/lib/services/orders.service";
import type { ActionResult } from "@/types";

// ── File validation ───────────────────────────────────────────────────────────

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/svg+xml"];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

function validateFile(file: File | null): string | null {
  if (!file || file.size === 0) return "No file provided.";
  if (file.size > MAX_FILE_SIZE) return "File must be under 5MB.";
  if (!ALLOWED_TYPES.includes(file.type)) return "Only JPEG, PNG, WebP, and SVG images are allowed.";
  return null;
}

// ── Profile photo ────────────────────────────────────────────────────────────

export async function updateProfilePhoto(
  formData: FormData
): Promise<ActionResult<{ url: string }>> {
  const supabase = await getSupabase();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { success: false, error: "Not authenticated." };

  const file = formData.get("file") as File | null;
  const fileError = validateFile(file);
  if (fileError) return { success: false, error: fileError };

  const buffer = Buffer.from(await file!.arrayBuffer());
  const result = await uploadProfilePhoto(buffer, file!.name, file!.type, user.id);

  if (!result.success || !result.url) {
    return { success: false, error: result.error ?? "Upload failed." };
  }

  // Use service-role client to bypass RLS (anon-key client hits recursive RLS on profiles)
  const serviceClient = getServiceSupabase();
  const { error } = await serviceClient
    .from("profiles")
    .update({ avatar_url: result.url })
    .eq("id", user.id);

  if (error) {
    console.error("Profile photo update failed:", error.message, error.code);
    return { success: false, error: `Failed to save photo: ${error.message}` };
  }

  return { success: true, data: { url: result.url } };
}

// ── Company logo ─────────────────────────────────────────────────────────────

export async function updateCompanyLogo(
  companyId: string,
  formData: FormData
): Promise<ActionResult<{ url: string }>> {
  const supabase = await getSupabase();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { success: false, error: "Not authenticated." };

  const file = formData.get("file") as File | null;
  const fileError = validateFile(file);
  if (fileError) return { success: false, error: fileError };

  const buffer = Buffer.from(await file!.arrayBuffer());
  const result = await uploadCompanyLogo(buffer, file!.name, file!.type, companyId);

  if (!result.success || !result.url) {
    return { success: false, error: result.error ?? "Upload failed." };
  }

  // Use service-role client for DB update (bypasses RLS)
  const serviceClient = getServiceSupabase();
  const { error } = await serviceClient
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
  const supabase = await getSupabase();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { success: false, error: "Not authenticated." };

  const file = formData.get("file") as File | null;
  if (!file || file.size === 0) {
    return { success: false, error: "No file provided." };
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const result = await uploadDesignPreview(buffer, file.name, file.type, designId);

  if (!result.success || !result.url) {
    return { success: false, error: result.error ?? "Upload failed." };
  }

  // Use service-role client for DB update (bypasses RLS)
  const serviceClient = getServiceSupabase();
  const { error } = await serviceClient
    .from("card_designs")
    .update({ preview_url: result.url })
    .eq("id", designId);

  if (error) return { success: false, error: "Failed to save preview URL." };

  return { success: true, data: { url: result.url } };
}

// ── Payment screenshot ────────────────────────────────────────────────────────

/**
 * Upload a payment screenshot to R2. Does NOT link to any order yet —
 * returns the URL so the caller can attach it when placing the order.
 */
export async function uploadPaymentScreenshot(
  formData: FormData
): Promise<ActionResult<{ url: string }>> {
  const supabase = await getSupabase();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { success: false, error: "Not authenticated." };

  const file = formData.get("file") as File | null;
  const fileError = validateFile(file);
  if (fileError) return { success: false, error: fileError };

  const buffer = Buffer.from(await file!.arrayBuffer());
  const result = await uploadToR2(buffer, file!.name, file!.type, "orders/pending");

  if (!result.success || !result.url) {
    return { success: false, error: result.error ?? "Upload failed." };
  }

  return { success: true, data: { url: result.url } };
}

/**
 * Link a previously-uploaded payment screenshot to an order and mark it as paid.
 * Called after the order is created.
 */
export async function linkPaymentToOrder(
  orderId: string,
  screenshotUrl: string
): Promise<ActionResult<{ url: string }>> {
  const supabase = await getSupabase();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { success: false, error: "Not authenticated." };

  const updated = await uploadPaymentScreenshotService(orderId, screenshotUrl);
  if (!updated.success) {
    return { success: false, error: updated.error ?? "Failed to record payment." };
  }

  return { success: true, data: { url: screenshotUrl } };
}

// ── Delete ───────────────────────────────────────────────────────────────────

export async function deleteUpload(url: string): Promise<ActionResult> {
  const supabase = await getSupabase();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { success: false, error: "Not authenticated." };

  const key = keyFromUrl(url);
  if (!key) return { success: false, error: "Invalid file URL." };

  const deleted = await deleteFromR2(key);
  if (!deleted) return { success: false, error: "Failed to delete file." };

  return { success: true };
}
