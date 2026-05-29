"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
  Briefcase,
  BookOpen,
  Building2,
  TrendingUp,
  Mic,
  ChevronRight,
  Sparkles,
  ExternalLink,
} from "lucide-react";
import { RecommendationItem } from "@/services/ai-service";

const typeConfig: Record<string, { icon: any; color: string; bg: string; border: string }> = {
  job: { icon: Briefcase, color: "text-primary", bg: "bg-primary/10", border: "border-primary/20" },
  skill: { icon: BookOpen, color: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/20" },
  company: { icon: Building2, color: "text-blue-400", bg: "bg-blue-500/10", border: "border-blue-500/20" },
  course: { icon: BookOpen, color: "text-violet-400", bg: "bg-violet-500/10", border: "border-violet-500/20" },
  trending: { icon: TrendingUp, color: "text-amber-400", bg: "bg-amber-500/10", border: "border-amber-500/20" },
  interview: { icon: Mic, color: "text-rose-400", bg: "bg-rose-500/10", border: "border-rose-500/20" },
};

interface RecommendationFeedProps {
  recommendations: RecommendationItem[];
  isLoading?: boolean;
}

export function RecommendationFeed({ recommendations, isLoading }: RecommendationFeedProps) {
  if (isLoading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-24 rounded-xl bg-white/5 animate-pulse border border-white/5" />
        ))}
      </div>
    );
  }

  if (recommendations.length === 0) {
    return (
      <div className="glass-panel rounded-xl p-8 border border-white/10 bg-[#0a0f2e]/60 backdrop-blur-xl text-center">
        <Sparkles className="h-10 w-10 text-[#4a5568] mx-auto mb-3" />
        <p className="text-[#a0aec0] text-sm">No recommendations yet</p>
        <p className="text-xs text-[#4a5568] mt-1">Upload your resume to get AI-powered recommendations</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <AnimatePresence>
        {recommendations.map((rec, i) => {
          const config = typeConfig[rec.recommendation_type] || typeConfig.trending;
          const Icon = config.icon;

          return (
            <motion.div
              key={rec.id}
              initial={{ opacity: 0, y: 10, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ delay: i * 0.04, duration: 0.3 }}
              className={`group relative p-4 rounded-xl border ${config.border} ${config.bg.replace("bg-", "bg-opacity-30 bg-")} backdrop-blur-sm hover:bg-white/[0.06] transition-all cursor-pointer`}
            >
              <div className="flex items-start gap-3">
                <div className={`h-9 w-9 rounded-lg ${config.bg} ${config.border} border flex items-center justify-center shrink-0`}>
                  <Icon className={`h-4 w-4 ${config.color}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <h4 className="text-sm font-semibold text-white truncate">{rec.title}</h4>
                    <div className="flex items-center gap-1.5 shrink-0">
                      <span className="text-[10px] font-medium text-[#a0aec0] bg-white/5 px-1.5 py-0.5 rounded">
                        {Math.round(rec.relevance_score * 100)}%
                      </span>
                      <ChevronRight className="h-3.5 w-3.5 text-[#4a5568] group-hover:text-primary transition-colors" />
                    </div>
                  </div>
                  <p className="text-xs text-[#a0aec0] mt-1 line-clamp-2">{rec.content}</p>
                  {rec.source && (
                    <div className="flex items-center gap-1 mt-2">
                      <ExternalLink className="h-3 w-3 text-[#4a5568]" />
                      <span className="text-[10px] text-[#4a5568]">{rec.source}</span>
                    </div>
                  )}
                </div>
              </div>
              <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
