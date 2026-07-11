"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { PageHeader, SectionCard } from "@/components/dashboard/DashboardShared";
import { Input, Textarea } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { ImageUpload } from "@/components/ui/ImageUpload";
import { CardPreview } from "@/components/cards/CardPreview";
import { SOCIAL_LINKS, GROUP_SOCIAL_LINKS, MAX_CARD_GROUPS } from "@/constants";
import { Save, Plus, Trash2, Building2, AlertCircle, Package } from "lucide-react";
import { getMyCard, updateMyCard, deleteMyAccount } from "@/app/actions/cards.actions";
import { updateProfilePhoto } from "@/app/actions/uploads.actions";
import type { SocialLinks, CardProfileForm } from "@/types";

type GroupEntry = {
  id?: string;
  organization_name: string;
  job_title: string;
  social_links: SocialLinks;
  show_on_card: boolean;
  sort_order?: number;
};

type FormState = CardProfileForm & {
  full_name: string;
  company: string;
  department: string;
  company_social_links: SocialLinks;
  avatar_url?: string | null;
  card_slug: string;
  card_groups: GroupEntry[];
};

const EMPTY_GROUP: GroupEntry = {
  organization_name: "",
  job_title: "",
  social_links: { linkedin: "", twitter: "", website: "" },
  show_on_card: true,
};

const EMPTY_FORM: FormState = {
  full_name:            "",
  job_title:            "",
  company:              "",
  department:           "",
  phone:                "",
  email_public:         "",
  bio:                  "",
  theme_color:          "#064E3B",
  social_links:         { linkedin: "", twitter: "", whatsapp: "", instagram: "", website: "" },
  company_social_links: { linkedin: "", twitter: "", website: "" },
  show_organization:    false,
  avatar_url:           null,
  card_slug:            "",
  card_groups:          [],
};

export default function ProfilePage() {
  const [form, setForm] = useState(EMPTY_FORM);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [isThemeLocked, setIsThemeLocked] = useState(false);
  const [isEmployee, setIsEmployee] = useState(false);

  // Load real data on mount
  useEffect(() => {
    async function load() {
      const result = await getMyCard();
      if (result.success && result.data) {
        const card = result.data;
        setIsThemeLocked(card.primary_company?.theme_locked ?? false);
        setIsEmployee(card.profile?.role === "employee");
        setForm({
          full_name:    card.profile?.full_name ?? "",
          job_title:    card.job_title ?? card.primary_job_title ?? "",
          company:      card.primary_company?.name ?? "",
          department:   card.all_companies?.[0]?.department ?? "",
          phone:        card.phone ?? "",
          email_public: card.email_public ?? "",
          bio:          card.bio ?? "",
          theme_color:  card.theme_color ?? "#064E3B",
          social_links: {
            linkedin:  card.social_links?.linkedin ?? "",
            twitter:   card.social_links?.twitter ?? "",
            whatsapp:  card.social_links?.whatsapp ?? "",
            instagram: card.social_links?.instagram ?? "",
            website:   card.social_links?.website ?? "",
          },
          company_social_links: {
            linkedin: card.primary_company?.social_links?.linkedin ?? "",
            twitter:  card.primary_company?.social_links?.twitter ?? "",
            website:  card.primary_company?.social_links?.website ?? "",
          },
          show_organization: card.show_organization ?? false,
          avatar_url:        card.profile.avatar_url,
          card_slug:         card.slug,
          card_groups:       (card.card_groups ?? []).map((g) => ({
            id: g.id,
            organization_name: g.organization_name,
            job_title: g.job_title ?? "",
            social_links: {
              linkedin: (g.social_links as Record<string, string>).linkedin ?? "",
              twitter:  (g.social_links as Record<string, string>).twitter ?? "",
              website:  (g.social_links as Record<string, string>).website ?? "",
            },
            show_on_card: g.show_on_card,
          })),
        });
      }
      setLoading(false);
    }
    load();
  }, []);

  const set = (field: keyof FormState) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm(f => ({ ...f, [field]: e.target.value }));

  const setSocial = (key: keyof SocialLinks) =>
    (e: React.ChangeEvent<HTMLInputElement>) =>
      setForm(f => ({ ...f, social_links: { ...f.social_links, [key]: e.target.value } }));

  const setCompanySocial = (key: string) =>
    (e: React.ChangeEvent<HTMLInputElement>) =>
      setForm(f => ({
        ...f,
        company_social_links: { ...f.company_social_links, [key]: e.target.value },
      }));

  /* ── Group helpers ── */
  const setGroupField = (index: number, field: keyof GroupEntry) =>
    (e: React.ChangeEvent<HTMLInputElement>) =>
      setForm(f => ({
        ...f,
        card_groups: f.card_groups.map((g, i) =>
          i === index ? { ...g, [field]: e.target.value } : g
        ),
      }));

  const setGroupSocial = (index: number, key: string) =>
    (e: React.ChangeEvent<HTMLInputElement>) =>
      setForm(f => ({
        ...f,
        card_groups: f.card_groups.map((g, i) =>
          i === index ? { ...g, social_links: { ...g.social_links, [key]: e.target.value } } : g
        ),
      }));

  const toggleGroup = (index: number) =>
    () =>
      setForm(f => ({
        ...f,
        card_groups: f.card_groups.map((g, i) =>
          i === index ? { ...g, show_on_card: !g.show_on_card } : g
        ),
      }));

  const removeGroup = (index: number) =>
    setForm(f => ({
      ...f,
      card_groups: f.card_groups.filter((_, i) => i !== index),
    }));

  const addGroup = () =>
    setForm(f => {
      if (f.card_groups.length >= MAX_CARD_GROUPS) return f;
      return { ...f, card_groups: [...f.card_groups, { ...EMPTY_GROUP }] };
    });

  async function save() {
    setSaving(true);
    setSaveError(null);
    setSaved(false);
    const result = await updateMyCard({
      full_name:            form.full_name,
      job_title:            form.job_title,
      phone:                form.phone,
      email_public:         form.email_public,
      bio:                  form.bio,
      theme_color:          form.theme_color,
      social_links:         form.social_links,
      show_organization:    form.show_organization,
      company:              form.company,
      department:           form.department,
      company_social_links: form.show_organization ? form.company_social_links : undefined,
      card_groups:          form.card_groups,
    });
    setSaving(false);
    if (result.success) {
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } else {
      setSaveError(result.error ?? "Save failed. Please try again.");
    }
  }

  async function handleDelete() {
    setDeleting(true);
    const result = await deleteMyAccount();
    setDeleting(false);
    if (result.success) {
      window.location.href = "/";
    } else {
      alert(result.error ?? "Failed to delete account.");
    }
  }

  if (loading) {
    return (
      <div>
        <PageHeader eyebrow="My Card" title="Edit your profile" subtitle="Loading…" />
        <div className="space-y-5">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-40 rounded-2xl skeleton" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        eyebrow="My Card"
        title="Edit your profile"
        subtitle="Changes update your live card instantly."
        action={
          <Button
            variant="primary"
            size="sm"
            loading={saving}
            leftIcon={!saving ? <Save className="h-3.5 w-3.5" /> : undefined}
            onClick={save}
            style={saved ? { backgroundColor: "#059669" } : {}}
          >
            {saved ? "Saved!" : "Save changes"}
          </Button>
        }
      />

      {saveError && (
        <div className="flex items-start gap-2.5 bg-red-50 border border-red-200 rounded-xl p-3 mb-5 max-w-2xl">
          <AlertCircle className="h-4 w-4 text-red-500 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-red-700">{saveError}</p>
        </div>
      )}

      <div className="grid grid-cols-1 xl:grid-cols-5 gap-6">
        <div className="xl:col-span-3 space-y-5">

          {/* Photo */}
          <SectionCard title="Profile photo" subtitle="Shown on your public card.">
            <div className="flex items-center gap-5">
              <ImageUpload
                currentUrl={form.avatar_url}
                size="sm"
                onUpload={updateProfilePhoto}
                onUploaded={(url) => setForm(f => ({ ...f, avatar_url: url }))}
              />
              <div>
                <p className="text-sm text-ink-mid font-medium">Upload a photo</p>
                <p className="text-xs text-ink-light mt-1">JPG, PNG, or WebP — up to 5MB.</p>
              </div>
            </div>
          </SectionCard>

          {/* Basic info */}
          <SectionCard title="Basic info">
            <div className="space-y-4">
              <Input label="Full name" required value={form.full_name} onChange={set("full_name")} />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input label="Phone" type="tel" placeholder="+250 7XX XXX XXX" value={form.phone} onChange={set("phone")} />
                <Input label="Email" type="email" value={form.email_public} onChange={set("email_public")} hint="Shown on your card" />
              </div>
              <Textarea label="Bio" placeholder="Tell visitors about yourself..." value={form.bio} onChange={set("bio")} hint="Keep it under 200 characters for best display." className="min-h-[90px]" />
            </div>
          </SectionCard>

          {/* Organization section */}
          <SectionCard
            title="Organization"
            subtitle={form.show_organization ? "Your company info shown on your card" : "Show your company on your card"}
          >
            <div className="space-y-5">
              {/* Toggle */}
              <div className="flex items-center gap-4 pb-3 border-b" style={{ borderColor: "rgba(6,78,59,0.08)" }}>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.show_organization}
                    onChange={e => setForm(f => ({ ...f, show_organization: e.target.checked }))}
                    className="sr-only peer"
                  />
                  <div className="w-9 h-5 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all"
                    style={{
                      backgroundColor: form.show_organization ? "#064E3B" : "#D1D5DB",
                    }}
                  />
                </label>
                <span className="text-sm font-medium text-emerald-deep">
                  {form.show_organization ? "Organization shown on card" : "Show organization on my card"}
                </span>
              </div>

              {form.show_organization && (
                <>
                  {/* Company & Job Title */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Input label="Company" placeholder="Where you work" value={form.company} onChange={set("company")} hint={isEmployee ? "Your company is managed by your admin." : "Type a company name"} disabled={isEmployee} />
                    <Input label="Job title" placeholder="e.g. Software Engineer" value={form.job_title} onChange={set("job_title")} hint="Your role at this company" />
                  </div>
                  <Input label="Department" placeholder="e.g. Engineering, Sales, Operations" value={form.department} onChange={set("department")} hint="Optional — your team or department" />

                  {/* Company Social Links */}
                  <div
                    className="rounded-2xl p-4 space-y-3"
                    style={{ backgroundColor: "#FEF9EF", border: "1px solid rgba(6,78,59,0.08)" }}
                  >
                    <div>
                      <p className="text-sm font-semibold text-emerald-deep">Company social links</p>
                      <p className="text-xs text-ink-light mt-0.5">Optional — shared with all employees at this company.</p>
                    </div>
                    {([
                      { key: "linkedin", label: "LinkedIn",  placeholder: "https://linkedin.com/company/..." },
                      { key: "twitter",  label: "Twitter/X", placeholder: "https://x.com/..."                },
                      { key: "website",  label: "Website",   placeholder: "https://..."                      },
                    ] as const).map(({ key, label, placeholder }) => (
                      <Input
                        key={key}
                        label={label}
                        placeholder={placeholder}
                        value={(form.company_social_links as Record<string, string>)[key] ?? ""}
                        onChange={setCompanySocial(key)}
                      />
                    ))}
                  </div>
                </>
              )}
            </div>
          </SectionCard>

          {/* Card Groups (additional affiliations) */}
          <SectionCard
            title="Groups & Affiliations"
            subtitle={`Add up to ${MAX_CARD_GROUPS} additional organizations or affiliations to your card.`}
          >
            <div className="space-y-5">
              {form.card_groups.map((group, i) => (
                <div
                  key={i}
                  className="rounded-2xl p-4 space-y-3"
                  style={{ backgroundColor: "#FEF9EF", border: "1px solid rgba(6,78,59,0.08)" }}
                >
                  {/* Header row */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Building2 className="h-4 w-4 text-emerald-deep" />
                      <span className="text-sm font-semibold text-emerald-deep">Group {i + 1}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      {/* Toggle */}
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={group.show_on_card}
                          onChange={toggleGroup(i)}
                          className="sr-only peer"
                        />
                        <div
                          className="w-8 h-4 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:rounded-full after:h-3 after:w-3 after:transition-all"
                          style={{ backgroundColor: group.show_on_card ? "#064E3B" : "#D1D5DB" }}
                        />
                      </label>
                      <span className="text-xs text-ink-light">{group.show_on_card ? "Shown" : "Hidden"}</span>
                      <button
                        onClick={() => removeGroup(i)}
                        className="ml-2 p-1 rounded-lg hover:bg-red-50 text-ink-light hover:text-red-500 transition-colors"
                        title="Remove group"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Fields */}
                  <Input
                    label="Organization name"
                    placeholder="e.g. Volunteer at NGO, Board Member"
                    value={group.organization_name}
                    onChange={setGroupField(i, "organization_name")}
                  />
                  <Input
                    label="Job title"
                    placeholder="e.g. Chairperson, Advisor"
                    value={group.job_title}
                    onChange={setGroupField(i, "job_title")}
                  />

                  {/* Group social links */}
                  <div
                    className="rounded-xl p-3 space-y-2"
                    style={{ backgroundColor: "rgba(254,252,232,0.6)" }}
                  >
                    <p className="text-xs font-medium text-ink-light">Social links</p>
                    {GROUP_SOCIAL_LINKS.map(({ key, label, placeholder }) => (
                      <Input
                        key={key}
                        label={label}
                        placeholder={placeholder}
                        value={(group.social_links as Record<string, string>)[key] ?? ""}
                        onChange={setGroupSocial(i, key)}
                      />
                    ))}
                  </div>
                </div>
              ))}

              {/* Add group button */}
              {form.card_groups.length < MAX_CARD_GROUPS && (
                <button
                  onClick={addGroup}
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl border-2 border-dashed transition-colors hover:bg-emerald-pale/20"
                  style={{ borderColor: "rgba(6,78,59,0.15)", color: "#064E3B" }}
                >
                  <Plus className="h-4 w-4" />
                  <span className="text-sm font-medium">Add group</span>
                </button>
              )}

              {form.card_groups.length === 0 && (
                <p className="text-center text-xs text-ink-light py-2">
                  No groups yet. Click &ldquo;Add group&rdquo; to add an affiliation.
                </p>
              )}
            </div>
          </SectionCard>

          {/* Social links */}
          <SectionCard title="Social links" subtitle="Add any you want shown on your card.">
            <div className="space-y-3">
              {SOCIAL_LINKS.map(({ key, label, placeholder }) => (
                <Input key={key} label={label} placeholder={placeholder} value={(form.social_links as SocialLinks)[key] ?? ""} onChange={setSocial(key)} />
              ))}
            </div>
          </SectionCard>

          {/* Card accent color */}
          {isThemeLocked && isEmployee ? (
            <SectionCard title="Card colour" subtitle="Your company has locked the card colour.">
              <div className="rounded-xl border p-4 text-center" style={{ borderColor: "rgba(6,78,59,0.15)", backgroundColor: "#FEF9EF" }}>
                <p className="text-sm text-ink-light">
                  Your company administrator has locked the card colour to{" "}
                  <span className="font-mono font-medium text-ink">{form.theme_color}</span>.
                  Contact your admin to change it.
                </p>
              </div>
            </SectionCard>
          ) : (
            <SectionCard title="Card colour" subtitle="Sets your card's accent colour.">
              <div className="flex items-center gap-4 flex-wrap">
                {["#064E3B", "#065F46", "#1e3a5f", "#7c2d12", "#1a1a2e", "#374151"].map(color => (
                  <button key={color} onClick={() => setForm(f => ({ ...f, theme_color: color }))} className="w-10 h-10 rounded-xl border-2 transition-all hover:scale-110"
                    style={{ backgroundColor: color, borderColor: form.theme_color === color ? "#059669" : "transparent", boxShadow: form.theme_color === color ? "0 0 0 3px rgba(5,150,105,0.25)" : "none" }} />
                ))}
                <div className="flex items-center gap-2 ml-1">
                  <input type="color" value={form.theme_color} onChange={e => setForm(f => ({ ...f, theme_color: e.target.value }))} className="w-10 h-10 rounded-xl border border-cream-dark cursor-pointer p-0.5" title="Custom colour" />
                  <span className="text-xs font-mono text-ink-light">{form.theme_color}</span>
                </div>
              </div>
            </SectionCard>
          )}

          <Button variant="primary" size="lg" className="w-full" loading={saving} onClick={save} leftIcon={!saving ? <Save className="h-4 w-4" /> : undefined}
            style={saved ? { backgroundColor: "#059669" } : {}}>
            {saved ? "Changes saved!" : "Save changes"}
          </Button>

          {/* Order another card */}
          <div className="rounded-2xl border p-5 text-center" style={{ borderColor: "rgba(6,78,59,0.1)", backgroundColor: "#FEF9EF" }}>
            <p className="text-sm font-medium text-emerald-deep mb-2">Need another physical card?</p>
            <p className="text-xs text-ink-light mb-4">
              Order a new EcoTap NFC card with your current design and branding. Your digital profile stays exactly as it is.
            </p>
            <Link href="/dashboard/employee/orders/new" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-colors hover:opacity-90" style={{ backgroundColor: "#064E3B", color: "#FEFCE8" }}>
              <Package className="h-4 w-4" />
              Order another card
            </Link>
          </div>

          {/* Danger Zone */}
          <SectionCard title="Danger Zone">
            <div className="space-y-3">
              <p className="text-sm text-ink-light">
                Permanently delete your account, card, and all associated data. This action cannot be undone.
              </p>
              {!confirmDelete ? (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setConfirmDelete(true)}
                  style={{ borderColor: "#DC2626", color: "#DC2626" }}
                >
                  Delete my account
                </Button>
              ) : (
                <div className="flex items-center gap-3">
                  <Button
                    variant="primary"
                    size="sm"
                    loading={deleting}
                    onClick={handleDelete}
                    style={{ backgroundColor: "#DC2626" }}
                  >
                    {deleting ? "Deleting…" : "Confirm delete"}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setConfirmDelete(false)}
                    disabled={deleting}
                  >
                    Cancel
                  </Button>
                </div>
              )}
            </div>
          </SectionCard>
        </div>

        {/* Live preview */}
        <div className="xl:col-span-2">
          <div className="sticky top-8">
            <p className="text-xs font-mono tracking-widest text-ink-light uppercase text-center mb-4">Live preview</p>
            <CardPreview
              name={form.full_name}
              jobTitle={form.job_title}
              company={form.company}
              bio={form.bio}
              phone={form.phone}
              accentColor={form.theme_color}
              socialLinks={form.social_links}
              companySocialLinks={form.company_social_links}
              cardSlug={form.card_slug}
              avatarUrl={form.avatar_url}
              showOrganization={form.show_organization}
              cardGroups={form.card_groups}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
