"use client";

import React from "react";
import { GlowBackground } from "@/components/animations/glow-bg";
import { Hero } from "@/components/landing/hero";
import { Partners } from "@/components/landing/partners";
import { FeatureGrid } from "@/components/landing/feature-grid";
import { InteractiveShowcase } from "@/components/landing/interactive-showcase";
import { Workflow } from "@/components/landing/workflow";
import { Pricing } from "@/components/landing/pricing";
import { FAQ } from "@/components/landing/faq";
import { CTA } from "@/components/landing/cta";

export default function LandingPage() {
  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-[#050816] text-white">
      {/* Background glowing particles, ambient blurs and grids */}
      <GlowBackground />
      <div className="absolute inset-0 bg-grid-cyber opacity-[0.08] pointer-events-none" />

      {/* 1. Hero Section */}
      <Hero />

      {/* 2. Trusted Companies Section */}
      <Partners />

      {/* 3. AI Features Section */}
      <FeatureGrid />

      {/* 4. Showcase Section (Dashboard, Search, Analysis, and Coach Mockups) */}
      <InteractiveShowcase />

      {/* 5. AI Workflow Timeline */}
      <Workflow />

      {/* 6. Pricing Cards & Benefits Section */}
      <Pricing />

      {/* 7. Accordion FAQ Section */}
      <FAQ />

      {/* 8. Call To Action Section */}
      <CTA />
    </div>
  );
}
