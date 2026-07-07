import SectionHeading from "../ui/SectionHeading";
import ProjectCard from "./projects/ProjectCard";
import { projects } from "@/data/portfolio";
import Reveal from "../ui/Reveal";
import { motion } from "framer-motion";

export default function Projects() {
  return (
    <section
      id="projects"
      className="scroll-mt-20 py-24 scroll-mt-20 min-h-screen"
    >
      <Reveal>
        <SectionHeading
          title="Featured Projects"
          subtitle="A selection of projects showcasing full-stack development, AI integration, and scalable system design."
          align="center"
        />
        <div className="mx-auto mt-12 max-w-6xl">
          <motion.div
            variants={{
              hidden: {},
              visible: {
                transition: {
                  delayChildren: 0.1,
                  staggerChildren: 0.2,
                },
              },
            }}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="mt-12 grid gap-12"
          >
            {projects.length === 0 ? (
              <p>No projects.</p>
            ) : (
              projects.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))
            )}
          </motion.div>
        </div>
      </Reveal>
    </section>
  );
}
