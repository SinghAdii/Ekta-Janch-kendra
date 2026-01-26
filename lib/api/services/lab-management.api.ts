/**
 * Lab Management API Service
 * 
 * This file contains all API calls related to lab management.
 * Currently uses mock data, will be connected to Python backend later.
 */

import apiClient from "../axios";
import type { 
  LabEmployee, 
  LabTest, 
  LabPackage, 
  SlotBooking, 
  LabProcessingItem,
} from "@/components/custom/tenant-panel/lab-management/lab-management.types";

// Import mock data for development
import {
  labEmployees,
  labTests,
  labPackages,
  slotBookings,
  labProcessingQueue,
  getEmployeesByRole,
  findSlotBookingById,
  findSlotBookingByOrderNumber,
  findSlotBookingByScanInput,
  updateSlotBookingStatus as mockUpdateSlotBookingStatus,
} from "@/components/custom/tenant-panel/lab-management/lab-management.data";

// Flag to use mock data (set to false when backend is ready)
const USE_MOCK_DATA = true;

// Simulated delay for mock data
const MOCK_DELAY = 200;

const simulateDelay = <T>(data: T): Promise<T> => {
  return new Promise((resolve) => setTimeout(() => resolve(data), MOCK_DELAY));
};

// ==================== EMPLOYEES ====================

/**
 * Fetch all lab employees
 */
export async function fetchEmployees(): Promise<LabEmployee[]> {
  if (USE_MOCK_DATA) {
    return simulateDelay([...labEmployees]);
  }

  const response = await apiClient.get<LabEmployee[]>("/lab/employees");
  return response.data;
}

/**
 * Fetch employees by role
 */
export async function fetchEmployeesByRole(role: LabEmployee["role"]): Promise<LabEmployee[]> {
  if (USE_MOCK_DATA) {
    return simulateDelay(getEmployeesByRole(role));
  }

  const response = await apiClient.get<LabEmployee[]>("/lab/employees", { params: { role } });
  return response.data;
}

/**
 * Create new employee
 */
export async function createEmployee(data: Partial<LabEmployee>): Promise<LabEmployee> {
  if (USE_MOCK_DATA) {
    const newEmployee: LabEmployee = {
      id: `EMP-${Date.now()}`,
      ...data,
    } as LabEmployee;
    labEmployees.push(newEmployee);
    return simulateDelay(newEmployee);
  }

  const response = await apiClient.post<LabEmployee>("/lab/employees", data);
  return response.data;
}

/**
 * Update employee
 */
export async function updateEmployee(employeeId: string, updates: Partial<LabEmployee>): Promise<LabEmployee | null> {
  if (USE_MOCK_DATA) {
    const index = labEmployees.findIndex((e) => e.id === employeeId);
    if (index !== -1) {
      labEmployees[index] = { ...labEmployees[index], ...updates };
      return simulateDelay(labEmployees[index]);
    }
    return simulateDelay(null);
  }

  const response = await apiClient.patch<LabEmployee>(`/lab/employees/${employeeId}`, updates);
  return response.data;
}

// ==================== TESTS ====================

/**
 * Fetch all lab tests
 */
export async function fetchTests(): Promise<LabTest[]> {
  if (USE_MOCK_DATA) {
    return simulateDelay([...labTests]);
  }

  const response = await apiClient.get<LabTest[]>("/lab/tests");
  return response.data;
}

/**
 * Fetch test by ID
 */
export async function fetchTestById(testId: string): Promise<LabTest | null> {
  if (USE_MOCK_DATA) {
    const test = labTests.find((t) => t.id === testId) || null;
    return simulateDelay(test);
  }

  const response = await apiClient.get<LabTest>(`/lab/tests/${testId}`);
  return response.data;
}

/**
 * Create new test
 */
export async function createTest(data: Partial<LabTest>): Promise<LabTest> {
  if (USE_MOCK_DATA) {
    const newTest: LabTest = {
      id: `TEST-${Date.now()}`,
      ...data,
    } as LabTest;
    labTests.push(newTest);
    return simulateDelay(newTest);
  }

  const response = await apiClient.post<LabTest>("/lab/tests", data);
  return response.data;
}

/**
 * Update test
 */
export async function updateTest(testId: string, updates: Partial<LabTest>): Promise<LabTest | null> {
  if (USE_MOCK_DATA) {
    const index = labTests.findIndex((t) => t.id === testId);
    if (index !== -1) {
      labTests[index] = { ...labTests[index], ...updates };
      return simulateDelay(labTests[index]);
    }
    return simulateDelay(null);
  }

  const response = await apiClient.patch<LabTest>(`/lab/tests/${testId}`, updates);
  return response.data;
}

// ==================== PACKAGES ====================

/**
 * Fetch all lab packages
 */
export async function fetchPackages(): Promise<LabPackage[]> {
  if (USE_MOCK_DATA) {
    return simulateDelay([...labPackages]);
  }

  const response = await apiClient.get<LabPackage[]>("/lab/packages");
  return response.data;
}

/**
 * Fetch package by ID
 */
export async function fetchPackageById(packageId: string): Promise<LabPackage | null> {
  if (USE_MOCK_DATA) {
    const pkg = labPackages.find((p) => p.id === packageId) || null;
    return simulateDelay(pkg);
  }

  const response = await apiClient.get<LabPackage>(`/lab/packages/${packageId}`);
  return response.data;
}

/**
 * Create new package
 */
export async function createPackage(data: Partial<LabPackage>): Promise<LabPackage> {
  if (USE_MOCK_DATA) {
    const newPackage: LabPackage = {
      id: `PKG-${Date.now()}`,
      ...data,
    } as LabPackage;
    labPackages.push(newPackage);
    return simulateDelay(newPackage);
  }

  const response = await apiClient.post<LabPackage>("/lab/packages", data);
  return response.data;
}

// ==================== SLOT BOOKINGS ====================

/**
 * Fetch all slot bookings
 */
export async function fetchSlotBookings(): Promise<SlotBooking[]> {
  if (USE_MOCK_DATA) {
    return simulateDelay([...slotBookings]);
  }

  const response = await apiClient.get<SlotBooking[]>("/lab/slot-bookings");
  return response.data;
}

/**
 * Fetch slot booking by ID
 */
export async function fetchSlotBookingById(bookingId: string): Promise<SlotBooking | null> {
  if (USE_MOCK_DATA) {
    const result = findSlotBookingById(bookingId);
    return simulateDelay(result ?? null);
  }

  const response = await apiClient.get<SlotBooking>(`/lab/slot-bookings/${bookingId}`);
  return response.data;
}

/**
 * Fetch slot booking by order number
 */
export async function fetchSlotBookingByOrderNumber(orderNumber: string): Promise<SlotBooking | null> {
  if (USE_MOCK_DATA) {
    const result = findSlotBookingByOrderNumber(orderNumber);
    return simulateDelay(result ?? null);
  }

  const response = await apiClient.get<SlotBooking>(`/lab/slot-bookings/order/${orderNumber}`);
  return response.data;
}

/**
 * Fetch slot booking by scan input (QR code or barcode)
 */
export async function fetchSlotBookingByScanInput(scanInput: string): Promise<SlotBooking | null> {
  if (USE_MOCK_DATA) {
    const result = findSlotBookingByScanInput(scanInput);
    return simulateDelay(result ?? null);
  }

  const response = await apiClient.get<SlotBooking>(`/lab/slot-bookings/scan/${scanInput}`);
  return response.data;
}

/**
 * Update slot booking status
 */
export async function updateSlotBookingStatus(
  bookingId: string,
  status: SlotBooking["status"]
): Promise<SlotBooking | null> {
  if (USE_MOCK_DATA) {
    const result = mockUpdateSlotBookingStatus(bookingId, status);
    return simulateDelay(result);
  }

  const response = await apiClient.patch<SlotBooking>(`/lab/slot-bookings/${bookingId}/status`, { status });
  return response.data;
}

/**
 * Complete slot booking (mark as arrived and complete details)
 */
export async function completeSlotBooking(
  bookingId: string,
  completionData: {
    patientName: string;
    patientAge: number;
    patientGender: string;
    mobile: string;
    email?: string;
    tests: string[];
    packages: string[];
    paymentMethod?: string;
    paymentStatus?: string;
    totalAmount?: number;
  }
): Promise<SlotBooking | null> {
  if (USE_MOCK_DATA) {
    const booking = findSlotBookingById(bookingId);
    if (booking) {
      const updated: SlotBooking = {
        ...booking,
        patientName: completionData.patientName,
        tests: completionData.tests,
        packages: completionData.packages,
        status: "Confirmed",
      };
      
      const index = slotBookings.findIndex((s) => s.id === bookingId);
      if (index !== -1) {
        slotBookings[index] = updated;
      }
      
      return simulateDelay(updated);
    }
    return simulateDelay(null);
  }

  const response = await apiClient.patch<SlotBooking>(`/lab/slot-bookings/${bookingId}/complete`, completionData);
  return response.data;
}

/**
 * Create new slot booking
 */
export async function createSlotBooking(data: Partial<SlotBooking>): Promise<SlotBooking> {
  if (USE_MOCK_DATA) {
    const newBooking: SlotBooking = {
      id: `SB-${Date.now()}`,
      orderNumber: `SLT${Date.now().toString().slice(-6)}`,
      bookingDate: new Date().toISOString().split("T")[0],
      status: "Confirmed",
      createdAt: new Date().toISOString(),
      ...data,
    } as SlotBooking;
    
    slotBookings.unshift(newBooking);
    return simulateDelay(newBooking);
  }

  const response = await apiClient.post<SlotBooking>("/lab/slot-bookings", data);
  return response.data;
}

// ==================== LAB PROCESSING ====================

/**
 * Fetch lab processing queue
 */
export async function fetchProcessingQueue(): Promise<LabProcessingItem[]> {
  if (USE_MOCK_DATA) {
    return simulateDelay([...labProcessingQueue]);
  }

  const response = await apiClient.get<LabProcessingItem[]>("/lab/processing-queue");
  return response.data;
}

/**
 * Update processing item status
 */
export async function updateProcessingStatus(
  itemId: string,
  status: LabProcessingItem["status"]
): Promise<LabProcessingItem | null> {
  if (USE_MOCK_DATA) {
    const index = labProcessingQueue.findIndex((item) => item.id === itemId);
    if (index !== -1) {
      labProcessingQueue[index] = { ...labProcessingQueue[index], status };
      return simulateDelay(labProcessingQueue[index]);
    }
    return simulateDelay(null);
  }

  const response = await apiClient.patch<LabProcessingItem>(`/lab/processing-queue/${itemId}/status`, { status });
  return response.data;
}

/**
 * Start processing for multiple items
 */
export async function startBatchProcessing(itemIds: string[]): Promise<LabProcessingItem[]> {
  if (USE_MOCK_DATA) {
    const updated: LabProcessingItem[] = [];
    itemIds.forEach((id) => {
      const index = labProcessingQueue.findIndex((item) => item.id === id);
      if (index !== -1) {
        labProcessingQueue[index] = { ...labProcessingQueue[index], status: "In Progress" };
        updated.push(labProcessingQueue[index]);
      }
    });
    return simulateDelay(updated);
  }

  const response = await apiClient.post<LabProcessingItem[]>("/lab/processing-queue/batch-start", { itemIds });
  return response.data;
}
