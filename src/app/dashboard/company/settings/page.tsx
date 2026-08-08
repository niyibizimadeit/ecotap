"use client";

// src/app/dashboard/company/settings/page.tsx
//
// Client Component because it owns live state: the color picker, form fields,
// and card preview all update as the user types. Data is loaded via a single
// Server Action call on mount (not a dynamic import — that pattern is fragile).

import { useState, useEffect, useTransition } from "react";
import { PageHeader, SectionCard } from "@/components/dashboard/DashboardShared";
import { Input, Textarea } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { ImageUpload } from "@/components/ui/ImageUpload";
import { Save } from "lucide-react";
import { INDUSTRIES } from "@/constants";
import { updateCompanyLogo } from "@/app/actions/uploads.actions";
import { getCompanyDashboardData, updateMyCompany } from "@/app/actions/company.actions";

const PRESET_COLORS = [
  "#064E3B",
  "#1e3a5f",
  "#7c2d12",
  "#1a1a2e",
  "#374151",
  "#6b21a8",
  "#b45309",
  "#0f766e",
];

interface FormState {
  name: string;
  slug: string;
  industry: string;
  website: string;
  description: string;
  brand_color: string;
  theme_locked: boolean;
  org_locked: boolean;
  job_title_locked: boolean;
  groups_locked: boolean;
}

const DEFAULT_FORM: FormState = {
  name: "",
  slug: "",
  industry: "",
  website: "",
  description: "",
  brand_color: "#064E3B",
  theme_locked: false,
  org_locked: false,
  job_title_locked: false,
  groups_locked: false,
};

export default function CompanySettingsPage() {
  const [form, setForm] = useState<FormState>(DEFAULT_FORM);
  const [companyId, setCompanyId] = useState<string>("");
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  // Load company data once on mount via the shared action
  useEffect(() => {
    getCompanyDashboardData().then((result) => {
      if (!result.success) return;
      const { company } = result.data;
      setCompanyId(company.id);
      setLogoUrl(company.logo_url);
      setForm({
        name: company.name,
        slug: company.slug,
        industry: company.industry ?? "",
        website: company.website ?? "",
        description: company.description ?? "",
        brand_color: company.brand_color,
        theme_locked: company.theme_locked,
        org_locked: company.org_locked,
        job_title_locked: company.job_title_locked,
        groups_locked: company.groups_locked,
      });
    });
  }, []);

  function set<K extends keyof FormState>(field: K) {
    return (
      e: React.ChangeEvent<
        HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
      >
    ) => setForm((f) => ({ ...f, [field]: e.target.value }));
  }

  function handleSave() {
    setError(null);
    startTransition(async () => {
      const result = await updateMyCompany({
        name: form.name,
        slug: form.slug,
        industry: form.industry || undefined,
        website: form.website || undefined,
        description: form.description || undefined,
        brand_color: form.brand_color,
        theme_locked: form.theme_locked,
        org_locked: form.org_locked,
        job_title_locked: form.job_title_locked,
        groups_locked: form.groups_locked,
      });

      if (result.success) {
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
      } else {
        setError(result.error ?? "Failed to save. Try again.");
      }
    });
  }

  const saveButtonStyle = saved ? { backgroundColor: "#059669" } : {};

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
            loading={isPending}
            leftIcon={!isPending ? <Save className="h-3.5 w-3.5" /> : undefined}
            onClick={handleSave}
            style={saveButtonStyle}
          >
            {saved ? "Saved!" : "Save changes"}
          </Button>
        }
      />

      {error && (
        <p className="mb-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
          {error}
        </p>
      )}

      <div className="space-y-5 max-w-2xl">

        {/* Logo */}
        <SectionCard
          title="Company logo"
          subtitle="Shown on all employee cards and the company page."
        >
          <div className="flex items-center gap-5">
            <ImageUpload
              currentUrl={logoUrl}
              size="sm"
              onUpload={async (formData) => {
                if (!companyId)
                  return { success: false, error: "Company not loaded yet." };
                return updateCompanyLogo(companyId, formData);
              }}
              onUploaded={(url) => setLogoUrl(url)}
            />
            <div>
              <p className="text-sm text-ink-mid font-medium">Upload a logo</p>
              <p className="text-xs text-ink-light mt-1">
                PNG or SVG, min 200×200px. Up to 5 MB.
              </p>
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
                hint={`Your URL: ecotap.rw/${form.slug || "your-company"}/employee`}
              />
              <div>
                <label className="text-sm font-medium text-ink-mid block mb-1.5">
                  Industry
                </label>
                <select
                  className="w-full h-10 bg-cream rounded-xl px-3 text-sm text-ink focus:outline-none focus:border-emerald-bright appearance-none"
                  style={{ border: "1px solid #F0E6D3" }}
                  value={form.industry}
                  onChange={set("industry")}
                >
                  <option value="">Select industry</option>
                  {INDUSTRIES.map((i) => (
                    <option key={i} value={i}>
                      {i}
                    </option>
                  ))}
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
        <SectionCard
          title="Brand colour"
          subtitle="Applied to all employee card accents."
        >
          <div className="space-y-4">
            <div className="flex gap-2 flex-wrap">
              {PRESET_COLORS.map((color) => (
                <button
                  key={color}
                  onClick={() => setForm((f) => ({ ...f, brand_color: color }))}
                  className="w-10 h-10 rounded-xl border-2 transition-all hover:scale-110"
                  style={{
                    backgroundColor: color,
                    borderColor:
                      form.brand_color === color ? "#059669" : "transparent",
                    boxShadow:
                      form.brand_color === color
                        ? "0 0 0 3px rgba(5,150,105,0.25)"
                        : "none",
                  }}
                />
              ))}
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={form.brand_color}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, brand_color: e.target.value }))
                  }
                  className="w-10 h-10 rounded-xl border border-cream-dark cursor-pointer p-0.5"
                />
                <span className="text-xs font-mono text-ink-light">
                  {form.brand_color}
                </span>
              </div>
            </div>

            {/* Theme lock toggle */}
            <label className="flex items-center gap-3 cursor-pointer">
              <div className="relative">
                <input
                  type="checkbox"
                  className="sr-only"
                  checked={form.theme_locked}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, theme_locked: e.target.checked }))
                  }
                />
                <div
                  className="w-10 h-5 rounded-full transition-colors"
                  style={{
                    backgroundColor: form.theme_locked ? "#064E3B" : "#D4D0CA",
                  }}
                />
                <div
                  className="absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform"
                  style={{
                    transform: form.theme_locked
                      ? "translateX(20px)"
                      : "translateX(0)",
                  }}
                />
              </div>
              <div>
                <p className="text-sm font-medium text-ink">Lock brand colour</p>
                <p className="text-xs text-ink-light">
                  Employees cannot override the colour on their own cards.
                </p>
              </div>
            </label>

            {/* ── Employee lock toggles ── */}
            <div
              className="border-t pt-4 mt-2"
              style={{ borderColor: "rgba(6,78,59,0.08)" }}
            >
              <p className="text-xs font-mono tracking-widest text-ink-light uppercase mb-3">
                Employee Restrictions
              </p>

              {/* Lock organization */}
              <label className="flex items-center gap-3 cursor-pointer mb-3">
                <div className="relative">
                  <input
                    type="checkbox"
                    className="sr-only"
                    checked={form.org_locked}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, org_locked: e.target.checked }))
                    }
                  />
                  <div
                    className="w-10 h-5 rounded-full transition-colors"
                    style={{
                      backgroundColor: form.org_locked ? "#064E3B" : "#D4D0CA",
                    }}
                  />
                  <div
                    className="absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform"
                    style={{
                      transform: form.org_locked
                        ? "translateX(20px)"
                        : "translateX(0)",
                    }}
                  />
                </div>
                <div>
                  <p className="text-sm font-medium text-ink">Lock organization</p>
                  <p className="text-xs text-ink-light">
                    Employees cannot change their primary organization on their card.
                  </p>
                </div>
              </label>

              {/* Lock job title */}
              <label className="flex items-center gap-3 cursor-pointer mb-3">
                <div className="relative">
                  <input
                    type="checkbox"
                    className="sr-only"
                    checked={form.job_title_locked}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, job_title_locked: e.target.checked }))
                    }
                  />
                  <div
                    className="w-10 h-5 rounded-full transition-colors"
                    style={{
                      backgroundColor: form.job_title_locked ? "#064E3B" : "#D4D0CA",
                    }}
                  />
                  <div
                    className="absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform"
                    style={{
                      transform: form.job_title_locked
                        ? "translateX(20px)"
                        : "translateX(0)",
                    }}
                  />
                </div>
                <div>
                  <p className="text-sm font-medium text-ink">Lock job titles</p>
                  <p className="text-xs text-ink-light">
                    Employees cannot edit their job title or position.
                  </p>
                </div>
              </label>

              {/* Lock groups */}
              <label className="flex items-center gap-3 cursor-pointer">
                <div className="relative">
                  <input
                    type="checkbox"
                    className="sr-only"
                    checked={form.groups_locked}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, groups_locked: e.target.checked }))
                    }
                  />
                  <div
                    className="w-10 h-5 rounded-full transition-colors"
                    style={{
                      backgroundColor: form.groups_locked ? "#064E3B" : "#D4D0CA",
                    }}
                  />
                  <div
                    className="absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform"
                    style={{
                      transform: form.groups_locked
                        ? "translateX(20px)"
                        : "translateX(0)",
                    }}
                  />
                </div>
                <div>
                  <p className="text-sm font-medium text-ink">Lock groups &amp; affiliations</p>
                  <p className="text-xs text-ink-light">
                    Employees cannot add or remove card affiliation groups.
                  </p>
                </div>
              </label>
            </div>

            {/* Live card preview */}
            <div>
              <p className="text-xs text-ink-light mb-2">
                Preview on employee card
              </p>
              <div
                className="rounded-2xl overflow-hidden border"
                style={{ borderColor: "rgba(6,78,59,0.08)" }}
              >
                <div
                  className="h-10"
                  style={{ backgroundColor: form.brand_color }}
                />
                <div
                  className="px-4 py-3 flex items-center gap-3"
                  style={{ backgroundColor: "#FEF9EF" }}
                >
                  <div
                    className="w-10 h-10 rounded-xl -mt-6 flex items-center justify-center text-xs font-semibold font-serif border-2"
                    style={{
                      backgroundColor: form.brand_color,
                      color: "#FEFCE8",
                      borderColor: "#FEF9EF",
                    }}
                  >
                    {form.name
                      .split(" ")
                      .map((w) => w[0])
                      .join("")
                      .slice(0, 2) || "AB"}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-emerald-deep">
                      Employee Name
                    </p>
                    <p className="text-xs text-ink-light">
                      {form.name || "Your Company"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </SectionCard>

        {/* Bottom save button */}
        <Button
          variant="primary"
          size="lg"
          className="w-full"
          loading={isPending}
          onClick={handleSave}
          leftIcon={!isPending ? <Save className="h-4 w-4" /> : undefined}
          style={saveButtonStyle}
        >
          {saved ? "Changes saved!" : "Save changes"}
        </Button>
      </div>
    </div>
  );
}