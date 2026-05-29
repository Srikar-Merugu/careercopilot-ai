"use client";

import React, { useCallback, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Upload,
  FileText,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface UploadAreaProps {
  onUpload: (file: File) => void;
  status: "idle" | "dragging" | "uploading" | "analyzing" | "success" | "failed";
  progress: number;
  error?: string | null;
  onRetry?: () => void;
}

export function UploadArea({
  onUpload,
  status,
  progress,
  error,
  onRetry,
}: UploadAreaProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragOver(false);
      const file = e.dataTransfer.files[0];
      if (file && (file.type === "application/pdf" || file.type.includes("word"))) {
        onUpload(file);
      }
    },
    [onUpload]
  );

  const handleFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) onUpload(file);
      if (inputRef.current) inputRef.current.value = "";
    },
    [onUpload]
  );

  const isActive = status === "uploading" || status === "analyzing";
  const isIdle = status === "idle";

  return (
    <div className="relative">
      <input
        ref={inputRef}
        type="file"
        accept=".pdf,.docx,.doc"
        onChange={handleFileSelect}
        className="hidden"
      />

      <motion.div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => !isActive && inputRef.current?.click()}
        className={cn(
          "relative cursor-pointer rounded-2xl border-2 border-dashed p-10 sm:p-14 transition-all duration-500",
          "bg-[#0b1120]/40 backdrop-blur-xl",
          isDragOver || status === "dragging"
            ? "border-[#8B5CF6]/60 bg-[#8B5CF6]/5 shadow-[0_0_60px_-10px_rgba(139,92,246,0.2)]"
            : isActive
              ? "border-[#8B5CF6]/30 bg-[#0b1120]/50"
              : status === "success"
                ? "border-emerald-500/40 bg-emerald-500/5"
                : status === "failed"
                  ? "border-red-500/30 bg-red-500/5"
                  : "border-white/10 hover:border-white/20 hover:bg-white/[0.03]",
          isIdle && "group"
        )}
        whileHover={isIdle ? { scale: 1.01 } : {}}
        whileTap={isIdle ? { scale: 0.99 } : {}}
      >
        <AnimatePresence mode="wait">
          {status === "success" ? (
            <SuccessState />
          ) : status === "failed" ? (
            <FailedState error={error} onRetry={onRetry} />
          ) : isActive ? (
            <AnalyzingState status={status} progress={progress} />
          ) : (
            <IdleState isDragOver={isDragOver} />
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}

function IdleState({ isDragOver }: { isDragOver: boolean }) {
  return (
    <motion.div
      key="idle"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="flex flex-col items-center gap-5"
    >
      <motion.div
        animate={isDragOver ? { y: -5, scale: 1.1 } : { y: 0, scale: 1 }}
        className="relative"
      >
        <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-[#8B5CF6]/20 to-[#06B6D4]/20 flex items-center justify-center border border-white/10">
          <Upload className="h-7 w-7 text-[#8B5CF6]" />
        </div>
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: [0, 1.2, 1] }}
          transition={{ delay: 0.5, duration: 1.5, repeat: Infinity, repeatDelay: 3 }}
          className="absolute -top-1 -right-1"
        >
          <Sparkles className="h-4 w-4 text-[#06B6D4]" />
        </motion.div>
      </motion.div>

      <div className="text-center">
        <h3 className="text-lg font-semibold text-white mb-1">
          {isDragOver ? "Drop your resume here" : "Upload your resume"}
        </h3>
        <p className="text-sm text-muted-foreground">
          {isDragOver
            ? "We'll analyze it instantly"
            : "Drag & drop or click to browse"}
        </p>
      </div>

      <div className="flex items-center gap-3 text-xs text-muted-foreground">
        <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/5 border border-white/5">
          <FileText className="h-3 w-3" /> PDF
        </span>
        <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/5 border border-white/5">
          <FileText className="h-3 w-3" /> DOCX
        </span>
      </div>
    </motion.div>
  );
}

function AnalyzingState({
  status,
  progress,
}: {
  status: string;
  progress: number;
}) {
  const isAnalyzing = status === "analyzing";

  return (
    <motion.div
      key="analyzing"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="flex flex-col items-center gap-5"
    >
      <div className="relative">
        <motion.div
          className="h-16 w-16 rounded-2xl bg-gradient-to-br from-[#8B5CF6]/20 to-[#06B6D4]/20 flex items-center justify-center border border-white/10"
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          {isAnalyzing ? (
            <Sparkles className="h-7 w-7 text-[#8B5CF6]" />
          ) : (
            <Loader2 className="h-7 w-7 text-[#06B6D4] animate-spin" />
          )}
        </motion.div>
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
          className="absolute -inset-2 rounded-2xl border-2 border-transparent border-t-[#8B5CF6]/30 border-r-[#06B6D4]/30"
        />
      </div>

      <div className="text-center">
        <h3 className="text-lg font-semibold text-white mb-1">
          {isAnalyzing ? "AI is scanning your resume" : "Uploading..."}
        </h3>
        <p className="text-sm text-muted-foreground">
          {isAnalyzing
            ? "Extracting skills, experience, and insights"
            : `${progress}% complete`}
        </p>
      </div>

      <div className="w-full max-w-xs">
        <div className="h-1.5 rounded-full bg-white/10 overflow-hidden">
          <motion.div
            className="h-full rounded-full bg-gradient-to-r from-[#8B5CF6] to-[#06B6D4]"
            initial={{ width: 0 }}
            animate={{
              width: isAnalyzing ? "100%" : `${progress}%`,
            }}
            transition={{ duration: 0.5 }}
          />
        </div>
        {isAnalyzing && (
          <div className="mt-2 flex justify-center gap-1">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className="h-1 w-1 rounded-full bg-[#8B5CF6]"
                animate={{ opacity: [0.3, 1, 0.3] }}
                transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.3 }}
              />
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}

function SuccessState() {
  return (
    <motion.div
      key="success"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="flex flex-col items-center gap-4"
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 15 }}
        className="h-16 w-16 rounded-2xl bg-emerald-500/20 flex items-center justify-center border border-emerald-500/30"
      >
        <CheckCircle2 className="h-8 w-8 text-emerald-400" />
      </motion.div>
      <div className="text-center">
        <h3 className="text-lg font-semibold text-white mb-1">
          Resume analyzed successfully
        </h3>
        <p className="text-sm text-muted-foreground">
          Scroll down to see your AI-powered insights
        </p>
      </div>
    </motion.div>
  );
}

function FailedState({
  error,
  onRetry,
}: {
  error?: string | null;
  onRetry?: () => void;
}) {
  return (
    <motion.div
      key="failed"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="flex flex-col items-center gap-4"
    >
      <div className="h-16 w-16 rounded-2xl bg-red-500/20 flex items-center justify-center border border-red-500/30">
        <AlertCircle className="h-8 w-8 text-red-400" />
      </div>
      <div className="text-center">
        <h3 className="text-lg font-semibold text-white mb-1">
          Upload failed
        </h3>
        <p className="text-sm text-red-400/80 mb-4">
          {error || "Something went wrong. Please try again."}
        </p>
        {onRetry && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onRetry();
            }}
            className="px-4 py-2 text-xs font-semibold rounded-lg bg-red-500/20 border border-red-500/30 text-red-300 hover:bg-red-500/30 transition-all"
          >
            Try Again
          </button>
        )}
      </div>
    </motion.div>
  );
}
