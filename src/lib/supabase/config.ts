import { z } from "zod";

const environmentSchema = z.object({
  NEXT_PUBLIC_SUPABASE_URL: z.string().url().optional(),
  NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: z.string().min(1).optional(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1).optional(),
});

export type SupabaseConfig = { url: string; key: string };
export type SupabaseConfigResult =
  | { configured: true; config: SupabaseConfig }
  | { configured: false; message: string };

/** Uses a publishable key first, with legacy anonymous-key support for existing local setups. */
export function getSupabaseConfig(): SupabaseConfigResult {
  const environment = environmentSchema.safeParse({
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  });
  if (!environment.success || !environment.data.NEXT_PUBLIC_SUPABASE_URL) return { configured: false, message: "Add a valid NEXT_PUBLIC_SUPABASE_URL to your local environment." };
  const key = environment.data.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ?? environment.data.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!key) return { configured: false, message: "Add NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY to your local environment." };
  return { configured: true, config: { url: environment.data.NEXT_PUBLIC_SUPABASE_URL, key } };
}
