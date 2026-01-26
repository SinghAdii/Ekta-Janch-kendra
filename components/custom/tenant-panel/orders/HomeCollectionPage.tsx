"use client";

import React, { useState, useCallback, useMemo } from "react";
import { motion } from "framer-motion";
import {
  Home,
  Search,
  Download,
  MoreVertical,
  Eye,
  Edit2,
  XCircle,
  Phone,
  User,
  Calendar,
  Clock,
  MapPin,
  Truck,
  AlertCircle,
  CheckCircle2,
  RefreshCw,
  X,
  Building2,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import { Skeleton } from "@/components/ui/skeleton";

import type { Order } from "./orders.types";
import {
  statusColors,
  collectionStatusColors,
  paymentStatusColors,
  DateRangePicker,
  ViewOrderDetailsDialog,
  EditOrderDialog,
} from "./orders.components";
import { labBranches } from "./orders.data";

// Hooks
import { useOrdersBySource, useUpdateOrder, useExportOrders } from "@/hooks/queries";
import { useOrdersStore } from "@/store";

function formatINR(amount: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

interface DateRange {
  from: Date | undefined;
  to: Date | undefined;
}

export default function HomeCollectionPage() {
  // React Query for data fetching with caching
  const { data: orders = [], isLoading, refetch, isFetching } = useOrdersBySource("Home Collection");
  
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

  // Local state
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [branchFilter, setBranchFilter] = useState<string>("all");
  const [dateRange, setDateRange] = useState<DateRange>({ from: undefined, to: undefined });
  const [isCancelDialogOpen, setIsCancelDialogOpen] = useState(false);
  const [orderToCancel, setOrderToCancel] = useState<Order | null>(null);

  // Memoized filtered orders
  const filteredOrders = useMemo(() => {
    let filtered = [...orders];

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (o) =>
          o.orderNumber.toLowerCase().includes(q) ||
          o.patient.name.toLowerCase().includes(q) ||
          o.patient.mobile.includes(q) ||
          o.homeCollection?.address.toLowerCase().includes(q)
      );
    }

    if (statusFilter && statusFilter !== "all") {
      filtered = filtered.filter((o) => o.homeCollection?.collectionStatus === statusFilter);
    }

    if (branchFilter && branchFilter !== "all") {
      filtered = filtered.filter((o) => o.branchId === branchFilter);
    }

    if (dateRange.from) {
      const fromDate = dateRange.from.toISOString().split("T")[0];
      filtered = filtered.filter((o) => {
        const scheduledDate = o.homeCollection?.scheduledDate;
        if (!scheduledDate) return false;
        return scheduledDate >= fromDate;
      });
    }
    if (dateRange.to) {
      const toDate = dateRange.to.toISOString().split("T")[0];
      filtered = filtered.filter((o) => {
        const scheduledDate = o.homeCollection?.scheduledDate;
        if (!scheduledDate) return false;
        return scheduledDate <= toDate;
      });
    }

    return filtered;
  }, [orders, searchQuery, statusFilter, branchFilter, dateRange]);

  // Check if filters are active
  const hasActiveFilters = searchQuery || statusFilter !== "all" || branchFilter !== "all" || dateRange.from || dateRange.to;

  // Clear all filters
  const clearFilters = useCallback(() => {
    setSearchQuery("");
    setStatusFilter("all");
    setBranchFilter("all");
    setDateRange({ from: undefined, to: undefined });
  }, []);

  // Memoized stats
  const stats = useMemo(() => {
    const today = new Date().toISOString().split("T")[0];
    return {
      totalCollections: orders.length,
      scheduledToday: orders.filter((o) => o.homeCollection?.scheduledDate === today).length,
      pendingPickups: orders.filter(
        (o) => o.homeCollection?.collectionStatus === "Scheduled" || o.homeCollection?.collectionStatus === "En Route"
      ).length,
      completedToday: orders.filter(
        (o) =>
          o.homeCollection?.collectionStatus === "Collected" &&
          o.homeCollection?.scheduledDate === today
      ).length,
    };
  }, [orders]);

  // Handle cancel order with optimistic update
  const handleCancelOrder = useCallback(async () => {
    if (!orderToCancel) return;

    try {
      await updateOrderMutation.mutateAsync({
        orderId: orderToCancel.id,
        updates: {
          status: "Cancelled",
          homeCollection: orderToCancel.homeCollection ? {
            ...orderToCancel.homeCollection,
            collectionStatus: "Cancelled",
          } : undefined,
        },
      });
      setIsCancelDialogOpen(false);
      setOrderToCancel(null);
    } catch (error) {
      console.error("Error cancelling order:", error);
    }
  }, [orderToCancel, updateOrderMutation]);

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
        source: "Home Collection",
        branchId: branchFilter !== "all" ? branchFilter : undefined,
      },
      format: "csv",
    });
  }, [exportMutation, branchFilter]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-slate-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
      <div className="p-6 space-y-6 max-w-full mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-purple-100 rounded-xl dark:bg-purple-900/30">
              <Home className="h-6 w-6 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight">Home Collection</h1>
              <p className="text-sm text-muted-foreground">Manage sample collection from patient homes</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleExport}
              disabled={exportMutation.isPending}
            >
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
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
            <Card className="border-l-4 border-l-purple-500">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-muted-foreground">Total Collections</p>
                    <p className="text-2xl font-bold">{stats.totalCollections}</p>
                  </div>
                  <Truck className="h-8 w-8 text-purple-200" />
                </div>
              </CardContent>
            </Card>
            <Card className="border-l-4 border-l-blue-500">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-muted-foreground">Today&apos;s Schedule</p>
                    <p className="text-2xl font-bold">{stats.scheduledToday}</p>
                  </div>
                  <Calendar className="h-8 w-8 text-blue-200" />
                </div>
              </CardContent>
            </Card>
            <Card className="border-l-4 border-l-amber-500">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-muted-foreground">Pending Pickups</p>
                    <p className="text-2xl font-bold">{stats.pendingPickups}</p>
                  </div>
                  <AlertCircle className="h-8 w-8 text-amber-200" />
                </div>
              </CardContent>
            </Card>
            <Card className="border-l-4 border-l-green-500">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-muted-foreground">Completed Today</p>
                    <p className="text-2xl font-bold">{stats.completedToday}</p>
                  </div>
                  <CheckCircle2 className="h-8 w-8 text-green-200" />
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Filters */}
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by name, mobile, or address..."
                  className="pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <DateRangePicker
                dateRange={dateRange}
                onDateRangeChange={setDateRange}
                className="w-full md:w-auto"
              />
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full md:w-44">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="Scheduled">Scheduled</SelectItem>
                  <SelectItem value="En Route">En Route</SelectItem>
                  <SelectItem value="Collected">Collected</SelectItem>
                  <SelectItem value="Cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
              <Select value={branchFilter} onValueChange={setBranchFilter}>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue placeholder="Branch" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Branches</SelectItem>
                  {labBranches.filter(b => b.isActive).map((branch) => (
                    <SelectItem key={branch.id} value={branch.id}>
                      {branch.code} - {branch.city}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {hasActiveFilters && (
                <Button variant="ghost" size="sm" onClick={clearFilters}>
                  <X className="h-4 w-4 mr-1" />
                  Clear
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Collections List */}
        <div className="grid gap-4">
          {isLoading ? (
            [...Array(3)].map((_, i) => (
              <Skeleton key={i} className="h-48 rounded-lg" />
            ))
          ) : filteredOrders.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center text-muted-foreground">
                No home collection orders found
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
                  <div className="flex flex-col lg:flex-row">
                    {/* Main Info */}
                    <div className="flex-1 p-4 space-y-3">
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-primary">{order.orderNumber}</span>
                            <Badge className={collectionStatusColors[order.homeCollection?.collectionStatus || "Scheduled"]}>
                              {order.homeCollection?.collectionStatus}
                            </Badge>
                          </div>
                          <p className="text-xs text-muted-foreground mt-1">
                            Order: <Badge className={statusColors[order.status]}>{order.status}</Badge>
                          </p>
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
                            {order.status !== "Completed" && order.status !== "Cancelled" && (
                              <>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                  onClick={() => {
                                    setOrderToCancel(order);
                                    setIsCancelDialogOpen(true);
                                  }}
                                  className="text-red-600 focus:text-red-600"
                                >
                                  <XCircle className="mr-2 h-4 w-4" /> Cancel Order
                                </DropdownMenuItem>
                              </>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>

                      {/* Patient & Schedule */}
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <div className="flex items-center gap-2 text-sm">
                            <User className="h-4 w-4 text-muted-foreground" />
                            <span className="font-medium">{order.patient.name}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Phone className="h-4 w-4" />
                            <span>{order.patient.mobile}</span>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <div className="flex items-center gap-2 text-sm">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            <span className="font-medium">{order.homeCollection?.scheduledDate}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Clock className="h-4 w-4" />
                            <span>{order.homeCollection?.scheduledTime}</span>
                          </div>
                        </div>
                      </div>

                      {/* Address */}
                      <div className="flex items-start gap-2 text-sm bg-muted/50 p-3 rounded-lg">
                        <MapPin className="h-4 w-4 mt-0.5 text-muted-foreground shrink-0" />
                        <span>
                          {order.homeCollection?.address}, {order.homeCollection?.city} -{" "}
                          {order.homeCollection?.pincode}
                        </span>
                      </div>

                      {/* Tests */}
                      {order.tests.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {order.tests.map((test) => (
                            <Badge key={test.id} variant="secondary" className="text-xs">
                              {test.testCode}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Side Panel - Collector & Amount */}
                    <div className="lg:w-56 bg-muted/30 p-4 flex flex-col justify-between border-t lg:border-t-0 lg:border-l">
                      <div className="space-y-3">
                        <div>
                          <p className="text-xs text-muted-foreground mb-1">Collector</p>
                          {order.homeCollection?.collectorName ? (
                            <div>
                              <p className="font-medium text-sm">{order.homeCollection.collectorName}</p>
                              <p className="text-xs text-muted-foreground">{order.homeCollection.collectorMobile}</p>
                            </div>
                          ) : (
                            <p className="text-sm text-muted-foreground italic">Not assigned</p>
                          )}
                        </div>
                      </div>
                      <div className="mt-4 pt-4 border-t">
                        <p className="text-xs text-muted-foreground">Amount</p>
                        <p className="text-xl font-bold">{formatINR(order.totalAmount)}</p>
                        <Badge className={`${paymentStatusColors[order.paymentStatus]} mt-1`}>
                          {order.paymentStatus}
                        </Badge>
                      </div>
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

        {/* Cancel Confirmation Dialog */}
        <Dialog open={isCancelDialogOpen} onOpenChange={setIsCancelDialogOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Cancel Order</DialogTitle>
              <DialogDescription>
                Are you sure you want to cancel this order? This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            {orderToCancel && (
              <div className="py-4">
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <p className="font-medium text-red-800">{orderToCancel.orderNumber}</p>
                  <p className="text-sm text-red-600">{orderToCancel.patient.name}</p>
                  <p className="text-sm text-red-600">{formatINR(orderToCancel.totalAmount)}</p>
                </div>
              </div>
            )}
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsCancelDialogOpen(false)}>
                Keep Order
              </Button>
              <Button 
                variant="destructive"
                onClick={handleCancelOrder}
                disabled={updateOrderMutation.isPending}
              >
                {updateOrderMutation.isPending ? "Cancelling..." : "Yes, Cancel Order"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
