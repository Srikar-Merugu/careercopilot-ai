import { apiClient } from "./api-client";
import { User } from "@/store/auth-store";

export interface AuthResponse {
  access_token: string;
  token_type: string;
  user: User;
}

export const authService = {
  /**
   * Log in user
   */
  async login(payload: any): Promise<AuthResponse> {
    const response = await apiClient.post("/auth/login", payload);
    return response.data;
  },

  /**
   * Register new user
   */
  async register(payload: any): Promise<AuthResponse> {
    const response = await apiClient.post("/auth/register", payload);
    return response.data;
  },

  /**
   * Fetch logged-in user profile
   */
  async getProfile(): Promise<User> {
    const response = await apiClient.get("/auth/me");
    return response.data;
  },

  /**
   * Update profile fields
   */
  async updateProfile(payload: Partial<User>): Promise<User> {
    const response = await apiClient.patch("/users/profile", payload);
    return response.data.data;
  }
};
