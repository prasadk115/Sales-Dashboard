import { format } from "date-fns";
import { createClient } from "@/lib/supabase/server";
import { salesAccessMessage, verifySalesAccess } from "@/lib/queries/sales-access";
import type { Category, DashboardData, DashboardResult, Kpi, Transaction } from "@/types/dashboard";

export const kpis: Kpi[] = [
  { label: "Total revenue", value: 2486000, comparison: "vs. last month", change: 12.8, kind: "currency" },
  { label: "Orders", value: 1847, comparison: "vs. last month", change: 8.4, kind: "number" },
  { label: "Average order value", value: 1346, comparison: "vs. last month", change: 3.2, kind: "currency" },
  { label: "Conversion rate", value: 4.86, comparison: "vs. last month", change: 0.6, kind: "percent" }
];
export const revenueData = [
  { month: "Apr", revenue: 102000 }, { month: "May", revenue: 141000 }, { month: "Jun", revenue: 128000 }, { month: "Jul", revenue: 184000 }, { month: "Aug", revenue: 165000 }, { month: "Sep", revenue: 214000 }, { month: "Oct", revenue: 197000 }, { month: "Nov", revenue: 238000 }, { month: "Dec", revenue: 226000 }, { month: "Jan", revenue: 284000 }, { month: "Feb", revenue: 269000 }, { month: "Mar", revenue: 321000 }
];
export const categories: Category[] = [{ name: "Enterprise", value: 44, color: "#4f46e5" }, { name: "Growth", value: 31, color: "#818cf8" }, { name: "Starter", value: 17, color: "#c7d2fe" }, { name: "Services", value: 8, color: "#e2e8f0" }];
export const transactions: Transaction[] = [
  { id: "ORD-2084", customer: "Aarav Mehta", company: "Northstar Labs", initials: "AM", date: "24 Nov, 2026", amount: 18600, status: "Paid" },
  { id: "ORD-2083", customer: "Maya Iyer", company: "Veridian Health", initials: "MI", date: "24 Nov, 2026", amount: 7400, status: "Paid" },
  { id: "ORD-2082", customer: "Karan Shah", company: "Sable & Co.", initials: "KS", date: "23 Nov, 2026", amount: 12800, status: "Pending" },
  { id: "ORD-2081", customer: "Nisha Rao", company: "Forma Studio", initials: "NR", date: "22 Nov, 2026", amount: 5200, status: "Paid" }
];

const previewData: DashboardData = { kpis, revenueData, categories, transactions };
const categoryColors = ["#4f46e5", "#818cf8", "#c7d2fe", "#e2e8f0"];
type OrderRow = { id: string; order_number: string; status: string; total_amount: number | string; ordered_at: string; customers: { name: string; company_name: string | null } | null; order_items: { quantity: number; unit_price: number | string; products: { name: string } | null }[] | null };

const toNumber = (value: number | string) => typeof value === "number" ? value : Number(value);
const initials = (name: string) => name.split(" ").map((part) => part[0]).join("").slice(0, 2).toUpperCase();
const status = (value: string): Transaction["status"] => value === "paid" ? "Paid" : value === "refunded" ? "Refunded" : "Pending";
export async function getDashboardData(): Promise<DashboardResult> {
  const client = await createClient();
  if (!client) return { source: "preview", message: "Preview data is shown because Supabase is not configured.", data: previewData };

  try {
    const { data: { user }, error: authError } = await client.auth.getUser();
    if (authError || !user) return { source: "preview", message: "Preview data is shown because signing in is required to read sales data.", data: previewData };

    const access = await verifySalesAccess(client);
    if (!access.ok) return { source: "preview", message: salesAccessMessage(access.failure), data: previewData };

    const [ordersResult, customersResult, productsResult] = await Promise.all([
      client.from("orders").select("id, order_number, status, total_amount, ordered_at, customers(name, company_name), order_items(quantity, unit_price, products(name))").order("ordered_at", { ascending: false }).limit(1000),
      client.from("customers").select("id", { count: "exact", head: true }),
      client.from("products").select("id", { count: "exact", head: true }),
    ]);
    if (ordersResult.error || customersResult.error || productsResult.error) return { source: "preview", message: "Preview data is shown because the live sales query is unavailable.", data: previewData };

    const orders = ordersResult.data as unknown as OrderRow[];
    const paidOrders = orders.filter((order) => order.status === "paid");
    const revenue = paidOrders.reduce((sum, order) => sum + toNumber(order.total_amount), 0);
    const monthlyRevenue = new Map<string, number>();
    paidOrders.forEach((order) => { const month = format(new Date(order.ordered_at), "MMM"); monthlyRevenue.set(month, (monthlyRevenue.get(month) ?? 0) + toNumber(order.total_amount)); });
    const productRevenue = new Map<string, number>();
    paidOrders.forEach((order) => order.order_items?.forEach((item) => { const name = item.products?.name ?? "Uncategorised"; productRevenue.set(name, (productRevenue.get(name) ?? 0) + item.quantity * toNumber(item.unit_price)); }));
    const totalProductRevenue = [...productRevenue.values()].reduce((sum, value) => sum + value, 0);
    const liveCategories: Category[] = [...productRevenue.entries()].map(([name, value], index) => ({ name, value: totalProductRevenue ? Math.round((value / totalProductRevenue) * 100) : 0, color: categoryColors[index % categoryColors.length] }));
    const liveData: DashboardData = {
      kpis: [
        { label: "Total sales", value: revenue, comparison: "from paid orders", change: 0, kind: "currency" },
        { label: "Orders", value: orders.length, comparison: "from live data", change: 0, kind: "number" },
        { label: "Customers", value: customersResult.count ?? 0, comparison: "from live data", change: 0, kind: "number" },
        { label: "Products", value: productsResult.count ?? 0, comparison: "from live data", change: 0, kind: "number" },
      ],
      revenueData: [...monthlyRevenue.entries()].map(([month, amount]) => ({ month, revenue: amount })).reverse(),
      categories: liveCategories,
      transactions: orders.slice(0, 8).map((order) => { const customer = order.customers?.name ?? "Unknown customer"; return { id: order.order_number, customer, company: order.customers?.company_name ?? "No company", initials: initials(customer), date: format(new Date(order.ordered_at), "dd MMM, yyyy"), amount: toNumber(order.total_amount), status: status(order.status) }; }),
    };
    return { source: "live", message: orders.length ? "Live data loaded from Supabase." : "Connected to Supabase. No sales orders are available yet.", data: liveData };
  } catch {
    return { source: "preview", message: "Preview data is shown because Supabase could not be reached.", data: previewData };
  }
}
