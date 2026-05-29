"use client";

import React from "react";
import { motion } from "framer-motion";

export function GlowBackground() {
  return (
    <div className="absolute inset-0 -z-50 overflow-hidden bg-[#050816] w-full min-h-screen">
      {/* Retro Sci-Fi Cyber Grid */}
      <div className="absolute inset-0 bg-grid-cyber opacity-[0.25] pointer-events-none" />

      {/* Floating Radial Glow Blob 1 (Purple) */}
      <motion.div
        animate={{
          x: [0, 60, -40, 0],
          y: [0, -80, 40, 0],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute top-[10%] left-[10%] h-[400px] w-[400px] rounded-full bg-[#7C3AED]/15 blur-[80px] pointer-events-none"
      />

      {/* Floating Radial Glow Blob 2 (Cyan/Blue Accent) */}
      <motion.div
        animate={{
          x: [0, -70, 50, 0],
          y: [0, 90, -50, 0],
        }}
        transition={{
          duration: 30,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute bottom-[20%] right-[10%] h-[500px] w-[500px] rounded-full bg-[#06B6D4]/10 blur-[100px] pointer-events-none"
      />

      {/* Ambient center subtle glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[600px] w-[800px] bg-[#8B5CF6]/5 blur-[120px] pointer-events-none" />
      
      {/* Glass overlay fade effect */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#050816]/30 via-transparent to-[#050816]/80 pointer-events-none" />
    </div>
  );
}
