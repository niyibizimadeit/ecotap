// ─────────────────────────────────────────────────────────────────────────────
// Next.js middleware — session refresh + role-based route protection.
// Runs on every matched request before the page/API handler.
// NOTE: This file must be at src/middleware.ts for Next.js to execute it.
// ─────────────────────────────────────────────────────────────────────────────

import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import type { UserRole, UserStatus } from "@/types";
import { DASHBOARD_ROUTE } from "@/constants";

// ── Route patterns ───────────────────────────────────────────────────────────

const AUTH_PAGES = ["/login", "/register", "/org/login", "/org/register", "/pending", "/verify"];
const PUBLIC_CARD_PATTERNS = [/^\/[^/]+\/[^/]+$/, /^\/[^/]+$/]; // /slug and /slug/employee

function isPublicPath(pathname: string): boolean {
  // Home page, auth pages, api routes, static assets
  if (pathname === "/") return true;

  // Dashboard routes are NEVER public — check this BEFORE the dot-file
  // check below, otherwise /dashboard/foo.bar would bypass auth entirely.
  if (pathname.startsWith("/dashboard")) return false;

  if (AUTH_PAGES.some((p) => pathname.startsWith(p))) return true;
  if (pathname.startsWith("/api/")) return true;
  if (pathname.startsWith("/dev/")) return true;
  if (pathname.startsWith("/_next/")) return true;
  if (pathname.includes(".")) return true; // Static files

  // Public card pages: /username or /company/employee
  if (PUBLIC_CARD_PATTERNS.some((p) => p.test(pathname))) return true;

  // Default: protect unknown routes
  return false;
}

// ── Role-based dashboard access ──────────────────────────────────────────────

function isAccessAllowed(pathname: string, role: UserRole): boolean {
  if (pathname.startsWith("/dashboard/admin")) {
    return role === "super_admin" || role === "country_rep";
  }
  if (pathname.startsWith("/dashboard/company")) {
    return role === "company_admin" || role === "super_admin";
  }
  if (pathname.startsWith("/dashboard/employee")) {
    // Also allow company_admin as a fallback — if they have no company linked
    // the company layout shows an inline message instead of redirect-looping.
    return role === "employee" || role === "individual" || role === "company_admin";
  }
  return true;
}

// ── Middleware — session refresh + role-based route protection ───────────────

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip middleware for public and static paths
  if (isPublicPath(pathname)) {
    return NextResponse.next();
  }

  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          for (const { name, value, options } of cookiesToSet) {
            request.cookies.set(name, value);
          }
          supabaseResponse = NextResponse.next({ request });
          for (const { name, value, options } of cookiesToSet) {
            supabaseResponse.cookies.set(name, value, options);
          }
        },
      },
    }
  );

  // Refresh session
  const { data: { user } } = await supabase.auth.getUser();

  // ── No session → redirect to login ────────────────────────────────────
  if (!user) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // ── Fetch user role and status from profiles ──────────────────────────
  const { data: profile } = await supabase
    .from("profiles")
    .select("role, status")
    .eq("id", user.id)
    .single();

  const role = (profile?.role as UserRole) ?? "individual";
  const status = (profile?.status as UserStatus) ?? "pending";

  // ── Pending users → redirect to pending page ──────────────────────────
  if (status === "pending" && !pathname.startsWith("/pending")) {
    return NextResponse.redirect(new URL("/pending", request.url));
  }

  // ── Suspended users → sign out + redirect to login ─────────────────────
  if (status === "suspended") {
    await supabase.auth.signOut();
    // signOut updated supabaseResponse's cookies via setAll.
    // Redirect using supabaseResponse so the cleared cookies are sent.
    const loginUrl = new URL("/login", request.url);
    return NextResponse.redirect(loginUrl, {
      headers: supabaseResponse.headers,
    });
  }

  // ── Role-based access check ───────────────────────────────────────────
  if (!isAccessAllowed(pathname, role)) {
    // Redirect to their correct dashboard
    const correctDashboard = DASHBOARD_ROUTE[role];
    return NextResponse.redirect(new URL(correctDashboard, request.url));
  }

  return supabaseResponse;
}

// ── Matcher: only run on dashboard routes ────────────────────────────────────

export const config = {
  matcher: ["/dashboard/:path*"],
};
