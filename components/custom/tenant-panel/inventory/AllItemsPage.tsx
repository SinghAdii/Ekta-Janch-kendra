/**
 * All Items Page
 * 
 * Complete inventory list with search, filters, CRUD operations,
 * and stock management capabilities.
 */

"use client";

import React, { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  Package,
  Search,
  MoreVertical,
  Eye,
  Edit2,
  Trash2,
  Download,
  RefreshCw,
  Plus,
  X,
  Building2,
  Boxes,
  AlertTriangle,
  CheckCircle2,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { format } from "date-fns";

import type { InventoryItem, InventoryCategory, Supplier, TransactionType, StockTransaction, Branch } from "./inventory.types";
import {
  fetchInventoryItems,
  fetchCategories,
  fetchSuppliers,
  fetchBranches,
  fetchStockTransactions,
  updateInventoryItem,
  deleteInventoryItem,
  updateStockQuantity,
} from "./inventory.data";
import {
  formatINR,
  getStockStatus,
  itemStatusColors,
  stockStatusColors,
  ViewItemDetailsDialog,
  EditItemDialog,
  StockAdjustmentDialog,
  DeleteConfirmDialog,
} from "./inventory.components";

export default function AllItemsPage() {
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [filteredItems, setFilteredItems] = useState<InventoryItem[]>([]);
  const [categories, setCategories] = useState<InventoryCategory[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [branches, setBranches] = useState<Branch[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [branchFilter, setBranchFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [stockFilter, setStockFilter] = useState<string>("all");

  // Dialogs
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isAdjustDialogOpen, setIsAdjustDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [itemTransactions, setItemTransactions] = useState<StockTransaction[]>([]);

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    filterItems();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery, categoryFilter, branchFilter, statusFilter, stockFilter, items]);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [itemsData, categoriesData, suppliersData, branchesData] = await Promise.all([
        fetchInventoryItems(),
        fetchCategories(),
        fetchSuppliers(),
        fetchBranches(),
      ]);
      setItems(itemsData);
      setFilteredItems(itemsData);
      setCategories(categoriesData);
      setSuppliers(suppliersData);
      setBranches(branchesData);
    } catch (error) {
      console.error("Error loading data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const filterItems = () => {
    let filtered = [...items];

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (item) =>
          item.itemName.toLowerCase().includes(query) ||
          item.itemCode.toLowerCase().includes(query) ||
          item.categoryName.toLowerCase().includes(query) ||
          item.branchName.toLowerCase().includes(query) ||
          item.supplierName?.toLowerCase().includes(query)
      );
    }

    // Branch filter
    if (branchFilter && branchFilter !== "all") {
      filtered = filtered.filter((item) => item.branchId === branchFilter);
    }

    // Category filter
    if (categoryFilter && categoryFilter !== "all") {
      filtered = filtered.filter((item) => item.categoryId === categoryFilter);
    }

    // Status filter
    if (statusFilter && statusFilter !== "all") {
      filtered = filtered.filter((item) => item.status === statusFilter);
    }

    // Stock status filter
    if (stockFilter && stockFilter !== "all") {
      filtered = filtered.filter((item) => {
        const stockStatus = getStockStatus(item);
        return stockStatus === stockFilter;
      });
    }

    setFilteredItems(filtered);
  };

  const clearFilters = () => {
    setSearchQuery("");
    setCategoryFilter("all");
    setBranchFilter("all");
    setStatusFilter("all");
    setStockFilter("all");
  };

  const hasActiveFilters = searchQuery || categoryFilter !== "all" || branchFilter !== "all" || statusFilter !== "all" || stockFilter !== "all";

  // Handle view item
  const handleViewItem = async (item: InventoryItem) => {
    setSelectedItem(item);
    const transactions = await fetchStockTransactions(item.id);
    setItemTransactions(transactions);
    setIsViewDialogOpen(true);
  };

  // Handle edit item
  const handleEditItem = (item: InventoryItem) => {
    setSelectedItem(item);
    setIsEditDialogOpen(true);
  };

  // Handle adjust stock
  const handleAdjustStock = (item: InventoryItem) => {
    setSelectedItem(item);
    setIsAdjustDialogOpen(true);
  };

  // Handle delete item
  const handleDeleteItem = (item: InventoryItem) => {
    setSelectedItem(item);
    setIsDeleteDialogOpen(true);
  };

  // Save item updates
  const handleSaveItem = async (data: Partial<InventoryItem>) => {
    if (!selectedItem) return;
    await updateInventoryItem(selectedItem.id, data);
    await loadData();
  };

  // Confirm delete
  const handleConfirmDelete = async () => {
    if (!selectedItem) return;
    await deleteInventoryItem(selectedItem.id);
    await loadData();
  };

  // Adjust stock
  const handleStockAdjust = async (itemId: string, newQuantity: number, type: TransactionType, notes?: string) => {
    await updateStockQuantity(itemId, newQuantity, type, notes);
    await loadData();
  };

  // Export to CSV
  const handleExport = () => {
    const headers = ["Item Code", "Item Name", "Branch", "Category", "Unit", "Quantity", "Reorder Point", "Cost Price", "Status", "Stock Status"];
    const rows = filteredItems.map(item => [
      item.itemCode,
      item.itemName,
      item.branchName,
      item.categoryName,
      item.unitType,
      item.quantityInHand.toString(),
      item.reorderPoint.toString(),
      item.costPrice.toString(),
      item.status,
      getStockStatus(item),
    ]);
    
    const csv = [headers.join(","), ...rows.map(row => row.join(","))].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `inventory-${format(new Date(), "yyyy-MM-dd")}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Stats
  const stats = useMemo(() => ({
    total: filteredItems.length,
    inStock: filteredItems.filter(i => getStockStatus(i) === "In Stock").length,
    lowStock: filteredItems.filter(i => getStockStatus(i) === "Low Stock").length,
    outOfStock: filteredItems.filter(i => getStockStatus(i) === "Out of Stock").length,
  }), [filteredItems]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 p-6">
        <div className="space-y-6">
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-96 w-full" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
      <div className="p-6 space-y-6 max-w-full mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl shadow-lg">
              <Package className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight">All Inventory Items</h1>
              <p className="text-sm text-muted-foreground">
                Manage your complete inventory catalog
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" onClick={loadData}>
              <RefreshCw className="h-4 w-4" />
            </Button>
            <Button variant="outline" onClick={handleExport}>
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            <Link href="/tenant-panel/inventory/add-item">
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Item
              </Button>
            </Link>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Items</p>
                  <p className="text-2xl font-bold">{stats.total}</p>
                </div>
                <Boxes className="h-8 w-8 text-blue-500 opacity-50" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">In Stock</p>
                  <p className="text-2xl font-bold text-green-600">{stats.inStock}</p>
                </div>
                <CheckCircle2 className="h-8 w-8 text-green-500 opacity-50" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Low Stock</p>
                  <p className="text-2xl font-bold text-amber-600">{stats.lowStock}</p>
                </div>
                <AlertTriangle className="h-8 w-8 text-amber-500 opacity-50" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Out of Stock</p>
                  <p className="text-2xl font-bold text-red-600">{stats.outOfStock}</p>
                </div>
                <Package className="h-8 w-8 text-red-500 opacity-50" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by name, code, branch..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
              <Select value={branchFilter} onValueChange={setBranchFilter}>
                <SelectTrigger className="w-full md:w-[180px]">
                  <SelectValue placeholder="Branch" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Branches</SelectItem>
                  {branches.map((branch) => (
                    <SelectItem key={branch.id} value={branch.id}>
                      {branch.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-full md:w-[180px]">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id}>
                      {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={stockFilter} onValueChange={setStockFilter}>
                <SelectTrigger className="w-full md:w-[150px]">
                  <SelectValue placeholder="Stock Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Stock</SelectItem>
                  <SelectItem value="In Stock">In Stock</SelectItem>
                  <SelectItem value="Low Stock">Low Stock</SelectItem>
                  <SelectItem value="Out of Stock">Out of Stock</SelectItem>
                </SelectContent>
              </Select>
              {hasActiveFilters && (
                <Button variant="ghost" onClick={clearFilters}>
                  <X className="h-4 w-4 mr-2" />
                  Clear
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Items Table */}
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead>Item Code</TableHead>
                    <TableHead>Item Name</TableHead>
                    <TableHead>Branch</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead className="text-center">Quantity</TableHead>
                    <TableHead className="text-right">Cost Price</TableHead>
                    <TableHead className="text-center">Stock Status</TableHead>
                    <TableHead className="text-center">Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredItems.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={9} className="text-center py-12 text-muted-foreground">
                        <Package className="h-12 w-12 mx-auto mb-3 opacity-50" />
                        <p>No items found</p>
                        {hasActiveFilters && (
                          <Button variant="link" onClick={clearFilters}>
                            Clear filters
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredItems.map((item, index) => {
                      const stockStatus = getStockStatus(item);
                      return (
                        <motion.tr
                          key={item.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.02 }}
                          className="border-b hover:bg-muted/50"
                        >
                          <TableCell className="font-mono text-sm font-medium">
                            {item.itemCode}
                          </TableCell>
                          <TableCell>
                            <div>
                              <p className="font-medium">{item.itemName}</p>
                              {item.supplierName && (
                                <p className="text-xs text-muted-foreground">
                                  {item.supplierName}
                                </p>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="secondary" className="flex items-center gap-1 w-fit">
                              <Building2 className="h-3 w-3" />
                              {item.branchName}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">{item.categoryName}</Badge>
                          </TableCell>
                          <TableCell className="text-center">
                            <span className={`font-semibold ${
                              item.quantityInHand === 0 ? "text-red-600" :
                              item.quantityInHand <= item.reorderPoint ? "text-amber-600" :
                              "text-green-600"
                            }`}>
                              {item.quantityInHand}
                            </span>
                            <span className="text-muted-foreground text-xs ml-1">{item.unitType}</span>
                          </TableCell>
                          <TableCell className="text-right">{formatINR(item.costPrice)}</TableCell>
                          <TableCell className="text-center">
                            <Badge className={stockStatusColors[stockStatus]}>
                              {stockStatus}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-center">
                            <Badge className={itemStatusColors[item.status]}>
                              {item.status}
                            </Badge>
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
                                <DropdownMenuItem onClick={() => handleViewItem(item)}>
                                  <Eye className="h-4 w-4 mr-2" />
                                  View Details
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleEditItem(item)}>
                                  <Edit2 className="h-4 w-4 mr-2" />
                                  Edit Item
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleAdjustStock(item)}>
                                  <Boxes className="h-4 w-4 mr-2" />
                                  Adjust Stock
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem 
                                  onClick={() => handleDeleteItem(item)}
                                  className="text-red-600"
                                >
                                  <Trash2 className="h-4 w-4 mr-2" />
                                  Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </motion.tr>
                      );
                    })
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Pagination Info */}
        {filteredItems.length > 0 && (
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <p>
              Showing {filteredItems.length} of {items.length} items
            </p>
          </div>
        )}
      </div>

      {/* Dialogs */}
      <ViewItemDetailsDialog
        open={isViewDialogOpen}
        onOpenChange={setIsViewDialogOpen}
        item={selectedItem}
        transactions={itemTransactions}
      />

      <EditItemDialog
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        item={selectedItem}
        categories={categories}
        suppliers={suppliers}
        onSave={handleSaveItem}
      />

      <StockAdjustmentDialog
        open={isAdjustDialogOpen}
        onOpenChange={setIsAdjustDialogOpen}
        item={selectedItem}
        onAdjust={handleStockAdjust}
      />

      <DeleteConfirmDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        itemName={selectedItem?.itemName || ""}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
}
