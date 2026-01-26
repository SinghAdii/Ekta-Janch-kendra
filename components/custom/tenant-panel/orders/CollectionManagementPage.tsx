"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Search,
  Filter,
  MapPin,
  Phone,
  User,
  Calendar,
  Clock,
  RefreshCw,
  ChevronDown,
  ChevronUp,
  Truck,
  CheckCircle2,
  XCircle,
  UserPlus,
  Navigation,
  Package,
  AlertCircle,
  Building2,
  Star,
  Loader2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

import type { Order, Collector, LabBranch } from "./orders.types";
import {
  fetchPendingHomeCollections,
  fetchCollectors,
  fetchLabBranches,
  assignCollector,
  updateCollectionStatus
} from "./orders.data";

type CollectionFilterStatus = "All" | "Scheduled" | "Assigned" | "En Route";

const CollectionManagementPage = () => {
  // State
  const [orders, setOrders] = useState<Order[]>([]);
  const [collectors, setCollectors] = useState<Collector[]>([]);
  const [branches, setBranches] = useState<LabBranch[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<CollectionFilterStatus>("All");
  const [branchFilter, setBranchFilter] = useState<string>("all");
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);
  
  // Dialog states
  const [assignDialogOpen, setAssignDialogOpen] = useState(false);
  const [statusDialogOpen, setStatusDialogOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [selectedCollector, setSelectedCollector] = useState<string>("");
  const [updateNotes, setUpdateNotes] = useState("");
  const [actionLoading, setActionLoading] = useState(false);

  // Load data
  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const [ordersData, collectorsData, branchesData] = await Promise.all([
        fetchPendingHomeCollections(),
        fetchCollectors(),
        fetchLabBranches()
      ]);
      setOrders(ordersData);
      setCollectors(collectorsData);
      setBranches(branchesData);
    } catch {
      toast.error("Failed to load data");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Filtered orders
  const filteredOrders = useMemo(() => {
    let result = [...orders];

    // Search filter
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (o) =>
          o.orderNumber.toLowerCase().includes(q) ||
          o.patient.name.toLowerCase().includes(q) ||
          o.patient.mobile.includes(q) ||
          o.homeCollection?.address?.toLowerCase().includes(q)
      );
    }

    // Status filter
    if (statusFilter !== "All") {
      result = result.filter(
        (o) => o.homeCollection?.collectionStatus === statusFilter
      );
    }

    // Branch filter
    if (branchFilter !== "all") {
      result = result.filter((o) => o.branchId === branchFilter);
    }

    // Sort by scheduled date/time
    result.sort((a, b) => {
      const dateA = new Date(`${a.homeCollection?.scheduledDate} ${a.homeCollection?.scheduledTime}`);
      const dateB = new Date(`${b.homeCollection?.scheduledDate} ${b.homeCollection?.scheduledTime}`);
      return dateA.getTime() - dateB.getTime();
    });

    return result;
  }, [orders, searchQuery, statusFilter, branchFilter]);

  // Stats
  const stats = useMemo(() => {
    return {
      total: orders.length,
      scheduled: orders.filter(o => o.homeCollection?.collectionStatus === "Scheduled").length,
      assigned: orders.filter(o => o.homeCollection?.collectionStatus === "Assigned").length,
      enRoute: orders.filter(o => o.homeCollection?.collectionStatus === "En Route").length,
      availableCollectors: collectors.filter(c => c.isAvailable).length
    };
  }, [orders, collectors]);

  // Handlers
  const handleAssignCollector = async () => {
    if (!selectedOrder || !selectedCollector) return;
    
    setActionLoading(true);
    try {
      const result = await assignCollector(selectedOrder.id, selectedCollector);
      if (result) {
        toast.success("Collector assigned successfully");
        loadData();
        setAssignDialogOpen(false);
        setSelectedOrder(null);
        setSelectedCollector("");
      } else {
        toast.error("Failed to assign collector");
      }
    } catch {
      toast.error("An error occurred");
    } finally {
      setActionLoading(false);
    }
  };

  const handleUpdateStatus = async (status: "En Route" | "Collected" | "Cancelled") => {
    if (!selectedOrder) return;
    
    setActionLoading(true);
    try {
      const result = await updateCollectionStatus(selectedOrder.id, status, updateNotes);
      if (result) {
        toast.success(`Status updated to ${status}`);
        loadData();
        setStatusDialogOpen(false);
        setSelectedOrder(null);
        setUpdateNotes("");
      } else {
        toast.error("Failed to update status");
      }
    } catch {
      toast.error("An error occurred");
    } finally {
      setActionLoading(false);
    }
  };

  const openAssignDialog = (order: Order) => {
    setSelectedOrder(order);
    setSelectedCollector("");
    setAssignDialogOpen(true);
  };

  const openStatusDialog = (order: Order) => {
    setSelectedOrder(order);
    setUpdateNotes("");
    setStatusDialogOpen(true);
  };

  // Get status badge color
  const getStatusBadge = (status?: string) => {
    switch (status) {
      case "Scheduled":
        return <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">Scheduled</Badge>;
      case "Assigned":
        return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">Assigned</Badge>;
      case "En Route":
        return <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">En Route</Badge>;
      case "Collected":
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Collected</Badge>;
      case "Cancelled":
        return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">Cancelled</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Loading collections...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Collection Management</h1>
          <p className="text-muted-foreground">
            Manage home collection assignments and track collector activities
          </p>
        </div>
        <Button onClick={loadData} variant="outline" size="sm">
          <RefreshCw className="w-4 h-4 mr-2" />
          Refresh
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <Package className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Pending</p>
                <p className="text-2xl font-bold">{stats.total}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-amber-100">
                <Clock className="w-5 h-5 text-amber-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Scheduled</p>
                <p className="text-2xl font-bold">{stats.scheduled}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-blue-100">
                <UserPlus className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Assigned</p>
                <p className="text-2xl font-bold">{stats.assigned}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-purple-100">
                <Truck className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">En Route</p>
                <p className="text-2xl font-bold">{stats.enRoute}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-green-100">
                <User className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Available Collectors</p>
                <p className="text-2xl font-bold">{stats.availableCollectors}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search by order, patient, mobile, address..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as CollectionFilterStatus)}>
              <SelectTrigger className="w-full md:w-[180px]">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All Status</SelectItem>
                <SelectItem value="Scheduled">Scheduled</SelectItem>
                <SelectItem value="Assigned">Assigned</SelectItem>
                <SelectItem value="En Route">En Route</SelectItem>
              </SelectContent>
            </Select>
            <Select value={branchFilter} onValueChange={setBranchFilter}>
              <SelectTrigger className="w-full md:w-[200px]">
                <Building2 className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Filter by branch" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Branches</SelectItem>
                {branches.map((branch) => (
                  <SelectItem key={branch.id} value={branch.id}>
                    {branch.name.replace("Ekta Janch Kendra - ", "")}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Collection Cards */}
      <div className="space-y-4">
        <AnimatePresence mode="popLayout">
          {filteredOrders.length === 0 ? (
            <Card>
              <CardContent className="py-12">
                <div className="flex flex-col items-center justify-center text-center">
                  <div className="p-4 rounded-full bg-muted mb-4">
                    <CheckCircle2 className="w-8 h-8 text-muted-foreground" />
                  </div>
                  <h3 className="text-lg font-semibold">No Pending Collections</h3>
                  <p className="text-muted-foreground mt-1">
                    All home collections have been processed or no matching results found.
                  </p>
                </div>
              </CardContent>
            </Card>
          ) : (
            filteredOrders.map((order) => (
              <motion.div
                key={order.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <Card className="overflow-hidden">
                  <CardHeader
                    className="cursor-pointer hover:bg-muted/50 transition-colors"
                    onClick={() => setExpandedOrder(expandedOrder === order.id ? null : order.id)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <CardTitle className="text-base">{order.orderNumber}</CardTitle>
                          {getStatusBadge(order.homeCollection?.collectionStatus)}
                          <Badge variant="outline" className="text-xs">
                            <Building2 className="w-3 h-3 mr-1" />
                            {order.branchCode}
                          </Badge>
                        </div>
                        <CardDescription className="mt-1 flex items-center gap-4 flex-wrap">
                          <span className="flex items-center gap-1">
                            <User className="w-3.5 h-3.5" />
                            {order.patient.name}
                          </span>
                          <span className="flex items-center gap-1">
                            <Phone className="w-3.5 h-3.5" />
                            {order.patient.mobile}
                          </span>
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3.5 h-3.5" />
                            {order.homeCollection?.scheduledDate}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5" />
                            {order.homeCollection?.scheduledTime}
                          </span>
                        </CardDescription>
                      </div>
                      <Button variant="ghost" size="icon" className="shrink-0">
                        {expandedOrder === order.id ? (
                          <ChevronUp className="w-5 h-5" />
                        ) : (
                          <ChevronDown className="w-5 h-5" />
                        )}
                      </Button>
                    </div>
                  </CardHeader>

                  <AnimatePresence>
                    {expandedOrder === order.id && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <CardContent className="border-t bg-muted/30 pt-4">
                          <div className="grid md:grid-cols-2 gap-6">
                            {/* Address & Details */}
                            <div className="space-y-4">
                              <div>
                                <h4 className="font-medium text-sm text-muted-foreground mb-2">Collection Address</h4>
                                <div className="flex items-start gap-2">
                                  <MapPin className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                                  <div>
                                    <p className="text-sm">{order.homeCollection?.address}</p>
                                    {order.homeCollection?.landmark && (
                                      <p className="text-sm text-muted-foreground">
                                        Landmark: {order.homeCollection.landmark}
                                      </p>
                                    )}
                                    <p className="text-sm">
                                      {order.homeCollection?.city} - {order.homeCollection?.pincode}
                                    </p>
                                  </div>
                                </div>
                              </div>

                              <div>
                                <h4 className="font-medium text-sm text-muted-foreground mb-2">Tests to Collect</h4>
                                <div className="flex flex-wrap gap-2">
                                  {order.tests.map((test) => (
                                    <Badge key={test.id} variant="secondary">
                                      {test.testCode}: {test.testName}
                                    </Badge>
                                  ))}
                                </div>
                              </div>

                              <div className="flex items-center gap-4">
                                <div>
                                  <p className="text-xs text-muted-foreground">Total Amount</p>
                                  <p className="font-semibold">₹{order.totalAmount.toLocaleString()}</p>
                                </div>
                                <div>
                                  <p className="text-xs text-muted-foreground">Payment</p>
                                  <Badge variant={order.paymentStatus === "Paid" ? "default" : "destructive"}>
                                    {order.paymentStatus}
                                  </Badge>
                                </div>
                              </div>
                            </div>

                            {/* Collector Info & Actions */}
                            <div className="space-y-4">
                              {order.homeCollection?.collectorId ? (
                                <div>
                                  <h4 className="font-medium text-sm text-muted-foreground mb-2">Assigned Collector</h4>
                                  <div className="p-3 rounded-lg bg-background border">
                                    <div className="flex items-center justify-between">
                                      <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                                          <User className="w-5 h-5 text-primary" />
                                        </div>
                                        <div>
                                          <p className="font-medium">{order.homeCollection.collectorName}</p>
                                          <p className="text-sm text-muted-foreground">
                                            {order.homeCollection.collectorMobile}
                                          </p>
                                        </div>
                                      </div>
                                      {order.homeCollection.assignedAt && (
                                        <div className="text-right">
                                          <p className="text-xs text-muted-foreground">Assigned at</p>
                                          <p className="text-sm">
                                            {new Date(order.homeCollection.assignedAt).toLocaleTimeString()}
                                          </p>
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              ) : (
                                <div className="p-4 rounded-lg border-2 border-dashed border-amber-300 bg-amber-50">
                                  <div className="flex items-center gap-3">
                                    <AlertCircle className="w-5 h-5 text-amber-600" />
                                    <div>
                                      <p className="font-medium text-amber-800">No Collector Assigned</p>
                                      <p className="text-sm text-amber-600">
                                        Please assign a collector for this collection.
                                      </p>
                                    </div>
                                  </div>
                                </div>
                              )}

                              {/* Action Buttons */}
                              <div className="flex flex-wrap gap-2">
                                {order.homeCollection?.collectionStatus === "Scheduled" && (
                                  <Button onClick={() => openAssignDialog(order)}>
                                    <UserPlus className="w-4 h-4 mr-2" />
                                    Assign Collector
                                  </Button>
                                )}
                                {order.homeCollection?.collectionStatus === "Assigned" && (
                                  <>
                                    <Button onClick={() => openAssignDialog(order)} variant="outline">
                                      <UserPlus className="w-4 h-4 mr-2" />
                                      Reassign
                                    </Button>
                                    <Button onClick={() => openStatusDialog(order)}>
                                      <Navigation className="w-4 h-4 mr-2" />
                                      Update Status
                                    </Button>
                                  </>
                                )}
                                {order.homeCollection?.collectionStatus === "En Route" && (
                                  <Button onClick={() => openStatusDialog(order)}>
                                    <CheckCircle2 className="w-4 h-4 mr-2" />
                                    Mark Collected
                                  </Button>
                                )}
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </Card>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>

      {/* Assign Collector Dialog */}
      <Dialog open={assignDialogOpen} onOpenChange={setAssignDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Assign Collector</DialogTitle>
            <DialogDescription>
              Select a collector to assign for order {selectedOrder?.orderNumber}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Available Collectors</Label>
              <div className="space-y-2 max-h-[300px] overflow-auto">
                {collectors.filter(c => c.isAvailable).map((collector) => (
                  <div
                    key={collector.id}
                    className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                      selectedCollector === collector.id
                        ? "border-primary bg-primary/5"
                        : "hover:bg-muted"
                    }`}
                    onClick={() => setSelectedCollector(collector.id)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                          <User className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium">{collector.name}</p>
                          <p className="text-sm text-muted-foreground">{collector.mobile}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center gap-1 text-amber-500">
                          <Star className="w-4 h-4 fill-current" />
                          <span className="text-sm font-medium">{collector.rating}</span>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {collector.currentAssignments} active
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
                {collectors.filter(c => c.isAvailable).length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    <User className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    <p>No collectors available</p>
                  </div>
                )}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAssignDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAssignCollector} disabled={!selectedCollector || actionLoading}>
              {actionLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Assign Collector
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Update Status Dialog */}
      <Dialog open={statusDialogOpen} onOpenChange={setStatusDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Update Collection Status</DialogTitle>
            <DialogDescription>
              Update the status for order {selectedOrder?.orderNumber}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Add Notes (Optional)</Label>
              <Textarea
                placeholder="Enter any notes about the collection..."
                value={updateNotes}
                onChange={(e) => setUpdateNotes(e.target.value)}
                rows={3}
              />
            </div>
          </div>
          <DialogFooter className="flex-col sm:flex-row gap-2">
            <Button variant="outline" onClick={() => setStatusDialogOpen(false)} className="w-full sm:w-auto">
              Cancel
            </Button>
            {selectedOrder?.homeCollection?.collectionStatus === "Assigned" && (
              <>
                <Button
                  variant="outline"
                  onClick={() => handleUpdateStatus("Cancelled")}
                  disabled={actionLoading}
                  className="w-full sm:w-auto text-red-600 hover:text-red-700"
                >
                  <XCircle className="w-4 h-4 mr-2" />
                  Cancel Collection
                </Button>
                <Button onClick={() => handleUpdateStatus("En Route")} disabled={actionLoading} className="w-full sm:w-auto">
                  {actionLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                  <Navigation className="w-4 h-4 mr-2" />
                  Mark En Route
                </Button>
              </>
            )}
            {selectedOrder?.homeCollection?.collectionStatus === "En Route" && (
              <>
                <Button
                  variant="outline"
                  onClick={() => handleUpdateStatus("Cancelled")}
                  disabled={actionLoading}
                  className="w-full sm:w-auto text-red-600 hover:text-red-700"
                >
                  <XCircle className="w-4 h-4 mr-2" />
                  Cancel
                </Button>
                <Button onClick={() => handleUpdateStatus("Collected")} disabled={actionLoading} className="w-full sm:w-auto">
                  {actionLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                  <CheckCircle2 className="w-4 h-4 mr-2" />
                  Mark Collected
                </Button>
              </>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CollectionManagementPage;
