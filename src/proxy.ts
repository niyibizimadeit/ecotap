// ─────────────────────────────────────────────────────────────────────────────
// Next.js middleware — session refresh + role-based route protection.
// Runs on every matched request before the page/API handler.
// ─────────────────────────────────────────────────────────────────────────────

import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import type { UserRole, UserStatus } from "@/types";

// ── Route patterns ───────────────────────────────────────────────────────────

const AUTH_PAGES = ["/login", "/register", "/org/login", "/org/register", "/pending"];
const PUBLIC_CARD_PATTERNS = [/^\/[^/]+\/[^/]+$/, /^\/[^/]+$/]; // /slug and /slug/employee

function isPublicPath(pathname: string): boolean {
  // Home page, auth pages, api routes, static assets
  if (pathname === "/") return true;
  if (AUTH_PAGES.some((p) => pathname.startsWith(p))) return true;
  if (pathname.startsWith("/api/")) return true;
  if (pathname.startsWith("/dev/")) return true;
  if (pathname.startsWith("/_next/")) return true;
  if (pathname.includes(".")) return true; // Static files

  // Public card pages: /username or /company/employee (but not /dashboard/...)
  if (pathname.startsWith("/dashboard")) return false;
  if (PUBLIC_CARD_PATTERNS.some((p) => p.test(pathname))) return true;

  // Default: protect unknown routes
  return false;
}

// ── Role-based dashboard access ──────────────────────────────────────────────

const DASHBOARD_BASE: Record<UserRole, string> = {
  super_admin:   "/dashboard/admin",
  country_rep:   "/dashboard/admin",
  company_admin: "/dashboard/company",
  employee:      "/dashboard/employee",
  individual:    "/dashboard/employee",
};

function isAccessAllowed(pathname: string, role: UserRole): boolean {
  if (pathname.startsWith("/dashboard/admin")) {
    return role === "super_admin" || role === "country_rep";
  }
  if (pathname.startsWith("/dashboard/company")) {
    return role === "company_admin" || role === "super_admin";
  }
  if (pathname.startsWith("/dashboard/employee")) {
    return role === "employee" || role === "individual" || role === "super_admin";
  }
  return true;
}

// ── Proxy (Next.js 16 replacement for middleware) ────────────────────────────

export async function proxy(request: NextRequest) {
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
          for (const { name, value } of cookiesToSet) {
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

  // ── Suspended users → redirect to login ───────────────────────────────
  if (status === "suspended") {
    await supabase.auth.signOut();
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // ── Role-based access check ───────────────────────────────────────────
  if (!isAccessAllowed(pathname, role)) {
    // Redirect to their correct dashboard
    const correctDashboard = DASHBOARD_BASE[role];
    return NextResponse.redirect(new URL(correctDashboard, request.url));
  }

  return supabaseResponse;
}

// ── Matcher: only run on dashboard routes ────────────────────────────────────

export const config = {
  matcher: ["/dashboard/:path*"],
};
