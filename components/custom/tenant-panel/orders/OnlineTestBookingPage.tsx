"use client";

import React, { useCallback } from "react";
import { motion } from "framer-motion";
import {
  Globe,
  MoreVertical,
  Eye,
  Edit2,
  CheckCircle2,
  XCircle,
  Phone,
  Mail,
  IndianRupee,
  Clock,
  FlaskConical,
  FileText,
  RefreshCw,
  Building2,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";

import type { Order, OrderStatus } from "./orders.types";
import {
  statusColors,
  paymentStatusColors,
  ViewOrderDetailsDialog,
  EditOrderDialog,
} from "./orders.components";
import { OrderFiltersBar } from "./OrderFiltersBar";

// Hooks
import { useOrderFilters, useOrderStats } from "@/hooks";
import { useOrdersBySource, useUpdateOrderStatus, useUpdateOrder, useExportOrders } from "@/hooks/queries";
import { useOrdersStore } from "@/store";

function formatINR(amount: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

export default function OnlineTestBookingPage() {
  // React Query for data fetching with caching
  const { data: orders = [], isLoading, refetch, isFetching } = useOrdersBySource("Online Test Booking");
  
  // Mutations with optimistic updates
  const updateStatusMutation = useUpdateOrderStatus();
  const updateOrderMutation = useUpdateOrder();
  const exportMutation = useExportOrders();
  
  // Store for dialogs
  const {
    selectedOrder,
    isDetailDialogOpen,
    isEditDialogOpen,
    openDetailDialog,
    closeDetailDialog,
    openEditDialog,
    closeEditDialog,
  } = useOrdersStore();

  // Local filter state using custom hook
  const {
    searchQuery,
    statusFilter,
    dateRange,
    branchFilter,
    filteredOrders,
    setSearchQuery,
    setStatusFilter,
    setDateRange,
    setBranchFilter,
    clearFilters,
    hasActiveFilters,
  } = useOrderFilters(orders, "Online Test Booking");

  // Calculate stats using centralized hook
  const stats = useOrderStats(orders);

  // Handle status change with optimistic update
  const handleStatusChange = useCallback(
    async (orderId: string, newStatus: OrderStatus) => {
      try {
        await updateStatusMutation.mutateAsync({ orderId, status: newStatus });
      } catch (error) {
        console.error("Error updating status:", error);
      }
    },
    [updateStatusMutation]
  );

  // Handle order edit with optimistic update
  const handleEditOrder = useCallback(
    async (updatedData: Partial<Order>) => {
      if (!selectedOrder) return;
      try {
        await updateOrderMutation.mutateAsync({
          orderId: selectedOrder.id,
          updates: updatedData,
        });
        closeEditDialog();
      } catch (error) {
        console.error("Error updating order:", error);
      }
    },
    [selectedOrder, updateOrderMutation, closeEditDialog]
  );

  // Handle export
  const handleExport = useCallback(() => {
    exportMutation.mutate({
      filters: { 
        source: "Online Test Booking",
        branchId: branchFilter !== "all" ? branchFilter : undefined,
      },
      format: "csv",
    });
  }, [exportMutation, branchFilter]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-slate-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
      <div className="p-6 space-y-6 max-w-full mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-blue-100 rounded-xl dark:bg-blue-900/30">
              <Globe className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight">Online Test Bookings</h1>
              <p className="text-sm text-muted-foreground">Tests booked through website/app with complete details</p>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => refetch()}
            disabled={isFetching}
          >
            <RefreshCw className={`mr-2 h-4 w-4 ${isFetching ? "animate-spin" : ""}`} />
            Refresh
          </Button>
        </div>

        {/* Stats */}
        {isLoading ? (
          <div className="grid gap-4 md:grid-cols-4">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="h-24 rounded-lg" />
            ))}
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-4">
            <Card className="border-l-4 border-l-blue-500">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-muted-foreground">Total Bookings</p>
                    <p className="text-2xl font-bold">{stats.total}</p>
                  </div>
                  <Globe className="h-8 w-8 text-blue-200" />
                </div>
              </CardContent>
            </Card>
            <Card className="border-l-4 border-l-amber-500">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-muted-foreground">New Bookings</p>
                    <p className="text-2xl font-bold">{stats.pending}</p>
                  </div>
                  <Clock className="h-8 w-8 text-amber-200" />
                </div>
              </CardContent>
            </Card>
            <Card className="border-l-4 border-l-purple-500">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-muted-foreground">Processing</p>
                    <p className="text-2xl font-bold">{stats.processing}</p>
                  </div>
                  <FlaskConical className="h-8 w-8 text-purple-200" />
                </div>
              </CardContent>
            </Card>
            <Card className="border-l-4 border-l-green-500">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-muted-foreground">Revenue</p>
                    <p className="text-2xl font-bold">{formatINR(stats.paidRevenue)}</p>
                  </div>
                  <IndianRupee className="h-8 w-8 text-green-200" />
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Filters */}
        <Card>
          <CardContent className="p-4">
            <OrderFiltersBar
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              statusFilter={statusFilter}
              onStatusChange={setStatusFilter}
              dateRange={dateRange}
              onDateRangeChange={setDateRange}
              branchFilter={branchFilter}
              onBranchChange={setBranchFilter}
              showBranchFilter={true}
              onClearFilters={clearFilters}
              hasActiveFilters={hasActiveFilters}
              onRefresh={() => refetch()}
              onExport={handleExport}
              isLoading={isFetching}
              searchPlaceholder="Search by order #, patient, or test..."
            />
          </CardContent>
        </Card>

        {/* Bookings Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {isLoading ? (
            [...Array(6)].map((_, i) => (
              <Skeleton key={i} className="h-64 rounded-lg" />
            ))
          ) : filteredOrders.length === 0 ? (
            <Card className="col-span-full">
              <CardContent className="p-12 text-center text-muted-foreground">
                No online test bookings found
              </CardContent>
            </Card>
          ) : (
            filteredOrders.map((order, i) => (
              <motion.div
                key={order.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <Card className="hover:shadow-lg transition-shadow overflow-hidden">
                  <div className="p-4 space-y-4">
                    {/* Header */}
                    <div className="flex items-start justify-between">
                      <div>
                        <span className="font-semibold text-primary">{order.orderNumber}</span>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge className={statusColors[order.status]}>{order.status}</Badge>
                        </div>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => openDetailDialog(order)}>
                            <Eye className="mr-2 h-4 w-4" /> View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => openEditDialog(order)}>
                            <Edit2 className="mr-2 h-4 w-4" /> Edit
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          {order.status === "Pending" && (
                            <DropdownMenuItem
                              onClick={() => handleStatusChange(order.id, "Processing")}
                              disabled={updateStatusMutation.isPending}
                            >
                              <Clock className="mr-2 h-4 w-4 text-indigo-500" /> Start Processing
                            </DropdownMenuItem>
                          )}
                          {order.status === "Processing" && (
                            <DropdownMenuItem
                              onClick={() => handleStatusChange(order.id, "Report Ready")}
                              disabled={updateStatusMutation.isPending}
                            >
                              <FileText className="mr-2 h-4 w-4 text-cyan-500" /> Report Ready
                            </DropdownMenuItem>
                          )}
                          {order.status === "Report Ready" && (
                            <DropdownMenuItem
                              onClick={() => handleStatusChange(order.id, "Completed")}
                              disabled={updateStatusMutation.isPending}
                            >
                              <CheckCircle2 className="mr-2 h-4 w-4 text-green-500" /> Complete
                            </DropdownMenuItem>
                          )}
                          {order.status !== "Completed" && order.status !== "Cancelled" && (
                            <DropdownMenuItem
                              onClick={() => handleStatusChange(order.id, "Cancelled")}
                              disabled={updateStatusMutation.isPending}
                            >
                              <XCircle className="mr-2 h-4 w-4 text-red-500" /> Cancel Order
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>

                    {/* Patient Info */}
                    <div className="space-y-2">
                      <p className="font-medium">{order.patient.name}</p>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Phone className="h-4 w-4" />
                        <span>{order.patient.mobile}</span>
                      </div>
                      {order.patient.email && (
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Mail className="h-4 w-4" />
                          <span className="truncate">{order.patient.email}</span>
                        </div>
                      )}
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Building2 className="h-4 w-4" />
                        <span>{order.branchCode}</span>
                      </div>
                    </div>

                    {/* Tests */}
                    <div className="flex flex-wrap gap-1">
                      {order.tests.map((test) => (
                        <Badge key={test.id} variant="secondary" className="text-xs">
                          {test.testCode}
                        </Badge>
                      ))}
                    </div>

                    {/* Footer */}
                    <div className="flex items-center justify-between pt-3 border-t">
                      <div>
                        <p className="text-lg font-bold">{formatINR(order.totalAmount)}</p>
                        <Badge className={paymentStatusColors[order.paymentStatus]}>
                          {order.paymentStatus}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {new Date(order.createdAt).toLocaleDateString("en-IN", {
                          day: "2-digit",
                          month: "short",
                        })}
                      </p>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))
          )}
        </div>

        {/* View Details Dialog */}
        <ViewOrderDetailsDialog
          open={isDetailDialogOpen}
          onOpenChange={(open) => !open && closeDetailDialog()}
          order={selectedOrder}
        />

        {/* Edit Order Dialog */}
        <EditOrderDialog
          open={isEditDialogOpen}
          onOpenChange={(open) => !open && closeEditDialog()}
          order={selectedOrder}
          onSave={handleEditOrder}
        />
      </div>
    </div>
  );
}
