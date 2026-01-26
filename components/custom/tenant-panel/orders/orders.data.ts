import type { 
  Order, 
  OrderStats, 
  OrderFilters, 
  OrderFormData,
  LabBranch,
  Collector,
  SampleCollectionRecord,
  LabProcessingQueueItem
} from "./orders.types";

// Lab Branches
export const labBranches: LabBranch[] = [
  {
    id: "branch-001",
    name: "Ekta Janch Kendra - Main Branch",
    code: "EJK-MAIN",
    address: "123, MG Road, Sector 15",
    city: "Noida",
    pincode: "201301",
    phone: "0120-4567890",
    isActive: true
  },
  {
    id: "branch-002",
    name: "Ekta Janch Kendra - Green Park",
    code: "EJK-GP",
    address: "456, Green Park Main Market",
    city: "Delhi",
    pincode: "110016",
    phone: "011-26512345",
    isActive: true
  },
  {
    id: "branch-003",
    name: "Ekta Janch Kendra - Dwarka",
    code: "EJK-DWK",
    address: "Plot 12, Sector 12, Dwarka",
    city: "Delhi",
    pincode: "110075",
    phone: "011-45671234",
    isActive: true
  }
];

// Sample Collectors / Phlebotomists
export const collectors: Collector[] = [
  {
    id: "col-001",
    name: "Amit Singh",
    mobile: "9988776655",
    email: "amit.singh@ektajanch.com",
    isAvailable: true,
    currentAssignments: 2,
    totalCollections: 156,
    rating: 4.8
  },
  {
    id: "col-002",
    name: "Ravi Kumar",
    mobile: "9988776656",
    email: "ravi.kumar@ektajanch.com",
    isAvailable: true,
    currentAssignments: 1,
    totalCollections: 89,
    rating: 4.6
  },
  {
    id: "col-003",
    name: "Sunita Devi",
    mobile: "9988776657",
    email: "sunita.devi@ektajanch.com",
    isAvailable: false,
    currentAssignments: 3,
    totalCollections: 234,
    rating: 4.9
  },
  {
    id: "col-004",
    name: "Prakash Yadav",
    mobile: "9988776658",
    email: "prakash.yadav@ektajanch.com",
    isAvailable: true,
    currentAssignments: 0,
    totalCollections: 45,
    rating: 4.5
  }
];

// Mock Orders Data with Branch Information
export const mockOrders: Order[] = [
  // Home Collection Orders
  {
    id: "ord-001",
    orderNumber: "ORD-2026-0001",
    source: "Home Collection",
    status: "Sample Collected",
    branchId: "branch-001",
    branchName: "Ekta Janch Kendra - Main Branch",
    branchCode: "EJK-MAIN",
    patient: {
      id: "pat-001",
      name: "Rajesh Kumar",
      mobile: "9876543210",
      email: "rajesh@email.com",
      age: 45,
      gender: "Male",
      address: "123, MG Road, Sector 15",
      city: "Noida",
      pincode: "201301"
    },
    tests: [
      { id: "t1", testId: "test-001", testName: "Complete Blood Count", testCode: "CBC", price: 500, discount: 50, finalPrice: 450, sampleCollected: true, sampleCollectedAt: "2026-01-10T09:15:00Z", sampleCollectedBy: "Amit Singh" },
      { id: "t2", testId: "test-002", testName: "Lipid Profile", testCode: "LIPID", price: 800, discount: 80, finalPrice: 720, sampleCollected: true, sampleCollectedAt: "2026-01-10T09:15:00Z", sampleCollectedBy: "Amit Singh" }
    ],
    packages: [],
    subtotal: 1300,
    discount: 130,
    tax: 0,
    totalAmount: 1170,
    paidAmount: 1170,
    dueAmount: 0,
    paymentStatus: "Paid",
    paymentMode: "UPI",
    homeCollection: {
      scheduledDate: "2026-01-10",
      scheduledTime: "08:00 AM",
      address: "123, MG Road, Sector 15",
      city: "Noida",
      pincode: "201301",
      collectorId: "col-001",
      collectorName: "Amit Singh",
      collectorMobile: "9988776655",
      collectionStatus: "Collected",
      assignedAt: "2026-01-09T15:00:00Z",
      collectedAt: "2026-01-10T09:15:00Z"
    },
    sampleId: "SAMPLE-2026-0001",
    barcodeGenerated: true,
    createdAt: "2026-01-09T14:30:00Z",
    updatedAt: "2026-01-10T09:15:00Z",
    sampleCollectedAt: "2026-01-10T09:15:00Z",
    assignedTo: "Amit Singh"
  },
  {
    id: "ord-002",
    orderNumber: "ORD-2026-0002",
    source: "Home Collection",
    status: "Pending",
    branchId: "branch-002",
    branchName: "Ekta Janch Kendra - Green Park",
    branchCode: "EJK-GP",
    patient: {
      id: "pat-002",
      name: "Priya Sharma",
      mobile: "9876543211",
      email: "priya@email.com",
      age: 32,
      gender: "Female",
      address: "456, Green Park",
      city: "Delhi",
      pincode: "110016"
    },
    tests: [
      { id: "t3", testId: "test-003", testName: "Thyroid Profile", testCode: "THY", price: 1200, discount: 120, finalPrice: 1080 }
    ],
    packages: [],
    subtotal: 1200,
    discount: 120,
    tax: 0,
    totalAmount: 1080,
    paidAmount: 0,
    dueAmount: 1080,
    paymentStatus: "Pending",
    homeCollection: {
      scheduledDate: "2026-01-11",
      scheduledTime: "09:30 AM",
      address: "456, Green Park",
      city: "Delhi",
      pincode: "110016",
      collectionStatus: "Scheduled"
    },
    createdAt: "2026-01-10T10:00:00Z",
    updatedAt: "2026-01-10T10:00:00Z"
  },
  {
    id: "ord-012",
    orderNumber: "ORD-2026-0012",
    source: "Home Collection",
    status: "Pending",
    branchId: "branch-001",
    branchName: "Ekta Janch Kendra - Main Branch",
    branchCode: "EJK-MAIN",
    patient: {
      id: "pat-012",
      name: "Pooja Agarwal",
      mobile: "9876543221",
      email: "pooja.a@email.com",
      age: 27,
      gender: "Female",
      address: "707, Punjabi Bagh",
      city: "Delhi",
      pincode: "110026"
    },
    tests: [
      { id: "t13", testId: "test-013", testName: "Iron Studies", testCode: "IRON", price: 1000, discount: 100, finalPrice: 900 }
    ],
    packages: [],
    subtotal: 1000,
    discount: 100,
    tax: 0,
    totalAmount: 900,
    paidAmount: 900,
    dueAmount: 0,
    paymentStatus: "Paid",
    paymentMode: "UPI",
    homeCollection: {
      scheduledDate: "2026-01-12",
      scheduledTime: "07:30 AM",
      address: "707, Punjabi Bagh",
      city: "Delhi",
      pincode: "110026",
      collectionStatus: "Scheduled"
    },
    createdAt: "2026-01-10T16:00:00Z",
    updatedAt: "2026-01-10T16:00:00Z"
  },
  {
    id: "ord-016",
    orderNumber: "ORD-2026-0016",
    source: "Home Collection",
    status: "Pending",
    branchId: "branch-003",
    branchName: "Ekta Janch Kendra - Dwarka",
    branchCode: "EJK-DWK",
    patient: {
      id: "pat-016",
      name: "Geeta Rani",
      mobile: "9876543225",
      email: "geeta.rani@email.com",
      age: 55,
      gender: "Female",
      address: "B-12, Sector 6, Dwarka",
      city: "Delhi",
      pincode: "110075"
    },
    tests: [
      { id: "t17", testId: "test-017", testName: "Diabetes Panel", testCode: "DIAB", price: 1500, discount: 150, finalPrice: 1350 },
      { id: "t18", testId: "test-001", testName: "Complete Blood Count", testCode: "CBC", price: 500, discount: 50, finalPrice: 450 }
    ],
    packages: [],
    subtotal: 2000,
    discount: 200,
    tax: 0,
    totalAmount: 1800,
    paidAmount: 1800,
    dueAmount: 0,
    paymentStatus: "Paid",
    paymentMode: "Card",
    homeCollection: {
      scheduledDate: "2026-01-11",
      scheduledTime: "08:00 AM",
      address: "B-12, Sector 6, Dwarka",
      landmark: "Near Dwarka Mor Metro Station",
      city: "Delhi",
      pincode: "110075",
      collectorId: "col-004",
      collectorName: "Prakash Yadav",
      collectorMobile: "9988776658",
      collectionStatus: "Assigned",
      assignedAt: "2026-01-10T18:00:00Z"
    },
    createdAt: "2026-01-10T17:30:00Z",
    updatedAt: "2026-01-10T18:00:00Z"
  },

  // Online Test Booking
  {
    id: "ord-003",
    orderNumber: "ORD-2026-0003",
    source: "Online Test Booking",
    status: "Processing",
    branchId: "branch-001",
    branchName: "Ekta Janch Kendra - Main Branch",
    branchCode: "EJK-MAIN",
    patient: {
      id: "pat-003",
      name: "Amit Verma",
      mobile: "9876543212",
      email: "amit.v@email.com",
      age: 28,
      gender: "Male",
      address: "789, Saket",
      city: "Delhi",
      pincode: "110017"
    },
    tests: [
      { id: "t4", testId: "test-004", testName: "HbA1c", testCode: "HBA1C", price: 600, discount: 0, finalPrice: 600, sampleCollected: true, processingStartedAt: "2026-01-10T11:30:00Z" },
      { id: "t5", testId: "test-005", testName: "Fasting Blood Sugar", testCode: "FBS", price: 150, discount: 0, finalPrice: 150, sampleCollected: true, processingStartedAt: "2026-01-10T11:30:00Z" },
      { id: "t6", testId: "test-006", testName: "Post Prandial Blood Sugar", testCode: "PPBS", price: 150, discount: 0, finalPrice: 150, sampleCollected: true, processingStartedAt: "2026-01-10T11:30:00Z" }
    ],
    packages: [],
    subtotal: 900,
    discount: 0,
    tax: 0,
    totalAmount: 900,
    paidAmount: 900,
    dueAmount: 0,
    paymentStatus: "Paid",
    paymentMode: "Card",
    sampleId: "SAMPLE-2026-0003",
    barcodeGenerated: true,
    createdAt: "2026-01-10T08:00:00Z",
    updatedAt: "2026-01-10T11:30:00Z",
    processingStartedAt: "2026-01-10T11:30:00Z"
  },
  {
    id: "ord-004",
    orderNumber: "ORD-2026-0004",
    source: "Online Test Booking",
    status: "Report Ready",
    branchId: "branch-002",
    branchName: "Ekta Janch Kendra - Green Park",
    branchCode: "EJK-GP",
    patient: {
      id: "pat-004",
      name: "Sneha Gupta",
      mobile: "9876543213",
      email: "sneha.g@email.com",
      age: 35,
      gender: "Female",
      address: "101, Vasant Kunj",
      city: "Delhi",
      pincode: "110070"
    },
    tests: [
      { id: "t7", testId: "test-007", testName: "Vitamin D", testCode: "VITD", price: 1500, discount: 150, finalPrice: 1350, sampleCollected: true, processingStartedAt: "2026-01-09T17:00:00Z", processingCompletedAt: "2026-01-10T14:00:00Z", reportReady: true },
      { id: "t8", testId: "test-008", testName: "Vitamin B12", testCode: "VITB12", price: 900, discount: 90, finalPrice: 810, sampleCollected: true, processingStartedAt: "2026-01-09T17:00:00Z", processingCompletedAt: "2026-01-10T14:00:00Z", reportReady: true }
    ],
    packages: [],
    subtotal: 2400,
    discount: 240,
    tax: 0,
    totalAmount: 2160,
    paidAmount: 2160,
    dueAmount: 0,
    paymentStatus: "Paid",
    paymentMode: "UPI",
    sampleId: "SAMPLE-2026-0004",
    barcodeGenerated: true,
    createdAt: "2026-01-09T16:00:00Z",
    updatedAt: "2026-01-10T14:00:00Z",
    reportReadyAt: "2026-01-10T14:00:00Z"
  },
  {
    id: "ord-013",
    orderNumber: "ORD-2026-0013",
    source: "Online Test Booking",
    status: "Cancelled",
    branchId: "branch-001",
    branchName: "Ekta Janch Kendra - Main Branch",
    branchCode: "EJK-MAIN",
    patient: {
      id: "pat-013",
      name: "Nikhil Bansal",
      mobile: "9876543222",
      email: "nikhil.b@email.com",
      age: 33,
      gender: "Male"
    },
    tests: [
      { id: "t14", testId: "test-014", testName: "COVID RT-PCR", testCode: "COVID", price: 500, discount: 0, finalPrice: 500 }
    ],
    packages: [],
    subtotal: 500,
    discount: 0,
    tax: 0,
    totalAmount: 500,
    paidAmount: 500,
    dueAmount: 0,
    paymentStatus: "Refunded",
    paymentMode: "UPI",
    createdAt: "2026-01-08T14:00:00Z",
    updatedAt: "2026-01-09T10:00:00Z",
    notes: "Customer requested cancellation"
  },

  // Online Package Booking
  {
    id: "ord-005",
    orderNumber: "ORD-2026-0005",
    source: "Online Package Booking",
    status: "Completed",
    branchId: "branch-001",
    branchName: "Ekta Janch Kendra - Main Branch",
    branchCode: "EJK-MAIN",
    patient: {
      id: "pat-005",
      name: "Vikram Singh",
      mobile: "9876543214",
      email: "vikram@email.com",
      age: 50,
      gender: "Male",
      address: "202, Dwarka Sector 12",
      city: "Delhi",
      pincode: "110075"
    },
    tests: [],
    packages: [
      { id: "p1", packageId: "pkg-001", packageName: "Executive Health Checkup", testsIncluded: 45, price: 4999, discount: 500, finalPrice: 4499 }
    ],
    subtotal: 4999,
    discount: 500,
    tax: 0,
    totalAmount: 4499,
    paidAmount: 4499,
    dueAmount: 0,
    paymentStatus: "Paid",
    paymentMode: "NetBanking",
    sampleId: "SAMPLE-2026-0005",
    barcodeGenerated: true,
    createdAt: "2026-01-08T10:00:00Z",
    updatedAt: "2026-01-10T16:00:00Z",
    completedAt: "2026-01-10T16:00:00Z",
    referringDoctor: "Dr. Anil Kapoor",
    doctorCommission: 450
  },
  {
    id: "ord-006",
    orderNumber: "ORD-2026-0006",
    source: "Online Package Booking",
    status: "Processing",
    branchId: "branch-002",
    branchName: "Ekta Janch Kendra - Green Park",
    branchCode: "EJK-GP",
    patient: {
      id: "pat-006",
      name: "Meera Patel",
      mobile: "9876543215",
      email: "meera.p@email.com",
      age: 42,
      gender: "Female",
      address: "303, Rohini Sector 7",
      city: "Delhi",
      pincode: "110085"
    },
    tests: [],
    packages: [
      { id: "p2", packageId: "pkg-002", packageName: "Women's Wellness Package", testsIncluded: 35, price: 3499, discount: 350, finalPrice: 3149 }
    ],
    subtotal: 3499,
    discount: 350,
    tax: 0,
    totalAmount: 3149,
    paidAmount: 3149,
    dueAmount: 0,
    paymentStatus: "Paid",
    paymentMode: "UPI",
    sampleId: "SAMPLE-2026-0006",
    barcodeGenerated: true,
    createdAt: "2026-01-10T09:30:00Z",
    updatedAt: "2026-01-10T12:00:00Z",
    processingStartedAt: "2026-01-10T12:00:00Z"
  },
  {
    id: "ord-017",
    orderNumber: "ORD-2026-0017",
    source: "Online Package Booking",
    status: "Report Ready",
    branchId: "branch-003",
    branchName: "Ekta Janch Kendra - Dwarka",
    branchCode: "EJK-DWK",
    patient: {
      id: "pat-017",
      name: "Sanjay Kapoor",
      mobile: "9876543226",
      email: "sanjay.k@email.com",
      age: 48,
      gender: "Male",
      address: "D-45, Sector 11, Dwarka",
      city: "Delhi",
      pincode: "110075"
    },
    tests: [],
    packages: [
      { id: "p4", packageId: "pkg-004", packageName: "Cardiac Health Package", testsIncluded: 28, price: 3999, discount: 400, finalPrice: 3599 }
    ],
    subtotal: 3999,
    discount: 400,
    tax: 0,
    totalAmount: 3599,
    paidAmount: 3599,
    dueAmount: 0,
    paymentStatus: "Paid",
    paymentMode: "Card",
    sampleId: "SAMPLE-2026-0017",
    barcodeGenerated: true,
    createdAt: "2026-01-09T11:00:00Z",
    updatedAt: "2026-01-10T15:30:00Z",
    reportReadyAt: "2026-01-10T15:30:00Z"
  },

  // Slot Booking (Minimal details)
  {
    id: "ord-007",
    orderNumber: "ORD-2026-0007",
    source: "Slot Booking",
    status: "Pending",
    branchId: "branch-001",
    branchName: "Ekta Janch Kendra - Main Branch",
    branchCode: "EJK-MAIN",
    patient: {
      id: "pat-007",
      name: "Rahul Jain",
      mobile: "9876543216"
    },
    tests: [],
    packages: [],
    subtotal: 0,
    discount: 0,
    tax: 0,
    totalAmount: 0,
    paidAmount: 0,
    dueAmount: 0,
    paymentStatus: "Pending",
    slotBooking: {
      slotDate: "2026-01-11",
      slotTime: "10:00 AM",
      isDetailsComplete: false
    },
    createdAt: "2026-01-10T11:00:00Z",
    updatedAt: "2026-01-10T11:00:00Z",
    notes: "Customer will provide test details on arrival"
  },
  {
    id: "ord-008",
    orderNumber: "ORD-2026-0008",
    source: "Slot Booking",
    status: "Processing",
    branchId: "branch-002",
    branchName: "Ekta Janch Kendra - Green Park",
    branchCode: "EJK-GP",
    patient: {
      id: "pat-008",
      name: "Kavita Reddy",
      mobile: "9876543217",
      age: 38,
      gender: "Female"
    },
    tests: [
      { id: "t9", testId: "test-009", testName: "Complete Blood Count", testCode: "CBC", price: 500, discount: 0, finalPrice: 500, sampleCollected: true, processingStartedAt: "2026-01-10T14:30:00Z" }
    ],
    packages: [],
    subtotal: 500,
    discount: 0,
    tax: 0,
    totalAmount: 500,
    paidAmount: 500,
    dueAmount: 0,
    paymentStatus: "Paid",
    paymentMode: "Cash",
    slotBooking: {
      slotDate: "2026-01-10",
      slotTime: "02:00 PM",
      isDetailsComplete: true
    },
    sampleId: "SAMPLE-2026-0008",
    barcodeGenerated: true,
    createdAt: "2026-01-09T18:00:00Z",
    updatedAt: "2026-01-10T14:30:00Z",
    processingStartedAt: "2026-01-10T14:30:00Z"
  },
  {
    id: "ord-014",
    orderNumber: "ORD-2026-0014",
    source: "Slot Booking",
    status: "Pending",
    branchId: "branch-003",
    branchName: "Ekta Janch Kendra - Dwarka",
    branchCode: "EJK-DWK",
    patient: {
      id: "pat-014",
      name: "Ritu Saxena",
      mobile: "9876543223"
    },
    tests: [],
    packages: [],
    subtotal: 0,
    discount: 0,
    tax: 0,
    totalAmount: 0,
    paidAmount: 0,
    dueAmount: 0,
    paymentStatus: "Pending",
    slotBooking: {
      slotDate: "2026-01-11",
      slotTime: "11:30 AM",
      isDetailsComplete: false
    },
    createdAt: "2026-01-10T17:00:00Z",
    updatedAt: "2026-01-10T17:00:00Z"
  },

  // Walk-in Orders
  {
    id: "ord-009",
    orderNumber: "ORD-2026-0009",
    source: "Walk-in",
    status: "Processing",
    branchId: "branch-001",
    branchName: "Ekta Janch Kendra - Main Branch",
    branchCode: "EJK-MAIN",
    patient: {
      id: "pat-009",
      name: "Suresh Mehta",
      mobile: "9876543218",
      age: 55,
      gender: "Male",
      address: "505, Lajpat Nagar",
      city: "Delhi",
      pincode: "110024"
    },
    tests: [
      { id: "t10", testId: "test-010", testName: "Liver Function Test", testCode: "LFT", price: 800, discount: 0, finalPrice: 800, sampleCollected: true, processingStartedAt: "2026-01-10T10:45:00Z" },
      { id: "t11", testId: "test-011", testName: "Kidney Function Test", testCode: "KFT", price: 700, discount: 0, finalPrice: 700, sampleCollected: true, processingStartedAt: "2026-01-10T10:45:00Z" }
    ],
    packages: [],
    subtotal: 1500,
    discount: 0,
    tax: 0,
    totalAmount: 1500,
    paidAmount: 1500,
    dueAmount: 0,
    paymentStatus: "Paid",
    paymentMode: "Cash",
    sampleId: "SAMPLE-2026-0009",
    barcodeGenerated: true,
    createdAt: "2026-01-10T10:30:00Z",
    updatedAt: "2026-01-10T10:45:00Z",
    processingStartedAt: "2026-01-10T10:45:00Z",
    referringDoctor: "Dr. Ramesh Sharma",
    doctorCommission: 150
  },
  {
    id: "ord-010",
    orderNumber: "ORD-2026-0010",
    source: "Walk-in",
    status: "Pending",
    branchId: "branch-002",
    branchName: "Ekta Janch Kendra - Green Park",
    branchCode: "EJK-GP",
    patient: {
      id: "pat-010",
      name: "Anita Desai",
      mobile: "9876543219",
      age: 29,
      gender: "Female"
    },
    tests: [
      { id: "t12", testId: "test-012", testName: "Urine Routine", testCode: "URINE", price: 200, discount: 0, finalPrice: 200 }
    ],
    packages: [],
    subtotal: 200,
    discount: 0,
    tax: 0,
    totalAmount: 200,
    paidAmount: 0,
    dueAmount: 200,
    paymentStatus: "Pending",
    createdAt: "2026-01-10T15:00:00Z",
    updatedAt: "2026-01-10T15:00:00Z"
  },
  {
    id: "ord-011",
    orderNumber: "ORD-2026-0011",
    source: "Walk-in",
    status: "Completed",
    branchId: "branch-001",
    branchName: "Ekta Janch Kendra - Main Branch",
    branchCode: "EJK-MAIN",
    patient: {
      id: "pat-011",
      name: "Deepak Chauhan",
      mobile: "9876543220",
      age: 40,
      gender: "Male",
      address: "606, Karol Bagh",
      city: "Delhi",
      pincode: "110005"
    },
    tests: [],
    packages: [
      { id: "p3", packageId: "pkg-003", packageName: "Basic Health Checkup", testsIncluded: 20, price: 1499, discount: 0, finalPrice: 1499 }
    ],
    subtotal: 1499,
    discount: 0,
    tax: 0,
    totalAmount: 1499,
    paidAmount: 1499,
    dueAmount: 0,
    paymentStatus: "Paid",
    paymentMode: "UPI",
    sampleId: "SAMPLE-2026-0011",
    barcodeGenerated: true,
    createdAt: "2026-01-09T11:00:00Z",
    updatedAt: "2026-01-10T10:00:00Z",
    completedAt: "2026-01-10T10:00:00Z"
  },
  {
    id: "ord-015",
    orderNumber: "ORD-2026-0015",
    source: "Walk-in",
    status: "Processing",
    branchId: "branch-003",
    branchName: "Ekta Janch Kendra - Dwarka",
    branchCode: "EJK-DWK",
    patient: {
      id: "pat-015",
      name: "Manoj Tiwari",
      mobile: "9876543224",
      age: 48,
      gender: "Male"
    },
    tests: [
      { id: "t15", testId: "test-015", testName: "ECG", testCode: "ECG", price: 300, discount: 0, finalPrice: 300, sampleCollected: true, processingStartedAt: "2026-01-10T13:30:00Z" },
      { id: "t16", testId: "test-016", testName: "Chest X-Ray", testCode: "XRAY", price: 400, discount: 0, finalPrice: 400, sampleCollected: true, processingStartedAt: "2026-01-10T13:30:00Z" }
    ],
    packages: [],
    subtotal: 700,
    discount: 0,
    tax: 0,
    totalAmount: 700,
    paidAmount: 700,
    dueAmount: 0,
    paymentStatus: "Paid",
    paymentMode: "Cash",
    sampleId: "SAMPLE-2026-0015",
    barcodeGenerated: true,
    createdAt: "2026-01-10T13:00:00Z",
    updatedAt: "2026-01-10T13:30:00Z",
    processingStartedAt: "2026-01-10T13:30:00Z"
  },
  {
    id: "ord-018",
    orderNumber: "ORD-2026-0018",
    source: "Walk-in",
    status: "Report Ready",
    branchId: "branch-001",
    branchName: "Ekta Janch Kendra - Main Branch",
    branchCode: "EJK-MAIN",
    patient: {
      id: "pat-018",
      name: "Ramesh Iyer",
      mobile: "9876543227",
      age: 62,
      gender: "Male",
      address: "A-23, Mayur Vihar Phase 1",
      city: "Delhi",
      pincode: "110091"
    },
    tests: [
      { id: "t19", testId: "test-001", testName: "Complete Blood Count", testCode: "CBC", price: 500, discount: 50, finalPrice: 450, sampleCollected: true, processingStartedAt: "2026-01-10T09:00:00Z", processingCompletedAt: "2026-01-10T14:00:00Z", reportReady: true },
      { id: "t20", testId: "test-019", testName: "ESR", testCode: "ESR", price: 150, discount: 0, finalPrice: 150, sampleCollected: true, processingStartedAt: "2026-01-10T09:00:00Z", processingCompletedAt: "2026-01-10T14:00:00Z", reportReady: true }
    ],
    packages: [],
    subtotal: 650,
    discount: 50,
    tax: 0,
    totalAmount: 600,
    paidAmount: 600,
    dueAmount: 0,
    paymentStatus: "Paid",
    paymentMode: "Cash",
    sampleId: "SAMPLE-2026-0018",
    barcodeGenerated: true,
    createdAt: "2026-01-10T08:30:00Z",
    updatedAt: "2026-01-10T14:00:00Z",
    reportReadyAt: "2026-01-10T14:00:00Z"
  }
];

// ==================== API Functions ====================

// Fetch all orders with optional filters
export async function fetchOrders(filters?: OrderFilters): Promise<Order[]> {
  return new Promise((resolve) => {
    setTimeout(() => {
      let filtered = [...mockOrders];

      if (filters) {
        if (filters.source) {
          filtered = filtered.filter(o => o.source === filters.source);
        }
        if (filters.status) {
          filtered = filtered.filter(o => o.status === filters.status);
        }
        if (filters.paymentStatus) {
          filtered = filtered.filter(o => o.paymentStatus === filters.paymentStatus);
        }
        if (filters.branchId) {
          filtered = filtered.filter(o => o.branchId === filters.branchId);
        }
        if (filters.searchQuery) {
          const q = filters.searchQuery.toLowerCase();
          filtered = filtered.filter(o => 
            o.orderNumber.toLowerCase().includes(q) ||
            o.patient.name.toLowerCase().includes(q) ||
            o.patient.mobile.includes(q) ||
            o.branchName.toLowerCase().includes(q)
          );
        }
        if (filters.dateFrom) {
          filtered = filtered.filter(o => o.createdAt >= filters.dateFrom!);
        }
        if (filters.dateTo) {
          filtered = filtered.filter(o => o.createdAt <= filters.dateTo!);
        }
      }

      // Sort by created date descending
      filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

      resolve(filtered);
    }, 300);
  });
}

// Fetch order by ID
export async function fetchOrderById(id: string): Promise<Order | null> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const order = mockOrders.find(o => o.id === id);
      resolve(order || null);
    }, 200);
  });
}

// Get order statistics
export async function fetchOrderStats(): Promise<OrderStats> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const today = new Date().toISOString().split('T')[0];
      
      const stats: OrderStats = {
        totalOrders: mockOrders.length,
        pendingOrders: mockOrders.filter(o => o.status === "Pending").length,
        completedToday: mockOrders.filter(o => o.completedAt?.startsWith(today)).length,
        revenueToday: mockOrders
          .filter(o => o.createdAt.startsWith(today) && o.paymentStatus === "Paid")
          .reduce((sum, o) => sum + o.totalAmount, 0),
        homeCollectionPending: mockOrders
          .filter(o => o.source === "Home Collection" && o.homeCollection?.collectionStatus !== "Collected")
          .length,
        slotBookingsPending: mockOrders
          .filter(o => o.source === "Slot Booking" && !o.slotBooking?.isDetailsComplete)
          .length,
        processingOrders: mockOrders.filter(o => o.status === "Processing").length,
        cancelledOrders: mockOrders.filter(o => o.status === "Cancelled").length,
        sampleCollectedToday: mockOrders.filter(o => o.sampleCollectedAt?.startsWith(today)).length,
        reportReadyToday: mockOrders.filter(o => o.reportReadyAt?.startsWith(today)).length
      };

      resolve(stats);
    }, 200);
  });
}

// Create new order
export async function createOrder(data: OrderFormData): Promise<Order> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const branch = labBranches.find(b => b.id === data.branchId) || labBranches[0];
      
      const newOrder: Order = {
        id: `ord-${Date.now()}`,
        orderNumber: `ORD-2026-${String(mockOrders.length + 1).padStart(4, '0')}`,
        source: data.source,
        status: "Pending",
        branchId: branch.id,
        branchName: branch.name,
        branchCode: branch.code,
        patient: {
          id: `pat-${Date.now()}`,
          ...data.patient
        },
        tests: [],
        packages: [],
        subtotal: 0,
        discount: 0,
        tax: 0,
        totalAmount: 0,
        paidAmount: 0,
        dueAmount: 0,
        paymentStatus: "Pending",
        paymentMode: data.paymentMode,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        notes: data.notes,
        referringDoctor: data.referringDoctor
      };

      mockOrders.unshift(newOrder);
      resolve(newOrder);
    }, 300);
  });
}

// Update order
export async function updateOrder(id: string, data: Partial<Order>): Promise<Order | null> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const index = mockOrders.findIndex(o => o.id === id);
      if (index !== -1) {
        mockOrders[index] = {
          ...mockOrders[index],
          ...data,
          updatedAt: new Date().toISOString()
        };
        resolve(mockOrders[index]);
      } else {
        resolve(null);
      }
    }, 300);
  });
}

// Update order status
export async function updateOrderStatus(id: string, status: Order["status"]): Promise<Order | null> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const index = mockOrders.findIndex(o => o.id === id);
      if (index !== -1) {
        mockOrders[index].status = status;
        mockOrders[index].updatedAt = new Date().toISOString();
        
        // Set appropriate timestamps based on status
        if (status === "Sample Collected") {
          mockOrders[index].sampleCollectedAt = new Date().toISOString();
        } else if (status === "Processing") {
          mockOrders[index].processingStartedAt = new Date().toISOString();
        } else if (status === "Report Ready") {
          mockOrders[index].reportReadyAt = new Date().toISOString();
        } else if (status === "Completed") {
          mockOrders[index].completedAt = new Date().toISOString();
        }
        
        resolve(mockOrders[index]);
      } else {
        resolve(null);
      }
    }, 200);
  });
}

// Get orders by source
export async function fetchOrdersBySource(source: Order["source"]): Promise<Order[]> {
  return fetchOrders({ source });
}

// Fetch lab branches
export async function fetchLabBranches(): Promise<LabBranch[]> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(labBranches.filter(b => b.isActive));
    }, 100);
  });
}

// Fetch collectors
export async function fetchCollectors(): Promise<Collector[]> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(collectors);
    }, 100);
  });
}

// Fetch available collectors
export async function fetchAvailableCollectors(): Promise<Collector[]> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(collectors.filter(c => c.isAvailable));
    }, 100);
  });
}

// Assign collector to home collection order
export async function assignCollector(orderId: string, collectorId: string): Promise<Order | null> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const orderIndex = mockOrders.findIndex(o => o.id === orderId);
      const collector = collectors.find(c => c.id === collectorId);
      
      if (orderIndex !== -1 && collector && mockOrders[orderIndex].homeCollection) {
        mockOrders[orderIndex].homeCollection!.collectorId = collector.id;
        mockOrders[orderIndex].homeCollection!.collectorName = collector.name;
        mockOrders[orderIndex].homeCollection!.collectorMobile = collector.mobile;
        mockOrders[orderIndex].homeCollection!.collectionStatus = "Assigned";
        mockOrders[orderIndex].homeCollection!.assignedAt = new Date().toISOString();
        mockOrders[orderIndex].assignedTo = collector.name;
        mockOrders[orderIndex].updatedAt = new Date().toISOString();
        
        // Update collector assignments
        const collectorIndex = collectors.findIndex(c => c.id === collectorId);
        if (collectorIndex !== -1) {
          collectors[collectorIndex].currentAssignments++;
        }
        
        resolve(mockOrders[orderIndex]);
      } else {
        resolve(null);
      }
    }, 200);
  });
}

// Update collection status
export async function updateCollectionStatus(
  orderId: string, 
  status: "En Route" | "Collected" | "Cancelled",
  notes?: string
): Promise<Order | null> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const index = mockOrders.findIndex(o => o.id === orderId);
      if (index !== -1 && mockOrders[index].homeCollection) {
        mockOrders[index].homeCollection!.collectionStatus = status;
        
        if (status === "En Route") {
          mockOrders[index].homeCollection!.enRouteAt = new Date().toISOString();
        } else if (status === "Collected") {
          mockOrders[index].homeCollection!.collectedAt = new Date().toISOString();
          mockOrders[index].status = "Sample Collected";
          mockOrders[index].sampleCollectedAt = new Date().toISOString();
          mockOrders[index].sampleId = `SAMPLE-2026-${String(index + 1).padStart(4, '0')}`;
          mockOrders[index].barcodeGenerated = true;
          
          // Reduce collector assignments
          const collectorId = mockOrders[index].homeCollection!.collectorId;
          if (collectorId) {
            const collectorIndex = collectors.findIndex(c => c.id === collectorId);
            if (collectorIndex !== -1) {
              collectors[collectorIndex].currentAssignments = Math.max(0, collectors[collectorIndex].currentAssignments - 1);
              collectors[collectorIndex].totalCollections++;
            }
          }
        }
        
        if (notes) {
          mockOrders[index].homeCollection!.collectionNotes = notes;
        }
        
        mockOrders[index].updatedAt = new Date().toISOString();
        resolve(mockOrders[index]);
      } else {
        resolve(null);
      }
    }, 200);
  });
}

// Get pending home collections
export async function fetchPendingHomeCollections(): Promise<Order[]> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const pending = mockOrders.filter(o => 
        o.source === "Home Collection" && 
        o.homeCollection?.collectionStatus !== "Collected" &&
        o.homeCollection?.collectionStatus !== "Cancelled"
      );
      resolve(pending);
    }, 200);
  });
}

// Get lab processing queue
export async function fetchLabProcessingQueue(): Promise<LabProcessingQueueItem[]> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const queue: LabProcessingQueueItem[] = [];
      
      mockOrders.forEach(order => {
        if (order.status === "Processing" || order.status === "Sample Collected") {
          order.tests.forEach(test => {
            if (!test.reportReady) {
              queue.push({
                id: `lpq-${order.id}-${test.id}`,
                orderId: order.id,
                orderNumber: order.orderNumber,
                patient: order.patient,
                test: test,
                sampleId: order.sampleId || "",
                receivedAt: order.sampleCollectedAt || order.createdAt,
                status: test.processingStartedAt ? (test.processingCompletedAt ? "Completed" : "In Progress") : "In Queue",
                priority: "Normal",
                branchId: order.branchId,
                branchName: order.branchName
              });
            }
          });
        }
      });
      
      // Sort by received date
      queue.sort((a, b) => new Date(a.receivedAt).getTime() - new Date(b.receivedAt).getTime());
      
      resolve(queue);
    }, 200);
  });
}

// Update lab test processing status
export async function updateLabTestStatus(
  orderId: string, 
  testId: string, 
  status: "In Progress" | "Completed",
  processedBy?: string
): Promise<Order | null> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const orderIndex = mockOrders.findIndex(o => o.id === orderId);
      if (orderIndex !== -1) {
        const testIndex = mockOrders[orderIndex].tests.findIndex(t => t.id === testId);
        if (testIndex !== -1) {
          if (status === "In Progress") {
            mockOrders[orderIndex].tests[testIndex].processingStartedAt = new Date().toISOString();
          } else if (status === "Completed") {
            mockOrders[orderIndex].tests[testIndex].processingCompletedAt = new Date().toISOString();
            mockOrders[orderIndex].tests[testIndex].reportReady = true;
          }
          
          // Check if all tests are completed
          const allTestsCompleted = mockOrders[orderIndex].tests.every(t => t.reportReady);
          if (allTestsCompleted) {
            mockOrders[orderIndex].status = "Report Ready";
            mockOrders[orderIndex].reportReadyAt = new Date().toISOString();
          } else if (mockOrders[orderIndex].status !== "Processing") {
            mockOrders[orderIndex].status = "Processing";
            mockOrders[orderIndex].processingStartedAt = mockOrders[orderIndex].processingStartedAt || new Date().toISOString();
          }
          
          mockOrders[orderIndex].updatedAt = new Date().toISOString();
          resolve(mockOrders[orderIndex]);
        } else {
          resolve(null);
        }
      } else {
        resolve(null);
      }
    }, 200);
  });
}

// Get sample collection records
export async function fetchSampleCollectionRecords(branchId?: string): Promise<SampleCollectionRecord[]> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const records: SampleCollectionRecord[] = mockOrders
        .filter(o => 
          o.source === "Home Collection" && 
          (!branchId || o.branchId === branchId)
        )
        .map(order => ({
          id: `scr-${order.id}`,
          orderId: order.id,
          orderNumber: order.orderNumber,
          patient: order.patient,
          collectionType: "Home Collection",
          scheduledDate: order.homeCollection?.scheduledDate,
          scheduledTime: order.homeCollection?.scheduledTime,
          address: order.homeCollection?.address,
          collector: order.homeCollection?.collectorId 
            ? collectors.find(c => c.id === order.homeCollection?.collectorId) 
            : undefined,
          status: order.homeCollection?.collectionStatus === "Scheduled" ? "Pending" 
                : order.homeCollection?.collectionStatus === "Assigned" ? "Assigned"
                : order.homeCollection?.collectionStatus === "En Route" ? "En Route"
                : order.homeCollection?.collectionStatus === "Collected" ? "Collected"
                : "Cancelled",
          sampleId: order.sampleId,
          collectedAt: order.homeCollection?.collectedAt,
          notes: order.homeCollection?.collectionNotes,
          tests: order.tests,
          branchId: order.branchId,
          branchName: order.branchName
        }));
      
      resolve(records);
    }, 200);
  });
}

// ==================== Chart Data Helpers ====================

export function getOrdersBySourceChartData(orders: Order[]) {
  const sources = ["Home Collection", "Online Test Booking", "Online Package Booking", "Slot Booking", "Walk-in"];
  return sources.map(source => ({
    name: source === "Online Test Booking" ? "Online Tests" : 
          source === "Online Package Booking" ? "Online Packages" : source,
    value: orders.filter(o => o.source === source).length,
    revenue: orders.filter(o => o.source === source).reduce((sum, o) => sum + o.totalAmount, 0)
  }));
}

export function getOrdersByStatusChartData(orders: Order[]) {
  const statuses = ["Pending", "Sample Collected", "Processing", "Report Ready", "Completed", "Cancelled"];
  return statuses.map(status => ({
    name: status,
    value: orders.filter(o => o.status === status).length
  })).filter(d => d.value > 0);
}

export function getOrdersByBranchChartData(orders: Order[]) {
  return labBranches.map(branch => ({
    name: branch.name.replace("Ekta Janch Kendra - ", ""),
    value: orders.filter(o => o.branchId === branch.id).length,
    revenue: orders.filter(o => o.branchId === branch.id).reduce((sum, o) => sum + o.totalAmount, 0)
  }));
}

export function getDailyOrdersChartData(orders: Order[], days: number = 7) {
  const data = [];
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split('T')[0];
    
    const dayOrders = orders.filter(o => o.createdAt.startsWith(dateStr));
    data.push({
      date: date.toLocaleDateString("en-IN", { day: "2-digit", month: "short" }),
      orders: dayOrders.length,
      revenue: dayOrders.reduce((sum, o) => sum + o.totalAmount, 0)
    });
  }
  return data;
}

export function getCollectionStatsChartData() {
  const scheduled = mockOrders.filter(o => o.homeCollection?.collectionStatus === "Scheduled").length;
  const assigned = mockOrders.filter(o => o.homeCollection?.collectionStatus === "Assigned").length;
  const enRoute = mockOrders.filter(o => o.homeCollection?.collectionStatus === "En Route").length;
  const collected = mockOrders.filter(o => o.homeCollection?.collectionStatus === "Collected").length;
  
  return [
    { name: "Scheduled", value: scheduled, color: "#f59e0b" },
    { name: "Assigned", value: assigned, color: "#3b82f6" },
    { name: "En Route", value: enRoute, color: "#8b5cf6" },
    { name: "Collected", value: collected, color: "#10b981" }
  ];
}
