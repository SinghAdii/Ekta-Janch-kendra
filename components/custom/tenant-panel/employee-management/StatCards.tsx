"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  Users,
  UserCheck,
  UserX,
  Clock,
  IndianRupee,
  TrendingUp,
  Calendar,
  Building2,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: string;
  trendUp?: boolean;
  className?: string;
  iconBgColor?: string;
}

export function StatCard({
  title,
  value,
  icon,
  trend,
  trendUp,
  className,
  iconBgColor = "bg-primary/10",
}: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className={cn("overflow-hidden", className)}>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">
                {title}
              </p>
              <p className="text-2xl font-bold">{value}</p>
              {trend && (
                <div className="flex items-center gap-1">
                  <TrendingUp
                    className={cn(
                      "h-3 w-3",
                      trendUp ? "text-green-500" : "text-red-500 rotate-180"
                    )}
                  />
                  <span
                    className={cn(
                      "text-xs font-medium",
                      trendUp ? "text-green-500" : "text-red-500"
                    )}
                  >
                    {trend}
                  </span>
                </div>
              )}
            </div>
            <div
              className={cn(
                "flex h-12 w-12 items-center justify-center rounded-full",
                iconBgColor
              )}
            >
              {icon}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

interface EmployeeStatsGridProps {
  totalEmployees: number;
  activeEmployees: number;
  onLeave: number;
  newJoinees: number;
}

export function EmployeeStatsGrid({
  totalEmployees,
  activeEmployees,
  onLeave,
  newJoinees,
}: EmployeeStatsGridProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <StatCard
        title="Total Employees"
        value={totalEmployees}
        icon={<Users className="h-5 w-5 text-primary" />}
        trend="+2 this month"
        trendUp={true}
        iconBgColor="bg-primary/10"
      />
      <StatCard
        title="Active Employees"
        value={activeEmployees}
        icon={<UserCheck className="h-5 w-5 text-green-600" />}
        iconBgColor="bg-green-100"
      />
      <StatCard
        title="On Leave"
        value={onLeave}
        icon={<Calendar className="h-5 w-5 text-amber-600" />}
        iconBgColor="bg-amber-100"
      />
      <StatCard
        title="New Joinees"
        value={newJoinees}
        icon={<TrendingUp className="h-5 w-5 text-blue-600" />}
        trend="This quarter"
        trendUp={true}
        iconBgColor="bg-blue-100"
      />
    </div>
  );
}

interface AttendanceStatsGridProps {
  presentToday: number;
  absentToday: number;
  onLeave: number;
  halfDay: number;
  totalEmployees: number;
}

export function AttendanceStatsGrid({
  presentToday,
  absentToday,
  onLeave,
  halfDay,
  totalEmployees,
}: AttendanceStatsGridProps) {
  const attendanceRate = Math.round((presentToday / totalEmployees) * 100);

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
      <StatCard
        title="Present Today"
        value={presentToday}
        icon={<UserCheck className="h-5 w-5 text-green-600" />}
        trend={`${attendanceRate}% attendance`}
        trendUp={attendanceRate > 80}
        iconBgColor="bg-green-100"
      />
      <StatCard
        title="Absent Today"
        value={absentToday}
        icon={<UserX className="h-5 w-5 text-red-600" />}
        iconBgColor="bg-red-100"
      />
      <StatCard
        title="On Leave"
        value={onLeave}
        icon={<Calendar className="h-5 w-5 text-amber-600" />}
        iconBgColor="bg-amber-100"
      />
      <StatCard
        title="Half Day"
        value={halfDay}
        icon={<Clock className="h-5 w-5 text-blue-600" />}
        iconBgColor="bg-blue-100"
      />
      <StatCard
        title="Total Employees"
        value={totalEmployees}
        icon={<Users className="h-5 w-5 text-primary" />}
        iconBgColor="bg-primary/10"
      />
    </div>
  );
}

interface SalaryStatsGridProps {
  totalPayroll: number;
  paidAmount: number;
  pendingAmount: number;
  totalEmployees: number;
}

export function SalaryStatsGrid({
  totalPayroll,
  paidAmount,
  pendingAmount,
  totalEmployees,
}: SalaryStatsGridProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <StatCard
        title="Total Payroll"
        value={formatCurrency(totalPayroll)}
        icon={<IndianRupee className="h-5 w-5 text-primary" />}
        trend="This month"
        iconBgColor="bg-primary/10"
      />
      <StatCard
        title="Paid Amount"
        value={formatCurrency(paidAmount)}
        icon={<UserCheck className="h-5 w-5 text-green-600" />}
        iconBgColor="bg-green-100"
      />
      <StatCard
        title="Pending Amount"
        value={formatCurrency(pendingAmount)}
        icon={<Clock className="h-5 w-5 text-amber-600" />}
        iconBgColor="bg-amber-100"
      />
      <StatCard
        title="Total Employees"
        value={totalEmployees}
        icon={<Building2 className="h-5 w-5 text-blue-600" />}
        iconBgColor="bg-blue-100"
      />
    </div>
  );
}

export { StatCard as default };
