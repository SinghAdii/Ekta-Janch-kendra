"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Phone,
  XCircle,
  RefreshCw,
  Package,
  CheckCircle,
  Calendar,
  ChevronRight,
  ArrowLeft,
  Loader2,
  AlertCircle,
  AlertTriangle,
  TestTube,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Types
interface OrderItem {
  id: string;
  name: string;
  type: "test" | "package";
}

interface Order {
  id: string;
  bookingId: string;
  date: string;
  status: "pending" | "sample-collected" | "processing" | "completed" | "cancelled";
  type: "home-collection" | "lab-visit" | "slot-booking";
  items: OrderItem[];
  patientName: string;
  totalAmount: number;
  paymentStatus: "paid" | "pending" | "pay-at-lab";
  canCancel: boolean;
  cancellationDeadline?: string;
}

// Cancellation reasons
const cancellationReasons = [
  { value: "change-date", label: "Want to change date/time" },
  { value: "not-needed", label: "Test no longer needed" },
  { value: "found-cheaper", label: "Found cheaper option elsewhere" },
  { value: "wrong-test", label: "Booked wrong test by mistake" },
  { value: "doctor-changed", label: "Doctor changed recommendation" },
  { value: "health-issue", label: "Health issue preventing sample collection" },
  { value: "other", label: "Other reason" },
];

// Mock data for demo
const mockOrders: Order[] = [
  {
    id: "1",
    bookingId: "EJK-2026020501",
    date: "2026-02-05",
    status: "pending",
    type: "home-collection",
    patientName: "John Doe",
    items: [
      { id: "1", name: "Complete Blood Count", type: "test" },
      { id: "2", name: "Thyroid Profile", type: "test" },
    ],
    totalAmount: 1250,
    paymentStatus: "paid",
    canCancel: true,
    cancellationDeadline: "2026-02-05 10:00 AM",
  },
  {
    id: "2",
    bookingId: "EJK-2026020502",
    date: "2026-02-06",
    status: "pending",
    type: "slot-booking",
    patientName: "John Doe",
    items: [{ id: "3", name: "Vitamin D Test", type: "test" }],
    totalAmount: 650,
    paymentStatus: "paid",
    canCancel: true,
    cancellationDeadline: "2026-02-06 08:00 AM",
  },
  {
    id: "3",
    bookingId: "EJK-2026020403",
    date: "2026-02-04",
    status: "processing",
    type: "home-collection",
    patientName: "John Doe",
    items: [{ id: "4", name: "Full Body Checkup", type: "package" }],
    totalAmount: 2999,
    paymentStatus: "paid",
    canCancel: false,
  },
  {
    id: "4",
    bookingId: "EJK-2026020301",
    date: "2026-02-03",
    status: "completed",
    type: "lab-visit",
    patientName: "John Doe",
    items: [{ id: "5", name: "Liver Function Test", type: "test" }],
    totalAmount: 850,
    paymentStatus: "paid",
    canCancel: false,
  },
];

type Step = "mobile" | "otp" | "orders" | "confirm";

export function CancelOrderPage() {
  const [currentStep, setCurrentStep] = useState<Step>("mobile");
  const [mobile, setMobile] = useState("");
  const [otp, setOtp] = useState<string[]>(["", "", "", "", "", ""]);
  const [resendTimer, setResendTimer] = useState(30);
  const [canResend, setCanResend] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [cancellationReason, setCancellationReason] = useState("");
  const [otherReason, setOtherReason] = useState("");
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [cancellationSuccess, setCancellationSuccess] = useState(false);

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Resend timer countdown
  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;

    if (currentStep === "otp" && resendTimer > 0 && !canResend) {
      timer = setInterval(() => {
        setResendTimer((prev) => {
          const newValue = prev - 1;
          if (newValue <= 0) {
            setCanResend(true);
            return 0;
          }
          return newValue;
        });
      }, 1000);
    }

    return () => {
      if (timer) clearInterval(timer);
    };
  }, [currentStep, resendTimer, canResend]);

  // Focus first OTP input when entering OTP step
  useEffect(() => {
    if (currentStep === "otp") {
      inputRefs.current[0]?.focus();
    }
  }, [currentStep]);

  // Handle mobile submit
  const handleMobileSubmit = async () => {
    if (mobile.length !== 10) {
      setError("Please enter a valid 10-digit mobile number");
      return;
    }

    setIsLoading(true);
    setError(null);

    // TODO: Backend integration - Send OTP to mobile
    await new Promise((resolve) => setTimeout(resolve, 1000));

    setIsLoading(false);
    setCurrentStep("otp");
    setResendTimer(30);
    setCanResend(false);
  };

  // Handle OTP input change
  const handleOtpChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);
    setError(null);

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  // Handle key down for backspace navigation
  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  // Handle paste
  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);

    if (pastedData) {
      const newOtp = pastedData.split("").concat(Array(6 - pastedData.length).fill(""));
      setOtp(newOtp);

      const nextEmptyIndex = newOtp.findIndex((val) => !val);
      if (nextEmptyIndex !== -1) {
        inputRefs.current[nextEmptyIndex]?.focus();
      } else {
        inputRefs.current[5]?.focus();
      }
    }
  };

  // Handle resend OTP
  const handleResend = async () => {
    setCanResend(false);
    setResendTimer(30);
    setOtp(["", "", "", "", "", ""]);
    setError(null);
    inputRefs.current[0]?.focus();

    // TODO: Backend integration - Resend OTP
  };

  // Handle verify OTP
  const handleVerifyOtp = async () => {
    const otpValue = otp.join("");

    if (otpValue.length !== 6) {
      setError("Please enter complete 6-digit OTP");
      return;
    }

    setIsLoading(true);
    setError(null);

    // TODO: Backend integration - Verify OTP and fetch orders
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Mock: Set orders from mock data (only show cancellable ones prominently)
    setOrders(mockOrders);
    setIsLoading(false);
    setCurrentStep("orders");
  };

  // Handle order selection
  const handleSelectOrder = (order: Order) => {
    if (!order.canCancel) return;
    setSelectedOrder(order);
    setCurrentStep("confirm");
    setCancellationReason("");
    setOtherReason("");
  };

  // Handle back navigation
  const handleBack = () => {
    if (currentStep === "otp") {
      setCurrentStep("mobile");
      setOtp(["", "", "", "", "", ""]);
    } else if (currentStep === "orders") {
      setCurrentStep("mobile");
      setMobile("");
      setOtp(["", "", "", "", "", ""]);
    } else if (currentStep === "confirm") {
      setCurrentStep("orders");
      setSelectedOrder(null);
      setCancellationReason("");
      setOtherReason("");
    }
  };

  // Handle cancellation
  const handleCancelOrder = async () => {
    if (!cancellationReason) {
      setError("Please select a reason for cancellation");
      return;
    }

    if (cancellationReason === "other" && !otherReason.trim()) {
      setError("Please provide a reason for cancellation");
      return;
    }

    setShowConfirmDialog(true);
  };

  // Confirm cancellation
  const confirmCancellation = async () => {
    setIsLoading(true);
    setShowConfirmDialog(false);

    // TODO: Backend integration - Cancel order
    await new Promise((resolve) => setTimeout(resolve, 1500));

    setIsLoading(false);
    setCancellationSuccess(true);

    // Remove cancelled order from list
    if (selectedOrder) {
      setOrders((prev) => prev.filter((o) => o.id !== selectedOrder.id));
    }
  };

  // Get status color
  const getStatusColor = (status: Order["status"]) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "sample-collected":
        return "bg-blue-100 text-blue-800";
      case "processing":
        return "bg-purple-100 text-purple-800";
      case "completed":
        return "bg-green-100 text-green-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Get status label
  const getStatusLabel = (status: Order["status"]) => {
    switch (status) {
      case "pending":
        return "Pending";
      case "sample-collected":
        return "Sample Collected";
      case "processing":
        return "Processing";
      case "completed":
        return "Completed";
      case "cancelled":
        return "Cancelled";
      default:
        return status;
    }
  };

  // Masked mobile number
  const maskedMobile = mobile
    ? `+91 ${mobile.slice(0, 2)}****${mobile.slice(-2)}`
    : "+91 ******";

  // Reset after success
  const handleDone = () => {
    setCancellationSuccess(false);
    setSelectedOrder(null);
    setCurrentStep("orders");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-orange-50 py-28 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <XCircle className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Cancel Order</h1>
          <p className="text-gray-600">
            Enter your mobile number to cancel your test bookings
          </p>
        </motion.div>

        {/* Main Card */}
        <Card className="shadow-xl border-0">
          <CardContent className="p-6 sm:p-8">
            <AnimatePresence mode="wait">
              {/* Cancellation Success */}
              {cancellationSuccess ? (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="text-center py-8"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", delay: 0.2 }}
                    className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6"
                  >
                    <CheckCircle className="w-12 h-12 text-green-600" />
                  </motion.div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    Order Cancelled Successfully
                  </h2>
                  <p className="text-gray-600 mb-4">
                    Your order <span className="font-semibold">{selectedOrder?.bookingId}</span> has been cancelled.
                  </p>
                  {selectedOrder?.paymentStatus === "paid" && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                      <p className="text-blue-800 text-sm">
                        <strong>Refund Information:</strong> Your refund of ₹{selectedOrder.totalAmount.toLocaleString()} will be processed within 5-7 business days.
                      </p>
                    </div>
                  )}
                  <Button onClick={handleDone} className="mt-4">
                    Done
                  </Button>
                </motion.div>
              ) : (
                <>
                  {/* Step 1: Mobile Number */}
                  {currentStep === "mobile" && (
                    <motion.div
                      key="mobile"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="space-y-6"
                    >
                      <div className="text-center mb-6">
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4"
                        >
                          <Phone className="w-10 h-10 text-red-600" />
                        </motion.div>
                        <h2 className="text-xl font-bold text-gray-900 mb-2">
                          Enter Your Mobile Number
                        </h2>
                        <p className="text-gray-600 text-sm">
                          We&apos;ll send you an OTP to verify your identity
                        </p>
                      </div>

                      <div className="space-y-4">
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 font-medium">
                            +91
                          </span>
                          <Input
                            type="tel"
                            placeholder="Enter 10-digit mobile number"
                            value={mobile}
                            onChange={(e) => {
                              const value = e.target.value.replace(/\D/g, "").slice(0, 10);
                              setMobile(value);
                              setError(null);
                            }}
                            className="pl-12 h-12 text-lg"
                            maxLength={10}
                          />
                        </div>

                        {error && (
                          <motion.p
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-red-500 text-sm flex items-center gap-1"
                          >
                            <AlertCircle className="w-4 h-4" />
                            {error}
                          </motion.p>
                        )}

                        <Button
                          onClick={handleMobileSubmit}
                          disabled={mobile.length !== 10 || isLoading}
                          className="w-full h-12 text-lg bg-red-600 hover:bg-red-700"
                        >
                          {isLoading ? (
                            <>
                              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                              Sending OTP...
                            </>
                          ) : (
                            <>
                              Get OTP
                              <ChevronRight className="w-5 h-5 ml-2" />
                            </>
                          )}
                        </Button>
                      </div>
                    </motion.div>
                  )}

                  {/* Step 2: OTP Verification */}
                  {currentStep === "otp" && (
                    <motion.div
                      key="otp"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="space-y-6"
                    >
                      <Button
                        variant="ghost"
                        onClick={handleBack}
                        className="mb-4 -ml-2"
                      >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back
                      </Button>

                      <div className="text-center mb-6">
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4"
                        >
                          <Phone className="w-10 h-10 text-green-600" />
                        </motion.div>
                        <h2 className="text-xl font-bold text-gray-900 mb-2">
                          Verify Your Mobile Number
                        </h2>
                        <p className="text-gray-600 text-sm">
                          We&apos;ve sent a 6-digit OTP to{" "}
                          <span className="font-semibold text-gray-900">{maskedMobile}</span>
                        </p>
                      </div>

                      {/* OTP Input Boxes */}
                      <div className="flex justify-center gap-2 sm:gap-3" onPaste={handlePaste}>
                        {otp.map((digit, index) => (
                          <Input
                            key={index}
                            ref={(el) => {
                              inputRefs.current[index] = el;
                            }}
                            type="text"
                            inputMode="numeric"
                            maxLength={1}
                            value={digit}
                            onChange={(e) => handleOtpChange(index, e.target.value)}
                            onKeyDown={(e) => handleKeyDown(index, e)}
                            className={cn(
                              "w-10 h-12 sm:w-12 sm:h-14 text-center text-xl font-bold",
                              "border-2 focus:border-red-500 focus:ring-red-500",
                              digit && "border-red-500 bg-red-50"
                            )}
                          />
                        ))}
                      </div>

                      {error && (
                        <motion.p
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="text-red-500 text-sm text-center flex items-center justify-center gap-1"
                        >
                          <AlertCircle className="w-4 h-4" />
                          {error}
                        </motion.p>
                      )}

                      {/* Resend OTP */}
                      <div className="text-center">
                        {canResend ? (
                          <Button
                            variant="ghost"
                            onClick={handleResend}
                            className="text-red-600 hover:text-red-700"
                          >
                            <RefreshCw className="w-4 h-4 mr-2" />
                            Resend OTP
                          </Button>
                        ) : (
                          <p className="text-gray-500 text-sm">
                            Resend OTP in{" "}
                            <span className="font-semibold text-gray-700">
                              {resendTimer}s
                            </span>
                          </p>
                        )}
                      </div>

                      <Button
                        onClick={handleVerifyOtp}
                        disabled={otp.join("").length !== 6 || isLoading}
                        className="w-full h-12 text-lg bg-red-600 hover:bg-red-700"
                      >
                        {isLoading ? (
                          <>
                            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                            Verifying...
                          </>
                        ) : (
                          <>
                            <CheckCircle className="w-5 h-5 mr-2" />
                            Verify & Continue
                          </>
                        )}
                      </Button>
                    </motion.div>
                  )}

                  {/* Step 3: Orders List */}
                  {currentStep === "orders" && (
                    <motion.div
                      key="orders"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="space-y-6"
                    >
                      <Button
                        variant="ghost"
                        onClick={handleBack}
                        className="mb-4 -ml-2"
                      >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back
                      </Button>

                      <div className="text-center mb-6">
                        <h2 className="text-xl font-bold text-gray-900 mb-2">
                          Select Order to Cancel
                        </h2>
                        <p className="text-gray-600 text-sm">
                          Only pending orders can be cancelled
                        </p>
                      </div>

                      {orders.length === 0 ? (
                        <div className="text-center py-12">
                          <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                          <p className="text-gray-500">No orders found</p>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          {orders.map((order) => (
                            <motion.div
                              key={order.id}
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              whileHover={order.canCancel ? { scale: 1.01 } : {}}
                              onClick={() => handleSelectOrder(order)}
                              className={cn(
                                "p-4 border rounded-lg transition-all",
                                order.canCancel
                                  ? "cursor-pointer hover:border-red-300 hover:bg-red-50/50"
                                  : "opacity-60 cursor-not-allowed bg-gray-50"
                              )}
                            >
                              <div className="flex items-start justify-between mb-3">
                                <div>
                                  <p className="font-semibold text-gray-900">
                                    {order.bookingId}
                                  </p>
                                  <p className="text-sm text-gray-500">
                                    {order.patientName}
                                  </p>
                                </div>
                                <div className="flex flex-col items-end gap-1">
                                  <Badge className={getStatusColor(order.status)}>
                                    {getStatusLabel(order.status)}
                                  </Badge>
                                  {!order.canCancel && (
                                    <span className="text-xs text-gray-400">
                                      Cannot cancel
                                    </span>
                                  )}
                                </div>
                              </div>

                              <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
                                <span className="flex items-center gap-1">
                                  <Calendar className="w-4 h-4" />
                                  {new Date(order.date).toLocaleDateString("en-IN", {
                                    day: "numeric",
                                    month: "short",
                                    year: "numeric",
                                  })}
                                </span>
                                <span className="flex items-center gap-1">
                                  <TestTube className="w-4 h-4" />
                                  {order.items.length} test(s)
                                </span>
                                <span className="font-medium text-gray-900">
                                  ₹{order.totalAmount.toLocaleString()}
                                </span>
                              </div>

                              <div className="flex items-center justify-between text-sm">
                                <span className="text-gray-500 truncate max-w-[200px]">
                                  {order.items.map((i) => i.name).join(", ")}
                                </span>
                                {order.canCancel && (
                                  <ChevronRight className="w-5 h-5 text-red-400" />
                                )}
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      )}
                    </motion.div>
                  )}

                  {/* Step 4: Confirm Cancellation */}
                  {currentStep === "confirm" && selectedOrder && (
                    <motion.div
                      key="confirm"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="space-y-6"
                    >
                      <Button
                        variant="ghost"
                        onClick={handleBack}
                        className="mb-4 -ml-2"
                      >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back to Orders
                      </Button>

                      {/* Order Summary */}
                      <div className="bg-gray-50 rounded-xl p-4 border">
                        <h3 className="font-semibold text-gray-900 mb-3">
                          Order to Cancel
                        </h3>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-500">Order ID</span>
                            <span className="font-medium">{selectedOrder.bookingId}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-500">Patient</span>
                            <span className="font-medium">{selectedOrder.patientName}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-500">Date</span>
                            <span className="font-medium">
                              {new Date(selectedOrder.date).toLocaleDateString("en-IN", {
                                day: "numeric",
                                month: "short",
                                year: "numeric",
                              })}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-500">Tests</span>
                            <span className="font-medium">
                              {selectedOrder.items.map((i) => i.name).join(", ")}
                            </span>
                          </div>
                          <div className="flex justify-between pt-2 border-t">
                            <span className="text-gray-500">Total Amount</span>
                            <span className="font-bold text-gray-900">
                              ₹{selectedOrder.totalAmount.toLocaleString()}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Warning */}
                      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex gap-3">
                        <AlertTriangle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                        <div className="text-sm">
                          <p className="font-medium text-yellow-800 mb-1">
                            Cancellation Policy
                          </p>
                          <p className="text-yellow-700">
                            {selectedOrder.paymentStatus === "paid"
                              ? "Refund will be processed within 5-7 business days to your original payment method."
                              : "No refund applicable as payment was not made."}
                          </p>
                        </div>
                      </div>

                      {/* Cancellation Reason */}
                      <div className="space-y-3">
                        <label className="text-sm font-medium text-gray-700">
                          Reason for Cancellation <span className="text-red-500">*</span>
                        </label>
                        <Select
                          value={cancellationReason}
                          onValueChange={(value) => {
                            setCancellationReason(value);
                            setError(null);
                          }}
                        >
                          <SelectTrigger className="h-12">
                            <SelectValue placeholder="Select a reason" />
                          </SelectTrigger>
                          <SelectContent>
                            {cancellationReasons.map((reason) => (
                              <SelectItem key={reason.value} value={reason.value}>
                                {reason.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>

                        {cancellationReason === "other" && (
                          <Textarea
                            placeholder="Please describe your reason..."
                            value={otherReason}
                            onChange={(e) => {
                              setOtherReason(e.target.value);
                              setError(null);
                            }}
                            className="min-h-[100px]"
                          />
                        )}
                      </div>

                      {error && (
                        <motion.p
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="text-red-500 text-sm flex items-center gap-1"
                        >
                          <AlertCircle className="w-4 h-4" />
                          {error}
                        </motion.p>
                      )}

                      <Button
                        onClick={handleCancelOrder}
                        disabled={!cancellationReason || isLoading}
                        className="w-full h-12 text-lg bg-red-600 hover:bg-red-700"
                      >
                        {isLoading ? (
                          <>
                            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                            Cancelling Order...
                          </>
                        ) : (
                          <>
                            <XCircle className="w-5 h-5 mr-2" />
                            Cancel This Order
                          </>
                        )}
                      </Button>
                    </motion.div>
                  )}
                </>
              )}
            </AnimatePresence>
          </CardContent>
        </Card>

        {/* Confirmation Dialog */}
        <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-red-600">
                <AlertTriangle className="w-5 h-5" />
                Confirm Cancellation
              </DialogTitle>
              <DialogDescription>
                Are you sure you want to cancel order{" "}
                <strong>{selectedOrder?.bookingId}</strong>? This action cannot be
                undone.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="gap-2 sm:gap-0">
              <Button
                variant="outline"
                onClick={() => setShowConfirmDialog(false)}
              >
                No, Keep Order
              </Button>
              <Button
                variant="destructive"
                onClick={confirmCancellation}
              >
                Yes, Cancel Order
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
