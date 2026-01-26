"use client";

import React, { useState, useMemo, useRef } from "react";
import { motion } from "framer-motion";
import {
  Search,
  Upload,
  FileText,
  CheckCircle2,
  User,
  Phone,
  Building2,
  RefreshCw,
  Download,
  Eye,
  FileUp,
  Clock,
  Mail,
  Printer,
  Send,
  X,
  Loader2,
  FileCheck,
  TestTube,
  MoreVertical,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

import type { OrderStatus, OrderSource } from "../orders/orders.types";
import { labProcessingQueue, labBranches } from "./lab-management.data";
import { OrderStatusFlow } from "../orders/OrderStatusFlow";

// ============ TYPES ============
interface ReportOrder {
  id: string;
  orderNumber: string;
  sampleId: string;
  patientName: string;
  patientMobile: string;
  patientEmail?: string;
  status: OrderStatus;
  source: OrderSource;
  branchId: string;
  branchName: string;
  tests: {
    id: string;
    code: string;
    name: string;
    status: string;
    resultValue?: string;
    normalRange?: string;
  }[];
  totalAmount: number;
  createdAt: string;
  reportReadyAt?: string;
  reportUrl?: string;
  reportUploadedAt?: string;
  deliveryMethod?: "Email" | "WhatsApp" | "Print" | "Portal";
}

// ============ CONSTANTS ============
const statusColors: Record<string, string> = {
  "Pending": "bg-amber-100 text-amber-700 border-amber-200",
  "Sample Collected": "bg-purple-100 text-purple-700 border-purple-200",
  "Processing": "bg-blue-100 text-blue-700 border-blue-200",
  "Report Ready": "bg-cyan-100 text-cyan-700 border-cyan-200",
  "Completed": "bg-green-100 text-green-700 border-green-200",
  "In Progress": "bg-blue-100 text-blue-700 border-blue-200",
};

// Helper to convert lab-management status to orders status
const convertStatus = (status: string): OrderStatus => {
  // Map "In Progress" to "Processing" for compatibility
  if (status === "In Progress") return "Processing";
  return status as OrderStatus;
};

// Mock data - convert processing queue to report orders format
const mockReportOrders: ReportOrder[] = labProcessingQueue
  .filter(item => item.status === "Report Ready" || item.status === "Completed")
  .map(item => ({
    id: item.id,
    orderNumber: item.orderNumber,
    sampleId: item.sampleId,
    patientName: item.patientName,
    patientMobile: item.patientMobile,
    patientEmail: `${item.patientName.toLowerCase().replace(" ", ".")}@email.com`,
    status: convertStatus(item.status),
    source: "Walk-in" as OrderSource,
    branchId: item.branchId,
    branchName: item.branchName,
    tests: item.tests.map(t => ({
      ...t,
      resultValue: t.status === "Completed" ? "Normal" : undefined,
      normalRange: "4.5 - 11.0 (10^3/uL)",
    })),
    totalAmount: 1500,
    createdAt: item.receivedAt,
    reportReadyAt: item.completedAt || new Date().toISOString(),
    reportUrl: item.status === "Completed" ? "/reports/sample-report.pdf" : undefined,
    reportUploadedAt: item.status === "Completed" ? new Date().toISOString() : undefined,
  }));

// Add some more mock data for testing
const additionalMockOrders: ReportOrder[] = [
  {
    id: "rpt-001",
    orderNumber: "ORD-2024-0050",
    sampleId: "SMP-0050",
    patientName: "Ananya Sharma",
    patientMobile: "+91 98765 43210",
    patientEmail: "ananya.sharma@email.com",
    status: "Report Ready",
    source: "Online Test Booking" as OrderSource,
    branchId: "branch-001",
    branchName: "Main Branch",
    tests: [
      { id: "t1", code: "CBC", name: "Complete Blood Count", status: "Completed", resultValue: "Normal", normalRange: "4.5 - 11.0" },
      { id: "t2", code: "LFT", name: "Liver Function Test", status: "Completed", resultValue: "Elevated", normalRange: "7 - 56 U/L" },
    ],
    totalAmount: 2500,
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    reportReadyAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "rpt-002",
    orderNumber: "ORD-2024-0051",
    sampleId: "SMP-0051",
    patientName: "Vikram Patel",
    patientMobile: "+91 87654 32109",
    patientEmail: "vikram.patel@email.com",
    status: "Completed",
    source: "Walk-in" as OrderSource,
    branchId: "branch-001",
    branchName: "Main Branch",
    tests: [
      { id: "t3", code: "TFT", name: "Thyroid Function Test", status: "Completed", resultValue: "Normal", normalRange: "0.4 - 4.0 mIU/L" },
    ],
    totalAmount: 1200,
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    reportReadyAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    reportUrl: "/reports/sample-report.pdf",
    reportUploadedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    deliveryMethod: "Email",
  },
];

// ============ MOCK CURRENT BRANCH ============
const CURRENT_BRANCH_ID = "branch-001";

// ============ PROPS ============
export interface ReportUploadPageProps {
  currentBranchId?: string;
}

export default function ReportUploadPage({
  currentBranchId = CURRENT_BRANCH_ID,
}: ReportUploadPageProps = {}) {
  // ============ STATE ============
  const [orders, setOrders] = useState<ReportOrder[]>([...mockReportOrders, ...additionalMockOrders]);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<"pending-upload" | "completed">("pending-upload");
  const [branchFilter, setBranchFilter] = useState<string>("all");
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [selectedOrders, _setSelectedOrders] = useState<string[]>([]);
  
  // Upload Dialog State
  const [showUploadDialog, setShowUploadDialog] = useState(false);
  const [uploadOrder, setUploadOrder] = useState<ReportOrder | null>(null);
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  
  // Delivery Dialog State
  const [showDeliveryDialog, setShowDeliveryDialog] = useState(false);
  const [deliveryOrder, setDeliveryOrder] = useState<ReportOrder | null>(null);
  const [selectedDeliveryMethod, setSelectedDeliveryMethod] = useState<"Email" | "WhatsApp" | "Print" | "Portal">("Email");
  const [deliveryNotes, setDeliveryNotes] = useState("");
  const [isSending, setIsSending] = useState(false);
  
  // View Report Dialog
  const [showViewDialog, setShowViewDialog] = useState(false);
  const [viewOrder, setViewOrder] = useState<ReportOrder | null>(null);

  // Refs
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Get current branch info
  const currentBranch = useMemo(() =>
    labBranches.find(b => b.id === currentBranchId) || labBranches[0],
    [currentBranchId]
  );

  // ============ COMPUTED VALUES ============
  const filteredOrders = useMemo(() => {
    let filtered = [...orders];

    // Filter by tab
    if (activeTab === "pending-upload") {
      filtered = filtered.filter(o => o.status === "Report Ready" && !o.reportUrl);
    } else {
      filtered = filtered.filter(o => o.status === "Completed" || (o.status === "Report Ready" && o.reportUrl));
    }

    // Filter by branch
    if (branchFilter && branchFilter !== "all") {
      filtered = filtered.filter(o => o.branchId === branchFilter);
    } else {
      // Default to current branch
      filtered = filtered.filter(o => o.branchId === currentBranchId);
    }

    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(o =>
        o.orderNumber.toLowerCase().includes(query) ||
        o.sampleId.toLowerCase().includes(query) ||
        o.patientName.toLowerCase().includes(query) ||
        o.patientMobile.includes(query)
      );
    }

    return filtered;
  }, [orders, activeTab, branchFilter, searchQuery, currentBranchId]);

  const stats = useMemo(() => ({
    total: orders.filter(o => o.branchId === currentBranchId).length,
    pendingUpload: orders.filter(o => o.status === "Report Ready" && !o.reportUrl && o.branchId === currentBranchId).length,
    uploaded: orders.filter(o => o.reportUrl && o.branchId === currentBranchId).length,
    completed: orders.filter(o => o.status === "Completed" && o.branchId === currentBranchId).length,
  }), [orders, currentBranchId]);

  // ============ HANDLERS ============
  const handleOpenUploadDialog = (order: ReportOrder) => {
    setUploadOrder(order);
    setUploadFile(null);
    setUploadProgress(0);
    setShowUploadDialog(true);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.includes("pdf")) {
        alert("Please select a PDF file");
        return;
      }
      // Validate file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        alert("File size must be less than 10MB");
        return;
      }
      setUploadFile(file);
    }
  };

  const handleUploadReport = async () => {
    if (!uploadOrder || !uploadFile) return;

    setIsUploading(true);
    setUploadProgress(0);

    try {
      // Simulate upload progress
      for (let i = 0; i <= 100; i += 10) {
        await new Promise(resolve => setTimeout(resolve, 200));
        setUploadProgress(i);
      }

      // Update order with report URL - automatically sets status to Completed
      setOrders(prev =>
        prev.map(o =>
          o.id === uploadOrder.id
            ? {
                ...o,
                status: "Completed" as OrderStatus, // Auto-transition to Completed
                reportUrl: `/reports/${uploadOrder.orderNumber}-report.pdf`,
                reportUploadedAt: new Date().toISOString(),
              }
            : o
        )
      );

      setShowUploadDialog(false);
      setUploadOrder(null);
      setUploadFile(null);
      setActiveTab("completed"); // Switch to completed tab
    } catch (error) {
      console.error("Upload error:", error);
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const handleOpenDeliveryDialog = (order: ReportOrder) => {
    setDeliveryOrder(order);
    setSelectedDeliveryMethod("Email");
    setDeliveryNotes("");
    setShowDeliveryDialog(true);
  };

  const handleSendReport = async () => {
    if (!deliveryOrder) return;

    setIsSending(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Update order with delivery method
      setOrders(prev =>
        prev.map(o =>
          o.id === deliveryOrder.id
            ? {
                ...o,
                deliveryMethod: selectedDeliveryMethod,
              }
            : o
        )
      );

      setShowDeliveryDialog(false);
      setDeliveryOrder(null);
    } catch (error) {
      console.error("Delivery error:", error);
    } finally {
      setIsSending(false);
    }
  };

  const handleViewReport = (order: ReportOrder) => {
    setViewOrder(order);
    setShowViewDialog(true);
  };

  const handleBulkUpload = () => {
    // In production, this would open a bulk upload dialog
    alert("Bulk upload feature coming soon!");
  };

  // ============ RENDER ============
  return (
    <div className="h-full flex flex-col bg-gradient-to-br from-slate-50 via-white to-emerald-50/30 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
      <div className="flex-1 p-4 lg:p-6 space-y-5 overflow-auto">

        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl shadow-lg shadow-emerald-200">
              <FileUp className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl lg:text-2xl font-bold tracking-tight">Report Management</h1>
              <p className="text-sm text-muted-foreground flex items-center gap-2">
                <Building2 className="h-3.5 w-3.5" />
                {currentBranch.name} ({currentBranch.code})
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => setOrders([...mockReportOrders, ...additionalMockOrders])}>
              <RefreshCw className="h-4 w-4 mr-1.5" />
              Refresh
            </Button>
            <Button size="sm" onClick={handleBulkUpload} className="bg-emerald-600 hover:bg-emerald-700">
              <Upload className="h-4 w-4 mr-1.5" />
              Bulk Upload
            </Button>
          </div>
        </div>

        {/* Info Banner */}
        <Alert className="bg-emerald-50 border-emerald-200">
          <FileCheck className="h-4 w-4 text-emerald-600" />
          <AlertTitle className="text-emerald-800">Automated Status Updates</AlertTitle>
          <AlertDescription className="text-emerald-700">
            Uploading a report will automatically mark the order as <strong>Completed</strong>. 
            You can then send the report to patients via Email, WhatsApp, or Print.
          </AlertDescription>
        </Alert>

        {/* Stats Grid */}
        <div className="grid gap-3 grid-cols-2 lg:grid-cols-4">
          <Card className="border-l-4 border-l-emerald-500 bg-white/80">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground">Total Reports</p>
                  <p className="text-2xl font-bold">{stats.total}</p>
                </div>
                <FileText className="h-8 w-8 text-emerald-200" />
              </div>
            </CardContent>
          </Card>
          <Card className="border-l-4 border-l-amber-500 bg-white/80">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground">Pending Upload</p>
                  <p className="text-2xl font-bold">{stats.pendingUpload}</p>
                </div>
                <Upload className="h-8 w-8 text-amber-200" />
              </div>
            </CardContent>
          </Card>
          <Card className="border-l-4 border-l-blue-500 bg-white/80">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground">Uploaded</p>
                  <p className="text-2xl font-bold">{stats.uploaded}</p>
                </div>
                <FileCheck className="h-8 w-8 text-blue-200" />
              </div>
            </CardContent>
          </Card>
          <Card className="border-l-4 border-l-green-500 bg-white/80">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground">Delivered</p>
                  <p className="text-2xl font-bold">{stats.completed}</p>
                </div>
                <Send className="h-8 w-8 text-green-200" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filters */}
        <Card className="border-emerald-100 bg-white/80">
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search by Order ID, Sample ID, Patient name or mobile..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={branchFilter} onValueChange={setBranchFilter}>
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue placeholder="All Branches" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Branches</SelectItem>
                  {labBranches.filter(b => b.isActive).map(branch => (
                    <SelectItem key={branch.id} value={branch.id}>
                      {branch.code} - {branch.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Main Tabs */}
        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as typeof activeTab)} className="space-y-4">
          <TabsList className="bg-white border shadow-sm">
            <TabsTrigger
              value="pending-upload"
              className="gap-2 data-[state=active]:bg-amber-50 data-[state=active]:text-amber-700"
            >
              <Upload className="h-4 w-4" />
              <span className="hidden sm:inline">Pending Upload</span>
              <Badge variant="secondary" className="ml-1 h-5">{stats.pendingUpload}</Badge>
            </TabsTrigger>
            <TabsTrigger
              value="completed"
              className="gap-2 data-[state=active]:bg-green-50 data-[state=active]:text-green-700"
            >
              <CheckCircle2 className="h-4 w-4" />
              <span className="hidden sm:inline">Completed</span>
              <Badge variant="secondary" className="ml-1 h-5">{stats.completed}</Badge>
            </TabsTrigger>
          </TabsList>

          <Card className="overflow-hidden border-0 shadow-sm">
            <ScrollArea className="h-[calc(100vh-480px)] lg:h-[calc(100vh-440px)]">
              <TabsContent value="pending-upload" className="m-0">
                <div className="divide-y">
                  {filteredOrders.length === 0 ? (
                    <div className="p-12 text-center text-muted-foreground">
                      <Upload className="h-12 w-12 mx-auto mb-3 text-gray-200" />
                      <p>No reports pending upload</p>
                    </div>
                  ) : (
                    filteredOrders.map((order, index) => (
                      <ReportOrderItem
                        key={order.id}
                        order={order}
                        index={index}
                        onUpload={handleOpenUploadDialog}
                        onView={handleViewReport}
                        onSend={handleOpenDeliveryDialog}
                        isSelected={selectedOrders.includes(order.id)}
                        showUploadButton
                      />
                    ))
                  )}
                </div>
              </TabsContent>

              <TabsContent value="completed" className="m-0">
                <div className="divide-y">
                  {filteredOrders.length === 0 ? (
                    <div className="p-12 text-center text-muted-foreground">
                      <FileCheck className="h-12 w-12 mx-auto mb-3 text-gray-200" />
                      <p>No completed reports</p>
                    </div>
                  ) : (
                    filteredOrders.map((order, index) => (
                      <ReportOrderItem
                        key={order.id}
                        order={order}
                        index={index}
                        onUpload={handleOpenUploadDialog}
                        onView={handleViewReport}
                        onSend={handleOpenDeliveryDialog}
                        isSelected={selectedOrders.includes(order.id)}
                        showUploadButton={false}
                      />
                    ))
                  )}
                </div>
              </TabsContent>
            </ScrollArea>
          </Card>
        </Tabs>

        {/* ============ DIALOGS ============ */}

        {/* Upload Report Dialog */}
        <Dialog open={showUploadDialog} onOpenChange={setShowUploadDialog}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Upload className="h-5 w-5 text-emerald-600" />
                Upload Report
              </DialogTitle>
              <DialogDescription>
                Upload the PDF report for this order. Status will automatically change to Completed.
              </DialogDescription>
            </DialogHeader>

            {uploadOrder && (
              <div className="space-y-4">
                {/* Order Status Flow */}
                <div className="bg-gradient-to-r from-slate-50 to-emerald-50/50 rounded-xl p-4">
                  <p className="text-xs font-medium text-gray-500 mb-3">ORDER WORKFLOW</p>
                  <OrderStatusFlow
                    status={uploadOrder.status}
                    source={uploadOrder.source}
                    variant="compact"
                  />
                  <p className="text-xs text-emerald-600 mt-3 text-center font-medium">
                    → Uploading report will mark this order as COMPLETED
                  </p>
                </div>

                {/* Order Info */}
                <div className="bg-emerald-50 rounded-xl p-4 space-y-2 border border-emerald-100">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Order Number</span>
                    <span className="font-bold text-emerald-700">{uploadOrder.orderNumber}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Patient</span>
                    <span className="font-medium">{uploadOrder.patientName}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Tests</span>
                    <span className="text-sm">{uploadOrder.tests.length} tests</span>
                  </div>
                </div>

                {/* File Upload */}
                <div className="space-y-3">
                  <Label>Select Report File (PDF)</Label>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".pdf"
                    onChange={handleFileSelect}
                    className="hidden"
                  />

                  {!uploadFile ? (
                    <div
                      onClick={() => fileInputRef.current?.click()}
                      className={cn(
                        "border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors",
                        "hover:border-emerald-400 hover:bg-emerald-50/50",
                        "border-gray-200"
                      )}
                    >
                      <Upload className="h-10 w-10 mx-auto mb-3 text-gray-300" />
                      <p className="font-medium text-gray-600">Click to select PDF file</p>
                      <p className="text-xs text-muted-foreground mt-1">Max file size: 10MB</p>
                    </div>
                  ) : (
                    <div className="flex items-center gap-3 p-4 bg-emerald-50 rounded-xl border border-emerald-200">
                      <FileText className="h-8 w-8 text-emerald-600" />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">{uploadFile.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {(uploadFile.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setUploadFile(null)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  )}

                  {/* Upload Progress */}
                  {isUploading && (
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Uploading...</span>
                        <span>{uploadProgress}%</span>
                      </div>
                      <Progress value={uploadProgress} className="h-2" />
                    </div>
                  )}
                </div>
              </div>
            )}

            <DialogFooter className="gap-2">
              <Button variant="outline" onClick={() => setShowUploadDialog(false)} disabled={isUploading}>
                Cancel
              </Button>
              <Button
                onClick={handleUploadReport}
                disabled={!uploadFile || isUploading}
                className="bg-emerald-600 hover:bg-emerald-700"
              >
                {isUploading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <Upload className="h-4 w-4 mr-2" />
                    Upload & Complete
                  </>
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Delivery Dialog */}
        <Dialog open={showDeliveryDialog} onOpenChange={setShowDeliveryDialog}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Send className="h-5 w-5 text-blue-600" />
                Send Report
              </DialogTitle>
              <DialogDescription>
                Choose how to deliver the report to the patient
              </DialogDescription>
            </DialogHeader>

            {deliveryOrder && (
              <div className="space-y-4">
                {/* Patient Info */}
                <div className="bg-blue-50 rounded-xl p-4 space-y-2 border border-blue-100">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-gray-400" />
                    <span className="font-medium">{deliveryOrder.patientName}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Phone className="h-4 w-4" />
                    <span>{deliveryOrder.patientMobile}</span>
                  </div>
                  {deliveryOrder.patientEmail && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Mail className="h-4 w-4" />
                      <span>{deliveryOrder.patientEmail}</span>
                    </div>
                  )}
                </div>

                {/* Delivery Method */}
                <div className="space-y-3">
                  <Label>Delivery Method</Label>
                  <div className="grid grid-cols-2 gap-2">
                    {(["Email", "WhatsApp", "Print", "Portal"] as const).map((method) => (
                      <Button
                        key={method}
                        type="button"
                        variant={selectedDeliveryMethod === method ? "default" : "outline"}
                        onClick={() => setSelectedDeliveryMethod(method)}
                        className={cn(
                          "h-16 flex-col gap-1",
                          selectedDeliveryMethod === method && "bg-blue-600 hover:bg-blue-700"
                        )}
                      >
                        {method === "Email" && <Mail className="h-5 w-5" />}
                        {method === "WhatsApp" && <Phone className="h-5 w-5" />}
                        {method === "Print" && <Printer className="h-5 w-5" />}
                        {method === "Portal" && <FileText className="h-5 w-5" />}
                        <span className="text-xs">{method}</span>
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Notes */}
                <div className="space-y-2">
                  <Label>Additional Notes (Optional)</Label>
                  <Textarea
                    placeholder="Any message for the patient..."
                    value={deliveryNotes}
                    onChange={(e) => setDeliveryNotes(e.target.value)}
                    rows={3}
                  />
                </div>
              </div>
            )}

            <DialogFooter className="gap-2">
              <Button variant="outline" onClick={() => setShowDeliveryDialog(false)} disabled={isSending}>
                Cancel
              </Button>
              <Button
                onClick={handleSendReport}
                disabled={isSending}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {isSending ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4 mr-2" />
                    Send Report
                  </>
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* View Report Dialog */}
        <Dialog open={showViewDialog} onOpenChange={setShowViewDialog}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Eye className="h-5 w-5 text-indigo-600" />
                Report Details
              </DialogTitle>
            </DialogHeader>

            {viewOrder && (
              <div className="space-y-4">
                {/* Status Flow */}
                <div className="bg-gradient-to-r from-slate-50 to-indigo-50/50 rounded-xl p-4">
                  <OrderStatusFlow
                    status={viewOrder.status}
                    source={viewOrder.source}
                    variant="horizontal"
                  />
                </div>

                {/* Order Details */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <h4 className="font-semibold text-sm text-gray-700">Order Information</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Order #</span>
                        <span className="font-mono font-medium">{viewOrder.orderNumber}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Sample ID</span>
                        <span className="font-mono">{viewOrder.sampleId}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Source</span>
                        <span>{viewOrder.source}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Status</span>
                        <Badge className={statusColors[viewOrder.status]}>{viewOrder.status}</Badge>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h4 className="font-semibold text-sm text-gray-700">Patient Information</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Name</span>
                        <span className="font-medium">{viewOrder.patientName}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Mobile</span>
                        <span>{viewOrder.patientMobile}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Email</span>
                        <span className="text-xs">{viewOrder.patientEmail || "N/A"}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Tests */}
                <div className="space-y-3">
                  <h4 className="font-semibold text-sm text-gray-700">Test Results</h4>
                  <div className="space-y-2">
                    {viewOrder.tests.map(test => (
                      <div key={test.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <TestTube className="h-4 w-4 text-indigo-500" />
                          <div>
                            <p className="font-medium text-sm">{test.name}</p>
                            <p className="text-xs text-muted-foreground">{test.code}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">{test.resultValue || "Pending"}</p>
                          <p className="text-xs text-muted-foreground">{test.normalRange}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Report Info */}
                {viewOrder.reportUrl && (
                  <div className="flex items-center justify-between p-4 bg-green-50 rounded-xl border border-green-200">
                    <div className="flex items-center gap-3">
                      <FileCheck className="h-8 w-8 text-green-600" />
                      <div>
                        <p className="font-medium text-green-800">Report Uploaded</p>
                        <p className="text-xs text-green-600">
                          {viewOrder.reportUploadedAt && new Date(viewOrder.reportUploadedAt).toLocaleString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">
                        <Download className="h-4 w-4 mr-1" />
                        Download
                      </Button>
                      <Button size="sm" variant="outline">
                        <Printer className="h-4 w-4 mr-1" />
                        Print
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            )}

            <DialogFooter>
              <Button variant="outline" onClick={() => setShowViewDialog(false)}>
                Close
              </Button>
              {viewOrder?.reportUrl && (
                <Button onClick={() => {
                  setShowViewDialog(false);
                  handleOpenDeliveryDialog(viewOrder);
                }} className="bg-blue-600 hover:bg-blue-700">
                  <Send className="h-4 w-4 mr-2" />
                  Send to Patient
                </Button>
              )}
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}

// ============ ORDER ITEM COMPONENT ============
interface ReportOrderItemProps {
  order: ReportOrder;
  index: number;
  onUpload: (order: ReportOrder) => void;
  onView: (order: ReportOrder) => void;
  onSend: (order: ReportOrder) => void;
  isSelected: boolean;
  showUploadButton: boolean;
}

function ReportOrderItem({
  order,
  index,
  onUpload,
  onView,
  onSend,
  isSelected,
  showUploadButton,
}: ReportOrderItemProps) {
  const hasReport = !!order.reportUrl;
  const isDelivered = !!order.deliveryMethod;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.03 }}
      className={cn(
        "p-4 hover:bg-slate-50/80 transition-all",
        isSelected && "bg-emerald-50/50"
      )}
    >
      <div className="flex items-start gap-4">
        <div className="flex-1 min-w-0">
          {/* Header Row */}
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <span className="font-bold text-emerald-700">{order.orderNumber}</span>
            <Badge className={cn("text-xs", statusColors[order.status])}>{order.status}</Badge>
            <Badge variant="outline" className="text-xs">{order.source}</Badge>
            {hasReport && (
              <Badge className="text-xs bg-green-100 text-green-700 border-green-200">
                <FileCheck className="h-3 w-3 mr-1" />
                Report Uploaded
              </Badge>
            )}
            {isDelivered && (
              <Badge className="text-xs bg-blue-100 text-blue-700 border-blue-200">
                <Send className="h-3 w-3 mr-1" />
                {order.deliveryMethod}
              </Badge>
            )}
          </div>

          {/* Patient Info */}
          <div className="flex flex-wrap items-center gap-4 text-sm mb-2">
            <div className="flex items-center gap-1.5">
              <User className="h-4 w-4 text-gray-400" />
              <span className="font-medium">{order.patientName}</span>
            </div>
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <Phone className="h-4 w-4" />
              <span>{order.patientMobile}</span>
            </div>
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <Building2 className="h-4 w-4" />
              <span>{order.branchName}</span>
            </div>
          </div>

          {/* Sample & Tests */}
          <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground mb-2">
            <span className="font-mono bg-gray-100 px-1.5 py-0.5 rounded">{order.sampleId}</span>
            <span>•</span>
            <span>{order.tests.length} tests</span>
          </div>

          {/* Test Badges */}
          <div className="flex flex-wrap gap-1.5">
            {order.tests.slice(0, 4).map((test) => (
              <Badge
                key={test.id}
                variant="outline"
                className={cn(
                  "text-xs",
                  test.status === "Completed" && "bg-green-50 border-green-200 text-green-700"
                )}
              >
                {test.code}
                {test.status === "Completed" && <CheckCircle2 className="h-3 w-3 ml-1" />}
              </Badge>
            ))}
            {order.tests.length > 4 && (
              <Badge variant="outline" className="text-xs">+{order.tests.length - 4} more</Badge>
            )}
          </div>

          {/* Timestamps */}
          <div className="flex flex-wrap gap-3 text-xs text-muted-foreground mt-2">
            <span className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              Created: {new Date(order.createdAt).toLocaleDateString()}
            </span>
            {order.reportReadyAt && (
              <span>Ready: {new Date(order.reportReadyAt).toLocaleString()}</span>
            )}
            {order.reportUploadedAt && (
              <span>Uploaded: {new Date(order.reportUploadedAt).toLocaleString()}</span>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-2 shrink-0">
          {showUploadButton && !hasReport && (
            <Button
              size="sm"
              onClick={() => onUpload(order)}
              className="bg-emerald-600 hover:bg-emerald-700"
            >
              <Upload className="h-4 w-4 mr-1.5" />
              Upload
            </Button>
          )}
          {hasReport && (
            <>
              <Button
                size="sm"
                variant="outline"
                onClick={() => onView(order)}
              >
                <Eye className="h-4 w-4 mr-1.5" />
                View
              </Button>
              {!isDelivered && (
                <Button
                  size="sm"
                  onClick={() => onSend(order)}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <Send className="h-4 w-4 mr-1.5" />
                  Send
                </Button>
              )}
            </>
          )}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => onView(order)}>
                <Eye className="h-4 w-4 mr-2" />
                View Details
              </DropdownMenuItem>
              {hasReport && (
                <>
                  <DropdownMenuItem>
                    <Download className="h-4 w-4 mr-2" />
                    Download Report
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Printer className="h-4 w-4 mr-2" />
                    Print Report
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => onSend(order)}>
                    <Send className="h-4 w-4 mr-2" />
                    Send to Patient
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </motion.div>
  );
}
