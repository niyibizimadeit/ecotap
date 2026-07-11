"use server";

// ─────────────────────────────────────────────────────────────────────────────
// Auth server actions — sign up, sign in, sign out.
// Called from client components (auth forms). Use Supabase service role
// for admin-level operations and anon key for user-facing auth.
// ─────────────────────────────────────────────────────────────────────────────

import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getServiceSupabase } from "@/lib/supabase/server";
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
  const phone    = formData.get("phone") as string;
  const ageStr   = formData.get("age") as string;
  const age      = parseInt(ageStr, 10);
  const termsAccepted = formData.get("terms_accepted") === "true";
  const inviteToken  = (formData.get("invite_token") as string) || null;
  // Server-validate role: only 'individual' and 'employee' allowed from this endpoint
  const requestedRole = (formData.get("role") as string) || "individual";
  const role = (requestedRole === "employee" || requestedRole === "individual")
    ? requestedRole
    : "individual";

  if (!email || !password || !fullName || !username || !phone || !ageStr) {
    return { success: false, error: "All fields are required." };
  }

  if (!termsAccepted) {
    return { success: false, error: "You must accept the Terms and Conditions and Privacy Policy." };
  }

  // Validate age server-side
  if (isNaN(age) || age < 18 || age > 120) {
    return { success: false, error: "You must be at least 18 years old to create an account." };
  }

  // Validate phone format server-side
  if (!/^\+?[0-9]{7,15}$/.test(phone)) {
    return { success: false, error: "Please enter a valid phone number." };
  }

  // Validate password strength server-side
  if (password.length < 8) {
    return { success: false, error: "Password must be at least 8 characters." };
  }

  const supabase = await getSupabaseServerAction();

  // Check if username is already taken (before signUp to give a clear error)
  const serviceClient = getServiceSupabase();
  const { data: existingUsername } = await serviceClient
    .from("profiles")
    .select("id")
    .eq("username", username)
    .maybeSingle();

  if (existingUsername) {
    return {
      success: false,
      error: `The username "@${username}" is already taken. Please choose a different username.`,
    };
  }

  // Check if email is already registered
  const { data: existingEmail } = await serviceClient
    .from("profiles")
    .select("id")
    .eq("email", email)
    .maybeSingle();

  if (existingEmail) {
    return {
      success: false,
      error: "An account with this email already exists. Please sign in instead.",
    };
  }

  // Role is hardcoded server-side — never accept role from the client
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || "https://ecotap.rw"}${role === "employee" ? "/dashboard/employee" : "/pending"}`,
      data: {
        full_name: fullName,
        username:  username,
        phone,
        age,
        role,       // Server-validated: 'individual' or 'employee' only
        invite_token: inviteToken,
        terms_accepted: true,
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

  // If registering via invite, accept the invitation server-side.
  // This links the new profile to the company and marks the invite as accepted.
  // Done atomically inside signUp to avoid session-cookie race conditions.
  if (inviteToken && role === "employee" && data.user) {
    const { acceptInvite } = await import("@/lib/services/invitations.service");
    const acceptResult = await acceptInvite(inviteToken, data.user.id);
    if (!acceptResult.success) {
      console.error("Failed to accept invitation during signUp:", acceptResult.error);
      // Non-fatal: registration succeeded, but company link failed.
      // The profile is still active — admin can re-invite if needed.
    }
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
  const phone         = formData.get("phone") as string;
  const ageStr        = formData.get("age") as string;
  const age           = parseInt(ageStr, 10);
  const legalConfirmed = formData.get("legal_rep_confirmed") === "on";
  const termsAccepted = formData.get("terms_accepted") === "true";

  if (!companyName || !adminName || !email || !password || !phone || !ageStr) {
    return { success: false, error: "All required fields must be filled." };
  }

  // Validate age server-side
  if (isNaN(age) || age < 18 || age > 120) {
    return { success: false, error: "You must be at least 18 years old to create an account." };
  }

  // Validate phone format server-side
  if (!/^\+?[0-9]{7,15}$/.test(phone)) {
    return { success: false, error: "Please enter a valid phone number." };
  }

  if (!legalConfirmed) {
    return { success: false, error: "You must confirm you are the legal representative." };
  }

  if (!termsAccepted) {
    return { success: false, error: "You must accept the Terms and Conditions and Privacy Policy." };
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
      emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || "https://ecotap.rw"}/pending`,
      data: {
        full_name:          adminName,
        role:               "company_admin",  // SERVER-HARDCODED to prevent privilege escalation
        company_name:       companyName,
        industry,
        size,
        website,
        legal_rep_confirmed: true,
        terms_accepted: true,
        age,
        phone,
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

  // 2. The DB trigger (on_auth_user_created) creates the profiles row.
  //    We now also create the company + profile_companies link directly here
  //    instead of relying on the on_company_admin_activated trigger, which
  //    may not exist in all deployments.
  const userId = authData.user.id;
  const serviceClient = getServiceSupabase();

  // Generate a URL-safe slug from the company name
  const slug = companyName
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    || `company-${userId.replace(/-/g, "").slice(0, 12)}`;

  // Check if a company with this slug already exists — this can happen when
  // a previous registration created the company but the auth user was deleted
  // before the profile_companies link was created (orphaned company).
  let company: { id: string } | null = null;

  const { data: existingCompany } = await serviceClient
    .from("companies")
    .select("id, status")
    .eq("slug", slug)
    .maybeSingle();

  if (existingCompany) {
    // Only reuse if the company is still pending and has no existing admins
    if (existingCompany.status !== "pending") {
      return {
        success: false,
        error:
          "A company with this name is already registered and active. Please use a different name or contact support.",
      };
    }

    const { data: existingLinks } = await serviceClient
      .from("profile_companies")
      .select("id")
      .eq("company_id", existingCompany.id);

    if (existingLinks && existingLinks.length > 0) {
      return {
        success: false,
        error:
          "A company with this name is already registered. Please use a different name.",
      };
    }

    // Orphaned pending company — update its details and reuse it
    await serviceClient
      .from("companies")
      .update({
        name: companyName,
        industry: industry || null,
        size: size || null,
        website: website || null,
        legal_rep_confirmed: legalConfirmed,
      })
      .eq("id", existingCompany.id);

    company = existingCompany;
  } else {
    // No existing company — create one (status: pending — needs admin approval)
    const { data: newCompany, error: companyError } = await serviceClient
      .from("companies")
      .insert({
        name: companyName,
        slug,
        industry: industry || null,
        size: size || null,
        website: website || null,
        status: "pending",
        legal_rep_confirmed: legalConfirmed,
      })
      .select("id")
      .single();

    if (companyError) {
      console.error(
        "Failed to create company during signUpOrg:",
        companyError.message,
      );
      return {
        success: false,
        error: "Failed to create company. Please try again.",
      };
    }

    if (!newCompany) {
      console.error("Company creation returned no data during signUpOrg");
      return {
        success: false,
        error: "Failed to create company. Please try again.",
      };
    }

    company = newCompany;
  }

  // Link the admin to the company as primary
  const { error: linkError } = await serviceClient
    .from("profile_companies")
    .insert({
      profile_id: userId,
      company_id: company.id,
      is_primary: true,
    });

  if (linkError) {
    console.error("Failed to link admin to company:", linkError.message);
    // Clean up the company only if we just created it (not if we reused an existing one)
    if (!existingCompany) {
      await serviceClient.from("companies").delete().eq("id", company.id);
    }
    return {
      success: false,
      error: "Failed to set up company. Please try again.",
    };
  }

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
    // "Invalid login credentials" means either wrong password or no account —
    // make it clear the user may need to sign up instead.
    if (error.message === "Invalid login credentials") {
      return {
        success: false,
        error: "Invalid email or password. Don't have an account yet?",
      };
    }
    return { success: false, error: error.message };
  }

  // Look up role and status to redirect to the correct dashboard
  const userId = data.user?.id;
  let dashboard = "/dashboard/employee"; // fallback

  if (userId) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("role, status")
      .eq("id", userId)
      .single();

    if (profile) {
      // Pending users should see the "under review" page, not a dashboard
      if (profile.status === "pending") {
        redirect("/pending");
      }

      const DASHBOARD_MAP: Record<string, string> = {
        super_admin:   "/dashboard/admin",
        country_rep:   "/dashboard/admin",
        company_admin: "/dashboard/company",
        employee:      "/dashboard/employee",
        individual:    "/dashboard/employee",
      };
      dashboard = DASHBOARD_MAP[profile.role as string] ?? dashboard;
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

// ── Password reset (forgot password) ──────────────────────────────────────────

/**
 * Step 1: Request a password reset OTP.
 * Checks that the email belongs to an existing account before sending.
 */
export async function requestPasswordReset(email: string): Promise<ActionResult> {
  if (!email) {
    return { success: false, error: "Email is required." };
  }

  // Use service role for the lookup — the user is not signed in, so RLS
  // would block a regular client from reading the profiles table.
  const serviceClient = getServiceSupabase();

  const { data: profile } = await serviceClient
    .from("profiles")
    .select("id")
    .eq("email", email)
    .maybeSingle();

  if (!profile) {
    return { success: false, error: "NO_ACCOUNT" };
  }

  const supabase = await getSupabaseServerAction();
  const { error } = await supabase.auth.resetPasswordForEmail(email);

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true };
}

/**
 * Step 2: Verify the OTP and set a new password.
 * Combines OTP verification (type: "recovery") + password update in one action.
 */
export async function resetPasswordWithOtp(
  email: string,
  token: string,
  newPassword: string
): Promise<ActionResult> {
  if (!email || !token || token.length !== 6) {
    return { success: false, error: "Email and a 6-digit code are required." };
  }
  if (!newPassword || newPassword.length < 8) {
    return { success: false, error: "Password must be at least 8 characters." };
  }

  const supabase = await getSupabaseServerAction();

  // Verify the recovery OTP — this signs the user in
  const { error: verifyError } = await supabase.auth.verifyOtp({
    email,
    token,
    type: "recovery",
  });

  if (verifyError) {
    return { success: false, error: verifyError.message };
  }

  // User is now signed in — set the new password
  const { error: updateError } = await supabase.auth.updateUser({
    password: newPassword,
  });

  if (updateError) {
    return { success: false, error: updateError.message };
  }

  return { success: true };
}

/**
 * Verify the recovery OTP — signs the user in, then they proceed to set a new password.
 * Used by /verify-reset page.
 */
export async function verifyRecoveryOtp(
  email: string,
  token: string
): Promise<ActionResult> {
  if (!email || !token || token.length !== 6) {
    return { success: false, error: "Email and a 6-digit code are required." };
  }

  const supabase = await getSupabaseServerAction();

  const { error } = await supabase.auth.verifyOtp({
    email,
    token,
    type: "recovery",
  });

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true };
}

/**
 * Set a new password for the currently signed-in user.
 * Used by /new-password page (after OTP verification signs them in).
 */
export async function setNewPassword(newPassword: string): Promise<ActionResult> {
  if (!newPassword || newPassword.length < 8) {
    return { success: false, error: "Password must be at least 8 characters." };
  }

  const supabase = await getSupabaseServerAction();

  const { error } = await supabase.auth.updateUser({
    password: newPassword,
  });

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true };
}

/**
 * Reset password for a signed-in user (used by the /reset-password link-based flow).
 */
export async function resetPassword(newPassword: string): Promise<ActionResult> {
  if (!newPassword || newPassword.length < 8) {
    return { success: false, error: "Password must be at least 8 characters." };
  }

  const supabase = await getSupabaseServerAction();

  const { error } = await supabase.auth.updateUser({
    password: newPassword,
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
