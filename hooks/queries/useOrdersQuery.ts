/**
 * Orders Query Hooks (React Query)
 * 
 * Custom hooks for fetching and mutating orders data with caching.
 * Uses React Query for automatic caching, background refetching, and optimistic updates.
 */

import { useQuery, useMutation, useQueryClient, UseQueryOptions } from "@tanstack/react-query";
import { useOrdersStore } from "@/store/orders.store";
import * as ordersApi from "@/lib/api/services/orders.api";
import type { Order, OrderSource, OrderStatus, OrderFilters } from "@/components/custom/tenant-panel/orders/orders.types";

// ==================== QUERY KEYS ====================

export const orderKeys = {
  all: ["orders"] as const,
  lists: () => [...orderKeys.all, "list"] as const,
  list: (filters?: OrderFilters) => [...orderKeys.lists(), filters] as const,
  bySource: (source: OrderSource) => [...orderKeys.all, "source", source] as const,
  byStatus: (status: OrderStatus) => [...orderKeys.all, "status", status] as const,
  details: () => [...orderKeys.all, "detail"] as const,
  detail: (id: string) => [...orderKeys.details(), id] as const,
};

// ==================== CACHE CONFIG ====================

const STALE_TIME = 5 * 60 * 1000; // 5 minutes
const CACHE_TIME = 30 * 60 * 1000; // 30 minutes

// ==================== QUERY HOOKS ====================

/**
 * Fetch all orders with optional filters
 * Syncs with Zustand store for global state
 */
export function useOrders(filters?: OrderFilters, options?: Omit<UseQueryOptions<Order[]>, "queryKey" | "queryFn">) {
  const { setOrders, setLoading, setError, setLastFetched } = useOrdersStore();

  return useQuery({
    queryKey: orderKeys.list(filters),
    queryFn: async () => {
      setLoading(true);
      try {
        const data = await ordersApi.fetchOrders(filters);
        setOrders(data);
        setLastFetched(Date.now());
        return data;
      } catch (error) {
        setError(error instanceof Error ? error.message : "Failed to fetch orders");
        throw error;
      }
    },
    staleTime: STALE_TIME,
    gcTime: CACHE_TIME,
    ...options,
  });
}

/**
 * Fetch orders by source
 */
export function useOrdersBySource(source: OrderSource, options?: Omit<UseQueryOptions<Order[]>, "queryKey" | "queryFn">) {
  const { setLoading, setError, setLastFetched } = useOrdersStore();

  return useQuery({
    queryKey: orderKeys.bySource(source),
    queryFn: async () => {
      setLoading(true);
      try {
        const data = await ordersApi.fetchOrdersBySource(source);
        // Don't replace all orders, just return source-specific data
        setLastFetched(Date.now());
        return data;
      } catch (error) {
        setError(error instanceof Error ? error.message : "Failed to fetch orders");
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
 * Fetch orders by status
 */
export function useOrdersByStatus(status: OrderStatus, options?: Omit<UseQueryOptions<Order[]>, "queryKey" | "queryFn">) {
  return useQuery({
    queryKey: orderKeys.byStatus(status),
    queryFn: () => ordersApi.fetchOrdersByStatus(status),
    staleTime: STALE_TIME,
    gcTime: CACHE_TIME,
    ...options,
  });
}

/**
 * Fetch single order by ID
 */
export function useOrder(orderId: string, options?: Omit<UseQueryOptions<Order | null>, "queryKey" | "queryFn">) {
  return useQuery({
    queryKey: orderKeys.detail(orderId),
    queryFn: () => ordersApi.fetchOrderById(orderId),
    staleTime: STALE_TIME,
    gcTime: CACHE_TIME,
    enabled: !!orderId,
    ...options,
  });
}

// ==================== MUTATION HOOKS ====================

/**
 * Update order mutation with optimistic update
 */
export function useUpdateOrder() {
  const queryClient = useQueryClient();
  const { updateOrder: updateStoreOrder } = useOrdersStore();

  return useMutation({
    mutationFn: ({ orderId, updates }: { orderId: string; updates: Partial<Order> }) =>
      ordersApi.updateOrder(orderId, updates),
    
    // Optimistic update
    onMutate: async ({ orderId, updates }) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: orderKeys.all });

      // Snapshot the previous value
      const previousOrders = queryClient.getQueryData<Order[]>(orderKeys.lists());

      // Optimistically update the store
      updateStoreOrder(orderId, updates);

      // Optimistically update the main list cache
      queryClient.setQueryData<Order[]>(orderKeys.lists(), (old) =>
        old?.map((order) =>
          order.id === orderId ? { ...order, ...updates, updatedAt: new Date().toISOString() } : order
        )
      );

      // Also optimistically update source-specific caches
      const sources: OrderSource[] = ["Walk-in", "Home Collection", "Slot Booking", "Online"];
      sources.forEach((source) => {
        queryClient.setQueryData<Order[]>(orderKeys.bySource(source), (old) =>
          old?.map((order) =>
            order.id === orderId ? { ...order, ...updates, updatedAt: new Date().toISOString() } : order
          )
        );
      });

      return { previousOrders };
    },
    
    // If mutation fails, rollback
    onError: (err, { orderId }, context) => {
      if (context?.previousOrders) {
        queryClient.setQueryData(orderKeys.lists(), context.previousOrders);
        // Also rollback store
        const originalOrder = context.previousOrders.find((o) => o.id === orderId);
        if (originalOrder) {
          updateStoreOrder(orderId, originalOrder);
        }
      }
    },
    
    // Always refetch after error or success
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: orderKeys.all });
    },
  });
}

/**
 * Update order status mutation with optimistic update
 */
export function useUpdateOrderStatus() {
  const queryClient = useQueryClient();
  const { updateOrder: updateStoreOrder } = useOrdersStore();

  return useMutation({
    mutationFn: ({ orderId, status }: { orderId: string; status: OrderStatus }) =>
      ordersApi.updateOrderStatus(orderId, status),
    
    onMutate: async ({ orderId, status }) => {
      await queryClient.cancelQueries({ queryKey: orderKeys.all });

      const previousOrders = queryClient.getQueryData<Order[]>(orderKeys.lists());

      // Optimistic update
      updateStoreOrder(orderId, { status });

      queryClient.setQueryData<Order[]>(orderKeys.lists(), (old) =>
        old?.map((order) =>
          order.id === orderId ? { ...order, status, updatedAt: new Date().toISOString() } : order
        )
      );

      return { previousOrders };
    },
    
    onError: (err, { orderId }, context) => {
      if (context?.previousOrders) {
        queryClient.setQueryData(orderKeys.lists(), context.previousOrders);
        const originalOrder = context.previousOrders.find((o) => o.id === orderId);
        if (originalOrder) {
          updateStoreOrder(orderId, { status: originalOrder.status });
        }
      }
    },
    
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: orderKeys.all });
    },
  });
}

/**
 * Create order mutation
 */
export function useCreateOrder() {
  const queryClient = useQueryClient();
  const { addOrder } = useOrdersStore();

  return useMutation({
    mutationFn: (orderData: Partial<Order>) => ordersApi.createOrder(orderData),
    
    onSuccess: (newOrder) => {
      // Add to store
      addOrder(newOrder);
      
      // Add to cache
      queryClient.setQueryData<Order[]>(orderKeys.lists(), (old) =>
        old ? [newOrder, ...old] : [newOrder]
      );
    },
    
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: orderKeys.all });
    },
  });
}

/**
 * Delete order mutation
 */
export function useDeleteOrder() {
  const queryClient = useQueryClient();
  const { removeOrder } = useOrdersStore();

  return useMutation({
    mutationFn: (orderId: string) => ordersApi.deleteOrder(orderId),
    
    onMutate: async (orderId) => {
      await queryClient.cancelQueries({ queryKey: orderKeys.all });

      const previousOrders = queryClient.getQueryData<Order[]>(orderKeys.lists());

      // Optimistic delete
      removeOrder(orderId);

      queryClient.setQueryData<Order[]>(orderKeys.lists(), (old) =>
        old?.filter((order) => order.id !== orderId)
      );

      return { previousOrders };
    },
    
    onError: (err, orderId, context) => {
      if (context?.previousOrders) {
        queryClient.setQueryData(orderKeys.lists(), context.previousOrders);
        // Re-add to store
        const deletedOrder = context.previousOrders.find((o) => o.id === orderId);
        if (deletedOrder) {
          useOrdersStore.getState().addOrder(deletedOrder);
        }
      }
    },
    
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: orderKeys.all });
    },
  });
}

/**
 * Assign collector mutation
 */
export function useAssignCollector() {
  const queryClient = useQueryClient();
  const { updateOrder: updateStoreOrder } = useOrdersStore();

  return useMutation({
    mutationFn: ({ orderId, collectorId, collectorName }: { orderId: string; collectorId: string; collectorName: string }) =>
      ordersApi.assignCollector(orderId, collectorId, collectorName),
    
    onMutate: async ({ orderId, collectorId, collectorName }) => {
      await queryClient.cancelQueries({ queryKey: orderKeys.all });

      const previousOrders = queryClient.getQueryData<Order[]>(orderKeys.lists());

      // Optimistic update
      updateStoreOrder(orderId, {
        homeCollection: {
          scheduledDate: new Date().toISOString().split("T")[0],
          scheduledTime: "10:00 AM - 12:00 PM",
          address: "",
          city: "",
          pincode: "",
          collectorId,
          collectorName,
          collectionStatus: "Scheduled",
        },
      });

      return { previousOrders };
    },
    
    onError: (err, { orderId }, context) => {
      if (context?.previousOrders) {
        queryClient.setQueryData(orderKeys.lists(), context.previousOrders);
        const originalOrder = context.previousOrders.find((o) => o.id === orderId);
        if (originalOrder) {
          updateStoreOrder(orderId, { homeCollection: originalOrder.homeCollection });
        }
      }
    },
    
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: orderKeys.all });
    },
  });
}

/**
 * Update lab test status mutation
 */
export function useUpdateLabTestStatus() {
  const queryClient = useQueryClient();
  const { updateOrder: updateStoreOrder } = useOrdersStore();

  return useMutation({
    mutationFn: ({ orderId, testId, status }: { orderId: string; testId: string; status: "In Progress" | "Completed" }) =>
      ordersApi.updateLabTestStatus(orderId, testId, status),
    
    onMutate: async ({ orderId, testId, status }) => {
      await queryClient.cancelQueries({ queryKey: orderKeys.all });

      const previousOrders = queryClient.getQueryData<Order[]>(orderKeys.lists());
      const order = previousOrders?.find((o) => o.id === orderId);

      if (order) {
        const updatedTests = order.tests.map((t) =>
          t.id === testId ? { ...t, status } : t
        );
        updateStoreOrder(orderId, { tests: updatedTests });
      }

      return { previousOrders };
    },
    
    onError: (err, { orderId }, context) => {
      if (context?.previousOrders) {
        queryClient.setQueryData(orderKeys.lists(), context.previousOrders);
        const originalOrder = context.previousOrders.find((o) => o.id === orderId);
        if (originalOrder) {
          updateStoreOrder(orderId, { tests: originalOrder.tests });
        }
      }
    },
    
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: orderKeys.all });
    },
  });
}

/**
 * Export orders mutation
 */
export function useExportOrders() {
  return useMutation({
    mutationFn: ({ filters, format }: { filters?: OrderFilters; format?: "csv" | "excel" }) =>
      ordersApi.exportOrders(filters, format),
    
    onSuccess: (blob) => {
      // Create download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `orders-export-${new Date().toISOString().split("T")[0]}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    },
  });
}
