import Card from "../../ui/Card";
import Badge from "../../ui/Badge";
import Button from "../../ui/Button";
import { projects } from "@/data/portfolio";
import { CircleCheck } from "lucide-react";
import React from "react";
import { SiGithub } from "react-icons/si";
import { ExternalLink, ArrowRight } from "lucide-react";

type ProjectCardProps = {
  project: (typeof projects)[number];
};

export default function ProjectCard({ project }: ProjectCardProps) {
  return (
    <Card interactive>
      <div className="space-y-6">
        <h2 className="text-[var(--text-primary)] text-2xl font-semibold">
          {project.title}
        </h2>
        <p className="text-[var(--text-secondary)] ">{project.subtitle}</p>
        <div className="h-px bg-[var(--border)]" />
        <p className="text-[var(--text-secondary)] ">{project.description}</p>
        <div className="h-px bg-[var(--border)]" />
        <div className="flex flex-wrap gap-3">
          {project.github ? (
            <Button href={project.github}>
              <SiGithub className="h-4 w-4" />
              GitHub
            </Button>
          ) : (
            <Button variant="secondary" disabled>
              <SiGithub className="h-4 w-4" />
              Private Repository
            </Button>
          )}

          {project.live ? (
            <Button href={project.live}>
              <ExternalLink className="h-4 w-4" />
              Live Demo
            </Button>
          ) : (
            <Button variant="secondary" disabled>
              <ExternalLink className="h-4 w-4" />
              Private Deployment
            </Button>
          )}
        </div>
        <div className="h-px bg-[var(--border)]" />
        <h3 className="text-[var(--text-primary)]">Technology</h3>
        <div className="flex flex-wrap gap-2">
          {project.technologies.map((tech) => (
            <Badge key={tech}>{tech}</Badge>
          ))}
        </div>
        <div className="h-px bg-[var(--border)]" />
        <h3 className="text-[var(--text-primary)]">Project Preview</h3>
        <div className="group overflow-hidden rounded-2xl">
          <img
            loading="lazy"
            decoding="async"
            src={project.image}
            alt={project.title}
            className="h-80 w-full object-cover transition-transform duration-500 h-80 w-full object-cover transition-all duration-700 group-hover:scale-110"
          />
        </div>
        <div className="h-px bg-[var(--border)]" />
        <h3 className="text-[var(--text-primary)]">Architecture</h3>
        <div className="flex flex-wrap gap-2">
          <div className="flex flex-row items-center gap-3 overflow-x-auto py-2">
            {project.architecture.map((step, index) => (
              <React.Fragment key={step}>
                <Badge>{step}</Badge>

                {index < project.architecture.length - 1 && (
                  <ArrowRight className="h-4 w-4 text-slate-500 shrink-0" />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
        <div className="h-px bg-[var(--border)]" />
        <div className="text-[var(--text-primary)]">
          <h4 className="font-medium mb-6">Key Features</h4>
          <ul className="space-y-2 text-[var(--text-secondary)]">
            {project.features.map((item) => (
              <li key={item} className="flex items-start gap-2">
                <CircleCheck className=" h-4 w-4 text-blue-400 flex-shrink-0" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="h-px bg-[var(--border)]" />
        <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5">
          <h4 className="text-[var(--text-primary)]">Challenges:</h4>
          <p className="text-[var(--text-secondary)]">{project.challenges}</p>
        </div>
        <div className="h-px bg-[var(--border)]" />
        <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5">
          <h4 className="text-[var(--text-primary)]">Results:</h4>
          <p className="text-[var(--text-secondary)]">{project.results}</p>
        </div>
      </div>
    </Card>
  );
}
