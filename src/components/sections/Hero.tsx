import Button from "@/components/ui/Button";
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
  type MotionValue,
} from "framer-motion";
import { useEffect, useRef, useState } from "react";
import Reveal from "../ui/Reveal";
import { technologies } from "@/data/portfolio";

/* ---------------- utils ---------------- */

function useSmallScreen() {
  const [small, setSmall] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 640px)");
    setSmall(mq.matches);
    const onChange = () => setSmall(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);
  return small;
}

function fibSphere(i: number, n: number, R: number) {
  const phi = Math.acos(1 - (2 * (i + 0.5)) / n);
  const theta = Math.PI * (1 + Math.sqrt(5)) * (i + 0.5);
  return {
    x: R * Math.sin(phi) * Math.cos(theta),
    y: R * Math.cos(phi),
    z: R * Math.sin(phi) * Math.sin(theta),
  };
}

/* ---------------- one tech node on the sphere ---------------- */

type TechNodeProps = {
  tech: (typeof technologies)[number];
  index: number;
  total: number;
  radius: number;
  iconSize: number;
  rotation: MotionValue<number>;
  hovered: boolean;
  onHover: (name: string | null) => void;
};

function TechNode({
  tech,
  index,
  total,
  radius,
  iconSize,
  rotation,
  hovered,
  onHover,
}: TechNodeProps) {
  const Icon = tech.icon;
  const p = fibSphere(index, total, radius);

  const x = useTransform(rotation, (deg) => {
    const r = (deg * Math.PI) / 180;
    return p.x * Math.cos(r) + p.z * Math.sin(r);
  });
  const z = useTransform(rotation, (deg) => {
    const r = (deg * Math.PI) / 180;
    return -p.x * Math.sin(r) + p.z * Math.cos(r);
  });
  const opacity = useTransform(z, [-radius, radius], [0.4, 1]);

  return (
    <motion.div
      className="pointer-events-none absolute left-1/2 top-1/2"
      style={{
        x,
        y: p.y,
        z,
        opacity,
        width: iconSize,
        height: iconSize,
        marginLeft: -iconSize / 2,
        marginTop: -iconSize / 2,
      }}
    >
      <motion.button
        type="button"
        aria-label={tech.name}
        onMouseEnter={() => onHover(tech.name)}
        onMouseLeave={() => onHover(null)}
        onFocus={() => onHover(tech.name)}
        onBlur={() => onHover(null)}
        animate={{ scale: hovered ? 1.4 : 1 }}
        transition={{ type: "spring", stiffness: 320, damping: 20 }}
        className="pointer-events-auto flex items-center justify-center rounded-xl border bg-slate-900/90 backdrop-blur-md transition-colors duration-200"
        style={{
          width: iconSize,
          height: iconSize,
          borderColor: hovered ? "rgba(96,165,250,0.9)" : "rgba(51,65,85,0.9)",
          color: hovered ? "#93c5fd" : "#cbd5e1",
          boxShadow: hovered
            ? "0 0 28px 6px rgba(59,130,246,0.55), inset 0 0 12px rgba(96,165,250,0.25)"
            : "0 4px 12px rgba(0,0,0,0.3)",
        }}
      >
        <Icon className={iconSize > 40 ? "h-5 w-5" : "h-4 w-4"} />
      </motion.button>

      <AnimatePresence>
        {hovered && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.16 }}
            className="pointer-events-none absolute left-1/2 top-full mt-4 -translate-x-1/2 whitespace-nowrap rounded-md border border-blue-500/40 bg-slate-950/95 px-2.5 py-1 text-[10px] font-medium text-blue-200 shadow-lg shadow-blue-500/20"
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
            className="absolute left-1/2 top-1/2 h-14 w-14 -translate-x-1/2 -translate-y-1/2 rounded-full border border-blue-500/50"
            animate={{ scale: [1, 3.2], opacity: [0.7, 0] }}
            transition={{ duration: 2.6, repeat: Infinity, ease: "easeOut" }}
          />
          <motion.div
            className="absolute left-1/2 top-1/2 h-14 w-14 -translate-x-1/2 -translate-y-1/2 rounded-full border border-cyan-400/40"
            animate={{ scale: [1, 3.2], opacity: [0.7, 0] }}
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

      <div className="relative flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-blue-400 via-blue-500 to-indigo-600 shadow-lg shadow-blue-500/40">
        <div className="absolute inset-0.5 rounded-full bg-gradient-to-br from-white/40 via-transparent to-transparent" />
        <span
          className="relative text-base font-bold text-white"
          style={{ textShadow: "0 1px 0 rgba(0,0,0,0.4)" }}
        >
          AL
        </span>
      </div>
    </div>
  );
}

/* ---------------- orbital guide ring ---------------- */

function OrbitalRing({
  radius,
  tilt,
  speed,
  reduced,
}: {
  radius: number;
  tilt: number;
  speed: number;
  reduced: boolean;
}) {
  return (
    <motion.div
      aria-hidden
      className="pointer-events-none absolute left-1/2 top-1/2 rounded-full border border-dashed border-slate-700/50"
      style={{
        width: radius * 2,
        height: radius * 2,
        marginLeft: -radius,
        marginTop: -radius,
        transformStyle: "preserve-3d",
        rotateX: tilt,
      }}
      animate={reduced ? undefined : { rotateZ: [0, 360] }}
      transition={{ duration: 60 / speed, repeat: Infinity, ease: "linear" }}
    />
  );
}

/* ---------------- the reactor ---------------- */

function TechReactor() {
  const reduced = useReducedMotion() ?? false;
  const small = useSmallScreen();
  const RADIUS = small ? 78 : 125;
  const ICON_SIZE = small ? 32 : 44;

  const [hovered, setHovered] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);
  const rotation = useMotionValue(0);
  const velocity = useRef(0);
  const lastPointerX = useRef(0);
  const sceneRef = useRef<HTMLDivElement>(null);

  /* parallax */
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const tiltX = useSpring(useTransform(my, [-0.5, 0.5], [10, -10]), {
    stiffness: 120,
    damping: 20,
  });
  const tiltY = useSpring(useTransform(mx, [-0.5, 0.5], [-12, 12]), {
    stiffness: 120,
    damping: 20,
  });

  /* auto-rotate + momentum decay */
  useEffect(() => {
    if (reduced) return;
    let raf = 0;
    let last = performance.now();
    const tick = (now: number) => {
      const dt = Math.min(now - last, 64);
      last = now;
      if (!dragging) {
        rotation.set(rotation.get() + dt * 0.012 + velocity.current);
        velocity.current *= 0.94;
        if (Math.abs(velocity.current) < 0.02) velocity.current = 0;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [dragging, reduced, rotation]);

  /* drag — window-level listeners so it works anywhere on the page */
  useEffect(() => {
    if (!dragging) return;
    const onMove = (e: PointerEvent) => {
      const dx = e.clientX - lastPointerX.current;
      lastPointerX.current = e.clientX;
      const delta = dx * 0.6;
      rotation.set(rotation.get() + delta);
      velocity.current = delta * 0.5;
    };
    const onUp = () => setDragging(false);
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    window.addEventListener("pointercancel", onUp);
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("pointercancel", onUp);
    };
  }, [dragging, rotation]);

  const handlePointerDown = (e: React.PointerEvent) => {
    if ((e.target as HTMLElement).closest("button")) return;
    setDragging(true);
    lastPointerX.current = e.clientX;
    velocity.current = 0;
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!sceneRef.current) return;
    const r = sceneRef.current.getBoundingClientRect();
    mx.set((e.clientX - r.left) / r.width - 0.5);
    my.set((e.clientY - r.top) / r.height - 0.5);
  };

  const handlePointerLeave = () => {
    if (!dragging) {
      mx.set(0);
      my.set(0);
    }
  };

  return (
    <div
      ref={sceneRef}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      className={`relative flex aspect-square w-full select-none items-center justify-center ${
        small ? "max-w-[260px]" : "max-w-[420px]"
      } ${dragging ? "cursor-grabbing" : "cursor-grab"}`}
      style={{ perspective: 1100, touchAction: "none" }}
      aria-label="Interactive 3D technology sphere"
    >
      {/* local glow — NOT the hero background */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-full bg-[radial-gradient(circle,rgba(59,130,246,0.14),transparent_65%)]"
      />

      <motion.div
        className="relative h-full w-full"
        style={{
          transformStyle: "preserve-3d",
          rotateX: reduced ? 0 : tiltX,
          rotateY: reduced ? 0 : tiltY,
        }}
      >
        <OrbitalRing
          radius={RADIUS + 45}
          tilt={72}
          speed={0.6}
          reduced={reduced}
        />
        <OrbitalRing
          radius={RADIUS + 20}
          tilt={-58}
          speed={0.9}
          reduced={reduced}
        />

        <EnergyCore reduced={reduced} active={hovered !== null} />

        {technologies.map((tech, i) => (
          <TechNode
            key={tech.name}
            tech={tech}
            index={i}
            total={technologies.length}
            radius={RADIUS}
            iconSize={ICON_SIZE}
            rotation={rotation}
            hovered={hovered === tech.name}
            onHover={setHovered}
          />
        ))}
      </motion.div>
    </div>
  );
}

/* ---------------- hero ---------------- */

export default function Hero() {
  return (
    <Reveal>
      <section
        id="home"
        className="relative flex min-h-[calc(100svh-4rem)] snap-start flex-col justify-center scroll-mt-20 py-10 sm:min-h-[calc(100svh-5rem)] sm:py-14 lg:py-16"
      >
        <div className="grid grid-cols-1 items-center gap-12 md:grid-cols-2 md:gap-20">
          {/* text */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="order-1 space-y-6"
          >
            <span className="inline-block rounded-full border border-slate-700 px-4 py-1 text-sm text-slate-300">
              Hi, I'm
            </span>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl"
            >
              Atharva
              <span className="text-blue-400"> Lohar</span>
            </motion.h1>

            <div className="space-y-4">
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35 }}
                className="text-xl font-semibold text-blue-400 sm:text-2xl"
              >
                Full Stack Developer
              </motion.h2>

              <motion.h3
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35 }}
                className="text-lg font-medium text-slate-300 sm:text-xl"
              >
                AI &amp; Computer Vision Engineer
              </motion.h3>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="max-w-2xl text-base leading-7 text-slate-400 sm:text-lg sm:leading-8"
              >
                I build scalable web applications, AI-powered software, and
                backend systems with a strong focus on performance, clean
                architecture, and user experience.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.65 }}
                className="flex flex-col gap-4 sm:flex-row"
              >
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
              </motion.div>
            </div>
          </motion.div>

          {/* reactor */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.9, delay: 0.4, ease: "easeOut" }}
            className="order-2 flex items-center justify-center"
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
