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
  // that invited them.
  if (isEmployee && data.company?.trim()) {
    return {
      success: false,
      error: "Employees cannot change their company. Contact your company admin.",
    };
  }

  // ── Employee theme lock ─────────────────────────────────────────────────
  // If the employee's primary company has theme_locked = true, reject any
  // attempt to change the card accent colour.
  if (isEmployee && data.theme_color) {
    // Fetch the primary company's theme_locked flag
    const { data: pcLink } = await serviceClient
      .from("profile_companies")
      .select("company_id")
      .eq("profile_id", user.id)
      .eq("is_primary", true)
      .maybeSingle();

    if (pcLink?.company_id) {
      const { data: company } = await serviceClient
        .from("companies")
        .select("theme_locked, brand_color")
        .eq("id", pcLink.company_id)
        .single();

      if (company?.theme_locked) {
        // Fetch current theme to see if it's actually changing
        const { data: currentCard } = await serviceClient
          .from("cards")
          .select("theme_color")
          .eq("profile_id", user.id)
          .single();

        if (currentCard && data.theme_color !== currentCard.theme_color) {
          return {
            success: false,
            error:
              "Your company has locked the card colour. Contact your admin to change it.",
          };
        }
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
    email_public:      data.email_public,
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

    // Find or create the company (use maybeSingle — zero rows is normal for new companies)
    let companyId: string;
    const { data: existing, error: findErr } = await serviceClient
      .from("companies")
      .select("id")
      .ilike("name", companyName)
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
      const { data: created, error: createErr } = await serviceClient
        .from("companies")
        .insert({ name: companyName, slug, status: "pending" })
        .select("id")
        .single();
      if (createErr || !created) {
        console.error("updateMyCard: company creation error:", createErr);
        return { success: false, error: "Failed to create company." };
      }
      companyId = created.id;
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

    // 5. Update company social links if provided
    if (data.company_social_links) {
      await updateCompanySocialLinks(companyId, data.company_social_links);
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
