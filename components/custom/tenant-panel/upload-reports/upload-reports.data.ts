// Upload Reports Mock Data & API Functions

import type {
  ReportReadyOrder,
  ReportUploadStats,
  ReportUploadResponse,
  TestReportItem,
} from "./upload-reports.types";

// Mock Report Ready Orders Data
export const mockReportReadyOrders: ReportReadyOrder[] = [
  {
    id: "rpt-001",
    orderNumber: "ORD-2026-0145",
    orderDate: "2026-01-18T10:30:00",
    patient: {
      id: "pat-001",
      name: "Rajesh Kumar",
      mobile: "9876543210",
      email: "rajesh.kumar@email.com",
      age: 45,
      gender: "Male",
      address: "123, Sector 15, Noida",
      city: "Noida",
      pincode: "201301",
    },
    tests: [
      {
        id: "test-rpt-001",
        testId: "cbc-001",
        testName: "Complete Blood Count (CBC)",
        testCode: "CBC-001",
        sampleType: "Blood",
        reportStatus: "Pending",
      },
      {
        id: "test-rpt-002",
        testId: "lft-001",
        testName: "Liver Function Test",
        testCode: "LFT-001",
        sampleType: "Blood",
        reportStatus: "Pending",
      },
    ],
    packages: [],
    totalAmount: 1299,
    sampleCollectedAt: "2026-01-18T11:00:00",
    processingStartedAt: "2026-01-18T14:00:00",
    reportReadyAt: "2026-01-19T09:00:00",
    priority: "Normal",
  },
  {
    id: "rpt-002",
    orderNumber: "ORD-2026-0146",
    orderDate: "2026-01-17T14:15:00",
    patient: {
      id: "pat-002",
      name: "Priya Sharma",
      mobile: "9876543211",
      email: "priya.sharma@email.com",
      age: 32,
      gender: "Female",
      address: "456, DLF Phase 2, Gurgaon",
      city: "Gurgaon",
      pincode: "122002",
    },
    tests: [],
    packages: [
      {
        id: "pkg-rpt-001",
        packageId: "full-body-001",
        packageName: "Full Body Checkup Essential",
        overallStatus: "Pending",
        testsIncluded: [
          {
            id: "test-rpt-003",
            testId: "cbc-002",
            testName: "Complete Blood Count",
            testCode: "CBC-002",
            sampleType: "Blood",
            reportStatus: "Uploaded",
            reportUrl: "/reports/cbc-002.pdf",
            uploadedAt: "2026-01-19T10:30:00",
            uploadedBy: "Dr. Amit",
          },
          {
            id: "test-rpt-004",
            testId: "lipid-001",
            testName: "Lipid Profile",
            testCode: "LIPID-001",
            sampleType: "Blood",
            reportStatus: "Pending",
          },
          {
            id: "test-rpt-005",
            testId: "thyroid-001",
            testName: "Thyroid Profile",
            testCode: "THY-001",
            sampleType: "Blood",
            reportStatus: "Pending",
          },
          {
            id: "test-rpt-006",
            testId: "kft-001",
            testName: "Kidney Function Test",
            testCode: "KFT-001",
            sampleType: "Blood",
            reportStatus: "Uploaded",
            reportUrl: "/reports/kft-001.pdf",
            uploadedAt: "2026-01-19T11:00:00",
            uploadedBy: "Dr. Amit",
          },
        ],
      },
    ],
    totalAmount: 2499,
    sampleCollectedAt: "2026-01-17T15:30:00",
    processingStartedAt: "2026-01-17T18:00:00",
    reportReadyAt: "2026-01-19T08:00:00",
    priority: "Urgent",
    notes: "Patient requested early reports",
  },
  {
    id: "rpt-003",
    orderNumber: "ORD-2026-0147",
    orderDate: "2026-01-19T08:00:00",
    patient: {
      id: "pat-003",
      name: "Amit Patel",
      mobile: "9876543212",
      email: "amit.patel@email.com",
      age: 58,
      gender: "Male",
      address: "789, Connaught Place",
      city: "New Delhi",
      pincode: "110001",
    },
    tests: [
      {
        id: "test-rpt-007",
        testId: "hba1c-001",
        testName: "HbA1c (Glycated Hemoglobin)",
        testCode: "HBA1C-001",
        sampleType: "Blood",
        reportStatus: "Uploaded",
        reportUrl: "/reports/hba1c-001.pdf",
        uploadedAt: "2026-01-19T14:00:00",
        uploadedBy: "Lab Tech",
      },
      {
        id: "test-rpt-008",
        testId: "fbs-001",
        testName: "Fasting Blood Sugar",
        testCode: "FBS-001",
        sampleType: "Blood",
        reportStatus: "Uploaded",
        reportUrl: "/reports/fbs-001.pdf",
        uploadedAt: "2026-01-19T14:15:00",
        uploadedBy: "Lab Tech",
      },
    ],
    packages: [],
    totalAmount: 799,
    sampleCollectedAt: "2026-01-19T08:30:00",
    processingStartedAt: "2026-01-19T10:00:00",
    reportReadyAt: "2026-01-19T14:00:00",
    priority: "Critical",
    notes: "Diabetic patient - monitoring required",
  },
  {
    id: "rpt-004",
    orderNumber: "ORD-2026-0148",
    orderDate: "2026-01-18T16:45:00",
    patient: {
      id: "pat-004",
      name: "Sneha Gupta",
      mobile: "9876543213",
      email: "sneha.gupta@email.com",
      age: 28,
      gender: "Female",
      address: "321, Vasant Kunj",
      city: "New Delhi",
      pincode: "110070",
    },
    tests: [
      {
        id: "test-rpt-009",
        testId: "vitamin-d-001",
        testName: "Vitamin D (25-OH)",
        testCode: "VITD-001",
        sampleType: "Blood",
        reportStatus: "Pending",
      },
      {
        id: "test-rpt-010",
        testId: "vitamin-b12-001",
        testName: "Vitamin B12",
        testCode: "VITB12-001",
        sampleType: "Blood",
        reportStatus: "Pending",
      },
      {
        id: "test-rpt-011",
        testId: "iron-001",
        testName: "Iron Studies",
        testCode: "IRON-001",
        sampleType: "Blood",
        reportStatus: "Pending",
      },
    ],
    packages: [],
    totalAmount: 1899,
    sampleCollectedAt: "2026-01-18T17:00:00",
    processingStartedAt: "2026-01-19T09:00:00",
    reportReadyAt: "2026-01-19T15:00:00",
    priority: "Normal",
  },
  {
    id: "rpt-005",
    orderNumber: "ORD-2026-0149",
    orderDate: "2026-01-16T11:20:00",
    patient: {
      id: "pat-005",
      name: "Vikram Singh",
      mobile: "9876543214",
      email: "vikram.singh@email.com",
      age: 52,
      gender: "Male",
      address: "567, Mayur Vihar Phase 1",
      city: "New Delhi",
      pincode: "110091",
    },
    tests: [],
    packages: [
      {
        id: "pkg-rpt-002",
        packageId: "cardiac-001",
        packageName: "Cardiac Health Package",
        overallStatus: "Pending",
        testsIncluded: [
          {
            id: "test-rpt-012",
            testId: "lipid-002",
            testName: "Lipid Profile Complete",
            testCode: "LIPID-002",
            sampleType: "Blood",
            reportStatus: "Uploaded",
            reportUrl: "/reports/lipid-002.pdf",
            uploadedAt: "2026-01-19T10:00:00",
            uploadedBy: "Dr. Verma",
          },
          {
            id: "test-rpt-013",
            testId: "ecg-001",
            testName: "ECG Report",
            testCode: "ECG-001",
            sampleType: "ECG",
            reportStatus: "Pending",
          },
          {
            id: "test-rpt-014",
            testId: "trop-001",
            testName: "Troponin T",
            testCode: "TROP-001",
            sampleType: "Blood",
            reportStatus: "Pending",
          },
          {
            id: "test-rpt-015",
            testId: "bnp-001",
            testName: "BNP (Brain Natriuretic Peptide)",
            testCode: "BNP-001",
            sampleType: "Blood",
            reportStatus: "Pending",
          },
        ],
      },
    ],
    totalAmount: 4999,
    sampleCollectedAt: "2026-01-16T12:00:00",
    processingStartedAt: "2026-01-16T15:00:00",
    reportReadyAt: "2026-01-19T09:00:00",
    priority: "Urgent",
    notes: "Pre-surgery cardiac evaluation",
  },
];

// Mock Stats
export const mockReportUploadStats: ReportUploadStats = {
  totalReportReady: 5,
  pendingUploads: 12,
  uploadedToday: 8,
  urgentOrders: 2,
  averageUploadTime: "2.5 hrs",
};

// API Functions (Mock implementations - will be replaced with actual API calls)

export async function fetchReportReadyOrders(): Promise<ReportReadyOrder[]> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500));
  return mockReportReadyOrders;
}

export async function fetchReportUploadStats(): Promise<ReportUploadStats> {
  await new Promise((resolve) => setTimeout(resolve, 300));
  return mockReportUploadStats;
}

export async function uploadTestReport(
  _orderId: string,
  testId: string,
  _file: File,
  _remarks?: string
): Promise<ReportUploadResponse> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 1000));

  // Mock successful response
  return {
    success: true,
    message: "Report uploaded successfully",
    reportUrl: `/reports/${testId}-${Date.now()}.pdf`,
    uploadedAt: new Date().toISOString(),
  };
}

export async function deleteTestReport(
  _orderId: string,
  _testId: string
): Promise<{ success: boolean; message: string }> {
  await new Promise((resolve) => setTimeout(resolve, 500));
  return {
    success: true,
    message: "Report deleted successfully",
  };
}

export async function markOrderAsCompleted(
  _orderId: string
): Promise<{ success: boolean; message: string }> {
  await new Promise((resolve) => setTimeout(resolve, 500));
  return {
    success: true,
    message: "Order marked as completed and patient notified",
  };
}

export async function sendReportToPatient(
  orderId: string,
  method: "email" | "sms" | "whatsapp"
): Promise<{ success: boolean; message: string }> {
  await new Promise((resolve) => setTimeout(resolve, 500));
  return {
    success: true,
    message: `Report link sent via ${method} successfully`,
  };
}

// Helper function to calculate pending tests count
export function getPendingTestsCount(order: ReportReadyOrder): number {
  let count = 0;

  // Count pending individual tests
  count += order.tests.filter((t) => t.reportStatus === "Pending").length;

  // Count pending tests in packages
  order.packages.forEach((pkg) => {
    count += pkg.testsIncluded.filter((t) => t.reportStatus === "Pending").length;
  });

  return count;
}

// Helper function to get all tests from an order (including package tests)
export function getAllTestsFromOrder(order: ReportReadyOrder): TestReportItem[] {
  const allTests: TestReportItem[] = [...order.tests];

  order.packages.forEach((pkg) => {
    allTests.push(...pkg.testsIncluded);
  });

  return allTests;
}

// Helper function to check if all reports are uploaded
export function areAllReportsUploaded(order: ReportReadyOrder): boolean {
  const allTests = getAllTestsFromOrder(order);
  return allTests.every((t) => t.reportStatus === "Uploaded" || t.reportStatus === "Verified");
}
