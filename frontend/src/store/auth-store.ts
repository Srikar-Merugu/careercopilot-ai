import { create } from "zustand";
import { supabase } from "@/lib/supabase-client";

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

  // Onboarding progress
  onboardingComplete: boolean;
  onboardingData: Partial<OnboardingData>;

  // Actions
  initializeSession: () => Promise<void>;
  signUp: (email: string, pass: string, name: string) => Promise<any>;
  login: (email: string, pass: string) => Promise<any>;
  signInWithOAuth: (provider: "google" | "github") => Promise<any>;
  logout: () => Promise<void>;
  forgotPassword: (email: string) => Promise<any>;
  resetPassword: (pass: string) => Promise<any>;
  updateUser: (updatedFields: Partial<User>) => void;
  setLoading: (isLoading: boolean) => void;

  // Onboarding actions
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
      const { data: { session } } = await supabase.auth.getSession();

      if (session) {
        const metadata = session.user.user_metadata;
        const mappedUser: User = {
          id: session.user.id,
          name: metadata.full_name || session.user.email?.split("@")[0] || "Professional User",
          email: session.user.email || "",
          role: "professional",
          headline: metadata.headline || "AI Career Builder",
          bio: metadata.bio || "",
        };

        // Write cookie for Next.js Middleware security sync
        if (typeof window !== "undefined") {
          document.cookie = `cc_session=${session.access_token}; path=/; max-age=${3600 * 24}; SameSite=Lax; Secure`;
        }

        set({
          user: mappedUser,
          token: session.access_token,
          isAuthenticated: true,
          onboardingComplete: metadata.onboarding_complete === true,
        });
      } else {
        set({ user: null, token: null, isAuthenticated: false });
      }
    } catch (e) {
      console.error("Zustand auth session sync error:", e);
    } finally {
      set({ isLoading: false });
    }
  },

  signUp: async (email, pass, name) => {
    set({ isLoading: true });
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password: pass,
        options: {
          data: {
            full_name: name,
            headline: "AI Career Builder",
            onboarding_complete: false,
          },
        },
      });
      if (error) throw error;
      return data;
    } finally {
      set({ isLoading: false });
    }
  },

  login: async (email, pass) => {
    set({ isLoading: true });
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password: pass,
      });
      if (error) throw error;

      if (data.session) {
        const metadata = data.user.user_metadata;
        const mappedUser: User = {
          id: data.user.id,
          name: metadata.full_name || data.user.email?.split("@")[0] || "Professional User",
          email: data.user.email || "",
          role: "professional",
          headline: metadata.headline || "AI Career Builder",
        };

        // Write cookie for Next.js Middleware security sync
        if (typeof window !== "undefined") {
          document.cookie = `cc_session=${data.session.access_token}; path=/; max-age=${3600 * 24}; SameSite=Lax; Secure`;
        }

        set({
          user: mappedUser,
          token: data.session.access_token,
          isAuthenticated: true,
          onboardingComplete: metadata.onboarding_complete === true,
        });
      }
      return data;
    } finally {
      set({ isLoading: false });
    }
  },

  signInWithOAuth: async (provider) => {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${window.location.origin}/dashboard`,
      },
    });
    if (error) throw error;
    return data;
  },

  logout: async () => {
    set({ isLoading: true });
    try {
      await supabase.auth.signOut();

      // Delete cookie for Next.js Middleware security sync
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
    const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    if (error) throw error;
    return data;
  },

  resetPassword: async (pass) => {
    const { data, error } = await supabase.auth.updateUser({
      password: pass,
    });
    if (error) throw error;
    return data;
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

      // Update Supabase user metadata
      const { error } = await supabase.auth.updateUser({
        data: {
          onboarding_complete: true,
          preferred_roles: data.preferred_roles,
          experience_level: data.experience_level,
          locations: data.locations,
          skills: data.skills,
          resume_url: data.resume_url,
          headline: data.headline,
        },
      });
      if (error) throw error;

      // Call backend to persist onboarding data
      if (token) {
        const apiBase = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
        await fetch(`${apiBase}/api/v1/users/onboarding`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(data),
        });
      }

      set({
        onboardingComplete: true,
        onboardingData: data,
      });
    } finally {
      set({ isLoading: false });
    }
  },
}));
