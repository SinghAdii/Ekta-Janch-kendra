"use client";

import { 
  Calendar, 
  Wallet, 
  Clock, 
  CheckCircle,
  TrendingUp,
  Truck
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth, ROLE_LABELS } from "@/lib/auth";
import {
  mockAttendanceData,
  mockSalaryData,
  mockCollectionAssignments,
  getAttendanceStats,
  getSalaryStats,
  getCollectionStats,
} from "@/components/custom/employee-portal/employee.data";

export default function EmployeePortalDashboard() {
  const { user } = useAuth();
  const isHomeCollector = user?.role === "home_collector";

  const attendanceStats = getAttendanceStats(mockAttendanceData);
  const salaryStats = getSalaryStats(mockSalaryData);
  const collectionStats = isHomeCollector ? getCollectionStats(mockCollectionAssignments) : null;

  // Get current month salary
  const currentMonthSalary = mockSalaryData[0];

  // Get today's collections (for home collectors)
  const todayCollections = isHomeCollector
    ? mockCollectionAssignments.filter(
        (c) => c.scheduledDate === "2026-02-05" && c.status !== "cancelled"
      )
    : [];

  return (
    <div className="p-6 lg:p-8 space-y-8">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-emerald-600 to-emerald-700 rounded-2xl p-6 lg:p-8 text-white">
        <h1 className="text-2xl lg:text-3xl font-bold mb-2">
          Welcome back, {user?.name?.split(" ")[0]}! 👋
        </h1>
        <p className="text-emerald-100">
          {user?.role ? ROLE_LABELS[user.role] : ""} • {new Date().toLocaleDateString("en-IN", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </p>
      </div>

      {/* Stats Cards */}
      <div className={`grid gap-6 ${isHomeCollector ? "md:grid-cols-2 lg:grid-cols-4" : "md:grid-cols-2 lg:grid-cols-3"}`}>
        {/* Attendance Summary */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              This Month Attendance
            </CardTitle>
            <Calendar className="w-5 h-5 text-emerald-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">
              {attendanceStats.presentDays + attendanceStats.halfDays * 0.5} days
            </div>
            <p className="text-xs text-gray-500 mt-1">
              {attendanceStats.presentDays} full + {attendanceStats.halfDays} half days
            </p>
          </CardContent>
        </Card>

        {/* Average Work Hours */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Avg. Work Hours
            </CardTitle>
            <Clock className="w-5 h-5 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">
              {attendanceStats.averageWorkHours.toFixed(1)} hrs
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Per working day
            </p>
          </CardContent>
        </Card>

        {/* Current Month Salary */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              {currentMonthSalary.month}
            </CardTitle>
            <Wallet className="w-5 h-5 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">
              ₹{currentMonthSalary.netSalary.toLocaleString()}
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Status:{" "}
              <span
                className={`font-medium ${
                  currentMonthSalary.status === "paid"
                    ? "text-green-600"
                    : currentMonthSalary.status === "pending"
                    ? "text-amber-600"
                    : "text-blue-600"
                }`}
              >
                {currentMonthSalary.status.charAt(0).toUpperCase() +
                  currentMonthSalary.status.slice(1)}
              </span>
            </p>
          </CardContent>
        </Card>

        {/* Collections Today (Home Collectors Only) */}
        {isHomeCollector && collectionStats && (
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Today&apos;s Collections
              </CardTitle>
              <Truck className="w-5 h-5 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">
                {todayCollections.length}
              </div>
              <p className="text-xs text-gray-500 mt-1">
                {todayCollections.filter((c) => c.status === "pending").length} pending,{" "}
                {todayCollections.filter((c) => c.status === "in-progress").length} in progress
              </p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Quick Info Cards */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent Attendance */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-emerald-600" />
              Recent Attendance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {mockAttendanceData.slice(0, 5).map((record) => (
                <div
                  key={record.id}
                  className="flex items-center justify-between py-2 border-b last:border-0"
                >
                  <div>
                    <p className="font-medium text-gray-900">
                      {new Date(record.date).toLocaleDateString("en-IN", {
                        weekday: "short",
                        month: "short",
                        day: "numeric",
                      })}
                    </p>
                    {record.checkIn && (
                      <p className="text-xs text-gray-500">
                        {record.checkIn} - {record.checkOut || "Present"}
                      </p>
                    )}
                  </div>
                  <span
                    className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                      record.status === "present"
                        ? "bg-green-100 text-green-700"
                        : record.status === "absent"
                        ? "bg-red-100 text-red-700"
                        : record.status === "half-day"
                        ? "bg-amber-100 text-amber-700"
                        : record.status === "leave"
                        ? "bg-blue-100 text-blue-700"
                        : "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {record.status.charAt(0).toUpperCase() + record.status.slice(1).replace("-", " ")}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Salary History / Today's Collections */}
        {isHomeCollector ? (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Truck className="w-5 h-5 text-orange-600" />
                Today&apos;s Collection Schedule
              </CardTitle>
            </CardHeader>
            <CardContent>
              {todayCollections.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <CheckCircle className="w-12 h-12 mx-auto mb-3 text-green-500" />
                  <p>No collections scheduled for today</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {todayCollections.map((collection) => (
                    <div
                      key={collection.id}
                      className="p-3 bg-gray-50 rounded-lg border"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <p className="font-medium text-gray-900">
                            {collection.patientName}
                          </p>
                          <p className="text-xs text-gray-500">
                            {collection.scheduledTime}
                          </p>
                        </div>
                        <span
                          className={`px-2 py-0.5 rounded text-xs font-medium ${
                            collection.priority === "urgent"
                              ? "bg-red-100 text-red-700"
                              : "bg-gray-100 text-gray-600"
                          }`}
                        >
                          {collection.priority}
                        </span>
                      </div>
                      <p className="text-xs text-gray-600 line-clamp-1">
                        {collection.address}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-purple-600" />
                Salary Overview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-purple-50 rounded-lg">
                    <p className="text-sm text-purple-600 font-medium">Total Earned</p>
                    <p className="text-xl font-bold text-purple-900">
                      ₹{salaryStats.totalEarned.toLocaleString()}
                    </p>
                  </div>
                  <div className="p-4 bg-emerald-50 rounded-lg">
                    <p className="text-sm text-emerald-600 font-medium">Avg. Monthly</p>
                    <p className="text-xl font-bold text-emerald-900">
                      ₹{salaryStats.averageSalary.toLocaleString()}
                    </p>
                  </div>
                </div>
                <div className="space-y-2">
                  {mockSalaryData.slice(0, 3).map((salary) => (
                    <div
                      key={salary.id}
                      className="flex items-center justify-between py-2 border-b last:border-0"
                    >
                      <span className="text-sm text-gray-600">{salary.month}</span>
                      <div className="flex items-center gap-3">
                        <span className="font-medium">
                          ₹{salary.netSalary.toLocaleString()}
                        </span>
                        <span
                          className={`px-2 py-0.5 rounded text-xs ${
                            salary.status === "paid"
                              ? "bg-green-100 text-green-700"
                              : "bg-amber-100 text-amber-700"
                          }`}
                        >
                          {salary.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
