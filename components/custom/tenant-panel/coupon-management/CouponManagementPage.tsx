"use client";

import { useState, useMemo } from "react";
import { format, parseISO } from "date-fns";
import {
  mockCoupons,
  testOptions,
  packageOptions,
  getCouponStats,
  isExpired,
  formatDiscountValue,
} from "./coupon.data";
import type { Coupon, CouponFormData } from "./coupon.types";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";
import {
  Plus,
  Search,
  MoreHorizontal,
  Pencil,
  Trash2,
  Ticket,
  Percent,
  IndianRupee,
  Users,
  Copy,
  CheckCircle2,
  XCircle,
  AlertTriangle,
} from "lucide-react";

const initialFormData: CouponFormData = {
  code: "",
  description: "",
  discountType: "percentage",
  discountValue: 10,
  minOrderValue: undefined,
  maxDiscount: undefined,
  validFrom: new Date().toISOString().split("T")[0],
  validUntil: "",
  usageLimit: undefined,
  applicableTests: [],
  applicablePackages: [],
};

export default function CouponManagementPage() {
  const [coupons, setCoupons] = useState<Coupon[]>(mockCoupons);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  // Dialog states
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState<Coupon | null>(null);
  const [deletingCoupon, setDeletingCoupon] = useState<Coupon | null>(null);

  // Form state
  const [formData, setFormData] = useState<CouponFormData>(initialFormData);

  const stats = useMemo(() => getCouponStats(coupons), [coupons]);

  // Filtered coupons
  const filteredCoupons = useMemo(() => {
    return coupons.filter((coupon) => {
      const matchesSearch =
        coupon.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
        coupon.description.toLowerCase().includes(searchQuery.toLowerCase());

      let matchesStatus = true;
      if (statusFilter === "active") {
        matchesStatus = coupon.isActive && !isExpired(coupon.validUntil);
      } else if (statusFilter === "inactive") {
        matchesStatus = !coupon.isActive;
      } else if (statusFilter === "expired") {
        matchesStatus = isExpired(coupon.validUntil);
      }

      return matchesSearch && matchesStatus;
    });
  }, [coupons, searchQuery, statusFilter]);

  const handleOpenCreate = () => {
    setEditingCoupon(null);
    setFormData(initialFormData);
    setIsFormOpen(true);
  };

  const handleOpenEdit = (coupon: Coupon) => {
    setEditingCoupon(coupon);
    setFormData({
      code: coupon.code,
      description: coupon.description,
      discountType: coupon.discountType,
      discountValue: coupon.discountValue,
      minOrderValue: coupon.minOrderValue,
      maxDiscount: coupon.maxDiscount,
      validFrom: coupon.validFrom,
      validUntil: coupon.validUntil,
      usageLimit: coupon.usageLimit,
      applicableTests: coupon.applicableTests,
      applicablePackages: coupon.applicablePackages,
    });
    setIsFormOpen(true);
  };

  const handleOpenDelete = (coupon: Coupon) => {
    setDeletingCoupon(coupon);
    setIsDeleteOpen(true);
  };

  const handleToggleActive = (coupon: Coupon) => {
    setCoupons(
      coupons.map((c) =>
        c.id === coupon.id
          ? { ...c, isActive: !c.isActive, updatedAt: new Date().toISOString().split("T")[0] }
          : c
      )
    );
    toast.success(coupon.isActive ? "Coupon deactivated" : "Coupon activated", {
      description: `${coupon.code} is now ${coupon.isActive ? "inactive" : "active"}.`,
    });
  };

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    toast.success("Coupon code copied!", {
      description: code,
    });
  };

  const handleSave = () => {
    // Validation
    if (!formData.code.trim()) {
      toast.error("Please enter a coupon code");
      return;
    }
    if (!formData.discountValue || formData.discountValue <= 0) {
      toast.error("Please enter a valid discount value");
      return;
    }
    if (!formData.validUntil) {
      toast.error("Please select an expiry date");
      return;
    }
    if (formData.applicableTests.length === 0 && formData.applicablePackages.length === 0) {
      toast.error("Please select at least one test or package");
      return;
    }

    // Check for duplicate code
    const isDuplicate = coupons.some(
      (c) => c.code.toLowerCase() === formData.code.toLowerCase() && c.id !== editingCoupon?.id
    );
    if (isDuplicate) {
      toast.error("Coupon code already exists");
      return;
    }

    if (editingCoupon) {
      // Update existing
      setCoupons(
        coupons.map((c) =>
          c.id === editingCoupon.id
            ? {
                ...c,
                ...formData,
                updatedAt: new Date().toISOString().split("T")[0],
              }
            : c
        )
      );
      toast.success("Coupon updated successfully!");
    } else {
      // Create new
      const newCoupon: Coupon = {
        id: `coupon-${Date.now()}`,
        ...formData,
        usedCount: 0,
        isActive: true,
        createdAt: new Date().toISOString().split("T")[0],
        updatedAt: new Date().toISOString().split("T")[0],
      };
      setCoupons([newCoupon, ...coupons]);
      toast.success("Coupon created successfully!");
    }

    setIsFormOpen(false);
    setFormData(initialFormData);
    setEditingCoupon(null);
  };

  const handleDelete = () => {
    if (deletingCoupon) {
      setCoupons(coupons.filter((c) => c.id !== deletingCoupon.id));
      toast.success("Coupon deleted", {
        description: `${deletingCoupon.code} has been removed.`,
      });
      setIsDeleteOpen(false);
      setDeletingCoupon(null);
    }
  };

  const handleTestToggle = (testId: string) => {
    setFormData((prev) => ({
      ...prev,
      applicableTests: prev.applicableTests.includes(testId)
        ? prev.applicableTests.filter((id) => id !== testId)
        : [...prev.applicableTests, testId],
    }));
  };

  const handlePackageToggle = (packageId: string) => {
    setFormData((prev) => ({
      ...prev,
      applicablePackages: prev.applicablePackages.includes(packageId)
        ? prev.applicablePackages.filter((id) => id !== packageId)
        : [...prev.applicablePackages, packageId],
    }));
  };

  const handleSelectAllTests = () => {
    const allTestIds = testOptions.map((t) => t.id);
    const allSelected = formData.applicableTests.length === allTestIds.length;
    setFormData((prev) => ({
      ...prev,
      applicableTests: allSelected ? [] : allTestIds,
    }));
  };

  const handleSelectAllPackages = () => {
    const allPackageIds = packageOptions.map((p) => p.id);
    const allSelected = formData.applicablePackages.length === allPackageIds.length;
    setFormData((prev) => ({
      ...prev,
      applicablePackages: allSelected ? [] : allPackageIds,
    }));
  };

  const getStatusBadge = (coupon: Coupon) => {
    if (isExpired(coupon.validUntil)) {
      return (
        <Badge variant="secondary" className="bg-gray-100 text-gray-600">
          <AlertTriangle className="h-3 w-3 mr-1" />
          Expired
        </Badge>
      );
    }
    if (coupon.isActive) {
      return (
        <Badge className="bg-emerald-100 text-emerald-700">
          <CheckCircle2 className="h-3 w-3 mr-1" />
          Active
        </Badge>
      );
    }
    return (
      <Badge variant="secondary" className="bg-red-100 text-red-700">
        <XCircle className="h-3 w-3 mr-1" />
        Inactive
      </Badge>
    );
  };

  return (
    <div className="p-6 lg:p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Coupon Management</h1>
          <p className="text-muted-foreground">Create and manage discount coupons</p>
        </div>
        <Button onClick={handleOpenCreate} className="gap-2">
          <Plus className="h-4 w-4" />
          Add Coupon
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Ticket className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.total}</p>
                <p className="text-xs text-muted-foreground">Total Coupons</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-emerald-100 rounded-lg">
                <CheckCircle2 className="h-5 w-5 text-emerald-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.active}</p>
                <p className="text-xs text-muted-foreground">Active</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-red-100 rounded-lg">
                <XCircle className="h-5 w-5 text-red-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.inactive}</p>
                <p className="text-xs text-muted-foreground">Inactive</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Users className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.totalUsage}</p>
                <p className="text-xs text-muted-foreground">Total Uses</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by code or description..."
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
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
                <SelectItem value="expired">Expired</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Coupons Table */}
      <Card>
        <CardContent className="p-0">
          {filteredCoupons.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12">
              <Ticket className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Coupons Found</h3>
              <p className="text-muted-foreground text-center mb-4">
                {searchQuery || statusFilter !== "all"
                  ? "No coupons match your filters."
                  : "Create your first coupon to get started."}
              </p>
              {!searchQuery && statusFilter === "all" && (
                <Button onClick={handleOpenCreate}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Coupon
                </Button>
              )}
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Coupon Code</TableHead>
                  <TableHead>Discount</TableHead>
                  <TableHead className="hidden md:table-cell">Validity</TableHead>
                  <TableHead className="hidden lg:table-cell">Usage</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="hidden md:table-cell">Applicable To</TableHead>
                  <TableHead className="w-12"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCoupons.map((coupon) => (
                  <TableRow key={coupon.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <code className="bg-muted px-2 py-1 rounded font-mono text-sm font-semibold">
                          {coupon.code}
                        </code>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6"
                          onClick={() => handleCopyCode(coupon.code)}
                        >
                          <Copy className="h-3 w-3" />
                        </Button>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1 line-clamp-1">
                        {coupon.description}
                      </p>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        {coupon.discountType === "percentage" ? (
                          <Percent className="h-4 w-4 text-blue-500" />
                        ) : (
                          <IndianRupee className="h-4 w-4 text-green-500" />
                        )}
                        <span className="font-semibold">{formatDiscountValue(coupon)}</span>
                      </div>
                      {coupon.minOrderValue && (
                        <p className="text-xs text-muted-foreground">
                          Min: ₹{coupon.minOrderValue}
                        </p>
                      )}
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      <div className="text-sm">
                        <p>{format(parseISO(coupon.validFrom), "dd MMM yyyy")}</p>
                        <p className="text-muted-foreground">
                          to {format(parseISO(coupon.validUntil), "dd MMM yyyy")}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell className="hidden lg:table-cell">
                      <div className="text-sm">
                        <span className="font-semibold">{coupon.usedCount}</span>
                        {coupon.usageLimit && (
                          <span className="text-muted-foreground"> / {coupon.usageLimit}</span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>{getStatusBadge(coupon)}</TableCell>
                    <TableCell className="hidden md:table-cell">
                      <div className="flex flex-wrap gap-1">
                        {coupon.applicableTests.length > 0 && (
                          <Badge variant="outline" className="text-xs">
                            {coupon.applicableTests.length} Tests
                          </Badge>
                        )}
                        {coupon.applicablePackages.length > 0 && (
                          <Badge variant="outline" className="text-xs">
                            {coupon.applicablePackages.length} Packages
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleOpenEdit(coupon)}>
                            <Pencil className="h-4 w-4 mr-2" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleToggleActive(coupon)}>
                            {coupon.isActive ? (
                              <>
                                <XCircle className="h-4 w-4 mr-2" />
                                Deactivate
                              </>
                            ) : (
                              <>
                                <CheckCircle2 className="h-4 w-4 mr-2" />
                                Activate
                              </>
                            )}
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleOpenDelete(coupon)}
                            className="text-red-600"
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Create/Edit Dialog */}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Ticket className="h-5 w-5" />
              {editingCoupon ? "Edit Coupon" : "Create New Coupon"}
            </DialogTitle>
            <DialogDescription>
              {editingCoupon
                ? "Update the coupon details below."
                : "Fill in the details to create a new discount coupon."}
            </DialogDescription>
          </DialogHeader>

          <ScrollArea className="max-h-[60vh] pr-4">
            <div className="space-y-6">
              {/* Basic Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="code">Coupon Code *</Label>
                  <Input
                    id="code"
                    placeholder="e.g., SAVE20"
                    value={formData.code}
                    onChange={(e) =>
                      setFormData({ ...formData, code: e.target.value.toUpperCase() })
                    }
                    className="font-mono uppercase"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="discountType">Discount Type *</Label>
                  <Select
                    value={formData.discountType}
                    onValueChange={(value: "percentage" | "flat") =>
                      setFormData({ ...formData, discountType: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="percentage">
                        <div className="flex items-center gap-2">
                          <Percent className="h-4 w-4" />
                          Percentage (%)
                        </div>
                      </SelectItem>
                      <SelectItem value="flat">
                        <div className="flex items-center gap-2">
                          <IndianRupee className="h-4 w-4" />
                          Flat Amount (₹)
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Brief description of the coupon..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={2}
                />
              </div>

              {/* Discount Values */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="discountValue">
                    Discount Value * {formData.discountType === "percentage" ? "(%)" : "(₹)"}
                  </Label>
                  <Input
                    id="discountValue"
                    type="number"
                    min="1"
                    max={formData.discountType === "percentage" ? 100 : undefined}
                    value={formData.discountValue}
                    onChange={(e) =>
                      setFormData({ ...formData, discountValue: Number(e.target.value) })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="minOrderValue">Min Order Value (₹)</Label>
                  <Input
                    id="minOrderValue"
                    type="number"
                    min="0"
                    placeholder="Optional"
                    value={formData.minOrderValue || ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        minOrderValue: e.target.value ? Number(e.target.value) : undefined,
                      })
                    }
                  />
                </div>
                {formData.discountType === "percentage" && (
                  <div className="space-y-2">
                    <Label htmlFor="maxDiscount">Max Discount (₹)</Label>
                    <Input
                      id="maxDiscount"
                      type="number"
                      min="0"
                      placeholder="Optional cap"
                      value={formData.maxDiscount || ""}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          maxDiscount: e.target.value ? Number(e.target.value) : undefined,
                        })
                      }
                    />
                  </div>
                )}
              </div>

              {/* Validity */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="validFrom">Valid From *</Label>
                  <Input
                    id="validFrom"
                    type="date"
                    value={formData.validFrom}
                    onChange={(e) => setFormData({ ...formData, validFrom: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="validUntil">Valid Until *</Label>
                  <Input
                    id="validUntil"
                    type="date"
                    value={formData.validUntil}
                    onChange={(e) => setFormData({ ...formData, validUntil: e.target.value })}
                    min={formData.validFrom}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="usageLimit">Usage Limit</Label>
                  <Input
                    id="usageLimit"
                    type="number"
                    min="1"
                    placeholder="Unlimited"
                    value={formData.usageLimit || ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        usageLimit: e.target.value ? Number(e.target.value) : undefined,
                      })
                    }
                  />
                </div>
              </div>

              {/* Applicable Tests */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label>Applicable Tests</Label>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={handleSelectAllTests}
                    className="text-xs h-7"
                  >
                    {formData.applicableTests.length === testOptions.length
                      ? "Deselect All"
                      : "Select All"}
                  </Button>
                </div>
                <div className="border rounded-lg p-3 max-h-40 overflow-y-auto">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {testOptions.map((test) => (
                      <label
                        key={test.id}
                        className="flex items-center gap-2 p-2 rounded hover:bg-muted cursor-pointer"
                      >
                        <Checkbox
                          checked={formData.applicableTests.includes(test.id)}
                          onCheckedChange={() => handleTestToggle(test.id)}
                        />
                        <span className="text-sm flex-1">{test.title}</span>
                        <span className="text-xs text-muted-foreground">₹{test.price}</span>
                      </label>
                    ))}
                  </div>
                </div>
                {formData.applicableTests.length > 0 && (
                  <p className="text-xs text-muted-foreground">
                    {formData.applicableTests.length} test(s) selected
                  </p>
                )}
              </div>

              {/* Applicable Packages */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label>Applicable Packages</Label>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={handleSelectAllPackages}
                    className="text-xs h-7"
                  >
                    {formData.applicablePackages.length === packageOptions.length
                      ? "Deselect All"
                      : "Select All"}
                  </Button>
                </div>
                <div className="border rounded-lg p-3 max-h-40 overflow-y-auto">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {packageOptions.map((pkg) => (
                      <label
                        key={pkg.id}
                        className="flex items-center gap-2 p-2 rounded hover:bg-muted cursor-pointer"
                      >
                        <Checkbox
                          checked={formData.applicablePackages.includes(pkg.id)}
                          onCheckedChange={() => handlePackageToggle(pkg.id)}
                        />
                        <span className="text-sm flex-1">{pkg.title}</span>
                        <span className="text-xs text-muted-foreground">{pkg.price}</span>
                      </label>
                    ))}
                  </div>
                </div>
                {formData.applicablePackages.length > 0 && (
                  <p className="text-xs text-muted-foreground">
                    {formData.applicablePackages.length} package(s) selected
                  </p>
                )}
              </div>
            </div>
          </ScrollArea>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsFormOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave}>
              {editingCoupon ? "Update Coupon" : "Create Coupon"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Coupon</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete{" "}
              <span className="font-semibold text-foreground">{deletingCoupon?.code}</span>? This
              action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
