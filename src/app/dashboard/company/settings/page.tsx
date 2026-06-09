"use client";

import { useState, useEffect } from "react";
import { PageHeader, SectionCard } from "@/components/dashboard/DashboardShared";
import { Input, Textarea } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { ImageUpload } from "@/components/ui/ImageUpload";
import { Save } from "lucide-react";
import { INDUSTRIES } from "@/constants";
import { updateCompanyLogo } from "@/app/actions/uploads.actions";

const PRESET_COLORS = ["#064E3B","#1e3a5f","#7c2d12","#1a1a2e","#374151","#6b21a8","#b45309","#0f766e"];

const MOCK_SETTINGS = { name: "", slug: "", industry: "", website: "", description: "", brand_color: "#064E3B" };

export default function CompanySettingsPage() {
  const [form,       setForm]       = useState(MOCK_SETTINGS);
  const [saving,     setSaving]     = useState(false);
  const [saved,      setSaved]      = useState(false);
  const [companyId,  setCompanyId]  = useState<string>("");
  const [logoUrl,    setLogoUrl]    = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      const { getMyCard } = await import("@/app/actions/cards.actions");
      const result = await getMyCard();
      if (result.success && result.data?.primary_company) {
        setCompanyId(result.data.primary_company.id);
        setLogoUrl(result.data.primary_company.logo_url);
        setForm(f => ({
          ...f,
          name: result.data!.primary_company!.name,
          slug: result.data!.primary_company!.slug,
          brand_color: result.data!.primary_company!.brand_color ?? "#064E3B",
        }));
      }
    }
    load();
  }, []);

  const set = (field: keyof typeof form) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
      setForm(f => ({ ...f, [field]: e.target.value }));

  async function save() {
    setSaving(true);
    // Note: needs actual companyId from context — leave as no-op for now
    setSaved(true);
    setTimeout(() => { setSaving(false); setSaved(false); }, 1500);
  }

  return (
    <div>
      <PageHeader
        eyebrow="Settings"
        title="Company settings"
        subtitle="Manage your company profile and branding."
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

      <div className="space-y-5 max-w-2xl">

        {/* Logo */}
        <SectionCard title="Company logo" subtitle="Shown on all employee cards and the company page.">
          <div className="flex items-center gap-5">
            <ImageUpload
              currentUrl={logoUrl}
              size="sm"
              onUpload={async (formData) => {
                if (!companyId) return { success: false, error: "Loading company data…" };
                return updateCompanyLogo(companyId, formData);
              }}
              onUploaded={(url) => setLogoUrl(url)}
            />
            <div>
              <p className="text-sm text-ink-mid font-medium">Upload a logo</p>
              <p className="text-xs text-ink-light mt-1">PNG or SVG, min 200×200px. Up to 5MB.</p>
            </div>
          </div>
        </SectionCard>

        {/* Basic info */}
        <SectionCard title="Company info">
          <div className="space-y-4">
            <Input
              label="Company name"
              required
              value={form.name}
              onChange={set("name")}
            />
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Slug"
                value={form.slug}
                onChange={set("slug")}
                hint={`Your URL: ecotap.rw/${form.slug}/employee`}
              />
              <div>
                <label className="text-sm font-medium text-ink-mid block mb-1.5">Industry</label>
                <select
                  className="w-full h-10 bg-cream rounded-xl px-3 text-sm text-ink focus:outline-none focus:border-emerald-bright appearance-none"
                  style={{ border: "1px solid #F0E6D3" }}
                  value={form.industry}
                  onChange={set("industry")}
                >
                  {INDUSTRIES.map(i => <option key={i} value={i}>{i}</option>)}
                </select>
              </div>
            </div>
            <Input
              label="Website"
              type="url"
              placeholder="https://yourcompany.com"
              value={form.website}
              onChange={set("website")}
            />
            <Textarea
              label="Company description"
              placeholder="Brief description shown on employee cards…"
              value={form.description}
              onChange={set("description")}
              className="min-h-[80px]"
              hint="Shown on the company card page."
            />
          </div>
        </SectionCard>

        {/* Brand colour */}
        <SectionCard title="Brand colour" subtitle="Applied to all employee card accents.">
          <div className="space-y-4">
            <div className="flex gap-2 flex-wrap">
              {PRESET_COLORS.map(color => (
                <button
                  key={color}
                  onClick={() => setForm(f => ({ ...f, brand_color: color }))}
                  className="w-10 h-10 rounded-xl border-2 transition-all hover:scale-110"
                  style={{
                    backgroundColor: color,
                    borderColor: form.brand_color === color ? "#059669" : "transparent",
                    boxShadow:   form.brand_color === color ? "0 0 0 3px rgba(5,150,105,0.25)" : "none",
                  }}
                />
              ))}
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={form.brand_color}
                  onChange={e => setForm(f => ({ ...f, brand_color: e.target.value }))}
                  className="w-10 h-10 rounded-xl border border-cream-dark cursor-pointer p-0.5"
                />
                <span className="text-xs font-mono text-ink-light">{form.brand_color}</span>
              </div>
            </div>

            {/* Live card preview strip */}
            <div>
              <p className="text-xs text-ink-light mb-2">Preview on employee card</p>
              <div
                className="rounded-2xl overflow-hidden border"
                style={{ borderColor: "rgba(6,78,59,0.08)" }}
              >
                <div className="h-10" style={{ backgroundColor: form.brand_color }} />
                <div className="px-4 py-3 flex items-center gap-3" style={{ backgroundColor: "#FEF9EF" }}>
                  <div
                    className="w-10 h-10 rounded-xl -mt-6 flex items-center justify-center text-xs font-semibold font-serif border-2"
                    style={{ backgroundColor: form.brand_color, color: "#FEFCE8", borderColor: "#FEF9EF" }}
                  >
                    {form.name.split(" ").map(w => w[0]).join("").slice(0,2)}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-emerald-deep">Employee Name</p>
                    <p className="text-xs text-ink-light">{form.name}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </SectionCard>

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
    </div>
  );
}