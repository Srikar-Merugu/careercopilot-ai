"use client";

import React from "react";
import { motion } from "framer-motion";

interface RoleRecommendation {
  title: string;
  match_percentage: number;
  reason: string;
}

interface RoleRecommendationsProps {
  roles: RoleRecommendation[];
}

const roleIcons: Record<string, string> = {
  "Full Stack Developer": "🔄",
  "Senior Frontend Engineer": "🎨",
  "Backend Engineer": "⚙️",
  "DevOps Engineer": "🚀",
  "AI Engineer": "🤖",
  "Data Analyst": "📊",
  "UI/UX Engineer": "✨",
};

export function RoleRecommendations({ roles }: RoleRecommendationsProps) {
  const sorted = [...roles].sort((a, b) => b.match_percentage - a.match_percentage);

  return (
    <div className="space-y-4">
      {sorted.length === 0 ? (
        <p className="text-xs text-muted-foreground text-center py-8">
          No role recommendations available
        </p>
      ) : (
        sorted.map((role, i) => (
          <motion.div
            key={role.title}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1, duration: 0.4 }}
            className="group relative p-4 rounded-xl border border-white/5 bg-[#0b1120]/40 backdrop-blur-sm hover:border-[#8B5CF6]/30 hover:bg-[#8B5CF6]/5 transition-all duration-300 cursor-default"
          >
            <div className="flex items-center gap-4">
              <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-[#8B5CF6]/20 to-[#06B6D4]/20 flex items-center justify-center text-lg border border-white/5">
                {roleIcons[role.title] || "💼"}
              </div>

              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-semibold text-white">
                  {role.title}
                </h4>
                <p className="text-[11px] text-muted-foreground mt-0.5 line-clamp-1">
                  {role.reason}
                </p>
              </div>

              <div className="text-right flex-shrink-0">
                <div className="relative h-14 w-14">
                  <svg className="transform -rotate-90 w-14 h-14">
                    <circle
                      cx="28"
                      cy="28"
                      r="24"
                      fill="none"
                      stroke="rgba(255,255,255,0.05)"
                      strokeWidth="4"
                    />
                    <motion.circle
                      cx="28"
                      cy="28"
                      r="24"
                      fill="none"
                      stroke={
                        role.match_percentage >= 80
                          ? "#22C55E"
                          : role.match_percentage >= 60
                            ? "#EAB308"
                            : "#F97316"
                      }
                      strokeWidth="4"
                      strokeLinecap="round"
                      strokeDasharray={2 * Math.PI * 24}
                      initial={{ strokeDashoffset: 2 * Math.PI * 24 }}
                      animate={{
                        strokeDashoffset:
                          2 * Math.PI * 24 -
                          (role.match_percentage / 100) * 2 * Math.PI * 24,
                      }}
                      transition={{ delay: 0.3 + i * 0.1, duration: 1.2, ease: "easeOut" }}
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span
                      className="text-xs font-bold font-display"
                      style={{
                        color:
                          role.match_percentage >= 80
                            ? "#22C55E"
                            : role.match_percentage >= 60
                              ? "#EAB308"
                              : "#F97316",
                      }}
                    >
                      {role.match_percentage}%
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-3 pt-3 border-t border-white/5">
              <p className="text-[11px] text-muted-foreground leading-relaxed">
                {role.reason}
              </p>
            </div>
          </motion.div>
        ))
      )}
    </div>
  );
}
