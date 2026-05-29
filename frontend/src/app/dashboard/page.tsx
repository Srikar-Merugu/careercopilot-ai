"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  TrendingUp, Briefcase, Target, Sparkles,
  Star, Clock, Activity, Zap, ChevronRight, BarChart3, Brain, Calendar,
  BookmarkCheck, FileText, Bell,
} from "lucide-react";
import { useDashboardAnalytics, useApplications, useActivityLog } from "@/hooks/use-dashboard";
import { useDashboardStore } from "@/store/dashboard-store";

const statCards = [
  { key: "total_applications", label: "Total Applications", icon: Briefcase, color: "text-primary", bg: "bg-primary/10", border: "border-primary/20", prefix: "" },
  { key: "avg_match_score", label: "AI Match Average", icon: Brain, color: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/20", prefix: "", suffix: "%" },
  { key: "saved_jobs_count", label: "Saved Jobs", icon: BookmarkCheck, color: "text-amber-400", bg: "bg-amber-500/10", border: "border-amber-500/20", prefix: "" },
  { key: "interview_readiness", label: "Interview Readiness", icon: Target, color: "text-cyan-400", bg: "bg-cyan-500/10", border: "border-cyan-500/20", prefix: "", suffix: "%" },
  { key: "ats_score", label: "ATS Score", icon: Star, color: "text-violet-400", bg: "bg-violet-500/10", border: "border-violet-500/20", prefix: "", suffix: "%" },
  { key: "weekly_growth", label: "Weekly Growth", icon: TrendingUp, color: "text-rose-400", bg: "bg-rose-500/10", border: "border-rose-500/20", prefix: "+", suffix: "%" },
];

const statusConfig: Record<string, { label: string; color: string; bg: string }> = {
  saved: { label: "Saved", color: "text-blue-400", bg: "bg-blue-500/10" },
  applied: { label: "Applied", color: "text-amber-400", bg: "bg-amber-500/10" },
  interview: { label: "Interview", color: "text-primary", bg: "bg-primary/10" },
  offer: { label: "Offer", color: "text-emerald-400", bg: "bg-emerald-500/10" },
  rejected: { label: "Rejected", color: "text-rose-400", bg: "bg-rose-500/10" },
};

const activityIcons: Record<string, any> = {
  application_update: Briefcase,
  ai_match: Brain,
  interview: Calendar,
  resume_analysis: FileText,
  skill_gap: Target,
  ai_recommendation: Sparkles,
  saved_job: BookmarkCheck,
  career_insight: Brain,
  subscription: Zap,
  profile_update: BarChart3,
  notification: Bell,
};

export default function DashboardPage() {
  const { analytics, activityLog, isLoading } = useDashboardStore();
  useDashboardAnalytics();
  useApplications();
  useActivityLog(8);

  const applicationsByStatus = useMemo(() => {
    if (!analytics?.applications_by_status) return {};
    return analytics.applications_by_status;
  }, [analytics]);

  const statusTotal = useMemo(() => {
    return Object.values(applicationsByStatus).reduce((a, b) => a + b, 0);
  }, [applicationsByStatus]);

  return (
    <div className="space-y-6 pb-12">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2.5">
            <Activity className="h-6 w-6 text-primary" />
            Dashboard
          </h1>
          <p className="text-sm text-[#a0aec0] mt-0.5">Your AI-powered career command center</p>
        </div>
        <Link
          href="/dashboard/jobs"
          className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-xl bg-primary hover:bg-primary/90 text-white text-sm font-medium transition-all shadow-glow-sm"
        >
          <Briefcase className="h-4 w-4" />
          Find Jobs
          <ChevronRight className="h-3.5 w-3.5" />
        </Link>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {statCards.map((card, i) => {
          const Icon = card.icon;
          const value = analytics ? (analytics as any)[card.key] : null;
          return (
            <motion.div
              key={card.key}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className={`relative overflow-hidden rounded-xl p-4 border ${card.border} ${card.bg} backdrop-blur-sm group hover:bg-white/[0.06] transition-all`}
            >
              <div className="flex items-center justify-between mb-2.5">
                <span className="text-[10px] font-medium text-[#a0aec0] uppercase tracking-wider">{card.label}</span>
                <Icon className={`h-4 w-4 ${card.color} opacity-60 group-hover:opacity-100 transition-opacity`} />
              </div>
              {isLoading ? (
                <div className="h-7 w-16 rounded bg-white/5 animate-pulse" />
              ) : (
                <p className={`text-xl font-bold text-white ${card.color}`}>
                  {card.prefix}{value ?? "—"}{card.suffix || ""}
                </p>
              )}
              <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            </motion.div>
          );
        })}
      </div>

      {/* Main Grid */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left Column: Applications + Activity */}
        <div className="lg:col-span-2 space-y-6">
          {/* Application Pipeline */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-xl border border-white/10 bg-[#0a0f2e]/60 backdrop-blur-xl p-5"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                <BarChart3 className="h-4 w-4 text-primary" />
                Application Pipeline
              </h3>
              <Link href="/dashboard/applications" className="text-[11px] text-primary hover:text-primary/80 font-medium transition-colors">
                View all →
              </Link>
            </div>
            <div className="grid grid-cols-5 gap-2">
              {Object.entries(statusConfig).map(([key, config]) => {
                const count = applicationsByStatus[key] || 0;
                const pct = statusTotal > 0 ? (count / statusTotal) * 100 : 0;
                return (
                  <div key={key} className="text-center p-2.5 rounded-lg bg-white/5 border border-white/5">
                    <p className={`text-lg font-bold ${config.color}`}>{count}</p>
                    <p className="text-[10px] text-[#a0aec0] mt-0.5">{config.label}</p>
                    <div className="mt-2 h-1 rounded-full bg-white/5 overflow-hidden">
                      <div className={`h-full rounded-full ${config.bg.replace("bg-", "bg-").replace("/10", "/50")}`} style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>

          {/* Recent Activity */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="rounded-xl border border-white/10 bg-[#0a0f2e]/60 backdrop-blur-xl p-5"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                <Activity className="h-4 w-4 text-primary" />
                Recent Activity
              </h3>
              <Link href="/dashboard/applications" className="text-[11px] text-primary hover:text-primary/80 font-medium transition-colors">
                View all →
              </Link>
            </div>
            <div className="space-y-1">
              {activityLog.slice(0, 6).map((item, i) => {
                const Icon = activityIcons[item.activity_type] || Activity;
                return (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.04 }}
                    className="flex items-start gap-3 p-2.5 rounded-lg hover:bg-white/5 transition-colors group"
                  >
                    <div className="h-8 w-8 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
                      <Icon className="h-3.5 w-3.5 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-[#e2e8f0] group-hover:text-white transition-colors">{item.description}</p>
                      <p className="text-[10px] text-[#4a5568] mt-0.5">
                        {new Date(item.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}
                      </p>
                    </div>
                    <ChevronRight className="h-3.5 w-3.5 text-[#4a5568] group-hover:text-primary transition-colors shrink-0 mt-1.5" />
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        </div>

        {/* Right Column: Recommendations + Quick Actions */}
        <div className="space-y-6">
          {/* AI Summary Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-xl border border-white/10 bg-gradient-to-br from-primary/5 to-cyan-500/5 backdrop-blur-xl p-5"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="h-10 w-10 rounded-xl bg-primary/20 border border-primary/30 flex items-center justify-center">
                <Brain className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-white">AI Career Summary</h3>
                <p className="text-[10px] text-[#a0aec0]">Based on your profile activity</p>
              </div>
            </div>
            <p className="text-xs text-[#c8d0dc] leading-relaxed">
              Your profile is strongly aligned with Senior Full Stack and Staff Engineer roles.
              Top skill to develop this week: <span className="text-primary font-medium">System Design</span>.
              You have <span className="text-primary font-medium">3 interviews</span> scheduled.
            </p>
            <div className="flex flex-wrap gap-1.5 mt-3">
              <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">92% Match</span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-amber-500/10 text-amber-400 border border-amber-500/20">5 Skills to Grow</span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-primary/10 text-primary border border-primary/20">Pro Plan</span>
            </div>
          </motion.div>

          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="rounded-xl border border-white/10 bg-[#0a0f2e]/60 backdrop-blur-xl p-5"
          >
            <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
              <Zap className="h-4 w-4 text-primary" />
              Quick Actions
            </h3>
            <div className="space-y-1.5">
              {[
                { href: "/dashboard/jobs", label: "Search Jobs", icon: Briefcase, desc: "Find your next role" },
                { href: "/dashboard/resume", label: "Upload Resume", icon: FileText, desc: "Get AI analysis" },
                { href: "/dashboard/applications", label: "Track Applications", icon: BarChart3, desc: "Kanban board" },
                { href: "/dashboard/interview-prep", label: "Prepare Interview", icon: Target, desc: "AI practice" },
                { href: "/dashboard/billing", label: "Upgrade Plan", icon: Sparkles, desc: "Unlock premium" },
              ].map((action) => {
                const Icon = action.icon;
                return (
                  <Link
                    key={action.href}
                    href={action.href}
                    className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-white/5 transition-all group"
                  >
                    <div className="h-8 w-8 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
                      <Icon className="h-4 w-4 text-primary" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-white group-hover:text-primary transition-colors">{action.label}</p>
                      <p className="text-[10px] text-[#a0aec0]">{action.desc}</p>
                    </div>
                    <ChevronRight className="h-4 w-4 text-[#4a5568] group-hover:text-primary transition-colors" />
                  </Link>
                );
              })}
            </div>
          </motion.div>

          {/* Upcoming Interviews */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="rounded-xl border border-white/10 bg-[#0a0f2e]/60 backdrop-blur-xl p-5"
          >
            <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
              <Calendar className="h-4 w-4 text-primary" />
              Upcoming Interviews
            </h3>
            {analytics && analytics.interviews_scheduled > 0 ? (
              <div className="space-y-2">
                {[
                  { company: "Stripe", role: "Staff Backend Engineer", date: "Jun 5, 2:00 PM", type: "Technical" },
                  { company: "OpenAI", role: "AI Research Engineer", date: "Jun 10, 11:00 AM", type: "System Design" },
                ].map((interview, i) => (
                  <div key={i} className="p-3 rounded-lg bg-white/5 border border-white/5 hover:border-primary/20 transition-all">
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-sm font-semibold text-white">{interview.company}</p>
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-primary/10 text-primary">{interview.type}</span>
                    </div>
                    <p className="text-xs text-[#a0aec0]">{interview.role}</p>
                    <div className="flex items-center gap-1.5 mt-1.5">
                      <Clock className="h-3 w-3 text-amber-400" />
                      <span className="text-[10px] text-amber-400">{interview.date}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6">
                <Calendar className="h-8 w-8 text-[#4a5568] mx-auto mb-2" />
                <p className="text-xs text-[#a0aec0]">No interviews scheduled yet</p>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
