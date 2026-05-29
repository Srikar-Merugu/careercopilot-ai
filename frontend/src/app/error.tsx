"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const [errorId, setErrorId] = useState("");

  useEffect(() => {
    setErrorId(crypto.randomUUID().slice(0, 8));
    console.error("Application error:", error);
  }, [error]);

  return (
    <div className="min-h-screen bg-[#050816] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-grid-cyber opacity-[0.15]" />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative text-center max-w-md"
      >
        <div className="text-6xl mb-4">⚠️</div>
        <h1 className="text-2xl font-bold text-white mb-2">Something went wrong</h1>
        <p className="text-muted-foreground mb-2">
          An unexpected error occurred. Our team has been notified.
        </p>
        {errorId && (
          <p className="text-xs text-muted-foreground mb-8 font-mono">
            Error ID: {errorId}
          </p>
        )}
        <button
          onClick={reset}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary/10 border border-primary/20 text-primary hover:bg-primary/20 transition-all"
        >
          Try Again
        </button>
      </motion.div>
    </div>
  );
}
