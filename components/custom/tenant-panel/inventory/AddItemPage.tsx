/**
 * Add Item Page
 * 
 * Simplified form for adding new inventory items.
 * Clean, easy-to-use interface without unnecessary complexity.
 */

"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import {
  Package,
  ArrowLeft,
  Save,
  AlertCircle,
  CheckCircle2,
  Building2,
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import Link from "next/link";

import type { InventoryCategory, Supplier, ItemStatus, UnitType, Branch } from "./inventory.types";
import { fetchCategories, fetchSuppliers, fetchBranches, createInventoryItem } from "./inventory.data";

const unitTypes: UnitType[] = ["Pieces", "Pack", "Box", "Carton", "Bottle", "Tube", "Vial", "Kit", "Meter", "Gram", "Liter"];
const itemStatuses: ItemStatus[] = ["Active", "Inactive", "On Order"];

interface FormData {
  itemName: string;
  itemCode: string;
  description: string;
  categoryId: string;
  branchId: string;
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

const initialFormData: FormData = {
  itemName: "",
  itemCode: "",
  description: "",
  categoryId: "",
  branchId: "",
  unitType: "Pieces",
  status: "Active",
  supplierId: "",
  customSupplierName: "",
  quantityInHand: 0,
  reorderPoint: 10,
  costPrice: 0,
  storageLocation: "",
  notes: "",
};

export default function AddItemPage() {
  const router = useRouter();
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [categories, setCategories] = useState<InventoryCategory[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [branches, setBranches] = useState<Branch[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [categoriesData, suppliersData, branchesData] = await Promise.all([
        fetchCategories(),
        fetchSuppliers(),
        fetchBranches(),
      ]);
      setCategories(categoriesData);
      setSuppliers(suppliersData);
      setBranches(branchesData);
      
      // Set default branch to main branch if available
      const mainBranch = branchesData.find(b => b.isMainBranch);
      if (mainBranch) {
        setFormData(prev => ({ ...prev, branchId: mainBranch.id }));
      }
    } catch (error) {
      console.error("Error loading data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Generate item code
  const generateItemCode = () => {
    const selectedCategory = categories.find(c => c.id === formData.categoryId);
    const prefix = selectedCategory?.code?.substring(0, 3).toUpperCase() || "ITM";
    const timestamp = Date.now().toString().slice(-4);
    const code = `${prefix}-${timestamp}`;
    setFormData({ ...formData, itemCode: code });
  };

  // Validate form
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.itemName.trim()) {
      newErrors.itemName = "Item name is required";
    }
    if (!formData.itemCode.trim()) {
      newErrors.itemCode = "Item code is required";
    }
    if (!formData.categoryId) {
      newErrors.categoryId = "Category is required";
    }
    if (!formData.branchId) {
      newErrors.branchId = "Branch is required";
    }
    if (formData.costPrice <= 0) {
      newErrors.costPrice = "Cost price must be greater than 0";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSaving(true);
    try {
      const selectedCategory = categories.find(c => c.id === formData.categoryId);
      const selectedSupplier = formData.supplierId === "custom" ? null : suppliers.find(s => s.id === formData.supplierId);
      const selectedBranch = branches.find(b => b.id === formData.branchId);
      
      // Handle custom supplier vs selected supplier
      const isCustomSupplier = formData.supplierId === "custom";
      const supplierName = isCustomSupplier ? formData.customSupplierName : selectedSupplier?.name;
      const supplierId = isCustomSupplier ? undefined : (formData.supplierId || undefined);

      await createInventoryItem({
        itemName: formData.itemName,
        itemCode: formData.itemCode,
        description: formData.description,
        categoryId: formData.categoryId,
        categoryName: selectedCategory?.name || "",
        branchId: formData.branchId,
        branchName: selectedBranch?.name || "",
        unitType: formData.unitType,
        status: formData.status,
        supplierId: supplierId,
        supplierName: supplierName,
        supplierCode: isCustomSupplier ? undefined : selectedSupplier?.code,
        supplierPhone: isCustomSupplier ? undefined : selectedSupplier?.phone,
        quantityInHand: formData.quantityInHand,
        reorderPoint: formData.reorderPoint,
        reorderQuantity: formData.reorderPoint * 2,
        minQuantity: Math.floor(formData.reorderPoint / 2),
        maxQuantity: formData.reorderPoint * 5,
        costPrice: formData.costPrice,
        currency: "INR",
        storageLocation: formData.storageLocation,
        notes: formData.notes,
      });

      setSuccessMessage("Item added successfully!");
      setTimeout(() => {
        router.push("/tenant-panel/inventory/all-items");
      }, 1500);
    } catch (error) {
      console.error("Error creating item:", error);
      setErrors({ submit: "Failed to create item. Please try again." });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Package className="h-12 w-12 mx-auto mb-4 animate-pulse text-muted-foreground" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
      <div className="p-6 mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Link href="/tenant-panel/inventory/all-items">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Add New Item</h1>
            <p className="text-sm text-muted-foreground">
              Add a new item to your inventory
            </p>
          </div>
        </div>

        {/* Success Message */}
        {successMessage && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6"
          >
            <Alert className="bg-green-50 border-green-200">
              <CheckCircle2 className="h-4 w-4 text-green-600" />
              <AlertTitle className="text-green-800">Success</AlertTitle>
              <AlertDescription className="text-green-700">
                {successMessage}
              </AlertDescription>
            </Alert>
          </motion.div>
        )}

        {/* Error Message */}
        {errors.submit && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6"
          >
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{errors.submit}</AlertDescription>
            </Alert>
          </motion.div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="space-y-6">
            {/* Basic Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5" />
                  Item Details
                </CardTitle>
                <CardDescription>Basic information about the item</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Item Name & Code */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="itemName">Item Name *</Label>
                    <Input
                      id="itemName"
                      value={formData.itemName}
                      onChange={(e) => setFormData({ ...formData, itemName: e.target.value })}
                      placeholder="Enter item name"
                      className={errors.itemName ? "border-red-500" : ""}
                    />
                    {errors.itemName && (
                      <p className="text-xs text-red-500">{errors.itemName}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="itemCode">Item Code *</Label>
                    <div className="flex gap-2">
                      <Input
                        id="itemCode"
                        value={formData.itemCode}
                        onChange={(e) => setFormData({ ...formData, itemCode: e.target.value.toUpperCase() })}
                        placeholder="e.g., REG-001"
                        className={errors.itemCode ? "border-red-500" : ""}
                      />
                      <Button type="button" variant="outline" onClick={generateItemCode} size="sm">
                        Generate
                      </Button>
                    </div>
                    {errors.itemCode && (
                      <p className="text-xs text-red-500">{errors.itemCode}</p>
                    )}
                  </div>
                </div>

                {/* Branch & Category */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="flex items-center gap-1">
                      <Building2 className="h-4 w-4" />
                      Branch *
                    </Label>
                    <Select
                      value={formData.branchId}
                      onValueChange={(value) => setFormData({ ...formData, branchId: value })}
                    >
                      <SelectTrigger className={errors.branchId ? "border-red-500" : ""}>
                        <SelectValue placeholder="Select branch" />
                      </SelectTrigger>
                      <SelectContent>
                        {branches.filter(b => b.isActive).map((branch) => (
                          <SelectItem key={branch.id} value={branch.id}>
                            {branch.name} {branch.isMainBranch && "(Main)"}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.branchId && (
                      <p className="text-xs text-red-500">{errors.branchId}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label>Category *</Label>
                    <Select
                      value={formData.categoryId}
                      onValueChange={(value) => setFormData({ ...formData, categoryId: value })}
                    >
                      <SelectTrigger className={errors.categoryId ? "border-red-500" : ""}>
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
                    {errors.categoryId && (
                      <p className="text-xs text-red-500">{errors.categoryId}</p>
                    )}
                  </div>
                </div>

                {/* Unit Type & Status */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Unit Type</Label>
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

                {/* Description */}
                <div className="space-y-2">
                  <Label htmlFor="description">Description (Optional)</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Brief description of the item"
                    rows={2}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Stock & Pricing */}
            <Card>
              <CardHeader>
                <CardTitle>Stock & Pricing</CardTitle>
                <CardDescription>Set initial stock and cost price</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="quantityInHand">Initial Stock</Label>
                    <Input
                      id="quantityInHand"
                      type="number"
                      min={0}
                      value={formData.quantityInHand}
                      onChange={(e) => setFormData({ ...formData, quantityInHand: parseInt(e.target.value) || 0 })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="reorderPoint">Reorder Point</Label>
                    <Input
                      id="reorderPoint"
                      type="number"
                      min={0}
                      value={formData.reorderPoint}
                      onChange={(e) => setFormData({ ...formData, reorderPoint: parseInt(e.target.value) || 0 })}
                    />
                    <p className="text-xs text-muted-foreground">Alert when stock falls below this</p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="costPrice">Cost Price (₹) *</Label>
                    <Input
                      id="costPrice"
                      type="number"
                      min={0}
                      step="0.01"
                      value={formData.costPrice}
                      onChange={(e) => setFormData({ ...formData, costPrice: parseFloat(e.target.value) || 0 })}
                      className={errors.costPrice ? "border-red-500" : ""}
                    />
                    {errors.costPrice && (
                      <p className="text-xs text-red-500">{errors.costPrice}</p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Supplier & Location */}
            <Card>
              <CardHeader>
                <CardTitle>Additional Info</CardTitle>
                <CardDescription>Optional supplier and storage details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Supplier (Optional)</Label>
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
                            {sup.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {formData.supplierId === "custom" && (
                      <Input
                        value={formData.customSupplierName || ""}
                        onChange={(e) => setFormData({ ...formData, customSupplierName: e.target.value })}
                        placeholder="Enter custom supplier name"
                        className="mt-2"
                      />
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="storageLocation">Storage Location (Optional)</Label>
                    <Input
                      id="storageLocation"
                      value={formData.storageLocation}
                      onChange={(e) => setFormData({ ...formData, storageLocation: e.target.value })}
                      placeholder="e.g., Main Storage, Cold Room"
                    />
                  </div>
                </div>

                {/* Notes */}
                <div className="space-y-2">
                  <Label htmlFor="notes">Notes (Optional)</Label>
                  <Textarea
                    id="notes"
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    placeholder="Any additional notes..."
                    rows={2}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Actions */}
            <div className="flex gap-3 justify-end">
              <Link href="/tenant-panel/inventory/all-items">
                <Button type="button" variant="outline">
                  Cancel
                </Button>
              </Link>
              <Button type="submit" disabled={isSaving}>
                {isSaving ? (
                  <>Saving...</>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Add Item
                  </>
                )}
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
