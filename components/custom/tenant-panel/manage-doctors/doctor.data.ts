import type { Doctor, CommissionLog } from "./doctor.types";

export const mockDoctors: Doctor[] = [
  {
    id: "doc-1",
    referCode: "EJK-DR-2025-001",
    name: "Dr. Rajesh Kumar",
    email: "rajesh.kumar@hospital.com",
    phone: "+91 98765 43210",
    specialization: "Cardiologist",
    qualification: "MD, DM (Cardiology)",
    registrationNumber: "MCI-12345",
    hospital: "Apollo Hospital",
    address: "Sector 21, Main Road",
    city: "Delhi",
    state: "Delhi",
    pincode: "110001",
    commissionRate: 15,
    commissionType: "percentage",
    totalReferrals: 145,
    totalCommissionEarned: 87500,
    isActive: true,
    joinedDate: "2024-06-15",
    lastReferralDate: "2026-01-08",
    createdAt: "2024-06-15",
    updatedAt: "2026-01-09",
  },
  {
    id: "doc-2",
    referCode: "EJK-DR-2025-002",
    name: "Dr. Priya Sharma",
    email: "priya.sharma@clinic.com",
    phone: "+91 98765 43211",
    specialization: "General Physician",
    qualification: "MBBS, MD (Medicine)",
    registrationNumber: "MCI-23456",
    hospital: "Max Healthcare",
    address: "Park Street, Block B",
    city: "Mumbai",
    state: "Maharashtra",
    pincode: "400001",
    commissionRate: 12,
    commissionType: "percentage",
    totalReferrals: 298,
    totalCommissionEarned: 156000,
    isActive: true,
    joinedDate: "2024-08-20",
    lastReferralDate: "2026-01-10",
    createdAt: "2024-08-20",
    updatedAt: "2026-01-10",
  },
  {
    id: "doc-3",
    referCode: "EJK-DR-2025-003",
    name: "Dr. Amit Patel",
    email: "amit.patel@hospital.com",
    phone: "+91 98765 43212",
    specialization: "Endocrinologist",
    qualification: "MD, DM (Endocrinology)",
    registrationNumber: "MCI-34567",
    hospital: "Fortis Hospital",
    address: "Central Avenue",
    city: "Bangalore",
    state: "Karnataka",
    pincode: "560001",
    commissionRate: 200,
    commissionType: "fixed",
    fixedAmount: 200,
    totalReferrals: 67,
    totalCommissionEarned: 13400,
    isActive: true,
    joinedDate: "2024-09-10",
    lastReferralDate: "2026-01-07",
    createdAt: "2024-09-10",
    updatedAt: "2026-01-08",
  },
  {
    id: "doc-4",
    referCode: "EJK-DR-2025-004",
    name: "Dr. Sunita Verma",
    email: "sunita.verma@clinic.com",
    phone: "+91 98765 43213",
    specialization: "Gynecologist",
    qualification: "MBBS, MS (Obs & Gynae)",
    registrationNumber: "MCI-45678",
    hospital: "Medanta Hospital",
    address: "Green Park Extension",
    city: "Gurgaon",
    state: "Haryana",
    pincode: "122001",
    commissionRate: 18,
    commissionType: "percentage",
    totalReferrals: 189,
    totalCommissionEarned: 112000,
    isActive: true,
    joinedDate: "2024-07-05",
    lastReferralDate: "2026-01-09",
    createdAt: "2024-07-05",
    updatedAt: "2026-01-10",
  },
  {
    id: "doc-5",
    referCode: "EJK-DR-2025-005",
    name: "Dr. Anil Mehta",
    email: "anil.mehta@hospital.com",
    phone: "+91 98765 43214",
    specialization: "Orthopedic",
    qualification: "MBBS, MS (Orthopedics)",
    registrationNumber: "MCI-56789",
    hospital: "AIIMS",
    address: "Ansari Nagar",
    city: "Delhi",
    state: "Delhi",
    pincode: "110029",
    commissionRate: 10,
    commissionType: "percentage",
    totalReferrals: 92,
    totalCommissionEarned: 45000,
    isActive: true,
    joinedDate: "2024-10-15",
    lastReferralDate: "2026-01-06",
    createdAt: "2024-10-15",
    updatedAt: "2026-01-07",
  },
  {
    id: "doc-6",
    referCode: "EJK-DR-2025-006",
    name: "Dr. Kavita Singh",
    email: "kavita.singh@clinic.com",
    phone: "+91 98765 43215",
    specialization: "Dermatologist",
    qualification: "MBBS, MD (Dermatology)",
    registrationNumber: "MCI-67890",
    hospital: "Columbia Asia Hospital",
    address: "Whitefield Main Road",
    city: "Bangalore",
    state: "Karnataka",
    pincode: "560066",
    commissionRate: 150,
    commissionType: "fixed",
    fixedAmount: 150,
    totalReferrals: 124,
    totalCommissionEarned: 18600,
    isActive: true,
    joinedDate: "2024-11-01",
    lastReferralDate: "2026-01-10",
    createdAt: "2024-11-01",
    updatedAt: "2026-01-10",
  },
  {
    id: "doc-7",
    referCode: "EJK-DR-2025-007",
    name: "Dr. Ramesh Iyer",
    email: "ramesh.iyer@hospital.com",
    phone: "+91 98765 43216",
    specialization: "Neurologist",
    qualification: "MD, DM (Neurology)",
    registrationNumber: "MCI-78901",
    hospital: "Manipal Hospital",
    address: "HAL Airport Road",
    city: "Bangalore",
    state: "Karnataka",
    pincode: "560017",
    commissionRate: 20,
    commissionType: "percentage",
    totalReferrals: 56,
    totalCommissionEarned: 67000,
    isActive: false,
    joinedDate: "2024-05-20",
    lastReferralDate: "2025-12-15",
    createdAt: "2024-05-20",
    updatedAt: "2025-12-20",
  },
];

export const mockCommissionLogs: CommissionLog[] = [
  {
    id: "log-1",
    doctorId: "doc-1",
    doctorName: "Dr. Rajesh Kumar",
    referCode: "EJK-DR-2025-001",
    orderId: "ORD-2026-001",
    patientName: "Ravi Sharma",
    orderAmount: 3500,
    commissionAmount: 525,
    commissionRate: 15,
    date: "2026-01-08",
    status: "paid",
  },
  {
    id: "log-2",
    doctorId: "doc-2",
    doctorName: "Dr. Priya Sharma",
    referCode: "EJK-DR-2025-002",
    orderId: "ORD-2026-002",
    patientName: "Anita Desai",
    orderAmount: 2500,
    commissionAmount: 300,
    commissionRate: 12,
    date: "2026-01-10",
    status: "pending",
  },
];

// Mock API functions
export async function fetchDoctors(): Promise<Doctor[]> {
  await new Promise((resolve) => setTimeout(resolve, 500));
  return mockDoctors;
}

export async function createDoctor(doctorData: Omit<Doctor, "id" | "referCode" | "totalReferrals" | "totalCommissionEarned" | "lastReferralDate" | "createdAt" | "updatedAt">): Promise<Doctor> {
  await new Promise((resolve) => setTimeout(resolve, 300));
  
  // Generate unique refer code (this would come from backend in production)
  const year = new Date().getFullYear();
  const count = mockDoctors.length + 1;
  const referCode = `EJK-DR-${year}-${String(count).padStart(3, "0")}`;
  
  const newDoctor: Doctor = {
    ...doctorData,
    id: `doc-${Date.now()}`,
    referCode,
    totalReferrals: 0,
    totalCommissionEarned: 0,
    joinedDate: new Date().toISOString().split("T")[0],
    createdAt: new Date().toISOString().split("T")[0],
    updatedAt: new Date().toISOString().split("T")[0],
  };
  
  return newDoctor;
}

export async function updateDoctor(id: string, doctorData: Partial<Doctor>): Promise<Doctor> {
  await new Promise((resolve) => setTimeout(resolve, 300));
  const existingDoctor = mockDoctors.find((d) => d.id === id);
  if (!existingDoctor) throw new Error("Doctor not found");
  
  return {
    ...existingDoctor,
    ...doctorData,
    updatedAt: new Date().toISOString().split("T")[0],
  };
}

export async function deleteDoctor(id: string): Promise<void> {
  await new Promise((resolve) => setTimeout(resolve, 300));
}

export async function fetchCommissionLogs(doctorId?: string): Promise<CommissionLog[]> {
  await new Promise((resolve) => setTimeout(resolve, 300));
  if (doctorId) {
    return mockCommissionLogs.filter((log) => log.doctorId === doctorId);
  }
  return mockCommissionLogs;
}
