// Permission mapping - defines which roles can access which route prefixes

import { Role, ROLES } from "./roles";

// Route prefix patterns that each role can access
// Admin has access to everything in tenant-panel
export const ROLE_PERMISSIONS: Record<Role, string[]> = {
  [ROLES.ADMIN]: [
    "/tenant-panel", // Full access
  ],
  [ROLES.LAB]: [
    "/tenant-panel", // Dashboard only (exact)
    "/tenant-panel/orders",
    "/tenant-panel/lab-management",
    "/tenant-panel/manage-tests",
    "/tenant-panel/manage-packages",
    "/tenant-panel/manage-doctors",
  ],
  [ROLES.INVENTORY]: [
    "/tenant-panel", // Dashboard only (exact)
    "/tenant-panel/inventory",
    "/tenant-panel/branches",
  ],
  [ROLES.FINANCE]: [
    "/tenant-panel", // Dashboard only (exact)
    "/tenant-panel/financial",
    "/tenant-panel/orders", // Can view orders for financial tracking
  ],
  [ROLES.HR]: [
    "/tenant-panel", // Dashboard only (exact)
    "/tenant-panel/employee-management",
    "/tenant-panel/users",
  ],
  // Employee roles - access employee portal only
  [ROLES.EMPLOYEE]: [
    "/employee-portal",
    "/employee-portal/attendance",
    "/employee-portal/salary",
  ],
  [ROLES.HOME_COLLECTOR]: [
    "/employee-portal",
    "/employee-portal/attendance",
    "/employee-portal/salary",
    "/employee-portal/collections", // Only home collectors can access this
  ],
  // Doctor role - access doctor portal only
  [ROLES.DOCTOR]: [
    "/doctor-portal",
    "/doctor-portal/profile",
    "/doctor-portal/settings",
  ],
};

// Sidebar item keys/labels that each role can see (tenant-panel)
export const ROLE_SIDEBAR_ACCESS: Record<Role, string[]> = {
  [ROLES.ADMIN]: [
    "Dashboard",
    "Orders Management",
    "Lab Management",
    "Financial Management",
    "Inventory Management",
    "Catalog Management",
    "Doctor Collaboration",
    "Employee Management",
    "Branch Management",
    "Coupon Management",
    "Settings",
  ],
  [ROLES.LAB]: [
    "Dashboard",
    "Orders Management",
    "Lab Management",
    "Catalog Management",
    "Doctor Collaboration",
  ],
  [ROLES.INVENTORY]: [
    "Dashboard",
    "Inventory Management",
    "Branch Management",
  ],
  [ROLES.FINANCE]: [
    "Dashboard",
    "Orders Management",
    "Financial Management",
  ],
  [ROLES.HR]: [
    "Dashboard",
    "Employee Management",
  ],
  // Employee roles don't have tenant-panel sidebar access
  [ROLES.EMPLOYEE]: [],
  [ROLES.HOME_COLLECTOR]: [],
  // Doctor role uses doctor portal, not tenant panel
  [ROLES.DOCTOR]: [],
};

// Employee portal sidebar items
export const EMPLOYEE_SIDEBAR_ACCESS: Record<Role, string[]> = {
  [ROLES.ADMIN]: [], // Admin uses tenant-panel
  [ROLES.LAB]: [],
  [ROLES.INVENTORY]: [],
  [ROLES.FINANCE]: [],
  [ROLES.HR]: [],
  [ROLES.EMPLOYEE]: [
    "Dashboard",
    "My Attendance",
    "My Salary",
  ],
  [ROLES.HOME_COLLECTOR]: [
    "Dashboard",
    "My Attendance",
    "My Salary",
    "My Collections",
  ],
  // Doctor role uses doctor portal
  [ROLES.DOCTOR]: [],
};

/**
 * Check if a role has permission to access a specific route
 */
export function hasRoutePermission(role: Role, pathname: string): boolean {
  const permissions = ROLE_PERMISSIONS[role];
  
  // Admin has full access to tenant-panel
  if (role === ROLES.ADMIN && pathname.startsWith("/tenant-panel")) {
    return true;
  }
  
  // For non-admin roles, check if the pathname starts with any allowed prefix
  // Special case: exact match for dashboard pages
  if (pathname === "/tenant-panel" || pathname === "/employee-portal") {
    return permissions.includes(pathname);
  }
  
  // Check if route matches any allowed prefix
  return permissions.some((prefix) => {
    if (prefix === "/tenant-panel" || prefix === "/employee-portal") {
      // Dashboard should only match exactly, not as a prefix for other routes
      return pathname === prefix;
    }
    return pathname.startsWith(prefix);
  });
}

/**
 * Check if a role can see a specific sidebar item (tenant-panel)
 */
export function canAccessSidebarItem(role: Role, itemLabel: string): boolean {
  const allowedItems = ROLE_SIDEBAR_ACCESS[role];
  return allowedItems.includes(itemLabel);
}

/**
 * Check if a role can see a specific employee portal sidebar item
 */
export function canAccessEmployeeSidebarItem(role: Role, itemLabel: string): boolean {
  const allowedItems = EMPLOYEE_SIDEBAR_ACCESS[role];
  return allowedItems.includes(itemLabel);
}

/**
 * Filter sidebar items based on role (tenant-panel)
 */
export function filterSidebarItems<T extends { label: string }>(
  items: T[],
  role: Role
): T[] {
  return items.filter((item) => canAccessSidebarItem(role, item.label));
}

/**
 * Filter employee portal sidebar items based on role
 */
export function filterEmployeeSidebarItems<T extends { label: string }>(
  items: T[],
  role: Role
): T[] {
  return items.filter((item) => canAccessEmployeeSidebarItem(role, item.label));
}
