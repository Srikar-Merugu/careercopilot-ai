"use client";

import React from "react";
import { Upload, Cpu, Compass, CheckCircle2, MessageSquare } from "lucide-react";
import { motion } from "framer-motion";

export function Workflow() {
  const steps = [
    {
      icon: Upload,
      title: "Upload Resume",
      desc: "Drag & drop your resume PDF to begin parsing claims.",
      step: "01"
    },
    {
      icon: Cpu,
      title: "AI Analysis",
      desc: "Our neural network evaluates skills, projects, and ATS structure.",
      step: "02"
    },
    {
      icon: Compass,
      title: "AI Matching",
      desc: "Find and sort job matches based on exact skill alignments.",
      step: "03"
    },
    {
      icon: CheckCircle2,
      title: "Apply Jobs",
      desc: "Connect platforms and dispatch credentials with single-click ease.",
      step: "04"
    },
    {
      icon: MessageSquare,
      title: "Interview Prep",
      desc: "Simulate tailored voice mock interviews and optimize confidence.",
      step: "05"
    }
  ];

  return (
    <section id="workflow" className="relative py-20 px-4 sm:px-6 lg:px-8 overflow-hidden bg-[#050816]/30">
      <div className="container max-w-7xl mx-auto space-y-16">
        
        {/* Section Header */}
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <span className="text-[10px] uppercase tracking-widest font-semibold text-[#8B5CF6] block">
            System Workflow
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            How CareerCopilot AI Works
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground">
            A linear progression of smart features designed to elevate your professional trajectory.
          </p>
        </div>

        {/* Timeline Row */}
        <div className="relative grid grid-cols-1 md:grid-cols-5 gap-8 items-start">
          
          {/* Horizontal Connector Line for Desktop */}
          <div className="hidden md:block absolute top-10 left-[10%] right-[10%] h-[1px] bg-gradient-to-r from-[#8B5CF6]/30 via-[#06B6D4]/30 to-[#8B5CF6]/30 z-0 pointer-events-none" />

          {steps.map((st, idx) => {
            const Icon = st.icon;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.15 }}
                className="flex flex-col items-center text-center space-y-4 relative z-10 group"
              >
                {/* Step Circle with Icon */}
                <div className="h-16 w-16 rounded-full bg-[#0b1120] border border-white/[0.08] flex items-center justify-center relative shadow-lg group-hover:border-[#8B5CF6]/50 group-hover:shadow-[0_0_20px_rgba(139,92,246,0.15)] transition-all duration-300">
                  <div className="absolute -top-1.5 -right-1.5 h-5 w-5 rounded-full bg-white/[0.03] border border-white/[0.08] flex items-center justify-center text-[8px] font-mono text-muted-foreground select-none">
                    {st.step}
                  </div>
                  <Icon className="h-6 w-6 text-[#a0aec0] group-hover:text-white transition-colors" />
                </div>

                <div className="space-y-1.5 max-w-[180px]">
                  <h4 className="text-xs font-bold text-white tracking-wide group-hover:text-[#06B6D4] transition-colors">
                    {st.title}
                  </h4>
                  <p className="text-[10px] text-muted-foreground leading-relaxed font-sans">
                    {st.desc}
                  </p>
                </div>

              </motion.div>
            );
          })}

        </div>

      </div>
    </section>
  );
}
