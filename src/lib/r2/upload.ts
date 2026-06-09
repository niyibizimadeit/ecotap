import { S3Client, PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";

// ── R2 Client (S3-compatible) ─────────────────────────────────────────────

const R2_ENDPOINT = process.env.R2_ENDPOINT!;
const R2_ACCESS_KEY_ID = process.env.R2_ACCESS_KEY_ID!;
const R2_SECRET_ACCESS_KEY = process.env.R2_SECRET_ACCESS_KEY!;
const R2_BUCKET_NAME = process.env.R2_BUCKET_NAME!;
const R2_PUBLIC_URL = process.env.R2_PUBLIC_URL!;

function getClient(): S3Client {
  return new S3Client({
    region: "auto",
    endpoint: R2_ENDPOINT,
    credentials: {
      accessKeyId: R2_ACCESS_KEY_ID,
      secretAccessKey: R2_SECRET_ACCESS_KEY,
    },
  });
}

/** Generate a unique key for uploaded files */
function generateKey(prefix: string, filename: string): string {
  const ext = filename.split(".").pop() ?? "png";
  const timestamp = Date.now();
  const random = Math.random().toString(36).slice(2, 8);
  return `${prefix}/${timestamp}-${random}.${ext}`;
}

// ── Upload ────────────────────────────────────────────────────────────────

export interface UploadResult {
  success: boolean;
  key?: string;
  url?: string;
  error?: string;
}

/**
 * Upload a file buffer to R2.
 * Returns the public CDN URL on success.
 */
export async function uploadToR2(
  buffer: Buffer,
  filename: string,
  contentType: string,
  prefix: string = "uploads"
): Promise<UploadResult> {
  try {
    const client = getClient();
    const key = generateKey(prefix, filename);

    await client.send(
      new PutObjectCommand({
        Bucket: R2_BUCKET_NAME,
        Key: key,
        Body: buffer,
        ContentType: contentType,
        CacheControl: "public, max-age=31536000, immutable",
      })
    );

    const url = `${R2_PUBLIC_URL}/${key}`;

    return { success: true, key, url };
  } catch (error) {
    console.error("R2 upload failed:", error);
    return { success: false, error: "Upload failed. Please try again." };
  }
}

/**
 * Upload a profile photo. Validates: JPEG/PNG/WebP, max 5MB.
 */
export async function uploadProfilePhoto(
  buffer: Buffer,
  filename: string,
  contentType: string,
  profileId: string
): Promise<UploadResult> {
  const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
  if (!allowedTypes.includes(contentType)) {
    return { success: false, error: "Only JPEG, PNG, and WebP images are supported." };
  }

  if (buffer.length > 5 * 1024 * 1024) {
    return { success: false, error: "Image must be under 5MB." };
  }

  return uploadToR2(buffer, filename, contentType, `profiles/${profileId}`);
}

/**
 * Upload a company logo. Validates: JPEG/PNG/WebP, max 5MB.
 */
export async function uploadCompanyLogo(
  buffer: Buffer,
  filename: string,
  contentType: string,
  companyId: string
): Promise<UploadResult> {
  const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
  if (!allowedTypes.includes(contentType)) {
    return { success: false, error: "Only JPEG, PNG, and WebP images are supported." };
  }

  if (buffer.length > 5 * 1024 * 1024) {
    return { success: false, error: "Image must be under 5MB." };
  }

  return uploadToR2(buffer, filename, contentType, `companies/${companyId}`);
}

/**
 * Upload a card design preview image.
 */
export async function uploadDesignPreview(
  buffer: Buffer,
  filename: string,
  contentType: string,
  designId: string
): Promise<UploadResult> {
  const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
  if (!allowedTypes.includes(contentType)) {
    return { success: false, error: "Only JPEG, PNG, and WebP images are supported." };
  }

  if (buffer.length > 5 * 1024 * 1024) {
    return { success: false, error: "Image must be under 5MB." };
  }

  return uploadToR2(buffer, filename, contentType, `designs/${designId}`);
}

/**
 * Delete a file from R2 by key.
 */
export async function deleteFromR2(key: string): Promise<boolean> {
  try {
    const client = getClient();
    await client.send(
      new DeleteObjectCommand({
        Bucket: R2_BUCKET_NAME,
        Key: key,
      })
    );
    return true;
  } catch (error) {
    console.error("R2 delete failed:", error);
    return false;
  }
}

/**
 * Extract the key from a full R2 URL.
 */
export function keyFromUrl(url: string): string | null {
  if (!url.startsWith(R2_PUBLIC_URL)) return null;
  return url.slice(R2_PUBLIC_URL.length + 1);
}
