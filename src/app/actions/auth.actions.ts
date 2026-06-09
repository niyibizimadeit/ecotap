"use server";

// ─────────────────────────────────────────────────────────────────────────────
// Auth server actions — sign up, sign in, sign out.
// Called from client components (auth forms). Use Supabase service role
// for admin-level operations and anon key for user-facing auth.
// ─────────────────────────────────────────────────────────────────────────────

import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import type { ActionResult } from "@/types";

// ── Helpers ──────────────────────────────────────────────────────────────────

async function getSupabaseServerAction() {
  const cookieStore = await cookies();
  return createServerClient(
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

// ── Sign up (individual / employee) ──────────────────────────────────────────

export async function signUp(formData: FormData): Promise<ActionResult> {
  const email    = formData.get("email") as string;
  const password = formData.get("password") as string;
  const fullName = formData.get("full_name") as string;
  const username = formData.get("username") as string;
  const role     = (formData.get("role") as string) ?? "individual";

  if (!email || !password || !fullName || !username) {
    return { success: false, error: "All fields are required." };
  }

  const supabase = await getSupabaseServerAction();

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
        username:  username,
        role:      role,
      },
    },
  });

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true };
}

// ── Sign up (company / org admin) ────────────────────────────────────────────

export async function signUpOrg(formData: FormData): Promise<ActionResult> {
  const companyName   = formData.get("company_name") as string;
  const industry      = (formData.get("industry") as string) ?? "";
  const size          = (formData.get("size") as string) ?? "";
  const website       = (formData.get("website") as string) ?? "";
  const adminName     = formData.get("admin_name") as string;
  const email         = formData.get("email") as string;
  const password      = formData.get("password") as string;
  const legalConfirmed = formData.get("legal_rep_confirmed") === "on";

  if (!companyName || !adminName || !email || !password) {
    return { success: false, error: "All required fields must be filled." };
  }

  if (!legalConfirmed) {
    return { success: false, error: "You must confirm you are the legal representative." };
  }

  const supabase = await getSupabaseServerAction();

  // 1. Create the auth user
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name:          adminName,
        role:               "company_admin",
        company_name:       companyName,
        industry,
        size,
        website,
        legal_rep_confirmed: true,
      },
    },
  });

  if (authError || !authData.user) {
    return { success: false, error: authError?.message ?? "Registration failed." };
  }

  // 2. The DB trigger creates the profiles row.
  //    The company is created by an Edge Function or direct API call
  //    after email confirmation. For now, store metadata on the user.

  return { success: true };
}

// ── Sign in ──────────────────────────────────────────────────────────────────

export async function signIn(formData: FormData): Promise<ActionResult> {
  const email    = formData.get("email") as string;
  const password = formData.get("password") as string;
  const redirectTo = (formData.get("redirect") as string) ?? "/dashboard/employee";

  if (!email || !password) {
    return { success: false, error: "Email and password are required." };
  }

  const supabase = await getSupabaseServerAction();

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return { success: false, error: error.message };
  }

  // The redirect won't happen inside try/catch — Next.js throws a special error
  redirect(redirectTo);
}

// ── Sign out ─────────────────────────────────────────────────────────────────

export async function signOut(): Promise<ActionResult> {
  const supabase = await getSupabaseServerAction();
  const { error } = await supabase.auth.signOut();

  if (error) {
    return { success: false, error: error.message };
  }

  redirect("/");
}

// ── Get current session ──────────────────────────────────────────────────────

export async function getSession() {
  const supabase = await getSupabaseServerAction();
  const { data: { session } } = await supabase.auth.getSession();
  return session;
}

// ── Get current user ─────────────────────────────────────────────────────────

export async function getCurrentUser() {
  const supabase = await getSupabaseServerAction();
  const { data: { user } } = await supabase.auth.getUser();
  return user;
}
