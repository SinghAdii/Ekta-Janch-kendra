/**
 * Inventory Management Module Exports
 * 
 * Central export file for all inventory management components.
 */

// Types
export * from "./inventory.types";

// Data and API functions (mock data layer)
export * from "./inventory.data";

// API Service Layer (for backend integration)
export * from "./inventory.api";

// Reusable Components
export * from "./inventory.components";

// Page Components
export { default as InventoryDashboardPage } from "./InventoryDashboardPage";
export { default as AllItemsPage } from "./AllItemsPage";
export { default as AddItemPage } from "./AddItemPage";
export { default as StockManagementPage } from "./StockManagementPage";
export { default as CategoryManagementPage } from "./CategoryManagementPage";
export { default as BranchManagementPage } from "../branch-management/BranchManagementPage";
