"use client";

import { motion } from "framer-motion";
import { Briefcase, TrendingUp } from "lucide-react";
import { CareerPath } from "@/services/ai-service";

interface CareerPathCardProps {
  paths: CareerPath[];
  isLoading?: boolean;
}

export function CareerPathCard({ paths, isLoading }: CareerPathCardProps) {
  if (isLoading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="h-20 rounded-xl bg-white/5 animate-pulse border border-white/5" />
        ))}
      </div>
    );
  }

  if (paths.length === 0) {
    return (
      <div className="text-center py-6">
        <Briefcase className="h-8 w-8 text-[#4a5568] mx-auto mb-2" />
        <p className="text-xs text-[#a0aec0]">Add skills to discover career paths</p>
      </div>
    );
  }

  return (
    <div className="space-y-2.5">
      {paths.map((path, i) => (
        <motion.div
          key={path.role}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.06 }}
          className="group p-4 rounded-xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.04] transition-all"
        >
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-sm font-semibold text-white">{path.role}</h4>
            <div className="flex items-center gap-1.5">
              <div className="h-6 w-6 rounded-full bg-primary/20 flex items-center justify-center">
                <span className="text-[10px] font-bold text-primary">{path.match}%</span>
              </div>
            </div>
          </div>
          <div className="w-full h-1.5 rounded-full bg-white/5 overflow-hidden">
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-primary to-cyan-400"
              initial={{ width: 0 }}
              animate={{ width: `${path.match}%` }}
              transition={{ duration: 1, delay: i * 0.1, ease: "easeOut" }}
            />
          </div>
          <div className="flex items-center gap-1.5 mt-2">
            <TrendingUp className="h-3 w-3 text-emerald-400" />
            <span className="text-[11px] text-emerald-400/80">{path.growth}</span>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
