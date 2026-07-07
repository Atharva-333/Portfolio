import SectionHeading from "../ui/SectionHeading";
import Card from "../ui/Card";
import Badge from "../ui/Badge";
import { motion } from "framer-motion";
import { skillCategories } from "@/data/portfolio";
import Reveal from "../ui/Reveal";

export default function Skills() {
  return (
    <Reveal>
      <section id="skills" className="py-24 scroll-mt-20">
        <SectionHeading
          title="Skills"
          subtitle="Technologies and tools I use to build modern applications."
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
          className="space-y-6 sm:space-y-0 sm:grid sm:gap-6 mt-12"
        >
          {" "}
          {skillCategories.map((category) => (
            <Card interactive key={category.title}>
              <h3 className="text-xl font-semibold text-[var(--text-primary)]">
                {category.title}
              </h3>
              <div className="mt-5 flex flex-wrap gap-2">
                {category.skills.map((skill) => (
                  <Badge key={skill}>{skill}</Badge>
                ))}
              </div>
            </Card>
          ))}
        </motion.div>
      </section>
    </Reveal>
  );
}
