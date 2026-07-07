import type { ReactNode } from "react";

import Container from "@/components/layout/Container";
import Navbar from "@/components/layout/Navbar";

type AppLayoutProps = {
  children?: ReactNode;
};

export default function AppLayout({ children }: AppLayoutProps) {
  return (
    <div className="relative min-h-screen overflow-x-hidden bg-[var(--background)] text-[var(--text-primary)]">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-0 top-0 h-64 w-64 -translate-x-1/2 rounded-full bg-blue-500/5 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute right-0 top-32 h-72 w-72 translate-x-1/2 rounded-full bg-slate-500/5 blur-3xl"
      />

      <div className="relative z-10 flex min-h-screen flex-col">
        <Navbar />
        <main className="flex-1">
          <Container className="py-6 sm:py-8">{children}</Container>
        </main>
      </div>
    </div>
  );
}
