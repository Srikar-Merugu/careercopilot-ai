"use client";

import React from "react";
import { motion } from "framer-motion";

interface MatchScoreProps {
  score: number;
  size?: "sm" | "md" | "lg";
  showLabel?: boolean;
}

export function MatchScore({ score, size = "md", showLabel = true }: MatchScoreProps) {
  const dimensions = { sm: 40, md: 56, lg: 80 };
  const strokeWidth = { sm: 3, md: 4, lg: 6 };
  const fontSize = { sm: 8, md: 12, lg: 18 };

  const d = dimensions[size];
  const sw = strokeWidth[size];
  const fs = fontSize[size];
  const r = (d - sw) / 2;
  const c = 2 * Math.PI * r;
  const offset = c - (score / 100) * c;

  const getColor = (s: number) => {
    if (s >= 80) return "#22C55E";
    if (s >= 60) return "#EAB308";
    if (s >= 40) return "#F97316";
    return "#EF4444";
  };

  const color = getColor(score);

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width={d} height={d} className="transform -rotate-90">
        <circle
          cx={d / 2}
          cy={d / 2}
          r={r}
          fill="none"
          stroke="rgba(255,255,255,0.06)"
          strokeWidth={sw}
        />
        <motion.circle
          cx={d / 2}
          cy={d / 2}
          r={r}
          fill="none"
          stroke={color}
          strokeWidth={sw}
          strokeLinecap="round"
          strokeDasharray={c}
          initial={{ strokeDashoffset: c }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.5, ease: "easeOut" }}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span
          className="font-bold font-display leading-none"
          style={{ fontSize: fs, color }}
        >
          {Math.round(score)}%
        </span>
      </div>
      {showLabel && size !== "sm" && (
        <div className="ml-2">
          <span className="text-xs font-semibold text-white">{Math.round(score)}%</span>
          <div
            className="text-[10px]"
            style={{
              color:
                score >= 80
                  ? "#22C55E"
                  : score >= 60
                    ? "#EAB308"
                    : score >= 40
                      ? "#F97316"
                      : "#EF4444",
            }}
          >
            {score >= 80 ? "Strong Match" : score >= 60 ? "Good Match" : score >= 40 ? "Fair" : "Low"}
          </div>
        </div>
      )}
    </div>
  );
}

export function MatchBadge({ score }: { score: number }) {
  const getColor = (s: number) => {
    if (s >= 80)
      return { bg: "bg-emerald-500/15", text: "text-emerald-400", border: "border-emerald-500/25" };
    if (s >= 60)
      return { bg: "bg-amber-500/15", text: "text-amber-400", border: "border-amber-500/25" };
    if (s >= 40)
      return { bg: "bg-orange-500/15", text: "text-orange-400", border: "border-orange-500/25" };
    return { bg: "bg-red-500/15", text: "text-red-400", border: "border-red-500/25" };
  };

  const c = getColor(score);

  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold border ${c.bg} ${c.text} ${c.border}`}
    >
      {Math.round(score)}% Match
    </span>
  );
}
