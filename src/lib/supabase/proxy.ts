import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { getSupabaseConfig } from "./config";

const protectedPaths = ["/dashboard", "/sales", "/products", "/customers", "/reports", "/settings"];
const isProtectedPath = (pathname: string) => protectedPaths.some((path) => pathname === path || pathname.startsWith(`${path}/`));

export async function updateSession(request: NextRequest) {
  const result = getSupabaseConfig();
  const isProtected = isProtectedPath(request.nextUrl.pathname);
  if (!result.configured) {
    if (isProtected) {
      const url = request.nextUrl.clone();
      url.pathname = "/login";
      url.search = "";
      url.searchParams.set("error", "configuration");
      return NextResponse.redirect(url);
    }
    return NextResponse.next({ request });
  }

  let response = NextResponse.next({ request });
  const supabase = createServerClient(result.config.url, result.config.key, { cookies: { getAll: () => request.cookies.getAll(), setAll: (cookies) => { cookies.forEach(({ name, value }) => request.cookies.set(name, value)); response = NextResponse.next({ request }); cookies.forEach(({ name, value, options }) => response.cookies.set(name, value, options)); } } });

  let user = null;
  try {
    const { data } = await supabase.auth.getUser();
    user = data.user;
  } catch {
    user = null;
  }

  if (isProtected && !user) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    url.search = "";
    url.searchParams.set("next", `${request.nextUrl.pathname}${request.nextUrl.search}`);
    return NextResponse.redirect(url);
  }

  if (request.nextUrl.pathname === "/login" && user) {
    const requestedDestination = request.nextUrl.searchParams.get("next");
    const destination = requestedDestination?.startsWith("/") && !requestedDestination.startsWith("//") ? requestedDestination : "/dashboard";
    const url = request.nextUrl.clone();
    url.pathname = destination;
    url.search = "";
    return NextResponse.redirect(url);
  }

  return response;
}
