"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Shield, Users, CreditCard, BarChart3, Brain, Bot, Send, Settings } from "lucide-react";

const adminLinks = [
  { href: "/admin", label: "Dashboard", icon: Shield },
  { href: "/admin/users", label: "Users", icon: Users },
  { href: "/admin/subscriptions", label: "Subscriptions", icon: CreditCard },
  { href: "/admin/analytics", label: "Analytics", icon: BarChart3 },
  { href: "/admin/ai-usage", label: "AI Usage", icon: Brain },
  { href: "/admin/automation", label: "Automation", icon: Bot },
  { href: "/admin/broadcast", label: "Broadcast", icon: Send },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-[#050816]">
      <div className="absolute inset-0 bg-grid-cyber opacity-[0.15]" />
      <div className="flex h-screen">
        <aside className="w-64 border-r border-white/5 bg-black/40 backdrop-blur-xl p-4 flex flex-col">
          <div className="flex items-center gap-2 mb-8 px-3">
            <Shield className="h-5 w-5 text-primary" />
            <span className="text-sm font-bold text-white">Admin Panel</span>
          </div>
          <nav className="flex-1 space-y-1">
            {adminLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all ${
                    isActive
                      ? "bg-primary/10 text-primary border border-primary/20"
                      : "text-muted-foreground hover:text-white hover:bg-white/5"
                  }`}
                >
                  <link.icon className="h-4 w-4" />
                  {link.label}
                </Link>
              );
            })}
          </nav>
          <Link
            href="/dashboard"
            className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm text-muted-foreground hover:text-white hover:bg-white/5 transition-all mt-auto"
          >
            <Settings className="h-4 w-4" />
            Back to Dashboard
          </Link>
        </aside>
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
