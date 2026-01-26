import type { DateRange, Granularity, FinancialSummary, TimeSeriesPoint, KPI } from "./financial.types";

// Helper to format date
const toISO = (d: Date) => d.toISOString().split("T")[0];

// Generate dummy daily data for a range
function generateSeries(range: DateRange): TimeSeriesPoint[] {
  const start = new Date(range.from);
  const end = new Date(range.to);
  const data: TimeSeriesPoint[] = [];
  for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
    const day = d.getDay();
    const baseRevenue = 80000 + Math.random() * 60000; // ₹80k - ₹140k
    const weekendFactor = day === 0 ? 0.8 : day === 6 ? 0.9 : 1;
    const revenue = Math.round(baseRevenue * weekendFactor);
    const sales = Math.round(revenue / (1500 + Math.random() * 800));

    const doctorCommission = Math.round(revenue * 0.12);
    const inventoryCost = Math.round(revenue * 0.25);
    const employeeCost = 60000 / 30; // spread monthly employee cost (~₹60k) per day
    const miscCost = Math.round(500 + Math.random() * 2500);

    data.push({
      date: toISO(new Date(d)),
      revenue,
      sales,
      doctorCommission,
      inventoryCost,
      employeeCost: Math.round(employeeCost),
      miscCost,
    });
  }
  return data;
}

function aggregate(series: TimeSeriesPoint[], granularity: Granularity): TimeSeriesPoint[] {
  if (granularity === "day") return series;
  const byKey = new Map<string, TimeSeriesPoint>();
  for (const p of series) {
    const date = new Date(p.date);
    let key = p.date;
    if (granularity === "week") {
      const first = new Date(date);
      const day = (first.getDay() + 6) % 7; // ISO week start Monday
      first.setDate(first.getDate() - day);
      key = toISO(first);
    } else if (granularity === "month") {
      key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-01`;
    }
    const prev = byKey.get(key);
    if (!prev) byKey.set(key, { ...p, date: key });
    else
      byKey.set(key, {
        date: key,
        revenue: prev.revenue + p.revenue,
        sales: prev.sales + p.sales,
        doctorCommission: prev.doctorCommission + p.doctorCommission,
        inventoryCost: prev.inventoryCost + p.inventoryCost,
        employeeCost: prev.employeeCost + p.employeeCost,
        miscCost: prev.miscCost + p.miscCost,
      });
  }
  return Array.from(byKey.values()).sort((a, b) => a.date.localeCompare(b.date));
}

export type FetchFinanceParams = {
  range: DateRange;
  granularity: Granularity;
};

// Mock API – replace with real fetch later
export async function fetchFinancialSummary({ range, granularity }: FetchFinanceParams): Promise<FinancialSummary> {
  // Simulate network latency
  await new Promise((r) => setTimeout(r, 200));

  const daily = generateSeries(range);
  const series = aggregate(daily, granularity);

  const totalRevenue = series.reduce((s, p) => s + p.revenue, 0);
  const totalSales = series.reduce((s, p) => s + p.sales, 0);
  const totalDoctorCommission = series.reduce((s, p) => s + p.doctorCommission, 0);
  const totalInventory = series.reduce((s, p) => s + p.inventoryCost, 0);
  const totalEmployee = series.reduce((s, p) => s + p.employeeCost, 0);
  const totalMisc = series.reduce((s, p) => s + p.miscCost, 0);
  const profit = totalRevenue - (totalDoctorCommission + totalInventory + totalEmployee + totalMisc);

  const kpis: KPI[] = [
    { label: "Total Revenue", key: "revenue", value: Math.round(totalRevenue), delta: 5.4 },
    { label: "Total Sales", key: "sales", value: totalSales, delta: 3.1 },
    { label: "Doctor Commission", key: "doctorCommission", value: Math.round(totalDoctorCommission), delta: -1.2 },
    { label: "Inventory Cost", key: "inventoryCost", value: Math.round(totalInventory), delta: 2.7 },
    { label: "Employee Cost", key: "employeeCost", value: Math.round(totalEmployee), delta: 0.8 },
    { label: "Misc. Cost", key: "miscCost", value: Math.round(totalMisc), delta: 1.1 },
    { label: "Profit", key: "profit", value: Math.round(profit), delta: 4.6 },
  ];

  const byCategory = [
    { category: "Doctor Commission", amount: totalDoctorCommission },
    { category: "Inventory", amount: totalInventory },
    { category: "Employees", amount: totalEmployee },
    { category: "Misc", amount: totalMisc },
  ];

  return { kpis, series, byCategory };
}

export function defaultRange(days = 30): DateRange {
  const to = new Date();
  const from = new Date();
  from.setDate(to.getDate() - (days - 1));
  return { from: toISO(from), to: toISO(to) };
}
