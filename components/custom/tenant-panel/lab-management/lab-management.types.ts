import { z } from "zod";

// ============ EMPLOYEE & ROLE TYPES ============

export type EmployeeRole = "collector" | "lab-technician" | "receptionist" | "admin" | "manager";

export interface LabEmployee {
  id: string;
  employeeId: string;
  name: string;
  mobile: string;
  email: string;
  role: EmployeeRole;
  isAvailable: boolean;
  currentAssignments: number;
  totalCollections?: number;
  rating?: number;
  avatar?: string;
  branchId?: string;
  branchName?: string;
}

// ============ TEST & PACKAGE TYPES ============

export interface LabTest {
  id: string;
  name: string;
  code: string;
  price: number;
  description?: string;
  category: string;
  sampleType: string;
  reportTime: string;
}

export interface LabPackage {
  id: string;
  name: string;
  price: number;
  description?: string;
  testsIncluded: string[];
  testCount: number;
  category: string;
  reportTime: string;
  discount?: number;
}

// ============ TIME SLOT TYPES ============

export interface TimeSlot {
  id: string;
  time: string;
  display: string;
  available: boolean;
  capacity: number;
  booked: number;
}

// ============ COLLECTION STATUS ============

export type CollectionStatus = "Scheduled" | "En Route" | "Collected" | "Cancelled";
export type OrderStatus = "Pending" | "Sample Collected" | "In Progress" | "Report Ready" | "Completed" | "Cancelled";
export type PaymentStatus = "Pending" | "Paid" | "Partial" | "Refunded";
export type PaymentMode = "Cash" | "UPI" | "Card" | "NetBanking" | "Cheque";
export type Gender = "Male" | "Female" | "Other";

// ============ ZOD SCHEMAS FOR FORMS ============

// Patient Details Schema
export const patientDetailsSchema = z.object({
  fullName: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name cannot exceed 100 characters")
    .regex(/^[a-zA-Z\s]+$/, "Name can only contain letters and spaces"),
  mobile: z
    .string()
    .regex(/^[6-9]\d{9}$/, "Please enter a valid 10-digit mobile number"),
  email: z
    .string()
    .email("Please enter a valid email address")
    .optional()
    .or(z.literal("")),
  age: z
    .number({ error: "Please enter a valid age" })
    .min(1, "Age must be at least 1")
    .max(120, "Age cannot exceed 120"),
  gender: z.enum(["Male", "Female", "Other"], {
    error: "Please select gender",
  }),
  address: z
    .string()
    .max(200, "Address cannot exceed 200 characters")
    .optional()
    .or(z.literal("")),
});

// Test Selection Schema
export const testSelectionSchema = z.object({
  selectedTests: z.array(z.string()).optional(),
  selectedPackages: z.array(z.string()).optional(),
}).refine(
  (data) =>
    (data.selectedTests && data.selectedTests.length > 0) ||
    (data.selectedPackages && data.selectedPackages.length > 0),
  {
    message: "Please select at least one test or package",
    path: ["selectedTests"],
  }
);

// Home Collection Schema
export const homeCollectionSchema = z.object({
  branchId: z
    .string()
    .min(1, "Please select a branch"),
  address: z
    .string()
    .min(10, "Please enter complete address (at least 10 characters)")
    .max(200, "Address cannot exceed 200 characters"),
  landmark: z
    .string()
    .max(100, "Landmark cannot exceed 100 characters")
    .optional()
    .or(z.literal("")),
  city: z
    .string()
    .min(2, "City is required")
    .max(50, "City cannot exceed 50 characters"),
  pincode: z
    .string()
    .regex(/^\d{6}$/, "Please enter a valid 6-digit pincode"),
  preferredDate: z
    .string()
    .min(1, "Please select preferred date"),
  preferredTime: z
    .string()
    .min(1, "Please select preferred time slot"),
});

// Walk-in Registration Schema
export const walkInSchema = z.object({
  branchId: z
    .string()
    .min(1, "Please select a branch"),
  referringDoctor: z
    .string()
    .max(100, "Doctor name cannot exceed 100 characters")
    .optional()
    .or(z.literal("")),
  paymentMode: z.enum(["Cash", "UPI", "Card", "NetBanking", "Cheque"], {
    message: "Please select payment mode",
  }),
  notes: z
    .string()
    .max(500, "Notes cannot exceed 500 characters")
    .optional()
    .or(z.literal("")),
});

// Full Schedule Pickup Form Schema
export const schedulePickupFormSchema = patientDetailsSchema.merge(
  z.object({
    selectedTests: z.array(z.string()).optional(),
    selectedPackages: z.array(z.string()).optional(),
  })
).merge(homeCollectionSchema);

// Full Walk-in Registration Form Schema
export const walkInRegistrationFormSchema = patientDetailsSchema.merge(
  z.object({
    selectedTests: z.array(z.string()).optional(),
    selectedPackages: z.array(z.string()).optional(),
  })
).merge(walkInSchema);

// Lab Processing - QR/ID Input Schema
export const labProcessingInputSchema = z.object({
  searchInput: z
    .string()
    .min(1, "Please enter order ID or scan QR code"),
});

// Infer types from schemas
export type PatientDetailsForm = z.infer<typeof patientDetailsSchema>;
export type TestSelectionForm = z.infer<typeof testSelectionSchema>;
export type HomeCollectionForm = z.infer<typeof homeCollectionSchema>;
export type WalkInForm = z.infer<typeof walkInSchema>;
export type SchedulePickupForm = z.infer<typeof schedulePickupFormSchema>;
export type WalkInRegistrationForm = z.infer<typeof walkInRegistrationFormSchema>;
export type LabProcessingInput = z.infer<typeof labProcessingInputSchema>;

// ============ LAB PROCESSING TYPES ============

export interface LabProcessingItem {
  id: string;
  orderId: string;
  orderNumber: string;
  patientName: string;
  patientMobile: string;
  sampleId: string;
  tests: {
    id: string;
    name: string;
    code: string;
    status: "Pending" | "In Progress" | "Completed";
  }[];
  status: OrderStatus;
  priority: "Normal" | "Urgent" | "Emergency";
  receivedAt: string;
  startedAt?: string;
  completedAt?: string;
  technicianId?: string;
  technicianName?: string;
  branchId: string;
  branchName: string;
  source?: "Walk-in" | "Home Collection" | "Online Test Booking" | "Online Package Booking" | "Slot Booking";
}

// ============ SLOT BOOKING TYPES ============

export interface SlotBooking {
  id: string;
  patientName: string;
  patientMobile: string;
  slotDate: string;
  slotTime: string;
  branchId: string;
  branchName: string;
  tests: string[];
  packages: string[];
  status: "Booked" | "Confirmed" | "Completed" | "Cancelled" | "No Show";
  createdAt: string;
  tokenNumber?: string;
}

// ============ SLOT WORKFLOW DATA TYPES ============

// Data passed from SlotBookingManagement to CollectionManagement
export interface SlotToCollectionData {
  slotBooking: SlotBooking;
  collectionType: "home" | "walk-in" | "lab";
  orderId?: string;
  orderNumber?: string;
  sampleId?: string;
}

// Data passed from SlotBookingManagement to LabProcessing
export interface SlotToProcessingData {
  orderId: string;
  orderNumber: string;
  sampleId: string;
  patient: {
    name: string;
    mobile: string;
  };
  tests: {
    id: string;
    name: string;
    code: string;
  }[];
  branchId: string;
  branchName: string;
  priority?: "Normal" | "Urgent" | "Emergency";
}

// Processed slot booking record
export interface ProcessedSlotBooking {
  id: string;
  orderId: string;
  orderNumber: string;
  sampleId: string;
  processedAt: string;
  processedBy?: string;
  status: OrderStatus;
}
