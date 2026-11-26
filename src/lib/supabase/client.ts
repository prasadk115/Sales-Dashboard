import { createBrowserClient } from "@supabase/ssr";
import { getSupabaseConfig } from "./config";
export function createClient() { const result = getSupabaseConfig(); if (!result.configured) return null; return createBrowserClient(result.config.url, result.config.key); }
