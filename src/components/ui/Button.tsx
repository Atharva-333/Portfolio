import { motion } from "framer-motion";
import type { ReactNode } from "react";
import type { HTMLMotionProps } from "framer-motion";

import { cn } from "@/lib/cn";

type ButtonVariant = "primary" | "secondary" | "ghost";
type ButtonSize = "sm" | "md" | "lg";

type SharedButtonProps = {
  children: ReactNode;
  className?: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
};

type AnchorButtonProps = SharedButtonProps &
  Omit<HTMLMotionProps<"a">, "children" | "className" | "href"> & {
    href: string;
  };

type NativeButtonProps = SharedButtonProps &
  Omit<HTMLMotionProps<"button">, "children" | "className"> & {
    href?: never;
  };

type ButtonProps = AnchorButtonProps | NativeButtonProps;

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    "border border-transparent bg-[var(--primary)] text-white shadow-sm shadow-slate-950/30 hover:bg-blue-500 shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40",
  secondary:
    "border border-[var(--border)] bg-[var(--surface)] text-[var(--text-primary)] hover:bg-[var(--card)]",
  ghost:
    "border border-transparent bg-transparent text-[var(--text-secondary)] hover:bg-white/5 hover:text-[var(--text-primary)]",
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: "h-10 px-4 text-sm",
  md: "h-11 px-5 text-sm",
  lg: "h-12 px-6 text-base",
};

export default function Button(props: ButtonProps) {
  const {
    children,
    className,
    variant = "primary",
    size = "md",
    ...rest
  } = props;

  const baseClasses = cn(
    "inline-flex items-center justify-center gap-2 rounded-xl font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background)]",
    "active:scale-[0.98]",
    variantClasses[variant],
    sizeClasses[size],
    className,
  );

  if ("href" in props) {
    const { href, target, rel, ...anchorProps } = rest as Omit<
      AnchorButtonProps,
      keyof SharedButtonProps | "href"
    > & {
      href: string;
    };

    const computedRel =
      target === "_blank" ? (rel ?? "noreferrer noopener") : rel;

    return (
      <motion.a
        className={baseClasses}
        href={href}
        target={target}
        rel={computedRel}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        {...anchorProps}
      >
        {children}
      </motion.a>
    );
  }

  const { type = "button", ...buttonProps } = rest as Omit<
    NativeButtonProps,
    keyof SharedButtonProps
  >;

  return (
    <motion.button
      className={baseClasses}
      type={type}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      {...buttonProps}
    >
      {children}
    </motion.button>
  );
}
