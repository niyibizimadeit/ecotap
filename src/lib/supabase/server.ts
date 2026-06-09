// ─────────────────────────────────────────────────────────────────────────────
// Supabase server client
// Used in Server Components and Route Handlers.
// Reads cookies via next/headers — works with the middleware client.
// ─────────────────────────────────────────────────────────────────────────────

import { createServerClient } from "@supabase/ssr";
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
