"use client";

import { motion } from "framer-motion";

interface AIOrbProps {
  isListening?: boolean;
  isThinking?: boolean;
  size?: number;
}

export function AIOrb({ isListening = false, isThinking = false, size = 80 }: AIOrbProps) {

  return (
    <div className="relative" style={{ width: size, height: size }}>
      {/* Outer glow rings */}
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className="absolute inset-0 rounded-full"
          style={{
            border: "1px solid rgba(124, 58, 237, 0.15)",
            background: "radial-gradient(circle, rgba(124,58,237,0.08) 0%, transparent 70%)",
          }}
          animate={{
            scale: isThinking ? [1, 1.3, 1] : [1, 1.15, 1],
            opacity: isThinking ? [0.4, 0.1, 0.4] : [0.3, 0.08, 0.3],
          }}
          transition={{
            duration: 2 + i * 0.5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: i * 0.3,
          }}
        />
      ))}

      {/* Core orb */}
      <motion.div
        className="absolute inset-0 rounded-full flex items-center justify-center"
        style={{
          background: "linear-gradient(135deg, #7C3AED 0%, #06B6D4 50%, #7C3AED 100%)",
          boxShadow: "0 0 30px rgba(124, 58, 237, 0.4), inset 0 0 20px rgba(255,255,255,0.1)",
        }}
        animate={{
          scale: isListening ? [1, 1.05, 1] : isThinking ? [1, 1.08, 1] : 1,
        }}
        transition={{
          duration: isListening ? 0.8 : 1.5,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        {/* Inner glow */}
        <div
          className="rounded-full"
          style={{
            width: "40%",
            height: "40%",
            background: "radial-gradient(circle, rgba(255,255,255,0.6) 0%, transparent 70%)",
          }}
        />
      </motion.div>

      {/* Status dots */}
      <motion.div
        className="absolute -bottom-1 -right-1 h-4 w-4 rounded-full border-2 border-[#050816]"
        style={{
          background: isListening ? "#22c55e" : isThinking ? "#f59e0b" : "#7C3AED",
        }}
        animate={{ scale: [1, 1.3, 1] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      />
    </div>
  );
}

export function AIAssistantMini() {
  return (
    <div className="flex items-center gap-2.5 px-3 py-2 rounded-xl bg-primary/10 border border-primary/20">
      <div className="relative h-6 w-6">
        <div className="absolute inset-0 rounded-full bg-primary/30 animate-ping" />
        <div className="absolute inset-0 rounded-full bg-primary flex items-center justify-center">
          <div className="h-2 w-2 rounded-full bg-white/80" />
        </div>
      </div>
      <span className="text-xs font-medium text-primary">AI Interviewer Ready</span>
    </div>
  );
}
