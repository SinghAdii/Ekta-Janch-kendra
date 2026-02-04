/**
 * Inventory Mock Data
 * 
 * Sample data for inventory management pages.
 * This will be replaced with actual API calls when backend is integrated.
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
  Branch,
} from "./inventory.types";

// ============ BRANCHES ============

export const branches: Branch[] = [
  {
    id: "branch-001",
    name: "Main Laboratory",
    code: "MAIN",
    address: "123, Medical Complex, Civil Lines",
    city: "Jaipur",
    pincode: "302001",
    phone: "0141-2345678",
    email: "main@ektalab.com",
    isActive: true,
    isMainBranch: true,
    createdAt: "2025-01-01T00:00:00Z",
    updatedAt: "2025-01-01T00:00:00Z",
  },
  {
    id: "branch-002",
    name: "City Center Branch",
    code: "CCB",
    address: "45, Shopping Plaza, MI Road",
    city: "Jaipur",
    pincode: "302015",
    phone: "0141-3456789",
    email: "citycenter@ektalab.com",
    isActive: true,
    isMainBranch: false,
    createdAt: "2025-01-15T00:00:00Z",
    updatedAt: "2025-01-15T00:00:00Z",
  },
  {
    id: "branch-003",
    name: "Malviya Nagar Branch",
    code: "MNB",
    address: "78, Sector 5, Malviya Nagar",
    city: "Jaipur",
    pincode: "302017",
    phone: "0141-4567890",
    email: "malviyanagar@ektalab.com",
    isActive: true,
    isMainBranch: false,
    createdAt: "2025-02-01T00:00:00Z",
    updatedAt: "2025-02-01T00:00:00Z",
  },
  {
    id: "branch-004",
    name: "Vaishali Nagar Branch",
    code: "VNB",
    address: "22, Main Market, Vaishali Nagar",
    city: "Jaipur",
    pincode: "302021",
    phone: "0141-5678901",
    email: "vaishali@ektalab.com",
    isActive: true,
    isMainBranch: false,
    createdAt: "2025-03-01T00:00:00Z",
    updatedAt: "2025-03-01T00:00:00Z",
  },
];

// ============ CATEGORIES ============

export const inventoryCategories: InventoryCategory[] = [
  {
    id: "cat-001",
    name: "Lab Reagents",
    description: "Chemical reagents used in laboratory tests",
    code: "LAB-REG",
    color: "#3b82f6",
    isActive: true,
    createdAt: "2025-01-01T00:00:00Z",
    updatedAt: "2025-01-01T00:00:00Z",
  },
  {
    id: "cat-002",
    name: "Sample Collection",
    description: "Equipment and supplies for sample collection",
    code: "SAM-COL",
    color: "#22c55e",
    isActive: true,
    createdAt: "2025-01-01T00:00:00Z",
    updatedAt: "2025-01-01T00:00:00Z",
  },
  {
    id: "cat-003",
    name: "Medical Consumables",
    description: "Disposable medical supplies",
    code: "MED-CON",
    color: "#f59e0b",
    isActive: true,
    createdAt: "2025-01-01T00:00:00Z",
    updatedAt: "2025-01-01T00:00:00Z",
  },
  {
    id: "cat-004",
    name: "Lab Equipment Parts",
    description: "Spare parts and accessories for lab equipment",
    code: "LAB-EQP",
    color: "#8b5cf6",
    isActive: true,
    createdAt: "2025-01-01T00:00:00Z",
    updatedAt: "2025-01-01T00:00:00Z",
  },
  {
    id: "cat-005",
    name: "Testing Kits",
    description: "Ready-to-use diagnostic test kits",
    code: "TST-KIT",
    color: "#ec4899",
    isActive: true,
    createdAt: "2025-01-01T00:00:00Z",
    updatedAt: "2025-01-01T00:00:00Z",
  },
  {
    id: "cat-006",
    name: "Safety Equipment",
    description: "PPE and safety supplies",
    code: "SAF-EQP",
    color: "#ef4444",
    isActive: true,
    createdAt: "2025-01-01T00:00:00Z",
    updatedAt: "2025-01-01T00:00:00Z",
  },
  {
    id: "cat-007",
    name: "Office Supplies",
    description: "General office and stationery items",
    code: "OFF-SUP",
    color: "#6b7280",
    isActive: false,
    createdAt: "2025-01-01T00:00:00Z",
    updatedAt: "2025-01-01T00:00:00Z",
  },
];

// ============ SUPPLIERS ============

export const suppliers: Supplier[] = [
  {
    id: "sup-001",
    name: "BioMed Supplies Pvt Ltd",
    code: "BMS",
    phone: "011-45678901",
    email: "orders@biomedsupplies.com",
    address: "123, Industrial Area Phase 2",
    city: "Delhi",
    pincode: "110020",
    contactPerson: "Mr. Rajesh Sharma",
    paymentTerms: "Net 30",
    isActive: true,
    createdAt: "2025-01-01T00:00:00Z",
    updatedAt: "2025-01-01T00:00:00Z",
  },
  {
    id: "sup-002",
    name: "DiagChem India",
    code: "DCI",
    phone: "0120-4567890",
    email: "sales@diagchemindia.in",
    address: "Plot 45, Sector 18",
    city: "Noida",
    pincode: "201301",
    contactPerson: "Ms. Priya Verma",
    paymentTerms: "Net 15",
    isActive: true,
    createdAt: "2025-01-01T00:00:00Z",
    updatedAt: "2025-01-01T00:00:00Z",
  },
  {
    id: "sup-003",
    name: "MedEquip Solutions",
    code: "MES",
    phone: "022-56789012",
    email: "info@medequipsol.com",
    address: "Unit 12, MIDC Andheri",
    city: "Mumbai",
    pincode: "400093",
    contactPerson: "Mr. Vikram Patel",
    paymentTerms: "Net 45",
    isActive: true,
    createdAt: "2025-01-01T00:00:00Z",
    updatedAt: "2025-01-01T00:00:00Z",
  },
  {
    id: "sup-004",
    name: "HealthCare Essentials",
    code: "HCE",
    phone: "040-67890123",
    email: "supply@hcessentials.in",
    address: "Banjara Hills Road No. 12",
    city: "Hyderabad",
    pincode: "500034",
    contactPerson: "Dr. Sunita Reddy",
    paymentTerms: "Net 30",
    isActive: true,
    createdAt: "2025-01-01T00:00:00Z",
    updatedAt: "2025-01-01T00:00:00Z",
  },
];

// ============ INVENTORY ITEMS ============

export const inventoryItems: InventoryItem[] = [
  // Lab Reagents
  {
    id: "inv-001",
    itemCode: "REG-CBC-001",
    itemName: "CBC Reagent Kit",
    description: "Complete blood count reagent kit for hematology analyzer",
    categoryId: "cat-001",
    categoryName: "Lab Reagents",
    unitType: "Kit",
    status: "Active",
    branchId: "branch-001",
    branchName: "Main Laboratory",
    supplierId: "sup-001",
    supplierName: "BioMed Supplies Pvt Ltd",
    supplierCode: "BMS",
    supplierPhone: "011-45678901",
    quantityInHand: 45,
    reorderPoint: 20,
    reorderQuantity: 50,
    minQuantity: 10,
    maxQuantity: 100,
    costPrice: 3500,
    currency: "INR",
    storageLocation: "Cold Storage Room",
    expiryDate: "2026-06-30",
    batchNumber: "BAT-2025-001",
    createdAt: "2025-06-01T00:00:00Z",
    updatedAt: "2026-02-01T00:00:00Z",
    lastStockUpdateAt: "2026-02-01T00:00:00Z",
  },
  {
    id: "inv-002",
    itemCode: "REG-LFT-001",
    itemName: "Liver Function Test Reagent",
    description: "Multi-parameter reagent for liver function testing",
    categoryId: "cat-001",
    categoryName: "Lab Reagents",
    unitType: "Bottle",
    status: "Active",
    branchId: "branch-001",
    branchName: "Main Laboratory",
    supplierId: "sup-002",
    supplierName: "DiagChem India",
    supplierCode: "DCI",
    supplierPhone: "0120-4567890",
    quantityInHand: 12,
    reorderPoint: 15,
    reorderQuantity: 30,
    minQuantity: 5,
    maxQuantity: 50,
    costPrice: 2800,
    currency: "INR",
    storageLocation: "Cold Storage Room",
    expiryDate: "2026-08-15",
    batchNumber: "BAT-2025-045",
    createdAt: "2025-06-15T00:00:00Z",
    updatedAt: "2026-01-28T00:00:00Z",
    lastStockUpdateAt: "2026-01-28T00:00:00Z",
  },
  {
    id: "inv-003",
    itemCode: "REG-KFT-001",
    itemName: "Kidney Function Test Reagent",
    description: "Reagent for creatinine and urea testing",
    categoryId: "cat-001",
    categoryName: "Lab Reagents",
    unitType: "Bottle",
    status: "Active",
    branchId: "branch-002",
    branchName: "City Center Branch",
    supplierId: "sup-002",
    supplierName: "DiagChem India",
    supplierCode: "DCI",
    supplierPhone: "0120-4567890",
    quantityInHand: 25,
    reorderPoint: 15,
    reorderQuantity: 40,
    minQuantity: 5,
    maxQuantity: 60,
    costPrice: 2200,
    currency: "INR",
    storageLocation: "Cold Storage Room",
    expiryDate: "2026-09-30",
    batchNumber: "BAT-2025-078",
    createdAt: "2025-07-01T00:00:00Z",
    updatedAt: "2026-02-02T00:00:00Z",
    lastStockUpdateAt: "2026-02-02T00:00:00Z",
  },
  // Sample Collection
  {
    id: "inv-004",
    itemCode: "SAM-EDTA-001",
    itemName: "EDTA Vacutainer Tubes",
    description: "Purple top vacuum blood collection tubes for CBC",
    categoryId: "cat-002",
    categoryName: "Sample Collection",
    unitType: "Box",
    status: "Active",
    branchId: "branch-001",
    branchName: "Main Laboratory",
    supplierId: "sup-001",
    supplierName: "BioMed Supplies Pvt Ltd",
    supplierCode: "BMS",
    supplierPhone: "011-45678901",
    quantityInHand: 85,
    reorderPoint: 50,
    reorderQuantity: 100,
    minQuantity: 20,
    maxQuantity: 200,
    costPrice: 450,
    currency: "INR",
    storageLocation: "Main Storage",
    expiryDate: "2027-12-31",
    batchNumber: "BAT-2025-102",
    notes: "100 tubes per box",
    createdAt: "2025-05-15T00:00:00Z",
    updatedAt: "2026-02-03T00:00:00Z",
    lastStockUpdateAt: "2026-02-03T00:00:00Z",
  },
  {
    id: "inv-005",
    itemCode: "SAM-SST-001",
    itemName: "Serum Separator Tubes",
    description: "Yellow/Gold top tubes for serum separation",
    categoryId: "cat-002",
    categoryName: "Sample Collection",
    unitType: "Box",
    status: "Active",
    branchId: "branch-002",
    branchName: "City Center Branch",
    supplierId: "sup-001",
    supplierName: "BioMed Supplies Pvt Ltd",
    supplierCode: "BMS",
    supplierPhone: "011-45678901",
    quantityInHand: 35,
    reorderPoint: 40,
    reorderQuantity: 80,
    minQuantity: 15,
    maxQuantity: 150,
    costPrice: 520,
    currency: "INR",
    storageLocation: "Main Storage",
    expiryDate: "2027-06-30",
    batchNumber: "BAT-2025-115",
    notes: "100 tubes per box",
    createdAt: "2025-05-20T00:00:00Z",
    updatedAt: "2026-01-15T00:00:00Z",
    lastStockUpdateAt: "2026-01-15T00:00:00Z",
  },
  {
    id: "inv-006",
    itemCode: "SAM-SYR-001",
    itemName: "Disposable Syringes 5ml",
    description: "Sterile disposable syringes with needle",
    categoryId: "cat-002",
    categoryName: "Sample Collection",
    unitType: "Box",
    status: "Active",
    branchId: "branch-003",
    branchName: "Malviya Nagar Branch",
    supplierId: "sup-004",
    supplierName: "HealthCare Essentials",
    supplierCode: "HCE",
    supplierPhone: "040-67890123",
    quantityInHand: 120,
    reorderPoint: 50,
    reorderQuantity: 100,
    minQuantity: 25,
    maxQuantity: 250,
    costPrice: 280,
    currency: "INR",
    storageLocation: "Main Storage",
    expiryDate: "2028-12-31",
    batchNumber: "BAT-2025-201",
    notes: "100 pieces per box",
    createdAt: "2025-04-01T00:00:00Z",
    updatedAt: "2026-02-01T00:00:00Z",
    lastStockUpdateAt: "2026-02-01T00:00:00Z",
  },
  // Medical Consumables
  {
    id: "inv-007",
    itemCode: "CON-GLV-001",
    itemName: "Nitrile Examination Gloves",
    description: "Powder-free nitrile gloves (Size M)",
    categoryId: "cat-003",
    categoryName: "Medical Consumables",
    unitType: "Box",
    status: "Active",
    branchId: "branch-001",
    branchName: "Main Laboratory",
    supplierId: "sup-004",
    supplierName: "HealthCare Essentials",
    supplierCode: "HCE",
    supplierPhone: "040-67890123",
    quantityInHand: 8,
    reorderPoint: 20,
    reorderQuantity: 50,
    minQuantity: 10,
    maxQuantity: 100,
    costPrice: 380,
    currency: "INR",
    storageLocation: "Main Storage",
    expiryDate: "2028-06-30",
    batchNumber: "BAT-2025-305",
    notes: "100 gloves per box",
    createdAt: "2025-03-15T00:00:00Z",
    updatedAt: "2026-02-02T00:00:00Z",
    lastStockUpdateAt: "2026-02-02T00:00:00Z",
  },
  {
    id: "inv-008",
    itemCode: "CON-MSK-001",
    itemName: "3-Ply Surgical Masks",
    description: "Disposable surgical face masks",
    categoryId: "cat-003",
    categoryName: "Medical Consumables",
    unitType: "Box",
    status: "Active",
    branchId: "branch-004",
    branchName: "Vaishali Nagar Branch",
    supplierId: "sup-004",
    supplierName: "HealthCare Essentials",
    supplierCode: "HCE",
    supplierPhone: "040-67890123",
    quantityInHand: 45,
    reorderPoint: 30,
    reorderQuantity: 60,
    minQuantity: 15,
    maxQuantity: 150,
    costPrice: 150,
    currency: "INR",
    storageLocation: "Main Storage",
    expiryDate: "2028-12-31",
    batchNumber: "BAT-2025-320",
    notes: "50 masks per box",
    createdAt: "2025-02-01T00:00:00Z",
    updatedAt: "2026-01-25T00:00:00Z",
    lastStockUpdateAt: "2026-01-25T00:00:00Z",
  },
  {
    id: "inv-009",
    itemCode: "CON-CTS-001",
    itemName: "Cotton Swabs Sterile",
    description: "Sterile cotton tipped applicators",
    categoryId: "cat-003",
    categoryName: "Medical Consumables",
    unitType: "Pack",
    status: "Active",
    branchId: "branch-001",
    branchName: "Main Laboratory",
    supplierId: "sup-001",
    supplierName: "BioMed Supplies Pvt Ltd",
    supplierCode: "BMS",
    supplierPhone: "011-45678901",
    quantityInHand: 200,
    reorderPoint: 100,
    reorderQuantity: 200,
    minQuantity: 50,
    maxQuantity: 500,
    costPrice: 85,
    currency: "INR",
    storageLocation: "Main Storage",
    expiryDate: "2029-06-30",
    batchNumber: "BAT-2025-401",
    notes: "100 swabs per pack",
    createdAt: "2025-01-15T00:00:00Z",
    updatedAt: "2026-02-01T00:00:00Z",
    lastStockUpdateAt: "2026-02-01T00:00:00Z",
  },
  // Testing Kits
  {
    id: "inv-010",
    itemCode: "KIT-COVID-001",
    itemName: "COVID-19 Rapid Antigen Test Kit",
    description: "Rapid antigen test for SARS-CoV-2 detection",
    categoryId: "cat-005",
    categoryName: "Testing Kits",
    unitType: "Kit",
    status: "Active",
    branchId: "branch-001",
    branchName: "Main Laboratory",
    supplierId: "sup-002",
    supplierName: "DiagChem India",
    supplierCode: "DCI",
    supplierPhone: "0120-4567890",
    quantityInHand: 150,
    reorderPoint: 100,
    reorderQuantity: 200,
    minQuantity: 50,
    maxQuantity: 400,
    costPrice: 120,
    currency: "INR",
    storageLocation: "Cold Storage Room",
    expiryDate: "2026-12-31",
    batchNumber: "BAT-2025-501",
    createdAt: "2025-08-01T00:00:00Z",
    updatedAt: "2026-02-03T00:00:00Z",
    lastStockUpdateAt: "2026-02-03T00:00:00Z",
  },
  {
    id: "inv-011",
    itemCode: "KIT-PREG-001",
    itemName: "Pregnancy Test Kit (HCG)",
    description: "Rapid pregnancy detection test strips",
    categoryId: "cat-005",
    categoryName: "Testing Kits",
    unitType: "Box",
    status: "Active",
    branchId: "branch-002",
    branchName: "City Center Branch",
    supplierId: "sup-002",
    supplierName: "DiagChem India",
    supplierCode: "DCI",
    supplierPhone: "0120-4567890",
    quantityInHand: 80,
    reorderPoint: 50,
    reorderQuantity: 100,
    minQuantity: 25,
    maxQuantity: 200,
    costPrice: 45,
    currency: "INR",
    storageLocation: "Main Storage",
    expiryDate: "2027-06-30",
    batchNumber: "BAT-2025-520",
    notes: "25 tests per box",
    createdAt: "2025-07-15T00:00:00Z",
    updatedAt: "2026-01-30T00:00:00Z",
    lastStockUpdateAt: "2026-01-30T00:00:00Z",
  },
  {
    id: "inv-012",
    itemCode: "KIT-URIN-001",
    itemName: "Urine Analysis Test Strips",
    description: "10-parameter urine test strips",
    categoryId: "cat-005",
    categoryName: "Testing Kits",
    unitType: "Bottle",
    status: "Active",
    branchId: "branch-003",
    branchName: "Malviya Nagar Branch",
    supplierId: "sup-001",
    supplierName: "BioMed Supplies Pvt Ltd",
    supplierCode: "BMS",
    supplierPhone: "011-45678901",
    quantityInHand: 18,
    reorderPoint: 25,
    reorderQuantity: 50,
    minQuantity: 10,
    maxQuantity: 100,
    costPrice: 650,
    currency: "INR",
    storageLocation: "Main Storage",
    expiryDate: "2026-09-30",
    batchNumber: "BAT-2025-535",
    notes: "100 strips per bottle",
    createdAt: "2025-06-20T00:00:00Z",
    updatedAt: "2026-02-01T00:00:00Z",
    lastStockUpdateAt: "2026-02-01T00:00:00Z",
  },
  // Safety Equipment
  {
    id: "inv-013",
    itemCode: "SAF-COA-001",
    itemName: "Disposable Lab Coats",
    description: "Non-woven disposable lab coats",
    categoryId: "cat-006",
    categoryName: "Safety Equipment",
    unitType: "Pack",
    status: "Active",
    branchId: "branch-001",
    branchName: "Main Laboratory",
    supplierId: "sup-004",
    supplierName: "HealthCare Essentials",
    supplierCode: "HCE",
    supplierPhone: "040-67890123",
    quantityInHand: 25,
    reorderPoint: 20,
    reorderQuantity: 40,
    minQuantity: 10,
    maxQuantity: 80,
    costPrice: 180,
    currency: "INR",
    storageLocation: "Main Storage",
    expiryDate: "2029-12-31",
    batchNumber: "BAT-2025-601",
    notes: "10 coats per pack",
    createdAt: "2025-05-01T00:00:00Z",
    updatedAt: "2026-01-20T00:00:00Z",
    lastStockUpdateAt: "2026-01-20T00:00:00Z",
  },
  {
    id: "inv-014",
    itemCode: "SAF-GOG-001",
    itemName: "Safety Goggles",
    description: "Anti-splash protective goggles",
    categoryId: "cat-006",
    categoryName: "Safety Equipment",
    unitType: "Pieces",
    status: "Active",
    branchId: "branch-004",
    branchName: "Vaishali Nagar Branch",
    supplierId: "sup-003",
    supplierName: "MedEquip Solutions",
    supplierCode: "MES",
    supplierPhone: "022-56789012",
    quantityInHand: 15,
    reorderPoint: 10,
    reorderQuantity: 20,
    minQuantity: 5,
    maxQuantity: 40,
    costPrice: 250,
    currency: "INR",
    storageLocation: "Main Storage",
    createdAt: "2025-04-15T00:00:00Z",
    updatedAt: "2026-01-10T00:00:00Z",
    lastStockUpdateAt: "2026-01-10T00:00:00Z",
  },
  // Lab Equipment Parts
  {
    id: "inv-015",
    itemCode: "EQP-FLT-001",
    itemName: "HEPA Filter for Bio Safety Cabinet",
    description: "Replacement HEPA filter for BSC",
    categoryId: "cat-004",
    categoryName: "Lab Equipment Parts",
    unitType: "Pieces",
    status: "Active",
    branchId: "branch-001",
    branchName: "Main Laboratory",
    supplierId: "sup-003",
    supplierName: "MedEquip Solutions",
    supplierCode: "MES",
    supplierPhone: "022-56789012",
    quantityInHand: 3,
    reorderPoint: 5,
    reorderQuantity: 10,
    minQuantity: 2,
    maxQuantity: 20,
    costPrice: 8500,
    currency: "INR",
    storageLocation: "Equipment Storage",
    createdAt: "2025-08-15T00:00:00Z",
    updatedAt: "2026-01-05T00:00:00Z",
    lastStockUpdateAt: "2026-01-05T00:00:00Z",
  },
  {
    id: "inv-016",
    itemCode: "EQP-CUV-001",
    itemName: "Spectrophotometer Cuvettes",
    description: "Disposable plastic cuvettes for spectrophotometer",
    categoryId: "cat-004",
    categoryName: "Lab Equipment Parts",
    unitType: "Pack",
    status: "Active",
    branchId: "branch-001",
    branchName: "Main Laboratory",
    supplierId: "sup-003",
    supplierName: "MedEquip Solutions",
    supplierCode: "MES",
    supplierPhone: "022-56789012",
    quantityInHand: 30,
    reorderPoint: 25,
    reorderQuantity: 50,
    minQuantity: 10,
    maxQuantity: 100,
    costPrice: 320,
    currency: "INR",
    storageLocation: "Main Storage",
    notes: "100 cuvettes per pack",
    createdAt: "2025-06-10T00:00:00Z",
    updatedAt: "2026-02-01T00:00:00Z",
    lastStockUpdateAt: "2026-02-01T00:00:00Z",
  },
  // Out of Stock Item
  {
    id: "inv-017",
    itemCode: "REG-THY-001",
    itemName: "Thyroid Profile Reagent",
    description: "T3, T4, TSH testing reagent",
    categoryId: "cat-001",
    categoryName: "Lab Reagents",
    unitType: "Kit",
    status: "Active",
    branchId: "branch-002",
    branchName: "City Center Branch",
    supplierId: "sup-002",
    supplierName: "DiagChem India",
    supplierCode: "DCI",
    supplierPhone: "0120-4567890",
    quantityInHand: 0,
    reorderPoint: 10,
    reorderQuantity: 25,
    minQuantity: 5,
    maxQuantity: 40,
    costPrice: 4200,
    currency: "INR",
    storageLocation: "Cold Storage Room",
    expiryDate: "2026-10-31",
    batchNumber: "BAT-2025-089",
    createdAt: "2025-07-20T00:00:00Z",
    updatedAt: "2026-02-01T00:00:00Z",
    lastStockUpdateAt: "2026-02-01T00:00:00Z",
  },
  // Discontinued Item
  {
    id: "inv-018",
    itemCode: "KIT-OLD-001",
    itemName: "Malaria RDT Kit (Old Version)",
    description: "Rapid diagnostic test for malaria - discontinued",
    categoryId: "cat-005",
    categoryName: "Testing Kits",
    unitType: "Kit",
    status: "Discontinued",
    branchId: "branch-001",
    branchName: "Main Laboratory",
    supplierId: "sup-002",
    supplierName: "DiagChem India",
    supplierCode: "DCI",
    supplierPhone: "0120-4567890",
    quantityInHand: 5,
    reorderPoint: 0,
    reorderQuantity: 0,
    minQuantity: 0,
    maxQuantity: 0,
    costPrice: 95,
    currency: "INR",
    storageLocation: "Main Storage",
    expiryDate: "2026-03-31",
    batchNumber: "BAT-2024-890",
    notes: "Discontinuing - use new version KIT-MAL-002",
    createdAt: "2024-06-01T00:00:00Z",
    updatedAt: "2026-01-01T00:00:00Z",
    lastStockUpdateAt: "2026-01-01T00:00:00Z",
  },
];

// ============ STOCK TRANSACTIONS ============

export const stockTransactions: StockTransaction[] = [
  {
    id: "txn-001",
    itemId: "inv-001",
    itemCode: "REG-CBC-001",
    itemName: "CBC Reagent Kit",
    transactionType: "Purchase",
    quantity: 30,
    quantityBefore: 15,
    quantityAfter: 45,
    status: "Completed",
    referenceNumber: "PO-2026-001",
    performedBy: "Admin User",
    performedByUserId: "user-001",
    notes: "Monthly stock replenishment",
    createdAt: "2026-02-01T10:30:00Z",
    updatedAt: "2026-02-01T10:30:00Z",
    transactionDate: "2026-02-01",
  },
  {
    id: "txn-002",
    itemId: "inv-004",
    itemCode: "SAM-EDTA-001",
    itemName: "EDTA Vacutainer Tubes",
    transactionType: "Usage",
    quantity: 15,
    quantityBefore: 100,
    quantityAfter: 85,
    status: "Completed",
    orderId: "ord-001",
    performedBy: "Lab Technician",
    performedByUserId: "user-002",
    notes: "Used for daily operations",
    createdAt: "2026-02-03T09:15:00Z",
    updatedAt: "2026-02-03T09:15:00Z",
    transactionDate: "2026-02-03",
  },
  {
    id: "txn-003",
    itemId: "inv-007",
    itemCode: "CON-GLV-001",
    itemName: "Nitrile Examination Gloves",
    transactionType: "Usage",
    quantity: 12,
    quantityBefore: 20,
    quantityAfter: 8,
    status: "Completed",
    performedBy: "Lab Staff",
    performedByUserId: "user-003",
    notes: "Weekly usage",
    createdAt: "2026-02-02T14:00:00Z",
    updatedAt: "2026-02-02T14:00:00Z",
    transactionDate: "2026-02-02",
  },
  {
    id: "txn-004",
    itemId: "inv-017",
    itemCode: "REG-THY-001",
    itemName: "Thyroid Profile Reagent",
    transactionType: "Usage",
    quantity: 5,
    quantityBefore: 5,
    quantityAfter: 0,
    status: "Completed",
    performedBy: "Lab Technician",
    performedByUserId: "user-002",
    notes: "Used up remaining stock",
    createdAt: "2026-02-01T16:30:00Z",
    updatedAt: "2026-02-01T16:30:00Z",
    transactionDate: "2026-02-01",
  },
  {
    id: "txn-005",
    itemId: "inv-010",
    itemCode: "KIT-COVID-001",
    itemName: "COVID-19 Rapid Antigen Test Kit",
    transactionType: "Purchase",
    quantity: 100,
    quantityBefore: 50,
    quantityAfter: 150,
    status: "Completed",
    referenceNumber: "PO-2026-003",
    performedBy: "Admin User",
    performedByUserId: "user-001",
    notes: "Bulk purchase for upcoming demand",
    createdAt: "2026-02-03T11:00:00Z",
    updatedAt: "2026-02-03T11:00:00Z",
    transactionDate: "2026-02-03",
  },
  {
    id: "txn-006",
    itemId: "inv-002",
    itemCode: "REG-LFT-001",
    itemName: "Liver Function Test Reagent",
    transactionType: "Adjustment",
    quantity: -3,
    quantityBefore: 15,
    quantityAfter: 12,
    status: "Completed",
    performedBy: "Lab Manager",
    performedByUserId: "user-004",
    reason: "Physical count adjustment",
    notes: "Discrepancy found during audit",
    createdAt: "2026-01-28T15:45:00Z",
    updatedAt: "2026-01-28T15:45:00Z",
    transactionDate: "2026-01-28",
  },
  {
    id: "txn-007",
    itemId: "inv-015",
    itemCode: "EQP-FLT-001",
    itemName: "HEPA Filter for Bio Safety Cabinet",
    transactionType: "Usage",
    quantity: 1,
    quantityBefore: 4,
    quantityAfter: 3,
    status: "Completed",
    performedBy: "Maintenance Staff",
    performedByUserId: "user-005",
    notes: "BSC filter replacement - annual maintenance",
    createdAt: "2026-01-05T12:00:00Z",
    updatedAt: "2026-01-05T12:00:00Z",
    transactionDate: "2026-01-05",
  },
  {
    id: "txn-008",
    itemId: "inv-018",
    itemCode: "KIT-OLD-001",
    itemName: "Malaria RDT Kit (Old Version)",
    transactionType: "Damaged",
    quantity: 10,
    quantityBefore: 15,
    quantityAfter: 5,
    status: "Completed",
    performedBy: "Lab Manager",
    performedByUserId: "user-004",
    reason: "Water damage",
    notes: "Kits damaged due to storage issue",
    createdAt: "2026-01-01T09:00:00Z",
    updatedAt: "2026-01-01T09:00:00Z",
    transactionDate: "2026-01-01",
  },
  {
    id: "txn-009",
    itemId: "inv-001",
    itemCode: "REG-CBC-001",
    itemName: "CBC Reagent Pack",
    transactionType: "Usage",
    quantity: 5,
    quantityBefore: 50,
    quantityAfter: 45,
    status: "Completed",
    performedBy: "Lab Technician",
    performedByUserId: "user-002",
    notes: "Daily usage for patient tests",
    createdAt: "2026-02-05T09:30:00Z",
    updatedAt: "2026-02-05T09:30:00Z",
    transactionDate: "2026-02-05",
  },
  {
    id: "txn-010",
    itemId: "inv-003",
    itemCode: "REG-KFT-001",
    itemName: "Kidney Function Test Reagent",
    transactionType: "Usage",
    quantity: 3,
    quantityBefore: 35,
    quantityAfter: 32,
    status: "Completed",
    performedBy: "Lab Staff",
    performedByUserId: "user-003",
    notes: "Morning batch tests",
    createdAt: "2026-02-05T10:15:00Z",
    updatedAt: "2026-02-05T10:15:00Z",
    transactionDate: "2026-02-05",
  },
  {
    id: "txn-011",
    itemId: "inv-006",
    itemCode: "CON-TUB-001",
    itemName: "Blood Collection Tubes (EDTA)",
    transactionType: "Purchase",
    quantity: 200,
    quantityBefore: 300,
    quantityAfter: 500,
    status: "Completed",
    referenceNumber: "PO-2026-010",
    performedBy: "Admin User",
    performedByUserId: "user-001",
    approvedBy: "Lab Manager",
    approvedByUserId: "user-004",
    notes: "Monthly stock replenishment",
    createdAt: "2026-02-05T08:00:00Z",
    updatedAt: "2026-02-05T08:00:00Z",
    transactionDate: "2026-02-05",
  },
  {
    id: "txn-012",
    itemId: "inv-012",
    itemCode: "CON-SLI-001",
    itemName: "Microscope Glass Slides",
    transactionType: "Usage",
    quantity: 50,
    quantityBefore: 500,
    quantityAfter: 450,
    status: "Completed",
    performedBy: "Lab Technician",
    performedByUserId: "user-002",
    notes: "Weekly consumption",
    createdAt: "2026-02-04T16:00:00Z",
    updatedAt: "2026-02-04T16:00:00Z",
    transactionDate: "2026-02-04",
  },
  {
    id: "txn-013",
    itemId: "inv-008",
    itemCode: "CON-SYR-001",
    itemName: "Disposable Syringes (5ml)",
    transactionType: "Return",
    quantity: 10,
    quantityBefore: 90,
    quantityAfter: 100,
    status: "Completed",
    performedBy: "Lab Staff",
    performedByUserId: "user-003",
    notes: "Returned unused from sample collection",
    createdAt: "2026-02-04T14:30:00Z",
    updatedAt: "2026-02-04T14:30:00Z",
    transactionDate: "2026-02-04",
  },
];

// ============ REORDER REQUESTS ============

export const reorderRequests: ReorderRequest[] = [
  {
    id: "reo-001",
    itemId: "inv-017",
    itemCode: "REG-THY-001",
    itemName: "Thyroid Profile Reagent",
    supplierId: "sup-002",
    supplierName: "DiagChem India",
    requestedQuantity: 25,
    approxCost: 105000,
    status: "Confirmed",
    requestedDate: "2026-02-01",
    expectedDeliveryDate: "2026-02-08",
    requestedBy: "Lab Manager",
    requestedByUserId: "user-004",
    approvedBy: "Admin",
    approvedByUserId: "user-001",
    purchaseOrderNumber: "PO-2026-005",
    createdAt: "2026-02-01T17:00:00Z",
    updatedAt: "2026-02-02T09:00:00Z",
  },
  {
    id: "reo-002",
    itemId: "inv-007",
    itemCode: "CON-GLV-001",
    itemName: "Nitrile Examination Gloves",
    supplierId: "sup-004",
    supplierName: "HealthCare Essentials",
    requestedQuantity: 50,
    approxCost: 19000,
    status: "Open",
    requestedDate: "2026-02-03",
    requestedBy: "Lab Staff",
    requestedByUserId: "user-003",
    notes: "Urgent - stock critically low",
    createdAt: "2026-02-03T10:00:00Z",
    updatedAt: "2026-02-03T10:00:00Z",
  },
  {
    id: "reo-003",
    itemId: "inv-015",
    itemCode: "EQP-FLT-001",
    itemName: "HEPA Filter for Bio Safety Cabinet",
    supplierId: "sup-003",
    supplierName: "MedEquip Solutions",
    requestedQuantity: 5,
    approxCost: 42500,
    status: "Open",
    requestedDate: "2026-02-02",
    requestedBy: "Maintenance Staff",
    requestedByUserId: "user-005",
    notes: "Below reorder point",
    createdAt: "2026-02-02T14:30:00Z",
    updatedAt: "2026-02-02T14:30:00Z",
  },
];

// ============ LOW STOCK ALERTS ============

export const lowStockAlerts: LowStockAlert[] = [
  {
    id: "alert-001",
    itemId: "inv-017",
    itemCode: "REG-THY-001",
    itemName: "Thyroid Profile Reagent",
    currentQuantity: 0,
    reorderPoint: 10,
    alertLevel: "Critical",
    status: "Active",
    createdAt: "2026-02-01T17:00:00Z",
    updatedAt: "2026-02-01T17:00:00Z",
  },
  {
    id: "alert-002",
    itemId: "inv-007",
    itemCode: "CON-GLV-001",
    itemName: "Nitrile Examination Gloves",
    currentQuantity: 8,
    reorderPoint: 20,
    alertLevel: "Critical",
    status: "Active",
    createdAt: "2026-02-02T14:30:00Z",
    updatedAt: "2026-02-02T14:30:00Z",
  },
  {
    id: "alert-003",
    itemId: "inv-002",
    itemCode: "REG-LFT-001",
    itemName: "Liver Function Test Reagent",
    currentQuantity: 12,
    reorderPoint: 15,
    alertLevel: "Warning",
    status: "Active",
    createdAt: "2026-01-28T16:00:00Z",
    updatedAt: "2026-01-28T16:00:00Z",
  },
  {
    id: "alert-004",
    itemId: "inv-015",
    itemCode: "EQP-FLT-001",
    itemName: "HEPA Filter for Bio Safety Cabinet",
    currentQuantity: 3,
    reorderPoint: 5,
    alertLevel: "Warning",
    status: "Active",
    createdAt: "2026-01-05T12:30:00Z",
    updatedAt: "2026-01-05T12:30:00Z",
  },
  {
    id: "alert-005",
    itemId: "inv-012",
    itemCode: "KIT-URIN-001",
    itemName: "Urine Analysis Test Strips",
    currentQuantity: 18,
    reorderPoint: 25,
    alertLevel: "Warning",
    status: "Active",
    createdAt: "2026-02-01T10:00:00Z",
    updatedAt: "2026-02-01T10:00:00Z",
  },
  {
    id: "alert-006",
    itemId: "inv-005",
    itemCode: "SAM-SST-001",
    itemName: "Serum Separator Tubes",
    currentQuantity: 35,
    reorderPoint: 40,
    alertLevel: "Warning",
    status: "Active",
    createdAt: "2026-01-15T11:00:00Z",
    updatedAt: "2026-01-15T11:00:00Z",
  },
];

// ============ INVENTORY STATISTICS ============

export const inventoryStats: InventoryStats = {
  totalItems: inventoryItems.length,
  activeItems: inventoryItems.filter(i => i.status === "Active").length,
  inactiveItems: inventoryItems.filter(i => i.status === "Inactive").length,
  discontinuedItems: inventoryItems.filter(i => i.status === "Discontinued").length,
  
  totalValue: inventoryItems.reduce((sum, item) => sum + (item.quantityInHand * item.costPrice), 0),
  valueLocked: inventoryItems.filter(i => i.status === "Discontinued").reduce((sum, item) => sum + (item.quantityInHand * item.costPrice), 0),
  
  inStockItems: inventoryItems.filter(i => i.quantityInHand > i.reorderPoint).length,
  lowStockItems: inventoryItems.filter(i => i.quantityInHand <= i.reorderPoint && i.quantityInHand > 0).length,
  outOfStockItems: inventoryItems.filter(i => i.quantityInHand === 0).length,
  
  criticalAlerts: lowStockAlerts.filter(a => a.alertLevel === "Critical" && a.status === "Active").length,
  warningAlerts: lowStockAlerts.filter(a => a.alertLevel === "Warning" && a.status === "Active").length,
  
  lastStockUpdate: "2026-02-03T11:00:00Z",
  lastReorderDate: "2026-02-03",
  
  categoriesCount: inventoryCategories.filter(c => c.isActive).length,
  suppliersCount: suppliers.filter(s => s.isActive).length,
};

// ============ API MOCK FUNCTIONS ============

// Simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Fetch all inventory items
export async function fetchInventoryItems(filters?: InventoryFilters): Promise<InventoryItem[]> {
  await delay(500);
  
  let items = [...inventoryItems];
  
  if (filters) {
    if (filters.categoryId) {
      items = items.filter(i => i.categoryId === filters.categoryId);
    }
    if (filters.status) {
      items = items.filter(i => i.status === filters.status);
    }
    if (filters.stockStatus) {
      if (filters.stockStatus === "Out of Stock") {
        items = items.filter(i => i.quantityInHand === 0);
      } else if (filters.stockStatus === "Low Stock") {
        items = items.filter(i => i.quantityInHand <= i.reorderPoint && i.quantityInHand > 0);
      } else if (filters.stockStatus === "In Stock") {
        items = items.filter(i => i.quantityInHand > i.reorderPoint);
      }
    }
    if (filters.searchQuery) {
      const query = filters.searchQuery.toLowerCase();
      items = items.filter(i => 
        i.itemName.toLowerCase().includes(query) ||
        i.itemCode.toLowerCase().includes(query) ||
        i.categoryName.toLowerCase().includes(query) ||
        i.branchName.toLowerCase().includes(query)
      );
    }
    if (filters.supplierId) {
      items = items.filter(i => i.supplierId === filters.supplierId);
    }
    if (filters.branchId) {
      items = items.filter(i => i.branchId === filters.branchId);
    }
  }
  
  return items;
}

// Fetch single inventory item
export async function fetchInventoryItem(id: string): Promise<InventoryItem | null> {
  await delay(300);
  return inventoryItems.find(i => i.id === id) || null;
}

// Fetch branches
export async function fetchBranches(): Promise<Branch[]> {
  await delay(300);
  return [...branches];
}

// Create new inventory item
export async function createInventoryItem(data: Partial<InventoryItem>): Promise<InventoryItem> {
  await delay(500);
  const newItem: InventoryItem = {
    id: `inv-${Date.now()}`,
    itemCode: data.itemCode || `ITEM-${Date.now()}`,
    itemName: data.itemName || "",
    description: data.description,
    categoryId: data.categoryId || "",
    categoryName: data.categoryName || "",
    branchId: data.branchId || "",
    branchName: data.branchName || "",
    unitType: data.unitType || "Pieces",
    status: data.status || "Active",
    supplierId: data.supplierId,
    supplierName: data.supplierName,
    supplierCode: data.supplierCode,
    supplierPhone: data.supplierPhone,
    quantityInHand: data.quantityInHand || 0,
    reorderPoint: data.reorderPoint || 0,
    reorderQuantity: data.reorderQuantity || 0,
    minQuantity: data.minQuantity || 0,
    maxQuantity: data.maxQuantity || 0,
    costPrice: data.costPrice || 0,
    currency: data.currency || "INR",
    storageLocation: data.storageLocation,
    expiryDate: data.expiryDate,
    batchNumber: data.batchNumber,
    notes: data.notes,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    lastStockUpdateAt: new Date().toISOString(),
  };
  inventoryItems.push(newItem);
  return newItem;
}

// Update inventory item
export async function updateInventoryItem(id: string, data: Partial<InventoryItem>): Promise<InventoryItem | null> {
  await delay(500);
  const index = inventoryItems.findIndex(i => i.id === id);
  if (index === -1) return null;
  
  inventoryItems[index] = {
    ...inventoryItems[index],
    ...data,
    updatedAt: new Date().toISOString(),
  };
  return inventoryItems[index];
}

// Delete inventory item
export async function deleteInventoryItem(id: string): Promise<boolean> {
  await delay(500);
  const index = inventoryItems.findIndex(i => i.id === id);
  if (index === -1) return false;
  inventoryItems.splice(index, 1);
  return true;
}

// Fetch categories
export async function fetchCategories(): Promise<InventoryCategory[]> {
  await delay(300);
  return [...inventoryCategories];
}

// Create category
export async function createCategory(data: Partial<InventoryCategory>): Promise<InventoryCategory> {
  await delay(500);
  const newCategory: InventoryCategory = {
    id: `cat-${Date.now()}`,
    name: data.name || "",
    description: data.description,
    code: data.code || `CAT-${Date.now()}`,
    isActive: data.isActive !== undefined ? data.isActive : true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  inventoryCategories.push(newCategory);
  return newCategory;
}

// Fetch suppliers
export async function fetchSuppliers(): Promise<Supplier[]> {
  await delay(300);
  return [...suppliers];
}

// Fetch stock transactions
export async function fetchStockTransactions(itemId?: string): Promise<StockTransaction[]> {
  await delay(400);
  if (itemId) {
    return stockTransactions.filter(t => t.itemId === itemId);
  }
  return [...stockTransactions];
}

// Create stock transaction
export async function createStockTransaction(data: Partial<StockTransaction>): Promise<StockTransaction> {
  await delay(500);
  const newTransaction: StockTransaction = {
    id: `txn-${Date.now()}`,
    itemId: data.itemId || "",
    itemCode: data.itemCode || "",
    itemName: data.itemName || "",
    transactionType: data.transactionType || "Adjustment",
    quantity: data.quantity || 0,
    quantityBefore: data.quantityBefore || 0,
    quantityAfter: data.quantityAfter || 0,
    status: data.status || "Completed",
    referenceNumber: data.referenceNumber,
    orderId: data.orderId,
    purchaseOrderId: data.purchaseOrderId,
    performedBy: data.performedBy || "System",
    performedByUserId: data.performedByUserId || "system",
    approvedBy: data.approvedBy,
    approvedByUserId: data.approvedByUserId,
    notes: data.notes,
    reason: data.reason,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    transactionDate: new Date().toISOString().split('T')[0],
  };
  stockTransactions.push(newTransaction);
  return newTransaction;
}

// Fetch low stock alerts
export async function fetchLowStockAlerts(): Promise<LowStockAlert[]> {
  await delay(300);
  return lowStockAlerts.filter(a => a.status === "Active");
}

// Fetch reorder requests
export async function fetchReorderRequests(): Promise<ReorderRequest[]> {
  await delay(400);
  return [...reorderRequests];
}

// Fetch inventory stats
export async function fetchInventoryStats(): Promise<InventoryStats> {
  await delay(300);
  return { ...inventoryStats };
}

// Update stock quantity
export async function updateStockQuantity(
  itemId: string, 
  newQuantity: number, 
  transactionType: StockTransaction["transactionType"],
  notes?: string
): Promise<{ item: InventoryItem; transaction: StockTransaction } | null> {
  await delay(500);
  
  const item = inventoryItems.find(i => i.id === itemId);
  if (!item) return null;
  
  const quantityBefore = item.quantityInHand;
  const quantityDiff = newQuantity - quantityBefore;
  
  item.quantityInHand = newQuantity;
  item.lastStockUpdateAt = new Date().toISOString();
  item.updatedAt = new Date().toISOString();
  
  const transaction = await createStockTransaction({
    itemId: item.id,
    itemCode: item.itemCode,
    itemName: item.itemName,
    transactionType,
    quantity: Math.abs(quantityDiff),
    quantityBefore,
    quantityAfter: newQuantity,
    notes,
  });
  
  return { item, transaction };
}

// Create reorder request
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
  await delay(500);
  
  const newRequest: ReorderRequest = {
    id: `reo-${Date.now()}`,
    itemId: data.itemId,
    itemCode: data.itemCode,
    itemName: data.itemName,
    supplierId: data.supplierId,
    supplierName: data.supplierName,
    requestedQuantity: data.quantity,
    approxCost: data.quantity * data.unitPrice,
    status: "Open",
    requestedDate: new Date().toISOString().split('T')[0],
    requestedBy: "Admin",
    requestedByUserId: "user-001",
    notes: data.notes,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  
  reorderRequests.push(newRequest);
  return newRequest;
}

// Dismiss stock alert
export async function dismissStockAlert(alertId: string): Promise<boolean> {
  await delay(300);
  
  const alertIndex = lowStockAlerts.findIndex(a => a.id === alertId);
  if (alertIndex === -1) return false;
  
  lowStockAlerts[alertIndex].status = "Ignored";
  lowStockAlerts[alertIndex].updatedAt = new Date().toISOString();
  return true;
}

// Update reorder request status
export async function updateReorderStatus(
  requestId: string,
  status: ReorderRequest["status"],
  additionalData?: {
    purchaseOrderNumber?: string;
    expectedDeliveryDate?: string;
    actualDeliveryDate?: string;
    approvedBy?: string;
    approvedByUserId?: string;
    notes?: string;
  }
): Promise<ReorderRequest | null> {
  await delay(400);
  
  const requestIndex = reorderRequests.findIndex(r => r.id === requestId);
  if (requestIndex === -1) return null;
  
  const request = reorderRequests[requestIndex];
  request.status = status;
  request.updatedAt = new Date().toISOString();
  
  if (additionalData) {
    if (additionalData.purchaseOrderNumber) request.purchaseOrderNumber = additionalData.purchaseOrderNumber;
    if (additionalData.expectedDeliveryDate) request.expectedDeliveryDate = additionalData.expectedDeliveryDate;
    if (additionalData.actualDeliveryDate) request.actualDeliveryDate = additionalData.actualDeliveryDate;
    if (additionalData.approvedBy) request.approvedBy = additionalData.approvedBy;
    if (additionalData.approvedByUserId) request.approvedByUserId = additionalData.approvedByUserId;
    if (additionalData.notes) request.notes = additionalData.notes;
  }
  
  // If received, update the item stock
  if (status === "Received") {
    const item = inventoryItems.find(i => i.id === request.itemId);
    if (item) {
      const quantityBefore = item.quantityInHand;
      item.quantityInHand += request.requestedQuantity;
      item.lastStockUpdateAt = new Date().toISOString();
      item.updatedAt = new Date().toISOString();
      
      // Create transaction for the received stock
      await createStockTransaction({
        itemId: item.id,
        itemCode: item.itemCode,
        itemName: item.itemName,
        transactionType: "Purchase",
        quantity: request.requestedQuantity,
        quantityBefore,
        quantityAfter: item.quantityInHand,
        notes: `Reorder received - PO: ${request.purchaseOrderNumber || request.id}`,
      });
    }
  }
  
  return request;
}

// Update reorder request quantity
export async function updateReorderQuantity(
  requestId: string,
  newQuantity: number,
  unitPrice: number
): Promise<ReorderRequest | null> {
  await delay(300);
  
  const requestIndex = reorderRequests.findIndex(r => r.id === requestId);
  if (requestIndex === -1) return null;
  
  const request = reorderRequests[requestIndex];
  request.requestedQuantity = newQuantity;
  request.approxCost = newQuantity * unitPrice;
  request.updatedAt = new Date().toISOString();
  
  return request;
}

// Delete/Cancel reorder request
export async function cancelReorderRequest(requestId: string, reason?: string): Promise<boolean> {
  await delay(300);
  
  const requestIndex = reorderRequests.findIndex(r => r.id === requestId);
  if (requestIndex === -1) return false;
  
  reorderRequests[requestIndex].status = "Cancelled";
  reorderRequests[requestIndex].notes = reason || reorderRequests[requestIndex].notes;
  reorderRequests[requestIndex].updatedAt = new Date().toISOString();
  
  return true;
}

// Update category
export async function updateCategory(id: string, data: Partial<InventoryCategory>): Promise<InventoryCategory | null> {
  await delay(400);
  
  const categoryIndex = inventoryCategories.findIndex(c => c.id === id);
  if (categoryIndex === -1) return null;
  
  inventoryCategories[categoryIndex] = {
    ...inventoryCategories[categoryIndex],
    ...data,
    updatedAt: new Date().toISOString(),
  };
  
  return inventoryCategories[categoryIndex];
}

// Delete category
export async function deleteCategory(id: string): Promise<boolean> {
  await delay(400);
  
  const categoryIndex = inventoryCategories.findIndex(c => c.id === id);
  if (categoryIndex === -1) return false;
  
  inventoryCategories.splice(categoryIndex, 1);
  return true;
}

// ============ BRANCH CRUD FUNCTIONS ============

// Create new branch
export async function createBranch(data: {
  name: string;
  code: string;
  address?: string;
  city?: string;
  pincode?: string;
  phone?: string;
  email?: string;
  isActive?: boolean;
  isMainBranch?: boolean;
}): Promise<Branch> {
  await delay(400);
  
  const newBranch: Branch = {
    id: `branch-${Date.now()}`,
    name: data.name,
    code: data.code.toUpperCase(),
    address: data.address,
    city: data.city,
    pincode: data.pincode,
    phone: data.phone,
    email: data.email,
    isActive: data.isActive ?? true,
    isMainBranch: data.isMainBranch ?? false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  
  branches.push(newBranch);
  return newBranch;
}

// Update branch
export async function updateBranch(id: string, data: Partial<Branch>): Promise<Branch | null> {
  await delay(400);
  
  const branchIndex = branches.findIndex(b => b.id === id);
  if (branchIndex === -1) return null;
  
  // If setting as main branch, unset all other main branches
  if (data.isMainBranch) {
    branches.forEach(b => {
      if (b.id !== id) b.isMainBranch = false;
    });
  }
  
  branches[branchIndex] = {
    ...branches[branchIndex],
    ...data,
    updatedAt: new Date().toISOString(),
  };
  
  return branches[branchIndex];
}

// Delete branch
export async function deleteBranch(id: string): Promise<{ success: boolean; error?: string }> {
  await delay(400);
  
  const branchIndex = branches.findIndex(b => b.id === id);
  if (branchIndex === -1) return { success: false, error: "Branch not found" };
  
  // Check if it's the main branch
  if (branches[branchIndex].isMainBranch) {
    return { success: false, error: "Cannot delete main branch" };
  }
  
  // Check if branch has items
  const branchItems = inventoryItems.filter(i => i.branchId === id);
  if (branchItems.length > 0) {
    return { success: false, error: `Cannot delete branch with ${branchItems.length} items` };
  }
  
  branches.splice(branchIndex, 1);
  return { success: true };
}

// Toggle branch status
export async function toggleBranchStatus(id: string): Promise<Branch | null> {
  await delay(300);
  
  const branch = branches.find(b => b.id === id);
  if (!branch) return null;
  
  branch.isActive = !branch.isActive;
  branch.updatedAt = new Date().toISOString();
  
  return branch;
}
