"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Search,
  Filter,
  FlaskConical,
  Clock,
  RefreshCw,
  PlayCircle,
  CheckCircle2,
  AlertTriangle,
  Building2,
  Timer,
  TestTube,
  FileText,
  Loader2,
  Barcode,
  Activity
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";

import type { LabProcessingQueueItem, LabBranch } from "./orders.types";
import {
  fetchLabProcessingQueue,
  fetchLabBranches,
  updateLabTestStatus
} from "./orders.data";

type QueueFilterStatus = "All" | "In Queue" | "In Progress" | "Completed" | "On Hold";
type PriorityFilter = "All" | "Normal" | "Urgent" | "Critical";

const LabTestManagementPage = () => {
  // State
  const [queue, setQueue] = useState<LabProcessingQueueItem[]>([]);
  const [branches, setBranches] = useState<LabBranch[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<QueueFilterStatus>("All");
  const [priorityFilter, setPriorityFilter] = useState<PriorityFilter>("All");
  const [branchFilter, setBranchFilter] = useState<string>("all");
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  
  // Dialog states
  const [updateDialogOpen, setUpdateDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<LabProcessingQueueItem | null>(null);
  const [updateRemarks, setUpdateRemarks] = useState("");
  const [actionLoading, setActionLoading] = useState(false);

  // Load data
  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const [queueData, branchesData] = await Promise.all([
        fetchLabProcessingQueue(),
        fetchLabBranches()
      ]);
      setQueue(queueData);
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

  // Filtered queue
  const filteredQueue = useMemo(() => {
    let result = [...queue];

    // Search filter
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (item) =>
          item.orderNumber.toLowerCase().includes(q) ||
          item.patient.name.toLowerCase().includes(q) ||
          item.test.testName.toLowerCase().includes(q) ||
          item.test.testCode.toLowerCase().includes(q) ||
          item.sampleId.toLowerCase().includes(q)
      );
    }

    // Status filter
    if (statusFilter !== "All") {
      result = result.filter((item) => item.status === statusFilter);
    }

    // Priority filter
    if (priorityFilter !== "All") {
      result = result.filter((item) => item.priority === priorityFilter);
    }

    // Branch filter
    if (branchFilter !== "all") {
      result = result.filter((item) => item.branchId === branchFilter);
    }

    return result;
  }, [queue, searchQuery, statusFilter, priorityFilter, branchFilter]);

  // Stats
  const stats = useMemo(() => {
    return {
      total: queue.length,
      inQueue: queue.filter(item => item.status === "In Queue").length,
      inProgress: queue.filter(item => item.status === "In Progress").length,
      completed: queue.filter(item => item.status === "Completed").length,
      urgent: queue.filter(item => item.priority === "Urgent" || item.priority === "Critical").length
    };
  }, [queue]);

  // Handlers
  const handleStartProcessing = async (item: LabProcessingQueueItem) => {
    setActionLoading(true);
    try {
      const result = await updateLabTestStatus(item.orderId, item.test.id, "In Progress");
      if (result) {
        toast.success(`Started processing ${item.test.testCode}`);
        loadData();
      } else {
        toast.error("Failed to start processing");
      }
    } catch {
      toast.error("An error occurred");
    } finally {
      setActionLoading(false);
    }
  };

  const handleCompleteTest = async () => {
    if (!selectedItem) return;
    
    setActionLoading(true);
    try {
      const result = await updateLabTestStatus(selectedItem.orderId, selectedItem.test.id, "Completed");
      if (result) {
        toast.success(`Test ${selectedItem.test.testCode} completed`);
        loadData();
        setUpdateDialogOpen(false);
        setSelectedItem(null);
        setUpdateRemarks("");
      } else {
        toast.error("Failed to complete test");
      }
    } catch {
      toast.error("An error occurred");
    } finally {
      setActionLoading(false);
    }
  };

  const handleBulkStart = async () => {
    if (selectedItems.length === 0) return;
    
    setActionLoading(true);
    let success = 0;
    
    for (const itemId of selectedItems) {
      const item = queue.find(q => q.id === itemId);
      if (item && item.status === "In Queue") {
        try {
          await updateLabTestStatus(item.orderId, item.test.id, "In Progress");
          success++;
        } catch {
          // Continue with others
        }
      }
    }
    
    toast.success(`Started processing ${success} tests`);
    setSelectedItems([]);
    loadData();
    setActionLoading(false);
  };

  const openCompleteDialog = (item: LabProcessingQueueItem) => {
    setSelectedItem(item);
    setUpdateRemarks("");
    setUpdateDialogOpen(true);
  };

  const toggleSelectItem = (itemId: string) => {
    setSelectedItems(prev => 
      prev.includes(itemId) 
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    );
  };

  const toggleSelectAll = () => {
    if (selectedItems.length === filteredQueue.filter(q => q.status === "In Queue").length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(filteredQueue.filter(q => q.status === "In Queue").map(q => q.id));
    }
  };

  // Get status badge
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "In Queue":
        return <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">In Queue</Badge>;
      case "In Progress":
        return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">In Progress</Badge>;
      case "Completed":
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Completed</Badge>;
      case "On Hold":
        return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">On Hold</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  // Get priority badge
  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "Critical":
        return <Badge className="bg-red-500">Critical</Badge>;
      case "Urgent":
        return <Badge className="bg-orange-500">Urgent</Badge>;
      default:
        return <Badge variant="secondary">Normal</Badge>;
    }
  };

  // Calculate time since received
  const getTimeSinceReceived = (receivedAt: string) => {
    const received = new Date(receivedAt);
    const now = new Date();
    const diffMs = now.getTime() - received.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    
    if (diffHours > 24) {
      const diffDays = Math.floor(diffHours / 24);
      return `${diffDays}d ${diffHours % 24}h`;
    }
    return `${diffHours}h ${diffMinutes}m`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Loading lab queue...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Lab Test Management</h1>
          <p className="text-muted-foreground">
            Process samples and update test status in the lab processing queue
          </p>
        </div>
        <div className="flex items-center gap-2">
          {selectedItems.length > 0 && (
            <Button onClick={handleBulkStart} disabled={actionLoading}>
              <PlayCircle className="w-4 h-4 mr-2" />
              Start Selected ({selectedItems.length})
            </Button>
          )}
          <Button onClick={loadData} variant="outline" size="sm">
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <TestTube className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total in Queue</p>
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
                <p className="text-sm text-muted-foreground">Waiting</p>
                <p className="text-2xl font-bold">{stats.inQueue}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-blue-100">
                <Activity className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">In Progress</p>
                <p className="text-2xl font-bold">{stats.inProgress}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-green-100">
                <CheckCircle2 className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Completed</p>
                <p className="text-2xl font-bold">{stats.completed}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-red-100">
                <AlertTriangle className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Urgent/Critical</p>
                <p className="text-2xl font-bold">{stats.urgent}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Progress Overview */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Processing Progress</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Completed Today</span>
              <span className="font-medium">{stats.completed} / {stats.total}</span>
            </div>
            <Progress value={(stats.completed / stats.total) * 100} className="h-2" />
          </div>
        </CardContent>
      </Card>

      {/* Filters */}
      <Card>
        <CardContent className="pt-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search by order, patient, test, sample ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as QueueFilterStatus)}>
              <SelectTrigger className="w-full md:w-[160px]">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All Status</SelectItem>
                <SelectItem value="In Queue">In Queue</SelectItem>
                <SelectItem value="In Progress">In Progress</SelectItem>
                <SelectItem value="Completed">Completed</SelectItem>
                <SelectItem value="On Hold">On Hold</SelectItem>
              </SelectContent>
            </Select>
            <Select value={priorityFilter} onValueChange={(v) => setPriorityFilter(v as PriorityFilter)}>
              <SelectTrigger className="w-full md:w-[150px]">
                <AlertTriangle className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All Priority</SelectItem>
                <SelectItem value="Critical">Critical</SelectItem>
                <SelectItem value="Urgent">Urgent</SelectItem>
                <SelectItem value="Normal">Normal</SelectItem>
              </SelectContent>
            </Select>
            <Select value={branchFilter} onValueChange={setBranchFilter}>
              <SelectTrigger className="w-full md:w-[180px]">
                <Building2 className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Branch" />
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

      {/* Queue Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[40px]">
                  <input
                    type="checkbox"
                    checked={selectedItems.length === filteredQueue.filter(q => q.status === "In Queue").length && filteredQueue.filter(q => q.status === "In Queue").length > 0}
                    onChange={toggleSelectAll}
                    className="rounded border-gray-300"
                  />
                </TableHead>
                <TableHead>Sample ID</TableHead>
                <TableHead>Order / Patient</TableHead>
                <TableHead>Test</TableHead>
                <TableHead>Branch</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Wait Time</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredQueue.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} className="h-32 text-center">
                    <div className="flex flex-col items-center justify-center text-muted-foreground">
                      <FlaskConical className="w-8 h-8 mb-2 opacity-50" />
                      <p>No tests found in queue</p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                <AnimatePresence mode="popLayout">
                  {filteredQueue.map((item) => (
                    <motion.tr
                      key={item.id}
                      layout
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="group"
                    >
                      <TableCell>
                        {item.status === "In Queue" && (
                          <input
                            type="checkbox"
                            checked={selectedItems.includes(item.id)}
                            onChange={() => toggleSelectItem(item.id)}
                            className="rounded border-gray-300"
                          />
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Barcode className="w-4 h-4 text-muted-foreground" />
                          <span className="font-mono text-sm">{item.sampleId || "N/A"}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium text-sm">{item.orderNumber}</p>
                          <p className="text-xs text-muted-foreground">{item.patient.name}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium text-sm">{item.test.testCode}</p>
                          <p className="text-xs text-muted-foreground">{item.test.testName}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="text-xs">
                          {item.branchName.replace("Ekta Janch Kendra - ", "")}
                        </Badge>
                      </TableCell>
                      <TableCell>{getPriorityBadge(item.priority)}</TableCell>
                      <TableCell>{getStatusBadge(item.status)}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1 text-sm">
                          <Timer className="w-3.5 h-3.5 text-muted-foreground" />
                          {getTimeSinceReceived(item.receivedAt)}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          {item.status === "In Queue" && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleStartProcessing(item)}
                              disabled={actionLoading}
                            >
                              <PlayCircle className="w-4 h-4 mr-1" />
                              Start
                            </Button>
                          )}
                          {item.status === "In Progress" && (
                            <Button
                              size="sm"
                              onClick={() => openCompleteDialog(item)}
                              disabled={actionLoading}
                            >
                              <CheckCircle2 className="w-4 h-4 mr-1" />
                              Complete
                            </Button>
                          )}
                          {item.status === "Completed" && (
                            <Button size="sm" variant="ghost" disabled>
                              <FileText className="w-4 h-4 mr-1" />
                              View Report
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Complete Test Dialog */}
      <Dialog open={updateDialogOpen} onOpenChange={setUpdateDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Complete Test Processing</DialogTitle>
            <DialogDescription>
              Mark test {selectedItem?.test.testCode} as completed for order {selectedItem?.orderNumber}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            {selectedItem && (
              <div className="p-4 rounded-lg bg-muted/50">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Patient</p>
                    <p className="font-medium">{selectedItem.patient.name}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Test</p>
                    <p className="font-medium">{selectedItem.test.testName}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Sample ID</p>
                    <p className="font-mono">{selectedItem.sampleId}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Processing Time</p>
                    <p>{getTimeSinceReceived(selectedItem.receivedAt)}</p>
                  </div>
                </div>
              </div>
            )}
            <div className="space-y-2">
              <Label>Remarks (Optional)</Label>
              <Textarea
                placeholder="Enter any remarks about the test results..."
                value={updateRemarks}
                onChange={(e) => setUpdateRemarks(e.target.value)}
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setUpdateDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCompleteTest} disabled={actionLoading}>
              {actionLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              <CheckCircle2 className="w-4 h-4 mr-2" />
              Complete Test
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default LabTestManagementPage;
