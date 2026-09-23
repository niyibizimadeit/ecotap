import { S3Client, PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";

// ── R2 Client (S3-compatible) ─────────────────────────────────────────────
//
// Config is read lazily, at call time — never at module load. These vars are
// only present where uploads actually run, so reading them on import would
// throw as soon as anything imported this module during local development.

function requireEnv(key: string): string {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Missing required environment variable: ${key}. Image uploads are disabled.`);
  }
  return value;
}

function getClient(): S3Client {
  return new S3Client({
    region: "auto",
    endpoint: requireEnv("R2_ENDPOINT"),
    credentials: {
      accessKeyId: requireEnv("R2_ACCESS_KEY_ID"),
      secretAccessKey: requireEnv("R2_SECRET_ACCESS_KEY"),
    },
  });
}

/** Generate a unique key for uploaded files using crypto for collision resistance */
function generateKey(prefix: string, filename: string): string {
  const ext = filename.split(".").pop() ?? "png";
  const uuid = crypto.randomUUID();
  return `${prefix}/${uuid}.${ext}`;
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
    const bucket = requireEnv("R2_BUCKET_NAME");
    const publicUrl = requireEnv("R2_PUBLIC_URL");
    const client = getClient();
    const key = generateKey(prefix, filename);

    await client.send(
      new PutObjectCommand({
        Bucket: bucket,
        Key: key,
        Body: buffer,
        ContentType: contentType,
        CacheControl: "public, max-age=31536000, immutable",
      })
    );

    const url = `${publicUrl}/${key}`;

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
    const bucket = requireEnv("R2_BUCKET_NAME");
    const client = getClient();
    await client.send(
      new DeleteObjectCommand({
        Bucket: bucket,
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
  // Read directly rather than via requireEnv — this is synchronous and must
  // never throw. With no base URL configured no R2 URL can match anyway.
  const publicUrl = process.env.R2_PUBLIC_URL;
  if (!publicUrl || !url.startsWith(publicUrl)) return null;
  return url.slice(publicUrl.length + 1);
}
