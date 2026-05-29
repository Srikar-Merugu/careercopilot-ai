"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Terminal, Eye, EyeOff, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { GlowBackground } from "@/components/animations/glow-bg";
import { SlideUp } from "@/components/animations/motion-wrapper";
import { useAuthStore } from "@/store/auth-store";
import { useToast } from "@/providers/toast-provider";
import { signUpSchema, SignUpInput } from "@/lib/validations";
import { motion } from "framer-motion";

export default function SignupPage() {
  const router = useRouter();
  const { signUp, signInWithOAuth, isLoading } = useAuthStore();
  const { toast } = useToast();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  
  // Real-time password strength states
  const [passwordValue, setPasswordValue] = useState("");
  const [hasUppercase, setHasUppercase] = useState(false);
  const [hasLowercase, setHasLowercase] = useState(false);
  const [hasNumber, setHasNumber] = useState(false);
  const [hasSpecial, setHasSpecial] = useState(false);
  const [hasMinLength, setHasMinLength] = useState(false);

  // Form hooks
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
  } = useForm<SignUpInput>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const watchedPassword = watch("password");

  // Sync real-time password requirements on typing
  useEffect(() => {
    const val = watchedPassword || "";
    setPasswordValue(val);
    setHasUppercase(/[A-Z]/.test(val));
    setHasLowercase(/[a-z]/.test(val));
    setHasNumber(/[0-9]/.test(val));
    setHasSpecial(/[^A-Za-z0-9]/.test(val));
    setHasMinLength(val.length >= 8);
  }, [watchedPassword]);

  const handleCredentialsSignUp = async (data: SignUpInput) => {
    setAuthError(null);
    try {
      await signUp(data.email, data.password, data.name);
      toast(
        "Verification Email Sent",
        "Please check your inbox to confirm your email registration.",
        "success"
      );
      router.push("/verify-email");
    } catch (err: any) {
      console.error(err);
      const msg = err.message || "Registration failed. Please check inputs.";
      setAuthError(msg);
      toast("Sign Up Failed", msg, "error");
    }
  };

  const handleSocialOAuth = async (provider: "google" | "github") => {
    setAuthError(null);
    try {
      await signInWithOAuth(provider);
      toast("Redirecting...", `Connecting to ${provider} authentication...`, "info");
    } catch (err: any) {
      console.error(err);
      const msg = err.message || "Failed to initialize social sign-up.";
      toast("OAuth Connection Error", msg, "error");
    }
  };

  // Calculate password strength percentage
  const strengthScore = [
    hasUppercase,
    hasLowercase,
    hasNumber,
    hasSpecial,
    hasMinLength,
  ].filter(Boolean).length;

  const strengthPercentage = (strengthScore / 5) * 100;
  
  const getStrengthColor = () => {
    if (strengthScore <= 2) return "bg-red-500 shadow-red-500/20";
    if (strengthScore <= 4) return "bg-yellow-500 shadow-yellow-500/20";
    return "bg-emerald-500 shadow-emerald-500/20";
  };

  return (
    <div className="min-h-screen bg-[#050816] grid grid-cols-1 lg:grid-cols-12 text-white relative w-full overflow-hidden">
      {/* Background vector elements */}
      <GlowBackground />

      {/* LEFT SIDE: Animated illustration column */}
      <div className="hidden lg:flex lg:col-span-7 relative flex-col justify-between p-12 overflow-hidden bg-[#070b19]/60 border-r border-white/[0.04] z-10">
        <div className="absolute inset-0 bg-grid-cyber opacity-[0.1] pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[450px] h-[450px] bg-gradient-to-tr from-[#7C3AED]/10 to-[#06B6D4]/10 rounded-full blur-[100px] pointer-events-none" />
        
        {/* Brand logo header */}
        <Link href="/" className="inline-flex items-center gap-2 relative z-10 self-start">
          <div className="flex h-8 w-8 items-center justify-center rounded bg-gradient-to-tr from-[#7C3AED] to-[#06B6D4] shadow-glow-primary">
            <Terminal className="h-4 w-4 text-white" />
          </div>
          <span className="font-display text-base font-bold tracking-tight text-white">
            CareerCopilot<span className="text-[#06B6D4]">.AI</span>
          </span>
        </Link>

        {/* Mock dashboard center visual */}
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

            {/* Metrics */}
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

            {/* Console Log */}
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

        {/* Footer */}
        <span className="text-[9px] text-muted-foreground relative z-10 self-start font-mono uppercase tracking-wider">
          &copy; {new Date().getFullYear()} CareerCopilot AI. Session Protection Active.
        </span>
      </div>

      {/* RIGHT SIDE: Signup credentials form */}
      <div className="lg:col-span-5 flex flex-col justify-center items-center px-4 sm:px-6 lg:px-12 py-12 relative z-10 w-full max-w-md mx-auto h-full my-auto">
        <div className="w-full space-y-6">
          
          {/* Brand logo header for mobile screens */}
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
              Create your portfolio
            </h2>
            <p className="text-xs text-muted-foreground">
              Register a free account to orchestrate your tech career.
            </p>
          </div>

          <SlideUp delay={0.1}>
            <Card className="border-white/5 bg-[#0b1120]/45 backdrop-blur-xl shadow-2xl relative overflow-hidden text-left">
              <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-[#8B5CF6]/35 to-transparent" />
              
              <CardHeader className="pb-3">
                <CardTitle className="text-base text-white tracking-wide">Register Account</CardTitle>
                <CardDescription className="text-[11px]">
                  Create authentication profiles to manage career telemetry data.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">

                {authError && (
                  <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-xs text-red-400 font-semibold leading-relaxed">
                    {authError}
                  </div>
                )}

                <form onSubmit={handleSubmit(handleCredentialsSignUp)} className="space-y-3.5">
                  
                  {/* Name field */}
                  <div className="space-y-1">
                    <label htmlFor="name-signup" className="block text-xs font-semibold text-white/80">
                      Full Name
                    </label>
                    <input
                      type="text"
                      id="name-signup"
                      placeholder="Alex Mercer"
                      {...register("name")}
                      className="w-full rounded-lg bg-black/40 border border-white/5 px-3 py-1.5 text-sm text-white placeholder-muted-foreground/60 focus:outline-none focus:border-primary/50 transition-colors"
                    />
                    {errors.name && (
                      <p className="text-[10px] text-red-400 font-semibold">{errors.name.message}</p>
                    )}
                  </div>

                  {/* Email Address field */}
                  <div className="space-y-1">
                    <label htmlFor="email-signup" className="block text-xs font-semibold text-white/80">
                      Email Address
                    </label>
                    <input
                      type="email"
                      id="email-signup"
                      placeholder="alex@career.copilot"
                      {...register("email")}
                      className="w-full rounded-lg bg-black/40 border border-white/5 px-3 py-1.5 text-sm text-white placeholder-muted-foreground/60 focus:outline-none focus:border-primary/50 transition-colors"
                    />
                    {errors.email && (
                      <p className="text-[10px] text-red-400 font-semibold">{errors.email.message}</p>
                    )}
                  </div>

                  {/* Password field */}
                  <div className="space-y-1">
                    <label htmlFor="pass-signup" className="block text-xs font-semibold text-white/80">
                      Password Key
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        id="pass-signup"
                        placeholder="At least 8 characters"
                        {...register("password")}
                        className="w-full rounded-lg bg-black/40 border border-white/5 pl-3 pr-10 py-1.5 text-sm text-white placeholder-muted-foreground/60 focus:outline-none focus:border-primary/50 transition-colors"
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

                  {/* Interactive Password Strength Indicator */}
                  {passwordValue && (
                    <div className="space-y-2 p-2.5 rounded-lg bg-black/30 border border-white/[0.03]">
                      <div className="flex justify-between items-center text-[10px]">
                        <span className="text-[#a0aec0]">Access strength key:</span>
                        <span className="font-semibold text-white">{strengthScore}/5 secure</span>
                      </div>
                      <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                        <div 
                          className={`h-full rounded-full transition-all duration-300 ${getStrengthColor()}`}
                          style={{ width: `${strengthPercentage}%` }}
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-1 text-[9px] text-[#a0aec0]">
                        <div className="flex items-center gap-1">
                          {hasMinLength ? <Check className="h-3 w-3 text-emerald-400" /> : <X className="h-3 w-3 text-red-400" />}
                          <span>Min 8 chars</span>
                        </div>
                        <div className="flex items-center gap-1">
                          {hasUppercase ? <Check className="h-3 w-3 text-emerald-400" /> : <X className="h-3 w-3 text-red-400" />}
                          <span>Uppercase</span>
                        </div>
                        <div className="flex items-center gap-1">
                          {hasLowercase ? <Check className="h-3 w-3 text-emerald-400" /> : <X className="h-3 w-3 text-red-400" />}
                          <span>Lowercase</span>
                        </div>
                        <div className="flex items-center gap-1">
                          {hasNumber ? <Check className="h-3 w-3 text-emerald-400" /> : <X className="h-3 w-3 text-red-400" />}
                          <span>Number</span>
                        </div>
                        <div className="flex items-center gap-1 col-span-2">
                          {hasSpecial ? <Check className="h-3 w-3 text-emerald-400" /> : <X className="h-3 w-3 text-red-400" />}
                          <span>Special char</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Confirm Password field */}
                  <div className="space-y-1">
                    <label htmlFor="confirm-pass-signup" className="block text-xs font-semibold text-white/80">
                      Confirm Password
                    </label>
                    <div className="relative">
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        id="confirm-pass-signup"
                        placeholder="Repeat password key"
                        {...register("confirmPassword")}
                        className="w-full rounded-lg bg-black/40 border border-white/5 pl-3 pr-10 py-1.5 text-sm text-white placeholder-muted-foreground/60 focus:outline-none focus:border-primary/50 transition-colors"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-white transition-colors"
                      >
                        {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                    {errors.confirmPassword && (
                      <p className="text-[10px] text-red-400 font-semibold">{errors.confirmPassword.message}</p>
                    )}
                  </div>

                  <Button 
                    type="submit" 
                    variant="default" 
                    className="w-full font-semibold h-10 text-xs"
                    disabled={isSubmitting || isLoading}
                  >
                    {isSubmitting ? "Orchestrating profile..." : "Register Portfolio Profile"}
                  </Button>
                </form>

                <div className="relative my-4 flex items-center justify-center">
                  <span className="absolute w-full border-t border-white/5" />
                  <span className="relative bg-[#0b1120]/10 px-3 text-[10px] uppercase text-muted-foreground tracking-wider backdrop-blur-xl">
                    Or Quick Register
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
                  Already have a profile?{" "}
                  <Link href="/login" className="text-primary hover:underline font-semibold">
                    Log in
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
