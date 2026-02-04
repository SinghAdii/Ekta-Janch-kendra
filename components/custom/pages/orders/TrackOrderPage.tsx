"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Phone,
  Search,
  RefreshCw,
  Package,
  CheckCircle,
  Clock,
  TestTube,
  FileText,
  Calendar,
  ChevronRight,
  ArrowLeft,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

// Types
interface OrderItem {
  id: string;
  name: string;
  type: "test" | "package";
}

interface TrackingEvent {
  id: string;
  status: string;
  description: string;
  timestamp: string;
  completed: boolean;
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
  trackingEvents: TrackingEvent[];
  estimatedCompletion?: string;
}

// Mock data for demo
const mockOrders: Order[] = [
  {
    id: "1",
    bookingId: "EJK-2026020501",
    date: "2026-02-05",
    status: "processing",
    type: "home-collection",
    patientName: "John Doe",
    items: [
      { id: "1", name: "Complete Blood Count", type: "test" },
      { id: "2", name: "Thyroid Profile", type: "test" },
    ],
    totalAmount: 1250,
    paymentStatus: "paid",
    estimatedCompletion: "2026-02-06 06:00 PM",
    trackingEvents: [
      {
        id: "1",
        status: "Order Placed",
        description: "Your order has been placed successfully",
        timestamp: "2026-02-05 10:00 AM",
        completed: true,
      },
      {
        id: "2",
        status: "Sample Collection Scheduled",
        description: "Our phlebotomist will visit on Feb 5, 2026 at 11:00 AM",
        timestamp: "2026-02-05 10:05 AM",
        completed: true,
      },
      {
        id: "3",
        status: "Sample Collected",
        description: "Sample collected by phlebotomist Ramesh K.",
        timestamp: "2026-02-05 11:15 AM",
        completed: true,
      },
      {
        id: "4",
        status: "Sample Received at Lab",
        description: "Sample received and registered at our laboratory",
        timestamp: "2026-02-05 01:30 PM",
        completed: true,
      },
      {
        id: "5",
        status: "Processing",
        description: "Your samples are being processed",
        timestamp: "2026-02-05 02:00 PM",
        completed: false,
      },
      {
        id: "6",
        status: "Report Ready",
        description: "Report will be available for download",
        timestamp: "",
        completed: false,
      },
    ],
  },
  {
    id: "2",
    bookingId: "EJK-2026020402",
    date: "2026-02-04",
    status: "completed",
    type: "lab-visit",
    patientName: "John Doe",
    items: [
      { id: "3", name: "Full Body Checkup", type: "package" },
    ],
    totalAmount: 2999,
    paymentStatus: "paid",
    trackingEvents: [
      {
        id: "1",
        status: "Order Placed",
        description: "Your order has been placed successfully",
        timestamp: "2026-02-04 09:00 AM",
        completed: true,
      },
      {
        id: "2",
        status: "Sample Collected",
        description: "Sample collected at lab",
        timestamp: "2026-02-04 10:30 AM",
        completed: true,
      },
      {
        id: "3",
        status: "Processing",
        description: "Your samples are being processed",
        timestamp: "2026-02-04 11:00 AM",
        completed: true,
      },
      {
        id: "4",
        status: "Report Ready",
        description: "Report is ready for download",
        timestamp: "2026-02-04 06:00 PM",
        completed: true,
      },
    ],
  },
];

type Step = "mobile" | "otp" | "orders" | "tracking";

export function TrackOrderPage() {
  const [currentStep, setCurrentStep] = useState<Step>("mobile");
  const [mobile, setMobile] = useState("");
  const [otp, setOtp] = useState<string[]>(["", "", "", "", "", ""]);
  const [resendTimer, setResendTimer] = useState(30);
  const [canResend, setCanResend] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

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

    // Mock: Set orders from mock data
    setOrders(mockOrders);
    setIsLoading(false);
    setCurrentStep("orders");
  };

  // Handle order selection
  const handleSelectOrder = (order: Order) => {
    setSelectedOrder(order);
    setCurrentStep("tracking");
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
    } else if (currentStep === "tracking") {
      setCurrentStep("orders");
      setSelectedOrder(null);
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-28 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <Search className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Track Your Order</h1>
          <p className="text-gray-600">
            Enter your mobile number to track your test bookings
          </p>
        </motion.div>

        {/* Main Card */}
        <Card className="shadow-xl border-0">
          <CardContent className="p-6 sm:p-8">
            <AnimatePresence mode="wait">
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
                      className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4"
                    >
                      <Phone className="w-10 h-10 text-blue-600" />
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
                      className="w-full h-12 text-lg"
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
                          "border-2 focus:border-blue-500 focus:ring-blue-500",
                          digit && "border-blue-500 bg-blue-50"
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
                        className="text-blue-600 hover:text-blue-700"
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
                    className="w-full h-12 text-lg"
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
                      Your Orders
                    </h2>
                    <p className="text-gray-600 text-sm">
                      Select an order to view tracking details
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
                          whileHover={{ scale: 1.01 }}
                          onClick={() => handleSelectOrder(order)}
                          className="p-4 border rounded-lg cursor-pointer hover:border-blue-300 hover:bg-blue-50/50 transition-all"
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
                            <Badge className={getStatusColor(order.status)}>
                              {getStatusLabel(order.status)}
                            </Badge>
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
                          </div>

                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-500">
                              {order.items.map((i) => i.name).join(", ")}
                            </span>
                            <ChevronRight className="w-5 h-5 text-gray-400" />
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </motion.div>
              )}

              {/* Step 4: Tracking Details */}
              {currentStep === "tracking" && selectedOrder && (
                <motion.div
                  key="tracking"
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

                  {/* Order Header */}
                  <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <p className="text-blue-100 text-sm mb-1">Order ID</p>
                        <p className="text-xl font-bold">{selectedOrder.bookingId}</p>
                      </div>
                      <Badge className="bg-white/20 text-white border-0">
                        {getStatusLabel(selectedOrder.status)}
                      </Badge>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-blue-100 mb-1">Patient</p>
                        <p className="font-medium">{selectedOrder.patientName}</p>
                      </div>
                      <div>
                        <p className="text-blue-100 mb-1">Booking Date</p>
                        <p className="font-medium">
                          {new Date(selectedOrder.date).toLocaleDateString("en-IN", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })}
                        </p>
                      </div>
                    </div>

                    {selectedOrder.estimatedCompletion && (
                      <div className="mt-4 pt-4 border-t border-white/20">
                        <p className="text-blue-100 text-sm mb-1">
                          Estimated Completion
                        </p>
                        <p className="font-medium flex items-center gap-2">
                          <Clock className="w-4 h-4" />
                          {selectedOrder.estimatedCompletion}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Tests/Packages */}
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-3">
                      Tests & Packages
                    </h3>
                    <div className="space-y-2">
                      {selectedOrder.items.map((item) => (
                        <div
                          key={item.id}
                          className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg"
                        >
                          {item.type === "test" ? (
                            <TestTube className="w-5 h-5 text-blue-600" />
                          ) : (
                            <Package className="w-5 h-5 text-purple-600" />
                          )}
                          <span className="text-gray-700">{item.name}</span>
                          <Badge
                            variant="outline"
                            className="ml-auto text-xs capitalize"
                          >
                            {item.type}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Tracking Timeline */}
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-4">
                      Tracking Status
                    </h3>
                    <div className="space-y-0">
                      {selectedOrder.trackingEvents.map((event, index) => {
                        const isLast = index === selectedOrder.trackingEvents.length - 1;
                        const IconComponent = event.completed
                          ? CheckCircle
                          : event.status === "Processing"
                          ? Loader2
                          : Clock;

                        return (
                          <div key={event.id} className="flex gap-4">
                            {/* Timeline */}
                            <div className="flex flex-col items-center">
                              <div
                                className={cn(
                                  "w-8 h-8 rounded-full flex items-center justify-center",
                                  event.completed
                                    ? "bg-green-100"
                                    : "bg-gray-100"
                                )}
                              >
                                <IconComponent
                                  className={cn(
                                    "w-4 h-4",
                                    event.completed
                                      ? "text-green-600"
                                      : "text-gray-400",
                                    !event.completed &&
                                      event.status === "Processing" &&
                                      "animate-spin"
                                  )}
                                />
                              </div>
                              {!isLast && (
                                <div
                                  className={cn(
                                    "w-0.5 h-12",
                                    event.completed ? "bg-green-200" : "bg-gray-200"
                                  )}
                                />
                              )}
                            </div>

                            {/* Content */}
                            <div className="pb-6">
                              <p
                                className={cn(
                                  "font-medium",
                                  event.completed
                                    ? "text-gray-900"
                                    : "text-gray-500"
                                )}
                              >
                                {event.status}
                              </p>
                              <p className="text-sm text-gray-500">
                                {event.description}
                              </p>
                              {event.timestamp && (
                                <p className="text-xs text-gray-400 mt-1">
                                  {event.timestamp}
                                </p>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Payment Info */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-500">Total Amount</p>
                        <p className="text-xl font-bold text-gray-900">
                          ₹{selectedOrder.totalAmount.toLocaleString()}
                        </p>
                      </div>
                      <Badge
                        className={cn(
                          selectedOrder.paymentStatus === "paid"
                            ? "bg-green-100 text-green-800"
                            : selectedOrder.paymentStatus === "pay-at-lab"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-red-100 text-red-800"
                        )}
                      >
                        {selectedOrder.paymentStatus === "paid"
                          ? "Paid"
                          : selectedOrder.paymentStatus === "pay-at-lab"
                          ? "Pay at Lab"
                          : "Payment Pending"}
                      </Badge>
                    </div>
                  </div>

                  {/* Download Report Button (if completed) */}
                  {selectedOrder.status === "completed" && (
                    <Button className="w-full h-12" variant="default">
                      <FileText className="w-5 h-5 mr-2" />
                      Download Report
                    </Button>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
