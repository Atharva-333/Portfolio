import AppLayout from "@/components/layout/AppLayout";
import Hero from "@/components/sections/Hero";
import Trust from "@/components/sections/Trust";
import Experience from "@/components/sections/Experience";
import Projects from "@/components/sections/Projects";
import WhyWorkWithMe from "@/components/sections/WhyWorkWithMe";
import Skills from "@/components/sections/Skills";
import DevelopmentProcess from "@/components/sections/DevelopmentProcess";
import Contact from "@/components/sections/Contact";
import Button from "@/components/ui/Button";

export default function App() {
  return (
    <AppLayout>
      <Hero />
      <Trust />
      <Experience />
      <Projects />
      <WhyWorkWithMe />
      <Skills />
      <DevelopmentProcess />
      <Contact />
      <footer className="border-t border-[var(--border)] py-12">
        <div className="mx-auto max-w-7xl text-center">
          <h2 className="text-xl font-semibold">Atharva Lohar</h2>

          <p className="mt-3 text-[var(--text-secondary)]">
            Full Stack Developer • AI Engineer
          </p>

          <div className="mt-6 flex justify-center gap-6">
            <Button variant="ghost" href="https://github.com/...">
              GitHub
            </Button>

            <Button variant="ghost" href="https://linkedin.com/...">
              LinkedIn
            </Button>

            <Button variant="ghost" href="mailto:...">
              Email
            </Button>
          </div>

          <p className="mt-8 text-sm text-[var(--text-secondary)]">
            Built with React, TypeScript & Tailwind CSS
          </p>

          <p className="mt-2 text-sm text-[var(--text-secondary)]">
            © 2026 Atharva Lohar
          </p>
        </div>
      </footer>
    </AppLayout>
  );
}
