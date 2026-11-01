import { useState, useRef } from "react";
import emailjs from "@emailjs/browser";
import {
  motion,
  useMotionValue,
  useSpring,
  useMotionTemplate,
} from "framer-motion";
import {
  Send,
  CheckCircle2,
  Mail,
  MapPin,
  Copy,
  Check,
  ExternalLink,
  AlertCircle,
} from "lucide-react";
import { SiGithub } from "react-icons/si";
import { FaLinkedin } from "react-icons/fa";
import { contact } from "@/data/portfolio";
import { cn } from "@/lib/cn";

const CONTACT_LINKS = [
  {
    icon: Mail,
    label: "Email",
    value: contact.email,
    href: `mailto:${contact.email}`,
    copyable: true,
  },
  {
    icon: SiGithub,
    label: "GitHub",
    value: contact.github.username,
    href: contact.github.url,
    copyable: false,
  },
  {
    icon: FaLinkedin,
    label: "LinkedIn",
    value: contact.linkedin.username,
    href: contact.linkedin.url,
    copyable: false,
  },
  {
    icon: MapPin,
    label: "Location",
    value: contact.location,
    href: null,
    copyable: false,
  },
];

export default function Contact() {
  const cardRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [copied, setCopied] = useState<string | null>(null);

  const rx = useMotionValue(0);
  const ry = useMotionValue(0);
  const srx = useSpring(rx, { stiffness: 100, damping: 30 });
  const sry = useSpring(ry, { stiffness: 100, damping: 30 });

  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const smx = useSpring(mx, { stiffness: 300, damping: 40 });
  const smy = useSpring(my, { stiffness: 300, damping: 40 });

  const specular = useMotionTemplate`radial-gradient(
    circle at ${smx}px ${smy}px,
    rgba(255, 255, 255, 0.12) 0%,
    rgba(255, 255, 255, 0.03) 40%,
    transparent 70%
  )`;

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    ry.set(px * 10);
    rx.set(-py * 10);
    mx.set(e.clientX - rect.left);
    my.set(e.clientY - rect.top);
  };

  const handleMouseLeave = () => {
    rx.set(0);
    ry.set(0);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (status !== "idle" || !formRef.current) return;
    
    setStatus("sending");

    const SERVICE_ID = "service_ousfors";
    const TEMPLATE_ID = "template_tmer4oj";
    const PUBLIC_KEY = "-1KEN2Q02sL_6GNPO";

    emailjs
      .sendForm(SERVICE_ID, TEMPLATE_ID, formRef.current, {
        publicKey: PUBLIC_KEY,
      })
      .then(
        () => {
          setStatus("success");
          if (formRef.current) formRef.current.reset();
          setTimeout(() => setStatus("idle"), 4000);
        },
        (error) => {
          console.error("FAILED...", error.text);
          setStatus("error");
          setTimeout(() => setStatus("idle"), 4000);
        }
      );
  };

  const handleCopy = (e: React.MouseEvent, text: string) => {
    e.preventDefault();
    e.stopPropagation();
    navigator.clipboard.writeText(text);
    setCopied(text);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <section
      id="contact"
      className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[var(--background)] px-4 py-24"
    >
      <div className="absolute top-1/2 left-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-600/10 blur-[120px] pointer-events-none" />
      <div className="absolute top-1/3 left-1/3 h-[400px] w-[400px] rounded-full bg-indigo-500/10 blur-[100px] pointer-events-none" />

      <motion.div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{ rotateX: srx, rotateY: sry, transformStyle: "preserve-3d" }}
        className="relative w-full max-w-3xl overflow-hidden rounded-[2.5rem] border border-white/10 bg-slate-900/40 p-6 sm:p-10 md:p-14 shadow-[0_0_80px_rgba(0,0,0,0.6)] backdrop-blur-2xl"
      >
        <motion.div
          className="pointer-events-none absolute inset-0 z-0 mix-blend-overlay"
          style={{ background: specular }}
        />
        <div className="pointer-events-none absolute inset-[1px] rounded-[2.5rem] border border-white/5" />

        <div className="relative z-10">
          <div className="mb-10 text-center md:text-left">
            <motion.h2
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-3xl font-bold tracking-tight text-white mb-2 sm:text-4xl"
            >
              Let's Connect.
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-sm text-slate-400"
            >
              Have a project in mind, or just want to say hi? Drop a message below.
            </motion.p>
          </div>

          <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div className="relative group">
                <input
                  type="text"
                  name="name"
                  required
                  className="peer w-full border-b border-white/15 bg-transparent px-0 py-3 text-sm text-white placeholder-transparent focus:border-blue-400 focus:outline-none transition-colors"
                  placeholder="Name"
                />
                <label className="absolute left-0 top-3 text-sm text-slate-500 transition-all duration-300 peer-focus:-top-4 peer-focus:text-[10px] peer-focus:uppercase peer-focus:tracking-wider peer-focus:text-blue-400 peer-valid:-top-4 peer-valid:text-[10px] peer-valid:uppercase peer-valid:tracking-wider">
                  Your Name
                </label>
              </div>
              <div className="relative group">
                <input
                  type="email"
                  name="email"
                  required
                  className="peer w-full border-b border-white/15 bg-transparent px-0 py-3 text-sm text-white placeholder-transparent focus:border-blue-400 focus:outline-none transition-colors"
                  placeholder="Email"
                />
                <label className="absolute left-0 top-3 text-sm text-slate-500 transition-all duration-300 peer-focus:-top-4 peer-focus:text-[10px] peer-focus:uppercase peer-focus:tracking-wider peer-focus:text-blue-400 peer-valid:-top-4 peer-valid:text-[10px] peer-valid:uppercase peer-valid:tracking-wider">
                  Email Address
                </label>
              </div>
            </div>

            <div className="relative group pt-2">
              <textarea
                required
                name="message"
                rows={4}
                className="peer w-full border-b border-white/15 bg-transparent px-0 py-3 text-sm text-white placeholder-transparent focus:border-blue-400 focus:outline-none transition-colors resize-none"
                placeholder="Message"
              />
              <label className="absolute left-0 top-5 text-sm text-slate-500 transition-all duration-300 peer-focus:-top-1 peer-focus:text-[10px] peer-focus:uppercase peer-focus:tracking-wider peer-focus:text-blue-400 peer-valid:-top-1 peer-valid:text-[10px] peer-valid:uppercase peer-valid:tracking-wider">
                Your Message
              </label>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="submit"
                disabled={status !== "idle"}
                className="group relative flex h-12 w-full sm:w-44 items-center justify-center overflow-hidden rounded-full bg-white text-black text-sm font-semibold transition-transform active:scale-95 disabled:opacity-80"
              >
                {status === "idle" && (
                  <span className="flex items-center gap-2">
                    Send Message <Send className="h-4 w-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                  </span>
                )}
                {status === "sending" && (
                  <span className="flex items-center gap-2">
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-black border-t-transparent" />
                    Sending...
                  </span>
                )}
                {status === "success" && (
                  <motion.span
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="flex items-center gap-2 text-green-600"
                  >
                    Sent <CheckCircle2 className="h-4 w-4" />
                  </motion.span>
                )}
                {status === "error" && (
                  <motion.span
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="flex items-center gap-2 text-red-600"
                  >
                    Failed <AlertCircle className="h-4 w-4" />
                  </motion.span>
                )}
                
                <div className="absolute inset-0 z-[-1] bg-gradient-to-r from-blue-100 via-white to-blue-100 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
              </button>
            </div>
          </form>

          <div className="relative my-10 flex items-center justify-center">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/10" />
            </div>
            <span className="relative bg-[#0f172a] px-4 text-[10px] font-mono uppercase tracking-[0.2em] text-slate-500">
              Or connect via
            </span>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {CONTACT_LINKS.map((item) => (
              <motion.a
                key={item.label}
                href={item.href || "#"}
                target={item.href?.startsWith("http") ? "_blank" : undefined}
                rel={item.href?.startsWith("http") ? "noreferrer" : undefined}
                onClick={(e) => {
                  if (!item.href) e.preventDefault();
                }}
                whileHover={item.href ? { scale: 1.02, y: -2 } : {}}
                whileTap={item.href ? { scale: 0.98 } : {}}
                className={cn(
                  "group relative flex min-w-0 items-center justify-between gap-3 overflow-hidden rounded-xl border border-white/5 bg-white/[0.02] p-4 transition-colors hover:bg-white/[0.05]",
                  !item.href && "cursor-default"
                )}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/0 via-blue-500/5 to-blue-500/0 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                
                {/* FIXED: Added min-w-0 to the flex container so truncate works */}
                <div className="relative z-10 flex min-w-0 items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-slate-300 transition-colors group-hover:border-blue-500/30 group-hover:text-blue-400">
                    <item.icon className="h-4 w-4" />
                  </div>
                  <div className="flex min-w-0 flex-col">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500">
                      {item.label}
                    </span>
                    <span className="truncate text-sm font-medium text-slate-200">
                      {item.value}
                    </span>
                  </div>
                </div>

                {/* FIXED: Added shrink-0 to keep the button from squishing */}
                <div className="relative z-10 flex shrink-0">
                  {item.copyable ? (
                    <button
                      onClick={(e) => handleCopy(e, item.value)}
                      className="flex h-8 w-8 items-center justify-center rounded-md hover:bg-white/10 text-slate-500 hover:text-white transition-colors"
                      aria-label="Copy to clipboard"
                    >
                      {copied === item.value ? (
                        <Check className="h-3.5 w-3.5 text-green-400" />
                      ) : (
                        <Copy className="h-3.5 w-3.5" />
                      )}
                    </button>
                  ) : item.href ? (
                    <ExternalLink className="h-3.5 w-3.5 text-slate-600 transition-colors group-hover:text-slate-400" />
                  ) : null}
                </div>
              </motion.a>
            ))}
          </div>
        </div>
      </motion.div>
    </section>
  );
}