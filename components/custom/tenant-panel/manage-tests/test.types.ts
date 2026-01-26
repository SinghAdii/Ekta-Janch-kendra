export type PriceInfo = {
  original?: number;
  final: number;
  currency?: string;
};

export type Test = {
  id: string;
  title: string;
  image: string;
  price: PriceInfo;
  ctaText?: string;
  iconType?: string;
  slug: string;
  category?: string;
  description?: string;
  turnaroundTime?: string;
  sampleType?: string;
  preparationRequired?: boolean;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
};

export type TestFormData = Omit<Test, "id" | "createdAt" | "updatedAt">;
