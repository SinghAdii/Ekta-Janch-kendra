"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  ShoppingCart,
  Home,
  Globe,
  Package,
  Clock,
  Users,
  Download,
  RefreshCw,
  ChevronRight,
  MoreVertical,
  Eye,
  Edit2,
  CheckCircle2,
  AlertCircle,
  Truck,
  FlaskConical,
  FileText,
  IndianRupee,
  ArrowUpRight,
  BarChart3,
  PieChart as PieChartIcon,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
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
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

import type { Order, OrderStats } from "./orders.types";
import {
  fetchOrders,
  fetchOrderStats,
  getOrdersBySourceChartData,
  getOrdersByStatusChartData,
  getDailyOrdersChartData,
} from "./orders.data";

const PIE_COLORS = ["#8b5cf6", "#3b82f6", "#10b981", "#f59e0b", "#ec4899"];

const statusColors: Record<string, string> = {
  Pending: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  "Sample Collected": "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
  Processing: "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400",
  "Report Ready": "bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-400",
  Completed: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  Cancelled: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
};

const sourceIcons: Record<string, React.ReactNode> = {
  "Home Collection": <Home className="h-4 w-4" />,
  "Online Test Booking": <Globe className="h-4 w-4" />,
  "Online Package Booking": <Package className="h-4 w-4" />,
  "Slot Booking": <Clock className="h-4 w-4" />,
  "Walk-in": <Users className="h-4 w-4" />,
};

function formatINR(amount: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

export default function OrdersDashboardPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [stats, setStats] = useState<OrderStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState("today");

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [ordersData, statsData] = await Promise.all([
        fetchOrders(),
        fetchOrderStats(),
      ]);
      setOrders(ordersData);
      setStats(statsData);
    } catch (error) {
      console.error("Error loading data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const sourceChartData = getOrdersBySourceChartData(orders);
  const statusChartData = getOrdersByStatusChartData(orders);
  const dailyChartData = getDailyOrdersChartData(orders, 7);

  const recentOrders = orders.slice(0, 8);

  // Calculate source-wise stats
  const sourceStats = [
    {
      source: "Home Collection",
      icon: <Home className="h-5 w-5" />,
      count: orders.filter((o) => o.source === "Home Collection").length,
      revenue: orders.filter((o) => o.source === "Home Collection").reduce((s, o) => s + o.totalAmount, 0),
      color: "bg-purple-500",
      bgColor: "bg-purple-100 dark:bg-purple-900/30",
      textColor: "text-purple-600 dark:text-purple-400",
    },
    {
      source: "Online Tests",
      icon: <Globe className="h-5 w-5" />,
      count: orders.filter((o) => o.source === "Online Test Booking").length,
      revenue: orders.filter((o) => o.source === "Online Test Booking").reduce((s, o) => s + o.totalAmount, 0),
      color: "bg-blue-500",
      bgColor: "bg-blue-100 dark:bg-blue-900/30",
      textColor: "text-blue-600 dark:text-blue-400",
    },
    {
      source: "Online Packages",
      icon: <Package className="h-5 w-5" />,
      count: orders.filter((o) => o.source === "Online Package Booking").length,
      revenue: orders.filter((o) => o.source === "Online Package Booking").reduce((s, o) => s + o.totalAmount, 0),
      color: "bg-emerald-500",
      bgColor: "bg-emerald-100 dark:bg-emerald-900/30",
      textColor: "text-emerald-600 dark:text-emerald-400",
    },
    {
      source: "Slot Booking",
      icon: <Clock className="h-5 w-5" />,
      count: orders.filter((o) => o.source === "Slot Booking").length,
      revenue: orders.filter((o) => o.source === "Slot Booking").reduce((s, o) => s + o.totalAmount, 0),
      color: "bg-amber-500",
      bgColor: "bg-amber-100 dark:bg-amber-900/30",
      textColor: "text-amber-600 dark:text-amber-400",
    },
    {
      source: "Walk-in",
      icon: <Users className="h-5 w-5" />,
      count: orders.filter((o) => o.source === "Walk-in").length,
      revenue: orders.filter((o) => o.source === "Walk-in").reduce((s, o) => s + o.totalAmount, 0),
      color: "bg-pink-500",
      bgColor: "bg-pink-100 dark:bg-pink-900/30",
      textColor: "text-pink-600 dark:text-pink-400",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
      <div className="p-6 space-y-6 max-w-full mx-auto">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-400 bg-clip-text text-transparent">
              Orders Dashboard
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Real-time overview of all orders and bookings
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
              <SelectTrigger className="w-[140px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="today">Today</SelectItem>
                <SelectItem value="week">This Week</SelectItem>
                <SelectItem value="month">This Month</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" size="sm" onClick={loadData}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </div>

        {/* Main Stats Row */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <Card className="relative overflow-hidden border-0 shadow-lg bg-gradient-to-br from-blue-500 to-blue-600">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-blue-100">Total Orders</p>
                    <p className="text-3xl font-bold text-white mt-1">{stats?.totalOrders || 0}</p>
                    <p className="text-xs text-blue-200 mt-1">All time orders</p>
                  </div>
                  <div className="p-3 bg-white/20 rounded-full">
                    <ShoppingCart className="h-6 w-6 text-white" />
                  </div>
                </div>
                <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-white/10 rounded-full" />
              </CardContent>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
            <Card className="relative overflow-hidden border-0 shadow-lg bg-gradient-to-br from-amber-500 to-orange-500">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-amber-100">Pending Orders</p>
                    <p className="text-3xl font-bold text-white mt-1">{stats?.pendingOrders || 0}</p>
                    <p className="text-xs text-amber-200 mt-1">Awaiting action</p>
                  </div>
                  <div className="p-3 bg-white/20 rounded-full">
                    <AlertCircle className="h-6 w-6 text-white" />
                  </div>
                </div>
                <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-white/10 rounded-full" />
              </CardContent>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <Card className="relative overflow-hidden border-0 shadow-lg bg-gradient-to-br from-emerald-500 to-green-600">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-emerald-100">{"Today's Revenue"}</p>
                    <p className="text-3xl font-bold text-white mt-1">{formatINR(stats?.revenueToday || 0)}</p>
                    <p className="text-xs text-emerald-200 mt-1 flex items-center gap-1">
                      <ArrowUpRight className="h-3 w-3" /> +12% from yesterday
                    </p>
                  </div>
                  <div className="p-3 bg-white/20 rounded-full">
                    <IndianRupee className="h-6 w-6 text-white" />
                  </div>
                </div>
                <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-white/10 rounded-full" />
              </CardContent>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
            <Card className="relative overflow-hidden border-0 shadow-lg bg-gradient-to-br from-purple-500 to-violet-600">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-purple-100">Processing</p>
                    <p className="text-3xl font-bold text-white mt-1">{stats?.processingOrders || 0}</p>
                    <p className="text-xs text-purple-200 mt-1">In lab currently</p>
                  </div>
                  <div className="p-3 bg-white/20 rounded-full">
                    <FlaskConical className="h-6 w-6 text-white" />
                  </div>
                </div>
                <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-white/10 rounded-full" />
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Order Source Cards */}
        <div>
          <h2 className="text-lg font-semibold mb-4">Orders by Source</h2>
          <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-5">
            {sourceStats.map((source, index) => (
              <motion.div
                key={source.source}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
              >
                <Card className="hover:shadow-lg transition-shadow cursor-pointer group">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div className={`p-2.5 rounded-xl ${source.bgColor}`}>
                        <span className={source.textColor}>{source.icon}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-muted-foreground truncate">{source.source}</p>
                        <p className="text-xl font-bold">{source.count}</p>
                      </div>
                      <ChevronRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                    <div className="mt-3 pt-3 border-t">
                      <p className="text-xs text-muted-foreground">Revenue</p>
                      <p className="text-sm font-semibold">{formatINR(source.revenue)}</p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Charts Row */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Daily Orders Trend */}
          <Card className="shadow-lg">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-base font-semibold">Orders Trend</CardTitle>
                  <CardDescription>Last 7 days performance</CardDescription>
                </div>
                <BarChart3 className="h-5 w-5 text-muted-foreground" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="h-[280px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={dailyChartData}>
                    <defs>
                      <linearGradient id="colorOrders" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "white",
                        border: "1px solid #e5e7eb",
                        borderRadius: "8px",
                        boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1)",
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="orders"
                      stroke="#3b82f6"
                      strokeWidth={2}
                      fillOpacity={1}
                      fill="url(#colorOrders)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Orders by Source Pie Chart */}
          <Card className="shadow-lg">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-base font-semibold">Source Distribution</CardTitle>
                  <CardDescription>Orders by booking channel</CardDescription>
                </div>
                <PieChartIcon className="h-5 w-5 text-muted-foreground" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="h-[280px] flex items-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={sourceChartData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={2}
                      dataKey="value"
                    >
                      {sourceChartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value: number, name: string) => [`${value} orders`, name]}
                      contentStyle={{
                        backgroundColor: "white",
                        border: "1px solid #e5e7eb",
                        borderRadius: "8px",
                      }}
                    />
                    <Legend
                      verticalAlign="middle"
                      align="right"
                      layout="vertical"
                      iconType="circle"
                      iconSize={8}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions & Alerts */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Home Collection Alert */}
          <Card className="border-l-4 border-l-purple-500 shadow-md">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-purple-100 rounded-lg dark:bg-purple-900/30">
                  <Truck className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-sm">Home Collections</h3>
                  <p className="text-2xl font-bold mt-1">{stats?.homeCollectionPending || 0}</p>
                  <p className="text-xs text-muted-foreground">Pending pickups</p>
                </div>
                <Button size="sm" variant="ghost" className="text-purple-600">
                  View <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Slot Bookings Alert */}
          <Card className="border-l-4 border-l-amber-500 shadow-md">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-amber-100 rounded-lg dark:bg-amber-900/30">
                  <Clock className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-sm">Slot Bookings</h3>
                  <p className="text-2xl font-bold mt-1">{stats?.slotBookingsPending || 0}</p>
                  <p className="text-xs text-muted-foreground">Incomplete details</p>
                </div>
                <Button size="sm" variant="ghost" className="text-amber-600">
                  View <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Completed Today */}
          <Card className="border-l-4 border-l-green-500 shadow-md">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-green-100 rounded-lg dark:bg-green-900/30">
                  <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-sm">Completed Today</h3>
                  <p className="text-2xl font-bold mt-1">{stats?.completedToday || 0}</p>
                  <p className="text-xs text-muted-foreground">Reports delivered</p>
                </div>
                <Button size="sm" variant="ghost" className="text-green-600">
                  View <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Status Progress */}
        <Card className="shadow-lg">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold">Order Status Overview</CardTitle>
            <CardDescription>Current status distribution of all orders</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {statusChartData.map((status) => {
                const percentage = Math.round((status.value / orders.length) * 100);
                return (
                  <div key={status.name} className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <Badge className={statusColors[status.name]}>{status.name}</Badge>
                      </div>
                      <span className="font-medium">
                        {status.value} ({percentage}%)
                      </span>
                    </div>
                    <Progress value={percentage} className="h-2" />
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Recent Orders Table */}
        <Card className="shadow-lg overflow-hidden">
          <CardHeader className="border-b bg-muted/30">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-base font-semibold">Recent Orders</CardTitle>
                <CardDescription>Latest bookings and their status</CardDescription>
              </div>
              <Button variant="outline" size="sm">
                View All Orders <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          </CardHeader>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted/50 text-muted-foreground font-medium">
                <tr>
                  <th className="px-4 py-3 text-left">Order #</th>
                  <th className="px-4 py-3 text-left">Patient</th>
                  <th className="px-4 py-3 text-left">Source</th>
                  <th className="px-4 py-3 text-left">Tests/Packages</th>
                  <th className="px-4 py-3 text-right">Amount</th>
                  <th className="px-4 py-3 text-center">Status</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {isLoading ? (
                  <tr>
                    <td colSpan={7} className="px-4 py-8 text-center text-muted-foreground">
                      Loading orders...
                    </td>
                  </tr>
                ) : (
                  recentOrders.map((order, i) => (
                    <motion.tr
                      key={order.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.03 }}
                      className="hover:bg-muted/50 transition-colors"
                    >
                      <td className="px-4 py-3">
                        <span className="font-medium text-primary">{order.orderNumber}</span>
                        <p className="text-xs text-muted-foreground">
                          {new Date(order.createdAt).toLocaleDateString("en-IN")}
                        </p>
                      </td>
                      <td className="px-4 py-3">
                        <p className="font-medium">{order.patient.name}</p>
                        <p className="text-xs text-muted-foreground">{order.patient.mobile}</p>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          {sourceIcons[order.source]}
                          <span className="text-xs">{order.source}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <p className="text-xs">
                          {order.tests.length > 0 && `${order.tests.length} Test(s)`}
                          {order.tests.length > 0 && order.packages.length > 0 && ", "}
                          {order.packages.length > 0 && `${order.packages.length} Package(s)`}
                          {order.tests.length === 0 && order.packages.length === 0 && (
                            <span className="text-muted-foreground italic">Not selected</span>
                          )}
                        </p>
                      </td>
                      <td className="px-4 py-3 text-right font-medium">
                        {order.totalAmount > 0 ? formatINR(order.totalAmount) : "-"}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <Badge className={statusColors[order.status]}>{order.status}</Badge>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                              <Eye className="mr-2 h-4 w-4" /> View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Edit2 className="mr-2 h-4 w-4" /> Edit Order
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <FileText className="mr-2 h-4 w-4" /> Generate Invoice
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </motion.tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  );
}
