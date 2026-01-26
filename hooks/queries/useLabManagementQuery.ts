/**
 * Lab Management Query Hooks (React Query)
 * 
 * Custom hooks for fetching and mutating lab management data with caching.
 */

import { useQuery, useMutation, useQueryClient, UseQueryOptions } from "@tanstack/react-query";
import { useLabManagementStore } from "@/store/lab-management.store";
import * as labApi from "@/lib/api/services/lab-management.api";
import type {
  LabEmployee,
  LabTest,
  LabPackage,
  SlotBooking,
  LabProcessingItem,
} from "@/components/custom/tenant-panel/lab-management/lab-management.types";

// ==================== QUERY KEYS ====================

export const labKeys = {
  all: ["lab"] as const,
  
  // Employees
  employees: () => [...labKeys.all, "employees"] as const,
  employeesByRole: (role: string) => [...labKeys.employees(), role] as const,
  employee: (id: string) => [...labKeys.employees(), id] as const,
  
  // Tests
  tests: () => [...labKeys.all, "tests"] as const,
  test: (id: string) => [...labKeys.tests(), id] as const,
  
  // Packages
  packages: () => [...labKeys.all, "packages"] as const,
  package: (id: string) => [...labKeys.packages(), id] as const,
  
  // Slot Bookings
  slotBookings: () => [...labKeys.all, "slot-bookings"] as const,
  slotBooking: (id: string) => [...labKeys.slotBookings(), id] as const,
  slotBookingByOrder: (orderNumber: string) => [...labKeys.slotBookings(), "order", orderNumber] as const,
  slotBookingByScan: (scanInput: string) => [...labKeys.slotBookings(), "scan", scanInput] as const,
  
  // Processing Queue
  processingQueue: () => [...labKeys.all, "processing-queue"] as const,
  processingItem: (id: string) => [...labKeys.processingQueue(), id] as const,
};

// ==================== CACHE CONFIG ====================

const STALE_TIME = 5 * 60 * 1000; // 5 minutes
const CACHE_TIME = 30 * 60 * 1000; // 30 minutes

// ==================== EMPLOYEE HOOKS ====================

/**
 * Fetch all employees
 */
export function useEmployees(options?: Omit<UseQueryOptions<LabEmployee[]>, "queryKey" | "queryFn">) {
  const { setEmployees, setLoading, setError, setLastFetched } = useLabManagementStore();

  return useQuery({
    queryKey: labKeys.employees(),
    queryFn: async () => {
      setLoading(true);
      try {
        const data = await labApi.fetchEmployees();
        setEmployees(data);
        setLastFetched("employees", Date.now());
        return data;
      } catch (error) {
        setError(error instanceof Error ? error.message : "Failed to fetch employees");
        throw error;
      } finally {
        setLoading(false);
      }
    },
    staleTime: STALE_TIME,
    gcTime: CACHE_TIME,
    ...options,
  });
}

/**
 * Fetch employees by role
 */
export function useEmployeesByRole(role: LabEmployee["role"], options?: Omit<UseQueryOptions<LabEmployee[]>, "queryKey" | "queryFn">) {
  return useQuery({
    queryKey: labKeys.employeesByRole(role),
    queryFn: () => labApi.fetchEmployeesByRole(role),
    staleTime: STALE_TIME,
    gcTime: CACHE_TIME,
    ...options,
  });
}

/**
 * Create employee mutation
 */
export function useCreateEmployee() {
  const queryClient = useQueryClient();
  const { addEmployee } = useLabManagementStore();

  return useMutation({
    mutationFn: (data: Partial<LabEmployee>) => labApi.createEmployee(data),
    onSuccess: (newEmployee) => {
      addEmployee(newEmployee);
      queryClient.invalidateQueries({ queryKey: labKeys.employees() });
    },
  });
}

/**
 * Update employee mutation
 */
export function useUpdateEmployee() {
  const queryClient = useQueryClient();
  const { updateEmployee: updateStoreEmployee } = useLabManagementStore();

  return useMutation({
    mutationFn: ({ employeeId, updates }: { employeeId: string; updates: Partial<LabEmployee> }) =>
      labApi.updateEmployee(employeeId, updates),
    onMutate: async ({ employeeId, updates }) => {
      await queryClient.cancelQueries({ queryKey: labKeys.employees() });
      updateStoreEmployee(employeeId, updates);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: labKeys.employees() });
    },
  });
}

// ==================== TESTS HOOKS ====================

/**
 * Fetch all tests
 */
export function useTests(options?: Omit<UseQueryOptions<LabTest[]>, "queryKey" | "queryFn">) {
  const { setTests, setLoading, setError, setLastFetched } = useLabManagementStore();

  return useQuery({
    queryKey: labKeys.tests(),
    queryFn: async () => {
      setLoading(true);
      try {
        const data = await labApi.fetchTests();
        setTests(data);
        setLastFetched("tests", Date.now());
        return data;
      } catch (error) {
        setError(error instanceof Error ? error.message : "Failed to fetch tests");
        throw error;
      } finally {
        setLoading(false);
      }
    },
    staleTime: STALE_TIME,
    gcTime: CACHE_TIME,
    ...options,
  });
}

/**
 * Fetch single test
 */
export function useTest(testId: string, options?: Omit<UseQueryOptions<LabTest | null>, "queryKey" | "queryFn">) {
  return useQuery({
    queryKey: labKeys.test(testId),
    queryFn: () => labApi.fetchTestById(testId),
    staleTime: STALE_TIME,
    gcTime: CACHE_TIME,
    enabled: !!testId,
    ...options,
  });
}

/**
 * Create test mutation
 */
export function useCreateTest() {
  const queryClient = useQueryClient();
  const { addTest } = useLabManagementStore();

  return useMutation({
    mutationFn: (data: Partial<LabTest>) => labApi.createTest(data),
    onSuccess: (newTest) => {
      addTest(newTest);
      queryClient.invalidateQueries({ queryKey: labKeys.tests() });
    },
  });
}

/**
 * Update test mutation
 */
export function useUpdateTest() {
  const queryClient = useQueryClient();
  const { updateTest: updateStoreTest } = useLabManagementStore();

  return useMutation({
    mutationFn: ({ testId, updates }: { testId: string; updates: Partial<LabTest> }) =>
      labApi.updateTest(testId, updates),
    onMutate: async ({ testId, updates }) => {
      await queryClient.cancelQueries({ queryKey: labKeys.tests() });
      updateStoreTest(testId, updates);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: labKeys.tests() });
    },
  });
}

// ==================== PACKAGES HOOKS ====================

/**
 * Fetch all packages
 */
export function usePackages(options?: Omit<UseQueryOptions<LabPackage[]>, "queryKey" | "queryFn">) {
  const { setPackages, setLoading, setError, setLastFetched } = useLabManagementStore();

  return useQuery({
    queryKey: labKeys.packages(),
    queryFn: async () => {
      setLoading(true);
      try {
        const data = await labApi.fetchPackages();
        setPackages(data);
        setLastFetched("packages", Date.now());
        return data;
      } catch (error) {
        setError(error instanceof Error ? error.message : "Failed to fetch packages");
        throw error;
      } finally {
        setLoading(false);
      }
    },
    staleTime: STALE_TIME,
    gcTime: CACHE_TIME,
    ...options,
  });
}

/**
 * Fetch single package
 */
export function usePackage(packageId: string, options?: Omit<UseQueryOptions<LabPackage | null>, "queryKey" | "queryFn">) {
  return useQuery({
    queryKey: labKeys.package(packageId),
    queryFn: () => labApi.fetchPackageById(packageId),
    staleTime: STALE_TIME,
    gcTime: CACHE_TIME,
    enabled: !!packageId,
    ...options,
  });
}

/**
 * Create package mutation
 */
export function useCreatePackage() {
  const queryClient = useQueryClient();
  const { addPackage } = useLabManagementStore();

  return useMutation({
    mutationFn: (data: Partial<LabPackage>) => labApi.createPackage(data),
    onSuccess: (newPackage) => {
      addPackage(newPackage);
      queryClient.invalidateQueries({ queryKey: labKeys.packages() });
    },
  });
}

// ==================== SLOT BOOKINGS HOOKS ====================

/**
 * Fetch all slot bookings
 */
export function useSlotBookings(options?: Omit<UseQueryOptions<SlotBooking[]>, "queryKey" | "queryFn">) {
  const { setSlotBookings, setLoading, setError, setLastFetched } = useLabManagementStore();

  return useQuery({
    queryKey: labKeys.slotBookings(),
    queryFn: async () => {
      setLoading(true);
      try {
        const data = await labApi.fetchSlotBookings();
        setSlotBookings(data);
        setLastFetched("slotBookings", Date.now());
        return data;
      } catch (error) {
        setError(error instanceof Error ? error.message : "Failed to fetch slot bookings");
        throw error;
      } finally {
        setLoading(false);
      }
    },
    staleTime: STALE_TIME,
    gcTime: CACHE_TIME,
    ...options,
  });
}

/**
 * Fetch slot booking by ID
 */
export function useSlotBooking(bookingId: string, options?: Omit<UseQueryOptions<SlotBooking | null>, "queryKey" | "queryFn">) {
  return useQuery({
    queryKey: labKeys.slotBooking(bookingId),
    queryFn: () => labApi.fetchSlotBookingById(bookingId),
    staleTime: STALE_TIME,
    gcTime: CACHE_TIME,
    enabled: !!bookingId,
    ...options,
  });
}

/**
 * Fetch slot booking by order number
 */
export function useSlotBookingByOrderNumber(orderNumber: string, options?: Omit<UseQueryOptions<SlotBooking | null>, "queryKey" | "queryFn">) {
  return useQuery({
    queryKey: labKeys.slotBookingByOrder(orderNumber),
    queryFn: () => labApi.fetchSlotBookingByOrderNumber(orderNumber),
    staleTime: STALE_TIME,
    gcTime: CACHE_TIME,
    enabled: !!orderNumber,
    ...options,
  });
}

/**
 * Fetch slot booking by scan input
 */
export function useSlotBookingByScan(scanInput: string, options?: Omit<UseQueryOptions<SlotBooking | null>, "queryKey" | "queryFn">) {
  return useQuery({
    queryKey: labKeys.slotBookingByScan(scanInput),
    queryFn: () => labApi.fetchSlotBookingByScanInput(scanInput),
    staleTime: 0, // Always fresh for scans
    gcTime: CACHE_TIME,
    enabled: !!scanInput,
    ...options,
  });
}

/**
 * Create slot booking mutation
 */
export function useCreateSlotBooking() {
  const queryClient = useQueryClient();
  const { addSlotBooking } = useLabManagementStore();

  return useMutation({
    mutationFn: (data: Partial<SlotBooking>) => labApi.createSlotBooking(data),
    onSuccess: (newBooking) => {
      addSlotBooking(newBooking);
      queryClient.invalidateQueries({ queryKey: labKeys.slotBookings() });
    },
  });
}

/**
 * Update slot booking status mutation
 */
export function useUpdateSlotBookingStatus() {
  const queryClient = useQueryClient();
  const { updateSlotBooking: updateStoreBooking } = useLabManagementStore();

  return useMutation({
    mutationFn: ({ bookingId, status }: { bookingId: string; status: SlotBooking["status"] }) =>
      labApi.updateSlotBookingStatus(bookingId, status),
    onMutate: async ({ bookingId, status }) => {
      await queryClient.cancelQueries({ queryKey: labKeys.slotBookings() });
      updateStoreBooking(bookingId, { status });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: labKeys.slotBookings() });
    },
  });
}

/**
 * Complete slot booking mutation
 */
export function useCompleteSlotBooking() {
  const queryClient = useQueryClient();
  const { updateSlotBooking: updateStoreBooking } = useLabManagementStore();

  return useMutation({
    mutationFn: ({ bookingId, completionData }: {
      bookingId: string;
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
      };
    }) => labApi.completeSlotBooking(bookingId, completionData),
    onMutate: async ({ bookingId, completionData }) => {
      await queryClient.cancelQueries({ queryKey: labKeys.slotBookings() });
      updateStoreBooking(bookingId, {
        patientName: completionData.patientName,
        patientMobile: completionData.mobile,
        tests: completionData.tests,
        packages: completionData.packages,
        status: "Confirmed",
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: labKeys.slotBookings() });
    },
  });
}

// ==================== PROCESSING QUEUE HOOKS ====================

/**
 * Fetch processing queue
 */
export function useProcessingQueue(options?: Omit<UseQueryOptions<LabProcessingItem[]>, "queryKey" | "queryFn">) {
  const { setProcessingQueue, setLoading, setError, setLastFetched } = useLabManagementStore();

  return useQuery({
    queryKey: labKeys.processingQueue(),
    queryFn: async () => {
      setLoading(true);
      try {
        const data = await labApi.fetchProcessingQueue();
        setProcessingQueue(data);
        setLastFetched("processingQueue", Date.now());
        return data;
      } catch (error) {
        setError(error instanceof Error ? error.message : "Failed to fetch processing queue");
        throw error;
      } finally {
        setLoading(false);
      }
    },
    staleTime: STALE_TIME,
    gcTime: CACHE_TIME,
    ...options,
  });
}

/**
 * Update processing item status mutation
 */
export function useUpdateProcessingStatus() {
  const queryClient = useQueryClient();
  const { updateProcessingItem: updateStoreItem } = useLabManagementStore();

  return useMutation({
    mutationFn: ({ itemId, status }: { itemId: string; status: LabProcessingItem["status"] }) =>
      labApi.updateProcessingStatus(itemId, status),
    onMutate: async ({ itemId, status }) => {
      await queryClient.cancelQueries({ queryKey: labKeys.processingQueue() });
      updateStoreItem(itemId, { status });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: labKeys.processingQueue() });
    },
  });
}

/**
 * Start batch processing mutation
 */
export function useStartBatchProcessing() {
  const queryClient = useQueryClient();
  const { updateProcessingItem: updateStoreItem } = useLabManagementStore();

  return useMutation({
    mutationFn: (itemIds: string[]) => labApi.startBatchProcessing(itemIds),
    onMutate: async (itemIds) => {
      await queryClient.cancelQueries({ queryKey: labKeys.processingQueue() });
      itemIds.forEach((id) => {
        updateStoreItem(id, { status: "In Progress" });
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: labKeys.processingQueue() });
    },
  });
}
