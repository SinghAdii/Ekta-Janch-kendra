import type { Expense } from "./expenses.types";

export const mockExpenses: Expense[] = [
  {
    id: "exp-1",
    title: "Reagents Supply - Batch A",
    category: "Inventory",
    amount: 12500,
    date: "2026-01-05",
    paymentMethod: "Bank Transfer",
    status: "Paid",
    vendorName: "MediChem Supplies Ltd",
    referenceNumber: "INV-88291",
    description: "Monthly purchase of hematology reagents",
    createdAt: "2026-01-05T10:00:00Z",
    updatedAt: "2026-01-05T10:00:00Z",
  },
  {
    id: "exp-2",
    title: "Lab Technician Salaries",
    category: "Salary",
    amount: 85000,
    date: "2026-01-01",
    paymentMethod: "Bank Transfer",
    status: "Paid",
    description: "January salaries for 4 technicians",
    createdAt: "2026-01-01T09:00:00Z",
    updatedAt: "2026-01-01T09:00:00Z",
  },
  {
    id: "exp-3",
    title: "Electricity Bill - Dec",
    category: "Utilities",
    amount: 4200,
    date: "2026-01-08",
    paymentMethod: "UPI",
    status: "Pending",
    vendorName: "Power Corp",
    referenceNumber: "BILL-2023-12",
    description: "Electricity consumption for December",
    createdAt: "2026-01-08T11:00:00Z",
    updatedAt: "2026-01-08T11:00:00Z",
  },
  {
    id: "exp-4",
    title: "Office Rent - Jan",
    category: "Rent",
    amount: 25000,
    date: "2026-01-01",
    paymentMethod: "Cheque",
    status: "Paid",
    vendorName: "City Properties",
    createdAt: "2026-01-01T10:00:00Z",
    updatedAt: "2026-01-01T10:00:00Z",
  },
  {
    id: "exp-5",
    title: "Facebook Ads Campaign",
    category: "Marketing",
    amount: 3500,
    date: "2026-01-03",
    paymentMethod: "Card",
    status: "Paid",
    vendorName: "Meta Platforms",
    description: "New Year Full Body Checkup Promo",
    createdAt: "2026-01-03T14:30:00Z",
    updatedAt: "2026-01-03T14:30:00Z",
  },
  {
    id: "exp-6",
    title: "AC Repair",
    category: "Maintenance",
    amount: 1800,
    date: "2026-01-07",
    paymentMethod: "Cash",
    status: "Paid",
    vendorName: "Cool Air Services",
    description: "Servicing of waiting area AC",
    createdAt: "2026-01-07T16:00:00Z",
    updatedAt: "2026-01-07T16:00:00Z",
  },
  {
    id: "exp-7",
    title: "Dr. Sharma Commission",
    category: "Doctor Commission",
    amount: 2400,
    date: "2026-01-09",
    paymentMethod: "UPI",
    status: "Pending",
    vendorName: "Dr. A. Sharma",
    description: "December referral payout",
    createdAt: "2026-01-09T09:30:00Z",
    updatedAt: "2026-01-09T09:30:00Z",
  },
  {
    id: "exp-8",
    title: "Printing Paper & Stationery",
    category: "Other",
    amount: 850,
    date: "2026-01-06",
    paymentMethod: "Cash",
    status: "Paid",
    vendorName: "Local Stationery",
    createdAt: "2026-01-06T12:00:00Z",
    updatedAt: "2026-01-06T12:00:00Z",
  }
];

// Mock API functions
export async function fetchExpenses(): Promise<Expense[]> {
  await new Promise((resolve) => setTimeout(resolve, 600));
  return mockExpenses;
}

export async function createExpense(expenseData: Omit<Expense, "id" | "createdAt" | "updatedAt">): Promise<Expense> {
  await new Promise((resolve) => setTimeout(resolve, 400));
  const newExpense: Expense = {
    ...expenseData,
    id: `exp-${Date.now()}`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  return newExpense;
}

export async function updateExpense(id: string, expenseData: Partial<Expense>): Promise<Expense> {
  await new Promise((resolve) => setTimeout(resolve, 400));
  const existing = mockExpenses.find((e) => e.id === id);
  if (!existing) throw new Error("Expense not found");
  
  return {
    ...existing,
    ...expenseData,
    updatedAt: new Date().toISOString(),
  };
}

export async function deleteExpense(id: string): Promise<void> {
  await new Promise((resolve) => setTimeout(resolve, 400));
}
