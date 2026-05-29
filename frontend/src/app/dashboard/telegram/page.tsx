"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Smartphone, Send, Bell, CheckCheck, Radio,
  Bot, Zap, RefreshCw,
  Clock, Activity, ChevronRight,
  Sparkles, Globe, Shield,
} from "lucide-react";

const connectionStatus = {
  connected: false,
  botUsername: "CareerCopilotBot",
  qrLink: "https://t.me/CareerCopilotBot",
};

const activityItems = [
  { action: "Daily job alert sent", time: "2 min ago", type: "alert" },
  { action: "AI match found: Senior Frontend at Swiggy", time: "15 min ago", type: "match" },
  { action: "Resume analyzed via Telegram", time: "1 hr ago", type: "resume" },
  { action: "Interview reminder: Google technical", time: "3 hrs ago", type: "reminder" },
  { action: "Career tip delivered", time: "6 hrs ago", type: "tip" },
  { action: "Sync completed: 3 jobs saved", time: "12 hrs ago", type: "sync" },
];

const alertTypes = [
  { id: "daily_jobs", label: "Daily Job Alerts", desc: "Top matches every morning & evening" },
  { id: "instant_matches", label: "Instant Matches", desc: "Real-time alerts for high-scoring jobs" },
  { id: "trending", label: "Trending Jobs", desc: "Weekly trending opportunities" },
  { id: "interview_reminders", label: "Interview Reminders", desc: "Reminders before scheduled interviews" },
  { id: "career_tips", label: "AI Career Tips", desc: "Daily tips from CareerCopilot AI" },
];

const commandList = [
  { cmd: "/start", desc: "Launch CareerCopilot" },
  { cmd: "/uploadresume", desc: "Upload resume for AI analysis" },
  { cmd: "/myjobs", desc: "View AI-matched jobs" },
  { cmd: "/recommendations", desc: "Personalized AI recommendations" },
  { cmd: "/interviewprep", desc: "Practice with AI questions" },
  { cmd: "/savedjobs", desc: "View your saved jobs" },
  { cmd: "/atsscore", desc: "Check your ATS score" },
  { cmd: "/settings", desc: "Configure bot preferences" },
];

export default function TelegramPage() {
  const [activeAlertTab, setActiveAlertTab] = useState("daily_jobs");
  const [showCommands, setShowCommands] = useState(false);

  return (
    <div className="space-y-6 pb-12">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2.5">
            <Smartphone className="h-6 w-6 text-primary" />
            Telegram Bot
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Your AI career assistant on Telegram — jobs, alerts, analysis & more
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
            </span>
            <span className="text-xs font-medium text-emerald-400">Not Connected</span>
          </div>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => window.open(connectionStatus.qrLink, "_blank")}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary/10 hover:bg-primary/20 border border-primary/20 text-primary text-sm font-medium transition-colors"
          >
            <Send className="h-4 w-4" />
            Start Bot
          </motion.button>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="rounded-2xl border border-white/5 bg-black/40 backdrop-blur-xl p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                <Radio className="h-5 w-5 text-primary" />
                Live Activity Feed
              </h2>
              <motion.button
                whileHover={{ rotate: 180 }}
                transition={{ duration: 0.3 }}
                className="p-2 rounded-lg hover:bg-white/5 text-muted-foreground hover:text-white"
              >
                <RefreshCw className="h-4 w-4" />
              </motion.button>
            </div>
            <div className="space-y-1">
              {activityItems.map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/5 transition-colors group"
                >
                  <div className={`p-1.5 rounded-lg ${
                    item.type === "alert" ? "bg-blue-500/10 text-blue-400" :
                    item.type === "match" ? "bg-emerald-500/10 text-emerald-400" :
                    item.type === "resume" ? "bg-violet-500/10 text-violet-400" :
                    item.type === "reminder" ? "bg-amber-500/10 text-amber-400" :
                    item.type === "tip" ? "bg-cyan-500/10 text-cyan-400" :
                    "bg-primary/10 text-primary"
                  }`}>
                    {item.type === "alert" ? <Bell className="h-3.5 w-3.5" /> :
                     item.type === "match" ? <Zap className="h-3.5 w-3.5" /> :
                     item.type === "resume" ? <Activity className="h-3.5 w-3.5" /> :
                     item.type === "reminder" ? <Clock className="h-3.5 w-3.5" /> :
                     item.type === "tip" ? <Sparkles className="h-3.5 w-3.5" /> :
                     <RefreshCw className="h-3.5 w-3.5" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-white/90 truncate">{item.action}</p>
                  </div>
                  <span className="text-xs text-muted-foreground shrink-0">{item.time}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="rounded-2xl border border-white/5 bg-black/40 backdrop-blur-xl p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                <Bell className="h-5 w-5 text-primary" />
                Alert Preferences
              </h2>
              <span className="text-xs text-muted-foreground bg-white/5 px-2.5 py-1 rounded-full">
                Configured in bot
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {alertTypes.map((alert, i) => (
                <motion.button
                  key={alert.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  onClick={() => setActiveAlertTab(alert.id)}
                  className={`text-left p-4 rounded-xl border transition-all ${
                    activeAlertTab === alert.id
                      ? "bg-primary/10 border-primary/30 shadow-glow-primary"
                      : "bg-white/[0.03] border-white/5 hover:bg-white/[0.06]"
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-sm font-medium text-white">{alert.label}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{alert.desc}</p>
                    </div>
                    <div className={`p-1 rounded-md ${
                      activeAlertTab === alert.id ? "bg-primary/20" : "bg-white/5"
                    }`}>
                      <CheckCheck className={`h-3.5 w-3.5 ${
                        activeAlertTab === alert.id ? "text-primary" : "text-muted-foreground"
                      }`} />
                    </div>
                  </div>
                </motion.button>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="rounded-2xl border border-white/5 bg-black/40 backdrop-blur-xl p-6"
          >
            <button
              onClick={() => setShowCommands(!showCommands)}
              className="flex items-center justify-between w-full"
            >
              <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                <Bot className="h-5 w-5 text-primary" />
                Bot Commands
              </h2>
              <ChevronRight className={`h-5 w-5 text-muted-foreground transition-transform ${showCommands ? "rotate-90" : ""}`} />
            </button>
            {showCommands && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-2"
              >
                {commandList.map((cmd) => (
                  <div
                    key={cmd.cmd}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-white/[0.03] border border-white/5"
                  >
                    <code className="text-xs font-mono text-primary bg-primary/10 px-2 py-0.5 rounded">
                      {cmd.cmd}
                    </code>
                    <span className="text-xs text-muted-foreground">{cmd.desc}</span>
                  </div>
                ))}
              </motion.div>
            )}
          </motion.div>
        </div>

        <div className="space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="rounded-2xl border border-white/5 bg-black/40 backdrop-blur-xl p-6 text-center"
          >
            <div className="relative mx-auto mb-4 w-20 h-20 flex items-center justify-center">
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-primary/30 to-violet-500/30 animate-pulse" />
              <div className="absolute inset-1 rounded-full bg-gradient-to-br from-primary/20 to-violet-500/20 backdrop-blur-xl" />
              <div className="relative flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-br from-primary to-violet-600">
                <Smartphone className="h-7 w-7 text-white" />
              </div>
              <span className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-amber-500 border-2 border-black flex items-center justify-center">
                <span className="text-[10px] text-white font-bold">!</span>
              </span>
            </div>
            <h3 className="text-base font-semibold text-white mb-1">Connect Telegram</h3>
            <p className="text-xs text-muted-foreground mb-4">
              Link your Telegram to receive AI job alerts, interview reminders, and career tips in real time
            </p>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => window.open(connectionStatus.qrLink, "_blank")}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-primary hover:bg-primary/90 text-white text-sm font-medium transition-colors shadow-glow-primary"
            >
              <Send className="h-4 w-4" />
              Connect with Telegram
            </motion.button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="rounded-2xl border border-white/5 bg-black/40 backdrop-blur-xl p-6"
          >
            <h3 className="text-sm font-semibold text-white flex items-center gap-2 mb-4">
              <Shield className="h-4 w-4 text-primary" />
              Integration Status
            </h3>
            <div className="space-y-3">
              {[
                { label: "Bot Status", value: "Active", color: "text-emerald-400" },
                { label: "Webhook", value: "Secure", color: "text-emerald-400" },
                { label: "Sync Frequency", value: "Real-time", color: "text-primary" },
                { label: "Encryption", value: "TLS 1.3", color: "text-cyan-400" },
                { label: "Rate Limit", value: "30 req/min", color: "text-amber-400" },
              ].map((item) => (
                <div key={item.label} className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">{item.label}</span>
                  <span className={`text-xs font-medium ${item.color}`}>{item.value}</span>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="rounded-2xl border border-white/5 bg-black/40 backdrop-blur-xl p-6"
          >
            <h3 className="text-sm font-semibold text-white flex items-center gap-2 mb-4">
              <Globe className="h-4 w-4 text-primary" />
              Quick Stats
            </h3>
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: "Alerts Sent", value: "847", change: "+12%" },
                { label: "Active Users", value: "234", change: "+8%" },
                { label: "Jobs Synced", value: "1,892", change: "+15%" },
                { label: "Resumes Analyzed", value: "156", change: "+22%" },
              ].map((stat) => (
                <div key={stat.label} className="p-3 rounded-xl bg-white/[0.03] border border-white/5">
                  <p className="text-[10px] text-muted-foreground uppercase tracking-wider">{stat.label}</p>
                  <p className="text-lg font-bold text-white mt-0.5">{stat.value}</p>
                  <p className="text-[10px] text-emerald-400">{stat.change}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
