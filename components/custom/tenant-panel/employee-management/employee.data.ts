// Employee Management Mock Data

import type {
  Employee,
  AttendanceRecord,
  SalaryRecord,
  DepartmentStats,
} from "./employee.types";

export const employees: Employee[] = [
  {
    id: "1",
    employeeId: "EMP001",
    name: "Rajesh Kumar",
    email: "rajesh.kumar@ektajanch.com",
    phone: "+91 98765 43210",
    department: "Pathology",
    designation: "Lab Technician",
    joiningDate: "2024-01-15",
    salary: 35000,
    status: "active",
    address: "123, MG Road, Delhi",
    bankAccount: "XXXX-XXXX-1234",
    panNumber: "ABCDE1234F",
  },
  {
    id: "2",
    employeeId: "EMP002",
    name: "Priya Sharma",
    email: "priya.sharma@ektajanch.com",
    phone: "+91 98765 43211",
    department: "Radiology",
    designation: "Senior Radiologist",
    joiningDate: "2023-06-20",
    salary: 75000,
    status: "active",
    address: "456, Connaught Place, Delhi",
    bankAccount: "XXXX-XXXX-5678",
    panNumber: "FGHIJ5678K",
  },
  {
    id: "3",
    employeeId: "EMP003",
    name: "Amit Patel",
    email: "amit.patel@ektajanch.com",
    phone: "+91 98765 43212",
    department: "Reception",
    designation: "Front Desk Executive",
    joiningDate: "2024-03-10",
    salary: 22000,
    status: "active",
    address: "789, Lajpat Nagar, Delhi",
    bankAccount: "XXXX-XXXX-9012",
    panNumber: "KLMNO9012P",
  },
  {
    id: "4",
    employeeId: "EMP004",
    name: "Sneha Gupta",
    email: "sneha.gupta@ektajanch.com",
    phone: "+91 98765 43213",
    department: "Pathology",
    designation: "Phlebotomist",
    joiningDate: "2024-02-01",
    salary: 28000,
    status: "on-leave",
    address: "321, Karol Bagh, Delhi",
    bankAccount: "XXXX-XXXX-3456",
    panNumber: "PQRST3456U",
  },
  {
    id: "5",
    employeeId: "EMP005",
    name: "Vikram Singh",
    email: "vikram.singh@ektajanch.com",
    phone: "+91 98765 43214",
    department: "Administration",
    designation: "Manager",
    joiningDate: "2022-11-05",
    salary: 55000,
    status: "active",
    address: "654, Saket, Delhi",
    bankAccount: "XXXX-XXXX-7890",
    panNumber: "UVWXY7890Z",
  },
  {
    id: "6",
    employeeId: "EMP006",
    name: "Anita Desai",
    email: "anita.desai@ektajanch.com",
    phone: "+91 98765 43215",
    department: "Billing",
    designation: "Billing Executive",
    joiningDate: "2024-04-15",
    salary: 25000,
    status: "active",
    address: "987, Dwarka, Delhi",
    bankAccount: "XXXX-XXXX-2345",
    panNumber: "ABCXY2345D",
  },
  {
    id: "7",
    employeeId: "EMP007",
    name: "Rahul Verma",
    email: "rahul.verma@ektajanch.com",
    phone: "+91 98765 43216",
    department: "Pathology",
    designation: "Biochemist",
    joiningDate: "2023-09-01",
    salary: 45000,
    status: "active",
    address: "147, Rohini, Delhi",
    bankAccount: "XXXX-XXXX-6789",
    panNumber: "EFGHI6789J",
  },
  {
    id: "8",
    employeeId: "EMP008",
    name: "Meera Joshi",
    email: "meera.joshi@ektajanch.com",
    phone: "+91 98765 43217",
    department: "Radiology",
    designation: "X-Ray Technician",
    joiningDate: "2024-05-20",
    salary: 32000,
    status: "inactive",
    address: "258, Pitampura, Delhi",
    bankAccount: "XXXX-XXXX-0123",
    panNumber: "KLMXY0123N",
  },
];

export const departments = [
  "Pathology",
  "Radiology",
  "Reception",
  "Administration",
  "Billing",
  "Housekeeping",
];

export const designations = [
  "Lab Technician",
  "Senior Radiologist",
  "Radiologist",
  "X-Ray Technician",
  "Phlebotomist",
  "Biochemist",
  "Front Desk Executive",
  "Manager",
  "Billing Executive",
  "Housekeeping Staff",
];

// Generate attendance records for the current month
export const generateAttendanceRecords = (): AttendanceRecord[] => {
  const records: AttendanceRecord[] = [];
  const today = new Date();
  const currentMonth = today.getMonth();
  const currentYear = today.getFullYear();

  employees.forEach((emp) => {
    for (let day = 1; day <= today.getDate(); day++) {
      const date = new Date(currentYear, currentMonth, day);
      if (date.getDay() === 0) continue; // Skip Sundays

      const statuses: AttendanceRecord["status"][] = [
        "present",
        "present",
        "present",
        "present",
        "present",
        "absent",
        "half-day",
        "leave",
      ];
      const randomStatus =
        statuses[Math.floor(Math.random() * statuses.length)];

      const checkIn =
        randomStatus === "present" || randomStatus === "half-day"
          ? `${8 + Math.floor(Math.random() * 2)}:${Math.floor(
              Math.random() * 60
            )
              .toString()
              .padStart(2, "0")}`
          : undefined;

      const checkOut =
        randomStatus === "present"
          ? `${17 + Math.floor(Math.random() * 2)}:${Math.floor(
              Math.random() * 60
            )
              .toString()
              .padStart(2, "0")}`
          : randomStatus === "half-day"
          ? `${13 + Math.floor(Math.random() * 2)}:${Math.floor(
              Math.random() * 60
            )
              .toString()
              .padStart(2, "0")}`
          : undefined;

      records.push({
        id: `${emp.id}-${day}`,
        employeeId: emp.id,
        employeeName: emp.name,
        date: date.toISOString().split("T")[0],
        checkIn,
        checkOut,
        status: randomStatus,
        workingHours:
          randomStatus === "present"
            ? 8
            : randomStatus === "half-day"
            ? 4
            : 0,
      });
    }
  });

  return records;
};

export const attendanceRecords = generateAttendanceRecords();

// Generate salary records
export const generateSalaryRecords = (): SalaryRecord[] => {
  const records: SalaryRecord[] = [];
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  employees.forEach((emp) => {
    // Generate for last 3 months
    for (let i = 2; i >= 0; i--) {
      let month = currentMonth - i;
      let year = currentYear;
      if (month < 0) {
        month += 12;
        year -= 1;
      }

      const workingDays = 26;
      const presentDays = Math.floor(Math.random() * 6) + 20;
      const halfDays = Math.floor(Math.random() * 3);
      const leaveDays = workingDays - presentDays - halfDays;

      const perDaySalary = emp.salary / workingDays;
      const deductions = leaveDays * perDaySalary + (halfDays * perDaySalary) / 2;
      const bonus = Math.random() > 0.7 ? Math.floor(Math.random() * 5000) : 0;
      const netSalary = emp.salary - deductions + bonus;

      const isPaid = i > 0 || Math.random() > 0.3;

      records.push({
        id: `${emp.id}-${month}-${year}`,
        employeeId: emp.id,
        employeeName: emp.name,
        month: months[month],
        year,
        baseSalary: emp.salary,
        workingDays,
        presentDays,
        halfDays,
        leaveDays,
        deductions: Math.round(deductions),
        bonus,
        netSalary: Math.round(netSalary),
        paymentStatus: isPaid ? "paid" : "pending",
        paymentDate: isPaid
          ? new Date(year, month + 1, 5).toISOString().split("T")[0]
          : undefined,
      });
    }
  });

  return records;
};

export const salaryRecords = generateSalaryRecords();

export const departmentStats: DepartmentStats[] = [
  { department: "Pathology", totalEmployees: 3, presentToday: 2, onLeave: 1 },
  { department: "Radiology", totalEmployees: 2, presentToday: 1, onLeave: 0 },
  { department: "Reception", totalEmployees: 1, presentToday: 1, onLeave: 0 },
  { department: "Administration", totalEmployees: 1, presentToday: 1, onLeave: 0 },
  { department: "Billing", totalEmployees: 1, presentToday: 1, onLeave: 0 },
];
