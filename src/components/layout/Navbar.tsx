import {
  AnimatePresence,
  motion,
  useMotionValue,
  useMotionTemplate,
  useSpring,
  useScroll,
  useTransform,
  useReducedMotion,
} from "framer-motion";
import { ArrowUpRight, Menu, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

import Container from "@/components/layout/Container";
import { navigationLinks } from "@/data/navigation";
import { cn } from "@/lib/cn";

const SECTION_IDS = navigationLinks.map((l) => l.href.replace("#", ""));

/* ---------- Responsive breakpoint hook ---------- */
function useMediaQuery(query: string) {
  const [matches, setMatches] = useState(false);
  useEffect(() => {
    const mql = window.matchMedia(query);
    const onChange = () => setMatches(mql.matches);
    onChange();
    mql.addEventListener("change", onChange);
    return () => mql.removeEventListener("change", onChange);
  }, [query]);
  return matches;
}

/* ---------- Active section (center-of-viewport, rAF-throttled) ---------- */
function useActiveSection() {
  const [active, setActive] = useState("home");
  useEffect(() => {
    const sections = SECTION_IDS.map((id) =>
      document.getElementById(id),
    ).filter((el): el is HTMLElement => Boolean(el));
    if (!sections.length) return;

    let raf = 0;
    const update = () => {
      const mid = window.scrollY + window.innerHeight / 2;
      let bestId = sections[0].id;
      let bestDist = Infinity;
      for (const el of sections) {
        const top = el.offsetTop;
        const bottom = top + el.offsetHeight;
        const dist = mid < top ? top - mid : mid > bottom ? mid - bottom : 0;
        if (dist < bestDist) {
          bestDist = dist;
          bestId = el.id;
        }
      }
      setActive((prev) => (prev === bestId ? prev : bestId));
    };
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);
  return active;
}

/* ---------- Magnetic pull (disabled on coarse pointers) ---------- */
function useMagnetic(strength = 0.25, enabled = true) {
  const ref = useRef<HTMLAnchorElement | null>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 300, damping: 20, mass: 0.4 });
  const sy = useSpring(y, { stiffness: 300, damping: 20, mass: 0.4 });

  const onMove = (e: React.MouseEvent) => {
    if (!enabled || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    x.set((e.clientX - (r.left + r.width / 2)) * strength);
    y.set((e.clientY - (r.top + r.height / 2)) * strength);
  };
  const onLeave = () => {
    x.set(0);
    y.set(0);
  };
  return { ref, style: { x: sx, y: sy }, onMove, onLeave };
}

/* ---------- Aurora backdrop ---------- */
function AuroraBackdrop({ blobs }: { blobs: number }) {
  return (
    <motion.div
      aria-hidden
      className="pointer-events-none absolute inset-0 overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.2, ease: "easeOut" }}
    >
      {blobs >= 1 && (
        <motion.div
          className="absolute -top-24 left-[20%] h-40 w-40 rounded-full bg-blue-500/20 blur-3xl sm:h-64 sm:w-64"
          animate={{
            x: [0, 40, -20, 0],
            y: [0, 20, 10, 0],
            scale: [1, 1.1, 0.95, 1],
          }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
        />
      )}
      {blobs >= 2 && (
        <motion.div
          className="absolute -top-16 right-[20%] h-32 w-32 rounded-full bg-indigo-500/15 blur-3xl sm:h-56 sm:w-56"
          animate={{
            x: [0, -30, 20, 0],
            y: [0, 15, -10, 0],
            scale: [1, 0.95, 1.05, 1],
          }}
          transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
        />
      )}
      <div
        className="absolute inset-0 opacity-[0.015] mix-blend-overlay"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
        }}
      />
    </motion.div>
  );
}

/* ---------- Animated Resume button (real motion element) ---------- */
function ResumeButton({
  reduced,
  fullWidth,
  withLabel,
  className,
}: {
  reduced: boolean;
  fullWidth?: boolean;
  withLabel: boolean;
  className?: string;
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.a
      href="/Resume/Atharva_Lohar_Resume.pdf"
      target="_blank"
      rel="noopener noreferrer"
      aria-label={withLabel ? undefined : "Open resume in new tab"}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      whileHover={reduced ? undefined : { scale: 1.06, y: -2 }}
      whileTap={reduced ? undefined : { scale: 0.94 }}
      transition={{ type: "spring", stiffness: 400, damping: 18 }}
      className={cn(
        "group relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-full",
        "bg-blue-500 px-4 py-2 text-sm font-semibold text-white",
        "shadow-md shadow-blue-500/30",
        "transition-colors hover:bg-blue-400",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background)]",
        fullWidth && "w-full",
        className,
      )}
    >
      {/* Glow ring — brightens on hover */}
      {!reduced && (
        <motion.span
          aria-hidden
          className="pointer-events-none absolute -inset-1 rounded-full bg-blue-400/50 blur-md"
          animate={{
            opacity: hovered ? 0.9 : 0.25,
            scale: hovered ? 1.06 : 1,
          }}
          transition={{ duration: 0.25, ease: "easeOut" }}
        />
      )}

      {/* Label + arrow */}
      <span className="relative z-10 flex items-center gap-2">
        {withLabel && <span>Download Resume</span>}
        <motion.span
          className="inline-flex"
          // Continuous idle bob on Y (never stops)
          animate={
            reduced ? undefined : { y: [0, -2, 0], rotate: hovered ? 12 : 0 }
          }
          transition={
            reduced
              ? undefined
              : {
                  y: { duration: 1.6, repeat: Infinity, ease: "easeInOut" },
                  rotate: { type: "spring", stiffness: 300, damping: 18 },
                }
          }
          style={reduced ? undefined : { x: 0 }}
        >
          {/* Inner span for hover X push — separate axis, doesn't interfere with y loop */}
          <motion.span
            className="inline-flex"
            animate={reduced ? undefined : { x: hovered ? 4 : 0 }}
            transition={{ type: "spring", stiffness: 400, damping: 22 }}
          >
            <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
          </motion.span>
        </motion.span>
      </span>

      {/* Underline accent grows from left on hover */}
      {!reduced && (
        <motion.span
          aria-hidden
          className="pointer-events-none absolute bottom-0 left-0 h-0.5 rounded-full bg-white/70"
          animate={{ width: hovered ? "100%" : "0%" }}
          transition={{ duration: 0.3, ease: "easeOut" }}
        />
      )}
    </motion.a>
  );
}

/* ---------- 3D tilt logo ---------- */
function TiltLogo({
  onClick,
  tiltEnabled,
  showName,
}: {
  onClick: (e: React.MouseEvent<HTMLAnchorElement>) => void;
  tiltEnabled: boolean;
  showName: boolean;
}) {
  const ref = useRef<HTMLAnchorElement>(null);
  const reduced = useReducedMotion();

  // Tilt rotations (mouse-driven)
  const rx = useMotionValue(0);
  const ry = useMotionValue(0);
  const srx = useSpring(rx, { stiffness: 200, damping: 18 });
  const sry = useSpring(ry, { stiffness: 200, damping: 18 });

  // Specular highlight position (0–100%)
  const lightX = useMotionValue(50);
  const lightY = useMotionValue(50);
  const sLightX = useSpring(lightX, { stiffness: 200, damping: 25 });
  const sLightY = useSpring(lightY, { stiffness: 200, damping: 25 });
  const specular = useMotionTemplate`radial-gradient(circle at ${sLightX}% ${sLightY}%, rgba(255,255,255,0.55), transparent 55%)`;

  // Idle float + hover lift
  const [hovered, setHovered] = useState(false);

  const onMove = (e: React.MouseEvent) => {
    if (!ref.current) return;
    const r = ref.current.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;

    if (tiltEnabled && !reduced) {
      ry.set(px * 28);
      rx.set(-py * 28);
      lightX.set((px + 0.5) * 100);
      lightY.set((py + 0.5) * 100);
    }
  };
  const onLeave = () => {
    rx.set(0);
    ry.set(0);
    lightX.set(50);
    lightY.set(50);
    setHovered(false);
  };

  const letters = "ATHARVA LOHAR".split("");
  const enable3D = tiltEnabled && !reduced;

  return (
    <motion.a
      ref={ref}
      href="#home"
      onMouseMove={onMove}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={onLeave}
      onClick={onClick}
      className="group inline-flex shrink-0 items-center gap-2 rounded-xl px-1 text-xs font-semibold tracking-[0.18em] text-[var(--text-primary)] sm:gap-3 sm:text-sm sm:tracking-[0.22em] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background)]"
      style={{ perspective: 700 }}
      whileTap={{ scale: 0.96 }}
      transition={{ type: "spring", stiffness: 400, damping: 15 }}
    >
      {/* 3D stage — ambient shadow sits behind, badge floats */}
      <div className="relative" style={{ transformStyle: "preserve-3d" }}>
        {/* Ambient occlusion shadow under the badge */}
        {enable3D && (
          <motion.span
            aria-hidden
            className="pointer-events-none absolute inset-x-2 -bottom-1 h-3 rounded-full bg-blue-950/50 blur-md"
            style={{
              rotateX: srx,
              rotateY: sry,
              transform: "translateZ(-12px)",
            }}
            animate={{ opacity: hovered ? 0.8 : 0.5, scale: hovered ? 1.1 : 1 }}
            transition={{ duration: 0.3 }}
          />
        )}

        {/* Badge */}
        <motion.span
          className="relative flex h-9 w-9 items-center justify-center rounded-xl border border-[var(--border)] bg-blue-500 text-sm tracking-normal text-white shadow-sm shadow-slate-950/20 sm:h-10 sm:w-10 sm:rounded-2xl sm:text-base"
          style={{
            transformStyle: "preserve-3d",
            rotateX: enable3D ? srx : 0,
            rotateY: enable3D ? sry : 0,
          }}
          // Idle float, lifts on hover
          animate={
            enable3D
              ? hovered
                ? { rotateY: 0, rotateX: 0 }
                : { rotateY: [-6, 6, -6], rotateX: [2, -2, 2] }
              : undefined
          }
          transition={
            enable3D
              ? { duration: 6, repeat: Infinity, ease: "easeInOut" }
              : undefined
          }
          whileHover={enable3D ? { scale: 1.08 } : undefined}
        >
          {/* Base gradient — darkens toward bottom for volume */}
          <span
            aria-hidden
            className="pointer-events-none absolute inset-0 rounded-xl bg-gradient-to-br from-blue-400 via-blue-500 to-blue-700 sm:rounded-2xl"
          />

          {/* Edge highlight — catches light from top-left */}
          {enable3D && (
            <motion.span
              aria-hidden
              className="pointer-events-none absolute inset-0 rounded-xl ring-1 ring-inset ring-white/30 sm:rounded-2xl"
              style={{ transform: "translateZ(2px)" }}
              animate={{ opacity: [0.4, 0.8, 0.4] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            />
          )}

          {/* Specular highlight — follows cursor */}
          {enable3D && (
            <motion.span
              aria-hidden
              className="pointer-events-none absolute inset-0 rounded-xl sm:rounded-2xl"
              style={{
                backgroundImage: specular,
                transform: "translateZ(6px)",
              }}
            />
          )}

          {/* Shine band — glides across on hover */}
          {enable3D && (
            <motion.span
              aria-hidden
              className="pointer-events-none absolute inset-0 overflow-hidden rounded-xl sm:rounded-2xl"
              style={{ transform: "translateZ(8px)" }}
            >
              <motion.span
                className="absolute top-0 h-full w-1/2 bg-gradient-to-r from-transparent via-white/40 to-transparent"
                animate={{ x: hovered ? ["-100%", "220%"] : "-100%" }}
                transition={{
                  duration: hovered ? 1.1 : 0.0001,
                  ease: "easeInOut",
                }}
              />
            </motion.span>
          )}

          {/* Outer glow on hover */}
          {enable3D && (
            <motion.span
              aria-hidden
              className="pointer-events-none absolute -inset-1 rounded-xl bg-blue-500/50 blur-md sm:rounded-2xl"
              style={{ transform: "translateZ(-6px)" }}
              animate={{ opacity: hovered ? 0.7 : 0, scale: hovered ? 1.1 : 1 }}
              transition={{ duration: 0.3 }}
            />
          )}

          {/* The "AL" text — floats highest in 3D space */}
          <span
            className="relative font-bold tracking-normal"
            style={{
              transform: enable3D ? "translateZ(24px)" : undefined,
              textShadow: enable3D
                ? "0 1px 0 rgba(0,0,0,0.3), 0 2px 6px rgba(0,0,0,0.25)"
                : undefined,
            }}
          >
            AL
          </span>
        </motion.span>
      </div>

      {/* Wordmark — only after leaving home */}
      <AnimatePresence initial={false}>
        {showName && (
          <motion.span
            key="wordmark"
            className="hidden overflow-hidden whitespace-nowrap sm:inline-flex"
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: "auto", opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            transition={{
              width: { duration: 0.35, ease: [0.16, 1, 0.3, 1] },
              opacity: { duration: 0.2 },
            }}
          >
            {letters.map((ch, i) => (
              <motion.span
                key={i}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  delay: 0.05 + i * 0.018,
                  type: "spring",
                  stiffness: 400,
                  damping: 22,
                }}
                className="inline-block"
              >
                {ch === " " ? "\u00A0" : ch}
              </motion.span>
            ))}
          </motion.span>
        )}
      </AnimatePresence>
    </motion.a>
  );
}
/* ---------- Desktop nav link ---------- */
function NavLink({
  link,
  active,
  onClick,
  onHover,
  hovered,
  magneticEnabled,
}: {
  link: (typeof navigationLinks)[number];
  active: boolean;
  onClick: (e: React.MouseEvent<HTMLAnchorElement>, href: string) => void;
  onHover: (id: string | null) => void;
  hovered: boolean;
  magneticEnabled: boolean;
}) {
  const mag = useMagnetic(0.25, magneticEnabled);
  return (
    <motion.a
      ref={mag.ref}
      href={link.href}
      style={mag.style}
      onMouseMove={mag.onMove}
      onMouseEnter={() => onHover(link.href)}
      onMouseLeave={() => {
        mag.onLeave();
        onHover(null);
      }}
      onClick={(e) => onClick(e, link.href)}
      className="group relative rounded-full px-3 py-2 text-sm text-[var(--text-secondary)] transition-colors hover:text-[var(--text-primary)] lg:px-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background)]"
      whileTap={{ scale: 0.94 }}
    >
      {hovered && (
        <motion.span
          layoutId="nav-hover-pill"
          className="absolute inset-0 rounded-full bg-white/[0.04] ring-1 ring-white/[0.06]"
          transition={{ type: "spring", stiffness: 500, damping: 35 }}
        />
      )}
      <span
        className={cn(
          "relative transition-all duration-300",
          active && "text-blue-500 font-semibold",
        )}
      >
        {link.label}
      </span>
      {active && (
        <motion.span
          layoutId="nav-active-underline"
          className="absolute bottom-1 left-3 right-3 h-0.5 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.8)] lg:left-4 lg:right-4"
          transition={{ type: "spring", stiffness: 500, damping: 35 }}
        />
      )}
    </motion.a>
  );
}

/* ---------- Scroll progress ---------- */
function ScrollProgress({
  progress,
  enabled,
}: {
  progress: ReturnType<typeof useScroll>["scrollYProgress"];
  enabled: boolean;
}) {
  const smooth = useSpring(progress, {
    stiffness: 120,
    damping: 25,
    mass: 0.3,
  });
  const glow = useTransform(smooth, [0, 1], [0.4, 1]);
  const cometLeft = useTransform(smooth, [0, 1], ["0%", "100%"]);
  return (
    <div className="fixed top-0 left-0 right-0 z-[60] h-0.5">
      <motion.div
        className="h-full origin-left bg-gradient-to-r from-blue-500 via-cyan-400 to-indigo-500"
        style={{ scaleX: smooth, opacity: glow }}
      />
      {enabled && (
        <motion.div
          className="absolute top-1/2 h-2 w-2 -translate-y-1/2 rounded-full bg-cyan-300 shadow-[0_0_12px_4px_rgba(34,211,238,0.8)]"
          style={{ left: cometLeft }}
        />
      )}
    </div>
  );
}

/* ---------- Main ---------- */
export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [hovered, setHovered] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  const activeSection = useActiveSection();
  const reduced = useReducedMotion();
  const { scrollY, scrollYProgress } = useScroll();

  const isCoarse = useMediaQuery("(pointer: coarse)");
  const canHover = useMediaQuery("(hover: hover)");
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const isUltrawide = useMediaQuery("(min-width: 1536px)");

  const magneticEnabled = canHover && !reduced;
  const tiltEnabled = canHover && !reduced && isDesktop;
  const showComet = !reduced && !isCoarse;
  const auroraBlobs = reduced ? 0 : isCoarse ? 0 : isDesktop ? 2 : 1;

  const scaleRange = isUltrawide ? [1, 0.995] : [1, 0.985];
  const headerScale = useTransform(scrollY, [0, 200], scaleRange);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (isDesktop && isMenuOpen) setIsMenuOpen(false);
  }, [isDesktop, isMenuOpen]);

  useEffect(() => {
    if (!isMenuOpen) return;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) =>
      e.key === "Escape" && setIsMenuOpen(false);
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [isMenuOpen]);

  useEffect(() => {
    if (!isMenuOpen) return;
    const close = () => setIsMenuOpen(false);
    window.addEventListener("hashchange", close);
    window.addEventListener("popstate", close);
    return () => {
      window.removeEventListener("hashchange", close);
      window.removeEventListener("popstate", close);
    };
  }, [isMenuOpen]);

  const handleNavClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    href: string,
  ) => {
    e.preventDefault();
    const target = document.getElementById(href.replace("#", ""));
    if (!target) return;
    setIsMenuOpen(false);
    const offset =
      target.getBoundingClientRect().top +
      window.pageYOffset -
      (scrolled ? 64 : 80);
    window.scrollTo({ top: offset, behavior: reduced ? "auto" : "smooth" });
  };

  const isActive = (href: string) => activeSection === href.replace("#", "");

  const mobileMenu = (
    <AnimatePresence>
      {isMenuOpen && (
        <motion.div
          key="panel"
          id="mobile-navigation"
          role="dialog"
          aria-modal="true"
          aria-label="Mobile navigation"
          className="fixed inset-0 z-[120] flex flex-col bg-slate-950/80 backdrop-blur-xl md:hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          onClick={() => setIsMenuOpen(false)}
        >
          <div
            className={cn(
              "flex shrink-0 items-center justify-between px-4 transition-all duration-300",
              scrolled ? "h-14" : "h-16",
            )}
            onClick={(e) => e.stopPropagation()}
          >
            <span className="text-xs font-semibold tracking-[0.22em] text-[var(--text-secondary)]">
              MENU
            </span>
            <button
              type="button"
              aria-label="Close navigation menu"
              onClick={() => setIsMenuOpen(false)}
              className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-[var(--border)] bg-[var(--surface)] text-[var(--text-primary)] transition-colors hover:bg-[var(--card)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background)]"
            >
              <X className="h-5 w-5" aria-hidden="true" />
            </button>
          </div>

          <div
            className="flex-1 overflow-y-auto overscroll-contain px-3 pb-[max(env(safe-area-inset-bottom),0.75rem)] pt-2"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-2 shadow-lg shadow-slate-950/20">
              <nav
                className="flex flex-col"
                aria-label="Mobile primary navigation"
              >
                {navigationLinks.map((link, i) => {
                  const active = isActive(link.href);
                  return (
                    <motion.a
                      key={link.href}
                      href={link.href}
                      className="relative min-w-0 rounded-xl px-4 py-3 text-sm text-[var(--text-secondary)] transition hover:bg-white/5 hover:text-[var(--text-primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background)]"
                      onClick={(e) => handleNavClick(e, link.href)}
                      initial={{ opacity: 0, x: -16 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{
                        delay: 0.04 + i * 0.04,
                        type: "spring",
                        stiffness: 400,
                        damping: 25,
                      }}
                      whileTap={{ scale: 0.97 }}
                    >
                      <span
                        className={cn(
                          "block truncate transition-all duration-300",
                          active && "text-blue-500 font-semibold",
                        )}
                      >
                        {link.label}
                      </span>
                      {active && (
                        <motion.span
                          layoutId="mobile-active-pill"
                          className="absolute left-0 top-1/2 -translate-y-1/2 h-6 w-0.5 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.8)]"
                          transition={{
                            type: "spring",
                            stiffness: 500,
                            damping: 35,
                          }}
                        />
                      )}
                    </motion.a>
                  );
                })}
                <div className="p-2 pt-3">
                  <ResumeButton reduced={!!reduced} withLabel fullWidth />
                </div>
              </nav>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  return (
    <>
      <ScrollProgress progress={scrollYProgress} enabled={showComet} />

      <motion.header
        style={reduced ? undefined : { scale: headerScale }}
        className={cn(
          "fixed top-0 left-0 right-0 border-b border-[var(--border)] bg-slate-950/60 backdrop-blur-2xl transition-all duration-300",
          isMenuOpen ? "z-[100]" : "z-50",
          scrolled && "shadow-lg shadow-slate-950/20",
        )}
      >
        <AuroraBackdrop blobs={auroraBlobs} />

        <Container>
          <div
            className={cn(
              "relative flex items-center justify-between gap-3 transition-all duration-300 sm:gap-4",
              scrolled ? "h-14 sm:h-16" : "h-16 sm:h-20",
            )}
          >
            <motion.div className="min-w-0">
              <TiltLogo
                onClick={(e) => handleNavClick(e, "#home")}
                tiltEnabled={tiltEnabled}
                showName={activeSection !== "home"}
              />
            </motion.div>

            <nav
              className="absolute left-1/2 top-1/2 hidden -translate-x-1/2 -translate-y-1/2 items-center gap-0.5 md:flex lg:gap-1"
              aria-label="Primary"
            >
              {navigationLinks.map((link) => (
                <NavLink
                  key={link.href}
                  link={link}
                  active={isActive(link.href)}
                  onClick={handleNavClick}
                  onHover={setHovered}
                  hovered={hovered === link.href}
                  magneticEnabled={magneticEnabled}
                />
              ))}
            </nav>

            {/* Desktop / tablet resume CTA */}
            <div className="hidden shrink-0 md:block">
              <ResumeButton
                reduced={!!reduced}
                withLabel={false}
                className="lg:hidden"
              />
              <ResumeButton
                reduced={!!reduced}
                withLabel
                className="hidden lg:inline-flex"
              />
            </div>

            {/* Mobile toggle — hidden while menu open (overlay owns the close) */}
            <motion.button
              type="button"
              className={cn(
                "relative z-[110] inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-[var(--border)] bg-[var(--surface)] text-[var(--text-primary)] transition-colors hover:bg-[var(--card)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background)] md:hidden",
                isMenuOpen && "pointer-events-none opacity-0",
              )}
              aria-label={
                isMenuOpen ? "Close navigation menu" : "Open navigation menu"
              }
              aria-expanded={isMenuOpen}
              aria-controls="mobile-navigation"
              onClick={() => setIsMenuOpen((o) => !o)}
              whileTap={{ scale: 0.94 }}
            >
              <span className="pointer-events-none inline-flex">
                <Menu className="h-5 w-5" aria-hidden="true" />
              </span>
            </motion.button>
          </div>
        </Container>
      </motion.header>

      {mounted && createPortal(mobileMenu, document.body)}

      <div
        className={cn(
          "transition-all duration-300",
          scrolled ? "h-14 sm:h-16" : "h-16 sm:h-20",
        )}
      />
    </>
  );
}
