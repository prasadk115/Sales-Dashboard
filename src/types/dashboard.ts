export type Kpi = { label: string; value: number; comparison: string; change: number; kind: "currency" | "number" | "percent" };
export type Transaction = { id: string; customer: string; company: string; initials: string; date: string; amount: number; status: "Paid" | "Pending" | "Refunded" };
