"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowLeft, Loader2, AlertCircle } from "lucide-react";
import { ResumeAnalysis } from "@/store/resume-store";
import { resumeService } from "@/services/resume-service";
import { AnalysisDashboard } from "@/components/resume/analysis-dashboard";
import { useToast } from "@/providers/toast-provider";
import { Button } from "@/components/ui/button";

export default function ResumeDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const [analysis, setAnalysis] = useState<ResumeAnalysis | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reanalyzing, setReanalyzing] = useState(false);

  const resumeId = params.id as string;

  useEffect(() => {
    if (resumeId) loadAnalysis();
  }, [resumeId]);

  const loadAnalysis = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await resumeService.getAnalysis(resumeId);
      setAnalysis(result.data);
    } catch (err: any) {
      if (err?.error?.code === "HttpStatus404") {
        try {
          const result = await resumeService.analyze(resumeId);
          setAnalysis(result.data);
          toast("Analysis Complete", "Resume analysis completed.", "success");
        } catch {
          setError("Could not load or create analysis for this resume.");
        }
      } else {
        setError(err?.error?.message || "Failed to load analysis.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleReanalyze = async () => {
    if (!resumeId) return;
    setReanalyzing(true);
    try {
      const result = await resumeService.reanalyze(resumeId);
      setAnalysis(result.data);
      toast("Re-analysis Complete", "Fresh insights generated.", "success");
    } catch (err: any) {
      toast("Re-analysis Failed", err?.error?.message || "Something went wrong.", "error");
    } finally {
      setReanalyzing(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-6 w-6 animate-spin text-[#8B5CF6]" />
          <span className="text-xs text-muted-foreground">Loading analysis...</span>
        </div>
      </div>
    );
  }

  if (error || !analysis) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-4 text-center">
          <AlertCircle className="h-8 w-8 text-red-400" />
          <p className="text-sm text-muted-foreground">{error || "Analysis not found."}</p>
          <Button variant="outline" size="sm" onClick={() => router.push("/dashboard/resume")}>
            Back to Resume Analysis
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
      >
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.push("/dashboard/resume")}
          className="text-xs text-muted-foreground hover:text-white"
        >
          <ArrowLeft className="h-3.5 w-3.5 mr-1.5" />
          Back to Resume Intelligence
        </Button>
      </motion.div>

      <AnalysisDashboard
        analysis={analysis}
        onReanalyze={handleReanalyze}
        isReanalyzing={reanalyzing}
      />
    </div>
  );
}
