// ─────────────────────────────────────────────────────────────────────────────
// Supabase server client
// Used in Server Components and Route Handlers.
// Reads cookies via next/headers — works with the middleware client.
// ─────────────────────────────────────────────────────────────────────────────

import { cache } from "react";
import { createServerClient } from "@supabase/ssr";
import { createClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";
import type { Database } from "@/types/database";

/**
 * Server Component / Route Handler Supabase client.
 * Call this at the top of any Server Component or Route Handler
 * that needs to query Supabase.
 *
 * @example
 *   const supabase = await getSupabase();
 *   const { data } = await supabase.from("profiles").select();
 */
export async function getSupabase() {
  const cookieStore = await cookies();

  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          for (const { name, value, options } of cookiesToSet) {
            cookieStore.set(name, value, options);
          }
        },
      },
    }
  );
}

/**
 * Stateless Supabase client for public pages that don't need auth.
 * No cookie handling — avoids session refresh crashes on public routes.
 */
export function getPublicSupabase() {
  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return [];
        },
        setAll() {
          // no-op: public client doesn't write cookies
        },
      },
    }
  );
}

/**
 * Resolves the company_id for the currently authenticated company_admin.
 * Shared across company.actions, invitations.actions, and subscription.actions.
 * Returns null if the user has no primary company association.
 */
export async function resolveCompanyId(): Promise<string | null> {
  try {
    const supabase = await getSupabase();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    // Verify the caller has admin privileges — employees cannot manage the company.
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    if (!profile || (profile.role !== "company_admin" && profile.role !== "super_admin")) {
      return null;
    }

    const { data: link } = await supabase
      .from("profile_companies")
      .select("company_id")
      .eq("profile_id", user.id)
      .eq("is_primary", true)
      .single();

    return link?.company_id ?? null;
  } catch {
    return null;
  }
}

/**
 * Service-role client for privileged server-side operations (both reads and writes).
 * Bypasses RLS — use only for server-side operations that need cross-table access
 * or mutations that should not be constrained by per-user RLS policies.
 * Never expose this client or the service_role key to the browser.
 *
 * Uses the standard `createClient` from @supabase/supabase-js (not the SSR
 * cookie-based client) — the service_role key handles authentication directly,
 * so no cookie management is needed.
 *
 * Wrapped in React cache() — every call within a single HTTP request returns
 * the same client instance, avoiding unnecessary re-creation.
 */
export const getServiceSupabase = cache(() => {
  return createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  );
});
