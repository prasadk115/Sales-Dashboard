import type { SupabaseClient } from "@supabase/supabase-js";

type AccessFailure = "schema-missing" | "permission-denied" | "query-failed";
export type SalesAccessResult = { ok: true } | { ok: false; failure: AccessFailure };

/**
 * Verifies the exact four tables used by the protected sales workspace.
 * Each request is deliberately minimal and returns no customer or sales data.
 */
export async function verifySalesAccess(client: SupabaseClient): Promise<SalesAccessResult> {
  const results = await Promise.all([
    client.from("orders").select("id").limit(1),
    client.from("order_items").select("id").limit(1),
    client.from("customers").select("id").limit(1),
    client.from("products").select("id").limit(1),
  ]);
  const error = results.map((result) => result.error).find((value) => value !== null);
  if (!error) return { ok: true };
  if (error.code === "42P01" || error.code === "PGRST205") return { ok: false, failure: "schema-missing" };
  if (error.code === "42501") return { ok: false, failure: "permission-denied" };
  return { ok: false, failure: "query-failed" };
}

export function salesAccessMessage(failure: AccessFailure) {
  if (failure === "schema-missing") return "Preview data is shown because the sales schema has not been applied yet.";
  if (failure === "permission-denied") return "Preview data is shown because this account does not have database read access.";
  return "Preview data is shown because the live sales tables could not be queried.";
}
