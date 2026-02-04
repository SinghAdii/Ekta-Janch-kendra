// Employee Portal Types

export interface AttendanceRecord {
  id: string;
  date: string;
  checkIn: string | null;
  checkOut: string | null;
  status: "present" | "absent" | "half-day" | "leave" | "holiday";
  workHours: number | null;
  notes?: string;
}

export interface SalaryRecord {
  id: string;
  month: string; // Format: "January 2026"
  year: number;
  basicSalary: number;
  allowances: number;
  deductions: number;
  netSalary: number;
  status: "pending" | "paid" | "processing";
  paidDate?: string;
  payslipUrl?: string;
  notes?: string;
}

export interface CollectionAssignment {
  id: string;
  orderId: string;
  patientName: string;
  patientPhone: string;
  phone: string; // Simplified phone for calling
  patientAge?: number;
  patientGender?: "male" | "female" | "other";
  address: string;
  landmark?: string;
  pincode?: string;
  tests: string[];
  tubesRequired?: number;
  testInstructions?: string; // Fasting required, etc.
  scheduledDate: string;
  scheduledTime: string;
  status: "pending" | "in-progress" | "completed" | "cancelled" | "rescheduled";
  priority: "normal" | "urgent";
  notes?: string;
  collectedAt?: string;
  // Reschedule info
  rescheduledFrom?: string; // Original date
  rescheduledTo?: string; // New date
  rescheduleReason?: string;
  // Collection details
  sampleCollected?: boolean;
  tubesCollected?: number;
  collectionNotes?: string;
  // Cancellation
  cancelReason?: string;
}

// Mock attendance data for current employee
export const mockAttendanceData: AttendanceRecord[] = [
  {
    id: "ATT001",
    date: "2026-02-05",
    checkIn: "09:05",
    checkOut: null,
    status: "present",
    workHours: null,
    notes: "In office",
  },
  {
    id: "ATT002",
    date: "2026-02-04",
    checkIn: "09:00",
    checkOut: "18:15",
    status: "present",
    workHours: 9.25,
  },
  {
    id: "ATT003",
    date: "2026-02-03",
    checkIn: "09:30",
    checkOut: "18:00",
    status: "present",
    workHours: 8.5,
  },
  {
    id: "ATT004",
    date: "2026-02-02",
    checkIn: null,
    checkOut: null,
    status: "holiday",
    workHours: null,
    notes: "Sunday",
  },
  {
    id: "ATT005",
    date: "2026-02-01",
    checkIn: null,
    checkOut: null,
    status: "holiday",
    workHours: null,
    notes: "Saturday",
  },
  {
    id: "ATT006",
    date: "2026-01-31",
    checkIn: "09:10",
    checkOut: "18:30",
    status: "present",
    workHours: 9.33,
  },
  {
    id: "ATT007",
    date: "2026-01-30",
    checkIn: "09:00",
    checkOut: "13:00",
    status: "half-day",
    workHours: 4,
    notes: "Personal work",
  },
  {
    id: "ATT008",
    date: "2026-01-29",
    checkIn: null,
    checkOut: null,
    status: "leave",
    workHours: null,
    notes: "Sick leave",
  },
  {
    id: "ATT009",
    date: "2026-01-28",
    checkIn: "08:55",
    checkOut: "18:00",
    status: "present",
    workHours: 9.08,
  },
  {
    id: "ATT010",
    date: "2026-01-27",
    checkIn: "09:15",
    checkOut: "18:45",
    status: "present",
    workHours: 9.5,
  },
];

// Mock salary data
export const mockSalaryData: SalaryRecord[] = [
  {
    id: "SAL001",
    month: "February 2026",
    year: 2026,
    basicSalary: 25000,
    allowances: 5000,
    deductions: 2500,
    netSalary: 27500,
    status: "pending",
  },
  {
    id: "SAL002",
    month: "January 2026",
    year: 2026,
    basicSalary: 25000,
    allowances: 5000,
    deductions: 2000,
    netSalary: 28000,
    status: "paid",
    paidDate: "2026-02-01",
  },
  {
    id: "SAL003",
    month: "December 2025",
    year: 2025,
    basicSalary: 25000,
    allowances: 7500,
    deductions: 2000,
    netSalary: 30500,
    status: "paid",
    paidDate: "2026-01-02",
    notes: "Includes bonus",
  },
  {
    id: "SAL004",
    month: "November 2025",
    year: 2025,
    basicSalary: 25000,
    allowances: 5000,
    deductions: 2500,
    netSalary: 27500,
    status: "paid",
    paidDate: "2025-12-01",
  },
  {
    id: "SAL005",
    month: "October 2025",
    year: 2025,
    basicSalary: 25000,
    allowances: 5000,
    deductions: 2000,
    netSalary: 28000,
    status: "paid",
    paidDate: "2025-11-01",
  },
];

// Mock collection assignments (for home collectors only)
// Helper function to get today's date in YYYY-MM-DD format
const getDateString = (daysOffset: number = 0): string => {
  const date = new Date();
  date.setDate(date.getDate() + daysOffset);
  return date.toISOString().split("T")[0];
};

const today = getDateString(0);
const yesterday = getDateString(-1);
const tomorrow = getDateString(1);

export const mockCollectionAssignments: CollectionAssignment[] = [
  {
    id: "COL001",
    orderId: "ORD-2026-0205-001",
    patientName: "Ramesh Sharma",
    patientPhone: "+91 98765 43210",
    phone: "+91 98765 43210",
    patientAge: 45,
    patientGender: "male",
    address: "A-101, Green Valley Apartments, Sector 15, Noida",
    landmark: "Near City Mall",
    pincode: "201301",
    tests: ["Complete Blood Count", "Lipid Profile"],
    tubesRequired: 2,
    testInstructions: "12 hours fasting required",
    scheduledDate: today,
    scheduledTime: "10:00 AM - 11:00 AM",
    status: "pending",
    priority: "normal",
  },
  {
    id: "COL002",
    orderId: "ORD-2026-0205-002",
    patientName: "Sunita Devi",
    patientPhone: "+91 87654 32109",
    phone: "+91 87654 32109",
    patientAge: 68,
    patientGender: "female",
    address: "B-205, Sunshine Towers, Indirapuram, Ghaziabad",
    landmark: "Opposite Metro Station",
    pincode: "201014",
    tests: ["Thyroid Profile", "Vitamin D"],
    tubesRequired: 2,
    testInstructions: "No fasting required",
    scheduledDate: today,
    scheduledTime: "11:30 AM - 12:30 PM",
    status: "in-progress",
    priority: "urgent",
    notes: "Elderly patient, handle with care. Requires wheelchair assistance.",
  },
  {
    id: "COL003",
    orderId: "ORD-2026-0205-003",
    patientName: "Ajay Kumar",
    patientPhone: "+91 76543 21098",
    phone: "+91 76543 21098",
    patientAge: 35,
    patientGender: "male",
    address: "C-15, Model Town, Delhi",
    landmark: "Behind Gurudwara",
    pincode: "110009",
    tests: ["HbA1c", "Kidney Function Test", "Urine Routine"],
    tubesRequired: 3,
    testInstructions: "Fasting not required. Collect urine sample as well.",
    scheduledDate: today,
    scheduledTime: "02:00 PM - 03:00 PM",
    status: "pending",
    priority: "normal",
  },
  {
    id: "COL004",
    orderId: "ORD-2026-0204-001",
    patientName: "Meera Gupta",
    patientPhone: "+91 65432 10987",
    phone: "+91 65432 10987",
    patientAge: 52,
    patientGender: "female",
    address: "D-42, Vasant Kunj, New Delhi",
    landmark: "Near DDA Flats",
    pincode: "110070",
    tests: ["Liver Function Test"],
    tubesRequired: 2,
    testInstructions: "10-12 hours fasting required",
    scheduledDate: yesterday,
    scheduledTime: "09:00 AM - 10:00 AM",
    status: "completed",
    priority: "normal",
    collectedAt: `${yesterday}T09:25:00`,
    sampleCollected: true,
    tubesCollected: 2,
    collectionNotes: "Sample collected successfully. Patient was cooperative.",
  },
  {
    id: "COL005",
    orderId: "ORD-2026-0204-002",
    patientName: "Vikram Singh",
    patientPhone: "+91 54321 09876",
    phone: "+91 54321 09876",
    patientAge: 28,
    patientGender: "male",
    address: "E-78, Dwarka Sector 7, New Delhi",
    landmark: "Near Dwarka Mor Metro",
    pincode: "110077",
    tests: ["Complete Blood Count", "ESR"],
    tubesRequired: 2,
    scheduledDate: yesterday,
    scheduledTime: "11:00 AM - 12:00 PM",
    status: "completed",
    priority: "urgent",
    collectedAt: `${yesterday}T11:15:00`,
    sampleCollected: true,
    tubesCollected: 3,
    collectionNotes: "Urgent case - dispatched to lab immediately.",
  },
  {
    id: "COL006",
    orderId: "ORD-2026-0203-001",
    patientName: "Neha Agarwal",
    patientPhone: "+91 43210 98765",
    phone: "+91 43210 98765",
    patientAge: 30,
    patientGender: "female",
    address: "F-23, Rohini Sector 9, Delhi",
    landmark: "Near Japanese Park",
    pincode: "110085",
    tests: ["Pregnancy Test", "Hemoglobin"],
    tubesRequired: 1,
    scheduledDate: today,
    scheduledTime: "04:00 PM - 05:00 PM",
    status: "cancelled",
    priority: "normal",
    cancelReason: "Patient requested cancellation due to travel plans",
  },
  {
    id: "COL007",
    orderId: "ORD-2026-0206-001",
    patientName: "Priya Mehta",
    patientPhone: "+91 99887 76655",
    phone: "+91 99887 76655",
    patientAge: 42,
    patientGender: "female",
    address: "G-12, Saket, New Delhi",
    landmark: "Near Select City Walk",
    pincode: "110017",
    tests: ["Complete Health Checkup", "Blood Sugar Fasting"],
    tubesRequired: 4,
    testInstructions: "12 hours fasting mandatory",
    scheduledDate: tomorrow,
    scheduledTime: "08:00 AM - 09:00 AM",
    status: "pending",
    priority: "normal",
  },
  {
    id: "COL008",
    orderId: "ORD-2026-0202-001",
    patientName: "Rakesh Verma",
    patientPhone: "+91 88776 65544",
    phone: "+91 88776 65544",
    patientAge: 55,
    patientGender: "male",
    address: "H-45, Lajpat Nagar, New Delhi",
    landmark: "Near Central Market",
    pincode: "110024",
    tests: ["Cardiac Profile", "ECG"],
    tubesRequired: 3,
    scheduledDate: today,
    scheduledTime: "03:00 PM - 04:00 PM",
    status: "rescheduled",
    priority: "urgent",
    rescheduledFrom: yesterday,
    rescheduledTo: today,
    rescheduleReason: "Patient was not available. Requested reschedule.",
    notes: "Patient has heart condition. Be gentle during collection.",
  },
];

// Utility functions
export function getAttendanceStats(records: AttendanceRecord[]) {
  const stats = {
    totalDays: records.length,
    presentDays: 0,
    absentDays: 0,
    halfDays: 0,
    leaveDays: 0,
    holidays: 0,
    averageWorkHours: 0,
  };

  let totalWorkHours = 0;
  let workDays = 0;

  records.forEach((record) => {
    switch (record.status) {
      case "present":
        stats.presentDays++;
        if (record.workHours) {
          totalWorkHours += record.workHours;
          workDays++;
        }
        break;
      case "absent":
        stats.absentDays++;
        break;
      case "half-day":
        stats.halfDays++;
        if (record.workHours) {
          totalWorkHours += record.workHours;
          workDays++;
        }
        break;
      case "leave":
        stats.leaveDays++;
        break;
      case "holiday":
        stats.holidays++;
        break;
    }
  });

  stats.averageWorkHours = workDays > 0 ? totalWorkHours / workDays : 0;

  return stats;
}

export function getSalaryStats(records: SalaryRecord[]) {
  const paidRecords = records.filter((r) => r.status === "paid");
  const totalEarned = paidRecords.reduce((sum, r) => sum + r.netSalary, 0);
  const averageSalary = paidRecords.length > 0 ? totalEarned / paidRecords.length : 0;

  return {
    totalEarned,
    averageSalary,
    paidMonths: paidRecords.length,
    pendingMonths: records.filter((r) => r.status === "pending").length,
  };
}

export function getCollectionStats(assignments: CollectionAssignment[]) {
  return {
    total: assignments.length,
    pending: assignments.filter((a) => a.status === "pending").length,
    inProgress: assignments.filter((a) => a.status === "in-progress").length,
    completed: assignments.filter((a) => a.status === "completed").length,
    cancelled: assignments.filter((a) => a.status === "cancelled").length,
    rescheduled: assignments.filter((a) => a.status === "rescheduled").length,
    urgent: assignments.filter((a) => a.priority === "urgent").length,
  };
}

// Collection management functions
export function startCollection(id: string): CollectionAssignment | null {
  const assignment = mockCollectionAssignments.find((a) => a.id === id);
  if (assignment && assignment.status === "pending") {
    assignment.status = "in-progress";
    return assignment;
  }
  return null;
}

export function completeCollection(
  id: string,
  data: {
    tubesCollected: number;
    collectionNotes?: string;
  }
): CollectionAssignment | null {
  const assignment = mockCollectionAssignments.find((a) => a.id === id);
  if (assignment && assignment.status === "in-progress") {
    assignment.status = "completed";
    assignment.collectedAt = new Date().toISOString();
    assignment.sampleCollected = true;
    assignment.tubesCollected = data.tubesCollected;
    assignment.collectionNotes = data.collectionNotes;
    return assignment;
  }
  return null;
}

export function cancelCollection(
  id: string,
  reason: string
): CollectionAssignment | null {
  const assignment = mockCollectionAssignments.find((a) => a.id === id);
  if (assignment && (assignment.status === "pending" || assignment.status === "in-progress")) {
    assignment.status = "cancelled";
    assignment.cancelReason = reason;
    return assignment;
  }
  return null;
}

export function rescheduleCollection(
  id: string,
  data: {
    newDate: string;
    newTime: string;
    reason: string;
  }
): CollectionAssignment | null {
  const assignment = mockCollectionAssignments.find((a) => a.id === id);
  if (assignment && (assignment.status === "pending" || assignment.status === "in-progress")) {
    assignment.rescheduledFrom = assignment.scheduledDate;
    assignment.scheduledDate = data.newDate;
    assignment.rescheduledTo = data.newDate;
    assignment.scheduledTime = data.newTime;
    assignment.rescheduleReason = data.reason;
    assignment.status = "rescheduled";
    return assignment;
  }
  return null;
}

export function updateCollectionNotes(
  id: string,
  notes: string
): CollectionAssignment | null {
  const assignment = mockCollectionAssignments.find((a) => a.id === id);
  if (assignment) {
    assignment.notes = notes;
    return assignment;
  }
  return null;
}

// Get available time slots for rescheduling
export function getAvailableTimeSlots(): string[] {
  return [
    "08:00 AM - 09:00 AM",
    "09:00 AM - 10:00 AM",
    "10:00 AM - 11:00 AM",
    "11:00 AM - 12:00 PM",
    "12:00 PM - 01:00 PM",
    "02:00 PM - 03:00 PM",
    "03:00 PM - 04:00 PM",
    "04:00 PM - 05:00 PM",
    "05:00 PM - 06:00 PM",
  ];
}
