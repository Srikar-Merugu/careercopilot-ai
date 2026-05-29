"use client";

import { BarChart3, TrendingUp, Users, Brain, Bot } from "lucide-react";

export default function AdminAnalytics() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <BarChart3 className="h-6 w-6 text-primary" />
          Platform Analytics
        </h1>
        <p className="text-sm text-muted-foreground mt-1">Usage metrics and growth trends</p>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Daily Active Users", value: "342", icon: Users },
          { label: "AI Requests/Day", value: "1,247", icon: Brain },
          { label: "Applications/Day", value: "89", icon: Bot },
          { label: "Conversion Rate", value: "12.4%", icon: TrendingUp },
        ].map((s) => (
          <div key={s.label} className="rounded-2xl border border-white/5 bg-black/40 backdrop-blur-xl p-5">
            <div className="flex items-center gap-2 mb-2">
              <s.icon className="h-4 w-4 text-primary" />
              <span className="text-xs text-muted-foreground">{s.label}</span>
            </div>
            <p className="text-2xl font-bold text-white">{s.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
