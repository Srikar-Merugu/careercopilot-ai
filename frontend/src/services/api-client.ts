import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";

// Standard API response shape
export interface ApiResponse<T = any> {
  success: boolean;
  data: T;
  error?: {
    code: string;
    message: string;
  };
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 15000, // 15 seconds limit
});

// Request Interceptor: Auto-inject JWT tokens from local storage
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("cc_token");
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error: Error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor: Parse API responses and clean up error payloads
apiClient.interceptors.response.use(
  (response) => {
    // Return direct response data for easier consumption
    return response;
  },
  (error: AxiosError) => {
    let message = "A connection error occurred. Please verify your internet connection.";
    let code = "NetworkError";

    if (error.response) {
      // Server returned a structured HTTP failure status
      const responseData = error.response.data as any;
      if (responseData?.error) {
        message = responseData.error.message || message;
        code = responseData.error.code || code;
      } else if (responseData?.detail) {
        message = typeof responseData.detail === "string" 
          ? responseData.detail 
          : JSON.stringify(responseData.detail);
        code = "HttpException";
      } else {
        message = `Server responded with status code ${error.response.status}`;
        code = `HttpStatus${error.response.status}`;
      }
    } else if (error.request) {
      // Request sent but no response received
      message = "No response received from CareerCopilot services. Please try again later.";
      code = "TimeoutError";
    }

    // Return a structured error object for consistent catch blocks
    const apiError = {
      success: false,
      error: {
        code,
        message,
      },
    };
    
    return Promise.reject(apiError);
  }
);
