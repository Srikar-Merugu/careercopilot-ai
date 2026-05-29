"use client";

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-lg text-sm font-medium transition-all duration-300 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 active:scale-95",
  {
    variants: {
      variant: {
        default:
          "bg-[#7C3AED] text-white shadow-glow-primary hover:bg-[#8B5CF6] hover:shadow-[0_0_30px_rgba(139,92,246,0.4)]",
        secondary:
          "bg-[#3B82F6] text-white shadow-glow-accent hover:bg-[#06B6D4] hover:shadow-[0_0_30px_rgba(6,182,212,0.4)]",
        glass:
          "glassmorphism text-white border-white/10 hover:bg-white/10 hover:border-white/20 hover:scale-[1.02]",
        outline:
          "border border-white/10 bg-transparent text-white hover:bg-white/5 hover:border-white/20",
        ghost: "text-foreground hover:bg-white/5 hover:text-white",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3 text-xs",
        lg: "h-12 rounded-lg px-8 text-base",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const BaseButton = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
BaseButton.displayName = "Button";

// Framer motion interactive wrapper for micro-animations
export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ children, ...props }, ref) => {
    return (
      <motion.div
        className="inline-block"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <BaseButton ref={ref} {...props}>
          {children}
        </BaseButton>
      </motion.div>
    );
  }
);
Button.displayName = "MotiButton";
