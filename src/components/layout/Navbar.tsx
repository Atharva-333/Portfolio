import { AnimatePresence, motion, useScroll } from "framer-motion";
import { ArrowUpRight, Menu, X } from "lucide-react";
import { useEffect, useState, useRef } from "react";

import Button from "@/components/ui/Button";
import Container from "@/components/layout/Container";
import { navigationLinks } from "@/data/navigation";
import { cn } from "@/lib/cn";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("home");
  const [scrolled, setScrolled] = useState(false);
  const headerRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll();

  // Scroll detection for navbar shrink and shadow
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Active section detection with IntersectionObserver
  useEffect(() => {
    const sectionIds = navigationLinks.map((link) =>
      link.href.replace("#", ""),
    );

    // Check which sections exist
    const existingSections: string[] = [];
    sectionIds.forEach((id) => {
      const section = document.getElementById(id);
      if (section) {
        existingSections.push(id);
        console.log(`✅ Found section: ${id}`);
      } else {
        console.warn(`❌ Section with id "${id}" not found`);
      }
    });

    if (existingSections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        // Find all sections that are currently visible
        const visibleSections = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);

        if (visibleSections.length > 0) {
          // Get the most visible section
          const mostVisible = visibleSections[0];
          console.log(
            `📍 Most visible: ${mostVisible.target.id}, ratio: ${mostVisible.intersectionRatio}`,
          );

          if (
            mostVisible.target.id &&
            mostVisible.target.id !== activeSection
          ) {
            setActiveSection(mostVisible.target.id);
          }
        } else {
          // If no sections are visible, find the closest one based on scroll position
          const scrollPosition = window.scrollY + window.innerHeight / 2;
          let closestSection = activeSection;
          let closestDistance = Infinity;

          existingSections.forEach((id) => {
            const section = document.getElementById(id);
            if (section) {
              const rect = section.getBoundingClientRect();
              const sectionCenter =
                rect.top + rect.height / 2 + window.pageYOffset;
              const distance = Math.abs(scrollPosition - sectionCenter);
              if (distance < closestDistance) {
                closestDistance = distance;
                closestSection = id;
              }
            }
          });

          if (closestSection !== activeSection) {
            setActiveSection(closestSection);
          }
        }
      },
      {
        root: null,
        rootMargin: "0px 0px -50px 0px", // Less aggressive margin
        threshold: [0, 0.1, 0.2, 0.3, 0.4, 0.5], // Multiple thresholds for better detection
      },
    );

    // Observe all sections
    existingSections.forEach((id) => {
      const section = document.getElementById(id);
      if (section) {
        observer.observe(section);
      }
    });

    return () => observer.disconnect();
  }, [activeSection]);

  // Prevent background scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMenuOpen]);

  // Escape key to close menu
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsMenuOpen(false);
      }
    };

    if (isMenuOpen) {
      window.addEventListener("keydown", handleKeyDown);
    }

    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isMenuOpen]);

  // Find active link label for styling
  const getActiveLink = (href: string) => {
    const sectionId = href.replace("#", "");
    return activeSection === sectionId;
  };

  // Handle smooth scroll for navigation links
  const handleNavClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    href: string,
  ) => {
    e.preventDefault();
    const targetId = href.replace("#", "");
    const targetElement = document.getElementById(targetId);

    if (targetElement) {
      setIsMenuOpen(false);

      // Calculate offset for navbar
      const navbarHeight = scrolled ? 64 : 80;
      const elementPosition = targetElement.getBoundingClientRect().top;
      const offsetPosition =
        elementPosition + window.pageYOffset - navbarHeight;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
  };

  return (
    <>
      {/* Scroll Progress Bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 z-[60] h-0.5 bg-blue-500 origin-left"
        style={{ scaleX: scrollYProgress }}
      />

      <header
        ref={headerRef}
        className={cn(
          "fixed top-0 left-0 right-0 z-50 border-b border-[var(--border)] bg-slate-950/60 backdrop-blur-2xl transition-all duration-300",
          scrolled && "shadow-lg shadow-slate-950/20",
        )}
      >
        <Container>
          <div
            className={cn(
              "flex items-center justify-between gap-4 transition-all duration-300",
              scrolled ? "h-16" : "h-20",
            )}
          >
            {/* Logo */}
            <motion.a
              href="#home"
              className="inline-flex items-center gap-3 rounded-xl px-1 text-sm font-semibold tracking-[0.22em] text-[var(--text-primary)] transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background)]"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
              onClick={(e) => handleNavClick(e, "#home")}
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-2xl border border-[var(--border)] bg-blue-500 text-base tracking-normal text-white shadow-sm shadow-slate-950/20">
                AL
              </span>
              <span className="hidden sm:inline">ATHARVA LOHAR</span>
            </motion.a>

            {/* Desktop Navigation */}
            <nav
              className="hidden items-center gap-1 md:flex"
              aria-label="Primary"
            >
              {navigationLinks.map((link) => {
                const isActive = getActiveLink(link.href);
                return (
                  <motion.a
                    key={link.href}
                    href={link.href}
                    className="group relative rounded-full px-4 py-2 text-sm text-[var(--text-secondary)] transition hover:text-[var(--text-primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background)]"
                    whileHover={{ y: -2 }}
                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                    onClick={(e) => handleNavClick(e, link.href)}
                  >
                    <span
                      className={cn(
                        "transition-all duration-300",
                        isActive && "text-blue-500 font-semibold",
                      )}
                    >
                      {link.label}
                    </span>
                    <span
                      className={cn(
                        "absolute left-4 bottom-1 h-0.5 rounded-full bg-blue-500 transition-all duration-300",
                        isActive
                          ? "w-[calc(100%-2rem)]"
                          : "w-0 group-hover:w-[calc(100%-2rem)]",
                      )}
                    />
                  </motion.a>
                );
              })}
            </nav>

            {/* Desktop CTA */}
            <div className="hidden md:block">
              <Button
                size="sm"
                href="/Resume/Atharva_Lohar_Resume.pdf"
                download="Atharva_Lohar_Resume.pdf"
              >
                Download Resume
                <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
              </Button>
            </div>

            {/* Mobile Menu Toggle */}
            <button
              type="button"
              className={cn(
                "inline-flex h-11 w-11 items-center justify-center rounded-xl border border-[var(--border)] bg-[var(--surface)] text-[var(--text-primary)] transition hover:bg-[var(--card)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background)] md:hidden",
              )}
              aria-label={
                isMenuOpen ? "Close navigation menu" : "Open navigation menu"
              }
              aria-expanded={isMenuOpen}
              aria-controls="mobile-navigation"
              onClick={() => setIsMenuOpen((open) => !open)}
            >
              {isMenuOpen ? (
                <X className="h-5 w-5" aria-hidden="true" />
              ) : (
                <Menu className="h-5 w-5" aria-hidden="true" />
              )}
            </button>
          </div>

          {/* Mobile Menu with Backdrop */}
          <AnimatePresence>
            {isMenuOpen && (
              <>
                <motion.div
                  className="fixed inset-0 bg-black/40 backdrop-blur-sm md:hidden"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  onClick={() => setIsMenuOpen(false)}
                />

                <motion.div
                  id="mobile-navigation"
                  className="relative md:hidden"
                  initial={{ opacity: 0, scale: 0.97 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.97 }}
                  transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
                >
                  <div className="mt-3 overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-2 shadow-lg shadow-slate-950/20">
                    <nav
                      className="flex flex-col"
                      aria-label="Mobile primary navigation"
                    >
                      {navigationLinks.map((link) => {
                        const isActive = getActiveLink(link.href);
                        return (
                          <motion.a
                            key={link.href}
                            href={link.href}
                            className="relative rounded-xl px-4 py-3 text-sm text-[var(--text-secondary)] transition hover:bg-white/5 hover:text-[var(--text-primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background)]"
                            onClick={(e) => handleNavClick(e, link.href)}
                            whileHover={{ x: 4 }}
                            transition={{
                              type: "spring",
                              stiffness: 400,
                              damping: 10,
                            }}
                          >
                            <span
                              className={cn(
                                "transition-all duration-300",
                                isActive && "text-blue-500 font-semibold",
                              )}
                            >
                              {link.label}
                            </span>
                            {isActive && (
                              <span className="absolute left-0 top-1/2 -translate-y-1/2 h-6 w-0.5 rounded-full bg-blue-500" />
                            )}
                          </motion.a>
                        );
                      })}
                      <div className="p-2 pt-3">
                        <Button
                          href="#contact"
                          className="w-full"
                          onClick={(e) => {
                            e.preventDefault();
                            setIsMenuOpen(false);
                            const target = document.getElementById("contact");
                            if (target) {
                              const navbarHeight = scrolled ? 64 : 80;
                              const elementPosition =
                                target.getBoundingClientRect().top;
                              const offsetPosition =
                                elementPosition +
                                window.pageYOffset -
                                navbarHeight;
                              window.scrollTo({
                                top: offsetPosition,
                                behavior: "smooth",
                              });
                            }
                          }}
                        >
                          Hire Me
                          <ArrowUpRight
                            className="h-4 w-4"
                            aria-hidden="true"
                          />
                        </Button>
                      </div>
                    </nav>
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </Container>
      </header>

      {/* Spacer */}
      <div
        className={cn(
          "transition-all duration-300",
          scrolled ? "h-16" : "h-20",
        )}
      />
    </>
  );
}
