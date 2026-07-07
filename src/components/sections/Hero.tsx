import Button from "@/components/ui/Button";
import { motion } from "framer-motion";
import Reveal from "../ui/Reveal";

export default function Hero() {
  return (
    <Reveal>
      <section id="home" className="relative py-28 lg:py-36 scroll-mt-20">
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute left-1/2 top-0 h-96 w-96 -translate-x-1/2 rounded-full bg-blue-600/10 blur-3xl" />
        </div>
        <div className="grid grid-cols-1 items-center gap-20 md:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.8,
              ease: "easeOut",
            }}
            className="space-y-6"
          >
            <span className="inline-block rounded-full border border-slate-700 px-4 py-1 text-sm text-slate-300">
              Hi, I'm
            </span>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-bold tracking-tight"
            >
              Atharva
              <span className="text-blue-400"> Lohar</span>
            </motion.h1>

            <div className="space-y-4">
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35 }}
                className="text-2xl font-semibold text-blue-400"
              >
                Full Stack Developer
              </motion.h2>

              <motion.h3
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35 }}
                className="text-xl font-medium text-slate-300"
              >
                AI & Computer Vision Engineer
              </motion.h3>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="max-w-2xl text-lg leading-8 text-slate-400"
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

          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{
              duration: 0.3,
              delay: 0.4,
            }}
            whileHover={{
              y: -4,
            }}
            className="relative flex items-center justify-center"
          >
            <div className="relative h-[450px] w-full max-w-md overflow-hidden rounded-3xl border border-slate-800 bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 shadow-2xl">
              {/* Glow */}
              <div className="absolute -right-20 -top-20 h-56 w-56 rounded-full bg-blue-500/20 blur-3xl" />

              {/* Card 1 */}
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="absolute left-8 top-8 rounded-2xl border border-slate-700 bg-slate-900/80 px-5 py-4 backdrop-blur-md"
              >
                <p className="text-sm text-slate-400">Frontend</p>
                <p className="mt-2 font-semibold">React + TypeScript</p>
              </motion.div>

              {/* Card 2 */}
              <motion.div
                animate={{ y: [0, 10, 0] }}
                transition={{
                  duration: 5,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="absolute right-8 top-40 rounded-2xl border border-slate-700 bg-slate-900/80 px-5 py-4 backdrop-blur-md"
              >
                <p className="text-sm text-slate-400">Backend</p>
                <p className="mt-2 font-semibold">FastAPI + Supabase</p>
              </motion.div>

              {/* Card 3 */}
              <motion.div
                animate={{ y: [0, -6, 0] }}
                transition={{
                  duration: 4.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="absolute bottom-8 left-12 rounded-2xl border border-slate-700 bg-slate-900/80 px-5 py-4 backdrop-blur-md"
              >
                <p className="text-sm text-slate-400">AI</p>
                <p className="mt-2 font-semibold">YOLOv8 + DeepFace</p>
              </motion.div>
            </div>
          </motion.div>
        </div>
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{
            repeat: Infinity,
            duration: 2,
          }}
          className="mt-20 flex justify-center"
        >
          <button
            aria-label="Scroll to next section"
            className="text-slate-500 transition hover:text-white"
            onClick={() =>
              document
                .getElementById("trust")
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
