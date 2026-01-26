"use client";

import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  CalendarCheck,
  Search,
  Filter,
  Download,
  ChevronLeft,
  ChevronRight,
  Clock,
  UserCheck,
  UserX,
  Calendar as CalendarIcon,
  LogIn,
  LogOut,
  AlertCircle,
  CheckCircle2,
  XCircle,
  Timer,
  Building2,
} from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
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
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  employees,
  attendanceRecords as initialRecords,
  departments,
} from "./employee.data";
import type { AttendanceRecord, AttendanceStatus } from "./employee.types";
import { AttendanceStatsGrid } from "./StatCards";

const ITEMS_PER_PAGE = 8;

export default function AttendanceManagementPage() {
  const [attendanceRecords, setAttendanceRecords] =
    useState<AttendanceRecord[]>(initialRecords);
  const [searchQuery, setSearchQuery] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().split("T")[0]
  );
  const [currentPage, setCurrentPage] = useState(1);
  const [markAttendanceOpen, setMarkAttendanceOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<string>("");
  const [attendanceForm, setAttendanceForm] = useState({
    status: "present" as AttendanceStatus,
    checkIn: "",
    checkOut: "",
    notes: "",
  });

  // Get today's attendance records
  const todayRecords = useMemo(() => {
    return attendanceRecords.filter((r) => r.date === selectedDate);
  }, [attendanceRecords, selectedDate]);

  // Filter records
  const filteredRecords = useMemo(() => {
    return todayRecords.filter((record) => {
      const employee = employees.find((e) => e.id === record.employeeId);
      const matchesSearch =
        record.employeeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        employee?.employeeId.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesDepartment =
        departmentFilter === "all" ||
        employee?.department === departmentFilter;
      const matchesStatus =
        statusFilter === "all" || record.status === statusFilter;
      return matchesSearch && matchesDepartment && matchesStatus;
    });
  }, [todayRecords, searchQuery, departmentFilter, statusFilter]);

  // Pagination
  const totalPages = Math.ceil(filteredRecords.length / ITEMS_PER_PAGE);
  const paginatedRecords = filteredRecords.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  // Stats calculation
  const stats = useMemo(() => {
    const present = todayRecords.filter((r) => r.status === "present").length;
    const absent = todayRecords.filter((r) => r.status === "absent").length;
    const onLeave = todayRecords.filter((r) => r.status === "leave").length;
    const halfDay = todayRecords.filter((r) => r.status === "half-day").length;

    return {
      presentToday: present,
      absentToday: absent,
      onLeave,
      halfDay,
      totalEmployees: employees.filter((e) => e.status === "active").length,
    };
  }, [todayRecords]);

  // Get employees not marked today
  const unmarkedEmployees = useMemo(() => {
    const markedIds = new Set(todayRecords.map((r) => r.employeeId));
    return employees.filter(
      (e) => !markedIds.has(e.id) && e.status === "active"
    );
  }, [todayRecords]);

  const handleMarkAttendance = () => {
    if (!selectedEmployee) return;

    const employee = employees.find((e) => e.id === selectedEmployee);
    if (!employee) return;

    const newRecord: AttendanceRecord = {
      id: `${selectedEmployee}-${selectedDate}`,
      employeeId: selectedEmployee,
      employeeName: employee.name,
      date: selectedDate,
      checkIn: attendanceForm.checkIn || undefined,
      checkOut: attendanceForm.checkOut || undefined,
      status: attendanceForm.status,
      workingHours:
        attendanceForm.status === "present"
          ? 8
          : attendanceForm.status === "half-day"
          ? 4
          : 0,
      notes: attendanceForm.notes || undefined,
    };

    setAttendanceRecords([...attendanceRecords, newRecord]);
    setMarkAttendanceOpen(false);
    setSelectedEmployee("");
    setAttendanceForm({
      status: "present",
      checkIn: "",
      checkOut: "",
      notes: "",
    });
  };

  const handleUpdateAttendance = (
    recordId: string,
    updates: Partial<AttendanceRecord>
  ) => {
    setAttendanceRecords(
      attendanceRecords.map((r) =>
        r.id === recordId ? { ...r, ...updates } : r
      )
    );
  };

  const getStatusBadge = (status: AttendanceStatus) => {
    const config = {
      present: {
        icon: CheckCircle2,
        class: "bg-green-100 text-green-700 border-green-200",
        label: "Present",
      },
      absent: {
        icon: XCircle,
        class: "bg-red-100 text-red-700 border-red-200",
        label: "Absent",
      },
      "half-day": {
        icon: Timer,
        class: "bg-blue-100 text-blue-700 border-blue-200",
        label: "Half Day",
      },
      leave: {
        icon: CalendarIcon,
        class: "bg-amber-100 text-amber-700 border-amber-200",
        label: "On Leave",
      },
      holiday: {
        icon: CalendarIcon,
        class: "bg-purple-100 text-purple-700 border-purple-200",
        label: "Holiday",
      },
    };
    const { icon: Icon, class: className, label } = config[status];
    return (
      <Badge variant="outline" className={className}>
        <Icon className="h-3 w-3 mr-1" />
        {label}
      </Badge>
    );
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-IN", {
      weekday: "long",
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <CalendarCheck className="h-7 w-7 text-primary" />
            Attendance Management
          </h1>
          <p className="text-muted-foreground mt-1">
            Track and manage employee attendance
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="gap-2">
            <Download className="h-4 w-4" />
            Export Report
          </Button>
          <Button
            onClick={() => setMarkAttendanceOpen(true)}
            className="gap-2"
            disabled={unmarkedEmployees.length === 0}
          >
            <UserCheck className="h-4 w-4" />
            Mark Attendance
          </Button>
        </div>
      </div>

      {/* Date Selector */}
      <Card className="bg-primary/5 border-primary/20">
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                size="icon"
                onClick={() => {
                  const date = new Date(selectedDate);
                  date.setDate(date.getDate() - 1);
                  setSelectedDate(date.toISOString().split("T")[0]);
                }}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <div className="text-center">
                <p className="text-lg font-semibold">{formatDate(selectedDate)}</p>
                <p className="text-sm text-muted-foreground">
                  {todayRecords.length} attendance records
                </p>
              </div>
              <Button
                variant="outline"
                size="icon"
                onClick={() => {
                  const date = new Date(selectedDate);
                  date.setDate(date.getDate() + 1);
                  if (date <= new Date()) {
                    setSelectedDate(date.toISOString().split("T")[0]);
                  }
                }}
                disabled={
                  selectedDate === new Date().toISOString().split("T")[0]
                }
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex items-center gap-2">
              <Input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                max={new Date().toISOString().split("T")[0]}
                className="w-auto"
              />
              <Button
                variant="secondary"
                onClick={() =>
                  setSelectedDate(new Date().toISOString().split("T")[0])
                }
              >
                Today
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats Grid */}
      <AttendanceStatsGrid
        presentToday={stats.presentToday}
        absentToday={stats.absentToday}
        onLeave={stats.onLeave}
        halfDay={stats.halfDay}
        totalEmployees={stats.totalEmployees}
      />

      {/* Unmarked Employees Alert */}
      {unmarkedEmployees.length > 0 &&
        selectedDate === new Date().toISOString().split("T")[0] && (
          <Card className="border-amber-200 bg-amber-50">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <AlertCircle className="h-5 w-5 text-amber-600" />
                <div>
                  <p className="font-medium text-amber-800">
                    {unmarkedEmployees.length} employees have not been marked
                    today
                  </p>
                  <p className="text-sm text-amber-600">
                    {unmarkedEmployees.map((e) => e.name).join(", ")}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

      {/* Filters & Table */}
      <Card>
        <CardHeader className="pb-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by employee name or ID..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex gap-3">
              <Select
                value={departmentFilter}
                onValueChange={setDepartmentFilter}
              >
                <SelectTrigger className="w-[180px]">
                  <Building2 className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Department" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Departments</SelectItem>
                  {departments.map((dept) => (
                    <SelectItem key={dept} value={dept}>
                      {dept}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[150px]">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="present">Present</SelectItem>
                  <SelectItem value="absent">Absent</SelectItem>
                  <SelectItem value="half-day">Half Day</SelectItem>
                  <SelectItem value="leave">On Leave</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <div className="rounded-lg border overflow-hidden">
            <Table>
              <TableHeader className="bg-muted/50">
                <TableRow>
                  <TableHead>Employee</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>Check In</TableHead>
                  <TableHead>Check Out</TableHead>
                  <TableHead>Working Hours</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Quick Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <AnimatePresence mode="wait">
                  {paginatedRecords.length > 0 ? (
                    paginatedRecords.map((record, index) => {
                      const employee = employees.find(
                        (e) => e.id === record.employeeId
                      );
                      return (
                        <motion.tr
                          key={record.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          transition={{ delay: index * 0.03 }}
                          className="border-b hover:bg-muted/30 transition-colors"
                        >
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <Avatar className="h-10 w-10 bg-primary/10">
                                <AvatarFallback className="text-primary font-medium">
                                  {getInitials(record.employeeName)}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="font-medium">
                                  {record.employeeName}
                                </p>
                                <p className="text-sm text-muted-foreground">
                                  {employee?.employeeId}
                                </p>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>{employee?.department}</TableCell>
                          <TableCell>
                            {record.checkIn ? (
                              <div className="flex items-center gap-1.5 text-green-600">
                                <LogIn className="h-4 w-4" />
                                <span>{record.checkIn}</span>
                              </div>
                            ) : (
                              <span className="text-muted-foreground">--</span>
                            )}
                          </TableCell>
                          <TableCell>
                            {record.checkOut ? (
                              <div className="flex items-center gap-1.5 text-red-600">
                                <LogOut className="h-4 w-4" />
                                <span>{record.checkOut}</span>
                              </div>
                            ) : (
                              <span className="text-muted-foreground">--</span>
                            )}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1.5">
                              <Clock className="h-4 w-4 text-muted-foreground" />
                              <span>
                                {record.workingHours
                                  ? `${record.workingHours}h`
                                  : "--"}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell>{getStatusBadge(record.status)}</TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-1">
                              {record.status !== "present" && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="text-green-600 hover:text-green-700 hover:bg-green-50"
                                  onClick={() =>
                                    handleUpdateAttendance(record.id, {
                                      status: "present",
                                      workingHours: 8,
                                    })
                                  }
                                >
                                  <UserCheck className="h-4 w-4" />
                                </Button>
                              )}
                              {record.status !== "absent" && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                  onClick={() =>
                                    handleUpdateAttendance(record.id, {
                                      status: "absent",
                                      workingHours: 0,
                                      checkIn: undefined,
                                      checkOut: undefined,
                                    })
                                  }
                                >
                                  <UserX className="h-4 w-4" />
                                </Button>
                              )}
                            </div>
                          </TableCell>
                        </motion.tr>
                      );
                    })
                  ) : (
                    <TableRow>
                      <TableCell
                        colSpan={7}
                        className="text-center py-12 text-muted-foreground"
                      >
                        No attendance records found for this date.
                      </TableCell>
                    </TableRow>
                  )}
                </AnimatePresence>
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-4 pt-4 border-t">
              <p className="text-sm text-muted-foreground">
                Showing {(currentPage - 1) * ITEMS_PER_PAGE + 1} to{" "}
                {Math.min(currentPage * ITEMS_PER_PAGE, filteredRecords.length)}{" "}
                of {filteredRecords.length} records
              </p>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <div className="flex items-center gap-1">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => i + 1).map(
                    (page) => (
                      <Button
                        key={page}
                        variant={currentPage === page ? "default" : "outline"}
                        size="sm"
                        onClick={() => setCurrentPage(page)}
                        className="w-8"
                      >
                        {page}
                      </Button>
                    )
                  )}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setCurrentPage((p) => Math.min(totalPages, p + 1))
                  }
                  disabled={currentPage === totalPages}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Mark Attendance Dialog */}
      <Dialog open={markAttendanceOpen} onOpenChange={setMarkAttendanceOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <UserCheck className="h-5 w-5 text-primary" />
              Mark Attendance
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Select Employee</Label>
              <Select
                value={selectedEmployee}
                onValueChange={setSelectedEmployee}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Choose employee" />
                </SelectTrigger>
                <SelectContent>
                  {unmarkedEmployees.map((emp) => (
                    <SelectItem key={emp.id} value={emp.id}>
                      {emp.name} ({emp.employeeId})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Attendance Status</Label>
              <Select
                value={attendanceForm.status}
                onValueChange={(value: AttendanceStatus) =>
                  setAttendanceForm({ ...attendanceForm, status: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="present">Present</SelectItem>
                  <SelectItem value="absent">Absent</SelectItem>
                  <SelectItem value="half-day">Half Day</SelectItem>
                  <SelectItem value="leave">On Leave</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {(attendanceForm.status === "present" ||
              attendanceForm.status === "half-day") && (
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Check In Time</Label>
                  <Input
                    type="time"
                    value={attendanceForm.checkIn}
                    onChange={(e) =>
                      setAttendanceForm({
                        ...attendanceForm,
                        checkIn: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label>Check Out Time</Label>
                  <Input
                    type="time"
                    value={attendanceForm.checkOut}
                    onChange={(e) =>
                      setAttendanceForm({
                        ...attendanceForm,
                        checkOut: e.target.value,
                      })
                    }
                  />
                </div>
              </div>
            )}

            <div className="space-y-2">
              <Label>Notes (Optional)</Label>
              <Input
                placeholder="Add any notes..."
                value={attendanceForm.notes}
                onChange={(e) =>
                  setAttendanceForm({
                    ...attendanceForm,
                    notes: e.target.value,
                  })
                }
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setMarkAttendanceOpen(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleMarkAttendance} disabled={!selectedEmployee}>
              Mark Attendance
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
