import Link from "next/link";
import { cn } from "@/lib/utils";
import { BrandIcon } from "./BrandIcon";

type BrandLogoProps = {
  /** Visual variant — sets text + icon color to match background */
  variant?: "light" | "dark" | "white" | "muted";
  /** Size of the logo icon */
  iconSize?: "sm" | "md" | "lg";
  /** Makes icon strokes appear bolder (subtle drop-shadow) */
  bold?: boolean;
  /** Link to — defaults to "/" */
  href?: string;
  className?: string;
};

const ICON_SIZES = {
  sm: "w-6 h-6",
  md: "w-8 h-8",
  lg: "w-9 h-9",
};

/** Matches globals.css brand tokens */
const TEXT_COLORS = {
  light: "text-emerald-deep",   // #064E3B — light backgrounds
  dark:  "text-ivory",          // #FEFCE8 — dark / emerald backgrounds
  white: "text-white",          // Pure white for footer
  muted: "text-ink-light",      // #78716C — subtle / attribution
};

export function BrandLogo({
  variant = "light",
  iconSize = "md",
  bold = false,
  href = "/",
  className,
}: BrandLogoProps) {
  const color = TEXT_COLORS[variant];
  const size = ICON_SIZES[iconSize];

  return (
    <Link href={href} className={cn("flex items-center gap-1 group w-fit", className)}>
      <BrandIcon
        bold={bold}
        className={cn(size, color, "transition-transform group-hover:scale-105")}
      />
      <span className={cn("font-serif text-xl tracking-tight", color)}>
        <strong className="font-bold">Eco</strong>Tap
      </span>
    </Link>
  );
}
