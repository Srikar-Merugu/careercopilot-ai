"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Terminal, LayoutDashboard, UserCheck, Settings, LogOut, Loader2,
  FileText, Briefcase, BookmarkCheck, Brain, Bell, Search,
  Menu, X, Sparkles, BarChart3, CreditCard,
  ChevronDown, PanelLeftClose, Smartphone, Zap,
} from "lucide-react";
import { useAuthStore } from "@/store/auth-store";
import { useDashboardStore } from "@/store/dashboard-store";
import { useToast } from "@/providers/toast-provider";
import { motion, AnimatePresence } from "framer-motion";

const sidebarLinks = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/dashboard/career-insights", label: "Career Insights", icon: Brain },
  { href: "/dashboard/jobs", label: "Job Search", icon: Briefcase },
  { href: "/dashboard/auto-apply", label: "Auto Apply", icon: Zap },
  { href: "/dashboard/applications", label: "Applications", icon: BarChart3 },
  { href: "/dashboard/saved-jobs", label: "Saved Jobs", icon: BookmarkCheck },
  { href: "/dashboard/resume", label: "Resume Analysis", icon: FileText },
  { href: "/dashboard/interview-prep", label: "Interview Prep", icon: UserCheck },
  { href: "/dashboard/telegram", label: "Telegram Bot", icon: Smartphone },
  { href: "/dashboard/notifications", label: "Notifications", icon: Bell },
  { href: "/dashboard/billing", label: "Billing", icon: CreditCard },
  { href: "/dashboard/settings", label: "Settings", icon: Settings },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isAuthenticated, logout, initializeSession, isLoading } = useAuthStore();
  const { sidebarCollapsed, toggleSidebar, unreadCount } = useDashboardStore();
  const { toast } = useToast();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);
  useEffect(() => { initializeSession(); }, [initializeSession]);

  const handleSignOut = async () => {
    try {
      await logout();
      toast("Logged Out", "Session terminated securely.", "info");
      router.push("/login");
    } catch {
      toast("Error", "Failed to sign out.", "error");
    }
  };

  if (!mounted || isLoading) {
    return (
      <div className="min-h-screen bg-[#050816] flex items-center justify-center gap-4">
        <div className="absolute inset-0 bg-grid-cyber opacity-[0.15]" />
        <Loader2 className="h-8 w-8 animate-spin text-primary shadow-glow-primary" />
        <span className="text-xs font-semibold text-muted-foreground uppercase tracking-widest animate-pulse">Calibrating...</span>
      </div>
    );
  }

  if (!isAuthenticated) {
    if (typeof window !== "undefined") router.push("/login");
    return null;
  }

  const SidebarLink = ({ href, label, icon: Icon }: { href: string; label: string; icon: any }) => {
    const isActive = pathname === href || (href !== "/dashboard" && pathname.startsWith(href));
    return (
      <Link
        href={href}
        onClick={() => setMobileSidebarOpen(false)}
        className={`group relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
          isActive
            ? "text-white bg-primary/10 border border-primary/20 shadow-glow-sm"
            : "text-[#a0aec0] hover:text-white hover:bg-white/[0.04] border border-transparent"
        }`}
      >
        <div className={`h-5 w-5 flex items-center justify-center ${isActive ? "text-primary" : "text-[#6b7a99] group-hover:text-white transition-colors"}`}>
          <Icon className="h-4 w-4" />
        </div>
        {!sidebarCollapsed && <span>{label}</span>}
        {isActive && !sidebarCollapsed && (
          <motion.div layoutId="activeNav" className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 rounded-full bg-primary" />
        )}
        {label === "Notifications" && unreadCount > 0 && !sidebarCollapsed && (
          <span className="ml-auto px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-primary/20 text-primary border border-primary/30">
            {unreadCount}
          </span>
        )}
      </Link>
    );
  };

  return (
    <div className="min-h-screen flex bg-[#050816] relative text-white">
      <div className="absolute inset-0 bg-grid-cyber opacity-[0.12] pointer-events-none" />

      {/* Desktop Sidebar */}
      <motion.aside
        animate={{ width: sidebarCollapsed ? 72 : 256 }}
        className="hidden md:flex flex-col border-r border-white/5 bg-[#0b1120]/70 backdrop-blur-xl relative z-20 transition-[width] duration-300"
      >
        <div className="h-16 flex items-center gap-2.5 px-4 border-b border-white/5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-tr from-[#7C3AED] to-[#06B6D4] shadow-lg shrink-0">
            <Terminal className="h-4 w-4 text-white" />
          </div>
          {!sidebarCollapsed && (
            <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="font-bold text-sm tracking-tight">
              Career<span className="text-primary">Copilot</span>
            </motion.span>
          )}
          <button onClick={toggleSidebar} className="ml-auto p-1.5 rounded-lg hover:bg-white/5 text-[#4a5568] hover:text-white transition-all">
            <PanelLeftClose className="h-4 w-4" />
          </button>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto scrollbar-thin">
          {sidebarLinks.map((link) => (
            <SidebarLink key={link.href} {...link} />
          ))}
        </nav>

        <div className="p-3 border-t border-white/5">
          <div className="flex items-center gap-3 px-2 py-2">
            <div className="h-9 w-9 rounded-full bg-gradient-to-tr from-[#7C3AED] to-[#06B6D4] flex items-center justify-center font-bold text-xs uppercase shadow-glow-primary shrink-0">
              {user?.name?.slice(0, 2) || "U"}
            </div>
            {!sidebarCollapsed && (
              <div className="flex-1 min-w-0">
                <h4 className="text-xs font-semibold text-white truncate">{user?.name}</h4>
                <p className="text-[9px] text-muted-foreground truncate">{user?.email}</p>
              </div>
            )}
          </div>
          <button
            onClick={handleSignOut}
            className="mt-2 w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-xs font-medium text-red-400 hover:bg-red-500/10 border border-red-500/10 hover:border-red-500/20 transition-all"
          >
            <LogOut className="h-3.5 w-3.5" />
            {!sidebarCollapsed && <span>Sign Out</span>}
          </button>
        </div>
      </motion.aside>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {mobileSidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-30 bg-black/60 backdrop-blur-sm md:hidden"
            onClick={() => setMobileSidebarOpen(false)}
          >
            <motion.aside
              initial={{ x: -300 }}
              animate={{ x: 0 }}
              exit={{ x: -300 }}
              className="absolute left-0 top-0 bottom-0 w-64 bg-[#0b1120]/95 backdrop-blur-xl border-r border-white/5 p-4"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2.5">
                  <div className="h-8 w-8 rounded-lg bg-gradient-to-tr from-[#7C3AED] to-[#06B6D4] flex items-center justify-center">
                    <Terminal className="h-4 w-4 text-white" />
                  </div>
                  <span className="font-bold text-sm">Career<span className="text-primary">Copilot</span></span>
                </div>
                <button onClick={() => setMobileSidebarOpen(false)} className="p-1.5 rounded-lg hover:bg-white/5">
                  <X className="h-4 w-4" />
                </button>
              </div>
              <nav className="space-y-1">
                {sidebarLinks.map((link) => (
                  <SidebarLink key={link.href} {...link} />
                ))}
              </nav>
            </motion.aside>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 relative z-10">
        {/* Top Navbar */}
        <header className="sticky top-0 z-20 h-16 border-b border-white/5 bg-[#050816]/80 backdrop-blur-xl">
          <div className="flex items-center justify-between h-full px-4 sm:px-6">
            <div className="flex items-center gap-3">
              <button onClick={() => setMobileSidebarOpen(true)} className="md:hidden p-2 rounded-lg hover:bg-white/5 text-[#a0aec0]">
                <Menu className="h-5 w-5" />
              </button>
              <div className="relative hidden sm:block">
                <Search className={`absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 transition-colors ${searchFocused ? "text-primary" : "text-[#4a5568]"}`} />
                <input
                  type="text"
                  placeholder="Search jobs, skills, companies..."
                  onFocus={() => setSearchFocused(true)}
                  onBlur={() => setSearchFocused(false)}
                  className="w-64 lg:w-80 pl-10 pr-4 py-2 rounded-xl bg-white/5 border border-white/10 text-sm text-white placeholder:text-[#4a5568] focus:outline-none focus:border-primary/40 focus:ring-1 focus:ring-primary/20 transition-all"
                />
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Link
                href="/dashboard/notifications"
                className="relative p-2 rounded-xl hover:bg-white/5 text-[#a0aec0] hover:text-white transition-all"
              >
                <Bell className="h-4.5 w-4.5" />
                {unreadCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 h-4 w-4 rounded-full bg-primary text-[9px] font-bold flex items-center justify-center text-white shadow-glow-primary">
                    {unreadCount > 9 ? "9+" : unreadCount}
                  </span>
                )}
              </Link>

              <Link href="/dashboard/career-insights" className="relative p-2 rounded-xl hover:bg-white/5 text-[#a0aec0] hover:text-white transition-all">
                <Sparkles className="h-4.5 w-4.5" />
              </Link>

              <div className="relative">
                <button
                  onClick={() => setProfileOpen(!profileOpen)}
                  className="flex items-center gap-2 ml-1 p-1.5 pr-3 rounded-xl hover:bg-white/5 transition-all"
                >
                  <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-[#7C3AED] to-[#06B6D4] flex items-center justify-center font-bold text-xs uppercase shadow-glow-sm">
                    {user?.name?.slice(0, 2) || "U"}
                  </div>
                  <ChevronDown className={`h-3.5 w-3.5 text-[#4a5568] transition-transform ${profileOpen ? "rotate-180" : ""}`} />
                </button>
                <AnimatePresence>
                  {profileOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.96 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.96 }}
                      className="absolute right-0 top-full mt-2 w-56 rounded-xl border border-white/10 bg-[#0b1120]/95 backdrop-blur-xl shadow-2xl p-2"
                      onMouseLeave={() => setProfileOpen(false)}
                    >
                      <div className="px-3 py-2 border-b border-white/5 mb-1">
                        <p className="text-sm font-semibold text-white">{user?.name}</p>
                        <p className="text-[11px] text-[#a0aec0]">{user?.email}</p>
                      </div>
                      <Link href="/dashboard/settings" onClick={() => setProfileOpen(false)} className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-[#a0aec0] hover:text-white hover:bg-white/5 transition-all">
                        <Settings className="h-4 w-4" /> Settings
                      </Link>
                      <Link href="/dashboard/billing" onClick={() => setProfileOpen(false)} className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-[#a0aec0] hover:text-white hover:bg-white/5 transition-all">
                        <CreditCard className="h-4 w-4" /> Billing
                      </Link>
                      <button onClick={handleSignOut} className="flex items-center gap-2.5 w-full px-3 py-2 rounded-lg text-sm text-red-400 hover:bg-red-500/10 transition-all mt-1">
                        <LogOut className="h-4 w-4" /> Sign Out
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-grow p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full overflow-y-auto">
          {children}
        </div>
      </div>
    </div>
  );
}
