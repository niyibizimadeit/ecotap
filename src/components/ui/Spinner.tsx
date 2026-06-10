import { cn } from "@/lib/utils";

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
      role="status"
      aria-label="Loading"
      className={cn(
        "rounded-full border-emerald-light border-t-emerald-bright animate-spin",
        SPINNER_SIZES[size],
        className
      )}
    />
  );
}
