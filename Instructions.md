# EcoTap — Architecture & Coding Conventions

This document covers how this codebase is structured, why decisions were made, and how everything fits together. Read this before writing any code.

**Companion documents — this file does not describe them:**

| Document | Covers |
|---|---|
| `Readme.md` | What the product is, tech stack, setup, env vars, deployment |
| `Roadmap.md` | Features that are designed and partly built but **not wired up** (analytics/ML, environmental reports, notifications) |
| `Status.md` | What actually works, and the known open bug/risk list |
| `fixes.md` | Full bug audit and priority fix queue |

If a behaviour is described here but not in `Status.md` as working, verify it in the code before relying on it.

---

## Architecture: SSOT (Single Source of Truth)

EcoTap uses a strict four-layer SSOT architecture. Every piece of data flows in one direction only. No layer skips another.

```
supabase/migrations/     ← Layer 1: Database schema (ground truth)
        ↓
src/lib/supabase/        ← Layer 2: Repositories (all DB access lives here)
        ↓
src/lib/services/        ← Layer 3: Business logic (calls repositories only)
        ↓
src/app/ + components/   ← Layer 4: UI (calls services only, never DB directly)
```

### Layer 1 — Migrations
- Every schema change is a sequentially-numbered `.sql` migration file in `supabase/migrations/`
- Never alter tables manually in the Supabase dashboard — always write a migration
- Migration filenames: `NNN_description.sql` (e.g. `019_employee_locks_and_whatsapp.sql`)
- Once written, a migration file is never edited — add a new one instead
- To deploy: `supabase db push`

> **Important — the migration history starts at `011`.** Migrations `001`–`010` are not standalone files; their combined content lives in `supabase/FULL_SCHEMA.sql`, which is the only complete definition of the base schema. On a fresh database you must run `FULL_SCHEMA.sql` first, then `011`→`021`. See `Readme.md` → Setting up the database. Never assume the migrations directory alone can rebuild the schema from empty.

### Layer 2 — Repositories (`src/lib/supabase/`)
- One file per table: `profiles.repo.ts`, `companies.repo.ts`, `cards.repo.ts`, etc.
- Repositories contain **only** raw Supabase queries — no business logic
- Every function returns typed data using types from `src/types/`
- Example:
  ```ts
  // src/lib/supabase/profiles.repo.ts
  export async function getProfileById(id: string): Promise<Profile | null> {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', id)
      .single()
    if (error) return null
    return data
  }
  ```

### Layer 3 — Services (`src/lib/services/`)
- One file per domain: `onboarding.service.ts`, `cards.service.ts`, `orders.service.ts`, etc.
- Services contain **all** business logic: validation, status transitions, cross-table operations
- Services call repositories only — never query Supabase directly
- Example:
  ```ts
  // src/lib/services/onboarding.service.ts
  export async function approveCompany(companyId: string) {
    const company = await getCompanyById(companyId)
    if (!company) throw new Error('COMPANY_NOT_FOUND')
    if (company.status !== 'pending') throw new Error('INVALID_STATUS_TRANSITION')
    return await updateCompanyStatus(companyId, 'active')
  }
  ```

### Layer 4 — UI
- Server Components fetch data by calling services directly
- Client Components use `useState` + `useTransition` for mutations via Server Actions
- Never import a repository inside a component
- Never write a Supabase query inside a component

---

## Folder conventions

```
src/
  app/
    (marketing)/          # Public marketing pages — no auth
    (auth)/               # Login, register, pending
    dashboard/
      admin/              # Super Admin + Country Rep (read-only for rep)
      company/            # Company Admin
      employee/           # Employee + Individual
    [slug]/               # Public individual card (ecotap.rw/username)
    [slug]/[employee]/    # Public company employee card
    actions/              # All Server Actions (one file per domain)
    api/
      vcf/[slug]/         # vCard download endpoint — the only API route
    dev/components/       # UI primitive sandbox — see the warning below
  components/
    ui/                   # Primitives: Button, Input, Badge, Modal, etc.
    cards/                # Card display + interaction components
    dashboard/            # Shared dashboard components (StatCard, PageHeader)
    orders/               # Order flow components
    analytics/            # Page view tracking
    auth/ layout/ brand/
  lib/
    supabase/             # Repositories + Supabase client/server/middleware helpers
    services/             # Business logic services
    validations/          # zod schemas (currently auth only)
    r2/                   # Cloudflare R2 upload helpers
    vcf/                  # vCard generator
    utils/                # Generic helpers (slugify, formatDate, etc.)
  types/                  # All TypeScript interfaces
  constants/              # Roles, statuses, routes, environmental constants
```

> **Folders that do not exist**, despite appearing in earlier revisions of this document: `lib/email/`, `lib/qr/`, `lib/mock/`, `src/hooks/`, and `src/app/api/events/`. Don't reference them.
>
> **`src/app/dev/components/` is currently publicly reachable in production.** Its own header says it should have been deleted at launch, and `src/middleware.ts` both permits `/dev/` and only matches `/dashboard/:path*` — so middleware never runs for it. See `Status.md` (issue H6).

---

## User roles

| Role | Description | Dashboard access |
|---|---|---|
| `super_admin` | Platform owner. Full access — approve, reject, manage everything. | `/dashboard/admin` — full read/write |
| `country_rep` | Regional representative. Read-only view of all users and companies in their country. Cannot approve, reject, or modify anything. | `/dashboard/admin` — read-only, filtered by country |
| `company_admin` | Legal representative of a company (CEO or HR). Manages employees, can lock card theme, orders cards. | `/dashboard/company` |
| `employee` | Registered under a company that paid for their subscription. Theme is company-controlled if locked. | `/dashboard/employee` |
| `individual` | Self-registered and self-paying. Full control over their card and theme. | `/dashboard/employee` |

### Country representative rules
- Same dashboard UI as Super Admin but all action buttons (Approve, Reject, Edit) are hidden
- Data is filtered to their assigned country only
- Purpose: marketing visibility — see who has registered in their region
- Assigned by Super Admin via the `country_reps` table
- Cannot be a company admin or employee simultaneously

### Company admin registration rules
- Must confirm they are a legal representative of the company (CEO, HR director, or equivalent)
- Confirmation checkbox is required on the registration form
- This is a legal declaration — captured and stored in `companies.legal_rep_confirmed`

---

## Theme control logic

This is the most important business rule in the platform. Theme = the digital card accent colour.

```
Who paid? → Who controls the theme?

Company paid for employee → company_admin controls theme
  └── If company_admin locks the theme → employee CANNOT change theme_color
  └── If company_admin does not lock → employee CAN change theme_color

Individual paid for themselves → individual controls everything
  └── Even if they list a company name on their card
  └── The company has zero control — they are not a subscriber under that company
```

Implementation:
- `companies.theme_locked: boolean` — set by company admin
- Before rendering the theme editor in the employee dashboard, check:
  ```ts
  const canEditTheme = profile.role === 'individual' ||
    !primaryCompany?.theme_locked
  ```
- The theme field is disabled and shows a lock icon if `canEditTheme === false`

---

## Multi-company card feature

A user can be associated with multiple companies on their card:

- `profile_companies` join table — one row per company association
- `is_primary: boolean` — the company shown in the top-right badge on the card
- Any user can add any company name — no confirmation from the company is required
- Companies listed by an individual who paid for their own subscription have zero control over that person's card
- A company only controls the card of employees registered under their paid subscription

---

## Employee invite flow

Company admins can invite employees via one-time-use links:

1. Company admin generates an invite link in their dashboard
2. System creates a row in `invitations` with a unique token + expiry (7 days)
3. Admin shares the link (email/WhatsApp — not automated)
4. Employee clicks the link → registration form is pre-filled with company info
5. On submit, the `invitations` row is marked `accepted` and a `profile_companies` row is created
6. Tokens are single-use and expire after 7 days

---

## Status state machines

Never set status directly in the UI — always go through the service layer. Services guard every transition.

```
profiles:    pending → active → suspended
companies:   pending → active → suspended
card_orders: pending → approved → shipped → delivered
invitations: pending → accepted | expired
```

---

## Authentication

Supabase Auth handles all authentication. There are two distinct mechanisms, and only one of them is a sign-in method.

**1. Password sign-in — the primary and only login method.**
Users register with an email and password, and sign in through `supabase.auth.signInWithPassword` in `signIn()` (`src/app/actions/auth.actions.ts`).

**2. OTP codes — for verification and recovery only.**
Supabase emails a 6-digit one-time code for:
- signup email verification (`/verify`)
- password reset (`/forgot-password` → `/verify-reset` → `/new-password`)

OTP is **not** a standalone login method. There is no passwordless sign-in.

There are two entry points:
- `/org/login` and `/org/register` — companies and their admins
- `/login` and `/register` — employees and individuals

Auth mail (verification and reset only) is sent by **Supabase's built-in mailer**, using the templates checked in at `supabase/email-templates/` (`confirm-signup.html`, `reset-password.html`) and configured in the Supabase dashboard. No application code sends email.

Role and status gating happens in `src/middleware.ts`, which reads `profiles.role` and `profiles.status` and redirects accordingly.

---

## Notifications

**Not implemented.** The application sends no email of its own — there is no mail provider dependency, no mail helper, and no `src/lib/email/`. The only mail leaving the system is Supabase Auth's verification and reset mail described above.

The intended notification triggers are specified in `Roadmap.md` §3. Note that Supabase Auth's mailer can only send auth-related mail, so implementing them requires choosing a separate transactional provider.

---

## Environmental impact & Analytics/ML

Both of these are **designed and partly built, but not wired up to anything running.** They are specified in full in **`Roadmap.md`** — read that before working on either.

In short:

**Environmental impact reports** — the calculation is fully implemented (`ENV` constants and `calcMonthlyImpact()` in `src/constants/index.ts`, plus `generateMonthlyReport` in `src/lib/services/analytics.service.ts`) and the `environmental_reports` table exists. Nothing calls any of it: there is no scheduler, no monthly job, and no delivery. The `/impact` marketing page shows static figures unrelated to this calculation.

**Analytics / ML** — the `card_events`, `daily_card_stats`, `profile_activity`, `card_scores` and `ab_test_assignments` tables exist, and `src/lib/services/analytics.service.ts` exposes a full API over them (`recordCardEvent`, `computeCardScores`, `assignVisitorToTest`, …). **None of it has any call sites.** The only telemetry actually recorded today is `recordPageView` (`src/app/actions/analytics.actions.ts`), which writes `event_type: "view"` with hardcoded `source: "direct"` and `device_type: "unknown"`. There is no NFC/QR attribution, no `vcf_download`/`social_click`/`contact_exchange` capture, no visitor/session cookies, and no geo capture from Vercel headers. There is no nightly rollup job — no `vercel.json`, no cron, no API route — so `daily_card_stats` is only ever read.

Rule that still applies when you do wire these up: **events are fire-and-forget and must never block a render or a user action.** Never surface an analytics error to a user.

---

## Database tables — complete list

### Identity & access
| Table | Purpose |
|---|---|
| `profiles` | One per auth user. Role, status, username, password auth. |
| `companies` | One per registered company. Branding, theme_locked, legal_rep_confirmed. |
| `country_reps` | Links a profile (country_rep role) to a country code. |
| `profile_companies` | Many-to-many. Employee ↔ company with is_primary flag. |
| `departments` | Groups employees within a company. |
| `invitations` | One-time-use invite tokens generated by company admins. |

### Cards & orders
| Table | Purpose |
|---|---|
| `cards` | One per profile. Slug, theme_color, bio, social links, phone, whatsapp. |
| `card_groups` | Groups cards within a company. RLS-scoped to the owning profile. |
| `card_designs` | Physical NFC card designs managed by Super Admin. |
| `card_orders` | A user orders physical NFC cards. Status-tracked to delivery. |

### Analytics & ML
| Table | Purpose |
|---|---|
| `card_events` | Append-only telemetry. Every visitor action. Never deleted. **Only `view` events are written today** — see `Roadmap.md`. |
| `contact_exchanges` | Visitor contact submissions with full metadata. |
| `daily_card_stats` | Pre-aggregated daily rollups per card. **Currently read-only — no job writes to it.** |
| `profile_activity` | Per-profile activity log. Not written to yet. |
| `card_scores` | Computed card-performance scores. Not written to yet. |
| `ab_test_assignments` | Visitor → A/B variant assignment. Not written to yet. |

### Billing & platform
| Table | Purpose |
|---|---|
| `billing_plans` | Pricing plans (monthly/annual, price in RWF). |
| `company_subscriptions` | Which plan a company is on and their employee count. |
| `notifications` | Notification log — email sent flags, type, metadata. **Table only; nothing writes or sends.** |
| `environmental_reports` | Monthly CO₂/water/waste calculations per company. **Nothing generates these yet.** |

> These 20 tables are the complete set. The authoritative definition is `supabase/FULL_SCHEMA.sql` plus `supabase/migrations/011`→`021` (see `Readme.md` → Setting up the database).

---

## TypeScript conventions

- All types live in `src/types/index.ts`
- Use `interface` for object shapes, `type` for unions
- Every DB table has a matching TypeScript interface
- Never use `any` — use `unknown` and narrow if necessary
- **Known exception:** `src/types/database.ts` exports `Database = any` as a deliberate stub, so that Supabase queries compile before the CLI is connected. Repository functions don't rely on it — they return explicit types from `src/types/index.ts`. To remove it:

  ```bash
  npx supabase gen types typescript --linked > src/types/supabase.ts
  ```

  There are ~8 further `any`/`as any` sites in `src/`. See `Status.md`.

---

## Naming conventions

| Thing | Convention | Example |
|---|---|---|
| Files | kebab-case | `card-profile.tsx` |
| Components | PascalCase | `CardProfile` |
| Functions | camelCase | `getCardBySlug` |
| DB columns | snake_case | `company_id` |
| Constants | SCREAMING_SNAKE | `MAX_CARD_QUANTITY` |
| Repo files | `[table].repo.ts` | `cards.repo.ts` |
| Service files | `[domain].service.ts` | `cards.service.ts` |
| Action files | `[domain].actions.ts` | `orders.actions.ts` |

---

## Styling

- Tailwind CSS v4 — custom tokens defined via `@theme` in `globals.css`
- `tailwind.config.ts` only handles content paths, not theme extension
- Inline styles used for dynamic runtime values (brand colours, accent colours)
- Static colour utilities declared explicitly in `globals.css`

```
Color palette:
  emerald-deep:   #064E3B   primary — sidebar backgrounds, headings
  emerald-mid:    #065F46   hover states
  emerald-bright: #059669   CTAs, success badges
  emerald-light:  #D1FAE5   light accent surfaces
  emerald-pale:   #ECFDF5   hover backgrounds
  ivory:          #FEFCE8   page background
  cream:          #FEF9EF   card backgrounds
  cream-dark:     #F5EDD8   borders, table row headers
  gold:           #92400E   warnings, pending badges
  gold-light:     #D97706   badge dots, highlights
  gold-pale:      #FEF3C7   warning backgrounds
  ink:            #1C1917   body text
  ink-mid:        #44403C   secondary text
  ink-light:      #78716C   hints, labels, placeholders
```

---

## Server Actions

- All mutations go through Server Actions in `src/app/actions/`
- One file per domain. The current set is: `admin.actions.ts`, `analytics.actions.ts`, `auth.actions.ts`, `cards.actions.ts`, `company.actions.ts`, `contacts.actions.ts`, `invitations.actions.ts`, `orders.actions.ts`, `public.actions.ts`, `subscription.actions.ts`, `uploads.actions.ts`
- Validate with `zod` before calling services. Schemas live in `src/lib/validations/`. **Be aware the current reality is thin:** only `src/lib/validations/auth.ts` exists, and most actions hand-roll `if (!field) return { success: false, … }` guards instead. New or touched actions should add a proper zod schema rather than copying the hand-rolled pattern.
- Always return `{ success: boolean, data?: T, error?: string }`
- Server Actions call services — never repositories directly
- Actions that touch the database as an unauthenticated caller (e.g. public card pages, analytics) use `getServiceSupabase()` — the service role **bypasses RLS**, so ownership must be verified in the action or service. See `Status.md` issue B5.

---

## Error handling

- Services throw typed string errors: `throw new Error('COMPANY_NOT_FOUND')`
- Actions catch and return `{ success: false, error: string }`
- UI renders errors from the action result only
- Event tracking errors are always silently caught — never surface to users
- Never expose raw Supabase error messages to the UI

---

## Key decisions

| Decision | Rationale |
|---|---|
| App Router | Server Components reduce JS; better SEO for public card pages |
| Supabase | Auth + DB + RLS in one; fast to ship. (Supabase **Storage** is *not* used — uploads go to R2.) |
| SSOT four-layer | Prevents spaghetti; auditable and testable |
| Cloudflare R2 | Cheaper egress than Supabase Storage at scale |
| No ORM | Supabase typed client is sufficient; Prisma adds a fifth layer |
| Slug-based URLs | Human-readable, NFC-friendly, SEO-friendly |
| Server Actions | Eliminates API route boilerplate; co-locates logic with pages |
| Email + password auth, with OTP for verification and reset | Familiar to users and to company admins; OTP removes password-reset friction without giving up password login |
| card_events append-only | Historical data cannot be reconstructed — capture from day one |
| profile_companies join | Supports multi-company employees without future schema changes |
| daily_card_stats rollup | Pre-aggregated stats would make dashboards instant at scale. **Designed but not built** — see `Roadmap.md` |
| Environmental constants in code | Numbers are researched and versioned — not hardcoded in SQL |
| No third-party mail provider yet | Supabase Auth's built-in mailer covers verification and reset. Transactional notifications need a separate provider when implemented — see `Roadmap.md` §3 |