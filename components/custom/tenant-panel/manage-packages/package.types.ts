export type HealthPackage = {
  id: string;
  image?: string;
  title: string;
  subtitle?: string;
  originalPrice: string;
  discountedPrice: string;
  discountBadge?: string;
  primaryActionText?: string;
  secondaryActionText?: string;
  slug: string;
  testsIncluded?: number;
  parameters?: number;
  testIds?: string[]; // IDs of tests included in this package
  description?: string;
  category?: string;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
};

export type PackageFormData = Omit<HealthPackage, "id" | "createdAt" | "updatedAt">;
