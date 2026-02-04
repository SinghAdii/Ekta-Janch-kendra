/**
 * Stock Management Page
 * 
 * Page for managing stock levels, adjustments, low stock alerts,
 * and reorder requests.
 */

"use client";

import React, { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import {
  Package,
  PackageMinus,
  PackagePlus,
  AlertTriangle,
  TrendingDown,
  TrendingUp,
  RefreshCw,
  Search,
  Clock,
  CheckCircle,
  XCircle,
  Truck,
  MoreVertical,
  History,
  Bell,
  ShoppingCart,
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";

import type { 
  InventoryItem, 
  StockTransaction, 
  LowStockAlert, 
  ReorderRequest,
  TransactionType,
} from "./inventory.types";
import { 
  fetchInventoryItems, 
  fetchStockTransactions, 
  fetchLowStockAlerts,
  fetchReorderRequests,
  updateStockQuantity,
  createReorderRequest,
  dismissStockAlert,
  updateReorderStatus,
  cancelReorderRequest,
} from "./inventory.data";
import { formatINR, stockStatusColors } from "./inventory.components";

type TabValue = "adjustments" | "low-stock" | "reorder" | "history";
type TransactionFilter = "All" | TransactionType;
type ReorderStatusFilter = "All" | ReorderRequest["status"];

const transactionTypeColors: Record<TransactionType, string> = {
  "Purchase": "bg-green-100 text-green-800 border-green-200",
  "Usage": "bg-blue-100 text-blue-800 border-blue-200",
  "Adjustment": "bg-yellow-100 text-yellow-800 border-yellow-200",
  "Return": "bg-purple-100 text-purple-800 border-purple-200",
  "Damaged": "bg-red-100 text-red-800 border-red-200",
  "Expiry": "bg-orange-100 text-orange-800 border-orange-200",
  "Donation": "bg-cyan-100 text-cyan-800 border-cyan-200",
};

const transactionTypeIcons: Record<TransactionType, React.ReactNode> = {
  "Purchase": <PackagePlus className="h-4 w-4 text-green-600" />,
  "Usage": <TrendingDown className="h-4 w-4 text-blue-600" />,
  "Adjustment": <RefreshCw className="h-4 w-4 text-yellow-600" />,
  "Return": <TrendingUp className="h-4 w-4 text-purple-600" />,
  "Damaged": <XCircle className="h-4 w-4 text-red-600" />,
  "Expiry": <Clock className="h-4 w-4 text-orange-600" />,
  "Donation": <Truck className="h-4 w-4 text-cyan-600" />,
};

// Helper function to get stock status
function getItemStockStatus(item: InventoryItem): { label: string; color: string } {
  if (item.quantityInHand === 0) {
    return { label: "Out of Stock", color: stockStatusColors["Out of Stock"] };
  }
  if (item.quantityInHand <= item.reorderPoint) {
    return { label: "Low Stock", color: stockStatusColors["Low Stock"] };
  }
  return { label: "In Stock", color: stockStatusColors["In Stock"] };
}

export default function StockManagementPage() {
  const [activeTab, setActiveTab] = useState<TabValue>("adjustments");
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [transactions, setTransactions] = useState<StockTransaction[]>([]);
  const [lowStockAlerts, setLowStockAlerts] = useState<LowStockAlert[]>([]);
  const [reorderRequests, setReorderRequests] = useState<ReorderRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [transactionFilter, setTransactionFilter] = useState<TransactionFilter>("All");
  const [reorderStatusFilter, setReorderStatusFilter] = useState<ReorderStatusFilter>("All");
  const [reorderSearchQuery, setReorderSearchQuery] = useState("");
  const [historyDateFilter, setHistoryDateFilter] = useState<string>("all");

  // Stock Adjustment Dialog
  const [adjustmentDialogOpen, setAdjustmentDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);
  const [adjustmentType, setAdjustmentType] = useState<TransactionType>("Adjustment");
  const [adjustmentQuantity, setAdjustmentQuantity] = useState(0);
  const [adjustmentReason, setAdjustmentReason] = useState("");
  const [isAdjusting, setIsAdjusting] = useState(false);

  // Reorder Dialog
  const [reorderDialogOpen, setReorderDialogOpen] = useState(false);
  const [reorderItem, setReorderItem] = useState<InventoryItem | null>(null);
  const [reorderQuantity, setReorderQuantity] = useState(0);
  const [reorderNotes, setReorderNotes] = useState("");
  const [isReordering, setIsReordering] = useState(false);

  // Reorder Status Update Dialog
  const [statusDialogOpen, setStatusDialogOpen] = useState(false);
  const [selectedReorder, setSelectedReorder] = useState<ReorderRequest | null>(null);
  const [newStatus, setNewStatus] = useState<ReorderRequest["status"]>("Open");
  const [purchaseOrderNumber, setPurchaseOrderNumber] = useState("");
  const [expectedDeliveryDate, setExpectedDeliveryDate] = useState("");
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

  // View Reorder Details Dialog
  const [viewReorderDialogOpen, setViewReorderDialogOpen] = useState(false);
  const [viewingReorder, setViewingReorder] = useState<ReorderRequest | null>(null);

  // View Transaction Details Dialog
  const [viewTransactionDialogOpen, setViewTransactionDialogOpen] = useState(false);
  const [viewingTransaction, setViewingTransaction] = useState<StockTransaction | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [itemsData, transactionsData, alertsData, reordersData] = await Promise.all([
        fetchInventoryItems(),
        fetchStockTransactions(),
        fetchLowStockAlerts(),
        fetchReorderRequests(),
      ]);
      setItems(itemsData);
      setTransactions(transactionsData);
      setLowStockAlerts(alertsData.filter(a => a.status === "Active"));
      setReorderRequests(reordersData);
    } catch (error) {
      console.error("Error loading data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Filter items for stock adjustment
  const filteredItems = useMemo(() => {
    if (!searchQuery) return items;
    const query = searchQuery.toLowerCase();
    return items.filter(item => 
      item.itemName.toLowerCase().includes(query) ||
      item.itemCode.toLowerCase().includes(query) ||
      item.categoryName.toLowerCase().includes(query)
    );
  }, [items, searchQuery]);

  // Filter transactions
  const filteredTransactions = useMemo(() => {
    return transactions.filter(tx => {
      if (transactionFilter !== "All" && tx.transactionType !== transactionFilter) {
        return false;
      }
      
      // Date filter
      if (historyDateFilter !== "all") {
        const txDate = new Date(tx.transactionDate);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        if (historyDateFilter === "today") {
          const todayStr = today.toDateString();
          if (txDate.toDateString() !== todayStr) return false;
        } else if (historyDateFilter === "week") {
          const weekAgo = new Date(today);
          weekAgo.setDate(weekAgo.getDate() - 7);
          if (txDate < weekAgo) return false;
        } else if (historyDateFilter === "month") {
          const monthAgo = new Date(today);
          monthAgo.setMonth(monthAgo.getMonth() - 1);
          if (txDate < monthAgo) return false;
        }
      }
      
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        return tx.itemName.toLowerCase().includes(query) ||
               tx.itemCode.toLowerCase().includes(query);
      }
      return true;
    });
  }, [transactions, transactionFilter, searchQuery, historyDateFilter]);

  // Filter reorder requests
  const filteredReorderRequests = useMemo(() => {
    return reorderRequests.filter(request => {
      if (reorderStatusFilter !== "All" && request.status !== reorderStatusFilter) {
        return false;
      }
      if (reorderSearchQuery) {
        const query = reorderSearchQuery.toLowerCase();
        return request.itemName.toLowerCase().includes(query) ||
               request.itemCode.toLowerCase().includes(query) ||
               (request.supplierName?.toLowerCase().includes(query) || false) ||
               (request.purchaseOrderNumber?.toLowerCase().includes(query) || false);
      }
      return true;
    });
  }, [reorderRequests, reorderStatusFilter, reorderSearchQuery]);

  // Stats
  const stats = useMemo(() => {
    const lowStockCount = items.filter(i => i.quantityInHand <= i.reorderPoint).length;
    const outOfStockCount = items.filter(i => i.quantityInHand === 0).length;
    const pendingReorders = reorderRequests.filter(r => r.status === "Open").length;
    const todaysTransactions = transactions.filter(t => {
      const today = new Date().toDateString();
      return new Date(t.transactionDate).toDateString() === today;
    }).length;

    return {
      lowStockCount,
      outOfStockCount,
      pendingReorders,
      todaysTransactions,
    };
  }, [items, reorderRequests, transactions]);

  // Handle stock adjustment
  const handleStockAdjustment = async () => {
    if (!selectedItem || adjustmentQuantity === 0) return;
    
    setIsAdjusting(true);
    try {
      const isAddition = adjustmentType === "Purchase" || adjustmentType === "Return";
      const newQty = isAddition 
        ? selectedItem.quantityInHand + Math.abs(adjustmentQuantity)
        : selectedItem.quantityInHand - Math.abs(adjustmentQuantity);
      
      await updateStockQuantity(selectedItem.id, Math.max(0, newQty), adjustmentType, adjustmentReason);
      await loadData();
      setAdjustmentDialogOpen(false);
      resetAdjustmentForm();
    } catch (error) {
      console.error("Error adjusting stock:", error);
    } finally {
      setIsAdjusting(false);
    }
  };

  const resetAdjustmentForm = () => {
    setSelectedItem(null);
    setAdjustmentType("Adjustment");
    setAdjustmentQuantity(0);
    setAdjustmentReason("");
  };

  // Handle reorder request
  const handleReorderRequest = async () => {
    if (!reorderItem || reorderQuantity <= 0) return;
    
    setIsReordering(true);
    try {
      await createReorderRequest({
        itemId: reorderItem.id,
        itemCode: reorderItem.itemCode,
        itemName: reorderItem.itemName,
        supplierId: reorderItem.supplierId,
        supplierName: reorderItem.supplierName,
        quantity: reorderQuantity,
        unitPrice: reorderItem.costPrice,
        notes: reorderNotes,
      });
      await loadData();
      setReorderDialogOpen(false);
      setReorderItem(null);
      setReorderQuantity(0);
      setReorderNotes("");
    } catch (error) {
      console.error("Error creating reorder request:", error);
    } finally {
      setIsReordering(false);
    }
  };

  // Handle dismiss alert
  const handleDismissAlert = async (alertId: string) => {
    try {
      await dismissStockAlert(alertId);
      setLowStockAlerts(prev => prev.filter(a => a.id !== alertId));
    } catch (error) {
      console.error("Error dismissing alert:", error);
    }
  };

  // Handle reorder status update
  const handleUpdateReorderStatus = async () => {
    if (!selectedReorder) return;
    
    setIsUpdatingStatus(true);
    try {
      await updateReorderStatus(selectedReorder.id, newStatus, {
        purchaseOrderNumber: purchaseOrderNumber || undefined,
        expectedDeliveryDate: expectedDeliveryDate || undefined,
        actualDeliveryDate: newStatus === "Received" ? new Date().toISOString().split('T')[0] : undefined,
        approvedBy: newStatus === "Confirmed" ? "Admin" : undefined,
        approvedByUserId: newStatus === "Confirmed" ? "user-001" : undefined,
      });
      await loadData();
      setStatusDialogOpen(false);
      resetStatusForm();
    } catch (error) {
      console.error("Error updating reorder status:", error);
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  const resetStatusForm = () => {
    setSelectedReorder(null);
    setNewStatus("Open");
    setPurchaseOrderNumber("");
    setExpectedDeliveryDate("");
  };

  // Handle cancel reorder
  const handleCancelReorder = async (requestId: string) => {
    try {
      await cancelReorderRequest(requestId, "Cancelled by user");
      await loadData();
    } catch (error) {
      console.error("Error cancelling reorder:", error);
    }
  };

  // Open status update dialog
  const openStatusDialog = (request: ReorderRequest, status: ReorderRequest["status"]) => {
    setSelectedReorder(request);
    setNewStatus(status);
    setPurchaseOrderNumber(request.purchaseOrderNumber || "");
    setExpectedDeliveryDate(request.expectedDeliveryDate || "");
    setStatusDialogOpen(true);
  };

  // Open view reorder dialog
  const openViewReorderDialog = (request: ReorderRequest) => {
    setViewingReorder(request);
    setViewReorderDialogOpen(true);
  };

  // Open view transaction dialog
  const openViewTransactionDialog = (transaction: StockTransaction) => {
    setViewingTransaction(transaction);
    setViewTransactionDialogOpen(true);
  };

  // Open adjustment dialog for item
  const openAdjustmentDialog = (item: InventoryItem, type: TransactionType = "Adjustment") => {
    setSelectedItem(item);
    setAdjustmentType(type);
    setAdjustmentDialogOpen(true);
  };

  // Open reorder dialog
  const openReorderDialog = (item: InventoryItem) => {
    setReorderItem(item);
    setReorderQuantity(item.reorderQuantity || 50);
    setReorderDialogOpen(true);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Package className="h-12 w-12 mx-auto mb-4 animate-pulse text-muted-foreground" />
          <p className="text-muted-foreground">Loading stock data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
      <div className="p-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Stock Management</h1>
            <p className="text-sm text-muted-foreground">
              Manage stock levels, adjustments, and reorder requests
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={loadData}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-yellow-100 dark:bg-yellow-900/30">
                  <AlertTriangle className="h-5 w-5 text-yellow-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stats.lowStockCount}</p>
                  <p className="text-xs text-muted-foreground">Low Stock Items</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-red-100 dark:bg-red-900/30">
                  <PackageMinus className="h-5 w-5 text-red-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stats.outOfStockCount}</p>
                  <p className="text-xs text-muted-foreground">Out of Stock</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30">
                  <ShoppingCart className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stats.pendingReorders}</p>
                  <p className="text-xs text-muted-foreground">Pending Reorders</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-green-100 dark:bg-green-900/30">
                  <History className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stats.todaysTransactions}</p>
                  <p className="text-xs text-muted-foreground">Today&apos;s Transactions</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as TabValue)}>
          <TabsList className="mb-4">
            <TabsTrigger value="adjustments" className="flex items-center gap-2">
              <RefreshCw className="h-4 w-4" />
              Stock Adjustments
            </TabsTrigger>
            <TabsTrigger value="low-stock" className="flex items-center gap-2">
              <Bell className="h-4 w-4" />
              Low Stock Alerts
              {lowStockAlerts.length > 0 && (
                <Badge variant="destructive" className="ml-1 h-5 px-1.5">
                  {lowStockAlerts.length}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="reorder" className="flex items-center gap-2">
              <ShoppingCart className="h-4 w-4" />
              Reorder Requests
            </TabsTrigger>
            <TabsTrigger value="history" className="flex items-center gap-2">
              <History className="h-4 w-4" />
              Transaction History
            </TabsTrigger>
          </TabsList>

          {/* Stock Adjustments Tab */}
          <TabsContent value="adjustments">
            <Card>
              <CardHeader>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <CardTitle>Stock Adjustments</CardTitle>
                    <CardDescription>
                      Adjust stock levels for purchases, usage, damages, etc.
                    </CardDescription>
                  </div>
                  <div className="relative w-full sm:w-64">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search items..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-8"
                    />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Item</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead className="text-center">Current Stock</TableHead>
                        <TableHead className="text-center">Reorder Point</TableHead>
                        <TableHead className="text-center">Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredItems.slice(0, 15).map((item) => {
                        const stockStatus = getItemStockStatus(item);
                        return (
                          <TableRow key={item.id}>
                            <TableCell>
                              <div>
                                <p className="font-medium">{item.itemName}</p>
                                <p className="text-xs text-muted-foreground">{item.itemCode}</p>
                              </div>
                            </TableCell>
                            <TableCell>{item.categoryName}</TableCell>
                            <TableCell className="text-center">
                              <span className="font-medium">{item.quantityInHand}</span>
                              <span className="text-muted-foreground text-xs ml-1">{item.unitType}</span>
                            </TableCell>
                            <TableCell className="text-center">{item.reorderPoint}</TableCell>
                            <TableCell className="text-center">
                              <Badge className={stockStatus.color}>{stockStatus.label}</Badge>
                            </TableCell>
                            <TableCell className="text-right">
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="icon">
                                    <MoreVertical className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuLabel>Stock Actions</DropdownMenuLabel>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem onClick={() => openAdjustmentDialog(item, "Purchase")}>
                                    <PackagePlus className="h-4 w-4 mr-2 text-green-600" />
                                    Add Stock (Purchase)
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => openAdjustmentDialog(item, "Usage")}>
                                    <TrendingDown className="h-4 w-4 mr-2 text-blue-600" />
                                    Reduce Stock (Usage)
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => openAdjustmentDialog(item, "Adjustment")}>
                                    <RefreshCw className="h-4 w-4 mr-2 text-yellow-600" />
                                    Manual Adjustment
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => openAdjustmentDialog(item, "Damaged")}>
                                    <XCircle className="h-4 w-4 mr-2 text-red-600" />
                                    Record Damage
                                  </DropdownMenuItem>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem onClick={() => openReorderDialog(item)}>
                                    <ShoppingCart className="h-4 w-4 mr-2" />
                                    Create Reorder
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Low Stock Alerts Tab */}
          <TabsContent value="low-stock">
            <Card>
              <CardHeader>
                <CardTitle>Low Stock Alerts</CardTitle>
                <CardDescription>
                  Items that need to be reordered soon
                </CardDescription>
              </CardHeader>
              <CardContent>
                {lowStockAlerts.length === 0 ? (
                  <div className="text-center py-12">
                    <CheckCircle className="h-12 w-12 mx-auto mb-4 text-green-500" />
                    <p className="text-lg font-medium">All Clear!</p>
                    <p className="text-sm text-muted-foreground">No low stock alerts at the moment</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {lowStockAlerts.map((alert) => (
                      <motion.div
                        key={alert.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        className={`p-4 rounded-lg border-l-4 ${
                          alert.alertLevel === "Critical" 
                            ? "bg-red-50 border-red-500 dark:bg-red-900/20" 
                            : "bg-yellow-50 border-yellow-500 dark:bg-yellow-900/20"
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex items-start gap-3">
                            <AlertTriangle className={`h-5 w-5 mt-0.5 ${
                              alert.alertLevel === "Critical" ? "text-red-600" : "text-yellow-600"
                            }`} />
                            <div>
                              <p className="font-medium">{alert.itemName}</p>
                              <p className="text-sm text-muted-foreground">{alert.itemCode}</p>
                              <div className="mt-2 flex items-center gap-4 text-sm">
                                <span>
                                  Current: <strong>{alert.currentQuantity}</strong>
                                </span>
                                <span>
                                  Reorder Point: <strong>{alert.reorderPoint}</strong>
                                </span>
                                <Badge variant={alert.alertLevel === "Critical" ? "destructive" : "secondary"}>
                                  {alert.alertLevel}
                                </Badge>
                              </div>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              onClick={() => {
                                const item = items.find(i => i.id === alert.itemId);
                                if (item) openReorderDialog(item);
                              }}
                            >
                              <ShoppingCart className="h-4 w-4 mr-1" />
                              Reorder
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleDismissAlert(alert.id)}
                            >
                              Dismiss
                            </Button>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Reorder Requests Tab */}
          <TabsContent value="reorder">
            <Card>
              <CardHeader>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <CardTitle>Reorder Requests</CardTitle>
                    <CardDescription>
                      Track pending and completed reorder requests
                    </CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <div className="relative w-48">
                      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Search orders..."
                        value={reorderSearchQuery}
                        onChange={(e) => setReorderSearchQuery(e.target.value)}
                        className="pl-8"
                      />
                    </div>
                    <Select value={reorderStatusFilter} onValueChange={(v) => setReorderStatusFilter(v as ReorderStatusFilter)}>
                      <SelectTrigger className="w-36">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="All">All Status</SelectItem>
                        <SelectItem value="Open">Open</SelectItem>
                        <SelectItem value="Confirmed">Confirmed</SelectItem>
                        <SelectItem value="Received">Received</SelectItem>
                        <SelectItem value="Cancelled">Cancelled</SelectItem>
                        <SelectItem value="Partial">Partial</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {filteredReorderRequests.length === 0 ? (
                  <div className="text-center py-12">
                    <ShoppingCart className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                    <p className="text-lg font-medium">No Reorder Requests</p>
                    <p className="text-sm text-muted-foreground">
                      {reorderRequests.length === 0 
                        ? "Create a reorder request from the Stock Adjustments tab" 
                        : "No requests match your filter criteria"}
                    </p>
                  </div>
                ) : (
                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Item</TableHead>
                          <TableHead>Supplier</TableHead>
                          <TableHead className="text-center">Quantity</TableHead>
                          <TableHead className="text-right">Approx Cost</TableHead>
                          <TableHead className="text-center">Status</TableHead>
                          <TableHead>Dates</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredReorderRequests.map((request) => (
                          <TableRow key={request.id}>
                            <TableCell>
                              <div>
                                <p className="font-medium">{request.itemName}</p>
                                <p className="text-xs text-muted-foreground">{request.itemCode}</p>
                                {request.purchaseOrderNumber && (
                                  <p className="text-xs text-blue-600 font-mono">PO: {request.purchaseOrderNumber}</p>
                                )}
                              </div>
                            </TableCell>
                            <TableCell>
                              <span className={request.supplierName ? "" : "text-muted-foreground"}>
                                {request.supplierName || "Not assigned"}
                              </span>
                            </TableCell>
                            <TableCell className="text-center font-medium">{request.requestedQuantity}</TableCell>
                            <TableCell className="text-right font-medium text-green-600">
                              {formatINR(request.approxCost)}
                            </TableCell>
                            <TableCell className="text-center">
                              <Badge
                                className={
                                  request.status === "Received" ? "bg-green-100 text-green-800 border-green-200" :
                                  request.status === "Confirmed" ? "bg-blue-100 text-blue-800 border-blue-200" :
                                  request.status === "Cancelled" ? "bg-red-100 text-red-800 border-red-200" :
                                  request.status === "Partial" ? "bg-yellow-100 text-yellow-800 border-yellow-200" :
                                  "bg-gray-100 text-gray-800 border-gray-200"
                                }
                              >
                                {request.status}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <div className="text-xs space-y-0.5">
                                <p>Requested: {new Date(request.requestedDate).toLocaleDateString()}</p>
                                {request.expectedDeliveryDate && (
                                  <p className="text-blue-600">Expected: {new Date(request.expectedDeliveryDate).toLocaleDateString()}</p>
                                )}
                                {request.actualDeliveryDate && (
                                  <p className="text-green-600">Received: {new Date(request.actualDeliveryDate).toLocaleDateString()}</p>
                                )}
                              </div>
                            </TableCell>
                            <TableCell className="text-right">
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="icon">
                                    <MoreVertical className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem onClick={() => openViewReorderDialog(request)}>
                                    <Package className="h-4 w-4 mr-2" />
                                    View Details
                                  </DropdownMenuItem>
                                  {request.status === "Open" && (
                                    <>
                                      <DropdownMenuItem onClick={() => openStatusDialog(request, "Confirmed")}>
                                        <CheckCircle className="h-4 w-4 mr-2 text-blue-600" />
                                        Confirm Order
                                      </DropdownMenuItem>
                                      <DropdownMenuItem 
                                        onClick={() => handleCancelReorder(request.id)}
                                        className="text-red-600"
                                      >
                                        <XCircle className="h-4 w-4 mr-2" />
                                        Cancel Request
                                      </DropdownMenuItem>
                                    </>
                                  )}
                                  {request.status === "Confirmed" && (
                                    <>
                                      <DropdownMenuItem onClick={() => openStatusDialog(request, "Received")}>
                                        <Truck className="h-4 w-4 mr-2 text-green-600" />
                                        Mark as Received
                                      </DropdownMenuItem>
                                      <DropdownMenuItem onClick={() => openStatusDialog(request, "Partial")}>
                                        <PackageMinus className="h-4 w-4 mr-2 text-yellow-600" />
                                        Partial Delivery
                                      </DropdownMenuItem>
                                    </>
                                  )}
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Transaction History Tab */}
          <TabsContent value="history">
            <Card>
              <CardHeader>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <CardTitle>Transaction History</CardTitle>
                    <CardDescription>
                      View all stock transactions ({filteredTransactions.length} records)
                    </CardDescription>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <div className="relative w-48">
                      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Search..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-8"
                      />
                    </div>
                    <Select value={historyDateFilter} onValueChange={setHistoryDateFilter}>
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Time</SelectItem>
                        <SelectItem value="today">Today</SelectItem>
                        <SelectItem value="week">This Week</SelectItem>
                        <SelectItem value="month">This Month</SelectItem>
                      </SelectContent>
                    </Select>
                    <Select value={transactionFilter} onValueChange={(v) => setTransactionFilter(v as TransactionFilter)}>
                      <SelectTrigger className="w-36">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="All">All Types</SelectItem>
                        <SelectItem value="Purchase">Purchase</SelectItem>
                        <SelectItem value="Usage">Usage</SelectItem>
                        <SelectItem value="Adjustment">Adjustment</SelectItem>
                        <SelectItem value="Return">Return</SelectItem>
                        <SelectItem value="Damaged">Damaged</SelectItem>
                        <SelectItem value="Expiry">Expiry</SelectItem>
                        <SelectItem value="Donation">Donation</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {filteredTransactions.length === 0 ? (
                  <div className="text-center py-12">
                    <History className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                    <p className="text-lg font-medium">No Transactions Found</p>
                    <p className="text-sm text-muted-foreground">
                      {transactions.length === 0 
                        ? "Stock transactions will appear here" 
                        : "No transactions match your filter criteria"}
                    </p>
                  </div>
                ) : (
                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Type</TableHead>
                          <TableHead>Item</TableHead>
                          <TableHead className="text-center">Change</TableHead>
                          <TableHead className="text-center">Before → After</TableHead>
                          <TableHead>Date & Time</TableHead>
                          <TableHead>By</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredTransactions.map((tx) => (
                          <TableRow key={tx.id} className="cursor-pointer hover:bg-muted/50" onClick={() => openViewTransactionDialog(tx)}>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <div className={`p-1.5 rounded-full ${
                                  tx.transactionType === "Purchase" ? "bg-green-100" :
                                  tx.transactionType === "Usage" ? "bg-blue-100" :
                                  tx.transactionType === "Damaged" ? "bg-red-100" :
                                  tx.transactionType === "Return" ? "bg-purple-100" :
                                  "bg-yellow-100"
                                }`}>
                                  {transactionTypeIcons[tx.transactionType]}
                                </div>
                                <Badge className={transactionTypeColors[tx.transactionType]}>
                                  {tx.transactionType}
                                </Badge>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div>
                                <p className="font-medium">{tx.itemName}</p>
                                <p className="text-xs text-muted-foreground">{tx.itemCode}</p>
                              </div>
                            </TableCell>
                            <TableCell className="text-center">
                              <span className={`font-bold text-lg ${
                                tx.quantityAfter > tx.quantityBefore ? "text-green-600" : "text-red-600"
                              }`}>
                                {tx.quantityAfter > tx.quantityBefore ? "+" : "-"}{tx.quantity}
                              </span>
                            </TableCell>
                            <TableCell className="text-center">
                              <div className="flex items-center justify-center gap-2">
                                <span className="text-muted-foreground">{tx.quantityBefore}</span>
                                <span className="text-muted-foreground">→</span>
                                <span className="font-medium">{tx.quantityAfter}</span>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="text-sm">
                                <p>{new Date(tx.transactionDate).toLocaleDateString()}</p>
                                <p className="text-xs text-muted-foreground">
                                  {new Date(tx.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </p>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="text-sm">
                                <p className="font-medium">{tx.performedBy}</p>
                                {tx.approvedBy && (
                                  <p className="text-xs text-muted-foreground">Approved: {tx.approvedBy}</p>
                                )}
                              </div>
                            </TableCell>
                            <TableCell className="text-right">
                              <Button variant="ghost" size="sm" onClick={(e) => { e.stopPropagation(); openViewTransactionDialog(tx); }}>
                                View
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Stock Adjustment Dialog */}
      <Dialog open={adjustmentDialogOpen} onOpenChange={setAdjustmentDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Stock Adjustment</DialogTitle>
            <DialogDescription>
              Adjust stock for {selectedItem?.itemName}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
              <span className="text-sm text-muted-foreground">Current Stock</span>
              <span className="font-bold text-lg">{selectedItem?.quantityInHand} {selectedItem?.unitType}</span>
            </div>
            
            <div className="space-y-2">
              <Label>Adjustment Type</Label>
              <Select value={adjustmentType} onValueChange={(v) => setAdjustmentType(v as TransactionType)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Purchase">Purchase (Add Stock)</SelectItem>
                  <SelectItem value="Usage">Usage (Remove Stock)</SelectItem>
                  <SelectItem value="Adjustment">Manual Adjustment</SelectItem>
                  <SelectItem value="Return">Return</SelectItem>
                  <SelectItem value="Damaged">Damaged</SelectItem>
                  <SelectItem value="Expiry">Expiry</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Quantity Change</Label>
              <Input
                type="number"
                value={adjustmentQuantity}
                onChange={(e) => setAdjustmentQuantity(parseInt(e.target.value) || 0)}
                placeholder={adjustmentType === "Purchase" || adjustmentType === "Return" ? "Enter quantity to add" : "Enter quantity to remove"}
              />
              <p className="text-xs text-muted-foreground">
                {adjustmentType === "Purchase" || adjustmentType === "Return" 
                  ? "Enter positive number to add stock"
                  : "Enter positive number (will be subtracted)"}
              </p>
            </div>

            <div className="space-y-2">
              <Label>Reason/Notes</Label>
              <Textarea
                value={adjustmentReason}
                onChange={(e) => setAdjustmentReason(e.target.value)}
                placeholder="Enter reason for adjustment"
                rows={2}
              />
            </div>

            {adjustmentQuantity !== 0 && selectedItem && (
              <div className="p-3 bg-muted rounded-lg">
                <p className="text-sm">
                  New Stock Level: <strong>
                    {(adjustmentType === "Purchase" || adjustmentType === "Return")
                      ? selectedItem.quantityInHand + Math.abs(adjustmentQuantity)
                      : Math.max(0, selectedItem.quantityInHand - Math.abs(adjustmentQuantity))
                    } {selectedItem.unitType}
                  </strong>
                </p>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAdjustmentDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleStockAdjustment} disabled={isAdjusting || adjustmentQuantity === 0}>
              {isAdjusting ? "Saving..." : "Save Adjustment"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reorder Dialog */}
      <Dialog open={reorderDialogOpen} onOpenChange={setReorderDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Create Reorder Request</DialogTitle>
            <DialogDescription>
              Create a purchase request for {reorderItem?.itemName}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4 p-3 bg-muted rounded-lg text-sm">
              <div>
                <p className="text-muted-foreground">Current Stock</p>
                <p className="font-medium">{reorderItem?.quantityInHand} {reorderItem?.unitType}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Reorder Point</p>
                <p className="font-medium">{reorderItem?.reorderPoint}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Supplier</p>
                <p className="font-medium">{reorderItem?.supplierName || "Not assigned"}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Unit Price</p>
                <p className="font-medium">{formatINR(reorderItem?.costPrice || 0)}</p>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Quantity to Order</Label>
              <Input
                type="number"
                min={1}
                value={reorderQuantity}
                onChange={(e) => setReorderQuantity(parseInt(e.target.value) || 0)}
              />
            </div>

            <div className="space-y-2">
              <Label>Notes (Optional)</Label>
              <Textarea
                value={reorderNotes}
                onChange={(e) => setReorderNotes(e.target.value)}
                placeholder="Any special instructions..."
                rows={2}
              />
            </div>

            {reorderQuantity > 0 && reorderItem && (
              <div className="p-3 bg-muted rounded-lg">
                <p className="text-sm">
                  Total Amount: <strong className="text-lg">{formatINR(reorderItem.costPrice * reorderQuantity)}</strong>
                </p>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setReorderDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleReorderRequest} disabled={isReordering || reorderQuantity <= 0}>
              {isReordering ? "Creating..." : "Create Request"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Update Reorder Status Dialog */}
      <Dialog open={statusDialogOpen} onOpenChange={setStatusDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {newStatus === "Confirmed" && "Confirm Reorder"}
              {newStatus === "Received" && "Mark as Received"}
              {newStatus === "Partial" && "Partial Delivery"}
            </DialogTitle>
            <DialogDescription>
              Update status for {selectedReorder?.itemName}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="p-3 bg-muted rounded-lg space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Item</span>
                <span className="font-medium">{selectedReorder?.itemName}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Quantity</span>
                <span className="font-medium">{selectedReorder?.requestedQuantity}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Approx Cost</span>
                <span className="font-medium text-green-600">{formatINR(selectedReorder?.approxCost || 0)}</span>
              </div>
            </div>

            {(newStatus === "Confirmed" || newStatus === "Received") && (
              <div className="space-y-2">
                <Label>Purchase Order Number</Label>
                <Input
                  value={purchaseOrderNumber}
                  onChange={(e) => setPurchaseOrderNumber(e.target.value)}
                  placeholder="e.g., PO-2026-001"
                />
              </div>
            )}

            {newStatus === "Confirmed" && (
              <div className="space-y-2">
                <Label>Expected Delivery Date</Label>
                <Input
                  type="date"
                  value={expectedDeliveryDate}
                  onChange={(e) => setExpectedDeliveryDate(e.target.value)}
                />
              </div>
            )}

            {newStatus === "Received" && (
              <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                <div className="flex items-center gap-2 text-green-700 dark:text-green-400">
                  <CheckCircle className="h-5 w-5" />
                  <span className="text-sm font-medium">
                    Stock will be automatically updated with {selectedReorder?.requestedQuantity} units
                  </span>
                </div>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setStatusDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleUpdateReorderStatus} 
              disabled={isUpdatingStatus}
              className={
                newStatus === "Confirmed" ? "bg-blue-600 hover:bg-blue-700" :
                newStatus === "Received" ? "bg-green-600 hover:bg-green-700" :
                ""
              }
            >
              {isUpdatingStatus ? "Updating..." : 
                newStatus === "Confirmed" ? "Confirm Order" :
                newStatus === "Received" ? "Mark Received" :
                "Update Status"
              }
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Reorder Details Dialog */}
      <Dialog open={viewReorderDialogOpen} onOpenChange={setViewReorderDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Reorder Request Details</DialogTitle>
            <DialogDescription>
              {viewingReorder?.itemCode} - {viewingReorder?.itemName}
            </DialogDescription>
          </DialogHeader>
          {viewingReorder && (
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Status</p>
                  <Badge
                    className={
                      viewingReorder.status === "Received" ? "bg-green-100 text-green-800" :
                      viewingReorder.status === "Confirmed" ? "bg-blue-100 text-blue-800" :
                      viewingReorder.status === "Cancelled" ? "bg-red-100 text-red-800" :
                      "bg-gray-100 text-gray-800"
                    }
                  >
                    {viewingReorder.status}
                  </Badge>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Requested Quantity</p>
                  <p className="font-bold text-lg">{viewingReorder.requestedQuantity}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Supplier</p>
                  <p className="font-medium">{viewingReorder.supplierName || "Not assigned"}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Approx Cost</p>
                  <p className="font-bold text-lg text-green-600">{formatINR(viewingReorder.approxCost)}</p>
                </div>
              </div>

              {viewingReorder.purchaseOrderNumber && (
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Purchase Order Number</p>
                  <p className="font-mono text-blue-600">{viewingReorder.purchaseOrderNumber}</p>
                </div>
              )}

              <div className="border-t pt-4 space-y-3">
                <h4 className="font-medium text-sm">Timeline</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-gray-400" />
                    <span className="text-muted-foreground">Requested:</span>
                    <span>{new Date(viewingReorder.requestedDate).toLocaleDateString()}</span>
                    <span className="text-muted-foreground">by {viewingReorder.requestedBy}</span>
                  </div>
                  {viewingReorder.approvedBy && (
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-blue-500" />
                      <span className="text-muted-foreground">Approved:</span>
                      <span>by {viewingReorder.approvedBy}</span>
                    </div>
                  )}
                  {viewingReorder.expectedDeliveryDate && (
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-yellow-500" />
                      <span className="text-muted-foreground">Expected Delivery:</span>
                      <span>{new Date(viewingReorder.expectedDeliveryDate).toLocaleDateString()}</span>
                    </div>
                  )}
                  {viewingReorder.actualDeliveryDate && (
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-green-500" />
                      <span className="text-muted-foreground">Received:</span>
                      <span>{new Date(viewingReorder.actualDeliveryDate).toLocaleDateString()}</span>
                    </div>
                  )}
                </div>
              </div>

              {viewingReorder.notes && (
                <div className="space-y-1 border-t pt-4">
                  <p className="text-sm text-muted-foreground">Notes</p>
                  <p className="text-sm">{viewingReorder.notes}</p>
                </div>
              )}
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setViewReorderDialogOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Transaction Details Dialog */}
      <Dialog open={viewTransactionDialogOpen} onOpenChange={setViewTransactionDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Transaction Details</DialogTitle>
            <DialogDescription>
              {viewingTransaction?.itemCode} - {viewingTransaction?.itemName}
            </DialogDescription>
          </DialogHeader>
          {viewingTransaction && (
            <div className="space-y-4 py-4">
              <div className="flex items-center justify-center p-4 bg-muted rounded-lg">
                <div className="text-center">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    {transactionTypeIcons[viewingTransaction.transactionType]}
                    <Badge className={transactionTypeColors[viewingTransaction.transactionType]}>
                      {viewingTransaction.transactionType}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-4 text-2xl font-bold">
                    <span className="text-muted-foreground">{viewingTransaction.quantityBefore}</span>
                    <span className="text-muted-foreground">→</span>
                    <span className={viewingTransaction.quantityAfter > viewingTransaction.quantityBefore ? "text-green-600" : "text-red-600"}>
                      {viewingTransaction.quantityAfter}
                    </span>
                  </div>
                  <p className={`text-lg font-bold ${
                    viewingTransaction.quantityAfter > viewingTransaction.quantityBefore ? "text-green-600" : "text-red-600"
                  }`}>
                    {viewingTransaction.quantityAfter > viewingTransaction.quantityBefore ? "+" : "-"}{viewingTransaction.quantity} units
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Transaction Date</p>
                  <p className="font-medium">{new Date(viewingTransaction.transactionDate).toLocaleDateString()}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Transaction Time</p>
                  <p className="font-medium">{new Date(viewingTransaction.createdAt).toLocaleTimeString()}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Performed By</p>
                  <p className="font-medium">{viewingTransaction.performedBy}</p>
                </div>
                {viewingTransaction.approvedBy && (
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Approved By</p>
                    <p className="font-medium">{viewingTransaction.approvedBy}</p>
                  </div>
                )}
              </div>

              {viewingTransaction.reason && (
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Reason</p>
                  <p className="text-sm">{viewingTransaction.reason}</p>
                </div>
              )}

              {viewingTransaction.notes && (
                <div className="space-y-1 border-t pt-4">
                  <p className="text-sm text-muted-foreground">Notes</p>
                  <p className="text-sm">{viewingTransaction.notes}</p>
                </div>
              )}

              <div className="border-t pt-4">
                <p className="text-xs text-muted-foreground">
                  Transaction ID: <span className="font-mono">{viewingTransaction.id}</span>
                </p>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setViewTransactionDialogOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
