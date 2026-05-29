"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  Lightbulb,
  Target,
  TrendingUp,
  Zap,
  AlertTriangle,
} from "lucide-react";

interface InsightsProps {
  strengths: string[];
  weaknesses: string[];
  missingSkills: string[];
  optimizationTips: string[];
  aiFeedback: string;
  careerSuggestions: string;
}

export function Insights({
  strengths,
  weaknesses,
  missingSkills,
  optimizationTips,
  aiFeedback,
  careerSuggestions,
}: InsightsProps) {
  return (
    <div className="space-y-8">
      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-sm text-muted-foreground leading-relaxed p-4 rounded-xl bg-gradient-to-r from-[#8B5CF6]/5 to-[#06B6D4]/5 border border-white/5"
      >
        <span className="text-[#8B5CF6] font-semibold">AI Assessment: </span>
        {aiFeedback}
      </motion.p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <InsightCard
          icon={<Lightbulb className="h-5 w-5 text-emerald-400" />}
          title="Strengths"
          items={strengths}
          color="emerald"
          delay={0.1}
        />
        <InsightCard
          icon={<AlertTriangle className="h-5 w-5 text-amber-400" />}
          title="Weaknesses"
          items={weaknesses}
          color="amber"
          delay={0.2}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <InsightCard
          icon={<Target className="h-5 w-5 text-red-400" />}
          title="Missing Skills"
          items={missingSkills}
          color="red"
          delay={0.3}
        />
        <InsightCard
          icon={<Zap className="h-5 w-5 text-[#06B6D4]" />}
          title="Optimization Tips"
          items={optimizationTips}
          color="cyan"
          delay={0.4}
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.6 }}
        className="p-6 rounded-xl bg-gradient-to-br from-[#06B6D4]/5 to-[#8B5CF6]/5 border border-white/5"
      >
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="h-5 w-5 text-[#06B6D4]" />
          <h3 className="text-sm font-semibold text-white">Career Path Suggestions</h3>
        </div>
        <p className="text-sm text-muted-foreground leading-relaxed">
          {careerSuggestions}
        </p>
      </motion.div>
    </div>
  );
}

function InsightCard({
  icon,
  title,
  items,
  color,
  delay,
}: {
  icon: React.ReactNode;
  title: string;
  items: string[];
  color: "emerald" | "amber" | "red" | "cyan";
  delay: number;
}) {
  const borderColors = {
    emerald: "border-emerald-500/20 hover:border-emerald-500/30",
    amber: "border-amber-500/20 hover:border-amber-500/30",
    red: "border-red-500/20 hover:border-red-500/30",
    cyan: "border-[#06B6D4]/20 hover:border-[#06B6D4]/30",
  };

  const bgColors = {
    emerald: "bg-emerald-500/10",
    amber: "bg-amber-500/10",
    red: "bg-red-500/10",
    cyan: "bg-[#06B6D4]/10",
  };

  const dotColors = {
    emerald: "bg-emerald-400",
    amber: "bg-amber-400",
    red: "bg-red-400",
    cyan: "bg-[#06B6D4]",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5 }}
      className={`p-5 rounded-xl border ${borderColors[color]} bg-[#0b1120]/40 backdrop-blur-sm transition-all duration-300`}
    >
      <div className="flex items-center gap-2 mb-4">
        <div className={`p-2 rounded-lg ${bgColors[color]}`}>{icon}</div>
        <h3 className="text-sm font-semibold text-white">{title}</h3>
        {items.length > 0 && (
          <span className="text-[10px] text-muted-foreground ml-auto">
            {items.length} items
          </span>
        )}
      </div>
      <ul className="space-y-2">
        {items.length === 0 ? (
          <li className="text-xs text-muted-foreground italic">No items found</li>
        ) : (
          items.map((item, i) => (
            <motion.li
              key={i}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: delay + i * 0.05, duration: 0.3 }}
              className="flex items-start gap-2.5 text-xs text-muted-foreground leading-relaxed"
            >
              <span className={`mt-1.5 h-1.5 w-1.5 rounded-full ${dotColors[color]} flex-shrink-0`} />
              {item}
            </motion.li>
          ))
        )}
      </ul>
    </motion.div>
  );
}
