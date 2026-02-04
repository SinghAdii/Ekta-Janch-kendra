import type { Coupon, TestOption, PackageOption } from "./coupon.types";

// Mock coupon data
export const mockCoupons: Coupon[] = [
  {
    id: "coupon-1",
    code: "SAVE20",
    description: "Get 20% off on all blood tests",
    discountType: "percentage",
    discountValue: 20,
    maxDiscount: 500,
    minOrderValue: 500,
    validFrom: "2026-01-01",
    validUntil: "2026-03-31",
    usageLimit: 100,
    usedCount: 45,
    isActive: true,
    applicableTests: ["test-1", "test-2", "test-4"],
    applicablePackages: [],
    createdAt: "2026-01-01",
    updatedAt: "2026-01-15",
  },
  {
    id: "coupon-2",
    code: "FLAT200",
    description: "Flat ₹200 off on health packages",
    discountType: "flat",
    discountValue: 200,
    minOrderValue: 1000,
    validFrom: "2026-01-15",
    validUntil: "2026-02-28",
    usageLimit: 50,
    usedCount: 23,
    isActive: true,
    applicableTests: [],
    applicablePackages: ["pkg-1", "pkg-2", "pkg-3"],
    createdAt: "2026-01-15",
    updatedAt: "2026-01-20",
  },
  {
    id: "coupon-3",
    code: "NEWUSER15",
    description: "15% off for new users on all tests",
    discountType: "percentage",
    discountValue: 15,
    maxDiscount: 300,
    validFrom: "2026-02-01",
    validUntil: "2026-04-30",
    usedCount: 12,
    isActive: true,
    applicableTests: ["test-1", "test-2", "test-3", "test-4", "test-5"],
    applicablePackages: ["pkg-1", "pkg-2"],
    createdAt: "2026-02-01",
    updatedAt: "2026-02-01",
  },
  {
    id: "coupon-4",
    code: "WINTER50",
    description: "Winter special - Flat ₹50 off",
    discountType: "flat",
    discountValue: 50,
    validFrom: "2026-01-01",
    validUntil: "2026-01-31",
    usedCount: 89,
    isActive: false,
    applicableTests: ["test-1", "test-3"],
    applicablePackages: [],
    createdAt: "2025-12-15",
    updatedAt: "2026-02-01",
  },
];

// Mock test options for selection
export const testOptions: TestOption[] = [
  { id: "test-1", title: "Complete Blood Count (CBC)", price: 399 },
  { id: "test-2", title: "Lipid Profile", price: 599 },
  { id: "test-3", title: "Thyroid Function Test (TFT)", price: 450 },
  { id: "test-4", title: "HbA1c (Diabetes Test)", price: 499 },
  { id: "test-5", title: "Liver Function Test (LFT)", price: 549 },
  { id: "test-6", title: "Kidney Function Test (KFT)", price: 649 },
  { id: "test-7", title: "Vitamin D Test", price: 899 },
  { id: "test-8", title: "Vitamin B12 Test", price: 799 },
];

// Mock package options for selection
export const packageOptions: PackageOption[] = [
  { id: "pkg-1", title: "Basic Health Checkup", price: "₹1,799" },
  { id: "pkg-2", title: "Advanced Full Body Checkup", price: "₹3,999" },
  { id: "pkg-3", title: "Diabetes Care Package", price: "₹1,499" },
  { id: "pkg-4", title: "Heart Health Package", price: "₹2,599" },
  { id: "pkg-5", title: "Women's Health Package", price: "₹2,999" },
  { id: "pkg-6", title: "Senior Citizen Package", price: "₹4,499" },
];

// Utility functions
export function getCouponStats(coupons: Coupon[]) {
  return {
    total: coupons.length,
    active: coupons.filter((c) => c.isActive).length,
    inactive: coupons.filter((c) => !c.isActive).length,
    expired: coupons.filter((c) => new Date(c.validUntil) < new Date()).length,
    totalUsage: coupons.reduce((sum, c) => sum + c.usedCount, 0),
  };
}

export function isExpired(validUntil: string): boolean {
  return new Date(validUntil) < new Date();
}

export function formatDiscountValue(coupon: Coupon): string {
  if (coupon.discountType === "percentage") {
    return `${coupon.discountValue}%`;
  }
  return `₹${coupon.discountValue}`;
}
