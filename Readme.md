# EcoTap (production)

**EcoTap** is a B2B SaaS platform that provides smart NFC + QR digital business cards for companies and individuals. Companies onboard their employees; individuals and freelancers can register independently. Every cardholder gets a unique public profile page and a physical NFC card fulfilled by EcoTap.

**Live:** [ecotap.rw](https://ecotap.rw) · **Deployed on:** Vercel · **Backend:** Supabase

---

## What it does

- Companies register, get reviewed by the Super Admin, and onboard their employees
- Employees and freelancers can self-register and order physical NFC cards
- Every cardholder gets a public page at `ecotap.rw/[company]/[username]` or `ecotap.rw/[username]`
- Visitors tap an NFC chip or scan a QR code → see the profile → save contact as `.vcf`
- Super Admin manages approvals, card orders, card designs, and billing

---

## Tech stack

| Layer | Choice |
|---|---|
| Frontend | Next.js 14 (App Router) + TypeScript |
| Styling | Tailwind CSS |
| Backend / DB | Supabase (Postgres + Auth + Storage) |
| Image storage | Cloudflare R2 |
| QR generation | `qrcode.react` |
| vCard | custom `lib/vcf` generator |
| Deployment | Vercel |

---

## User roles

| Role | Description |
|---|---|
| `super_admin` | Platform owner — approves users, manages designs, fulfills orders |
| `company_admin` | Manages employees and company branding |
| `employee` | Cardholder linked to a company |
| `individual` | Freelancer / solo cardholder, not linked to a company |
| Visitor | No account — views public card pages only |

---

## URL structure

```
ecotap.rw/[company-slug]/[employee-username]   ← company employee card
ecotap.rw/[username]                           ← individual / freelancer card
```

---

## Project structure

```
src/
  app/
    (marketing)/          # Home, about, contact
    (auth)/               # Login + register flows
    dashboard/
      admin/              # Super Admin panel
      company/            # Company Admin panel
      employee/           # Employee / Individual panel
    [username]/           # Public individual card page
    [company]/
      [employee]/         # Public company employee card page
  components/
    ui/                   # Shared design system components
    cards/                # Card profile components
    dashboard/            # Dashboard-specific components
  lib/
    supabase/             # Client, server, middleware helpers
    vcf/                  # vCard (.vcf) generator
    qr/                   # QR code utilities
    utils/                # General helpers
  types/                  # Global TypeScript types
```

---

## Getting started

```bash
git clone https://github.com/niyibizimadeit/ecotap
cd ecotap
npm install
cp .env.example .env.local
# fill in Supabase URL, anon key, service role key
npm run dev
```

---

## Environment variables

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
NEXT_PUBLIC_SITE_URL=https://ecotap.rw
CLOUDFLARE_R2_BUCKET=
CLOUDFLARE_R2_ENDPOINT=
CLOUDFLARE_R2_ACCESS_KEY=
CLOUDFLARE_R2_SECRET_KEY=
```

---

## Database

Migrations live in `supabase/migrations/`. Run them via:

```bash
supabase db push
```

Core tables: `profiles`, `companies`, `departments`, `cards`, `card_designs`, `card_orders`, `contact_exchanges`, `billing_plans`, `company_subscriptions`

---

## Deployment

Push to `main` → Vercel auto-deploys. Preview deployments are created for every PR.

Set all environment variables in the Vercel dashboard under **Settings → Environment Variables**.

---

Built by [AZ Soft Solutions](https://azsoftsolutions.com) · Kigali, Rwanda