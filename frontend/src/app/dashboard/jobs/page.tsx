"use client";

import React, { useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Briefcase,
  TrendingUp,
  Sparkles,
  Loader2,
  ChevronLeft,
  ChevronRight,
  BookmarkCheck,
} from "lucide-react";
import Link from "next/link";
import { useJobStore, JobData } from "@/store/job-store";
import { jobService } from "@/services/job-service";
import { useSavedJobs, useSaveJob, useRecommendations, useJobMatch } from "@/hooks/use-jobs";
import { useToast } from "@/providers/toast-provider";
import { SearchBar } from "@/components/jobs/search-bar";
import { FilterSystem } from "@/components/jobs/filter-system";
import { JobCard } from "@/components/jobs/job-card";
import { MatchScore } from "@/components/jobs/match-score";
import { FadeIn, SlideUp } from "@/components/animations/motion-wrapper";
import { Button } from "@/components/ui/button";

export default function JobsPage() {
  const { toast } = useToast();
  const {
    searchResults,
    totalResults,
    currentPage,
    isLoading,
    selectedJob,
    filters,
    savedJobIds,
    savedJobs,
    recommendations,
    setCurrentPage,
    setSelectedJob,
    setSearchResults,
    setIsLoading,
  } = useJobStore();

  useSavedJobs();
  const { saveMutation, unsaveMutation } = useSaveJob();
  useRecommendations();

  const {
    data: matchData,
    isLoading: matchLoading,
  } = useJobMatch(selectedJob?.job?.id || null);

  const handleSearch = useCallback(async () => {
    setIsLoading(true);
    try {
      const params: Record<string, string | number> = {
        query: filters.query,
        page: currentPage,
        per_page: 20,
        sort_by: filters.sort_by,
      };
      if (filters.location) params.location = filters.location;
      if (filters.remote_type) params.remote_type = filters.remote_type;
      if (filters.salary_min) params.salary_min = parseInt(filters.salary_min);
      if (filters.salary_max) params.salary_max = parseInt(filters.salary_max);
      if (filters.experience) params.experience = filters.experience;
      if (filters.job_type) params.job_type = filters.job_type;
      if (filters.category) params.category = filters.category;
      if (filters.days_ago) params.days_ago = parseInt(filters.days_ago);

      const data = await jobService.search(params);
      const results = data.jobs.map((job: JobData) => ({ job }));
      setSearchResults(results, data.total);
    } catch (err: any) {
      toast("Search Failed", err?.error?.message || "Could not search jobs.", "error");
    } finally {
      setIsLoading(false);
    }
  }, [filters, currentPage]);

  useEffect(() => {
    handleSearch();
  }, [handleSearch]);

  const totalPages = Math.max(1, Math.ceil(totalResults / 20));

  const handleSaveToggle = (jobId: string) => {
    if (savedJobIds.has(jobId)) {
      unsaveMutation.mutate(jobId);
    } else {
      saveMutation.mutate(jobId);
    }
  };

  return (
    <div className="space-y-6">
      <FadeIn delay={0.1}>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="font-display text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              AI Job Search
            </h1>
            <p className="text-xs text-muted-foreground mt-1">
              Intelligent job matching powered by resume analysis
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Link href="/dashboard/saved-jobs">
              <Button variant="glass" size="sm" className="text-xs">
                <BookmarkCheck className="h-3.5 w-3.5 mr-1.5" />
                Saved ({savedJobs.length})
              </Button>
            </Link>
          </div>
        </div>
      </FadeIn>

      <div className="space-y-4">
        <SearchBar />
        <FilterSystem />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7 xl:col-span-8 space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-xs text-muted-foreground">
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="h-3 w-3 animate-spin" />
                  Searching...
                </span>
              ) : (
                <span>
                  Found <span className="text-white font-semibold">{totalResults}</span> positions
                </span>
              )}
            </p>
            {totalPages > 1 && (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage <= 1}
                  className="p-1.5 rounded-lg border border-white/5 text-muted-foreground hover:text-white hover:border-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                >
                  <ChevronLeft className="h-3.5 w-3.5" />
                </button>
                <span className="text-[10px] text-muted-foreground">
                  {currentPage} / {totalPages}
                </span>
                <button
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage >= totalPages}
                  className="p-1.5 rounded-lg border border-white/5 text-muted-foreground hover:text-white hover:border-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                >
                  <ChevronRight className="h-3.5 w-3.5" />
                </button>
              </div>
            )}
          </div>

          <AnimatePresence mode="wait">
            {isLoading ? (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-3"
              >
                {[1, 2, 3, 4, 5].map((i) => (
                  <div
                    key={i}
                    className="p-5 rounded-xl border border-white/5 bg-[#0b1120]/30 animate-pulse"
                  >
                    <div className="flex gap-4">
                      <div className="h-11 w-11 rounded-xl bg-white/5" />
                      <div className="flex-1 space-y-2">
                        <div className="h-4 w-3/4 rounded bg-white/5" />
                        <div className="h-3 w-1/2 rounded bg-white/5" />
                        <div className="flex gap-2 mt-2">
                          <div className="h-5 w-16 rounded-full bg-white/5" />
                          <div className="h-5 w-16 rounded-full bg-white/5" />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </motion.div>
            ) : searchResults.length === 0 ? (
              <motion.div
                key="empty"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="text-center py-16 rounded-xl border border-dashed border-white/5"
              >
                <Briefcase className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
                <h3 className="text-sm font-semibold text-white mb-1">
                  No jobs found
                </h3>
                <p className="text-xs text-muted-foreground">
                  Try adjusting your search or filters
                </p>
              </motion.div>
            ) : (
              <motion.div key="results" className="space-y-3">
                {searchResults.map((item, i) => (
                  <JobCard
                    key={item.job.id}
                    job={item.job}
                    isSaved={savedJobIds.has(item.job.id)}
                    isSelected={selectedJob?.job.id === item.job.id}
                    onClick={() => setSelectedJob(item)}
                    onSave={() => handleSaveToggle(item.job.id)}
                    onUnsave={() => handleSaveToggle(item.job.id)}
                    index={i}
                  />
                ))}
              </motion.div>
            )}
          </AnimatePresence>

          {totalPages > 1 && (
            <div className="flex justify-center gap-2 pt-4">
              {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                let pageNum: number;
                if (totalPages <= 5) {
                  pageNum = i + 1;
                } else if (currentPage <= 3) {
                  pageNum = i + 1;
                } else if (currentPage >= totalPages - 2) {
                  pageNum = totalPages - 4 + i;
                } else {
                  pageNum = currentPage - 2 + i;
                }
                return (
                  <button
                    key={pageNum}
                    onClick={() => setCurrentPage(pageNum)}
                    className={`w-8 h-8 rounded-lg text-xs font-medium transition-all ${
                      currentPage === pageNum
                        ? "bg-[#8B5CF6]/20 border border-[#8B5CF6]/30 text-[#8B5CF6]"
                        : "border border-white/5 text-muted-foreground hover:text-white hover:border-white/10"
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        <div className="lg:col-span-5 xl:col-span-4 space-y-4">
          {selectedJob ? (
            <SlideUp delay={0.1}>
              <div className="p-5 rounded-xl border border-white/5 bg-[#0b1120]/40 backdrop-blur-sm sticky top-6">
                <JobDetailPreview
                  job={selectedJob.job}
                  matchData={
                    matchData
                      ? matchData
                      : undefined
                  }
                  matchLoading={matchLoading}
                  isSaved={savedJobIds.has(selectedJob.job.id)}
                  onSave={() => handleSaveToggle(selectedJob.job.id)}
                  onUnsave={() => handleSaveToggle(selectedJob.job.id)}
                />
              </div>
            </SlideUp>
          ) : (
            <div className="p-6 rounded-xl border border-white/5 bg-[#0b1120]/30 text-center">
              <Sparkles className="h-8 w-8 text-muted-foreground mx-auto mb-3" />
              <h3 className="text-sm font-semibold text-white mb-1">
                Select a job
              </h3>
              <p className="text-xs text-muted-foreground">
                Click on any job card to see detailed AI match analysis
              </p>
            </div>
          )}

          {recommendations.matched_jobs.length > 0 && !selectedJob && (
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-[#06B6D4]" />
                <h3 className="text-xs font-semibold text-white uppercase tracking-wider">
                  Top Matches For You
                </h3>
              </div>
              {recommendations.matched_jobs.slice(0, 5).map((item) => (
                <JobCard
                  key={item.job.id}
                  job={item.job}
                  matchScore={item.match?.match_score}
                  isSaved={savedJobIds.has(item.job.id)}
                  onClick={() => setSelectedJob(item)}
                  onSave={() => handleSaveToggle(item.job.id)}
                  onUnsave={() => handleSaveToggle(item.job.id)}
                  index={0}
                />
              ))}
            </div>
          )}

          {recommendations.recommended_skills.length > 0 && (
            <div className="p-4 rounded-xl border border-white/5 bg-gradient-to-br from-[#8B5CF6]/5 to-[#06B6D4]/5">
              <h3 className="text-xs font-semibold text-white mb-3 uppercase tracking-wider">
                Skills to Develop
              </h3>
              <div className="flex flex-wrap gap-1.5">
                {recommendations.recommended_skills.slice(0, 8).map((skill) => (
                  <span
                    key={skill}
                    className="px-2 py-1 text-[10px] rounded-full bg-[#8B5CF6]/10 border border-[#8B5CF6]/20 text-[#8B5CF6]"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function JobDetailPreview({
  job,
  matchData,
  matchLoading,
  isSaved,
  onSave,
  onUnsave,
}: {
  job: JobData;
  matchData?: { match_score: number; missing_skills: string[]; matched_skills: string[]; strengths: string[]; ai_feedback: string };
  matchLoading: boolean;
  isSaved: boolean;
  onSave: () => void;
  onUnsave: () => void;
}) {
  const formatSalary = (min?: number, max?: number) => {
    if (!min && !max) return null;
    const fmt = (n: number) => "$" + (n >= 1000 ? Math.round(n / 1000) + "k" : n.toString());
    if (min && max) return `${fmt(min)} - ${fmt(max)}`;
    if (min) return `From ${fmt(min)}`;
    if (max) return `Up to ${fmt(max)}`;
    return null;
  };

  return (
    <div className="space-y-4">
      <div className="flex items-start gap-3">
        <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-[#8B5CF6]/20 to-[#06B6D4]/20 flex items-center justify-center text-sm font-bold text-white border border-white/5 flex-shrink-0">
          {job.company.charAt(0)}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-semibold text-white">{job.title}</h3>
          <p className="text-xs text-muted-foreground">{job.company}</p>
        </div>
      </div>

      {matchLoading ? (
        <div className="flex items-center gap-2 py-4">
          <Loader2 className="h-4 w-4 animate-spin text-[#8B5CF6]" />
          <span className="text-xs text-muted-foreground">Analyzing match...</span>
        </div>
      ) : matchData ? (
        <div className="space-y-3">
          <div className="flex items-center gap-3 p-3 rounded-lg bg-[#0b1120]/60 border border-white/5">
            <MatchScore score={matchData.match_score} size="md" />
            <div>
              <p className="text-xs text-white font-semibold">
                {matchData.match_score >= 80
                  ? "Strong Match"
                  : matchData.match_score >= 60
                    ? "Good Match"
                    : "Fair Match"}
              </p>
              <p className="text-[10px] text-muted-foreground">
                {matchData.matched_skills.length} skills matched
              </p>
            </div>
          </div>

          {matchData.ai_feedback && (
            <p className="text-[11px] text-muted-foreground leading-relaxed">
              {matchData.ai_feedback}
            </p>
          )}

          {matchData.missing_skills.length > 0 && (
            <div>
              <p className="text-[10px] text-amber-400 font-semibold mb-1.5 uppercase tracking-wider">
                Missing Skills
              </p>
              <div className="flex flex-wrap gap-1">
                {matchData.missing_skills.map((s) => (
                  <span
                    key={s}
                    className="px-2 py-0.5 text-[10px] rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400"
                  >
                    {s}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      ) : null}

      <div className="space-y-1.5 text-xs text-muted-foreground">
        {job.location && <p>📍 {job.location}</p>}
        {formatSalary(job.salary_min, job.salary_max) && (
          <p>💰 {formatSalary(job.salary_min, job.salary_max)}</p>
        )}
        {job.remote_type && <p>🏢 {job.remote_type}</p>}
        {job.experience_required && <p>🎯 {job.experience_required}</p>}
      </div>

      <div className="flex gap-2">
        {job.apply_url && (
          <a
            href={job.apply_url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 px-3 py-2 rounded-lg bg-gradient-to-r from-[#8B5CF6] to-[#06B6D4] text-white text-xs font-semibold text-center hover:shadow-[0_0_20px_rgba(139,92,246,0.3)] transition-all"
          >
            Apply Now
          </a>
        )}
        <button
          onClick={isSaved ? onUnsave : onSave}
          className={`px-3 py-2 rounded-lg border text-xs font-semibold transition-all ${
            isSaved
              ? "border-[#8B5CF6]/30 bg-[#8B5CF6]/10 text-[#8B5CF6]"
              : "border-white/10 text-muted-foreground hover:text-white hover:border-white/20"
          }`}
        >
          {isSaved ? "Saved" : "Save"}
        </button>
      </div>
    </div>
  );
}
