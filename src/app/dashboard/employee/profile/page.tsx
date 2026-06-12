"use client";

import { useState, useEffect } from "react";
import { PageHeader, SectionCard } from "@/components/dashboard/DashboardShared";
import { Input, Textarea } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { ImageUpload } from "@/components/ui/ImageUpload";
import { CardPreview } from "@/components/cards/CardPreview";
import { SOCIAL_LINKS } from "@/constants";
import { Save } from "lucide-react";
import { getMyCard, updateMyCard } from "@/app/actions/cards.actions";
import { updateProfilePhoto } from "@/app/actions/uploads.actions";
import type { SocialLinks, CardProfileForm } from "@/types";

type FormState = CardProfileForm & {
  full_name: string;
  company: string;
  department: string;
  company_social_links: SocialLinks;
  avatar_url?: string | null;
  card_slug: string;
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
};

export default function ProfilePage() {
  const [form, setForm] = useState(EMPTY_FORM);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  // Load real data on mount
  useEffect(() => {
    async function load() {
      const result = await getMyCard();
      if (result.success && result.data) {
        const card = result.data;
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

  async function save() {
    setSaving(true);
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
    });
    setSaving(false);
    if (result.success) {
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
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
                    <Input label="Company" placeholder="Where you work" value={form.company} onChange={set("company")} hint="Type a company name" />
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

          {/* Social links */}
          <SectionCard title="Social links" subtitle="Add any you want shown on your card.">
            <div className="space-y-3">
              {SOCIAL_LINKS.map(({ key, label, placeholder }) => (
                <Input key={key} label={label} placeholder={placeholder} value={(form.social_links as SocialLinks)[key] ?? ""} onChange={setSocial(key)} />
              ))}
            </div>
          </SectionCard>

          {/* Card accent color */}
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

          <Button variant="primary" size="lg" className="w-full" loading={saving} onClick={save} leftIcon={!saving ? <Save className="h-4 w-4" /> : undefined}
            style={saved ? { backgroundColor: "#059669" } : {}}>
            {saved ? "Changes saved!" : "Save changes"}
          </Button>
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
            />
          </div>
        </div>
      </div>
    </div>
  );
}
