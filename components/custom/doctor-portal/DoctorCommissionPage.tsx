"use client";

import { useState, useMemo } from "react";
import { format, parseISO } from "date-fns";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  IndianRupee,
  TrendingUp,
  Calendar,
  FileText,
  Search,
  Download,
  Users,
  Wallet,
  ArrowUpRight,
} from "lucide-react";

// Types
interface CommissionEntry {
  id: string;
  orderId: string;
  patientName: string;
  testName: string;
  orderAmount: number;
  commissionRate: number;
  commissionAmount: number;
  status: "pending" | "paid" | "processing";
  orderDate: string;
  paidDate?: string;
}

interface CommissionStats {
  totalEarned: number;
  pendingAmount: number;
  paidThisMonth: number;
  totalReferrals: number;
}

// Mock Data
const mockCommissionStats: CommissionStats = {
  totalEarned: 45680,
  pendingAmount: 8450,
  paidThisMonth: 12500,
  totalReferrals: 156,
};

const mockCommissionEntries: CommissionEntry[] = [
  {
    id: "comm-001",
    orderId: "ORD-2026-0145",
    patientName: "Rajesh Kumar",
    testName: "Full Body Checkup",
    orderAmount: 3999,
    commissionRate: 10,
    commissionAmount: 400,
    status: "paid",
    orderDate: "2026-01-28",
    paidDate: "2026-02-01",
  },
  {
    id: "comm-002",
    orderId: "ORD-2026-0152",
    patientName: "Priya Sharma",
    testName: "Thyroid Profile",
    orderAmount: 899,
    commissionRate: 10,
    commissionAmount: 90,
    status: "paid",
    orderDate: "2026-01-30",
    paidDate: "2026-02-01",
  },
  {
    id: "comm-003",
    orderId: "ORD-2026-0168",
    patientName: "Amit Patel",
    testName: "Diabetes Panel",
    orderAmount: 1299,
    commissionRate: 10,
    commissionAmount: 130,
    status: "pending",
    orderDate: "2026-02-02",
  },
  {
    id: "comm-004",
    orderId: "ORD-2026-0175",
    patientName: "Sunita Verma",
    testName: "Lipid Profile",
    orderAmount: 599,
    commissionRate: 10,
    commissionAmount: 60,
    status: "pending",
    orderDate: "2026-02-03",
  },
  {
    id: "comm-005",
    orderId: "ORD-2026-0180",
    patientName: "Ravi Singh",
    testName: "CBC + Vitamin D",
    orderAmount: 1199,
    commissionRate: 10,
    commissionAmount: 120,
    status: "processing",
    orderDate: "2026-02-04",
  },
  {
    id: "comm-006",
    orderId: "ORD-2026-0185",
    patientName: "Neha Gupta",
    testName: "Women's Health Package",
    orderAmount: 2499,
    commissionRate: 10,
    commissionAmount: 250,
    status: "pending",
    orderDate: "2026-02-05",
  },
];

const statusColors: Record<string, string> = {
  pending: "bg-amber-100 text-amber-700",
  paid: "bg-green-100 text-green-700",
  processing: "bg-blue-100 text-blue-700",
};

function formatINR(amount: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

export default function DoctorCommissionPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [stats] = useState<CommissionStats>(mockCommissionStats);
  const [entries] = useState<CommissionEntry[]>(mockCommissionEntries);

  // Filter entries
  const filteredEntries = useMemo(() => {
    return entries.filter((entry) => {
      const matchesSearch =
        entry.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        entry.orderId.toLowerCase().includes(searchQuery.toLowerCase()) ||
        entry.testName.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus = statusFilter === "all" || entry.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [entries, searchQuery, statusFilter]);

  // Calculate filtered totals
  const filteredTotal = useMemo(() => {
    return filteredEntries.reduce((sum, entry) => sum + entry.commissionAmount, 0);
  }, [filteredEntries]);

  return (
    <div className="p-6 lg:p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">My Commission</h1>
          <p className="text-muted-foreground">Track your referral earnings</p>
        </div>
        <Button variant="outline">
          <Download className="h-4 w-4 mr-2" />
          Download Statement
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Earned</p>
                <p className="text-2xl font-bold mt-1">{formatINR(stats.totalEarned)}</p>
              </div>
              <div className="p-2 bg-green-100 rounded-lg">
                <Wallet className="h-5 w-5 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Pending</p>
                <p className="text-2xl font-bold mt-1">{formatINR(stats.pendingAmount)}</p>
              </div>
              <div className="p-2 bg-amber-100 rounded-lg">
                <TrendingUp className="h-5 w-5 text-amber-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Paid This Month</p>
                <p className="text-2xl font-bold mt-1">{formatINR(stats.paidThisMonth)}</p>
              </div>
              <div className="p-2 bg-blue-100 rounded-lg">
                <IndianRupee className="h-5 w-5 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Referrals</p>
                <p className="text-2xl font-bold mt-1">{stats.totalReferrals}</p>
              </div>
              <div className="p-2 bg-purple-100 rounded-lg">
                <Users className="h-5 w-5 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Commission Rate Info */}
      <Card className="bg-primary/5 border-primary/20">
        <CardContent className="p-4 flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-lg">
            <ArrowUpRight className="h-5 w-5 text-primary" />
          </div>
          <div>
            <p className="font-medium">Your Commission Rate: 10%</p>
            <p className="text-sm text-muted-foreground">
              You earn 10% commission on every test or package booked through your referral
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by patient, order ID, or test..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-40">
                <SelectValue placeholder="Filter status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="processing">Processing</SelectItem>
                <SelectItem value="paid">Paid</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Commission Table */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Commission History
            </CardTitle>
            <Badge variant="secondary">
              Total: {formatINR(filteredTotal)}
            </Badge>
          </div>
          <CardDescription>
            {filteredEntries.length} entries found
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          {filteredEntries.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12">
              <FileText className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold">No Commission Entries</h3>
              <p className="text-muted-foreground text-sm">
                {searchQuery || statusFilter !== "all"
                  ? "No entries match your filters"
                  : "Start referring patients to earn commission"}
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order Details</TableHead>
                  <TableHead className="hidden md:table-cell">Test/Package</TableHead>
                  <TableHead className="hidden lg:table-cell">Order Amount</TableHead>
                  <TableHead>Commission</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="hidden md:table-cell">Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredEntries.map((entry) => (
                  <TableRow key={entry.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium text-sm">{entry.patientName}</p>
                        <p className="text-xs text-muted-foreground">{entry.orderId}</p>
                      </div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      <span className="text-sm">{entry.testName}</span>
                    </TableCell>
                    <TableCell className="hidden lg:table-cell">
                      <span className="text-sm">{formatINR(entry.orderAmount)}</span>
                    </TableCell>
                    <TableCell>
                      <div>
                        <span className="font-semibold text-green-600">
                          {formatINR(entry.commissionAmount)}
                        </span>
                        <p className="text-xs text-muted-foreground">{entry.commissionRate}%</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={statusColors[entry.status]}>
                        {entry.status.charAt(0).toUpperCase() + entry.status.slice(1)}
                      </Badge>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      <div className="text-sm">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {format(parseISO(entry.orderDate), "dd MMM")}
                        </div>
                        {entry.paidDate && (
                          <p className="text-xs text-green-600">
                            Paid: {format(parseISO(entry.paidDate), "dd MMM")}
                          </p>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
