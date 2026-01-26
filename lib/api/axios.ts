/**
 * Axios Configuration
 * 
 * This file configures the axios instance for making API calls.
 * The baseURL will be updated when the Python backend is integrated.
 */

import axios, { AxiosError, AxiosResponse, InternalAxiosRequestConfig } from "axios";

// Base URL for the API - Update this when Python backend is ready
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";

// Create axios instance with default config
export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor for adding auth token
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Get token from localStorage or auth state
    const token = typeof window !== "undefined" ? localStorage.getItem("auth_token") : null;
    
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// Response interceptor for handling errors
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  (error: AxiosError) => {
    // Handle specific error codes
    if (error.response) {
      switch (error.response.status) {
        case 401:
          // Unauthorized - redirect to login or refresh token
          if (typeof window !== "undefined") {
            // localStorage.removeItem("auth_token");
            // window.location.href = "/login";
          }
          break;
        case 403:
          // Forbidden
          console.error("Access denied");
          break;
        case 404:
          // Not found
          console.error("Resource not found");
          break;
        case 500:
          // Server error
          console.error("Server error");
          break;
      }
    }
    
    return Promise.reject(error);
  }
);

// API Response type
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  pagination?: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

// API Error type
export interface ApiError {
  message: string;
  code: string;
  details?: Record<string, string[]>;
}

export default apiClient;
