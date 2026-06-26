"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Cropper, { type Area } from "react-easy-crop";
import { Upload, X, Loader2, ZoomIn, ZoomOut, Check, SlidersHorizontal, Crop } from "lucide-react";
import { cn } from "@/lib/utils";

// ── Types ─────────────────────────────────────────────────────────────────────

type ImageUploadProps = {
  /** Current image URL, if any */
  currentUrl?: string | null;
  /** Callback with FormData containing the cropped file */
  onUpload: (formData: FormData) => Promise<{ success: boolean; error?: string; data?: { url: string } }>;
  /** Called after successful upload */
  onUploaded?: (url: string) => void;
  /** Called to remove current image */
  onRemove?: () => void;
  /** Size variant */
  size?: "sm" | "md" | "lg";
  className?: string;
};

const SIZES = {
  sm:  "w-20 h-20",
  md:  "w-28 h-28",
  lg:  "w-40 h-40",
};

const ICON_SIZES = {
  sm:  "h-6 w-6",
  md:  "h-8 w-8",
  lg:  "h-10 w-10",
};

// ── Canvas helper ─────────────────────────────────────────────────────────────

/**
 * Creates a cropped image from a source URL at the given pixel area.
 * Returns a Blob ready for upload.
 */
async function createCroppedImage(imageSrc: string, pixelCrop: Area): Promise<Blob> {
  const image = await loadImage(imageSrc);
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d")!;

  // Set canvas to the crop dimensions
  canvas.width = Math.round(pixelCrop.width);
  canvas.height = Math.round(pixelCrop.height);

  // Draw the cropped portion
  ctx.drawImage(
    image,
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height,
    0,
    0,
    canvas.width,
    canvas.height
  );

  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) resolve(blob);
        else reject(new Error("Canvas toBlob returned null"));
      },
      "image/jpeg",
      0.92
    );
  });
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = (e) => reject(e);
    img.src = src;
  });
}

// ── Component ─────────────────────────────────────────────────────────────────

export function ImageUpload({
  currentUrl,
  onUpload,
  onUploaded,
  onRemove,
  size = "md",
  className,
}: ImageUploadProps) {
  const [preview, setPreview] = useState<string | null>(currentUrl ?? null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // ── Crop state ─────────────────────────────────────────────────────────────
  const [cropImage, setCropImage] = useState<string | null>(null);
  const [cropModalOpen, setCropModalOpen] = useState(false);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);

  // Sync preview when currentUrl changes from parent
  useEffect(() => {
    setPreview(currentUrl ?? null);
  }, [currentUrl]);

  // ── File selection → open crop modal ──────────────────────────────────────

  function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate type
    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      setError("Only JPEG, PNG, and WebP images are allowed.");
      if (inputRef.current) inputRef.current.value = "";
      return;
    }

    // Show crop modal
    const previewUrl = URL.createObjectURL(file);
    setCropImage(previewUrl);
    setCropModalOpen(true);
    setCrop({ x: 0, y: 0 });
    setZoom(1);
    setCroppedAreaPixels(null);
    setError(null);

    // Reset file input so the same file can be re-selected later
    if (inputRef.current) inputRef.current.value = "";
  }

  const onCropComplete = useCallback((_: Area, pixels: Area) => {
    setCroppedAreaPixels(pixels);
  }, []);

  // ── Confirm crop → upload ─────────────────────────────────────────────────

  async function handleCropConfirm() {
    if (!cropImage || !croppedAreaPixels) return;

    setCropModalOpen(false);
    setUploading(true);
    setError(null);

    try {
      const croppedBlob = await createCroppedImage(cropImage, croppedAreaPixels);

      // Build a File from the blob
      const croppedFile = new File([croppedBlob], "profile.jpg", { type: "image/jpeg" });
      const formData = new FormData();
      formData.append("file", croppedFile);

      const result = await onUpload(formData);
      setUploading(false);

      if (result.success && result.data?.url) {
        setPreview(result.data.url);
        onUploaded?.(result.data.url);
      } else {
        setError(result.error ?? "Upload failed");
      }
    } catch {
      setUploading(false);
      setError("Failed to crop image.");
    }

    // Clean up the crop preview blob URL
    URL.revokeObjectURL(cropImage);
    setCropImage(null);
  }

  function handleCropCancel() {
    setCropModalOpen(false);
    if (cropImage) URL.revokeObjectURL(cropImage);
    setCropImage(null);
  }

  // ── Remove ─────────────────────────────────────────────────────────────────

  function handleRemove() {
    setPreview(null);
    setError(null);
    if (inputRef.current) inputRef.current.value = "";
    onRemove?.();
  }

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <>
      <div className={cn("flex flex-col items-center gap-3", className)}>
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          onChange={handleFileSelect}
          className="hidden"
        />

        {/* Upload trigger */}
        <div
          className={cn(
            "rounded-2xl border-2 border-dashed flex items-center justify-center overflow-hidden relative cursor-pointer transition-colors group",
            SIZES[size],
            preview
              ? "border-emerald-light bg-emerald-pale"
              : "border-cream-dark bg-cream hover:border-emerald-light hover:bg-emerald-pale/50",
          )}
          onClick={() => inputRef.current?.click()}
        >
          {uploading ? (
            <div className="flex flex-col items-center gap-1">
              <Loader2 className={cn(ICON_SIZES[size], "text-emerald-bright animate-spin")} />
              <span className="text-[10px] text-emerald-bright font-medium">Uploading…</span>
            </div>
          ) : preview ? (
            <>
              <img src={preview} alt="" className="w-full h-full object-cover" />
              {/* Hover overlay with actions */}
              <div className="absolute inset-0 bg-ink/0 group-hover:bg-ink/30 transition-all flex items-center justify-center gap-1.5 opacity-0 group-hover:opacity-100">
                <span
                  className="w-7 h-7 rounded-full bg-white/90 text-emerald-deep flex items-center justify-center"
                  title="Change photo"
                >
                  <SlidersHorizontal className="h-3.5 w-3.5" />
                </span>
                {onRemove && (
                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); handleRemove(); }}
                    className="w-7 h-7 rounded-full bg-white/90 text-red-500 flex items-center justify-center"
                    title="Remove photo"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center gap-1 text-ink-light">
              <Upload className={cn(ICON_SIZES[size], "group-hover:text-emerald-bright transition-colors")} />
              <span className="text-[10px] font-medium">Upload</span>
            </div>
          )}
        </div>

        {error && <p className="text-xs text-red-500">{error}</p>}
      </div>

      {/* ─── Crop Modal ─────────────────────────────────────────────────────── */}
      {cropModalOpen && cropImage && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-ink/60 backdrop-blur-sm p-4">
          <div
            className="bg-white rounded-2xl shadow-card-xl w-full max-w-lg overflow-hidden animate-scale-in"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-cream-dark">
              <div className="flex items-center gap-2">
                <Crop className="h-4 w-4 text-emerald-deep" />
                <h3 className="font-serif text-lg font-semibold text-emerald-deep">Crop your photo</h3>
              </div>
              <button
                onClick={handleCropCancel}
                className="p-1.5 rounded-lg hover:bg-cream text-ink-light hover:text-ink transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Cropper area */}
            <div className="relative w-full h-72 sm:h-80 bg-ink/5">
              <Cropper
                image={cropImage}
                crop={crop}
                zoom={zoom}
                aspect={1}
                cropShape="rect"
                showGrid={false}
                onCropChange={setCrop}
                onCropComplete={onCropComplete}
                onZoomChange={setZoom}
              />
            </div>

            {/* Zoom controls */}
            <div className="px-5 py-4 border-t border-cream-dark">
              <div className="flex items-center gap-3">
                <ZoomOut className="h-4 w-4 text-ink-light" />
                <input
                  type="range"
                  min={1}
                  max={3}
                  step={0.01}
                  value={zoom}
                  onChange={(e) => setZoom(Number(e.target.value))}
                  className="flex-1 h-1.5 rounded-full appearance-none cursor-pointer"
                  style={{
                    background: `linear-gradient(to right, #064E3B 0%, #064E3B ${((zoom - 1) / 2) * 100}%, #E5E7EB ${((zoom - 1) / 2) * 100}%, #E5E7EB 100%)`,
                  }}
                />
                <ZoomIn className="h-4 w-4 text-ink-light" />
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3 px-5 py-4 border-t border-cream-dark bg-cream/30">
              <button
                onClick={handleCropCancel}
                className="flex-1 h-10 rounded-xl border border-cream-dark text-sm font-medium text-ink-mid hover:bg-cream transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleCropConfirm}
                disabled={!croppedAreaPixels}
                className="flex-1 h-10 rounded-xl text-sm font-medium text-ivory transition-all flex items-center justify-center gap-1.5 disabled:opacity-50"
                style={{ backgroundColor: "#064E3B" }}
              >
                <Check className="h-4 w-4" />
                Apply
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
