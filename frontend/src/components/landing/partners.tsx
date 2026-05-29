"use client";

import React from "react";
import { motion } from "framer-motion";

export function Partners() {
  const logos = [
    { name: "Google", display: "Google" },
    { name: "Microsoft", display: "Microsoft" },
    { name: "Amazon", display: "amazon" },
    { name: "Indeed", display: "indeed" },
    { name: "LinkedIn", display: "Linked In" },
    { name: "Amazon2", display: "amazon" }
  ];

  return (
    <section className="relative py-8 border-y border-white/[0.04] bg-[#050816]/30 backdrop-blur-sm px-4 sm:px-6 lg:px-8">
      <div className="container max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        
        <span className="text-[10px] uppercase tracking-widest font-semibold text-muted-foreground whitespace-nowrap">
          Trusted by professionals from
        </span>

        <div className="w-full md:w-auto flex flex-wrap items-center justify-center gap-8 sm:gap-12 md:gap-16">
          {logos.map((logo, index) => (
            <motion.div 
              key={index}
              whileHover={{ scale: 1.05 }}
              className="text-white/40 hover:text-white/90 text-sm sm:text-base font-display font-bold tracking-tight transition-all duration-300 cursor-default select-none"
            >
              {logo.display === "Linked In" ? (
                <span>Linked<span className="bg-white/10 px-1 rounded text-xs ml-0.5 text-white/90">in</span></span>
              ) : (
                logo.display
              )}
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
