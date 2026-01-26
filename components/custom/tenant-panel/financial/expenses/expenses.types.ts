export type ExpenseCategory = 
  | "Inventory" 
  | "Salary" 
  | "Rent" 
  | "Utilities" 
  | "Maintenance" 
  | "Marketing" 
  | "Doctor Commission" 
  | "Equipment"
  | "Software"
  | "Other";

export type PaymentMethod = "Cash" | "UPI" | "Bank Transfer" | "Card" | "Cheque";

export type ExpenseStatus = "Paid" | "Pending" | "Overdue";

export interface Expense {
  id: string;
  title: string;
  category: ExpenseCategory;
  amount: number;
  date: string; // ISO Date YYYY-MM-DD
  paymentMethod: PaymentMethod;
  status: ExpenseStatus;
  vendorName?: string;
  referenceNumber?: string;
  description?: string;
  receiptUrl?: string; // For attached image
  createdAt: string;
  updatedAt: string;
}

export type ExpenseFormData = Omit<Expense, "id" | "createdAt" | "updatedAt">;
