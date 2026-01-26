/**
 * useOrderStats Hook
 * 
 * Centralized hook for calculating order statistics.
 * Can be used with filtered or unfiltered orders.
 */

import { useMemo } from "react";
import type { Order, OrderSource, OrderStatus } from "@/components/custom/tenant-panel/orders/orders.types";
import { useOrdersStore, useStatsBySource } from "@/store/orders.store";

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

export interface DetailedStats extends OrderStats {
  byPaymentMethod: Record<string, number>;
  byBranch: Record<string, number>;
  conversionRate: number;
  completionRate: number;
}

/**
 * Calculate basic stats from orders
 */
function calculateBasicStats(orders: Order[]): OrderStats {
  const today = new Date().toISOString().split("T")[0];
  const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0];
  const monthStart = new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split("T")[0];

  const paidOrders = orders.filter((o) => o.paymentStatus === "Paid");
  const totalRevenue = orders.reduce((sum, o) => sum + o.totalAmount, 0);
  const paidRevenue = paidOrders.reduce((sum, o) => sum + o.totalAmount, 0);

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
    paidRevenue,
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
}

/**
 * Calculate detailed stats from orders
 */
function calculateDetailedStats(orders: Order[]): DetailedStats {
  const basicStats = calculateBasicStats(orders);
  
  // By payment method
  const byPaymentMethod: Record<string, number> = {};
  orders.forEach((o) => {
    const method = o.paymentMode || "Unknown";
    byPaymentMethod[method] = (byPaymentMethod[method] || 0) + 1;
  });

  // By branch
  const byBranch: Record<string, number> = {};
  orders.forEach((o) => {
    const branch = o.branchId || "Unknown";
    byBranch[branch] = (byBranch[branch] || 0) + 1;
  });

  // Rates
  const completedOrders = orders.filter((o) => o.status === "Completed").length;
  const nonCancelledOrders = orders.filter((o) => o.status !== "Cancelled").length;

  return {
    ...basicStats,
    byPaymentMethod,
    byBranch,
    conversionRate: orders.length > 0 ? (completedOrders / orders.length) * 100 : 0,
    completionRate: nonCancelledOrders > 0 ? (completedOrders / nonCancelledOrders) * 100 : 0,
  };
}

/**
 * Hook to get stats from orders array
 */
export function useOrderStats(orders: Order[]): OrderStats {
  return useMemo(() => calculateBasicStats(orders), [orders]);
}

/**
 * Hook to get detailed stats from orders array
 */
export function useDetailedOrderStats(orders: Order[]): DetailedStats {
  return useMemo(() => calculateDetailedStats(orders), [orders]);
}

/**
 * Hook to get stats from store (all orders)
 */
export function useGlobalOrderStats(): OrderStats {
  return useOrdersStore((state) => state.stats);
}

/**
 * Hook to get stats for a specific source
 */
export function useSourceOrderStats(source: OrderSource): OrderStats {
  return useStatsBySource(source);
}

/**
 * Hook to get stats for filtered orders in store
 */
export function useFilteredOrderStats(): OrderStats {
  const filteredOrders = useOrdersStore((state) => state.filteredOrders);
  return useMemo(() => calculateBasicStats(filteredOrders), [filteredOrders]);
}

/**
 * Hook to get status counts
 */
export function useStatusCounts(orders: Order[]): Record<OrderStatus, number> {
  return useMemo(() => {
    const counts: Record<string, number> = {
      Pending: 0,
      Confirmed: 0,
      Processing: 0,
      "Sample Collected": 0,
      "Report Ready": 0,
      Completed: 0,
      Cancelled: 0,
    };
    
    orders.forEach((o) => {
      counts[o.status] = (counts[o.status] || 0) + 1;
    });
    
    return counts as Record<OrderStatus, number>;
  }, [orders]);
}

/**
 * Hook to get revenue stats
 */
export function useRevenueStats(orders: Order[]) {
  return useMemo(() => {
    const paidOrders = orders.filter((o) => o.paymentStatus === "Paid");
    const pendingOrders = orders.filter((o) => o.paymentStatus === "Pending");
    const partialOrders = orders.filter((o) => o.paymentStatus === "Partial");

    return {
      totalRevenue: orders.reduce((sum, o) => sum + o.totalAmount, 0),
      paidRevenue: paidOrders.reduce((sum, o) => sum + o.totalAmount, 0),
      pendingRevenue: pendingOrders.reduce((sum, o) => sum + o.totalAmount, 0),
      partialRevenue: partialOrders.reduce((sum, o) => sum + o.totalAmount, 0),
      paidCount: paidOrders.length,
      pendingCount: pendingOrders.length,
      partialCount: partialOrders.length,
    };
  }, [orders]);
}

export default useOrderStats;
