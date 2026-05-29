"use client";

import React, { useRef, useState } from "react";
import Link from "next/link";
import { Sparkles, Play, FileText, Compass, MessageSquare, Rocket } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

export function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [coords, setCoords] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const { left, top } = containerRef.current.getBoundingClientRect();
    setCoords({
      x: e.clientX - left,
      y: e.clientY - top,
    });
  };

  return (
    <section 
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className="relative min-h-[90vh] flex items-center justify-center pt-28 pb-16 overflow-hidden px-4 sm:px-6 lg:px-8"
    >
      {/* Background grid overlay */}
      <div className="absolute inset-0 bg-grid-cyber opacity-[0.12] pointer-events-none" />
      
      {/* Mouse hover glow spot */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-25 transition-opacity duration-300"
        style={{
          background: `radial-gradient(600px circle at ${coords.x}px ${coords.y}px, rgba(139, 92, 246, 0.15), transparent 80%)`
        }}
      />
      
      {/* Bottom atmospheric blur */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[75%] h-[250px] bg-[#7c3aed]/10 blur-[100px] rounded-full pointer-events-none" />

      <div className="container max-w-7xl mx-auto relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        
        {/* Left column details */}
        <div className="lg:col-span-6 space-y-8 text-left">
          
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.03] border border-white/[0.08] backdrop-blur-md"
          >
            <Sparkles className="h-3.5 w-3.5 text-[#06B6D4] animate-pulse" />
            <span className="text-[10px] font-semibold text-[#a0aec0] uppercase tracking-widest">
              AI Career Copilot
            </span>
          </motion.div>

          <div className="space-y-4">
            <motion.h1 
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white leading-[1.1] font-display"
            >
              Find Jobs. <br />
              <span className="bg-gradient-to-r from-[#8B5CF6] via-[#3B82F6] to-[#06B6D4] bg-clip-text text-transparent glow-text-primary">
                Match Smarter.
              </span> <br />
              Grow Faster.
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-sm sm:text-base text-muted-foreground max-w-lg leading-relaxed font-sans"
            >
              Upload your resume and let our AI find the best job opportunities, tailored for your skills and career goals.
            </motion.p>
          </div>

          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-wrap items-center gap-4"
          >
            <Link href="/signup">
              <Button size="lg" className="bg-[#7c3aed] hover:bg-[#6d28d9] text-white shadow-glow-primary px-8 font-semibold h-12 transition-all">
                Get Started Free
              </Button>
            </Link>
            <Button variant="outline" size="lg" className="border-white/10 hover:bg-white/5 text-white h-12 px-6 gap-2">
              <Play className="h-4 w-4 fill-white text-white" />
              Watch Demo
            </Button>
          </motion.div>

          {/* User proofs */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="flex items-center gap-3 pt-4 border-t border-white/[0.04] max-w-sm"
          >
            <div className="flex -space-x-2">
              {[
                "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&auto=format&fit=crop&q=60",
                "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&auto=format&fit=crop&q=60",
                "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=80&auto=format&fit=crop&q=60",
                "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&auto=format&fit=crop&q=60"
              ].map((url, i) => (
                <img 
                  key={i}
                  src={url}
                  alt={`Seeker avatar ${i}`}
                  className="h-8 w-8 rounded-full border border-[#050816] object-cover"
                />
              ))}
            </div>
            <p className="text-xs text-muted-foreground font-sans">
              Join <span className="text-white font-bold">25,000+</span> job seekers who found their dream jobs
            </p>
          </motion.div>

        </div>

        {/* Right floating node graphics */}
        <div className="lg:col-span-6 flex justify-center relative min-h-[400px]">
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative w-[340px] sm:w-[400px] h-[340px] sm:h-[400px]"
          >
            {/* Ambient gradients */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full bg-[#8B5CF6]/10 blur-3xl" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 rounded-full bg-[#06B6D4]/10 blur-2xl" />

            {/* Central glowing AI box */}
            <motion.div 
              animate={{ 
                y: [0, -10, 0]
              }}
              transition={{ 
                repeat: Infinity, duration: 6, ease: "easeInOut"
              }}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 flex items-center justify-center z-20"
            >
              <div className="absolute inset-0 bg-[#0b1120]/70 border border-white/10 rounded-2xl backdrop-blur-md shadow-glow-primary flex items-center justify-center">
                <span className="text-white font-display font-extrabold text-2xl bg-gradient-to-r from-white to-[#06B6D4] bg-clip-text text-transparent">AI</span>
              </div>
            </motion.div>

            {/* Outer Nodes */}
            
            {/* Top-Right: Resume analysis */}
            <motion.div 
              animate={{ y: [0, -6, 0] }}
              transition={{ repeat: Infinity, duration: 4, ease: "easeInOut", delay: 0.2 }}
              className="absolute top-[10%] right-[5%] z-20 flex items-center gap-2 p-2 rounded-lg bg-[#0b1120]/80 border border-[#8B5CF6]/30 backdrop-blur-md shadow-lg"
            >
              <div className="flex h-7 w-7 items-center justify-center rounded bg-[#8B5CF6]/20 text-[#8B5CF6]">
                <FileText className="h-4 w-4" />
              </div>
              <span className="text-[10px] font-semibold text-white pr-1">AI Resume Analysis</span>
            </motion.div>

            {/* Middle-Left: Job matching */}
            <motion.div 
              animate={{ y: [0, 6, 0] }}
              transition={{ repeat: Infinity, duration: 5, ease: "easeInOut", delay: 0.5 }}
              className="absolute top-[40%] left-[2%] z-20 flex items-center gap-2 p-2 rounded-lg bg-[#0b1120]/80 border border-[#06B6D4]/30 backdrop-blur-md shadow-lg"
            >
              <div className="flex h-7 w-7 items-center justify-center rounded bg-[#06B6D4]/20 text-[#06B6D4]">
                <Compass className="h-4 w-4" />
              </div>
              <span className="text-[10px] font-semibold text-white pr-1">Smart Job Matching</span>
            </motion.div>

            {/* Bottom-Left: Interview prep */}
            <motion.div 
              animate={{ y: [0, -5, 0] }}
              transition={{ repeat: Infinity, duration: 4.5, ease: "easeInOut", delay: 0.8 }}
              className="absolute bottom-[15%] left-[8%] z-20 flex items-center gap-2 p-2 rounded-lg bg-[#0b1120]/80 border border-[#06B6D4]/30 backdrop-blur-md shadow-lg"
            >
              <div className="flex h-7 w-7 items-center justify-center rounded bg-[#06B6D4]/20 text-[#06B6D4]">
                <MessageSquare className="h-4 w-4" />
              </div>
              <span className="text-[10px] font-semibold text-white pr-1">Interview Prep</span>
            </motion.div>

            {/* Bottom-Right: Auto apply */}
            <motion.div 
              animate={{ y: [0, 8, 0] }}
              transition={{ repeat: Infinity, duration: 5.5, ease: "easeInOut", delay: 1 }}
              className="absolute bottom-[12%] right-[5%] z-20 flex items-center gap-2 p-2 rounded-lg bg-[#0b1120]/80 border border-[#8B5CF6]/30 backdrop-blur-md shadow-lg"
            >
              <div className="flex h-7 w-7 items-center justify-center rounded bg-[#8B5CF6]/20 text-[#8B5CF6]">
                <Rocket className="h-4 w-4" />
              </div>
              <div className="flex flex-col text-left">
                <span className="text-[10px] font-semibold text-white leading-none">Auto Apply</span>
                <span className="text-[7px] text-[#8B5CF6] font-bold uppercase tracking-wider mt-0.5">Pro Mode</span>
              </div>
            </motion.div>

            {/* SVG Connecting lines overlay */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none z-10" xmlns="http://www.w3.org/2000/svg">
              <line 
                x1="50%" y1="50%" x2="70%" y2="20%" 
                stroke="#8B5CF6" strokeWidth="1" strokeOpacity="0.4"
                strokeDasharray="4 4"
              />
              <line 
                x1="50%" y1="50%" x2="25%" y2="45%" 
                stroke="#06B6D4" strokeWidth="1" strokeOpacity="0.4"
                strokeDasharray="4 4"
              />
              <line 
                x1="50%" y1="50%" x2="28%" y2="82%" 
                stroke="#06B6D4" strokeWidth="1" strokeOpacity="0.4"
                strokeDasharray="4 4"
              />
              <line 
                x1="50%" y1="50%" x2="78%" y2="85%" 
                stroke="#8B5CF6" strokeWidth="1" strokeOpacity="0.4"
                strokeDasharray="4 4"
              />
            </svg>

          </motion.div>

        </div>

      </div>
    </section>
  );
}
