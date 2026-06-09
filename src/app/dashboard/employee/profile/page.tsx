"use client";

import { useState, useEffect } from "react";
import { PageHeader, SectionCard } from "@/components/dashboard/DashboardShared";
import { Input, Textarea } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { ImageUpload } from "@/components/ui/ImageUpload";
import { CardPreview } from "@/components/cards/CardPreview";
import { SOCIAL_LINKS } from "@/constants";
import { Save, Upload } from "lucide-react";
import { getMyCard, updateMyCard } from "@/app/actions/cards.actions";
import { updateProfilePhoto } from "@/app/actions/uploads.actions";
import type { SocialLinks, CardProfileForm } from "@/types";

const EMPTY_FORM: CardProfileForm & { full_name: string; company: string; avatar_url?: string | null; card_slug: string } = {
  full_name:   "",
  job_title:   "",
  company:     "",
  phone:       "",
  email_public:"",
  bio:         "",
  theme_color: "#064E3B",
  social_links: { linkedin: "", twitter: "", whatsapp: "", instagram: "", website: "" },
  avatar_url:  null,
  card_slug:   "",
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
          job_title:    card.job_title ?? "",
          company:      card.primary_company?.name ?? "",
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
          avatar_url: card.profile.avatar_url,
          card_slug:   card.slug,
        });
      }
      setLoading(false);
    }
    load();
  }, []);

  const set = (field: keyof typeof form) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm(f => ({ ...f, [field]: e.target.value }));

  const setSocial = (key: keyof SocialLinks) =>
    (e: React.ChangeEvent<HTMLInputElement>) =>
      setForm(f => ({ ...f, social_links: { ...f.social_links, [key]: e.target.value } }));

  async function save() {
    setSaving(true);
    const result = await updateMyCard({
      job_title:    form.job_title,
      phone:        form.phone,
      email_public: form.email_public,
      bio:          form.bio,
      theme_color:  form.theme_color,
      social_links: form.social_links,
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

          {/* Photo — wired to R2 */}
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
                <Input label="Job title" placeholder="e.g. Software Engineer" value={form.job_title} onChange={set("job_title")} />
                <Input label="Company" placeholder="Where you work" value={form.company} onChange={set("company")} />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input label="Phone" type="tel" placeholder="+250 7XX XXX XXX" value={form.phone} onChange={set("phone")} />
                <Input label="Email" type="email" value={form.email_public} onChange={set("email_public")} hint="Shown on your card" />
              </div>
              <Textarea label="Bio" placeholder="Tell visitors about yourself..." value={form.bio} onChange={set("bio")} hint="Keep it under 200 characters for best display." className="min-h-[90px]" />
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
            <CardPreview name={form.full_name} jobTitle={form.job_title} company={form.company} bio={form.bio} phone={form.phone} accentColor={form.theme_color} socialLinks={form.social_links} cardSlug={form.card_slug} avatarUrl={form.avatar_url} />
          </div>
        </div>
      </div>
    </div>
  );
}
