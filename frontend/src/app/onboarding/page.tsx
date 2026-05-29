"use client";

import React, { useState, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Terminal,
  ArrowRight,
  ArrowLeft,
  Upload,
  Check,
  Sparkles,
  MapPin,
  Code2,
  Briefcase,
  Rocket,
  ChevronRight,
  X,
  Star,
  Zap,
} from "lucide-react";
import { useAuthStore } from "@/store/auth-store";
import { useToast } from "@/providers/toast-provider";
import Link from "next/link";

// ─── Data Definitions ──────────────────────────────────────────────────────
const PREFERRED_ROLES = [
  "Frontend Developer",
  "Backend Developer",
  "Full Stack Engineer",
  "DevOps / SRE",
  "Data Engineer",
  "ML / AI Engineer",
  "Product Manager",
  "Engineering Manager",
  "Mobile Developer",
  "Security Engineer",
  "Cloud Architect",
  "QA Engineer",
];

const EXPERIENCE_LEVELS = [
  {
    id: "intern",
    label: "Intern / Student",
    subtitle: "0–1 years",
    icon: "🎓",
    gradient: "from-blue-500/20 to-cyan-500/20",
    border: "border-blue-500/30",
  },
  {
    id: "junior",
    label: "Junior",
    subtitle: "1–3 years",
    icon: "🚀",
    gradient: "from-emerald-500/20 to-teal-500/20",
    border: "border-emerald-500/30",
  },
  {
    id: "mid",
    label: "Mid-Level",
    subtitle: "3–6 years",
    icon: "⚡",
    gradient: "from-violet-500/20 to-purple-500/20",
    border: "border-violet-500/30",
  },
  {
    id: "senior",
    label: "Senior",
    subtitle: "6–10 years",
    icon: "🔥",
    gradient: "from-orange-500/20 to-amber-500/20",
    border: "border-orange-500/30",
  },
  {
    id: "staff",
    label: "Staff / Principal",
    subtitle: "10+ years",
    icon: "👑",
    gradient: "from-pink-500/20 to-rose-500/20",
    border: "border-pink-500/30",
  },
  {
    id: "executive",
    label: "Director / VP / CTO",
    subtitle: "Executive track",
    icon: "🌐",
    gradient: "from-yellow-500/20 to-amber-500/20",
    border: "border-yellow-500/30",
  },
];

const LOCATIONS = [
  "Remote",
  "San Francisco, CA",
  "New York, NY",
  "Seattle, WA",
  "Austin, TX",
  "Boston, MA",
  "Chicago, IL",
  "Los Angeles, CA",
  "London, UK",
  "Berlin, Germany",
  "Toronto, Canada",
  "Singapore",
  "Bangalore, India",
  "Amsterdam, NL",
];

const SKILLS = [
  "React",
  "TypeScript",
  "Node.js",
  "Python",
  "Go",
  "Rust",
  "AWS",
  "GCP",
  "Docker",
  "Kubernetes",
  "GraphQL",
  "PostgreSQL",
  "MongoDB",
  "Redis",
  "TensorFlow",
  "PyTorch",
  "Next.js",
  "Tailwind CSS",
  "Kafka",
  "Terraform",
  "CI/CD",
  "System Design",
];

// ─── Step Config ────────────────────────────────────────────────────────────
const STEPS = [
  { id: 1, label: "Welcome", icon: Sparkles },
  { id: 2, label: "Resume", icon: Upload },
  { id: 3, label: "Roles", icon: Briefcase },
  { id: 4, label: "Level", icon: Star },
  { id: 5, label: "Location", icon: MapPin },
  { id: 6, label: "Skills", icon: Code2 },
  { id: 7, label: "Launch", icon: Rocket },
];

// ─── Animation Variants ─────────────────────────────────────────────────────
const slideVariants = {
  enter: (dir: number) => ({
    x: dir > 0 ? 80 : -80,
    opacity: 0,
    scale: 0.97,
  }),
  center: { x: 0, opacity: 1, scale: 1 },
  exit: (dir: number) => ({
    x: dir > 0 ? -80 : 80,
    opacity: 0,
    scale: 0.97,
  }),
};

// ─── Pill Toggle ────────────────────────────────────────────────────────────
function PillToggle({
  label,
  selected,
  onClick,
}: {
  label: string;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <motion.button
      onClick={onClick}
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all duration-200 cursor-pointer select-none ${
        selected
          ? "bg-gradient-to-r from-[#7C3AED] to-[#06B6D4] border-transparent text-white shadow-glow-primary"
          : "bg-white/[0.04] border-white/10 text-[#a0aec0] hover:border-white/25 hover:text-white"
      }`}
    >
      {selected && <Check className="inline h-3 w-3 mr-1 -mt-px" />}
      {label}
    </motion.button>
  );
}

// ─── Main Onboarding Page ───────────────────────────────────────────────────
export default function OnboardingPage() {
  const router = useRouter();
  const { user, completeOnboarding, isLoading } =
    useAuthStore();
  const { toast } = useToast();

  const [step, setStep] = useState(1);
  const [direction, setDirection] = useState(1);

  // Step data
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [selectedRoles, setSelectedRoles] = useState<string[]>([]);
  const [experienceLevel, setExperienceLevel] = useState("");
  const [selectedLocations, setSelectedLocations] = useState<string[]>([]);
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const goNext = () => {
    setDirection(1);
    setStep((s) => Math.min(s + 1, 7));
  };

  const goPrev = () => {
    setDirection(-1);
    setStep((s) => Math.max(s - 1, 1));
  };

  const toggleRole = (r: string) =>
    setSelectedRoles((prev) =>
      prev.includes(r) ? prev.filter((x) => x !== r) : [...prev, r]
    );

  const toggleLocation = (l: string) =>
    setSelectedLocations((prev) =>
      prev.includes(l) ? prev.filter((x) => x !== l) : [...prev, l]
    );

  const toggleSkill = (s: string) =>
    setSelectedSkills((prev) =>
      prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]
    );

  // Drag & Drop handlers
  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file && (file.type === "application/pdf" || file.name.endsWith(".pdf") || file.name.endsWith(".docx"))) {
      setResumeFile(file);
    } else {
      toast("Invalid File", "Please upload a PDF or DOCX file.", "error");
    }
  }, [toast]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setResumeFile(file);
  };

  // Validate step before proceeding
  const canProceed = () => {
    if (step === 3 && selectedRoles.length === 0) return false;
    if (step === 4 && !experienceLevel) return false;
    if (step === 5 && selectedLocations.length === 0) return false;
    if (step === 6 && selectedSkills.length < 2) return false;
    return true;
  };

  const handleFinish = async () => {
    setIsSubmitting(true);
    try {
      await completeOnboarding({
        preferred_roles: selectedRoles,
        experience_level: experienceLevel,
        locations: selectedLocations,
        skills: selectedSkills,
        headline: selectedRoles[0]
          ? `${experienceLevel.charAt(0).toUpperCase() + experienceLevel.slice(1)} ${selectedRoles[0]}`
          : undefined,
      });

      toast(
        "Copilot Activated! 🚀",
        "Your career telemetry is now live. Welcome to the cockpit.",
        "success"
      );

      goNext(); // go to step 7 completion screen
    } catch (err: any) {
      console.error(err);
      toast("Setup Failed", err.message || "Could not save preferences.", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const progressPct = ((step - 1) / 6) * 100;

  return (
    <div className="min-h-screen bg-[#050816] text-white relative overflow-hidden flex flex-col">
      {/* Background effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[500px] bg-gradient-to-b from-[#7C3AED]/8 via-transparent to-transparent rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-gradient-to-tl from-[#06B6D4]/6 to-transparent rounded-full blur-[100px]" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:60px_60px]" />
      </div>

      {/* Top bar */}
      <header className="relative z-10 flex items-center justify-between px-6 py-4 border-b border-white/[0.04]">
        <Link href="/" className="inline-flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded bg-gradient-to-tr from-[#7C3AED] to-[#06B6D4]">
            <Terminal className="h-3.5 w-3.5 text-white" />
          </div>
          <span className="font-bold text-sm tracking-tight">
            CareerCopilot<span className="text-[#06B6D4]">.AI</span>
          </span>
        </Link>

        <div className="flex items-center gap-3">
          <span className="text-[10px] text-[#a0aec0] uppercase tracking-wider font-mono">
            STEP {step} OF {STEPS.length}
          </span>
          {step < 7 && (
            <button
              onClick={() => router.push("/dashboard")}
              className="text-[10px] text-[#a0aec0] hover:text-white transition-colors underline underline-offset-2"
            >
              Skip for now
            </button>
          )}
        </div>
      </header>

      {/* Progress bar */}
      <div className="relative z-10 w-full h-[2px] bg-white/[0.04]">
        <motion.div
          className="h-full bg-gradient-to-r from-[#7C3AED] to-[#06B6D4]"
          animate={{ width: `${progressPct}%` }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        />
      </div>

      {/* Step pills */}
      <div className="relative z-10 flex items-center justify-center gap-2 pt-6 pb-2 px-4 flex-wrap">
        {STEPS.map((s) => {
          const Icon = s.icon;
          const isActive = step === s.id;
          const isDone = step > s.id;
          return (
            <motion.div
              key={s.id}
              animate={{ scale: isActive ? 1.05 : 1 }}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-semibold border transition-all duration-300 ${
                isDone
                  ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
                  : isActive
                  ? "bg-gradient-to-r from-[#7C3AED]/20 to-[#06B6D4]/20 border-[#7C3AED]/40 text-white"
                  : "bg-white/[0.03] border-white/[0.06] text-[#4a5568]"
              }`}
            >
              {isDone ? (
                <Check className="h-3 w-3" />
              ) : (
                <Icon className="h-3 w-3" />
              )}
              <span className="hidden sm:block">{s.label}</span>
            </motion.div>
          );
        })}
      </div>

      {/* Main content area */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-4 py-8">
        <div className="w-full max-w-2xl">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={step}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.35, ease: [0.25, 0.1, 0.25, 1] }}
            >
              {/* ── STEP 1: Welcome ──────────────────────────────── */}
              {step === 1 && (
                <div className="text-center space-y-8">
                  <div className="space-y-4">
                    <motion.div
                      initial={{ scale: 0, rotate: -10 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
                      className="mx-auto w-20 h-20 rounded-2xl bg-gradient-to-tr from-[#7C3AED] to-[#06B6D4] flex items-center justify-center shadow-[0_0_60px_rgba(124,58,237,0.4)]"
                    >
                      <Sparkles className="h-10 w-10 text-white" />
                    </motion.div>
                    <div>
                      <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight leading-tight">
                        Welcome aboard,{" "}
                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#7C3AED] to-[#06B6D4]">
                          {user?.name?.split(" ")[0] || "Copilot"}
                        </span>{" "}
                        👋
                      </h1>
                      <p className="mt-3 text-[#a0aec0] text-sm leading-relaxed max-w-md mx-auto">
                        Let's configure your AI career engine in under 2 minutes. We'll personalize everything — from job matches to interview prep — for your unique path.
                      </p>
                    </div>
                  </div>

                  {/* Feature highlights */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-left">
                    {[
                      {
                        icon: "🎯",
                        title: "Precision Matching",
                        desc: "AI finds roles aligned to your exact skills",
                      },
                      {
                        icon: "🤖",
                        title: "Interview Coach",
                        desc: "Live AI coaching tailored to your target companies",
                      },
                      {
                        icon: "📈",
                        title: "Career Analytics",
                        desc: "Real-time resume score and market intelligence",
                      },
                    ].map((f) => (
                      <div
                        key={f.title}
                        className="p-4 rounded-xl bg-white/[0.03] border border-white/[0.06] space-y-2"
                      >
                        <div className="text-2xl">{f.icon}</div>
                        <div className="text-xs font-bold text-white">{f.title}</div>
                        <div className="text-[11px] text-[#a0aec0] leading-relaxed">{f.desc}</div>
                      </div>
                    ))}
                  </div>

                  <button
                    onClick={goNext}
                    className="group inline-flex items-center gap-2 px-8 py-3 rounded-xl bg-gradient-to-r from-[#7C3AED] to-[#06B6D4] text-white font-semibold text-sm hover:opacity-90 transition-all shadow-[0_0_30px_rgba(124,58,237,0.3)]"
                  >
                    <Zap className="h-4 w-4" />
                    Begin Setup
                    <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
                  </button>
                </div>
              )}

              {/* ── STEP 2: Resume Upload ─────────────────────────── */}
              {step === 2 && (
                <div className="space-y-6">
                  <div className="text-center space-y-2">
                    <h2 className="text-2xl font-extrabold tracking-tight">Upload Your Resume</h2>
                    <p className="text-[#a0aec0] text-sm">
                      Our AI will analyze your resume to supercharge your match scores.
                    </p>
                  </div>

                  {/* Drop zone */}
                  <div
                    onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                    onDragLeave={() => setIsDragging(false)}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                    className={`relative cursor-pointer rounded-2xl border-2 border-dashed p-12 flex flex-col items-center justify-center gap-4 transition-all duration-300 ${
                      isDragging
                        ? "border-[#7C3AED]/70 bg-[#7C3AED]/10"
                        : resumeFile
                        ? "border-emerald-500/50 bg-emerald-500/5"
                        : "border-white/10 bg-white/[0.02] hover:border-white/20 hover:bg-white/[0.04]"
                    }`}
                  >
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".pdf,.docx"
                      className="hidden"
                      onChange={handleFileChange}
                    />

                    {resumeFile ? (
                      <>
                        <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center">
                          <Check className="h-8 w-8 text-emerald-400" />
                        </div>
                        <div className="text-center">
                          <p className="text-sm font-semibold text-white">{resumeFile.name}</p>
                          <p className="text-[11px] text-[#a0aec0] mt-1">
                            {(resumeFile.size / 1024).toFixed(1)} KB · Ready to analyze
                          </p>
                        </div>
                        <button
                          onClick={(e) => { e.stopPropagation(); setResumeFile(null); }}
                          className="text-[10px] text-red-400 hover:text-red-300 flex items-center gap-1"
                        >
                          <X className="h-3 w-3" /> Remove file
                        </button>
                      </>
                    ) : (
                      <>
                        <div className="w-16 h-16 rounded-2xl bg-[#7C3AED]/10 border border-[#7C3AED]/20 flex items-center justify-center">
                          <Upload className="h-8 w-8 text-[#7C3AED]" />
                        </div>
                        <div className="text-center">
                          <p className="text-sm font-semibold text-white">
                            Drop your resume here
                          </p>
                          <p className="text-[11px] text-[#a0aec0] mt-1">
                            PDF or DOCX · Max 10MB
                          </p>
                        </div>
                        <span className="px-4 py-1.5 rounded-lg bg-white/[0.06] border border-white/10 text-[11px] text-[#a0aec0]">
                          Browse files
                        </span>
                      </>
                    )}
                  </div>

                  <p className="text-center text-[11px] text-[#4a5568]">
                    Resume upload is optional — you can skip and add it later from your dashboard.
                  </p>
                </div>
              )}

              {/* ── STEP 3: Preferred Roles ───────────────────────── */}
              {step === 3 && (
                <div className="space-y-6">
                  <div className="text-center space-y-2">
                    <h2 className="text-2xl font-extrabold tracking-tight">What roles excite you?</h2>
                    <p className="text-[#a0aec0] text-sm">
                      Pick up to 4 roles. Your AI will prioritize matching opportunities.
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-2 justify-center">
                    {PREFERRED_ROLES.map((role) => (
                      <PillToggle
                        key={role}
                        label={role}
                        selected={selectedRoles.includes(role)}
                        onClick={() => {
                          if (selectedRoles.includes(role)) toggleRole(role);
                          else if (selectedRoles.length < 4) toggleRole(role);
                          else toast("Limit Reached", "Select up to 4 roles.", "info");
                        }}
                      />
                    ))}
                  </div>

                  {selectedRoles.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-3 rounded-xl bg-[#7C3AED]/10 border border-[#7C3AED]/20 text-center"
                    >
                      <p className="text-xs text-[#a0aec0]">
                        Selected:{" "}
                        <span className="text-white font-semibold">
                          {selectedRoles.join(", ")}
                        </span>
                      </p>
                    </motion.div>
                  )}
                </div>
              )}

              {/* ── STEP 4: Experience Level ──────────────────────── */}
              {step === 4 && (
                <div className="space-y-6">
                  <div className="text-center space-y-2">
                    <h2 className="text-2xl font-extrabold tracking-tight">Your experience level?</h2>
                    <p className="text-[#a0aec0] text-sm">
                      This shapes your personalized interview questions and job matches.
                    </p>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {EXPERIENCE_LEVELS.map((level) => (
                      <motion.button
                        key={level.id}
                        onClick={() => setExperienceLevel(level.id)}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className={`relative p-4 rounded-xl border text-left transition-all duration-200 ${
                          experienceLevel === level.id
                            ? `bg-gradient-to-br ${level.gradient} ${level.border} shadow-lg`
                            : "bg-white/[0.03] border-white/[0.06] hover:border-white/15"
                        }`}
                      >
                        {experienceLevel === level.id && (
                          <span className="absolute top-2 right-2 w-4 h-4 rounded-full bg-white/20 flex items-center justify-center">
                            <Check className="h-2.5 w-2.5 text-white" />
                          </span>
                        )}
                        <div className="text-2xl mb-2">{level.icon}</div>
                        <div className="text-xs font-bold text-white">{level.label}</div>
                        <div className="text-[10px] text-[#a0aec0] mt-0.5">{level.subtitle}</div>
                      </motion.button>
                    ))}
                  </div>
                </div>
              )}

              {/* ── STEP 5: Locations ─────────────────────────────── */}
              {step === 5 && (
                <div className="space-y-6">
                  <div className="text-center space-y-2">
                    <h2 className="text-2xl font-extrabold tracking-tight">Where do you want to work?</h2>
                    <p className="text-[#a0aec0] text-sm">
                      Pick up to 5 preferred locations — "Remote" is always an option.
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-2 justify-center">
                    {LOCATIONS.map((loc) => (
                      <PillToggle
                        key={loc}
                        label={loc}
                        selected={selectedLocations.includes(loc)}
                        onClick={() => {
                          if (selectedLocations.includes(loc)) toggleLocation(loc);
                          else if (selectedLocations.length < 5) toggleLocation(loc);
                          else toast("Limit Reached", "Select up to 5 locations.", "info");
                        }}
                      />
                    ))}
                  </div>

                  {selectedLocations.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex flex-wrap gap-1.5 justify-center"
                    >
                      {selectedLocations.map((loc) => (
                        <span
                          key={loc}
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#06B6D4]/10 border border-[#06B6D4]/25 text-[10px] text-[#06B6D4] font-semibold"
                        >
                          <MapPin className="h-2.5 w-2.5" />
                          {loc}
                          <button onClick={() => toggleLocation(loc)}>
                            <X className="h-2.5 w-2.5 ml-0.5 hover:text-white" />
                          </button>
                        </span>
                      ))}
                    </motion.div>
                  )}
                </div>
              )}

              {/* ── STEP 6: Skills ────────────────────────────────── */}
              {step === 6 && (
                <div className="space-y-6">
                  <div className="text-center space-y-2">
                    <h2 className="text-2xl font-extrabold tracking-tight">Your tech stack?</h2>
                    <p className="text-[#a0aec0] text-sm">
                      Select your primary skills (min 2). Powers your AI interview prep.
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-2 justify-center">
                    {SKILLS.map((skill) => (
                      <PillToggle
                        key={skill}
                        label={skill}
                        selected={selectedSkills.includes(skill)}
                        onClick={() => toggleSkill(skill)}
                      />
                    ))}
                  </div>

                  <div className="text-center">
                    <span className="text-[11px] text-[#a0aec0]">
                      {selectedSkills.length} skill{selectedSkills.length !== 1 ? "s" : ""} selected
                      {selectedSkills.length < 2 && " · select at least 2"}
                    </span>
                  </div>
                </div>
              )}

              {/* ── STEP 7: Launch! ───────────────────────────────── */}
              {step === 7 && (
                <div className="text-center space-y-8">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 200, delay: 0.1 }}
                    className="mx-auto w-24 h-24 rounded-full bg-gradient-to-tr from-[#7C3AED] to-[#06B6D4] flex items-center justify-center shadow-[0_0_80px_rgba(124,58,237,0.5)]"
                  >
                    <Rocket className="h-12 w-12 text-white" />
                  </motion.div>

                  <div className="space-y-3">
                    <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
                      Copilot Activated!{" "}
                      <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#7C3AED] to-[#06B6D4]">
                        🎉
                      </span>
                    </h2>
                    <p className="text-[#a0aec0] text-sm leading-relaxed max-w-md mx-auto">
                      Your career AI engine is now live and personalized. Your dashboard is ready with job matches, interview sessions, and resume analysis tailored specifically for you.
                    </p>
                  </div>

                  {/* Summary card */}
                  <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/[0.06] text-left space-y-3 max-w-sm mx-auto">
                    <p className="text-[10px] text-[#a0aec0] uppercase tracking-wider font-mono">CONFIGURATION SUMMARY</p>
                    <div className="space-y-2 text-xs">
                      <div className="flex justify-between">
                        <span className="text-[#a0aec0]">Target Roles</span>
                        <span className="text-white font-semibold text-right max-w-[180px] truncate">
                          {selectedRoles.slice(0, 2).join(", ")}{selectedRoles.length > 2 ? ` +${selectedRoles.length - 2}` : ""}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[#a0aec0]">Experience</span>
                        <span className="text-white font-semibold capitalize">{experienceLevel}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[#a0aec0]">Locations</span>
                        <span className="text-white font-semibold text-right max-w-[180px] truncate">
                          {selectedLocations.slice(0, 2).join(", ")}{selectedLocations.length > 2 ? ` +${selectedLocations.length - 2}` : ""}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[#a0aec0]">Skills</span>
                        <span className="text-white font-semibold">{selectedSkills.length} loaded</span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => router.push("/dashboard")}
                    className="group inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-gradient-to-r from-[#7C3AED] to-[#06B6D4] text-white font-bold text-sm hover:opacity-90 transition-all shadow-[0_0_40px_rgba(124,58,237,0.35)]"
                  >
                    Enter the Cockpit
                    <ChevronRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
                  </button>
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          {/* Navigation */}
          {step > 1 && step < 7 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mt-8 flex items-center justify-between"
            >
              <button
                onClick={goPrev}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.08] text-sm font-semibold text-[#a0aec0] hover:text-white hover:border-white/15 transition-all"
              >
                <ArrowLeft className="h-4 w-4" />
                Back
              </button>

              {step === 6 ? (
                <button
                  onClick={handleFinish}
                  disabled={!canProceed() || isSubmitting || isLoading}
                  className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#7C3AED] to-[#06B6D4] text-white font-semibold text-sm hover:opacity-90 transition-all shadow-[0_0_25px_rgba(124,58,237,0.3)] disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full"
                      />
                      Activating...
                    </>
                  ) : (
                    <>
                      <Rocket className="h-4 w-4" />
                      Activate Copilot
                    </>
                  )}
                </button>
              ) : (
                <button
                  onClick={goNext}
                  disabled={!canProceed()}
                  className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#7C3AED] to-[#06B6D4] text-white font-semibold text-sm hover:opacity-90 transition-all shadow-[0_0_25px_rgba(124,58,237,0.3)] disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  Continue
                  <ArrowRight className="h-4 w-4" />
                </button>
              )}
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
