import { createClient } from "@/lib/supabase/server";

type QueryState = "ready" | "authentication-required" | "unavailable";
export type ProductRecord = { id: string; name: string; sku: string; unit_price: number | string; active: boolean };
export type CustomerRecord = { id: string; name: string; company_name: string | null; email: string };
export type CatalogResult<T> = { state: QueryState; message: string; data: T[] };

async function getReadClient(): Promise<{ state: Exclude<QueryState, "ready">; message: string } | { state: "ready"; client: NonNullable<Awaited<ReturnType<typeof createClient>>> }> {
  const client = await createClient();
  if (!client) return { state: "unavailable", message: "Supabase is not configured." };
  const { data: { user }, error } = await client.auth.getUser();
  if (error || !user) return { state: "authentication-required", message: "Sign in is required to view live sales data." };
  return { state: "ready", client };
}

export async function getProducts(): Promise<CatalogResult<ProductRecord>> {
  const result = await getReadClient();
  if (result.state !== "ready") return { state: result.state, message: result.message, data: [] };
  const { data, error } = await result.client.from("products").select("id, name, sku, unit_price, active").order("name");
  if (error) return { state: "unavailable", message: "Products could not be loaded from Supabase.", data: [] };
  return { state: "ready", message: data.length ? "Live product data from Supabase." : "No products are available yet.", data: data as ProductRecord[] };
}

export async function getCustomers(): Promise<CatalogResult<CustomerRecord>> {
  const result = await getReadClient();
  if (result.state !== "ready") return { state: result.state, message: result.message, data: [] };
  const { data, error } = await result.client.from("customers").select("id, name, company_name, email").order("name");
  if (error) return { state: "unavailable", message: "Customers could not be loaded from Supabase.", data: [] };
  return { state: "ready", message: data.length ? "Live customer data from Supabase." : "No customers are available yet.", data: data as CustomerRecord[] };
}
