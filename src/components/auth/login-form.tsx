"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, Eye, EyeOff, LoaderCircle } from "lucide-react";
import { z } from "zod";
import { createClient } from "@/lib/supabase/client";

const credentialsSchema = z.object({ email: z.string().trim().email("Enter a valid email address."), password: z.string().min(1, "Enter your password.") });
type LoginFormProps = { nextPath: string; configurationError: boolean };

export function LoginForm({ nextPath, configurationError }: LoginFormProps) {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState(configurationError ? "Supabase is not configured. Add the public project URL and publishable key locally." : "");

  async function handleSubmit(formData: FormData) {
    setMessage("");
    const credentials = credentialsSchema.safeParse({ email: formData.get("email"), password: formData.get("password") });
    if (!credentials.success) { setMessage(credentials.error.issues[0]?.message ?? "Check your sign in details."); return; }
    const supabase = createClient();
    if (!supabase) { setMessage("Supabase is not configured. Add the public project URL and publishable key locally."); return; }
    setIsSubmitting(true);
    try { const { error } = await supabase.auth.signInWithPassword(credentials.data); if (error) { setMessage(error.message); setIsSubmitting(false); return; } router.replace(nextPath); router.refresh(); } catch { setMessage("Sign in could not be completed. Check your connection and try again."); setIsSubmitting(false); }
  }

  return <form action={handleSubmit} className="auth-form"><div className="form-field"><label htmlFor="email">Email address</label><input id="email" name="email" type="email" autoComplete="email" placeholder="you@company.com" disabled={isSubmitting} required /></div><div className="form-field"><label htmlFor="password">Password</label><span className="password-field"><input id="password" name="password" type={showPassword ? "text" : "password"} autoComplete="current-password" placeholder="Enter your password" disabled={isSubmitting} required /><button type="button" className="password-toggle" onClick={() => setShowPassword((value) => !value)} aria-label={showPassword ? "Hide password" : "Show password"}>{showPassword ? <EyeOff size={17}/> : <Eye size={17}/>}</button></span></div>{message ? <p className="auth-message" role="alert">{message}</p> : null}<button className="auth-submit" type="submit" disabled={isSubmitting || configurationError}>{isSubmitting ? <><LoaderCircle className="spin" size={17}/> Signing in</> : <>Sign in <ArrowRight size={17}/></>}</button></form>;
}
