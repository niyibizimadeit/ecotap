import { cn } from "@/lib/utils";
import { getInitials } from "@/lib/utils";

// ── Spinner ───────────────────────────────────────────────────────────────────

interface SpinnerProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

const SPINNER_SIZES = {
  sm: "h-4 w-4 border-2",
  md: "h-6 w-6 border-2",
  lg: "h-8 w-8 border-[3px]",
};

export function Spinner({ size = "md", className }: SpinnerProps) {
  return (
    <div
      className={cn(
        "rounded-full border-emerald-light border-t-emerald-bright animate-spin",
        SPINNER_SIZES[size],
        className
      )}
    />
  );
}

// ── Avatar ────────────────────────────────────────────────────────────────────

interface AvatarProps {
  src?: string | null;
  name: string;
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  className?: string;
}

const AVATAR_SIZES = {
  xs: "h-6 w-6 text-[10px]",
  sm: "h-8 w-8 text-xs",
  md: "h-10 w-10 text-sm",
  lg: "h-12 w-12 text-base",
  xl: "h-16 w-16 text-xl",
};

export function Avatar({ src, name, size = "md", className }: AvatarProps) {
  if (src) {
    return (
      <img
        src={src}
        alt={name}
        className={cn(
          "rounded-full object-cover border-2 border-cream-dark flex-shrink-0",
          AVATAR_SIZES[size],
          className
        )}
      />
    );
  }

  return (
    <div
      className={cn(
        "rounded-full bg-emerald-pale border-2 border-emerald-light flex items-center justify-center flex-shrink-0 font-sans font-medium text-emerald-mid",
        AVATAR_SIZES[size],
        className
      )}
    >
      {getInitials(name)}
    </div>
  );
}

// ── Skeleton ──────────────────────────────────────────────────────────────────

interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className }: SkeletonProps) {
  return (
    <div className={cn("skeleton rounded-lg bg-cream-dark", className)} />
  );
}
