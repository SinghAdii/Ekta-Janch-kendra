export type Granularity = "day" | "week" | "month";

export interface DateRange {
  from: string; // ISO yyyy-mm-dd
  to: string;   // ISO yyyy-mm-dd
}

export interface KPI {
  label: string;
  key:
    | "revenue"
    | "sales"
    | "doctorCommission"
    | "inventoryCost"
    | "employeeCost"
    | "miscCost"
    | "profit";
  value: number;
  delta?: number; // percentage change vs previous period
}

export interface TimeSeriesPoint {
  date: string; // ISO
  revenue: number;
  sales: number; // count of orders
  doctorCommission: number;
  inventoryCost: number;
  employeeCost: number;
  miscCost: number;
}

export interface FinancialSummary {
  kpis: KPI[];
  series: TimeSeriesPoint[];
  byCategory: Array<{ category: string; amount: number }>;
}
