"use client";

import { motion } from "framer-motion";
import { CreditCard, TrendingUp } from "lucide-react";

const planData = [
  { plan: "Free", users: 905, revenue: 0, pct: 72 },
  { plan: "Pro", users: 215, revenue: 214785, pct: 17 },
  { plan: "Premium", users: 127, revenue: 317373, pct: 11 },
];

export default function AdminSubscriptions() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <CreditCard className="h-6 w-6 text-primary" />
          Subscription Management
        </h1>
        <p className="text-sm text-muted-foreground mt-1">Track plans, revenue, and upgrades</p>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {planData.map((p) => (
          <motion.div
            key={p.plan}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-2xl border border-white/5 bg-black/40 backdrop-blur-xl p-6"
          >
            <h3 className="text-sm font-semibold text-white mb-3">{p.plan}</h3>
            <p className="text-3xl font-bold text-white">{p.users}</p>
            <p className="text-xs text-muted-foreground mt-1">users</p>
            {p.revenue > 0 && (
              <p className="text-xs text-emerald-400 mt-2">₹{p.revenue.toLocaleString()}/mo</p>
            )}
            <div className="mt-4 h-2 rounded-full bg-white/5 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${p.pct}%` }}
                className="h-full rounded-full bg-gradient-to-r from-primary to-violet-500"
              />
            </div>
            <p className="text-xs text-muted-foreground mt-1">{p.pct}% of users</p>
          </motion.div>
        ))}
      </div>
      <div className="rounded-2xl border border-white/5 bg-black/40 backdrop-blur-xl p-6">
        <h2 className="text-lg font-semibold text-white flex items-center gap-2 mb-4">
          <TrendingUp className="h-5 w-5 text-primary" />
          Monthly Recurring Revenue
        </h2>
        <p className="text-4xl font-bold text-white">₹532,158</p>
        <p className="text-xs text-emerald-400 mt-1">+18.5% from last month</p>
      </div>
    </div>
  );
}
