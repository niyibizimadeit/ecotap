# EcoTap (production)

**EcoTap** is a B2B SaaS platform that provides smart NFC + QR digital business cards for companies and individuals. Companies onboard their employees; individuals and freelancers can register independently. Every cardholder gets a unique public profile page and a physical NFC card fulfilled by EcoTap.

**Live:** [ecotap.rw](https://ecotap.rw) · **Deployed on:** Vercel · **Backend:** Supabase

---

## What it does

- Companies register, get reviewed by the Super Admin, and onboard their employees
- Employees and freelancers can self-register and order physical NFC cards
- Every cardholder gets a public page at `ecotap.rw/[slug]/[employee]` or `ecotap.rw/[slug]`
- Visitors tap an NFC chip or scan a QR code → see the profile → save contact as `.vcf`
- Any cardholder can host a live event and run the door from their own phone — NFC tap on Android, QR scan on iPhone — then export attendance as `.xlsx`
- Super Admin manages approvals, card orders, card designs, and billing
- Company admins pay manually via Mobile Money (Momo) and upload a payment screenshot for approval

---

## Tech stack

| Layer | Choice |
|---|---|
| Frontend | **Next.js 16.2.7** (App Router) + **React 19** + TypeScript |
| Styling | Tailwind CSS v4 — tokens via `@theme` in `src/styles/globals.css` |
| Backend / DB | Supabase (Postgres + Auth) |
| Image storage | Cloudflare R2 via `@aws-sdk/client-s3` (S3-compatible) |
| Forms | `react-hook-form` + `zod` |
| QR generation | `qrcode.react` |
| vCard | custom `lib/vcf` generator |
| Deployment | Vercel |

> Supabase **Storage is not used** — all user-uploaded images (profile photos, company logos, card designs, payment screenshots) go to Cloudflare R2.

---

## Documentation map

| Document | What it covers |
|---|---|
| **`Instructions.md`** | Architecture, SSOT layers, coding conventions, business rules. **Read this before writing code.** |
| **`Roadmap.md`** | Designed-but-not-yet-built features (analytics/ML, notifications, environmental reports) |
| **`Status.md`** | Where the project actually stands — known open bugs and risks |
| **`fixes.md`** | Full audit: applied fixes + open bug backlog (B/H/M severity tiers) |
| **`Todo.md`** | Original 15-phase build plan (historical — partially stale) |
| **`Demo accounts.md`** | Seeded test credentials for each dashboard |

For navigating the codebase, a prebuilt knowledge graph lives in `graphify-out/` — see `CLAUDE.md` for the `graphify query` / `explain` / `path` commands.

---

## User roles

| Role | Description |
|---|---|
| `super_admin` | Platform owner — approves users, manages designs, fulfills orders |
| `country_rep` | Regional rep — **read-only** view of users/companies in their country |
| `company_admin` | Manages employees and company branding |
| `employee` | Cardholder linked to a company |
| `individual` | Freelancer / solo cardholder, not linked to a company |
| Visitor | No account — views public card pages only |

---

## URL structure

```
ecotap.rw/[slug]/[employee]   ← company employee card
ecotap.rw/[slug]              ← individual / freelancer card
```

There are two separate sign-in flows: `/org/login` + `/org/register` for companies and their admins, and `/login` + `/register` for employees and individuals.

---

## Project structure

```
src/
  app/
    (marketing)/          # Home, about, contact, pricing, impact, legal
    (auth)/               # Login, register, org/ flows, verify, password reset
    dashboard/
      admin/              # Super Admin + Country Rep panel
      company/            # Company Admin panel
      employee/           # Employee / Individual panel
    [slug]/               # Public individual card page
    [slug]/[employee]/    # Public company employee card page
    actions/              # All Server Actions (one file per domain)
    api/
      vcf/[slug]/         # vCard (.vcf) download endpoint
      events/             # Attendance export — authenticated, generated on demand
    dev/components/       # UI primitive sandbox — see Status.md, currently public
  components/
    ui/                   # Shared design system primitives
    cards/                # Card profile + interaction components
    dashboard/            # Dashboard-shared building blocks
    orders/               # Order flow components
    events/               # Event check-in: door screen, lists, exports
    analytics/            # Page view tracking
    auth/ layout/ brand/
  lib/
    supabase/             # Repositories + Supabase client/server/middleware helpers
    services/             # Business logic services
    validations/          # zod schemas (auth + events)
    r2/                   # Cloudflare R2 upload helpers
    export/                # XLSX + ZIP writers (server-only)
    vcf/                  # vCard (.vcf) generator
    utils/                # General helpers
  types/                  # Global TypeScript types
  constants/              # Roles, statuses, routes
scripts/
  seed-demo-users.ts      # Seeds demo accounts — see Getting started
supabase/
  FULL_SCHEMA.sql         # Complete base schema — run this FIRST
  migrations/             # Incremental migrations 011 → 022
  email-templates/        # Supabase Auth email templates (HTML)
  subscription_upgrade.sql
```

> `src/lib/email/`, `src/lib/qr/`, `src/lib/mock/` and `src/hooks/` do **not** exist. Older revisions of the docs referenced them.

---

## Getting started

```bash
git clone https://github.com/niyizibimadeit/ecotap
cd ecotap
npm install
cp .env.example .env.local
# fill in the values — see Environment variables below
npm run dev
```

Runs on Turbopack (`next dev --turbo`). App is at http://localhost:3000.

### Setting up the database

**This is a two-step process and the order matters.**

1. **Base schema.** Open `supabase/FULL_SCHEMA.sql`, paste the whole file into the Supabase SQL Editor, and run it. This creates the extensions, enums, all core tables, indexes, triggers and RLS policies. It is safe to run from scratch on an empty database.

2. **Incremental migrations.** Apply everything in `supabase/migrations/` (currently `011` → `022`), in filename order:

   ```bash
   supabase db push
   ```

> **Why step 1 is required:** the migrations directory only contains `011` onward. The `001`–`010` migrations are not standalone files — their combined contents live inside `FULL_SCHEMA.sql`. Running `supabase db push` against a fresh project without step 1 produces a partial, broken schema.

If applying to an already-running database, `supabase/subscription_upgrade.sql` is a standalone, idempotent script for the subscription payment flow. It is safe to re-run.

### Seeding demo accounts

```bash
npx tsx scripts/seed-demo-users.ts
```

Uses the service role key from `.env.local`. Creates one account per dashboard — see `Demo accounts.md` for the resulting credentials.

---

## Environment variables

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
NEXT_PUBLIC_SITE_URL=http://localhost:3000

R2_ENDPOINT=
R2_ACCESS_KEY_ID=
R2_SECRET_ACCESS_KEY=
R2_BUCKET_NAME=
R2_PUBLIC_URL=
```

`SUPABASE_SERVICE_ROLE_KEY` bypasses Row Level Security — server-only, never expose it to the client.

The `R2_*` block is only needed for image uploads. Without it, uploads return a generic failure but the rest of the app runs normally. `R2_PUBLIC_URL` must match the hostname allowed in `next.config.ts` → `images.remotePatterns`.

---

## Database

Core tables: `profiles`, `companies`, `country_reps`, `profile_companies`, `departments`, `invitations`, `cards`, `card_groups`, `card_designs`, `card_orders`, `events`, `event_visits`, `card_events`, `contact_exchanges`, `daily_card_stats`, `profile_activity`, `card_scores`, `ab_test_assignments`, `billing_plans`, `company_subscriptions`, `notifications`, `environmental_reports`

Several of the analytics tables are created but not yet written to — see `Roadmap.md`.

---

## Deployment

Push to `main` → Vercel auto-deploys. Preview deployments are created for every PR.

Set all environment variables in the Vercel dashboard under **Settings → Environment Variables**. There is no `vercel.json`; configuration lives in `next.config.ts`.

---

## Testing

There is currently **no test framework and no CI**. Everything is verified manually. See `Status.md`.

---

Built by [AZ Soft Solutions](https://azsoftsolutions.com) · Kigali, Rwanda
