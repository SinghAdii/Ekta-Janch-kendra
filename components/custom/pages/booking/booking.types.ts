import { z } from "zod";

// Booking Method Types
export type BookingMethod =
  | "home-collection"
  | "lab-visit"
  | "slot-booking";

// Available Test (for selection)
export interface AvailableTest {
  id: string;
  name: string;
  code: string;
  price: number;
  description?: string;
  category: string;
  sampleType: string;
  reportTime: string;
}

// Available Package (for selection)
export interface AvailablePackage {
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

// Available Time Slot
export interface TimeSlot {
  id: string;
  time: string;
  available: boolean;
}

// ============ ZOD SCHEMAS ============

// Step 1: Booking Method Selection Schema
export const bookingMethodSchema = z.object({
  method: z.enum(["home-collection", "lab-visit", "slot-booking"], {
    message: "Please select a booking method",
  }),
});

// Step 2: Patient Details Schema
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
    .number()
    .min(1, "Age must be at least 1")
    .max(120, "Age cannot exceed 120"),
  gender: z.enum(["Male", "Female", "Other"], {
    message: "Please select gender",
  }),
  alternateContact: z
    .string()
    .regex(/^[6-9]\d{9}$/, "Please enter a valid 10-digit mobile number")
    .optional()
    .or(z.literal("")),
  doctorReferralCode: z
    .string()
    .max(20, "Referral code cannot exceed 20 characters")
    .optional()
    .or(z.literal("")),
});

// Step 3: Test/Package Selection Schema
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

// Step 4a: Home Collection Address Schema
export const homeCollectionSchema = z.object({
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
    .min(2, "Please enter city name")
    .max(50, "City name cannot exceed 50 characters"),
  pincode: z
    .string()
    .regex(/^\d{6}$/, "Please enter a valid 6-digit pincode"),
  preferredDate: z
    .string()
    .min(1, "Please select a preferred date"),
  preferredTime: z.enum(
    ["06:00 AM - 08:00 AM", "08:00 AM - 10:00 AM", "10:00 AM - 12:00 PM", "04:00 PM - 06:00 PM"],
    { message: "Please select a time slot" }
  ),
  instructions: z
    .string()
    .max(500, "Instructions cannot exceed 500 characters")
    .optional()
    .or(z.literal("")),
});

// Step 4b: Lab Visit / Slot Booking Schema
export const labVisitSchema = z.object({
  preferredDate: z
    .string()
    .min(1, "Please select a date"),
  preferredTime: z
    .string()
    .min(1, "Please select a time slot"),
  labLocation: z
    .string()
    .min(1, "Please select a lab location")
    .optional(),
});

// Step 5: Payment Schema
export const paymentSchema = z.object({
  paymentMode: z.enum(["Cash", "UPI", "Card", "NetBanking", "Pay Later"], {
    message: "Please select a payment method",
  }),
  couponCode: z
    .string()
    .max(20, "Coupon code cannot exceed 20 characters")
    .optional()
    .or(z.literal("")),
  agreeTerms: z
    .boolean()
    .refine((val) => val === true, {
      message: "You must agree to the terms and conditions",
    }),
});

// OTP Verification Schema
export const otpSchema = z.object({
  otp: z
    .string()
    .length(6, "OTP must be 6 digits")
    .regex(/^\d{6}$/, "OTP must contain only numbers"),
});

// Combined Form Data Type
export type BookingMethodData = z.infer<typeof bookingMethodSchema>;
export type PatientDetailsData = z.infer<typeof patientDetailsSchema>;
export type TestSelectionData = z.infer<typeof testSelectionSchema>;
export type HomeCollectionData = z.infer<typeof homeCollectionSchema>;
export type LabVisitData = z.infer<typeof labVisitSchema>;
export type PaymentData = z.infer<typeof paymentSchema>;
export type OTPData = z.infer<typeof otpSchema>;

// Complete Booking Data
export interface CompleteBookingData {
  method: BookingMethod;
  patient: PatientDetailsData;
  tests: string[];
  packages: string[];
  homeCollection?: HomeCollectionData;
  labVisit?: LabVisitData;
  payment: PaymentData;
}

// Booking Status
export type BookingStatus = 
  | "pending"
  | "confirmed"
  | "otp-verification"
  | "completed"
  | "failed";

// Booking Response
export interface BookingResponse {
  success: boolean;
  bookingId?: string;
  message: string;
  orderNumber?: string;
}
