"use client";

import React from "react";
import { FileText, Compass, MessageSquare, ShieldCheck, Route, Send } from "lucide-react";
import { motion } from "framer-motion";

export function FeatureGrid() {
  const features = [
    {
      icon: FileText,
      title: "AI Resume Analysis",
      description: "Extract deep intelligence from your resume file, evaluating skills found, experience metrics, and ATS compatibility.",
      color: "from-[#8B5CF6] to-[#7C3AED]",
      glowColor: "rgba(139, 92, 246, 0.15)"
    },
    {
      icon: Compass,
      title: "Smart Job Matching",
      description: "Direct matching algorithms that evaluate job requirements and assign match ratings (e.g. 95% Match) for you.",
      color: "from-[#06B6D4] to-[#3B82F6]",
      glowColor: "rgba(6, 182, 212, 0.15)"
    },
    {
      icon: MessageSquare,
      title: "AI Interview Coach",
      description: "Simulate live interactive technical and behavioral interviews with real-time pitch, speed, and content scoring.",
      color: "from-[#06B6D4] to-[#8B5CF6]",
      glowColor: "rgba(139, 92, 246, 0.12)"
    },
    {
      icon: ShieldCheck,
      title: "ATS Optimization",
      description: "Recalibrate resume headings, sections, and vocabulary parameters to match institutional scanning patterns.",
      color: "from-[#3B82F6] to-[#06B6D4]",
      glowColor: "rgba(6, 182, 212, 0.12)"
    },
    {
      icon: Route,
      title: "AI Career Roadmap",
      description: "Generates custom skill milestones, learning paths, and recommended credential listings tailored to your goals.",
      color: "from-[#8B5CF6] to-[#3B82F6]",
      glowColor: "rgba(139, 92, 246, 0.15)"
    },
    {
      icon: Send,
      title: "Telegram Job Alerts",
      description: "Instant notification alerts directly on your Telegram messenger as soon as high-scoring job matches are indexed.",
      color: "from-[#06B6D4] to-[#7C3AED]",
      glowColor: "rgba(6, 182, 212, 0.15)"
    }
  ];

  return (
    <section id="features" className="relative py-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
      <div className="container max-w-7xl mx-auto space-y-12">
        
        {/* Section Header */}
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <span className="text-[10px] uppercase tracking-widest font-semibold text-[#8B5CF6] block">
            Platform Capabilities
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Engineered to Secure Elite Positions
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
            CareerCopilot AI combines high-performance LLM engines with smart telemetry mapping to manage your career search.
          </p>
        </div>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feat, index) => {
            const Icon = feat.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 35 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -6, borderColor: "rgba(255,255,255,0.1)" }}
                className="relative overflow-hidden rounded-xl border border-white/[0.04] bg-[#0b1120]/40 p-6 backdrop-blur-md transition-all duration-300 group shadow-lg"
                style={{
                  boxShadow: `0 0 40px -15px ${feat.glowColor}`
                }}
              >
                {/* Visual glow overlay */}
                <div className={`absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r ${feat.color} opacity-40 group-hover:opacity-100 transition-opacity`} />
                <div className="absolute -top-12 -right-12 w-24 h-24 rounded-full bg-white/[0.01] group-hover:scale-150 transition-all duration-500" />
                
                <div className="space-y-4">
                  {/* Glowing icon container */}
                  <div className="h-10 w-10 rounded-lg bg-white/[0.03] border border-white/[0.06] flex items-center justify-center text-white/95 group-hover:text-primary transition-colors">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="space-y-1.5 text-left">
                    <h3 className="text-sm font-semibold tracking-wide text-white group-hover:text-[#06B6D4] transition-colors">
                      {feat.title}
                    </h3>
                    <p className="text-xs text-muted-foreground leading-relaxed font-sans">
                      {feat.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
