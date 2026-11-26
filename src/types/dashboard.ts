export type Kpi = { label: string; value: number; comparison: string; change: number; kind: "currency" | "number" | "percent" };
export type Transaction = { id: string; customer: string; company: string; initials: string; date: string; amount: number; status: "Paid" | "Pending" | "Refunded" };
export type Category = { name: string; value: number; color: string };
export type DashboardData = { kpis: Kpi[]; revenueData: { month: string; revenue: number }[]; categories: Category[]; transactions: Transaction[] };
export type DashboardSource = "live" | "preview";
export type DashboardResult = { source: DashboardSource; message: string; data: DashboardData };
