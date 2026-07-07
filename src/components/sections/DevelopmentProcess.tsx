import SectionHeading from "../ui/SectionHeading";
import Card from "../ui/Card";
import { developmentProcess } from "@/data/portfolio";
import { ArrowRight } from "lucide-react";
import Reveal from "../ui/Reveal";
import { motion } from "framer-motion";

export default function DevelopmentProcess() {
  return (
    <Reveal>
      <section id="process" className="py-24 scroll-mt-20">
        <SectionHeading
          title="Development Process"
          subtitle="A structured approach to building reliable software."
          align="center"
        />
        <motion.div
          variants={{
            hidden: {},
            visible: {
              transition: {
                staggerChildren: 0.15,
              },
            },
          }}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="mt-12 flex flex-col items-center gap-6 lg:flex-row"
        >
          {developmentProcess.map((step, index) => (
            <div key={step.title} className="flex items-center flex-1">
              <Card interactive className="flex h-full flex-1 flex-col">
                <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-500/10 text-3xl font-bold text-blue-400">
                  {step.step}
                </div>
                <h3 className="text-xl font-semibold text-[var(--text-primary)]">
                  {step.title}
                </h3>
                <p className="mt-4 text-[var(--text-secondary)] leading-relaxed">
                  {step.description}
                </p>
              </Card>
              {index < developmentProcess.length - 1 && (
                <ArrowRight className="mx-4 hidden h-5 w-5 text-slate-600 lg:block" />
              )}
            </div>
          ))}
        </motion.div>
      </section>
    </Reveal>
  );
}
