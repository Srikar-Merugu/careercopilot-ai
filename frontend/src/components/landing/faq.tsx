"use client";

import React, { useState } from "react";
import { Plus, Minus } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function FAQ() {
  const faqs = [
    {
      q: "How does the AI job matching algorithm work?",
      a: "Our algorithm reads your extracted resume metadata (skills, projects, experience levels) and evaluates them against real-time indexed job descriptions. It calculates vector similarities to assign a match rate (e.g. 95% Match) and highlights specific requirements you satisfy or miss."
    },
    {
      q: "Is the ATS resume analyzer free to use?",
      a: "Yes! Every account starts with 5 free high-fidelity resume scans. Our system evaluates formatting schemas, header hierarchies, skill densities, and grammar flags, scoring your resume against popular corporate ATS platforms."
    },
    {
      q: "What subscription tiers are available?",
      a: "We offer three plans: Free (₹0/month for basic tools), Pro (₹499/month for unlimited analyzer runs, interview coaching, and matches), and Premium (₹999/month for priority developer supports, roadmap builders, and automated application dispatching)."
    },
    {
      q: "How does the AI Interview Coach analyze performance?",
      a: "The coach converts your voice replies into text, compares answers to job details, and runs heuristics on content accuracy. It also provides performance analytics regarding pitch clarity and vocabulary structure."
    },
    {
      q: "Is my personal data and resume information private?",
      a: "Absolutely. All documents uploaded are securely encrypted in transit and at rest. We never sell profile metadata to third parties. Your records are only used to calculate matching metrics."
    }
  ];

  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggle = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <section id="faq" className="relative py-20 px-4 sm:px-6 lg:px-8 overflow-hidden bg-gradient-to-b from-[#050816] via-[#050816]/90 to-[#050816]">
      <div className="container max-w-4xl mx-auto space-y-12">
        
        {/* Header */}
        <div className="text-center space-y-3">
          <span className="text-[10px] uppercase tracking-widest font-semibold text-[#06B6D4] block">
            Frequently Asked Questions
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Have Questions? We Have Answers
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Quick responses to standard questions about our platform and matching systems.
          </p>
        </div>

        {/* Accordions */}
        <div className="space-y-4">
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div 
                key={idx}
                className="rounded-xl border border-white/[0.04] bg-[#0b1120]/25 backdrop-blur-md overflow-hidden transition-colors"
              >
                <button
                  onClick={() => toggle(idx)}
                  className="w-full px-6 py-4 flex items-center justify-between gap-4 text-left focus:outline-none"
                >
                  <span className="text-xs font-semibold text-white/90 group-hover:text-white transition-colors">
                    {faq.q}
                  </span>
                  <div className="h-6 w-6 rounded bg-white/[0.02] border border-white/[0.08] flex items-center justify-center text-white/80 shrink-0">
                    {isOpen ? <Minus className="h-3 w-3" /> : <Plus className="h-3 w-3" />}
                  </div>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: "auto" }}
                      exit={{ height: 0 }}
                      transition={{ duration: 0.25, ease: "easeInOut" }}
                    >
                      <div className="px-6 pb-5 pt-1 text-xs text-muted-foreground leading-relaxed font-sans border-t border-white/[0.02] text-left">
                        {faq.a}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
