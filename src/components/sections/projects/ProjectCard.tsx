import { Fragment, useEffect, useState } from "react";
import {
  ArrowRight,
  CircleCheckBig,
  ExternalLink,
  Sparkles,
  X,
  Maximize2,
} from "lucide-react";
import { SiGithub } from "react-icons/si";
import { motion, AnimatePresence } from "framer-motion";

import Button from "../../ui/Button";
import { projects } from "@/data/portfolio";
import { cn } from "@/lib/cn";

type ProjectCardProps = {
  project: (typeof projects)[number];
  index: number;
  total: number;
  active: boolean;
};

export default function ProjectCard({
  project,
  index,
  total,
  active,
}: ProjectCardProps) {
  const [expandedImage, setExpandedImage] = useState(false);
  const [expandedDetails, setExpandedDetails] = useState(false);

  useEffect(() => {
    if (!expandedImage && !expandedDetails) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setExpandedImage(false);
        setExpandedDetails(false);
      }
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [expandedImage, expandedDetails]);

  return (
    <>
      <article
        className={cn(
          "group relative flex w-full flex-col overflow-hidden rounded-2xl border bg-[var(--card)]/95 p-6 sm:p-8",
          "transition-[border-color] duration-500",
          active ? "border-blue-500/40" : "border-[var(--border)]",
        )}
        style={{
          boxShadow:
            "0 0 calc(60px * var(--glow, 1)) -8px rgba(59,130,246, calc(0.55 * var(--glow, 1))), 0 20px 40px -20px rgba(0,0,0,0.6)",
        }}
      >
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

        <div className="relative grid min-w-0 gap-6 lg:grid-cols-[1.15fr_1fr] lg:gap-8">
          {/* LEFT COLUMN */}
          <div className="flex min-w-0 flex-col">
            <div className="flex items-center justify-between">
              <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-blue-400">
                Project
              </span>
              <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-slate-500">
                {String(index + 1).padStart(2, "0")} /{" "}
                {String(total).padStart(2, "0")}
              </span>
            </div>

            <div className="mt-4 flex flex-wrap items-start gap-x-3 gap-y-2">
              <h3 className="min-w-0 break-words text-lg font-semibold leading-tight text-slate-100 sm:text-2xl">
                {project.title}
              </h3>
              {project.featured && (
                <span className="mt-1 inline-flex shrink-0 items-center gap-1 rounded-full border border-blue-400/30 bg-blue-500/10 px-2 py-0.5 font-mono text-[9px] uppercase tracking-[0.2em] text-blue-300">
                  <Sparkles className="h-2.5 w-2.5" />
                  Featured
                </span>
              )}
            </div>

            <p className="mt-2 text-sm text-slate-400">{project.subtitle}</p>
            <div className="my-4 h-px bg-slate-800" />
            <p className="text-sm leading-7 text-slate-400">
              {project.description}
            </p>

            {/* MOBILE ONLY: Subtle inline details trigger & standard CTAs */}
            <div className="mt-6 flex flex-col gap-4 lg:hidden">
              <button
                type="button"
                onClick={() => setExpandedDetails(true)}
                className="group/btn flex items-center gap-1.5 self-start font-mono text-[10px] uppercase tracking-[0.2em] text-blue-400 transition-colors hover:text-blue-300"
              >
                View Full Details
                <ArrowRight className="h-3 w-3 transition-transform group-hover/btn:translate-x-0.5" />
              </button>
              <div className="flex flex-wrap gap-2">
                {project.github ? (
                  <Button href={project.github} size="sm">
                    <SiGithub className="h-4 w-4" />
                    GitHub
                  </Button>
                ) : (
                  <Button variant="secondary" size="sm" disabled>
                    <SiGithub className="h-4 w-4" />
                    Private
                  </Button>
                )}
                {project.live ? (
                  <Button href={project.live} size="sm">
                    <ExternalLink className="h-4 w-4" />
                    Live Demo
                  </Button>
                ) : (
                  <Button variant="secondary" size="sm" disabled>
                    <ExternalLink className="h-4 w-4" />
                    Private
                  </Button>
                )}
              </div>
            </div>

            {/* DESKTOP ONLY: Full deep-dive details */}
            <div className="hidden lg:block">
              <h4 className="font-mono text-[9px] uppercase tracking-[0.28em] text-slate-500">
                Key Features
              </h4>
              <ul className="mt-2.5 space-y-1.5">
                {project.features.map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-2 text-sm text-slate-300"
                  >
                    <CircleCheckBig className="mt-0.5 h-3.5 w-3.5 shrink-0 text-blue-400" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>

              <div className="my-4 h-px bg-slate-800" />

              <h4 className="font-mono text-[9px] uppercase tracking-[0.28em] text-slate-500">
                Architecture
              </h4>
              <div className="mt-2.5 flex flex-wrap items-center gap-1.5">
                {project.architecture.map((step, i) => (
                  <Fragment key={step}>
                    <span className="rounded border border-slate-700/60 bg-slate-800/40 px-2 py-0.5 font-mono text-[10px] text-slate-300">
                      {step}
                    </span>
                    {i < project.architecture.length - 1 && (
                      <ArrowRight className="h-3 w-3 text-slate-600" />
                    )}
                  </Fragment>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN */}
          <div className="flex min-w-0 flex-col gap-4">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setExpandedImage(true);
              }}
              aria-label={`Expand ${project.title} preview`}
              className="group/image relative block w-full cursor-zoom-in overflow-hidden rounded-xl border border-slate-700/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background)]"
            >
              <img
                loading="lazy"
                decoding="async"
                src={project.image}
                alt={project.title}
                className="aspect-[16/10] w-full object-cover"
              />
              <div className="absolute inset-0 flex items-center justify-center bg-slate-950/0 transition-colors hover:bg-slate-950/20">
                <Maximize2 className="h-6 w-6 text-white opacity-0 transition-opacity group-hover/image:opacity-100 drop-shadow-md" />
              </div>
            </button>

            {/* DESKTOP ONLY: Stack tags */}
            <div className="hidden lg:block">
              <h4 className="font-mono text-[9px] uppercase tracking-[0.28em] text-slate-500">
                Stack
              </h4>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {project.technologies.map((tech) => (
                  <span
                    key={tech}
                    className="rounded-full border border-blue-500/20 bg-blue-500/10 px-2.5 py-0.5 text-[11px] font-medium text-blue-300"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            {/* DESKTOP ONLY: Call to Action buttons */}
            <div className="mt-auto hidden flex-wrap gap-2 lg:flex">
              {project.github ? (
                <Button href={project.github} size="sm">
                  <SiGithub className="h-4 w-4" />
                  GitHub
                </Button>
              ) : (
                <Button variant="secondary" size="sm" disabled>
                  <SiGithub className="h-4 w-4" />
                  Private
                </Button>
              )}
              {project.live ? (
                <Button href={project.live} size="sm">
                  <ExternalLink className="h-4 w-4" />
                  Live Demo
                </Button>
              ) : (
                <Button variant="secondary" size="sm" disabled>
                  <ExternalLink className="h-4 w-4" />
                  Private
                </Button>
              )}
            </div>
          </div>
        </div>
      </article>

      {/* MOBILE DETAILS OVERLAY */}
      <AnimatePresence>
        {expandedDetails && (
          <motion.div
            className="fixed inset-0 z-[200] flex items-end justify-center bg-slate-950/80 backdrop-blur-sm sm:items-center sm:p-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setExpandedDetails(false)}
          >
            <motion.div
              className="relative flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-t-3xl border border-slate-800 bg-[var(--card)] shadow-2xl sm:rounded-2xl"
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center justify-between border-b border-slate-800 p-5">
                <h3 className="min-w-0 break-words pr-4 text-lg font-semibold text-slate-100">
                  {project.title}
                </h3>
                <button
                  type="button"
                  onClick={() => setExpandedDetails(false)}
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-900/50 text-slate-400 hover:text-white"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Scrollable Content */}
              <div className="flex-1 overflow-y-auto p-5 pb-8">
                <img
                  src={project.image}
                  alt={project.title}
                  className="mb-6 w-full rounded-xl border border-slate-700/50 object-cover"
                />

                <h5 className="mt-5 font-mono text-[9px] uppercase tracking-[0.03em] text-slate-500">
                  Key Features
                </h5>
                <ul className="mb-6 space-y-2">
                  {project.features.map((item) => (
                    <li
                      key={item}
                      className="flex items-start gap-2 text-sm text-slate-300"
                    >
                      <CircleCheckBig className="mt-0.5 h-4 w-4 shrink-0 text-blue-400" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>

                <h5 className="mt-5 font-mono text-[9px] uppercase tracking-[0.03em] text-slate-500">
                  Architecture
                </h5>
                <div className="mb-6 flex flex-wrap items-center gap-1.5">
                  {project.architecture.map((step, i) => (
                    <Fragment key={step}>
                      <span className="rounded border border-slate-700/60 bg-slate-800/40 px-2 py-0.5 font-mono text-[10px] text-slate-300">
                        {step}
                      </span>
                      {i < project.architecture.length - 1 && (
                        <ArrowRight className="h-3 w-3 text-slate-600" />
                      )}
                    </Fragment>
                  ))}
                </div>

                <h4 className="mb-2 font-mono text-[9px] uppercase tracking-[0.28em] text-slate-500">
                  Stack
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {project.technologies.map((tech) => (
                    <span
                      key={tech}
                      className="rounded-full border border-blue-500/20 bg-blue-500/10 px-2.5 py-0.5 text-[11px] font-medium text-blue-300"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* PURE FULL-SCREEN IMAGE OVERLAY */}
      <AnimatePresence>
        {expandedImage && (
          <motion.div
            className="fixed inset-0 z-[200] flex items-center justify-center bg-slate-950/90 backdrop-blur-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <button
              type="button"
              aria-label="Close preview"
              onClick={() => setExpandedImage(false)}
              className="absolute inset-0 h-full w-full cursor-zoom-out outline-none"
            />
            <motion.img
              src={project.image}
              alt={project.title}
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ type: "spring", stiffness: 350, damping: 30 }}
              className="pointer-events-none relative z-10 block h-[100vh] w-[100vw] object-contain p-4 sm:p-12"
            />
            <button
              type="button"
              onClick={() => setExpandedImage(false)}
              className="absolute right-6 top-6 z-20 inline-flex h-12 w-12 items-center justify-center rounded-full border border-slate-600/50 bg-slate-900/50 text-slate-300 backdrop-blur transition hover:border-blue-500/60 hover:text-white"
            >
              <X className="h-6 w-6" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
