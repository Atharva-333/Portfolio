import SectionHeading from "../ui/SectionHeading";
import Badge from "../ui/Badge";
import Card from "../ui/Card";
import { CircleCheckBig } from "lucide-react";
import { experience } from "@/data/portfolio";
import Reveal from "../ui/Reveal";
import { motion } from "framer-motion";

export default function Experience() {
  return (
    <Reveal>
      <section id="experience" className="py-24 scroll-mt-20">
        <SectionHeading
          title="Experience"
          subtitle="Real-world software development experience."
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
        >
          {" "}
          <Card interactive>
            <div className="space-y-6">
              {/* Role */}
              <h2 className="text-[var(--text-primary)] text-2xl font-semibold">
                {experience.role}
              </h2>

              {/* Company & Duration */}
              <p className="text-[var(--text-secondary)] mt-1">
                {experience.company} • {experience.duration}
              </p>

              {/* Description */}
              <p className="text-[var(--text-secondary)]">
                {experience.description}
              </p>

              <div className="h-px bg-[var(--border)]" />

              {/* Responsibilities */}
              <div className="text-[var(--text-primary)]">
                <h4 className="font-medium mb-3">Key Responsibilities</h4>
                <ul className="space-y-2 text-[var(--text-secondary)]">
                  {experience.responsibilities.map((item) => (
                    <li key={item} className="flex items-start gap-2">
                      <CircleCheckBig className="mt-1 h-4 w-4 text-blue-400 flex-shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="h-px bg-[var(--border)]" />

              {/* Technologies */}
              <div className="text-[var(--text-primary)]">
                <h4 className="font-medium mb-3">Technologies Used</h4>
                <div className="flex flex-wrap gap-2">
                  {experience.technologies.map((tech) => (
                    <Badge key={tech}>{tech}</Badge>
                  ))}
                </div>
              </div>
            </div>
          </Card>
        </motion.div>
      </section>
    </Reveal>
  );
}
