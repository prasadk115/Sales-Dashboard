import type { Kpi, Transaction } from "@/types/dashboard";

export const kpis: Kpi[] = [
  { label: "Total revenue", value: 2486000, comparison: "vs. last month", change: 12.8, kind: "currency" },
  { label: "Orders", value: 1847, comparison: "vs. last month", change: 8.4, kind: "number" },
  { label: "Average order value", value: 1346, comparison: "vs. last month", change: 3.2, kind: "currency" },
  { label: "Conversion rate", value: 4.86, comparison: "vs. last month", change: 0.6, kind: "percent" }
];
export const revenueData = [
  { month: "Apr", revenue: 102000 }, { month: "May", revenue: 141000 }, { month: "Jun", revenue: 128000 }, { month: "Jul", revenue: 184000 }, { month: "Aug", revenue: 165000 }, { month: "Sep", revenue: 214000 }, { month: "Oct", revenue: 197000 }, { month: "Nov", revenue: 238000 }, { month: "Dec", revenue: 226000 }, { month: "Jan", revenue: 284000 }, { month: "Feb", revenue: 269000 }, { month: "Mar", revenue: 321000 }
];
export const categories = [{ name: "Enterprise", value: 44, color: "#4f46e5" }, { name: "Growth", value: 31, color: "#818cf8" }, { name: "Starter", value: 17, color: "#c7d2fe" }, { name: "Services", value: 8, color: "#e2e8f0" }];
export const transactions: Transaction[] = [
  { id: "ORD-2084", customer: "Aarav Mehta", company: "Northstar Labs", initials: "AM", date: "24 Nov, 2026", amount: 18600, status: "Paid" },
  { id: "ORD-2083", customer: "Maya Iyer", company: "Veridian Health", initials: "MI", date: "24 Nov, 2026", amount: 7400, status: "Paid" },
  { id: "ORD-2082", customer: "Karan Shah", company: "Sable & Co.", initials: "KS", date: "23 Nov, 2026", amount: 12800, status: "Pending" },
  { id: "ORD-2081", customer: "Nisha Rao", company: "Forma Studio", initials: "NR", date: "22 Nov, 2026", amount: 5200, status: "Paid" }
];
