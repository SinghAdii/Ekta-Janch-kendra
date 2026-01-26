// Upload Reports Types

import type { PatientDetails } from "../orders/orders.types";

// Report Status
export type ReportStatus = "Pending" | "Uploaded" | "Verified" | "Delivered";

// Test Report Item
export interface TestReportItem {
  id: string;
  testId: string;
  testName: string;
  testCode: string;
  sampleType: string;
  reportStatus: ReportStatus;
  reportUrl?: string;
  uploadedAt?: string;
  uploadedBy?: string;
  verifiedAt?: string;
  verifiedBy?: string;
  remarks?: string;
}

// Package Report Item
export interface PackageReportItem {
  id: string;
  packageId: string;
  packageName: string;
  testsIncluded: TestReportItem[];
  overallStatus: ReportStatus;
}

// Report Ready Order
export interface ReportReadyOrder {
  id: string;
  orderNumber: string;
  orderDate: string;
  patient: PatientDetails;
  tests: TestReportItem[];
  packages: PackageReportItem[];
  totalAmount: number;
  sampleCollectedAt?: string;
  processingStartedAt?: string;
  reportReadyAt?: string;
  priority: "Normal" | "Urgent" | "Critical";
  notes?: string;
}

// Upload Report Form Data
export interface UploadReportFormData {
  orderId: string;
  testId: string;
  reportFile: File | null;
  remarks?: string;
}

// Report Upload Response
export interface ReportUploadResponse {
  success: boolean;
  message: string;
  reportUrl?: string;
  uploadedAt?: string;
}

// Filter Options
export interface ReportFilterOptions {
  searchQuery: string;
  priorityFilter: string;
  dateRange: {
    from: string | null;
    to: string | null;
  };
}

// Stats for Dashboard
export interface ReportUploadStats {
  totalReportReady: number;
  pendingUploads: number;
  uploadedToday: number;
  urgentOrders: number;
  averageUploadTime: string;
}
