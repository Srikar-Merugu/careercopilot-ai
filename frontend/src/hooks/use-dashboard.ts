"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { dashboardService } from "@/services/dashboard-service";
import { useDashboardStore } from "@/store/dashboard-store";

export function useDashboardAnalytics() {
  const { setAnalytics, setIsLoading } = useDashboardStore();

  return useQuery({
    queryKey: ["dashboard", "analytics"],
    queryFn: async () => {
      setIsLoading(true);
      try {
        const data = await dashboardService.getAnalytics();
        setAnalytics(data);
        return data;
      } finally {
        setIsLoading(false);
      }
    },
    staleTime: 60000,
  });
}

export function useApplications(status?: string) {
  const { setApplications } = useDashboardStore();

  return useQuery({
    queryKey: ["dashboard", "applications", status],
    queryFn: async () => {
      const data = await dashboardService.listApplications(status);
      setApplications(data);
      return data;
    },
    staleTime: 30000,
  });
}

export function useUpdateApplication() {
  const queryClient = useQueryClient();
  const { updateApplication } = useDashboardStore();

  return useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Record<string, any> }) => {
      const data = await dashboardService.updateApplication(id, updates);
      return data;
    },
    onSuccess: (data) => {
      updateApplication(data.id, data);
      queryClient.invalidateQueries({ queryKey: ["dashboard", "analytics"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard", "applications"] });
    },
  });
}

export function useDeleteApplication() {
  const queryClient = useQueryClient();
  const { removeApplication } = useDashboardStore();

  return useMutation({
    mutationFn: async (id: string) => {
      await dashboardService.deleteApplication(id);
      return id;
    },
    onSuccess: (id) => {
      removeApplication(id);
      queryClient.invalidateQueries({ queryKey: ["dashboard", "applications"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard", "analytics"] });
    },
  });
}

export function useNotifications(unreadOnly: boolean = false) {
  const { setNotifications, setUnreadCount } = useDashboardStore();

  return useQuery({
    queryKey: ["dashboard", "notifications", unreadOnly],
    queryFn: async () => {
      const data = await dashboardService.listNotifications(unreadOnly);
      setNotifications(data);
      setUnreadCount(data.filter((n) => !n.is_read).length);
      return data;
    },
    staleTime: 15000,
    refetchInterval: 60000,
  });
}

export function useMarkNotificationRead() {
  const queryClient = useQueryClient();
  const { markNotificationRead } = useDashboardStore();

  return useMutation({
    mutationFn: async (id: string) => {
      await dashboardService.markNotificationRead(id);
      return id;
    },
    onSuccess: (id) => {
      markNotificationRead(id);
      queryClient.invalidateQueries({ queryKey: ["dashboard", "notifications"] });
    },
  });
}

export function useMarkAllNotificationsRead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      await dashboardService.markAllNotificationsRead();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["dashboard", "notifications"] });
    },
  });
}

export function useSubscription() {
  const { setSubscription } = useDashboardStore();

  return useQuery({
    queryKey: ["dashboard", "subscription"],
    queryFn: async () => {
      const data = await dashboardService.getSubscription();
      setSubscription(data);
      return data;
    },
    staleTime: 120000,
  });
}

export function useUpgradeSubscription() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (plan: string) => {
      return dashboardService.upgradeSubscription(plan);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["dashboard", "subscription"] });
    },
  });
}

export function useActivityLog(limit: number = 20) {
  const { setActivityLog } = useDashboardStore();

  return useQuery({
    queryKey: ["dashboard", "activity", limit],
    queryFn: async () => {
      const data = await dashboardService.getActivityLog(limit);
      setActivityLog(data);
      return data;
    },
    staleTime: 30000,
  });
}

export function useProfile() {
  return useQuery({
    queryKey: ["dashboard", "profile"],
    queryFn: () => dashboardService.getProfile(),
    staleTime: 120000,
  });
}

export function useUpdateProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (update: Record<string, any>) => {
      return dashboardService.updateProfile(update);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["dashboard", "profile"] });
    },
  });
}
