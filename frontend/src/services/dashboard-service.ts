import { apiClient } from "./api-client";

export interface DashboardAnalytics {
  total_applications: number;
  active_applications: number;
  interviews_scheduled: number;
  offers_received: number;
  saved_jobs_count: number;
  avg_match_score: number;
  interview_readiness: number;
  ats_score: number;
  weekly_growth: number;
  applications_by_status: Record<string, number>;
  recent_activity: ActivityLogItem[];
}

export interface ActivityLogItem {
  id: string;
  activity_type: string;
  description: string | null;
  metadata?: Record<string, any>;
  created_at: string;
}

export interface ApplicationItem {
  id: string;
  job_id?: string;
  job_title: string;
  company: string;
  location?: string;
  salary_range?: string;
  status: string;
  notes?: string;
  interview_date?: string;
  apply_url?: string;
  created_at: string;
  updated_at: string;
}

export interface NotificationItem {
  id: string;
  type: string;
  title: string;
  content?: string;
  metadata?: Record<string, any>;
  is_read: boolean;
  created_at: string;
}

export interface SubscriptionInfo {
  id: string;
  plan: string;
  status: string;
  renewal_date?: string;
  features_used?: Record<string, number>;
  created_at: string;
}

export interface ProfileData {
  id: string;
  name: string;
  email: string;
  headline?: string;
  bio?: string;
  skills: string[];
  preferred_roles: string[];
  locations: string[];
  experience_level?: string;
  onboarding_complete: boolean;
}

export const dashboardService = {
  async getAnalytics(userId?: string): Promise<DashboardAnalytics> {
    const { data } = await apiClient.get("/dashboard/analytics", { params: { user_id: userId } });
    return data;
  },

  async listApplications(status?: string): Promise<ApplicationItem[]> {
    const { data } = await apiClient.get("/dashboard/applications", { params: { status } });
    return data;
  },

  async createApplication(app: Partial<ApplicationItem>): Promise<ApplicationItem> {
    const { data } = await apiClient.post("/dashboard/applications", app);
    return data;
  },

  async updateApplication(id: string, update: Partial<ApplicationItem>): Promise<ApplicationItem> {
    const { data } = await apiClient.patch(`/dashboard/applications/${id}`, update);
    return data;
  },

  async deleteApplication(id: string): Promise<void> {
    await apiClient.delete(`/dashboard/applications/${id}`);
  },

  async listNotifications(unreadOnly: boolean = false): Promise<NotificationItem[]> {
    const { data } = await apiClient.get("/dashboard/notifications", { params: { unread_only: unreadOnly } });
    return data;
  },

  async markNotificationRead(id: string): Promise<void> {
    await apiClient.patch(`/dashboard/notifications/${id}/read`);
  },

  async markAllNotificationsRead(): Promise<void> {
    await apiClient.patch("/dashboard/notifications/read-all");
  },

  async getSubscription(): Promise<SubscriptionInfo> {
    const { data } = await apiClient.get("/dashboard/subscription");
    return data;
  },

  async upgradeSubscription(plan: string): Promise<SubscriptionInfo> {
    const { data } = await apiClient.post("/dashboard/subscription/upgrade", { plan });
    return data;
  },

  async getActivityLog(limit: number = 20): Promise<ActivityLogItem[]> {
    const { data } = await apiClient.get("/dashboard/activity", { params: { limit } });
    return data;
  },

  async getProfile(): Promise<ProfileData> {
    const { data } = await apiClient.get("/dashboard/profile");
    return data;
  },

  async updateProfile(update: Partial<ProfileData>): Promise<ProfileData> {
    const { data } = await apiClient.patch("/dashboard/profile", update);
    return data;
  },
};
