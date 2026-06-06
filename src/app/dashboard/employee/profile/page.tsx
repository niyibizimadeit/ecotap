"use client";

import { useState } from "react";
import { PageHeader, SectionCard } from "@/components/dashboard/DashboardShared";
import { Input, Textarea } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { CardPreview } from "@/components/cards/CardPreview";
import { SOCIAL_LINKS } from "@/constants";
import { Save, Upload } from "lucide-react";
import type { SocialLinks } from "@/types";

const MOCK_PROFILE = {
  full_name:   "Prince Niyibizi",
  job_title:   "Founder & CEO",
  company:     "AZ Soft Solutions",
  phone:       "+250 788 123 456",
  email:       "prince@azsoftsolutions.com",
  bio:         "Founder & software engineer building tech for Rwanda. Co-founder of AZ Soft Solutions and creator of GiraXpress.",
  accent_color: "#064E3B",
  social_links: {
    linkedin:  "https://linkedin.com/in/prince-niyibizi",
    twitter:   "https://x.com/princeniyibizi",
    whatsapp:  "+250788123456",
    instagram: "",
    website:   "https://azsoftsolutions.com",
  } as SocialLinks,
};

export default function ProfilePage() {
  const [form, setForm] = useState(MOCK_PROFILE);
  const [saving, setSaving] = useState(false);
  const [saved,  setSaved]  = useState(false);

  const set = (field: keyof typeof form) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm(f => ({ ...f, [field]: e.target.value }));

  const setSocial = (key: keyof SocialLinks) =>
    (e: React.ChangeEvent<HTMLInputElement>) =>
      setForm(f => ({ ...f, social_links: { ...f.social_links, [key]: e.target.value } }));

  async function save() {
    setSaving(true);
    await new Promise(r => setTimeout(r, 900)); // Phase 12: real action
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
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

        {/* ── Form — left ── */}
        <div className="xl:col-span-3 space-y-5">

          {/* Photo */}
          <SectionCard title="Profile photo" subtitle="Shown on your public card.">
            <div className="flex items-center gap-5">
              <div
                className="w-20 h-20 rounded-2xl flex items-center justify-center font-serif text-2xl font-semibold flex-shrink-0"
                style={{ backgroundColor: form.accent_color, color: "#FEFCE8" }}
              >
                {form.full_name.split(" ").map(n => n[0]).join("")}
              </div>
              <div>
                <Button variant="secondary" size="sm" leftIcon={<Upload className="h-3.5 w-3.5" />}>
                  Upload photo
                </Button>
                <p className="text-xs text-ink-light mt-2">JPG, PNG up to 5MB. Wired in Phase 13.</p>
              </div>
            </div>
          </SectionCard>

          {/* Basic info */}
          <SectionCard title="Basic info">
            <div className="space-y-4">
              <Input
                label="Full name"
                required
                value={form.full_name}
                onChange={set("full_name")}
              />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Job title"
                  placeholder="e.g. Software Engineer"
                  value={form.job_title}
                  onChange={set("job_title")}
                />
                <Input
                  label="Company"
                  placeholder="Where you work"
                  value={form.company}
                  onChange={set("company")}
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Phone"
                  type="tel"
                  placeholder="+250 7XX XXX XXX"
                  value={form.phone}
                  onChange={set("phone")}
                />
                <Input
                  label="Email"
                  type="email"
                  value={form.email}
                  onChange={set("email")}
                  hint="Shown on your card"
                />
              </div>
              <Textarea
                label="Bio"
                placeholder="Tell visitors about yourself..."
                value={form.bio}
                onChange={set("bio")}
                hint="Keep it under 200 characters for best display."
                className="min-h-[90px]"
              />
            </div>
          </SectionCard>

          {/* Social links */}
          <SectionCard title="Social links" subtitle="Add any you want shown on your card.">
            <div className="space-y-3">
              {SOCIAL_LINKS.map(({ key, label, placeholder }) => (
                <Input
                  key={key}
                  label={label}
                  placeholder={placeholder}
                  value={(form.social_links as SocialLinks)[key] ?? ""}
                  onChange={setSocial(key)}
                />
              ))}
            </div>
          </SectionCard>

          {/* Card accent color */}
          <SectionCard title="Card colour" subtitle="Sets your card's accent colour.">
            <div className="flex items-center gap-4 flex-wrap">
              {["#064E3B", "#065F46", "#1e3a5f", "#7c2d12", "#1a1a2e", "#374151"].map(color => (
                <button
                  key={color}
                  onClick={() => setForm(f => ({ ...f, accent_color: color }))}
                  className="w-10 h-10 rounded-xl border-2 transition-all hover:scale-110"
                  style={{
                    backgroundColor: color,
                    borderColor: form.accent_color === color ? "#059669" : "transparent",
                    boxShadow: form.accent_color === color ? "0 0 0 3px rgba(5,150,105,0.25)" : "none",
                  }}
                />
              ))}
              <div className="flex items-center gap-2 ml-1">
                <input
                  type="color"
                  value={form.accent_color}
                  onChange={e => setForm(f => ({ ...f, accent_color: e.target.value }))}
                  className="w-10 h-10 rounded-xl border border-cream-dark cursor-pointer p-0.5"
                  title="Custom colour"
                />
                <span className="text-xs font-mono text-ink-light">{form.accent_color}</span>
              </div>
            </div>
          </SectionCard>

          {/* Save — bottom */}
          <Button
            variant="primary"
            size="lg"
            className="w-full"
            loading={saving}
            onClick={save}
            leftIcon={!saving ? <Save className="h-4 w-4" /> : undefined}
            style={saved ? { backgroundColor: "#059669" } : {}}
          >
            {saved ? "Changes saved!" : "Save changes"}
          </Button>
        </div>

        {/* ── Live preview — right ── */}
        <div className="xl:col-span-2">
          <div className="sticky top-8">
            <p className="text-xs font-mono tracking-widest text-ink-light uppercase text-center mb-4">
              Live preview
            </p>
            <CardPreview
              name={form.full_name}
              jobTitle={form.job_title}
              company={form.company}
              bio={form.bio}
              phone={form.phone}
              accentColor={form.accent_color}
              socialLinks={form.social_links}
            />
          </div>
        </div>
      </div>
    </div>
  );
}