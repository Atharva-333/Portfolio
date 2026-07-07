import type { HTMLAttributes, ReactNode } from "react";

import { cn } from "@/lib/cn";

type BadgeVariant = "default" | "primary" | "success" | "warning";

type BadgeProps = HTMLAttributes<HTMLSpanElement> & {
  children: ReactNode;
  variant?: BadgeVariant;
};

const badgeClasses: Record<BadgeVariant, string> = {
  default:
    "border-[var(--border)] bg-[var(--surface)] text-[var(--text-secondary)]",
  primary: "border-blue-400/20 bg-blue-500/10 text-blue-300",
  success: "border-green-400/20 bg-green-500/10 text-green-300",
  warning: "border-amber-400/20 bg-amber-500/10 text-amber-300",
};

export default function Badge({
  children,
  className,
  variant = "default",
  ...props
}: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium tracking-wide transition-all duration-200 hover:-translate-y-0.5",
        badgeClasses[variant],
        className,
      )}
      {...props}
    >
      {children}
    </span>
  );
}
