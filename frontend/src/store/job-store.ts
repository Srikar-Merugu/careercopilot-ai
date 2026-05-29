import { create } from "zustand";

export interface JobData {
  id: string;
  source: string;
  title: string;
  company: string;
  company_logo?: string;
  location?: string;
  salary_min?: number;
  salary_max?: number;
  salary_currency?: string;
  description?: string;
  requirements?: string;
  required_skills: string[];
  experience_required?: string;
  job_type?: string;
  remote_type?: string;
  apply_url?: string;
  category?: string;
  posted_at?: string;
  created_at: string;
}

export interface JobMatch {
  job_id: string;
  match_score: number;
  missing_skills: string[];
  matched_skills: string[];
  strengths: string[];
  ai_feedback: string;
}

export interface JobWithMatch {
  job: JobData;
  match?: JobMatch;
}

export interface SavedJobItem {
  id: string;
  job_id: string;
  job: JobData;
  saved_at: string;
}

export interface JobFilters {
  query: string;
  location: string;
  remote_type: string;
  salary_min: string;
  salary_max: string;
  experience: string;
  job_type: string;
  category: string;
  sort_by: string;
  days_ago: string;
}

const defaultFilters: JobFilters = {
  query: "",
  location: "",
  remote_type: "",
  salary_min: "",
  salary_max: "",
  experience: "",
  job_type: "",
  category: "",
  sort_by: "match_score",
  days_ago: "",
};

interface JobState {
  filters: JobFilters;
  searchResults: JobWithMatch[];
  totalResults: number;
  currentPage: number;
  isLoading: boolean;
  selectedJob: JobWithMatch | null;
  savedJobs: SavedJobItem[];
  savedJobIds: Set<string>;
  recommendations: { matched_jobs: JobWithMatch[]; trending_jobs: JobWithMatch[]; recommended_skills: string[] };

  setFilters: (filters: Partial<JobFilters>) => void;
  resetFilters: () => void;
  setSearchResults: (results: JobWithMatch[], total: number) => void;
  setCurrentPage: (page: number) => void;
  setIsLoading: (loading: boolean) => void;
  setSelectedJob: (job: JobWithMatch | null) => void;
  setSavedJobs: (jobs: SavedJobItem[]) => void;
  addSavedJob: (job: SavedJobItem) => void;
  removeSavedJob: (jobId: string) => void;
  setRecommendations: (recs: JobState["recommendations"]) => void;
}

export const useJobStore = create<JobState>((set) => ({
  filters: { ...defaultFilters },
  searchResults: [],
  totalResults: 0,
  currentPage: 1,
  isLoading: false,
  selectedJob: null,
  savedJobs: [],
  savedJobIds: new Set(),
  recommendations: { matched_jobs: [], trending_jobs: [], recommended_skills: [] },

  setFilters: (newFilters) =>
    set((state) => ({
      filters: { ...state.filters, ...newFilters },
      currentPage: 1,
    })),

  resetFilters: () => set({ filters: { ...defaultFilters }, currentPage: 1 }),

  setSearchResults: (results, total) =>
    set({ searchResults: results, totalResults: total }),

  setCurrentPage: (page) => set({ currentPage: page }),

  setIsLoading: (loading) => set({ isLoading: loading }),

  setSelectedJob: (job) => set({ selectedJob: job }),

  setSavedJobs: (jobs) =>
    set({
      savedJobs: jobs,
      savedJobIds: new Set(jobs.map((j) => j.job_id)),
    }),

  addSavedJob: (job) =>
    set((state) => ({
      savedJobs: [job, ...state.savedJobs],
      savedJobIds: new Set([...state.savedJobIds, job.job_id]),
    })),

  removeSavedJob: (jobId) =>
    set((state) => {
      const newIds = new Set(state.savedJobIds);
      newIds.delete(jobId);
      return {
        savedJobs: state.savedJobs.filter((j) => j.job_id !== jobId),
        savedJobIds: newIds,
      };
    }),

  setRecommendations: (recs) => set({ recommendations: recs }),
}));
