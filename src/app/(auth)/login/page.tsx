import { redirect } from "next/navigation";
import { Layers3, LockKeyhole } from "lucide-react";
import { LoginForm } from "@/components/auth/login-form";
import { createClient } from "@/lib/supabase/server";
type LoginPageProps = { searchParams: Promise<{ next?: string; error?: string }> };
const safeNextPath = (path?: string) => path?.startsWith("/") && !path.startsWith("//") ? path : "/dashboard";
export default async function LoginPage({ searchParams }: LoginPageProps) { const params = await searchParams; const nextPath = safeNextPath(params.next); const supabase = await createClient(); if (supabase) { const { data: { user } } = await supabase.auth.getUser(); if (user) redirect(nextPath); } return <main className="auth-page"><section className="auth-panel" aria-labelledby="login-title"><div className="auth-brand"><span className="brand-mark"><Layers3 size={18}/></span><span>Revenue Studio</span></div><div className="auth-copy"><span className="auth-icon"><LockKeyhole size={19}/></span><h1 id="login-title" className="heading-6">Sign in to your workspace</h1><p className="body-6">Use your Supabase account to access protected sales data.</p></div><LoginForm nextPath={nextPath} configurationError={params.error === "configuration" || !supabase}/><p className="auth-footer">Your session is protected by Supabase authentication and row level security.</p></section></main>; }
