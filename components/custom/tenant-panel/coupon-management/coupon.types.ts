// Coupon Types

export interface Coupon {
  id: string;
  code: string;
  description: string;
  discountType: "percentage" | "flat";
  discountValue: number;
  minOrderValue?: number;
  maxDiscount?: number; // For percentage type - max discount cap
  validFrom: string;
  validUntil: string;
  usageLimit?: number;
  usedCount: number;
  isActive: boolean;
  applicableTests: string[]; // Test IDs
  applicablePackages: string[]; // Package IDs
  createdAt: string;
  updatedAt: string;
}

export interface CouponFormData {
  code: string;
  description: string;
  discountType: "percentage" | "flat";
  discountValue: number;
  minOrderValue?: number;
  maxDiscount?: number;
  validFrom: string;
  validUntil: string;
  usageLimit?: number;
  applicableTests: string[];
  applicablePackages: string[];
}

export interface TestOption {
  id: string;
  title: string;
  price: number;
}

export interface PackageOption {
  id: string;
  title: string;
  price: string;
}
