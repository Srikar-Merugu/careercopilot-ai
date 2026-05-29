"use client";

import { Bot } from "lucide-react";

export default function AdminAutomation() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <Bot className="h-6 w-6 text-primary" />
          Automation Monitor
        </h1>
        <p className="text-sm text-muted-foreground mt-1">Auto-apply engine status and logs</p>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Runs", value: "1,893", color: "text-emerald-400" },
          { label: "Success Rate", value: "87.3%", color: "text-emerald-400" },
          { label: "Failed", value: "241", color: "text-rose-400" },
          { label: "Queue Depth", value: "12", color: "text-primary" },
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
