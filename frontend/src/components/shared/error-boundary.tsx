"use client";

import React from "react";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";

interface ErrorBoundaryProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export function ErrorBoundaryView({ error, reset }: ErrorBoundaryProps) {
  React.useEffect(() => {
    // Log error to monitoring services in production
    console.error("ErrorBoundary caught an exception:", error);
  }, [error]);

  return (
    <div className="min-h-[70vh] w-full flex items-center justify-center p-4">
      <Card className="max-w-md w-full border-red-500/20 shadow-glow-accent bg-[#0b1120]/60 backdrop-blur-xl">
        <CardHeader className="text-center pb-2">
          <div className="mx-auto h-12 w-12 rounded-full bg-red-500/10 flex items-center justify-center mb-4 border border-red-500/30">
            <AlertTriangle className="h-6 w-6 text-red-400" />
          </div>
          <CardTitle className="text-xl font-display font-bold text-white tracking-wide">
            Application Error
          </CardTitle>
          <CardDescription className="text-xs text-[#a0aec0] mt-1">
            An unexpected error occurred in CareerCopilot.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="rounded-lg bg-black/40 border border-white/5 p-4 overflow-x-auto max-h-40">
            <p className="text-xs font-mono text-red-300 whitespace-pre-wrap leading-relaxed">
              {error.message || "Unknown client-side exception."}
            </p>
            {error.digest && (
              <p className="text-[10px] font-mono text-muted-foreground mt-2">
                Digest: {error.digest}
              </p>
            )}
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-2 sm:flex-row sm:justify-between border-t border-white/5 pt-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => (window.location.href = "/")}
            className="w-full sm:w-auto"
          >
            <Home className="mr-2 h-4 w-4" />
            Go Home
          </Button>
          <Button
            variant="default"
            size="sm"
            onClick={reset}
            className="w-full sm:w-auto"
          >
            <RefreshCw className="mr-2 h-4 w-4 animate-spin-slow" />
            Try Again
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
