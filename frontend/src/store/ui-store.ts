import { create } from "zustand";

interface UIState {
  sidebarOpen: boolean;
  activeDashboardTab: string;
  themeMode: "light" | "dark";
  
  // Actions
  toggleSidebar: () => void;
  setSidebar: (open: boolean) => void;
  setDashboardTab: (tab: string) => void;
  toggleTheme: () => void;
}

export const useUIStore = create<UIState>((set) => ({
  sidebarOpen: true,
  activeDashboardTab: "overview",
  themeMode: "dark",

  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  
  setSidebar: (open) => set({ sidebarOpen: open }),
  
  setDashboardTab: (tab) => set({ activeDashboardTab: tab }),
  
  toggleTheme: () =>
    set((state) => {
      const nextTheme = state.themeMode === "dark" ? "light" : "dark";
      return { themeMode: nextTheme };
    }),
}));
