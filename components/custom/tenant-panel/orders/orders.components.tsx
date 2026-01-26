"use client";

import React, { useState, useMemo } from "react";
import { format } from "date-fns";
import { CalendarIcon, Search, X, TestTube, Package, IndianRupee, ChevronDown, ChevronUp, Filter, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
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
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { motion, AnimatePresence } from "framer-motion";

import type { Order, Gender, PaymentMode, OrderTestItem, OrderPackageItem } from "./orders.types";
import { availableTests, availablePackages, testCategories, packageCategories } from "@/components/custom/pages/booking/booking.data";

// ============================================================
// Consistent Status Colors for all Order Management pages
// ============================================================
export const statusColors: Record<string, string> = {
  Pending: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  "Sample Collected": "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
  Processing: "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400",
  "Report Ready": "bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-400",
  Completed: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  Cancelled: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
};

export const collectionStatusColors: Record<string, string> = {
  Scheduled: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  Assigned: "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400",
  "En Route": "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  Collected: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  Cancelled: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
};

export const paymentStatusColors: Record<string, string> = {
  Paid: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  Pending: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  Partial: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  Refunded: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
};

// ============================================================
// Date Range Picker Component
// ============================================================
interface DateRange {
  from: Date | undefined;
  to: Date | undefined;
}

interface DateRangePickerProps {
  dateRange: DateRange;
  onDateRangeChange: (range: DateRange) => void;
  className?: string;
}

export function DateRangePicker({ dateRange, onDateRangeChange, className }: DateRangePickerProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "justify-start text-left font-normal",
            !dateRange.from && "text-muted-foreground",
            className
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {dateRange.from ? (
            dateRange.to ? (
              <>
                {format(dateRange.from, "dd MMM")} - {format(dateRange.to, "dd MMM yyyy")}
              </>
            ) : (
              format(dateRange.from, "dd MMM yyyy")
            )
          ) : (
            "Select date range"
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          initialFocus
          mode="range"
          defaultMonth={dateRange.from}
          selected={{ from: dateRange.from, to: dateRange.to }}
          onSelect={(range) => onDateRangeChange({ from: range?.from, to: range?.to })}
          numberOfMonths={2}
        />
        <div className="flex items-center justify-between p-3 border-t">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDateRangeChange({ from: undefined, to: undefined })}
          >
            Clear
          </Button>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                const today = new Date();
                onDateRangeChange({ from: today, to: today });
              }}
            >
              Today
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                const today = new Date();
                const weekAgo = new Date(today);
                weekAgo.setDate(today.getDate() - 7);
                onDateRangeChange({ from: weekAgo, to: today });
              }}
            >
              Last 7 days
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}

// ============================================================
// View Order Details Dialog Component
// ============================================================
interface ViewOrderDetailsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  order: Order | null;
}

function formatINR(amount: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function ViewOrderDetailsDialog({ open, onOpenChange, order }: ViewOrderDetailsDialogProps) {
  if (!order) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            Order Details - {order.orderNumber}
            <Badge className={statusColors[order.status]}>{order.status}</Badge>
          </DialogTitle>
          <DialogDescription>
            Complete details of the order placed on {new Date(order.createdAt).toLocaleDateString("en-IN", {
              day: "2-digit",
              month: "long",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Order Info */}
          <div className="grid grid-cols-2 gap-4 p-4 bg-muted/50 rounded-lg">
            <div>
              <p className="text-xs text-muted-foreground">Order Number</p>
              <p className="font-medium">{order.orderNumber}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Source</p>
              <Badge variant="outline">{order.source}</Badge>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Branch</p>
              <p className="font-medium">{order.branchName} ({order.branchCode})</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Created At</p>
              <p className="font-medium">
                {new Date(order.createdAt).toLocaleDateString("en-IN", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>
          </div>

          <Separator />

          {/* Patient Details */}
          <div>
            <h4 className="font-semibold mb-3">Patient Details</h4>
            <div className="grid grid-cols-2 gap-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <div>
                <p className="text-xs text-muted-foreground">Full Name</p>
                <p className="font-medium">{order.patient.name}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Mobile Number</p>
                <p className="font-medium">{order.patient.mobile}</p>
              </div>
              {order.patient.email && (
                <div>
                  <p className="text-xs text-muted-foreground">Email</p>
                  <p className="font-medium">{order.patient.email}</p>
                </div>
              )}
              {order.patient.age && (
                <div>
                  <p className="text-xs text-muted-foreground">Age</p>
                  <p className="font-medium">{order.patient.age} years</p>
                </div>
              )}
              {order.patient.gender && (
                <div>
                  <p className="text-xs text-muted-foreground">Gender</p>
                  <p className="font-medium">{order.patient.gender}</p>
                </div>
              )}
              {order.patient.address && (
                <div className="col-span-2">
                  <p className="text-xs text-muted-foreground">Address</p>
                  <p className="font-medium">{order.patient.address}</p>
                </div>
              )}
              {order.patient.city && (
                <div>
                  <p className="text-xs text-muted-foreground">City</p>
                  <p className="font-medium">{order.patient.city}</p>
                </div>
              )}
              {order.patient.pincode && (
                <div>
                  <p className="text-xs text-muted-foreground">Pincode</p>
                  <p className="font-medium">{order.patient.pincode}</p>
                </div>
              )}
            </div>
          </div>

          {/* Home Collection Details */}
          {order.homeCollection && (
            <>
              <Separator />
              <div>
                <h4 className="font-semibold mb-3">Home Collection Details</h4>
                <div className="grid grid-cols-2 gap-4 p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                  <div>
                    <p className="text-xs text-muted-foreground">Scheduled Date</p>
                    <p className="font-medium">{order.homeCollection.scheduledDate}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Scheduled Time</p>
                    <p className="font-medium">{order.homeCollection.scheduledTime}</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-xs text-muted-foreground">Collection Address</p>
                    <p className="font-medium">{order.homeCollection.address}</p>
                  </div>
                  {order.homeCollection.landmark && (
                    <div className="col-span-2">
                      <p className="text-xs text-muted-foreground">Landmark</p>
                      <p className="font-medium">{order.homeCollection.landmark}</p>
                    </div>
                  )}
                  <div>
                    <p className="text-xs text-muted-foreground">City</p>
                    <p className="font-medium">{order.homeCollection.city}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Pincode</p>
                    <p className="font-medium">{order.homeCollection.pincode}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Collection Status</p>
                    <Badge className={collectionStatusColors[order.homeCollection.collectionStatus]}>
                      {order.homeCollection.collectionStatus}
                    </Badge>
                  </div>
                  {order.homeCollection.collectorName && (
                    <div>
                      <p className="text-xs text-muted-foreground">Collector</p>
                      <p className="font-medium">{order.homeCollection.collectorName}</p>
                    </div>
                  )}
                  {order.homeCollection.collectionNotes && (
                    <div className="col-span-2">
                      <p className="text-xs text-muted-foreground">Collection Notes</p>
                      <p className="font-medium">{order.homeCollection.collectionNotes}</p>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}

          {/* Slot Booking Details */}
          {order.slotBooking && (
            <>
              <Separator />
              <div>
                <h4 className="font-semibold mb-3">Slot Booking Details</h4>
                <div className="grid grid-cols-2 gap-4 p-4 bg-amber-50 dark:bg-amber-900/20 rounded-lg">
                  <div>
                    <p className="text-xs text-muted-foreground">Slot Date</p>
                    <p className="font-medium">{order.slotBooking.slotDate}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Slot Time</p>
                    <p className="font-medium">{order.slotBooking.slotTime}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Details Status</p>
                    <Badge variant={order.slotBooking.isDetailsComplete ? "default" : "destructive"}>
                      {order.slotBooking.isDetailsComplete ? "Complete" : "Incomplete"}
                    </Badge>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Tests */}
          {order.tests.length > 0 && (
            <>
              <Separator />
              <div>
                <h4 className="font-semibold mb-3">Tests ({order.tests.length})</h4>
                <div className="space-y-2">
                  {order.tests.map((test) => (
                    <div
                      key={test.id}
                      className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
                    >
                      <div>
                        <p className="font-medium">{test.testName}</p>
                        <p className="text-xs text-muted-foreground">Code: {test.testCode}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">{formatINR(test.finalPrice)}</p>
                        {test.discount > 0 && (
                          <p className="text-xs text-muted-foreground line-through">
                            {formatINR(test.price)}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* Packages */}
          {order.packages.length > 0 && (
            <>
              <Separator />
              <div>
                <h4 className="font-semibold mb-3">Packages ({order.packages.length})</h4>
                <div className="space-y-2">
                  {order.packages.map((pkg) => (
                    <div
                      key={pkg.id}
                      className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
                    >
                      <div>
                        <p className="font-medium">{pkg.packageName}</p>
                        <p className="text-xs text-muted-foreground">
                          {pkg.testsIncluded} tests included
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">{formatINR(pkg.finalPrice)}</p>
                        {pkg.discount > 0 && (
                          <p className="text-xs text-muted-foreground line-through">
                            {formatINR(pkg.price)}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          <Separator />

          {/* Payment Details */}
          <div>
            <h4 className="font-semibold mb-3">Payment Details</h4>
            <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg space-y-3">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <span>{formatINR(order.subtotal)}</span>
              </div>
              {order.discount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Discount</span>
                  <span>- {formatINR(order.discount)}</span>
                </div>
              )}
              {order.tax > 0 && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Tax</span>
                  <span>{formatINR(order.tax)}</span>
                </div>
              )}
              <Separator />
              <div className="flex justify-between font-semibold text-lg">
                <span>Total Amount</span>
                <span>{formatINR(order.totalAmount)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Payment Status</span>
                <Badge className={paymentStatusColors[order.paymentStatus]}>
                  {order.paymentStatus}
                </Badge>
              </div>
              {order.paymentMode && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Payment Mode</span>
                  <span>{order.paymentMode}</span>
                </div>
              )}
              {order.paidAmount > 0 && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Paid Amount</span>
                  <span className="text-green-600">{formatINR(order.paidAmount)}</span>
                </div>
              )}
              {order.dueAmount > 0 && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Due Amount</span>
                  <span className="text-red-600">{formatINR(order.dueAmount)}</span>
                </div>
              )}
            </div>
          </div>

          {/* Additional Info */}
          {(order.referringDoctor || order.notes || order.sampleId) && (
            <>
              <Separator />
              <div>
                <h4 className="font-semibold mb-3">Additional Information</h4>
                <div className="grid grid-cols-2 gap-4 p-4 bg-muted/50 rounded-lg">
                  {order.referringDoctor && (
                    <div>
                      <p className="text-xs text-muted-foreground">Referring Doctor</p>
                      <p className="font-medium">{order.referringDoctor}</p>
                    </div>
                  )}
                  {order.sampleId && (
                    <div>
                      <p className="text-xs text-muted-foreground">Sample ID</p>
                      <p className="font-medium">{order.sampleId}</p>
                    </div>
                  )}
                  {order.notes && (
                    <div className="col-span-2">
                      <p className="text-xs text-muted-foreground">Notes</p>
                      <p className="font-medium">{order.notes}</p>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
        </div>

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
// Edit Order Dialog Component
// ============================================================
interface EditOrderDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  order: Order | null;
  onSave: (updatedOrder: Partial<Order>) => Promise<void>;
}

export function EditOrderDialog({ open, onOpenChange, order, onSave }: EditOrderDialogProps) {
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: order?.patient.name || "",
    mobile: order?.patient.mobile || "",
    email: order?.patient.email || "",
    age: order?.patient.age?.toString() || "",
    gender: order?.patient.gender || ("" as Gender | ""),
    address: order?.patient.address || "",
    city: order?.patient.city || "",
    pincode: order?.patient.pincode || "",
    notes: order?.notes || "",
    referringDoctor: order?.referringDoctor || "",
  });

  // Reset form when order changes
  React.useEffect(() => {
    if (order) {
      setFormData({
        name: order.patient.name || "",
        mobile: order.patient.mobile || "",
        email: order.patient.email || "",
        age: order.patient.age?.toString() || "",
        gender: order.patient.gender || "",
        address: order.patient.address || "",
        city: order.patient.city || "",
        pincode: order.patient.pincode || "",
        notes: order.notes || "",
        referringDoctor: order.referringDoctor || "",
      });
    }
  }, [order]);

  if (!order) return null;

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await onSave({
        patient: {
          ...order.patient,
          name: formData.name,
          mobile: formData.mobile,
          email: formData.email || undefined,
          age: formData.age ? parseInt(formData.age) : undefined,
          gender: formData.gender || undefined,
          address: formData.address || undefined,
          city: formData.city || undefined,
          pincode: formData.pincode || undefined,
        },
        notes: formData.notes || undefined,
        referringDoctor: formData.referringDoctor || undefined,
      });
      onOpenChange(false);
    } catch (error) {
      console.error("Error saving order:", error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Order - {order.orderNumber}</DialogTitle>
          <DialogDescription>Update patient details and order information</DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Full Name *</Label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Patient name"
              />
            </div>
            <div className="space-y-2">
              <Label>Mobile Number *</Label>
              <Input
                value={formData.mobile}
                onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                placeholder="10-digit mobile"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Email</Label>
            <Input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="Email address"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Age</Label>
              <Input
                type="number"
                value={formData.age}
                onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                placeholder="Age in years"
              />
            </div>
            <div className="space-y-2">
              <Label>Gender</Label>
              <Select
                value={formData.gender}
                onValueChange={(v: Gender) => setFormData({ ...formData, gender: v })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Male">Male</SelectItem>
                  <SelectItem value="Female">Female</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Address</Label>
            <Input
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              placeholder="Full address"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>City</Label>
              <Input
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                placeholder="City"
              />
            </div>
            <div className="space-y-2">
              <Label>Pincode</Label>
              <Input
                value={formData.pincode}
                onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                placeholder="6-digit pincode"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Referring Doctor</Label>
            <Input
              value={formData.referringDoctor}
              onChange={(e) => setFormData({ ...formData, referringDoctor: e.target.value })}
              placeholder="Doctor name"
            />
          </div>

          <div className="space-y-2">
            <Label>Notes</Label>
            <Textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="Additional notes..."
              rows={3}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={isSaving || !formData.name || !formData.mobile}>
            {isSaving ? "Saving..." : "Save Changes"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ============================================================
// Test & Package Selector Component (for Slot Booking)
// ============================================================
interface TestPackageSelectorProps {
  selectedTestIds: string[];
  selectedPackageIds: string[];
  onTestsChange: (testIds: string[]) => void;
  onPackagesChange: (packageIds: string[]) => void;
}

export function TestPackageSelector({
  selectedTestIds,
  selectedPackageIds,
  onTestsChange,
  onPackagesChange,
}: TestPackageSelectorProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<"tests" | "packages">("tests");
  const [selectedTestCategory, setSelectedTestCategory] = useState("All");
  const [selectedPackageCategory, setSelectedPackageCategory] = useState("All");
  const [showFilters, setShowFilters] = useState(false);

  // Filter tests based on search and category
  const filteredTests = useMemo(() => {
    return availableTests.filter((test) => {
      const matchesSearch =
        test.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        test.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
        test.category.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory =
        selectedTestCategory === "All" || test.category === selectedTestCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, selectedTestCategory]);

  // Filter packages based on search and category
  const filteredPackages = useMemo(() => {
    return availablePackages.filter((pkg) => {
      const matchesSearch =
        pkg.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        pkg.category.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory =
        selectedPackageCategory === "All" || pkg.category === selectedPackageCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, selectedPackageCategory]);

  // Calculate totals
  const testsTotal = selectedTestIds.reduce((sum, id) => {
    const test = availableTests.find((t) => t.id === id);
    return sum + (test?.price || 0);
  }, 0);

  const packagesTotal = selectedPackageIds.reduce((sum, id) => {
    const pkg = availablePackages.find((p) => p.id === id);
    return sum + (pkg?.price || 0);
  }, 0);

  const grandTotal = testsTotal + packagesTotal;

  // Handle test selection
  const handleTestToggle = (testId: string, checked: boolean) => {
    if (checked) {
      onTestsChange([...selectedTestIds, testId]);
    } else {
      onTestsChange(selectedTestIds.filter((id) => id !== testId));
    }
  };

  // Handle package selection
  const handlePackageToggle = (packageId: string, checked: boolean) => {
    if (checked) {
      onPackagesChange([...selectedPackageIds, packageId]);
    } else {
      onPackagesChange(selectedPackageIds.filter((id) => id !== packageId));
    }
  };

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Search tests or packages..."
          className="pl-9"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        {searchQuery && (
          <button
            type="button"
            onClick={() => setSearchQuery("")}
            className="absolute right-3 top-1/2 -translate-y-1/2"
          >
            <X className="w-4 h-4 text-muted-foreground hover:text-foreground" />
          </button>
        )}
      </div>

      {/* Tabs */}
      <Tabs
        value={activeTab}
        onValueChange={(v) => setActiveTab(v as "tests" | "packages")}
        className="w-full"
      >
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="tests" className="flex items-center gap-2">
            <TestTube className="w-4 h-4" />
            Tests
            {selectedTestIds.length > 0 && (
              <Badge className="ml-1 bg-blue-100 text-blue-700 hover:bg-blue-100">
                {selectedTestIds.length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="packages" className="flex items-center gap-2">
            <Package className="w-4 h-4" />
            Packages
            {selectedPackageIds.length > 0 && (
              <Badge className="ml-1 bg-purple-100 text-purple-700 hover:bg-purple-100">
                {selectedPackageIds.length}
              </Badge>
            )}
          </TabsTrigger>
        </TabsList>

        {/* Filter Toggle */}
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => setShowFilters(!showFilters)}
          className="mt-3"
        >
          <Filter className="w-4 h-4 mr-2" />
          Filters
          {showFilters ? (
            <ChevronUp className="w-4 h-4 ml-2" />
          ) : (
            <ChevronDown className="w-4 h-4 ml-2" />
          )}
        </Button>

        {/* Category Filters */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden mt-2"
            >
              <div className="flex flex-wrap gap-2 p-3 bg-muted/50 rounded-lg">
                {(activeTab === "tests" ? testCategories : packageCategories).map(
                  (category) => (
                    <Button
                      key={category}
                      type="button"
                      variant={
                        (activeTab === "tests"
                          ? selectedTestCategory
                          : selectedPackageCategory) === category
                          ? "default"
                          : "outline"
                      }
                      size="sm"
                      onClick={() =>
                        activeTab === "tests"
                          ? setSelectedTestCategory(category)
                          : setSelectedPackageCategory(category)
                      }
                      className="text-xs"
                    >
                      {category}
                    </Button>
                  )
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Tests Tab */}
        <TabsContent value="tests">
          <ScrollArea className="h-64 pr-2">
            <div className="space-y-2">
              {filteredTests.length > 0 ? (
                filteredTests.map((test) => {
                  const isSelected = selectedTestIds.includes(test.id);
                  return (
                    <div
                      key={test.id}
                      onClick={() => handleTestToggle(test.id, !isSelected)}
                      className={cn(
                        "flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-all",
                        isSelected
                          ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                          : "border-border hover:border-blue-200 hover:bg-muted/50"
                      )}
                    >
                      <Checkbox
                        checked={isSelected}
                        onCheckedChange={(checked) =>
                          handleTestToggle(test.id, checked as boolean)
                        }
                        className="mt-1"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <p className="font-medium text-sm">{test.name}</p>
                            <p className="text-xs text-muted-foreground">
                              Code: {test.code}
                            </p>
                          </div>
                          <div className="text-right shrink-0">
                            <p className="font-semibold text-blue-600 flex items-center text-sm">
                              <IndianRupee className="w-3 h-3" />
                              {test.price}
                            </p>
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-1 mt-1">
                          <Badge variant="outline" className="text-xs">
                            {test.category}
                          </Badge>
                          <Badge variant="secondary" className="text-xs flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {test.reportTime}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  No tests found
                </div>
              )}
            </div>
          </ScrollArea>
        </TabsContent>

        {/* Packages Tab */}
        <TabsContent value="packages">
          <ScrollArea className="h-64 pr-2">
            <div className="space-y-2">
              {filteredPackages.length > 0 ? (
                filteredPackages.map((pkg) => {
                  const isSelected = selectedPackageIds.includes(pkg.id);
                  return (
                    <div
                      key={pkg.id}
                      onClick={() => handlePackageToggle(pkg.id, !isSelected)}
                      className={cn(
                        "flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-all",
                        isSelected
                          ? "border-purple-500 bg-purple-50 dark:bg-purple-900/20"
                          : "border-border hover:border-purple-200 hover:bg-muted/50"
                      )}
                    >
                      <Checkbox
                        checked={isSelected}
                        onCheckedChange={(checked) =>
                          handlePackageToggle(pkg.id, checked as boolean)
                        }
                        className="mt-1"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <p className="font-medium text-sm">{pkg.name}</p>
                            <p className="text-xs text-muted-foreground">
                              {pkg.testCount} tests included
                            </p>
                          </div>
                          <div className="text-right shrink-0">
                            <p className="font-semibold text-purple-600 flex items-center text-sm">
                              <IndianRupee className="w-3 h-3" />
                              {pkg.price}
                            </p>
                            {pkg.discount && (
                              <p className="text-xs text-green-600">
                                {pkg.discount}% off
                              </p>
                            )}
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-1 mt-1">
                          <Badge variant="outline" className="text-xs">
                            {pkg.category}
                          </Badge>
                          <Badge variant="secondary" className="text-xs flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {pkg.reportTime}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  No packages found
                </div>
              )}
            </div>
          </ScrollArea>
        </TabsContent>
      </Tabs>

      {/* Total Summary */}
      {(selectedTestIds.length > 0 || selectedPackageIds.length > 0) && (
        <div className="p-3 bg-muted/50 rounded-lg space-y-2">
          {selectedTestIds.length > 0 && (
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">
                Tests ({selectedTestIds.length})
              </span>
              <span>{formatINR(testsTotal)}</span>
            </div>
          )}
          {selectedPackageIds.length > 0 && (
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">
                Packages ({selectedPackageIds.length})
              </span>
              <span>{formatINR(packagesTotal)}</span>
            </div>
          )}
          <Separator />
          <div className="flex justify-between font-semibold">
            <span>Total</span>
            <span className="text-primary">{formatINR(grandTotal)}</span>
          </div>
        </div>
      )}
    </div>
  );
}

// Export getSelectedTests and getSelectedPackages helpers
export function getSelectedTestItems(testIds: string[]): OrderTestItem[] {
  return testIds.map((id) => {
    const test = availableTests.find((t) => t.id === id);
    if (!test) return null;
    return {
      id: `item-${id}`,
      testId: test.id,
      testName: test.name,
      testCode: test.code,
      price: test.price,
      discount: 0,
      finalPrice: test.price,
    };
  }).filter(Boolean) as OrderTestItem[];
}

export function getSelectedPackageItems(packageIds: string[]): OrderPackageItem[] {
  return packageIds.map((id) => {
    const pkg = availablePackages.find((p) => p.id === id);
    if (!pkg) return null;
    return {
      id: `item-${id}`,
      packageId: pkg.id,
      packageName: pkg.name,
      testsIncluded: pkg.testCount,
      price: pkg.price,
      discount: pkg.discount || 0,
      finalPrice: pkg.price - ((pkg.price * (pkg.discount || 0)) / 100),
    };
  }).filter(Boolean) as OrderPackageItem[];
}
