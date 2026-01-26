"use client";

import React, { useState, useCallback, useMemo } from "react";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  CalendarDays,
  Search,
  Clock,
  Phone,
  CheckCircle2,
  XCircle,
  Building2,
  Download,
  Eye,
  Edit2,
  MoreVertical,
  User,
  CreditCard,
  Package,
  FlaskConical,
  Loader2,
  RefreshCw,
  Play,
  FileCheck,
  CheckCheck,
  ChevronRight,
  ChevronDown,
  X,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

// Import from orders module for data correlation
import type { Order, OrderStatus, PaymentMode as OrderPaymentMode, PaymentStatus } from "../orders/orders.types";
import { useOrdersBySource, useUpdateOrder, useExportOrders } from "@/hooks/queries";
import { paymentStatusColors } from "../orders/orders.components";

import type { LabPackage, LabTest } from "./lab-management.types";
import { labPackages, labTests, testCategories, packageCategories, calculateTotal, generateSampleId, labBranches } from "./lab-management.data";

// ============ STATUS COLORS ============
const statusColors: Record<string, string> = {
  Pending: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  Processing: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  "Report Ready": "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
  Completed: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  Cancelled: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
  "Sample Collected": "bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-400",
};

// Format currency
function formatINR(amount: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

// ============ ZOD SCHEMA FOR COMPLETION FORM ============
const slotCompletionSchema = z.object({
  // Patient Details
  fullName: z.string().min(2, "Name must be at least 2 characters"),
  mobile: z.string().regex(/^[6-9]\d{9}$/, "Please enter a valid 10-digit mobile number"),
  email: z.string().email("Please enter a valid email").optional().or(z.literal("")),
  age: z.number({ message: "Please enter age" }).min(1, "Age must be at least 1").max(120, "Age cannot exceed 120"),
  gender: z.enum(["Male", "Female", "Other"], { message: "Please select gender" }),
  address: z.string().max(200, "Address cannot exceed 200 characters").optional().or(z.literal("")),
  
  // Test/Package Selection
  selectedTests: z.array(z.string()).optional(),
  selectedPackages: z.array(z.string()).optional(),
  
  // Payment Details
  paymentMode: z.enum(["Cash", "UPI", "Card", "NetBanking", "Pay Later"], { message: "Please select payment mode" }),
  paymentStatus: z.enum(["Paid", "Pending", "Partial"], { message: "Please select payment status" }),
  paidAmount: z.number().min(0, "Amount must be positive").optional(),
  
  // Notes
  notes: z.string().max(500, "Notes cannot exceed 500 characters").optional().or(z.literal("")),
  referringDoctor: z.string().max(100, "Doctor name cannot exceed 100 characters").optional().or(z.literal("")),
}).refine(
  (data) =>
    (data.selectedTests && data.selectedTests.length > 0) ||
    (data.selectedPackages && data.selectedPackages.length > 0),
  {
    message: "Please select at least one test or package",
    path: ["selectedTests"],
  }
);

type SlotCompletionForm = z.infer<typeof slotCompletionSchema>;

// ============ PROPS INTERFACE ============
interface SlotBookingManagementPageProps {
  onMoveToProcessing?: (order: Order) => void;
}

export default function SlotBookingManagementPage({ 
  onMoveToProcessing,
}: SlotBookingManagementPageProps) {
  // ============ REACT QUERY - Shared Data Source with Orders Module ============
  const { data: ordersData = [], isLoading, refetch, isFetching } = useOrdersBySource("Slot Booking");
  const updateOrderMutation = useUpdateOrder();
  const exportMutation = useExportOrders();

  // ============ STATE ============
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [branchFilter, setBranchFilter] = useState<string>("all");
  const [paymentFilter, setPaymentFilter] = useState<string>("all");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);
  
  // Completion Dialog State
  const [isCompletionDialogOpen, setIsCompletionDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [completionSuccess, setCompletionSuccess] = useState(false);
  const [generatedSampleId, setGeneratedSampleId] = useState<string>("");
  const [shouldMoveToProcessing, setShouldMoveToProcessing] = useState(false);
  
  // Test/Package Selection State
  const [selectedTests, setSelectedTests] = useState<string[]>([]);
  const [selectedPackages, setSelectedPackages] = useState<string[]>([]);
  const [testSearchQuery, setTestSearchQuery] = useState("");
  const [packageSearchQuery, setPackageSearchQuery] = useState("");
  const [expandedTestCategories, setExpandedTestCategories] = useState<string[]>([]);
  const [expandedPackageCategories, setExpandedPackageCategories] = useState<string[]>([]);

  // Cancel Dialog
  const [isCancelDialogOpen, setIsCancelDialogOpen] = useState(false);
  const [orderToCancel, setOrderToCancel] = useState<Order | null>(null);

  // Move to Processing Confirmation
  const [isMoveDialogOpen, setIsMoveDialogOpen] = useState(false);
  const [orderToMove, setOrderToMove] = useState<Order | null>(null);

  // Form setup
  const form = useForm<SlotCompletionForm>({
    resolver: zodResolver(slotCompletionSchema),
    defaultValues: {
      fullName: "",
      mobile: "",
      email: "",
      age: undefined,
      gender: undefined,
      address: "",
      selectedTests: [],
      selectedPackages: [],
      paymentMode: undefined,
      paymentStatus: "Paid",
      paidAmount: 0,
      notes: "",
      referringDoctor: "",
    },
  });

  // ============ FILTER DATA (Memoized) ============
  const filteredOrders = useMemo(() => {
    let filtered = [...ordersData];

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (o) =>
          o.orderNumber.toLowerCase().includes(q) ||
          o.patient.name.toLowerCase().includes(q) ||
          o.patient.mobile.includes(q) ||
          o.sampleId?.toLowerCase().includes(q)
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

    return filtered;
  }, [ordersData, searchQuery, statusFilter, branchFilter, paymentFilter]);

  // Check if filters are active
  const hasActiveFilters = searchQuery || statusFilter !== "all" || branchFilter !== "all" || paymentFilter !== "all";

  // Clear all filters
  const clearFilters = useCallback(() => {
    setSearchQuery("");
    setStatusFilter("all");
    setBranchFilter("all");
    setPaymentFilter("all");
  }, []);

  // ============ STATS - Memoized for performance ============
  const stats = useMemo(() => {
    const today = new Date().toISOString().split("T")[0];
    return {
      total: ordersData.length,
      pending: ordersData.filter((o) => o.status === "Pending").length,
      processing: ordersData.filter((o) => o.status === "Processing").length,
      reportReady: ordersData.filter((o) => o.status === "Report Ready").length,
      completed: ordersData.filter((o) => o.status === "Completed").length,
      todaySlots: ordersData.filter((o) => o.slotBooking?.slotDate === today).length,
    };
  }, [ordersData]);

  // ============ COMPLETION DIALOG ============
  const openCompletionDialog = useCallback((order: Order) => {
    setSelectedOrder(order);
    setCompletionSuccess(false);
    
    // Map payment mode to valid form values (exclude "Cheque" which is not in form schema)
    const validPaymentModes = ["Cash", "UPI", "Card", "NetBanking", "Pay Later"] as const;
    type ValidPaymentMode = typeof validPaymentModes[number];
    const paymentModeValue = validPaymentModes.includes(order.paymentMode as ValidPaymentMode) 
      ? (order.paymentMode as ValidPaymentMode) 
      : undefined;
    
    // Pre-fill form with existing order data
    form.reset({
      fullName: order.patient.name,
      mobile: order.patient.mobile,
      email: order.patient.email || "",
      age: order.patient.age || undefined,
      gender: (order.patient.gender as "Male" | "Female" | "Other") || undefined,
      address: order.patient.address || "",
      selectedTests: order.tests.map(t => t.testId) || [],
      selectedPackages: order.packages.map(p => p.packageId) || [],
      paymentMode: paymentModeValue,
      paymentStatus: (order.paymentStatus as "Paid" | "Pending" | "Partial") || "Paid",
      paidAmount: order.paidAmount || 0,
      notes: order.notes || "",
      referringDoctor: order.referringDoctor || "",
    });
    
    // Set selected tests/packages
    setSelectedTests(order.tests.map(t => t.testId) || []);
    setSelectedPackages(order.packages.map(p => p.packageId) || []);
    
    // Generate sample ID if not exists
    setGeneratedSampleId(order.sampleId || generateSampleId());
    
    setIsCompletionDialogOpen(true);
  }, [form]);

  // ============ TEST/PACKAGE TOGGLE ============
  const handleTestToggle = (testId: string) => {
    setSelectedTests((prev) => {
      const newTests = prev.includes(testId)
        ? prev.filter((id) => id !== testId)
        : [...prev, testId];
      form.setValue("selectedTests", newTests);
      return newTests;
    });
  };

  const handlePackageToggle = (packageId: string) => {
    setSelectedPackages((prev) => {
      const newPackages = prev.includes(packageId)
        ? prev.filter((id) => id !== packageId)
        : [...prev, packageId];
      form.setValue("selectedPackages", newPackages);
      return newPackages;
    });
  };

  // ============ CATEGORY TOGGLE ============
  const toggleTestCategory = (category: string) => {
    setExpandedTestCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };

  const togglePackageCategory = (category: string) => {
    setExpandedPackageCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };

  // ============ CALCULATE TOTALS ============
  const { testsTotal, packagesTotal, grandTotal } = calculateTotal(selectedTests, selectedPackages);

  // ============ FILTERED TESTS/PACKAGES ============
  const filteredTests = labTests.filter(
    (test) =>
      test.name.toLowerCase().includes(testSearchQuery.toLowerCase()) ||
      test.code.toLowerCase().includes(testSearchQuery.toLowerCase())
  );

  const filteredPackages = labPackages.filter(
    (pkg) =>
      pkg.name.toLowerCase().includes(packageSearchQuery.toLowerCase())
  );

  // Group tests by category
  const testsByCategory = testCategories.reduce((acc, category) => {
    acc[category] = filteredTests.filter((t) => t.category === category);
    return acc;
  }, {} as Record<string, LabTest[]>);

  // Group packages by category
  const packagesByCategory = packageCategories.reduce((acc, category) => {
    acc[category] = filteredPackages.filter((p) => p.category === category);
    return acc;
  }, {} as Record<string, LabPackage[]>);

  // ============ FORM SUBMISSION - Save/Update Details ============
  const onSubmitCompletion = async (data: SlotCompletionForm, moveToProcessing: boolean = false) => {
    if (!selectedOrder) return;
    
    setIsSubmitting(true);
    setShouldMoveToProcessing(moveToProcessing);
    
    try {
      // Get selected test and package details
      const selectedTestDetails = labTests.filter((t) => selectedTests.includes(t.id));
      const selectedPackageDetails = labPackages.filter((p) => selectedPackages.includes(p.id));

      // Build tests array for Order format
      const orderTests = selectedTestDetails.map((test, idx) => ({
        id: `t${Date.now()}-${idx}`,
        testId: test.id,
        testName: test.name,
        testCode: test.code,
        price: test.price,
        discount: 0,
        finalPrice: test.price,
      }));

      // Build packages array for Order format  
      const orderPackages = selectedPackageDetails.map((pkg, idx) => ({
        id: `p${Date.now()}-${idx}`,
        packageId: pkg.id,
        packageName: pkg.name,
        testsIncluded: pkg.testCount,
        price: pkg.price,
        discount: 0,
        finalPrice: pkg.price,
      }));

      const paidAmount = data.paymentStatus === "Paid" ? grandTotal : (data.paidAmount || 0);

      // Determine the new status
      const newStatus: OrderStatus = moveToProcessing ? "Processing" : selectedOrder.status;

      // Update order via React Query mutation
      await updateOrderMutation.mutateAsync({
        orderId: selectedOrder.id,
        updates: {
          status: newStatus,
          patient: {
            id: selectedOrder.patient.id || `pat-${Date.now()}`,
            name: data.fullName,
            mobile: data.mobile,
            email: data.email || undefined,
            age: data.age,
            gender: data.gender,
            address: data.address || undefined,
          },
          tests: orderTests,
          packages: orderPackages,
          subtotal: grandTotal,
          totalAmount: grandTotal,
          paidAmount: paidAmount,
          dueAmount: grandTotal - paidAmount,
          paymentStatus: data.paymentStatus as PaymentStatus,
          paymentMode: data.paymentMode as OrderPaymentMode,
          slotBooking: {
            slotDate: selectedOrder.slotBooking?.slotDate || "",
            slotTime: selectedOrder.slotBooking?.slotTime || "",
            isDetailsComplete: true,
          },
          sampleId: generatedSampleId,
          barcodeGenerated: true,
          notes: data.notes || undefined,
          referringDoctor: data.referringDoctor || undefined,
          ...(moveToProcessing && { processingStartedAt: new Date().toISOString() }),
        },
      });

      setCompletionSuccess(true);
      
      // Notify parent component if moved to processing
      if (moveToProcessing) {
        onMoveToProcessing?.(selectedOrder);
      }
      
      // Close dialog after short delay
      setTimeout(() => {
        setIsCompletionDialogOpen(false);
        setCompletionSuccess(false);
        setShouldMoveToProcessing(false);
      }, 2000);
    } catch (error) {
      console.error("Error completing slot booking:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // ============ HANDLE FORM SUBMIT ============
  const handleSaveOnly = form.handleSubmit((data) => onSubmitCompletion(data, false));
  const handleSaveAndProcess = form.handleSubmit((data) => onSubmitCompletion(data, true));

  // ============ MOVE TO PROCESSING ============
  const handleMoveToProcessing = async () => {
    if (!orderToMove) return;
    
    try {
      await updateOrderMutation.mutateAsync({
        orderId: orderToMove.id,
        updates: {
          status: "Processing" as OrderStatus,
        },
      });
      
      // Notify parent component
      onMoveToProcessing?.(orderToMove);
      
      setIsMoveDialogOpen(false);
      setOrderToMove(null);
    } catch (error) {
      console.error("Error moving to processing:", error);
    }
  };

  // ============ UPDATE STATUS ============
  const handleUpdateStatus = async (orderId: string, newStatus: OrderStatus) => {
    try {
      await updateOrderMutation.mutateAsync({
        orderId,
        updates: { status: newStatus },
      });
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  // ============ CANCEL ORDER ============
  const handleCancelOrder = async () => {
    if (!orderToCancel) return;
    
    try {
      await updateOrderMutation.mutateAsync({
        orderId: orderToCancel.id,
        updates: { status: "Cancelled" as OrderStatus },
      });
      setIsCancelDialogOpen(false);
      setOrderToCancel(null);
    } catch (error) {
      console.error("Error cancelling order:", error);
    }
  };

  // ============ EXPORT ============
  const handleExport = useCallback(() => {
    exportMutation.mutate({
      filters: { 
        source: "Slot Booking",
        branchId: branchFilter !== "all" ? branchFilter : undefined,
      },
      format: "csv",
    });
  }, [exportMutation, branchFilter]);

  // Check if order can be moved to processing
  const canMoveToProcessing = (order: Order) => {
    return order.status === "Pending" && 
           order.slotBooking?.isDetailsComplete && 
           order.tests.length > 0;
  };

  return (
    <div className="h-full flex flex-col bg-gradient-to-br from-violet-50 via-white to-slate-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
      <div className="flex-1 p-4 md:p-6 space-y-4 overflow-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-violet-100 rounded-xl dark:bg-violet-900/30 shrink-0">
              <CalendarDays className="h-5 w-5 text-violet-600 dark:text-violet-400" />
            </div>
            <div>
              <h1 className="text-lg md:text-xl font-bold tracking-tight">Slot Booking Management</h1>
              <p className="text-xs text-muted-foreground hidden sm:block">
                Complete details & send to Lab Processing
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

        {/* Status Flow Indicator */}
        <Card className="border-violet-200 bg-violet-50/50 dark:bg-violet-900/10">
          <CardContent className="p-4">
            <div className="flex items-center justify-center gap-2 text-sm">
              <Badge className={statusColors["Pending"]}>Pending</Badge>
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
              <Badge className={statusColors["Processing"]}>Processing</Badge>
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
              <Badge className={statusColors["Report Ready"]}>Report Ready</Badge>
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
              <Badge className={statusColors["Completed"]}>Completed</Badge>
            </div>
          </CardContent>
        </Card>

        {/* Stats */}
        {isLoading ? (
          <div className="grid gap-3 grid-cols-2 lg:grid-cols-6">
            {[...Array(6)].map((_, i) => (
              <Skeleton key={i} className="h-20 rounded-lg" />
            ))}
          </div>
        ) : (
          <div className="grid gap-3 grid-cols-2 lg:grid-cols-6">
            <Card className="border-l-4 border-l-violet-500">
              <CardContent className="p-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-muted-foreground">Total</p>
                    <p className="text-xl font-bold">{stats.total}</p>
                  </div>
                  <CalendarDays className="h-6 w-6 text-violet-200" />
                </div>
              </CardContent>
            </Card>
            <Card className="border-l-4 border-l-amber-500">
              <CardContent className="p-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-muted-foreground">Pending</p>
                    <p className="text-xl font-bold">{stats.pending}</p>
                  </div>
                  <Clock className="h-6 w-6 text-amber-200" />
                </div>
              </CardContent>
            </Card>
            <Card className="border-l-4 border-l-blue-500">
              <CardContent className="p-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-muted-foreground">Processing</p>
                    <p className="text-xl font-bold">{stats.processing}</p>
                  </div>
                  <Play className="h-6 w-6 text-blue-200" />
                </div>
              </CardContent>
            </Card>
            <Card className="border-l-4 border-l-purple-500">
              <CardContent className="p-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-muted-foreground">Report Ready</p>
                    <p className="text-xl font-bold">{stats.reportReady}</p>
                  </div>
                  <FileCheck className="h-6 w-6 text-purple-200" />
                </div>
              </CardContent>
            </Card>
            <Card className="border-l-4 border-l-green-500">
              <CardContent className="p-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-muted-foreground">Completed</p>
                    <p className="text-xl font-bold">{stats.completed}</p>
                  </div>
                  <CheckCheck className="h-6 w-6 text-green-200" />
                </div>
              </CardContent>
            </Card>
            <Card className="border-l-4 border-l-cyan-500">
              <CardContent className="p-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-muted-foreground">Today</p>
                    <p className="text-xl font-bold">{stats.todaySlots}</p>
                  </div>
                  <CalendarDays className="h-6 w-6 text-cyan-200" />
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Filters */}
        <Card>
          <CardContent className="p-3">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by name, mobile, order #, sample ID..."
                  className="pl-8 h-9"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-[140px] h-9">
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
                <SelectTrigger className="w-full sm:w-[130px] h-9">
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
                <SelectTrigger className="w-full sm:w-[150px] h-9">
                  <Building2 className="h-4 w-4 mr-1 text-muted-foreground" />
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
                <Button variant="ghost" size="sm" onClick={clearFilters} className="h-9">
                  <X className="h-4 w-4 mr-1" />
                  Clear
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Orders Table */}
        <Card className="flex-1 overflow-hidden">
          <ScrollArea className="h-[calc(100vh-420px)] min-h-[350px]">
            <Table>
              <TableHeader className="sticky top-0 bg-background z-10">
                <TableRow>
                  <TableHead className="w-[110px]">Order #</TableHead>
                  <TableHead>Patient</TableHead>
                  <TableHead className="hidden md:table-cell">Slot</TableHead>
                  <TableHead className="hidden lg:table-cell">Branch</TableHead>
                  <TableHead>Tests</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Payment</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                  <TableHead className="w-[100px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  [...Array(5)].map((_, i) => (
                    <TableRow key={i}>
                      <TableCell><Skeleton className="h-5 w-20" /></TableCell>
                      <TableCell><Skeleton className="h-10 w-32" /></TableCell>
                      <TableCell className="hidden md:table-cell"><Skeleton className="h-10 w-24" /></TableCell>
                      <TableCell className="hidden lg:table-cell"><Skeleton className="h-5 w-24" /></TableCell>
                      <TableCell><Skeleton className="h-5 w-16" /></TableCell>
                      <TableCell><Skeleton className="h-6 w-20" /></TableCell>
                      <TableCell><Skeleton className="h-6 w-16" /></TableCell>
                      <TableCell><Skeleton className="h-5 w-16" /></TableCell>
                      <TableCell><Skeleton className="h-8 w-20" /></TableCell>
                    </TableRow>
                  ))
                ) : filteredOrders.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={9} className="h-32 text-center text-muted-foreground">
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
                        <div className="space-y-0.5">
                          <span className="font-mono font-semibold text-violet-600 text-xs">
                            {order.orderNumber}
                          </span>
                          {order.sampleId && (
                            <p className="text-[10px] text-muted-foreground font-mono">
                              {order.sampleId}
                            </p>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-1.5">
                            <User className="h-3 w-3 text-muted-foreground" />
                            <span className="font-medium text-sm">{order.patient.name}</span>
                          </div>
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Phone className="h-3 w-3" />
                            {order.patient.mobile}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        <div className="space-y-0.5 text-xs">
                          <div className="flex items-center gap-1 font-medium">
                            <CalendarDays className="h-3 w-3 text-muted-foreground" />
                            {order.slotBooking?.slotDate || "-"}
                          </div>
                          <div className="flex items-center gap-1 text-muted-foreground">
                            <Clock className="h-3 w-3" />
                            {order.slotBooking?.slotTime || "-"}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="hidden lg:table-cell">
                        <div className="flex items-center gap-1 text-xs">
                          <Building2 className="h-3 w-3 text-muted-foreground" />
                          <span className="truncate max-w-[100px]">{order.branchName}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1 max-w-[120px]">
                          {order.tests.length === 0 && order.packages.length === 0 ? (
                            <span className="text-xs text-muted-foreground">No tests</span>
                          ) : (
                            <>
                              {order.tests.slice(0, 2).map((test) => (
                                <Badge key={test.id} variant="secondary" className="text-[10px] px-1.5 py-0">
                                  {test.testCode}
                                </Badge>
                              ))}
                              {order.tests.length + order.packages.length > 2 && (
                                <Badge variant="outline" className="text-[10px] px-1.5 py-0">
                                  +{order.tests.length + order.packages.length - 2}
                                </Badge>
                              )}
                            </>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={statusColors[order.status]}>
                          {order.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={paymentStatusColors[order.paymentStatus]}>
                          {order.paymentStatus}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <span className="font-semibold text-sm">
                          {order.totalAmount > 0 ? formatINR(order.totalAmount) : "-"}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          {/* Quick Action: Move to Processing */}
                          {canMoveToProcessing(order) && (
                            <Button
                              size="sm"
                              variant="default"
                              className="h-7 px-2 text-xs bg-blue-600 hover:bg-blue-700"
                              onClick={() => {
                                setOrderToMove(order);
                                setIsMoveDialogOpen(true);
                              }}
                            >
                              <Play className="h-3 w-3 mr-1" />
                              Process
                            </Button>
                          )}
                          
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-7 w-7">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                onClick={() => {
                                  setSelectedOrder(order);
                                  setIsDetailDialogOpen(true);
                                }}
                              >
                                <Eye className="mr-2 h-4 w-4" /> View Details
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => openCompletionDialog(order)}>
                                <Edit2 className="mr-2 h-4 w-4" /> 
                                {order.slotBooking?.isDetailsComplete ? "Edit Details" : "Complete Details"}
                              </DropdownMenuItem>
                              
                              {/* Status Actions */}
                              {order.status === "Pending" && order.slotBooking?.isDetailsComplete && order.tests.length > 0 && (
                                <DropdownMenuItem
                                  onClick={() => {
                                    setOrderToMove(order);
                                    setIsMoveDialogOpen(true);
                                  }}
                                  className="text-blue-600"
                                >
                                  <Play className="mr-2 h-4 w-4" /> Move to Processing
                                </DropdownMenuItem>
                              )}
                              {order.status === "Processing" && (
                                <DropdownMenuItem
                                  onClick={() => handleUpdateStatus(order.id, "Report Ready")}
                                  className="text-purple-600"
                                >
                                  <FileCheck className="mr-2 h-4 w-4" /> Mark Report Ready
                                </DropdownMenuItem>
                              )}
                              {order.status === "Report Ready" && (
                                <DropdownMenuItem
                                  onClick={() => handleUpdateStatus(order.id, "Completed")}
                                  className="text-green-600"
                                >
                                  <CheckCheck className="mr-2 h-4 w-4" /> Mark Completed
                                </DropdownMenuItem>
                              )}
                              
                              {order.status !== "Completed" && order.status !== "Cancelled" && (
                                <>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem
                                    onClick={() => {
                                      setOrderToCancel(order);
                                      setIsCancelDialogOpen(true);
                                    }}
                                    className="text-red-600"
                                  >
                                    <XCircle className="mr-2 h-4 w-4" /> Cancel Order
                                  </DropdownMenuItem>
                                </>
                              )}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </TableCell>
                    </motion.tr>
                  ))
                )}
              </TableBody>
            </Table>
          </ScrollArea>
        </Card>

        {/* View Details Dialog */}
        <Dialog open={isDetailDialogOpen} onOpenChange={setIsDetailDialogOpen}>
          <DialogContent className="max-w-lg max-h-[90vh] overflow-auto">
            <DialogHeader>
              <DialogTitle>Order Details</DialogTitle>
              <DialogDescription>Slot booking order information</DialogDescription>
            </DialogHeader>

            {selectedOrder && (
              <div className="space-y-4 py-2">
                {/* Order Info */}
                <div className="bg-violet-50 dark:bg-violet-900/20 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Order Number</p>
                      <p className="font-mono font-bold text-violet-600">{selectedOrder.orderNumber}</p>
                    </div>
                    <Badge className={statusColors[selectedOrder.status]}>
                      {selectedOrder.status}
                    </Badge>
                  </div>
                  {selectedOrder.sampleId && (
                    <div className="mt-2">
                      <p className="text-xs text-muted-foreground">Sample ID</p>
                      <p className="font-mono text-sm">{selectedOrder.sampleId}</p>
                    </div>
                  )}
                </div>

                {/* Patient Details */}
                <div className="space-y-2">
                  <h4 className="font-medium text-sm flex items-center gap-2">
                    <User className="h-4 w-4" /> Patient Details
                  </h4>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <span className="text-muted-foreground">Name:</span>
                      <span className="ml-2 font-medium">{selectedOrder.patient.name}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Mobile:</span>
                      <span className="ml-2">{selectedOrder.patient.mobile}</span>
                    </div>
                    {selectedOrder.patient.age && (
                      <div>
                        <span className="text-muted-foreground">Age:</span>
                        <span className="ml-2">{selectedOrder.patient.age} yrs</span>
                      </div>
                    )}
                    {selectedOrder.patient.gender && (
                      <div>
                        <span className="text-muted-foreground">Gender:</span>
                        <span className="ml-2">{selectedOrder.patient.gender}</span>
                      </div>
                    )}
                  </div>
                </div>

                <Separator />

                {/* Slot Details */}
                <div className="space-y-2">
                  <h4 className="font-medium text-sm flex items-center gap-2">
                    <CalendarDays className="h-4 w-4" /> Slot Details
                  </h4>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <span className="text-muted-foreground">Date:</span>
                      <span className="ml-2 font-medium">{selectedOrder.slotBooking?.slotDate}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Time:</span>
                      <span className="ml-2">{selectedOrder.slotBooking?.slotTime}</span>
                    </div>
                    <div className="col-span-2">
                      <span className="text-muted-foreground">Branch:</span>
                      <span className="ml-2">{selectedOrder.branchName}</span>
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Tests & Packages */}
                {(selectedOrder.tests.length > 0 || selectedOrder.packages.length > 0) && (
                  <>
                    <div className="space-y-2">
                      <h4 className="font-medium text-sm flex items-center gap-2">
                        <FlaskConical className="h-4 w-4" /> Tests & Packages
                      </h4>
                      <div className="space-y-1">
                        {selectedOrder.tests.map((test) => (
                          <div key={test.id} className="flex justify-between text-sm">
                            <span>{test.testName} ({test.testCode})</span>
                            <span className="font-medium">{formatINR(test.finalPrice)}</span>
                          </div>
                        ))}
                        {selectedOrder.packages.map((pkg) => (
                          <div key={pkg.id} className="flex justify-between text-sm">
                            <span>{pkg.packageName}</span>
                            <span className="font-medium">{formatINR(pkg.finalPrice)}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <Separator />
                  </>
                )}

                {/* Payment Details */}
                <div className="space-y-2">
                  <h4 className="font-medium text-sm flex items-center gap-2">
                    <CreditCard className="h-4 w-4" /> Payment
                  </h4>
                  <div className="flex items-center justify-between">
                    <div>
                      <Badge className={paymentStatusColors[selectedOrder.paymentStatus]}>
                        {selectedOrder.paymentStatus}
                      </Badge>
                      {selectedOrder.paymentMode && (
                        <span className="ml-2 text-sm text-muted-foreground">
                          via {selectedOrder.paymentMode}
                        </span>
                      )}
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-lg">{formatINR(selectedOrder.totalAmount)}</p>
                      {selectedOrder.dueAmount > 0 && (
                        <p className="text-xs text-red-600">Due: {formatINR(selectedOrder.dueAmount)}</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDetailDialogOpen(false)}>
                Close
              </Button>
              {selectedOrder && (
                <Button onClick={() => {
                  setIsDetailDialogOpen(false);
                  openCompletionDialog(selectedOrder);
                }}>
                  <Edit2 className="mr-2 h-4 w-4" />
                  Edit Details
                </Button>
              )}
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Complete/Edit Details Dialog */}
        <Dialog open={isCompletionDialogOpen} onOpenChange={setIsCompletionDialogOpen}>
          <DialogContent className="max-w-4xl max-h-[90vh] flex flex-col">
            <DialogHeader className="flex-shrink-0">
              <DialogTitle>
                {selectedOrder?.slotBooking?.isDetailsComplete ? "Edit Order Details" : "Complete Order Details"}
              </DialogTitle>
              <DialogDescription>
                {selectedOrder?.orderNumber} • Fill in all required details
              </DialogDescription>
            </DialogHeader>

            {completionSuccess ? (
              <div className="flex flex-col items-center justify-center py-12">
                <div className={`w-16 h-16 ${shouldMoveToProcessing ? "bg-blue-100" : "bg-green-100"} rounded-full flex items-center justify-center mb-4`}>
                  {shouldMoveToProcessing ? (
                    <Play className="h-8 w-8 text-blue-600" />
                  ) : (
                    <CheckCircle2 className="h-8 w-8 text-green-600" />
                  )}
                </div>
                <h3 className={`text-lg font-semibold ${shouldMoveToProcessing ? "text-blue-700" : "text-green-700"}`}>
                  {shouldMoveToProcessing ? "Order Moved to Processing!" : "Details Saved Successfully!"}
                </h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Sample ID: <span className="font-mono font-medium">{generatedSampleId}</span>
                </p>
                {shouldMoveToProcessing && (
                  <p className="text-xs text-blue-600 mt-2">
                    The order is now ready for lab processing
                  </p>
                )}
              </div>
            ) : (
              <Form {...form}>
                <form className="flex flex-col flex-1 overflow-y-scroll">
                  <ScrollArea className="flex-1 pr-4">
                    <div className="space-y-6 pb-6">
                      {/* Sample ID Display */}
                      <Card className="bg-violet-50 dark:bg-violet-900/20">
                        <CardContent className="p-3 flex items-center justify-between">
                          <div>
                            <p className="text-xs text-muted-foreground">Sample ID</p>
                            <p className="font-mono font-bold text-violet-600">{generatedSampleId}</p>
                          </div>
                          <Badge variant="outline">Auto-generated</Badge>
                        </CardContent>
                      </Card>

                      {/* Patient Details Section */}
                      <div className="space-y-4">
                        <h3 className="font-semibold flex items-center gap-2">
                          <User className="h-4 w-4" /> Patient Details
                        </h3>
                        <div className="grid grid-cols-2 gap-4">
                          <FormField
                            control={form.control}
                            name="fullName"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Full Name *</FormLabel>
                                <FormControl>
                                  <Input placeholder="Patient name" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="mobile"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Mobile *</FormLabel>
                                <FormControl>
                                  <Input placeholder="10-digit mobile" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="age"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Age *</FormLabel>
                                <FormControl>
                                  <Input
                                    type="number"
                                    placeholder="Age"
                                    {...field}
                                    onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : undefined)}
                                    value={field.value || ""}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="gender"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Gender *</FormLabel>
                                <Select onValueChange={field.onChange} value={field.value}>
                                  <FormControl>
                                    <SelectTrigger>
                                      <SelectValue placeholder="Select gender" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    <SelectItem value="Male">Male</SelectItem>
                                    <SelectItem value="Female">Female</SelectItem>
                                    <SelectItem value="Other">Other</SelectItem>
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Email</FormLabel>
                                <FormControl>
                                  <Input type="email" placeholder="Email (optional)" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="address"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Address</FormLabel>
                                <FormControl>
                                  <Input placeholder="Address (optional)" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      </div>

                      <Separator />

                      {/* Test/Package Selection */}
                      <div className="space-y-4">
                        <h3 className="font-semibold flex items-center gap-2">
                          <FlaskConical className="h-4 w-4" /> Tests & Packages *
                        </h3>
                        
                        <Tabs defaultValue="tests" className="w-full">
                          <TabsList className="grid w-full grid-cols-2">
                            <TabsTrigger value="tests">
                              <FlaskConical className="h-4 w-4 mr-2" />
                              Tests ({selectedTests.length})
                            </TabsTrigger>
                            <TabsTrigger value="packages">
                              <Package className="h-4 w-4 mr-2" />
                              Packages ({selectedPackages.length})
                            </TabsTrigger>
                          </TabsList>
                          
                          <TabsContent value="tests" className="mt-4">
                            <div className="space-y-3">
                              <Input
                                placeholder="Search tests..."
                                value={testSearchQuery}
                                onChange={(e) => setTestSearchQuery(e.target.value)}
                                className="h-8"
                              />
                              <ScrollArea className="h-[200px] border rounded-md p-2">
                                {testCategories.map((category) => {
                                  const categoryTests = testsByCategory[category] || [];
                                  if (categoryTests.length === 0) return null;
                                  
                                  return (
                                    <Collapsible
                                      key={category}
                                      open={expandedTestCategories.includes(category)}
                                      onOpenChange={() => toggleTestCategory(category)}
                                    >
                                      <CollapsibleTrigger className="flex items-center justify-between w-full p-2 hover:bg-muted rounded">
                                        <span className="text-sm font-medium">{category}</span>
                                        <div className="flex items-center gap-2">
                                          <Badge variant="secondary" className="text-xs">
                                            {categoryTests.filter(t => selectedTests.includes(t.id)).length}/{categoryTests.length}
                                          </Badge>
                                          {expandedTestCategories.includes(category) ? (
                                            <ChevronDown className="h-4 w-4" />
                                          ) : (
                                            <ChevronRight className="h-4 w-4" />
                                          )}
                                        </div>
                                      </CollapsibleTrigger>
                                      <CollapsibleContent>
                                        <div className="pl-4 space-y-1">
                                          {categoryTests.map((test) => (
                                            <label
                                              key={test.id}
                                              htmlFor={`test-${test.id}`}
                                              className="flex items-center justify-between p-2 hover:bg-muted/50 rounded cursor-pointer"
                                            >
                                              <div className="flex items-center gap-2">
                                                <Checkbox
                                                  id={`test-${test.id}`}
                                                  checked={selectedTests.includes(test.id)}
                                                  onCheckedChange={() => handleTestToggle(test.id)}
                                                />
                                                <div>
                                                  <p className="text-sm">{test.name}</p>
                                                  <p className="text-xs text-muted-foreground">{test.code}</p>
                                                </div>
                                              </div>
                                              <span className="text-sm font-medium">{formatINR(test.price)}</span>
                                            </label>
                                          ))}
                                        </div>
                                      </CollapsibleContent>
                                    </Collapsible>
                                  );
                                })}
                              </ScrollArea>
                            </div>
                          </TabsContent>
                          
                          <TabsContent value="packages" className="mt-4">
                            <div className="space-y-3">
                              <Input
                                placeholder="Search packages..."
                                value={packageSearchQuery}
                                onChange={(e) => setPackageSearchQuery(e.target.value)}
                                className="h-8"
                              />
                              <ScrollArea className="h-[200px] border rounded-md p-2">
                                {packageCategories.map((category) => {
                                  const categoryPackages = packagesByCategory[category] || [];
                                  if (categoryPackages.length === 0) return null;
                                  
                                  return (
                                    <Collapsible
                                      key={category}
                                      open={expandedPackageCategories.includes(category)}
                                      onOpenChange={() => togglePackageCategory(category)}
                                    >
                                      <CollapsibleTrigger className="flex items-center justify-between w-full p-2 hover:bg-muted rounded">
                                        <span className="text-sm font-medium">{category}</span>
                                        <div className="flex items-center gap-2">
                                          <Badge variant="secondary" className="text-xs">
                                            {categoryPackages.filter(p => selectedPackages.includes(p.id)).length}/{categoryPackages.length}
                                          </Badge>
                                          {expandedPackageCategories.includes(category) ? (
                                            <ChevronDown className="h-4 w-4" />
                                          ) : (
                                            <ChevronRight className="h-4 w-4" />
                                          )}
                                        </div>
                                      </CollapsibleTrigger>
                                      <CollapsibleContent>
                                        <div className="pl-4 space-y-1">
                                          {categoryPackages.map((pkg) => (
                                            <label
                                              key={pkg.id}
                                              htmlFor={`package-${pkg.id}`}
                                              className="flex items-center justify-between p-2 hover:bg-muted/50 rounded cursor-pointer"
                                            >
                                              <div className="flex items-center gap-2">
                                                <Checkbox
                                                  id={`package-${pkg.id}`}
                                                  checked={selectedPackages.includes(pkg.id)}
                                                  onCheckedChange={() => handlePackageToggle(pkg.id)}
                                                />
                                                <div>
                                                  <p className="text-sm">{pkg.name}</p>
                                                  <p className="text-xs text-muted-foreground">{pkg.testCount} tests</p>
                                                </div>
                                              </div>
                                              <span className="text-sm font-medium">{formatINR(pkg.price)}</span>
                                            </label>
                                          ))}
                                        </div>
                                      </CollapsibleContent>
                                    </Collapsible>
                                  );
                                })}
                              </ScrollArea>
                            </div>
                          </TabsContent>
                        </Tabs>
                        
                        {form.formState.errors.selectedTests && (
                          <p className="text-sm text-red-500">{form.formState.errors.selectedTests.message}</p>
                        )}
                      </div>

                      <Separator />

                      {/* Payment Section */}
                      <div className="space-y-4">
                        <h3 className="font-semibold flex items-center gap-2">
                          <CreditCard className="h-4 w-4" /> Payment Details
                        </h3>
                        
                        {/* Total Display */}
                        <Card className="bg-green-50 dark:bg-green-900/20">
                          <CardContent className="p-3">
                            <div className="flex justify-between items-center">
                              <div className="space-y-1 text-sm">
                                <div className="flex justify-between gap-8">
                                  <span className="text-muted-foreground">Tests:</span>
                                  <span>{formatINR(testsTotal)}</span>
                                </div>
                                <div className="flex justify-between gap-8">
                                  <span className="text-muted-foreground">Packages:</span>
                                  <span>{formatINR(packagesTotal)}</span>
                                </div>
                              </div>
                              <div className="text-right">
                                <p className="text-xs text-muted-foreground">Total Amount</p>
                                <p className="text-2xl font-bold text-green-700">{formatINR(grandTotal)}</p>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                        
                        <div className="grid grid-cols-3 gap-4">
                          <FormField
                            control={form.control}
                            name="paymentMode"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Payment Mode *</FormLabel>
                                <Select onValueChange={field.onChange} value={field.value}>
                                  <FormControl>
                                    <SelectTrigger>
                                      <SelectValue placeholder="Select mode" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    <SelectItem value="Cash">Cash</SelectItem>
                                    <SelectItem value="UPI">UPI</SelectItem>
                                    <SelectItem value="Card">Card</SelectItem>
                                    <SelectItem value="NetBanking">Net Banking</SelectItem>
                                    <SelectItem value="Pay Later">Pay Later</SelectItem>
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="paymentStatus"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Payment Status *</FormLabel>
                                <Select onValueChange={field.onChange} value={field.value}>
                                  <FormControl>
                                    <SelectTrigger>
                                      <SelectValue placeholder="Select status" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    <SelectItem value="Paid">Paid</SelectItem>
                                    <SelectItem value="Pending">Pending</SelectItem>
                                    <SelectItem value="Partial">Partial</SelectItem>
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          {form.watch("paymentStatus") === "Partial" && (
                            <FormField
                              control={form.control}
                              name="paidAmount"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Paid Amount</FormLabel>
                                  <FormControl>
                                    <Input
                                      type="number"
                                      placeholder="Amount paid"
                                      {...field}
                                      onChange={(e) => field.onChange(e.target.value ? parseFloat(e.target.value) : 0)}
                                      value={field.value || ""}
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          )}
                        </div>
                      </div>

                      <Separator />

                      {/* Additional Details */}
                      <div className="grid grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="referringDoctor"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Referring Doctor</FormLabel>
                              <FormControl>
                                <Input placeholder="Doctor name (optional)" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="notes"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Notes</FormLabel>
                              <FormControl>
                                <Textarea placeholder="Additional notes..." className="h-10" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>
                  </ScrollArea>

                  <DialogFooter className="pt-4 border-t shrink-0 flex-col sm:flex-row gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setIsCompletionDialogOpen(false)}
                      disabled={isSubmitting}
                    >
                      Cancel
                    </Button>
                    <div className="flex gap-2">
                      <Button 
                        type="button" 
                        variant="secondary"
                        disabled={isSubmitting}
                        onClick={handleSaveOnly}
                      >
                        {isSubmitting && !shouldMoveToProcessing ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Saving...
                          </>
                        ) : (
                          <>
                            <CheckCircle2 className="mr-2 h-4 w-4" />
                            Save Details
                          </>
                        )}
                      </Button>
                      <Button 
                        type="button"
                        disabled={isSubmitting}
                        onClick={handleSaveAndProcess}
                        className="bg-blue-600 hover:bg-blue-700"
                      >
                        {isSubmitting && shouldMoveToProcessing ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Saving & Moving...
                          </>
                        ) : (
                          <>
                            <Play className="mr-2 h-4 w-4" />
                            Save & Move to Processing
                          </>
                        )}
                      </Button>
                    </div>
                  </DialogFooter>
                </form>
              </Form>
            )}
          </DialogContent>
        </Dialog>

        {/* Move to Processing Confirmation */}
        <Dialog open={isMoveDialogOpen} onOpenChange={setIsMoveDialogOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Move to Processing</DialogTitle>
              <DialogDescription>
                This will move the order to Lab Processing where you can manage sample collection and test processing.
              </DialogDescription>
            </DialogHeader>
            {orderToMove && (
              <div className="py-4">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-medium text-blue-700">{orderToMove.orderNumber}</span>
                    <Badge className={statusColors["Processing"]}>Processing</Badge>
                  </div>
                  <p className="text-sm">{orderToMove.patient.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {orderToMove.tests.length} test(s), {orderToMove.packages.length} package(s)
                  </p>
                  <p className="font-semibold">{formatINR(orderToMove.totalAmount)}</p>
                </div>
              </div>
            )}
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsMoveDialogOpen(false)}>
                Cancel
              </Button>
              <Button 
                onClick={handleMoveToProcessing}
                disabled={updateOrderMutation.isPending}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {updateOrderMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Moving...
                  </>
                ) : (
                  <>
                    <Play className="mr-2 h-4 w-4" />
                    Move to Processing
                  </>
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

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
      </div>
    </div>
  );
}
