import { create } from "zustand";

export interface ResumeListItem {
  id: string;
  file_name: string;
  file_type: string;
  file_size: number;
  ats_score: number | null;
  status: string;
  created_at: string;
}

export interface ATSBreakdown {
  keyword_optimization: number;
  formatting: number;
  role_relevance: number;
  skill_coverage: number;
  readability: number;
  project_quality: number;
}

export interface RoleRecommendation {
  title: string;
  match_percentage: number;
  reason: string;
}

export interface Experience {
  title: string;
  company: string;
  duration: string;
  description: string;
}

export interface Project {
  name: string;
  description: string;
  technologies: string[];
}

export interface Education {
  degree: string;
  institution: string;
  year: string;
}

export interface ResumeAnalysis {
  id: string;
  resume_id: string;
  parsed_name: string | null;
  parsed_email: string | null;
  parsed_phone: string | null;
  parsed_skills: string[];
  parsed_experience: Experience[];
  parsed_projects: Project[];
  parsed_education: Education[];
  parsed_certifications: string[];
  parsed_achievements: string[];
  ats_score: number;
  ats_breakdown: ATSBreakdown;
  strengths: string[];
  weaknesses: string[];
  missing_skills: string[];
  recommended_roles: RoleRecommendation[];
  career_suggestions: string;
  optimization_tips: string[];
  ai_feedback: string;
  created_at: string;
}

export type UploadStatus = "idle" | "dragging" | "uploading" | "analyzing" | "success" | "failed";

interface ResumeState {
  uploadStatus: UploadStatus;
  uploadProgress: number;
  uploadError: string | null;
  currentAnalysis: ResumeAnalysis | null;
  currentResumeId: string | null;
  resumeHistory: ResumeListItem[];
  isLoadingHistory: boolean;
  isAnalyzing: boolean;
  analysisError: string | null;

  setUploadStatus: (status: UploadStatus) => void;
  setUploadProgress: (progress: number) => void;
  setUploadError: (error: string | null) => void;
  setCurrentAnalysis: (analysis: ResumeAnalysis | null) => void;
  setCurrentResumeId: (id: string | null) => void;
  setResumeHistory: (list: ResumeListItem[]) => void;
  setIsLoadingHistory: (loading: boolean) => void;
  setIsAnalyzing: (analyzing: boolean) => void;
  setAnalysisError: (error: string | null) => void;
  resetUpload: () => void;
  resetAll: () => void;
}

export const useResumeStore = create<ResumeState>((set) => ({
  uploadStatus: "idle",
  uploadProgress: 0,
  uploadError: null,
  currentAnalysis: null,
  currentResumeId: null,
  resumeHistory: [],
  isLoadingHistory: false,
  isAnalyzing: false,
  analysisError: null,

  setUploadStatus: (status) => set({ uploadStatus: status }),
  setUploadProgress: (progress) => set({ uploadProgress: progress }),
  setUploadError: (error) => set({ uploadError: error }),
  setCurrentAnalysis: (analysis) => set({ currentAnalysis: analysis }),
  setCurrentResumeId: (id) => set({ currentResumeId: id }),
  setResumeHistory: (list) => set({ resumeHistory: list }),
  setIsLoadingHistory: (loading) => set({ isLoadingHistory: loading }),
  setIsAnalyzing: (analyzing) => set({ isAnalyzing: analyzing }),
  setAnalysisError: (error) => set({ analysisError: error }),
  resetUpload: () => set({
    uploadStatus: "idle",
    uploadProgress: 0,
    uploadError: null,
  }),
  resetAll: () => set({
    uploadStatus: "idle",
    uploadProgress: 0,
    uploadError: null,
    currentAnalysis: null,
    currentResumeId: null,
    analysisError: null,
    isAnalyzing: false,
  }),
}));
