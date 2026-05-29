"use client";

import { motion } from "framer-motion";

interface MatchScoreRingProps {
  score: number;
  size?: number;
  strokeWidth?: number;
  label?: string;
  animated?: boolean;
}

export function MatchScoreRing({
  score,
  size = 120,
  strokeWidth = 8,
  label,
  animated = true,
}: MatchScoreRingProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const clampedScore = Math.max(0, Math.min(100, score));
  const strokeDashoffset = circumference - (clampedScore / 100) * circumference;

  const getColor = (s: number) => {
    if (s >= 85) return { main: "#22c55e", glow: "rgba(34, 197, 94, 0.4)" };
    if (s >= 70) return { main: "#7C3AED", glow: "rgba(124, 58, 237, 0.4)" };
    if (s >= 50) return { main: "#f59e0b", glow: "rgba(245, 158, 11, 0.4)" };
    return { main: "#ef4444", glow: "rgba(239, 68, 68, 0.4)" };
  };

  const color = getColor(clampedScore);

  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="transform -rotate-90 drop-shadow-glow-primary">
        <defs>
          <filter id={`glow-${clampedScore}`}>
            <feGaussianBlur stdDeviation="3" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="rgba(255,255,255,0.05)"
          strokeWidth={strokeWidth}
        />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color.main}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={animated ? { strokeDashoffset: circumference } : undefined}
          animate={{ strokeDashoffset }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          filter={`url(#glow-${clampedScore})`}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <motion.span
          className="text-2xl font-bold tracking-tight"
          style={{ color: color.main }}
          initial={animated ? { opacity: 0, scale: 0.5 } : undefined}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.8, ease: "easeOut" }}
        >
          {Math.round(clampedScore)}%
        </motion.span>
        {label && (
          <span className="text-[10px] text-[#a0aec0] font-medium mt-0.5">{label}</span>
        )}
      </div>
    </div>
  );
}

export function CompactMatchBadge({ score }: { score: number }) {
  const getColor = (s: number) => {
    if (s >= 85) return "text-green-400 bg-green-500/10 border-green-500/20";
    if (s >= 70) return "text-primary bg-primary/10 border-primary/20";
    if (s >= 50) return "text-amber-400 bg-amber-500/10 border-amber-500/20";
    return "text-red-400 bg-red-500/10 border-red-500/20";
  };

  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold border ${getColor(score)}`}>
      <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
      {Math.round(score)}% Match
    </span>
  );
}
