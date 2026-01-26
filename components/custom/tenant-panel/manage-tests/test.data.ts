import type { Test } from "./test.types";

export const mockTests: Test[] = [
  {
    id: "test-1",
    title: "Complete Blood Count (CBC)",
    slug: "complete-blood-count-cbc",
    image: "/assets/tests/cbc.jpg",
    price: {
      original: 500,
      final: 399,
      currency: "INR",
    },
    category: "Blood Tests",
    description: "A comprehensive blood test to evaluate overall health and detect disorders.",
    turnaroundTime: "6-8 hours",
    sampleType: "Blood",
    preparationRequired: false,
    isActive: true,
    ctaText: "Book Now",
    iconType: "droplet",
    createdAt: "2025-11-15",
    updatedAt: "2026-01-05",
  },
  {
    id: "test-2",
    title: "Lipid Profile",
    slug: "lipid-profile",
    image: "/assets/tests/lipid.jpg",
    price: {
      original: 800,
      final: 599,
      currency: "INR",
    },
    category: "Blood Tests",
    description: "Measures cholesterol levels and triglycerides to assess heart disease risk.",
    turnaroundTime: "12-24 hours",
    sampleType: "Blood",
    preparationRequired: true,
    isActive: true,
    ctaText: "Book Now",
    iconType: "heart",
    createdAt: "2025-11-20",
    updatedAt: "2026-01-08",
  },
  {
    id: "test-3",
    title: "Thyroid Function Test (TFT)",
    slug: "thyroid-function-test",
    image: "/assets/tests/thyroid.jpg",
    price: {
      final: 450,
      currency: "INR",
    },
    category: "Hormone Tests",
    description: "Evaluates thyroid gland function by measuring TSH, T3, and T4 levels.",
    turnaroundTime: "24 hours",
    sampleType: "Blood",
    preparationRequired: false,
    isActive: true,
    ctaText: "Book Now",
    iconType: "activity",
    createdAt: "2025-12-01",
    updatedAt: "2026-01-10",
  },
  {
    id: "test-4",
    title: "HbA1c (Diabetes Test)",
    slug: "hba1c-diabetes",
    image: "/assets/tests/diabetes.jpg",
    price: {
      original: 600,
      final: 499,
      currency: "INR",
    },
    category: "Blood Tests",
    description: "Measures average blood sugar levels over the past 2-3 months.",
    turnaroundTime: "24 hours",
    sampleType: "Blood",
    preparationRequired: false,
    isActive: true,
    ctaText: "Book Now",
    iconType: "pill",
    createdAt: "2025-12-05",
    updatedAt: "2026-01-09",
  },
  {
    id: "test-5",
    title: "Liver Function Test (LFT)",
    slug: "liver-function-test",
    image: "/assets/tests/liver.jpg",
    price: {
      original: 700,
      final: 549,
      currency: "INR",
    },
    category: "Blood Tests",
    description: "Assesses liver health by measuring enzymes, proteins, and bilirubin.",
    turnaroundTime: "12-24 hours",
    sampleType: "Blood",
    preparationRequired: true,
    isActive: true,
    ctaText: "Book Now",
    iconType: "flask",
    createdAt: "2025-12-10",
    updatedAt: "2026-01-07",
  },
  {
    id: "test-6",
    title: "Kidney Function Test (KFT)",
    slug: "kidney-function-test",
    image: "/assets/tests/kidney.jpg",
    price: {
      final: 599,
      currency: "INR",
    },
    category: "Blood Tests",
    description: "Evaluates kidney health by measuring creatinine, BUN, and electrolytes.",
    turnaroundTime: "12-24 hours",
    sampleType: "Blood",
    preparationRequired: false,
    isActive: true,
    ctaText: "Book Now",
    iconType: "droplets",
    createdAt: "2025-12-15",
    updatedAt: "2026-01-08",
  },
  {
    id: "test-7",
    title: "Vitamin D Test",
    slug: "vitamin-d-test",
    image: "/assets/tests/vitamin-d.jpg",
    price: {
      original: 1200,
      final: 899,
      currency: "INR",
    },
    category: "Vitamin Tests",
    description: "Measures 25-hydroxy vitamin D levels in blood.",
    turnaroundTime: "24-48 hours",
    sampleType: "Blood",
    preparationRequired: false,
    isActive: true,
    ctaText: "Book Now",
    iconType: "sun",
    createdAt: "2025-12-20",
    updatedAt: "2026-01-09",
  },
  {
    id: "test-8",
    title: "Urine Routine & Microscopy",
    slug: "urine-routine-microscopy",
    image: "/assets/tests/urine.jpg",
    price: {
      original: 300,
      final: 199,
      currency: "INR",
    },
    category: "Urine Tests",
    description: "Detects urinary tract infections and kidney problems.",
    turnaroundTime: "6-8 hours",
    sampleType: "Urine",
    preparationRequired: false,
    isActive: true,
    ctaText: "Book Now",
    iconType: "beaker",
    createdAt: "2025-12-25",
    updatedAt: "2026-01-10",
  },
];

// Mock API function - replace with actual API calls
export async function fetchTests(): Promise<Test[]> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500));
  return mockTests;
}

export async function createTest(testData: Omit<Test, "id" | "createdAt" | "updatedAt">): Promise<Test> {
  await new Promise((resolve) => setTimeout(resolve, 300));
  const newTest: Test = {
    ...testData,
    id: `test-${Date.now()}`,
    createdAt: new Date().toISOString().split("T")[0],
    updatedAt: new Date().toISOString().split("T")[0],
  };
  return newTest;
}

export async function updateTest(id: string, testData: Partial<Test>): Promise<Test> {
  await new Promise((resolve) => setTimeout(resolve, 300));
  const existingTest = mockTests.find((t) => t.id === id);
  if (!existingTest) throw new Error("Test not found");
  
  return {
    ...existingTest,
    ...testData,
    updatedAt: new Date().toISOString().split("T")[0],
  };
}

export async function deleteTest(id: string): Promise<void> {
  await new Promise((resolve) => setTimeout(resolve, 300));
}
