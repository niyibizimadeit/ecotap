// ─────────────────────────────────────────────────────────────────────────────
// Event access capabilities
//
// Resolved once per request from the caller's own session and never accepted
// from the client — there is no code path where a caller can name themselves
// as a host, an admin, or a company. That is the B4 lesson applied
// structurally rather than as a check.
//
// Deliberately NOT using resolveCompanyId() as the host check: it returns null
// for employees and individuals (which would lock out most hosts) and null for
// a super_admin without a primary company link (which would break the
// platform-admin tier).
// ─────────────────────────────────────────────────────────────────────────────

import { getSupabase, resolveCompanyId } from "@/lib/supabase/server";
import type { EventCapabilities, UserRole } from "@/types";

const ANONYMOUS: EventCapabilities = {
  authenticated:   false,
  hostProfileId:   null,
  companyId:       null,
  isPlatformAdmin: false,
  isCountryRep:    false,
};

export async function getEventCapabilities(): Promise<EventCapabilities> {
  const supabase = await getSupabase();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return ANONYMOUS;

  const { data: profile } = await supabase
    .from("profiles")
    .select("role, status")
    .eq("id", user.id)
    .maybeSingle();

  // Pending and suspended accounts have no event capabilities at all.
  if (!profile || profile.status !== "active") return ANONYMOUS;

  const role = profile.role as UserRole;

  // country_rep sees the admin list but never exports — export is data egress
  // and country_rep is read-only everywhere else in the app.
  if (role === "country_rep") {
    return {
      authenticated:   true,
      hostProfileId:   null,
      companyId:       null,
      isPlatformAdmin: false,
      isCountryRep:    true,
    };
  }

  // super_admin administers the platform but does not host. They still reach
  // every export through the platform-admin tier.
  if (role === "super_admin") {
    return {
      authenticated:   true,
      hostProfileId:   null,
      companyId:       null,
      isPlatformAdmin: true,
      isCountryRep:    false,
    };
  }

  // employee | individual | company_admin — all are cardholders, all may host.
  return {
    authenticated:   true,
    hostProfileId:   user.id,
    companyId:       role === "company_admin" ? await resolveCompanyId() : null,
    isPlatformAdmin: false,
    isCountryRep:    false,
  };
}
