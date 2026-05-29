"use client";

import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Sparkles, ArrowRight } from "lucide-react";

export function CTA() {
  return (
    <section className="relative py-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
      
      {/* Outer ambient blur */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] bg-[#8B5CF6]/10 blur-[100px] pointer-events-none rounded-full" />
      
      <div className="container max-w-5xl mx-auto relative z-10">
        
        {/* Glow grid box */}
        <div className="relative rounded-2xl border border-[#8B5CF6]/30 bg-gradient-to-tr from-[#0b1120] to-[#7c3aed]/10 p-8 sm:p-12 text-center overflow-hidden shadow-2xl">
          <div className="absolute inset-0 bg-grid-cyber opacity-[0.08]" />
          
          <div className="space-y-6 max-w-2xl mx-auto relative z-10">
            
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.02] border border-white/[0.06]">
              <Sparkles className="h-3.5 w-3.5 text-[#06B6D4] animate-pulse" />
              <span className="text-[9px] font-bold text-white/90 uppercase tracking-widest">
                CareerCopilot AI Accelerator
              </span>
            </div>

            <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
              Let AI Accelerate <br />
              <span className="bg-gradient-to-r from-[#8B5CF6] to-[#06B6D4] bg-clip-text text-transparent">Your Career Path.</span>
            </h2>

            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed max-w-md mx-auto font-sans">
              Deploy your resume directly to our matching engines. Connect platforms, optimize ATS indices, and land interviews.
            </p>

            <div className="pt-4 flex flex-wrap justify-center gap-4">
              <Link href="/signup">
                <Button size="lg" className="bg-[#7c3aed] hover:bg-[#6d28d9] text-white px-8 shadow-glow-primary font-semibold h-11 transition-all">
                  Get Started Free
                </Button>
              </Link>
              <Link href="/login">
                <Button variant="outline" size="lg" className="border-white/10 hover:bg-white/5 text-white h-11 px-6 gap-2">
                  Console Sign In <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
