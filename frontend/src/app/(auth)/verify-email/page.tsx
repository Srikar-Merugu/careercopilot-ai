"use client";

import React from "react";
import Link from "next/link";
import { Terminal, MailOpen, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { GlowBackground } from "@/components/animations/glow-bg";
import { FadeIn, SlideUp } from "@/components/animations/motion-wrapper";

export default function VerifyEmailPage() {
  return (
    <div className="relative min-h-screen flex items-center justify-center p-4">
      <GlowBackground />

      <div className="w-full max-w-md relative z-10 space-y-6">
        
        {/* Brand Header */}
        <FadeIn delay={0.1}>
          <div className="text-center space-y-2">
            <Link href="/" className="inline-flex items-center gap-2 mx-auto">
              <div className="flex h-8 w-8 items-center justify-center rounded bg-gradient-to-tr from-[#7C3AED] to-[#06B6D4]">
                <Terminal className="h-4 w-4 text-white" />
              </div>
              <span className="font-display text-lg font-bold tracking-tight text-white">
                CareerCopilot<span className="text-primary">.AI</span>
              </span>
            </Link>
            <h2 className="text-2xl font-display font-extrabold tracking-tight text-white">
              Verify Credentials
            </h2>
            <p className="text-xs text-muted-foreground">
              Please verify your email address to validate profile portfolios.
            </p>
          </div>
        </FadeIn>

        {/* Credentials Form Box */}
        <SlideUp delay={0.2}>
          <Card className="border-white/5 bg-[#0b1120]/45 backdrop-blur-xl shadow-2xl relative overflow-hidden text-center">
            <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-[#8B5CF6]/35 to-transparent" />
            
            <CardHeader className="pb-4">
              <div className="mx-auto h-12 w-12 rounded-full bg-[#8B5CF6]/10 flex items-center justify-center border border-[#8B5CF6]/20 mb-4 animate-glow-pulse">
                <MailOpen className="h-6 w-6 text-[#8B5CF6]" />
              </div>
              <CardTitle className="text-base text-white tracking-wide">Verification Dispatched</CardTitle>
              <CardDescription className="text-[11px]">
                A securely signed registration token was dispatched to your inbox.
              </CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <p className="text-xs text-[#a0aec0] leading-relaxed max-w-xs mx-auto">
                Once confirmed, click the link within that email to enable full telemetry, protect endpoints, and open dashboards!
              </p>
              
              <div className="pt-2">
                <Link href="/login">
                  <Button variant="default" className="w-full">
                    Proceed to Sign-In <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </CardContent>

            <CardFooter className="flex justify-center text-xs border-t border-white/[0.03] pt-4">
              <span className="text-[#a0aec0]">
                Didn't receive email?{" "}
                <Link href="/signup" className="text-primary hover:underline font-semibold">
                  Try alternative email
                </Link>
              </span>
            </CardFooter>
          </Card>
        </SlideUp>

      </div>
    </div>
  );
}
