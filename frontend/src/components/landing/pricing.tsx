"use client";

import React from "react";
import { Check, ShieldCheck, Compass, MessageSquare, Rocket } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

export function Pricing() {
  const plans = [
    {
      name: "Free",
      price: "₹0",
      desc: "Perfect for getting started.",
      features: [
        "5 Resume Analyses",
        "Basic Job Matching",
        "Limited Dashboard Tools"
      ],
      cta: "Get Started",
      popular: false
    },
    {
      name: "Pro",
      price: "₹499",
      desc: "For serious job seekers.",
      features: [
        "Unlimited Resume Analyses",
        "95%+ Match Precision",
        "Full AI Interview Prep",
        "Weekly Telemetry Reports"
      ],
      cta: "Upgrade Now",
      popular: true
    },
    {
      name: "Premium",
      price: "₹999",
      desc: "For maximum growth.",
      features: [
        "Everything in Pro",
        "Auto Apply (Pro)",
        "Priority Support Access",
        "Custom Skill Roadmaps"
      ],
      cta: "Buy Premium",
      popular: false
    }
  ];

  const benefits = [
    { icon: Compass, title: "Unlimited Job Matches", desc: "Get unlimited AI-powered job matches." },
    { icon: MessageSquare, title: "AI Interview Coach", desc: "Practice unlimited mock interviews." },
    { icon: Rocket, title: "Auto Apply (Coming Soon)", desc: "Let AI apply to jobs for you automatically." },
    { icon: ShieldCheck, title: "Priority Support", desc: "Get priority support and faster responses." }
  ];

  return (
    <section id="pricing" className="relative py-20 px-4 sm:px-6 lg:px-8 overflow-hidden bg-gradient-to-b from-[#050816] via-[#0b1120]/10 to-[#050816]">
      <div className="container max-w-7xl mx-auto space-y-16">
        
        {/* Section Title */}
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <span className="text-[10px] uppercase tracking-widest font-semibold text-[#8B5CF6] block">
            Pricing Options
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Choose Your Plan
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Unlock premium features and accelerate your career.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto items-stretch">
          {plans.map((pl, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.15 }}
              whileHover={{ scale: 1.02 }}
              className={`relative rounded-2xl p-6 flex flex-col justify-between backdrop-blur-md transition-all duration-300 ${
                pl.popular 
                  ? "bg-[#0b1120]/70 border border-[#8B5CF6] shadow-[0_0_35px_rgba(139,92,246,0.15)]" 
                  : "bg-[#0b1120]/30 border border-white/[0.04] hover:border-white/10"
              }`}
            >
              {pl.popular && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-gradient-to-r from-[#8B5CF6] to-[#7C3AED] text-[8px] font-extrabold uppercase tracking-widest text-white">
                  Most Popular
                </span>
              )}

              <div className="space-y-6 text-left">
                <div className="space-y-2">
                  <h4 className="text-sm font-bold text-white uppercase tracking-wider">{pl.name}</h4>
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-extrabold text-white font-display">{pl.price}</span>
                    <span className="text-[10px] text-muted-foreground">/month</span>
                  </div>
                  <p className="text-[10px] text-muted-foreground leading-normal">{pl.desc}</p>
                </div>

                <ul className="space-y-2.5 text-xs text-muted-foreground font-sans">
                  {pl.features.map((feat, fidx) => (
                    <li key={fidx} className="flex items-center gap-2">
                      <Check className="h-3.5 w-3.5 text-[#06B6D4] shrink-0" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-8">
                <Button 
                  className={`w-full font-semibold text-xs h-10 ${
                    pl.popular 
                      ? "bg-[#7c3aed] text-white hover:bg-[#6d28d9] shadow-glow-primary" 
                      : "bg-white/[0.02] border border-white/[0.08] hover:bg-white/5 text-white"
                  }`}
                >
                  {pl.cta}
                </Button>
              </div>

            </motion.div>
          ))}
        </div>

        {/* Benefits Row Grid */}
        <div className="border-t border-white/[0.04] pt-16 max-w-5xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((ben, bidx) => {
              const Icon = ben.icon;
              return (
                <div key={bidx} className="flex flex-col items-center lg:items-start text-center lg:text-left space-y-2.5 max-w-[200px] mx-auto lg:mx-0">
                  <div className="h-9 w-9 rounded bg-white/[0.02] border border-white/[0.06] flex items-center justify-center text-[#8B5CF6]">
                    <Icon className="h-4.5 w-4.5" />
                  </div>
                  <div className="space-y-1">
                    <h5 className="text-[11px] font-bold text-white uppercase tracking-wide leading-none">{ben.title}</h5>
                    <p className="text-[9px] text-muted-foreground leading-relaxed font-sans">{ben.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </section>
  );
}
