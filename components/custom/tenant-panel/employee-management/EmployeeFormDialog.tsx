"use client";

import React, { useState } from "react";
import {
  User,
  Mail,
  Phone,
  Building2,
  Briefcase,
  Calendar,
  IndianRupee,
  MapPin,
  CreditCard,
  FileText,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { departments, designations } from "./employee.data";
import type { Employee, EmployeeStatus } from "./employee.types";

interface EmployeeFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  employee?: Employee | null;
  onSave: (employee: Partial<Employee>) => void;
  mode: "add" | "edit" | "view";
}

export function EmployeeFormDialog({
  open,
  onOpenChange,
  employee,
  onSave,
  mode,
}: EmployeeFormDialogProps) {
  const [formData, setFormData] = useState<Partial<Employee>>(
    employee || {
      name: "",
      email: "",
      phone: "",
      department: "",
      designation: "",
      joiningDate: "",
      salary: 0,
      status: "active",
      address: "",
      bankAccount: "",
      panNumber: "",
    }
  );

  React.useEffect(() => {
    if (employee) {
      setFormData(employee);
    } else {
      setFormData({
        name: "",
        email: "",
        phone: "",
        department: "",
        designation: "",
        joiningDate: "",
        salary: 0,
        status: "active",
        address: "",
        bankAccount: "",
        panNumber: "",
      });
    }
  }, [employee, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onOpenChange(false);
  };

  const isViewMode = mode === "view";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <User className="h-5 w-5 text-primary" />
            {mode === "add"
              ? "Add New Employee"
              : mode === "edit"
              ? "Edit Employee"
              : "Employee Details"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Personal Information */}
          <div className="space-y-4">
            <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
              Personal Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Full Name
                </Label>
                <Input
                  id="name"
                  value={formData.name || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder="Enter full name"
                  disabled={isViewMode}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email" className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  Email Address
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  placeholder="Enter email address"
                  disabled={isViewMode}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone" className="flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  Phone Number
                </Label>
                <Input
                  id="phone"
                  value={formData.phone || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                  placeholder="+91 98765 43210"
                  disabled={isViewMode}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="address" className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  Address
                </Label>
                <Input
                  id="address"
                  value={formData.address || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, address: e.target.value })
                  }
                  placeholder="Enter address"
                  disabled={isViewMode}
                />
              </div>
            </div>
          </div>

          {/* Employment Details */}
          <div className="space-y-4">
            <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
              Employment Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="department" className="flex items-center gap-2">
                  <Building2 className="h-4 w-4" />
                  Department
                </Label>
                <Select
                  value={formData.department}
                  onValueChange={(value) =>
                    setFormData({ ...formData, department: value })
                  }
                  disabled={isViewMode}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select department" />
                  </SelectTrigger>
                  <SelectContent>
                    {departments.map((dept) => (
                      <SelectItem key={dept} value={dept}>
                        {dept}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label
                  htmlFor="designation"
                  className="flex items-center gap-2"
                >
                  <Briefcase className="h-4 w-4" />
                  Designation
                </Label>
                <Select
                  value={formData.designation}
                  onValueChange={(value) =>
                    setFormData({ ...formData, designation: value })
                  }
                  disabled={isViewMode}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select designation" />
                  </SelectTrigger>
                  <SelectContent>
                    {designations.map((desig) => (
                      <SelectItem key={desig} value={desig}>
                        {desig}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label
                  htmlFor="joiningDate"
                  className="flex items-center gap-2"
                >
                  <Calendar className="h-4 w-4" />
                  Joining Date
                </Label>
                <Input
                  id="joiningDate"
                  type="date"
                  value={formData.joiningDate || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, joiningDate: e.target.value })
                  }
                  disabled={isViewMode}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="status" className="flex items-center gap-2">
                  Status
                </Label>
                <Select
                  value={formData.status}
                  onValueChange={(value: EmployeeStatus) =>
                    setFormData({ ...formData, status: value })
                  }
                  disabled={isViewMode}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                    <SelectItem value="on-leave">On Leave</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Financial Information */}
          <div className="space-y-4">
            <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
              Financial Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="salary" className="flex items-center gap-2">
                  <IndianRupee className="h-4 w-4" />
                  Monthly Salary
                </Label>
                <Input
                  id="salary"
                  type="number"
                  value={formData.salary || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      salary: parseInt(e.target.value) || 0,
                    })
                  }
                  placeholder="Enter salary"
                  disabled={isViewMode}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label
                  htmlFor="bankAccount"
                  className="flex items-center gap-2"
                >
                  <CreditCard className="h-4 w-4" />
                  Bank Account
                </Label>
                <Input
                  id="bankAccount"
                  value={formData.bankAccount || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, bankAccount: e.target.value })
                  }
                  placeholder="XXXX-XXXX-1234"
                  disabled={isViewMode}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="panNumber" className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  PAN Number
                </Label>
                <Input
                  id="panNumber"
                  value={formData.panNumber || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, panNumber: e.target.value })
                  }
                  placeholder="ABCDE1234F"
                  disabled={isViewMode}
                />
              </div>
            </div>
          </div>

          {!isViewMode && (
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button type="submit">
                {mode === "add" ? "Add Employee" : "Save Changes"}
              </Button>
            </DialogFooter>
          )}
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default EmployeeFormDialog;
