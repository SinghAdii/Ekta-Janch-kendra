// Order Source Types
export type OrderSource = 
  | "Home Collection"
  | "Online Test Booking"
  | "Online Package Booking"
  | "Slot Booking"
  | "Walk-in";

// Order Status (Removed "Confirmed" - simplified flow)
// For Home Collection: Pending -> Sample Collected -> Processing -> Report Ready -> Completed
// For Others: Pending -> Processing -> Report Ready -> Completed
export type OrderStatus = 
  | "Pending"
  | "Sample Collected"
  | "Processing"
  | "Report Ready"
  | "Completed"
  | "Cancelled";

// Payment Status
export type PaymentStatus = "Paid" | "Pending" | "Partial" | "Refunded";

// Payment Mode
export type PaymentMode = "Cash" | "UPI" | "Card" | "NetBanking" | "Insurance" | "Pay Later";

// Gender Type
export type Gender = "Male" | "Female" | "Other";

// Lab Branch
export interface LabBranch {
  id: string;
  name: string;
  code: string;
  address: string;
  city: string;
  pincode: string;
  phone: string;
  isActive: boolean;
}

// Test Item in Order
export interface OrderTestItem {
  id: string;
  testId: string;
  testName: string;
  testCode: string;
  price: number;
  discount: number;
  finalPrice: number;
  // Lab processing fields
  sampleCollected?: boolean;
  sampleCollectedAt?: string;
  sampleCollectedBy?: string;
  processingStartedAt?: string;
  processingCompletedAt?: string;
  reportReady?: boolean;
  reportUrl?: string;
}

// Package Item in Order
export interface OrderPackageItem {
  id: string;
  packageId: string;
  packageName: string;
  testsIncluded: number;
  price: number;
  discount: number;
  finalPrice: number;
}

// Patient Details
export interface PatientDetails {
  id: string;
  name: string;
  mobile: string;
  email?: string;
  age?: number;
  gender?: Gender;
  address?: string;
  city?: string;
  pincode?: string;
}

// Home Collection Details
export interface HomeCollectionDetails {
  scheduledDate: string;
  scheduledTime: string;
  address: string;
  landmark?: string;
  city: string;
  pincode: string;
  collectorId?: string;
  collectorName?: string;
  collectorMobile?: string;
  collectionStatus: "Scheduled" | "Assigned" | "En Route" | "Collected" | "Cancelled";
  assignedAt?: string;
  enRouteAt?: string;
  collectedAt?: string;
  collectionNotes?: string;
}

// Slot Booking Details
export interface SlotBookingDetails {
  slotDate: string;
  slotTime: string;
  isDetailsComplete: boolean;
}

// Main Order Interface
export interface Order {
  id: string;
  orderNumber: string;
  source: OrderSource;
  status: OrderStatus;
  
  // Branch Info
  branchId: string;
  branchName: string;
  branchCode: string;
  
  // Patient Info
  patient: PatientDetails;
  
  // Order Items (either tests or packages or both)
  tests: OrderTestItem[];
  packages: OrderPackageItem[];
  
  // Pricing
  subtotal: number;
  discount: number;
  tax: number;
  totalAmount: number;
  paidAmount: number;
  dueAmount: number;
  
  // Payment
  paymentStatus: PaymentStatus;
  paymentMode?: PaymentMode;
  
  // Source-specific details
  homeCollection?: HomeCollectionDetails;
  slotBooking?: SlotBookingDetails;
  
  // Timestamps
  createdAt: string;
  updatedAt: string;
  sampleCollectedAt?: string;
  processingStartedAt?: string;
  reportReadyAt?: string;
  completedAt?: string;
  
  // Assigned Staff
  assignedTo?: string;
  
  // Notes
  notes?: string;
  
  // Referring Doctor (if any)
  referringDoctor?: string;
  doctorCommission?: number;
  
  // Barcode/Sample ID
  sampleId?: string;
  barcodeGenerated?: boolean;
}

// Collector/Employee for Home Collection
export interface Collector {
  id: string;
  name: string;
  mobile: string;
  email?: string;
  isAvailable: boolean;
  currentAssignments: number;
  totalCollections: number;
  rating?: number;
}

// Form Data Types
export interface PatientFormData {
  name: string;
  mobile: string;
  email?: string;
  age?: number;
  gender?: Gender;
  address?: string;
  city?: string;
  pincode?: string;
}

export interface OrderFormData {
  source: OrderSource;
  branchId: string;
  patient: PatientFormData;
  tests: string[]; // Test IDs
  packages: string[]; // Package IDs
  paymentMode?: PaymentMode;
  notes?: string;
  referringDoctor?: string;
  // Home Collection specific
  homeCollectionDate?: string;
  homeCollectionTime?: string;
  homeCollectionAddress?: string;
  // Slot Booking specific
  slotDate?: string;
  slotTime?: string;
}

// Dashboard Stats
export interface OrderStats {
  totalOrders: number;
  pendingOrders: number;
  completedToday: number;
  revenueToday: number;
  homeCollectionPending: number;
  slotBookingsPending: number;
  processingOrders: number;
  cancelledOrders: number;
  sampleCollectedToday: number;
  reportReadyToday: number;
}

// Filter Options
export interface OrderFilters {
  source?: OrderSource;
  status?: OrderStatus;
  paymentStatus?: PaymentStatus;
  branchId?: string;
  dateFrom?: string;
  dateTo?: string;
  startDate?: string;
  endDate?: string;
  searchQuery?: string;
  search?: string;
}

// Collection Assignment
export interface CollectionAssignment {
  orderId: string;
  collectorId: string;
  scheduledDate: string;
  scheduledTime: string;
  priority: "Normal" | "Urgent" | "Critical";
  notes?: string;
}

// Lab Test Processing
export interface LabTestProcessing {
  orderId: string;
  testId: string;
  status: "Pending" | "In Progress" | "Completed";
  startedAt?: string;
  completedAt?: string;
  processedBy?: string;
  remarks?: string;
}

// Sample Collection Record
export interface SampleCollectionRecord {
  id: string;
  orderId: string;
  orderNumber: string;
  patient: PatientDetails;
  collectionType: "Home Collection" | "Walk-in" | "Lab Visit";
  scheduledDate?: string;
  scheduledTime?: string;
  address?: string;
  collector?: Collector;
  status: "Pending" | "Assigned" | "En Route" | "Collected" | "Cancelled";
  sampleId?: string;
  collectedAt?: string;
  notes?: string;
  tests: OrderTestItem[];
  branchId: string;
  branchName: string;
}

// Lab Processing Queue Item
export interface LabProcessingQueueItem {
  id: string;
  orderId: string;
  orderNumber: string;
  patient: PatientDetails;
  test: OrderTestItem;
  sampleId: string;
  receivedAt: string;
  status: "In Queue" | "In Progress" | "Completed" | "On Hold";
  priority: "Normal" | "Urgent" | "Critical";
  assignedTo?: string;
  startedAt?: string;
  completedAt?: string;
  remarks?: string;
  branchId: string;
  branchName: string;
}
