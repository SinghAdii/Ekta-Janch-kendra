// Admin Roles and Permissions
export type AdminRole = "Super Admin" | "Manager" | "Operator" | "Accountant" | "Technician" | "Viewer";

export interface AdminPermissions {
  canManageUsers: boolean;
  canManageTests: boolean;
  canManagePackages: boolean;
  canViewOrders: boolean;
  canEditOrders: boolean;
  canViewReports: boolean;
  canEditReports: boolean;
  canManageFinance: boolean;
  canViewCustomers: boolean;
  canEditCustomers: boolean;
  canManageTenants: boolean;
}

// Admin User Interface
export interface AdminUser {
  id: string;
  username: string;
  email: string;
  fullName: string;
  roles: AdminRole[];
  permissions: AdminPermissions;
  status: "Active" | "Inactive" | "Suspended";
  createdAt: string;
  lastLogin?: string;
  createdBy: string;
}

// Admin User Form Data
export interface AdminUserFormData {
  username: string;
  password: string;
  confirmPassword: string;
  email: string;
  fullName: string;
  roles: AdminRole[];
}

// Validation Error Type
export interface ValidationError {
  field: string;
  message: string;
}

// Role Definitions with Permissions
export const ROLE_DEFINITIONS: Record<AdminRole, AdminPermissions> = {
  "Super Admin": {
    canManageUsers: true,
    canManageTests: true,
    canManagePackages: true,
    canViewOrders: true,
    canEditOrders: true,
    canViewReports: true,
    canEditReports: true,
    canManageFinance: true,
    canViewCustomers: true,
    canEditCustomers: true,
    canManageTenants: true,
  },
  Manager: {
    canManageUsers: true,
    canManageTests: true,
    canManagePackages: true,
    canViewOrders: true,
    canEditOrders: true,
    canViewReports: true,
    canEditReports: true,
    canManageFinance: true,
    canViewCustomers: true,
    canEditCustomers: true,
    canManageTenants: false,
  },
  Operator: {
    canManageUsers: false,
    canManageTests: true,
    canManagePackages: true,
    canViewOrders: true,
    canEditOrders: true,
    canViewReports: true,
    canEditReports: false,
    canManageFinance: false,
    canViewCustomers: true,
    canEditCustomers: true,
    canManageTenants: false,
  },
  Accountant: {
    canManageUsers: false,
    canManageTests: false,
    canManagePackages: false,
    canViewOrders: true,
    canEditOrders: false,
    canViewReports: true,
    canEditReports: true,
    canManageFinance: true,
    canViewCustomers: true,
    canEditCustomers: false,
    canManageTenants: false,
  },
  Technician: {
    canManageUsers: false,
    canManageTests: true,
    canManagePackages: true,
    canViewOrders: true,
    canEditOrders: false,
    canViewReports: true,
    canEditReports: false,
    canManageFinance: false,
    canViewCustomers: true,
    canEditCustomers: false,
    canManageTenants: false,
  },
  Viewer: {
    canManageUsers: false,
    canManageTests: false,
    canManagePackages: false,
    canViewOrders: true,
    canEditOrders: false,
    canViewReports: true,
    canEditReports: false,
    canManageFinance: false,
    canViewCustomers: true,
    canEditCustomers: false,
    canManageTenants: false,
  },
};
