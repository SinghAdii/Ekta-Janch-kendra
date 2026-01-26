"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  Clock,
  FlaskConical,
  FileCheck,
  CheckCircle2,
  XCircle,
  Home,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { OrderStatus, OrderSource } from "./orders.types";

// ============ STATUS FLOW DEFINITIONS BY SOURCE ============
interface FlowStep {
  status: OrderStatus;
  label: string;
  icon: React.ReactNode;
  description: string;
}

const getFlowSteps = (source: OrderSource): FlowStep[] => {
  const baseSteps: FlowStep[] = [
    {
      status: "Pending",
      label: "Order Placed",
      icon: <Clock className="h-4 w-4" />,
      description: "Order created, awaiting action",
    },
  ];

  // Home Collection has an extra step
  if (source === "Home Collection") {
    return [
      ...baseSteps,
      {
        status: "Sample Collected",
        label: "Sample Collected",
        icon: <Home className="h-4 w-4" />,
        description: "Sample collected from patient",
      },
      {
        status: "Processing",
        label: "Processing",
        icon: <FlaskConical className="h-4 w-4" />,
        description: "Sample being processed in lab",
      },
      {
        status: "Report Ready",
        label: "Report Ready",
        icon: <FileCheck className="h-4 w-4" />,
        description: "Test reports are ready",
      },
      {
        status: "Completed",
        label: "Completed",
        icon: <CheckCircle2 className="h-4 w-4" />,
        description: "Reports delivered to patient",
      },
    ];
  }

  // All other sources (Online, Walk-in, Slot Booking)
  return [
    ...baseSteps,
    {
      status: "Processing",
      label: "Processing",
      icon: <FlaskConical className="h-4 w-4" />,
      description: "Sample being processed in lab",
    },
    {
      status: "Report Ready",
      label: "Report Ready",
      icon: <FileCheck className="h-4 w-4" />,
      description: "Test reports are ready",
    },
    {
      status: "Completed",
      label: "Completed",
      icon: <CheckCircle2 className="h-4 w-4" />,
      description: "Reports delivered to patient",
    },
  ];
};

// Get current step index
const getCurrentStepIndex = (status: OrderStatus, source: OrderSource): number => {
  const steps = getFlowSteps(source);
  const index = steps.findIndex((step) => step.status === status);
  return index === -1 ? 0 : index;
};

// Status colors
const statusBgColors: Record<string, string> = {
  completed: "bg-green-500",
  current: "bg-blue-500",
  upcoming: "bg-gray-200 dark:bg-gray-700",
  cancelled: "bg-red-500",
};

const statusTextColors: Record<string, string> = {
  completed: "text-green-600 dark:text-green-400",
  current: "text-blue-600 dark:text-blue-400",
  upcoming: "text-gray-400 dark:text-gray-500",
  cancelled: "text-red-600 dark:text-red-400",
};

interface OrderStatusFlowProps {
  status: OrderStatus;
  source: OrderSource;
  variant?: "horizontal" | "vertical" | "compact";
  showLabels?: boolean;
  className?: string;
}

export function OrderStatusFlow({
  status,
  source,
  variant = "horizontal",
  showLabels = true,
  className,
}: OrderStatusFlowProps) {
  const isCancelled = status === "Cancelled";
  const steps = getFlowSteps(source);
  const currentStepIndex = getCurrentStepIndex(status, source);

  const getStepState = (index: number) => {
    if (isCancelled) return "cancelled";
    if (index < currentStepIndex) return "completed";
    if (index === currentStepIndex) return "current";
    return "upcoming";
  };

  if (variant === "compact") {
    return (
      <div className={cn("flex items-center gap-1", className)}>
        {steps.map((step, index) => {
          const state = getStepState(index);
          return (
            <React.Fragment key={step.status}>
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: index * 0.1 }}
                className={cn(
                  "w-2 h-2 rounded-full transition-colors",
                  statusBgColors[state]
                )}
                title={step.label}
              />
              {index < steps.length - 1 && (
                <div
                  className={cn(
                    "w-3 h-0.5 transition-colors",
                    index < currentStepIndex && !isCancelled
                      ? "bg-green-500"
                      : "bg-gray-200 dark:bg-gray-700"
                  )}
                />
              )}
            </React.Fragment>
          );
        })}
        {isCancelled && (
          <div className="ml-2 flex items-center gap-1 text-red-500 text-xs">
            <XCircle className="h-3 w-3" />
            <span>Cancelled</span>
          </div>
        )}
      </div>
    );
  }

  if (variant === "vertical") {
    return (
      <div className={cn("space-y-0", className)}>
        {steps.map((step, index) => {
          const state = getStepState(index);
          const isLast = index === steps.length - 1;

          return (
            <div key={step.status} className="flex gap-3">
              <div className="flex flex-col items-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center transition-colors",
                    state === "completed" && "bg-green-100 dark:bg-green-900/30",
                    state === "current" && "bg-blue-100 dark:bg-blue-900/30",
                    state === "upcoming" && "bg-gray-100 dark:bg-gray-800",
                    state === "cancelled" && "bg-red-100 dark:bg-red-900/30"
                  )}
                >
                  <span className={cn(statusTextColors[state])}>
                    {isCancelled && index === currentStepIndex ? (
                      <XCircle className="h-4 w-4" />
                    ) : state === "completed" ? (
                      <CheckCircle2 className="h-4 w-4" />
                    ) : (
                      step.icon
                    )}
                  </span>
                </motion.div>
                {!isLast && (
                  <div
                    className={cn(
                      "w-0.5 h-8 transition-colors",
                      index < currentStepIndex && !isCancelled
                        ? "bg-green-500"
                        : "bg-gray-200 dark:bg-gray-700"
                    )}
                  />
                )}
              </div>
              {showLabels && (
                <div className="pt-1 pb-4">
                  <p
                    className={cn(
                      "font-medium text-sm transition-colors",
                      statusTextColors[state]
                    )}
                  >
                    {step.label}
                  </p>
                  <p className="text-xs text-muted-foreground">{step.description}</p>
                </div>
              )}
            </div>
          );
        })}
        {isCancelled && (
          <div className="flex items-center gap-2 text-red-500 mt-2 pl-11">
            <XCircle className="h-4 w-4" />
            <span className="text-sm">Order has been cancelled</span>
          </div>
        )}
      </div>
    );
  }

  // Horizontal variant (default)
  return (
    <div className={cn("w-full", className)}>
      <div className="flex items-center justify-between">
        {steps.map((step, index) => {
          const state = getStepState(index);
          const isLast = index === steps.length - 1;

          return (
            <React.Fragment key={step.status}>
              <div className="flex flex-col items-center relative">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center transition-colors border-2",
                    state === "completed" &&
                      "bg-green-100 border-green-500 dark:bg-green-900/30",
                    state === "current" &&
                      "bg-blue-100 border-blue-500 dark:bg-blue-900/30",
                    state === "upcoming" &&
                      "bg-gray-100 border-gray-300 dark:bg-gray-800 dark:border-gray-600",
                    state === "cancelled" &&
                      "bg-red-100 border-red-500 dark:bg-red-900/30"
                  )}
                >
                  <span className={cn(statusTextColors[state])}>
                    {isCancelled && index === currentStepIndex ? (
                      <XCircle className="h-5 w-5" />
                    ) : state === "completed" ? (
                      <CheckCircle2 className="h-5 w-5" />
                    ) : (
                      step.icon
                    )}
                  </span>
                </motion.div>
                {showLabels && (
                  <div className="mt-2 text-center">
                    <p
                      className={cn(
                        "text-xs font-medium transition-colors",
                        statusTextColors[state]
                      )}
                    >
                      {step.label}
                    </p>
                  </div>
                )}
              </div>
              {!isLast && (
                <div className="flex-1 h-1 mx-2 rounded-full overflow-hidden bg-gray-200 dark:bg-gray-700">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{
                      width:
                        index < currentStepIndex && !isCancelled ? "100%" : "0%",
                    }}
                    transition={{ delay: index * 0.1 + 0.2, duration: 0.3 }}
                    className="h-full bg-green-500"
                  />
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>
      {isCancelled && (
        <div className="flex items-center justify-center gap-2 text-red-500 mt-4">
          <XCircle className="h-4 w-4" />
          <span className="text-sm font-medium">Order has been cancelled</span>
        </div>
      )}
    </div>
  );
}

// ============ HELPER FUNCTIONS ============
export function getNextStatus(
  currentStatus: OrderStatus,
  source: OrderSource
): OrderStatus | null {
  const steps = getFlowSteps(source);
  const currentIndex = getCurrentStepIndex(currentStatus, source);

  if (currentIndex < steps.length - 1) {
    return steps[currentIndex + 1].status;
  }
  return null;
}

export function canTransitionTo(
  currentStatus: OrderStatus,
  targetStatus: OrderStatus,
  source: OrderSource
): boolean {
  if (currentStatus === "Cancelled" || currentStatus === "Completed") {
    return false;
  }

  const steps = getFlowSteps(source);
  const currentIndex = steps.findIndex((s) => s.status === currentStatus);
  const targetIndex = steps.findIndex((s) => s.status === targetStatus);

  // Can only move forward or cancel
  if (targetStatus === "Cancelled") return true;
  return targetIndex === currentIndex + 1;
}

export function getStatusMessage(status: OrderStatus, source: OrderSource): string {
  const messages: Record<OrderStatus, string> = {
    Pending: source === "Home Collection" 
      ? "Waiting for sample collection" 
      : "Patient verification required in Lab Processing",
    "Sample Collected": "Sample collected, ready for lab processing",
    Processing: "Sample is being processed in the lab",
    "Report Ready": "Reports ready, awaiting upload and delivery",
    Completed: "Order completed successfully",
    Cancelled: "Order has been cancelled",
  };
  return messages[status];
}

export { getFlowSteps, getCurrentStepIndex };
