import { useEffect, useRef, useState } from "react";
import {
  motion,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
  useSpring,
  useTransform,
  type MotionValue,
} from "framer-motion";
import {
  Building2,
  Calendar,
  ChevronLeft,
  ChevronRight,
  CircleCheckBig,
} from "lucide-react";
import Reveal from "../ui/Reveal";
import { experience, type Experience } from "@/data/portfolio";
import { cn } from "@/lib/cn";

/* ---- normalize single-vs-array ---- */
const experiences: Experience[] = Array.isArray(experience)
  ? (experience as Experience[])
  : [experience as Experience];
type Entry = Experience;

/* ---- math ---- */
function wrapOffset(raw: number, total: number): number {
  if (total <= 1) return 0;
  let d = raw % total;
  if (d > total / 2) d -= total;
  else if (d < -total / 2) d += total;
  return d;
}

/* ---- breakpoint ---- */
function useIsBarrel() {
  const [isBarrel, setIsBarrel] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    const update = () => setIsBarrel(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);
  return isBarrel;
}

/* ---------------- card content ---------------- */

function ExperienceCard({
  data,
  index,
  total,
  isActive,
}: {
  data: Entry;
  index: number;
  total: number;
  isActive: boolean;
}) {
  return (
    <article
      className={cn(
        // no fixed height — card grows with content
        "group relative flex w-full flex-col overflow-hidden rounded-2xl border bg-[var(--card)]/95 p-6 transition-colors sm:p-8",
        isActive
          ? "border-blue-500/40 shadow-[0_0_40px_-8px_rgba(59,130,246,0.35)]"
          : "border-[var(--border)] hover:border-slate-600",
      )}
    >
      {/* corner ticks */}
      <span
        aria-hidden
        className="pointer-events-none absolute left-3 top-3 h-3 w-3 border-l border-t border-slate-600/70"
      />
      <span
        aria-hidden
        className="pointer-events-none absolute right-3 top-3 h-3 w-3 border-r border-t border-slate-600/70"
      />
      <span
        aria-hidden
        className="pointer-events-none absolute bottom-3 left-3 h-3 w-3 border-b border-l border-slate-600/70"
      />
      <span
        aria-hidden
        className="pointer-events-none absolute bottom-3 right-3 h-3 w-3 border-b border-r border-slate-600/70"
      />

      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-2xl bg-[radial-gradient(circle_at_top_left,rgba(59,130,246,0.10),transparent_60%)] opacity-0 transition-opacity duration-300 group-hover:opacity-100"
      />

      <div className="flex items-center justify-between">
        <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-blue-400">
          Experience
        </span>
        <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-slate-500">
          {String(index).padStart(2, "0")} / {String(total).padStart(2, "0")}
        </span>
      </div>

      <h3 className="mt-5 text-2xl font-semibold leading-tight text-slate-100 sm:text-3xl">
        {data.role}
      </h3>

      <div className="mt-3 space-y-1.5 text-sm text-slate-400">
        <div className="flex items-center gap-2">
          <Building2 className="h-3.5 w-3.5 shrink-0 text-slate-500" />
          <span className="truncate text-slate-200">{data.company}</span>
        </div>
        <div className="flex items-center gap-2">
          <Calendar className="h-3.5 w-3.5 shrink-0 text-slate-500" />
          <span>{data.duration}</span>
        </div>
      </div>

      <div className="my-4 h-px bg-slate-800" />

      {/* NO overflow-y-auto — card grows */}
      <div>
        <p className="text-sm leading-7 text-slate-400">{data.description}</p>

        <h5 className="mt-5 font-mono text-[10px] uppercase tracking-[0.03em] text-slate-500">
          Key Responsibilities
        </h5>
        <ul className="mt-3 space-y-2">
          {data.responsibilities.map((item: string) => (
            <li
              key={item}
              className="flex items-start gap-2.5 text-sm text-slate-300"
            >
              <CircleCheckBig className="mt-1.5 h-3.5 w-3.5 shrink-0 text-blue-400" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="my-3 h-px bg-slate-800" />

      <div className="flex flex-wrap gap-1.5">
        {data.technologies.map((tech: string) => (
          <span
            key={tech}
            className="rounded-full border border-blue-500/20 bg-blue-500/10 px-2.5 py-0.5 text-[11px] font-medium text-blue-300"
          >
            {tech}
          </span>
        ))}
      </div>
    </article>
  );
}

/* ---------------- barrel card (desktop only) ---------------- */

function BarrelCard({
  data,
  index,
  total,
  rotation,
  activeIndex,
  onSelect,
  didDrag,
  reduced,
}: {
  data: Entry;
  index: number;
  total: number;
  rotation: MotionValue<number>;
  activeIndex: number;
  onSelect: (i: number) => void;
  didDrag: React.RefObject<boolean>;
  reduced: boolean;
}) {
  const cardRef = useRef<HTMLDivElement>(null);

  const offset = useTransform(rotation, (r) => wrapOffset(index - r, total));
  const x = useTransform(offset, (o) => `${o * 60}%`);
  const rotateY = useTransform(offset, (o) => -o * 22);
  const z = useTransform(offset, (o) => -Math.abs(o) * 140);
  const scale = useTransform(offset, (o) =>
    Math.max(0.55, 1 - Math.abs(o) * 0.12),
  );
  const opacity = useTransform(offset, (o) =>
    total <= 1 ? 1 : Math.max(0, 1 - Math.abs(o) / Math.max(1, total * 0.42)),
  );

  useEffect(() => {
    const el = cardRef.current;
    if (!el) return;
    const apply = (o: number) => {
      if (!el.isConnected) return;
      el.style.zIndex = String(Math.round(100 - Math.abs(o) * 8));
    };
    apply(offset.get());
    return offset.on("change", apply);
  }, [offset]);

  const isActive = activeIndex === index;

  return (
    <div
      ref={cardRef}
      style={{
        position: "absolute",
        left: "50%",
        top: 0,
        width: "var(--card-w)",
        marginLeft: "calc(var(--card-w) / -2)",
        transformStyle: "preserve-3d",
      }}
    >
      <motion.div
        style={{
          x: reduced ? 0 : x,
          z: reduced ? 0 : z,
          rotateY: reduced ? 0 : rotateY,
          scale: reduced ? 1 : scale,
          opacity: reduced ? (isActive ? 1 : 0) : opacity,
          transformStyle: "preserve-3d",
        }}
        onClick={() => {
          if (didDrag.current) return;
          if (!isActive) onSelect(index);
        }}
        className={cn(isActive ? "cursor-default" : "cursor-pointer")}
      >
        <ExperienceCard
          data={data}
          index={index + 1}
          total={total}
          isActive={isActive}
        />
      </motion.div>
    </div>
  );
}

/* ---------------- main ---------------- */

export default function Experience() {
  const total = experiences.length;
  const isBarrel = useIsBarrel() && total > 1; // ← barrel only on md+ with 2+
  const reduced = useReducedMotion() ?? false;

  const [displayActive, setDisplayActive] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  const didDrag = useRef<boolean>(false);
  const dragStartX = useRef(0);
  const dragStartRotation = useRef(0);
  const activeRef = useRef(0);

  const rotation = useMotionValue(0);
  const smoothRotation = useSpring(rotation, {
    stiffness: 260,
    damping: 32,
    mass: 0.6,
  });

  useMotionValueEvent(smoothRotation, "change", (v) => {
    if (!isBarrel) return;
    const current = Number(v);
    if (!Number.isFinite(current)) return;
    const idx = ((Math.round(current) % total) + total) % total;
    if (idx === activeRef.current) return;
    activeRef.current = idx;
    queueMicrotask(() => setDisplayActive(idx));
  });

  /* drag */
  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isBarrel) return;
    setIsDragging(true);
    didDrag.current = false;
    dragStartX.current = e.clientX;
    dragStartRotation.current = rotation.get();
    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch {}
  };

  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging || !isBarrel) return;
    const dx = e.clientX - dragStartX.current;
    if (Math.abs(dx) > 5) didDrag.current = true;
    const oneCard =
      window.innerWidth >= 1024
        ? window.innerWidth * 0.28
        : window.innerWidth * 0.65;
    rotation.set(dragStartRotation.current - dx / oneCard);
  };

  const onPointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    setIsDragging(false);
    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch {}
    if (didDrag.current) rotation.set(Math.round(rotation.get()));
    queueMicrotask(() => {
      didDrag.current = false;
    });
  };

  const onPointerCancel = () => {
    setIsDragging(false);
    if (didDrag.current) rotation.set(Math.round(rotation.get()));
    queueMicrotask(() => {
      didDrag.current = false;
    });
  };

  /* nav */
  const goTo = (target: number) => {
    if (!isBarrel) return;
    const current = rotation.get();
    let delta = target - current;
    while (delta > total / 2) delta -= total;
    while (delta < -total / 2) delta += total;
    rotation.set(current + delta);
    setDisplayActive(target);
    activeRef.current = target;
  };

  const step = (dir: 1 | -1) => {
    if (!isBarrel) return;
    rotation.set(Math.round(rotation.get()) + dir);
  };

  const active = displayActive;

  return (
    <Reveal>
      <section
        id="experience"
        className="relative snap-start py-24 scroll-mt-20 overflow-x-clip"
      >
        {/* index */}
        <div className="mb-3 flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.3em] text-slate-500">
          <span className="h-px w-8 bg-slate-700" />A few commits, questionable
          decisions, and lessons learned.
        </div>

        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-4xl font-bold tracking-tight">
              The Experience Log.
            </h2>
            <div className="mt-4 flex justify-start">
              <div className="h-1 w-16 rounded-full bg-blue-500" />
            </div>
            <p className="mt-4 text-slate-400">
              Every experience has been another opportunity to learn,
              experiment, and figure things out beyond the classroom. From
              collaborating on projects to tackling real-world problems, I'm
              gradually turning curiosity into practical skills. Still a work in
              progress — much like most of my code.
            </p>
          </div>

          {isBarrel && (
            <div className="flex gap-2">
              <button
                onClick={() => step(-1)}
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-700 bg-slate-900/60 text-slate-300 transition-colors hover:border-blue-500/60 hover:text-white"
                aria-label="Previous experience"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                onClick={() => step(1)}
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-700 bg-slate-900/60 text-slate-300 transition-colors hover:border-blue-500/60 hover:text-white"
                aria-label="Next experience"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>

        {/* ── MOBILE: vertical stack, narrower cards ── */}
        {!isBarrel && (
          <div className="mt-10 flex flex-col items-center gap-6">
            {experiences.map((entry, i) => (
              <div
                key={`${entry.company}-${entry.role}-${i}`}
                className="w-[88vw] max-w-[520px]"
              >
                <ExperienceCard
                  data={entry}
                  index={i + 1}
                  total={total}
                  isActive={total === 1}
                />
              </div>
            ))}
          </div>
        )}

        {/* ── DESKTOP: barrel ── */}
        {isBarrel && (
          <>
            <div
              className={cn(
                "relative mt-10 select-none",
                "[--card-w:calc(72vw)] md:[--card-w:calc(56vw)] lg:[--card-w:calc(33vw-1rem)]",
              )}
              style={{
                height: 640,
                perspective: 1400,
                touchAction: "pan-y",
              }}
              onPointerDown={onPointerDown}
              onPointerMove={onPointerMove}
              onPointerUp={onPointerUp}
              onPointerCancel={onPointerCancel}
            >
              <div
                style={{
                  position: "relative",
                  width: "100%",
                  height: "100%",
                  transformStyle: "preserve-3d",
                }}
              >
                {experiences.map((entry, i) => (
                  <BarrelCard
                    key={`${entry.company}-${entry.role}-${i}`}
                    data={entry}
                    index={i}
                    total={total}
                    rotation={smoothRotation}
                    activeIndex={active}
                    onSelect={goTo}
                    didDrag={didDrag}
                    reduced={reduced}
                  />
                ))}
              </div>
            </div>

            <div className="mt-6 flex justify-center gap-1.5">
              {experiences.map((_, i) => (
                <button
                  key={i}
                  onClick={() => goTo(i)}
                  className={cn(
                    "h-1 rounded-full transition-all",
                    active === i
                      ? "w-6 bg-blue-500"
                      : "w-1.5 bg-slate-700 hover:bg-slate-500",
                  )}
                  aria-label={`Go to experience ${i + 1}`}
                />
              ))}
            </div>
          </>
        )}
      </section>
    </Reveal>
  );
}
