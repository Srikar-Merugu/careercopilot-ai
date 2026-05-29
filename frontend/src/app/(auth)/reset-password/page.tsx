"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Terminal, KeyRound, Eye, EyeOff, Check, X, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { GlowBackground } from "@/components/animations/glow-bg";
import { FadeIn, SlideUp } from "@/components/animations/motion-wrapper";
import { useAuthStore } from "@/store/auth-store";
import { useToast } from "@/providers/toast-provider";
import { resetPasswordSchema, ResetPasswordInput } from "@/lib/validations";

export default function ResetPasswordPage() {
  const { resetPassword, isLoading } = useAuthStore();
  const { toast } = useToast();
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  // Strength trackers
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
  } = useForm<ResetPasswordInput>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const watchedPassword = watch("password");

  useEffect(() => {
    const val = watchedPassword || "";
    setPasswordValue(val);
    setHasUppercase(/[A-Z]/.test(val));
    setHasLowercase(/[a-z]/.test(val));
    setHasNumber(/[0-9]/.test(val));
    setHasSpecial(/[^A-Za-z0-9]/.test(val));
    setHasMinLength(val.length >= 8);
  }, [watchedPassword]);

  const handleResetSubmit = async (data: ResetPasswordInput) => {
    setAuthError(null);
    try {
      await resetPassword(data.password);
      setIsSuccess(true);
      toast(
        "Key Restructured",
        "Your credential access key was successfully updated.",
        "success"
      );
    } catch (err: any) {
      console.error(err);
      const msg = err.message || "Failed to restructure password access key.";
      setAuthError(msg);
      toast("Restructuring Failed", msg, "error");
    }
  };

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
    <div className="relative min-h-screen flex items-center justify-center p-4 py-12">
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
              Restructure Access Key
            </h2>
            <p className="text-xs text-muted-foreground">
              Define your new high-security password credentials.
            </p>
          </div>
        </FadeIn>

        {/* Credentials Form Box */}
        <SlideUp delay={0.2}>
          <Card className="border-white/5 bg-[#0b1120]/45 backdrop-blur-xl shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-[#8B5CF6]/35 to-transparent" />
            
            <CardHeader className="pb-3">
              <CardTitle className="text-base text-white tracking-wide flex items-center gap-2">
                <KeyRound className="h-4 w-4 text-primary" /> Update Password
              </CardTitle>
              <CardDescription className="text-[11px]">
                Create a high-strength password and confirm to finalize token swaps.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">

              {authError && (
                <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-xs text-red-400 font-semibold leading-relaxed">
                  {authError}
                </div>
              )}

              {isSuccess ? (
                <div className="py-6 text-center space-y-4">
                  <div className="mx-auto h-12 w-12 rounded-full bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
                    <CheckCircle2 className="h-6 w-6 text-emerald-400" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-white">Password Synchronized</h4>
                    <p className="text-xs text-[#a0aec0] mt-1 leading-relaxed">
                      Your access credentials have been fully restructured.
                    </p>
                  </div>
                  <div className="pt-2">
                    <Link href="/login">
                      <Button variant="default" className="w-full">
                        Return to Sign-In
                      </Button>
                    </Link>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit(handleResetSubmit)} className="space-y-3.5">
                  
                  {/* New Password input */}
                  <div className="space-y-1">
                    <label htmlFor="pass-reset" className="block text-xs font-semibold text-white/80">
                      New Password Key
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        id="pass-reset"
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

                  {/* Password Strength display */}
                  {passwordValue && (
                    <div className="space-y-2 p-2.5 rounded-lg bg-black/30 border border-white/[0.03]">
                      <div className="flex justify-between items-center text-[10px]">
                        <span className="text-muted-foreground">Access strength key:</span>
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
                          <span>Min 8 characters</span>
                        </div>
                        <div className="flex items-center gap-1">
                          {hasUppercase ? <Check className="h-3 w-3 text-emerald-400" /> : <X className="h-3 w-3 text-red-400" />}
                          <span>Uppercase letter</span>
                        </div>
                        <div className="flex items-center gap-1">
                          {hasLowercase ? <Check className="h-3 w-3 text-emerald-400" /> : <X className="h-3 w-3 text-red-400" />}
                          <span>Lowercase letter</span>
                        </div>
                        <div className="flex items-center gap-1">
                          {hasNumber ? <Check className="h-3 w-3 text-emerald-400" /> : <X className="h-3 w-3 text-red-400" />}
                          <span>Numeric digit</span>
                        </div>
                        <div className="flex items-center gap-1 col-span-2">
                          {hasSpecial ? <Check className="h-3 w-3 text-emerald-400" /> : <X className="h-3 w-3 text-red-400" />}
                          <span>Special character</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Confirm Password input */}
                  <div className="space-y-1">
                    <label htmlFor="confirm-pass-reset" className="block text-xs font-semibold text-white/80">
                      Confirm New Password
                    </label>
                    <div className="relative">
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        id="confirm-pass-reset"
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
                    className="w-full font-semibold"
                    disabled={isSubmitting || isLoading}
                  >
                    {isSubmitting ? "Restructuring access..." : "Restructure Access Key"}
                  </Button>
                </form>
              )}

            </CardContent>
            <CardFooter className="flex justify-center text-xs border-t border-white/[0.03] pt-4">
              <Link 
                href="/login" 
                className="text-muted-foreground hover:text-white transition-colors"
              >
                Return to Sign-In
              </Link>
            </CardFooter>
          </Card>
        </SlideUp>

      </div>
    </div>
  );
}
