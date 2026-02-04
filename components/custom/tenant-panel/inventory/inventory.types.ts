/**
 * Inventory Management Types
 * 
 * This file contains all TypeScript interfaces and types for inventory management.
 * Includes items, stock, categories, branches and related entities.
 */

// ============ INVENTORY ITEM STATUS TYPES ============

export type ItemStatus = "Active" | "Inactive" | "Discontinued" | "On Order";
export type StockStatus = "In Stock" | "Low Stock" | "Out of Stock" | "On Order";
export type UnitType = "Pieces" | "Pack" | "Box" | "Carton" | "Bottle" | "Tube" | "Vial" | "Kit" | "Meter" | "Gram" | "Liter";

// ============ BRANCH ============

export interface Branch {
  id: string;
  name: string;
  code: string;
  address?: string;
  city?: string;
  pincode?: string;
  phone?: string;
  email?: string;
  isActive: boolean;
  isMainBranch: boolean;
  createdAt: string;
  updatedAt: string;
}

// ============ INVENTORY CATEGORY ============

export interface InventoryCategory {
  id: string;
  name: string;
  description?: string;
  code: string;
  color?: string; // Optional color for UI display
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// ============ INVENTORY ITEM ============

export interface InventoryItem {
  id: string;
  itemCode: string;
  itemName: string;
  description?: string;
  categoryId: string;
  categoryName: string;
  unitType: UnitType;
  status: ItemStatus;
  
  // Branch Information
  branchId: string;
  branchName: string;
  
  // Supplier Information
  supplierId?: string;
  supplierName?: string;
  supplierCode?: string;
  supplierPhone?: string;
  
  // Stock Information
  quantityInHand: number;
  reorderPoint: number;
  reorderQuantity: number;
  minQuantity: number;
  maxQuantity: number;
  
  // Pricing (cost only, no selling price)
  costPrice: number;
  currency: string;
  
  // Dates
  createdAt: string;
  updatedAt: string;
  lastStockUpdateAt?: string;
  
  // Location within branch
  storageLocation?: string;
  
  // Additional Info
  expiryDate?: string;
  batchNumber?: string;
  notes?: string;
}

// ============ STOCK MOVEMENT / TRANSACTION ============

export type TransactionType = "Purchase" | "Usage" | "Adjustment" | "Return" | "Damaged" | "Expiry" | "Donation";
export type TransactionStatus = "Completed" | "Pending" | "Cancelled";

export interface StockTransaction {
  id: string;
  itemId: string;
  itemCode: string;
  itemName: string;
  transactionType: TransactionType;
  quantity: number;
  quantityBefore: number;
  quantityAfter: number;
  status: TransactionStatus;
  
  // Reference
  referenceNumber?: string;
  orderId?: string;
  purchaseOrderId?: string;
  
  // User Information
  performedBy: string;
  performedByUserId: string;
  approvedBy?: string;
  approvedByUserId?: string;
  
  // Notes
  notes?: string;
  reason?: string;
  
  // Timestamps
  createdAt: string;
  updatedAt: string;
  transactionDate: string;
}

// ============ REORDER REQUEST ============

export type ReorderStatus = "Open" | "Confirmed" | "Received" | "Cancelled" | "Partial";

export interface ReorderRequest {
  id: string;
  itemId: string;
  itemCode: string;
  itemName: string;
  supplierId?: string;
  supplierName?: string;
  requestedQuantity: number;
  approxCost: number;
  status: ReorderStatus;
  
  // Dates
  requestedDate: string;
  expectedDeliveryDate?: string;
  actualDeliveryDate?: string;
  
  // User Information
  requestedBy: string;
  requestedByUserId: string;
  approvedBy?: string;
  approvedByUserId?: string;
  
  // Notes
  notes?: string;
  purchaseOrderNumber?: string;
  
  createdAt: string;
  updatedAt: string;
}

// ============ LOW STOCK ALERT ============

export interface LowStockAlert {
  id: string;
  itemId: string;
  itemCode: string;
  itemName: string;
  currentQuantity: number;
  reorderPoint: number;
  alertLevel: "Warning" | "Critical";
  status: "Active" | "Resolved" | "Ignored";
  
  resolvedAt?: string;
  resolvedBy?: string;
  
  createdAt: string;
  updatedAt: string;
}

// ============ INVENTORY STATISTICS ============

export interface InventoryStats {
  totalItems: number;
  activeItems: number;
  inactiveItems: number;
  discontinuedItems: number;
  
  totalValue: number;
  valueLocked: number;
  
  inStockItems: number;
  lowStockItems: number;
  outOfStockItems: number;
  
  criticalAlerts: number;
  warningAlerts: number;
  
  lastStockUpdate: string;
  lastReorderDate?: string;
  
  categoriesCount: number;
  suppliersCount: number;
}

// ============ FORM DATA TYPES ============

export interface InventoryItemFormData {
  itemName: string;
  itemCode: string;
  description?: string;
  categoryId: string;
  branchId: string;
  unitType: UnitType;
  status: ItemStatus;
  
  supplierId?: string;
  supplierName?: string;
  
  quantityInHand: number;
  reorderPoint: number;
  
  costPrice: number;
  
  storageLocation?: string;
  notes?: string;
}

export interface CategoryFormData {
  name: string;
  code: string;
  description?: string;
  isActive: boolean;
}

export interface StockAdjustmentFormData {
  itemId: string;
  branchId: string;
  adjustmentType: Exclude<TransactionType, "Purchase" | "Usage">;
  quantity: number;
  notes?: string;
  reason?: string;
}

// ============ FILTER TYPES ============

export interface InventoryFilters {
  branchId?: string;
  categoryId?: string;
  status?: ItemStatus;
  stockStatus?: StockStatus;
  searchQuery?: string;
  supplierId?: string;
  dateFrom?: string;
  dateTo?: string;
}

// ============ SUPPLIER TYPE ============

export interface Supplier {
  id: string;
  name: string;
  code: string;
  phone: string;
  email?: string;
  address?: string;
  city?: string;
  pincode?: string;
  contactPerson?: string;
  paymentTerms?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// ============ INVENTORY REPORT TYPES ============

export interface InventoryValuationReport {
  date: string;
  items: Array<{
    itemCode: string;
    itemName: string;
    quantity: number;
    costPrice: number;
    totalValue: number;
  }>;
  totalValue: number;
}

export interface StockMovementReport {
  period: string;
  transactions: StockTransaction[];
  totalInbound: number;
  totalOutbound: number;
  netMovement: number;
}

export interface LowStockReport {
  generatedAt: string;
  items: Array<{
    itemCode: string;
    itemName: string;
    currentStock: number;
    reorderPoint: number;
    shortage: number;
    estimatedCost: number;
  }>;
  totalCriticalItems: number;
  totalWarningItems: number;
}
