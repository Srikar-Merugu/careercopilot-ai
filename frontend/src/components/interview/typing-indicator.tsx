"use client";

import { motion } from "framer-motion";

export function TypingIndicator() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 5 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -5 }}
      className="flex items-center gap-3"
    >
      <div className="h-8 w-8 rounded-xl bg-primary/20 border border-primary/30 flex items-center justify-center">
        <div className="h-3 w-3 rounded-full bg-primary animate-pulse" />
      </div>
      <div className="rounded-2xl rounded-tl-md bg-white/5 border border-white/10 px-4 py-3">
        <div className="flex items-center gap-1.5">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="h-2 w-2 rounded-full bg-primary/60"
              animate={{ y: [0, -4, 0] }}
              transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15 }}
            />
          ))}
        </div>
      </div>
    </motion.div>
  );
}

export function ScoreDisplay({ score, label }: { score: number; label: string }) {
  const color = score >= 80 ? "text-emerald-400" : score >= 60 ? "text-amber-400" : "text-rose-400";
  const bg = score >= 80 ? "bg-emerald-500/10 border-emerald-500/20" : score >= 60 ? "bg-amber-500/10 border-amber-500/20" : "bg-rose-500/10 border-rose-500/20";
  return (
    <div className={`rounded-lg p-3 border ${bg} text-center`}>
      <motion.p
        className={`text-2xl font-bold ${color}`}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 15 }}
      >
        {Math.round(score)}
      </motion.p>
      <p className="text-[10px] text-[#a0aec0] mt-0.5">{label}</p>
    </div>
  );
}
