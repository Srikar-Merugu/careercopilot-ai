"use client";

import { motion } from "framer-motion";
import { Brain, User } from "lucide-react";

interface ChatBubbleProps {
  text: string;
  isUser?: boolean;
  score?: number;
  feedback?: string;
  delay?: number;
}

export function ChatBubble({ text, isUser = false, score, feedback, delay = 0 }: ChatBubbleProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10, x: isUser ? 10 : -10 }}
      animate={{ opacity: 1, y: 0, x: 0 }}
      transition={{ duration: 0.3, delay, ease: "easeOut" }}
      className={`flex items-start gap-3 ${isUser ? "flex-row-reverse" : ""}`}
    >
      <div className={`h-8 w-8 rounded-xl flex items-center justify-center shrink-0 ${
        isUser
          ? "bg-gradient-to-br from-[#7C3AED] to-[#06B6D4]"
          : "bg-primary/20 border border-primary/30"
      }`}>
        {isUser ? <User className="h-4 w-4 text-white" /> : <Brain className="h-4 w-4 text-primary" />}
      </div>
      <div className={`max-w-[80%] ${isUser ? "items-end" : "items-start"}`}>
        <div className={`rounded-2xl px-4 py-3 text-sm leading-relaxed ${
          isUser
            ? "bg-primary/20 border border-primary/30 text-white rounded-tr-md"
            : "bg-white/5 border border-white/10 text-[#e2e8f0] rounded-tl-md"
        }`}>
          {text}
        </div>
        {score !== undefined && (
          <div className={`flex items-center gap-2 mt-1.5 ${isUser ? "flex-row-reverse" : ""}`}>
            <div className={`h-1.5 w-16 rounded-full bg-white/5 overflow-hidden`}>
              <div
                className={`h-full rounded-full ${score >= 80 ? "bg-emerald-400" : score >= 60 ? "bg-amber-400" : "bg-rose-400"}`}
                style={{ width: `${score}%` }}
              />
            </div>
            <span className={`text-[10px] font-semibold ${
              score >= 80 ? "text-emerald-400" : score >= 60 ? "text-amber-400" : "text-rose-400"
            }`}>{score}</span>
          </div>
        )}
        {feedback && !isUser && (
          <p className="text-[10px] text-[#a0aec0] mt-1.5 italic px-1">{feedback}</p>
        )}
      </div>
    </motion.div>
  );
}
