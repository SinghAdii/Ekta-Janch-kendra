/**
 * Inventory API Service
 * 
 * This file provides the interface layer between the UI and backend.
 * Currently using mock data functions, but can be easily replaced with actual API calls.
 * 
 * Usage: Replace the mock function calls with actual axios/fetch calls to your backend.
 */

import type {
  InventoryItem,
  InventoryCategory,
  StockTransaction,
  ReorderRequest,
  LowStockAlert,
  InventoryStats,
  Supplier,
  InventoryFilters,
  TransactionType,
} from "./inventory.types";

// Import mock data functions (to be replaced with actual API calls)
import {
  fetchInventoryItems as mockFetchItems,
  fetchInventoryItem as mockFetchItem,
  createInventoryItem as mockCreateItem,
  updateInventoryItem as mockUpdateItem,
  deleteInventoryItem as mockDeleteItem,
  fetchCategories as mockFetchCategories,
  createCategory as mockCreateCategory,
  updateCategory as mockUpdateCategory,
  deleteCategory as mockDeleteCategory,
  fetchSuppliers as mockFetchSuppliers,
  fetchStockTransactions as mockFetchTransactions,
  createStockTransaction as mockCreateTransaction,
  fetchLowStockAlerts as mockFetchAlerts,
  fetchReorderRequests as mockFetchReorders,
  fetchInventoryStats as mockFetchStats,
  updateStockQuantity as mockUpdateStock,
  createReorderRequest as mockCreateReorder,
  dismissStockAlert as mockDismissAlert,
} from "./inventory.data";

// ============================================================
// API CONFIGURATION
// ============================================================

// TODO: Update these when connecting to backend
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "/api";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const INVENTORY_ENDPOINT = `${API_BASE_URL}/inventory`;

// Set to true when backend is ready
const USE_MOCK_DATA = true;

// ============================================================
// TYPE DEFINITIONS FOR API RESPONSES
// ============================================================

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

// ============================================================
// INVENTORY ITEMS API
// ============================================================

/**
 * Fetch all inventory items with optional filters
 */
export async function getInventoryItems(filters?: InventoryFilters): Promise<InventoryItem[]> {
  if (USE_MOCK_DATA) {
    return mockFetchItems(filters);
  }
  
  // TODO: Replace with actual API call
  // const response = await axios.get(`${INVENTORY_ENDPOINT}/items`, { params: filters });
  // return response.data;
  return mockFetchItems(filters);
}

/**
 * Fetch a single inventory item by ID
 */
export async function getInventoryItem(id: string): Promise<InventoryItem | null> {
  if (USE_MOCK_DATA) {
    return mockFetchItem(id);
  }
  
  // TODO: Replace with actual API call
  // const response = await axios.get(`${INVENTORY_ENDPOINT}/items/${id}`);
  // return response.data;
  return mockFetchItem(id);
}

/**
 * Create a new inventory item
 */
export async function createInventoryItem(data: Partial<InventoryItem>): Promise<InventoryItem> {
  if (USE_MOCK_DATA) {
    return mockCreateItem(data);
  }
  
  // TODO: Replace with actual API call
  // const response = await axios.post(`${INVENTORY_ENDPOINT}/items`, data);
  // return response.data;
  return mockCreateItem(data);
}

/**
 * Update an existing inventory item
 */
export async function updateInventoryItem(id: string, data: Partial<InventoryItem>): Promise<InventoryItem | null> {
  if (USE_MOCK_DATA) {
    return mockUpdateItem(id, data);
  }
  
  // TODO: Replace with actual API call
  // const response = await axios.put(`${INVENTORY_ENDPOINT}/items/${id}`, data);
  // return response.data;
  return mockUpdateItem(id, data);
}

/**
 * Delete an inventory item
 */
export async function deleteInventoryItem(id: string): Promise<boolean> {
  if (USE_MOCK_DATA) {
    return mockDeleteItem(id);
  }
  
  // TODO: Replace with actual API call
  // await axios.delete(`${INVENTORY_ENDPOINT}/items/${id}`);
  // return true;
  return mockDeleteItem(id);
}

// ============================================================
// CATEGORIES API
// ============================================================

/**
 * Fetch all categories
 */
export async function getCategories(): Promise<InventoryCategory[]> {
  if (USE_MOCK_DATA) {
    return mockFetchCategories();
  }
  
  // TODO: Replace with actual API call
  return mockFetchCategories();
}

/**
 * Create a new category
 */
export async function createCategory(data: Partial<InventoryCategory>): Promise<InventoryCategory> {
  if (USE_MOCK_DATA) {
    return mockCreateCategory(data);
  }
  
  // TODO: Replace with actual API call
  return mockCreateCategory(data);
}

/**
 * Update a category
 */
export async function updateCategory(id: string, data: Partial<InventoryCategory>): Promise<InventoryCategory | null> {
  if (USE_MOCK_DATA) {
    return mockUpdateCategory(id, data);
  }
  
  // TODO: Replace with actual API call
  return mockUpdateCategory(id, data);
}

/**
 * Delete a category
 */
export async function deleteCategory(id: string): Promise<boolean> {
  if (USE_MOCK_DATA) {
    return mockDeleteCategory(id);
  }
  
  // TODO: Replace with actual API call
  return mockDeleteCategory(id);
}

// ============================================================
// SUPPLIERS API
// ============================================================

/**
 * Fetch all suppliers
 */
export async function getSuppliers(): Promise<Supplier[]> {
  if (USE_MOCK_DATA) {
    return mockFetchSuppliers();
  }
  
  // TODO: Replace with actual API call
  return mockFetchSuppliers();
}

// ============================================================
// STOCK TRANSACTIONS API
// ============================================================

/**
 * Fetch stock transactions
 */
export async function getStockTransactions(itemId?: string): Promise<StockTransaction[]> {
  if (USE_MOCK_DATA) {
    return mockFetchTransactions(itemId);
  }
  
  // TODO: Replace with actual API call
  return mockFetchTransactions(itemId);
}

/**
 * Create a stock transaction
 */
export async function createStockTransaction(data: Partial<StockTransaction>): Promise<StockTransaction> {
  if (USE_MOCK_DATA) {
    return mockCreateTransaction(data);
  }
  
  // TODO: Replace with actual API call
  return mockCreateTransaction(data);
}

/**
 * Update stock quantity with transaction record
 */
export async function updateStockQuantity(
  itemId: string,
  newQuantity: number,
  transactionType: TransactionType,
  notes?: string
): Promise<{ item: InventoryItem; transaction: StockTransaction } | null> {
  if (USE_MOCK_DATA) {
    return mockUpdateStock(itemId, newQuantity, transactionType, notes);
  }
  
  // TODO: Replace with actual API call
  return mockUpdateStock(itemId, newQuantity, transactionType, notes);
}

// ============================================================
// ALERTS & REORDERS API
// ============================================================

/**
 * Fetch low stock alerts
 */
export async function getLowStockAlerts(): Promise<LowStockAlert[]> {
  if (USE_MOCK_DATA) {
    return mockFetchAlerts();
  }
  
  // TODO: Replace with actual API call
  return mockFetchAlerts();
}

/**
 * Dismiss a stock alert
 */
export async function dismissStockAlert(alertId: string): Promise<boolean> {
  if (USE_MOCK_DATA) {
    return mockDismissAlert(alertId);
  }
  
  // TODO: Replace with actual API call
  return mockDismissAlert(alertId);
}

/**
 * Fetch reorder requests
 */
export async function getReorderRequests(): Promise<ReorderRequest[]> {
  if (USE_MOCK_DATA) {
    return mockFetchReorders();
  }
  
  // TODO: Replace with actual API call
  return mockFetchReorders();
}

/**
 * Create a reorder request
 */
export async function createReorderRequest(data: {
  itemId: string;
  itemCode: string;
  itemName: string;
  supplierId?: string;
  supplierName?: string;
  quantity: number;
  unitPrice: number;
  notes?: string;
}): Promise<ReorderRequest> {
  if (USE_MOCK_DATA) {
    return mockCreateReorder(data);
  }
  
  // TODO: Replace with actual API call
  return mockCreateReorder(data);
}

// ============================================================
// STATS & DASHBOARD API
// ============================================================

/**
 * Fetch inventory statistics
 */
export async function getInventoryStats(): Promise<InventoryStats> {
  if (USE_MOCK_DATA) {
    return mockFetchStats();
  }
  
  // TODO: Replace with actual API call
  return mockFetchStats();
}

// ============================================================
// BULK OPERATIONS API
// ============================================================

/**
 * Bulk update items (for future use)
 */
export async function bulkUpdateItems(ids: string[], data: Partial<InventoryItem>): Promise<boolean> {
  if (USE_MOCK_DATA) {
    // Mock implementation
    for (const id of ids) {
      await mockUpdateItem(id, data);
    }
    return true;
  }
  
  // TODO: Replace with actual API call
  // await axios.patch(`${INVENTORY_ENDPOINT}/items/bulk`, { ids, data });
  return true;
}

/**
 * Bulk delete items (for future use)
 */
export async function bulkDeleteItems(ids: string[]): Promise<boolean> {
  if (USE_MOCK_DATA) {
    // Mock implementation
    for (const id of ids) {
      await mockDeleteItem(id);
    }
    return true;
  }
  
  // TODO: Replace with actual API call
  // await axios.delete(`${INVENTORY_ENDPOINT}/items/bulk`, { data: { ids } });
  return true;
}

// ============================================================
// EXPORT/IMPORT API
// ============================================================

/**
 * Export inventory to CSV (for future use)
 */
export async function exportInventoryToCsv(): Promise<Blob> {
  if (USE_MOCK_DATA) {
    const items = await mockFetchItems();
    const headers = ["Item Code", "Item Name", "Branch", "Category", "Quantity", "Cost Price", "Status"];
    const rows = items.map(item => [
      item.itemCode,
      item.itemName,
      item.branchName,
      item.categoryName,
      item.quantityInHand.toString(),
      item.costPrice.toString(),
      item.status
    ].join(","));
    const csv = [headers.join(","), ...rows].join("\n");
    return new Blob([csv], { type: "text/csv" });
  }
  
  // TODO: Replace with actual API call
  // const response = await axios.get(`${INVENTORY_ENDPOINT}/export`, { responseType: 'blob' });
  // return response.data;
  return new Blob([""], { type: "text/csv" });
}

/**
 * Import inventory from CSV (for future use)
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function importInventoryFromCsv(file: File): Promise<{ success: number; failed: number }> {
  if (USE_MOCK_DATA) {
    // Mock implementation - in reality, parse the CSV and create items
    return { success: 0, failed: 0 };
  }
  
  // TODO: Replace with actual API call
  // const formData = new FormData();
  // formData.append('file', file);
  // const response = await axios.post(`${INVENTORY_ENDPOINT}/import`, formData);
  // return response.data;
  return { success: 0, failed: 0 };
}
