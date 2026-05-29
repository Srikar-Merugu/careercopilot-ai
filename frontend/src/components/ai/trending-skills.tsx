"use client";

import { motion } from "framer-motion";
import { TrendingUp, ArrowUpRight } from "lucide-react";

interface TrendingSkillsProps {
  skills: { skill: string; trending_score: number; growth: string }[];
  isLoading?: boolean;
}

export function TrendingSkills({ skills, isLoading }: TrendingSkillsProps) {
  if (isLoading) {
    return (
      <div className="space-y-2">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="h-10 rounded-lg bg-white/5 animate-pulse" />
        ))}
      </div>
    );
  }

  if (skills.length === 0) {
    return (
      <div className="text-center py-6">
        <TrendingUp className="h-8 w-8 text-[#4a5568] mx-auto mb-2" />
        <p className="text-xs text-[#a0aec0]">No trending data available</p>
      </div>
    );
  }

  return (
    <div className="space-y-1.5">
      {skills.map((item, i) => (
        <motion.div
          key={item.skill}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.04 }}
          className="flex items-center justify-between p-2.5 rounded-lg hover:bg-white/5 transition-colors"
        >
          <div className="flex items-center gap-2.5">
            <div
              className="h-1.5 rounded-full bg-primary/30"
              style={{ width: `${item.trending_score}%`, maxWidth: 60, opacity: 0.3 + (item.trending_score / 100) * 0.7 }}
            />
            <span className="text-sm text-white font-medium">{item.skill}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-[11px] font-semibold text-emerald-400">{item.growth}</span>
            <ArrowUpRight className="h-3 w-3 text-emerald-400" />
          </div>
        </motion.div>
      ))}
    </div>
  );
}
