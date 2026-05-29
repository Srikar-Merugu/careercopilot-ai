import { apiClient } from "./api-client";

export interface TelegramUser {
  id: string;
  user_id: string;
  telegram_id: string;
  telegram_username?: string;
  first_name?: string;
  last_name?: string;
  is_active: boolean;
  notifications_enabled: boolean;
  preferences?: Record<string, boolean>;
  last_interaction: string;
  created_at: string;
}

export interface TelegramStats {
  total_users: number;
  active_users: number;
  total_alerts_sent: number;
  jobs_synced: number;
  resumes_analyzed: number;
}

export interface BotActivity {
  id: string;
  user_id: string;
  action: string;
  metadata?: Record<string, unknown>;
  created_at: string;
}

async function getUsers(): Promise<TelegramUser[]> {
  const res = await apiClient.get("/api/v1/telegram/users");
  return res.data;
}

async function getUser(telegramId: string): Promise<TelegramUser> {
  const res = await apiClient.get(`/api/v1/telegram/users/${telegramId}`);
  return res.data;
}

async function getStats(): Promise<TelegramStats> {
  const res = await apiClient.get("/api/v1/telegram/stats");
  return res.data;
}

async function getActivity(limit = 20): Promise<BotActivity[]> {
  const res = await apiClient.get("/api/v1/telegram/activity", { params: { limit } });
  return res.data;
}

async function syncProfile(data: {
  user_id: string;
  ats_score?: number;
  saved_jobs?: string[];
  interview_count?: number;
}): Promise<{ ok: boolean }> {
  const res = await apiClient.post("/api/v1/telegram/sync/profile", data);
  return res.data;
}

export const telegramService = {
  getUsers,
  getUser,
  getStats,
  getActivity,
  syncProfile,
};
