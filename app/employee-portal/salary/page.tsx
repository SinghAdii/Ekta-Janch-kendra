"use client";

import { useState, useMemo } from "react";
import {
  Wallet,
  Download,
  CheckCircle,
  Clock,
  TrendingUp,
  Filter,
  Plus,
  Minus,
  FileText,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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
} from "@/components/ui/dialog";
import {
  mockSalaryData,
  getSalaryStats,
  SalaryRecord,
} from "@/components/custom/employee-portal/employee.data";

const STATUS_CONFIG = {
  paid: {
    label: "Paid",
    bgColor: "bg-green-100",
    textColor: "text-green-700",
    icon: CheckCircle,
  },
  pending: {
    label: "Pending",
    bgColor: "bg-amber-100",
    textColor: "text-amber-700",
    icon: Clock,
  },
  processing: {
    label: "Processing",
    bgColor: "bg-blue-100",
    textColor: "text-blue-700",
    icon: Clock,
  },
};

export default function MySalaryPage() {
  const [selectedYear, setSelectedYear] = useState("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedSalary, setSelectedSalary] = useState<SalaryRecord | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  // Filter salary data
  const filteredData = useMemo(() => {
    return mockSalaryData.filter((record) => {
      const matchesYear = selectedYear === "all" || record.year.toString() === selectedYear;
      const matchesStatus = statusFilter === "all" || record.status === statusFilter;
      return matchesYear && matchesStatus;
    });
  }, [selectedYear, statusFilter]);

  const stats = getSalaryStats(filteredData);

  const handleViewDetails = (salary: SalaryRecord) => {
    setSelectedSalary(salary);
    setIsDetailsOpen(true);
  };

  return (
    <div className="p-6 lg:p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Salary</h1>
          <p className="text-gray-500 mt-1">
            View your salary history and payment details
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-xl font-bold text-gray-900">
                  ₹{stats.totalEarned.toLocaleString()}
                </p>
                <p className="text-xs text-gray-500">Total Earned</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                <Wallet className="w-5 h-5 text-emerald-600" />
              </div>
              <div>
                <p className="text-xl font-bold text-gray-900">
                  ₹{stats.averageSalary.toLocaleString()}
                </p>
                <p className="text-xs text-gray-500">Avg. Monthly</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-xl font-bold text-gray-900">{stats.paidMonths}</p>
                <p className="text-xs text-gray-500">Months Paid</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
                <Clock className="w-5 h-5 text-amber-600" />
              </div>
              <div>
                <p className="text-xl font-bold text-gray-900">{stats.pendingMonths}</p>
                <p className="text-xs text-gray-500">Pending</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-gray-500" />
              <span className="text-sm font-medium text-gray-700">Filters:</span>
            </div>

            <Select value={selectedYear} onValueChange={setSelectedYear}>
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="Year" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Years</SelectItem>
                <SelectItem value="2026">2026</SelectItem>
                <SelectItem value="2025">2025</SelectItem>
                <SelectItem value="2024">2024</SelectItem>
              </SelectContent>
            </Select>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="paid">Paid</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="processing">Processing</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Salary Cards Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredData.length === 0 ? (
          <div className="col-span-full text-center py-12 text-gray-500">
            <Wallet className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>No salary records found for the selected period</p>
          </div>
        ) : (
          filteredData.map((salary) => {
            const config = STATUS_CONFIG[salary.status];
            const StatusIcon = config.icon;

            return (
              <Card key={salary.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-5">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="font-semibold text-gray-900">{salary.month}</h3>
                      <p className="text-xs text-gray-500">
                        {salary.paidDate
                          ? `Paid on ${new Date(salary.paidDate).toLocaleDateString("en-IN", {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            })}`
                          : "Payment pending"}
                      </p>
                    </div>
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${config.bgColor} ${config.textColor}`}
                    >
                      <StatusIcon className="w-3.5 h-3.5" />
                      {config.label}
                    </span>
                  </div>

                  <div className="mb-4">
                    <p className="text-sm text-gray-500">Net Salary</p>
                    <p className="text-2xl font-bold text-gray-900">
                      ₹{salary.netSalary.toLocaleString()}
                    </p>
                  </div>

                  <div className="grid grid-cols-3 gap-2 mb-4 text-center">
                    <div className="p-2 bg-gray-50 rounded-lg">
                      <p className="text-xs text-gray-500">Basic</p>
                      <p className="text-sm font-medium text-gray-900">
                        ₹{salary.basicSalary.toLocaleString()}
                      </p>
                    </div>
                    <div className="p-2 bg-green-50 rounded-lg">
                      <p className="text-xs text-green-600">Allowances</p>
                      <p className="text-sm font-medium text-green-700">
                        +₹{salary.allowances.toLocaleString()}
                      </p>
                    </div>
                    <div className="p-2 bg-red-50 rounded-lg">
                      <p className="text-xs text-red-600">Deductions</p>
                      <p className="text-sm font-medium text-red-700">
                        -₹{salary.deductions.toLocaleString()}
                      </p>
                    </div>
                  </div>

                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => handleViewDetails(salary)}
                  >
                    <FileText className="w-4 h-4 mr-2" />
                    View Details
                  </Button>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>

      {/* Salary Details Dialog */}
      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Salary Details - {selectedSalary?.month}</DialogTitle>
          </DialogHeader>

          {selectedSalary && (
            <div className="space-y-6">
              {/* Status */}
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-sm text-gray-600">Status</span>
                <span
                  className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${
                    STATUS_CONFIG[selectedSalary.status].bgColor
                  } ${STATUS_CONFIG[selectedSalary.status].textColor}`}
                >
                  {STATUS_CONFIG[selectedSalary.status].label}
                </span>
              </div>

              {/* Breakdown */}
              <div className="space-y-3">
                <h4 className="font-medium text-gray-900">Salary Breakdown</h4>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between py-2 border-b">
                    <span className="text-gray-600">Basic Salary</span>
                    <span className="font-medium">
                      ₹{selectedSalary.basicSalary.toLocaleString()}
                    </span>
                  </div>

                  <div className="flex items-center justify-between py-2 border-b">
                    <span className="text-green-600 flex items-center gap-1">
                      <Plus className="w-4 h-4" />
                      Allowances
                    </span>
                    <span className="font-medium text-green-600">
                      +₹{selectedSalary.allowances.toLocaleString()}
                    </span>
                  </div>

                  <div className="flex items-center justify-between py-2 border-b">
                    <span className="text-red-600 flex items-center gap-1">
                      <Minus className="w-4 h-4" />
                      Deductions
                    </span>
                    <span className="font-medium text-red-600">
                      -₹{selectedSalary.deductions.toLocaleString()}
                    </span>
                  </div>

                  <div className="flex items-center justify-between py-3 bg-emerald-50 rounded-lg px-3">
                    <span className="font-semibold text-gray-900">Net Salary</span>
                    <span className="text-xl font-bold text-emerald-600">
                      ₹{selectedSalary.netSalary.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>

              {/* Payment Info */}
              {selectedSalary.paidDate && (
                <div className="p-3 bg-green-50 rounded-lg">
                  <p className="text-sm text-green-700">
                    <span className="font-medium">Payment Date:</span>{" "}
                    {new Date(selectedSalary.paidDate).toLocaleDateString("en-IN", {
                      weekday: "long",
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </p>
                </div>
              )}

              {/* Download Button */}
              {selectedSalary.status === "paid" && (
                <Button className="w-full" disabled>
                  <Download className="w-4 h-4 mr-2" />
                  Download Payslip (Coming Soon)
                </Button>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
