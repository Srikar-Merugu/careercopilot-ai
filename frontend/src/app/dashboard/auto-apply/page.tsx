"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Zap, Send, FileText, CheckCircle2, XCircle, Clock,
  TrendingUp, Sparkles, Play, Pause, Settings,
  Activity, BarChart3, Bot, RefreshCw,
  Globe, Loader2, AlertCircle, Edit3, Download,
} from "lucide-react";
import { autoApplyService, QuickStats, Application, CoverLetter, AutomationAnalytics, QueueStatus, AutomationSettings, QueueItem } from "@/services/auto-apply-service";

export default function AutoApplyPage() {
  const [activeTab, setActiveTab] = useState("overview");
  const [automationRunning, setAutomationRunning] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [pipelineRunning, setPipelineRunning] = useState(false);

  const [stats, setStats] = useState<QuickStats | null>(null);
  const [analytics, setAnalytics] = useState<AutomationAnalytics | null>(null);
  const [applications, setApplications] = useState<Application[]>([]);
  const [coverLetters, setCoverLetters] = useState<CoverLetter[]>([]);
  const [queueStatus, setQueueStatus] = useState<QueueStatus | null>(null);
  const [queueItems, setQueueItems] = useState<QueueItem[]>([]);
  const [settings, setSettings] = useState<AutomationSettings | null>(null);
  const [platformStatus, setPlatformStatus] = useState<Record<string, any> | null>(null);
  const [pipelinePhase, setPipelinePhase] = useState<string>("");

  const [selectedCoverLetter, setSelectedCoverLetter] = useState<CoverLetter | null>(null);
  const [editingCoverLetter, setEditingCoverLetter] = useState(false);
  const [coverLetterEditContent, setCoverLetterEditContent] = useState("");

  const fetchAll = useCallback(async () => {
    try {
      const [s, a, apps, cls, qs, qi, pl, ps] = await Promise.allSettled([
        autoApplyService.getStats(),
        autoApplyService.getAnalytics(),
        autoApplyService.getApplications(),
        autoApplyService.getCoverLetters(),
        autoApplyService.getQueueStatus(),
        autoApplyService.getQueue(),
        autoApplyService.getPlatformStatus(),
        autoApplyService.getPipelineStatus(),
      ]);

      if (s.status === "fulfilled") setStats(s.value);
      if (a.status === "fulfilled") setAnalytics(a.value);
      if (apps.status === "fulfilled") setApplications(apps.value);
      if (cls.status === "fulfilled") setCoverLetters(cls.value);
      if (qs.status === "fulfilled") setQueueStatus(qs.value);
      if (qi.status === "fulfilled") setQueueItems(qi.value);
      if (pl.status === "fulfilled") {
        setPlatformStatus(pl.value);
        if (pl.value.pipeline_active) {
          setAutomationRunning(true);
        }
      }
      if (ps.status === "fulfilled") {
        setPipelinePhase(ps.value.message || "");
        if (ps.value.status === "running") {
          setAutomationRunning(true);
        } else if (ps.value.status === "interrupted") {
          setAutomationRunning(false);
        }
      }
    } catch (e) {
      setError("Failed to load automation data");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  useEffect(() => {
    if (!automationRunning) return;
    const interval = setInterval(() => {
      autoApplyService.getPipelineStatus().then((ps) => {
        setPipelinePhase(ps.message || "");
        if (ps.status === "completed" || ps.status === "failed" || ps.status === "interrupted") {
          setAutomationRunning(false);
          fetchAll();
        }
      }).catch(() => {});
    }, 3000);
    return () => clearInterval(interval);
  }, [automationRunning, fetchAll]);

  const handleStartPipeline = async () => {
    setPipelineRunning(true);
    try {
      const result = await autoApplyService.startPipeline();
      setAutomationRunning(true);
      setTimeout(() => fetchAll(), 2000);
    } catch (e: any) {
      setError(e?.error?.message || "Failed to start pipeline");
    } finally {
      setPipelineRunning(false);
    }
  };

  const handleSaveCoverLetter = async (letter: CoverLetter) => {
    try {
      const updated = await autoApplyService.updateCoverLetter(letter.id, {
        content: coverLetterEditContent,
      });
      setSelectedCoverLetter(updated);
      setCoverLetters(prev => prev.map(l => l.id === updated.id ? updated : l));
      setEditingCoverLetter(false);
    } catch { }
  };

  const handleRegenerateCoverLetter = async (letter: CoverLetter) => {
    try {
      const updated = await autoApplyService.generateCoverLetter({
        company: letter.company,
        role: letter.role,
        tone: letter.tone,
      });
      setSelectedCoverLetter(updated);
      setCoverLetters(prev => prev.map(l => l.id === updated.id ? updated : l));
    } catch { }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">Loading automation data...</p>
        </div>
      </div>
    );
  }

  const statCards = stats ? [
    { label: "Applied Today", value: stats.today_applications.toString(), change: `${stats.today_applications > 0 ? '+' : ''}${stats.today_applications}`, icon: Send, color: "text-primary", bg: "bg-primary/10" },
    { label: "Success Rate", value: `${stats.success_rate}%`, change: "", icon: TrendingUp, color: "text-emerald-400", bg: "bg-emerald-500/10" },
    { label: "Failed", value: stats.failed_count.toString(), change: "", icon: XCircle, color: "text-rose-400", bg: "bg-rose-500/10" },
    { label: "In Queue", value: stats.queue_count.toString(), change: "--", icon: Clock, color: "text-amber-400", bg: "bg-amber-500/10" },
  ] : [];

  return (
    <div className="space-y-6 pb-12">
      {error && (
        <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-sm">
          <AlertCircle className="h-4 w-4 shrink-0" />
          {error}
          <button onClick={() => setError("")} className="ml-auto text-xs hover:text-rose-300">Dismiss</button>
        </div>
      )}

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
            onClick={handleStartPipeline}
            disabled={pipelineRunning || automationRunning}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all disabled:opacity-50 ${
              automationRunning
                ? "bg-emerald-500/20 border border-emerald-500/30 text-emerald-400"
                : "bg-primary/10 border border-primary/20 text-primary hover:bg-primary/20"
            }`}
          >
            {pipelineRunning ? (
              <><Loader2 className="h-4 w-4 animate-spin" /> Starting...</>
            ) : automationRunning ? (
              <><Activity className="h-4 w-4" /> {pipelinePhase ? pipelinePhase.replace(/_/g, ' ') : "Running"}</>
            ) : (
              <><Play className="h-4 w-4" /> Start Automation</>
            )}
          </motion.button>
          <motion.button
            whileHover={{ rotate: 180 }}
            transition={{ duration: 0.3 }}
            onClick={fetchAll}
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
              {statCards.map((stat, i) => (
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
                      {stat.change && <p className="text-xs text-emerald-400 mt-0.5">{stat.change} today</p>}
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
                  <span className="text-xs text-muted-foreground bg-white/5 px-2.5 py-1 rounded-full">{applications.length} total</span>
                </div>
                <div className="space-y-1">
                  {applications.length === 0 ? (
                    <p className="text-sm text-muted-foreground text-center py-8">No applications yet. Start automation to begin.</p>
                  ) : applications.slice(0, 6).map((app, i) => (
                    <motion.div
                      key={app.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/5 transition-colors"
                    >
                      <div className={`p-1.5 rounded-lg ${
                        app.status === "submitted" ? "bg-emerald-500/10 text-emerald-400" :
                        app.status === "applying" ? "bg-primary/10 text-primary" :
                        app.status === "queued" || app.status === "pending" ? "bg-amber-500/10 text-amber-400" :
                        app.status === "failed" ? "bg-rose-500/10 text-rose-400" :
                        "bg-white/5 text-muted-foreground"
                      }`}>
                        {app.status === "submitted" ? <CheckCircle2 className="h-3.5 w-3.5" /> :
                         app.status === "applying" ? <Activity className="h-3.5 w-3.5" /> :
                         app.status === "queued" || app.status === "pending" ? <Clock className="h-3.5 w-3.5" /> :
                         app.status === "failed" ? <XCircle className="h-3.5 w-3.5" /> :
                         <Clock className="h-3.5 w-3.5" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-white/90 truncate">
                          {app.job_title || "Unknown Role"} <span className="text-muted-foreground">at {app.company || "Unknown"}</span>
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        {app.match_score && (
                          <span className={`text-xs font-medium ${
                            app.match_score >= 80 ? "text-emerald-400" :
                            app.match_score >= 60 ? "text-amber-400" : "text-rose-400"
                          }`}>{Math.round(app.match_score)}%</span>
                        )}
                        <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                          app.status === "submitted" ? "bg-emerald-500/10 text-emerald-400" :
                          app.status === "failed" ? "bg-rose-500/10 text-rose-400" :
                          "bg-amber-500/10 text-amber-400"
                        }`}>{app.status}</span>
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
                  {platformStatus ? Object.entries(platformStatus).filter(([k]) => !['browser_connected', 'worker_running', 'pipeline_active'].includes(k)).map(([name, status]: [string, any], i) => (
                    <motion.div
                      key={name}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.03] border border-white/5"
                    >
                      <div className={`w-9 h-9 rounded-lg flex items-center justify-center text-xs font-bold uppercase ${
                        status.connected ? "bg-emerald-500/10 text-emerald-400" : "bg-amber-500/10 text-amber-400"
                      }`}>
                        {name.slice(0, 2)}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-white capitalize">{name}</p>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <span className={`w-1.5 h-1.5 rounded-full ${status.connected ? "bg-emerald-400" : "bg-amber-400"}`} />
                          <span className="text-xs text-muted-foreground">
                            {status.connected ? "Connected" : status.status === "auth_required" ? "Auth Required" : status.status}
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  )) : (
                    <div className="col-span-2 text-sm text-muted-foreground text-center py-4">Platform status unavailable</div>
                  )}
                </div>
                <div className="mt-3 flex gap-3">
                  <div className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs ${
                    platformStatus?.worker_running
                      ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                      : "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                  }`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${platformStatus?.worker_running ? "bg-emerald-400" : "bg-amber-400"}`} />
                    Worker: {platformStatus?.worker_running ? "Online" : "Idle"}
                  </div>
                  <div className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs ${
                    platformStatus?.browser_connected
                      ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                      : "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                  }`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${platformStatus?.browser_connected ? "bg-emerald-400" : "bg-amber-400"}`} />
                    Browser: {platformStatus?.browser_connected ? "Connected" : "Offline"}
                  </div>
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
                    { label: "Queued", value: queueStatus?.queued ?? 0, color: "text-amber-400" },
                    { label: "Processing", value: queueStatus?.processing ?? 0, color: "text-primary" },
                    { label: "Completed", value: queueStatus?.completed ?? 0, color: "text-emerald-400" },
                    { label: "Failed", value: queueStatus?.failed ?? 0, color: "text-rose-400" },
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
                  { label: "Success Rate", value: `${stats?.success_rate ?? 0}%`, pct: stats?.success_rate ?? 0 },
                  { label: "Avg Match", value: `${Math.round(analytics?.average_match_score ?? 0)}%`, pct: analytics?.average_match_score ?? 0 },
                  { label: "Interviews", value: `${analytics?.interview_count ?? 0}`, pct: Math.min((analytics?.interview_count ?? 0) * 20, 100) },
                  { label: "Total Apps", value: `${stats?.total_applications ?? 0}`, pct: Math.min((stats?.total_applications ?? 0) * 2, 100) },
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
            {applications.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                <Send className="h-12 w-12 mb-3 opacity-30" />
                <p className="text-sm">No applications submitted yet</p>
                <p className="text-xs mt-1">Start automation to begin applying</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-white/5">
                      <th className="text-left py-3 px-3 text-muted-foreground font-medium">Company</th>
                      <th className="text-left py-3 px-3 text-muted-foreground font-medium">Role</th>
                      <th className="text-left py-3 px-3 text-muted-foreground font-medium">Status</th>
                      <th className="text-left py-3 px-3 text-muted-foreground font-medium">Score</th>
                      <th className="text-left py-3 px-3 text-muted-foreground font-medium">Date</th>
                      <th className="text-right py-3 px-3 text-muted-foreground font-medium">Platform</th>
                    </tr>
                  </thead>
                  <tbody>
                    {applications.map((app) => (
                      <tr key={app.id} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                        <td className="py-3 px-3 text-white">{app.company || "-"}</td>
                        <td className="py-3 px-3 text-muted-foreground">{app.job_title || "-"}</td>
                        <td className="py-3 px-3">
                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            app.status === "submitted" ? "bg-emerald-500/10 text-emerald-400" :
                            app.status === "applying" ? "bg-primary/10 text-primary" :
                            app.status === "pending" || app.status === "queued" ? "bg-amber-500/10 text-amber-400" :
                            app.status === "failed" ? "bg-rose-500/10 text-rose-400" :
                            "bg-white/5 text-muted-foreground"
                          }`}>
                            {app.status === "submitted" && <CheckCircle2 className="h-3 w-3" />}
                            {app.status === "applying" && <Activity className="h-3 w-3" />}
                            {app.status === "pending" && <Clock className="h-3 w-3" />}
                            {app.status === "failed" && <XCircle className="h-3 w-3" />}
                            {app.status}
                          </span>
                        </td>
                        <td className="py-3 px-3">
                          {app.match_score ? (
                            <span className={`font-medium ${
                              app.match_score >= 80 ? "text-emerald-400" :
                              app.match_score >= 60 ? "text-amber-400" : "text-rose-400"
                            }`}>{Math.round(app.match_score)}%</span>
                          ) : <span className="text-muted-foreground">--</span>}
                        </td>
                        <td className="py-3 px-3 text-muted-foreground text-xs">
                          {new Date(app.created_at).toLocaleDateString()}
                        </td>
                        <td className="py-3 px-3 text-right text-xs text-muted-foreground capitalize">
                          {app.platform || "-"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
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
                AI Cover Letters
              </h2>
              {coverLetters.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
                  <FileText className="h-12 w-12 mb-3 opacity-30" />
                  <p className="text-sm">No cover letters generated yet</p>
                  <p className="text-xs mt-1">Generated automatically during automation pipeline</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {coverLetters.map((letter) => (
                    <motion.button
                      key={letter.id}
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                      onClick={() => { setSelectedCoverLetter(letter); setCoverLetterEditContent(letter.content); setEditingCoverLetter(false); }}
                      className={`w-full text-left p-4 rounded-xl border transition-all ${
                        selectedCoverLetter?.id === letter.id
                          ? "bg-primary/10 border-primary/30 shadow-glow-primary"
                          : "bg-white/[0.03] border-white/5 hover:bg-white/[0.06]"
                      }`}
                    >
                      <p className="text-sm font-medium text-white">{letter.role}</p>
                      <p className="text-xs text-muted-foreground mt-1">{letter.company} &middot; {new Date(letter.created_at).toLocaleDateString()}</p>
                    </motion.button>
                  ))}
                </div>
              )}
            </div>
            <div className="rounded-2xl border border-white/5 bg-black/40 backdrop-blur-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-primary" />
                  Preview
                </h2>
                <div className="flex gap-2">
                  {selectedCoverLetter && (
                    <>
                      <button
                        onClick={() => handleRegenerateCoverLetter(selectedCoverLetter)}
                        className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-xs text-muted-foreground hover:text-white transition-colors"
                      >
                        <RefreshCw className="h-3 w-3 inline mr-1" />
                        Regenerate
                      </button>
                      {editingCoverLetter ? (
                        <button
                          onClick={() => handleSaveCoverLetter(selectedCoverLetter)}
                          className="px-3 py-1.5 rounded-lg bg-primary/20 hover:bg-primary/30 text-xs text-primary transition-colors"
                        >
                          Save
                        </button>
                      ) : (
                        <button
                          onClick={() => setEditingCoverLetter(true)}
                          className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-xs text-muted-foreground hover:text-white transition-colors"
                        >
                          <Edit3 className="h-3 w-3 inline mr-1" />
                          Edit
                        </button>
                      )}
                    </>
                  )}
                </div>
              </div>
              <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 min-h-[300px]">
                {selectedCoverLetter ? (
                  editingCoverLetter ? (
                    <textarea
                      value={coverLetterEditContent}
                      onChange={(e) => setCoverLetterEditContent(e.target.value)}
                      className="w-full h-[280px] bg-transparent text-sm text-white/80 leading-relaxed resize-none focus:outline-none"
                    />
                  ) : (
                    <p className="text-sm text-white/80 whitespace-pre-wrap leading-relaxed">
                      {selectedCoverLetter.content}
                    </p>
                  )
                ) : (
                  <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
                    <FileText className="h-12 w-12 mb-3 opacity-30" />
                    <p className="text-sm">Select a cover letter to preview</p>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === "settings" && analytics && (
          <motion.div
            key="settings"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-6"
          >
            <SettingsPanel settings={analytics} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function SettingsPanel({ settings }: { settings: AutomationAnalytics }) {
  return (
    <div className="rounded-2xl border border-white/5 bg-black/40 backdrop-blur-xl p-6">
      <h2 className="text-lg font-semibold text-white flex items-center gap-2 mb-6">
        <Settings className="h-5 w-5 text-primary" />
        Automation Settings
      </h2>
      <p className="text-sm text-muted-foreground mb-4">
        Configure automation preferences via the API. Settings persist to your account.
      </p>
      <div className="space-y-5">
        <div className="flex items-center justify-between p-3 rounded-xl bg-white/[0.03] border border-white/5">
          <div>
            <p className="text-sm font-medium text-white">Average Match Score</p>
            <p className="text-xs text-muted-foreground">Current average across all applications</p>
          </div>
          <span className={`text-lg font-bold ${
            settings.average_match_score >= 70 ? "text-emerald-400" : "text-amber-400"
          }`}>{Math.round(settings.average_match_score)}%</span>
        </div>
        <div className="flex items-center justify-between p-3 rounded-xl bg-white/[0.03] border border-white/5">
          <div>
            <p className="text-sm font-medium text-white">Total Applications</p>
            <p className="text-xs text-muted-foreground">Lifetime application count</p>
          </div>
          <span className="text-lg font-bold text-white">{settings.total_applications}</span>
        </div>
        <div className="flex items-center justify-between p-3 rounded-xl bg-white/[0.03] border border-white/5">
          <div>
            <p className="text-sm font-medium text-white">Success Rate</p>
            <p className="text-xs text-muted-foreground">Submitted vs total applications</p>
          </div>
          <span className={`text-lg font-bold ${
            settings.success_rate >= 70 ? "text-emerald-400" : "text-amber-400"
          }`}>{Math.round(settings.success_rate)}%</span>
        </div>
        <div className="flex items-center justify-between p-3 rounded-xl bg-white/[0.03] border border-white/5">
          <div>
            <p className="text-sm font-medium text-white">Interviews & Offers</p>
            <p className="text-xs text-muted-foreground">Real interview and offer tracking</p>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium text-primary">{settings.interview_count} interviews</span>
            <span className="text-sm font-medium text-emerald-400">{settings.offer_count} offers</span>
          </div>
        </div>
      </div>
    </div>
  );
}
