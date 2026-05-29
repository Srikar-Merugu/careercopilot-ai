"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Terminal, Menu, X, ArrowRight, LayoutDashboard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/store/auth-store";
import { useToast } from "@/providers/toast-provider";
import { motion, AnimatePresence } from "framer-motion";

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  
  const router = useRouter();
  const { user, isAuthenticated, logout } = useAuthStore();
  const { toast } = useToast();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      toast("Logged Out", "Session securely terminated.", "info");
      router.push("/");
      router.refresh();
    } catch {
      toast("Error", "Failed to sign out cleanly.", "error");
    }
  };

  const navItems = [
    { label: "Features", href: "#features" },
    { label: "How It Works", href: "#how-it-works" },
    { label: "Pricing", href: "#pricing" },
    { label: "FAQ", href: "#faq" }
  ];

  return (
    <header className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-300 ${
      scrolled 
        ? "bg-[#050816]/75 border-b border-white/[0.06] backdrop-blur-xl shadow-lg py-3" 
        : "bg-transparent py-5"
    }`}>
      <div className="container mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        
        {/* Logo / Brand Name */}
        <Link href="/" className="flex items-center gap-2.5 transition-transform duration-200 hover:scale-[1.01]">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-tr from-[#7C3AED] to-[#06B6D4] shadow-glow-primary">
            <Terminal className="h-5 w-5 text-white" />
          </div>
          <span className="font-display text-lg font-bold tracking-tight text-white sm:text-xl">
            CareerCopilot<span className="bg-gradient-to-r from-[#8B5CF6] to-[#06B6D4] bg-clip-text text-transparent">.AI</span>
          </span>
        </Link>

        {/* Desktop Menu Links */}
        <nav className="hidden md:flex items-center gap-8">
          {navItems.map((item) => (
            <Link 
              key={item.label}
              href={item.href} 
              className="text-xs font-semibold text-[#a0aec0] hover:text-white transition-colors duration-200 tracking-wide"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Action Buttons */}
        <div className="hidden md:flex items-center gap-4">
          {isAuthenticated ? (
            <>
              <span className="text-xs text-[#a0aec0]">
                <strong className="text-white">{user?.name}</strong>
              </span>
              <Link href="/dashboard">
                <Button variant="glass" size="sm" className="h-9 px-4 text-xs font-semibold">
                  <LayoutDashboard className="mr-1.5 h-3.5 w-3.5" />
                  Dashboard
                </Button>
              </Link>
              <Button variant="outline" size="sm" className="h-9 px-4 text-xs font-semibold" onClick={handleLogout}>
                Log Out
              </Button>
            </>
          ) : (
            <>
              <Link href="/login">
                <Button variant="ghost" size="sm" className="text-xs font-semibold hover:text-white">
                  Sign In
                </Button>
              </Link>
              <Link href="/signup">
                <Button size="sm" className="bg-[#7c3aed] hover:bg-[#6d28d9] text-white shadow-glow-primary px-5 text-xs font-semibold h-9">
                  Get Started <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
                </Button>
              </Link>
            </>
          )}
        </div>

        {/* Mobile Hamburger Trigger */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden text-[#a0aec0] hover:text-white p-1"
        >
          {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile Drawer Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
            className="md:hidden bg-[#050816]/95 border-b border-white/5 backdrop-blur-xl px-4 pt-2 pb-6 space-y-4 overflow-hidden"
          >
            {navItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className="block text-sm text-[#a0aec0] hover:text-white py-2 font-medium"
              >
                {item.label}
              </Link>
            ))}
            <hr className="border-white/5 my-2" />
            <div className="flex flex-col gap-2 pt-2">
              {isAuthenticated ? (
                <>
                  <span className="text-xs text-[#a0aec0] text-center mb-2">
                    Session: <strong className="text-white">{user?.name}</strong>
                  </span>
                  <Link href="/dashboard" onClick={() => setMobileMenuOpen(false)}>
                    <Button variant="glass" className="w-full h-10 text-xs font-semibold">
                      <LayoutDashboard className="mr-2 h-4 w-4" /> Dashboard
                    </Button>
                  </Link>
                  <Button variant="outline" className="w-full h-10 text-xs font-semibold" onClick={() => { handleLogout(); setMobileMenuOpen(false); }}>
                    Log Out
                  </Button>
                </>
              ) : (
                <>
                  <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
                    <Button variant="ghost" className="w-full h-10 text-xs font-semibold">
                      Sign In
                    </Button>
                  </Link>
                  <Link href="/signup" onClick={() => setMobileMenuOpen(false)}>
                    <Button className="w-full bg-[#7c3aed] text-white h-10 text-xs font-semibold">
                      Get Started
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
