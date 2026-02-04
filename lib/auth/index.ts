// Auth module exports

export { ROLES, ROLE_LABELS, ROLE_DESCRIPTIONS, isEmployeeRole, isManagementRole, isDoctorRole } from "./roles";
export type { Role } from "./roles";

export {
  ROLE_PERMISSIONS,
  ROLE_SIDEBAR_ACCESS,
  EMPLOYEE_SIDEBAR_ACCESS,
  hasRoutePermission,
  canAccessSidebarItem,
  canAccessEmployeeSidebarItem,
  filterSidebarItems,
  filterEmployeeSidebarItems,
} from "./permissions";

export { useAuth, MOCK_USERS } from "./useAuth";
export type { User, AuthState, UseAuthReturn } from "./useAuth";
