import { apiClient } from "./api-client";

export interface QuickStats {
  today_applications: number;
  total_applications: number;
  success_rate: number;
  failed_count: number;
  queue_count: number;
}

export interface Application {
  id: string;
  user_id: string;
  job_id: string;
  job_title: string | null;
  company: string | null;
  platform: string | null;
  job_url: string | null;
  status: string;
  match_score: number | null;
  applied_at: string | null;
  error_message: string | null;
  retry_count: number;
  created_at: string;
}

export interface CoverLetter {
  id: string;
  user_id: string;
  company: string;
  role: string;
  content: string;
  tone: string;
  is_template: boolean;
  ai_generated: boolean;
  created_at: string;
}

export interface QueueItem {
  id: string;
  user_id: string;
  job_id: string;
  job_title: string | null;
  company: string | null;
  platform: string | null;
  job_url: string | null;
  priority: number;
  status: string;
  retry_count: number;
  max_retries: number;
  created_at: string;
}

export interface AutomationAnalytics {
  total_applications: number;
  today_applications: number;
  success_rate: number;
  failed_count: number;
  pending_count: number;
  interview_count: number;
  offer_count: number;
  average_match_score: number;
  daily_applications: { date: string; count: number }[];
  platform_breakdown: { platform: string; count: number }[];
  recent_applications: Application[];
}

export interface QueueStatus {
  queued: number;
  processing: number;
  completed: number;
  failed: number;
  retrying: number;
  total: number;
}

export interface AutomationSettings {
  daily_limit: number;
  min_match_score: number;
  preferred_roles: string[];
  preferred_locations: string[];
  remote_only: boolean;
  max_salary: number | null;
  min_salary: number | null;
  excluded_companies: string[];
  platforms: string[];
  auto_generate_cover_letter: boolean;
  require_confirmation: boolean;
  automation_aggressiveness: string;
}

export interface PipelineStatus {
  ok: boolean;
  message: string;
  pipeline_id: string;
  status?: string;
  jobs_scanned?: number;
  jobs_matched?: number;
  jobs_queued?: number;
}

const AUTO_API = "/automation";

async function handleResponse<T>(promise: Promise<{ data: T }>): Promise<T> {
  const res = await promise;
  return res.data;
}

export const autoApplyService = {
  getStats: () =>
    handleResponse<QuickStats>(apiClient.get(`${AUTO_API}/stats`)),

  getAnalytics: () =>
    handleResponse<AutomationAnalytics>(apiClient.get(`${AUTO_API}/analytics`)),

  getApplications: () =>
    handleResponse<Application[]>(apiClient.get(`${AUTO_API}/applications`)),

  getQueue: () =>
    handleResponse<QueueItem[]>(apiClient.get(`${AUTO_API}/queue`)),

  getQueueStatus: () =>
    handleResponse<QueueStatus>(apiClient.get(`${AUTO_API}/queue/status`)),

  cancelQueueItem: (itemId: string) =>
    handleResponse<{ ok: boolean; message: string }>(
      apiClient.post(`${AUTO_API}/queue/cancel/${itemId}`)
    ),

  apply: (data: {
    job_id: string;
    job_title?: string;
    company?: string;
    platform?: string;
    job_url?: string;
  }) => handleResponse<{ ok: boolean; message: string }>(
    apiClient.post(`${AUTO_API}/apply`, data)
  ),

  applyBulk: (jobs: any[]) =>
    handleResponse<{ ok: boolean; count: number; message: string }>(
      apiClient.post(`${AUTO_API}/apply/bulk`, { jobs })
    ),

  getCoverLetters: () =>
    handleResponse<CoverLetter[]>(apiClient.get(`${AUTO_API}/cover-letters`)),

  getCoverLetter: (id: string) =>
    handleResponse<CoverLetter>(apiClient.get(`${AUTO_API}/cover-letters/${id}`)),

  generateCoverLetter: (data: {
    company: string;
    role: string;
    job_description?: string;
    tone?: string;
    skills?: string[];
    experience?: string;
  }) => handleResponse<CoverLetter>(
    apiClient.post(`${AUTO_API}/cover-letter/generate`, data)
  ),

  updateCoverLetter: (id: string, data: { content?: string; tone?: string }) =>
    handleResponse<CoverLetter>(
      apiClient.patch(`${AUTO_API}/cover-letters/${id}`, data)
    ),

  getSettings: () =>
    handleResponse<AutomationSettings>(apiClient.get(`${AUTO_API}/settings`)),

  updateSettings: (settings: Partial<AutomationSettings>) =>
    handleResponse<AutomationSettings>(
      apiClient.post(`${AUTO_API}/settings`, settings)
    ),

  startPipeline: () =>
    handleResponse<PipelineStatus>(
      apiClient.post(`${AUTO_API}/pipeline/start`)
    ),

  getPipelineStatus: () =>
    handleResponse<PipelineStatus>(
      apiClient.get(`${AUTO_API}/pipeline/status`)
    ),

  getPlatformStatus: () =>
    handleResponse<Record<string, any>>(
      apiClient.get(`${AUTO_API}/platforms/status`)
    ),
};
