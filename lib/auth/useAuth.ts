"use client";

import { useState, useEffect, useCallback } from "react";
import { Role, ROLES, ROLE_LABELS } from "./roles";

// User interface
export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  avatar?: string;
}

// Auth state interface
export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

// Mock user credentials for demo
export const MOCK_USERS: Record<string, { password: string; user: User }> = {
  admin: {
    password: "admin123",
    user: {
      id: "1",
      name: "Jennifer Arter",
      email: "admin@ektajanch.com",
      role: ROLES.ADMIN,
    },
  },
  lab: {
    password: "lab123",
    user: {
      id: "2",
      name: "Dr. Rajesh Kumar",
      email: "lab@ektajanch.com",
      role: ROLES.LAB,
    },
  },
  inventory: {
    password: "inventory123",
    user: {
      id: "3",
      name: "Amit Sharma",
      email: "inventory@ektajanch.com",
      role: ROLES.INVENTORY,
    },
  },
  finance: {
    password: "finance123",
    user: {
      id: "4",
      name: "Priya Patel",
      email: "finance@ektajanch.com",
      role: ROLES.FINANCE,
    },
  },
  hr: {
    password: "hr123",
    user: {
      id: "5",
      name: "Sneha Gupta",
      email: "hr@ektajanch.com",
      role: ROLES.HR,
    },
  },
  // Employee roles
  employee: {
    password: "emp123",
    user: {
      id: "6",
      name: "Rahul Verma",
      email: "rahul@ektajanch.com",
      role: ROLES.EMPLOYEE,
    },
  },
  collector: {
    password: "col123",
    user: {
      id: "7",
      name: "Suresh Kumar",
      email: "suresh@ektajanch.com",
      role: ROLES.HOME_COLLECTOR,
    },
  },
  // Doctor login
  doctor: {
    password: "doc123",
    user: {
      id: "8",
      name: "Dr. Anil Sharma",
      email: "dr.anil@ektajanch.com",
      role: ROLES.DOCTOR,
    },
  },
};

// Storage key for persisting auth state
const AUTH_STORAGE_KEY = "ekta_janch_auth";

/**
 * Get stored auth state from localStorage
 */
function getStoredAuth(): User | null {
  if (typeof window === "undefined") return null;
  
  try {
    const stored = localStorage.getItem(AUTH_STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error("Error reading auth from storage:", error);
  }
  return null;
}

/**
 * Store auth state in localStorage
 */
function setStoredAuth(user: User | null): void {
  if (typeof window === "undefined") return;
  
  try {
    if (user) {
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(AUTH_STORAGE_KEY);
    }
  } catch (error) {
    console.error("Error storing auth:", error);
  }
}

/**
 * Mock authentication hook
 * In a real app, this would connect to an authentication service
 */
export function useAuth() {
  const [mounted, setMounted] = useState(false);
  const [state, setState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
  });

  // Handle hydration by only reading localStorage after mount
  useEffect(() => {
    const storedUser = getStoredAuth();
    setState({
      user: storedUser,
      isAuthenticated: !!storedUser,
      isLoading: false,
    });
    setMounted(true);
  }, []);

  // Don't show loading state after mount, use the state we have
  const currentState = mounted ? state : { ...state, isLoading: true };

  /**
   * Login with username and password
   */
  const login = useCallback(
    async (username: string, password: string): Promise<{ success: boolean; error?: string }> => {
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 500));

      const mockUser = MOCK_USERS[username.toLowerCase()];

      if (!mockUser) {
        return { success: false, error: "Invalid username" };
      }

      if (mockUser.password !== password) {
        return { success: false, error: "Invalid password" };
      }

      setStoredAuth(mockUser.user);
      setState({
        user: mockUser.user,
        isAuthenticated: true,
        isLoading: false,
      });

      return { success: true };
    },
    []
  );

  /**
   * Logout current user
   */
  const logout = useCallback(() => {
    setStoredAuth(null);
    setState({
      user: null,
      isAuthenticated: false,
      isLoading: false,
    });
  }, []);

  /**
   * Get role label for display
   */
  const getRoleLabel = useCallback(() => {
    if (!state.user) return "";
    return ROLE_LABELS[state.user.role];
  }, [state.user]);

  /**
   * Check if user has a specific role
   */
  const hasRole = useCallback((role: Role | Role[]): boolean => {
    if (!state.user) return false;
    if (Array.isArray(role)) {
      return role.includes(state.user.role);
    }
    return state.user.role === role;
  }, [state.user]);

  return {
    ...currentState,
    login,
    logout,
    getRoleLabel,
    hasRole,
  };
}

// Export type for the hook return value
export type UseAuthReturn = ReturnType<typeof useAuth>;
