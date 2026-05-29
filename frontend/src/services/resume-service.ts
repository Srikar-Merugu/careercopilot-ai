import { apiClient } from "./api-client";
import { ResumeListItem, ResumeAnalysis } from "@/store/resume-store";

interface UploadResponse {
  id: string;
  file_name: string;
  file_type: string;
  file_size: number;
  file_url: string;
  status: string;
  created_at: string;
}

export const resumeService = {
  async upload(file: File, onProgress?: (progress: number) => void): Promise<UploadResponse> {
    const formData = new FormData();
    formData.append("file", file);

    const response = await apiClient.post<UploadResponse>("/resume/upload", formData, {
      headers: { "Content-Type": "multipart/form-data" },
      onUploadProgress: (progressEvent) => {
        if (progressEvent.total && onProgress) {
          const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          onProgress(percent);
        }
      },
      timeout: 60000,
    });

    return response.data;
  },

  async analyze(resumeId: string): Promise<{ success: boolean; data: ResumeAnalysis }> {
    const response = await apiClient.post<{ success: boolean; data: ResumeAnalysis }>(
      `/resume/${resumeId}/analyze`,
      {},
      { timeout: 120000 }
    );
    return response.data;
  },

  async list(): Promise<ResumeListItem[]> {
    const response = await apiClient.get<ResumeListItem[]>("/resume/list");
    return response.data;
  },

  async get(resumeId: string): Promise<{ resume: ResumeListItem; analysis: ResumeAnalysis | null }> {
    const response = await apiClient.get<{ resume: ResumeListItem; analysis: ResumeAnalysis | null }>(
      `/resume/${resumeId}`
    );
    return response.data;
  },

  async getAnalysis(resumeId: string): Promise<{ success: boolean; data: ResumeAnalysis }> {
    const response = await apiClient.get<{ success: boolean; data: ResumeAnalysis }>(
      `/resume/${resumeId}/analysis`
    );
    return response.data;
  },

  async delete(resumeId: string): Promise<void> {
    await apiClient.delete(`/resume/${resumeId}`);
  },

  async reanalyze(resumeId: string): Promise<{ success: boolean; data: ResumeAnalysis }> {
    const response = await apiClient.post<{ success: boolean; data: ResumeAnalysis }>(
      `/resume/${resumeId}/reanalyze`,
      {},
      { timeout: 120000 }
    );
    return response.data;
  },
};
