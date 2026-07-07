import { technologies } from "@/data/portfolio";
import { motion } from "framer-motion";
import Reveal from "../ui/Reveal";

export default function Trust() {
  return (
    <Reveal>
      <section
        id="trust"
        className="py-12 border-y border-slate-800 scroll-mt-20"
      >
        <div className="space-y-8">
          <p className="text-center text-sm uppercase tracking-[0.3em] text-slate-400">
            Trusted Technologies
          </p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{
              duration: 0.4,
            }}
            whileHover={{
              y: -4,
            }}
            className="flex flex-wrap justify-center gap-4"
          >
            {technologies.map((tech) => {
              const Icon = tech.icon;
              return (
                <div
                  key={tech.name}
                  className="flex items-center gap-2 rounded-full border border-slate-700 bg-slate-900/60 px-5 py-2 text-sm text-slate-300 transition-all duration-300 hover:-translate-y-1 hover:border-blue-500 hover:text-white"
                >
                  <Icon className="h-5 w-5" />
                  <span>{tech.name}</span>
                </div>
              );
            })}
          </motion.div>
        </div>
      </section>
    </Reveal>
  );
}
