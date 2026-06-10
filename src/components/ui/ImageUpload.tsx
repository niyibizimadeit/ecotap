"use client";

import { useState, useRef, useEffect } from "react";
import { Upload, X, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

type ImageUploadProps = {
  /** Current image URL, if any */
  currentUrl?: string | null;
  /** Callback with FormData containing the file */
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
  const objectUrlRef = useRef<string | null>(null);

  // Cleanup blob URL on unmount
  useEffect(() => {
    return () => {
      if (objectUrlRef.current) URL.revokeObjectURL(objectUrlRef.current);
    };
  }, []);

  // Sync preview when currentUrl changes from parent
  useEffect(() => {
    setPreview(currentUrl ?? null);
  }, [currentUrl]);

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    // Revoke previous local blob URL to prevent memory leak
    if (objectUrlRef.current) URL.revokeObjectURL(objectUrlRef.current);

    // Local preview
    const previewUrl = URL.createObjectURL(file);
    objectUrlRef.current = previewUrl;
    setPreview(previewUrl);
    setError(null);
    setUploading(true);

    const formData = new FormData();
    formData.append("file", file);

    const result = await onUpload(formData);
    setUploading(false);

    if (result.success && result.data?.url) {
      onUploaded?.(result.data.url);
    } else {
      setError(result.error ?? "Upload failed");
      setPreview(currentUrl ?? null); // Revert to server image
      // Revoke the failed blob
      if (objectUrlRef.current) {
        URL.revokeObjectURL(objectUrlRef.current);
        objectUrlRef.current = null;
      }
    }

    // Reset input so the same file can be re-selected
    if (inputRef.current) inputRef.current.value = "";
  }

  function handleRemove() {
    setPreview(null);
    setError(null);
    if (inputRef.current) inputRef.current.value = "";
    onRemove?.();
  }

  return (
    <div className={cn("flex flex-col items-center gap-3", className)}>
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        onChange={handleFileChange}
        className="hidden"
      />

      <div
        className={cn(
          "rounded-2xl border-2 border-dashed flex items-center justify-center overflow-hidden relative cursor-pointer transition-colors group",
          SIZES[size],
          preview ? "border-emerald-light bg-emerald-pale" : "border-cream-dark bg-cream hover:border-emerald-light hover:bg-emerald-pale/50",
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
            {onRemove && (
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); handleRemove(); }}
                className="absolute top-2 right-2 w-6 h-6 rounded-full bg-ink/60 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
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
  );
}
