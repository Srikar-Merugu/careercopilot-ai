"use client";

import { motion } from "framer-motion";

const scoreMeta = (s: number) => {
  if (s >= 80) return { color: "#22C55E", label: "Strong Match" };
  if (s >= 60) return { color: "#7C3AED", label: "Good Match" };
  if (s >= 40) return { color: "#F97316", label: "Fair Match" };
  return { color: "#EF4444", label: "Low Match" };
};

interface MatchScoreProps {
  score: number;
  size?: "sm" | "md" | "lg";
  showLabel?: boolean;
}

export function MatchScore({ score, size = "md", showLabel = true }: MatchScoreProps) {
  const dims = { sm: 44, md: 64, lg: 96 };
  const sw = { sm: 4, md: 5, lg: 7 };
  const d = dims[size];
  const strokeW = sw[size];
  const r = (d - strokeW) / 2;
  const c = 2 * Math.PI * r;
  const clamped = Math.max(0, Math.min(100, score));
  const offset = c - (clamped / 100) * c;
  const meta = scoreMeta(clamped);

  const fontSize = size === "lg" ? 22 : size === "md" ? 16 : 12;

  if (!showLabel) {
    return (
      <div className="relative inline-flex items-center justify-center flex-shrink-0" style={{ width: d, height: d }}>
        <svg width={d} height={d} className="transform -rotate-90">
          <defs>
            <filter id={`match-glow-${clamped}-${size}`}>
              <feGaussianBlur stdDeviation="2.5" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
          <circle cx={d / 2} cy={d / 2} r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth={strokeW} />
          <motion.circle
            cx={d / 2}
            cy={d / 2}
            r={r}
            fill="none"
            stroke={meta.color}
            strokeWidth={strokeW}
            strokeLinecap="round"
            strokeDasharray={c}
            initial={{ strokeDashoffset: c }}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            filter={`url(#match-glow-${clamped}-${size})`}
          />
        </svg>
        <svg width={d} height={d} className="absolute inset-0 pointer-events-none">
          <text
            x="50%"
            y="50%"
            textAnchor="middle"
            dominantBaseline="central"
            fill={meta.color}
            fontSize={fontSize}
            fontWeight={700}
            fontFamily="inherit"
            letterSpacing="-0.02em"
          >
            {Math.round(clamped)}%
          </text>
        </svg>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3">
      <div className="relative inline-flex items-center justify-center flex-shrink-0" style={{ width: d, height: d }}>
        <svg width={d} height={d} className="transform -rotate-90">
          <defs>
            <filter id={`match-glow-${clamped}-${size}`}>
              <feGaussianBlur stdDeviation="2.5" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
          <circle cx={d / 2} cy={d / 2} r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth={strokeW} />
          <motion.circle
            cx={d / 2}
            cy={d / 2}
            r={r}
            fill="none"
            stroke={meta.color}
            strokeWidth={strokeW}
            strokeLinecap="round"
            strokeDasharray={c}
            initial={{ strokeDashoffset: c }}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            filter={`url(#match-glow-${clamped}-${size})`}
          />
        </svg>
        <svg width={d} height={d} className="absolute inset-0 pointer-events-none">
          <text
            x="50%"
            y="50%"
            textAnchor="middle"
            dominantBaseline="central"
            fill={meta.color}
            fontSize={fontSize}
            fontWeight={700}
            fontFamily="inherit"
            letterSpacing="-0.02em"
          >
            {Math.round(clamped)}%
          </text>
        </svg>
      </div>
      <div className="flex flex-col min-w-0">
        <motion.span
          className="text-sm font-semibold leading-tight"
          style={{ color: meta.color }}
          initial={{ opacity: 0, x: -6 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, delay: 0.25 }}
        >
          {meta.label}
        </motion.span>
        <span className="text-[11px] text-muted-foreground mt-0.5">
          {Math.round(clamped)}% match
        </span>
      </div>
    </div>
  );
}

export function MatchBadge({ score }: { score: number }) {
  const cls =
    score >= 80 ? "bg-emerald-500/15 text-emerald-400 border-emerald-500/25"
    : score >= 60 ? "bg-amber-500/15 text-amber-400 border-amber-500/25"
    : score >= 40 ? "bg-orange-500/15 text-orange-400 border-orange-500/25"
    : "bg-red-500/15 text-red-400 border-red-500/25";

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-semibold border ${cls}`}>
      {Math.round(score)}% Match
    </span>
  );
}
