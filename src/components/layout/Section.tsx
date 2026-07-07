import type { HTMLAttributes, ReactNode } from "react";

import Container from "@/components/layout/Container";
import { cn } from "@/lib/cn";

type SectionProps = HTMLAttributes<HTMLElement> & {
  children: ReactNode;
  containerClassName?: string;
};

export default function Section({
  children,
  className,
  containerClassName,
  ...props
}: SectionProps) {
  return (
    <section className={cn("py-16 sm:py-20", className)} {...props}>
      <Container className={containerClassName}>{children}</Container>
    </section>
  );
}