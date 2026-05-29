"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";


import {
  ArrowLeft,
  Building2,
  MapPin,
  DollarSign,
  Clock,
  ExternalLink,
  Bookmark,
  BookmarkCheck,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { JobData, useJobStore } from "@/store/job-store";
import { jobService } from "@/services/job-service";
import { useJobMatch, useSaveJob } from "@/hooks/use-jobs";
import { MatchScore } from "@/components/jobs/match-score";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { FadeIn, SlideUp } from "@/components/animations/motion-wrapper";

export default function JobDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { savedJobIds, setSelectedJob } = useJobStore();
  const { saveMutation, unsaveMutation } = useSaveJob();

  const jobId = params.id as string;
  const [job, setJob] = useState<JobData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { data: matchData, isLoading: matchLoading } = useJobMatch(jobId);

  useEffect(() => {
    if (jobId) loadJob();
  }, [jobId]);

  const loadJob = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await jobService.search({ query: "", page: 1, per_page: 50 });
      const found = data.jobs.find((j: JobData) => j.id === jobId);
      if (found) {
        setJob(found);
        setSelectedJob({ job: found });
      } else {
        setError("Job not found.");
      }
    } catch (err: any) {
      setError(err?.error?.message || "Failed to load job details.");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveToggle = () => {
    if (!job) return;
    if (savedJobIds.has(job.id)) {
      unsaveMutation.mutate(job.id);
    } else {
      saveMutation.mutate(job.id);
    }
  };

  const formatSalary = (min?: number, max?: number) => {
    if (!min && !max) return null;
    const fmt = (n: number) =>
      "$" + (n >= 1000 ? Math.round(n / 1000) + "k" : n.toString());
    if (min && max) return `${fmt(min)} - ${fmt(max)}`;
    if (min) return `From ${fmt(min)}`;
    if (max) return `Up to ${fmt(max)}`;
    return null;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-6 w-6 animate-spin text-[#8B5CF6]" />
      </div>
    );
  }

  if (error || !job) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <AlertCircle className="h-8 w-8 text-red-400 mx-auto mb-3" />
          <p className="text-sm text-muted-foreground mb-4">{error || "Job not found."}</p>
          <Button variant="outline" size="sm" onClick={() => router.push("/dashboard/jobs")}>
            Back to Jobs
          </Button>
        </div>
      </div>
    );
  }

  const isSaved = savedJobIds.has(job.id);
  const daysAgo = job.posted_at
    ? Math.floor((Date.now() - new Date(job.posted_at).getTime()) / (1000 * 60 * 60 * 24))
    : null;

  return (
    <div className="space-y-6">
      <FadeIn delay={0.1}>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.push("/dashboard/jobs")}
          className="text-xs text-muted-foreground hover:text-white"
        >
          <ArrowLeft className="h-3.5 w-3.5 mr-1.5" />
          Back to Job Search
        </Button>
      </FadeIn>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 space-y-6">
          <FadeIn delay={0.15}>
            <div className="p-6 rounded-xl border border-white/5 bg-[#0b1120]/40 backdrop-blur-sm">
              <div className="flex items-start gap-4">
                <div className="h-14 w-14 rounded-xl bg-gradient-to-br from-[#8B5CF6]/20 to-[#06B6D4]/20 flex items-center justify-center text-xl font-bold text-white border border-white/5 flex-shrink-0">
                  {job.company.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <h1 className="text-xl font-bold font-display text-white">{job.title}</h1>
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-2">
                    <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <Building2 className="h-3.5 w-3.5" />
                      {job.company}
                    </span>
                    {job.location && (
                      <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <MapPin className="h-3.5 w-3.5" />
                        {job.location}
                      </span>
                    )}
                    {formatSalary(job.salary_min, job.salary_max) && (
                      <span className="flex items-center gap-1.5 text-xs text-emerald-400 font-medium">
                        <DollarSign className="h-3.5 w-3.5" />
                        {formatSalary(job.salary_min, job.salary_max)}
                      </span>
                    )}
                    {daysAgo !== null && (
                      <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <Clock className="h-3.5 w-3.5" />
                        {daysAgo === 0 ? "Today" : `${daysAgo} days ago`}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 mt-4">
                {job.remote_type && (
                  <span className="px-2.5 py-1 text-[10px] rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-medium">
                    {job.remote_type === "remote" ? "Remote" : job.remote_type === "hybrid" ? "Hybrid" : "On-site"}
                  </span>
                )}
                {job.job_type && (
                  <span className="px-2.5 py-1 text-[10px] rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 font-medium">
                    {job.job_type.replace("_", " ")}
                  </span>
                )}
                {job.experience_required && (
                  <span className="px-2.5 py-1 text-[10px] rounded-full bg-[#8B5CF6]/10 border border-[#8B5CF6]/20 text-[#8B5CF6] font-medium">
                    {job.experience_required}
                  </span>
                )}
              </div>
            </div>
          </FadeIn>

          <SlideUp delay={0.2}>
            <Card className="border-white/5 bg-[#0b1120]/45 backdrop-blur-xl">
              <CardHeader>
                <CardTitle className="text-sm">Job Description</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-xs text-muted-foreground leading-relaxed whitespace-pre-line">
                  {job.description || "No description available."}
                </div>
              </CardContent>
            </Card>
          </SlideUp>

          {job.required_skills && job.required_skills.length > 0 && (
            <SlideUp delay={0.3}>
              <Card className="border-white/5 bg-[#0b1120]/45 backdrop-blur-xl">
                <CardHeader>
                  <CardTitle className="text-sm">Required Skills</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {job.required_skills.map((skill) => (
                      <span
                        key={skill}
                        className="px-3 py-1.5 text-[11px] rounded-lg border border-white/5 bg-white/[0.03] text-muted-foreground"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </SlideUp>
          )}
        </div>

        <div className="lg:col-span-4 space-y-4">
          <SlideUp delay={0.25}>
            <div className="p-5 rounded-xl border border-white/5 bg-[#0b1120]/40 backdrop-blur-sm sticky top-6">
              <h3 className="text-xs font-semibold text-white mb-4 uppercase tracking-wider">
                Quick Actions
              </h3>

              {job.apply_url && (
                <a
                  href={job.apply_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full px-4 py-3 rounded-xl bg-gradient-to-r from-[#8B5CF6] to-[#06B6D4] text-white text-xs font-semibold hover:shadow-[0_0_30px_rgba(139,92,246,0.3)] transition-all mb-3"
                >
                  <ExternalLink className="h-3.5 w-3.5" />
                  Apply on {job.source === "mock" ? "Company Website" : job.source}
                </a>
              )}

              <button
                onClick={handleSaveToggle}
                className={`flex items-center justify-center gap-2 w-full px-4 py-3 rounded-xl border text-xs font-semibold transition-all ${
                  isSaved
                    ? "border-[#8B5CF6]/30 bg-[#8B5CF6]/10 text-[#8B5CF6]"
                    : "border-white/10 text-muted-foreground hover:text-white hover:border-white/20"
                }`}
              >
                {isSaved ? (
                  <>
                    <BookmarkCheck className="h-3.5 w-3.5" />
                    Saved
                  </>
                ) : (
                  <>
                    <Bookmark className="h-3.5 w-3.5" />
                    Save Job
                  </>
                )}
              </button>
            </div>
          </SlideUp>

          <SlideUp delay={0.35}>
            <div className="p-5 rounded-xl border border-white/5 bg-[#0b1120]/40 backdrop-blur-sm">
              <h3 className="text-xs font-semibold text-white mb-4 uppercase tracking-wider">
                AI Match Analysis
              </h3>

              {matchLoading ? (
                <div className="flex items-center gap-2 py-4">
                  <Loader2 className="h-4 w-4 animate-spin text-[#8B5CF6]" />
                  <span className="text-xs text-muted-foreground">Analyzing...</span>
                </div>
              ) : matchData ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-center py-2">
                    <MatchScore score={matchData.match_score} size="lg" showLabel={false} />
                  </div>

                  <div className="text-center">
                    <p className="text-sm font-semibold text-white">
                      {matchData.match_score >= 80
                        ? "Strong Match"
                        : matchData.match_score >= 60
                          ? "Good Match"
                          : "Fair Match"}
                    </p>
                    <p className="text-[10px] text-muted-foreground mt-0.5">
                      {matchData.matched_skills.length} of {matchData.matched_skills.length + matchData.missing_skills.length} skills matched
                    </p>
                  </div>

                  {matchData.ai_feedback && (
                    <p className="text-[11px] text-muted-foreground leading-relaxed">
                      {matchData.ai_feedback}
                    </p>
                  )}

                  {matchData.matched_skills.length > 0 && (
                    <div>
                      <p className="text-[10px] text-emerald-400 font-semibold mb-1.5 uppercase tracking-wider">
                        Matched Skills
                      </p>
                      <div className="flex flex-wrap gap-1">
                        {matchData.matched_skills.map((s) => (
                          <span
                            key={s}
                            className="px-2 py-0.5 text-[10px] rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400"
                          >
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {matchData.missing_skills.length > 0 && (
                    <div>
                      <p className="text-[10px] text-amber-400 font-semibold mb-1.5 uppercase tracking-wider">
                        Skills to Develop
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

                  {matchData.strengths.length > 0 && (
                    <div>
                      <p className="text-[10px] text-[#8B5CF6] font-semibold mb-1.5 uppercase tracking-wider">
                        Your Strengths
                      </p>
                      <ul className="space-y-1">
                        {matchData.strengths.map((s, i) => (
                          <li key={i} className="text-[11px] text-muted-foreground flex items-start gap-1.5">
                            <span className="mt-0.5 h-1 w-1 rounded-full bg-[#8B5CF6] flex-shrink-0" />
                            {s}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ) : (
                <p className="text-xs text-muted-foreground">
                  Sign in and upload your resume to get AI-powered match analysis.
                </p>
              )}
            </div>
          </SlideUp>
        </div>
      </div>
    </div>
  );
}
