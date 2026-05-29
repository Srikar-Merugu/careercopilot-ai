"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Terminal, KeyRound, Mail, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { GlowBackground } from "@/components/animations/glow-bg";
import { FadeIn, SlideUp } from "@/components/animations/motion-wrapper";
import { useAuthStore } from "@/store/auth-store";
import { useToast } from "@/providers/toast-provider";
import { forgotPasswordSchema, ForgotPasswordInput } from "@/lib/validations";

export default function ForgotPasswordPage() {
  const { forgotPassword, isLoading } = useAuthStore();
  const { toast } = useToast();
  
  const [authError, setAuthError] = useState<string | null>(null);
  const [isSent, setIsSent] = useState(false);

  // Form hooks
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordInput>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const handleForgotSubmit = async (data: ForgotPasswordInput) => {
    setAuthError(null);
    try {
      await forgotPassword(data.email);
      setIsSent(true);
      toast(
        "Link Dispatched",
        "A password recovery token link was dispatched to your inbox.",
        "success"
      );
    } catch (err: any) {
      console.error(err);
      const msg = err.message || "Failed to dispatch recovery email. Try again.";
      setAuthError(msg);
      toast("Dispatch Failed", msg, "error");
    }
  };

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
              Forgot Access Key
            </h2>
            <p className="text-xs text-muted-foreground">
              Recover system access credentials safely using registered emails.
            </p>
          </div>
        </FadeIn>

        {/* Credentials Form Box */}
        <SlideUp delay={0.2}>
          <Card className="border-white/5 bg-[#0b1120]/45 backdrop-blur-xl shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-[#8B5CF6]/35 to-transparent" />
            
            <CardHeader className="pb-4">
              <CardTitle className="text-base text-white tracking-wide flex items-center gap-2">
                <KeyRound className="h-4 w-4 text-primary" /> Recover Key
              </CardTitle>
              <CardDescription className="text-[11px]">
                Submit your registered email to receive securely signed recovery parameters.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">

              {authError && (
                <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-xs text-red-400 font-semibold leading-relaxed">
                  {authError}
                </div>
              )}

              {isSent ? (
                <div className="py-6 text-center space-y-4">
                  <div className="mx-auto h-12 w-12 rounded-full bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
                    <Mail className="h-6 w-6 text-emerald-400" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-white">Check Your Inbox</h4>
                    <p className="text-xs text-[#a0aec0] mt-1 leading-relaxed">
                      We've dispatched recovery credentials with verification parameters.
                    </p>
                  </div>
                  <div className="pt-2">
                    <Button variant="outline" size="sm" onClick={() => setIsSent(false)}>
                      Resend Link
                    </Button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit(handleForgotSubmit)} className="space-y-4">
                  
                  {/* Email address input */}
                  <div className="space-y-1.5">
                    <label htmlFor="email-forgot" className="block text-xs font-semibold text-white/80">
                      Registered Email Address
                    </label>
                    <input
                      type="email"
                      id="email-forgot"
                      placeholder="alex@career.copilot"
                      {...register("email")}
                      className="w-full rounded-lg bg-black/40 border border-white/5 px-3 py-2 text-sm text-white placeholder-muted-foreground/60 focus:outline-none focus:border-primary/50 transition-colors"
                    />
                    {errors.email && (
                      <p className="text-[10px] text-red-400 font-semibold">{errors.email.message}</p>
                    )}
                  </div>

                  <Button 
                    type="submit" 
                    variant="default" 
                    className="w-full font-semibold"
                    disabled={isSubmitting || isLoading}
                  >
                    {isSubmitting ? "Dispatching parameters..." : "Dispatch Recovery Link"}
                  </Button>
                </form>
              )}

            </CardContent>
            <CardFooter className="flex justify-center text-xs border-t border-white/[0.03] pt-4">
              <Link 
                href="/login" 
                className="text-[#a0aec0] hover:text-white transition-colors duration-150 inline-flex items-center gap-1.5"
              >
                <ArrowLeft className="h-3.5 w-3.5" /> Back to sign-in
              </Link>
            </CardFooter>
          </Card>
        </SlideUp>

      </div>
    </div>
  );
}
