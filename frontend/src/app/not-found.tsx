"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#050816] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-grid-cyber opacity-[0.15]" />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative text-center max-w-md"
      >
        <div className="text-8xl font-bold text-primary/30 mb-4">404</div>
        <h1 className="text-2xl font-bold text-white mb-2">Page Not Found</h1>
        <p className="text-muted-foreground mb-8">
          The page you are looking for does not exist or has been moved.
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary/10 border border-primary/20 text-primary hover:bg-primary/20 transition-all"
        >
          Return Home
        </Link>
      </motion.div>
    </div>
  );
}
