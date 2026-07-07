import SectionHeading from "../ui/SectionHeading";
import Card from "../ui/Card";
import Button from "../ui/Button";
import { contact } from "@/data/portfolio";
import { SiGithub } from "react-icons/si";
import { FaLinkedin } from "react-icons/fa";
import { Mail, MapPin, ArrowRight } from "lucide-react";
import Reveal from "../ui/Reveal";
import { motion } from "framer-motion";

export default function Contact() {
  const contactItems = [
    {
      icon: Mail,
      title: "Email",
      value: contact.email,
      link: `mailto:${contact.email}`,
      color: "text-blue-600",
      bgColor: "bg-blue-600/10",
      borderColor: "hover:border-blue-600/30",
    },
    {
      icon: FaLinkedin,
      title: "LinkedIn",
      value: contact.linkedin.username,
      link: contact.linkedin.url,
      color: "text-blue-600",
      bgColor: "bg-blue-600/10",
      borderColor: "hover:border-blue-600/30",
    },
    {
      icon: SiGithub,
      title: "GitHub",
      value: contact.github.username,
      link: contact.github.url,
      color: "text-blue-600",
      bgColor: "bg-blue-600/10",
      borderColor: "hover:border-blue-600/30",
    },
    {
      icon: MapPin,
      title: "Location",
      value: contact.location,
      link: null,
      color: "text-blue-600",
      bgColor: "bg-blue-600/10",
      borderColor: "hover:border-blue-600/30",
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <Reveal>
      <section id="contact" className="py-24 scroll-mt-20">
        <SectionHeading
          title="Let's Build Something Together"
          subtitle="I'm always open to discussing new opportunities, freelance work, or interesting software ideas."
          align="center"
        />

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-12"
        >
          {contactItems.map((item) => (
            <motion.div
              key={item.title}
              variants={itemVariants}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="h-full"
            >
              {item.link ? (
                <a
                  href={item.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group block h-full"
                >
                  <Card
                    interactive
                    className="flex flex-col items-center text-center p-6 transition-all duration-300 hover:scale-[1.02] h-full"
                  >
                    <div
                      className={`mb-5 flex h-16 w-16 items-center justify-center rounded-2xl ${item.bgColor} transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-6`}
                    >
                      <item.icon className={`h-7 w-7 ${item.color}`} />
                    </div>
                    <h3 className="text-sm font-semibold uppercase tracking-wider text-[var(--text-secondary)]">
                      {item.title}
                    </h3>
                    <p className="mt-3 text-sm font-medium text-[var(--text-primary)] break-words max-w-full">
                      {item.value}
                    </p>
                  </Card>
                </a>
              ) : (
                <Card
                  interactive={false}
                  className="flex flex-col items-center text-center p-6 transition-all duration-300 hover:scale-[1.02] h-full"
                >
                  <div
                    className={`mb-5 flex h-16 w-16 items-center justify-center rounded-2xl ${item.bgColor} transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-6`}
                  >
                    <item.icon className={`h-7 w-7 ${item.color}`} />
                  </div>
                  <h3 className="text-sm font-semibold uppercase tracking-wider text-[var(--text-secondary)]">
                    {item.title}
                  </h3>
                  <p className="mt-3 text-sm font-medium text-[var(--text-primary)] break-words max-w-full">
                    {item.value}
                  </p>
                </Card>
              )}
            </motion.div>
          ))}
        </motion.div>

        <div className="mt-12 text-center">
          <p className="text-lg text-[var(--text-secondary)] mb-6">
            Have an idea or opportunity in mind?
            <br />
            Let's build something great together.
          </p>
          <Button
            size="lg"
            href={`mailto:${contact.email}`}
            className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
          >
            <Mail className="h-5 w-5" />
            <span className="font-medium">Let's Talk</span>
            <ArrowRight className="h-5 w-5" />
          </Button>
        </div>
      </section>
    </Reveal>
  );
}
