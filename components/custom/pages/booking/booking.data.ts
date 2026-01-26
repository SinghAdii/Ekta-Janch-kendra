import { AvailableTest, AvailablePackage, TimeSlot } from "./booking.types";

// ============================================================
// SAMPLE DATA FOR UI DEMONSTRATION
// TODO: Replace with API calls to fetch data from backend
// These arrays should be fetched from your backend API
// ============================================================

// Sample Available Tests Data
// TODO: Fetch from backend API: GET /api/tests
export const availableTests: AvailableTest[] = [
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

// Sample Available Packages Data
// TODO: Fetch from backend API: GET /api/packages
export const availablePackages: AvailablePackage[] = [
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
    description: "Complete body checkup with 30+ parameters",
    testsIncluded: ["CBC", "LFT", "KFT", "Lipid Profile", "Thyroid Profile", "Blood Sugar", "HbA1c", "Urine Routine", "Vitamin D", "Vitamin B12"],
    testCount: 10,
    category: "Preventive",
    reportTime: "Next Day",
    discount: 25,
  },
  {
    id: "pkg-003",
    name: "Diabetes Care Package",
    price: 1299,
    description: "Complete diabetes monitoring panel",
    testsIncluded: ["Fasting Blood Sugar", "Post Prandial Sugar", "HbA1c", "KFT", "Lipid Profile", "Urine Routine"],
    testCount: 6,
    category: "Diabetes",
    reportTime: "Same Day",
    discount: 15,
  },
  {
    id: "pkg-004",
    name: "Heart Health Package",
    price: 1899,
    description: "Comprehensive cardiac risk assessment",
    testsIncluded: ["Lipid Profile", "Cardiac Markers", "ECG", "Blood Sugar", "CBC", "KFT"],
    testCount: 6,
    category: "Cardiac",
    reportTime: "Same Day",
    discount: 18,
  },
  {
    id: "pkg-005",
    name: "Women's Wellness Package",
    price: 2999,
    description: "Complete health package designed for women",
    testsIncluded: ["CBC", "Thyroid Profile", "Vitamin D", "Vitamin B12", "Iron Studies", "Calcium", "Hormonal Panel", "Pap Smear"],
    testCount: 8,
    category: "Women's Health",
    reportTime: "2-3 Days",
    discount: 22,
  },
  {
    id: "pkg-006",
    name: "Senior Citizen Package",
    price: 3499,
    description: "Comprehensive package for adults 60+",
    testsIncluded: ["CBC", "LFT", "KFT", "Lipid Profile", "Thyroid", "Blood Sugar", "HbA1c", "Vitamin D", "B12", "Bone Profile", "Cardiac Markers"],
    testCount: 11,
    category: "Senior Care",
    reportTime: "Next Day",
    discount: 30,
  },
];

// Sample Lab Locations
// TODO: Fetch from backend API: GET /api/labs
export const labLocations = [
  { id: "lab-001", name: "Ekta Janch Kendra - Main Branch", address: "123, Main Road, Near City Hospital, Delhi" },
  { id: "lab-002", name: "Ekta Janch Kendra - South Branch", address: "456, South Extension, Part II, Delhi" },
  { id: "lab-003", name: "Ekta Janch Kendra - West Branch", address: "789, Rajouri Garden, Delhi" },
];

// Sample Available Time Slots
// TODO: Fetch from backend API: GET /api/slots?date={selectedDate}
export const timeSlots: TimeSlot[] = [
  { id: "slot-1", time: "06:00 AM - 07:00 AM", available: true },
  { id: "slot-2", time: "07:00 AM - 08:00 AM", available: true },
  { id: "slot-3", time: "08:00 AM - 09:00 AM", available: true },
  { id: "slot-4", time: "09:00 AM - 10:00 AM", available: false },
  { id: "slot-5", time: "10:00 AM - 11:00 AM", available: true },
  { id: "slot-6", time: "11:00 AM - 12:00 PM", available: true },
  { id: "slot-7", time: "04:00 PM - 05:00 PM", available: true },
  { id: "slot-8", time: "05:00 PM - 06:00 PM", available: true },
  { id: "slot-9", time: "06:00 PM - 07:00 PM", available: false },
];

// Home Collection Time Slots
export const homeCollectionSlots = [
  "06:00 AM - 08:00 AM",
  "08:00 AM - 10:00 AM",
  "10:00 AM - 12:00 PM",
  "04:00 PM - 06:00 PM",
] as const;

// Test Categories (for filtering)
export const testCategories = [
  "All",
  "Hematology",
  "Biochemistry",
  "Hormone",
  "Diabetes",
  "Vitamins",
  "Pathology",
  "Infectious Disease",
];

// Package Categories (for filtering)
export const packageCategories = [
  "All",
  "Preventive",
  "Diabetes",
  "Cardiac",
  "Women's Health",
  "Senior Care",
];

// Helper functions
export function getTestById(id: string): AvailableTest | undefined {
  return availableTests.find((test) => test.id === id);
}

export function getPackageById(id: string): AvailablePackage | undefined {
  return availablePackages.find((pkg) => pkg.id === id);
}

export function calculateTestsTotal(testIds: string[]): number {
  return testIds.reduce((total, id) => {
    const test = getTestById(id);
    return total + (test?.price || 0);
  }, 0);
}

export function calculatePackagesTotal(packageIds: string[]): number {
  return packageIds.reduce((total, id) => {
    const pkg = getPackageById(id);
    if (pkg) {
      const discountedPrice = pkg.discount
        ? pkg.price - (pkg.price * pkg.discount) / 100
        : pkg.price;
      return total + discountedPrice;
    }
    return total;
  }, 0);
}

export function calculateGrandTotal(testIds: string[], packageIds: string[]): number {
  return calculateTestsTotal(testIds) + calculatePackagesTotal(packageIds);
}

// Generate available dates (next 14 days excluding Sundays)
export function getAvailableDates(): string[] {
  const dates: string[] = [];
  const today = new Date();
  
  for (let i = 1; i <= 21 && dates.length < 14; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + i);
    
    // Skip Sundays (0 = Sunday)
    if (date.getDay() !== 0) {
      dates.push(date.toISOString().split("T")[0]);
    }
  }
  
  return dates;
}

// Format date for display
export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-IN", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}
