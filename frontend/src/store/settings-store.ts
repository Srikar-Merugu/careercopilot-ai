import { create } from "zustand";

interface AppSettings {
  emailNotifications: boolean;
  pushNotifications: boolean;
  weeklyDigest: boolean;
  aiCreativity: number; // 0.0 to 1.0
}

interface SettingsState {
  settings: AppSettings;
  
  // Actions
  updateSettings: (newSettings: Partial<AppSettings>) => void;
  resetSettings: () => void;
}

const defaultSettings: AppSettings = {
  emailNotifications: true,
  pushNotifications: false,
  weeklyDigest: true,
  aiCreativity: 0.7,
};

export const useSettingsStore = create<SettingsState>((set) => ({
  settings: defaultSettings,

  updateSettings: (newSettings) =>
    set((state) => ({
      settings: { ...state.settings, ...newSettings },
    })),

  resetSettings: () => set({ settings: defaultSettings }),
}));
