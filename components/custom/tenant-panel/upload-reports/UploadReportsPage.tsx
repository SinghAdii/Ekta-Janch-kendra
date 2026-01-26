"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FileUp,
  Search,
  Filter,
  User,
  Phone,
  MapPin,
  Calendar,
  Clock,
  TestTube,
  Package,
  Upload,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Download,
  Send,
  Eye,
  Trash2,
  FileText,
  AlertTriangle,
  ChevronDown,
  X,
  IndianRupee,
  Loader2,
  CheckCheck,
  MessageSquare,
  MailCheck,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
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
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Label } from "@/components/ui/label";

import type {
  ReportReadyOrder,
  TestReportItem,
  ReportUploadStats,
} from "./upload-reports.types";
import {
  fetchReportReadyOrders,
  fetchReportUploadStats,
  uploadTestReport,
  deleteTestReport,
  markOrderAsCompleted,
  sendReportToPatient,
  getPendingTestsCount,
  getAllTestsFromOrder,
  areAllReportsUploaded,
} from "./upload-reports.data";

// Priority Colors
const priorityColors: Record<string, string> = {
  Normal: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400",
  Urgent: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  Critical: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
};

// Report Status Colors
const reportStatusColors: Record<string, string> = {
  Pending: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  Uploaded: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  Verified: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  Delivered: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
};

// Format Date
function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function formatTime(dateStr: string) {
  return new Date(dateStr).toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatINR(amount: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

// Stats Card Component
function StatsCard({
  title,
  value,
  icon: Icon,
  color,
  subtitle,
}: {
  title: string;
  value: string | number;
  icon: React.ElementType;
  color: string;
  subtitle?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="relative overflow-hidden hover:shadow-lg transition-all duration-300">
        <div
          className="absolute top-0 right-0 w-24 h-24 -mr-6 -mt-6 rounded-full opacity-10"
          style={{ backgroundColor: color }}
        />
        <CardContent className="p-5">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">{title}</p>
              <p className="text-2xl font-bold">{value}</p>
              {subtitle && (
                <p className="text-xs text-muted-foreground">{subtitle}</p>
              )}
            </div>
            <div
              className="rounded-xl p-3"
              style={{ backgroundColor: `${color}15` }}
            >
              <Icon className="h-5 w-5" style={{ color }} />
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

// Order Card Component
function OrderCard({
  order,
  isExpanded,
  onToggle,
  onUploadClick,
  onViewReport,
  onDeleteReport,
  onMarkComplete,
  onSendReport,
}: {
  order: ReportReadyOrder;
  isExpanded: boolean;
  onToggle: () => void;
  onUploadClick: (test: TestReportItem) => void;
  onViewReport: (test: TestReportItem) => void;
  onDeleteReport: (test: TestReportItem) => void;
  onMarkComplete: () => void;
  onSendReport: (method: "email" | "sms" | "whatsapp") => void;
}) {
  const allTests = getAllTestsFromOrder(order);
  const pendingCount = getPendingTestsCount(order);
  const uploadedCount = allTests.length - pendingCount;
  const progress = (uploadedCount / allTests.length) * 100;
  const isComplete = areAllReportsUploaded(order);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className={`overflow-hidden transition-all duration-300 ${isExpanded ? "ring-2 ring-primary/20" : ""}`}>
        {/* Header */}
        <div
          className="p-4 cursor-pointer hover:bg-muted/50 transition-colors"
          onClick={onToggle}
        >
          <div className="flex items-start justify-between gap-4">
            {/* Left Section - Order & Patient Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 flex-wrap">
                <h3 className="font-semibold text-lg">{order.orderNumber}</h3>
                <Badge className={priorityColors[order.priority]}>
                  {order.priority}
                </Badge>
                {isComplete && (
                  <Badge className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
                    <CheckCircle2 className="h-3 w-3 mr-1" />
                    All Uploaded
                  </Badge>
                )}
              </div>
              <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground flex-wrap">
                <span className="flex items-center gap-1">
                  <User className="h-4 w-4" />
                  {order.patient.name}
                </span>
                <span className="flex items-center gap-1">
                  <Phone className="h-4 w-4" />
                  {order.patient.mobile}
                </span>
                <span className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  {formatDate(order.orderDate)}
                </span>
              </div>
            </div>

            {/* Right Section - Progress & Actions */}
            <div className="flex items-center gap-4">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-medium">
                  {uploadedCount}/{allTests.length} Uploaded
                </p>
                <div className="w-32 mt-1">
                  <Progress value={progress} className="h-2" />
                </div>
              </div>
              <motion.div
                animate={{ rotate: isExpanded ? 180 : 0 }}
                transition={{ duration: 0.2 }}
              >
                <ChevronDown className="h-5 w-5 text-muted-foreground" />
              </motion.div>
            </div>
          </div>
        </div>

        {/* Expanded Content */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Separator />
              <div className="p-4 bg-muted/30">
                {/* Patient Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <User className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Patient</p>
                      <p className="text-sm font-medium">{order.patient.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {order.patient.age} yrs, {order.patient.gender}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <Phone className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Contact</p>
                      <p className="text-sm font-medium">{order.patient.mobile}</p>
                      <p className="text-xs text-muted-foreground truncate max-w-[150px]">
                        {order.patient.email}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <MapPin className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Address</p>
                      <p className="text-sm font-medium">{order.patient.city}</p>
                      <p className="text-xs text-muted-foreground">
                        {order.patient.pincode}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <IndianRupee className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Order Value</p>
                      <p className="text-sm font-medium">{formatINR(order.totalAmount)}</p>
                      <p className="text-xs text-muted-foreground">Paid</p>
                    </div>
                  </div>
                </div>

                {/* Timeline */}
                {(order.sampleCollectedAt || order.processingStartedAt || order.reportReadyAt) && (
                  <div className="flex items-center gap-2 mb-6 flex-wrap text-xs">
                    {order.sampleCollectedAt && (
                      <Badge variant="outline" className="gap-1">
                        <Clock className="h-3 w-3" />
                        Sample: {formatDate(order.sampleCollectedAt)} {formatTime(order.sampleCollectedAt)}
                      </Badge>
                    )}
                    {order.processingStartedAt && (
                      <Badge variant="outline" className="gap-1">
                        <TestTube className="h-3 w-3" />
                        Processing: {formatDate(order.processingStartedAt)} {formatTime(order.processingStartedAt)}
                      </Badge>
                    )}
                    {order.reportReadyAt && (
                      <Badge variant="outline" className="gap-1">
                        <FileText className="h-3 w-3" />
                        Ready: {formatDate(order.reportReadyAt)} {formatTime(order.reportReadyAt)}
                      </Badge>
                    )}
                  </div>
                )}

                {/* Notes */}
                {order.notes && (
                  <div className="mb-6 p-3 rounded-lg bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800">
                    <p className="text-sm text-amber-800 dark:text-amber-200 flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4" />
                      <span className="font-medium">Note:</span> {order.notes}
                    </p>
                  </div>
                )}

                {/* Individual Tests */}
                {order.tests.length > 0 && (
                  <div className="mb-6">
                    <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
                      <TestTube className="h-4 w-4 text-primary" />
                      Individual Tests ({order.tests.length})
                    </h4>
                    <div className="space-y-2">
                      {order.tests.map((test) => (
                        <TestReportRow
                          key={test.id}
                          test={test}
                          onUpload={() => onUploadClick(test)}
                          onView={() => onViewReport(test)}
                          onDelete={() => onDeleteReport(test)}
                        />
                      ))}
                    </div>
                  </div>
                )}

                {/* Packages */}
                {order.packages.length > 0 && (
                  <div className="mb-6">
                    {order.packages.map((pkg) => (
                      <div key={pkg.id} className="mb-4">
                        <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
                          <Package className="h-4 w-4 text-primary" />
                          {pkg.packageName} ({pkg.testsIncluded.length} tests)
                        </h4>
                        <div className="space-y-2 pl-4 border-l-2 border-primary/20">
                          {pkg.testsIncluded.map((test) => (
                            <TestReportRow
                              key={test.id}
                              test={test}
                              onUpload={() => onUploadClick(test)}
                              onView={() => onViewReport(test)}
                              onDelete={() => onDeleteReport(test)}
                            />
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex items-center justify-between flex-wrap gap-3 pt-4 border-t">
                  <div className="flex items-center gap-2 flex-wrap">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="sm" disabled={!isComplete}>
                          <Send className="h-4 w-4 mr-2" />
                          Send Report
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuItem onClick={() => onSendReport("email")}>
                          <MailCheck className="h-4 w-4 mr-2" />
                          Send via Email
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onSendReport("sms")}>
                          <MessageSquare className="h-4 w-4 mr-2" />
                          Send via SMS
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onSendReport("whatsapp")}>
                          <Send className="h-4 w-4 mr-2" />
                          Send via WhatsApp
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                  <Button
                    size="sm"
                    disabled={!isComplete}
                    onClick={onMarkComplete}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    <CheckCheck className="h-4 w-4 mr-2" />
                    Mark as Completed
                  </Button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </Card>
    </motion.div>
  );
}

// Test Report Row Component
function TestReportRow({
  test,
  onUpload,
  onView,
  onDelete,
}: {
  test: TestReportItem;
  onUpload: () => void;
  onView: () => void;
  onDelete: () => void;
}) {
  const isUploaded = test.reportStatus === "Uploaded" || test.reportStatus === "Verified";

  return (
    <div className="flex items-center justify-between p-3 rounded-lg bg-background border hover:border-primary/30 transition-colors">
      <div className="flex items-center gap-3 flex-1 min-w-0">
        <div className={`p-2 rounded-lg ${isUploaded ? "bg-green-100 dark:bg-green-900/30" : "bg-amber-100 dark:bg-amber-900/30"}`}>
          {isUploaded ? (
            <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400" />
          ) : (
            <AlertCircle className="h-4 w-4 text-amber-600 dark:text-amber-400" />
          )}
        </div>
        <div className="min-w-0">
          <p className="text-sm font-medium truncate">{test.testName}</p>
          <p className="text-xs text-muted-foreground">
            {test.testCode} • {test.sampleType}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Badge className={reportStatusColors[test.reportStatus]}>
          {test.reportStatus}
        </Badge>
        {isUploaded ? (
          <div className="flex items-center gap-1">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onView}>
                    <Eye className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>View Report</TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500 hover:text-red-600" onClick={onDelete}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Delete Report</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        ) : (
          <Button size="sm" onClick={onUpload} className="gap-1">
            <Upload className="h-4 w-4" />
            Upload
          </Button>
        )}
      </div>
    </div>
  );
}

// Main Page Component
export default function UploadReportsPage() {
  const [orders, setOrders] = useState<ReportReadyOrder[]>([]);
  const [stats, setStats] = useState<ReportUploadStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [priorityFilter, setPriorityFilter] = useState<string>("all");
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);

  // Upload Dialog State
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [selectedTest, setSelectedTest] = useState<TestReportItem | null>(null);
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploadRemarks, setUploadRemarks] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  // Delete Dialog State
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [testToDelete, setTestToDelete] = useState<TestReportItem | null>(null);

  // Load Data
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [ordersData, statsData] = await Promise.all([
        fetchReportReadyOrders(),
        fetchReportUploadStats(),
      ]);
      setOrders(ordersData);
      setStats(statsData);
    } catch (error) {
      console.error("Error loading data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Filter Orders
  const filteredOrders = useMemo(() => {
    let result = [...orders];

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (order) =>
          order.orderNumber.toLowerCase().includes(query) ||
          order.patient.name.toLowerCase().includes(query) ||
          order.patient.mobile.includes(query)
      );
    }

    // Priority filter
    if (priorityFilter !== "all") {
      result = result.filter((order) => order.priority === priorityFilter);
    }

    return result;
  }, [orders, searchQuery, priorityFilter]);

  // Handle Upload Click
  const handleUploadClick = (orderId: string, test: TestReportItem) => {
    setSelectedOrderId(orderId);
    setSelectedTest(test);
    setUploadFile(null);
    setUploadRemarks("");
    setUploadDialogOpen(true);
  };

  // Handle File Drop
  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type === "application/pdf") {
      setUploadFile(file);
    }
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  // Handle File Select
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadFile(file);
    }
  };

  // Handle Upload Submit
  const handleUploadSubmit = async () => {
    if (!uploadFile || !selectedOrderId || !selectedTest) return;

    setIsUploading(true);
    try {
      const response = await uploadTestReport(
        selectedOrderId,
        selectedTest.testId,
        uploadFile,
        uploadRemarks
      );

      if (response.success) {
        // Update local state
        setOrders((prevOrders) =>
          prevOrders.map((order) => {
            if (order.id !== selectedOrderId) return order;

            // Update individual tests
            const updatedTests = order.tests.map((test) =>
              test.id === selectedTest.id
                ? {
                    ...test,
                    reportStatus: "Uploaded" as const,
                    reportUrl: response.reportUrl,
                    uploadedAt: response.uploadedAt,
                    uploadedBy: "Current User",
                  }
                : test
            );

            // Update package tests
            const updatedPackages = order.packages.map((pkg) => ({
              ...pkg,
              testsIncluded: pkg.testsIncluded.map((test) =>
                test.id === selectedTest.id
                  ? {
                      ...test,
                      reportStatus: "Uploaded" as const,
                      reportUrl: response.reportUrl,
                      uploadedAt: response.uploadedAt,
                      uploadedBy: "Current User",
                    }
                  : test
              ),
            }));

            return { ...order, tests: updatedTests, packages: updatedPackages };
          })
        );

        setUploadDialogOpen(false);
      }
    } catch (error) {
      console.error("Upload error:", error);
    } finally {
      setIsUploading(false);
    }
  };

  // Handle Delete Report
  const handleDeleteReport = (orderId: string, test: TestReportItem) => {
    setSelectedOrderId(orderId);
    setTestToDelete(test);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!selectedOrderId || !testToDelete) return;

    try {
      const response = await deleteTestReport(selectedOrderId, testToDelete.testId);

      if (response.success) {
        // Update local state
        setOrders((prevOrders) =>
          prevOrders.map((order) => {
            if (order.id !== selectedOrderId) return order;

            const updatedTests = order.tests.map((test) =>
              test.id === testToDelete.id
                ? {
                    ...test,
                    reportStatus: "Pending" as const,
                    reportUrl: undefined,
                    uploadedAt: undefined,
                    uploadedBy: undefined,
                  }
                : test
            );

            const updatedPackages = order.packages.map((pkg) => ({
              ...pkg,
              testsIncluded: pkg.testsIncluded.map((test) =>
                test.id === testToDelete.id
                  ? {
                      ...test,
                      reportStatus: "Pending" as const,
                      reportUrl: undefined,
                      uploadedAt: undefined,
                      uploadedBy: undefined,
                    }
                  : test
              ),
            }));

            return { ...order, tests: updatedTests, packages: updatedPackages };
          })
        );

        setDeleteDialogOpen(false);
      }
    } catch (error) {
      console.error("Delete error:", error);
    }
  };

  // Handle Mark Complete
  const handleMarkComplete = async (orderId: string) => {
    try {
      const response = await markOrderAsCompleted(orderId);
      if (response.success) {
        // Remove from list or update status
        setOrders((prev) => prev.filter((o) => o.id !== orderId));
      }
    } catch (error) {
      console.error("Error marking complete:", error);
    }
  };

  // Handle Send Report
  const handleSendReport = async (orderId: string, method: "email" | "sms" | "whatsapp") => {
    try {
      await sendReportToPatient(orderId, method);
      // Show success toast/notification
    } catch (error) {
      console.error("Error sending report:", error);
    }
  };

  // Handle View Report
  const handleViewReport = (test: TestReportItem) => {
    if (test.reportUrl) {
      window.open(test.reportUrl, "_blank");
    }
  };

  return (
    <div className="p-4 lg:p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            <FileUp className="h-7 w-7 text-primary" />
            Upload Reports
          </h1>
          <p className="text-muted-foreground mt-1">
            Upload test reports for orders ready for delivery
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={loadData} disabled={isLoading}>
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          <StatsCard
            title="Report Ready"
            value={stats.totalReportReady}
            icon={FileText}
            color="#166187"
            subtitle="Orders pending"
          />
          <StatsCard
            title="Pending Uploads"
            value={stats.pendingUploads}
            icon={Upload}
            color="#f59e0b"
            subtitle="Tests to upload"
          />
          <StatsCard
            title="Uploaded Today"
            value={stats.uploadedToday}
            icon={CheckCircle2}
            color="#22c55e"
            subtitle="Reports uploaded"
          />
          <StatsCard
            title="Urgent Orders"
            value={stats.urgentOrders}
            icon={AlertTriangle}
            color="#ef4444"
            subtitle="Priority cases"
          />
          <StatsCard
            title="Avg Upload Time"
            value={stats.averageUploadTime}
            icon={Clock}
            color="#8b5cf6"
            subtitle="Per report"
          />
        </div>
      )}

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by order number, patient name or mobile..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={priorityFilter} onValueChange={setPriorityFilter}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Priorities</SelectItem>
                <SelectItem value="Normal">Normal</SelectItem>
                <SelectItem value="Urgent">Urgent</SelectItem>
                <SelectItem value="Critical">Critical</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Orders List */}
      <div className="space-y-4">
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : filteredOrders.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <FileText className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold">No Orders Found</h3>
              <p className="text-muted-foreground text-sm">
                {searchQuery || priorityFilter !== "all"
                  ? "Try adjusting your filters"
                  : "No report-ready orders at the moment"}
              </p>
            </CardContent>
          </Card>
        ) : (
          filteredOrders.map((order) => (
            <OrderCard
              key={order.id}
              order={order}
              isExpanded={expandedOrderId === order.id}
              onToggle={() =>
                setExpandedOrderId(expandedOrderId === order.id ? null : order.id)
              }
              onUploadClick={(test) => handleUploadClick(order.id, test)}
              onViewReport={handleViewReport}
              onDeleteReport={(test) => handleDeleteReport(order.id, test)}
              onMarkComplete={() => handleMarkComplete(order.id)}
              onSendReport={(method) => handleSendReport(order.id, method)}
            />
          ))
        )}
      </div>

      {/* Upload Dialog */}
      <Dialog open={uploadDialogOpen} onOpenChange={setUploadDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Upload className="h-5 w-5 text-primary" />
              Upload Report
            </DialogTitle>
            <DialogDescription>
              Upload PDF report for {selectedTest?.testName}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {/* Test Info */}
            <div className="p-3 rounded-lg bg-muted">
              <p className="text-sm font-medium">{selectedTest?.testName}</p>
              <p className="text-xs text-muted-foreground">
                {selectedTest?.testCode} • {selectedTest?.sampleType}
              </p>
            </div>

            {/* File Upload */}
            <div
              className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
                isDragging
                  ? "border-primary bg-primary/5"
                  : "border-muted-foreground/25 hover:border-primary/50"
              }`}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
            >
              {uploadFile ? (
                <div className="flex items-center justify-center gap-3">
                  <FileText className="h-8 w-8 text-primary" />
                  <div className="text-left">
                    <p className="text-sm font-medium truncate max-w-[200px]">
                      {uploadFile.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {(uploadFile.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => setUploadFile(null)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <>
                  <Upload className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
                  <p className="text-sm font-medium">
                    Drag and drop PDF file here
                  </p>
                  <p className="text-xs text-muted-foreground mb-3">
                    or click to browse
                  </p>
                  <input
                    type="file"
                    accept=".pdf"
                    onChange={handleFileSelect}
                    className="hidden"
                    id="file-upload"
                  />
                  <Label htmlFor="file-upload">
                    <Button variant="outline" size="sm" asChild>
                      <span>Browse Files</span>
                    </Button>
                  </Label>
                </>
              )}
            </div>

            {/* Remarks */}
            <div className="space-y-2">
              <Label htmlFor="remarks">Remarks (Optional)</Label>
              <Textarea
                id="remarks"
                placeholder="Add any remarks about the report..."
                value={uploadRemarks}
                onChange={(e) => setUploadRemarks(e.target.value)}
                rows={2}
              />
            </div>
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              variant="outline"
              onClick={() => setUploadDialogOpen(false)}
              disabled={isUploading}
            >
              Cancel
            </Button>
            <Button
              onClick={handleUploadSubmit}
              disabled={!uploadFile || isUploading}
            >
              {isUploading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Uploading...
                </>
              ) : (
                <>
                  <Upload className="h-4 w-4 mr-2" />
                  Upload Report
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-red-600">
              <Trash2 className="h-5 w-5" />
              Delete Report
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to delete the report for{" "}
              <span className="font-medium">{testToDelete?.testName}</span>?
              This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDelete}>
              <Trash2 className="h-4 w-4 mr-2" />
              Delete Report
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
