import { motion, type HTMLMotionProps } from "framer-motion";

import { cn } from "@/lib/cn";

type CardProps = HTMLMotionProps<"article"> & {
  interactive?: boolean;
};

export default function Card({
  children,
  className,
  interactive = false,
  ...props
}: CardProps) {
  return (
    <motion.article
      className={cn(
        "rounded-2xl border border-[var(--border)] bg-[var(--card)]/95 p-6 shadow-sm shadow-slate-950/20 transition-shadow hover:shadow-2xl hover:shadow-blue-500/10",
        className,
      )}
      whileHover={interactive ? { y: -6, scale: 1.01 } : undefined}
      transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
      {...props}
    >
      {children}
    </motion.article>
  );
}
