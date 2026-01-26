"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Users,
  Search,
  Plus,
  Download,
  MoreVertical,
  Eye,
  Edit,
  Trash2,
  Lock,
  Shield,
  Mail,
  Clock,
  CheckCircle2,
  AlertCircle,
  User,
  LogOut,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";

import type {
  AdminUser,
  AdminRole,
  AdminUserFormData,
  ValidationError,
} from "./admin-users.types";
import {
  fetchAdminUsers,
  createAdminUser,
  updateAdminUser,
  deleteAdminUser,
  checkUsernameExists,
  checkEmailExists,
  changeAdminStatus,
  getAdminUsersStats,
} from "./admin-users.data";

const ADMIN_ROLES: AdminRole[] = [
  "Super Admin",
  "Manager",
  "Operator",
  "Accountant",
  "Technician",
  "Viewer",
];

const roleColors: Record<AdminRole, string> = {
  "Super Admin": "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
  Manager: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  Operator: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
  Accountant: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  Technician: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  Viewer: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400",
};

const statusColors: Record<string, string> = {
  Active: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  Inactive: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400",
  Suspended: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
};

export default function AdminUsersPage() {
  const [adminUsers, setAdminUsers] = useState<AdminUser[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<AdminUser[]>([]);
  const [stats, setStats] = useState<{
    total: number;
    active: number;
    inactive: number;
    suspended: number;
    roleCount: Record<AdminRole, number>;
  }>({
    total: 0,
    active: 0,
    inactive: 0,
    suspended: 0,
    roleCount: {
      "Super Admin": 0,
      Manager: 0,
      Operator: 0,
      Accountant: 0,
      Technician: 0,
      Viewer: 0,
    },
  });
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  // Dialog states
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);

  // Form states
  const [formData, setFormData] = useState<AdminUserFormData>({
    username: "",
    password: "",
    confirmPassword: "",
    email: "",
    fullName: "",
    roles: [],
  });

  const [formErrors, setFormErrors] = useState<ValidationError[]>([]);
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    filterData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery, roleFilter, statusFilter, adminUsers]);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [users, stats] = await Promise.all([fetchAdminUsers(), getAdminUsersStats()]);
      setAdminUsers(users);
      setFilteredUsers(users);
      setStats(stats);
    } catch (error) {
      console.error("Error loading data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const filterData = () => {
    let filtered = [...adminUsers];

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (u) =>
          u.username.toLowerCase().includes(q) ||
          u.fullName.toLowerCase().includes(q) ||
          u.email.toLowerCase().includes(q)
      );
    }

    if (roleFilter && roleFilter !== "all") {
      filtered = filtered.filter((u) => u.roles.includes(roleFilter as AdminRole));
    }

    if (statusFilter && statusFilter !== "all") {
      filtered = filtered.filter((u) => u.status === statusFilter);
    }

    setFilteredUsers(filtered);
  };

  const validateForm = async (isEdit = false): Promise<boolean> => {
    const errors: ValidationError[] = [];

    if (!formData.username.trim()) {
      errors.push({ field: "username", message: "Username is required" });
    } else if (formData.username.length < 3) {
      errors.push({ field: "username", message: "Username must be at least 3 characters" });
    } else {
      const exists = await checkUsernameExists(formData.username, isEdit ? selectedUser?.id : undefined);
      if (exists) {
        errors.push({ field: "username", message: "Username already exists" });
      }
    }

    if (!isEdit && !formData.password) {
      errors.push({ field: "password", message: "Password is required" });
    } else if (!isEdit && formData.password.length < 6) {
      errors.push({ field: "password", message: "Password must be at least 6 characters" });
    }

    if (!isEdit && formData.password !== formData.confirmPassword) {
      errors.push({ field: "confirmPassword", message: "Passwords do not match" });
    }

    if (!formData.email.trim()) {
      errors.push({ field: "email", message: "Email is required" });
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.push({ field: "email", message: "Invalid email format" });
    } else {
      const exists = await checkEmailExists(formData.email, isEdit ? selectedUser?.id : undefined);
      if (exists) {
        errors.push({ field: "email", message: "Email already exists" });
      }
    }

    if (!formData.fullName.trim()) {
      errors.push({ field: "fullName", message: "Full name is required" });
    }

    if (formData.roles.length === 0) {
      errors.push({ field: "roles", message: "Select at least one role" });
    }

    setFormErrors(errors);
    return errors.length === 0;
  };

  const handleAddUser = async () => {
    if (!(await validateForm(false))) return;

    try {
      await createAdminUser({
        username: formData.username,
        password: formData.password,
        email: formData.email,
        fullName: formData.fullName,
        roles: formData.roles,
      });

      setSuccessMessage("Admin user created successfully!");
      setTimeout(() => setSuccessMessage(""), 3000);

      setFormData({
        username: "",
        password: "",
        confirmPassword: "",
        email: "",
        fullName: "",
        roles: [],
      });
      setFormErrors([]);
      setIsAddDialogOpen(false);
      await loadData();
    } catch (error) {
      console.error("Error creating user:", error);
    }
  };

  const handleEditUser = async () => {
    if (!selectedUser || !(await validateForm(true))) return;

    try {
      await updateAdminUser(selectedUser.id, {
        username: formData.username,
        email: formData.email,
        fullName: formData.fullName,
        roles: formData.roles,
      });

      setSuccessMessage("Admin user updated successfully!");
      setTimeout(() => setSuccessMessage(""), 3000);

      setIsEditDialogOpen(false);
      await loadData();
    } catch (error) {
      console.error("Error updating user:", error);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!confirm("Are you sure you want to delete this admin user?")) return;

    try {
      await deleteAdminUser(userId);
      setSuccessMessage("Admin user deleted successfully!");
      setTimeout(() => setSuccessMessage(""), 3000);
      await loadData();
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  const handleStatusChange = async (userId: string, newStatus: "Active" | "Inactive" | "Suspended") => {
    try {
      await changeAdminStatus(userId, newStatus);
      setSuccessMessage(`Admin user status changed to ${newStatus}`);
      setTimeout(() => setSuccessMessage(""), 3000);
      await loadData();
    } catch (error) {
      console.error("Error changing status:", error);
    }
  };

  const openEditDialog = (user: AdminUser) => {
    setSelectedUser(user);
    setFormData({
      username: user.username,
      password: "",
      confirmPassword: "",
      email: user.email,
      fullName: user.fullName,
      roles: user.roles,
    });
    setFormErrors([]);
    setIsEditDialogOpen(true);
  };

  const openDetailDialog = (user: AdminUser) => {
    setSelectedUser(user);
    setIsDetailDialogOpen(true);
  };

  const getError = (field: string) => formErrors.find((e) => e.field === field)?.message;

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-white to-slate-100 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
      <div className="p-6 space-y-6 max-w-full mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-indigo-100 rounded-xl dark:bg-indigo-900/30">
              <Users className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight">Admin Users Management</h1>
              <p className="text-sm text-muted-foreground">Create and manage admin users with role-based access</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
            <Button
              size="sm"
              className="bg-indigo-600 hover:bg-indigo-700"
              onClick={() => {
                setFormData({
                  username: "",
                  password: "",
                  confirmPassword: "",
                  email: "",
                  fullName: "",
                  roles: [],
                });
                setFormErrors([]);
                setIsAddDialogOpen(true);
              }}
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Admin User
            </Button>
          </div>
        </div>

        {/* Success Message */}
        {successMessage && (
          <Alert className="bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800">
            <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400" />
            <AlertDescription className="text-green-800 dark:text-green-400">{successMessage}</AlertDescription>
          </Alert>
        )}

        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-5">
          <Card className="border-l-4 border-l-indigo-500">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground">Total Users</p>
                  <p className="text-2xl font-bold">{stats.total}</p>
                </div>
                <Users className="h-8 w-8 text-indigo-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-green-500">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground">Active</p>
                  <p className="text-2xl font-bold">{stats.active}</p>
                </div>
                <CheckCircle2 className="h-8 w-8 text-green-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-gray-500">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground">Inactive</p>
                  <p className="text-2xl font-bold">{stats.inactive}</p>
                </div>
                <User className="h-8 w-8 text-gray-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-red-500">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground">Suspended</p>
                  <p className="text-2xl font-bold">{stats.suspended}</p>
                </div>
                <AlertCircle className="h-8 w-8 text-red-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-purple-500">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground">Super Admins</p>
                  <p className="text-2xl font-bold">{stats.roleCount["Super Admin"] || 0}</p>
                </div>
                <Shield className="h-8 w-8 text-purple-200" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by username, name, or email..."
                  className="pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Select value={roleFilter} onValueChange={setRoleFilter}>
                <SelectTrigger className="w-full md:w-40">
                  <SelectValue placeholder="Role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Roles</SelectItem>
                  {ADMIN_ROLES.map((role) => (
                    <SelectItem key={role} value={role}>
                      {role}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full md:w-35">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="Inactive">Inactive</SelectItem>
                  <SelectItem value="Suspended">Suspended</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Admin Users Table */}
        <Card className="overflow-hidden shadow-lg">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted/50 text-muted-foreground font-medium">
                <tr>
                  <th className="px-4 py-3 text-left">User Info</th>
                  <th className="px-4 py-3 text-left">Roles</th>
                  <th className="px-4 py-3 text-left">Status</th>
                  <th className="px-4 py-3 text-left">Last Login</th>
                  <th className="px-4 py-3 text-left">Created</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {isLoading ? (
                  <tr>
                    <td colSpan={6} className="px-4 py-12 text-center text-muted-foreground">
                      Loading...
                    </td>
                  </tr>
                ) : filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-4 py-12 text-center text-muted-foreground">
                      No admin users found
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((user, i) => (
                    <motion.tr
                      key={user.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.03 }}
                      className="hover:bg-muted/50 transition-colors"
                    >
                      <td className="px-4 py-3">
                        <div>
                          <p className="font-medium">{user.fullName}</p>
                          <p className="text-xs text-muted-foreground">@{user.username}</p>
                          <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                            <Mail className="h-3 w-3" />
                            {user.email}
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex flex-wrap gap-1">
                          {user.roles.map((role: AdminRole) => (
                            <Badge key={role} className={roleColors[role]}>
                              {role}
                            </Badge>
                          ))}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <Badge className={statusColors[user.status]}>{user.status}</Badge>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Clock className="h-3 w-3" />
                          {user.lastLogin
                            ? new Date(user.lastLogin).toLocaleDateString("en-IN")
                            : "Never"}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <p className="text-xs text-muted-foreground">
                          {new Date(user.createdAt).toLocaleDateString("en-IN")}
                        </p>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => openDetailDialog(user)}>
                              <Eye className="mr-2 h-4 w-4" /> View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => openEditDialog(user)}>
                              <Edit className="mr-2 h-4 w-4" /> Edit
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            {user.status !== "Active" && (
                              <DropdownMenuItem
                                onClick={() => handleStatusChange(user.id, "Active")}
                              >
                                <CheckCircle2 className="mr-2 h-4 w-4 text-green-600" /> Activate
                              </DropdownMenuItem>
                            )}
                            {user.status !== "Inactive" && (
                              <DropdownMenuItem
                                onClick={() => handleStatusChange(user.id, "Inactive")}
                              >
                                <LogOut className="mr-2 h-4 w-4 text-gray-600" /> Deactivate
                              </DropdownMenuItem>
                            )}
                            {user.status !== "Suspended" && (
                              <DropdownMenuItem
                                onClick={() => handleStatusChange(user.id, "Suspended")}
                              >
                                <Lock className="mr-2 h-4 w-4 text-red-600" /> Suspend
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              className="text-red-600"
                              onClick={() => handleDeleteUser(user.id)}
                            >
                              <Trash2 className="mr-2 h-4 w-4" /> Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </motion.tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Add Admin User Dialog */}
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Add New Admin User</DialogTitle>
              <DialogDescription>Create a new admin user with role-based access control</DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Username *</Label>
                  <Input
                    value={formData.username}
                    onChange={(e) =>
                      setFormData({ ...formData, username: e.target.value.toLowerCase() })
                    }
                    placeholder="username"
                    className={getError("username") ? "border-red-500" : ""}
                  />
                  {getError("username") && (
                    <p className="text-xs text-red-600">{getError("username")}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label>Email *</Label>
                  <Input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="email@example.com"
                    className={getError("email") ? "border-red-500" : ""}
                  />
                  {getError("email") && (
                    <p className="text-xs text-red-600">{getError("email")}</p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label>Full Name *</Label>
                <Input
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  placeholder="Full Name"
                  className={getError("fullName") ? "border-red-500" : ""}
                />
                {getError("fullName") && (
                  <p className="text-xs text-red-600">{getError("fullName")}</p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Password *</Label>
                  <Input
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    placeholder="••••••••"
                    className={getError("password") ? "border-red-500" : ""}
                  />
                  {getError("password") && (
                    <p className="text-xs text-red-600">{getError("password")}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label>Confirm Password *</Label>
                  <Input
                    type="password"
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                    placeholder="••••••••"
                    className={getError("confirmPassword") ? "border-red-500" : ""}
                  />
                  {getError("confirmPassword") && (
                    <p className="text-xs text-red-600">{getError("confirmPassword")}</p>
                  )}
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label className="font-semibold">Select Roles *</Label>
                  {getError("roles") && (
                    <p className="text-xs text-red-600">{getError("roles")}</p>
                  )}
                </div>
                <div className="space-y-2 p-3 border rounded-lg">
                  {ADMIN_ROLES.map((role) => (
                    <div key={role} className="flex items-center gap-2">
                      <Checkbox
                        id={`role-${role}`}
                        checked={formData.roles.includes(role)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setFormData({
                              ...formData,
                              roles: [...formData.roles, role],
                            });
                          } else {
                            setFormData({
                              ...formData,
                              roles: formData.roles.filter((r: AdminRole) => r !== role),
                            });
                          }
                        }}
                      />
                      <Label htmlFor={`role-${role}`} className="cursor-pointer font-normal">
                        {role}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddUser} className="bg-indigo-600 hover:bg-indigo-700">
                Create Admin User
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Edit Admin User Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Edit Admin User</DialogTitle>
              <DialogDescription>Update admin user details and roles</DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Username *</Label>
                  <Input
                    value={formData.username}
                    onChange={(e) =>
                      setFormData({ ...formData, username: e.target.value.toLowerCase() })
                    }
                    placeholder="username"
                    className={getError("username") ? "border-red-500" : ""}
                  />
                  {getError("username") && (
                    <p className="text-xs text-red-600">{getError("username")}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label>Email *</Label>
                  <Input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="email@example.com"
                    className={getError("email") ? "border-red-500" : ""}
                  />
                  {getError("email") && (
                    <p className="text-xs text-red-600">{getError("email")}</p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label>Full Name *</Label>
                <Input
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  placeholder="Full Name"
                  className={getError("fullName") ? "border-red-500" : ""}
                />
                {getError("fullName") && (
                  <p className="text-xs text-red-600">{getError("fullName")}</p>
                )}
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label className="font-semibold">Select Roles *</Label>
                  {getError("roles") && (
                    <p className="text-xs text-red-600">{getError("roles")}</p>
                  )}
                </div>
                <div className="space-y-2 p-3 border rounded-lg">
                  {ADMIN_ROLES.map((role) => (
                    <div key={role} className="flex items-center gap-2">
                      <Checkbox
                        id={`edit-role-${role}`}
                        checked={formData.roles.includes(role)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setFormData({
                              ...formData,
                              roles: [...formData.roles, role],
                            });
                          } else {
                            setFormData({
                              ...formData,
                              roles: formData.roles.filter((r: AdminRole) => r !== role),
                            });
                          }
                        }}
                      />
                      <Label htmlFor={`edit-role-${role}`} className="cursor-pointer font-normal">
                        {role}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleEditUser} className="bg-indigo-600 hover:bg-indigo-700">
                Update Admin User
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Detail Dialog */}
        <Dialog open={isDetailDialogOpen} onOpenChange={setIsDetailDialogOpen}>
          <DialogContent className="max-w-2xl">
            {selectedUser && (
              <>
                <DialogHeader>
                  <DialogTitle>{selectedUser.fullName}</DialogTitle>
                  <DialogDescription>Admin User Details & Permissions</DialogDescription>
                </DialogHeader>

                <Tabs defaultValue="info" className="py-4">
                  <TabsList>
                    <TabsTrigger value="info">User Info</TabsTrigger>
                    <TabsTrigger value="permissions">Permissions</TabsTrigger>
                  </TabsList>

                  {/* User Info Tab */}
                  <TabsContent value="info" className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-muted/50 p-3 rounded-lg">
                        <p className="text-xs text-muted-foreground">Username</p>
                        <p className="font-semibold">@{selectedUser.username}</p>
                      </div>
                      <div className="bg-muted/50 p-3 rounded-lg">
                        <p className="text-xs text-muted-foreground">Email</p>
                        <p className="font-semibold break-all">{selectedUser.email}</p>
                      </div>
                      <div className="bg-muted/50 p-3 rounded-lg">
                        <p className="text-xs text-muted-foreground">Status</p>
                        <Badge className={statusColors[selectedUser.status]}>
                          {selectedUser.status}
                        </Badge>
                      </div>
                      <div className="bg-muted/50 p-3 rounded-lg">
                        <p className="text-xs text-muted-foreground">Created</p>
                        <p className="font-semibold">
                          {new Date(selectedUser.createdAt).toLocaleDateString("en-IN")}
                        </p>
                      </div>
                    </div>

                    <div className="bg-muted/50 p-3 rounded-lg">
                      <p className="text-xs text-muted-foreground mb-2">Roles</p>
                      <div className="flex flex-wrap gap-2">
                        {selectedUser.roles.map((role: AdminRole) => (
                          <Badge key={role} className={roleColors[role]}>
                            {role}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {selectedUser.lastLogin && (
                      <div className="bg-muted/50 p-3 rounded-lg">
                        <p className="text-xs text-muted-foreground">Last Login</p>
                        <p className="font-semibold">
                          {new Date(selectedUser.lastLogin).toLocaleString("en-IN")}
                        </p>
                      </div>
                    )}
                  </TabsContent>

                  {/* Permissions Tab */}
                  <TabsContent value="permissions" className="space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                      {Object.entries(selectedUser.permissions).map(([permission, hasAccess]) => (
                        <div key={permission} className="flex items-center gap-2 p-2 border rounded">
                          {hasAccess ? (
                            <CheckCircle2 className="h-4 w-4 text-green-600" />
                          ) : (
                            <AlertCircle className="h-4 w-4 text-gray-400" />
                          )}
                          <span className="text-sm">
                            {permission
                              .replace(/can|([A-Z])/g, (m, p) =>
                                m === "can" ? "" : " " + p.toLowerCase()
                              )
                              .trim()}
                          </span>
                        </div>
                      ))}
                    </div>
                  </TabsContent>
                </Tabs>

                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsDetailDialogOpen(false)}>
                    Close
                  </Button>
                </DialogFooter>
              </>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
