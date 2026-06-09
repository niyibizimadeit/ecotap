import Link from "next/link";
import { cn } from "@/lib/utils";

type BrandLogoProps = {
  /** Visual variant for different backgrounds */
  variant?: "light" | "dark" | "muted";
  /** Size of the logo icon */
  iconSize?: "sm" | "md" | "lg";
  /** Link to — defaults to "/" */
  href?: string;
  className?: string;
};

const ICON_SIZES = {
  sm: "w-6 h-6",
  md: "w-8 h-8",
  lg: "w-9 h-9",
};

const TEXT_COLORS = {
  light: "text-emerald-deep",
  dark:  "text-ivory",
  muted: "text-ink-light",
};

const ICON_WRAPPER = {
  light: "",
  dark:  "",
  muted: "",
};

export function BrandLogo({
  variant = "light",
  iconSize = "md",
  href = "/",
  className,
}: BrandLogoProps) {
  const size = ICON_SIZES[iconSize];

  return (
    <Link href={href} className={cn("flex items-center gap-2.5 group w-fit", className)}>
      <img
        src="/logo.svg"
        alt="EcoTap"
        className={cn(size, "flex-shrink-0 transition-transform group-hover:scale-105")}
      />
      <span className={cn("font-serif text-xl tracking-tight", TEXT_COLORS[variant])}>
        <strong className="font-bold">Eco</strong>Tap
      </span>
    </Link>
  );
}
