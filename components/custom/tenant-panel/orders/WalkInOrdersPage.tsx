"use client";

import React, { useState, useMemo, useCallback } from "react";
import { motion } from "framer-motion";
import {
  Users,
  MoreVertical,
  Eye,
  Edit2,
  XCircle,
  Phone,
  IndianRupee,
  Clock,
  FlaskConical,
  Stethoscope,
  RefreshCw,
  Building2,
  Info,
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
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
import {
  useOrdersBySource,
  useUpdateOrder,
  useExportOrders,
} from "@/hooks/queries";
import { useOrdersStore } from "@/store";

function formatINR(amount: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

export default function WalkInOrdersPage() {
  // Cancel dialog state
  const [isCancelDialogOpen, setIsCancelDialogOpen] = useState(false);
  const [orderToCancel, setOrderToCancel] = useState<Order | null>(null);

  // React Query for data fetching with caching
  const {
    data: orders = [],
    isLoading,
    refetch,
    isFetching,
  } = useOrdersBySource("Walk-in");

  // Mutations with optimistic updates
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
  } = useOrderFilters(orders, "Walk-in");

  // Calculate stats using centralized hook
  const stats = useOrderStats(orders);

  // Additional stats specific to walk-in
  const todayStats = useMemo(() => {
    const today = new Date().toISOString().split("T")[0];
    const todayOrders = orders.filter((o) => o.createdAt.startsWith(today));
    return {
      count: todayOrders.length,
      revenue: todayOrders
        .filter((o) => o.paymentStatus === "Paid")
        .reduce((sum, o) => sum + o.totalAmount, 0),
    };
  }, [orders]);

  // Handle order edit with optimistic update - patient details only
  const handleEditOrder = useCallback(
    async (updatedData: Partial<Order>) => {
      if (!selectedOrder) return;
      try {
        // Only allow updating patient information, not status
        const allowedUpdates: Partial<Order> = {
          patient: updatedData.patient,
        };
        await updateOrderMutation.mutateAsync({
          orderId: selectedOrder.id,
          updates: allowedUpdates,
        });
        closeEditDialog();
      } catch (error) {
        console.error("Error updating order:", error);
      }
    },
    [selectedOrder, updateOrderMutation, closeEditDialog],
  );

  // Handle cancel order
  const handleCancelOrder = useCallback(async () => {
    if (!orderToCancel) return;
    try {
      await updateOrderMutation.mutateAsync({
        orderId: orderToCancel.id,
        updates: { status: "Cancelled" },
      });
      setIsCancelDialogOpen(false);
      setOrderToCancel(null);
    } catch (error) {
      console.error("Error cancelling order:", error);
    }
  }, [orderToCancel, updateOrderMutation]);

  // Handle export
  const handleExport = useCallback(() => {
    exportMutation.mutate({
      filters: {
        source: "Walk-in",
        branchId: branchFilter !== "all" ? branchFilter : undefined,
      },
      format: "csv",
    });
  }, [exportMutation, branchFilter]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-slate-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
      <div className="p-6 space-y-6 max-w-full mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-pink-100 rounded-xl dark:bg-pink-900/30">
              <Users className="h-6 w-6 text-pink-600 dark:text-pink-400" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight">
                Walk-in Orders
              </h1>
              <p className="text-sm text-muted-foreground">
                Direct customers visiting the lab
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => refetch()}
              disabled={isFetching}
            >
              <RefreshCw
                className={`mr-2 h-4 w-4 ${isFetching ? "animate-spin" : ""}`}
              />
              Refresh
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        {isLoading ? (
          <div className="grid gap-4 md:grid-cols-4">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="h-24 rounded-lg" />
            ))}
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-4">
            <Card className="border-l-4 border-l-pink-500">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-muted-foreground">
                      Total Walk-ins
                    </p>
                    <p className="text-2xl font-bold">{stats.total}</p>
                  </div>
                  <Users className="h-8 w-8 text-pink-200" />
                </div>
              </CardContent>
            </Card>
            <Card className="border-l-4 border-l-blue-500">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-muted-foreground">Today</p>
                    <p className="text-2xl font-bold">{todayStats.count}</p>
                  </div>
                  <Clock className="h-8 w-8 text-blue-200" />
                </div>
              </CardContent>
            </Card>
            <Card className="border-l-4 border-l-green-500">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-muted-foreground">Revenue</p>
                    <p className="text-2xl font-bold">
                      {formatINR(stats.paidRevenue)}
                    </p>
                  </div>
                  <IndianRupee className="h-8 w-8 text-green-200" />
                </div>
              </CardContent>
            </Card>
            <Card className="border-l-4 border-l-amber-500">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-muted-foreground">
                      Pending Payment
                    </p>
                    <p className="text-2xl font-bold">
                      {
                        orders.filter((o) => o.paymentStatus === "Pending")
                          .length
                      }
                    </p>
                  </div>
                  <Clock className="h-8 w-8 text-amber-200" />
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Info Banner - Read-only Status */}
        <Alert className="bg-pink-50 border-pink-200">
          <Info className="h-4 w-4 text-pink-600" />
          <AlertTitle className="text-pink-800">
            Read-only Status Management
          </AlertTitle>
          <AlertDescription className="text-pink-700">
            Order status is managed automatically through{" "}
            <strong>Lab Management</strong>. You can view orders, edit patient
            details, or cancel orders from here.
          </AlertDescription>
        </Alert>

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
              searchPlaceholder="Search by name, mobile, or order #..."
            />
          </CardContent>
        </Card>

        {/* Orders Table */}
        <Card className="overflow-hidden shadow-lg">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted/50 text-muted-foreground font-medium">
                <tr>
                  <th className="px-4 py-3 text-left">Order</th>
                  <th className="px-4 py-3 text-left">Patient</th>
                  <th className="px-4 py-3 text-left">Branch</th>
                  <th className="px-4 py-3 text-left">Tests/Packages</th>
                  <th className="px-4 py-3 text-left">Referred By</th>
                  <th className="px-4 py-3 text-right">Amount</th>
                  <th className="px-4 py-3 text-center">Payment</th>
                  <th className="px-4 py-3 text-center">Status</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {isLoading ? (
                  [...Array(5)].map((_, i) => (
                    <tr key={i}>
                      <td colSpan={9} className="px-4 py-3">
                        <Skeleton className="h-12 w-full" />
                      </td>
                    </tr>
                  ))
                ) : filteredOrders.length === 0 ? (
                  <tr>
                    <td
                      colSpan={9}
                      className="px-4 py-12 text-center text-muted-foreground"
                    >
                      No walk-in orders found
                    </td>
                  </tr>
                ) : (
                  filteredOrders.map((order, i) => (
                    <motion.tr
                      key={order.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.03 }}
                      className="hover:bg-muted/50 transition-colors"
                    >
                      <td className="px-4 py-3">
                        <span className="font-medium text-primary">
                          {order.orderNumber}
                        </span>
                        <p className="text-xs text-muted-foreground">
                          {new Date(order.createdAt).toLocaleTimeString(
                            "en-IN",
                            {
                              hour: "2-digit",
                              minute: "2-digit",
                            },
                          )}
                        </p>
                      </td>
                      <td className="px-4 py-3">
                        <p className="font-medium">{order.patient.name}</p>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Phone className="h-3 w-3" />
                          {order.patient.mobile}
                        </div>
                        {order.patient.age && (
                          <p className="text-xs text-muted-foreground">
                            {order.patient.age}y, {order.patient.gender}
                          </p>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1">
                          <Building2 className="h-3 w-3 text-muted-foreground" />
                          <span className="text-xs font-medium">
                            {order.branchCode}
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground truncate max-w-[120px]">
                          {order.branchName?.split(" - ")[1] ||
                            order.branchName}
                        </p>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex flex-wrap gap-1 max-w-44">
                          {order.tests.slice(0, 2).map((test) => (
                            <Badge
                              key={test.id}
                              variant="secondary"
                              className="text-xs"
                            >
                              {test.testCode}
                            </Badge>
                          ))}
                          {order.packages.map((pkg) => (
                            <Badge
                              key={pkg.id}
                              variant="outline"
                              className="text-xs"
                            >
                              {pkg.packageName.slice(0, 15)}...
                            </Badge>
                          ))}
                          {order.tests.length > 2 && (
                            <Badge variant="outline" className="text-xs">
                              +{order.tests.length - 2}
                            </Badge>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        {order.referringDoctor ? (
                          <div className="flex items-center gap-1 text-xs">
                            <Stethoscope className="h-3 w-3 text-muted-foreground" />
                            <span>{order.referringDoctor}</span>
                          </div>
                        ) : (
                          <span className="text-xs text-muted-foreground">
                            Direct
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <p className="font-semibold">
                          {formatINR(order.totalAmount)}
                        </p>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <Badge
                          className={paymentStatusColors[order.paymentStatus]}
                        >
                          {order.paymentStatus}
                        </Badge>
                        {order.paymentMode && (
                          <p className="text-xs text-muted-foreground mt-1">
                            {order.paymentMode}
                          </p>
                        )}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <Badge className={statusColors[order.status]}>
                          {order.status}
                        </Badge>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                            >
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={() => openDetailDialog(order)}
                            >
                              <Eye className="mr-2 h-4 w-4" /> View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => openEditDialog(order)}
                            >
                              <Edit2 className="mr-2 h-4 w-4" /> Edit Patient
                              Info
                            </DropdownMenuItem>
                            {order.status !== "Completed" &&
                              order.status !== "Cancelled" && (
                                <>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem
                                    className="text-red-600 focus:text-red-600"
                                    onClick={() => {
                                      setOrderToCancel(order);
                                      setIsCancelDialogOpen(true);
                                    }}
                                    disabled={updateOrderMutation.isPending}
                                  >
                                    <XCircle className="mr-2 h-4 w-4" /> Cancel
                                    Order
                                  </DropdownMenuItem>
                                </>
                              )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </motion.tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </Card>

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

        {/* Cancel Confirmation Dialog */}
        <Dialog open={isCancelDialogOpen} onOpenChange={setIsCancelDialogOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Cancel Order</DialogTitle>
              <DialogDescription>
                Are you sure you want to cancel this order? This action cannot
                be undone.
              </DialogDescription>
            </DialogHeader>
            {orderToCancel && (
              <div className="py-4">
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <p className="font-medium text-red-800">
                    {orderToCancel.orderNumber}
                  </p>
                  <p className="text-sm text-red-600">
                    {orderToCancel.patient.name}
                  </p>
                </div>
              </div>
            )}
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsCancelDialogOpen(false)}
              >
                Keep Order
              </Button>
              <Button
                variant="destructive"
                onClick={handleCancelOrder}
                disabled={updateOrderMutation.isPending}
              >
                {updateOrderMutation.isPending
                  ? "Cancelling..."
                  : "Yes, Cancel Order"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
