import Button from "@/components/ui/Button";
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from "framer-motion";
import { useEffect, useMemo, useRef, useState } from "react";
import Reveal from "../ui/Reveal";
import { technologies } from "@/data/portfolio";

/* ---------------- breakpoint hook ---------------- */

function useSize() {
  const [size, setSize] = useState<"sm" | "md" | "lg">("md");
  useEffect(() => {
    const smMq = window.matchMedia("(max-width: 640px)");
    const lgMq = window.matchMedia("(min-width: 1024px)");
    const update = () => {
      if (smMq.matches) setSize("sm");
      else if (lgMq.matches) setSize("lg");
      else setSize("md");
    };
    update();
    smMq.addEventListener("change", update);
    lgMq.addEventListener("change", update);
    return () => {
      smMq.removeEventListener("change", update);
      lgMq.removeEventListener("change", update);
    };
  }, []);
  return size;
}

/* ---------------- Fibonacci distribution ---------------- */

function fibSphere(i: number, n: number, R: number) {
  const phi = Math.acos(1 - (2 * (i + 0.5)) / n);
  const theta = Math.PI * (1 + Math.sqrt(5)) * (i + 0.5);
  return {
    x: R * Math.sin(phi) * Math.cos(theta),
    y: R * Math.cos(phi),
    z: R * Math.sin(phi) * Math.sin(theta),
  };
}

/* ---------------- one tech node ---------------- */

type TechNodeProps = {
  tech: (typeof technologies)[number];
  index: number;
  total: number;
  radius: number;
  iconSize: number;
  rotX: ReturnType<typeof useMotionValue<number>>;
  rotY: ReturnType<typeof useMotionValue<number>>;
  parallaxX: ReturnType<typeof useSpring>;
  parallaxY: ReturnType<typeof useSpring>;
  hovered: boolean;
  onHover: (name: string | null) => void;
};

function TechNode({
  tech,
  index,
  total,
  radius,
  iconSize,
  rotX,
  rotY,
  parallaxX,
  parallaxY,
  hovered,
  onHover,
}: TechNodeProps) {
  const Icon = tech.icon;
  const p = useMemo(
    () => fibSphere(index, total, radius),
    [index, total, radius],
  );

  const nodeRef = useRef<HTMLDivElement>(null);

  /* full 3D projection: rotY → rotX → perspective */
  const computed = useTransform(
    [rotX, rotY, parallaxX, parallaxY],
    ([rx, ry, px, py]) => {
      const finalRx = ((rx as number) + (px as number)) * (Math.PI / 180);
      const finalRy = ((ry as number) + (py as number)) * (Math.PI / 180);

      const cosRy = Math.cos(finalRy);
      const sinRy = Math.sin(finalRy);
      const cosRx = Math.cos(finalRx);
      const sinRx = Math.sin(finalRx);

      // Y-axis rotation
      const x1 = p.x * cosRy + p.z * sinRy;
      const z1 = -p.x * sinRy + p.z * cosRy;

      // X-axis rotation
      const y2 = p.y * cosRx - z1 * sinRx;
      const z2 = p.y * sinRx + z1 * cosRx;

      // Perspective
      const perspective = radius * 2.5;
      const scale = perspective / (perspective + z2);
      const screenX = x1 * scale;
      const screenY = y2 * scale;

      // Depth: z2 = +radius is back, -radius is front
      const depth = (z2 + radius) / (2 * radius);
      const opacity = 1 - depth * 0.6;
      const zIndex = Math.round(1000 - z2 * 2);

      return { x: screenX, y: screenY, scale, opacity, zIndex };
    },
  );

  const x = useTransform(computed, (v) => v.x);
  const y = useTransform(computed, (v) => v.y);
  const scale = useTransform(computed, (v) => v.scale);
  const opacity = useTransform(computed, (v) => v.opacity);
  const zIndexValue = useTransform(computed, (v) => v.zIndex);

  /* Set z-index imperatively — avoids MotionValue<number> in style,
     and lets us hard-pin to 9999 on hover without a separate MV. */
  useEffect(() => {
    const apply = (v: number) => {
      if (nodeRef.current) {
        nodeRef.current.style.zIndex = String(Math.round(v));
      }
    };

    if (hovered) {
      apply(9999);
      return;
    }

    apply(zIndexValue.get());
    return zIndexValue.on("change", apply);
  }, [zIndexValue, hovered]);

  return (
    <motion.div
      ref={nodeRef}
      className="absolute left-1/2 top-1/2"
      style={{
        x,
        y,
        width: iconSize,
        height: iconSize,
        marginLeft: -iconSize / 2,
        marginTop: -iconSize / 2,
      }}
    >
      <motion.div style={{ scale }} className="relative">
        <motion.button
          type="button"
          aria-label={tech.name}
          onMouseEnter={() => onHover(tech.name)}
          onMouseLeave={() => onHover(null)}
          onFocus={() => onHover(tech.name)}
          onBlur={() => onHover(null)}
          style={{ opacity }}
          animate={{ scale: hovered ? 1.25 : 1 }}
          transition={{ type: "spring", stiffness: 320, damping: 20 }}
          className="flex items-center justify-center rounded-xl border backdrop-blur-md transition-colors duration-200"
        >
          <span
            className="flex items-center justify-center"
            style={{
              width: iconSize,
              height: iconSize,
              borderRadius: Math.max(8, iconSize * 0.28),
              borderColor: hovered
                ? "rgba(96,165,250,0.9)"
                : "rgba(51,65,85,0.9)",
              color: hovered ? "#93c5fd" : "#cbd5e1",
              background: "rgba(15,23,42,0.9)",
              borderWidth: 1,
              borderStyle: "solid",
              boxShadow: hovered
                ? "0 0 28px 6px rgba(59,130,246,0.55), inset 0 0 12px rgba(96,165,250,0.25)"
                : "0 4px 12px rgba(0,0,0,0.3)",
            }}
          >
            <Icon style={{ width: iconSize * 0.48, height: iconSize * 0.48 }} />
          </span>
        </motion.button>
      </motion.div>

      <AnimatePresence>
        {hovered && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.16 }}
            className="pointer-events-none absolute left-1/2 top-full mt-6 -translate-x-1/2 whitespace-nowrap rounded-md border border-blue-500/40 bg-slate-950/95 px-2.5 py-1 text-[10px] font-medium text-blue-200 shadow-lg shadow-blue-500/20"
          >
            {tech.name}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

/* ---------------- energy core ---------------- */

function EnergyCore({
  reduced,
  active,
}: {
  reduced: boolean;
  active: boolean;
}) {
  return (
    <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
      {!reduced && (
        <>
          <motion.div
            className="absolute left-1/2 top-1/2 h-10 w-10 -translate-x-1/2 -translate-y-1/2 rounded-full border border-blue-500/50 sm:h-14 sm:w-14"
            animate={{ scale: [1, 2.8], opacity: [0.7, 0] }}
            transition={{ duration: 2.6, repeat: Infinity, ease: "easeOut" }}
          />
          <motion.div
            className="absolute left-1/2 top-1/2 h-10 w-10 -translate-x-1/2 -translate-y-1/2 rounded-full border border-cyan-400/40 sm:h-14 sm:w-14"
            animate={{ scale: [1, 2.8], opacity: [0.7, 0] }}
            transition={{
              duration: 2.6,
              repeat: Infinity,
              ease: "easeOut",
              delay: 1.3,
            }}
          />
        </>
      )}

      <motion.div
        className="absolute -inset-3 rounded-full bg-blue-500/40 blur-xl"
        animate={
          reduced
            ? { opacity: 0.35 }
            : {
                opacity: active ? [0.5, 0.9, 0.5] : [0.3, 0.55, 0.3],
                scale: [1, 1.12, 1],
              }
        }
        transition={{
          duration: active ? 1.2 : 2.4,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      <div className="relative flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-blue-400 via-blue-500 to-indigo-600 shadow-lg shadow-blue-500/40 sm:h-14 sm:w-14">
        <div className="absolute inset-0.5 rounded-full bg-gradient-to-br from-white/40 via-transparent to-transparent" />
        <span
          className="relative text-xs font-bold text-white sm:text-base"
          style={{ textShadow: "0 1px 0 rgba(0,0,0,0.4)" }}
        >
          AL
        </span>
      </div>
    </div>
  );
}

/* ---------------- orbital guide rings ---------------- */

function OrbitalRing({
  radius,
  scaleY,
  rotate,
  opacity,
}: {
  radius: number;
  scaleY: number;
  rotate: number;
  opacity: number;
}) {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute left-1/2 top-1/2 rounded-full border border-dashed border-slate-700/40"
      style={{
        width: radius * 2,
        height: radius * 2,
        marginLeft: -radius,
        marginTop: -radius,
        transform: `rotate(${rotate}deg) scaleY(${scaleY})`,
        opacity,
      }}
    />
  );
}

/* ---------------- the reactor ---------------- */

function TechReactor() {
  const reduced = useReducedMotion() ?? false;
  const size = useSize();

  // ↓ tighter radius, especially on mobile
  const RADIUS = size === "sm" ? 80 : size === "md" ? 150 : 210;
  const baseIcon = size === "sm" ? 26 : size === "md" ? 36 : 44;

  const iconSize = Math.max(
    20,
    Math.min(baseIcon, Math.floor(RADIUS / Math.sqrt(technologies.length))),
  );

  const [hovered, setHovered] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);

  const rotX = useMotionValue(0);
  const rotY = useMotionValue(0);
  const velX = useRef(0);
  const velY = useRef(0);
  const lastPointer = useRef({ x: 0, y: 0 });

  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const parallaxX = useSpring(useTransform(my, [-0.5, 0.5], [-4, 4]), {
    stiffness: 80,
    damping: 20,
  });
  const parallaxY = useSpring(useTransform(mx, [-0.5, 0.5], [-8, 8]), {
    stiffness: 80,
    damping: 20,
  });

  const sceneRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (reduced) return;
    let raf = 0;
    let last = performance.now();
    const tick = (now: number) => {
      const dt = Math.min(now - last, 64);
      last = now;
      if (!dragging) {
        rotY.set(rotY.get() + dt * 0.012 + velY.current);
        rotX.set(rotX.get() + velX.current);
        velX.current *= 0.94;
        velY.current *= 0.94;
        if (Math.abs(velX.current) < 0.02) velX.current = 0;
        if (Math.abs(velY.current) < 0.02) velY.current = 0;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [dragging, reduced, rotX, rotY]);

  useEffect(() => {
    if (!dragging) return;
    const onMove = (e: PointerEvent) => {
      const dx = e.clientX - lastPointer.current.x;
      const dy = e.clientY - lastPointer.current.y;
      lastPointer.current = { x: e.clientX, y: e.clientY };
      const dY = -dx * 0.5;
      const dX = dy * 0.5;
      rotY.set(rotY.get() + dY);
      rotX.set(rotX.get() + dX);
      velY.current = dY * 0.5;
      velX.current = dX * 0.5;
    };
    const end = () => setDragging(false);
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", end);
    window.addEventListener("pointercancel", end);
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", end);
      window.removeEventListener("pointercancel", end);
    };
  }, [dragging, rotX, rotY]);

  const handlePointerDown = (e: React.PointerEvent) => {
    if ((e.target as HTMLElement).closest("button")) return;
    setDragging(true);
    lastPointer.current = { x: e.clientX, y: e.clientY };
    velX.current = 0;
    velY.current = 0;
    mx.set(0);
    my.set(0);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (dragging || !sceneRef.current) return;
    const r = sceneRef.current.getBoundingClientRect();
    mx.set((e.clientX - r.left) / r.width - 0.5);
    my.set((e.clientY - r.top) / r.height - 0.5);
  };

  const handlePointerLeave = () => {
    if (dragging) return;
    mx.set(0);
    my.set(0);
  };

  // ↓ tighter box on mobile; icons must fit inside RADIUS*2 + iconSize
  const maxWidth = RADIUS * 2 + iconSize + (size === "sm" ? 8 : 24);

  return (
    <div className="flex w-full flex-col items-center gap-3">
      <div
        ref={sceneRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerLeave={handlePointerLeave}
        className={`relative w-full select-none ${
          dragging ? "cursor-grabbing" : "cursor-grab"
        }`}
        style={{
          // ↓ shorter than square on mobile so it fits between text and buttons
          aspectRatio: size === "sm" ? "1 / 1.05" : "1 / 1",
          maxWidth: `${RADIUS * 2 + iconSize + (size === "sm" ? 8 : 24)}px`,
          margin: "0 auto",
          touchAction: "none",
        }}
        aria-label="Interactive 3D technology sphere. Drag to rotate."
      >
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 rounded-full bg-[radial-gradient(circle,rgba(59,130,246,0.12),transparent_65%)]"
        />

        {/* scale rings to fit the smaller box on mobile */}
        {size !== "sm" && (
          <>
            <OrbitalRing
              radius={RADIUS + 40}
              scaleY={0.32}
              rotate={22}
              opacity={0.35}
            />
            <OrbitalRing
              radius={RADIUS + 68}
              scaleY={0.22}
              rotate={-18}
              opacity={0.25}
            />
          </>
        )}

        <EnergyCore reduced={reduced} active={hovered !== null} />

        {technologies.map((tech, i) => (
          <TechNode
            key={tech.name}
            tech={tech}
            index={i}
            total={technologies.length}
            radius={RADIUS}
            iconSize={iconSize}
            rotX={rotX}
            rotY={rotY}
            parallaxX={parallaxX}
            parallaxY={parallaxY}
            hovered={hovered === tech.name}
            onHover={setHovered}
          />
        ))}
      </div>

      <p className="text-center text-[11px] tracking-wide text-slate-500">
        The Tech Sphere · {technologies.length} technologies
      </p>
    </div>
  );
}

/* ---------------- Hero ---------------- */

export default function Hero() {
  return (
    <Reveal>
      <section
        id="home"
        className="relative isolate z-0 flex min-h-[calc(100svh-4rem)] snap-start flex-col justify-center scroll-mt-20 pt-4 pb-10 sm:min-h-[calc(100svh-5rem)] sm:pt-6 sm:pb-14 lg:pt-8 lg:pb-16"
      >
        <div className="grid grid-cols-1 items-center gap-12 md:grid-cols-[minmax(0,1fr)_minmax(0,1.3fr)] md:gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.5fr)] lg:gap-12">
          {/* -------- Editorial left panel -------- */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="order-1 relative w-full max-w-xl"
          >
            {/* Dot-grid texture, fades out from top-left */}
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 -z-10 opacity-[0.05]"
              style={{
                backgroundImage:
                  "radial-gradient(circle, currentColor 1px, transparent 1px)",
                backgroundSize: "22px 22px",
                maskImage:
                  "radial-gradient(ellipse at top left, black 35%, transparent 72%)",
                WebkitMaskImage:
                  "radial-gradient(ellipse at top left, black 35%, transparent 72%)",
              }}
            />

            {/* Vertical side label — desktop only */}
            <span
              aria-hidden
              className="pointer-events-none absolute -left-40 top-1/2 hidden -translate-y-1/2 -rotate-90 whitespace-nowrap font-mono text-[10px] uppercase tracking-[0.4em] text-slate-600 lg:block"
            >
              Portfolio · 2026
            </span>

            {/* ── Top status bar ── */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <span className="font-mono text-[10px] uppercase tracking-[0.28em] text-slate-500">
                Probably Overthinking Things...
              </span>
            </div>

            {/* ── Name — mixed weight, italic second line ── */}
            <TypingName />

            {/* ── Roles — mono, single line with divider ── */}
            <p className="mt-5 font-mono text-[11px] uppercase tracking-[0.22em] text-blue-400">
              Software Developer | Technology Explorer
            </p>

            {/* ── Intro ── */}
            <p className="mt-6 max-w-md text-sm leading-7 text-slate-400 sm:text-[15px]">
              I enjoy exploring technology, solving problems, and building
              things that make a difference. Whether it's software, intelligent
              systems, or something entirely new, I'm usually curious enough to
              figure it out.
            </p>

            {/* ── CTAs ── */}
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button
                size="lg"
                onClick={() =>
                  document
                    .getElementById("projects")
                    ?.scrollIntoView({ behavior: "smooth" })
                }
              >
                View Projects
              </Button>
              <Button
                variant="secondary"
                size="lg"
                onClick={() =>
                  document
                    .getElementById("contact")
                    ?.scrollIntoView({ behavior: "smooth" })
                }
              >
                Contact Me
              </Button>
            </div>
          </motion.div>

          {/* reactor */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.9, delay: 0.4, ease: "easeOut" }}
            className="order-2 flex w-full min-w-0 items-center justify-center px-4 py-6 sm:py-0"
          >
            <TechReactor />
          </motion.div>
        </div>

        {/* scroll cue */}
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="mt-10 hidden justify-center md:flex"
        >
          <button
            aria-label="Scroll to next section"
            className="text-slate-500 transition hover:text-white"
            onClick={() =>
              document
                .getElementById("experience")
                ?.scrollIntoView({ behavior: "smooth" })
            }
          >
            ↓
          </button>
        </motion.div>
      </section>
    </Reveal>
  );
}

const LINE_1 = "Atharva";
const LINE_2 = "Lohar";
const TOTAL = LINE_1.length + LINE_2.length;

function Cursor() {
  return (
    <span
      aria-hidden
      className="ml-0.5 inline-block h-[1.1em] w-[3px] translate-y-[0.05em] rounded-sm bg-blue-400 align-middle shadow-[0_0_6px_rgba(59,130,246,0.55)] animate-blink"
    />
  );
}

function TypingName() {
  const reduced = useReducedMotion() ?? false;
  const [count, setCount] = useState(reduced ? TOTAL : 0);
  const [done, setDone] = useState(reduced);

  useEffect(() => {
    if (reduced) return;
    let cancelled = false;
    let timer: ReturnType<typeof setTimeout>;
    let i = 0;

    const tick = () => {
      if (cancelled) return;
      i += 1;
      setCount(i);
      if (i < TOTAL) {
        // 80–130ms per char → feels human, not robotic
        timer = setTimeout(tick, 80 + Math.random() * 50);
      } else {
        // Small pause before the period lands, so it reads as punctuation
        timer = setTimeout(() => setDone(true), 180);
      }
    };

    // Let the panel finish fading in first
    const start = setTimeout(tick, 550);

    return () => {
      cancelled = true;
      clearTimeout(start);
      clearTimeout(timer);
    };
  }, [reduced]);

  const l1 = LINE_1.slice(0, Math.min(count, LINE_1.length));
  const l2 =
    count > LINE_1.length
      ? LINE_2.slice(0, Math.min(count - LINE_1.length, LINE_2.length))
      : "";

  // Cursor travels: end of line 1 → end of line 2 → after the period
  const cursorOnLine1 = !done && count <= LINE_1.length;
  const cursorOnLine2 = !done && count > LINE_1.length;

  return (
    <h1 className="mt-7 text-4xl font-bold leading-[0.92] tracking-[-0.02em] text-slate-100 sm:text-5xl md:text-6xl lg:text-7xl">
      <span>
        {l1}
        {cursorOnLine1 && <Cursor />}
      </span>
      <br />
      <span className="font-light italic tracking-tight text-slate-300">
        {l2}
        {cursorOnLine2 && <Cursor />}
        {done && (
          <>
            <span className="text-blue-400">.</span>
            <Cursor />
          </>
        )}
      </span>
    </h1>
  );
}
