"use client";

import React from "react";
import Link from "next/link";
import { Bookmark, ArrowLeft, Briefcase } from "lucide-react";
import { useJobStore } from "@/store/job-store";
import { useSavedJobs, useSaveJob } from "@/hooks/use-jobs";
import { JobCard } from "@/components/jobs/job-card";
import { FadeIn, StaggerContainer, StaggerItem } from "@/components/animations/motion-wrapper";
import { Button } from "@/components/ui/button";

export default function SavedJobsPage() {
  const { savedJobs, setSelectedJob, selectedJob } = useJobStore();
  const { isLoading } = useSavedJobs();
  const { unsaveMutation } = useSaveJob();

  const handleUnsave = (jobId: string) => {
    unsaveMutation.mutate(jobId);
  };

  return (
    <div className="space-y-6">
      <FadeIn delay={0.1}>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Link
                href="/dashboard/jobs"
                className="text-[10px] text-muted-foreground hover:text-white transition-all flex items-center gap-1"
              >
                <ArrowLeft className="h-3 w-3" />
                Back to Search
              </Link>
            </div>
            <h1 className="font-display text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              Saved Jobs
            </h1>
            <p className="text-xs text-muted-foreground mt-1">
              Your bookmarked positions for quick access
            </p>
          </div>
        </div>
      </FadeIn>

      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="p-5 rounded-xl border border-white/5 bg-[#0b1120]/30 animate-pulse"
            >
              <div className="flex gap-4">
                <div className="h-11 w-11 rounded-xl bg-white/5" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 w-3/4 rounded bg-white/5" />
                  <div className="h-3 w-1/2 rounded bg-white/5" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : savedJobs.length === 0 ? (
        <div className="text-center py-20 rounded-xl border border-dashed border-white/5">
          <Bookmark className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-base font-semibold text-white mb-1">
            No saved jobs yet
          </h3>
          <p className="text-sm text-muted-foreground mb-6">
            Start searching and save jobs you're interested in
          </p>
          <Link href="/dashboard/jobs">
            <Button variant="default" size="sm">
              <Briefcase className="h-4 w-4 mr-1.5" />
              Browse Jobs
            </Button>
          </Link>
        </div>
      ) : (
        <StaggerContainer staggerChildren={0.05}>
          <div className="space-y-3">
            {savedJobs.map((item, i) => (
              <StaggerItem key={item.id}>
                <JobCard
                  job={item.job}
                  isSaved={true}
                  isSelected={selectedJob?.job.id === item.job_id}
                  onClick={() => setSelectedJob({ job: item.job })}
                  onUnsave={() => handleUnsave(item.job_id)}
                  index={i}
                />
              </StaggerItem>
            ))}
          </div>
        </StaggerContainer>
      )}

      {savedJobs.length > 0 && (
        <div className="flex items-center justify-center pt-4">
          <p className="text-[10px] text-muted-foreground">
            {savedJobs.length} saved position{savedJobs.length !== 1 && "s"}
          </p>
        </div>
      )}
    </div>
  );
}
