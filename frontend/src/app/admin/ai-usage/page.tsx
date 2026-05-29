"use client";

import { Brain } from "lucide-react";

export default function AdminAIUsage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <Brain className="h-6 w-6 text-primary" />
          AI Usage Monitoring
        </h1>
        <p className="text-sm text-muted-foreground mt-1">Track AI service consumption and costs</p>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total AI Requests", value: "28,547" },
          { label: "Failed Requests", value: "143", color: "text-rose-400" },
          { label: "Avg Response Time", value: "1.2s" },
          { label: "Estimated Cost", value: "₹4,892" },
        ].map((s) => (
          <div key={s.label} className="rounded-2xl border border-white/5 bg-black/40 backdrop-blur-xl p-5">
            <p className="text-xs text-muted-foreground mb-1">{s.label}</p>
            <p className={`text-2xl font-bold text-white ${s.color || ""}`}>{s.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
