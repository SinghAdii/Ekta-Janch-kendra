"use client";

import { ReactNode } from "react";
import { useAuth, Role, canAccessSidebarItem } from "@/lib/auth";

interface RoleGuardProps {
  children: ReactNode;
  allowedRoles?: Role[];
  sidebarItem?: string;
  fallback?: ReactNode;
}

/**
 * RoleGuard component for conditional rendering based on user role
 * 
 * Usage:
 * 1. With specific roles:
 *    <RoleGuard allowedRoles={["admin", "lab"]}>
 *      <SensitiveComponent />
 *    </RoleGuard>
 * 
 * 2. With sidebar item name:
 *    <RoleGuard sidebarItem="Lab Management">
 *      <LabFeature />
 *    </RoleGuard>
 * 
 * 3. With custom fallback:
 *    <RoleGuard allowedRoles={["admin"]} fallback={<AccessDenied />}>
 *      <AdminFeature />
 *    </RoleGuard>
 */
export function RoleGuard({
  children,
  allowedRoles,
  sidebarItem,
  fallback = null,
}: RoleGuardProps) {
  const { user, isLoading } = useAuth();

  // Show nothing while loading
  if (isLoading) {
    return null;
  }

  // If not authenticated, don't show anything
  if (!user) {
    return <>{fallback}</>;
  }

  // Check role-based access
  if (allowedRoles && allowedRoles.length > 0) {
    if (!allowedRoles.includes(user.role)) {
      return <>{fallback}</>;
    }
  }

  // Check sidebar item access
  if (sidebarItem) {
    if (!canAccessSidebarItem(user.role, sidebarItem)) {
      return <>{fallback}</>;
    }
  }

  return <>{children}</>;
}

export default RoleGuard;
