"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  CreditCard, Crown, Sparkles, Check, Zap,
  BarChart3,
} from "lucide-react";
import { useSubscription, useUpgradeSubscription } from "@/hooks/use-dashboard";
import { useToast } from "@/providers/toast-provider";

const plans = [
  {
    name: "Free", monthly: "$0", yearly: "$0", icon: Sparkles,
    desc: "Get started with basic AI features",
    features: ["5 AI matches/month", "1 resume analysis", "Basic job search", "Save up to 10 jobs"],
    popular: false,
  },
  {
    name: "Pro", monthly: "$19", yearly: "$190", icon: Zap,
    desc: "For serious job seekers accelerating their career",
    features: [
      "Unlimited AI matches", "10 resume analyses/month", "Advanced semantic search",
      "Unlimited saved jobs", "Skill gap analysis", "AI interview prep", "Application tracking",
    ],
    popular: true,
  },
  {
    name: "Premium", monthly: "$49", yearly: "$490", icon: Crown,
    desc: "The ultimate career acceleration suite",
    features: [
      "Everything in Pro", "Unlimited resume analyses", "Priority AI matching",
      "Career roadmap generation", "Personal AI career coach", "Telegram integration",
      "API access", "Priority support",
    ],
    popular: false,
  },
];

const usageStats = [
  { label: "AI Matches Used", current: 142, total: "Unlimited", color: "bg-primary" },
  { label: "Resume Analyses", current: 8, total: 10, color: "bg-emerald-400" },
  { label: "Saved Jobs", current: 18, total: "Unlimited", color: "bg-amber-400" },
];

export default function BillingPage() {
  const { data: subscription } = useSubscription();
  const upgradeSub = useUpgradeSubscription();
  const { toast } = useToast();
  const [annual, setAnnual] = useState(false);

  const handleUpgrade = async (plan: string) => {
    try {
      await upgradeSub.mutateAsync(plan);
      toast("Plan Upgraded", `You're now on the ${plan} plan!`, "success");
    } catch {
      toast("Error", "Failed to upgrade plan.", "error");
    }
  };

  return (
    <div className="space-y-6 pb-12">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold text-white flex items-center gap-2.5">
          <CreditCard className="h-6 w-6 text-primary" />
          Billing & Subscriptions
        </h1>
        <p className="text-sm text-[#a0aec0] mt-0.5">Manage your plan, usage, and billing information</p>
      </motion.div>

      {/* Current Plan */}
      {subscription && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="rounded-xl border border-white/10 bg-gradient-to-br from-primary/5 to-cyan-500/5 backdrop-blur-xl p-5"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-primary/20 border border-primary/30 flex items-center justify-center">
                {subscription.plan === "premium" ? <Crown className="h-5 w-5 text-primary" /> :
                 subscription.plan === "pro" ? <Zap className="h-5 w-5 text-primary" /> :
                 <Sparkles className="h-5 w-5 text-primary" />}
              </div>
              <div>
                <h3 className="text-white font-semibold capitalize">{subscription.plan} Plan</h3>
                <p className="text-xs text-[#a0aec0]">
                  {subscription.status} · Renews {subscription.renewal_date ? new Date(subscription.renewal_date).toLocaleDateString() : "N/A"}
                </p>
              </div>
            </div>
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${
              subscription.status === "active" ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" :
              "bg-amber-500/10 text-amber-400 border border-amber-500/20"
            }`}>
              {subscription.status}
            </span>
          </div>
        </motion.div>
      )}

      {/* Usage */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}
        className="rounded-xl border border-white/10 bg-[#0a0f2e]/60 backdrop-blur-xl p-5"
      >
        <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
          <BarChart3 className="h-4 w-4 text-primary" />
          Usage This Month
        </h3>
        <div className="grid sm:grid-cols-3 gap-4">
          {usageStats.map((stat, i) => (
            <div key={i} className="p-3 rounded-lg bg-white/5 border border-white/5">
              <p className="text-xs text-[#a0aec0] mb-1">{stat.label}</p>
              <div className="flex items-baseline gap-1">
                <span className="text-lg font-bold text-white">{stat.current}</span>
                <span className="text-xs text-[#4a5568]">/ {stat.total}</span>
              </div>
              <div className="mt-2 h-1.5 rounded-full bg-white/5 overflow-hidden">
                <div className={`h-full rounded-full ${stat.color}`} style={{ width: `${Math.min(100, (stat.current / (typeof stat.total === "number" ? stat.total : 999)) * 100)}%` }} />
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Plan Toggle */}
      <div className="flex items-center justify-center gap-3">
        <span className={`text-sm font-medium ${!annual ? "text-white" : "text-[#a0aec0]"}`}>Monthly</span>
        <button
          onClick={() => setAnnual(!annual)}
          className={`relative h-7 w-12 rounded-full transition-all ${annual ? "bg-primary" : "bg-white/10"}`}
        >
          <div className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow transition-all ${annual ? "left-6" : "left-1"}`} />
        </button>
        <span className={`text-sm font-medium ${annual ? "text-white" : "text-[#a0aec0]"}`}>
          Annual <span className="text-[10px] text-emerald-400">Save 20%</span>
        </span>
      </div>

      {/* Pricing Cards */}
      <div className="grid md:grid-cols-3 gap-4">
        {plans.map((plan, i) => {
          const Icon = plan.icon;
          const isCurrent = subscription?.plan === plan.name.toLowerCase();
          return (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              className={`relative rounded-xl border p-5 transition-all ${
                plan.popular
                  ? "border-primary/40 bg-gradient-to-b from-primary/10 to-[#0a0f2e]/60"
                  : "border-white/10 bg-[#0a0f2e]/60"
              } hover:border-primary/30`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-primary text-[10px] font-bold text-white shadow-glow-sm">
                  Most Popular
                </div>
              )}
              <div className="flex items-center gap-2 mb-3">
                <div className={`h-8 w-8 rounded-lg flex items-center justify-center ${
                  plan.popular ? "bg-primary/20 border border-primary/30" : "bg-white/5 border border-white/10"
                }`}>
                  <Icon className={`h-4 w-4 ${plan.popular ? "text-primary" : "text-[#a0aec0]"}`} />
                </div>
                <div>
                  <h3 className="text-white font-semibold">{plan.name}</h3>
                  <p className="text-[10px] text-[#a0aec0]">{plan.desc}</p>
                </div>
              </div>
              <div className="mb-4">
                <span className="text-3xl font-bold text-white">{annual ? plan.yearly : plan.monthly}</span>
                <span className="text-xs text-[#4a5568]">{annual ? "/year" : "/month"}</span>
              </div>
              <ul className="space-y-2 mb-5">
                {plan.features.map((f, j) => (
                  <li key={j} className="flex items-start gap-2 text-xs text-[#a0aec0]">
                    <Check className="h-3.5 w-3.5 text-emerald-400 mt-0.5 shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
              <button
                onClick={() => handleUpgrade(plan.name.toLowerCase())}
                disabled={isCurrent}
                className={`w-full py-2.5 rounded-xl text-sm font-medium transition-all ${
                  isCurrent
                    ? "bg-white/5 text-[#4a5568] cursor-not-allowed"
                    : plan.popular
                      ? "bg-primary hover:bg-primary/90 text-white shadow-glow-sm"
                      : "bg-white/5 text-white hover:bg-white/10 border border-white/10"
                }`}
              >
                {isCurrent ? "Current Plan" : `Upgrade to ${plan.name}`}
              </button>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
