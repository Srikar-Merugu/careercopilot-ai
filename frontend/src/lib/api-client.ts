const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";

interface ApiOptions {
  method?: string;
  body?: unknown;
  headers?: Record<string, string>;
}

async function request<T>(endpoint: string, options: ApiOptions = {}): Promise<T> {
  const { method = "GET", body, headers = {} } = options;

  const token = typeof window !== "undefined" ? localStorage.getItem("cc_token") : null;

  const res = await fetch(`${API_BASE}${endpoint}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...headers,
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({ detail: res.statusText }));
    throw new Error(error.detail || error.message || `Request failed: ${res.status}`);
  }

  return res.json();
}

export const api = {
  get: <T>(endpoint: string) => request<T>(endpoint),
  post: <T>(endpoint: string, body: unknown) =>
    request<T>(endpoint, { method: "POST", body }),
  patch: <T>(endpoint: string, body: unknown) =>
    request<T>(endpoint, { method: "PATCH", body }),
  delete: <T>(endpoint: string) =>
    request<T>(endpoint, { method: "DELETE" }),
};

export interface AuthResponse {
  access_token: string;
  token_type: string;
  user: {
    id: string;
    email: string;
    name: string;
    role: string;
    headline: string;
    bio: string;
    preferred_roles: string[];
    experience_level: string;
    locations: string[];
    skills: string[];
    resume_url: string;
    onboarding_complete: boolean;
    ats_score: number | null;
    created_at: string;
  };
}

export const authApi = {
  login: (email: string, password: string) =>
    api.post<AuthResponse>("/auth/login", { email, password }),

  register: (name: string, email: string, password: string) =>
    api.post<AuthResponse>("/auth/register", { name, email, password }),

  me: () => api.get<{ success: boolean; data: AuthResponse["user"] }>("/auth/me"),
};
