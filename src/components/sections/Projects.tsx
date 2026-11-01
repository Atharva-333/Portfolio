import { useEffect, useRef, useState } from "react";
import SectionHeading from "../ui/SectionHeading";
import ProjectCard from "./projects/ProjectCard";
import { projects } from "@/data/portfolio";
import { cn } from "@/lib/cn";

function useMinWidth(px: number) {
  const [ok, setOk] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia(`(min-width: ${px}px)`);
    const update = () => setOk(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, [px]);
  return ok;
}

const FLICK_GAIN = 14;

export default function Projects() {
  const total = projects.length;
  const isDesktop = useMinWidth(1024);
  const [activeIndex, setActiveIndex] = useState(0);
  const [dragging, setDragging] = useState(false);

  const scrollerRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const rafRef = useRef(0);
  const activeRef = useRef(0);

  const didDrag = useRef(false);
  const dragStartX = useRef(0);
  const dragStartScroll = useRef(0);
  const pointerId = useRef<number | null>(null);

  useEffect(() => {
    if (!isDesktop) return;
    const scroller = scrollerRef.current;
    if (!scroller) return;

    const paint = () => {
      const center = scroller.scrollLeft + scroller.clientWidth / 2;
      let bestIdx = 0;
      let bestDist = Infinity;

      cardRefs.current.forEach((card, i) => {
        if (!card) return;
        const cardCenter = card.offsetLeft + card.offsetWidth / 2;
        const d = cardCenter - center;
        const a = Math.min(1, Math.abs(d) / scroller.clientWidth);

        const scale = 1 - a * 0.18;
        const opacity = 1 - a * 0.65;
        const blur = a * 4;
        const lift = -a * 12;
        const glow = Math.max(0, 1 - a * 3);

        card.style.transform = `translate3d(0, ${lift}px, 0) scale(${scale})`;
        card.style.opacity = String(opacity);
        card.style.filter = blur > 0.05 ? `blur(${blur}px)` : "none";
        card.style.setProperty("--glow", glow.toFixed(3));

        if (Math.abs(d) < bestDist) {
          bestDist = Math.abs(d);
          bestIdx = i;
        }
      });

      if (bestIdx !== activeRef.current) {
        activeRef.current = bestIdx;
        setActiveIndex(bestIdx);
      }
    };

    const onScroll = () => {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(paint);
    };

    paint();
    scroller.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(rafRef.current);
      scroller.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [isDesktop, total]);

  const scrollToCard = (i: number) => {
    const scroller = scrollerRef.current;
    const card = cardRefs.current[i];
    if (!scroller || !card) return;
    const left =
      card.offsetLeft - (scroller.clientWidth - card.offsetWidth) / 2;
    scroller.scrollTo({ left, behavior: "smooth" });
  };

  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDesktop) return;
    const scroller = scrollerRef.current;
    if (!scroller) return;
    const target = e.target as HTMLElement;
    if (target.closest("a, button, input, textarea")) return;

    didDrag.current = false;
    dragStartX.current = e.clientX;
    dragStartScroll.current = scroller.scrollLeft;
    pointerId.current = e.pointerId;
    setDragging(true);
    try {
      scroller.setPointerCapture(e.pointerId);
    } catch {}
  };

  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!dragging || !isDesktop) return;
    const scroller = scrollerRef.current;
    if (!scroller) return;
    const dx = e.clientX - dragStartX.current;
    if (Math.abs(dx) > 2) didDrag.current = true;
    scroller.scrollLeft = dragStartScroll.current - dx * FLICK_GAIN;
  };

  const endDrag = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!dragging) return;
    setDragging(false);

    const scroller = scrollerRef.current;
    if (scroller && pointerId.current !== null) {
      try {
        scroller.releasePointerCapture(pointerId.current);
      } catch {}
    }
    pointerId.current = null;

    if (didDrag.current && scroller) {
      const center = scroller.scrollLeft + scroller.clientWidth / 2;
      let bestIdx = 0;
      let bestDist = Infinity;
      cardRefs.current.forEach((card, i) => {
        if (!card) return;
        const cardCenter = card.offsetLeft + card.offsetWidth / 2;
        const d = Math.abs(cardCenter - center);
        if (d < bestDist) {
          bestDist = d;
          bestIdx = i;
        }
      });
      scrollToCard(bestIdx);
    }

    queueMicrotask(() => {
      didDrag.current = false;
    });
  };

  if (!isDesktop) {
    return (
      <section id="projects" className="scroll-mt-20 py-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <SectionHeading
            title="Featured Projects"
            subtitle="A selection of projects showcasing full-stack development, AI integration, and scalable system design."
            align="center"
          />
          <div className="mt-12 grid gap-8">
            {projects.map((p, i) => (
              <div key={p.id} className="mx-auto w-full max-w-5xl">
                <ProjectCard
                  project={p}
                  index={i}
                  total={total}
                  active={false}
                />
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="projects" className="relative scroll-mt-20 py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div>
          <div className="mb-3 flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.3em] text-slate-500">
            <span className="h-px w-8 bg-slate-700" />
            Selected Work
          </div>
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
            Featured Projects.
          </h2>
          <p className="mt-2 max-w-md text-sm leading-6 text-slate-400">
            Full-stack development, AI integration, and scalable system design.
          </p>
        </div>
      </div>

      <div
        ref={scrollerRef}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        onPointerLeave={(e) => {
          if (dragging) endDrag(e);
        }}
        className={cn(
          "relative left-1/2 mt-10 flex w-[100vw] -translate-x-1/2 gap-8 overflow-x-auto overscroll-x-contain",
          "px-[calc(50vw-30rem)] py-10",
          "[scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
          dragging ? "cursor-grabbing" : "cursor-grab",
          dragging ? "snap-none" : "snap-x snap-mandatory",
          "select-none scroll-px-[calc(50vw-30rem)]",
        )}
        style={{ touchAction: "pan-y" }}
      >
        {projects.map((project, i) => (
          <div
            key={project.id}
            ref={(el) => {
              cardRefs.current[i] = el;
            }}
            className="relative shrink-0 snap-center will-change-transform"
            style={{
              width: "min(60rem, 78vw)",
              transition: dragging
                ? "none"
                : "opacity 160ms linear, filter 160ms linear",
            }}
          >
            <ProjectCard
              project={project}
              index={i}
              total={total}
              active={activeIndex === i}
            />
          </div>
        ))}
      </div>

      <div className="mt-2 flex justify-center gap-1.5">
        {projects.map((_, i) => (
          <button
            key={i}
            onClick={() => scrollToCard(i)}
            className={cn(
              "h-1 rounded-full transition-all",
              activeIndex === i
                ? "w-6 bg-blue-500"
                : "w-1.5 bg-slate-700 hover:bg-slate-500",
            )}
            aria-label={`Go to project ${i + 1}`}
          />
        ))}
      </div>
    </section>
  );
}
