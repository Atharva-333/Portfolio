import { motion, type HTMLMotionProps } from "framer-motion";
import type { ReactNode } from "react";

import { cn } from "@/lib/cn";

type MotionProps = HTMLMotionProps<"div"> & {
  children: ReactNode;
  delay?: number;
  distance?: number;
  duration?: number;
};

export default function Motion({
  children,
  className,
  delay = 0,
  distance = 12,
  duration = 0.45,
  initial,
  animate,
  transition,
  ...props
}: MotionProps) {
  return (
    <motion.div
      className={cn(className)}
      initial={initial ?? { opacity: 0, y: distance }}
      animate={animate ?? { opacity: 1, y: 0 }}
      transition={transition ?? { duration, delay, ease: [0.16, 1, 0.3, 1] }}
      {...props}
    >
      {children}
    </motion.div>
  );
}