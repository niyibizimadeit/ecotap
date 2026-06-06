import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const cardVariants = cva(
  "bg-cream rounded-2xl border border-cream-dark/60 transition-all duration-200",
  {
    variants: {
      shadow: {
        none: "",
        sm:   "shadow-card",
        md:   "shadow-card-lg",
        lg:   "shadow-card-xl",
      },
      hover: {
        true:  "hover:shadow-card-lg hover:-translate-y-0.5 cursor-pointer",
        false: "",
      },
      padding: {
        none: "",
        sm:   "p-4",
        md:   "p-6",
        lg:   "p-8",
      },
    },
    defaultVariants: {
      shadow:  "sm",
      hover:   false,
      padding: "md",
    },
  }
);

export interface CardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardVariants> {}

export function Card({ className, shadow, hover, padding, ...props }: CardProps) {
  return (
    <div
      className={cn(cardVariants({ shadow, hover, padding }), className)}
      {...props}
    />
  );
}

export function CardHeader({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("mb-4", className)} {...props} />;
}

export function CardTitle({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3
      className={cn("font-serif text-xl font-semibold text-emerald-deep leading-tight", className)}
      {...props}
    />
  );
}

export function CardDescription({ className, ...props }: React.HTMLAttributes<HTMLParagraphElement>) {
  return <p className={cn("text-sm text-ink-light mt-1", className)} {...props} />;
}

export function CardContent({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("", className)} {...props} />;
}

export function CardFooter({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("mt-4 pt-4 border-t border-cream-dark/60 flex items-center gap-3", className)}
      {...props}
    />
  );
}
