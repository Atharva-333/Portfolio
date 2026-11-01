import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Terminal, Cpu, Shield, Zap } from "lucide-react";
import { skillCategories } from "@/data/portfolio";
import { cn } from "@/lib/cn";

type LineType = "input" | "output" | "error" | "system";
type HistoryLine = { type: LineType; text: string };

const BOOT_SEQUENCE = [
  "[ OK ] Waking up the machine. It wasn't expecting visitors.",
  "[ OK ] Negotiating with CPU. Salary expectations unreasonable.",
  "[ OK ] Allocating memory. Emotional stability not included.",
  "[ OK ] System ready. Type 'help' to view available commands.",
  "[ OK ] Loading intelligence modules. Common sense optional.",
  "[ OK ] Checking system integrity. Developer detected as vulnerability.",
  "[ OK ] Establishing secure connection. Trust issues resolved.",
  "[ OK ] Searching for purpose. 37 unfinished projects found.",
  "[ OK ] Initializing terminal personality...",
  "[ OK ] Pretending everything is under control.",
  "Welcome, human.",
  "Try not to make this complicated.",
];

export default function Skills() {
  const [history, setHistory] = useState<HistoryLine[]>([]);
  const [input, setInput] = useState("");
  const [isBooting, setIsBooting] = useState(true);
  const [activePanel, setActivePanel] = useState<string | null>(null);

  const [romanticMode, setRomanticMode] = useState(false);
  const loveModeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const sectionRef = useRef<HTMLElement>(null);
  const endRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const cmdHistory = useRef<string[]>([]);
  const cmdIndex = useRef<number>(-1);

  const hasBooted = useRef(false);

  useEffect(() => {
    return () => {
      if (loveModeTimer.current) clearTimeout(loveModeTimer.current);
    };
  }, []);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    let scrollTimeout: ReturnType<typeof setTimeout>;
    let bootTimeout: ReturnType<typeof setTimeout>;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !hasBooted.current) {
          clearTimeout(scrollTimeout);
          clearTimeout(bootTimeout);

          scrollTimeout = setTimeout(() => {
            hasBooted.current = true;

            let currentLine = 0;
            const boot = () => {
              if (currentLine < BOOT_SEQUENCE.length) {
                setHistory((prev) => [
                  ...prev,
                  { type: "system", text: BOOT_SEQUENCE[currentLine] },
                ]);
                currentLine++;
                bootTimeout = setTimeout(boot, 400 + Math.random() * 400);
              } else {
                setIsBooting(false);
              }
            };
            boot();
          }, 1900);
        } else if (!entries[0].isIntersecting && !hasBooted.current) {
          clearTimeout(scrollTimeout);
        }
      },
      { threshold: 0.2 },
    );

    observer.observe(section);
    return () => {
      observer.disconnect();
      clearTimeout(scrollTimeout);
      clearTimeout(bootTimeout);
    };
  }, []);

  useEffect(() => {
    if (hasBooted.current && history.length > 0) {
      endRef.current?.scrollIntoView({ block: "nearest", behavior: "smooth" });
    }
  }, [history]);

  const activateLoveMode = () => {
    setRomanticMode(true);
    if (loveModeTimer.current) clearTimeout(loveModeTimer.current);
    loveModeTimer.current = setTimeout(() => {
      setRomanticMode(false);
      loveModeTimer.current = null;
    }, 5000);
  };

  const executeCommand = () => {
    if (!input.trim() || isBooting) return;

    const cmd = input.toLowerCase().trim();
    const newHistory: HistoryLine[] = [
      ...history,
      { type: "input", text: `➜ ~ ${input}` },
    ];

    if (cmd !== "clear") {
      cmdHistory.current.push(cmd);
      cmdIndex.current = cmdHistory.current.length;
    }

    if (cmd === "clear") {
      setHistory([]);
      setActivePanel(null);
      setInput("");
      return;
    }

    if (cmd === "love") {
      activateLoveMode();
      setActivePanel(null);
      newHistory.push({
        type: "output",
        text:
          "Searching for love...\n" +
          "Scanning databases...\n" +
          "Error 404: Love not found.\n" +
          "Retrying with emotional intelligence...\n" +
          "One moment. This might take a while.\n\n" +
          "          LOVE.EXE\n\n" +
          "Not everything needs an algorithm,\n" +
          "Not every feeling needs a name.\n" +
          "Some things arrive without warning,\n" +
          "And nothing ever feels quite the same.\n\n" +
          "System note: Some processes cannot be explained.",
      });
    } else if (cmd === "sayali") {
      activateLoveMode();
      setActivePanel(null);
      newHistory.push({
        type: "output",
        text:
          "Accessing restricted directory...\n" +
          "Identity detected: SAYALI\n" +
          "Loading classified memories...\n" +
          "Warning: Emotional firewall disabled.\n" +
          "Proceeding anyway...\n\n" +
          "          DEAR SAYALI\n\n" +
          "If the stars could store a memory,\n" +
          "I'd save the moments that made me smile.\n" +
          "If time could pause for just one reason,\n" +
          "I'd let it stay a little while.\n\n" +
          "Some names are just names to the world,\n" +
          "But somehow, one can mean a little more.\n\n" +
          "[END OF FILE]\n\n" +
          "Ahem. You didn't see that.",
      });
    } else if (cmd === "heart") {
      setActivePanel(null);
      newHistory.push({
        type: "output",
        text:
          "WARNING: Emotional vulnerability detected.\n" +
          "Heart.exe is running without adequate protection.\n" +
          "Recommendation: Proceed with caution.",
      });
    } else if (cmd === "breakup") {
      setActivePanel(null);
      newHistory.push({
        type: "output",
        text:
          "Initiating breakup protocol...\n" +
          "Disconnecting emotional dependencies...\n" +
          "Deleting shared memories... FAILED.\n" +
          "Retrying... FAILED.\n\n" +
          "ERROR  heartbreak.sys\n" +
          "Some things cannot be deleted permanently.\n\n" +
          "System recommendation: Restart your life.\n" +
          "Warning: This operation cannot be undone.",
      });
    } else if (cmd === "help") {
      newHistory.push({
        type: "output",
        text: "Available commands:\n  skills    - List all skill categories\n  frontend  - View frontend stack\n  backend   - View backend stack\n  ai        - View AI/ML stack\n  tools     - View dev tools\n  whoami    - About the developer\n  clear     - Clear terminal",
      });
      setActivePanel(null);
    } else if (cmd === "skills") {
      newHistory.push({
        type: "output",
        text: "Categories: Frontend, Backend, AI & Computer Vision, Tools",
      });
      setActivePanel("all");
    } else if (cmd === "whoami") {
      newHistory.push({
        type: "output",
        text: "Atharva Lohar - Software Developer & Technology Explorer. Building scalable systems and exploring the limits of the web.",
      });
      setActivePanel(null);
    } else if (cmd === "sudo") {
      newHistory.push({
        type: "error",
        text: "User is not in the sudoers file. This incident will be reported.",
      });
      setActivePanel(null);
    } else {
      const matchedCategory = skillCategories.find(
        (c) =>
          c.title.toLowerCase().includes(cmd) ||
          (cmd === "ai" && c.title.includes("AI")),
      );

      if (matchedCategory) {
        newHistory.push({
          type: "output",
          text:
            `[DATA FETCHED] ${matchedCategory.title} technologies:\n` +
            matchedCategory.skills.map((s) => `  - ${s}`).join("\n"),
        });
        setActivePanel(matchedCategory.title);
      } else {
        newHistory.push({
          type: "error",
          text: `bash: command not found: ${cmd}`,
        });
        setActivePanel(null);
      }
    }

    setHistory(newHistory);
    setInput("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowUp") {
      e.preventDefault();
      if (cmdIndex.current > 0) {
        cmdIndex.current--;
        setInput(cmdHistory.current[cmdIndex.current]);
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (cmdIndex.current < cmdHistory.current.length - 1) {
        cmdIndex.current++;
        setInput(cmdHistory.current[cmdIndex.current]);
      } else {
        cmdIndex.current = cmdHistory.current.length;
        setInput("");
      }
    } else if (e.key === "Enter") {
      e.preventDefault();
      executeCommand();
    }
  };

  const panelData = skillCategories.find((c) => c.title === activePanel);

  return (
    <section
      ref={sectionRef}
      id="skills"
      className="relative py-24 scroll-mt-20 overflow-hidden bg-[var(--background)]"
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 relative z-10">
        <div className="mb-12">
          <div className="mb-3 flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.3em] text-slate-500">
            <span className="h-px w-8 bg-slate-700" />
            Yes, you can actually talk to this terminal. No, it won't fix your
            bugs.
          </div>
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
            The Arsenal.
          </h2>
          <div className="mt-4 flex justify-start">
            <div className="h-1 w-16 rounded-full bg-blue-500" />
          </div>
          <p className="mt-3 text-sm leading-6 text-slate-400">
            A little terminal, a lot of technologies. Explore the tools,
            languages, and frameworks I use to turn ideas into working systems.
            Try not to break anything — it's technically a portfolio, not a
            production server.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-6 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-7 xl:col-span-8 flex flex-col overflow-hidden rounded-xl border border-slate-700/80 bg-[#0a0f1c] shadow-2xl shadow-blue-500/5">
            <div className="flex items-center justify-between border-b border-slate-800 bg-slate-900/50 px-4 py-3 sm:px-6">
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-red-500/80" />
                <div className="h-3 w-3 rounded-full bg-yellow-500/80" />
                <div className="h-3 w-3 rounded-full bg-green-500/80" />
              </div>

              {/* HIDDEN ON SMALL SCREENS */}
              <div className="hidden sm:flex items-center gap-2 font-mono text-xs text-slate-400">
                <Terminal className="h-3.5 w-3.5" />
                <span>root@atharva:~/portfolio</span>
              </div>

              <div className="w-12" />
            </div>

            <div
              className="relative flex-1 p-4 sm:p-6 font-mono text-sm overflow-y-auto min-h-[400px] max-h-[500px]"
              onClick={() => inputRef.current?.focus()}
            >
              <div className="pointer-events-none absolute inset-0 z-20 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.15)_50%)] bg-[length:100%_4px] opacity-30" />

              <div className="relative z-10 space-y-1.5 pb-4">
                {history.map((line, i) => (
                  <div
                    key={i}
                    className={cn(
                      "whitespace-pre-wrap break-words",
                      line.type === "input"
                        ? "text-slate-200 mt-3"
                        : line.type === "error"
                          ? "text-red-400"
                          : line.type === "system"
                            ? "text-blue-400"
                            : "text-slate-400",
                    )}
                  >
                    {line.text}
                  </div>
                ))}

                {!isBooting && hasBooted.current && (
                  <div className="flex items-center text-slate-200 mt-2">
                    <span className="mr-2 text-green-400">➜</span>
                    <span className="mr-3 text-blue-400">~</span>
                    <input
                      ref={inputRef}
                      type="text"
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyDown={handleKeyDown}
                      className="flex-1 bg-transparent outline-none caret-blue-400 placeholder:text-slate-600"
                      autoFocus
                      spellCheck={false}
                      autoComplete="off"
                      placeholder="type 'help'..."
                    />
                  </div>
                )}
                <div ref={endRef} />
              </div>
            </div>

            <div className="border-t border-slate-800 bg-slate-900/30 px-4 py-2 font-mono text-[10px] text-slate-500 flex justify-between">
              <span>UTF-8</span>
              <span>bash — 80x24</span>
            </div>
          </div>

          <div
            className={cn(
              "lg:col-span-5 xl:col-span-4 hidden lg:flex flex-col rounded-xl border p-6 backdrop-blur-sm relative overflow-hidden transition-all duration-700",
              romanticMode
                ? "border-pink-300/60 bg-gradient-to-br from-pink-950 via-rose-950 to-purple-950 shadow-[0_0_45px_rgba(236,72,153,0.25)]"
                : "border-slate-800 bg-slate-900/40",
            )}
          >
            <div
              className={cn(
                "absolute top-0 right-0 p-4 font-mono text-[9px] pointer-events-none transition-colors duration-500",
                romanticMode ? "text-pink-300/70" : "text-slate-600",
              )}
            >
              {romanticMode ? (
                <>
                  LOVE: ONLINE
                  <br />
                  HEART: UNPROTECTED
                </>
              ) : (
                <>
                  SYS: ONLINE
                  <br />
                  MEM: 98%
                </>
              )}
            </div>

            <h3
              className={cn(
                "mb-6 font-mono text-sm uppercase tracking-[0.2em] transition-colors duration-500",
                romanticMode ? "text-pink-200" : "text-slate-500",
              )}
            >
              {romanticMode ? "♥ Emotional Visualizer ♥" : "Data Visualizer"}
            </h3>

            <div className="flex-1 flex flex-col justify-center relative">
              <AnimatePresence mode="wait">
                {romanticMode ? (
                  <motion.div
                    key="love-mode"
                    initial={{ opacity: 0, scale: 0.75, rotateY: -25 }}
                    animate={{ opacity: 1, scale: 1, rotateY: 0 }}
                    exit={{ opacity: 0, scale: 1.15, rotateY: 25 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="relative flex min-h-[330px] items-center justify-center overflow-hidden rounded-xl"
                    style={{ perspective: "1000px" }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-pink-500/10 via-rose-400/5 to-purple-500/20" />

                    {Array.from({ length: 14 }).map((_, i) => (
                      <motion.div
                        key={i}
                        initial={{
                          opacity: 0,
                          y: 80,
                          scale: 0.4,
                          rotateX: 0,
                          rotateY: 0,
                        }}
                        animate={{
                          opacity: [0.2, 0.9, 0.2],
                          y: [-30, -180 - (i % 4) * 30],
                          x: [0, (i % 2 === 0 ? 1 : -1) * (20 + i * 3)],
                          scale: [0.5, 1, 0.7],
                          rotateY: [0, 180, 360],
                          rotateZ: [0, 20, -20, 0],
                        }}
                        transition={{
                          duration: 3 + (i % 4),
                          repeat: Infinity,
                          delay: i * 0.15,
                          ease: "easeInOut",
                        }}
                        className="absolute text-pink-300"
                        style={{
                          left: `${8 + ((i * 17) % 85)}%`,
                          top: `${35 + ((i * 13) % 60)}%`,
                          fontSize: `${14 + (i % 4) * 8}px`,
                          textShadow: "0 0 15px rgba(244,114,182,0.9)",
                          transformStyle: "preserve-3d",
                        }}
                      >
                        ♥
                      </motion.div>
                    ))}

                    <motion.div
                      animate={{
                        scale: [1, 1.12, 1],
                        rotateY: [0, 15, -15, 0],
                        rotateX: [0, -8, 8, 0],
                      }}
                      transition={{
                        duration: 2.5,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                      className="relative z-10 flex flex-col items-center"
                      style={{ transformStyle: "preserve-3d" }}
                    >
                      <div className="absolute h-36 w-36 rounded-full bg-pink-500/30 blur-3xl" />

                      <div
                        className="relative text-8xl font-bold text-pink-300"
                        style={{
                          textShadow:
                            "0 0 10px #f9a8d4, 0 0 30px #ec4899, 0 0 65px #db2777",
                          transform: "translateZ(50px)",
                        }}
                      >
                        ♥
                      </div>

                      <motion.p
                        animate={{ opacity: [0.6, 1, 0.6] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="mt-5 font-mono text-xs uppercase tracking-[0.35em] text-pink-200"
                      >
                        Love.exe activated
                      </motion.p>

                      <p className="mt-2 font-mono text-[10px] text-pink-300/60">
                        EMOTIONAL FIREWALL: DISABLED
                      </p>
                    </motion.div>

                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{
                        duration: 15,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                      className="pointer-events-none absolute h-64 w-64 rounded-full border border-pink-300/20"
                    />

                    <motion.div
                      animate={{ rotate: -360 }}
                      transition={{
                        duration: 20,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                      className="pointer-events-none absolute h-80 w-80 rounded-full border border-rose-300/10"
                    />
                  </motion.div>
                ) : (
                  <>
                    {!activePanel ? (
                      <motion.div
                        key="idle"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0 }}
                        className="flex flex-col items-center justify-center text-center"
                      >
                        <div className="relative flex h-24 w-24 items-center justify-center rounded-full border border-slate-700/50 bg-slate-800/30">
                          <div className="absolute inset-0 animate-ping rounded-full border border-slate-600 opacity-20" />
                          <Cpu className="h-8 w-8 text-slate-500" />
                        </div>
                        <p className="mt-4 font-mono text-xs text-slate-500">
                          Awaiting command...
                          <br />
                          <span className="text-blue-500/50">
                            Execute query to visualize data.
                          </span>
                        </p>
                      </motion.div>
                    ) : activePanel === "all" ? (
                      <motion.div
                        key="all"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className="space-y-4"
                      >
                        {skillCategories.map((cat) => (
                          <div
                            key={cat.title}
                            className="rounded-lg border border-slate-700/50 bg-slate-800/20 p-3"
                          >
                            <div className="mb-2 flex items-center gap-2 font-mono text-[10px] uppercase tracking-wider text-blue-400">
                              <Shield className="h-3 w-3" /> {cat.title}
                            </div>
                            <div className="flex flex-wrap gap-1.5">
                              {cat.skills.map((s) => (
                                <span
                                  key={s}
                                  className="rounded bg-slate-700/50 px-2 py-1 text-[10px] font-mono text-slate-300"
                                >
                                  {s}
                                </span>
                              ))}
                            </div>
                          </div>
                        ))}
                      </motion.div>
                    ) : (
                      <motion.div
                        key={activePanel}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="flex flex-col"
                      >
                        <div className="mb-6 flex items-center gap-3 border-b border-slate-800 pb-4">
                          <div className="flex h-10 w-10 items-center justify-center rounded border border-blue-500/30 bg-blue-500/10">
                            <Zap className="h-5 w-5 text-blue-400" />
                          </div>
                          <div>
                            <div className="font-mono text-[10px] text-slate-500 uppercase tracking-widest">
                              Module Loaded
                            </div>
                            <div className="text-lg font-semibold text-slate-100">
                              {panelData?.title}
                            </div>
                          </div>
                        </div>

                        <div className="space-y-3">
                          {panelData?.skills.map((skill, i) => (
                            <motion.div
                              key={skill}
                              initial={{ opacity: 0, x: 10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: i * 0.1 }}
                              className="flex items-center justify-between rounded border border-slate-700/40 bg-slate-800/40 px-3 py-2"
                            >
                              <span className="font-mono text-sm text-slate-300">
                                {skill}
                              </span>
                              <span className="h-1.5 w-1.5 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.8)]" />
                            </motion.div>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </>
                )}
              </AnimatePresence>
            </div>

            <div className="mt-6 border-t border-slate-800 pt-4 flex gap-2">
              <div className="h-1 flex-1 rounded-full bg-slate-800 overflow-hidden">
                <div className="h-full w-2/3 bg-blue-500/50" />
              </div>
              <div className="h-1 flex-1 rounded-full bg-slate-800 overflow-hidden">
                <div className="h-full w-1/3 bg-indigo-500/50" />
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 flex flex-wrap gap-2 lg:hidden">
          <span className="text-xs font-mono text-slate-500 flex items-center mr-2">
            Quick Query:
          </span>
          {["frontend", "backend", "ai", "tools"].map((cmd) => (
            <button
              key={cmd}
              onClick={() => {
                setInput(cmd);
                setTimeout(() => {
                  const currentInput = cmd;
                  const newHistory: HistoryLine[] = [
                    ...history,
                    { type: "input", text: `➜ ~ ${currentInput}` },
                  ];
                  const matchedCategory = skillCategories.find(
                    (c) =>
                      c.title.toLowerCase().includes(currentInput) ||
                      (currentInput === "ai" && c.title.includes("AI")),
                  );
                  if (matchedCategory) {
                    newHistory.push({
                      type: "output",
                      text:
                        `[DATA FETCHED] ${matchedCategory.title} technologies:\n` +
                        matchedCategory.skills
                          .map((s) => `  - ${s}`)
                          .join("\n"),
                    });
                    setActivePanel(matchedCategory.title);
                  }
                  setHistory(newHistory);
                  setInput("");
                }, 10);
              }}
              className="rounded border border-slate-700 bg-slate-800 px-3 py-1 font-mono text-[10px] text-slate-300 hover:bg-slate-700 active:scale-95 transition-all"
            >
              ./{cmd}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
