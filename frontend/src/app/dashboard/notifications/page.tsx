"use client";

import { useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bell, CheckCheck, Brain, Briefcase, Calendar, FileText,
  Target, Sparkles, AlertCircle, ChevronRight, Clock,
} from "lucide-react";
import { useNotifications, useMarkNotificationRead, useMarkAllNotificationsRead } from "@/hooks/use-dashboard";
import { useDashboardStore } from "@/store/dashboard-store";

const notifIcons: Record<string, any> = {
  ai_recommendation: Brain,
  interview_reminder: Calendar,
  application_update: Briefcase,
  job_alert: AlertCircle,
  career_insight: Target,
  resume_analysis: FileText,
  system: Sparkles,
};

const notifColors: Record<string, string> = {
  ai_recommendation: "text-primary bg-primary/10 border-primary/20",
  interview_reminder: "text-amber-400 bg-amber-500/10 border-amber-500/20",
  application_update: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
  job_alert: "text-blue-400 bg-blue-500/10 border-blue-500/20",
  career_insight: "text-violet-400 bg-violet-500/10 border-violet-500/20",
  resume_analysis: "text-cyan-400 bg-cyan-500/10 border-cyan-500/20",
  system: "text-rose-400 bg-rose-500/10 border-rose-500/20",
};

export default function NotificationsPage() {
  const { notifications, unreadCount } = useDashboardStore();
  useNotifications();
  const markRead = useMarkNotificationRead();
  const markAllRead = useMarkAllNotificationsRead();

  const sortedNotifs = useMemo(() => {
    return [...notifications].sort((a, b) => {
      if (a.is_read !== b.is_read) return a.is_read ? 1 : -1;
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    });
  }, [notifications]);

  return (
    <div className="space-y-6 pb-12">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2.5">
            <Bell className="h-6 w-6 text-primary" />
            Notifications
          </h1>
          <p className="text-sm text-[#a0aec0] mt-0.5">
            {unreadCount > 0 ? `${unreadCount} unread notifications` : "All caught up"}
          </p>
        </div>
        {unreadCount > 0 && (
          <button
            onClick={() => markAllRead.mutate()}
            className="flex items-center gap-2 px-3 py-2 rounded-xl bg-primary/10 border border-primary/20 text-primary text-xs font-medium hover:bg-primary/20 transition-all"
          >
            <CheckCheck className="h-3.5 w-3.5" />
            Mark all as read
          </button>
        )}
      </motion.div>

      <div className="max-w-2xl mx-auto space-y-2">
        <AnimatePresence>
          {sortedNotifs.map((notif, i) => {
            const Icon = notifIcons[notif.type] || Bell;
            const colors = notifColors[notif.type] || "text-[#a0aec0] bg-white/5 border-white/10";

            return (
              <motion.div
                key={notif.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ delay: i * 0.025 }}
                onClick={() => { if (!notif.is_read) markRead.mutate(notif.id); }}
                className={`group relative flex items-start gap-3 p-4 rounded-xl border transition-all cursor-pointer ${
                  notif.is_read
                    ? "border-white/5 bg-[#0a0f2e]/30"
                    : "border-primary/20 bg-[#0a0f2e]/60"
                } hover:bg-white/[0.04]`}
              >
                {!notif.is_read && (
                  <div className="absolute left-4 top-4 h-2 w-2 rounded-full bg-primary animate-pulse" />
                )}
                <div className={`h-9 w-9 rounded-lg flex items-center justify-center shrink-0 ${colors}`}>
                  <Icon className="h-4 w-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <h4 className={`text-sm font-semibold ${notif.is_read ? "text-[#a0aec0]" : "text-white"}`}>
                      {notif.title}
                    </h4>
                    <ChevronRight className={`h-4 w-4 shrink-0 transition-colors ${notif.is_read ? "text-[#4a5568]" : "text-primary"} opacity-0 group-hover:opacity-100`} />
                  </div>
                  {notif.content && (
                    <p className={`text-xs mt-1 ${notif.is_read ? "text-[#4a5568]" : "text-[#a0aec0]"}`}>{notif.content}</p>
                  )}
                  <div className="flex items-center gap-2 mt-2">
                    <Clock className="h-3 w-3 text-[#4a5568]" />
                    <span className="text-[10px] text-[#4a5568]">
                      {new Date(notif.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}
                    </span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-white/5 text-[#4a5568] capitalize">{notif.type.replace(/_/g, " ")}</span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>

        {sortedNotifs.length === 0 && (
          <div className="text-center py-16">
            <Bell className="h-12 w-12 text-[#4a5568] mx-auto mb-3" />
            <h3 className="text-lg font-semibold text-white mb-1">No notifications</h3>
            <p className="text-sm text-[#a0aec0]">You&apos;re all caught up! New notifications will appear here.</p>
          </div>
        )}
      </div>
    </div>
  );
}
