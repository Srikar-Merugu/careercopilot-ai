"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  MapPin,
  Building2,
  DollarSign,
  ExternalLink,
  Bookmark,
  BookmarkCheck,
  Clock,
  ChevronRight,
} from "lucide-react";
import { JobData } from "@/store/job-store";
import { MatchBadge } from "./match-score";
import { cn } from "@/lib/utils";

interface JobCardProps {
  job: JobData;
  matchScore?: number;
  isSaved?: boolean;
  onSave?: () => void;
  onUnsave?: () => void;
  onClick?: () => void;
  isSelected?: boolean;
  index?: number;
}

export function JobCard({
  job,
  matchScore,
  isSaved,
  onSave,
  onUnsave,
  onClick,
  isSelected,
  index = 0,
}: JobCardProps) {
  const formatSalary = (min?: number, max?: number) => {
    if (!min && !max) return null;
    const fmt = (n: number) =>
      "$" + (n >= 1000 ? Math.round(n / 1000) + "k" : n.toString());
    if (min && max) return `${fmt(min)} - ${fmt(max)}`;
    if (min) return `From ${fmt(min)}`;
    if (max) return `Up to ${fmt(max)}`;
    return null;
  };

  const salary = formatSalary(job.salary_min, job.salary_max);
  const daysAgo = job.posted_at
    ? Math.floor(
        (Date.now() - new Date(job.posted_at).getTime()) / (1000 * 60 * 60 * 24)
      )
    : null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.03, duration: 0.4 }}
      onClick={onClick}
      className={cn(
        "group relative p-5 rounded-xl border cursor-pointer transition-all duration-300",
        isSelected
          ? "border-[#8B5CF6]/40 bg-[#8B5CF6]/5 shadow-[0_0_30px_-10px_rgba(139,92,246,0.15)]"
          : "border-white/5 bg-[#0b1120]/40 backdrop-blur-sm hover:border-white/10 hover:bg-[#0b1120]/60 hover:shadow-lg"
      )}
    >
      <div className="flex items-start gap-4">
        <div className="h-11 w-11 rounded-xl bg-gradient-to-br from-[#8B5CF6]/20 to-[#06B6D4]/20 flex items-center justify-center text-base font-bold text-white border border-white/5 flex-shrink-0">
          {job.company.charAt(0)}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <h3 className="text-sm font-semibold text-white truncate group-hover:text-[#8B5CF6] transition-colors">
                {job.title}
              </h3>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="flex items-center gap-1 text-[11px] text-muted-foreground">
                  <Building2 className="h-3 w-3" />
                  {job.company}
                </span>
                {job.location && (
                  <span className="flex items-center gap-1 text-[11px] text-muted-foreground">
                    <MapPin className="h-3 w-3" />
                    {job.location}
                  </span>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2 flex-shrink-0">
              {matchScore !== undefined && <MatchBadge score={matchScore} />}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  if (isSaved) {
                    onUnsave?.();
                  } else {
                    onSave?.();
                  }
                }}
                className={cn(
                  "p-1.5 rounded-lg transition-all",
                  isSaved
                    ? "text-[#8B5CF6] bg-[#8B5CF6]/10"
                    : "text-muted-foreground hover:text-white hover:bg-white/5 opacity-0 group-hover:opacity-100"
                )}
              >
                {isSaved ? (
                  <BookmarkCheck className="h-4 w-4" />
                ) : (
                  <Bookmark className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-2">
            {salary && (
              <span className="flex items-center gap-1 text-[11px] text-emerald-400 font-medium">
                <DollarSign className="h-3 w-3" />
                {salary}
              </span>
            )}
            {job.remote_type && (
              <span
                className={cn(
                  "text-[10px] px-1.5 py-0.5 rounded-full border font-medium",
                  job.remote_type === "remote"
                    ? "text-emerald-400 border-emerald-500/20 bg-emerald-500/10"
                    : job.remote_type === "hybrid"
                      ? "text-amber-400 border-amber-500/20 bg-amber-500/10"
                      : "text-blue-400 border-blue-500/20 bg-blue-500/10"
                )}
              >
                {job.remote_type === "remote"
                  ? "Remote"
                  : job.remote_type === "hybrid"
                    ? "Hybrid"
                    : "On-site"}
              </span>
            )}
            {job.job_type && (
              <span className="text-[10px] text-muted-foreground">
                {job.job_type.replace("_", " ")}
              </span>
            )}
            {daysAgo !== null && (
              <span className="flex items-center gap-1 text-[10px] text-muted-foreground">
                <Clock className="h-3 w-3" />
                {daysAgo === 0 ? "Today" : `${daysAgo}d ago`}
              </span>
            )}
          </div>

          {job.required_skills && job.required_skills.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-2.5">
              {job.required_skills.slice(0, 5).map((skill) => (
                <span
                  key={skill}
                  className="px-2 py-0.5 text-[10px] rounded-full bg-white/[0.03] border border-white/5 text-muted-foreground"
                >
                  {skill}
                </span>
              ))}
              {job.required_skills.length > 5 && (
                <span className="px-2 py-0.5 text-[10px] text-muted-foreground">
                  +{job.required_skills.length - 5}
                </span>
              )}
            </div>
          )}
        </div>

        <ChevronRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity self-center flex-shrink-0" />
      </div>

      {job.apply_url && (
        <motion.a
          href={job.apply_url}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => e.stopPropagation()}
          whileHover={{ scale: 1.02 }}
          className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity p-1.5 rounded-lg bg-primary/10 border border-primary/20 text-primary hover:bg-primary/20"
        >
          <ExternalLink className="h-3.5 w-3.5" />
        </motion.a>
      )}
    </motion.div>
  );
}
