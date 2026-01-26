/**
 * Lab Management Store (Zustand)
 * 
 * Global state management for lab management including employees, tests, packages,
 * slot bookings, and processing queue.
 */

import { create } from "zustand";
import { devtools, subscribeWithSelector } from "zustand/middleware";
import type {
  LabEmployee,
  LabTest,
  LabPackage,
  SlotBooking,
  LabProcessingItem,
} from "@/components/custom/tenant-panel/lab-management/lab-management.types";

// ==================== TYPES ====================

export interface SlotBookingStats {
  total: number;
  booked: number;
  confirmed: number;
  completed: number;
  cancelled: number;
  noShow: number;
  todayBookings: number;
  upcomingBookings: number;
}

export interface ProcessingStats {
  total: number;
  sampleCollected: number;
  inProgress: number;
  reportReady: number;
  completed: number;
}

export interface LabManagementState {
  // Employees
  employees: LabEmployee[];
  selectedEmployee: LabEmployee | null;
  
  // Tests
  tests: LabTest[];
  selectedTest: LabTest | null;
  
  // Packages
  packages: LabPackage[];
  selectedPackage: LabPackage | null;
  
  // Slot Bookings
  slotBookings: SlotBooking[];
  filteredSlotBookings: SlotBooking[];
  selectedSlotBooking: SlotBooking | null;
  slotBookingSearchQuery: string;
  slotBookingStatusFilter: SlotBooking["status"] | "all";
  slotBookingDateFilter: string;
  slotBookingStats: SlotBookingStats;
  
  // Processing Queue
  processingQueue: LabProcessingItem[];
  filteredProcessingQueue: LabProcessingItem[];
  selectedProcessingItem: LabProcessingItem | null;
  processingSearchQuery: string;
  processingStatusFilter: LabProcessingItem["status"] | "all";
  processingStats: ProcessingStats;
  
  // Loading states
  isLoading: boolean;
  isUpdating: boolean;
  error: string | null;
  
  // Dialogs
  isSlotBookingDialogOpen: boolean;
  isCompletionDialogOpen: boolean;
  isProcessingDialogOpen: boolean;
  
  // Last fetch timestamps
  lastFetched: {
    employees: number | null;
    tests: number | null;
    packages: number | null;
    slotBookings: number | null;
    processingQueue: number | null;
  };
}

export interface LabManagementActions {
  // Employee actions
  setEmployees: (employees: LabEmployee[]) => void;
  addEmployee: (employee: LabEmployee) => void;
  updateEmployee: (employeeId: string, updates: Partial<LabEmployee>) => void;
  removeEmployee: (employeeId: string) => void;
  setSelectedEmployee: (employee: LabEmployee | null) => void;
  getEmployeesByRole: (role: LabEmployee["role"]) => LabEmployee[];
  
  // Test actions
  setTests: (tests: LabTest[]) => void;
  addTest: (test: LabTest) => void;
  updateTest: (testId: string, updates: Partial<LabTest>) => void;
  removeTest: (testId: string) => void;
  setSelectedTest: (test: LabTest | null) => void;
  
  // Package actions
  setPackages: (packages: LabPackage[]) => void;
  addPackage: (pkg: LabPackage) => void;
  updatePackage: (packageId: string, updates: Partial<LabPackage>) => void;
  removePackage: (packageId: string) => void;
  setSelectedPackage: (pkg: LabPackage | null) => void;
  
  // Slot Booking actions
  setSlotBookings: (bookings: SlotBooking[]) => void;
  addSlotBooking: (booking: SlotBooking) => void;
  updateSlotBooking: (bookingId: string, updates: Partial<SlotBooking>) => void;
  removeSlotBooking: (bookingId: string) => void;
  setSelectedSlotBooking: (booking: SlotBooking | null) => void;
  setSlotBookingSearchQuery: (query: string) => void;
  setSlotBookingStatusFilter: (status: SlotBooking["status"] | "all") => void;
  setSlotBookingDateFilter: (date: string) => void;
  getSlotBookingById: (bookingId: string) => SlotBooking | undefined;
  getSlotBookingByOrderNumber: (orderNumber: string) => SlotBooking | undefined;
  
  // Processing Queue actions
  setProcessingQueue: (queue: LabProcessingItem[]) => void;
  addProcessingItem: (item: LabProcessingItem) => void;
  updateProcessingItem: (itemId: string, updates: Partial<LabProcessingItem>) => void;
  removeProcessingItem: (itemId: string) => void;
  setSelectedProcessingItem: (item: LabProcessingItem | null) => void;
  setProcessingSearchQuery: (query: string) => void;
  setProcessingStatusFilter: (status: LabProcessingItem["status"] | "all") => void;
  
  // Loading actions
  setLoading: (loading: boolean) => void;
  setUpdating: (updating: boolean) => void;
  setError: (error: string | null) => void;
  
  // Dialog actions
  openSlotBookingDialog: (booking?: SlotBooking) => void;
  closeSlotBookingDialog: () => void;
  openCompletionDialog: (booking: SlotBooking) => void;
  closeCompletionDialog: () => void;
  openProcessingDialog: (item: LabProcessingItem) => void;
  closeProcessingDialog: () => void;
  
  // Utility actions
  setLastFetched: (key: keyof LabManagementState["lastFetched"], timestamp: number) => void;
  refreshFilteredSlotBookings: () => void;
  refreshFilteredProcessingQueue: () => void;
  
  // Reset
  reset: () => void;
}

// ==================== INITIAL STATE ====================

const initialSlotBookingStats: SlotBookingStats = {
  total: 0,
  booked: 0,
  confirmed: 0,
  completed: 0,
  cancelled: 0,
  noShow: 0,
  todayBookings: 0,
  upcomingBookings: 0,
};

const initialProcessingStats: ProcessingStats = {
  total: 0,
  sampleCollected: 0,
  inProgress: 0,
  reportReady: 0,
  completed: 0,
};

const initialState: LabManagementState = {
  employees: [],
  selectedEmployee: null,
  tests: [],
  selectedTest: null,
  packages: [],
  selectedPackage: null,
  slotBookings: [],
  filteredSlotBookings: [],
  selectedSlotBooking: null,
  slotBookingSearchQuery: "",
  slotBookingStatusFilter: "all",
  slotBookingDateFilter: "all",
  slotBookingStats: initialSlotBookingStats,
  processingQueue: [],
  filteredProcessingQueue: [],
  selectedProcessingItem: null,
  processingSearchQuery: "",
  processingStatusFilter: "all",
  processingStats: initialProcessingStats,
  isLoading: false,
  isUpdating: false,
  error: null,
  isSlotBookingDialogOpen: false,
  isCompletionDialogOpen: false,
  isProcessingDialogOpen: false,
  lastFetched: {
    employees: null,
    tests: null,
    packages: null,
    slotBookings: null,
    processingQueue: null,
  },
};

// ==================== HELPER FUNCTIONS ====================

const calculateSlotBookingStats = (bookings: SlotBooking[]): SlotBookingStats => {
  const today = new Date().toISOString().split("T")[0];
  
  return {
    total: bookings.length,
    booked: bookings.filter((b) => b.status === "Booked").length,
    confirmed: bookings.filter((b) => b.status === "Confirmed").length,
    completed: bookings.filter((b) => b.status === "Completed").length,
    cancelled: bookings.filter((b) => b.status === "Cancelled").length,
    noShow: bookings.filter((b) => b.status === "No Show").length,
    todayBookings: bookings.filter((b) => b.slotDate === today).length,
    upcomingBookings: bookings.filter((b) => b.slotDate > today).length,
  };
};

const calculateProcessingStats = (queue: LabProcessingItem[]): ProcessingStats => {
  return {
    total: queue.length,
    sampleCollected: queue.filter((i) => i.status === "Sample Collected").length,
    inProgress: queue.filter((i) => i.status === "In Progress").length,
    reportReady: queue.filter((i) => i.status === "Report Ready").length,
    completed: queue.filter((i) => i.status === "Completed").length,
  };
};

const filterSlotBookings = (
  bookings: SlotBooking[],
  searchQuery: string,
  statusFilter: SlotBooking["status"] | "all",
  dateFilter: string
): SlotBooking[] => {
  let filtered = [...bookings];
  const today = new Date().toISOString().split("T")[0];
  const tomorrow = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split("T")[0];

  // Search filter
  if (searchQuery) {
    const q = searchQuery.toLowerCase();
    filtered = filtered.filter(
      (b) =>
        b.tokenNumber?.toLowerCase().includes(q) ||
        b.patientName.toLowerCase().includes(q) ||
        b.patientMobile.includes(q)
    );
  }

  // Status filter
  if (statusFilter && statusFilter !== "all") {
    filtered = filtered.filter((b) => b.status === statusFilter);
  }

  // Date filter
  if (dateFilter && dateFilter !== "all") {
    if (dateFilter === "today") {
      filtered = filtered.filter((b) => b.slotDate === today);
    } else if (dateFilter === "tomorrow") {
      filtered = filtered.filter((b) => b.slotDate === tomorrow);
    } else if (dateFilter === "upcoming") {
      filtered = filtered.filter((b) => b.slotDate > today);
    } else if (dateFilter === "past") {
      filtered = filtered.filter((b) => b.slotDate < today);
    }
  }

  return filtered;
};

const filterProcessingQueue = (
  queue: LabProcessingItem[],
  searchQuery: string,
  statusFilter: LabProcessingItem["status"] | "all"
): LabProcessingItem[] => {
  let filtered = [...queue];

  // Search filter
  if (searchQuery) {
    const q = searchQuery.toLowerCase();
    filtered = filtered.filter(
      (i) =>
        i.orderNumber.toLowerCase().includes(q) ||
        i.patientName.toLowerCase().includes(q) ||
        i.sampleId?.toLowerCase().includes(q)
    );
  }

  // Status filter
  if (statusFilter && statusFilter !== "all") {
    filtered = filtered.filter((i) => i.status === statusFilter);
  }

  return filtered;
};

// ==================== STORE ====================

export const useLabManagementStore = create<LabManagementState & LabManagementActions>()(
  devtools(
    subscribeWithSelector((set, get) => ({
      ...initialState,

      // Employee actions
      setEmployees: (employees) => set({ employees }),
      
      addEmployee: (employee) => {
        set({ employees: [...get().employees, employee] });
      },
      
      updateEmployee: (employeeId, updates) => {
        const employees = get().employees.map((e) =>
          e.id === employeeId ? { ...e, ...updates } : e
        );
        set({ employees });
      },
      
      removeEmployee: (employeeId) => {
        set({ employees: get().employees.filter((e) => e.id !== employeeId) });
      },
      
      setSelectedEmployee: (selectedEmployee) => set({ selectedEmployee }),
      
      getEmployeesByRole: (role) => {
        return get().employees.filter((e) => e.role === role);
      },

      // Test actions
      setTests: (tests) => set({ tests }),
      
      addTest: (test) => {
        set({ tests: [...get().tests, test] });
      },
      
      updateTest: (testId, updates) => {
        const tests = get().tests.map((t) =>
          t.id === testId ? { ...t, ...updates } : t
        );
        set({ tests });
      },
      
      removeTest: (testId) => {
        set({ tests: get().tests.filter((t) => t.id !== testId) });
      },
      
      setSelectedTest: (selectedTest) => set({ selectedTest }),

      // Package actions
      setPackages: (packages) => set({ packages }),
      
      addPackage: (pkg) => {
        set({ packages: [...get().packages, pkg] });
      },
      
      updatePackage: (packageId, updates) => {
        const packages = get().packages.map((p) =>
          p.id === packageId ? { ...p, ...updates } : p
        );
        set({ packages });
      },
      
      removePackage: (packageId) => {
        set({ packages: get().packages.filter((p) => p.id !== packageId) });
      },
      
      setSelectedPackage: (selectedPackage) => set({ selectedPackage }),

      // Slot Booking actions
      setSlotBookings: (slotBookings) => {
        const { slotBookingSearchQuery, slotBookingStatusFilter, slotBookingDateFilter } = get();
        const filteredSlotBookings = filterSlotBookings(
          slotBookings,
          slotBookingSearchQuery,
          slotBookingStatusFilter,
          slotBookingDateFilter
        );
        const slotBookingStats = calculateSlotBookingStats(slotBookings);
        set({ slotBookings, filteredSlotBookings, slotBookingStats });
      },
      
      addSlotBooking: (booking) => {
        const { slotBookings, slotBookingSearchQuery, slotBookingStatusFilter, slotBookingDateFilter } = get();
        const newBookings = [booking, ...slotBookings];
        const filteredSlotBookings = filterSlotBookings(
          newBookings,
          slotBookingSearchQuery,
          slotBookingStatusFilter,
          slotBookingDateFilter
        );
        const slotBookingStats = calculateSlotBookingStats(newBookings);
        set({ slotBookings: newBookings, filteredSlotBookings, slotBookingStats });
      },
      
      updateSlotBooking: (bookingId, updates) => {
        const { slotBookings, slotBookingSearchQuery, slotBookingStatusFilter, slotBookingDateFilter } = get();
        const newBookings = slotBookings.map((b) =>
          b.id === bookingId ? { ...b, ...updates } : b
        );
        const filteredSlotBookings = filterSlotBookings(
          newBookings,
          slotBookingSearchQuery,
          slotBookingStatusFilter,
          slotBookingDateFilter
        );
        const slotBookingStats = calculateSlotBookingStats(newBookings);
        set({ slotBookings: newBookings, filteredSlotBookings, slotBookingStats });
      },
      
      removeSlotBooking: (bookingId) => {
        const { slotBookings, slotBookingSearchQuery, slotBookingStatusFilter, slotBookingDateFilter } = get();
        const newBookings = slotBookings.filter((b) => b.id !== bookingId);
        const filteredSlotBookings = filterSlotBookings(
          newBookings,
          slotBookingSearchQuery,
          slotBookingStatusFilter,
          slotBookingDateFilter
        );
        const slotBookingStats = calculateSlotBookingStats(newBookings);
        set({ slotBookings: newBookings, filteredSlotBookings, slotBookingStats });
      },
      
      setSelectedSlotBooking: (selectedSlotBooking) => set({ selectedSlotBooking }),
      
      setSlotBookingSearchQuery: (slotBookingSearchQuery) => {
        const { slotBookings, slotBookingStatusFilter, slotBookingDateFilter } = get();
        const filteredSlotBookings = filterSlotBookings(
          slotBookings,
          slotBookingSearchQuery,
          slotBookingStatusFilter,
          slotBookingDateFilter
        );
        set({ slotBookingSearchQuery, filteredSlotBookings });
      },
      
      setSlotBookingStatusFilter: (slotBookingStatusFilter) => {
        const { slotBookings, slotBookingSearchQuery, slotBookingDateFilter } = get();
        const filteredSlotBookings = filterSlotBookings(
          slotBookings,
          slotBookingSearchQuery,
          slotBookingStatusFilter,
          slotBookingDateFilter
        );
        set({ slotBookingStatusFilter, filteredSlotBookings });
      },
      
      setSlotBookingDateFilter: (slotBookingDateFilter) => {
        const { slotBookings, slotBookingSearchQuery, slotBookingStatusFilter } = get();
        const filteredSlotBookings = filterSlotBookings(
          slotBookings,
          slotBookingSearchQuery,
          slotBookingStatusFilter,
          slotBookingDateFilter
        );
        set({ slotBookingDateFilter, filteredSlotBookings });
      },
      
      getSlotBookingById: (bookingId) => {
        return get().slotBookings.find((b) => b.id === bookingId);
      },
      
      getSlotBookingByOrderNumber: (orderNumber) => {
        return get().slotBookings.find((b) => b.tokenNumber === orderNumber);
      },

      // Processing Queue actions
      setProcessingQueue: (processingQueue) => {
        const { processingSearchQuery, processingStatusFilter } = get();
        const filteredProcessingQueue = filterProcessingQueue(
          processingQueue,
          processingSearchQuery,
          processingStatusFilter
        );
        const processingStats = calculateProcessingStats(processingQueue);
        set({ processingQueue, filteredProcessingQueue, processingStats });
      },
      
      addProcessingItem: (item) => {
        const { processingQueue, processingSearchQuery, processingStatusFilter } = get();
        const newQueue = [item, ...processingQueue];
        const filteredProcessingQueue = filterProcessingQueue(
          newQueue,
          processingSearchQuery,
          processingStatusFilter
        );
        const processingStats = calculateProcessingStats(newQueue);
        set({ processingQueue: newQueue, filteredProcessingQueue, processingStats });
      },
      
      updateProcessingItem: (itemId, updates) => {
        const { processingQueue, processingSearchQuery, processingStatusFilter } = get();
        const newQueue = processingQueue.map((i) =>
          i.id === itemId ? { ...i, ...updates } : i
        );
        const filteredProcessingQueue = filterProcessingQueue(
          newQueue,
          processingSearchQuery,
          processingStatusFilter
        );
        const processingStats = calculateProcessingStats(newQueue);
        set({ processingQueue: newQueue, filteredProcessingQueue, processingStats });
      },
      
      removeProcessingItem: (itemId) => {
        const { processingQueue, processingSearchQuery, processingStatusFilter } = get();
        const newQueue = processingQueue.filter((i) => i.id !== itemId);
        const filteredProcessingQueue = filterProcessingQueue(
          newQueue,
          processingSearchQuery,
          processingStatusFilter
        );
        const processingStats = calculateProcessingStats(newQueue);
        set({ processingQueue: newQueue, filteredProcessingQueue, processingStats });
      },
      
      setSelectedProcessingItem: (selectedProcessingItem) => set({ selectedProcessingItem }),
      
      setProcessingSearchQuery: (processingSearchQuery) => {
        const { processingQueue, processingStatusFilter } = get();
        const filteredProcessingQueue = filterProcessingQueue(
          processingQueue,
          processingSearchQuery,
          processingStatusFilter
        );
        set({ processingSearchQuery, filteredProcessingQueue });
      },
      
      setProcessingStatusFilter: (processingStatusFilter) => {
        const { processingQueue, processingSearchQuery } = get();
        const filteredProcessingQueue = filterProcessingQueue(
          processingQueue,
          processingSearchQuery,
          processingStatusFilter
        );
        set({ processingStatusFilter, filteredProcessingQueue });
      },

      // Loading actions
      setLoading: (isLoading) => set({ isLoading }),
      setUpdating: (isUpdating) => set({ isUpdating }),
      setError: (error) => set({ error, isLoading: false }),

      // Dialog actions
      openSlotBookingDialog: (booking) => {
        set({ selectedSlotBooking: booking || null, isSlotBookingDialogOpen: true });
      },
      closeSlotBookingDialog: () => set({ isSlotBookingDialogOpen: false }),
      
      openCompletionDialog: (booking) => {
        set({ selectedSlotBooking: booking, isCompletionDialogOpen: true });
      },
      closeCompletionDialog: () => set({ isCompletionDialogOpen: false }),
      
      openProcessingDialog: (item) => {
        set({ selectedProcessingItem: item, isProcessingDialogOpen: true });
      },
      closeProcessingDialog: () => set({ isProcessingDialogOpen: false }),

      // Utility actions
      setLastFetched: (key, timestamp) => {
        set({ lastFetched: { ...get().lastFetched, [key]: timestamp } });
      },
      
      refreshFilteredSlotBookings: () => {
        const { slotBookings, slotBookingSearchQuery, slotBookingStatusFilter, slotBookingDateFilter } = get();
        const filteredSlotBookings = filterSlotBookings(
          slotBookings,
          slotBookingSearchQuery,
          slotBookingStatusFilter,
          slotBookingDateFilter
        );
        set({ filteredSlotBookings });
      },
      
      refreshFilteredProcessingQueue: () => {
        const { processingQueue, processingSearchQuery, processingStatusFilter } = get();
        const filteredProcessingQueue = filterProcessingQueue(
          processingQueue,
          processingSearchQuery,
          processingStatusFilter
        );
        set({ filteredProcessingQueue });
      },

      // Reset
      reset: () => set(initialState),
    })),
    { name: "lab-management-store" }
  )
);

// ==================== SELECTORS ====================

export const useCollectors = () => {
  return useLabManagementStore((state) => state.employees.filter((e) => e.role === "collector"));
};

export const useTechnicians = () => {
  return useLabManagementStore((state) => state.employees.filter((e) => e.role === "lab-technician"));
};

export const useTodaySlotBookings = () => {
  const today = new Date().toISOString().split("T")[0];
  return useLabManagementStore((state) => state.slotBookings.filter((b) => b.slotDate === today));
};

export const usePendingProcessingItems = () => {
  return useLabManagementStore((state) => 
    state.processingQueue.filter((i) => i.status === "Sample Collected" || i.status === "In Progress")
  );
};
