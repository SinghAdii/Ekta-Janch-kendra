/**
 * Order Filters Bar Component
 * 
 * Reusable filters bar for order management pages.
 */

"use client";

import React from "react";
import { Search, Filter, X, Download, RefreshCw, CreditCard } from "lucide-react";
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
import { DateRangePicker } from "./orders.components";
import type { OrderStatus, PaymentStatus, LabBranch } from "./orders.types";
import { labBranches } from "./orders.data";

interface DateRange {
  from: Date | undefined;
  to: Date | undefined;
}

interface OrderFiltersBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  statusFilter: OrderStatus | "all";
  onStatusChange: (status: OrderStatus | "all") => void;
  dateRange: DateRange;
  onDateRangeChange: (range: DateRange) => void;
  onClearFilters: () => void;
  hasActiveFilters: boolean;
  onRefresh?: () => void;
  onExport?: () => void;
  isLoading?: boolean;
  showSourceFilter?: boolean;
  sourceFilter?: string;
  onSourceChange?: (source: string) => void;
  // Branch filter props
  showBranchFilter?: boolean;
  branchFilter?: string;
  onBranchChange?: (branchId: string) => void;
  branches?: LabBranch[];
  // Payment filter props
  showPaymentFilter?: boolean;
  paymentFilter?: PaymentStatus | "all";
  onPaymentChange?: (payment: PaymentStatus | "all") => void;
  searchPlaceholder?: string;
  className?: string;
  additionalFilters?: React.ReactNode;
}

const orderStatuses: (OrderStatus | "all")[] = [
  "all",
  "Pending",
  "Sample Collected",
  "Processing",
  "Report Ready",
  "Completed",
  "Cancelled",
];

const paymentStatuses: (PaymentStatus | "all")[] = [
  "all",
  "Pending",
  "Paid",
  "Partial",
  "Refunded",
];

export function OrderFiltersBar({
  searchQuery,
  onSearchChange,
  statusFilter,
  onStatusChange,
  dateRange,
  onDateRangeChange,
  onClearFilters,
  hasActiveFilters,
  onRefresh,
  onExport,
  isLoading,
  showSourceFilter,
  sourceFilter,
  onSourceChange,
  showBranchFilter = true,
  branchFilter,
  onBranchChange,
  branches = labBranches,
  showPaymentFilter = false,
  paymentFilter,
  onPaymentChange,
  searchPlaceholder = "Search orders...",
  className,
  additionalFilters,
}: OrderFiltersBarProps) {
  const activeFilterCount = [
    searchQuery !== "",
    statusFilter !== "all",
    dateRange.from !== undefined || dateRange.to !== undefined,
    sourceFilter && sourceFilter !== "all",
    branchFilter && branchFilter !== "all",
    paymentFilter && paymentFilter !== "all",
  ].filter(Boolean).length;

  return (
    <div className={`space-y-3 ${className}`}>
      {/* Main Filters Row */}
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={searchPlaceholder}
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-9 pr-9"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Status Filter */}
        <Select value={statusFilter} onValueChange={(value) => onStatusChange(value as OrderStatus | "all")}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            {orderStatuses.map((status) => (
              <SelectItem key={status} value={status}>
                {status === "all" ? "All Statuses" : status}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Source Filter (optional) */}
        {showSourceFilter && onSourceChange && (
          <Select value={sourceFilter || "all"} onValueChange={onSourceChange}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Filter by source" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Sources</SelectItem>
              <SelectItem value="Walk-in">Walk-in</SelectItem>
              <SelectItem value="Home Collection">Home Collection</SelectItem>
              <SelectItem value="Slot Booking">Slot Booking</SelectItem>
              <SelectItem value="Online Test Booking">Online Test</SelectItem>
              <SelectItem value="Online Package Booking">Online Package</SelectItem>
            </SelectContent>
          </Select>
        )}

        {/* Branch Filter */}
        {showBranchFilter && onBranchChange && (
          <Select value={branchFilter || "all"} onValueChange={onBranchChange}>
            <SelectTrigger className="w-full sm:w-[200px]">
              <SelectValue placeholder="Filter by branch" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Branches</SelectItem>
              {branches.filter(b => b.isActive).map((branch) => (
                <SelectItem key={branch.id} value={branch.id}>
                  {branch.code} - {branch.city}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}

        {/* Payment Filter */}
        {showPaymentFilter && onPaymentChange && (
          <Select value={paymentFilter || "all"} onValueChange={(value) => onPaymentChange(value as PaymentStatus | "all")}>
            <SelectTrigger className="w-full sm:w-[160px]">
              <CreditCard className="h-4 w-4 mr-2 text-muted-foreground" />
              <SelectValue placeholder="Payment" />
            </SelectTrigger>
            <SelectContent>
              {paymentStatuses.map((status) => (
                <SelectItem key={status} value={status}>
                  {status === "all" ? "All Payments" : status}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}

        {/* Date Range Picker */}
        <DateRangePicker
          dateRange={dateRange}
          onDateRangeChange={onDateRangeChange}
          className="w-full sm:w-auto"
        />
      </div>

      {/* Actions Row */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          {/* Active Filters Badge */}
          {hasActiveFilters && (
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="gap-1">
                <Filter className="h-3 w-3" />
                {activeFilterCount} filter{activeFilterCount !== 1 ? "s" : ""} active
              </Badge>
              <Button
                variant="ghost"
                size="sm"
                onClick={onClearFilters}
                className="h-7 px-2 text-xs"
              >
                Clear all
                <X className="ml-1 h-3 w-3" />
              </Button>
            </div>
          )}

          {/* Additional Filters */}
          {additionalFilters}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          {onRefresh && (
            <Button
              variant="outline"
              size="sm"
              onClick={onRefresh}
              disabled={isLoading}
              className="gap-2"
            >
              <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
              <span className="hidden sm:inline">Refresh</span>
            </Button>
          )}

          {onExport && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="gap-2">
                  <Download className="h-4 w-4" />
                  <span className="hidden sm:inline">Export</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Export Options</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => onExport()}>
                  Export as CSV
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onExport()}>
                  Export as Excel
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onExport()}>
                  Export as PDF
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>
    </div>
  );
}

export default OrderFiltersBar;
