"use client";

import React, { useState, useCallback, useMemo } from "react";
import { motion } from "framer-motion";
import {
  Layers,
  Search,
  Download,
  MoreVertical,
  Eye,
  Edit2,
  XCircle,
  Phone,
  Mail,
  IndianRupee,
  Clock,
  Home,
  Building,
  Building2,
  Globe,
  Package,
  Calendar,
  RefreshCw,
  X,
  Info,
  CheckCircle2,
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";

import type { Order, OrderSource } from "./orders.types";
import {
  statusColors,
  paymentStatusColors,
  DateRangePicker,
  ViewOrderDetailsDialog,
  EditOrderDialog,
} from "./orders.components";
import { OrderStatusFlow, getStatusMessage } from "./OrderStatusFlow";
import { labBranches } from "./orders.data";

// Hooks
import { useOrderStats } from "@/hooks";
import { useOrders, useUpdateOrder, useExportOrders } from "@/hooks/queries";
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

const sourceIcons: Record<string, React.ReactNode> = {
  "Walk-In": <Building className="h-4 w-4" />,
  "Home Collection": <Home className="h-4 w-4" />,
  "Online Test Booking": <Globe className="h-4 w-4" />,
  "Online Package Booking": <Package className="h-4 w-4" />,
  "Slot Booking": <Calendar className="h-4 w-4" />,
};

const sourceColors: Record<string, string> = {
  "Walk-In": "bg-blue-100 text-blue-700 border-blue-200",
  "Home Collection": "bg-green-100 text-green-700 border-green-200",
  "Online Test Booking": "bg-purple-100 text-purple-700 border-purple-200",
  "Online Package Booking": "bg-pink-100 text-pink-700 border-pink-200",
  "Slot Booking": "bg-cyan-100 text-cyan-700 border-cyan-200",
};

export default function AllOrdersPage() {
  // React Query for data fetching with caching
  const { data: orders = [], isLoading, refetch, isFetching } = useOrders();
  
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

  // Local filter state
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [sourceFilter, setSourceFilter] = useState<string>("all");
  const [branchFilter, setBranchFilter] = useState<string>("all");
  const [paymentFilter, setPaymentFilter] = useState<string>("all");
  const [dateRange, setDateRange] = useState<DateRange>({ from: undefined, to: undefined });

  // Cancel dialog state
  const [isCancelDialogOpen, setIsCancelDialogOpen] = useState(false);
  const [orderToCancel, setOrderToCancel] = useState<Order | null>(null);

  // Change branch dialog state
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
          o.patient.mobile.includes(q)
      );
    }

    if (statusFilter && statusFilter !== "all") {
      filtered = filtered.filter((o) => o.status === statusFilter);
    }

    if (sourceFilter && sourceFilter !== "all") {
      filtered = filtered.filter((o) => o.source === sourceFilter);
    }

    if (branchFilter && branchFilter !== "all") {
      filtered = filtered.filter((o) => o.branchId === branchFilter);
    }

    if (paymentFilter && paymentFilter !== "all") {
      filtered = filtered.filter((o) => o.paymentStatus === paymentFilter);
    }

    if (dateRange.from) {
      const fromDate = dateRange.from.toISOString().split("T")[0];
      filtered = filtered.filter((o) => o.createdAt >= fromDate);
    }
    if (dateRange.to) {
      const toDate = dateRange.to.toISOString().split("T")[0];
      filtered = filtered.filter((o) => o.createdAt.split("T")[0] <= toDate);
    }

    return filtered;
  }, [orders, searchQuery, statusFilter, sourceFilter, branchFilter, paymentFilter, dateRange]);

  // Calculate stats using centralized hook
  const stats = useOrderStats(orders);

  // Check if filters are active
  const hasActiveFilters = searchQuery || statusFilter !== "all" || sourceFilter !== "all" || branchFilter !== "all" || paymentFilter !== "all" || dateRange.from || dateRange.to;

  // Clear all filters
  const clearFilters = useCallback(() => {
    setSearchQuery("");
    setStatusFilter("all");
    setSourceFilter("all");
    setBranchFilter("all");
    setPaymentFilter("all");
    setDateRange({ from: undefined, to: undefined });
  }, []);

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

  // Handle change branch
  const handleChangeBranch = useCallback(async () => {
    if (!orderToChangeBranch || !selectedBranchId) return;
    const selectedBranch = labBranches.find((b) => b.id === selectedBranchId);
    if (!selectedBranch) return;

    try {
      await updateOrderMutation.mutateAsync({
        orderId: orderToChangeBranch.id,
        updates: {
          branchId: selectedBranchId,
          branchName: `${selectedBranch.name} - ${selectedBranch.city}`,
          branchCode: selectedBranch.code,
        },
      });
      setIsChangeBranchDialogOpen(false);
      setOrderToChangeBranch(null);
      setSelectedBranchId("");
    } catch (error) {
      console.error("Error changing branch:", error);
    }
  }, [orderToChangeBranch, selectedBranchId, updateOrderMutation]);

  // Handle order edit with optimistic update (patient details only)
  const handleEditOrder = useCallback(
    async (updatedData: Partial<Order>) => {
      if (!selectedOrder) return;
      try {
        // Only allow editing patient details, notes
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
        branchId: branchFilter !== "all" ? branchFilter : undefined,
        source: sourceFilter !== "all" ? sourceFilter as OrderSource : undefined,
      },
      format: "csv",
    });
  }, [exportMutation, branchFilter, sourceFilter]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
      <div className="p-6 space-y-6 max-w-full mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl shadow-lg">
              <Layers className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight">All Orders</h1>
              <p className="text-sm text-muted-foreground">Complete overview of all orders from all sources</p>
            </div>
          </div>
          <div className="flex gap-2">
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
            <Card className="border-l-4 border-l-blue-500">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-muted-foreground">Total Orders</p>
                    <p className="text-2xl font-bold">{stats.total}</p>
                  </div>
                  <Layers className="h-8 w-8 text-blue-200" />
                </div>
              </CardContent>
            </Card>
            <Card className="border-l-4 border-l-amber-500">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-muted-foreground">Pending</p>
                    <p className="text-2xl font-bold">{stats.pending}</p>
                  </div>
                  <Clock className="h-8 w-8 text-amber-200" />
                </div>
              </CardContent>
            </Card>
            <Card className="border-l-4 border-l-green-500">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-muted-foreground">Completed</p>
                    <p className="text-2xl font-bold">{stats.completed}</p>
                  </div>
                  <CheckCircle2 className="h-8 w-8 text-green-200" />
                </div>
              </CardContent>
            </Card>
            <Card className="border-l-4 border-l-purple-500">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-muted-foreground">Total Revenue</p>
                    <p className="text-2xl font-bold">{formatINR(stats.paidRevenue)}</p>
                  </div>
                  <IndianRupee className="h-8 w-8 text-purple-200" />
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
                  placeholder="Search by order #, patient name, or mobile..."
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
              <Select value={sourceFilter} onValueChange={setSourceFilter}>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue placeholder="Source" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Sources</SelectItem>
                  <SelectItem value="Walk-In">Walk-In</SelectItem>
                  <SelectItem value="Home Collection">Home Collection</SelectItem>
                  <SelectItem value="Online Test Booking">Online Test Booking</SelectItem>
                  <SelectItem value="Online Package Booking">Online Package Booking</SelectItem>
                  <SelectItem value="Slot Booking">Slot Booking</SelectItem>
                </SelectContent>
              </Select>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full md:w-44">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="Pending">Pending</SelectItem>
                  <SelectItem value="Sample Collected">Sample Collected</SelectItem>
                  <SelectItem value="Processing">Processing</SelectItem>
                  <SelectItem value="Report Ready">Report Ready</SelectItem>
                  <SelectItem value="Completed">Completed</SelectItem>
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
              <Select value={paymentFilter} onValueChange={setPaymentFilter}>
                <SelectTrigger className="w-full md:w-40">
                  <SelectValue placeholder="Payment" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Payments</SelectItem>
                  <SelectItem value="Pending">Pending</SelectItem>
                  <SelectItem value="Paid">Paid</SelectItem>
                  <SelectItem value="Partial">Partial</SelectItem>
                  <SelectItem value="Refunded">Refunded</SelectItem>
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
          <CardContent className="p-0">
            {isLoading ? (
              <div className="p-4 space-y-4">
                {[...Array(5)].map((_, i) => (
                  <Skeleton key={i} className="h-16 rounded-lg" />
                ))}
              </div>
            ) : filteredOrders.length === 0 ? (
              <div className="p-12 text-center text-muted-foreground">No orders found</div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Order #</TableHead>
                      <TableHead>Source</TableHead>
                      <TableHead>Branch</TableHead>
                      <TableHead>Patient</TableHead>
                      <TableHead>Contact</TableHead>
                      <TableHead>Tests/Packages</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Payment</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredOrders.map((order, i) => (
                      <motion.tr
                        key={order.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.02 }}
                        className="border-b hover:bg-muted/50"
                      >
                        <TableCell className="font-semibold text-primary">{order.orderNumber}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className={sourceColors[order.source]}>
                            {sourceIcons[order.source]}
                            <span className="ml-1">{order.source}</span>
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Building2 className="h-3 w-3 text-muted-foreground" />
                            <span className="text-xs font-medium">{order.branchCode}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium">{order.patient.name}</p>
                            {order.patient.age && (
                              <p className="text-xs text-muted-foreground">
                                {order.patient.age} yrs, {order.patient.gender}
                              </p>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <div className="flex items-center gap-1 text-sm">
                              <Phone className="h-3 w-3" />
                              {order.patient.mobile}
                            </div>
                            {order.patient.email && (
                              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                <Mail className="h-3 w-3" />
                                <span className="truncate max-w-[120px]">{order.patient.email}</span>
                              </div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1 max-w-[200px]">
                            {order.tests.slice(0, 2).map((t) => (
                              <Badge key={t.id} variant="secondary" className="text-xs">
                                {t.testCode}
                              </Badge>
                            ))}
                            {order.packages.slice(0, 1).map((p) => (
                              <Badge key={p.id} variant="outline" className="text-xs bg-purple-50">
                                {p.packageName}
                              </Badge>
                            ))}
                            {order.tests.length + order.packages.length > 3 && (
                              <Badge variant="outline" className="text-xs">
                                +{order.tests.length + order.packages.length - 3}
                              </Badge>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="font-semibold">{formatINR(order.totalAmount)}</TableCell>
                        <TableCell>
                          <Badge className={paymentStatusColors[order.paymentStatus]}>
                            {order.paymentStatus}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge className={statusColors[order.status]}>{order.status}</Badge>
                        </TableCell>
                        <TableCell className="text-xs text-muted-foreground">
                          {new Date(order.createdAt).toLocaleDateString("en-IN", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          })}
                        </TableCell>
                        <TableCell className="text-right">
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
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Info Banner about Status Management */}
        <Card className="border-blue-200 bg-blue-50 dark:bg-blue-900/20">
          <CardContent className="p-4 flex items-center gap-3">
            <Info className="h-5 w-5 text-blue-600 shrink-0" />
            <div>
              <p className="text-sm text-blue-800 dark:text-blue-400">
                <strong>Note:</strong> Order status is automatically managed through Lab Processing workflow.
                You can view, edit patient details, and change branch here.
              </p>
            </div>
          </CardContent>
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
                Are you sure you want to cancel this order? This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            {orderToCancel && (
              <div className="py-4">
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <p className="font-medium text-red-800">{orderToCancel.orderNumber}</p>
                  <p className="text-sm text-red-600">{orderToCancel.patient.name}</p>
                  <p className="text-sm text-red-600">Source: {orderToCancel.source}</p>
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
              <DialogDescription>Select a new branch for this order.</DialogDescription>
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
                      {labBranches
                        .filter((b) => b.isActive)
                        .map((branch) => (
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
                disabled={
                  updateOrderMutation.isPending ||
                  !selectedBranchId ||
                  selectedBranchId === orderToChangeBranch?.branchId
                }
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
