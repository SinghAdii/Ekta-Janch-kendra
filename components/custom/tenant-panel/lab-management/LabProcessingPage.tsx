"use client";

import React, { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  QrCode,
  FlaskConical,
  Clock,
  CheckCircle2,
  AlertCircle,
  Play,
  FileCheck,
  User,
  Phone,
  Barcode,
  RefreshCw,
  Filter,
  Zap,
  Building2,
  Camera,
  ScanLine,
  X,
  Shield,
  Settings,
  Video,
  CreditCard,
  IndianRupee,
  AlertTriangle,
  Loader2,
  Printer,
  TestTube,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
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
import { cn } from "@/lib/utils";

import type { LabProcessingItem, OrderStatus, SlotBooking, PaymentMode } from "./lab-management.types";
import { labProcessingQueue, findOrderByScanInput, identifyScanInput, labBranches, type ScanResult } from "./lab-management.data";
import { OrderStatusFlow, getNextStatus, canTransitionTo, getStatusMessage } from "../orders/OrderStatusFlow";

// ============ CONSTANTS ============
const statusColors: Record<string, string> = {
  "Pending": "bg-amber-100 text-amber-700 border-amber-200",
  "Sample Collected": "bg-purple-100 text-purple-700 border-purple-200",
  "Processing": "bg-blue-100 text-blue-700 border-blue-200",
  "Report Ready": "bg-cyan-100 text-cyan-700 border-cyan-200",
  "Completed": "bg-green-100 text-green-700 border-green-200",
  "In Progress": "bg-blue-100 text-blue-700 border-blue-200",
};

const paymentColors: Record<string, string> = {
  "Pending": "bg-red-100 text-red-700 border-red-200",
  "Paid": "bg-green-100 text-green-700 border-green-200",
  "Partial": "bg-amber-100 text-amber-700 border-amber-200",
};

const priorityColors: Record<string, string> = {
  Normal: "bg-slate-100 text-slate-700 border-slate-200",
  Urgent: "bg-orange-100 text-orange-700 border-orange-200",
  Emergency: "bg-red-100 text-red-700 border-red-200",
};

type ScanMode = "manual" | "camera" | "scanner";

interface CameraPermissionState {
  status: "prompt" | "granted" | "denied" | "checking";
  error?: string;
}

// ============ MOCK CURRENT BRANCH ============
// In production, this would come from auth context / employee session
const CURRENT_BRANCH_ID = "branch-001"; // Main Branch - for demo

// Props interface for handling slot booking detection
export interface LabProcessingPageProps {
  onSlotBookingDetected?: (slotBooking: SlotBooking) => void;
  currentBranchId?: string; // From auth context
}

export default function LabProcessingPage({ 
  onSlotBookingDetected,
  currentBranchId = CURRENT_BRANCH_ID 
}: LabProcessingPageProps = {}) {
  // ============ STATE ============
  const [processingQueue, setProcessingQueue] = useState<LabProcessingItem[]>(labProcessingQueue);
  const [filteredQueue, setFilteredQueue] = useState<LabProcessingItem[]>(labProcessingQueue);
  const [searchInput, setSearchInput] = useState("");
  const [activeTab, setActiveTab] = useState<"pending-payment" | "processing" | "ready">("pending-payment");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [branchFilter, setBranchFilter] = useState<string>("all");
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  
  // Scan Result State
  const [scannedItem, setScannedItem] = useState<LabProcessingItem | null>(null);
  const [showScanResult, setShowScanResult] = useState(false);
  const [scanError, setScanError] = useState<string | null>(null);
  const [branchMismatch, setBranchMismatch] = useState<{ item: LabProcessingItem; message: string } | null>(null);
  
  // Payment Dialog State
  const [showPaymentDialog, setShowPaymentDialog] = useState(false);
  const [paymentItem, setPaymentItem] = useState<LabProcessingItem | null>(null);
  const [selectedPaymentMode, setSelectedPaymentMode] = useState<PaymentMode>("Cash");
  const [paymentAmount, setPaymentAmount] = useState<string>("");
  
  // Processing State
  const [isProcessing, setIsProcessing] = useState(false);
  const [showBulkDialog, setShowBulkDialog] = useState(false);
  
  // Camera State
  const [scanMode, setScanMode] = useState<ScanMode>("manual");
  const [showCameraDialog, setShowCameraDialog] = useState(false);
  const [cameraPermission, setCameraPermission] = useState<CameraPermissionState>({ status: "prompt" });
  const [isCameraActive, setIsCameraActive] = useState(false);
  
  // Settings
  const [showSettingsDialog, setShowSettingsDialog] = useState(false);
  const [scannerEnabled, setScannerEnabled] = useState(false);
  const [autoStartProcessing, setAutoStartProcessing] = useState(true);
  
  // Slot booking detection state
  const [detectedSlotBooking, setDetectedSlotBooking] = useState<SlotBooking | null>(null);
  const [showSlotBookingDialog, setShowSlotBookingDialog] = useState(false);
  
  // Refs
  const searchInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const scanIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Get current branch info
  const currentBranch = useMemo(() => 
    labBranches.find(b => b.id === currentBranchId) || labBranches[0],
    [currentBranchId]
  );

  // ============ COMPUTED VALUES ============
  const stats = useMemo(() => ({
    total: processingQueue.length,
    pendingPayment: processingQueue.filter((p) => 
      (p.status === "Pending" || p.status === "Sample Collected") && 
      (!p.tests?.[0] || p.tests.some(t => t.status === "Pending"))
    ).length,
    sampleCollected: processingQueue.filter((p) => p.status === "Sample Collected").length,
    processing: processingQueue.filter((p) => p.status === "In Progress" || p.tests?.some(t => t.status === "In Progress")).length,
    reportReady: processingQueue.filter((p) => p.status === "Report Ready").length,
    myBranch: processingQueue.filter((p) => p.branchId === currentBranchId).length,
  }), [processingQueue, currentBranchId]);

  // ============ EFFECTS ============
  useEffect(() => {
    searchInputRef.current?.focus();
  }, []);

  useEffect(() => {
    let filtered = [...processingQueue];

    // Filter by tab/category
    if (activeTab === "pending-payment") {
      filtered = filtered.filter(item => 
        item.status === "Pending" || item.status === "Sample Collected"
      );
    } else if (activeTab === "processing") {
      filtered = filtered.filter(item => 
        item.status === "In Progress" || item.tests?.some(t => t.status === "In Progress")
      );
    } else if (activeTab === "ready") {
      filtered = filtered.filter(item => item.status === "Report Ready");
    }

    // Additional status filter within tab
    if (statusFilter && statusFilter !== "all") {
      filtered = filtered.filter((item) => item.status === statusFilter);
    }

    // Filter by branch (default to current branch)
    if (branchFilter && branchFilter !== "all") {
      filtered = filtered.filter((item) => item.branchId === branchFilter);
    } else {
      // By default, only show items from current branch
      filtered = filtered.filter(item => item.branchId === currentBranchId);
    }

    setFilteredQueue(filtered);
  }, [activeTab, statusFilter, branchFilter, processingQueue, currentBranchId]);

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  const checkCameraPermission = async (): Promise<boolean> => {
    setCameraPermission({ status: "checking" });
    try {
      const result = await navigator.permissions.query({ name: "camera" as PermissionName });
      if (result.state === "granted") {
        setCameraPermission({ status: "granted" });
        return true;
      } else if (result.state === "denied") {
        setCameraPermission({ status: "denied", error: "Camera access denied. Please enable it in browser settings." });
        return false;
      }
      setCameraPermission({ status: "prompt" });
      return true;
    } catch {
      setCameraPermission({ status: "prompt" });
      return true;
    }
  };

  const requestCameraAccess = async (): Promise<boolean> => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" }
      });
      streamRef.current = stream;
      setCameraPermission({ status: "granted" });
      return true;
    } catch (err) {
      const error = err as Error;
      if (error.name === "NotAllowedError") {
        setCameraPermission({ status: "denied", error: "Camera access denied. Please enable it in browser settings." });
      } else if (error.name === "NotFoundError") {
        setCameraPermission({ status: "denied", error: "No camera found on this device." });
      } else {
        setCameraPermission({ status: "denied", error: "Failed to access camera. Please try again." });
      }
      return false;
    }
  };

  const startCamera = async () => {
    const hasPermission = await checkCameraPermission();
    if (!hasPermission && cameraPermission.status === "denied") {
      return;
    }

    const granted = await requestCameraAccess();
    if (!granted) return;

    setIsCameraActive(true);
    setShowCameraDialog(true);

    setTimeout(() => {
      if (videoRef.current && streamRef.current) {
        videoRef.current.srcObject = streamRef.current;
        videoRef.current.play();
        startScanning();
      }
    }, 100);
  };

  const stopCamera = useCallback(() => {
    if (scanIntervalRef.current) {
      clearInterval(scanIntervalRef.current);
      scanIntervalRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setIsCameraActive(false);
    setShowCameraDialog(false);
  }, []);

  const startScanning = () => {
    scanIntervalRef.current = setInterval(() => {
      simulateQRScan();
    }, 2000);
  };

  const simulateQRScan = () => {
    const sampleIds = processingQueue.map(p => p.sampleId);
    const orderNumbers = processingQueue.map(p => p.orderNumber);
    const allIds = [...sampleIds, ...orderNumbers];
    
    if (allIds.length > 0 && Math.random() > 0.7) {
      const randomId = allIds[Math.floor(Math.random() * allIds.length)];
      handleScanResult(randomId);
      stopCamera();
    }
  };

  // ============ BRANCH VALIDATION ============
  const validateBranch = (item: LabProcessingItem): { valid: boolean; message?: string } => {
    if (item.branchId !== currentBranchId) {
      const itemBranch = labBranches.find(b => b.id === item.branchId);
      return {
        valid: false,
        message: `This order belongs to ${itemBranch?.name || "another branch"} (${itemBranch?.code || item.branchId}). You are logged in at ${currentBranch.name} (${currentBranch.code}). Please update the order in Order Management page if branch transfer is needed.`
      };
    }
    return { valid: true };
  };

  // ============ SCAN HANDLERS ============
  const handleScanResult = (scannedValue: string) => {
    setScanError(null);
    setBranchMismatch(null);
    
    // Use the enhanced scan identification function
    const result = identifyScanInput(scannedValue);
    
    if (result.type === "processing" && result.processingItem) {
      const item = result.processingItem;
      
      // Validate branch
      const branchCheck = validateBranch(item);
      if (!branchCheck.valid) {
        setBranchMismatch({ item, message: branchCheck.message! });
        setSearchInput("");
        return;
      }
      
      // It's a processing order - show processing dialog
      setScannedItem(item);
      setShowScanResult(true);
      setSearchInput("");
    } else if (result.type === "slot-booking" && result.slotBooking) {
      // It's a slot booking - show slot booking dialog or redirect
      setDetectedSlotBooking(result.slotBooking);
      setShowSlotBookingDialog(true);
      setSearchInput("");
    } else {
      // Not found
      setScanError(`No order or slot booking found for: "${scannedValue}". Please verify the ID or QR code.`);
      setScannedItem(null);
      setDetectedSlotBooking(null);
    }
  };

  const handleScanInput = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!searchInput.trim()) {
      setScanError("Please enter an Order ID, Sample ID, or scan QR code");
      return;
    }

    handleScanResult(searchInput);
  };

  const handleScanModeChange = (mode: ScanMode) => {
    setScanMode(mode);
    if (mode === "camera") {
      startCamera();
    } else {
      stopCamera();
      if (mode === "manual") {
        searchInputRef.current?.focus();
      }
    }
  };

  // ============ PAYMENT HANDLERS ============
  const handleOpenPaymentDialog = (item: LabProcessingItem) => {
    setPaymentItem(item);
    setPaymentAmount(""); // Would be item.totalAmount in real implementation
    setSelectedPaymentMode("Cash");
    setShowPaymentDialog(true);
    setShowScanResult(false);
  };

  const handleCompletePayment = async () => {
    if (!paymentItem) return;
    
    setIsProcessing(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 800));
      
      setProcessingQueue(prev =>
        prev.map(p =>
          p.id === paymentItem.id
            ? {
                ...p,
                status: "In Progress" as OrderStatus,
                startedAt: new Date().toISOString(),
              }
            : p
        )
      );
      
      setShowPaymentDialog(false);
      setPaymentItem(null);
      setActiveTab("processing");
    } catch (error) {
      console.error("Payment error:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  // ============ PROCESSING HANDLERS ============
  const handleStartProcessing = async (item: LabProcessingItem) => {
    // Validate branch first
    const branchCheck = validateBranch(item);
    if (!branchCheck.valid) {
      setBranchMismatch({ item, message: branchCheck.message! });
      setShowScanResult(false);
      return;
    }

    setIsProcessing(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));

      setProcessingQueue((prev) =>
        prev.map((p) =>
          p.id === item.id
            ? {
                ...p,
                status: "In Progress" as OrderStatus,
                startedAt: new Date().toISOString(),
              }
            : p
        )
      );
      
      setShowScanResult(false);
      setScannedItem(null);
      setActiveTab("processing");
    } catch (error) {
      console.error("Error starting processing:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleMarkReportReady = async (itemId: string) => {
    setIsProcessing(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));

      setProcessingQueue((prev) =>
        prev.map((p) =>
          p.id === itemId
            ? {
                ...p,
                status: "Report Ready" as OrderStatus,
                completedAt: new Date().toISOString(),
              }
            : p
        )
      );
    } catch (error) {
      console.error("Error marking report ready:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleBulkReportReady = async () => {
    setIsProcessing(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setProcessingQueue((prev) =>
        prev.map((p) =>
          selectedItems.includes(p.id)
            ? {
                ...p,
                status: "Report Ready" as OrderStatus,
                completedAt: new Date().toISOString(),
              }
            : p
        )
      );

      setSelectedItems([]);
      setShowBulkDialog(false);
    } catch (error) {
      console.error("Error bulk updating:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleToggleSelect = (itemId: string) => {
    setSelectedItems((prev) =>
      prev.includes(itemId)
        ? prev.filter((id) => id !== itemId)
        : [...prev, itemId]
    );
  };

  const handleSelectAllInProgress = () => {
    const inProgressIds = filteredQueue
      .filter((item) => item.status === "In Progress")
      .map((item) => item.id);
    setSelectedItems(inProgressIds);
  };

  // Handle slot booking redirect
  const handleSlotBookingRedirect = () => {
    if (detectedSlotBooking && onSlotBookingDetected) {
      onSlotBookingDetected(detectedSlotBooking);
    }
    setShowSlotBookingDialog(false);
    setDetectedSlotBooking(null);
  };

  // ============ RENDER ============
  return (
    <div className="h-full flex flex-col bg-gradient-to-br from-slate-50 via-white to-indigo-50/30 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
      <div className="flex-1 p-4 lg:p-6 space-y-5 overflow-auto">
        
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl shadow-lg shadow-indigo-200">
              <FlaskConical className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl lg:text-2xl font-bold tracking-tight">Lab Processing</h1>
              <p className="text-sm text-muted-foreground flex items-center gap-2">
                <Building2 className="h-3.5 w-3.5" />
                {currentBranch.name} ({currentBranch.code})
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => setShowSettingsDialog(true)}>
              <Settings className="h-4 w-4 mr-1.5" />
              Settings
            </Button>
            <Button variant="outline" size="sm" onClick={() => setProcessingQueue([...labProcessingQueue])}>
              <RefreshCw className="h-4 w-4 mr-1.5" />
              Refresh
            </Button>
          </div>
        </div>

        {/* Scan Card - Enhanced Design */}
        <Card className="border-2 border-indigo-100 bg-gradient-to-r from-white to-indigo-50/50 shadow-sm">
          <CardContent className="p-5 lg:p-6">
            <div className="flex flex-col lg:flex-row gap-6">
              {/* Scan Input Section */}
              <div className="flex-1 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-indigo-100 rounded-xl">
                    <QrCode className="h-6 w-6 text-indigo-600" />
                  </div>
                  <div>
                    <h2 className="font-semibold text-gray-900">Scan Sample</h2>
                    <p className="text-xs text-gray-500">Scan QR code or enter Order/Sample ID</p>
                  </div>
                </div>

                <div className="flex gap-2">
                  {(["manual", "camera", "scanner"] as ScanMode[]).map((mode) => (
                    <Button
                      key={mode}
                      variant={scanMode === mode ? "default" : "outline"}
                      size="sm"
                      onClick={() => handleScanModeChange(mode)}
                      disabled={mode === "scanner" && !scannerEnabled}
                      className={cn(
                        "flex-1",
                        scanMode === mode && "bg-indigo-600 hover:bg-indigo-700"
                      )}
                    >
                      {mode === "manual" && <Barcode className="h-4 w-4 mr-1.5" />}
                      {mode === "camera" && <Camera className="h-4 w-4 mr-1.5" />}
                      {mode === "scanner" && <ScanLine className="h-4 w-4 mr-1.5" />}
                      {mode.charAt(0).toUpperCase() + mode.slice(1)}
                    </Button>
                  ))}
                </div>

                {scanMode === "manual" && (
                  <form onSubmit={handleScanInput}>
                    <div className="relative">
                      <Barcode className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <Input
                        ref={searchInputRef}
                        placeholder="Enter Order ID or Sample ID..."
                        className="pl-11 pr-24 h-12 text-base bg-white border-gray-200 focus:border-indigo-300 focus:ring-indigo-200"
                        value={searchInput}
                        onChange={(e) => {
                          setSearchInput(e.target.value);
                          setScanError(null);
                          setBranchMismatch(null);
                        }}
                        autoFocus
                      />
                      <Button
                        type="submit"
                        className="absolute right-1.5 top-1.5 h-9 bg-indigo-600 hover:bg-indigo-700 shadow-sm"
                      >
                        <Search className="h-4 w-4 mr-1.5" />
                        Scan
                      </Button>
                    </div>
                  </form>
                )}

                {scanMode === "scanner" && !scannerEnabled && (
                  <Alert>
                    <Shield className="h-4 w-4" />
                    <AlertTitle>Scanner Not Enabled</AlertTitle>
                    <AlertDescription>Enable external scanner in Settings.</AlertDescription>
                  </Alert>
                )}

                {/* Error Messages */}
                <AnimatePresence>
                  {scanError && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                    >
                      <Alert variant="destructive" className="border-red-200 bg-red-50">
                        <AlertCircle className="h-4 w-4" />
                        <AlertTitle>Not Found</AlertTitle>
                        <AlertDescription>{scanError}</AlertDescription>
                      </Alert>
                    </motion.div>
                  )}
                  
                  {branchMismatch && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                    >
                      <Alert className="border-amber-200 bg-amber-50">
                        <AlertTriangle className="h-4 w-4 text-amber-600" />
                        <AlertTitle className="text-amber-800">Branch Mismatch</AlertTitle>
                        <AlertDescription className="text-amber-700">
                          {branchMismatch.message}
                        </AlertDescription>
                      </Alert>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Quick Stats */}
              <div className="lg:w-72 grid grid-cols-2 lg:grid-cols-1 gap-3">
                <div className="p-3 bg-white rounded-xl border border-gray-100">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">Pending Payment</span>
                    <CreditCard className="h-4 w-4 text-amber-500" />
                  </div>
                  <p className="text-2xl font-bold text-amber-600">{stats.pendingPayment}</p>
                </div>
                <div className="p-3 bg-white rounded-xl border border-gray-100">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">In Processing</span>
                    <Zap className="h-4 w-4 text-blue-500" />
                  </div>
                  <p className="text-2xl font-bold text-blue-600">{stats.processing}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats Grid */}
        <div className="grid gap-3 grid-cols-2 lg:grid-cols-5">
          <Card className="border-l-4 border-l-indigo-500 bg-white/80">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground">Total Queue</p>
                  <p className="text-2xl font-bold">{stats.total}</p>
                </div>
                <FlaskConical className="h-8 w-8 text-indigo-200" />
              </div>
            </CardContent>
          </Card>
          <Card className="border-l-4 border-l-amber-500 bg-white/80">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground">Pending Payment</p>
                  <p className="text-2xl font-bold">{stats.pendingPayment}</p>
                </div>
                <CreditCard className="h-8 w-8 text-amber-200" />
              </div>
            </CardContent>
          </Card>
          <Card className="border-l-4 border-l-purple-500 bg-white/80">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground">Sample Collected</p>
                  <p className="text-2xl font-bold">{stats.sampleCollected}</p>
                </div>
                <TestTube className="h-8 w-8 text-purple-200" />
              </div>
            </CardContent>
          </Card>
          <Card className="border-l-4 border-l-blue-500 bg-white/80">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground">Processing</p>
                  <p className="text-2xl font-bold">{stats.processing}</p>
                </div>
                <Zap className="h-8 w-8 text-blue-200" />
              </div>
            </CardContent>
          </Card>
          <Card className="border-l-4 border-l-cyan-500 bg-white/80">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground">Report Ready</p>
                  <p className="text-2xl font-bold">{stats.reportReady}</p>
                </div>
                <FileCheck className="h-8 w-8 text-cyan-200" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Processing Tabs */}
        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as typeof activeTab)} className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <TabsList className="bg-white border shadow-sm">
              <TabsTrigger value="pending-payment" className="gap-2 data-[state=active]:bg-amber-50 data-[state=active]:text-amber-700">
                <CreditCard className="h-4 w-4" />
                <span className="hidden sm:inline">Pending Payment</span>
                <Badge variant="secondary" className="ml-1 h-5">{stats.pendingPayment}</Badge>
              </TabsTrigger>
              <TabsTrigger value="processing" className="gap-2 data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700">
                <Zap className="h-4 w-4" />
                <span className="hidden sm:inline">Processing</span>
                <Badge variant="secondary" className="ml-1 h-5">{stats.processing}</Badge>
              </TabsTrigger>
              <TabsTrigger value="ready" className="gap-2 data-[state=active]:bg-cyan-50 data-[state=active]:text-cyan-700">
                <FileCheck className="h-4 w-4" />
                <span className="hidden sm:inline">Report Ready</span>
                <Badge variant="secondary" className="ml-1 h-5">{stats.reportReady}</Badge>
              </TabsTrigger>
            </TabsList>

            {selectedItems.length > 0 && (
              <div className="flex items-center gap-2">
                <Badge variant="secondary">{selectedItems.length} selected</Badge>
                <Button size="sm" onClick={() => setShowBulkDialog(true)} className="bg-cyan-600 hover:bg-cyan-700">
                  <FileCheck className="h-4 w-4 mr-1.5" />
                  Mark Ready
                </Button>
                <Button size="sm" variant="outline" onClick={() => setSelectedItems([])}>
                  Clear
                </Button>
              </div>
            )}
          </div>

          <Card className="overflow-hidden border-0 shadow-sm">
            <ScrollArea className="h-[calc(100vh-520px)] lg:h-[calc(100vh-480px)]">
              <TabsContent value="pending-payment" className="m-0">
                <div className="divide-y">
                  {filteredQueue.length === 0 ? (
                    <div className="p-12 text-center text-muted-foreground">
                      <CreditCard className="h-12 w-12 mx-auto mb-3 text-gray-200" />
                      <p>No orders pending payment in your branch</p>
                    </div>
                  ) : (
                    filteredQueue.map((item, index) => (
                      <ProcessingQueueItem
                        key={item.id}
                        item={item}
                        index={index}
                        onStartProcessing={handleStartProcessing}
                        onMarkReportReady={handleMarkReportReady}
                        onOpenPayment={handleOpenPaymentDialog}
                        isSelected={selectedItems.includes(item.id)}
                        onToggleSelect={handleToggleSelect}
                        showCheckbox={false}
                      />
                    ))
                  )}
                </div>
              </TabsContent>

              <TabsContent value="processing" className="m-0">
                <div className="divide-y">
                  {filteredQueue.length === 0 ? (
                    <div className="p-12 text-center text-muted-foreground">
                      <Zap className="h-12 w-12 mx-auto mb-3 text-gray-200" />
                      <p>No samples currently being processed</p>
                    </div>
                  ) : (
                    filteredQueue.map((item, index) => (
                      <ProcessingQueueItem
                        key={item.id}
                        item={item}
                        index={index}
                        onStartProcessing={handleStartProcessing}
                        onMarkReportReady={handleMarkReportReady}
                        onOpenPayment={handleOpenPaymentDialog}
                        isSelected={selectedItems.includes(item.id)}
                        onToggleSelect={handleToggleSelect}
                        showCheckbox={true}
                      />
                    ))
                  )}
                </div>
              </TabsContent>

              <TabsContent value="ready" className="m-0">
                <div className="divide-y">
                  {filteredQueue.length === 0 ? (
                    <div className="p-12 text-center text-muted-foreground">
                      <FileCheck className="h-12 w-12 mx-auto mb-3 text-gray-200" />
                      <p>No reports ready for delivery</p>
                    </div>
                  ) : (
                    filteredQueue.map((item, index) => (
                      <ProcessingQueueItem
                        key={item.id}
                        item={item}
                        index={index}
                        onStartProcessing={handleStartProcessing}
                        onMarkReportReady={handleMarkReportReady}
                        onOpenPayment={handleOpenPaymentDialog}
                        isSelected={selectedItems.includes(item.id)}
                        onToggleSelect={handleToggleSelect}
                        showCheckbox={false}
                      />
                    ))
                  )}
                </div>
              </TabsContent>
            </ScrollArea>
          </Card>
        </Tabs>

        {/* ============ DIALOGS ============ */}

        {/* Scan Result Dialog */}
        <Dialog open={showScanResult} onOpenChange={setShowScanResult}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-green-600" />
                Order Found
              </DialogTitle>
              <DialogDescription>Review order details and proceed with the next step</DialogDescription>
            </DialogHeader>

            {scannedItem && (
              <div className="space-y-4">
                {/* Status Flow Visualization */}
                <div className="bg-gradient-to-r from-slate-50 to-indigo-50/50 rounded-xl p-4">
                  <p className="text-xs font-medium text-gray-500 mb-3">ORDER WORKFLOW PROGRESS</p>
                  <OrderStatusFlow
                    status={scannedItem.status as "Pending" | "Sample Collected" | "Processing" | "Report Ready" | "Completed" | "Cancelled"}
                    source={(scannedItem.source || "Walk-in") as "Walk-in" | "Home Collection" | "Online Test Booking" | "Online Package Booking" | "Slot Booking"}
                    variant="compact"
                  />
                  <p className="text-xs text-gray-500 mt-3 text-center">
                    {getStatusMessage(scannedItem.status as "Pending" | "Sample Collected" | "Processing" | "Report Ready" | "Completed" | "Cancelled", (scannedItem.source || "Walk-in") as "Walk-in" | "Home Collection" | "Online Test Booking" | "Online Package Booking" | "Slot Booking")}
                  </p>
                </div>

                <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-4 space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Order Number</span>
                    <span className="font-bold text-indigo-700">{scannedItem.orderNumber}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Sample ID</span>
                    <span className="font-mono font-semibold">{scannedItem.sampleId}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Status</span>
                    <Badge className={statusColors[scannedItem.status]}>{scannedItem.status}</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Branch</span>
                    <span className="text-sm font-medium">{scannedItem.branchName}</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-gray-400" />
                    <span className="font-medium">{scannedItem.patientName}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Phone className="h-4 w-4" />
                    <span>{scannedItem.patientMobile}</span>
                  </div>
                </div>

                <div>
                  <p className="text-sm text-gray-600 mb-2">Tests ({scannedItem.tests.length}):</p>
                  <div className="flex flex-wrap gap-1.5">
                    {scannedItem.tests.map((test) => (
                      <Badge key={test.id} variant="outline" className="text-xs">
                        {test.code} - {test.name}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Next Action Info */}
                {getNextStatus(scannedItem.status, scannedItem.source || "Walk-in") && (
                  <Alert className="border-indigo-200 bg-indigo-50">
                    <Zap className="h-4 w-4 text-indigo-600" />
                    <AlertTitle className="text-indigo-800">Next Step</AlertTitle>
                    <AlertDescription className="text-indigo-700">
                      {scannedItem.status === "Pending" && "Collect payment to automatically start processing."}
                      {scannedItem.status === "Sample Collected" && "Verify patient details and start processing."}
                      {scannedItem.status === "Processing" && "Complete all tests to mark report as ready."}
                      {scannedItem.status === "In Progress" && "Complete all tests to mark report as ready."}
                      {scannedItem.status === "Report Ready" && "Upload report to complete the order."}
                    </AlertDescription>
                  </Alert>
                )}
              </div>
            )}

            <DialogFooter className="gap-2">
              <Button variant="outline" onClick={() => setShowScanResult(false)}>
                Cancel
              </Button>
              {scannedItem?.status === "Pending" && (
                <Button onClick={() => handleOpenPaymentDialog(scannedItem)} className="bg-amber-600 hover:bg-amber-700">
                  <CreditCard className="h-4 w-4 mr-2" />
                  Collect Payment
                </Button>
              )}
              {scannedItem?.status === "Sample Collected" && (
                <Button
                  onClick={() => handleStartProcessing(scannedItem)}
                  disabled={isProcessing}
                  className="bg-indigo-600 hover:bg-indigo-700"
                >
                  {isProcessing ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Play className="h-4 w-4 mr-2" />
                  )}
                  Start Processing
                </Button>
              )}
              {scannedItem?.status === "In Progress" && (
                <Button
                  onClick={() => {
                    if (scannedItem) handleMarkReportReady(scannedItem.id);
                    setShowScanResult(false);
                  }}
                  disabled={isProcessing}
                  className="bg-cyan-600 hover:bg-cyan-700"
                >
                  <FileCheck className="h-4 w-4 mr-2" />
                  Mark Report Ready
                </Button>
              )}
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Payment Dialog */}
        <Dialog open={showPaymentDialog} onOpenChange={setShowPaymentDialog}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5 text-amber-600" />
                Collect Payment
              </DialogTitle>
              <DialogDescription>Complete payment to proceed with processing</DialogDescription>
            </DialogHeader>

            {paymentItem && (
              <div className="space-y-4">
                <div className="bg-amber-50 rounded-xl p-4 border border-amber-100">
                  <div className="flex justify-between items-center mb-3">
                    <span className="font-medium">{paymentItem.orderNumber}</span>
                    <span className="text-sm text-muted-foreground">{paymentItem.patientName}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Total Amount</span>
                    <span className="text-2xl font-bold text-amber-700 flex items-center">
                      <IndianRupee className="h-5 w-5" />1,500
                    </span>
                  </div>
                </div>

                <div className="space-y-3">
                  <Label>Payment Mode</Label>
                  <div className="grid grid-cols-3 gap-2">
                    {(["Cash", "UPI", "Card"] as const).map((mode) => (
                      <Button
                        key={mode}
                        type="button"
                        variant={selectedPaymentMode === mode ? "default" : "outline"}
                        onClick={() => setSelectedPaymentMode(mode as PaymentMode)}
                        className={cn(
                          "h-12",
                          selectedPaymentMode === mode && "bg-amber-600 hover:bg-amber-700"
                        )}
                      >
                        {mode}
                      </Button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Amount Received</Label>
                  <div className="relative">
                    <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      type="number"
                      placeholder="1500"
                      value={paymentAmount}
                      onChange={(e) => setPaymentAmount(e.target.value)}
                      className="pl-9"
                    />
                  </div>
                </div>
              </div>
            )}

            <DialogFooter className="gap-2">
              <Button variant="outline" onClick={() => setShowPaymentDialog(false)}>
                Cancel
              </Button>
              <Button onClick={handleCompletePayment} disabled={isProcessing} className="bg-green-600 hover:bg-green-700">
                {isProcessing ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <CheckCircle2 className="h-4 w-4 mr-2" />
                )}
                Complete Payment & Process
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Camera Dialog */}
        <Dialog open={showCameraDialog} onOpenChange={(open) => !open && stopCamera()}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Camera className="h-5 w-5 text-indigo-600" />
                Camera Scanner
              </DialogTitle>
              <DialogDescription>
                Point camera at the QR code on the sample
              </DialogDescription>
            </DialogHeader>

            <div className="py-4">
              {cameraPermission.status === "denied" ? (
                <Alert variant="destructive">
                  <Shield className="h-4 w-4" />
                  <AlertTitle>Permission Denied</AlertTitle>
                  <AlertDescription>
                    {cameraPermission.error}
                  </AlertDescription>
                </Alert>
              ) : (
                <div className="relative aspect-video bg-black rounded-xl overflow-hidden">
                  <video
                    ref={videoRef}
                    className="w-full h-full object-cover"
                    playsInline
                    muted
                  />
                  {isCameraActive && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-48 h-48 border-2 border-white/50 rounded-lg relative">
                        <div className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-indigo-400" />
                        <div className="absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 border-indigo-400" />
                        <div className="absolute bottom-0 left-0 w-6 h-6 border-b-2 border-l-2 border-indigo-400" />
                        <div className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-indigo-400" />
                        <motion.div
                          className="absolute left-0 right-0 h-0.5 bg-indigo-400"
                          animate={{ top: ["10%", "90%", "10%"] }}
                          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                        />
                      </div>
                    </div>
                  )}
                  {!isCameraActive && cameraPermission.status === "checking" && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-white text-sm">Requesting camera access...</div>
                    </div>
                  )}
                </div>
              )}
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={stopCamera}>
                <X className="h-4 w-4 mr-2" />
                Close Camera
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Bulk Action Dialog */}
        <Dialog open={showBulkDialog} onOpenChange={setShowBulkDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Mark Reports Ready</DialogTitle>
              <DialogDescription>
                Mark {selectedItems.length} samples as Report Ready?
              </DialogDescription>
            </DialogHeader>
            <div className="py-4">
              <ScrollArea className="max-h-40">
                <div className="space-y-2">
                  {selectedItems.map((id) => {
                    const item = processingQueue.find((p) => p.id === id);
                    return item ? (
                      <div key={id} className="flex justify-between text-sm p-2 bg-muted rounded">
                        <span className="font-medium">{item.orderNumber}</span>
                        <span className="text-muted-foreground">{item.patientName}</span>
                      </div>
                    ) : null;
                  })}
                </div>
              </ScrollArea>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowBulkDialog(false)}>Cancel</Button>
              <Button onClick={handleBulkReportReady} disabled={isProcessing} className="bg-cyan-600 hover:bg-cyan-700">
                {isProcessing ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <CheckCircle2 className="h-4 w-4 mr-2" />
                )}
                Confirm ({selectedItems.length})
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Settings Dialog */}
        <Dialog open={showSettingsDialog} onOpenChange={setShowSettingsDialog}>
          <DialogContent className="max-w-sm">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Scanner Settings
              </DialogTitle>
            </DialogHeader>

            <div className="py-4 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-sm font-medium">Camera Access</Label>
                  <p className="text-xs text-muted-foreground">Allow camera for QR scanning</p>
                </div>
                {cameraPermission.status === "granted" ? (
                  <Badge className="bg-green-100 text-green-700">Granted</Badge>
                ) : cameraPermission.status === "denied" ? (
                  <Badge className="bg-red-100 text-red-700">Denied</Badge>
                ) : (
                  <Button size="sm" variant="outline" onClick={requestCameraAccess}>Request</Button>
                )}
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-sm font-medium">External Scanner</Label>
                  <p className="text-xs text-muted-foreground">Enable USB/Bluetooth scanner</p>
                </div>
                <Switch checked={scannerEnabled} onCheckedChange={setScannerEnabled} />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-sm font-medium">Auto-Start Processing</Label>
                  <p className="text-xs text-muted-foreground">Auto proceed on valid scan</p>
                </div>
                <Switch checked={autoStartProcessing} onCheckedChange={setAutoStartProcessing} />
              </div>
            </div>

            <DialogFooter>
              <Button onClick={() => setShowSettingsDialog(false)}>Done</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Slot Booking Detection Dialog */}
        <Dialog open={showSlotBookingDialog} onOpenChange={setShowSlotBookingDialog}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-violet-500" />
                Slot Booking Detected
              </DialogTitle>
              <DialogDescription>
                This scan corresponds to a slot booking that needs details completion
              </DialogDescription>
            </DialogHeader>

            {detectedSlotBooking && (
              <div className="py-4 space-y-4">
                <div className="bg-violet-50 dark:bg-violet-900/20 rounded-lg p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 bg-violet-100 dark:bg-violet-900/40 rounded-lg">
                      <QrCode className="h-5 w-5 text-violet-600" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Token Number</p>
                      <p className="font-mono font-bold text-lg text-violet-700">
                        {detectedSlotBooking.tokenNumber || "N/A"}
                      </p>
                    </div>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Patient Name</span>
                      <span className="font-medium">{detectedSlotBooking.patientName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Mobile</span>
                      <span>{detectedSlotBooking.patientMobile}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Slot</span>
                      <span>{detectedSlotBooking.slotDate} at {detectedSlotBooking.slotTime}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Status</span>
                      <Badge className={cn(
                        "text-xs",
                        detectedSlotBooking.status === "Booked" && "bg-blue-100 text-blue-700",
                        detectedSlotBooking.status === "Confirmed" && "bg-purple-100 text-purple-700"
                      )}>
                        {detectedSlotBooking.status}
                      </Badge>
                    </div>
                  </div>
                </div>

                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Action Required</AlertTitle>
                  <AlertDescription>
                    This patient has a slot booking. Please complete their details and registration to proceed with sample collection.
                  </AlertDescription>
                </Alert>
              </div>
            )}

            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => {
                  setShowSlotBookingDialog(false);
                  setDetectedSlotBooking(null);
                }}
              >
                Cancel
              </Button>
              <Button
                onClick={handleSlotBookingRedirect}
                className="bg-violet-600 hover:bg-violet-700"
              >
                Go to Slot Booking
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}

// ============ QUEUE ITEM COMPONENT ============
interface ProcessingQueueItemProps {
  item: LabProcessingItem;
  index: number;
  onStartProcessing: (item: LabProcessingItem) => void;
  onMarkReportReady: (itemId: string) => void;
  onOpenPayment: (item: LabProcessingItem) => void;
  isSelected: boolean;
  onToggleSelect: (itemId: string) => void;
  showCheckbox: boolean;
}

function ProcessingQueueItem({
  item,
  index,
  onStartProcessing,
  onMarkReportReady,
  onOpenPayment,
  isSelected,
  onToggleSelect,
  showCheckbox,
}: ProcessingQueueItemProps) {
  const isPendingPayment = item.status === "Pending";
  const isProcessing = item.status === "In Progress" || item.tests?.some(t => t.status === "In Progress");
  const isReportReady = item.status === "Report Ready";
  const isSampleCollected = item.status === "Sample Collected";

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.03 }}
      className={cn(
        "p-4 hover:bg-slate-50/80 transition-all",
        isSelected && "bg-indigo-50/50"
      )}
    >
      <div className="flex items-start gap-4">
        {showCheckbox && isProcessing && (
          <Checkbox
            checked={isSelected}
            onCheckedChange={() => onToggleSelect(item.id)}
            className="mt-1"
          />
        )}

        <div className="flex-1 min-w-0">
          {/* Header Row */}
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <span className="font-bold text-indigo-700">{item.orderNumber}</span>
            <Badge className={cn("text-xs", statusColors[item.status])}>{item.status}</Badge>
            <Badge className={cn("text-xs", priorityColors[item.priority])}>{item.priority}</Badge>
            {isPendingPayment && (
              <Badge className="text-xs bg-red-100 text-red-700 border-red-200">
                <CreditCard className="h-3 w-3 mr-1" />
                Payment Due
              </Badge>
            )}
          </div>

          {/* Patient Info */}
          <div className="flex flex-wrap items-center gap-4 text-sm mb-2">
            <div className="flex items-center gap-1.5">
              <User className="h-4 w-4 text-gray-400" />
              <span className="font-medium">{item.patientName}</span>
            </div>
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <Phone className="h-4 w-4" />
              <span>{item.patientMobile}</span>
            </div>
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <Building2 className="h-4 w-4" />
              <span>{item.branchName}</span>
            </div>
          </div>

          {/* Sample & Tests */}
          <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground mb-2">
            <span className="font-mono bg-gray-100 px-1.5 py-0.5 rounded">{item.sampleId}</span>
            <span>•</span>
            <span>{item.tests.length} tests</span>
          </div>

          {/* Test Badges */}
          <div className="flex flex-wrap gap-1.5">
            {item.tests.slice(0, 4).map((test) => (
              <Badge
                key={test.id}
                variant="outline"
                className={cn(
                  "text-xs",
                  test.status === "Completed" && "bg-green-50 border-green-200 text-green-700",
                  test.status === "In Progress" && "bg-blue-50 border-blue-200 text-blue-700"
                )}
              >
                {test.code}
                {test.status === "Completed" && <CheckCircle2 className="h-3 w-3 ml-1" />}
              </Badge>
            ))}
            {item.tests.length > 4 && (
              <Badge variant="outline" className="text-xs">+{item.tests.length - 4} more</Badge>
            )}
          </div>

          {/* Timestamps */}
          <div className="flex flex-wrap gap-3 text-xs text-muted-foreground mt-2">
            <span>Received: {new Date(item.receivedAt).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}</span>
            {item.startedAt && <span>Started: {new Date(item.startedAt).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}</span>}
            {item.technicianName && <span>By: {item.technicianName}</span>}
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-2 shrink-0">
          {isPendingPayment && (
            <Button size="sm" onClick={() => onOpenPayment(item)} className="bg-amber-600 hover:bg-amber-700">
              <CreditCard className="h-4 w-4 mr-1.5" />
              Payment
            </Button>
          )}
          {isSampleCollected && (
            <Button size="sm" onClick={() => onStartProcessing(item)} className="bg-indigo-600 hover:bg-indigo-700">
              <Play className="h-4 w-4 mr-1.5" />
              Start
            </Button>
          )}
          {isProcessing && (
            <Button size="sm" onClick={() => onMarkReportReady(item.id)} className="bg-cyan-600 hover:bg-cyan-700">
              <FileCheck className="h-4 w-4 mr-1.5" />
              Ready
            </Button>
          )}
          {isReportReady && (
            <div className="flex flex-col gap-1.5">
              <Badge className="bg-green-100 text-green-700 justify-center">
                <CheckCircle2 className="h-3.5 w-3.5 mr-1" />
                Ready
              </Badge>
              <Button size="sm" variant="outline" className="text-xs">
                <Printer className="h-3.5 w-3.5 mr-1" />
                Print
              </Button>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
