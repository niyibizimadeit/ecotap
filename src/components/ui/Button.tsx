"use client";

import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 font-sans font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-bright focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 select-none",
  {
    variants: {
      variant: {
        primary:
          "bg-emerald-deep text-ivory hover:bg-emerald-mid active:scale-[0.98] shadow-card hover:shadow-card-lg",
        secondary:
          "bg-cream border border-emerald-deep/20 text-emerald-deep hover:bg-emerald-pale hover:border-emerald-deep/40 active:scale-[0.98]",
        ghost:
          "text-emerald-deep hover:bg-emerald-pale active:scale-[0.98]",
        danger:
          "bg-red-600 text-white hover:bg-red-700 active:scale-[0.98] shadow-card",
        gold:
          "bg-gold text-ivory hover:bg-gold-light active:scale-[0.98] shadow-card",
        outline:
          "border border-emerald-deep text-emerald-deep hover:bg-emerald-deep hover:text-ivory active:scale-[0.98]",
      },
      size: {
        sm:  "h-8  px-3 text-sm rounded-lg",
        md:  "h-10 px-4 text-sm rounded-xl",
        lg:  "h-12 px-6 text-base rounded-xl",
        xl:  "h-14 px-8 text-base rounded-2xl",
        icon:"h-10 w-10 rounded-xl",
      },
    },
    defaultVariants: {
      variant: "primary",
      size:    "md",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export function Button({
  className,
  variant,
  size,
  loading,
  leftIcon,
  rightIcon,
  children,
  disabled,
  ...props
}: ButtonProps) {
  return (
    <button
      type="button"
      className={cn(buttonVariants({ variant, size }), className)}
      disabled={disabled || loading}
      aria-busy={loading}
      {...props}
    >
      {loading ? (
        <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
      ) : (
        leftIcon
      )}
      {children}
      {!loading && rightIcon}
    </button>
  );
}
