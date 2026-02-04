// Role definitions for the tenant panel RBAC system

export const ROLES = {
  ADMIN: "admin",
  LAB: "lab",
  INVENTORY: "inventory",
  FINANCE: "finance",
  HR: "hr",
  // Employee roles (cannot access tenant-panel)
  EMPLOYEE: "employee",
  HOME_COLLECTOR: "home_collector",
  // Doctor role (separate portal)
  DOCTOR: "doctor",
} as const;

export type Role = (typeof ROLES)[keyof typeof ROLES];

// Role display names for UI
export const ROLE_LABELS: Record<Role, string> = {
  admin: "Administrator",
  lab: "Lab Manager",
  inventory: "Inventory Manager",
  finance: "Finance Manager",
  hr: "HR Manager",
  employee: "Employee",
  home_collector: "Home Collector",
  doctor: "Doctor",
};

// Role descriptions for UI
export const ROLE_DESCRIPTIONS: Record<Role, string> = {
  admin: "Full access to all features and settings",
  lab: "Access to lab processing, sample collection, and reports",
  inventory: "Access to inventory, stock management, and categories",
  finance: "Access to financial management and expenses",
  hr: "Access to employee management, attendance, and salary",
  employee: "Access to personal attendance and salary information",
  home_collector: "Access to assigned home collections and personal info",
  doctor: "Access to doctor portal and commission tracking",
};

// Check if role is an employee role (not management)
export function isEmployeeRole(role: Role): boolean {
  return role === ROLES.EMPLOYEE || role === ROLES.HOME_COLLECTOR;
}

// Check if role is a doctor role
export function isDoctorRole(role: Role): boolean {
  return role === ROLES.DOCTOR;
}

// Check if role is a management/admin role (has access to tenant panel)
export function isManagementRole(role: Role): boolean {
  return !isEmployeeRole(role) && !isDoctorRole(role);
}
