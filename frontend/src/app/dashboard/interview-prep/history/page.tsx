"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import {
  List, Brain, ChevronRight,
  BarChart3, Star, Target, UserCheck, Sparkles, Code2,
} from "lucide-react";
import { useInterviewHistory } from "@/hooks/use-interviews";
import { useInterviewStore } from "@/store/interview-store";

const typeLabels: Record<string, { label: string; icon: any; color: string }> = {
  hr: { label: "HR", icon: UserCheck, color: "text-blue-400" },
  technical: { label: "Technical", icon: Brain, color: "text-primary" },
  coding: { label: "Coding", icon: Code2, color: "text-emerald-400" },
  behavioral: { label: "Behavioral", icon: Star, color: "text-amber-400" },
  system_design: { label: "System Design", icon: Target, color: "text-cyan-400" },
  ai_engineer: { label: "AI Engineer", icon: Sparkles, color: "text-violet-400" },
  frontend: { label: "Frontend", icon: BarChart3, color: "text-rose-400" },
  backend: { label: "Backend", icon: BarChart3, color: "text-indigo-400" },
};

export default function InterviewHistoryPage() {
  const router = useRouter();
  const { history, historyStats } = useInterviewStore();
  useInterviewHistory();

  const sortedHistory = useMemo(() => {
    return [...history].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  }, [history]);

  return (
    <div className="space-y-6 pb-12">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2.5">
            <List className="h-6 w-6 text-primary" />
            Interview History
          </h1>
          <p className="text-sm text-[#a0aec0] mt-0.5">Track your interview performance and progress</p>
        </div>
      </motion.div>

      {/* Stats */}
      {historyStats && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: "Total Interviews", value: historyStats.total, icon: Brain, color: "text-primary", bg: "bg-primary/10" },
            { label: "Average Score", value: `${Math.round(historyStats.average_score)}%`, icon: Star, color: "text-emerald-400", bg: "bg-emerald-500/10" },
            { label: "Types Practiced", value: Object.keys(historyStats.interviews_by_type).length, icon: Target, color: "text-amber-400", bg: "bg-amber-500/10" },
            { label: "Types Available", value: "8", icon: Sparkles, color: "text-cyan-400", bg: "bg-cyan-500/10" },
          ].map((stat, i) => {
            const Icon = stat.icon;
            return (
              <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                className="rounded-xl border border-white/10 bg-[#0a0f2e]/60 backdrop-blur-xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-[#a0aec0] font-medium">{stat.label}</span>
                  <div className={`h-8 w-8 rounded-lg ${stat.bg} flex items-center justify-center`}>
                    <Icon className={`h-4 w-4 ${stat.color}`} />
                  </div>
                </div>
                <p className="text-xl font-bold text-white">{stat.value}</p>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* History List */}
      <div className="space-y-2">
        {sortedHistory.length === 0 ? (
          <div className="text-center py-16">
            <Brain className="h-12 w-12 text-[#4a5568] mx-auto mb-3" />
            <h3 className="text-lg font-semibold text-white mb-1">No interviews yet</h3>
            <p className="text-sm text-[#a0aec0] mb-4">Complete your first mock interview to see results here.</p>
            <button onClick={() => router.push("/dashboard/interview-prep")}
              className="px-4 py-2 rounded-xl bg-primary text-white text-sm font-medium">
              Start Interview
            </button>
          </div>
        ) : (
          sortedHistory.map((item, i) => {
            const typeInfo = typeLabels[item.interview_type] || { label: item.interview_type, icon: Brain, color: "text-primary" };
            const Icon = typeInfo.icon;
            return (
              <motion.div key={item.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}
                onClick={() => router.push(`/dashboard/interview-prep/session?id=${item.id}`)}
                className="flex items-center justify-between p-4 rounded-xl border border-white/10 bg-[#0a0f2e]/60 backdrop-blur-sm hover:bg-white/[0.06] transition-all cursor-pointer group"
              >
                <div className="flex items-center gap-3">
                  <div className={`h-10 w-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center`}>
                    <Icon className={`h-5 w-5 ${typeInfo.color}`} />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white">{item.role}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-[10px] text-[#a0aec0] capitalize">{typeInfo.label}</span>
                      <span className="text-[10px] text-[#4a5568]">·</span>
                      <span className="text-[10px] text-[#a0aec0]">{item.question_count} questions</span>
                      <span className="text-[10px] text-[#4a5568]">·</span>
                      <span className="text-[10px] text-[#a0aec0]">
                        {new Date(item.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  {item.overall_score !== null && item.overall_score !== undefined ? (
                    <div className="text-right">
                      <p className={`text-lg font-bold ${
                        item.overall_score >= 80 ? "text-emerald-400" : item.overall_score >= 60 ? "text-amber-400" : "text-rose-400"
                      }`}>{Math.round(item.overall_score)}</p>
                      <p className="text-[9px] text-[#4a5568] uppercase">Score</p>
                    </div>
                  ) : (
                    <span className="text-[10px] px-2 py-1 rounded bg-primary/10 text-primary border border-primary/20">In Progress</span>
                  )}
                  <ChevronRight className="h-4 w-4 text-[#4a5568] group-hover:text-primary transition-colors" />
                </div>
              </motion.div>
            );
          })
        )}
      </div>
    </div>
  );
}
