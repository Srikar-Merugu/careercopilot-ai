"use client";

import React from "react";
import { motion } from "framer-motion";

interface AnimationProps {
  children: React.ReactNode;
  delay?: number;
  duration?: number;
  className?: string;
}

export function FadeIn({ children, delay = 0, duration = 0.5, className = "" }: AnimationProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration, delay, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function SlideUp({ children, delay = 0, duration = 0.6, className = "" }: AnimationProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration, delay, ease: [0.16, 1, 0.3, 1] }} // Elegant out-expo easing
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function ScaleUp({ children, delay = 0, duration = 0.5, className = "" }: AnimationProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration, delay, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

interface StaggerProps extends AnimationProps {
  staggerChildren?: number;
}

export function StaggerContainer({
  children,
  delay = 0,
  staggerChildren = 0.1,
  className = "",
}: StaggerProps) {
  return (
    <motion.div
      initial="hidden"
      animate="show"
      variants={{
        hidden: {},
        show: {
          transition: {
            delayChildren: delay,
            staggerChildren,
          },
        },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 20 },
        show: { 
          opacity: 1, 
          y: 0, 
          transition: { 
            type: "spring", 
            stiffness: 300, 
            damping: 24 
          } 
        },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
