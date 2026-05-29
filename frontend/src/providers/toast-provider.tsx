"use client";

import React, { createContext, useContext, useState, useCallback } from "react";
import { X, CheckCircle2, AlertCircle, Info } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

export type ToastType = "success" | "error" | "info";

export interface Toast {
  id: string;
  title: string;
  description?: string;
  type: ToastType;
}

interface ToastContextType {
  toast: (title: string, description?: string, type?: ToastType) => void;
  dismiss: (id: string) => void;
  toasts: Toast[];
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const dismiss = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const toast = useCallback((title: string, description?: string, type: ToastType = "info") => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, title, description, type }]);

    // Auto-dismiss after 4 seconds
    setTimeout(() => {
      dismiss(id);
    }, 4000);
  }, [dismiss]);

  return (
    <ToastContext.Provider value={{ toast, dismiss, toasts }}>
      {children}
      
      {/* Toast Portal/Container */}
      <div className="fixed bottom-5 right-5 z-[9999] flex flex-col gap-3 w-full max-w-md pointer-events-none">
        <AnimatePresence>
          {toasts.map((t) => {
            const Icon = t.type === "success" 
              ? CheckCircle2 
              : t.type === "error" 
                ? AlertCircle 
                : Info;
            
            const borderColors = {
              success: "border-[#8B5CF6]/30 shadow-[#8B5CF6]/10",
              error: "border-red-500/30 shadow-red-500/10",
              info: "border-[#06B6D4]/30 shadow-[#06B6D4]/10",
            };

            const iconColors = {
              success: "text-[#8B5CF6]",
              error: "text-red-400",
              info: "text-[#06B6D4]",
            };

            return (
              <motion.div
                key={t.id}
                initial={{ opacity: 0, y: 50, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
                className={`pointer-events-auto flex items-start gap-3 p-4 rounded-lg bg-[#0b1120]/90 border backdrop-blur-xl shadow-xl ${borderColors[t.type]} transition-all duration-300`}
              >
                <div className={`mt-0.5 ${iconColors[t.type]}`}>
                  <Icon className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <h4 className="text-sm font-semibold text-white tracking-wide">{t.title}</h4>
                  {t.description && (
                    <p className="mt-1 text-xs text-[#a0aec0] leading-relaxed">{t.description}</p>
                  )}
                </div>
                <button
                  onClick={() => dismiss(t.id)}
                  className="text-[#a0aec0] hover:text-white transition-colors duration-200"
                >
                  <X className="h-4 w-4" />
                </button>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
}
