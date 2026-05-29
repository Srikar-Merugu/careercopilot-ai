"use client";

import React, { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FileText,
  Trash2,
  Clock,
  Plus,
  ChevronRight,
  Loader2,
} from "lucide-react";
import { useResumeStore, ResumeListItem } from "@/store/resume-store";
import { resumeService } from "@/services/resume-service";
import { useToast } from "@/providers/toast-provider";
import { UploadArea } from "@/components/resume/upload-area";
import { AnalysisDashboard } from "@/components/resume/analysis-dashboard";
import { FadeIn, SlideUp } from "@/components/animations/motion-wrapper";
import { Button } from "@/components/ui/button";

export default function ResumePage() {
  const { toast } = useToast();
  const {
    uploadStatus,
    uploadProgress,
    uploadError,
    currentAnalysis,
    currentResumeId,
    resumeHistory,
    isLoadingHistory,
    setUploadStatus,
    setUploadProgress,
    setUploadError,
    setCurrentAnalysis,
    setCurrentResumeId,
    setResumeHistory,
    setIsLoadingHistory,
    setIsAnalyzing,
    setAnalysisError,
    resetUpload,
    resetAll,
  } = useResumeStore();

  const [showUpload, setShowUpload] = useState(true);
  const [reanalyzing, setReanalyzing] = useState(false);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    setIsLoadingHistory(true);
    try {
      const list = await resumeService.list();
      setResumeHistory(list);
    } catch (err: any) {
      console.error("Failed to load resume history:", err);
    } finally {
      setIsLoadingHistory(false);
    }
  };

  const handleUpload = useCallback(async (file: File) => {
    const validTypes = [
      "application/pdf",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "application/msword",
    ];
    if (!validTypes.includes(file.type)) {
      toast(
        "Invalid File",
        "Please upload a PDF or DOCX file.",
        "error"
      );
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      toast(
        "File Too Large",
        "Maximum file size is 10MB.",
        "error"
      );
      return;
    }

    resetAll();
    setShowUpload(false);
    setUploadStatus("uploading");

    try {
      const uploaded = await resumeService.upload(file, (progress) => {
        setUploadProgress(progress);
      });

      setCurrentResumeId(uploaded.id);
      setUploadStatus("analyzing");
      setIsAnalyzing(true);

      const analysisResult = await resumeService.analyze(uploaded.id);

      setCurrentAnalysis(analysisResult.data);
      setUploadStatus("success");
      setIsAnalyzing(false);
      toast(
        "Analysis Complete",
        "Your resume has been analyzed by AI.",
        "success"
      );

      fetchHistory();
    } catch (err: any) {
      console.error("Upload/analyze failed:", err);
      const msg =
        err?.error?.message || "Failed to process resume. Please try again.";
      setUploadError(msg);
      setUploadStatus("failed");
      setIsAnalyzing(false);
      setAnalysisError(msg);
    }
  }, []);

  const handleReanalyze = async () => {
    if (!currentResumeId) return;
    setReanalyzing(true);
    try {
      const result = await resumeService.reanalyze(currentResumeId);
      setCurrentAnalysis(result.data);
      toast(
        "Re-analysis Complete",
        "Your resume has been re-analyzed with fresh insights.",
        "success"
      );
      fetchHistory();
    } catch (err: any) {
      toast(
        "Re-analysis Failed",
        err?.error?.message || "Something went wrong.",
        "error"
      );
    } finally {
      setReanalyzing(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await resumeService.delete(id);
      toast("Deleted", "Resume has been removed.", "info");
      if (currentResumeId === id) {
        resetAll();
        setShowUpload(true);
      }
      fetchHistory();
    } catch (err: any) {
      toast(
        "Delete Failed",
        err?.error?.message || "Could not delete resume.",
        "error"
      );
    }
  };

  const handleSelectResume = async (item: ResumeListItem) => {
    if (item.status === "analyzed") {
      try {
        const result = await resumeService.getAnalysis(item.id);
        setCurrentResumeId(item.id);
        setCurrentAnalysis(result.data);
        setShowUpload(false);
        setUploadStatus("success");
      } catch {
        try {
          const result = await resumeService.analyze(item.id);
          setCurrentResumeId(item.id);
          setCurrentAnalysis(result.data);
          setUploadStatus("success");
        } catch {
          toast(
            "Load Failed",
            "Could not load analysis results.",
            "error"
          );
        }
      }
    } else {
      setCurrentResumeId(item.id);
      setUploadStatus("analyzing");
      setIsAnalyzing(true);
      try {
        const result = await resumeService.analyze(item.id);
        setCurrentAnalysis(result.data);
        setUploadStatus("success");
        setIsAnalyzing(false);
        fetchHistory();
      } catch {
        setUploadStatus("failed");
        setIsAnalyzing(false);
      }
    }
  };

  const handleNewUpload = () => {
    resetAll();
    setShowUpload(true);
  };

  const handleDownloadReport = () => {
    if (!currentAnalysis) return;
    const report = {
      atsScore: currentAnalysis.ats_score,
      atsBreakdown: currentAnalysis.ats_breakdown,
      skills: currentAnalysis.parsed_skills,
      missingSkills: currentAnalysis.missing_skills,
      strengths: currentAnalysis.strengths,
      weaknesses: currentAnalysis.weaknesses,
      recommendedRoles: currentAnalysis.recommended_roles,
      careerSuggestions: currentAnalysis.career_suggestions,
      optimizationTips: currentAnalysis.optimization_tips,
      aiFeedback: currentAnalysis.ai_feedback,
      generatedAt: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(report, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `resume-analysis-report.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast("Report Downloaded", "Analysis report saved as JSON.", "success");
  };

  return (
    <div className="space-y-8">
      <FadeIn delay={0.1}>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="font-display text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              Resume Intelligence
            </h1>
            <p className="text-xs text-muted-foreground mt-1">
              AI-powered resume analysis, ATS scoring, and career insights
            </p>
          </div>
        </div>
      </FadeIn>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-12">
          {showUpload && !currentAnalysis && (
            <SlideUp delay={0.2}>
              <UploadArea
                onUpload={handleUpload}
                status={uploadStatus}
                progress={uploadProgress}
                error={uploadError}
                onRetry={() => {
                  resetUpload();
                }}
              />
            </SlideUp>
          )}

          <AnimatePresence mode="wait">
            {(uploadStatus === "uploading" ||
              uploadStatus === "analyzing") && (
              <motion.div
                key="processing"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <UploadArea
                  onUpload={handleUpload}
                  status={uploadStatus}
                  progress={uploadProgress}
                />
              </motion.div>
            )}

            {uploadStatus === "failed" && (
              <motion.div
                key="failed"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <UploadArea
                  onUpload={handleUpload}
                  status={uploadStatus}
                  progress={uploadProgress}
                  error={uploadError}
                  onRetry={() => {
                    resetUpload();
                    setShowUpload(true);
                  }}
                />
              </motion.div>
            )}
          </AnimatePresence>

          {currentAnalysis && (
            <motion.div
              key="dashboard"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="flex justify-end mb-4">
                <div className="flex items-center gap-2">
                  <Button
                    variant="glass"
                    size="sm"
                    onClick={handleNewUpload}
                    className="text-xs"
                  >
                    <Plus className="h-3.5 w-3.5 mr-1.5" />
                    New Analysis
                  </Button>
                </div>
              </div>
              <AnalysisDashboard
                analysis={currentAnalysis}
                onReanalyze={handleReanalyze}
                onDownload={handleDownloadReport}
                isReanalyzing={reanalyzing}
              />
            </motion.div>
          )}
        </div>
      </div>

      <SlideUp delay={0.3}>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <h2 className="text-sm font-semibold text-white">
                Resume History
              </h2>
            </div>
            {resumeHistory.length > 0 && (
              <span className="text-[10px] text-muted-foreground">
                {resumeHistory.length} resume{resumeHistory.length !== 1 && "s"}
              </span>
            )}
          </div>

          {isLoadingHistory ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
            </div>
          ) : resumeHistory.length === 0 ? (
            <div className="text-center py-12 rounded-xl border border-dashed border-white/5 bg-[#0b1120]/20">
              <FileText className="h-8 w-8 text-muted-foreground mx-auto mb-3" />
              <p className="text-sm text-muted-foreground">
                No resumes analyzed yet
              </p>
              <p className="text-xs text-muted-foreground/60 mt-1">
                Upload your first resume to get started
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {resumeHistory.map((item, i) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05, duration: 0.3 }}
                  onClick={() => handleSelectResume(item)}
                  className={`group relative p-4 rounded-xl border cursor-pointer transition-all duration-300 ${
                    currentResumeId === item.id
                      ? "border-[#8B5CF6]/40 bg-[#8B5CF6]/5"
                      : "border-white/5 bg-[#0b1120]/30 hover:border-white/10 hover:bg-[#0b1120]/50"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="h-9 w-9 rounded-lg bg-gradient-to-br from-[#8B5CF6]/20 to-[#06B6D4]/20 flex items-center justify-center border border-white/5 flex-shrink-0">
                      <FileText className="h-4 w-4 text-[#8B5CF6]" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs font-semibold text-white truncate">
                        {item.file_name}
                      </h4>
                      <div className="flex items-center gap-2 mt-1">
                        <span
                          className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium ${
                            item.status === "analyzed"
                              ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                              : item.status === "failed"
                                ? "bg-red-500/10 text-red-400 border border-red-500/20"
                                : "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                          }`}
                        >
                          {item.status}
                        </span>
                        {item.ats_score !== null && (
                          <span className="text-[10px] text-muted-foreground">
                            ATS: {Math.round(item.ats_score)}
                          </span>
                        )}
                      </div>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(item.id);
                      }}
                      className="opacity-0 group-hover:opacity-100 transition-opacity p-1.5 rounded-lg hover:bg-red-500/10 text-muted-foreground hover:text-red-400"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                  <div className="mt-2 flex items-center gap-2">
                    <span className="text-[10px] text-muted-foreground">
                      {new Date(item.created_at).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </span>
                    <ChevronRight className="h-3 w-3 text-muted-foreground ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </SlideUp>
    </div>
  );
}
