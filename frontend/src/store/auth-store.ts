import { create } from "zustand";
import { authApi, AuthResponse } from "@/lib/api-client";

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  headline?: string;
  bio?: string;
}

export interface OnboardingData {
  preferred_roles: string[];
  experience_level: string;
  locations: string[];
  skills: string[];
  resume_url?: string;
  headline?: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;

  onboardingComplete: boolean;
  onboardingData: Partial<OnboardingData>;

  initializeSession: () => Promise<void>;
  signUp: (email: string, pass: string, name: string) => Promise<any>;
  login: (email: string, pass: string) => Promise<any>;
  logout: () => Promise<void>;
  forgotPassword: (email: string) => Promise<any>;
  resetPassword: (pass: string) => Promise<any>;
  updateUser: (updatedFields: Partial<User>) => void;
  setLoading: (isLoading: boolean) => void;

  setOnboardingData: (data: Partial<OnboardingData>) => void;
  completeOnboarding: (data: OnboardingData) => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: true,
  onboardingComplete: false,
  onboardingData: {},

  initializeSession: async () => {
    try {
      set({ isLoading: true });
      const token = localStorage.getItem("cc_token");

      if (token) {
        const res = await authApi.me();
        if (res.success && res.data) {
          const userData = res.data;
          const mappedUser: User = {
            id: userData.id,
            name: userData.name || userData.email.split("@")[0] || "Professional User",
            email: userData.email,
            role: userData.role,
            headline: userData.headline || "AI Career Builder",
            bio: userData.bio || "",
          };

          if (typeof window !== "undefined") {
            document.cookie = `cc_session=${token}; path=/; max-age=${3600 * 24}; SameSite=Lax; Secure`;
          }

          set({
            user: mappedUser,
            token,
            isAuthenticated: true,
            onboardingComplete: userData.onboarding_complete || false,
          });
        } else {
          localStorage.removeItem("cc_token");
          document.cookie = "cc_session=; path=/; max-age=0; SameSite=Lax";
          set({ user: null, token: null, isAuthenticated: false });
        }
      } else {
        set({ user: null, token: null, isAuthenticated: false });
      }
    } catch (e) {
      console.error("Auth session sync error:", e);
      localStorage.removeItem("cc_token");
      document.cookie = "cc_session=; path=/; max-age=0; SameSite=Lax";
      set({ user: null, token: null, isAuthenticated: false });
    } finally {
      set({ isLoading: false });
    }
  },

  signUp: async (email, pass, name) => {
    set({ isLoading: true });
    try {
      console.log("[Auth] signUp called", { email, name });
      const data = await authApi.register(name, email, pass);
      console.log("[Auth] signUp success", data);

      localStorage.setItem("cc_token", data.access_token);
      if (typeof window !== "undefined") {
        document.cookie = `cc_session=${data.access_token}; path=/; max-age=${3600 * 24}; SameSite=Lax; Secure`;
      }

      const mappedUser: User = {
        id: data.user.id,
        name: data.user.name || email.split("@")[0] || "Professional User",
        email: data.user.email,
        role: data.user.role,
        headline: data.user.headline || "AI Career Builder",
      };

      set({
        user: mappedUser,
        token: data.access_token,
        isAuthenticated: true,
      });

      return data;
    } catch (err: any) {
      console.error("[Auth] signUp error:", err);
      throw err;
    } finally {
      console.log("[Auth] signUp finally - setting loading false");
      set({ isLoading: false });
    }
  },

  login: async (email, pass) => {
    set({ isLoading: true });
    try {
      console.log("[Auth] login called", { email });
      const data = await authApi.login(email, pass);
      console.log("[Auth] login success", data);

      localStorage.setItem("cc_token", data.access_token);
      if (typeof window !== "undefined") {
        document.cookie = `cc_session=${data.access_token}; path=/; max-age=${3600 * 24}; SameSite=Lax; Secure`;
      }

      const mappedUser: User = {
        id: data.user.id,
        name: data.user.name || email.split("@")[0] || "Professional User",
        email: data.user.email,
        role: data.user.role,
        headline: data.user.headline || "AI Career Builder",
      };

      set({
        user: mappedUser,
        token: data.access_token,
        isAuthenticated: true,
        onboardingComplete: data.user.onboarding_complete || false,
      });

      return data;
    } catch (err: any) {
      console.error("[Auth] login error:", err);
      throw err;
    } finally {
      set({ isLoading: false });
    }
  },

  logout: async () => {
    set({ isLoading: true });
    try {
      localStorage.removeItem("cc_token");
      if (typeof window !== "undefined") {
        document.cookie = "cc_session=; path=/; max-age=0; SameSite=Lax";
      }

      set({
        user: null,
        token: null,
        isAuthenticated: false,
        onboardingComplete: false,
        onboardingData: {},
      });
    } finally {
      set({ isLoading: false });
    }
  },

  forgotPassword: async (email) => {
    throw new Error("Password reset via email not implemented yet. Use backend API.");
  },

  resetPassword: async (pass) => {
    throw new Error("Password reset not implemented yet. Use backend API.");
  },

  updateUser: (updatedFields) =>
    set((state) => ({
      user: state.user ? { ...state.user, ...updatedFields } : null,
    })),

  setLoading: (isLoading) => set({ isLoading }),

  setOnboardingData: (data) =>
    set((state) => ({
      onboardingData: { ...state.onboardingData, ...data },
    })),

  completeOnboarding: async (data) => {
    set({ isLoading: true });
    try {
      const { token } = get();

      if (token) {
        const isClient = typeof window !== "undefined";
        const apiBase = isClient ? "/api/v1" : (process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000");
        const res = await fetch(`${apiBase}/users/onboarding`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(data),
        });

        if (!res.ok) {
          const errData = await res.json().catch(() => ({ detail: "Onboarding failed" }));
          throw new Error(errData.detail || errData.message || "Onboarding failed");
        }

        const resData = await res.json();
        if (resData.data) {
          const ud = resData.data;
          set({
            user: {
              id: ud.id,
              name: ud.name,
              email: ud.email,
              role: ud.role,
              headline: ud.headline,
              bio: ud.bio,
            },
          });
        }
      }

      set({
        onboardingComplete: true,
        onboardingData: data,
      });
    } catch (err: any) {
      console.error("[Auth] completeOnboarding error:", err);
      throw err;
    } finally {
      set({ isLoading: false });
    }
  },
}));
