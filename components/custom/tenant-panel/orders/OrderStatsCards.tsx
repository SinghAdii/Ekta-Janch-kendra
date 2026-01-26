/**
 * Order Stats Cards Component
 * 
 * Reusable stats cards for order management pages.
 */

"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  ShoppingCart,
  Clock,
  CheckCircle2,
  XCircle,
  IndianRupee,
  TrendingUp,
  AlertCircle,
  FileCheck,
  Activity,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import type { OrderStats } from "@/hooks/useOrderStats";

function formatINR(amount: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  bgColor: string;
  iconColor: string;
  subtitle?: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
}

function StatsCard({ title, value, icon, bgColor, iconColor, subtitle, trend }: StatsCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="hover:shadow-md transition-shadow">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <div className={`p-2.5 rounded-xl ${bgColor}`}>
              <div className={iconColor}>{icon}</div>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs text-muted-foreground truncate">{title}</p>
              <p className="text-xl font-bold truncate">{value}</p>
              {subtitle && (
                <p className="text-xs text-muted-foreground truncate">{subtitle}</p>
              )}
              {trend && (
                <p className={`text-xs flex items-center gap-1 ${trend.isPositive ? "text-green-600" : "text-red-600"}`}>
                  <TrendingUp className={`h-3 w-3 ${!trend.isPositive && "rotate-180"}`} />
                  {trend.value}%
                </p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

interface OrderStatsCardsProps {
  stats: OrderStats;
  variant?: "default" | "compact" | "detailed";
  showRevenue?: boolean;
  className?: string;
}

export function OrderStatsCards({ stats, variant = "default", showRevenue = true, className }: OrderStatsCardsProps) {
  if (variant === "compact") {
    return (
      <div className={`grid grid-cols-2 md:grid-cols-4 gap-3 ${className}`}>
        <StatsCard
          title="Total Orders"
          value={stats.total}
          icon={<ShoppingCart className="h-5 w-5" />}
          bgColor="bg-blue-100 dark:bg-blue-900/30"
          iconColor="text-blue-600 dark:text-blue-400"
        />
        <StatsCard
          title="Pending"
          value={stats.pending}
          icon={<Clock className="h-5 w-5" />}
          bgColor="bg-amber-100 dark:bg-amber-900/30"
          iconColor="text-amber-600 dark:text-amber-400"
        />
        <StatsCard
          title="Processing"
          value={stats.processing + stats.sampleCollected}
          icon={<Activity className="h-5 w-5" />}
          bgColor="bg-indigo-100 dark:bg-indigo-900/30"
          iconColor="text-indigo-600 dark:text-indigo-400"
        />
        <StatsCard
          title="Completed"
          value={stats.completed}
          icon={<CheckCircle2 className="h-5 w-5" />}
          bgColor="bg-green-100 dark:bg-green-900/30"
          iconColor="text-green-600 dark:text-green-400"
        />
      </div>
    );
  }

  if (variant === "detailed") {
    return (
      <div className={`grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 ${className}`}>
        <StatsCard
          title="Total Orders"
          value={stats.total}
          icon={<ShoppingCart className="h-5 w-5" />}
          bgColor="bg-blue-100 dark:bg-blue-900/30"
          iconColor="text-blue-600 dark:text-blue-400"
        />
        <StatsCard
          title="Pending"
          value={stats.pending}
          icon={<Clock className="h-5 w-5" />}
          bgColor="bg-amber-100 dark:bg-amber-900/30"
          iconColor="text-amber-600 dark:text-amber-400"
        />
        <StatsCard
          title="Sample Collected"
          value={stats.sampleCollected}
          icon={<FileCheck className="h-5 w-5" />}
          bgColor="bg-purple-100 dark:bg-purple-900/30"
          iconColor="text-purple-600 dark:text-purple-400"
        />
        <StatsCard
          title="Processing"
          value={stats.processing}
          icon={<Activity className="h-5 w-5" />}
          bgColor="bg-indigo-100 dark:bg-indigo-900/30"
          iconColor="text-indigo-600 dark:text-indigo-400"
        />
        <StatsCard
          title="Completed"
          value={stats.completed}
          icon={<CheckCircle2 className="h-5 w-5" />}
          bgColor="bg-green-100 dark:bg-green-900/30"
          iconColor="text-green-600 dark:text-green-400"
        />
        <StatsCard
          title="Cancelled"
          value={stats.cancelled}
          icon={<XCircle className="h-5 w-5" />}
          bgColor="bg-red-100 dark:bg-red-900/30"
          iconColor="text-red-600 dark:text-red-400"
        />
        {showRevenue && (
          <>
            <StatsCard
              title="Total Revenue"
              value={formatINR(stats.totalRevenue)}
              icon={<IndianRupee className="h-5 w-5" />}
              bgColor="bg-emerald-100 dark:bg-emerald-900/30"
              iconColor="text-emerald-600 dark:text-emerald-400"
            />
            <StatsCard
              title="Collected"
              value={formatINR(stats.paidRevenue)}
              icon={<CheckCircle2 className="h-5 w-5" />}
              bgColor="bg-green-100 dark:bg-green-900/30"
              iconColor="text-green-600 dark:text-green-400"
            />
            <StatsCard
              title="Pending Amount"
              value={formatINR(stats.pendingPayments)}
              icon={<AlertCircle className="h-5 w-5" />}
              bgColor="bg-orange-100 dark:bg-orange-900/30"
              iconColor="text-orange-600 dark:text-orange-400"
            />
          </>
        )}
      </div>
    );
  }

  // Default variant
  return (
    <div className={`grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 ${className}`}>
      <StatsCard
        title="Total Orders"
        value={stats.total}
        icon={<ShoppingCart className="h-5 w-5" />}
        bgColor="bg-blue-100 dark:bg-blue-900/30"
        iconColor="text-blue-600 dark:text-blue-400"
      />
      <StatsCard
        title="Pending"
        value={stats.pending}
        icon={<Clock className="h-5 w-5" />}
        bgColor="bg-amber-100 dark:bg-amber-900/30"
        iconColor="text-amber-600 dark:text-amber-400"
      />
      <StatsCard
        title="Processing"
        value={stats.processing + stats.sampleCollected}
        icon={<Activity className="h-5 w-5" />}
        bgColor="bg-indigo-100 dark:bg-indigo-900/30"
        iconColor="text-indigo-600 dark:text-indigo-400"
      />
      <StatsCard
        title="Completed"
        value={stats.completed}
        icon={<CheckCircle2 className="h-5 w-5" />}
        bgColor="bg-green-100 dark:bg-green-900/30"
        iconColor="text-green-600 dark:text-green-400"
      />
      {showRevenue && (
        <StatsCard
          title="Revenue"
          value={formatINR(stats.paidRevenue)}
          icon={<IndianRupee className="h-5 w-5" />}
          bgColor="bg-emerald-100 dark:bg-emerald-900/30"
          iconColor="text-emerald-600 dark:text-emerald-400"
        />
      )}
    </div>
  );
}

interface SourceStatsCardsProps {
  orders: { status: string; paymentStatus: string; totalAmount: number }[];
  sourceName: string;
  className?: string;
}

export function SourceStatsCards({ orders, sourceName, className }: SourceStatsCardsProps) {
  const stats = {
    total: orders.length,
    pending: orders.filter((o) => o.status === "Pending").length,
    processing: orders.filter((o) => o.status === "Processing" || o.status === "Sample Collected").length,
    completed: orders.filter((o) => o.status === "Completed").length,
    revenue: orders
      .filter((o) => o.paymentStatus === "Paid")
      .reduce((sum, o) => sum + o.totalAmount, 0),
  };

  return (
    <div className={`grid grid-cols-2 md:grid-cols-5 gap-3 ${className}`}>
      <StatsCard
        title={`Total ${sourceName}`}
        value={stats.total}
        icon={<ShoppingCart className="h-5 w-5" />}
        bgColor="bg-blue-100 dark:bg-blue-900/30"
        iconColor="text-blue-600 dark:text-blue-400"
      />
      <StatsCard
        title="Pending"
        value={stats.pending}
        icon={<Clock className="h-5 w-5" />}
        bgColor="bg-amber-100 dark:bg-amber-900/30"
        iconColor="text-amber-600 dark:text-amber-400"
      />
      <StatsCard
        title="Processing"
        value={stats.processing}
        icon={<Activity className="h-5 w-5" />}
        bgColor="bg-indigo-100 dark:bg-indigo-900/30"
        iconColor="text-indigo-600 dark:text-indigo-400"
      />
      <StatsCard
        title="Completed"
        value={stats.completed}
        icon={<CheckCircle2 className="h-5 w-5" />}
        bgColor="bg-green-100 dark:bg-green-900/30"
        iconColor="text-green-600 dark:text-green-400"
      />
      <StatsCard
        title="Revenue"
        value={formatINR(stats.revenue)}
        icon={<IndianRupee className="h-5 w-5" />}
        bgColor="bg-emerald-100 dark:bg-emerald-900/30"
        iconColor="text-emerald-600 dark:text-emerald-400"
      />
    </div>
  );
}

export default OrderStatsCards;
