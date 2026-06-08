# EcoTap — Architecture & Coding Conventions

This document is the single source of truth for how this codebase is structured, why decisions were made, and how everything fits together. Read this before writing any code.

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
- Every schema change is a timestamped `.sql` migration file in `supabase/migrations/`
- Never alter tables manually in the Supabase dashboard — always write a migration
- Migration filenames: `YYYYMMDDHHMMSS_description.sql`
- Every migration file is kept permanently — this is the historical record of the entire schema
- To deploy: `supabase db push`

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
    api/
      vcf/                # vCard download endpoint
      events/             # Event tracking endpoint
  actions/                # All Server Actions (one file per domain)
  components/
    ui/                   # Primitives: Button, Input, Badge, Modal, etc.
    cards/                # Card display + interaction components
    dashboard/            # Shared dashboard components (StatCard, PageHeader)
    orders/               # Order flow components
  lib/
    supabase/             # Repositories + Supabase client helpers
    services/             # Business logic services
    email/                # Email templates + Resend helpers
    vcf/                  # vCard generator
    qr/                   # QR code utilities
    utils/                # Generic helpers (slugify, formatDate, etc.)
    mock/                 # Mock data — DELETE before Phase 15
  types/                  # All TypeScript interfaces
  hooks/                  # Custom React hooks
  constants/              # Roles, statuses, routes, environmental constants
```

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

## Notifications

| Trigger | Recipient | Channel |
|---|---|---|
| New company registration (pending) | Super Admin | Email (Resend) |
| New individual registration (pending) | Super Admin | Email (Resend) |
| New card order placed | Super Admin | Email (Resend) |

Employees do not receive any notifications. Future phases may add more triggers.

Email provider: **Resend** (`resend` npm package). Templates live in `src/lib/email/templates/`.

---

## OTP Authentication

Supabase Auth is configured with OTP (one-time password) for login:
- User enters email → Supabase sends a 6-digit OTP
- User enters OTP → session established
- No passwords stored — passwordless auth only
- Configured in the Supabase dashboard under Auth → Email → Enable OTP

---

## Environmental impact report

Each company receives a monthly email report on the environmental impact of using EcoTap versus paper business cards. This is a marketing and CSR feature — it reinforces the value of the service.

### Industry-standard numbers used in calculations

| Metric | Value | Source |
|---|---|---|
| Weight of one paper business card | 1.35g | HiHello / Statistic Brain |
| CO₂ per paper card (full lifecycle) | 9g CO₂e | NexaLink industry analysis |
| Water to produce 1kg of paper | 324 litres | ShareEcard / EPA data |
| % of paper cards thrown away within 1 week | 88% | Multiple sources |
| % of paper cards ending up in landfill | 90% | ShareEcard |
| EcoTap recycled PVC NFC card lifespan | 7 years | Industry conservative estimate |
| Paper cards replaced per NFC card (lifespan) | ~30 reprints per person over 7 years | Cardynale / TapiLink research |
| Carbon footprint: 1 NFC card vs equivalent paper | 10× lower over lifetime | Industry research |

### How the report is calculated per company

For a company with N active employee cards, over the reporting month:

```
paper_cards_avoided   = N × (reprints_per_year / 12)
                      = N × (30 / 7 / 12)   ← ~0.36 per employee per month

co2_saved_kg          = paper_cards_avoided × 9g / 1000
water_saved_litres    = paper_cards_avoided × 1.35g / 1000 × 324
waste_avoided_grams   = paper_cards_avoided × 1.35g
trees_saved           = paper_cards_avoided × 0.004  ← industry: 1 tree per 250 cards
```

Report also includes:
- Cumulative totals since company joined EcoTap
- Year-to-date totals
- Equivalent comparisons ("equivalent to X cups of water", "X km driven in a car")

### Stored in `environmental_reports` table
Every monthly report is persisted with the calculated values — not recomputed retroactively. This gives you a historical record for trend analysis and ML.

---

## Analytics & ML data strategy

### Philosophy: capture everything from day one
Historical event data cannot be reconstructed. The `card_events` table is append-only and never deleted. Every meaningful visitor action on a card page produces one row. As the business grows, this table becomes the foundation for:
- Card performance dashboards
- NFC vs QR split analysis
- Geographic reach mapping
- Recommendation engine (which card features drive the most exchanges)
- Churn prediction (companies with low card engagement)
- A/B testing card designs

### card_events — the core telemetry table

Every row is one discrete user action. Captured server-side via a fire-and-forget API route.

```sql
event_type values:
  'view'             -- card page opened
  'nfc_tap'          -- arrived via NFC (?source=nfc in URL)
  'qr_scan'          -- arrived via QR (?source=qr in URL)
  'vcf_download'     -- Save contact clicked
  'contact_exchange' -- visitor submitted their contact details
  'social_click'     -- a social link icon was clicked
  'share'            -- card share action (future)
```

### daily_card_stats — pre-aggregated rollups
A nightly job computes daily totals per card and writes to `daily_card_stats`. Dashboard queries read from this table — never the raw events table. This keeps dashboards fast at any scale.

### Event tracking pattern
Events are fire-and-forget — they must never block a page render or user action:

```ts
// Non-blocking — called but not awaited
recordCardEvent({
  card_id:     card.id,
  event_type:  'view',
  referrer:    headers().get('referer'),
  country:     headers().get('x-vercel-ip-country'),
  city:        headers().get('x-vercel-ip-city'),
  device_type: parseDevice(headers().get('user-agent')),
  // session_id and visitor_id come from cookies
}).catch(() => {}) // silently ignore — never surface to user
```

---

## Database tables — complete list

### Identity & access
| Table | Purpose |
|---|---|
| `profiles` | One per auth user. Role, status, username, OTP auth. |
| `companies` | One per registered company. Branding, theme_locked, legal_rep_confirmed. |
| `country_reps` | Links a profile (country_rep role) to a country code. |
| `profile_companies` | Many-to-many. Employee ↔ company with is_primary flag. |
| `departments` | Groups employees within a company. |
| `invitations` | One-time-use invite tokens generated by company admins. |

### Cards & orders
| Table | Purpose |
|---|---|
| `cards` | One per profile. Slug, theme_color, bio, social links, phone. |
| `card_designs` | Physical NFC card designs managed by Super Admin. |
| `card_orders` | A user orders physical NFC cards. Status-tracked to delivery. |

### Analytics & ML
| Table | Purpose |
|---|---|
| `card_events` | Append-only telemetry. Every visitor action. Never deleted. |
| `contact_exchanges` | Visitor contact submissions with full metadata. |
| `daily_card_stats` | Pre-aggregated daily rollups per card. |

### Billing & platform
| Table | Purpose |
|---|---|
| `billing_plans` | Pricing plans (monthly/annual, price in RWF). |
| `company_subscriptions` | Which plan a company is on and their employee count. |
| `notifications` | Notification log — email sent flags, type, metadata. |
| `environmental_reports` | Monthly CO₂/water/waste calculations per company. |

---

## TypeScript conventions

- All types live in `src/types/index.ts`
- Use `interface` for object shapes, `type` for unions
- Every DB table has a matching TypeScript interface
- Never use `any` — use `unknown` and narrow if necessary

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
  cream-dark:     #F0E6D3   borders, table row headers
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
- One file per domain: `onboarding.actions.ts`, `cards.actions.ts`, `orders.actions.ts`, `contacts.actions.ts`, `admin.actions.ts`, `events.actions.ts`, `invitations.actions.ts`, `reports.actions.ts`
- Validate with `zod` before calling services
- Always return `{ success: boolean, data?: T, error?: string }`
- Server Actions call services — never repositories directly

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
| Supabase | Auth + DB + Storage + RLS in one; fast to ship |
| SSOT four-layer | Prevents spaghetti; auditable and testable |
| Cloudflare R2 | Cheaper egress than Supabase Storage at scale |
| No ORM | Supabase typed client is sufficient; Prisma adds a fifth layer |
| Slug-based URLs | Human-readable, NFC-friendly, SEO-friendly |
| Server Actions | Eliminates API route boilerplate; co-locates logic with pages |
| OTP-only auth | Passwordless is simpler for users and eliminates password reset flows |
| card_events append-only | Historical data cannot be reconstructed — capture from day one |
| Resend for email | Best Next.js/Vercel integration; simple API; generous free tier |
| profile_companies join | Supports multi-company employees without future schema changes |
| daily_card_stats rollup | Pre-aggregated stats make dashboards instant at scale |
| Environmental constants in code | Numbers are researched and versioned — not hardcoded in SQL |