import { apiClient } from "./api-client";
import { JobData, JobMatch, SavedJobItem, JobWithMatch } from "@/store/job-store";

interface SearchResponse {
  jobs: JobData[];
  total: number;
  page: number;
  per_page: number;
  total_pages: number;
}

interface MatchResponse {
  success: boolean;
  data: JobMatch;
}

interface SavedListResponse {
  success: boolean;
  data: SavedJobItem[];
}

interface RecommendationsResponse {
  matched_jobs: JobWithMatch[];
  trending_jobs: JobWithMatch[];
  similar_jobs: JobWithMatch[];
  recommended_skills: string[];
}

export const jobService = {
  async search(params: Record<string, string | number>): Promise<SearchResponse> {
    const queryParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== "" && value !== undefined && value !== null) {
        queryParams.set(key, String(value));
      }
    });
    const response = await apiClient.get<SearchResponse>(
      `/jobs/search?${queryParams.toString()}`
    );
    return response.data;
  },

  async getMatch(jobId: string): Promise<MatchResponse> {
    const response = await apiClient.get<MatchResponse>(`/jobs/${jobId}/match`);
    return response.data;
  },

  async saveJob(jobId: string): Promise<void> {
    await apiClient.post(`/jobs/save/${jobId}`);
  },

  async unsaveJob(jobId: string): Promise<void> {
    await apiClient.delete(`/jobs/save/${jobId}`);
  },

  async listSaved(): Promise<SavedListResponse> {
    const response = await apiClient.get<SavedListResponse>("/jobs/saved/list");
    return response.data;
  },

  async getRecommendations(): Promise<RecommendationsResponse> {
    const response = await apiClient.get<RecommendationsResponse>(
      "/jobs/recommendations"
    );
    return response.data;
  },
};
