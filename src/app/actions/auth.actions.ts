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
  const phone    = (formData.get("phone") as string) || undefined;

  if (!email || !password || !fullName || !username) {
    return { success: false, error: "All fields are required." };
  }

  // Validate password strength server-side
  if (password.length < 8) {
    return { success: false, error: "Password must be at least 8 characters." };
  }

  const supabase = await getSupabaseServerAction();

  // Role is hardcoded server-side — never accept role from the client
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/pending`,
      data: {
        full_name: fullName,
        username:  username,
        role:      "individual",  // SERVER-HARDCODED to prevent privilege escalation
        ...(phone ? { phone } : {}),
      },
    },
  });

  if (error) {
    return { success: false, error: error.message };
  }

  // Detect duplicate email — Supabase returns empty identities for existing users
  if (data.user?.identities?.length === 0) {
    return { success: false, error: "An account with this email already exists. Please sign in instead." };
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
  const phone         = (formData.get("phone") as string) || undefined;
  const legalConfirmed = formData.get("legal_rep_confirmed") === "on";

  if (!companyName || !adminName || !email || !password) {
    return { success: false, error: "All required fields must be filled." };
  }

  if (!legalConfirmed) {
    return { success: false, error: "You must confirm you are the legal representative." };
  }

  // Validate password strength server-side
  if (password.length < 8) {
    return { success: false, error: "Password must be at least 8 characters." };
  }

  const supabase = await getSupabaseServerAction();

  // Role is hardcoded server-side — never accept role from the client
  // 1. Create the auth user
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/pending`,
      data: {
        full_name:          adminName,
        role:               "company_admin",  // SERVER-HARDCODED to prevent privilege escalation
        company_name:       companyName,
        industry,
        size,
        website,
        legal_rep_confirmed: true,
        ...(phone ? { phone } : {}),
      },
    },
  });

  if (authError) {
    return { success: false, error: authError.message };
  }

  if (!authData.user) {
    return { success: false, error: "Registration failed." };
  }

  // Detect duplicate email
  if (authData.user.identities?.length === 0) {
    return { success: false, error: "An account with this email already exists. Please sign in instead." };
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

  if (!email || !password) {
    return { success: false, error: "Email and password are required." };
  }

  const supabase = await getSupabaseServerAction();

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return { success: false, error: error.message };
  }

  // Look up role to redirect to the correct dashboard
  const userId = data.user?.id;
  let dashboard = "/dashboard/employee"; // fallback

  if (userId) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", userId)
      .single();

    if (profile?.role) {
      const DASHBOARD_MAP: Record<string, string> = {
        super_admin:   "/dashboard/admin",
        country_rep:   "/dashboard/admin",
        company_admin: "/dashboard/company",
        employee:      "/dashboard/employee",
        individual:    "/dashboard/employee",
      };
      dashboard = DASHBOARD_MAP[profile.role] ?? dashboard;
    }
  }

  redirect(dashboard);
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

// ── Verify OTP (email confirmation, password reset) ────────────────────────

export async function verifyOtp(
  email: string,
  token: string,
  type: "signup" | "recovery" | "email" = "signup"
): Promise<ActionResult> {
  if (!email || !token) {
    return { success: false, error: "Email and verification code are required." };
  }

  if (token.length !== 6 || !/^\d{6}$/.test(token)) {
    return { success: false, error: "Please enter a valid 6-digit code." };
  }

  const supabase = await getSupabaseServerAction();

  const { error } = await supabase.auth.verifyOtp({
    email,
    token,
    type,
  });

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true };
}

// ── Resend OTP ──────────────────────────────────────────────────────────────

export async function resendOtp(
  email: string,
  type: "signup" | "email_change" = "signup"
): Promise<ActionResult> {
  if (!email) {
    return { success: false, error: "Email is required." };
  }

  const supabase = await getSupabaseServerAction();

  const { error } = await supabase.auth.resend({
    type,
    email,
  });

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true };
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
