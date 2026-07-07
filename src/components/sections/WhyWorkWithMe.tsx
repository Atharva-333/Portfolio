import SectionHeading from "../ui/SectionHeading";
import Card from "../ui/Card";
import { strengths } from "@/data/portfolio";
import Reveal from "../ui/Reveal";
import { motion } from "framer-motion";
import { BriefcaseBusiness, Layers3, BrainCircuit } from "lucide-react";

const icons = {
  briefcase: BriefcaseBusiness,
  layers: Layers3,
  brain: BrainCircuit,
};

export default function WhyWorkWithMe() {
  return (
    <Reveal>
      <section id="why-work-with-me" className="py-24 scroll-mt-20">
        <SectionHeading
          title="Why Work With Me"
          subtitle="Building software with a focus on quality, scalability, and long-term maintainability."
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
          className="space-y-6 sm:space-y-0 sm:grid sm:grid-cols-3 sm:gap-6 mt-12"
        >
          {" "}
          {strengths.map((strength) => {
            const Icon = icons[strength.icon as keyof typeof icons];
            return (
              <Card interactive key={strength.title}>
                <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400">
                  <Icon className="h-7 w-7" />
                </div>
                <h3 className="text-xl font-semibold text-[var(--text-primary)]">
                  {strength.title}
                </h3>
                <p className="mt-3 text-[var(--text-secondary)] leading-relaxed">
                  {strength.description}
                </p>
              </Card>
            );
          })}
        </motion.div>
      </section>
    </Reveal>
  );
}
