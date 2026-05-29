"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import {
  UserCheck, Brain, Target, ChevronRight,
  Sparkles, Code2, BarChart3, ArrowUpRight, Star, TrendingUp,
  Play, BookOpen, List,
} from "lucide-react";
import { useStartInterview } from "@/hooks/use-interviews";
import { useInterviewStore } from "@/store/interview-store";
import { AIOrb, AIAssistantMini } from "@/components/interview/ai-orb";

const interviewTypes = [
  { id: "hr", label: "HR Round", icon: UserCheck, desc: "Background, motivation, culture fit", color: "text-blue-400", bg: "bg-blue-500/10" },
  { id: "technical", label: "Technical", icon: Brain, desc: "Data structures, algorithms, system design", color: "text-primary", bg: "bg-primary/10" },
  { id: "coding", label: "Coding", icon: Code2, desc: "Live coding with AI evaluation", color: "text-emerald-400", bg: "bg-emerald-500/10" },
  { id: "behavioral", label: "Behavioral", icon: Star, desc: "Leadership, teamwork, conflict resolution", color: "text-amber-400", bg: "bg-amber-500/10" },
  { id: "system_design", label: "System Design", icon: Target, desc: "Architecture, scalability, trade-offs", color: "text-cyan-400", bg: "bg-cyan-500/10" },
  { id: "ai_engineer", label: "AI Engineer", icon: Sparkles, desc: "ML, LLMs, RAG, transformers", color: "text-violet-400", bg: "bg-violet-500/10" },
  { id: "frontend", label: "Frontend", icon: BarChart3, desc: "React, CSS, performance, architecture", color: "text-rose-400", bg: "bg-rose-500/10" },
  { id: "backend", label: "Backend", icon: ArrowUpRight, desc: "APIs, databases, microservices", color: "text-indigo-400", bg: "bg-indigo-500/10" },
];

export default function InterviewPrepPage() {
  const router = useRouter();
  const { isLoading } = useInterviewStore();
  const startInterview = useStartInterview();
  const [role, setRole] = useState("Software Engineer");
  const [company, setCompany] = useState("");
  const [selectedType, setSelectedType] = useState("technical");
  const [showForm, setShowForm] = useState(false);

  const handleStart = async () => {
    const result = await startInterview.mutateAsync({
      role, interviewType: selectedType, company: company || undefined,
    });
    router.push(`/dashboard/interview-prep/session?id=${result.id}`);
  };

  const quickStart = async (type: string) => {
    setSelectedType(type);
    const result = await startInterview.mutateAsync({
      role: "Software Engineer", interviewType: type,
    });
    router.push(`/dashboard/interview-prep/session?id=${result.id}`);
  };

  return (
    <div className="space-y-6 pb-12">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2.5">
            <UserCheck className="h-6 w-6 text-primary" />
            Mock Interviews
          </h1>
          <p className="text-sm text-[#a0aec0] mt-0.5">AI-powered interview practice with real-time feedback and scoring</p>
        </div>
        <AIAssistantMini />
      </motion.div>

      {/* Hero Start Card */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        className="rounded-xl border border-white/10 bg-gradient-to-br from-primary/5 to-cyan-500/5 backdrop-blur-xl p-6"
      >
        <div className="flex flex-col md:flex-row items-center gap-6">
          <AIOrb isListening size={100} />
          <div className="flex-1 text-center md:text-left">
            <h2 className="text-xl font-bold text-white">Ready for your interview?</h2>
            <p className="text-sm text-[#a0aec0] mt-1 max-w-lg">
              I&apos;ll generate personalized questions based on your role, company, and experience level.
              Each answer is scored and analyzed in real-time.
            </p>
            <div className="flex flex-wrap gap-2 mt-4 justify-center md:justify-start">
              <div className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-[11px] font-medium border border-emerald-500/20">
                Real-time scoring
              </div>
              <div className="px-3 py-1 rounded-full bg-primary/10 text-primary text-[11px] font-medium border border-primary/20">
                AI feedback
              </div>
              <div className="px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 text-[11px] font-medium border border-amber-500/20">
                8 interview types
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Interview Types Grid */}
      <div>
        <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
          <Play className="h-4 w-4 text-primary" />
          Quick Start Interview
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {interviewTypes.map((type, i) => {
            const Icon = type.icon;
            return (
              <motion.button
                key={type.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
                onClick={() => quickStart(type.id)}
                disabled={isLoading}
                className="group relative p-4 rounded-xl border border-white/10 bg-[#0a0f2e]/60 backdrop-blur-sm hover:bg-white/[0.06] text-left transition-all disabled:opacity-50"
              >
                <div className={`h-10 w-10 rounded-xl ${type.bg} border border-white/10 flex items-center justify-center mb-3`}>
                  <Icon className={`h-5 w-5 ${type.color}`} />
                </div>
                <h4 className="text-sm font-semibold text-white mb-0.5">{type.label}</h4>
                <p className="text-[10px] text-[#a0aec0] leading-snug">{type.desc}</p>
                <ChevronRight className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#4a5568] group-hover:text-primary transition-colors opacity-0 group-hover:opacity-100" />
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Custom Interview Form */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
        className="rounded-xl border border-white/10 bg-[#0a0f2e]/60 backdrop-blur-xl p-5"
      >
        <button onClick={() => setShowForm(!showForm)} className="flex items-center justify-between w-full">
          <h3 className="text-sm font-semibold text-white flex items-center gap-2">
            <BookOpen className="h-4 w-4 text-primary" />
            Custom Interview Setup
          </h3>
          <ChevronRight className={`h-4 w-4 text-[#4a5568] transition-transform ${showForm ? "rotate-90" : ""}`} />
        </button>
        {showForm && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} className="overflow-hidden">
            <div className="grid sm:grid-cols-2 gap-4 mt-4">
              <div className="space-y-1.5">
                <label className="text-xs text-[#a0aec0] font-medium">Target Role</label>
                <input value={role} onChange={(e) => setRole(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-lg bg-white/5 border border-white/10 text-sm text-white focus:outline-none focus:border-primary/40" />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs text-[#a0aec0] font-medium">Company (optional)</label>
                <input value={company} onChange={(e) => setCompany(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-lg bg-white/5 border border-white/10 text-sm text-white focus:outline-none focus:border-primary/40" />
              </div>
            </div>
            <div className="space-y-1.5 mt-4">
              <label className="text-xs text-[#a0aec0] font-medium">Interview Type</label>
              <div className="flex flex-wrap gap-2">
                {interviewTypes.map((type) => (
                  <button key={type.id} onClick={() => setSelectedType(type.id)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                      selectedType === type.id
                        ? "bg-primary/20 border-primary/40 text-primary"
                        : "bg-white/5 border-white/10 text-[#a0aec0] hover:border-white/20"
                    }`}>
                    {type.label}
                  </button>
                ))}
              </div>
            </div>
            <button onClick={handleStart} disabled={isLoading || !role}
              className="mt-4 w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-primary hover:bg-primary/90 text-white font-medium text-sm transition-all disabled:opacity-40">
              <Play className="h-4 w-4" />
              {isLoading ? "Starting..." : "Start Interview"}
            </button>
          </motion.div>
        )}
      </motion.div>

      {/* Quick Links */}
      <div className="grid sm:grid-cols-3 gap-3">
        <motion.a href="/dashboard/interview-prep/history" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          className="flex items-center justify-between p-4 rounded-xl border border-white/10 bg-[#0a0f2e]/60 backdrop-blur-sm hover:bg-white/[0.06] transition-all group">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center">
              <List className="h-4 w-4 text-primary" />
            </div>
            <div>
              <p className="text-sm font-semibold text-white">Interview History</p>
              <p className="text-[10px] text-[#a0aec0]">Review past interviews and scores</p>
            </div>
          </div>
          <ChevronRight className="h-4 w-4 text-[#4a5568] group-hover:text-primary" />
        </motion.a>
        <motion.a href="/dashboard/interview-prep/coding" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
          className="flex items-center justify-between p-4 rounded-xl border border-white/10 bg-[#0a0f2e]/60 backdrop-blur-sm hover:bg-white/[0.06] transition-all group">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
              <Code2 className="h-4 w-4 text-emerald-400" />
            </div>
            <div>
              <p className="text-sm font-semibold text-white">Coding Challenges</p>
              <p className="text-[10px] text-[#a0aec0]">Practice with AI evaluation</p>
            </div>
          </div>
          <ChevronRight className="h-4 w-4 text-[#4a5568] group-hover:text-primary" />
        </motion.a>
        <motion.a href="/dashboard/interview-prep/history" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
          className="flex items-center justify-between p-4 rounded-xl border border-white/10 bg-[#0a0f2e]/60 backdrop-blur-sm hover:bg-white/[0.06] transition-all group">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
              <TrendingUp className="h-4 w-4 text-amber-400" />
            </div>
            <div>
              <p className="text-sm font-semibold text-white">Your Progress</p>
              <p className="text-[10px] text-[#a0aec0]">Track improvement over time</p>
            </div>
          </div>
          <ChevronRight className="h-4 w-4 text-[#4a5568] group-hover:text-primary" />
        </motion.a>
      </div>
    </div>
  );
}
