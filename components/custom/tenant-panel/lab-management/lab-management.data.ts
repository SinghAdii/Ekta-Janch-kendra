import type {
  LabEmployee,
  LabTest,
  LabPackage,
  TimeSlot,
  LabProcessingItem,
  SlotBooking,
} from "./lab-management.types";

// ============ LAB EMPLOYEES WITH ROLES ============

export const labEmployees: LabEmployee[] = [
  // Collectors / Phlebotomists
  {
    id: "emp-001",
    employeeId: "EMP001",
    name: "Amit Singh",
    mobile: "9988776655",
    email: "amit.singh@ektajanch.com",
    role: "collector",
    isAvailable: true,
    currentAssignments: 2,
    totalCollections: 156,
    rating: 4.8,
    branchId: "branch-001",
    branchName: "Main Branch",
  },
  {
    id: "emp-002",
    employeeId: "EMP002",
    name: "Ravi Kumar",
    mobile: "9988776656",
    email: "ravi.kumar@ektajanch.com",
    role: "collector",
    isAvailable: true,
    currentAssignments: 1,
    totalCollections: 89,
    rating: 4.6,
    branchId: "branch-001",
    branchName: "Main Branch",
  },
  {
    id: "emp-003",
    employeeId: "EMP003",
    name: "Sunita Devi",
    mobile: "9988776657",
    email: "sunita.devi@ektajanch.com",
    role: "collector",
    isAvailable: false,
    currentAssignments: 3,
    totalCollections: 234,
    rating: 4.9,
    branchId: "branch-002",
    branchName: "Green Park",
  },
  {
    id: "emp-004",
    employeeId: "EMP004",
    name: "Prakash Yadav",
    mobile: "9988776658",
    email: "prakash.yadav@ektajanch.com",
    role: "collector",
    isAvailable: true,
    currentAssignments: 0,
    totalCollections: 45,
    rating: 4.5,
    branchId: "branch-001",
    branchName: "Main Branch",
  },
  // Lab Technicians
  {
    id: "emp-005",
    employeeId: "EMP005",
    name: "Rajesh Kumar",
    mobile: "9876543210",
    email: "rajesh.kumar@ektajanch.com",
    role: "lab-technician",
    isAvailable: true,
    currentAssignments: 5,
    branchId: "branch-001",
    branchName: "Main Branch",
  },
  {
    id: "emp-006",
    employeeId: "EMP006",
    name: "Priya Sharma",
    mobile: "9876543211",
    email: "priya.sharma@ektajanch.com",
    role: "lab-technician",
    isAvailable: true,
    currentAssignments: 3,
    branchId: "branch-002",
    branchName: "Green Park",
  },
  {
    id: "emp-007",
    employeeId: "EMP007",
    name: "Rahul Verma",
    mobile: "9876543212",
    email: "rahul.verma@ektajanch.com",
    role: "lab-technician",
    isAvailable: false,
    currentAssignments: 8,
    branchId: "branch-001",
    branchName: "Main Branch",
  },
  // Receptionists
  {
    id: "emp-008",
    employeeId: "EMP008",
    name: "Sneha Gupta",
    mobile: "9876543213",
    email: "sneha.gupta@ektajanch.com",
    role: "receptionist",
    isAvailable: true,
    currentAssignments: 0,
    branchId: "branch-001",
    branchName: "Main Branch",
  },
  // Admin
  {
    id: "emp-009",
    employeeId: "EMP009",
    name: "Vikram Singh",
    mobile: "9876543214",
    email: "vikram.singh@ektajanch.com",
    role: "admin",
    isAvailable: true,
    currentAssignments: 0,
    branchId: "branch-001",
    branchName: "Main Branch",
  },
];

// ============ AVAILABLE TESTS ============

export const labTests: LabTest[] = [
  {
    id: "test-001",
    name: "Complete Blood Count (CBC)",
    code: "CBC001",
    price: 350,
    description: "Measures different components of blood including RBC, WBC, platelets",
    category: "Hematology",
    sampleType: "Blood",
    reportTime: "Same Day",
  },
  {
    id: "test-002",
    name: "Lipid Profile",
    code: "LIP001",
    price: 550,
    description: "Measures cholesterol levels including HDL, LDL, triglycerides",
    category: "Biochemistry",
    sampleType: "Blood",
    reportTime: "Same Day",
  },
  {
    id: "test-003",
    name: "Thyroid Profile (T3, T4, TSH)",
    code: "THY001",
    price: 650,
    description: "Complete thyroid function assessment",
    category: "Hormone",
    sampleType: "Blood",
    reportTime: "Same Day",
  },
  {
    id: "test-004",
    name: "Liver Function Test (LFT)",
    code: "LFT001",
    price: 750,
    description: "Assesses liver health and function",
    category: "Biochemistry",
    sampleType: "Blood",
    reportTime: "Same Day",
  },
  {
    id: "test-005",
    name: "Kidney Function Test (KFT)",
    code: "KFT001",
    price: 600,
    description: "Evaluates kidney function including creatinine, BUN",
    category: "Biochemistry",
    sampleType: "Blood",
    reportTime: "Same Day",
  },
  {
    id: "test-006",
    name: "Fasting Blood Sugar",
    code: "FBS001",
    price: 120,
    description: "Measures blood glucose levels after fasting",
    category: "Diabetes",
    sampleType: "Blood",
    reportTime: "Same Day",
  },
  {
    id: "test-007",
    name: "HbA1c (Glycated Hemoglobin)",
    code: "HBA001",
    price: 450,
    description: "Measures average blood sugar over 3 months",
    category: "Diabetes",
    sampleType: "Blood",
    reportTime: "Next Day",
  },
  {
    id: "test-008",
    name: "Vitamin D (25-OH)",
    code: "VTD001",
    price: 850,
    description: "Measures Vitamin D levels in blood",
    category: "Vitamins",
    sampleType: "Blood",
    reportTime: "Next Day",
  },
  {
    id: "test-009",
    name: "Vitamin B12",
    code: "VTB001",
    price: 700,
    description: "Measures Vitamin B12 levels",
    category: "Vitamins",
    sampleType: "Blood",
    reportTime: "Next Day",
  },
  {
    id: "test-010",
    name: "Iron Studies",
    code: "IRN001",
    price: 550,
    description: "Includes serum iron, TIBC, and ferritin",
    category: "Hematology",
    sampleType: "Blood",
    reportTime: "Same Day",
  },
  {
    id: "test-011",
    name: "Urine Routine & Microscopy",
    code: "URM001",
    price: 180,
    description: "Complete urine analysis",
    category: "Pathology",
    sampleType: "Urine",
    reportTime: "Same Day",
  },
  {
    id: "test-012",
    name: "COVID-19 RT-PCR",
    code: "COV001",
    price: 500,
    description: "Detects SARS-CoV-2 virus",
    category: "Infectious Disease",
    sampleType: "Nasal Swab",
    reportTime: "24 Hours",
  },
];

// Test categories for filtering
export const testCategories = [...new Set(labTests.map((t) => t.category))];

// ============ AVAILABLE PACKAGES ============

export const labPackages: LabPackage[] = [
  {
    id: "pkg-001",
    name: "Basic Health Checkup",
    price: 999,
    description: "Essential tests for routine health monitoring",
    testsIncluded: ["CBC", "Blood Sugar", "Urine Routine", "Lipid Profile"],
    testCount: 4,
    category: "Preventive",
    reportTime: "Same Day",
    discount: 20,
  },
  {
    id: "pkg-002",
    name: "Comprehensive Health Package",
    price: 2499,
    description: "Complete health assessment with 15+ parameters",
    testsIncluded: [
      "CBC",
      "Lipid Profile",
      "LFT",
      "KFT",
      "Thyroid Profile",
      "Blood Sugar",
      "HbA1c",
      "Urine Routine",
    ],
    testCount: 8,
    category: "Preventive",
    reportTime: "Same Day",
    discount: 25,
  },
  {
    id: "pkg-003",
    name: "Diabetes Care Package",
    price: 799,
    description: "Complete diabetes monitoring tests",
    testsIncluded: ["Fasting Blood Sugar", "Post Prandial Sugar", "HbA1c", "KFT", "Lipid Profile"],
    testCount: 5,
    category: "Diabetes",
    reportTime: "Same Day",
    discount: 15,
  },
  {
    id: "pkg-004",
    name: "Thyroid Care Package",
    price: 899,
    description: "Complete thyroid health assessment",
    testsIncluded: ["T3", "T4", "TSH", "Anti-TPO", "Anti-TG"],
    testCount: 5,
    category: "Thyroid",
    reportTime: "Same Day",
    discount: 10,
  },
  {
    id: "pkg-005",
    name: "Senior Citizen Health Package",
    price: 3499,
    description: "Comprehensive health checkup for elderly",
    testsIncluded: [
      "CBC",
      "ESR",
      "Lipid Profile",
      "LFT",
      "KFT",
      "Thyroid Profile",
      "Blood Sugar",
      "HbA1c",
      "Vitamin D",
      "Vitamin B12",
      "Calcium",
      "Uric Acid",
      "ECG",
    ],
    testCount: 13,
    category: "Preventive",
    reportTime: "Next Day",
    discount: 30,
  },
  {
    id: "pkg-006",
    name: "Women's Wellness Package",
    price: 2999,
    description: "Complete health checkup designed for women",
    testsIncluded: [
      "CBC",
      "Thyroid Profile",
      "Iron Studies",
      "Vitamin D",
      "Vitamin B12",
      "Calcium",
      "Lipid Profile",
      "Blood Sugar",
    ],
    testCount: 8,
    category: "Women's Health",
    reportTime: "Same Day",
    discount: 20,
  },
];

// Package categories for filtering
export const packageCategories = [...new Set(labPackages.map((p) => p.category))];

// ============ TIME SLOTS ============

export const timeSlots: TimeSlot[] = [
  { id: "slot-1", time: "07:00", display: "7:00 AM - 8:00 AM", available: true, capacity: 5, booked: 2 },
  { id: "slot-2", time: "08:00", display: "8:00 AM - 9:00 AM", available: true, capacity: 5, booked: 3 },
  { id: "slot-3", time: "09:00", display: "9:00 AM - 10:00 AM", available: true, capacity: 5, booked: 5 },
  { id: "slot-4", time: "10:00", display: "10:00 AM - 11:00 AM", available: true, capacity: 5, booked: 4 },
  { id: "slot-5", time: "11:00", display: "11:00 AM - 12:00 PM", available: true, capacity: 5, booked: 1 },
  { id: "slot-6", time: "12:00", display: "12:00 PM - 1:00 PM", available: false, capacity: 5, booked: 5 },
  { id: "slot-7", time: "14:00", display: "2:00 PM - 3:00 PM", available: true, capacity: 5, booked: 2 },
  { id: "slot-8", time: "15:00", display: "3:00 PM - 4:00 PM", available: true, capacity: 5, booked: 3 },
  { id: "slot-9", time: "16:00", display: "4:00 PM - 5:00 PM", available: true, capacity: 5, booked: 1 },
  { id: "slot-10", time: "17:00", display: "5:00 PM - 6:00 PM", available: true, capacity: 5, booked: 0 },
];

// ============ MOCK LAB PROCESSING QUEUE ============

export const labProcessingQueue: LabProcessingItem[] = [
  {
    id: "lp-001",
    orderId: "ord-001",
    orderNumber: "ORD-2026-0001",
    patientName: "Rajesh Kumar",
    patientMobile: "9876543210",
    sampleId: "SAMPLE-2026-0001",
    tests: [
      { id: "t1", name: "Complete Blood Count", code: "CBC", status: "In Progress" },
      { id: "t2", name: "Lipid Profile", code: "LIPID", status: "Pending" },
    ],
    status: "In Progress",
    priority: "Normal",
    receivedAt: "2026-01-10T09:30:00Z",
    startedAt: "2026-01-10T10:00:00Z",
    technicianId: "emp-005",
    technicianName: "Rajesh Kumar",
    branchId: "branch-001",
    branchName: "Main Branch",
  },
  {
    id: "lp-002",
    orderId: "ord-005",
    orderNumber: "ORD-2026-0005",
    patientName: "Meera Gupta",
    patientMobile: "9876543214",
    sampleId: "SAMPLE-2026-0005",
    tests: [
      { id: "t5", name: "Thyroid Profile", code: "THY", status: "Completed" },
      { id: "t6", name: "Vitamin D", code: "VTD", status: "Completed" },
    ],
    status: "Report Ready",
    priority: "Normal",
    receivedAt: "2026-01-10T08:00:00Z",
    startedAt: "2026-01-10T08:30:00Z",
    completedAt: "2026-01-10T11:00:00Z",
    technicianId: "emp-006",
    technicianName: "Priya Sharma",
    branchId: "branch-002",
    branchName: "Green Park",
  },
  {
    id: "lp-003",
    orderId: "ord-010",
    orderNumber: "ORD-2026-0010",
    patientName: "Vikram Mehta",
    patientMobile: "9876543220",
    sampleId: "SAMPLE-2026-0010",
    tests: [
      { id: "t10", name: "Complete Blood Count", code: "CBC", status: "Pending" },
      { id: "t11", name: "Liver Function Test", code: "LFT", status: "Pending" },
      { id: "t12", name: "Kidney Function Test", code: "KFT", status: "Pending" },
    ],
    status: "Sample Collected",
    priority: "Urgent",
    receivedAt: "2026-01-10T10:00:00Z",
    branchId: "branch-001",
    branchName: "Main Branch",
  },
  {
    id: "lp-004",
    orderId: "ord-015",
    orderNumber: "ORD-2026-0015",
    patientName: "Anita Desai",
    patientMobile: "9876543225",
    sampleId: "SAMPLE-2026-0015",
    tests: [
      { id: "t15", name: "HbA1c", code: "HBA", status: "Pending" },
      { id: "t16", name: "Fasting Blood Sugar", code: "FBS", status: "Pending" },
    ],
    status: "Sample Collected",
    priority: "Normal",
    receivedAt: "2026-01-10T10:30:00Z",
    branchId: "branch-001",
    branchName: "Main Branch",
  },
];

// ============ MOCK SLOT BOOKINGS ============

export const slotBookings: SlotBooking[] = [
  {
    id: "sb-001",
    patientName: "Rahul Verma",
    patientMobile: "9876543230",
    slotDate: "2026-01-11",
    slotTime: "9:00 AM - 10:00 AM",
    branchId: "branch-001",
    branchName: "Main Branch",
    tests: ["CBC001", "LIP001"],
    packages: [],
    status: "Booked",
    createdAt: "2026-01-10T14:00:00Z",
    tokenNumber: "T-001",
  },
  {
    id: "sb-002",
    patientName: "Kavita Sharma",
    patientMobile: "9876543231",
    slotDate: "2026-01-11",
    slotTime: "10:00 AM - 11:00 AM",
    branchId: "branch-001",
    branchName: "Main Branch",
    tests: [],
    packages: ["pkg-002"],
    status: "Confirmed",
    createdAt: "2026-01-10T15:00:00Z",
    tokenNumber: "T-002",
  },
  {
    id: "sb-003",
    patientName: "Suresh Patel",
    patientMobile: "9876543232",
    slotDate: "2026-01-10",
    slotTime: "11:00 AM - 12:00 PM",
    branchId: "branch-002",
    branchName: "Green Park",
    tests: ["THY001"],
    packages: [],
    status: "Completed",
    createdAt: "2026-01-09T10:00:00Z",
    tokenNumber: "T-003",
  },
];

// ============ HELPER FUNCTIONS ============

// Get employees by role
export function getEmployeesByRole(role: LabEmployee["role"]): LabEmployee[] {
  return labEmployees.filter((emp) => emp.role === role);
}

// Get available collectors
export function getAvailableCollectors(): LabEmployee[] {
  return labEmployees.filter((emp) => emp.role === "collector" && emp.isAvailable);
}

// Find slot booking by ID
export function findSlotBookingById(bookingId: string): SlotBooking | undefined {
  return slotBookings.find((b) => b.id === bookingId);
}

// Find slot booking by order number
export function findSlotBookingByOrderNumber(orderNumber: string): SlotBooking | undefined {
  return slotBookings.find((b) => b.tokenNumber === orderNumber);
}

// Update slot booking status
export function updateSlotBookingStatus(bookingId: string, status: SlotBooking["status"]): SlotBooking | null {
  const index = slotBookings.findIndex((b) => b.id === bookingId);
  if (index !== -1) {
    slotBookings[index] = { ...slotBookings[index], status };
    return slotBookings[index];
  }
  return null;
}

// Get test by ID
export function getTestById(testId: string): LabTest | undefined {
  return labTests.find((t) => t.id === testId);
}

// Get package by ID
export function getPackageById(packageId: string): LabPackage | undefined {
  return labPackages.find((p) => p.id === packageId);
}

// Calculate total for selected tests and packages
export function calculateTotal(
  selectedTestIds: string[],
  selectedPackageIds: string[]
): { testsTotal: number; packagesTotal: number; grandTotal: number } {
  const testsTotal = selectedTestIds.reduce((sum, id) => {
    const test = getTestById(id);
    return sum + (test?.price || 0);
  }, 0);

  const packagesTotal = selectedPackageIds.reduce((sum, id) => {
    const pkg = getPackageById(id);
    if (!pkg) return sum;
    const discountedPrice = pkg.discount
      ? pkg.price - (pkg.price * pkg.discount) / 100
      : pkg.price;
    return sum + discountedPrice;
  }, 0);

  return {
    testsTotal,
    packagesTotal,
    grandTotal: testsTotal + packagesTotal,
  };
}

// Generate order number
export function generateOrderNumber(): string {
  const year = new Date().getFullYear();
  const random = Math.floor(Math.random() * 10000)
    .toString()
    .padStart(4, "0");
  return `ORD-${year}-${random}`;
}

// Generate sample ID
export function generateSampleId(): string {
  const year = new Date().getFullYear();
  const random = Math.floor(Math.random() * 10000)
    .toString()
    .padStart(4, "0");
  return `SAMPLE-${year}-${random}`;
}

// Find order by ID or QR code
export function findOrderByScanInput(input: string): LabProcessingItem | undefined {
  const normalizedInput = input.toUpperCase().trim();
  return labProcessingQueue.find(
    (item) =>
      item.orderNumber.toUpperCase() === normalizedInput ||
      item.sampleId.toUpperCase() === normalizedInput ||
      item.orderId.toUpperCase() === normalizedInput
  );
}

// Find slot booking by QR code / token number
export function findSlotBookingByScanInput(input: string): SlotBooking | undefined {
  const normalizedInput = input.toUpperCase().trim();
  return slotBookings.find(
    (booking) =>
      booking.tokenNumber?.toUpperCase() === normalizedInput ||
      booking.id.toUpperCase() === normalizedInput ||
      booking.patientMobile.includes(input)
  );
}

// Determine scan type - is it a processing order or a slot booking?
export type ScanType = "processing" | "slot-booking" | "not-found";

export interface ScanResult {
  type: ScanType;
  processingItem?: LabProcessingItem;
  slotBooking?: SlotBooking;
}

export function identifyScanInput(input: string): ScanResult {
  // First check if it's a processing order
  const processingItem = findOrderByScanInput(input);
  if (processingItem) {
    return { type: "processing", processingItem };
  }
  
  // Then check if it's a slot booking
  const slotBooking = findSlotBookingByScanInput(input);
  if (slotBooking) {
    return { type: "slot-booking", slotBooking };
  }
  
  return { type: "not-found" };
}

// ============ RE-EXPORT LAB BRANCHES ============
// Re-export from orders for easier access in lab-management components
export { labBranches, type LabBranch } from "../orders/orders.data";
