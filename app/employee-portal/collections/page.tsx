"use client";

import { useState, useMemo } from "react";
import { useAuth } from "@/lib/auth/useAuth";
import { format, parseISO, isToday, isTomorrow, addDays } from "date-fns";
import {
  mockCollectionAssignments,
  getCollectionStats,
  startCollection,
  completeCollection,
  cancelCollection,
  rescheduleCollection,
  getAvailableTimeSlots,
  type CollectionAssignment,
} from "@/components/custom/employee-portal/employee.data";
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
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { toast } from "sonner";
import {
  MapPin,
  Clock,
  Phone,
  Navigation,
  User,
  TestTube,
  CalendarIcon,
  AlertCircle,
  CheckCircle2,
  XCircle,
  CalendarClock,
  Package,
  FileText,
  PlayCircle,
  RotateCcw,
  Eye,
  Loader2,
  ChevronRight,
  Clipboard,
  Droplets,
  Info,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function MyCollectionsPage() {
  const { user } = useAuth();
  const [assignments, setAssignments] = useState<CollectionAssignment[]>(mockCollectionAssignments);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [priorityFilter, setPriorityFilter] = useState<string>("all");
  
  // Dialog states
  const [selectedAssignment, setSelectedAssignment] = useState<CollectionAssignment | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [rescheduleOpen, setRescheduleOpen] = useState(false);
  const [completeOpen, setCompleteOpen] = useState(false);
  const [cancelOpen, setCancelOpen] = useState(false);
  const [startConfirmOpen, setStartConfirmOpen] = useState(false);
  
  // Form states
  const [rescheduleDate, setRescheduleDate] = useState<Date | undefined>();
  const [rescheduleTime, setRescheduleTime] = useState<string>("");
  const [rescheduleReason, setRescheduleReason] = useState<string>("");
  const [tubesCollected, setTubesCollected] = useState<string>("1");
  const [collectionNotes, setCollectionNotes] = useState<string>("");
  const [cancelReason, setCancelReason] = useState<string>("");
  const [customCancelReason, setCustomCancelReason] = useState<string>("");

  const stats = useMemo(() => getCollectionStats(assignments), [assignments]);
  const timeSlots = getAvailableTimeSlots();

  // Check if user is home collector
  const isHomeCollector = user?.role === "home_collector";

  // Filter assignments by date
  const filteredAssignments = useMemo(() => {
    if (!isHomeCollector) return [];
    return assignments.filter((assignment) => {
      const assignmentDate = parseISO(assignment.scheduledDate);
      const matchesDate = format(assignmentDate, "yyyy-MM-dd") === format(selectedDate, "yyyy-MM-dd");
      const matchesStatus = statusFilter === "all" || assignment.status === statusFilter;
      const matchesPriority = priorityFilter === "all" || assignment.priority === priorityFilter;
      return matchesDate && matchesStatus && matchesPriority;
    });
  }, [assignments, selectedDate, statusFilter, priorityFilter, isHomeCollector]);

  // Group by priority
  const urgentAssignments = useMemo(() => 
    filteredAssignments.filter((a) => a.priority === "urgent"), 
    [filteredAssignments]
  );
  const normalAssignments = useMemo(() => 
    filteredAssignments.filter((a) => a.priority === "normal"), 
    [filteredAssignments]
  );

  // Check role access - after all hooks
  if (!isHomeCollector) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-4">
        <AlertCircle className="h-16 w-16 text-muted-foreground mb-4" />
        <h2 className="text-xl font-semibold mb-2">Access Restricted</h2>
        <p className="text-muted-foreground">
          This page is only available for Home Collection staff.
        </p>
      </div>
    );
  }

  const getStatusBadge = (status: CollectionAssignment["status"]) => {
    const variants: Record<string, { variant: "default" | "secondary" | "destructive" | "outline"; className: string }> = {
      pending: { variant: "secondary", className: "bg-yellow-100 text-yellow-800 hover:bg-yellow-100" },
      "in-progress": { variant: "default", className: "bg-blue-100 text-blue-800 hover:bg-blue-100" },
      completed: { variant: "default", className: "bg-emerald-100 text-emerald-800 hover:bg-emerald-100" },
      cancelled: { variant: "destructive", className: "bg-red-100 text-red-800 hover:bg-red-100" },
      rescheduled: { variant: "outline", className: "bg-purple-100 text-purple-800 hover:bg-purple-100" },
    };
    const config = variants[status] || variants.pending;
    return (
      <Badge variant={config.variant} className={config.className}>
        {status.charAt(0).toUpperCase() + status.slice(1).replace("-", " ")}
      </Badge>
    );
  };

  const getPriorityBadge = (priority: CollectionAssignment["priority"]) => {
    if (priority === "urgent") {
      return <Badge className="bg-red-500 text-white">Urgent</Badge>;
    }
    return <Badge variant="outline">Normal</Badge>;
  };

  const handleCall = (phone: string) => {
    window.location.href = `tel:${phone}`;
  };

  const handleNavigate = (address: string, pincode?: string) => {
    const fullAddress = pincode ? `${address}, ${pincode}` : address;
    window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(fullAddress)}`, "_blank");
  };

  const handleStartCollection = () => {
    if (selectedAssignment) {
      const result = startCollection(selectedAssignment.id);
      if (result) {
        setAssignments([...assignments.map((a) => (a.id === result.id ? result : a))]);
        toast.success("Collection started", {
          description: `Collection for ${result.patientName} is now in progress.`,
        });
      }
      setStartConfirmOpen(false);
      setSelectedAssignment(null);
    }
  };

  const handleCompleteCollection = () => {
    if (selectedAssignment) {
      const result = completeCollection(selectedAssignment.id, {
        tubesCollected: parseInt(tubesCollected) || 1,
        collectionNotes: collectionNotes || undefined,
      });
      if (result) {
        setAssignments([...assignments.map((a) => (a.id === result.id ? result : a))]);
        toast.success("Collection completed!", {
          description: `Successfully collected ${tubesCollected} tube(s) from ${result.patientName}.`,
        });
      }
      setCompleteOpen(false);
      setTubesCollected("1");
      setCollectionNotes("");
      setSelectedAssignment(null);
    }
  };

  const handleReschedule = () => {
    if (selectedAssignment && rescheduleDate && rescheduleTime) {
      const result = rescheduleCollection(selectedAssignment.id, {
        newDate: format(rescheduleDate, "yyyy-MM-dd"),
        newTime: rescheduleTime,
        reason: rescheduleReason || "Patient requested reschedule",
      });
      if (result) {
        setAssignments([...assignments.map((a) => (a.id === result.id ? result : a))]);
        toast.success("Collection rescheduled", {
          description: `Rescheduled to ${format(rescheduleDate, "PPP")} at ${rescheduleTime}.`,
        });
      }
      setRescheduleOpen(false);
      setRescheduleDate(undefined);
      setRescheduleTime("");
      setRescheduleReason("");
      setSelectedAssignment(null);
    }
  };

  const handleCancel = () => {
    if (selectedAssignment) {
      const reason = cancelReason === "other" ? customCancelReason : cancelReason;
      if (!reason) {
        toast.error("Please provide a reason for cancellation");
        return;
      }
      const result = cancelCollection(selectedAssignment.id, reason);
      if (result) {
        setAssignments([...assignments.map((a) => (a.id === result.id ? result : a))]);
        toast.success("Collection cancelled", {
          description: `Collection for ${result.patientName} has been cancelled.`,
        });
      }
      setCancelOpen(false);
      setCancelReason("");
      setCustomCancelReason("");
      setSelectedAssignment(null);
    }
  };

  const openDetails = (assignment: CollectionAssignment) => {
    setSelectedAssignment(assignment);
    setDetailsOpen(true);
  };

  const openReschedule = (assignment: CollectionAssignment) => {
    setSelectedAssignment(assignment);
    setRescheduleDate(addDays(new Date(), 1));
    setRescheduleOpen(true);
  };

  const openComplete = (assignment: CollectionAssignment) => {
    setSelectedAssignment(assignment);
    setTubesCollected(assignment.tubesRequired?.toString() || "1");
    setCompleteOpen(true);
  };

  const openCancel = (assignment: CollectionAssignment) => {
    setSelectedAssignment(assignment);
    setCancelOpen(true);
  };

  const openStartConfirm = (assignment: CollectionAssignment) => {
    setSelectedAssignment(assignment);
    setStartConfirmOpen(true);
  };

  const dateOptions = [
    { label: "Today", date: new Date() },
    { label: "Tomorrow", date: addDays(new Date(), 1) },
    { label: "Day After", date: addDays(new Date(), 2) },
  ];

  const cancelReasons = [
    "Patient not available",
    "Wrong address",
    "Patient refused collection",
    "Patient hospitalized",
    "Duplicate booking",
    "other",
  ];

  const rescheduleReasons = [
    "Patient requested reschedule",
    "Patient not available at scheduled time",
    "Collector unable to reach location",
    "Patient not fasting",
    "Weather conditions",
    "Other",
  ];

  const renderAssignmentCard = (assignment: CollectionAssignment) => (
    <Card
      key={assignment.id}
      className={cn(
        "cursor-pointer hover:shadow-md transition-shadow",
        assignment.priority === "urgent" && "border-red-300 bg-red-50/30"
      )}
    >
      <CardContent className="p-4">
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-semibold text-base">{assignment.patientName}</h3>
              {assignment.patientGender && (
                <span className="text-xs text-muted-foreground">
                  ({assignment.patientGender === "male" ? "M" : assignment.patientGender === "female" ? "F" : "O"}
                  {assignment.patientAge && `, ${assignment.patientAge}y`})
                </span>
              )}
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              {getStatusBadge(assignment.status)}
              {getPriorityBadge(assignment.priority)}
            </div>
          </div>
          <Button variant="ghost" size="sm" onClick={() => openDetails(assignment)}>
            <Eye className="h-4 w-4" />
          </Button>
        </div>

        {/* Time Slot */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
          <Clock className="h-4 w-4" />
          <span className="font-medium">{assignment.scheduledTime}</span>
          {assignment.status === "rescheduled" && assignment.rescheduledFrom && (
            <Badge variant="outline" className="text-xs bg-purple-50">
              <RotateCcw className="h-3 w-3 mr-1" />
              Rescheduled
            </Badge>
          )}
        </div>

        {/* Address */}
        <div className="flex items-start gap-2 text-sm mb-2">
          <MapPin className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
          <div className="flex-1">
            <p className="line-clamp-2">{assignment.address}</p>
            {assignment.landmark && (
              <p className="text-xs text-muted-foreground mt-0.5">
                Landmark: {assignment.landmark}
              </p>
            )}
            {assignment.pincode && (
              <p className="text-xs text-muted-foreground">PIN: {assignment.pincode}</p>
            )}
          </div>
        </div>

        {/* Tests */}
        <div className="flex items-start gap-2 text-sm mb-3">
          <TestTube className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
          <div className="flex-1">
            <p className="line-clamp-1">{assignment.tests.join(", ")}</p>
            {assignment.tubesRequired && (
              <p className="text-xs text-muted-foreground mt-0.5">
                {assignment.tubesRequired} tube(s) required
              </p>
            )}
          </div>
        </div>

        {/* Test Instructions */}
        {assignment.testInstructions && (
          <div className="bg-amber-50 border border-amber-200 rounded-md p-2 mb-3">
            <div className="flex items-start gap-2 text-xs">
              <Info className="h-3.5 w-3.5 text-amber-600 mt-0.5 shrink-0" />
              <p className="text-amber-800">{assignment.testInstructions}</p>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex items-center gap-2 pt-2 border-t">
          <Button
            size="sm"
            variant="outline"
            className="flex-1"
            onClick={() => handleCall(assignment.phone)}
          >
            <Phone className="h-4 w-4 mr-1" />
            Call
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="flex-1"
            onClick={() => handleNavigate(assignment.address, assignment.pincode)}
          >
            <Navigation className="h-4 w-4 mr-1" />
            Navigate
          </Button>
          
          {assignment.status === "pending" && (
            <Button
              size="sm"
              className="flex-1 bg-emerald-600 hover:bg-emerald-700"
              onClick={() => openStartConfirm(assignment)}
            >
              <PlayCircle className="h-4 w-4 mr-1" />
              Start
            </Button>
          )}
          
          {assignment.status === "in-progress" && (
            <Button
              size="sm"
              className="flex-1 bg-emerald-600 hover:bg-emerald-700"
              onClick={() => openComplete(assignment)}
            >
              <CheckCircle2 className="h-4 w-4 mr-1" />
              Complete
            </Button>
          )}
        </div>

        {/* Secondary Actions */}
        {(assignment.status === "pending" || assignment.status === "in-progress") && (
          <div className="flex items-center gap-2 mt-2">
            <Button
              size="sm"
              variant="ghost"
              className="flex-1 text-purple-600 hover:text-purple-700 hover:bg-purple-50"
              onClick={() => openReschedule(assignment)}
            >
              <CalendarClock className="h-4 w-4 mr-1" />
              Reschedule
            </Button>
            <Button
              size="sm"
              variant="ghost"
              className="flex-1 text-red-600 hover:text-red-700 hover:bg-red-50"
              onClick={() => openCancel(assignment)}
            >
              <XCircle className="h-4 w-4 mr-1" />
              Cancel
            </Button>
          </div>
        )}

        {/* Completed Info */}
        {assignment.status === "completed" && assignment.collectedAt && (
          <div className="mt-2 pt-2 border-t bg-emerald-50 -mx-4 -mb-4 p-4 rounded-b-lg">
            <div className="flex items-center gap-2 text-sm text-emerald-700">
              <CheckCircle2 className="h-4 w-4" />
              <span>Collected at {format(parseISO(assignment.collectedAt), "h:mm a")}</span>
              {assignment.tubesCollected && (
                <Badge variant="outline" className="ml-auto bg-white">
                  {assignment.tubesCollected} tube(s)
                </Badge>
              )}
            </div>
            {assignment.collectionNotes && (
              <p className="text-xs text-emerald-600 mt-1 ml-6">{assignment.collectionNotes}</p>
            )}
          </div>
        )}

        {/* Cancelled Info */}
        {assignment.status === "cancelled" && assignment.cancelReason && (
          <div className="mt-2 pt-2 border-t bg-red-50 -mx-4 -mb-4 p-4 rounded-b-lg">
            <div className="flex items-start gap-2 text-sm text-red-700">
              <XCircle className="h-4 w-4 mt-0.5 shrink-0" />
              <span>Reason: {assignment.cancelReason}</span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );

  return (
    <div className="p-6 lg:p-8 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">My Collections</h1>
        <p className="text-muted-foreground">
          Manage your home collection assignments
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Package className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.total}</p>
                <p className="text-xs text-muted-foreground">Total</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Clock className="h-5 w-5 text-yellow-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.pending}</p>
                <p className="text-xs text-muted-foreground">Pending</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Loader2 className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.inProgress}</p>
                <p className="text-xs text-muted-foreground">In Progress</p>
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
                <p className="text-2xl font-bold">{stats.completed}</p>
                <p className="text-xs text-muted-foreground">Completed</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <CalendarClock className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.rescheduled}</p>
                <p className="text-xs text-muted-foreground">Rescheduled</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-red-100 rounded-lg">
                <AlertCircle className="h-5 w-5 text-red-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.urgent}</p>
                <p className="text-xs text-muted-foreground">Urgent</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Date Selection */}
            <div className="flex items-center gap-2">
              <Label className="text-sm font-medium shrink-0">Date:</Label>
              <div className="flex gap-1">
                {dateOptions.map((option) => (
                  <Button
                    key={option.label}
                    size="sm"
                    variant={format(selectedDate, "yyyy-MM-dd") === format(option.date, "yyyy-MM-dd") ? "default" : "outline"}
                    className={format(selectedDate, "yyyy-MM-dd") === format(option.date, "yyyy-MM-dd") ? "bg-emerald-600 hover:bg-emerald-700" : ""}
                    onClick={() => setSelectedDate(option.date)}
                  >
                    {option.label}
                  </Button>
                ))}
              </div>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" size="sm">
                    <CalendarIcon className="h-4 w-4" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={(date) => date && setSelectedDate(date)}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <Separator orientation="vertical" className="hidden md:block h-8" />

            {/* Status Filter */}
            <div className="flex items-center gap-2">
              <Label className="text-sm font-medium shrink-0">Status:</Label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="in-progress">In Progress</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="rescheduled">Rescheduled</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Priority Filter */}
            <div className="flex items-center gap-2">
              <Label className="text-sm font-medium shrink-0">Priority:</Label>
              <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                <SelectTrigger className="w-[120px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="urgent">Urgent</SelectItem>
                  <SelectItem value="normal">Normal</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Selected Date Display */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">
          {isToday(selectedDate)
            ? "Today's Collections"
            : isTomorrow(selectedDate)
            ? "Tomorrow's Collections"
            : `Collections for ${format(selectedDate, "EEEE, MMMM d")}`}
        </h2>
        <Badge variant="outline" className="text-sm">
          {filteredAssignments.length} assignment(s)
        </Badge>
      </div>

      {/* Assignments List */}
      {filteredAssignments.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Package className="h-16 w-16 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Collections Found</h3>
            <p className="text-muted-foreground text-center">
              No collections scheduled for this date with the selected filters.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {/* Urgent Assignments */}
          {urgentAssignments.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-3">
                <AlertCircle className="h-5 w-5 text-red-500" />
                <h3 className="font-semibold text-red-600">Urgent Collections ({urgentAssignments.length})</h3>
              </div>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {urgentAssignments.map(renderAssignmentCard)}
              </div>
            </div>
          )}

          {/* Normal Assignments */}
          {normalAssignments.length > 0 && (
            <div>
              {urgentAssignments.length > 0 && (
                <div className="flex items-center gap-2 mb-3">
                  <Package className="h-5 w-5 text-muted-foreground" />
                  <h3 className="font-semibold">Other Collections ({normalAssignments.length})</h3>
                </div>
              )}
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {normalAssignments.map(renderAssignmentCard)}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Details Dialog */}
      <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
        <DialogContent className="max-w-lg max-h-[90vh]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Collection Details
            </DialogTitle>
          </DialogHeader>
          {selectedAssignment && (
            <ScrollArea className="max-h-[60vh]">
              <div className="space-y-4 pr-4">
                {/* Patient Info */}
                <div className="space-y-2">
                  <h4 className="font-semibold flex items-center gap-2 text-sm text-muted-foreground">
                    <User className="h-4 w-4" />
                    Patient Information
                  </h4>
                  <div className="bg-muted/50 rounded-lg p-3 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-lg">{selectedAssignment.patientName}</span>
                      <div className="flex items-center gap-2">
                        {getStatusBadge(selectedAssignment.status)}
                        {getPriorityBadge(selectedAssignment.priority)}
                      </div>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      {selectedAssignment.patientAge && (
                        <span>Age: {selectedAssignment.patientAge} years</span>
                      )}
                      {selectedAssignment.patientGender && (
                        <span className="capitalize">Gender: {selectedAssignment.patientGender}</span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <a href={`tel:${selectedAssignment.phone}`} className="text-emerald-600 hover:underline">
                        {selectedAssignment.phone}
                      </a>
                    </div>
                  </div>
                </div>

                {/* Schedule */}
                <div className="space-y-2">
                  <h4 className="font-semibold flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    Schedule
                  </h4>
                  <div className="bg-muted/50 rounded-lg p-3 space-y-2">
                    <div className="flex items-center justify-between">
                      <span>{format(parseISO(selectedAssignment.scheduledDate), "EEEE, MMMM d, yyyy")}</span>
                      <Badge variant="outline">{selectedAssignment.scheduledTime}</Badge>
                    </div>
                    {selectedAssignment.status === "rescheduled" && selectedAssignment.rescheduledFrom && (
                      <div className="text-sm text-purple-600 bg-purple-50 rounded-md p-2">
                        <span className="font-medium">Rescheduled from: </span>
                        {format(parseISO(selectedAssignment.rescheduledFrom), "MMM d, yyyy")}
                        {selectedAssignment.rescheduleReason && (
                          <span className="block text-xs mt-1">Reason: {selectedAssignment.rescheduleReason}</span>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Address */}
                <div className="space-y-2">
                  <h4 className="font-semibold flex items-center gap-2 text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    Address
                  </h4>
                  <div className="bg-muted/50 rounded-lg p-3 space-y-2">
                    <p>{selectedAssignment.address}</p>
                    {selectedAssignment.landmark && (
                      <p className="text-sm text-muted-foreground">
                        <span className="font-medium">Landmark:</span> {selectedAssignment.landmark}
                      </p>
                    )}
                    {selectedAssignment.pincode && (
                      <p className="text-sm text-muted-foreground">
                        <span className="font-medium">PIN Code:</span> {selectedAssignment.pincode}
                      </p>
                    )}
                    <Button
                      size="sm"
                      variant="outline"
                      className="w-full mt-2"
                      onClick={() => handleNavigate(selectedAssignment.address, selectedAssignment.pincode)}
                    >
                      <Navigation className="h-4 w-4 mr-2" />
                      Open in Maps
                    </Button>
                  </div>
                </div>

                {/* Tests */}
                <div className="space-y-2">
                  <h4 className="font-semibold flex items-center gap-2 text-sm text-muted-foreground">
                    <TestTube className="h-4 w-4" />
                    Tests to Collect
                  </h4>
                  <div className="bg-muted/50 rounded-lg p-3 space-y-2">
                    <ul className="space-y-1">
                      {selectedAssignment.tests.map((test, idx) => (
                        <li key={idx} className="flex items-center gap-2 text-sm">
                          <ChevronRight className="h-3 w-3 text-muted-foreground" />
                          {test}
                        </li>
                      ))}
                    </ul>
                    {selectedAssignment.tubesRequired && (
                      <div className="flex items-center gap-2 text-sm pt-2 border-t">
                        <Droplets className="h-4 w-4 text-blue-500" />
                        <span>{selectedAssignment.tubesRequired} tube(s) required</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Test Instructions */}
                {selectedAssignment.testInstructions && (
                  <div className="space-y-2">
                    <h4 className="font-semibold flex items-center gap-2 text-sm text-muted-foreground">
                      <Info className="h-4 w-4" />
                      Special Instructions
                    </h4>
                    <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
                      <p className="text-sm text-amber-800">{selectedAssignment.testInstructions}</p>
                    </div>
                  </div>
                )}

                {/* Notes */}
                {selectedAssignment.notes && (
                  <div className="space-y-2">
                    <h4 className="font-semibold flex items-center gap-2 text-sm text-muted-foreground">
                      <Clipboard className="h-4 w-4" />
                      Notes
                    </h4>
                    <div className="bg-muted/50 rounded-lg p-3">
                      <p className="text-sm">{selectedAssignment.notes}</p>
                    </div>
                  </div>
                )}

                {/* Collection Info (if completed) */}
                {selectedAssignment.status === "completed" && (
                  <div className="space-y-2">
                    <h4 className="font-semibold flex items-center gap-2 text-sm text-emerald-600">
                      <CheckCircle2 className="h-4 w-4" />
                      Collection Completed
                    </h4>
                    <div className="bg-emerald-50 rounded-lg p-3 space-y-2">
                      {selectedAssignment.collectedAt && (
                        <p className="text-sm">
                          <span className="font-medium">Collected at:</span>{" "}
                          {format(parseISO(selectedAssignment.collectedAt), "h:mm a")}
                        </p>
                      )}
                      {selectedAssignment.tubesCollected && (
                        <p className="text-sm">
                          <span className="font-medium">Tubes collected:</span> {selectedAssignment.tubesCollected}
                        </p>
                      )}
                      {selectedAssignment.collectionNotes && (
                        <p className="text-sm">
                          <span className="font-medium">Notes:</span> {selectedAssignment.collectionNotes}
                        </p>
                      )}
                    </div>
                  </div>
                )}

                {/* Cancel Reason (if cancelled) */}
                {selectedAssignment.status === "cancelled" && selectedAssignment.cancelReason && (
                  <div className="space-y-2">
                    <h4 className="font-semibold flex items-center gap-2 text-sm text-red-600">
                      <XCircle className="h-4 w-4" />
                      Cancellation Reason
                    </h4>
                    <div className="bg-red-50 rounded-lg p-3">
                      <p className="text-sm text-red-700">{selectedAssignment.cancelReason}</p>
                    </div>
                  </div>
                )}
              </div>
            </ScrollArea>
          )}
          <DialogFooter className="flex-row gap-2">
            <Button variant="outline" onClick={() => setDetailsOpen(false)}>
              Close
            </Button>
            {selectedAssignment && selectedAssignment.status === "pending" && (
              <Button
                className="bg-emerald-600 hover:bg-emerald-700"
                onClick={() => {
                  setDetailsOpen(false);
                  openStartConfirm(selectedAssignment);
                }}
              >
                <PlayCircle className="h-4 w-4 mr-2" />
                Start Collection
              </Button>
            )}
            {selectedAssignment && selectedAssignment.status === "in-progress" && (
              <Button
                className="bg-emerald-600 hover:bg-emerald-700"
                onClick={() => {
                  setDetailsOpen(false);
                  openComplete(selectedAssignment);
                }}
              >
                <CheckCircle2 className="h-4 w-4 mr-2" />
                Complete Collection
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Start Collection Confirm Dialog */}
      <AlertDialog open={startConfirmOpen} onOpenChange={setStartConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Start Collection</AlertDialogTitle>
            <AlertDialogDescription>
              You are about to start the collection for{" "}
              <span className="font-semibold text-foreground">{selectedAssignment?.patientName}</span>.
              This will mark the collection as &quot;In Progress&quot;.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-emerald-600 hover:bg-emerald-700"
              onClick={handleStartCollection}
            >
              Start Collection
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Complete Collection Dialog */}
      <Dialog open={completeOpen} onOpenChange={setCompleteOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-emerald-600" />
              Complete Collection
            </DialogTitle>
            <DialogDescription>
              Enter the collection details for {selectedAssignment?.patientName}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="tubes">Number of Tubes Collected *</Label>
              <Input
                id="tubes"
                type="number"
                min="1"
                value={tubesCollected}
                onChange={(e) => setTubesCollected(e.target.value)}
                placeholder="Enter number of tubes"
              />
              {selectedAssignment?.tubesRequired && (
                <p className="text-xs text-muted-foreground">
                  Required: {selectedAssignment.tubesRequired} tube(s)
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="collectionNotes">Collection Notes (Optional)</Label>
              <Textarea
                id="collectionNotes"
                value={collectionNotes}
                onChange={(e) => setCollectionNotes(e.target.value)}
                placeholder="Any notes about the collection..."
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCompleteOpen(false)}>
              Cancel
            </Button>
            <Button
              className="bg-emerald-600 hover:bg-emerald-700"
              onClick={handleCompleteCollection}
              disabled={!tubesCollected || parseInt(tubesCollected) < 1}
            >
              Complete Collection
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reschedule Dialog */}
      <Dialog open={rescheduleOpen} onOpenChange={setRescheduleOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CalendarClock className="h-5 w-5 text-purple-600" />
              Reschedule Collection
            </DialogTitle>
            <DialogDescription>
              Reschedule collection for {selectedAssignment?.patientName}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>New Date *</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !rescheduleDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {rescheduleDate ? format(rescheduleDate, "PPP") : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={rescheduleDate}
                    onSelect={setRescheduleDate}
                    disabled={(date) => date < new Date()}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div className="space-y-2">
              <Label>New Time Slot *</Label>
              <Select value={rescheduleTime} onValueChange={setRescheduleTime}>
                <SelectTrigger>
                  <SelectValue placeholder="Select time slot" />
                </SelectTrigger>
                <SelectContent>
                  {timeSlots.map((slot) => (
                    <SelectItem key={slot} value={slot}>
                      {slot}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Reason for Reschedule</Label>
              <Select value={rescheduleReason} onValueChange={setRescheduleReason}>
                <SelectTrigger>
                  <SelectValue placeholder="Select reason" />
                </SelectTrigger>
                <SelectContent>
                  {rescheduleReasons.map((reason) => (
                    <SelectItem key={reason} value={reason}>
                      {reason}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setRescheduleOpen(false)}>
              Cancel
            </Button>
            <Button
              className="bg-purple-600 hover:bg-purple-700"
              onClick={handleReschedule}
              disabled={!rescheduleDate || !rescheduleTime}
            >
              Reschedule
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Cancel Dialog */}
      <Dialog open={cancelOpen} onOpenChange={setCancelOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <XCircle className="h-5 w-5 text-red-600" />
              Cancel Collection
            </DialogTitle>
            <DialogDescription>
              Cancel collection for {selectedAssignment?.patientName}. Please provide a reason.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Cancellation Reason *</Label>
              <Select value={cancelReason} onValueChange={setCancelReason}>
                <SelectTrigger>
                  <SelectValue placeholder="Select reason" />
                </SelectTrigger>
                <SelectContent>
                  {cancelReasons.map((reason) => (
                    <SelectItem key={reason} value={reason}>
                      {reason === "other" ? "Other (specify below)" : reason}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {cancelReason === "other" && (
              <div className="space-y-2">
                <Label>Specify Reason *</Label>
                <Textarea
                  value={customCancelReason}
                  onChange={(e) => setCustomCancelReason(e.target.value)}
                  placeholder="Enter cancellation reason..."
                  rows={3}
                />
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCancelOpen(false)}>
              Go Back
            </Button>
            <Button
              variant="destructive"
              onClick={handleCancel}
              disabled={!cancelReason || (cancelReason === "other" && !customCancelReason)}
            >
              Cancel Collection
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
