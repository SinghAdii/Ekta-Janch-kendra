"use client";

import React, { useState } from "react";
import { format } from "date-fns";
import {
  CalendarIcon,
  Package,
  AlertTriangle,
  MapPin,
  Truck,
  Plus,
  Minus,
  History,
  AlertCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type {
  InventoryItem,
  InventoryCategory,
  StockTransaction,
  LowStockAlert,
  Supplier,
  ItemStatus,
  StockStatus,
  TransactionType,
  UnitType,
} from "./inventory.types";

// ============================================================
// STATUS COLORS
// ============================================================

export const itemStatusColors: Record<ItemStatus, string> = {
  Active: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  Inactive: "bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400",
  Discontinued: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
  "On Order": "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
};

export const stockStatusColors: Record<StockStatus, string> = {
  "In Stock": "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  "Low Stock": "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  "Out of Stock": "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
  "On Order": "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
};

export const transactionTypeColors: Record<TransactionType, string> = {
  Purchase: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  Usage: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  Adjustment: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  Return: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
  Damaged: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
  Expiry: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400",
  Donation: "bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-400",
};

export const alertLevelColors = {
  Critical: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 border-red-200",
  Warning: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 border-amber-200",
};

// ============================================================
// HELPER FUNCTIONS
// ============================================================

export function getStockStatus(item: InventoryItem): StockStatus {
  if (item.quantityInHand === 0) return "Out of Stock";
  if (item.quantityInHand <= item.reorderPoint) return "Low Stock";
  return "In Stock";
}

export function formatINR(amount: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

// ============================================================
// DATE RANGE PICKER COMPONENT
// ============================================================

interface DateRange {
  from: Date | undefined;
  to: Date | undefined;
}

interface DateRangePickerProps {
  dateRange: DateRange;
  onDateRangeChange: (range: DateRange) => void;
}

export function DateRangePicker({ dateRange, onDateRangeChange }: DateRangePickerProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "justify-start text-left font-normal",
            !dateRange.from && "text-muted-foreground"
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {dateRange.from ? (
            dateRange.to ? (
              <>
                {format(dateRange.from, "LLL dd, y")} - {format(dateRange.to, "LLL dd, y")}
              </>
            ) : (
              format(dateRange.from, "LLL dd, y")
            )
          ) : (
            <span>Pick a date range</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          initialFocus
          mode="range"
          defaultMonth={dateRange.from}
          selected={dateRange}
          onSelect={(range) => onDateRangeChange(range as DateRange)}
          numberOfMonths={2}
        />
      </PopoverContent>
    </Popover>
  );
}

// ============================================================
// VIEW ITEM DETAILS DIALOG
// ============================================================

interface ViewItemDetailsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  item: InventoryItem | null;
  transactions?: StockTransaction[];
}

export function ViewItemDetailsDialog({
  open,
  onOpenChange,
  item,
  transactions = [],
}: ViewItemDetailsDialogProps) {
  if (!item) return null;

  const stockStatus = getStockStatus(item);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Item Details - {item.itemCode}
          </DialogTitle>
          <DialogDescription>
            Complete information about the inventory item
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="max-h-[65vh] pr-4">
          <Tabs defaultValue="details" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="details">Details</TabsTrigger>
              <TabsTrigger value="stock">Stock Info</TabsTrigger>
              <TabsTrigger value="history">Transaction History</TabsTrigger>
            </TabsList>

            {/* Details Tab */}
            <TabsContent value="details" className="space-y-4 mt-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div>
                    <Label className="text-muted-foreground text-xs">Item Name</Label>
                    <p className="font-medium">{item.itemName}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground text-xs">Item Code</Label>
                    <p className="font-mono text-sm">{item.itemCode}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground text-xs">Branch</Label>
                    <Badge variant="secondary">{item.branchName}</Badge>
                  </div>
                  <div>
                    <Label className="text-muted-foreground text-xs">Category</Label>
                    <Badge variant="outline">{item.categoryName}</Badge>
                  </div>
                  <div>
                    <Label className="text-muted-foreground text-xs">Unit Type</Label>
                    <p>{item.unitType}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground text-xs">Status</Label>
                    <Badge className={itemStatusColors[item.status]}>{item.status}</Badge>
                  </div>
                </div>

                <div className="space-y-3">
                  <div>
                    <Label className="text-muted-foreground text-xs">Cost Price</Label>
                    <p className="font-medium text-lg">{formatINR(item.costPrice)}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground text-xs">Stock Value</Label>
                    <p className="font-medium text-lg text-green-600">{formatINR(item.costPrice * item.quantityInHand)}</p>
                  </div>
                  {item.expiryDate && (
                    <div>
                      <Label className="text-muted-foreground text-xs">Expiry Date</Label>
                      <p>{format(new Date(item.expiryDate), "dd MMM yyyy")}</p>
                    </div>
                  )}
                  {item.batchNumber && (
                    <div>
                      <Label className="text-muted-foreground text-xs">Batch Number</Label>
                      <p className="font-mono text-sm">{item.batchNumber}</p>
                    </div>
                  )}
                </div>
              </div>

              {item.description && (
                <div>
                  <Label className="text-muted-foreground text-xs">Description</Label>
                  <p className="text-sm">{item.description}</p>
                </div>
              )}

              {/* Supplier Information */}
              {item.supplierName && (
                <div className="pt-4 border-t">
                  <h4 className="font-medium mb-3 flex items-center gap-2">
                    <Truck className="h-4 w-4" />
                    Supplier Information
                  </h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-muted-foreground text-xs">Supplier Name</Label>
                      <p>{item.supplierName}</p>
                    </div>
                    <div>
                      <Label className="text-muted-foreground text-xs">Supplier Code</Label>
                      <p className="font-mono text-sm">{item.supplierCode}</p>
                    </div>
                    {item.supplierPhone && (
                      <div>
                        <Label className="text-muted-foreground text-xs">Contact</Label>
                        <p>{item.supplierPhone}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Storage Location */}
              {item.storageLocation && (
                <div className="pt-4 border-t">
                  <h4 className="font-medium mb-3 flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    Storage Location
                  </h4>
                  <p>{item.storageLocation}</p>
                </div>
              )}

              {item.notes && (
                <div className="pt-4 border-t">
                  <Label className="text-muted-foreground text-xs">Notes</Label>
                  <p className="text-sm">{item.notes}</p>
                </div>
              )}
            </TabsContent>

            {/* Stock Info Tab */}
            <TabsContent value="stock" className="space-y-4 mt-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 border rounded-lg">
                  <Label className="text-muted-foreground text-xs">Current Stock</Label>
                  <div className="flex items-center gap-2 mt-1">
                    <p className="text-3xl font-bold">{item.quantityInHand}</p>
                    <span className="text-muted-foreground">{item.unitType}</span>
                  </div>
                  <Badge className={cn("mt-2", stockStatusColors[stockStatus])}>
                    {stockStatus}
                  </Badge>
                </div>

                <div className="p-4 border rounded-lg">
                  <Label className="text-muted-foreground text-xs">Stock Value</Label>
                  <p className="text-3xl font-bold text-green-600 mt-1">
                    {formatINR(item.quantityInHand * item.costPrice)}
                  </p>
                  <p className="text-xs text-muted-foreground mt-2">
                    Based on cost price
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-3 border rounded-lg">
                  <Label className="text-muted-foreground text-xs">Reorder Point</Label>
                  <p className="text-xl font-semibold">{item.reorderPoint}</p>
                </div>
                <div className="p-3 border rounded-lg">
                  <Label className="text-muted-foreground text-xs">Reorder Qty</Label>
                  <p className="text-xl font-semibold">{item.reorderQuantity}</p>
                </div>
                <div className="p-3 border rounded-lg">
                  <Label className="text-muted-foreground text-xs">Min Quantity</Label>
                  <p className="text-xl font-semibold">{item.minQuantity}</p>
                </div>
                <div className="p-3 border rounded-lg">
                  <Label className="text-muted-foreground text-xs">Max Quantity</Label>
                  <p className="text-xl font-semibold">{item.maxQuantity}</p>
                </div>
              </div>

              {item.lastStockUpdateAt && (
                <div className="text-sm text-muted-foreground">
                  Last stock update: {format(new Date(item.lastStockUpdateAt), "dd MMM yyyy, hh:mm a")}
                </div>
              )}
            </TabsContent>

            {/* Transaction History Tab */}
            <TabsContent value="history" className="space-y-4 mt-4">
              {transactions.length > 0 ? (
                <div className="space-y-3">
                  {transactions.map((txn) => (
                    <div
                      key={txn.id}
                      className="p-3 border rounded-lg flex items-center justify-between"
                    >
                      <div className="flex items-center gap-3">
                        <div className={cn(
                          "p-2 rounded-full",
                          txn.transactionType === "Purchase" ? "bg-green-100" :
                          txn.transactionType === "Usage" ? "bg-blue-100" :
                          "bg-amber-100"
                        )}>
                          {txn.transactionType === "Purchase" ? (
                            <Plus className="h-4 w-4 text-green-600" />
                          ) : txn.transactionType === "Usage" ? (
                            <Minus className="h-4 w-4 text-blue-600" />
                          ) : (
                            <History className="h-4 w-4 text-amber-600" />
                          )}
                        </div>
                        <div>
                          <p className="font-medium">{txn.transactionType}</p>
                          <p className="text-xs text-muted-foreground">
                            {format(new Date(txn.createdAt), "dd MMM yyyy, hh:mm a")}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className={cn(
                          "font-semibold",
                          txn.transactionType === "Purchase" ? "text-green-600" : "text-red-600"
                        )}>
                          {txn.transactionType === "Purchase" ? "+" : "-"}{txn.quantity}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {txn.quantityBefore} → {txn.quantityAfter}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <History className="h-12 w-12 mx-auto mb-3 opacity-50" />
                  <p>No transaction history available</p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </ScrollArea>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ============================================================
// ADD/EDIT ITEM DIALOG
// ============================================================

interface ItemFormData {
  itemName: string;
  itemCode: string;
  description: string;
  categoryId: string;
  unitType: UnitType;
  status: ItemStatus;
  supplierId: string;
  customSupplierName: string;
  quantityInHand: number;
  reorderPoint: number;
  costPrice: number;
  storageLocation: string;
  notes: string;
}

interface EditItemDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  item: InventoryItem | null;
  categories: InventoryCategory[];
  suppliers: Supplier[];
  onSave: (data: Partial<InventoryItem>) => Promise<void>;
  isCreating?: boolean;
}

const unitTypes: UnitType[] = ["Pieces", "Pack", "Box", "Carton", "Bottle", "Tube", "Vial", "Kit", "Meter", "Gram", "Liter"];
const itemStatuses: ItemStatus[] = ["Active", "Inactive", "Discontinued", "On Order"];

export function EditItemDialog({
  open,
  onOpenChange,
  item,
  categories,
  suppliers,
  onSave,
  isCreating = false,
}: EditItemDialogProps) {
  const [formData, setFormData] = useState<ItemFormData>({
    itemName: "",
    itemCode: "",
    description: "",
    categoryId: "",
    unitType: "Pieces",
    status: "Active",
    supplierId: "",
    customSupplierName: "",
    quantityInHand: 0,
    reorderPoint: 10,
    costPrice: 0,
    storageLocation: "",
    notes: "",
  });
  const [isSaving, setIsSaving] = useState(false);

  React.useEffect(() => {
    if (item && !isCreating) {
      setFormData({
        itemName: item.itemName,
        itemCode: item.itemCode,
        description: item.description || "",
        categoryId: item.categoryId,
        unitType: item.unitType,
        status: item.status,
        supplierId: item.supplierId || "",
        customSupplierName: "",
        quantityInHand: item.quantityInHand,
        reorderPoint: item.reorderPoint,
        costPrice: item.costPrice,
        storageLocation: item.storageLocation || "",
        notes: item.notes || "",
      });
    } else if (isCreating) {
      setFormData({
        itemName: "",
        itemCode: "",
        description: "",
        categoryId: "",
        unitType: "Pieces",
        status: "Active",
        supplierId: "",
        customSupplierName: "",
        quantityInHand: 0,
        reorderPoint: 10,
        costPrice: 0,
        storageLocation: "",
        notes: "",
      });
    }
  }, [item, isCreating, open]);

  const handleSubmit = async () => {
    setIsSaving(true);
    try {
      const selectedCategory = categories.find(c => c.id === formData.categoryId);
      const isCustomSupplier = formData.supplierId === "custom";
      const selectedSupplier = isCustomSupplier ? null : suppliers.find(s => s.id === formData.supplierId);
      
      const supplierName = isCustomSupplier ? formData.customSupplierName : selectedSupplier?.name;
      const supplierId = isCustomSupplier ? undefined : (formData.supplierId || undefined);
      
      await onSave({
        ...formData,
        supplierId: supplierId,
        categoryName: selectedCategory?.name || "",
        supplierName: supplierName,
        supplierCode: isCustomSupplier ? undefined : selectedSupplier?.code,
        supplierPhone: isCustomSupplier ? undefined : selectedSupplier?.phone,
        reorderQuantity: formData.reorderPoint * 2,
        minQuantity: Math.floor(formData.reorderPoint / 2),
        maxQuantity: formData.reorderPoint * 5,
        currency: "INR",
      });
      onOpenChange(false);
    } catch (error) {
      console.error("Error saving item:", error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle>
            {isCreating ? "Add New Inventory Item" : "Edit Inventory Item"}
          </DialogTitle>
          <DialogDescription>
            {isCreating 
              ? "Fill in the details to add a new item to inventory"
              : "Update the inventory item details"
            }
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="max-h-[65vh] pr-4">
          <div className="space-y-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <h4 className="font-medium text-sm">Basic Information</h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="itemName">Item Name *</Label>
                  <Input
                    id="itemName"
                    value={formData.itemName}
                    onChange={(e) => setFormData({ ...formData, itemName: e.target.value })}
                    placeholder="Enter item name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="itemCode">Item Code *</Label>
                  <Input
                    id="itemCode"
                    value={formData.itemCode}
                    onChange={(e) => setFormData({ ...formData, itemCode: e.target.value })}
                    placeholder="e.g., REG-CBC-001"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Enter item description"
                  rows={2}
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Category *</Label>
                  <Select
                    value={formData.categoryId}
                    onValueChange={(value) => setFormData({ ...formData, categoryId: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.filter(c => c.isActive).map((cat) => (
                        <SelectItem key={cat.id} value={cat.id}>
                          {cat.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Unit Type *</Label>
                  <Select
                    value={formData.unitType}
                    onValueChange={(value) => setFormData({ ...formData, unitType: value as UnitType })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {unitTypes.map((unit) => (
                        <SelectItem key={unit} value={unit}>
                          {unit}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Status</Label>
                  <Select
                    value={formData.status}
                    onValueChange={(value) => setFormData({ ...formData, status: value as ItemStatus })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {itemStatuses.map((status) => (
                        <SelectItem key={status} value={status}>
                          {status}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Supplier Information */}
            <div className="space-y-4 pt-4 border-t">
              <h4 className="font-medium text-sm">Supplier Information</h4>
              <div className="space-y-2">
                <Label>Supplier</Label>
                <Select
                  value={formData.supplierId || "none"}
                  onValueChange={(value) => {
                    if (value === "custom") {
                      setFormData({ ...formData, supplierId: "custom" });
                    } else {
                      setFormData({ ...formData, supplierId: value === "none" ? "" : value, customSupplierName: "" });
                    }
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select supplier" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">No Supplier</SelectItem>
                    <SelectItem value="custom">Add Custom Supplier</SelectItem>
                    {suppliers.filter(s => s.isActive).map((sup) => (
                      <SelectItem key={sup.id} value={sup.id}>
                        {sup.name} ({sup.code})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {formData.supplierId === "custom" && (
                  <Input
                    value={formData.customSupplierName}
                    onChange={(e) => setFormData({ ...formData, customSupplierName: e.target.value })}
                    placeholder="Enter custom supplier name"
                    className="mt-2"
                  />
                )}
              </div>
            </div>

            {/* Stock Settings */}
            <div className="space-y-4 pt-4 border-t">
              <h4 className="font-medium text-sm">Stock & Pricing</h4>
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="quantityInHand">Current Stock</Label>
                  <Input
                    id="quantityInHand"
                    type="number"
                    value={formData.quantityInHand}
                    onChange={(e) => setFormData({ ...formData, quantityInHand: parseInt(e.target.value) || 0 })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="reorderPoint">Reorder Point</Label>
                  <Input
                    id="reorderPoint"
                    type="number"
                    value={formData.reorderPoint}
                    onChange={(e) => setFormData({ ...formData, reorderPoint: parseInt(e.target.value) || 0 })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="costPrice">Cost Price (₹) *</Label>
                  <Input
                    id="costPrice"
                    type="number"
                    value={formData.costPrice}
                    onChange={(e) => setFormData({ ...formData, costPrice: parseFloat(e.target.value) || 0 })}
                  />
                </div>
              </div>
            </div>

            {/* Storage & Notes */}
            <div className="space-y-4 pt-4 border-t">
              <h4 className="font-medium text-sm">Additional Details</h4>
              <div className="space-y-2">
                <Label htmlFor="storageLocation">Storage Location</Label>
                <Input
                  id="storageLocation"
                  value={formData.storageLocation}
                  onChange={(e) => setFormData({ ...formData, storageLocation: e.target.value })}
                  placeholder="e.g., Main Storage, Cold Room"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Any additional notes..."
                  rows={2}
                />
              </div>
            </div>
          </div>
        </ScrollArea>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={isSaving}>
            {isSaving ? "Saving..." : isCreating ? "Add Item" : "Save Changes"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ============================================================
// STOCK ADJUSTMENT DIALOG
// ============================================================

interface StockAdjustmentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  item: InventoryItem | null;
  onAdjust: (itemId: string, newQuantity: number, type: TransactionType, notes?: string) => Promise<void>;
}

export function StockAdjustmentDialog({
  open,
  onOpenChange,
  item,
  onAdjust,
}: StockAdjustmentDialogProps) {
  const [adjustmentType, setAdjustmentType] = useState<"add" | "remove" | "set">("add");
  const [quantity, setQuantity] = useState(0);
  const [transactionType, setTransactionType] = useState<TransactionType>("Adjustment");
  const [notes, setNotes] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  React.useEffect(() => {
    if (open) {
      setAdjustmentType("add");
      setQuantity(0);
      setTransactionType("Adjustment");
      setNotes("");
    }
  }, [open]);

  // Calculate new quantity based on adjustment type
  const calculateNewQuantity = () => {
    if (!item) return 0;
    switch (adjustmentType) {
      case "add":
        return item.quantityInHand + quantity;
      case "remove":
        return Math.max(0, item.quantityInHand - quantity);
      case "set":
        return quantity;
      default:
        return item.quantityInHand;
    }
  };

  if (!item) return null;

  const newQuantity = calculateNewQuantity();

  const handleSubmit = async () => {
    setIsSaving(true);
    try {
      await onAdjust(item.id, newQuantity, transactionType, notes);
      onOpenChange(false);
    } catch (error) {
      console.error("Error adjusting stock:", error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Adjust Stock</DialogTitle>
          <DialogDescription>
            Adjust stock for {item.itemName}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="p-4 bg-muted rounded-lg">
            <p className="text-sm text-muted-foreground">Current Stock</p>
            <p className="text-3xl font-bold">{item.quantityInHand} {item.unitType}</p>
          </div>

          <div className="space-y-2">
            <Label>Adjustment Type</Label>
            <div className="grid grid-cols-3 gap-2">
              <Button
                variant={adjustmentType === "add" ? "default" : "outline"}
                onClick={() => setAdjustmentType("add")}
                className="w-full"
              >
                <Plus className="h-4 w-4 mr-1" />
                Add
              </Button>
              <Button
                variant={adjustmentType === "remove" ? "default" : "outline"}
                onClick={() => setAdjustmentType("remove")}
                className="w-full"
              >
                <Minus className="h-4 w-4 mr-1" />
                Remove
              </Button>
              <Button
                variant={adjustmentType === "set" ? "default" : "outline"}
                onClick={() => setAdjustmentType("set")}
                className="w-full"
              >
                Set
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="adjustment-quantity">
              {adjustmentType === "set" ? "New Quantity" : "Quantity"}
            </Label>
            <Input
              id="adjustment-quantity"
              type="number"
              min={0}
              value={quantity}
              onChange={(e) => setQuantity(parseInt(e.target.value) || 0)}
            />
          </div>

          <div className="space-y-2">
            <Label>Reason</Label>
            <Select
              value={transactionType}
              onValueChange={(value) => setTransactionType(value as TransactionType)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {adjustmentType === "add" ? (
                  <>
                    <SelectItem value="Purchase">Purchase</SelectItem>
                    <SelectItem value="Return">Return</SelectItem>
                    <SelectItem value="Adjustment">Adjustment</SelectItem>
                  </>
                ) : (
                  <>
                    <SelectItem value="Usage">Usage</SelectItem>
                    <SelectItem value="Damaged">Damaged</SelectItem>
                    <SelectItem value="Expiry">Expired</SelectItem>
                    <SelectItem value="Adjustment">Adjustment</SelectItem>
                    <SelectItem value="Donation">Donation</SelectItem>
                  </>
                )}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="adjustment-notes">Notes</Label>
            <Textarea
              id="adjustment-notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add notes about this adjustment..."
              rows={2}
            />
          </div>

          <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <p className="text-sm text-blue-600 dark:text-blue-400">New Stock Level</p>
            <p className="text-3xl font-bold text-blue-700 dark:text-blue-300">
              {newQuantity} {item.unitType}
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={isSaving}>
            {isSaving ? "Saving..." : "Update Stock"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ============================================================
// DELETE CONFIRMATION DIALOG
// ============================================================

interface DeleteConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  itemName: string;
  onConfirm: () => Promise<void>;
}

export function DeleteConfirmDialog({
  open,
  onOpenChange,
  itemName,
  onConfirm,
}: DeleteConfirmDialogProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await onConfirm();
      onOpenChange(false);
    } catch (error) {
      console.error("Error deleting item:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-red-600">
            <AlertCircle className="h-5 w-5" />
            Delete Item
          </DialogTitle>
          <DialogDescription>
            Are you sure you want to delete <strong>{itemName}</strong>? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={handleDelete} disabled={isDeleting}>
            {isDeleting ? "Deleting..." : "Delete"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ============================================================
// LOW STOCK ALERT CARD
// ============================================================

interface LowStockAlertCardProps {
  alert: LowStockAlert;
  onAction?: (alertId: string) => void;
}

export function LowStockAlertCard({ alert, onAction }: LowStockAlertCardProps) {
  return (
    <div className={cn(
      "p-4 border rounded-lg",
      alertLevelColors[alert.alertLevel]
    )}>
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-3">
          <div className={cn(
            "p-2 rounded-full",
            alert.alertLevel === "Critical" ? "bg-red-200" : "bg-amber-200"
          )}>
            <AlertTriangle className={cn(
              "h-4 w-4",
              alert.alertLevel === "Critical" ? "text-red-600" : "text-amber-600"
            )} />
          </div>
          <div>
            <p className="font-medium">{alert.itemName}</p>
            <p className="text-sm opacity-80">{alert.itemCode}</p>
            <div className="flex items-center gap-4 mt-2 text-sm">
              <span>Current: <strong>{alert.currentQuantity}</strong></span>
              <span>Reorder Point: <strong>{alert.reorderPoint}</strong></span>
            </div>
          </div>
        </div>
        {onAction && (
          <Button size="sm" variant="outline" onClick={() => onAction(alert.id)}>
            Reorder
          </Button>
        )}
      </div>
    </div>
  );
}

// ============================================================
// CATEGORY FORM DIALOG
// ============================================================

interface CategoryFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  category: InventoryCategory | null;
  onSave: (data: Partial<InventoryCategory>) => Promise<void>;
  isCreating?: boolean;
}

export function CategoryFormDialog({
  open,
  onOpenChange,
  category,
  onSave,
  isCreating = false,
}: CategoryFormDialogProps) {
  const [formData, setFormData] = useState({
    name: "",
    code: "",
    description: "",
    isActive: true,
  });
  const [isSaving, setIsSaving] = useState(false);

  React.useEffect(() => {
    if (category && !isCreating) {
      setFormData({
        name: category.name,
        code: category.code,
        description: category.description || "",
        isActive: category.isActive,
      });
    } else if (isCreating) {
      setFormData({
        name: "",
        code: "",
        description: "",
        isActive: true,
      });
    }
  }, [category, isCreating, open]);

  const handleSubmit = async () => {
    setIsSaving(true);
    try {
      await onSave(formData);
      onOpenChange(false);
    } catch (error) {
      console.error("Error saving category:", error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>
            {isCreating ? "Add New Category" : "Edit Category"}
          </DialogTitle>
          <DialogDescription>
            {isCreating 
              ? "Create a new inventory category"
              : "Update category details"
            }
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="category-name">Category Name *</Label>
            <Input
              id="category-name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Enter category name"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="category-code">Category Code *</Label>
            <Input
              id="category-code"
              value={formData.code}
              onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
              placeholder="e.g., LAB-REG"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="category-description">Description</Label>
            <Textarea
              id="category-description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Enter category description"
              rows={2}
            />
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="category-active"
              checked={formData.isActive}
              onCheckedChange={(checked) => setFormData({ ...formData, isActive: !!checked })}
            />
            <Label htmlFor="category-active">Active</Label>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={isSaving || !formData.name || !formData.code}>
            {isSaving ? "Saving..." : isCreating ? "Add Category" : "Save Changes"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
