"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Zap, Send, FileText, CheckCircle2, XCircle, Clock,
  TrendingUp, Sparkles, Play, Pause, Settings,
  Activity, BarChart3, Bot, RefreshCw,
  Globe, Shield,
} from "lucide-react";

const quickStats = [
  { label: "Applied Today", value: "12", change: "+3", icon: Send, color: "text-primary", bg: "bg-primary/10" },
  { label: "Success Rate", value: "89%", change: "+5%", icon: TrendingUp, color: "text-emerald-400", bg: "bg-emerald-500/10" },
  { label: "Failed", value: "2", change: "0", icon: XCircle, color: "text-rose-400", bg: "bg-rose-500/10" },
  { label: "In Queue", value: "8", change: "--", icon: Clock, color: "text-amber-400", bg: "bg-amber-500/10" },
];

const platformStatus = [
  { name: "LinkedIn", status: "ready", color: "text-blue-400", icon: "in" },
  { name: "Indeed", status: "ready", color: "text-primary", icon: "id" },
  { name: "Wellfound", status: "ready", color: "text-emerald-400", icon: "wf" },
  { name: "Internshala", status: "ready", color: "text-cyan-400", icon: "is" },
  { name: "Naukri", status: "ready", color: "text-amber-400", icon: "nk" },
  { name: "Foundit", status: "ready", color: "text-violet-400", icon: "fi" },
];

const recentApplications = [
  { company: "Swiggy", role: "Frontend Developer", status: "submitted", score: 92, time: "2 min ago" },
  { company: "Razorpay", role: "Full Stack Engineer", status: "submitted", score: 88, time: "15 min ago" },
  { company: "Google", role: "Senior AI Engineer", status: "applying", score: 85, time: "now" },
  { company: "CRED", role: "React Native Dev", status: "queued", score: 90, time: "--" },
  { company: "Flipkart", role: "Backend Engineer", status: "failed", score: 72, time: "1 hr ago" },
  { company: "Amazon", role: "Data Scientist", status: "submitted", score: 78, time: "3 hrs ago" },
];

const coverLetterTemplates = [
  { id: "standard", name: "Standard Professional", preview: "Dear Hiring Manager..." },
  { id: "concise", name: "Concise & Direct", preview: "Hi Team, I'm excited..." },
  { id: "impact", name: "Impact-Focused", preview: "I am thrilled to apply..." },
];

export default function AutoApplyPage() {
  const [activeTab, setActiveTab] = useState("overview");
  const [automationRunning, setAutomationRunning] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState("standard");
  const [showCoverLetter, setShowCoverLetter] = useState(false);
  const [coverLetterContent, setCoverLetterContent] = useState("");

  return (
    <div className="space-y-6 pb-12">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2.5">
            <Zap className="h-6 w-6 text-primary" />
            Auto Apply
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            AI-powered autonomous job application engine
          </p>
        </div>
        <div className="flex items-center gap-3">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setAutomationRunning(!automationRunning)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              automationRunning
                ? "bg-emerald-500/20 border border-emerald-500/30 text-emerald-400"
                : "bg-primary/10 border border-primary/20 text-primary hover:bg-primary/20"
            }`}
          >
            {automationRunning ? (
              <>
                <Pause className="h-4 w-4" />
                Running
              </>
            ) : (
              <>
                <Play className="h-4 w-4" />
                Start Automation
              </>
            )}
          </motion.button>
          <motion.button
            whileHover={{ rotate: 180 }}
            transition={{ duration: 0.3 }}
            className="p-2 rounded-lg hover:bg-white/5 text-muted-foreground hover:text-white"
          >
            <RefreshCw className="h-4 w-4" />
          </motion.button>
        </div>
      </motion.div>

      <div className="flex gap-1 p-1 rounded-xl bg-white/[0.03] border border-white/5 w-fit">
        {[
          { id: "overview", label: "Overview", icon: BarChart3 },
          { id: "applications", label: "Applications", icon: Send },
          { id: "cover-letters", label: "Cover Letters", icon: FileText },
          { id: "settings", label: "Settings", icon: Settings },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              activeTab === tab.id
                ? "bg-primary/20 text-primary shadow-glow-primary"
                : "text-muted-foreground hover:text-white hover:bg-white/5"
            }`}
          >
            <tab.icon className="h-4 w-4" />
            {tab.label}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {activeTab === "overview" && (
          <motion.div
            key="overview"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-6"
          >
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {quickStats.map((stat, i) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="relative overflow-hidden rounded-2xl border border-white/5 bg-black/40 backdrop-blur-xl p-5 group"
                >
                  <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-white/[0.02] to-transparent rounded-full -translate-y-1/2 translate-x-1/2" />
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-xs text-muted-foreground uppercase tracking-wider">{stat.label}</p>
                      <p className="text-2xl font-bold text-white mt-1">{stat.value}</p>
                      <p className="text-xs text-emerald-400 mt-0.5">{stat.change} today</p>
                    </div>
                    <div className={`p-2.5 rounded-xl ${stat.bg}`}>
                      <stat.icon className={`h-5 w-5 ${stat.color}`} />
                    </div>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-primary/0 via-primary/30 to-primary/0" />
                </motion.div>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="rounded-2xl border border-white/5 bg-black/40 backdrop-blur-xl p-6"
              >
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                    <Activity className="h-5 w-5 text-primary" />
                    Recent Applications
                  </h2>
                  <span className="text-xs text-muted-foreground bg-white/5 px-2.5 py-1 rounded-full">Live</span>
                </div>
                <div className="space-y-1">
                  {recentApplications.map((app, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/5 transition-colors"
                    >
                      <div className={`p-1.5 rounded-lg ${
                        app.status === "submitted" ? "bg-emerald-500/10 text-emerald-400" :
                        app.status === "applying" ? "bg-primary/10 text-primary" :
                        app.status === "queued" ? "bg-amber-500/10 text-amber-400" :
                        "bg-rose-500/10 text-rose-400"
                      }`}>
                        {app.status === "submitted" ? <CheckCircle2 className="h-3.5 w-3.5" /> :
                         app.status === "applying" ? <Activity className="h-3.5 w-3.5" /> :
                         app.status === "queued" ? <Clock className="h-3.5 w-3.5" /> :
                         <XCircle className="h-3.5 w-3.5" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-white/90 truncate">{app.role} <span className="text-muted-foreground">at {app.company}</span></p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`text-xs font-medium ${
                          app.score >= 85 ? "text-emerald-400" :
                          app.score >= 70 ? "text-amber-400" : "text-rose-400"
                        }`}>{app.score}%</span>
                        <span className="text-xs text-muted-foreground">{app.time}</span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
                className="rounded-2xl border border-white/5 bg-black/40 backdrop-blur-xl p-6"
              >
                <h2 className="text-lg font-semibold text-white flex items-center gap-2 mb-4">
                  <Globe className="h-5 w-5 text-primary" />
                  Platform Status
                </h2>
                <div className="grid grid-cols-2 gap-3">
                  {platformStatus.map((p, i) => (
                    <motion.div
                      key={p.name}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.03] border border-white/5"
                    >
                      <div className={`w-9 h-9 rounded-lg flex items-center justify-center text-xs font-bold ${
                        p.status === "ready" ? "bg-emerald-500/10 text-emerald-400" : "bg-rose-500/10 text-rose-400"
                      }`}>
                        {p.icon.toUpperCase()}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-white">{p.name}</p>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <span className={`w-1.5 h-1.5 rounded-full ${p.status === "ready" ? "bg-emerald-400" : "bg-rose-400"}`} />
                          <span className="text-xs text-muted-foreground capitalize">{p.status}</span>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="rounded-2xl border border-white/5 bg-black/40 backdrop-blur-xl p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                  <Bot className="h-5 w-5 text-primary" />
                  Automation Queue
                </h2>
                <div className="flex items-center gap-3">
                  {[
                    { label: "Queued", value: 5, color: "text-amber-400" },
                    { label: "Processing", value: 2, color: "text-primary" },
                    { label: "Completed", value: 24, color: "text-emerald-400" },
                    { label: "Failed", value: 3, color: "text-rose-400" },
                  ].map((s) => (
                    <div key={s.label} className="text-center">
                      <p className={`text-lg font-bold ${s.color}`}>{s.value}</p>
                      <p className="text-[10px] text-muted-foreground uppercase">{s.label}</p>
                    </div>
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-4 gap-2">
                {[
                  { label: "Daily Limit", value: "12/50", pct: 24 },
                  { label: "Success Rate", value: "89%", pct: 89 },
                  { label: "Avg Match", value: "84%", pct: 84 },
                  { label: "Interviews", value: "4", pct: 40 },
                ].map((m) => (
                  <div key={m.label} className="p-3 rounded-xl bg-white/[0.03] border border-white/5">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs text-muted-foreground">{m.label}</span>
                      <span className="text-xs font-medium text-white">{m.value}</span>
                    </div>
                    <div className="h-1.5 rounded-full bg-white/5 overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${m.pct}%` }}
                        transition={{ duration: 1, delay: 0.3 }}
                        className="h-full rounded-full bg-gradient-to-r from-primary to-violet-500"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}

        {activeTab === "applications" && (
          <motion.div
            key="applications"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="rounded-2xl border border-white/5 bg-black/40 backdrop-blur-xl p-6"
          >
            <h2 className="text-lg font-semibold text-white flex items-center gap-2 mb-6">
              <Send className="h-5 w-5 text-primary" />
              Application History
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/5">
                    <th className="text-left py-3 px-3 text-muted-foreground font-medium">Company</th>
                    <th className="text-left py-3 px-3 text-muted-foreground font-medium">Role</th>
                    <th className="text-left py-3 px-3 text-muted-foreground font-medium">Status</th>
                    <th className="text-left py-3 px-3 text-muted-foreground font-medium">Score</th>
                    <th className="text-left py-3 px-3 text-muted-foreground font-medium">Time</th>
                    <th className="text-right py-3 px-3 text-muted-foreground font-medium">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {recentApplications.map((app, i) => (
                    <tr key={i} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                      <td className="py-3 px-3 text-white">{app.company}</td>
                      <td className="py-3 px-3 text-muted-foreground">{app.role}</td>
                      <td className="py-3 px-3">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          app.status === "submitted" ? "bg-emerald-500/10 text-emerald-400" :
                          app.status === "applying" ? "bg-primary/10 text-primary" :
                          app.status === "queued" ? "bg-amber-500/10 text-amber-400" :
                          "bg-rose-500/10 text-rose-400"
                        }`}>
                          {app.status === "submitted" && <CheckCircle2 className="h-3 w-3" />}
                          {app.status === "applying" && <Activity className="h-3 w-3" />}
                          {app.status === "queued" && <Clock className="h-3 w-3" />}
                          {app.status === "failed" && <XCircle className="h-3 w-3" />}
                          {app.status}
                        </span>
                      </td>
                      <td className="py-3 px-3">
                        <span className={`font-medium ${
                          app.score >= 85 ? "text-emerald-400" :
                          app.score >= 70 ? "text-amber-400" : "text-rose-400"
                        }`}>{app.score}%</span>
                      </td>
                      <td className="py-3 px-3 text-muted-foreground">{app.time}</td>
                      <td className="py-3 px-3 text-right">
                        <button className="text-xs text-primary hover:text-primary/80 transition-colors">View</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}

        {activeTab === "cover-letters" && (
          <motion.div
            key="cover-letters"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-6"
          >
            <div className="rounded-2xl border border-white/5 bg-black/40 backdrop-blur-xl p-6">
              <h2 className="text-lg font-semibold text-white flex items-center gap-2 mb-4">
                <FileText className="h-5 w-5 text-primary" />
                AI Cover Letter Templates
              </h2>
              <div className="space-y-3">
                {coverLetterTemplates.map((t) => (
                  <motion.button
                    key={t.id}
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    onClick={() => {
                      setSelectedTemplate(t.id);
                      setShowCoverLetter(true);
                      setCoverLetterContent(t.preview);
                    }}
                    className={`w-full text-left p-4 rounded-xl border transition-all ${
                      selectedTemplate === t.id
                        ? "bg-primary/10 border-primary/30 shadow-glow-primary"
                        : "bg-white/[0.03] border-white/5 hover:bg-white/[0.06]"
                    }`}
                  >
                    <p className="text-sm font-medium text-white">{t.name}</p>
                    <p className="text-xs text-muted-foreground mt-1">{t.preview}</p>
                  </motion.button>
                ))}
              </div>
            </div>
            <div className="rounded-2xl border border-white/5 bg-black/40 backdrop-blur-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-primary" />
                  AI Preview
                </h2>
                <div className="flex gap-2">
                  <button className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-xs text-muted-foreground hover:text-white transition-colors">Regenerate</button>
                  <button className="px-3 py-1.5 rounded-lg bg-primary/20 hover:bg-primary/30 text-xs text-primary transition-colors">Save</button>
                </div>
              </div>
              <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 min-h-[300px]">
                {showCoverLetter ? (
                  <div className="text-sm text-white/80 whitespace-pre-wrap leading-relaxed">
                    {coverLetterContent}
                    {"\n\nI am writing to express my strong interest in the position. With extensive experience in building scalable applications and leading cross-functional teams, I am confident in my ability to deliver immediate impact.\n\nThroughout my career, I have focused on driving measurable outcomes through technical excellence and strategic thinking. I am particularly drawn to your company's mission and would be honored to contribute.\n\nThank you for your time and consideration.\n\nBest regards,\n[Your Name]"}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
                    <FileText className="h-12 w-12 mb-3 opacity-30" />
                    <p className="text-sm">Select a template to preview</p>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === "settings" && (
          <motion.div
            key="settings"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-6"
          >
            <div className="rounded-2xl border border-white/5 bg-black/40 backdrop-blur-xl p-6">
              <h2 className="text-lg font-semibold text-white flex items-center gap-2 mb-6">
                <Settings className="h-5 w-5 text-primary" />
                Automation Settings
              </h2>
              <div className="space-y-5">
                {[
                  { label: "Daily Application Limit", desc: "Maximum applications per day", value: 50, unit: "apps" },
                  { label: "Minimum Match Score", desc: "Only apply if match score exceeds", value: 70, unit: "%" },
                  { label: "Max Retries per Job", desc: "Number of retry attempts", value: 3, unit: "retries" },
                  { label: "Auto-generate Cover Letters", desc: "AI generates personalized letters", value: true },
                ].map((s) => (
                  <div key={s.label} className="flex items-center justify-between p-3 rounded-xl bg-white/[0.03] border border-white/5">
                    <div>
                      <p className="text-sm font-medium text-white">{s.label}</p>
                      <p className="text-xs text-muted-foreground">{s.desc}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      {typeof s.value === "boolean" ? (
                        <div className={`w-10 h-6 rounded-full transition-colors ${s.value ? "bg-primary" : "bg-white/10"} relative cursor-pointer`}>
                          <div className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-all ${s.value ? "left-5" : "left-1"}`} />
                        </div>
                      ) : (
                        <span className="text-sm font-medium text-white">{s.value}{s.unit ? ` ${s.unit}` : ""}</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="rounded-2xl border border-white/5 bg-black/40 backdrop-blur-xl p-6">
              <h2 className="text-lg font-semibold text-white flex items-center gap-2 mb-6">
                <Shield className="h-5 w-5 text-primary" />
                Safe Apply Rules
              </h2>
              <div className="space-y-4">
                {[
                  { rule: "Rate limit: 5 applications per 10 minutes", active: true },
                  { rule: "Maximum 50 applications per day", active: true },
                  { rule: "Only apply to jobs with match score > 70%", active: true },
                  { rule: "Skip jobs requiring manual screening questions", active: false },
                  { rule: "Require confirmation before each application", active: true },
                  { rule: "Auto-retry failed applications (max 3)", active: true },
                  { rule: "CAPTCHA detection — pause on detection", active: true },
                  { rule: "Session rotation every 50 applications", active: false },
                ].map((r) => (
                  <div key={r.rule} className="flex items-center gap-3">
                    <div className={`p-0.5 rounded-full ${r.active ? "bg-emerald-500/20 text-emerald-400" : "bg-white/5 text-muted-foreground"}`}>
                      {r.active ? <CheckCircle2 className="h-4 w-4" /> : <XCircle className="h-4 w-4" />}
                    </div>
                    <span className={`text-sm ${r.active ? "text-white/80" : "text-muted-foreground"}`}>{r.rule}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
