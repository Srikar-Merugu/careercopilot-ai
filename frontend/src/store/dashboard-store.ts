import { create } from "zustand";
import { DashboardAnalytics, ApplicationItem, NotificationItem, SubscriptionInfo, ActivityLogItem } from "@/services/dashboard-service";

interface DashboardState {
  analytics: DashboardAnalytics | null;
  applications: ApplicationItem[];
  notifications: NotificationItem[];
  subscription: SubscriptionInfo | null;
  activityLog: ActivityLogItem[];
  unreadCount: number;
  sidebarCollapsed: boolean;
  isLoading: boolean;
  error: string | null;

  setAnalytics: (data: DashboardAnalytics | null) => void;
  setApplications: (apps: ApplicationItem[]) => void;
  addApplication: (app: ApplicationItem) => void;
  updateApplication: (id: string, updates: Partial<ApplicationItem>) => void;
  removeApplication: (id: string) => void;
  setNotifications: (notifs: NotificationItem[]) => void;
  markNotificationRead: (id: string) => void;
  setUnreadCount: (count: number) => void;
  setSubscription: (sub: SubscriptionInfo | null) => void;
  setActivityLog: (log: ActivityLogItem[]) => void;
  setSidebarCollapsed: (collapsed: boolean) => void;
  toggleSidebar: () => void;
  setIsLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  reset: () => void;
}

export const useDashboardStore = create<DashboardState>((set) => ({
  analytics: null,
  applications: [],
  notifications: [],
  subscription: null,
  activityLog: [],
  unreadCount: 0,
  sidebarCollapsed: false,
  isLoading: false,
  error: null,

  setAnalytics: (data) => set({ analytics: data }),
  setApplications: (apps) => set({ applications: apps }),
  addApplication: (app) => set((s) => ({ applications: [app, ...s.applications] })),
  updateApplication: (id, updates) =>
    set((s) => ({
      applications: s.applications.map((a) => (a.id === id ? { ...a, ...updates } : a)),
    })),
  removeApplication: (id) =>
    set((s) => ({ applications: s.applications.filter((a) => a.id !== id) })),
  setNotifications: (notifs) => set({ notifications: notifs }),
  markNotificationRead: (id) =>
    set((s) => ({
      notifications: s.notifications.map((n) =>
        n.id === id ? { ...n, is_read: true } : n
      ),
      unreadCount: Math.max(0, s.unreadCount - 1),
    })),
  setUnreadCount: (count) => set({ unreadCount: count }),
  setSubscription: (sub) => set({ subscription: sub }),
  setActivityLog: (log) => set({ activityLog: log }),
  setSidebarCollapsed: (collapsed) => set({ sidebarCollapsed: collapsed }),
  toggleSidebar: () => set((s) => ({ sidebarCollapsed: !s.sidebarCollapsed })),
  setIsLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error }),
  reset: () =>
    set({
      analytics: null, applications: [], notifications: [],
      subscription: null, activityLog: [], unreadCount: 0, error: null,
    }),
}));
