"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Terminal, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { GlowBackground } from "@/components/animations/glow-bg";
import { SlideUp } from "@/components/animations/motion-wrapper";
import { useAuthStore } from "@/store/auth-store";
import { useToast } from "@/providers/toast-provider";
import { loginSchema, LoginInput } from "@/lib/validations";
import { motion } from "framer-motion";

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login, signInWithOAuth, initializeSession, isLoading } = useAuthStore();
  const { toast } = useToast();
  
  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  // Read target redirects
  const redirect = searchParams.get("redirect") || "/dashboard";

  // Form hooks
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // Load active sessions on landing
  useEffect(() => {
    initializeSession();
  }, [initializeSession]);

  const handleCredentialsLogin = async (data: LoginInput) => {
    setAuthError(null);
    try {
      await login(data.email, data.password);
      toast("Access Granted", "Logged in successfully.", "success");
      router.push(redirect);
      router.refresh();
    } catch (err: any) {
      console.error(err);
      const msg = err.message || "Invalid credentials. Try again.";
      setAuthError(msg);
      toast("Authentication Failed", msg, "error");
    }
  };

  const handleSocialOAuth = async (provider: "google" | "github") => {
    setAuthError(null);
    try {
      await signInWithOAuth(provider);
      toast("Redirecting...", `Connecting to ${provider} authentication...`, "info");
    } catch (err: any) {
      console.error(err);
      const msg = err.message || "Failed to initialize social sign-in.";
      toast("OAuth Connection Error", msg, "error");
    }
  };

  return (
    <div className="min-h-screen bg-[#050816] grid grid-cols-1 lg:grid-cols-12 text-white relative w-full overflow-hidden">
      {/* Background radial overlays */}
      <GlowBackground />

      {/* LEFT SIDE: Animated dashboard illustrations */}
      <div className="hidden lg:flex lg:col-span-7 relative flex-col justify-between p-12 overflow-hidden bg-[#070b19]/60 border-r border-white/[0.04] z-10">
        <div className="absolute inset-0 bg-grid-cyber opacity-[0.1] pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[450px] h-[450px] bg-gradient-to-tr from-[#7C3AED]/10 to-[#06B6D4]/10 rounded-full blur-[100px] pointer-events-none" />
        
        {/* Brand header Link */}
        <Link href="/" className="inline-flex items-center gap-2 relative z-10 self-start">
          <div className="flex h-8 w-8 items-center justify-center rounded bg-gradient-to-tr from-[#7C3AED] to-[#06B6D4] shadow-glow-primary">
            <Terminal className="h-4 w-4 text-white" />
          </div>
          <span className="font-display text-base font-bold tracking-tight text-white">
            CareerCopilot<span className="text-[#06B6D4]">.AI</span>
          </span>
        </Link>

        {/* Console Center widget */}
        <div className="relative z-10 my-auto flex flex-col items-center justify-center space-y-8">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="w-full max-w-md rounded-xl border border-white/[0.08] bg-[#0b1120]/75 backdrop-blur-xl shadow-2xl p-6 relative overflow-hidden"
          >
            {/* Header Mock */}
            <div className="flex justify-between items-center border-b border-white/[0.04] pb-4 mb-4 text-left">
              <div>
                <h3 className="text-xs font-bold text-white">Aryan's Copilot Cockpit</h3>
                <span className="text-[9px] text-muted-foreground">Active Session: telemetry analytics</span>
              </div>
              <span className="px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[8px] font-semibold uppercase">
                97% Match
              </span>
            </div>

            {/* Metrics parameters */}
            <div className="grid grid-cols-3 gap-3 mb-4 text-left">
              <div className="p-2.5 rounded bg-black/40 border border-white/[0.04] space-y-0.5">
                <span className="text-[8px] text-[#a0aec0] uppercase tracking-wider block">Resume Score</span>
                <div className="text-xs font-bold text-white font-mono">97% Excellent</div>
              </div>
              <div className="p-2.5 rounded bg-black/40 border border-white/[0.04] space-y-0.5">
                <span className="text-[8px] text-[#a0aec0] uppercase tracking-wider block">Matches found</span>
                <div className="text-xs font-bold text-[#06B6D4] font-mono">24 Active</div>
              </div>
              <div className="p-2.5 rounded bg-black/40 border border-white/[0.04] space-y-0.5">
                <span className="text-[8px] text-[#a0aec0] uppercase tracking-wider block">Interviews</span>
                <div className="text-xs font-bold text-[#8B5CF6] font-mono">5 Scheduled</div>
              </div>
            </div>

            {/* Activity log output */}
            <div className="p-3 rounded bg-black/60 border border-white/[0.03] text-[9px] text-green-400 font-mono space-y-1 text-left">
              <p>&gt; parsing resume parameters... done.</p>
              <p>&gt; matching preferred roles [Senior Frontend Developer]... done.</p>
              <p>&gt; generating customized behavioral coaching telemetry... done.</p>
            </div>
          </motion.div>

          <div className="text-center space-y-2 max-w-sm">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Configure Career Telemetry Instantly</h4>
            <p className="text-[10px] text-muted-foreground leading-normal font-sans">
              Enter your credentials to connect with our automated AI agents and start landing elite tech offers.
            </p>
          </div>
        </div>

        {/* Footer parameters */}
        <span className="text-[9px] text-muted-foreground relative z-10 self-start font-mono uppercase tracking-wider">
          &copy; {new Date().getFullYear()} CareerCopilot AI. Session Protection Active.
        </span>
      </div>

      {/* RIGHT SIDE: Authentication forms */}
      <div className="lg:col-span-5 flex flex-col justify-center items-center px-4 sm:px-6 lg:px-12 py-12 relative z-10 w-full max-w-md mx-auto h-full my-auto">
        <div className="w-full space-y-6">
          
          {/* Brand Header for Mobile screens */}
          <div className="text-center space-y-2 lg:hidden">
            <Link href="/" className="inline-flex items-center gap-2 mx-auto">
              <div className="flex h-8 w-8 items-center justify-center rounded bg-gradient-to-tr from-[#7C3AED] to-[#06B6D4] shadow-glow-primary">
                <Terminal className="h-4 w-4 text-white" />
              </div>
              <span className="font-display text-lg font-bold tracking-tight text-white">
                CareerCopilot<span className="text-primary">.AI</span>
              </span>
            </Link>
          </div>

          <div className="text-center space-y-2">
            <h2 className="text-2xl font-display font-extrabold tracking-tight text-white">
              Welcome back
            </h2>
            <p className="text-xs text-muted-foreground">
              Sign in with your email or social accounts to enter the cockpit.
            </p>
          </div>

          <SlideUp delay={0.1}>
            <Card className="border-white/5 bg-[#0b1120]/45 backdrop-blur-xl shadow-2xl relative overflow-hidden text-left">
              <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-[#8B5CF6]/35 to-transparent" />
              
              <CardHeader className="pb-4">
                <CardTitle className="text-base text-white tracking-wide">Enter Credentials</CardTitle>
                <CardDescription className="text-[11px]">
                  Type your email address and system access password key below.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                
                {authError && (
                  <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-xs text-red-400 font-semibold leading-relaxed">
                    {authError}
                  </div>
                )}

                <form onSubmit={handleSubmit(handleCredentialsLogin)} className="space-y-4">
                  
                  {/* Email address field */}
                  <div className="space-y-1.5">
                    <label htmlFor="email-login" className="block text-xs font-semibold text-white/80">
                      Email Address
                    </label>
                    <input
                      type="email"
                      id="email-login"
                      placeholder="alex@career.copilot"
                      {...register("email")}
                      className="w-full rounded-lg bg-black/40 border border-white/5 px-3 py-2 text-sm text-white placeholder-muted-foreground/60 focus:outline-none focus:border-primary/50 transition-colors"
                    />
                    {errors.email && (
                      <p className="text-[10px] text-red-400 font-semibold">{errors.email.message}</p>
                    )}
                  </div>

                  {/* Password field */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between items-center">
                      <label htmlFor="pass-login" className="block text-xs font-semibold text-white/80">
                        Access Password
                      </label>
                      <Link 
                        href="/forgot-password" 
                        className="text-[10px] text-primary hover:underline transition-colors font-medium"
                      >
                        Forgot access key?
                      </Link>
                    </div>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        id="pass-login"
                        placeholder="At least 6 characters"
                        {...register("password")}
                        className="w-full rounded-lg bg-black/40 border border-white/5 pl-3 pr-10 py-2 text-sm text-white placeholder-muted-foreground/60 focus:outline-none focus:border-primary/50 transition-colors"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-white transition-colors"
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                    {errors.password && (
                      <p className="text-[10px] text-red-400 font-semibold">{errors.password.message}</p>
                    )}
                  </div>

                  <Button 
                    type="submit" 
                    variant="default" 
                    className="w-full font-semibold h-10 text-xs"
                    disabled={isSubmitting || isLoading}
                  >
                    {isSubmitting ? "Initiating Session..." : "Log In to Dashboard"}
                  </Button>
                </form>

                <div className="relative my-4 flex items-center justify-center">
                  <span className="absolute w-full border-t border-white/5" />
                  <span className="relative bg-[#0b1120]/10 px-3 text-[10px] uppercase text-muted-foreground tracking-wider backdrop-blur-xl">
                    Or Social Connect
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <Button 
                    variant="glass" 
                    size="sm" 
                    onClick={() => handleSocialOAuth("google")}
                    className="text-xs h-9"
                  >
                    Google SSO
                  </Button>
                  <Button 
                    variant="glass" 
                    size="sm" 
                    onClick={() => handleSocialOAuth("github")}
                    className="text-xs h-9"
                  >
                    GitHub SSO
                  </Button>
                </div>

              </CardContent>
              <CardFooter className="flex justify-center text-xs border-t border-white/[0.03] pt-4">
                <span className="text-[#a0aec0]">
                  New to the platform?{" "}
                  <Link href="/signup" className="text-primary hover:underline font-semibold">
                    Register portfolio
                  </Link>
                </span>
              </CardFooter>
            </Card>
          </SlideUp>

        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#050816] flex flex-col items-center justify-center gap-4 text-white">
        <div className="absolute inset-0 bg-grid-cyber opacity-[0.15] pointer-events-none" />
        <span className="text-xs font-semibold text-muted-foreground uppercase tracking-widest animate-pulse relative z-10">
          Loading cockpit session...
        </span>
      </div>
    }>
      <LoginContent />
    </Suspense>
  );
}
