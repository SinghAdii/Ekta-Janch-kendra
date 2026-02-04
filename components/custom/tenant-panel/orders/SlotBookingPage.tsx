"use client";

import React, { useState, useCallback, useMemo } from "react";
import { motion } from "framer-motion";
import {
  Clock,
  Search,
  Download,
  MoreVertical,
  Eye,
  Edit2,
  XCircle,
  Phone,
  User,
  Calendar,
  RefreshCw,
  X,
  Building2,
  IndianRupee,
  ArrowRight,
  AlertTriangle,
} from "lucide-react";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
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
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import type { Order } from "./orders.types";
import {
  statusColors,
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

// Status colors for the order flow
const orderStatusColors: Record<string, string> = {
  Pending: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  Processing: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  "Report Ready": "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
  Completed: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  Cancelled: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
  "Sample Collected": "bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-400",
};

export default function SlotBookingPage() {
  // React Query for data fetching with caching
  const { data: orders = [], isLoading, refetch, isFetching } = useOrdersBySource("Slot Booking");
  
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
  const [paymentFilter, setPaymentFilter] = useState<string>("all");
  const [dateRange, setDateRange] = useState<DateRange>({ from: undefined, to: undefined });
  
  // Dialog states
  const [isCancelDialogOpen, setIsCancelDialogOpen] = useState(false);
  const [orderToCancel, setOrderToCancel] = useState<Order | null>(null);
  
  // Change branch dialog
  const [isChangeBranchDialogOpen, setIsChangeBranchDialogOpen] = useState(false);
  const [orderToChangeBranch, setOrderToChangeBranch] = useState<Order | null>(null);
  const [selectedBranchId, setSelectedBranchId] = useState<string>("");

  // Memoized filtered orders
  const filteredOrders = useMemo(() => {
    let filtered = [...orders];

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (o) =>
          o.orderNumber.toLowerCase().includes(q) ||
          o.patient.name.toLowerCase().includes(q) ||
          o.patient.mobile.includes(q),
      );
    }

    if (statusFilter && statusFilter !== "all") {
      filtered = filtered.filter((o) => o.status === statusFilter);
    }

    if (branchFilter && branchFilter !== "all") {
      filtered = filtered.filter((o) => o.branchId === branchFilter);
    }

    if (paymentFilter && paymentFilter !== "all") {
      filtered = filtered.filter((o) => o.paymentStatus === paymentFilter);
    }

    if (dateRange.from) {
      const fromDate = dateRange.from.toISOString().split("T")[0];
      filtered = filtered.filter((o) => {
        const slotDate = o.slotBooking?.slotDate;
        if (!slotDate) return false;
        return slotDate >= fromDate;
      });
    }
    if (dateRange.to) {
      const toDate = dateRange.to.toISOString().split("T")[0];
      filtered = filtered.filter((o) => {
        const slotDate = o.slotBooking?.slotDate;
        if (!slotDate) return false;
        return slotDate <= toDate;
      });
    }

    return filtered;
  }, [orders, searchQuery, statusFilter, branchFilter, paymentFilter, dateRange]);

  // Check if filters are active
  const hasActiveFilters = searchQuery || statusFilter !== "all" || branchFilter !== "all" || paymentFilter !== "all" || dateRange.from || dateRange.to;

  // Clear all filters
  const clearFilters = useCallback(() => {
    setSearchQuery("");
    setStatusFilter("all");
    setBranchFilter("all");
    setPaymentFilter("all");
    setDateRange({ from: undefined, to: undefined });
  }, []);

  // Memoized stats
  const stats = useMemo(() => {
    const today = new Date().toISOString().split("T")[0];
    return {
      totalSlots: orders.length,
      pendingSlots: orders.filter((o) => o.status === "Pending").length,
      processingSlots: orders.filter((o) => o.status === "Processing").length,
      completedSlots: orders.filter((o) => o.status === "Completed").length,
      todaySlots: orders.filter((o) => o.slotBooking?.slotDate === today).length,
    };
  }, [orders]);

  // Handle cancel order with optimistic update
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

  // Handle change branch
  const handleChangeBranch = useCallback(async () => {
    if (!orderToChangeBranch || !selectedBranchId) return;
    const selectedBranch = labBranches.find(b => b.id === selectedBranchId);
    if (!selectedBranch) return;
    
    try {
      await updateOrderMutation.mutateAsync({
        orderId: orderToChangeBranch.id,
        updates: { 
          branchId: selectedBranchId,
          branchName: `${selectedBranch.name} - ${selectedBranch.city}`,
        },
      });
      setIsChangeBranchDialogOpen(false);
      setOrderToChangeBranch(null);
      setSelectedBranchId("");
    } catch (error) {
      console.error("Error changing branch:", error);
    }
  }, [orderToChangeBranch, selectedBranchId, updateOrderMutation]);

  // Handle order edit with optimistic update (only patient details can be edited)
  const handleEditOrder = useCallback(
    async (updatedData: Partial<Order>) => {
      if (!selectedOrder) return;
      try {
        // Only allow editing patient details
        await updateOrderMutation.mutateAsync({
          orderId: selectedOrder.id,
          updates: {
            patient: updatedData.patient,
            notes: updatedData.notes,
          },
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
        source: "Slot Booking",
        branchId: branchFilter !== "all" ? branchFilter : undefined,
      },
      format: "csv",
    });
  }, [exportMutation, branchFilter]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-slate-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
      <div className="p-6 space-y-6 max-w-full mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-amber-100 rounded-xl dark:bg-amber-900/30">
              <Clock className="h-6 w-6 text-amber-600 dark:text-amber-400" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight">
                Slot Bookings
              </h1>
              <p className="text-sm text-muted-foreground">
                View slot booking orders • Complete details in Lab Management
              </p>
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

        {/* Info Banner */}
        <Card className="border-blue-200 bg-blue-50 dark:bg-blue-900/20">
          <CardContent className="p-4 flex items-center gap-3">
            <AlertTriangle className="h-5 w-5 text-blue-600" />
            <div className="flex-1">
              <p className="font-medium text-blue-800 dark:text-blue-400">
                Complete details and process orders in Lab Management
              </p>
              <p className="text-sm text-blue-600 dark:text-blue-500">
                You can only view and edit patient personal details here. Use Lab Management → Slot Booking to complete test details and move to processing.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Stats */}
        {isLoading ? (
          <div className="grid gap-4 md:grid-cols-5">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="h-24 rounded-lg" />
            ))}
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-5">
            <Card className="border-l-4 border-l-amber-500">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-muted-foreground">Total</p>
                    <p className="text-2xl font-bold">{stats.totalSlots}</p>
                  </div>
                  <Clock className="h-8 w-8 text-amber-200" />
                </div>
              </CardContent>
            </Card>
            <Card className="border-l-4 border-l-orange-500">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-muted-foreground">Pending</p>
                    <p className="text-2xl font-bold">{stats.pendingSlots}</p>
                  </div>
                  <Clock className="h-8 w-8 text-orange-200" />
                </div>
              </CardContent>
            </Card>
            <Card className="border-l-4 border-l-blue-500">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-muted-foreground">Processing</p>
                    <p className="text-2xl font-bold">{stats.processingSlots}</p>
                  </div>
                  <ArrowRight className="h-8 w-8 text-blue-200" />
                </div>
              </CardContent>
            </Card>
            <Card className="border-l-4 border-l-green-500">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-muted-foreground">Completed</p>
                    <p className="text-2xl font-bold">{stats.completedSlots}</p>
                  </div>
                  <Calendar className="h-8 w-8 text-green-200" />
                </div>
              </CardContent>
            </Card>
            <Card className="border-l-4 border-l-purple-500">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-muted-foreground">Today&apos;s Slots</p>
                    <p className="text-2xl font-bold">{stats.todaySlots}</p>
                  </div>
                  <Calendar className="h-8 w-8 text-purple-200" />
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
                  placeholder="Search by name, mobile or order number..."
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
                <SelectTrigger className="w-full md:w-40">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="Pending">Pending</SelectItem>
                  <SelectItem value="Processing">Processing</SelectItem>
                  <SelectItem value="Report Ready">Report Ready</SelectItem>
                  <SelectItem value="Completed">Completed</SelectItem>
                  <SelectItem value="Cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
              <Select value={paymentFilter} onValueChange={setPaymentFilter}>
                <SelectTrigger className="w-full md:w-40">
                  <SelectValue placeholder="Payment" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Payments</SelectItem>
                  <SelectItem value="Paid">Paid</SelectItem>
                  <SelectItem value="Pending">Pending</SelectItem>
                  <SelectItem value="Partial">Partial</SelectItem>
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

        {/* Orders Table */}
        <Card>
          <ScrollArea className="h-[calc(100vh-500px)] min-h-[400px]">
            <Table>
              <TableHeader className="sticky top-0 bg-background z-10">
                <TableRow>
                  <TableHead className="w-[120px]">Order #</TableHead>
                  <TableHead>Patient</TableHead>
                  <TableHead>Slot Date/Time</TableHead>
                  <TableHead>Branch</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Payment</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                  <TableHead className="w-[80px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  [...Array(5)].map((_, i) => (
                    <TableRow key={i}>
                      <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                      <TableCell><Skeleton className="h-10 w-40" /></TableCell>
                      <TableCell><Skeleton className="h-10 w-32" /></TableCell>
                      <TableCell><Skeleton className="h-5 w-28" /></TableCell>
                      <TableCell><Skeleton className="h-6 w-20" /></TableCell>
                      <TableCell><Skeleton className="h-6 w-16" /></TableCell>
                      <TableCell><Skeleton className="h-5 w-20" /></TableCell>
                      <TableCell><Skeleton className="h-8 w-8" /></TableCell>
                    </TableRow>
                  ))
                ) : filteredOrders.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="h-32 text-center text-muted-foreground">
                      No slot bookings found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredOrders.map((order, i) => (
                    <motion.tr
                      key={order.id}
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.02 }}
                      className="border-b hover:bg-muted/50"
                    >
                      <TableCell>
                        <span className="font-mono font-semibold text-amber-600 text-sm">
                          {order.orderNumber}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-2">
                            <User className="h-3.5 w-3.5 text-muted-foreground" />
                            <span className="font-medium text-sm">{order.patient.name}</span>
                          </div>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <Phone className="h-3 w-3" />
                            {order.patient.mobile}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-1.5 text-sm font-medium">
                            <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                            {order.slotBooking?.slotDate || "-"}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {order.slotBooking?.slotTime || "-"}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1.5 text-xs">
                          <Building2 className="h-3.5 w-3.5 text-muted-foreground" />
                          <span className="truncate max-w-[120px]">{order.branchName}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={orderStatusColors[order.status] || statusColors[order.status]}>
                          {order.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {order.slotBooking?.isDetailsComplete ? (
                          <Badge className={paymentStatusColors[order.paymentStatus]}>
                            {order.paymentStatus}
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="text-gray-500 border-gray-300">
                            Pending Details
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        {order.slotBooking?.isDetailsComplete ? (
                          <div className="flex items-center justify-end gap-1">
                            <IndianRupee className="h-3.5 w-3.5 text-muted-foreground" />
                            <span className="font-semibold">
                              {order.totalAmount > 0 ? formatINR(order.totalAmount).replace("₹", "") : "-"}
                            </span>
                          </div>
                        ) : (
                          <span className="text-muted-foreground text-sm">-</span>
                        )}
                      </TableCell>
                      <TableCell>
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
                              <Edit2 className="mr-2 h-4 w-4" /> Edit Patient Info
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              onClick={() => {
                                setOrderToChangeBranch(order);
                                setSelectedBranchId(order.branchId);
                                setIsChangeBranchDialogOpen(true);
                              }}
                            >
                              <Building2 className="mr-2 h-4 w-4" /> Change Branch
                            </DropdownMenuItem>
                            {order.status !== "Completed" && order.status !== "Cancelled" && (
                              <>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                  className="text-red-600"
                                  onClick={() => {
                                    setOrderToCancel(order);
                                    setIsCancelDialogOpen(true);
                                  }}
                                >
                                  <XCircle className="mr-2 h-4 w-4" /> Cancel Order
                                </DropdownMenuItem>
                              </>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </motion.tr>
                  ))
                )}
              </TableBody>
            </Table>
          </ScrollArea>
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
                Are you sure you want to cancel this slot booking? This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            {orderToCancel && (
              <div className="py-4">
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <p className="font-medium text-red-800">{orderToCancel.orderNumber}</p>
                  <p className="text-sm text-red-600">{orderToCancel.patient.name}</p>
                  <p className="text-sm text-red-600">
                    Slot: {orderToCancel.slotBooking?.slotDate} at {orderToCancel.slotBooking?.slotTime}
                  </p>
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

        {/* Change Branch Dialog */}
        <Dialog open={isChangeBranchDialogOpen} onOpenChange={setIsChangeBranchDialogOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Change Branch</DialogTitle>
              <DialogDescription>
                Select a new branch for this order.
              </DialogDescription>
            </DialogHeader>
            {orderToChangeBranch && (
              <div className="py-4 space-y-4">
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                  <p className="font-medium text-amber-800">{orderToChangeBranch.orderNumber}</p>
                  <p className="text-sm text-amber-600">{orderToChangeBranch.patient.name}</p>
                  <p className="text-sm text-amber-600">
                    Current Branch: {orderToChangeBranch.branchName}
                  </p>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Select New Branch</label>
                  <Select value={selectedBranchId} onValueChange={setSelectedBranchId}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select branch" />
                    </SelectTrigger>
                    <SelectContent>
                      {labBranches.filter(b => b.isActive).map((branch) => (
                        <SelectItem key={branch.id} value={branch.id}>
                          {branch.code} - {branch.name}, {branch.city}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsChangeBranchDialogOpen(false)}>
                Cancel
              </Button>
              <Button 
                onClick={handleChangeBranch}
                disabled={updateOrderMutation.isPending || !selectedBranchId || selectedBranchId === orderToChangeBranch?.branchId}
              >
                {updateOrderMutation.isPending ? "Updating..." : "Update Branch"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
