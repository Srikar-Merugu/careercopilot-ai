"use client";

import { motion } from "framer-motion";

const scoreConfig = (s: number) => {
  if (s >= 85) return { color: "#22c55e", label: "Excellent", glow: "rgba(34,197,94,0.35)" };
  if (s >= 70) return { color: "#7C3AED", label: "Strong", glow: "rgba(124,58,237,0.35)" };
  if (s >= 50) return { color: "#f59e0b", label: "Good", glow: "rgba(245,158,11,0.35)" };
  return { color: "#ef4444", label: "Needs Work", glow: "rgba(239,68,68,0.35)" };
};

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
  const clamped = Math.max(0, Math.min(100, score));
  const cfg = scoreConfig(clamped);
  const r = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * r;
  const offset = circumference - (clamped / 100) * circumference;
  const textSize = Math.max(18, size * 0.22);
  const innerLabelSize = Math.max(9, size * 0.1);

  return (
    <div
      className="relative inline-flex items-center justify-center flex-shrink-0"
      style={{ width: size, height: size }}
    >
      <svg width={size} height={size} className="transform -rotate-90">
        <defs>
          <filter id={`ring-glow-${clamped}`}>
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="rgba(255,255,255,0.06)"
          strokeWidth={strokeWidth}
        />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={cfg.color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={animated ? { strokeDashoffset: circumference } : undefined}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          filter={`url(#ring-glow-${clamped})`}
        />
      </svg>
      <svg
        width={size}
        height={size}
        className="absolute inset-0 pointer-events-none"
      >
        <text
          x="50%"
          y="50%"
          textAnchor="middle"
          dominantBaseline="central"
          fill={cfg.color}
          fontSize={textSize}
          fontWeight={700}
          fontFamily="inherit"
          letterSpacing="-0.02em"
        >
          {Math.round(clamped)}%
        </text>
        {(label || cfg.label) && (
          <text
            x="50%"
            y={size / 2 + textSize * 0.6}
            textAnchor="middle"
            dominantBaseline="central"
            fill="rgba(160,174,192,0.8)"
            fontSize={innerLabelSize}
            fontWeight={500}
            fontFamily="inherit"
          >
            {label || cfg.label}
          </text>
        )}
      </svg>
    </div>
  );
}

interface MatchCardProps {
  score: number;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function MatchCard({ score, size = "md", className = "" }: MatchCardProps) {
  const clamped = Math.max(0, Math.min(100, score));
  const cfg = scoreConfig(clamped);
  const ringSize = size === "lg" ? 96 : size === "sm" ? 56 : 72;
  const strokeW = size === "lg" ? 7 : size === "sm" ? 4 : 6;

  const statusLabel =
    clamped >= 85 ? "Excellent Match"
    : clamped >= 70 ? "Strong Match"
    : clamped >= 50 ? "Good Match"
    : "Fair Match";

  return (
    <div
      className={`flex items-center gap-4 p-4 rounded-xl border bg-[#0b1120]/60 backdrop-blur-sm ${className}`}
      style={{ borderColor: `${cfg.color}15` }}
    >
      <MatchScoreRing score={clamped} size={ringSize} strokeWidth={strokeW} />
      <div className="flex flex-col min-w-0">
        <motion.span
          className="text-sm font-semibold tracking-tight"
          style={{ color: cfg.color }}
          initial={{ opacity: 0, x: -8 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
        >
          {statusLabel}
        </motion.span>
        <span className="text-[11px] text-muted-foreground mt-0.5">
          {Math.round(clamped)}% match
        </span>
      </div>
    </div>
  );
}

export function CompactMatchBadge({ score }: { score: number }) {
  const cfg = scoreConfig(score);
  const cls =
    score >= 85 ? "text-green-400 bg-green-500/10 border-green-500/20"
    : score >= 70 ? "text-primary bg-primary/10 border-primary/20"
    : score >= 50 ? "text-amber-400 bg-amber-500/10 border-amber-500/20"
    : "text-red-400 bg-red-500/10 border-red-500/20";

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold border ${cls}`}>
      <span className="w-1.5 h-1.5 rounded-full bg-current" />
      {Math.round(score)}% Match
    </span>
  );
}
