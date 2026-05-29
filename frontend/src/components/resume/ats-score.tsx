"use client";

import React from "react";
import { motion } from "framer-motion";

interface AtsScoreProps {
  score: number;
  breakdown: {
    keyword_optimization: number;
    formatting: number;
    role_relevance: number;
    skill_coverage: number;
    readability: number;
    project_quality: number;
  };
}

export function AtsScore({ score, breakdown }: AtsScoreProps) {
  const radius = 80;
  const circumference = 2 * Math.PI * radius;
  const progress = circumference - (score / 100) * circumference;

  const getScoreColor = (s: number) => {
    if (s >= 80) return "#22C55E";
    if (s >= 60) return "#EAB308";
    if (s >= 40) return "#F97316";
    return "#EF4444";
  };

  const scoreColor = getScoreColor(score);

  const categories = [
    { label: "Keyword Optimization", value: breakdown.keyword_optimization, color: "#8B5CF6" },
    { label: "Formatting", value: breakdown.formatting, color: "#06B6D4" },
    { label: "Role Relevance", value: breakdown.role_relevance, color: "#3B82F6" },
    { label: "Skill Coverage", value: breakdown.skill_coverage, color: "#22C55E" },
    { label: "Readability", value: breakdown.readability, color: "#EAB308" },
    { label: "Project Quality", value: breakdown.project_quality, color: "#F97316" },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
      <div className="flex flex-col items-center justify-center">
        <div className="relative">
          <svg width="220" height="220" className="transform -rotate-90">
            <circle
              cx="110"
              cy="110"
              r={radius}
              fill="none"
              stroke="rgba(255,255,255,0.05)"
              strokeWidth="10"
            />
            <motion.circle
              cx="110"
              cy="110"
              r={radius}
              fill="none"
              stroke={scoreColor}
              strokeWidth="10"
              strokeLinecap="round"
              strokeDasharray={circumference}
              initial={{ strokeDashoffset: circumference }}
              animate={{ strokeDashoffset: progress }}
              transition={{ duration: 2, ease: "easeOut" }}
            />
            <motion.circle
              cx="110"
              cy="110"
              r={radius}
              fill="none"
              stroke={scoreColor}
              strokeWidth="10"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={progress}
              opacity={0.3}
              style={{ filter: "blur(8px)" }}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <motion.span
              className="text-5xl font-bold font-display"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.5 }}
              style={{ color: scoreColor }}
            >
              {Math.round(score)}
            </motion.span>
            <span className="text-xs text-muted-foreground mt-1">/ 100</span>
          </div>
        </div>
        <p className="text-xs text-muted-foreground mt-4 text-center">
          {score >= 80
            ? "Excellent ATS compatibility"
            : score >= 60
              ? "Good ATS compatibility, room for improvement"
              : score >= 40
                ? "Needs optimization for ATS systems"
                : "Significant ATS optimization required"}
        </p>
      </div>

      <div className="space-y-3">
        {categories.map((cat, i) => (
          <motion.div
            key={cat.label}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 + i * 0.1, duration: 0.5 }}
            className="space-y-1.5"
          >
            <div className="flex justify-between text-xs">
              <span className="text-white/80">{cat.label}</span>
              <span className="font-semibold" style={{ color: cat.color }}>
                {Math.round(cat.value)}%
              </span>
            </div>
            <div className="h-1.5 rounded-full bg-white/5 overflow-hidden">
              <motion.div
                className="h-full rounded-full"
                style={{ backgroundColor: cat.color }}
                initial={{ width: 0 }}
                animate={{ width: `${cat.value}%` }}
                transition={{ delay: 0.5 + i * 0.1, duration: 1, ease: "easeOut" }}
              />
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
