"use client";

import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  IndianRupee,
  Search,
  Filter,
  Download,
  ChevronLeft,
  ChevronRight,
  Calendar,
  CheckCircle2,
  Clock,
  AlertCircle,
  FileText,
  Printer,
  Eye,
  TrendingUp,
  CreditCard,
} from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import {
  employees,
  salaryRecords as initialSalaryRecords,
} from "./employee.data";
import type { SalaryRecord, PaymentStatus } from "./employee.types";
import { SalaryStatsGrid } from "./StatCards";

const ITEMS_PER_PAGE = 6;

const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export default function SalaryManagementPage() {
  const [salaryRecords, setSalaryRecords] =
    useState<SalaryRecord[]>(initialSalaryRecords);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedMonth, setSelectedMonth] = useState<string>(
    months[new Date().getMonth()]
  );
  const [selectedYear, setSelectedYear] = useState<number>(
    new Date().getFullYear()
  );
  const [currentPage, setCurrentPage] = useState(1);
  const [paySlipOpen, setPaySlipOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<SalaryRecord | null>(
    null
  );
  const [processPaymentOpen, setProcessPaymentOpen] = useState(false);
  const [recordToProcess, setRecordToProcess] = useState<SalaryRecord | null>(
    null
  );

  // Filter records by month and year
  const monthRecords = useMemo(() => {
    return salaryRecords.filter(
      (r) => r.month === selectedMonth && r.year === selectedYear
    );
  }, [salaryRecords, selectedMonth, selectedYear]);

  // Filter records
  const filteredRecords = useMemo(() => {
    return monthRecords.filter((record) => {
      const employee = employees.find((e) => e.id === record.employeeId);
      const matchesSearch =
        record.employeeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        employee?.employeeId.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus =
        statusFilter === "all" || record.paymentStatus === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [monthRecords, searchQuery, statusFilter]);

  // Pagination
  const totalPages = Math.ceil(filteredRecords.length / ITEMS_PER_PAGE);
  const paginatedRecords = filteredRecords.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  // Stats calculation
  const stats = useMemo(() => {
    const totalPayroll = monthRecords.reduce((sum, r) => sum + r.netSalary, 0);
    const paidAmount = monthRecords
      .filter((r) => r.paymentStatus === "paid")
      .reduce((sum, r) => sum + r.netSalary, 0);
    const pendingAmount = monthRecords
      .filter((r) => r.paymentStatus === "pending")
      .reduce((sum, r) => sum + r.netSalary, 0);

    return {
      totalPayroll,
      paidAmount,
      pendingAmount,
      totalEmployees: monthRecords.length,
    };
  }, [monthRecords]);

  const handleViewPaySlip = (record: SalaryRecord) => {
    setSelectedRecord(record);
    setPaySlipOpen(true);
  };

  const handleProcessPayment = (record: SalaryRecord) => {
    setRecordToProcess(record);
    setProcessPaymentOpen(true);
  };

  const confirmPayment = () => {
    if (recordToProcess) {
      setSalaryRecords(
        salaryRecords.map((r) =>
          r.id === recordToProcess.id
            ? {
                ...r,
                paymentStatus: "paid" as PaymentStatus,
                paymentDate: new Date().toISOString().split("T")[0],
              }
            : r
        )
      );
      setProcessPaymentOpen(false);
      setRecordToProcess(null);
    }
  };

  const getStatusBadge = (status: PaymentStatus) => {
    const config = {
      paid: {
        icon: CheckCircle2,
        class: "bg-green-100 text-green-700 border-green-200",
        label: "Paid",
      },
      pending: {
        icon: Clock,
        class: "bg-amber-100 text-amber-700 border-amber-200",
        label: "Pending",
      },
      partial: {
        icon: AlertCircle,
        class: "bg-blue-100 text-blue-700 border-blue-200",
        label: "Partial",
      },
    };
    const { icon: Icon, class: className, label } = config[status];
    return (
      <Badge variant="outline" className={className}>
        <Icon className="h-3 w-3 mr-1" />
        {label}
      </Badge>
    );
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const years = [2024, 2025, 2026];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <IndianRupee className="h-7 w-7 text-primary" />
            Salary Management
          </h1>
          <p className="text-muted-foreground mt-1">
            Process salaries based on attendance and manage payroll
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="gap-2">
            <Download className="h-4 w-4" />
            Export Payroll
          </Button>
          <Button variant="outline" className="gap-2">
            <FileText className="h-4 w-4" />
            Generate All Slips
          </Button>
        </div>
      </div>

      {/* Month/Year Selector */}
      <Card className="bg-primary/5 border-primary/20">
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-primary" />
              <span className="font-semibold">Payroll Period:</span>
            </div>
            <div className="flex items-center gap-3">
              <Select value={selectedMonth} onValueChange={setSelectedMonth}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {months.map((month) => (
                    <SelectItem key={month} value={month}>
                      {month}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select
                value={String(selectedYear)}
                onValueChange={(v) => setSelectedYear(Number(v))}
              >
                <SelectTrigger className="w-[120px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {years.map((year) => (
                    <SelectItem key={year} value={String(year)}>
                      {year}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats Grid */}
      <SalaryStatsGrid
        totalPayroll={stats.totalPayroll}
        paidAmount={stats.paidAmount}
        pendingAmount={stats.pendingAmount}
        totalEmployees={stats.totalEmployees}
      />

      {/* Quick Stats Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="border-green-200 bg-green-50/50">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
              <CheckCircle2 className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-green-700">Paid Employees</p>
              <p className="text-2xl font-bold text-green-800">
                {monthRecords.filter((r) => r.paymentStatus === "paid").length}
              </p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-amber-200 bg-amber-50/50">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="h-12 w-12 rounded-full bg-amber-100 flex items-center justify-center">
              <Clock className="h-6 w-6 text-amber-600" />
            </div>
            <div>
              <p className="text-sm text-amber-700">Pending Payments</p>
              <p className="text-2xl font-bold text-amber-800">
                {monthRecords.filter((r) => r.paymentStatus === "pending").length}
              </p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-primary/20 bg-primary/5">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
              <TrendingUp className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-sm text-primary/80">Avg. Attendance</p>
              <p className="text-2xl font-bold text-primary">
                {monthRecords.length > 0
                  ? Math.round(
                      (monthRecords.reduce((sum, r) => sum + r.presentDays, 0) /
                        monthRecords.length /
                        26) *
                        100
                    )
                  : 0}
                %
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters & Table */}
      <Card>
        <CardHeader className="pb-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by employee name or ID..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex gap-3">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[180px]">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Payment Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="paid">Paid</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="partial">Partial</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <div className="rounded-lg border overflow-hidden">
            <Table>
              <TableHeader className="bg-muted/50">
                <TableRow>
                  <TableHead>Employee</TableHead>
                  <TableHead>Base Salary</TableHead>
                  <TableHead>Present Days</TableHead>
                  <TableHead>Deductions</TableHead>
                  <TableHead>Bonus</TableHead>
                  <TableHead>Net Salary</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <AnimatePresence mode="wait">
                  {paginatedRecords.length > 0 ? (
                    paginatedRecords.map((record, index) => {
                      const employee = employees.find(
                        (e) => e.id === record.employeeId
                      );
                      return (
                        <motion.tr
                          key={record.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          transition={{ delay: index * 0.03 }}
                          className="border-b hover:bg-muted/30 transition-colors"
                        >
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <Avatar className="h-10 w-10 bg-primary/10">
                                <AvatarFallback className="text-primary font-medium">
                                  {getInitials(record.employeeName)}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="font-medium">
                                  {record.employeeName}
                                </p>
                                <p className="text-sm text-muted-foreground">
                                  {employee?.employeeId} • {employee?.department}
                                </p>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="font-medium">
                            {formatCurrency(record.baseSalary)}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1">
                              <span className="font-medium text-green-600">
                                {record.presentDays}
                              </span>
                              <span className="text-muted-foreground">
                                /{record.workingDays}
                              </span>
                            </div>
                            {record.halfDays > 0 && (
                              <p className="text-xs text-muted-foreground">
                                +{record.halfDays} half days
                              </p>
                            )}
                          </TableCell>
                          <TableCell className="text-red-600">
                            -{formatCurrency(record.deductions)}
                          </TableCell>
                          <TableCell className="text-green-600">
                            {record.bonus > 0
                              ? `+${formatCurrency(record.bonus)}`
                              : "-"}
                          </TableCell>
                          <TableCell className="font-bold text-lg">
                            {formatCurrency(record.netSalary)}
                          </TableCell>
                          <TableCell>
                            {getStatusBadge(record.paymentStatus)}
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-1">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleViewPaySlip(record)}
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                              {record.paymentStatus === "pending" && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="text-green-600 hover:text-green-700 hover:bg-green-50"
                                  onClick={() => handleProcessPayment(record)}
                                >
                                  <CreditCard className="h-4 w-4" />
                                </Button>
                              )}
                            </div>
                          </TableCell>
                        </motion.tr>
                      );
                    })
                  ) : (
                    <TableRow>
                      <TableCell
                        colSpan={8}
                        className="text-center py-12 text-muted-foreground"
                      >
                        No salary records found for this period.
                      </TableCell>
                    </TableRow>
                  )}
                </AnimatePresence>
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-4 pt-4 border-t">
              <p className="text-sm text-muted-foreground">
                Showing {(currentPage - 1) * ITEMS_PER_PAGE + 1} to{" "}
                {Math.min(currentPage * ITEMS_PER_PAGE, filteredRecords.length)}{" "}
                of {filteredRecords.length} records
              </p>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <div className="flex items-center gap-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                    (page) => (
                      <Button
                        key={page}
                        variant={currentPage === page ? "default" : "outline"}
                        size="sm"
                        onClick={() => setCurrentPage(page)}
                        className="w-8"
                      >
                        {page}
                      </Button>
                    )
                  )}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setCurrentPage((p) => Math.min(totalPages, p + 1))
                  }
                  disabled={currentPage === totalPages}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Pay Slip Dialog */}
      <Dialog open={paySlipOpen} onOpenChange={setPaySlipOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" />
              Pay Slip - {selectedRecord?.month} {selectedRecord?.year}
            </DialogTitle>
          </DialogHeader>

          {selectedRecord && (
            <div className="space-y-4">
              {/* Employee Info */}
              <div className="bg-muted/50 rounded-lg p-4">
                <div className="flex items-center gap-3">
                  <Avatar className="h-12 w-12 bg-primary/10">
                    <AvatarFallback className="text-primary font-medium">
                      {getInitials(selectedRecord.employeeName)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold text-lg">
                      {selectedRecord.employeeName}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {employees.find((e) => e.id === selectedRecord.employeeId)
                        ?.employeeId || ""}{" "}
                      •{" "}
                      {employees.find((e) => e.id === selectedRecord.employeeId)
                        ?.department || ""}
                    </p>
                  </div>
                </div>
              </div>

              {/* Attendance Summary */}
              <div className="space-y-2">
                <h4 className="font-medium text-sm text-muted-foreground uppercase">
                  Attendance Summary
                </h4>
                <div className="grid grid-cols-3 gap-3">
                  <div className="bg-green-50 rounded-lg p-3 text-center">
                    <p className="text-2xl font-bold text-green-600">
                      {selectedRecord.presentDays}
                    </p>
                    <p className="text-xs text-green-700">Present</p>
                  </div>
                  <div className="bg-blue-50 rounded-lg p-3 text-center">
                    <p className="text-2xl font-bold text-blue-600">
                      {selectedRecord.halfDays}
                    </p>
                    <p className="text-xs text-blue-700">Half Days</p>
                  </div>
                  <div className="bg-red-50 rounded-lg p-3 text-center">
                    <p className="text-2xl font-bold text-red-600">
                      {selectedRecord.leaveDays}
                    </p>
                    <p className="text-xs text-red-700">Leave/Absent</p>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Salary Breakdown */}
              <div className="space-y-3">
                <h4 className="font-medium text-sm text-muted-foreground uppercase">
                  Salary Breakdown
                </h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Base Salary</span>
                    <span className="font-medium">
                      {formatCurrency(selectedRecord.baseSalary)}
                    </span>
                  </div>
                  <div className="flex justify-between text-red-600">
                    <span>Deductions (Absent Days)</span>
                    <span>-{formatCurrency(selectedRecord.deductions)}</span>
                  </div>
                  {selectedRecord.bonus > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>Bonus</span>
                      <span>+{formatCurrency(selectedRecord.bonus)}</span>
                    </div>
                  )}
                  <Separator />
                  <div className="flex justify-between text-lg font-bold">
                    <span>Net Salary</span>
                    <span className="text-primary">
                      {formatCurrency(selectedRecord.netSalary)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Payment Status */}
              <div className="bg-muted/50 rounded-lg p-4 flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Payment Status</p>
                  {getStatusBadge(selectedRecord.paymentStatus)}
                </div>
                {selectedRecord.paymentDate && (
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">Payment Date</p>
                    <p className="font-medium">
                      {new Date(selectedRecord.paymentDate).toLocaleDateString(
                        "en-IN",
                        {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        }
                      )}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" className="gap-2">
              <Printer className="h-4 w-4" />
              Print Pay Slip
            </Button>
            <Button variant="outline" className="gap-2">
              <Download className="h-4 w-4" />
              Download PDF
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Process Payment Confirmation Dialog */}
      <Dialog open={processPaymentOpen} onOpenChange={setProcessPaymentOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5 text-primary" />
              Process Payment
            </DialogTitle>
          </DialogHeader>

          {recordToProcess && (
            <div className="space-y-4 py-4">
              <p className="text-muted-foreground">
                Are you sure you want to process the salary payment for{" "}
                <span className="font-semibold text-foreground">
                  {recordToProcess.employeeName}
                </span>
                ?
              </p>
              <div className="bg-muted/50 rounded-lg p-4">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Amount</span>
                  <span className="text-2xl font-bold text-primary">
                    {formatCurrency(recordToProcess.netSalary)}
                  </span>
                </div>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setProcessPaymentOpen(false)}
            >
              Cancel
            </Button>
            <Button onClick={confirmPayment} className="gap-2">
              <CheckCircle2 className="h-4 w-4" />
              Confirm Payment
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
