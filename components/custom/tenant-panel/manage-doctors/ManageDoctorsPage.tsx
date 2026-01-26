"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Plus,
  Search,
  UserCog,
  Edit2,
  Trash2,
  MoreVertical,
  Download,
  RefreshCw,
  CheckCircle2,
  Phone,
  Mail,
  TrendingUp,
  IndianRupee,
  Award,
  Activity,
  Copy,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import type { Doctor, DoctorFormData } from "./doctor.types";
import { fetchDoctors, createDoctor, updateDoctor, deleteDoctor } from "./doctor.data";

export default function ManageDoctorsPage() {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [filteredDoctors, setFilteredDoctors] = useState<Doctor[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [editingDoctor, setEditingDoctor] = useState<Doctor | null>(null);
  const [deletingDoctorId, setDeletingDoctorId] = useState<string | null>(null);
  const [formData, setFormData] = useState<DoctorFormData>({
    name: "",
    email: "",
    phone: "",
    specialization: "",
    qualification: "",
    registrationNumber: "",
    hospital: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    commissionRate: 10,
    commissionType: "percentage",
    isActive: true,
  });

  useEffect(() => {
    loadDoctors();
  }, []);

  useEffect(() => {
    filterDoctors();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery, statusFilter, doctors]);

  const loadDoctors = async () => {
    setIsLoading(true);
    try {
      const data = await fetchDoctors();
      setDoctors(data);
      setFilteredDoctors(data);
    } catch (error) {
      console.error("Error loading doctors:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const filterDoctors = () => {
    let filtered = [...doctors];

    if (searchQuery) {
      filtered = filtered.filter(
        (doc) =>
          doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          doc.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
          doc.referCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
          doc.specialization.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (statusFilter && statusFilter !== "all") {
      const isActive = statusFilter === "active";
      filtered = filtered.filter((doc) => doc.isActive === isActive);
    }

    setFilteredDoctors(filtered);
  };

  const handleOpenDialog = (doctor?: Doctor) => {
    if (doctor) {
      setEditingDoctor(doctor);
      setFormData({
        name: doctor.name,
        email: doctor.email,
        phone: doctor.phone,
        specialization: doctor.specialization,
        qualification: doctor.qualification,
        registrationNumber: doctor.registrationNumber,
        hospital: doctor.hospital || "",
        address: doctor.address || "",
        city: doctor.city || "",
        state: doctor.state || "",
        pincode: doctor.pincode || "",
        commissionRate: doctor.commissionRate,
        commissionType: doctor.commissionType,
        fixedAmount: doctor.fixedAmount,
        isActive: doctor.isActive !== undefined ? doctor.isActive : true,
      });
    } else {
      setEditingDoctor(null);
      setFormData({
        name: "",
        email: "",
        phone: "",
        specialization: "",
        qualification: "",
        registrationNumber: "",
        hospital: "",
        address: "",
        city: "",
        state: "",
        pincode: "",
        commissionRate: 10,
        commissionType: "percentage",
        isActive: true,
      });
    }
    setIsDialogOpen(true);
  };

  const handleSave = async () => {
    try {
      if (editingDoctor) {
        await updateDoctor(editingDoctor.id, formData);
      } else {
        const newDoctor = await createDoctor(formData);
        // Show refer code to user
        console.log("New doctor created with refer code:", newDoctor.referCode);
      }
      await loadDoctors();
      setIsDialogOpen(false);
    } catch (error) {
      console.error("Error saving doctor:", error);
    }
  };

  const handleDelete = async () => {
    if (!deletingDoctorId) return;
    try {
      await deleteDoctor(deletingDoctorId);
      await loadDoctors();
      setIsDeleteDialogOpen(false);
      setDeletingDoctorId(null);
    } catch (error) {
      console.error("Error deleting doctor:", error);
    }
  };

  const copyReferCode = (code: string) => {
    navigator.clipboard.writeText(code);
    // Show toast notification in production
    console.log("Refer code copied:", code);
  };

  const totalCommission = doctors.reduce((sum, d) => sum + (d.totalCommissionEarned || 0), 0);
  const totalReferrals = doctors.reduce((sum, d) => sum + (d.totalReferrals || 0), 0);
  const activeDoctors = doctors.filter((d) => d.isActive).length;

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-950">
      <div className="p-6 space-y-6 max-w-400 mx-auto">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-primary/10">
                <UserCog className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h1 className="text-2xl font-bold tracking-tight">Manage Doctors</h1>
                <p className="text-sm text-muted-foreground">
                  Collaborate with doctors and track referral commissions
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Button variant="outline" size="sm" className="gap-2" onClick={loadDoctors}>
              <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
              Refresh
            </Button>
            <Button variant="outline" size="sm" className="gap-2">
              <Download className="h-4 w-4" />
              Export
            </Button>
            <Button size="sm" className="gap-2" onClick={() => handleOpenDialog()}>
              <Plus className="h-4 w-4" />
              Add Doctor
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-muted-foreground">Total Doctors</p>
                  <p className="text-2xl font-bold mt-1">{doctors.length}</p>
                </div>
                <div className="p-2 rounded-lg bg-primary/10">
                  <UserCog className="h-5 w-5 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-muted-foreground">Active</p>
                  <p className="text-2xl font-bold mt-1">{activeDoctors}</p>
                </div>
                <div className="p-2 rounded-lg bg-green-500/10">
                  <CheckCircle2 className="h-5 w-5 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-muted-foreground">Total Referrals</p>
                  <p className="text-2xl font-bold mt-1">{totalReferrals}</p>
                </div>
                <div className="p-2 rounded-lg bg-blue-500/10">
                  <TrendingUp className="h-5 w-5 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-muted-foreground">Commission Paid</p>
                  <p className="text-2xl font-bold mt-1">₹{(totalCommission / 1000).toFixed(0)}K</p>
                </div>
                <div className="p-2 rounded-lg bg-amber-500/10">
                  <IndianRupee className="h-5 w-5 text-amber-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters & Search */}
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by name, email, refer code, or specialization..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Doctors Table */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-base">Doctors List</CardTitle>
                <CardDescription>
                  Showing {filteredDoctors.length} of {doctors.length} doctors
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="rounded-lg border overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-muted/50 border-b">
                      <th className="text-left font-semibold h-11 px-4">Doctor</th>
                      <th className="text-left font-semibold h-11 px-4 hidden lg:table-cell">Contact</th>
                      <th className="text-left font-semibold h-11 px-4">Refer Code</th>
                      <th className="text-left font-semibold h-11 px-4 hidden md:table-cell">Commission</th>
                      <th className="text-right font-semibold h-11 px-4">Referrals</th>
                      <th className="text-right font-semibold h-11 px-4">Earned</th>
                      <th className="text-center font-semibold h-11 px-4">Status</th>
                      <th className="text-center font-semibold h-11 px-4 w-20">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredDoctors.map((doctor, i) => (
                      <motion.tr
                        key={doctor.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.02 }}
                        className="border-b hover:bg-muted/30 transition-colors"
                      >
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-primary/10">
                              <Award className="h-4 w-4 text-primary" />
                            </div>
                            <div>
                              <p className="font-medium">{doctor.name}</p>
                              <p className="text-xs text-muted-foreground">{doctor.specialization}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3 hidden lg:table-cell">
                          <div className="space-y-1 text-xs text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <Mail className="h-3 w-3" />
                              <span className="truncate max-w-40">{doctor.email}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Phone className="h-3 w-3" />
                              <span>{doctor.phone}</span>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <code className="text-xs bg-muted px-2 py-1 rounded font-mono">
                              {doctor.referCode}
                            </code>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6"
                              onClick={() => copyReferCode(doctor.referCode)}
                            >
                              <Copy className="h-3 w-3" />
                            </Button>
                          </div>
                        </td>
                        <td className="px-4 py-3 hidden md:table-cell">
                          <Badge variant="outline" className="text-xs">
                            {doctor.commissionType === "percentage"
                              ? `${doctor.commissionRate}%`
                              : `₹${doctor.fixedAmount}`}
                          </Badge>
                        </td>
                        <td className="px-4 py-3 text-right font-medium">
                          {doctor.totalReferrals || 0}
                        </td>
                        <td className="px-4 py-3 text-right font-semibold text-primary">
                          ₹{((doctor.totalCommissionEarned || 0) / 1000).toFixed(1)}K
                        </td>
                        <td className="px-4 py-3 text-center">
                          {doctor.isActive ? (
                            <Badge className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
                              Active
                            </Badge>
                          ) : (
                            <Badge variant="secondary">Inactive</Badge>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem onClick={() => handleOpenDialog(doctor)}>
                                <Edit2 className="h-4 w-4 mr-2" />
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Activity className="h-4 w-4 mr-2" />
                                View Commission Log
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                className="text-red-600"
                                onClick={() => {
                                  setDeletingDoctorId(doctor.id);
                                  setIsDeleteDialogOpen(true);
                                }}
                              >
                                <Trash2 className="h-4 w-4 mr-2" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Add/Edit Dialog */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingDoctor ? "Edit Doctor" : "Add New Doctor"}</DialogTitle>
              <DialogDescription>
                {editingDoctor
                  ? "Update doctor information"
                  : "Add a new doctor to your collaboration network"}
              </DialogDescription>
            </DialogHeader>

            <Tabs defaultValue="basic" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="basic">Basic Info</TabsTrigger>
                <TabsTrigger value="professional">Professional</TabsTrigger>
                <TabsTrigger value="commission">Commission</TabsTrigger>
              </TabsList>

              <TabsContent value="basic" className="space-y-4 pt-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Full Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Dr. Rajesh Kumar"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="doctor@hospital.com"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="phone">Phone *</Label>
                    <Input
                      id="phone"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="+91 98765 43210"
                    />
                  </div>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="address">Address</Label>
                  <Input
                    id="address"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    placeholder="Street address"
                  />
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="city">City</Label>
                    <Input
                      id="city"
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="state">State</Label>
                    <Input
                      id="state"
                      value={formData.state}
                      onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="pincode">Pincode</Label>
                    <Input
                      id="pincode"
                      value={formData.pincode}
                      onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                    />
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="professional" className="space-y-4 pt-4">
                <div className="grid gap-2">
                  <Label htmlFor="specialization">Specialization *</Label>
                  <Input
                    id="specialization"
                    value={formData.specialization}
                    onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
                    placeholder="e.g., Cardiologist"
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="qualification">Qualification *</Label>
                  <Input
                    id="qualification"
                    value={formData.qualification}
                    onChange={(e) => setFormData({ ...formData, qualification: e.target.value })}
                    placeholder="e.g., MD, DM (Cardiology)"
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="registrationNumber">Registration Number *</Label>
                  <Input
                    id="registrationNumber"
                    value={formData.registrationNumber}
                    onChange={(e) =>
                      setFormData({ ...formData, registrationNumber: e.target.value })
                    }
                    placeholder="MCI/State registration number"
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="hospital">Hospital/Clinic</Label>
                  <Input
                    id="hospital"
                    value={formData.hospital}
                    onChange={(e) => setFormData({ ...formData, hospital: e.target.value })}
                    placeholder="Associated hospital or clinic"
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="isActive"
                    checked={formData.isActive}
                    onCheckedChange={(checked) =>
                      setFormData({ ...formData, isActive: checked === true })
                    }
                  />
                  <Label htmlFor="isActive" className="text-sm font-normal">
                    Active (can receive referrals)
                  </Label>
                </div>
              </TabsContent>

              <TabsContent value="commission" className="space-y-4 pt-4">
                <div className="grid gap-2">
                  <Label htmlFor="commissionType">Commission Type *</Label>
                  <Select
                    value={formData.commissionType}
                    onValueChange={(value: "percentage" | "fixed") =>
                      setFormData({ ...formData, commissionType: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="percentage">Percentage-based</SelectItem>
                      <SelectItem value="fixed">Fixed Amount</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {formData.commissionType === "percentage" ? (
                  <div className="grid gap-2">
                    <Label htmlFor="commissionRate">Commission Rate (%) *</Label>
                    <Input
                      id="commissionRate"
                      type="number"
                      value={formData.commissionRate}
                      onChange={(e) =>
                        setFormData({ ...formData, commissionRate: Number(e.target.value) })
                      }
                      placeholder="e.g., 15"
                      min="0"
                      max="100"
                    />
                    <p className="text-xs text-muted-foreground">
                      Doctor will receive {formData.commissionRate}% of each referral order value
                    </p>
                  </div>
                ) : (
                  <div className="grid gap-2">
                    <Label htmlFor="fixedAmount">Fixed Commission Amount (₹) *</Label>
                    <Input
                      id="fixedAmount"
                      type="number"
                      value={formData.fixedAmount || ""}
                      onChange={(e) =>
                        setFormData({ ...formData, fixedAmount: Number(e.target.value) })
                      }
                      placeholder="e.g., 200"
                      min="0"
                    />
                    <p className="text-xs text-muted-foreground">
                      Doctor will receive ₹{formData.fixedAmount || 0} for each referral
                    </p>
                  </div>
                )}

                <div className="rounded-lg border bg-muted/50 p-4 space-y-2">
                  <p className="text-sm font-medium">Commission Calculation Example:</p>
                  <div className="text-sm text-muted-foreground space-y-1">
                    <p>Order Amount: ₹3,500</p>
                    <p>
                      Commission:{" "}
                      {formData.commissionType === "percentage"
                        ? `₹${(3500 * formData.commissionRate / 100).toFixed(0)} (${formData.commissionRate}%)`
                        : `₹${formData.fixedAmount || 0}`}
                    </p>
                  </div>
                </div>
              </TabsContent>
            </Tabs>

            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleSave}>
                {editingDoctor ? "Update Doctor" : "Add Doctor"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Delete Dialog */}
        <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Delete Doctor</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete this doctor? All commission history will be
                preserved but the doctor will no longer be able to make referrals.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
                Cancel
              </Button>
              <Button variant="destructive" onClick={handleDelete}>
                Delete
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
