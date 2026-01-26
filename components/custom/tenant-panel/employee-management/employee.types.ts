// Employee Management Types

export type EmployeeStatus = "active" | "inactive" | "on-leave";
export type AttendanceStatus = "present" | "absent" | "half-day" | "leave" | "holiday";
export type PaymentStatus = "paid" | "pending" | "partial";

export interface Employee {
  id: string;
  employeeId: string;
  name: string;
  email: string;
  phone: string;
  department: string;
  designation: string;
  joiningDate: string;
  salary: number;
  status: EmployeeStatus;
  avatar?: string;
  address?: string;
  bankAccount?: string;
  panNumber?: string;
}

export interface AttendanceRecord {
  id: string;
  employeeId: string;
  employeeName: string;
  date: string;
  checkIn?: string;
  checkOut?: string;
  status: AttendanceStatus;
  workingHours?: number;
  notes?: string;
}

export interface SalaryRecord {
  id: string;
  employeeId: string;
  employeeName: string;
  month: string;
  year: number;
  baseSalary: number;
  workingDays: number;
  presentDays: number;
  halfDays: number;
  leaveDays: number;
  deductions: number;
  bonus: number;
  netSalary: number;
  paymentStatus: PaymentStatus;
  paymentDate?: string;
}

export interface DepartmentStats {
  department: string;
  totalEmployees: number;
  presentToday: number;
  onLeave: number;
}

export interface AttendanceSummary {
  totalEmployees: number;
  presentToday: number;
  absentToday: number;
  onLeave: number;
  halfDay: number;
}

export interface SalarySummary {
  totalPayroll: number;
  paidAmount: number;
  pendingAmount: number;
  totalEmployees: number;
}
