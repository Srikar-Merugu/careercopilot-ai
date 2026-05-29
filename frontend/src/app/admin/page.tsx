"use client";

import { motion } from "framer-motion";
import { Shield, Users, CreditCard, Activity, Brain, Bot, AlertTriangle } from "lucide-react";

const stats = [
  { label: "Total Users", value: "1,247", change: "+12%", icon: Users, color: "text-primary", bg: "bg-primary/10" },
  { label: "Active Subs", value: "342", change: "+8%", icon: CreditCard, color: "text-emerald-400", bg: "bg-emerald-500/10" },
  { label: "AI Requests", value: "28.5K", change: "+22%", icon: Brain, color: "text-violet-400", bg: "bg-violet-500/10" },
  { label: "Automations", value: "1,893", change: "+15%", icon: Bot, color: "text-cyan-400", bg: "bg-cyan-500/10" },
  { label: "API Errors", value: "43", change: "-5%", icon: AlertTriangle, color: "text-amber-400", bg: "bg-amber-500/10" },
  { label: "Uptime", value: "99.97%", change: "+0.02%", icon: Activity, color: "text-emerald-400", bg: "bg-emerald-500/10" },
];

export default function AdminDashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <Shield className="h-6 w-6 text-primary" />
          Admin Dashboard
        </h1>
        <p className="text-sm text-muted-foreground mt-1">System overview and platform management</p>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="rounded-2xl border border-white/5 bg-black/40 backdrop-blur-xl p-5"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wider">{stat.label}</p>
                <p className="text-2xl font-bold text-white mt-1">{stat.value}</p>
                <p className="text-xs text-emerald-400 mt-0.5">{stat.change} this week</p>
              </div>
              <div className={`p-2.5 rounded-xl ${stat.bg}`}>
                <stat.icon className={`h-5 w-5 ${stat.color}`} />
              </div>
            </div>
          </motion.div>
        ))}
      </div>
      <div className="rounded-2xl border border-white/5 bg-black/40 backdrop-blur-xl p-6">
        <h2 className="text-lg font-semibold text-white flex items-center gap-2 mb-4">
          <Activity className="h-5 w-5 text-primary" />
          System Health
        </h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: "Backend", status: "Healthy", color: "text-emerald-400" },
            { label: "Database", status: "Connected", color: "text-emerald-400" },
            { label: "Redis", status: "Available", color: "text-emerald-400" },
            { label: "AI Service", status: "Operational", color: "text-emerald-400" },
            { label: "Telegram Bot", status: "Active", color: "text-emerald-400" },
            { label: "Automation", status: "Running", color: "text-primary" },
            { label: "Stripe", status: "Connected", color: "text-emerald-400" },
            { label: "Sentry", status: "Active", color: "text-emerald-400" },
          ].map((s) => (
            <div key={s.label} className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.03] border border-white/5">
              <span className="relative flex h-2.5 w-2.5">
                <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${s.color.replace("text-", "bg-")}`} />
                <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${s.color.replace("text-", "bg-")}`} />
              </span>
              <div>
                <p className="text-sm text-white">{s.label}</p>
                <p className={`text-xs ${s.color}`}>{s.status}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
