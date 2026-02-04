/**
 * Inventory Dashboard Page
 * 
 * Main dashboard for inventory management showing overview,
 * stock levels, alerts, and quick actions.
 */

"use client";

import React, { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  Package,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  DollarSign,
  BoxIcon,
  ArrowRight,
  BarChart3,
  RefreshCw,
  Plus,
  Settings,
  ChevronRight,
  Layers,
  Archive,
  AlertCircle,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import type { InventoryItem, InventoryStats, LowStockAlert, StockTransaction } from "./inventory.types";
import {
  fetchInventoryItems,
  fetchInventoryStats,
  fetchLowStockAlerts,
  fetchStockTransactions,
} from "./inventory.data";
import {
  formatINR,
  getStockStatus,
  stockStatusColors,
  LowStockAlertCard,
} from "./inventory.components";

export default function InventoryDashboardPage() {
  const [stats, setStats] = useState<InventoryStats | null>(null);
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [alerts, setAlerts] = useState<LowStockAlert[]>([]);
  const [recentTransactions, setRecentTransactions] = useState<StockTransaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState("today");

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [statsData, itemsData, alertsData, transactionsData] = await Promise.all([
        fetchInventoryStats(),
        fetchInventoryItems(),
        fetchLowStockAlerts(),
        fetchStockTransactions(),
      ]);
      setStats(statsData);
      setItems(itemsData);
      setAlerts(alertsData);
      setRecentTransactions(transactionsData.slice(0, 5));
    } catch (error) {
      console.error("Error loading dashboard data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Calculate stock distribution
  const stockDistribution = useMemo(() => {
    const inStock = items.filter(i => i.quantityInHand > i.reorderPoint).length;
    const lowStock = items.filter(i => i.quantityInHand <= i.reorderPoint && i.quantityInHand > 0).length;
    const outOfStock = items.filter(i => i.quantityInHand === 0).length;
    const total = items.length || 1;
    
    return {
      inStock,
      lowStock,
      outOfStock,
      inStockPercent: Math.round((inStock / total) * 100),
      lowStockPercent: Math.round((lowStock / total) * 100),
      outOfStockPercent: Math.round((outOfStock / total) * 100),
    };
  }, [items]);

  // Get items by category for chart
  const categoryDistribution = useMemo(() => {
    const distribution: Record<string, number> = {};
    items.forEach(item => {
      distribution[item.categoryName] = (distribution[item.categoryName] || 0) + 1;
    });
    return Object.entries(distribution).map(([name, count]) => ({ name, count }));
  }, [items]);

  // Top low stock items
  const topLowStockItems = useMemo(() => {
    return items
      .filter(i => i.quantityInHand <= i.reorderPoint && i.status === "Active")
      .sort((a, b) => (a.quantityInHand / a.reorderPoint) - (b.quantityInHand / b.reorderPoint))
      .slice(0, 5);
  }, [items]);

  // High value items
  const highValueItems = useMemo(() => {
    return [...items]
      .sort((a, b) => (b.quantityInHand * b.costPrice) - (a.quantityInHand * a.costPrice))
      .slice(0, 5);
  }, [items]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 p-6">
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-32" />
            ))}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Skeleton className="h-80" />
            <Skeleton className="h-80" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
      <div className="p-6 space-y-6 max-w-full mx-auto">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-400 bg-clip-text text-transparent">
              Inventory Dashboard
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Overview of your inventory and stock levels
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
            <Button variant="outline" size="icon" onClick={loadData}>
              <RefreshCw className="h-4 w-4" />
            </Button>
            <Link href="/tenant-panel/inventory/add-item">
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Item
              </Button>
            </Link>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <Card className="relative overflow-hidden border-0 shadow-lg bg-gradient-to-br from-blue-500 to-blue-600">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-blue-100">Total Items</p>
                    <p className="text-3xl font-bold text-white mt-1">{stats?.totalItems || 0}</p>
                    <p className="text-xs text-blue-200 mt-1">{stats?.activeItems || 0} active</p>
                  </div>
                  <div className="p-3 bg-white/20 rounded-full">
                    <Package className="h-6 w-6 text-white" />
                  </div>
                </div>
                <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-white/10 rounded-full" />
              </CardContent>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
            <Card className="relative overflow-hidden border-0 shadow-lg bg-gradient-to-br from-green-500 to-emerald-600">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-green-100">Total Value</p>
                    <p className="text-3xl font-bold text-white mt-1">{formatINR(stats?.totalValue || 0)}</p>
                    <p className="text-xs text-green-200 mt-1">Based on cost price</p>
                  </div>
                  <div className="p-3 bg-white/20 rounded-full">
                    <DollarSign className="h-6 w-6 text-white" />
                  </div>
                </div>
                <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-white/10 rounded-full" />
              </CardContent>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <Card className="relative overflow-hidden border-0 shadow-lg bg-gradient-to-br from-amber-500 to-orange-500">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-amber-100">Low Stock Items</p>
                    <p className="text-3xl font-bold text-white mt-1">{stats?.lowStockItems || 0}</p>
                    <p className="text-xs text-amber-200 mt-1">{stats?.outOfStockItems || 0} out of stock</p>
                  </div>
                  <div className="p-3 bg-white/20 rounded-full">
                    <AlertTriangle className="h-6 w-6 text-white" />
                  </div>
                </div>
                <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-white/10 rounded-full" />
              </CardContent>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
            <Card className="relative overflow-hidden border-0 shadow-lg bg-gradient-to-br from-purple-500 to-purple-600">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-purple-100">Active Alerts</p>
                    <p className="text-3xl font-bold text-white mt-1">
                      {(stats?.criticalAlerts || 0) + (stats?.warningAlerts || 0)}
                    </p>
                    <p className="text-xs text-purple-200 mt-1">{stats?.criticalAlerts || 0} critical</p>
                  </div>
                  <div className="p-3 bg-white/20 rounded-full">
                    <AlertCircle className="h-6 w-6 text-white" />
                  </div>
                </div>
                <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-white/10 rounded-full" />
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Stock Distribution & Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Stock Distribution */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            <Card className="h-full">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Stock Distribution
                </CardTitle>
                <CardDescription>Current stock status overview</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-green-500 rounded-full" />
                      <span className="text-sm">In Stock</span>
                    </div>
                    <span className="font-medium">{stockDistribution.inStock}</span>
                  </div>
                  <Progress value={stockDistribution.inStockPercent} className="h-2 bg-green-100" />
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-amber-500 rounded-full" />
                      <span className="text-sm">Low Stock</span>
                    </div>
                    <span className="font-medium">{stockDistribution.lowStock}</span>
                  </div>
                  <Progress value={stockDistribution.lowStockPercent} className="h-2 bg-amber-100" />
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-red-500 rounded-full" />
                      <span className="text-sm">Out of Stock</span>
                    </div>
                    <span className="font-medium">{stockDistribution.outOfStock}</span>
                  </div>
                  <Progress value={stockDistribution.outOfStockPercent} className="h-2 bg-red-100" />
                </div>

                <div className="pt-4 border-t">
                  <Link href="/tenant-panel/inventory/stock-management">
                    <Button variant="outline" className="w-full">
                      View Stock Management
                      <ChevronRight className="h-4 w-4 ml-2" />
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Quick Actions */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}>
            <Card className="h-full">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  Quick Actions
                </CardTitle>
                <CardDescription>Common inventory operations</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Link href="/tenant-panel/inventory/add-item">
                  <Button variant="outline" className="w-full justify-start">
                    <Plus className="h-4 w-4 mr-2" />
                    Add New Item
                  </Button>
                </Link>
                <Link href="/tenant-panel/inventory/all-items">
                  <Button variant="outline" className="w-full justify-start">
                    <Package className="h-4 w-4 mr-2" />
                    View All Items
                  </Button>
                </Link>
                <Link href="/tenant-panel/inventory/stock-management">
                  <Button variant="outline" className="w-full justify-start">
                    <BoxIcon className="h-4 w-4 mr-2" />
                    Stock Adjustment
                  </Button>
                </Link>
                <Link href="/tenant-panel/inventory/categories">
                  <Button variant="outline" className="w-full justify-start">
                    <Layers className="h-4 w-4 mr-2" />
                    Manage Categories
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </motion.div>

          {/* Category Distribution */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
            <Card className="h-full">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Layers className="h-5 w-5" />
                  Items by Category
                </CardTitle>
                <CardDescription>Distribution across categories</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {categoryDistribution.slice(0, 5).map((cat) => (
                    <div key={cat.name} className="flex items-center justify-between">
                      <span className="text-sm truncate flex-1">{cat.name}</span>
                      <Badge variant="secondary">{cat.count}</Badge>
                    </div>
                  ))}
                </div>
                <div className="pt-4 border-t mt-4">
                  <Link href="/tenant-panel/inventory/categories">
                    <Button variant="outline" className="w-full">
                      Manage Categories
                      <ChevronRight className="h-4 w-4 ml-2" />
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Low Stock Alerts & Recent Transactions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Low Stock Alerts */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }}>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5 text-amber-500" />
                    Low Stock Alerts
                  </CardTitle>
                  <CardDescription>Items that need attention</CardDescription>
                </div>
                <Link href="/tenant-panel/inventory/stock-management">
                  <Button variant="ghost" size="sm">
                    View All
                    <ArrowRight className="h-4 w-4 ml-1" />
                  </Button>
                </Link>
              </CardHeader>
              <CardContent>
                {alerts.length > 0 ? (
                  <div className="space-y-3">
                    {alerts.slice(0, 4).map((alert) => (
                      <LowStockAlertCard key={alert.id} alert={alert} />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <CheckCircle2 className="h-12 w-12 mx-auto mb-3 text-green-500" />
                    <p>All items are well stocked!</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* Recent Transactions */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Archive className="h-5 w-5" />
                    Recent Transactions
                  </CardTitle>
                  <CardDescription>Latest stock movements</CardDescription>
                </div>
                <Link href="/tenant-panel/inventory/stock-management">
                  <Button variant="ghost" size="sm">
                    View All
                    <ArrowRight className="h-4 w-4 ml-1" />
                  </Button>
                </Link>
              </CardHeader>
              <CardContent>
                {recentTransactions.length > 0 ? (
                  <div className="space-y-3">
                    {recentTransactions.map((txn) => (
                      <div
                        key={txn.id}
                        className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-full ${
                            txn.transactionType === "Purchase" ? "bg-green-100" :
                            txn.transactionType === "Usage" ? "bg-blue-100" :
                            "bg-amber-100"
                          }`}>
                            {txn.transactionType === "Purchase" ? (
                              <TrendingUp className={`h-4 w-4 ${
                                txn.transactionType === "Purchase" ? "text-green-600" : ""
                              }`} />
                            ) : txn.transactionType === "Usage" ? (
                              <TrendingDown className="h-4 w-4 text-blue-600" />
                            ) : (
                              <Archive className="h-4 w-4 text-amber-600" />
                            )}
                          </div>
                          <div>
                            <p className="font-medium text-sm">{txn.itemName}</p>
                            <p className="text-xs text-muted-foreground">{txn.transactionType}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className={`font-semibold ${
                            txn.transactionType === "Purchase" ? "text-green-600" : "text-red-600"
                          }`}>
                            {txn.transactionType === "Purchase" ? "+" : "-"}{txn.quantity}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(txn.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <Archive className="h-12 w-12 mx-auto mb-3 opacity-50" />
                    <p>No recent transactions</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* High Value Items & Top Low Stock */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* High Value Items */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.55 }}>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5 text-green-500" />
                  Highest Value Items
                </CardTitle>
                <CardDescription>Items with highest stock value</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {highValueItems.map((item, idx) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between p-3 border rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-100 to-emerald-100 flex items-center justify-center font-semibold text-green-700">
                          {idx + 1}
                        </div>
                        <div>
                          <p className="font-medium text-sm">{item.itemName}</p>
                          <p className="text-xs text-muted-foreground">{item.itemCode}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-green-600">
                          {formatINR(item.quantityInHand * item.costPrice)}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {item.quantityInHand} {item.unitType}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Critical Low Stock Items */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <XCircle className="h-5 w-5 text-red-500" />
                  Critical Stock Items
                </CardTitle>
                <CardDescription>Items that need immediate reorder</CardDescription>
              </CardHeader>
              <CardContent>
                {topLowStockItems.length > 0 ? (
                  <div className="space-y-3">
                    {topLowStockItems.map((item) => {
                      const stockPercent = (item.quantityInHand / item.reorderPoint) * 100;
                      return (
                        <div
                          key={item.id}
                          className="p-3 border rounded-lg"
                        >
                          <div className="flex items-center justify-between mb-2">
                            <div>
                              <p className="font-medium text-sm">{item.itemName}</p>
                              <p className="text-xs text-muted-foreground">{item.itemCode}</p>
                            </div>
                            <Badge className={stockStatusColors[getStockStatus(item)]}>
                              {getStockStatus(item)}
                            </Badge>
                          </div>
                          <div className="space-y-1">
                            <div className="flex justify-between text-xs">
                              <span>Current: {item.quantityInHand}</span>
                              <span>Reorder Point: {item.reorderPoint}</span>
                            </div>
                            <Progress 
                              value={Math.min(stockPercent, 100)} 
                              className={`h-2 ${
                                item.quantityInHand === 0 ? "bg-red-100" : "bg-amber-100"
                              }`}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <CheckCircle2 className="h-12 w-12 mx-auto mb-3 text-green-500" />
                    <p>No critical stock items!</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
