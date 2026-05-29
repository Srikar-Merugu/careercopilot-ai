"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  BarChart3, MapPin, DollarSign, Calendar,
  Search, Building2, X,
} from "lucide-react";
import { useApplications, useUpdateApplication, useDeleteApplication } from "@/hooks/use-dashboard";
import { useDashboardStore } from "@/store/dashboard-store";
import { ApplicationItem } from "@/services/dashboard-service";

const kanbanColumns = [
  { key: "saved", label: "Saved", color: "text-blue-400", bg: "bg-blue-500/10", border: "border-blue-500/20" },
  { key: "applied", label: "Applied", color: "text-amber-400", bg: "bg-amber-500/10", border: "border-amber-500/20" },
  { key: "interview", label: "Interview", color: "text-primary", bg: "bg-primary/10", border: "border-primary/20" },
  { key: "offer", label: "Offer", color: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/20" },
  { key: "rejected", label: "Rejected", color: "text-rose-400", bg: "bg-rose-500/10", border: "border-rose-500/20" },
];

const statusColors: Record<string, string> = {
  saved: "border-blue-500/20 bg-blue-500/5",
  applied: "border-amber-500/20 bg-amber-500/5",
  interview: "border-primary/20 bg-primary/5",
  offer: "border-emerald-500/20 bg-emerald-500/5",
  rejected: "border-rose-500/20 bg-rose-500/5",
};

export default function ApplicationsPage() {
  const { applications } = useDashboardStore();
  useApplications();
  const updateApp = useUpdateApplication();
  const deleteApp = useDeleteApplication();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedApp, setSelectedApp] = useState<ApplicationItem | null>(null);

  const filteredApps = useMemo(() => {
    if (!searchQuery) return applications;
    const q = searchQuery.toLowerCase();
    return applications.filter(
      (a) => a.job_title.toLowerCase().includes(q) || a.company.toLowerCase().includes(q)
    );
  }, [applications, searchQuery]);

  const groupedApps = useMemo(() => {
    const groups: Record<string, ApplicationItem[]> = {};
    kanbanColumns.forEach((col) => { groups[col.key] = []; });
    filteredApps.forEach((app) => {
      if (groups[app.status]) groups[app.status].push(app);
    });
    return groups;
  }, [filteredApps]);

  const handleDragStart = (e: React.DragEvent, app: ApplicationItem) => {
    e.dataTransfer.setData("appId", app.id);
  };

  const handleDrop = (e: React.DragEvent, status: string) => {
    e.preventDefault();
    const appId = e.dataTransfer.getData("appId");
    if (appId) {
      updateApp.mutate({ id: appId, updates: { status } });
    }
  };

  const handleStatusClick = (app: ApplicationItem, newStatus: string) => {
    updateApp.mutate({ id: app.id, updates: { status: newStatus } });
  };

  return (
    <div className="space-y-6 pb-12">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2.5">
            <BarChart3 className="h-6 w-6 text-primary" />
            Applications
          </h1>
          <p className="text-sm text-[#a0aec0] mt-0.5">Track your job applications with Kanban board</p>
        </div>
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#4a5568]" />
          <input
            type="text"
            placeholder="Search applications..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-white/5 border border-white/10 text-sm text-white placeholder:text-[#4a5568] focus:outline-none focus:border-primary/40 transition-all"
          />
        </div>
      </motion.div>

      {/* Kanban Board */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3 min-h-[60vh]">
        {kanbanColumns.map((column) => {
          const apps = groupedApps[column.key] || [];
          return (
            <div
              key={column.key}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => handleDrop(e, column.key)}
              className="rounded-xl border border-white/5 bg-[#0a0f2e]/40 backdrop-blur-sm p-3"
            >
              <div className="flex items-center justify-between mb-3 px-1">
                <div className="flex items-center gap-2">
                  <div className={`h-2.5 w-2.5 rounded-full ${column.bg.replace("/10", "/50")}`} />
                  <h3 className={`text-xs font-semibold ${column.color}`}>{column.label}</h3>
                </div>
                <span className="text-[10px] font-medium text-[#4a5568] bg-white/5 px-1.5 py-0.5 rounded">{apps.length}</span>
              </div>
              <div className="space-y-2">
                <AnimatePresence>
                  {apps.map((app, i) => (
                    <motion.div
                      key={app.id}
                      layout
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ delay: i * 0.02 }}
                      draggable
                      onDragStart={(e) => handleDragStart(e as any, app)}
                      onClick={() => setSelectedApp(app)}
                      className={`p-3 rounded-lg border ${statusColors[app.status] || "border-white/10 bg-white/5"} cursor-pointer hover:bg-white/[0.08] transition-all group`}
                    >
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <h4 className="text-xs font-semibold text-white leading-snug">{app.job_title}</h4>
                        <button
                          onClick={(e) => { e.stopPropagation(); deleteApp.mutate(app.id); }}
                          className="opacity-0 group-hover:opacity-100 p-0.5 rounded hover:bg-rose-500/10 text-rose-400 transition-all"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                      <div className="flex items-center gap-1.5 mb-1.5">
                        <Building2 className="h-3 w-3 text-[#4a5568]" />
                        <span className="text-[10px] text-[#a0aec0]">{app.company}</span>
                      </div>
                      {app.location && (
                        <div className="flex items-center gap-1">
                          <MapPin className="h-2.5 w-2.5 text-[#4a5568]" />
                          <span className="text-[9px] text-[#4a5568]">{app.location}</span>
                        </div>
                      )}
                    </motion.div>
                  ))}
                </AnimatePresence>
                {apps.length === 0 && (
                  <div className="text-center py-6">
                    <p className="text-[10px] text-[#4a5568]">No applications</p>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Detail Modal */}
      {selectedApp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={() => setSelectedApp(null)}>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-lg rounded-xl border border-white/10 bg-[#0b1120]/95 backdrop-blur-xl p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <h2 className="text-lg font-bold text-white">{selectedApp.job_title}</h2>
                <p className="text-sm text-[#a0aec0]">{selectedApp.company}</p>
              </div>
              <button onClick={() => setSelectedApp(null)} className="p-1 rounded-lg hover:bg-white/5">
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-xs text-[#a0aec0]">{selectedApp.location && <><MapPin className="h-3 w-3" />{selectedApp.location}</>}</div>
              {selectedApp.salary_range && <div className="flex items-center gap-2 text-xs text-emerald-400"><DollarSign className="h-3 w-3" />{selectedApp.salary_range}</div>}
              <div className="flex items-center gap-2 text-xs text-[#a0aec0]">{selectedApp.interview_date && <><Calendar className="h-3 w-3" />{new Date(selectedApp.interview_date).toLocaleDateString()}</>}</div>
            </div>
            <div className="flex flex-wrap gap-1.5 mt-4">
              {kanbanColumns.map((col) => (
                <button
                  key={col.key}
                  onClick={() => { handleStatusClick(selectedApp, col.key); setSelectedApp(null); }}
                  className={`px-3 py-1.5 rounded-lg text-[11px] font-medium border transition-all ${
                    selectedApp.status === col.key ? `${col.bg} ${col.border} ${col.color}` : "bg-white/5 border-white/10 text-[#a0aec0] hover:bg-white/10"
                  }`}
                >
                  {col.label}
                </button>
              ))}
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
