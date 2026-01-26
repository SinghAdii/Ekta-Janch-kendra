import type { AdminUser, AdminRole } from "./admin-users.types";
import { ROLE_DEFINITIONS as ROLE_PERMS } from "./admin-users.types";

// Mock Admin Users
const MOCK_ADMIN_USERS: AdminUser[] = [
  {
    id: "admin-001",
    username: "superadmin",
    email: "superadmin@ekta-janch.com",
    fullName: "Super Admin User",
    roles: ["Super Admin"],
    permissions: ROLE_PERMS["Super Admin"],
    status: "Active",
    createdAt: "2025-01-01T10:00:00Z",
    lastLogin: "2026-01-10T09:30:00Z",
    createdBy: "System",
  },
  {
    id: "admin-002",
    username: "manager_raj",
    email: "raj.manager@ekta-janch.com",
    fullName: "Raj Kumar Manager",
    roles: ["Manager"],
    permissions: ROLE_PERMS["Manager"],
    status: "Active",
    createdAt: "2025-06-15T14:20:00Z",
    lastLogin: "2026-01-09T16:45:00Z",
    createdBy: "superadmin",
  },
  {
    id: "admin-003",
    username: "operator_priya",
    email: "priya.operator@ekta-janch.com",
    fullName: "Priya Singh Operator",
    roles: ["Operator"],
    permissions: ROLE_PERMS["Operator"],
    status: "Active",
    createdAt: "2025-08-20T11:10:00Z",
    lastLogin: "2026-01-10T08:15:00Z",
    createdBy: "manager_raj",
  },
  {
    id: "admin-004",
    username: "accountant_arun",
    email: "arun.accountant@ekta-janch.com",
    fullName: "Arun Verma Accountant",
    roles: ["Accountant"],
    permissions: ROLE_PERMS["Accountant"],
    status: "Active",
    createdAt: "2025-09-10T09:00:00Z",
    lastLogin: "2026-01-08T13:20:00Z",
    createdBy: "manager_raj",
  },
  {
    id: "admin-005",
    username: "tech_vikram",
    email: "vikram.tech@ekta-janch.com",
    fullName: "Vikram Patel Technician",
    roles: ["Technician"],
    permissions: ROLE_PERMS["Technician"],
    status: "Active",
    createdAt: "2025-07-05T13:30:00Z",
    lastLogin: "2026-01-10T07:00:00Z",
    createdBy: "manager_raj",
  },
  {
    id: "admin-006",
    username: "viewer_neha",
    email: "neha.viewer@ekta-janch.com",
    fullName: "Neha Sharma Viewer",
    roles: ["Viewer"],
    permissions: ROLE_PERMS["Viewer"],
    status: "Inactive",
    createdAt: "2025-11-01T10:15:00Z",
    lastLogin: undefined,
    createdBy: "manager_raj",
  },
];

// Simulated database store
const adminUsers: AdminUser[] = [...MOCK_ADMIN_USERS];

// Fetch all admin users
export async function fetchAdminUsers(): Promise<AdminUser[]> {
  await new Promise((resolve) => setTimeout(resolve, 500));
  return [...adminUsers];
}

// Fetch single admin user
export async function fetchAdminUserById(id: string): Promise<AdminUser | null> {
  await new Promise((resolve) => setTimeout(resolve, 300));
  return adminUsers.find((user) => user.id === id) || null;
}

// Create new admin user
export async function createAdminUser(data: {
  username: string;
  password: string;
  email: string;
  fullName: string;
  roles: AdminRole[];
}): Promise<AdminUser> {
  await new Promise((resolve) => setTimeout(resolve, 600));

  const newUser: AdminUser = {
    id: `admin-${Date.now()}`,
    username: data.username,
    email: data.email,
    fullName: data.fullName,
    roles: data.roles,
    permissions: mergePermissions(data.roles),
    status: "Active",
    createdAt: new Date().toISOString(),
    createdBy: "current-user",
  };

  adminUsers.push(newUser);
  return newUser;
}

// Update admin user
export async function updateAdminUser(
  id: string,
  data: Partial<AdminUser>
): Promise<AdminUser | null> {
  await new Promise((resolve) => setTimeout(resolve, 500));

  const index = adminUsers.findIndex((user) => user.id === id);
  if (index === -1) return null;

  const updatedUser = {
    ...adminUsers[index],
    ...data,
  };

  adminUsers[index] = updatedUser;
  return updatedUser;
}

// Delete admin user
export async function deleteAdminUser(id: string): Promise<boolean> {
  await new Promise((resolve) => setTimeout(resolve, 400));

  const index = adminUsers.findIndex((user) => user.id === id);
  if (index === -1) return false;

  adminUsers.splice(index, 1);
  return true;
}

// Check if username already exists
export async function checkUsernameExists(username: string, excludeId?: string): Promise<boolean> {
  await new Promise((resolve) => setTimeout(resolve, 300));

  return adminUsers.some((user) => user.username === username && user.id !== excludeId);
}

// Check if email already exists
export async function checkEmailExists(email: string, excludeId?: string): Promise<boolean> {
  await new Promise((resolve) => setTimeout(resolve, 300));

  return adminUsers.some((user) => user.email === email && user.id !== excludeId);
}

// Change admin status
export async function changeAdminStatus(
  id: string,
  status: "Active" | "Inactive" | "Suspended"
): Promise<AdminUser | null> {
  await new Promise((resolve) => setTimeout(resolve, 400));

  const index = adminUsers.findIndex((user) => user.id === id);
  if (index === -1) return null;

  adminUsers[index].status = status;
  return adminUsers[index];
}

// Update last login
export async function updateLastLogin(id: string): Promise<AdminUser | null> {
  await new Promise((resolve) => setTimeout(resolve, 300));

  const index = adminUsers.findIndex((user) => user.id === id);
  if (index === -1) return null;

  adminUsers[index].lastLogin = new Date().toISOString();
  return adminUsers[index];
}

// Helper function to merge permissions from multiple roles
function mergePermissions(roles: AdminRole[]) {
  const merged = {
    canManageUsers: false,
    canManageTests: false,
    canManagePackages: false,
    canViewOrders: false,
    canEditOrders: false,
    canViewReports: false,
    canEditReports: false,
    canManageFinance: false,
    canViewCustomers: false,
    canEditCustomers: false,
    canManageTenants: false,
  };

  roles.forEach((role) => {
    const rolePerms = ROLE_PERMS[role];
    Object.keys(merged).forEach((key) => {
      if (rolePerms[key as keyof typeof rolePerms]) {
        merged[key as keyof typeof merged] = true;
      }
    });
  });

  return merged;
}

// Get admin users statistics
export async function getAdminUsersStats() {
  await new Promise((resolve) => setTimeout(resolve, 300));

  const total = adminUsers.length;
  const active = adminUsers.filter((u) => u.status === "Active").length;
  const inactive = adminUsers.filter((u) => u.status === "Inactive").length;
  const suspended = adminUsers.filter((u) => u.status === "Suspended").length;

  const roleCount = {} as Record<AdminRole, number>;
  adminUsers.forEach((user) => {
    user.roles.forEach((role) => {
      roleCount[role] = (roleCount[role] || 0) + 1;
    });
  });

  return { total, active, inactive, suspended, roleCount };
}
