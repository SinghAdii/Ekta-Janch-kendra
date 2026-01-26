"use client";

import React, { useEffect, useState, useMemo } from "react";
import { motion } from "framer-motion";
import {
  IndianRupee,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  ShoppingCart,
  Stethoscope,
  Package,
  Users,
  Coins,
  Download,
  RefreshCw,
  BarChart3,
  PieChart as PieChartIcon,
  Activity,
  CircleDollarSign,
  Receipt,
  Calculator,
  ChevronDown,
  Calendar,
  Clock,
  Target,
  Zap,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  AreaChart,
  Area,
  CartesianGrid,
  XAxis,
  YAxis,
  BarChart,
  Bar,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  Line,
  Legend,
  ResponsiveContainer,
  ComposedChart,
} from "recharts";
import type { DateRange, Granularity } from "./financial.types";
import { defaultRange, fetchFinancialSummary } from "./financial.data";

// Utility functions
function formatINR(amount: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

function formatCompact(amount: number) {
  if (amount >= 10000000) return `₹${(amount / 10000000).toFixed(1)}Cr`;
  if (amount >= 100000) return `₹${(amount / 100000).toFixed(1)}L`;
  if (amount >= 1000) return `₹${(amount / 1000).toFixed(1)}K`;
  return `₹${amount}`;
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
  });
}

// Color palette
const COLORS = {
  revenue: "#166187",
  profit: "#22c55e",
  expenses: "#ef4444",
  doctor: "#8b5cf6",
  inventory: "#f59e0b",
  employee: "#06b6d4",
  misc: "#ec4899",
};

const PIE_COLORS = ["#8b5cf6", "#f59e0b", "#06b6d4", "#ec4899"];

// KPI Card Component
function KPICard({
  title,
  value,
  icon: Icon,
  delta,
  color,
  subtitle,
}: {
  title: string;
  value: string;
  icon: React.ElementType;
  delta?: number;
  color: string;
  subtitle?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="relative overflow-hidden group hover:shadow-lg transition-all duration-300 border-l-4"
        style={{ borderLeftColor: color }}>
        <div className="absolute top-0 right-0 w-32 h-32 -mr-8 -mt-8 rounded-full opacity-10"
          style={{ backgroundColor: color }} />
        <CardContent className="p-5">
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">{title}</p>
              <p className="text-2xl font-bold tracking-tight">{value}</p>
              {subtitle && (
                <p className="text-xs text-muted-foreground">{subtitle}</p>
              )}
            </div>
            <div
              className="rounded-xl p-3 transition-transform group-hover:scale-110"
              style={{ backgroundColor: `${color}15` }}
            >
              <Icon className="h-5 w-5" style={{ color }} />
            </div>
          </div>
          {typeof delta === "number" && (
            <div className="mt-3 flex items-center gap-2">
              <Badge
                variant="secondary"
                className={`px-2 py-0.5 text-xs font-medium ${
                  delta >= 0
                    ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                    : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                }`}
              >
                {delta >= 0 ? (
                  <ArrowUpRight className="h-3 w-3 mr-1" />
                ) : (
                  <ArrowDownRight className="h-3 w-3 mr-1" />
                )}
                {Math.abs(delta)}%
              </Badge>
              <span className="text-xs text-muted-foreground">vs last period</span>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}

// Mini Sparkline Component
function Sparkline({ data, color }: { data: number[]; color: string }) {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  
  return (
    <svg viewBox="0 0 100 30" className="w-24 h-8">
      <polyline
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        points={data
          .map((v, i) => `${(i / (data.length - 1)) * 100},${30 - ((v - min) / range) * 25}`)
          .join(" ")}
      />
    </svg>
  );
}

// Main Dashboard Component
export default function FinancialDashboardPage() {
  const [granularity, setGranularity] = useState<Granularity>("day");
  const [range, setRange] = useState<DateRange>(defaultRange(30));
  const [activeTab, setActiveTab] = useState("overview");
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState<Awaited<ReturnType<typeof fetchFinancialSummary>> | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetchFinancialSummary({ range, granularity }).then((res) => {
      if (!cancelled) {
        setData(res);
        setIsLoading(false);
      }
    });
    return () => { cancelled = true; };
  }, [range, granularity]);

  // Computed values
  const computedData = useMemo(() => {
    if (!data) return null;

    const totalRevenue = data.series.reduce((s, p) => s + p.revenue, 0);
    const totalExpenses = data.series.reduce(
      (s, p) => s + p.doctorCommission + p.inventoryCost + p.employeeCost + p.miscCost,
      0
    );
    const totalProfit = totalRevenue - totalExpenses;
    const profitMargin = totalRevenue > 0 ? (totalProfit / totalRevenue) * 100 : 0;
    const avgDailyRevenue = totalRevenue / (data.series.length || 1);
    const totalSales = data.series.reduce((s, p) => s + p.sales, 0);

    // Trend data for sparklines
    const revenueTrend = data.series.slice(-7).map((p) => p.revenue);
    const profitTrend = data.series.slice(-7).map((p) => 
      p.revenue - (p.doctorCommission + p.inventoryCost + p.employeeCost + p.miscCost)
    );

    // Best performing day
    const bestDay = data.series.reduce((best, p) => 
      p.revenue > (best?.revenue || 0) ? p : best, data.series[0]);

    return {
      totalRevenue,
      totalExpenses,
      totalProfit,
      profitMargin,
      avgDailyRevenue,
      totalSales,
      revenueTrend,
      profitTrend,
      bestDay,
    };
  }, [data]);

  // Pie chart data
  const pieData = useMemo(() => {
    if (!data) return [];
    return data.byCategory.map((c, i) => ({
      name: c.category,
      value: c.amount,
      color: PIE_COLORS[i % PIE_COLORS.length],
    }));
  }, [data]);

  // Profit trend data
  const profitChartData = useMemo(() => {
    if (!data) return [];
    return data.series.map((p) => ({
      date: formatDate(p.date),
      fullDate: p.date,
      revenue: p.revenue,
      expenses: p.doctorCommission + p.inventoryCost + p.employeeCost + p.miscCost,
      profit: p.revenue - (p.doctorCommission + p.inventoryCost + p.employeeCost + p.miscCost),
      sales: p.sales,
    }));
  }, [data]);

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-950">
      <div className="p-6 space-y-6 max-w-400 mx-auto">
        {/* Header Section */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-primary/10">
                <BarChart3 className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h1 className="text-2xl font-bold tracking-tight">Financial Analytics</h1>
                <p className="text-sm text-muted-foreground">
                  Comprehensive overview of your diagnostic center&apos;s financial performance
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Quick Filters */}
            <div className="flex items-center gap-1 p-1 bg-muted rounded-lg">
              {["Today", "7D", "30D", "90D"].map((label, i) => {
                const days = [1, 7, 30, 90][i];
                const isActive = range.from === defaultRange(days).from && range.to === defaultRange(days).to;
                return (
                  <Button
                    key={label}
                    variant={isActive ? "default" : "ghost"}
                    size="sm"
                    className="h-8 px-3"
                    onClick={() => setRange(defaultRange(days))}
                  >
                    {label}
                  </Button>
                );
              })}
            </div>

            <Separator orientation="vertical" className="h-8 hidden md:block" />

            {/* Granularity Select */}
            <Select value={granularity} onValueChange={(v) => setGranularity(v as Granularity)}>
              <SelectTrigger className="w-28 h-9">
                <Clock className="h-3.5 w-3.5 mr-2 text-muted-foreground" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="day">Daily</SelectItem>
                <SelectItem value="week">Weekly</SelectItem>
                <SelectItem value="month">Monthly</SelectItem>
              </SelectContent>
            </Select>

            {/* Date Range Picker */}
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="h-9 gap-2">
                  <Calendar className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">{range.from}</span>
                  <span className="hidden sm:inline">→</span>
                  <span className="hidden sm:inline">{range.to}</span>
                  <ChevronDown className="h-3.5 w-3.5 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80 p-4" align="end">
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-2">
                      <label className="text-xs font-medium text-muted-foreground">Start Date</label>
                      <Input
                        type="date"
                        value={range.from}
                        onChange={(e) => setRange((r) => ({ ...r, from: e.target.value }))}
                        className="h-9"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-medium text-muted-foreground">End Date</label>
                      <Input
                        type="date"
                        value={range.to}
                        max={new Date().toISOString().split("T")[0]}
                        onChange={(e) => setRange((r) => ({ ...r, to: e.target.value }))}
                        className="h-9"
                      />
                    </div>
                  </div>
                  <Separator />
                  <div className="grid grid-cols-2 gap-2">
                    <Button variant="outline" size="sm" onClick={() => setRange(defaultRange(7))}>
                      Last Week
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => setRange(defaultRange(30))}>
                      Last Month
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => setRange(defaultRange(90))}>
                      Last Quarter
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => setRange(defaultRange(365))}>
                      Last Year
                    </Button>
                  </div>
                </div>
              </PopoverContent>
            </Popover>

            {/* Actions */}
            <Button variant="outline" size="icon" className="h-9 w-9">
              <Download className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-9 w-9"
              onClick={() => {
                setIsLoading(true);
                fetchFinancialSummary({ range, granularity }).then((res) => {
                  setData(res);
                  setIsLoading(false);
                });
              }}
            >
              <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
            </Button>
          </div>
        </div>

        {/* Summary Stats Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="bg-linear-to-br from-primary/10 to-primary/5 border-primary/20">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-primary/70">Total Revenue</p>
                  <p className="text-xl font-bold text-primary mt-1">
                    {computedData ? formatCompact(computedData.totalRevenue) : "—"}
                  </p>
                </div>
                <div className="p-2 rounded-lg bg-primary/10">
                  <IndianRupee className="h-5 w-5 text-primary" />
                </div>
              </div>
              {computedData && (
                <div className="mt-2 flex items-center gap-2">
                  <Sparkline data={computedData.revenueTrend} color={COLORS.revenue} />
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="bg-linear-to-br from-green-500/10 to-green-500/5 border-green-500/20">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-green-700/70 dark:text-green-400/70">Net Profit</p>
                  <p className="text-xl font-bold text-green-700 dark:text-green-400 mt-1">
                    {computedData ? formatCompact(computedData.totalProfit) : "—"}
                  </p>
                </div>
                <div className="p-2 rounded-lg bg-green-500/10">
                  <TrendingUp className="h-5 w-5 text-green-600" />
                </div>
              </div>
              {computedData && (
                <div className="mt-2 flex items-center gap-2">
                  <Sparkline data={computedData.profitTrend} color={COLORS.profit} />
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="bg-linear-to-br from-amber-500/10 to-amber-500/5 border-amber-500/20">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-amber-700/70 dark:text-amber-400/70">Profit Margin</p>
                  <p className="text-xl font-bold text-amber-700 dark:text-amber-400 mt-1">
                    {computedData ? `${computedData.profitMargin.toFixed(1)}%` : "—"}
                  </p>
                </div>
                <div className="p-2 rounded-lg bg-amber-500/10">
                  <Target className="h-5 w-5 text-amber-600" />
                </div>
              </div>
              <Progress
                value={computedData?.profitMargin || 0}
                className="mt-3 h-1.5 bg-amber-200/50"
              />
            </CardContent>
          </Card>

          <Card className="bg-linear-to-br from-blue-500/10 to-blue-500/5 border-blue-500/20">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-blue-700/70 dark:text-blue-400/70">Total Orders</p>
                  <p className="text-xl font-bold text-blue-700 dark:text-blue-400 mt-1">
                    {computedData ? computedData.totalSales.toLocaleString() : "—"}
                  </p>
                </div>
                <div className="p-2 rounded-lg bg-blue-500/10">
                  <ShoppingCart className="h-5 w-5 text-blue-600" />
                </div>
              </div>
              <p className="text-xs text-muted-foreground mt-3">
                Avg: {computedData ? formatCompact(computedData.avgDailyRevenue) : "—"}/day
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="bg-muted/50 p-1">
            <TabsTrigger value="overview" className="gap-2">
              <Activity className="h-4 w-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="expenses" className="gap-2">
              <PieChartIcon className="h-4 w-4" />
              Expenses
            </TabsTrigger>
            <TabsTrigger value="details" className="gap-2">
              <Receipt className="h-4 w-4" />
              Detailed View
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-4">
            <div className="grid gap-4 lg:grid-cols-3">
              {/* Main Revenue Chart */}
              <Card className="lg:col-span-2">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-base">Revenue & Profit Trend</CardTitle>
                      <CardDescription>Track your financial performance over time</CardDescription>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {granularity === "day" ? "Daily" : granularity === "week" ? "Weekly" : "Monthly"}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <ComposedChart data={profitChartData}>
                        <defs>
                          <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor={COLORS.revenue} stopOpacity={0.3} />
                            <stop offset="100%" stopColor={COLORS.revenue} stopOpacity={0.02} />
                          </linearGradient>
                          <linearGradient id="profitGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor={COLORS.profit} stopOpacity={0.3} />
                            <stop offset="100%" stopColor={COLORS.profit} stopOpacity={0.02} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                        <XAxis
                          dataKey="date"
                          tick={{ fontSize: 11 }}
                          tickLine={false}
                          axisLine={false}
                          interval="preserveStartEnd"
                        />
                        <YAxis
                          tick={{ fontSize: 11 }}
                          tickLine={false}
                          axisLine={false}
                          tickFormatter={(v) => `${Math.round(v / 1000)}k`}
                        />
                        <Tooltip
                          content={({ active, payload }) => {
                            if (!active || !payload?.length) return null;
                            const d = payload[0].payload;
                            return (
                              <div className="bg-background border rounded-lg shadow-lg p-3 text-sm">
                                <p className="font-medium mb-2">{d.fullDate}</p>
                                <div className="space-y-1">
                                  <p className="flex justify-between gap-4">
                                    <span className="text-muted-foreground">Revenue:</span>
                                    <span className="font-medium">{formatINR(d.revenue)}</span>
                                  </p>
                                  <p className="flex justify-between gap-4">
                                    <span className="text-muted-foreground">Expenses:</span>
                                    <span className="font-medium text-red-600">{formatINR(d.expenses)}</span>
                                  </p>
                                  <p className="flex justify-between gap-4 border-t pt-1 mt-1">
                                    <span className="text-muted-foreground">Profit:</span>
                                    <span className="font-bold text-green-600">{formatINR(d.profit)}</span>
                                  </p>
                                </div>
                              </div>
                            );
                          }}
                        />
                        <Legend
                          verticalAlign="top"
                          height={36}
                          formatter={(value) => <span className="text-sm">{value}</span>}
                        />
                        <Area
                          type="monotone"
                          dataKey="revenue"
                          name="Revenue"
                          stroke={COLORS.revenue}
                          strokeWidth={2}
                          fill="url(#revenueGradient)"
                        />
                        <Line
                          type="monotone"
                          dataKey="profit"
                          name="Profit"
                          stroke={COLORS.profit}
                          strokeWidth={2.5}
                          dot={false}
                        />
                      </ComposedChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              {/* Expense Breakdown */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">Expense Distribution</CardTitle>
                  <CardDescription>Breakdown of operational costs</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-50">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={pieData}
                          cx="50%"
                          cy="50%"
                          innerRadius={50}
                          outerRadius={80}
                          paddingAngle={3}
                          dataKey="value"
                        >
                          {pieData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip
                          formatter={(value) => formatINR(Number(value))}
                          contentStyle={{
                            backgroundColor: "var(--background)",
                            border: "1px solid var(--border)",
                            borderRadius: "8px",
                          }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="mt-4 space-y-2">
                    {pieData.map((item) => (
                      <div key={item.name} className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2">
                          <div
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: item.color }}
                          />
                          <span className="text-muted-foreground">{item.name}</span>
                        </div>
                        <span className="font-medium">{formatCompact(item.value)}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* KPI Detail Cards */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <KPICard
                title="Doctor Commission"
                value={formatCompact(data?.kpis.find((k) => k.key === "doctorCommission")?.value || 0)}
                icon={Stethoscope}
                delta={data?.kpis.find((k) => k.key === "doctorCommission")?.delta}
                color={COLORS.doctor}
                subtitle="Referral payments"
              />
              <KPICard
                title="Inventory Cost"
                value={formatCompact(data?.kpis.find((k) => k.key === "inventoryCost")?.value || 0)}
                icon={Package}
                delta={data?.kpis.find((k) => k.key === "inventoryCost")?.delta}
                color={COLORS.inventory}
                subtitle="Reagents & supplies"
              />
              <KPICard
                title="Employee Cost"
                value={formatCompact(data?.kpis.find((k) => k.key === "employeeCost")?.value || 0)}
                icon={Users}
                delta={data?.kpis.find((k) => k.key === "employeeCost")?.delta}
                color={COLORS.employee}
                subtitle="Salaries & benefits"
              />
              <KPICard
                title="Miscellaneous"
                value={formatCompact(data?.kpis.find((k) => k.key === "miscCost")?.value || 0)}
                icon={Coins}
                delta={data?.kpis.find((k) => k.key === "miscCost")?.delta}
                color={COLORS.misc}
                subtitle="Other expenses"
              />
            </div>
          </TabsContent>

          {/* Expenses Tab */}
          <TabsContent value="expenses" className="space-y-4">
            <div className="grid gap-4 lg:grid-cols-2">
              {/* Expense Bar Chart */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Expense Comparison</CardTitle>
                  <CardDescription>Category-wise expense analysis</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-75">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={pieData.map((d) => ({ name: d.name, amount: d.value, fill: d.color }))}
                        layout="vertical"
                      >
                        <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
                        <XAxis type="number" tickFormatter={(v) => formatCompact(v)} tick={{ fontSize: 11 }} />
                        <YAxis type="category" dataKey="name" tick={{ fontSize: 11 }} width={100} />
                        <Tooltip formatter={(v) => formatINR(Number(v))} />
                        <Bar dataKey="amount" radius={[0, 4, 4, 0]}>
                          {pieData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              {/* Expense Trend */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Expense Trend Over Time</CardTitle>
                  <CardDescription>Daily expense fluctuation</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-75">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={profitChartData}>
                        <defs>
                          <linearGradient id="expenseGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor={COLORS.expenses} stopOpacity={0.3} />
                            <stop offset="100%" stopColor={COLORS.expenses} stopOpacity={0.02} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        <XAxis dataKey="date" tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
                        <YAxis tick={{ fontSize: 11 }} tickLine={false} axisLine={false} tickFormatter={(v) => `${Math.round(v / 1000)}k`} />
                        <Tooltip formatter={(v) => formatINR(Number(v))} />
                        <Area
                          type="monotone"
                          dataKey="expenses"
                          name="Expenses"
                          stroke={COLORS.expenses}
                          strokeWidth={2}
                          fill="url(#expenseGradient)"
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Expense Details */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-base">Expense Breakdown Details</CardTitle>
                    <CardDescription>Detailed view of all expense categories</CardDescription>
                  </div>
                  <Badge variant="secondary">
                    Total: {formatINR(computedData?.totalExpenses || 0)}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { name: "Doctor Commission", key: "doctorCommission", icon: Stethoscope, color: COLORS.doctor },
                    { name: "Inventory Cost", key: "inventoryCost", icon: Package, color: COLORS.inventory },
                    { name: "Employee Cost", key: "employeeCost", icon: Users, color: COLORS.employee },
                    { name: "Miscellaneous", key: "miscCost", icon: Coins, color: COLORS.misc },
                  ].map((expense) => {
                    const value = data?.kpis.find((k) => k.key === expense.key)?.value || 0;
                    const percent = computedData?.totalExpenses ? (value / computedData.totalExpenses) * 100 : 0;
                    return (
                      <div key={expense.key} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg" style={{ backgroundColor: `${expense.color}15` }}>
                              <expense.icon className="h-4 w-4" style={{ color: expense.color }} />
                            </div>
                            <div>
                              <p className="font-medium text-sm">{expense.name}</p>
                              <p className="text-xs text-muted-foreground">{percent.toFixed(1)}% of total</p>
                            </div>
                          </div>
                          <p className="font-semibold">{formatINR(value)}</p>
                        </div>
                        <Progress value={percent} className="h-2" />
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Details Tab */}
          <TabsContent value="details" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <CardTitle className="text-base">Transaction Details</CardTitle>
                    <CardDescription>
                      {granularity === "day" ? "Day" : granularity === "week" ? "Week" : "Month"}-wise financial breakdown
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" className="gap-2">
                      <Download className="h-4 w-4" />
                      Export CSV
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="rounded-lg border overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="bg-muted/50 border-b">
                          <th className="text-left font-semibold h-11 px-4">Date</th>
                          <th className="text-right font-semibold h-11 px-4">Revenue</th>
                          <th className="text-right font-semibold h-11 px-4">Orders</th>
                          <th className="text-right font-semibold h-11 px-4 hidden md:table-cell">Doctor</th>
                          <th className="text-right font-semibold h-11 px-4 hidden md:table-cell">Inventory</th>
                          <th className="text-right font-semibold h-11 px-4 hidden lg:table-cell">Employee</th>
                          <th className="text-right font-semibold h-11 px-4 hidden lg:table-cell">Misc</th>
                          <th className="text-right font-semibold h-11 px-4">Profit</th>
                        </tr>
                      </thead>
                      <tbody>
                        {(data?.series || []).map((p, i) => {
                          const expenses = p.doctorCommission + p.inventoryCost + p.employeeCost + p.miscCost;
                          const profit = p.revenue - expenses;
                          const isPositive = profit > 0;
                          return (
                            <motion.tr
                              key={p.date}
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: i * 0.02 }}
                              className="border-b hover:bg-muted/30 transition-colors"
                            >
                              <td className="px-4 py-3 font-medium">{p.date}</td>
                              <td className="px-4 py-3 text-right font-medium text-primary">
                                {formatINR(p.revenue)}
                              </td>
                              <td className="px-4 py-3 text-right">
                                <Badge variant="secondary" className="font-normal">
                                  {p.sales}
                                </Badge>
                              </td>
                              <td className="px-4 py-3 text-right hidden md:table-cell text-muted-foreground">
                                {formatINR(p.doctorCommission)}
                              </td>
                              <td className="px-4 py-3 text-right hidden md:table-cell text-muted-foreground">
                                {formatINR(p.inventoryCost)}
                              </td>
                              <td className="px-4 py-3 text-right hidden lg:table-cell text-muted-foreground">
                                {formatINR(p.employeeCost)}
                              </td>
                              <td className="px-4 py-3 text-right hidden lg:table-cell text-muted-foreground">
                                {formatINR(p.miscCost)}
                              </td>
                              <td className="px-4 py-3 text-right">
                                <span
                                  className={`font-semibold ${
                                    isPositive ? "text-green-600" : "text-red-600"
                                  }`}
                                >
                                  {formatINR(profit)}
                                </span>
                              </td>
                            </motion.tr>
                          );
                        })}
                      </tbody>
                      <tfoot>
                        <tr className="bg-muted/30 border-t-2">
                          <td className="px-4 py-3 font-bold">Total</td>
                          <td className="px-4 py-3 text-right font-bold text-primary">
                            {formatINR(computedData?.totalRevenue || 0)}
                          </td>
                          <td className="px-4 py-3 text-right font-bold">
                            {computedData?.totalSales.toLocaleString()}
                          </td>
                          <td className="px-4 py-3 text-right font-bold hidden md:table-cell">
                            {formatINR(data?.kpis.find((k) => k.key === "doctorCommission")?.value || 0)}
                          </td>
                          <td className="px-4 py-3 text-right font-bold hidden md:table-cell">
                            {formatINR(data?.kpis.find((k) => k.key === "inventoryCost")?.value || 0)}
                          </td>
                          <td className="px-4 py-3 text-right font-bold hidden lg:table-cell">
                            {formatINR(data?.kpis.find((k) => k.key === "employeeCost")?.value || 0)}
                          </td>
                          <td className="px-4 py-3 text-right font-bold hidden lg:table-cell">
                            {formatINR(data?.kpis.find((k) => k.key === "miscCost")?.value || 0)}
                          </td>
                          <td className="px-4 py-3 text-right font-bold text-green-600">
                            {formatINR(computedData?.totalProfit || 0)}
                          </td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Footer Stats */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card className="bg-linear-to-r from-primary/5 to-transparent">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="p-3 rounded-xl bg-primary/10">
                <Zap className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Best Performing Day</p>
                <p className="font-semibold">{computedData?.bestDay?.date || "—"}</p>
                <p className="text-xs text-primary">
                  {computedData?.bestDay ? formatINR(computedData.bestDay.revenue) : "—"}
                </p>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-linear-to-r from-green-500/5 to-transparent">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="p-3 rounded-xl bg-green-500/10">
                <Calculator className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Average Daily Revenue</p>
                <p className="font-semibold">
                  {computedData ? formatINR(Math.round(computedData.avgDailyRevenue)) : "—"}
                </p>
                <p className="text-xs text-green-600">{data?.series.length || 0} days tracked</p>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-linear-to-r from-amber-500/5 to-transparent">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="p-3 rounded-xl bg-amber-500/10">
                <CircleDollarSign className="h-5 w-5 text-amber-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Revenue per Order</p>
                <p className="font-semibold">
                  {computedData && computedData.totalSales > 0
                    ? formatINR(Math.round(computedData.totalRevenue / computedData.totalSales))
                    : "—"}
                </p>
                <p className="text-xs text-amber-600">Avg ticket size</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
