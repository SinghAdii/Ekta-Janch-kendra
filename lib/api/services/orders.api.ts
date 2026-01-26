/**
 * Orders API Service
 * 
 * This file contains all API calls related to orders.
 * Currently uses mock data, will be connected to Python backend later.
 */

import apiClient from "../axios";
import type { Order, OrderSource, OrderStatus, OrderFilters } from "@/components/custom/tenant-panel/orders/orders.types";

// Import mock data for development
import { 
  mockOrders, 
  updateOrder as mockUpdateOrder,
  updateOrderStatus as mockUpdateOrderStatus,
  updateLabTestStatus as mockUpdateLabTestStatus,
} from "@/components/custom/tenant-panel/orders/orders.data";

// Flag to use mock data (set to false when backend is ready)
const USE_MOCK_DATA = true;

// Simulated delay for mock data
const MOCK_DELAY = 200;

const simulateDelay = <T>(data: T): Promise<T> => {
  return new Promise((resolve) => setTimeout(() => resolve(data), MOCK_DELAY));
};

/**
 * Fetch all orders with optional filters
 */
export async function fetchOrders(filters?: OrderFilters): Promise<Order[]> {
  if (USE_MOCK_DATA) {
    let filtered = [...mockOrders];
    
    if (filters) {
      if (filters.status) {
        filtered = filtered.filter((o) => o.status === filters.status);
      }
      if (filters.source) {
        filtered = filtered.filter((o) => o.source === filters.source);
      }
      if (filters.paymentStatus) {
        filtered = filtered.filter((o) => o.paymentStatus === filters.paymentStatus);
      }
      if (filters.startDate) {
        filtered = filtered.filter((o) => o.createdAt >= filters.startDate!);
      }
      if (filters.endDate) {
        filtered = filtered.filter((o) => o.createdAt <= filters.endDate!);
      }
      if (filters.branchId) {
        filtered = filtered.filter((o) => o.branchId === filters.branchId);
      }
      if (filters.search) {
        const q = filters.search.toLowerCase();
        filtered = filtered.filter(
          (o) =>
            o.orderNumber.toLowerCase().includes(q) ||
            o.patient.name.toLowerCase().includes(q) ||
            o.patient.mobile.includes(q)
        );
      }
    }
    
    return simulateDelay(filtered);
  }

  // Real API call when backend is ready
  const response = await apiClient.get<Order[]>("/orders", { params: filters });
  return response.data;
}

/**
 * Fetch orders by source
 */
export async function fetchOrdersBySource(source: OrderSource): Promise<Order[]> {
  if (USE_MOCK_DATA) {
    const filtered = mockOrders.filter((o) => o.source === source);
    return simulateDelay(filtered);
  }

  const response = await apiClient.get<Order[]>("/orders", { params: { source } });
  return response.data;
}

/**
 * Fetch orders by status
 */
export async function fetchOrdersByStatus(status: OrderStatus): Promise<Order[]> {
  if (USE_MOCK_DATA) {
    const filtered = mockOrders.filter((o) => o.status === status);
    return simulateDelay(filtered);
  }

  const response = await apiClient.get<Order[]>("/orders", { params: { status } });
  return response.data;
}

/**
 * Fetch single order by ID
 */
export async function fetchOrderById(orderId: string): Promise<Order | null> {
  if (USE_MOCK_DATA) {
    const order = mockOrders.find((o) => o.id === orderId) || null;
    return simulateDelay(order);
  }

  const response = await apiClient.get<Order>(`/orders/${orderId}`);
  return response.data;
}

/**
 * Update order
 */
export async function updateOrder(orderId: string, updates: Partial<Order>): Promise<Order | null> {
  if (USE_MOCK_DATA) {
    const result = mockUpdateOrder(orderId, updates);
    return simulateDelay(result);
  }

  const response = await apiClient.patch<Order>(`/orders/${orderId}`, updates);
  return response.data;
}

/**
 * Update order status
 */
export async function updateOrderStatus(orderId: string, status: OrderStatus): Promise<Order | null> {
  if (USE_MOCK_DATA) {
    const result = mockUpdateOrderStatus(orderId, status);
    return simulateDelay(result);
  }

  const response = await apiClient.patch<Order>(`/orders/${orderId}/status`, { status });
  return response.data;
}

/**
 * Update lab test status within an order
 */
export async function updateLabTestStatus(
  orderId: string,
  testId: string,
  status: "In Progress" | "Completed"
): Promise<Order | null> {
  if (USE_MOCK_DATA) {
    const result = mockUpdateLabTestStatus(orderId, testId, status);
    return simulateDelay(result);
  }

  const response = await apiClient.patch<Order>(`/orders/${orderId}/tests/${testId}/status`, { status });
  return response.data;
}

/**
 * Create new order
 */
export async function createOrder(orderData: Partial<Order>): Promise<Order> {
  if (USE_MOCK_DATA) {
    const newOrder: Order = {
      id: `ORD-${Date.now()}`,
      orderNumber: `EJK${Date.now().toString().slice(-6)}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      status: "Pending",
      paymentStatus: "Pending",
      ...orderData,
    } as Order;
    
    mockOrders.unshift(newOrder);
    return simulateDelay(newOrder);
  }

  const response = await apiClient.post<Order>("/orders", orderData);
  return response.data;
}

/**
 * Delete order
 */
export async function deleteOrder(orderId: string): Promise<boolean> {
  if (USE_MOCK_DATA) {
    const index = mockOrders.findIndex((o) => o.id === orderId);
    if (index !== -1) {
      mockOrders.splice(index, 1);
      return simulateDelay(true);
    }
    return simulateDelay(false);
  }

  await apiClient.delete(`/orders/${orderId}`);
  return true;
}

/**
 * Assign collector to home collection order
 */
export async function assignCollector(
  orderId: string, 
  collectorId: string, 
  collectorName: string
): Promise<Order | null> {
  if (USE_MOCK_DATA) {
    const result = mockUpdateOrder(orderId, {
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
    return simulateDelay(result);
  }

  const response = await apiClient.patch<Order>(`/orders/${orderId}/assign-collector`, {
    collectorId,
    collectorName,
  });
  return response.data;
}

/**
 * Export orders to CSV/Excel
 */
export async function exportOrders(filters?: OrderFilters, format: "csv" | "excel" = "csv"): Promise<Blob> {
  if (USE_MOCK_DATA) {
    // Generate mock CSV
    const orders = await fetchOrders(filters);
    const csv = [
      "Order Number,Patient Name,Mobile,Status,Payment Status,Total Amount,Created At",
      ...orders.map(o => 
        `${o.orderNumber},${o.patient.name},${o.patient.mobile},${o.status},${o.paymentStatus},${o.totalAmount},${o.createdAt}`
      )
    ].join("\n");
    
    return simulateDelay(new Blob([csv], { type: "text/csv" }));
  }

  const response = await apiClient.get("/orders/export", {
    params: { ...filters, format },
    responseType: "blob",
  });
  return response.data;
}
