import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1.5 font-mono text-xs font-medium tracking-wide px-2.5 py-0.5 rounded-full border",
  {
    variants: {
      variant: {
        pending:   "bg-gold-pale text-gold border-gold/20",
        active:    "bg-emerald-pale text-emerald-mid border-emerald-bright/20",
        suspended: "bg-red-50 text-red-700 border-red-200",
        shipped:   "bg-blue-50 text-blue-700 border-blue-200",
        delivered: "bg-emerald-pale text-emerald-deep border-emerald-bright/30",
        approved:  "bg-emerald-pale text-emerald-mid border-emerald-bright/20",
        draft:     "bg-cream-dark text-ink-mid border-cream-dark",
        info:      "bg-blue-50 text-blue-700 border-blue-200",
      },
    },
    defaultVariants: {
      variant: "draft",
    },
  }
);

const DOT_COLORS: Record<string, string> = {
  pending:   "bg-gold-light",
  active:    "bg-emerald-bright",
  suspended: "bg-red-500",
  shipped:   "bg-blue-500",
  delivered: "bg-emerald-deep",
  approved:  "bg-emerald-bright",
  draft:     "bg-ink-light",
  info:      "bg-blue-500",
};

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {
  dot?: boolean;
}

export function Badge({ className, variant, dot = true, children, ...props }: BadgeProps) {
  const variantKey = variant ?? "draft";
  return (
    <span className={cn(badgeVariants({ variant }), className)} {...props}>
      {dot && (
        <span className={cn("w-1.5 h-1.5 rounded-full", DOT_COLORS[variantKey])} />
      )}
      {children}
    </span>
  );
}
