/**
 * Orders Store (Zustand)
 * 
 * Global state management for orders across all order pages.
 * This eliminates duplicate data fetching and provides centralized state.
 */

import { create } from "zustand";
import { devtools, subscribeWithSelector } from "zustand/middleware";
import type { Order, OrderSource, OrderStatus, OrderFilters } from "@/components/custom/tenant-panel/orders/orders.types";

// ==================== TYPES ====================

export interface OrderStats {
  total: number;
  pending: number;
  confirmed: number;
  processing: number;
  sampleCollected: number;
  reportReady: number;
  completed: number;
  cancelled: number;
  totalRevenue: number;
  paidRevenue: number;
  pendingPayments: number;
  partialPayments: number;
  averageOrderValue: number;
  todayOrders: number;
  thisWeekOrders: number;
  thisMonthOrders: number;
}

export interface OrdersState {
  // Data
  orders: Order[];
  filteredOrders: Order[];
  
  // Loading states
  isLoading: boolean;
  isUpdating: boolean;
  error: string | null;
  
  // Filters
  filters: OrderFilters;
  searchQuery: string;
  statusFilter: OrderStatus | "all";
  sourceFilter: OrderSource | "all";
  dateRange: {
    from: Date | undefined;
    to: Date | undefined;
  };
  
  // Selection
  selectedOrder: Order | null;
  selectedOrderIds: string[];
  
  // Dialogs
  isDetailDialogOpen: boolean;
  isEditDialogOpen: boolean;
  
  // Computed stats (will be calculated from orders)
  stats: OrderStats;
  
  // Last fetch timestamp
  lastFetched: number | null;
}

export interface OrdersActions {
  // Data actions
  setOrders: (orders: Order[]) => void;
  addOrder: (order: Order) => void;
  updateOrder: (orderId: string, updates: Partial<Order>) => void;
  removeOrder: (orderId: string) => void;
  
  // Loading actions
  setLoading: (loading: boolean) => void;
  setUpdating: (updating: boolean) => void;
  setError: (error: string | null) => void;
  
  // Filter actions
  setSearchQuery: (query: string) => void;
  setStatusFilter: (status: OrderStatus | "all") => void;
  setSourceFilter: (source: OrderSource | "all") => void;
  setDateRange: (range: { from: Date | undefined; to: Date | undefined }) => void;
  setFilters: (filters: Partial<OrderFilters>) => void;
  clearFilters: () => void;
  
  // Selection actions
  setSelectedOrder: (order: Order | null) => void;
  toggleSelectOrder: (orderId: string) => void;
  selectAllOrders: () => void;
  clearSelection: () => void;
  
  // Dialog actions
  openDetailDialog: (order: Order) => void;
  closeDetailDialog: () => void;
  openEditDialog: (order: Order) => void;
  closeEditDialog: () => void;
  
  // Utility actions
  getOrdersBySource: (source: OrderSource) => Order[];
  getOrdersByStatus: (status: OrderStatus) => Order[];
  getOrderById: (orderId: string) => Order | undefined;
  refreshFilteredOrders: () => void;
  setLastFetched: (timestamp: number) => void;
  
  // Reset
  reset: () => void;
}

// ==================== INITIAL STATE ====================

const initialStats: OrderStats = {
  total: 0,
  pending: 0,
  confirmed: 0,
  processing: 0,
  sampleCollected: 0,
  reportReady: 0,
  completed: 0,
  cancelled: 0,
  totalRevenue: 0,
  paidRevenue: 0,
  pendingPayments: 0,
  partialPayments: 0,
  averageOrderValue: 0,
  todayOrders: 0,
  thisWeekOrders: 0,
  thisMonthOrders: 0,
};

const initialState: OrdersState = {
  orders: [],
  filteredOrders: [],
  isLoading: false,
  isUpdating: false,
  error: null,
  filters: {},
  searchQuery: "",
  statusFilter: "all",
  sourceFilter: "all",
  dateRange: { from: undefined, to: undefined },
  selectedOrder: null,
  selectedOrderIds: [],
  isDetailDialogOpen: false,
  isEditDialogOpen: false,
  stats: initialStats,
  lastFetched: null,
};

// ==================== HELPER FUNCTIONS ====================

const calculateStats = (orders: Order[]): OrderStats => {
  const today = new Date().toISOString().split("T")[0];
  const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0];
  const monthStart = new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split("T")[0];
  const totalRevenue = orders.reduce((sum, o) => sum + o.totalAmount, 0);

  return {
    total: orders.length,
    pending: orders.filter((o) => o.status === "Pending").length,
    confirmed: 0, // No "Confirmed" status in simplified flow
    processing: orders.filter((o) => o.status === "Processing").length,
    sampleCollected: orders.filter((o) => o.status === "Sample Collected").length,
    reportReady: orders.filter((o) => o.status === "Report Ready").length,
    completed: orders.filter((o) => o.status === "Completed").length,
    cancelled: orders.filter((o) => o.status === "Cancelled").length,
    totalRevenue,
    paidRevenue: orders
      .filter((o) => o.paymentStatus === "Paid")
      .reduce((sum, o) => sum + o.totalAmount, 0),
    pendingPayments: orders
      .filter((o) => o.paymentStatus === "Pending")
      .reduce((sum, o) => sum + o.totalAmount, 0),
    partialPayments: orders
      .filter((o) => o.paymentStatus === "Partial")
      .reduce((sum, o) => sum + o.totalAmount, 0),
    averageOrderValue: orders.length > 0 ? totalRevenue / orders.length : 0,
    todayOrders: orders.filter((o) => o.createdAt.startsWith(today)).length,
    thisWeekOrders: orders.filter((o) => o.createdAt >= weekAgo).length,
    thisMonthOrders: orders.filter((o) => o.createdAt >= monthStart).length,
  };
};

const filterOrders = (
  orders: Order[],
  searchQuery: string,
  statusFilter: OrderStatus | "all",
  sourceFilter: OrderSource | "all",
  dateRange: { from: Date | undefined; to: Date | undefined }
): Order[] => {
  let filtered = [...orders];

  // Search filter
  if (searchQuery) {
    const q = searchQuery.toLowerCase();
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
  if (statusFilter && statusFilter !== "all") {
    filtered = filtered.filter((o) => o.status === statusFilter);
  }

  // Source filter
  if (sourceFilter && sourceFilter !== "all") {
    filtered = filtered.filter((o) => o.source === sourceFilter);
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
};

// ==================== STORE ====================

export const useOrdersStore = create<OrdersState & OrdersActions>()(
  devtools(
    subscribeWithSelector((set, get) => ({
      ...initialState,

      // Data actions
      setOrders: (orders) => {
        const { searchQuery, statusFilter, sourceFilter, dateRange } = get();
        const filteredOrders = filterOrders(orders, searchQuery, statusFilter, sourceFilter, dateRange);
        const stats = calculateStats(orders);
        set({ orders, filteredOrders, stats, isLoading: false, error: null });
      },

      addOrder: (order) => {
        const { orders, searchQuery, statusFilter, sourceFilter, dateRange } = get();
        const newOrders = [order, ...orders];
        const filteredOrders = filterOrders(newOrders, searchQuery, statusFilter, sourceFilter, dateRange);
        const stats = calculateStats(newOrders);
        set({ orders: newOrders, filteredOrders, stats });
      },

      updateOrder: (orderId, updates) => {
        const { orders, searchQuery, statusFilter, sourceFilter, dateRange } = get();
        const newOrders = orders.map((o) =>
          o.id === orderId ? { ...o, ...updates, updatedAt: new Date().toISOString() } : o
        );
        const filteredOrders = filterOrders(newOrders, searchQuery, statusFilter, sourceFilter, dateRange);
        const stats = calculateStats(newOrders);
        set({ orders: newOrders, filteredOrders, stats });
      },

      removeOrder: (orderId) => {
        const { orders, searchQuery, statusFilter, sourceFilter, dateRange, selectedOrderIds } = get();
        const newOrders = orders.filter((o) => o.id !== orderId);
        const filteredOrders = filterOrders(newOrders, searchQuery, statusFilter, sourceFilter, dateRange);
        const stats = calculateStats(newOrders);
        const newSelectedIds = selectedOrderIds.filter((id) => id !== orderId);
        set({ orders: newOrders, filteredOrders, stats, selectedOrderIds: newSelectedIds });
      },

      // Loading actions
      setLoading: (isLoading) => set({ isLoading }),
      setUpdating: (isUpdating) => set({ isUpdating }),
      setError: (error) => set({ error, isLoading: false }),

      // Filter actions
      setSearchQuery: (searchQuery) => {
        const { orders, statusFilter, sourceFilter, dateRange } = get();
        const filteredOrders = filterOrders(orders, searchQuery, statusFilter, sourceFilter, dateRange);
        set({ searchQuery, filteredOrders });
      },

      setStatusFilter: (statusFilter) => {
        const { orders, searchQuery, sourceFilter, dateRange } = get();
        const filteredOrders = filterOrders(orders, searchQuery, statusFilter, sourceFilter, dateRange);
        set({ statusFilter, filteredOrders });
      },

      setSourceFilter: (sourceFilter) => {
        const { orders, searchQuery, statusFilter, dateRange } = get();
        const filteredOrders = filterOrders(orders, searchQuery, statusFilter, sourceFilter, dateRange);
        set({ sourceFilter, filteredOrders });
      },

      setDateRange: (dateRange) => {
        const { orders, searchQuery, statusFilter, sourceFilter } = get();
        const filteredOrders = filterOrders(orders, searchQuery, statusFilter, sourceFilter, dateRange);
        set({ dateRange, filteredOrders });
      },

      setFilters: (filters) => {
        set({ filters: { ...get().filters, ...filters } });
      },

      clearFilters: () => {
        const { orders } = get();
        set({
          searchQuery: "",
          statusFilter: "all",
          sourceFilter: "all",
          dateRange: { from: undefined, to: undefined },
          filters: {},
          filteredOrders: orders,
        });
      },

      // Selection actions
      setSelectedOrder: (selectedOrder) => set({ selectedOrder }),

      toggleSelectOrder: (orderId) => {
        const { selectedOrderIds } = get();
        const newIds = selectedOrderIds.includes(orderId)
          ? selectedOrderIds.filter((id) => id !== orderId)
          : [...selectedOrderIds, orderId];
        set({ selectedOrderIds: newIds });
      },

      selectAllOrders: () => {
        const { filteredOrders } = get();
        set({ selectedOrderIds: filteredOrders.map((o) => o.id) });
      },

      clearSelection: () => set({ selectedOrderIds: [] }),

      // Dialog actions
      openDetailDialog: (order) => set({ selectedOrder: order, isDetailDialogOpen: true }),
      closeDetailDialog: () => set({ isDetailDialogOpen: false }),
      openEditDialog: (order) => set({ selectedOrder: order, isEditDialogOpen: true }),
      closeEditDialog: () => set({ isEditDialogOpen: false }),

      // Utility actions
      getOrdersBySource: (source) => {
        return get().orders.filter((o) => o.source === source);
      },

      getOrdersByStatus: (status) => {
        return get().orders.filter((o) => o.status === status);
      },

      getOrderById: (orderId) => {
        return get().orders.find((o) => o.id === orderId);
      },

      refreshFilteredOrders: () => {
        const { orders, searchQuery, statusFilter, sourceFilter, dateRange } = get();
        const filteredOrders = filterOrders(orders, searchQuery, statusFilter, sourceFilter, dateRange);
        set({ filteredOrders });
      },

      setLastFetched: (timestamp) => set({ lastFetched: timestamp }),

      // Reset
      reset: () => set(initialState),
    })),
    { name: "orders-store" }
  )
);

// ==================== SELECTORS ====================

// Selector for orders by source (memoized filtering)
export const useOrdersBySource = (source: OrderSource) => {
  return useOrdersStore((state) => state.orders.filter((o) => o.source === source));
};

// Selector for stats by source
export const useStatsBySource = (source: OrderSource) => {
  return useOrdersStore((state) => {
    const sourceOrders = state.orders.filter((o) => o.source === source);
    return calculateStats(sourceOrders);
  });
};

// Selector for filtered orders by source
export const useFilteredOrdersBySource = (source: OrderSource) => {
  return useOrdersStore((state) => {
    const sourceOrders = state.orders.filter((o) => o.source === source);
    return filterOrders(
      sourceOrders,
      state.searchQuery,
      state.statusFilter,
      "all",
      state.dateRange
    );
  });
};
