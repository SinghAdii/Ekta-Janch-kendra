"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import {
  Truck,
  Search,
  Calendar,
  Clock,
  MapPin,
  Phone,
  User,
  CheckCircle2,
  AlertCircle,
  Navigation,
  XCircle,
  Star,
  Building2,
  Download,
  CalendarDays,
  Info,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { cn } from "@/lib/utils";

import type { CollectionStatus, LabEmployee, SlotToCollectionData } from "./lab-management.types";
import { getEmployeesByRole, labBranches } from "./lab-management.data";
import { fetchOrdersBySource, updateOrder } from "../orders/orders.data";
import type { Order } from "../orders/orders.types";

const collectionStatusColors: Record<string, string> = {
  Scheduled: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  "En Route": "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  Collected: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  Cancelled: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
};

interface CollectionManagementPageProps {
  incomingSlotBooking?: SlotToCollectionData | null;
  onSlotProcessed?: () => void;
}

export default function CollectionManagementPage({ incomingSlotBooking, onSlotProcessed }: CollectionManagementPageProps) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [collectors, setCollectors] = useState<LabEmployee[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [dateFilter, setDateFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [branchFilter, setBranchFilter] = useState<string>("all");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isAssignDialogOpen, setIsAssignDialogOpen] = useState(false);
  const [selectedCollectorId, setSelectedCollectorId] = useState<string>("");
  const [isAssigning, setIsAssigning] = useState(false);
  const [showSlotNotification, setShowSlotNotification] = useState(false);

  useEffect(() => {
    loadData();
    const employeeCollectors = getEmployeesByRole("collector");
    setCollectors(employeeCollectors);
  }, []);

  useEffect(() => {
    if (incomingSlotBooking) {
      setShowSlotNotification(true);
      setTimeout(() => {
        setShowSlotNotification(false);
        onSlotProcessed?.();
      }, 3000);
    }
  }, [incomingSlotBooking, onSlotProcessed]);

  const filterData = useCallback(() => {
    let filtered = [...orders];
    const today = new Date().toISOString().split("T")[0];
    const tomorrow = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split("T")[0];

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (o) =>
          o.orderNumber.toLowerCase().includes(q) ||
          o.patient.name.toLowerCase().includes(q) ||
          o.patient.mobile.includes(q) ||
          o.homeCollection?.address?.toLowerCase().includes(q)
      );
    }

    if (dateFilter && dateFilter !== "all") {
      filtered = filtered.filter((o) => {
        const schedDate = o.homeCollection?.scheduledDate;
        if (!schedDate) return false;
        if (dateFilter === "today") return schedDate === today;
        if (dateFilter === "tomorrow") return schedDate === tomorrow;
        if (dateFilter === "upcoming") return schedDate > today;
        return true;
      });
    }

    if (statusFilter && statusFilter !== "all") {
      filtered = filtered.filter((o) => o.homeCollection?.collectionStatus === statusFilter);
    }

    if (branchFilter && branchFilter !== "all") {
      filtered = filtered.filter((o) => o.branchId === branchFilter);
    }

    setFilteredOrders(filtered);
  }, [orders, searchQuery, dateFilter, statusFilter, branchFilter]);

  useEffect(() => {
    filterData();
  }, [filterData]);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const data = await fetchOrdersBySource("Home Collection");
      setOrders(data);
      setFilteredOrders(data);
    } catch (error) {
      console.error("Error loading orders:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenAssignDialog = (order: Order) => {
    setSelectedOrder(order);
    setSelectedCollectorId(order.homeCollection?.collectorId || "");
    setIsAssignDialogOpen(true);
  };

  const handleAssignCollector = async () => {
    if (!selectedOrder || !selectedCollectorId) return;

    const collector = collectors.find((c) => c.id === selectedCollectorId);
    if (!collector) return;

    setIsAssigning(true);
    try {
      await updateOrder(selectedOrder.id, {
        homeCollection: {
          ...selectedOrder.homeCollection!,
          collectorId: collector.id,
          collectorName: collector.name,
          collectorMobile: collector.mobile,
          collectionStatus: "Scheduled",
          assignedAt: new Date().toISOString(),
        },
        assignedTo: collector.name,
      });
      await loadData();
      setIsAssignDialogOpen(false);
      setSelectedCollectorId("");
    } catch (error) {
      console.error("Error assigning collector:", error);
    } finally {
      setIsAssigning(false);
    }
  };

  const handleUpdateCollectionStatus = async (orderId: string, status: CollectionStatus) => {
    const order = orders.find((o) => o.id === orderId);
    if (!order || !order.homeCollection) return;

    try {
      await updateOrder(orderId, {
        homeCollection: {
          ...order.homeCollection,
          collectionStatus: status,
          ...(status === "Collected" && { collectedAt: new Date().toISOString() }),
        },
        status: status === "Collected" ? "Sample Collected" : order.status,
      });
      await loadData();
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  const stats = {
    total: orders.length,
    pending: orders.filter(
      (o) => !o.homeCollection?.collectorId || o.homeCollection?.collectionStatus === "Scheduled"
    ).length,
    enRoute: orders.filter((o) => o.homeCollection?.collectionStatus === "En Route").length,
    collected: orders.filter((o) => o.homeCollection?.collectionStatus === "Collected").length,
  };

  return (
    <div className="h-full flex flex-col bg-gradient-to-br from-teal-50 via-white to-slate-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
      <div className="flex-1 p-4 md:p-6 space-y-4 overflow-auto">
        {showSlotNotification && incomingSlotBooking && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <Card className="border-teal-200 bg-teal-50">
              <CardContent className="p-3 flex items-center gap-3">
                <div className="p-2 bg-teal-100 rounded-full">
                  <CalendarDays className="h-4 w-4 text-teal-600" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-teal-800 text-sm">New Collection from Slot Booking</p>
                  <p className="text-xs text-teal-600">
                    {incomingSlotBooking.slotBooking.patientName} - {incomingSlotBooking.collectionType} collection
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-teal-100 rounded-xl dark:bg-teal-900/30 shrink-0">
              <Truck className="h-5 w-5 text-teal-600 dark:text-teal-400" />
            </div>
            <div>
              <h1 className="text-lg md:text-xl font-bold tracking-tight">Collection Management</h1>
              <p className="text-xs text-muted-foreground hidden sm:block">
                Assign collectors and track home sample collection
              </p>
            </div>
          </div>
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>

        <div className="grid gap-3 grid-cols-2 lg:grid-cols-4">
          <Card className="border-l-4 border-l-teal-500">
            <CardContent className="p-3 md:p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground">Total</p>
                  <p className="text-xl md:text-2xl font-bold">{stats.total}</p>
                </div>
                <Truck className="h-6 w-6 md:h-8 md:w-8 text-teal-200" />
              </div>
            </CardContent>
          </Card>
          <Card className="border-l-4 border-l-amber-500">
            <CardContent className="p-3 md:p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground">Pending</p>
                  <p className="text-xl md:text-2xl font-bold">{stats.pending}</p>
                </div>
                <AlertCircle className="h-6 w-6 md:h-8 md:w-8 text-amber-200" />
              </div>
            </CardContent>
          </Card>
          <Card className="border-l-4 border-l-blue-500">
            <CardContent className="p-3 md:p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground">En Route</p>
                  <p className="text-xl md:text-2xl font-bold">{stats.enRoute}</p>
                </div>
                <Navigation className="h-6 w-6 md:h-8 md:w-8 text-blue-200" />
              </div>
            </CardContent>
          </Card>
          <Card className="border-l-4 border-l-green-500">
            <CardContent className="p-3 md:p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground">Collected</p>
                  <p className="text-xl md:text-2xl font-bold">{stats.collected}</p>
                </div>
                <CheckCircle2 className="h-6 w-6 md:h-8 md:w-8 text-green-200" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Info Banner - Automated Status Flow */}
        <Alert className="bg-teal-50 border-teal-200">
          <Info className="h-4 w-4 text-teal-600" />
          <AlertTitle className="text-teal-800">Automated Status Updates</AlertTitle>
          <AlertDescription className="text-teal-700">
            When you mark a collection as <strong>Collected</strong>, the order status will automatically update to <strong>Sample Collected</strong>, 
            triggering the next step in the lab processing workflow.
          </AlertDescription>
        </Alert>

        <Card>
          <CardHeader className="pb-2 px-4 pt-3">
            <CardTitle className="text-sm font-medium">Available Collectors</CardTitle>
          </CardHeader>
          <CardContent className="px-4 pb-3">
            <div className="flex gap-3 overflow-x-auto pb-2">
              {collectors.map((collector) => (
                <div
                  key={collector.id}
                  className={cn(
                    "flex items-center gap-2 p-2.5 rounded-lg border min-w-[180px] shrink-0",
                    collector.isAvailable
                      ? "bg-green-50 border-green-200"
                      : "bg-gray-50 border-gray-200 opacity-60"
                  )}
                >
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-teal-100 text-teal-700 text-xs">
                      {collector.name.split(" ").map((n) => n[0]).join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-xs truncate">{collector.name}</p>
                    <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
                      <span>{collector.currentAssignments} tasks</span>
                      {collector.rating && (
                        <span className="flex items-center gap-0.5">
                          <Star className="h-2.5 w-2.5 fill-amber-400 text-amber-400" />
                          {collector.rating}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-3 md:p-4">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search name, mobile, address..."
                  className="pl-8 h-9"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="flex gap-2">
                <Select value={dateFilter} onValueChange={setDateFilter}>
                  <SelectTrigger className="w-full sm:w-[130px] h-9">
                    <SelectValue placeholder="Date" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Dates</SelectItem>
                    <SelectItem value="today">Today</SelectItem>
                    <SelectItem value="tomorrow">Tomorrow</SelectItem>
                    <SelectItem value="upcoming">Upcoming</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-full sm:w-[130px] h-9">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="Scheduled">Scheduled</SelectItem>
                    <SelectItem value="En Route">En Route</SelectItem>
                    <SelectItem value="Collected">Collected</SelectItem>
                    <SelectItem value="Cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={branchFilter} onValueChange={setBranchFilter}>
                  <SelectTrigger className="w-full sm:w-[150px] h-9">
                    <Building2 className="h-4 w-4 mr-1 text-muted-foreground" />
                    <SelectValue placeholder="Branch" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Branches</SelectItem>
                    {labBranches.filter(b => b.isActive).map((branch) => (
                      <SelectItem key={branch.id} value={branch.id}>
                        {branch.code} - {branch.city}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        <ScrollArea className="flex-1 h-[calc(100vh-520px)] md:h-[calc(100vh-480px)]">
          <div className="space-y-3">
            {isLoading ? (
              <Card>
                <CardContent className="p-6 text-center text-muted-foreground text-sm">Loading...</CardContent>
              </Card>
            ) : filteredOrders.length === 0 ? (
              <Card>
                <CardContent className="p-6 text-center text-muted-foreground text-sm">
                  No collection orders found
                </CardContent>
              </Card>
            ) : (
              filteredOrders.map((order, i) => (
                <motion.div
                  key={order.id}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.03 }}
                >
                  <Card className="hover:shadow-md transition-shadow overflow-hidden">
                    <div className="flex flex-col lg:flex-row">
                      <div className="flex-1 p-3 md:p-4 space-y-2.5">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <div className="flex flex-wrap items-center gap-2">
                              <span className="font-semibold text-primary text-sm">{order.orderNumber}</span>
                              <Badge className={`${collectionStatusColors[order.homeCollection?.collectionStatus || "Scheduled"]} text-[10px] px-1.5 py-0`}>
                                {order.homeCollection?.collectionStatus}
                              </Badge>
                            </div>
                            {order.branchName && (
                              <p className="text-[10px] text-muted-foreground mt-0.5 flex items-center gap-1">
                                <Building2 className="h-2.5 w-2.5" />
                                {order.branchName}
                              </p>
                            )}
                          </div>
                        </div>

                        <div className="grid sm:grid-cols-2 gap-3">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2 text-sm">
                              <User className="h-3.5 w-3.5 text-muted-foreground" />
                              <span className="font-medium">{order.patient.name}</span>
                            </div>
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                              <Phone className="h-3 w-3" />
                              <span>{order.patient.mobile}</span>
                            </div>
                          </div>
                          <div className="space-y-1">
                            <div className="flex items-center gap-2 text-sm">
                              <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                              <span className="font-medium">{order.homeCollection?.scheduledDate}</span>
                            </div>
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                              <Clock className="h-3 w-3" />
                              <span>{order.homeCollection?.scheduledTime}</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-start gap-2 text-xs bg-muted/50 p-2 rounded-lg">
                          <MapPin className="h-3.5 w-3.5 mt-0.5 text-muted-foreground shrink-0" />
                          <span className="line-clamp-2">
                            {order.homeCollection?.address}, {order.homeCollection?.city} - {order.homeCollection?.pincode}
                          </span>
                        </div>

                        {order.tests.length > 0 && (
                          <div className="flex flex-wrap gap-1">
                            {order.tests.slice(0, 3).map((test) => (
                              <Badge key={test.id} variant="secondary" className="text-[10px] px-1.5 py-0">
                                {test.testCode}
                              </Badge>
                            ))}
                            {order.tests.length > 3 && (
                              <Badge variant="outline" className="text-[10px] px-1.5 py-0">
                                +{order.tests.length - 3}
                              </Badge>
                            )}
                          </div>
                        )}
                      </div>

                      <div className="lg:w-52 bg-muted/30 p-3 flex flex-col justify-between border-t lg:border-t-0 lg:border-l">
                        <div className="space-y-2">
                          <div>
                            <p className="text-[10px] text-muted-foreground mb-1">Assigned Collector</p>
                            {order.homeCollection?.collectorName ? (
                              <div className="flex items-center gap-2">
                                <Avatar className="h-7 w-7">
                                  <AvatarFallback className="bg-teal-100 text-teal-700 text-[10px]">
                                    {order.homeCollection.collectorName.split(" ").map((n) => n[0]).join("")}
                                  </AvatarFallback>
                                </Avatar>
                                <div>
                                  <p className="font-medium text-xs">{order.homeCollection.collectorName}</p>
                                  <p className="text-[10px] text-muted-foreground">{order.homeCollection.collectorMobile}</p>
                                </div>
                              </div>
                            ) : (
                              <Button
                                size="sm"
                                variant="outline"
                                className="w-full h-7 text-xs"
                                onClick={() => handleOpenAssignDialog(order)}
                              >
                                Assign Collector
                              </Button>
                            )}
                          </div>

                          {order.homeCollection?.collectorName && order.homeCollection?.collectionStatus !== "Collected" && (
                            <Button
                              size="sm"
                              variant="outline"
                              className="w-full h-7 text-xs"
                              onClick={() => handleOpenAssignDialog(order)}
                            >
                              Change Collector
                            </Button>
                          )}
                        </div>

                        <div className="mt-3 pt-3 border-t space-y-1.5">
                          {order.homeCollection?.collectionStatus === "Scheduled" && order.homeCollection?.collectorId && (
                            <Button
                              size="sm"
                              className="w-full h-7 text-xs bg-amber-600 hover:bg-amber-700"
                              onClick={() => handleUpdateCollectionStatus(order.id, "En Route")}
                            >
                              <Navigation className="h-3 w-3 mr-1" />
                              Mark En Route
                            </Button>
                          )}
                          {order.homeCollection?.collectionStatus === "En Route" && (
                            <Button
                              size="sm"
                              className="w-full h-7 text-xs bg-green-600 hover:bg-green-700"
                              onClick={() => handleUpdateCollectionStatus(order.id, "Collected")}
                            >
                              <CheckCircle2 className="h-3 w-3 mr-1" />
                              Mark Collected
                            </Button>
                          )}
                          {order.homeCollection?.collectionStatus !== "Collected" && order.homeCollection?.collectionStatus !== "Cancelled" && (
                            <Button
                              size="sm"
                              variant="outline"
                              className="w-full h-7 text-xs text-red-600 hover:bg-red-50"
                              onClick={() => handleUpdateCollectionStatus(order.id, "Cancelled")}
                            >
                              <XCircle className="h-3 w-3 mr-1" />
                              Cancel
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))
            )}
          </div>
        </ScrollArea>

        <Dialog open={isAssignDialogOpen} onOpenChange={setIsAssignDialogOpen}>
          <DialogContent className="max-w-md max-h-[90vh] overflow-auto">
            <DialogHeader>
              <DialogTitle>Assign Collector</DialogTitle>
              <DialogDescription>
                Select a phlebotomist for this collection
              </DialogDescription>
            </DialogHeader>

            <div className="py-4">
              {selectedOrder && (
                <div className="bg-muted rounded-lg p-3 mb-4 text-sm">
                  <p className="font-medium">{selectedOrder.orderNumber}</p>
                  <p className="text-xs text-muted-foreground">
                    {selectedOrder.patient.name} - {selectedOrder.homeCollection?.scheduledDate}
                  </p>
                </div>
              )}

              <RadioGroup value={selectedCollectorId} onValueChange={setSelectedCollectorId}>
                <div className="space-y-2">
                  {collectors.map((collector) => (
                    <div
                      key={collector.id}
                      className={cn(
                        "flex items-center space-x-3 rounded-lg border p-3 cursor-pointer transition-colors",
                        selectedCollectorId === collector.id
                          ? "border-teal-500 bg-teal-50"
                          : "hover:bg-muted/50",
                        !collector.isAvailable && "opacity-50"
                      )}
                      onClick={() => collector.isAvailable && setSelectedCollectorId(collector.id)}
                    >
                      <RadioGroupItem
                        value={collector.id}
                        id={collector.id}
                        disabled={!collector.isAvailable}
                      />
                      <Label
                        htmlFor={collector.id}
                        className="flex-1 flex items-center gap-2 cursor-pointer"
                      >
                        <Avatar className="h-8 w-8">
                          <AvatarFallback className="bg-teal-100 text-teal-700 text-xs">
                            {collector.name.split(" ").map((n) => n[0]).join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <p className="font-medium text-sm">{collector.name}</p>
                          <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
                            <span>{collector.mobile}</span>
                            <span>•</span>
                            <span>{collector.currentAssignments} assigned</span>
                            {collector.rating && (
                              <>
                                <span>•</span>
                                <span className="flex items-center gap-0.5">
                                  <Star className="h-2.5 w-2.5 fill-amber-400 text-amber-400" />
                                  {collector.rating}
                                </span>
                              </>
                            )}
                          </div>
                        </div>
                        <Badge
                          variant="outline"
                          className={cn(
                            "text-[10px]",
                            collector.isAvailable
                              ? "bg-green-100 text-green-700"
                              : "bg-gray-100 text-gray-500"
                          )}
                        >
                          {collector.isAvailable ? "Free" : "Busy"}
                        </Badge>
                      </Label>
                    </div>
                  ))}
                </div>
              </RadioGroup>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAssignDialogOpen(false)}>
                Cancel
              </Button>
              <Button
                onClick={handleAssignCollector}
                disabled={!selectedCollectorId || isAssigning}
                className="bg-teal-600 hover:bg-teal-700"
              >
                {isAssigning ? "Assigning..." : "Assign Collector"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
