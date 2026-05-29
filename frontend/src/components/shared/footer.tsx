"use client";

import React from "react";
import Link from "next/link";
import { Terminal, Github, Twitter, Linkedin } from "lucide-react";

export function Footer() {
  return (
    <footer className="w-full border-t border-white/[0.05] bg-[#050816]/90 py-12 relative overflow-hidden text-left">
      {/* Decorative Blur Background Element */}
      <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 h-32 w-96 bg-[#8B5CF6]/5 blur-[60px] pointer-events-none rounded-full" />

      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 mb-12">
          
          {/* Logo & Platform Info Column */}
          <div className="space-y-4 md:col-span-4">
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded bg-gradient-to-tr from-[#7C3AED] to-[#06B6D4]">
                <Terminal className="h-4 w-4 text-white" />
              </div>
              <span className="font-display text-base font-bold text-white tracking-wide">
                CareerCopilot<span className="text-[#8B5CF6]">.AI</span>
              </span>
            </Link>
            <p className="text-xs text-muted-foreground leading-relaxed max-w-xs font-sans">
              Accelerate your professional path with next-generation AI agent networks. Build resumes, match jobs, and train confidence.
            </p>
            <div className="flex gap-3 text-muted-foreground">
              <Link href="#" className="hover:text-white transition-colors"><Twitter className="h-4 w-4" /></Link>
              <Link href="#" className="hover:text-white transition-colors"><Linkedin className="h-4 w-4" /></Link>
              <Link href="#" className="hover:text-white transition-colors"><Github className="h-4 w-4" /></Link>
            </div>
          </div>

          {/* Quick Links Column */}
          <div className="space-y-3 md:col-span-3 col-start-7">
            <h4 className="text-[10px] font-bold text-white uppercase tracking-wider">Product Features</h4>
            <ul className="space-y-2 text-xs font-sans text-muted-foreground">
              <li><Link href="#features" className="hover:text-white transition-colors">ATS Resume Analysis</Link></li>
              <li><Link href="#features" className="hover:text-white transition-colors">Smart Job Matching</Link></li>
              <li><Link href="#features" className="hover:text-white transition-colors">AI Interview Coach</Link></li>
              <li><Link href="#features" className="hover:text-white transition-colors">Telegram Alert Bots</Link></li>
            </ul>
          </div>

          {/* Legal / Policies Column */}
          <div className="space-y-3 md:col-span-3">
            <h4 className="text-[10px] font-bold text-white uppercase tracking-wider">Legal & Company</h4>
            <ul className="space-y-2 text-xs font-sans text-muted-foreground">
              <li><Link href="#" className="hover:text-white transition-colors">About Team</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Privacy Policy</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Terms of Service</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Contact Support</Link></li>
            </ul>
          </div>
        </div>

        {/* Legal copyright footer row */}
        <div className="border-t border-white/[0.05] pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-muted-foreground font-sans">
            &copy; {new Date().getFullYear()} CareerCopilot AI. All rights reserved. Built for modern high-growth careers.
          </p>
          <div className="flex gap-4">
            <span className="text-[9px] bg-white/5 border border-white/10 text-primary-foreground px-2 py-0.5 rounded uppercase tracking-wider font-mono">
              Phase 1 Live
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
