"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LogOut, LoaderCircle } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export function AccountMenu({ email }: { email: string }) {
  const router = useRouter();
  const [isSigningOut, setIsSigningOut] = useState(false); const [error, setError] = useState("");
  const initials = email.slice(0, 2).toUpperCase();
  async function signOut() { setError(""); setIsSigningOut(true); const supabase = createClient(); if (!supabase) { setError("Session settings are unavailable."); setIsSigningOut(false); return; } const { error: signOutError } = await supabase.auth.signOut(); if (signOutError) { setError("Could not sign out. Please try again."); setIsSigningOut(false); return; } router.replace("/login"); router.refresh(); }
  return <div className="profile"><span className="avatar">{initials}</span><span className="profile-copy"><strong>{email}</strong><span>{error || "Signed in"}</span></span><button className="signout" type="button" onClick={signOut} disabled={isSigningOut} aria-label="Sign out">{isSigningOut ? <LoaderCircle className="spin" size={16}/> : <LogOut size={16}/>}</button></div>;
}
