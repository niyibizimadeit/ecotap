"use server";

import { cache } from "react";
import { getSupabase, getServiceSupabase } from "@/lib/supabase/server";
import * as cardsService from "@/lib/services/cards.service";
import { updateCompanySocialLinks } from "@/lib/supabase/companies.repo";
import { syncCardGroups } from "@/lib/supabase/cards.repo";
import { MAX_CARD_GROUPS } from "@/constants";
import type { ActionResult, PublicCard, Card, CardProfileForm, SocialLinks } from "@/types";

// ── Public card ──────────────────────────────────────────────────────────────

/**
 * Fetches full public card data by slug.
 * Wrapped in React cache() — deduplicates calls from generateMetadata()
 * and the page component that happen in the same HTTP request.
 */
export const getPublicCard = cache(async (
  slug: string
): Promise<ActionResult<PublicCard>> => {
  return cardsService.getPublicCard(slug);
});

// ── Own card ─────────────────────────────────────────────────────────────────

export async function getMyCard(): Promise<ActionResult<PublicCard>> {
  const supabase = await getSupabase();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { success: false, error: "Not authenticated." };

  const { data: profile } = await supabase
    .from("profiles")
    .select("username")
    .eq("id", user.id)
    .single();

  if (!profile?.username) return { success: false, error: "Profile not found." };
  return cardsService.getOwnCard(profile.username);
}

// ── Update card ─────────────────────────────────────────────────────────────

export async function updateMyCard(
  data: CardProfileForm & {
    full_name?: string;
    company?: string;
    department?: string;
    company_social_links?: SocialLinks;
    card_groups?: Array<{
      id?: string;
      organization_name: string;
      job_title?: string;
      social_links: SocialLinks;
      show_on_card: boolean;
    }>;
  }
): Promise<ActionResult<Card>> {
  const supabase = await getSupabase();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { success: false, error: "Not authenticated." };

  const serviceClient = getServiceSupabase();

  // Fetch user role to enforce employee restrictions
  const { data: profile } = await serviceClient
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();
  const isEmployee = profile?.role === "employee";

  // ── Employee company lock ───────────────────────────────────────────────
  // Employees cannot change their company — they are locked to the one
  // that invited them. But if the submitted value matches their current
  // primary company, allow it through (the profile page pre-fills this field).
  if (isEmployee && data.company?.trim()) {
    const { data: primaryLink } = await serviceClient
      .from("profile_companies")
      .select("company_id")
      .eq("profile_id", user.id)
      .eq("is_primary", true)
      .maybeSingle();

    if (primaryLink?.company_id) {
      const { data: primaryCompany } = await serviceClient
        .from("companies")
        .select("name")
        .eq("id", primaryLink.company_id)
        .single();

      if (primaryCompany && data.company.trim().toLowerCase() !== primaryCompany.name.toLowerCase()) {
        return {
          success: false,
          error: "Employees cannot change their company. Contact your company admin.",
        };
      }
    }
  }

  // ── Employee locks — fetch primary company's lock config once ───────────
  let companyLocks: { theme_locked: boolean; org_locked: boolean; job_title_locked: boolean; groups_locked: boolean; brand_color: string | null } | null = null;

  if (isEmployee) {
    const { data: pcLink } = await serviceClient
      .from("profile_companies")
      .select("company_id")
      .eq("profile_id", user.id)
      .eq("is_primary", true)
      .maybeSingle();

    if (pcLink?.company_id) {
      const { data: company } = await serviceClient
        .from("companies")
        .select("theme_locked, org_locked, job_title_locked, groups_locked, brand_color")
        .eq("id", pcLink.company_id)
        .single();

      if (company) {
        companyLocks = company;
      }
    }
  }

  // ── Employee theme lock ─────────────────────────────────────────────────
  // When the company has locked the theme, force the company's brand colour
  // onto the employee's card. The employee cannot override it.
  if (companyLocks?.theme_locked && companyLocks.brand_color) {
    data.theme_color = companyLocks.brand_color;
  }

  // ── Employee org lock — prevent changing primary organization ────────────
  if (companyLocks?.org_locked && data.company?.trim()) {
    const { data: primaryLink } = await serviceClient
      .from("profile_companies")
      .select("company_id")
      .eq("profile_id", user.id)
      .eq("is_primary", true)
      .maybeSingle();

    if (primaryLink?.company_id) {
      const { data: primaryCompany } = await serviceClient
        .from("companies")
        .select("name")
        .eq("id", primaryLink.company_id)
        .single();

      if (primaryCompany && data.company.trim().toLowerCase() !== primaryCompany.name.toLowerCase()) {
        return {
          success: false,
          error: "Your company has locked the organization. Contact your admin to change it.",
        };
      }
    }
  }

  // ── Employee job title lock ──────────────────────────────────────────────
  // Only enforce when the job title is actually changing, not just sent unchanged.
  if (companyLocks?.job_title_locked && data.job_title?.trim()) {
    const { data: currentCard } = await serviceClient
      .from("cards")
      .select("job_title")
      .eq("profile_id", user.id)
      .single();

    if (currentCard && data.job_title.trim() !== (currentCard.job_title ?? "").trim()) {
      return {
        success: false,
        error: "Your company has locked job titles. Contact your admin to change it.",
      };
    }
  }

  // ── Employee groups lock ─────────────────────────────────────────────────
  // Only enforce when the employee is actually modifying groups — not just
  // sending the existing groups array in the payload.
  if (companyLocks?.groups_locked && data.card_groups !== undefined) {
    const { data: currentCard } = await serviceClient
      .from("cards")
      .select("id")
      .eq("profile_id", user.id)
      .single();

    if (currentCard) {
      const { data: existingGroups } = await serviceClient
        .from("card_groups")
        .select("id")
        .eq("card_id", currentCard.id);

      const existingCount = (existingGroups ?? []).length;
      const incomingCount = data.card_groups.filter((g) => g.organization_name?.trim()).length;

      // Allow if the count and IDs haven't changed (employee isn't modifying groups)
      if (existingCount === incomingCount && incomingCount === data.card_groups.length) {
        // Count matches — check if all incoming groups have IDs matching existing ones
        const existingIds = new Set((existingGroups ?? []).map((g) => g.id));
        const allExisting = data.card_groups.every((g) => !g.id || existingIds.has(g.id));
        if (allExisting) {
          // Groups unchanged — skip enforcement
        } else {
          return {
            success: false,
            error: "Your company has locked card groups. Contact your admin to change them.",
          };
        }
      } else {
        // Count changed — employee is trying to add/remove groups
        return {
          success: false,
          error: "Your company has locked card groups. Contact your admin to change them.",
        };
      }
    }
  }

  // 1. Update profile full_name if provided
  if (data.full_name?.trim()) {
    await serviceClient
      .from("profiles")
      .update({ full_name: data.full_name.trim() })
      .eq("id", user.id);
  }

  // 2. Update card fields (includes show_organization toggle)
  const cardResult = await cardsService.updateCard(user.id, {
    job_title:         data.job_title,
    phone:             data.phone,
    whatsapp:          data.whatsapp || data.phone || "",
    email_public:      data.email_public,
    email_work:        data.email_work,
    bio:               data.bio,
    theme_color:       data.theme_color,
    social_links:      data.social_links,
    show_organization: data.show_organization,
  });

  if (!cardResult.success) return cardResult;

  // 3. Update existing profile_companies job_title for ALL linked companies
  //    This ensures job title changes reflect on the public card even when
  //    the user only edits their job title without touching the company field.
  //    EXCEPTION: employees cannot overwrite the job_title their company admin assigned
  //    on their primary company link — only update non-primary links.
  if (data.job_title !== undefined) {
    if (isEmployee) {
      // Only update non-primary profile_companies rows; preserve the admin-assigned
      // job_title on the primary company link.
      await serviceClient
        .from("profile_companies")
        .update({ job_title: data.job_title || null })
        .eq("profile_id", user.id)
        .eq("is_primary", false);
    } else {
      await serviceClient
        .from("profile_companies")
        .update({ job_title: data.job_title || null })
        .eq("profile_id", user.id);
    }
  }

  // 4. Handle company association if provided
  if (data.company?.trim()) {
    const companyName = data.company.trim();

    // `%` and `_` are Postgres LIKE wildcards, and `*` is PostgREST's alias for
    // `%`. Unescaped, a typed name can match a DIFFERENT company — or, as a bare
    // `%`, every company, which makes maybeSingle() fail. Backslash is Postgres's
    // default LIKE escape character, so escape it first.
    const companyNamePattern = companyName
      .replace(/\\/g, "\\\\")
      .replace(/[%_*]/g, (ch) => `\\${ch}`);

    // Remember the user's current primary company BEFORE changing it. This is a
    // pre-mutation snapshot: it is what authorises the company social-links write
    // below, and what identifies the company to unlink.
    const { data: oldLink } = await serviceClient
      .from("profile_companies")
      .select("company_id")
      .eq("profile_id", user.id)
      .eq("is_primary", true)
      .maybeSingle();
    const oldCompanyId = oldLink?.company_id ?? null;

    // Find or create the company (use maybeSingle — zero rows is normal for new companies)
    let companyId: string;
    let companyWasCreatedThisCall = false;
    // `.order(...).limit(1)`: two companies can legitimately share a name differing
    // only in case, and maybeSingle() errors on a multi-row response.
    const { data: existing, error: findErr } = await serviceClient
      .from("companies")
      .select("id")
      .ilike("name", companyNamePattern)
      .order("created_at", { ascending: true })
      .limit(1)
      .maybeSingle();

    if (findErr) {
      console.error("updateMyCard: company lookup error:", findErr);
      return { success: false, error: "Failed to look up company." };
    }

    if (existing) {
      companyId = existing.id;
    } else {
      const slug = companyName
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(-+)/g, "-")
        .replace(/(^-|-$)/g, "");
      // Self-serve companies created by individuals/employees don't need
      // admin approval — they are just display labels on the user's card.
      // Only org registrations (signUpOrg) go through the approval queue.
      const { data: created, error: createErr } = await serviceClient
        .from("companies")
        .insert({ name: companyName, slug, status: "active" })
        .select("id")
        .single();
      if (createErr || !created) {
        console.error("updateMyCard: company creation error:", createErr);
        return { success: false, error: "Failed to create company." };
      }
      companyId = created.id;
      companyWasCreatedThisCall = true;
    }

    // Resolve department: look up existing department by name, or create one
    let departmentId: string | null = null;
    if (data.department?.trim()) {
      const deptName = data.department.trim();
      const { data: existingDept } = await serviceClient
        .from("departments")
        .select("id")
        .eq("company_id", companyId)
        .eq("name", deptName)
        .maybeSingle();

      if (existingDept) {
        departmentId = existingDept.id;
      } else {
        const { data: newDept, error: deptErr } = await serviceClient
          .from("departments")
          .insert({ company_id: companyId, name: deptName })
          .select("id")
          .single();
        if (deptErr) {
          console.error("updateMyCard: department creation error:", deptErr);
          // Non-fatal — continue without department
        } else if (newDept) {
          departmentId = newDept.id;
        }
      }
    }

    // Check if already linked via profile_companies (use maybeSingle — zero rows is normal)
    const { data: existingLink } = await serviceClient
      .from("profile_companies")
      .select("id")
      .eq("profile_id", user.id)
      .eq("company_id", companyId)
      .maybeSingle();

    if (existingLink) {
      // Update existing link — ensure it's marked primary so the form
      // shows this company on next load. The trigger clears any old primary.
      const { error: updateLinkErr } = await serviceClient
        .from("profile_companies")
        .update({
          job_title: data.job_title || null,
          department_id: departmentId,
          is_primary: true,
        })
        .eq("id", existingLink.id);

      if (updateLinkErr) {
        console.error("updateMyCard: profile_companies update error:", updateLinkErr);
      }
    } else {
      // Create new link — always make it primary since the form only manages
      // one primary company. The enforce_single_primary_company trigger
      // clears is_primary on any previous primary for this profile.
      const { error: insertLinkErr } = await serviceClient
        .from("profile_companies")
        .insert({
          profile_id: user.id,
          company_id: companyId,
          job_title:  data.job_title || null,
          department_id: departmentId,
          is_primary: true,
        });

      if (insertLinkErr) {
        console.error("updateMyCard: profile_companies insert error:", insertLinkErr);
      }
    }

    // 5. Update company social links if provided.
    //
    // This is a service-role write of a company-wide, shared field (RLS bypassed),
    // so authorise it explicitly. Allowed when:
    //   - this call just created the company (the self-serve flow), or
    //   - the company was ALREADY the caller's primary company before this call.
    // The pre-mutation snapshot is what makes the second test meaningful: step 4
    // above has just linked the caller to `companyId` and marked it primary, so a
    // post-hoc ownership check would pass for anyone who merely typed an existing
    // company's name into the form.
    if (data.company_social_links) {
      const callerMayWriteCompanyLinks = companyWasCreatedThisCall || oldCompanyId === companyId;
      if (callerMayWriteCompanyLinks) {
        const updated = await updateCompanySocialLinks(companyId, data.company_social_links);
        if (!updated) {
          console.error("updateMyCard: company social links update failed for", companyId);
        }
      } else {
        console.error(
          "updateMyCard: refused company_social_links write — caller is not affiliated with",
          companyId
        );
      }
    }

    // 6. Unlink the user's OLD company — and only the link.
    //
    // DO NOT reintroduce an auto-delete of the old company here. Every FK into
    // companies is ON DELETE CASCADE (departments, profile_companies, invitations,
    // company_subscriptions, environmental_reports), so deleting the company row
    // also destroys that company's departments, members, invitations, SUBSCRIPTION
    // and environmental reports. There is no way to tell a self-serve display label
    // from a real approved partner company at this point — status === 'active' is
    // true for both, so the guard cannot be made safe. An abandoned self-serve
    // company is a cosmetic row; destroying a paying company's subscription is not.
    // Orphan cleanup belongs to the super admin (admin.service deleteCompany).
    if (oldCompanyId && oldCompanyId !== companyId) {
      const { error: unlinkError } = await serviceClient
        .from("profile_companies")
        .delete()
        .eq("profile_id", user.id)
        .eq("company_id", oldCompanyId);

      if (unlinkError) {
        console.error("updateMyCard: failed to unlink old company", oldCompanyId, unlinkError);
      }
    }
  }

  // 6. Handle card groups (additional affiliations)
  //    Use the service-role client to bypass RLS — card_groups are owned by the card,
  //    and the caller already proved ownership via auth.
  if (data.card_groups !== undefined) {
    const groups = data.card_groups
      .filter((g) => g.organization_name.trim())
      .slice(0, MAX_CARD_GROUPS);

    const syncResult = await syncCardGroups(cardResult.data!.id, groups, serviceClient);
    if (!syncResult.success) {
      if (groups.length > 0) {
        return { success: false, error: `Groups not saved: ${syncResult.error}` };
      }
      console.error("updateMyCard: card_groups sync failed (empty groups):", syncResult.error);
    }
  }

  return cardResult;
}

// ── Delete own account ────────────────────────────────────────────────────────

export async function deleteMyAccount(): Promise<ActionResult<void>> {
  const supabase = await getSupabase();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { success: false, error: "Not authenticated." };

  const { deleteOwnAccount } = await import("@/lib/services/admin.service");
  return deleteOwnAccount(user.id);
}
