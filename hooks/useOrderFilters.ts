/**
 * useOrderFilters Hook
 * 
 * Centralized hook for filtering orders with debouncing and memoization.
 * Can be used standalone or synced with Zustand store.
 */

import { useState, useMemo, useCallback } from "react";
import { useOrdersStore } from "@/store/orders.store";
import type { Order, OrderSource, OrderStatus } from "@/components/custom/tenant-panel/orders/orders.types";

export interface DateRange {
  from: Date | undefined;
  to: Date | undefined;
}

export interface FilterState {
  searchQuery: string;
  statusFilter: OrderStatus | "all";
  sourceFilter: OrderSource | "all";
  dateRange: DateRange;
  paymentStatusFilter: string;
  branchFilter: string;
}

export interface FilterActions {
  setSearchQuery: (query: string) => void;
  setStatusFilter: (status: OrderStatus | "all") => void;
  setSourceFilter: (source: OrderSource | "all") => void;
  setDateRange: (range: DateRange) => void;
  setPaymentStatusFilter: (status: string) => void;
  setBranchFilter: (branch: string) => void;
  clearFilters: () => void;
  hasActiveFilters: boolean;
}

const initialFilterState: FilterState = {
  searchQuery: "",
  statusFilter: "all",
  sourceFilter: "all",
  dateRange: { from: undefined, to: undefined },
  paymentStatusFilter: "all",
  branchFilter: "all",
};

/**
 * Filter orders based on filter state
 */
function filterOrders(orders: Order[], filters: FilterState, sourceOverride?: OrderSource): Order[] {
  let filtered = [...orders];

  // Source filter (can be overridden for source-specific pages)
  if (sourceOverride) {
    filtered = filtered.filter((o) => o.source === sourceOverride);
  } else if (filters.sourceFilter !== "all") {
    filtered = filtered.filter((o) => o.source === filters.sourceFilter);
  }

  // Search filter
  if (filters.searchQuery) {
    const q = filters.searchQuery.toLowerCase();
    filtered = filtered.filter(
      (o) =>
        o.orderNumber.toLowerCase().includes(q) ||
        o.patient.name.toLowerCase().includes(q) ||
        o.patient.mobile.includes(q) ||
        o.patient.email?.toLowerCase().includes(q) ||
        o.tests.some((t) => t.testName.toLowerCase().includes(q)) ||
        o.packages.some((p) => p.packageName.toLowerCase().includes(q))
    );
  }

  // Status filter
  if (filters.statusFilter !== "all") {
    filtered = filtered.filter((o) => o.status === filters.statusFilter);
  }

  // Payment status filter
  if (filters.paymentStatusFilter !== "all") {
    filtered = filtered.filter((o) => o.paymentStatus === filters.paymentStatusFilter);
  }

  // Branch filter
  if (filters.branchFilter !== "all") {
    filtered = filtered.filter((o) => o.branchId === filters.branchFilter);
  }

  // Date range filter
  if (filters.dateRange.from) {
    const fromDate = filters.dateRange.from.toISOString().split("T")[0];
    filtered = filtered.filter((o) => o.createdAt >= fromDate);
  }
  if (filters.dateRange.to) {
    const toDate = filters.dateRange.to.toISOString().split("T")[0];
    filtered = filtered.filter((o) => o.createdAt.split("T")[0] <= toDate);
  }

  return filtered;
}

/**
 * Hook for local filter state (doesn't sync with store)
 */
export function useOrderFilters(
  orders: Order[],
  sourceOverride?: OrderSource
): FilterState & FilterActions & { filteredOrders: Order[] } {
  const [filters, setFilters] = useState<FilterState>(initialFilterState);

  const setSearchQuery = useCallback((searchQuery: string) => {
    setFilters((prev) => ({ ...prev, searchQuery }));
  }, []);

  const setStatusFilter = useCallback((statusFilter: OrderStatus | "all") => {
    setFilters((prev) => ({ ...prev, statusFilter }));
  }, []);

  const setSourceFilter = useCallback((sourceFilter: OrderSource | "all") => {
    setFilters((prev) => ({ ...prev, sourceFilter }));
  }, []);

  const setDateRange = useCallback((dateRange: DateRange) => {
    setFilters((prev) => ({ ...prev, dateRange }));
  }, []);

  const setPaymentStatusFilter = useCallback((paymentStatusFilter: string) => {
    setFilters((prev) => ({ ...prev, paymentStatusFilter }));
  }, []);

  const setBranchFilter = useCallback((branchFilter: string) => {
    setFilters((prev) => ({ ...prev, branchFilter }));
  }, []);

  const clearFilters = useCallback(() => {
    setFilters(initialFilterState);
  }, []);

  const hasActiveFilters = useMemo(() => {
    return (
      filters.searchQuery !== "" ||
      filters.statusFilter !== "all" ||
      filters.sourceFilter !== "all" ||
      filters.paymentStatusFilter !== "all" ||
      filters.branchFilter !== "all" ||
      filters.dateRange.from !== undefined ||
      filters.dateRange.to !== undefined
    );
  }, [filters]);

  const filteredOrders = useMemo(
    () => filterOrders(orders, filters, sourceOverride),
    [orders, filters, sourceOverride]
  );

  return {
    ...filters,
    setSearchQuery,
    setStatusFilter,
    setSourceFilter,
    setDateRange,
    setPaymentStatusFilter,
    setBranchFilter,
    clearFilters,
    hasActiveFilters,
    filteredOrders,
  };
}

/**
 * Hook that syncs with Zustand store
 */
export function useStoreOrderFilters() {
  const {
    searchQuery,
    statusFilter,
    sourceFilter,
    dateRange,
    filteredOrders,
    setSearchQuery,
    setStatusFilter,
    setSourceFilter,
    setDateRange,
    clearFilters,
  } = useOrdersStore();

  const hasActiveFilters = useMemo(() => {
    return (
      searchQuery !== "" ||
      statusFilter !== "all" ||
      sourceFilter !== "all" ||
      dateRange.from !== undefined ||
      dateRange.to !== undefined
    );
  }, [searchQuery, statusFilter, sourceFilter, dateRange]);

  return {
    searchQuery,
    statusFilter,
    sourceFilter,
    dateRange,
    filteredOrders,
    setSearchQuery,
    setStatusFilter,
    setSourceFilter,
    setDateRange,
    clearFilters,
    hasActiveFilters,
  };
}

/**
 * Hook for source-specific pages that syncs with store
 */
export function useSourceOrderFilters(source: OrderSource) {
  const { orders, searchQuery, statusFilter, dateRange, setSearchQuery, setStatusFilter, setDateRange } =
    useOrdersStore();

  // Filter by source first, then apply other filters
  const sourceOrders = useMemo(() => orders.filter((o) => o.source === source), [orders, source]);

  const filteredOrders = useMemo(() => {
    let filtered = [...sourceOrders];

    // Search filter
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (o) =>
          o.orderNumber.toLowerCase().includes(q) ||
          o.patient.name.toLowerCase().includes(q) ||
          o.patient.mobile.includes(q)
      );
    }

    // Status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter((o) => o.status === statusFilter);
    }

    // Date range filter
    if (dateRange.from) {
      const fromDate = dateRange.from.toISOString().split("T")[0];
      filtered = filtered.filter((o) => o.createdAt >= fromDate);
    }
    if (dateRange.to) {
      const toDate = dateRange.to.toISOString().split("T")[0];
      filtered = filtered.filter((o) => o.createdAt.split("T")[0] <= toDate);
    }

    return filtered;
  }, [sourceOrders, searchQuery, statusFilter, dateRange]);

  const hasActiveFilters = useMemo(() => {
    return (
      searchQuery !== "" ||
      statusFilter !== "all" ||
      dateRange.from !== undefined ||
      dateRange.to !== undefined
    );
  }, [searchQuery, statusFilter, dateRange]);

  const clearFilters = useCallback(() => {
    setSearchQuery("");
    setStatusFilter("all");
    setDateRange({ from: undefined, to: undefined });
  }, [setSearchQuery, setStatusFilter, setDateRange]);

  return {
    orders: sourceOrders,
    filteredOrders,
    searchQuery,
    statusFilter,
    dateRange,
    setSearchQuery,
    setStatusFilter,
    setDateRange,
    clearFilters,
    hasActiveFilters,
  };
}

export default useOrderFilters;
