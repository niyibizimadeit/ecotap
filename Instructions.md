# EcoTap — Architecture & Coding Conventions

This document is the single source of truth for how this codebase is structured and why. Read this before writing any code.

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
- Every schema change is a timestamped migration file in `supabase/migrations/`
- Never alter tables manually in the Supabase dashboard — always write a migration
- Migration filenames: `YYYYMMDDHHMMSS_description.sql`
- Every migration file is kept permanently — this is the historical record of the entire schema

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
    if (!company) throw new Error('Company not found')
    if (company.status !== 'pending') throw new Error('Company is not pending')
    return await updateCompanyStatus(companyId, 'active')
  }
  ```

### Layer 4 — UI
- Server Components call services directly (no `useEffect` data fetching)
- Client Components use `useState` + `useTransition` for mutations; call server actions
- Never import a repository inside a component
- Never write a Supabase query inside a component

---

## Folder conventions

```
src/
  app/                   # Next.js App Router pages and layouts
  components/
    ui/                  # Primitive components (Button, Input, Badge, Modal)
    cards/               # Card profile display components
    dashboard/           # Dashboard-specific components
    orders/              # Order flow components
  lib/
    supabase/            # Repositories + Supabase client helpers
    services/            # Business logic services
    vcf/                 # vCard generator
    qr/                  # QR code utilities
    utils/               # Generic helpers (slugify, formatDate, etc.)
    mock/                # Mock data — deleted before Phase 15
  types/                 # All TypeScript types and interfaces
  hooks/                 # Custom React hooks
  constants/             # App-wide constants (roles, statuses, routes)
```

---

## TypeScript conventions

- All types live in `src/types/` — no inline type definitions inside components
- Use `interface` for object shapes, `type` for unions and aliases
- Every DB table has a matching TypeScript interface mirroring its columns
- Example:
  ```ts
  // src/types/index.ts
  export interface Profile {
    id: string
    role: 'super_admin' | 'company_admin' | 'employee' | 'individual'
    status: 'pending' | 'active' | 'suspended'
    username: string
    company_id: string | null
    created_at: string
  }
  ```

---

## Naming conventions

| Thing | Convention | Example |
|---|---|---|
| Files | kebab-case | `card-profile.tsx` |
| Components | PascalCase | `CardProfile` |
| Functions | camelCase | `getCardBySlug` |
| DB columns | snake_case | `company_id` |
| Constants | SCREAMING_SNAKE | `MAX_CARD_QUANTITY` |
| Routes (App Router) | kebab-case folders | `app/dashboard/card-orders/` |
| Repo files | `[table].repo.ts` | `cards.repo.ts` |
| Service files | `[domain].service.ts` | `cards.service.ts` |

---

## Route groups (App Router)

```
app/
  (marketing)/           # Public-facing marketing pages — no auth required
  (auth)/                # Login, register — redirect away if already logged in
  dashboard/
    admin/               # Super Admin only — guarded by middleware
    company/             # Company Admin only — guarded by middleware
    employee/            # Employee + Individual — guarded by middleware
  [slug]/                # Public individual card — no auth (ecotap.rw/username)
  [slug]/[employee]/     # Public company employee card — no auth (ecotap.rw/company/employee)
```

Route protection is handled in `middleware.ts` using Supabase session + role check. Never protect routes inside components.

---

## Authentication

- Use Supabase Auth for all authentication
- On signup, a `profiles` row is created via a Supabase database trigger (not in application code)
- Role is set during the registration form submission via a service function
- Session is accessed server-side via `createServerClient` from `@supabase/ssr`

---

## Status state machines

All user-facing entities follow strict status flows. Never set status directly in the UI — always go through the service layer. Status transitions are guarded in services and will throw if the transition is invalid.

```
profiles:    pending → active → suspended
companies:   pending → active → suspended
card_orders: pending → approved → shipped → delivered
invitations: pending → accepted | expired
```

---

## Feature decisions (confirmed before Phase 8)

| Feature | Decision |
|---|---|
| Cards per user | One card per profile for now. Schema supports expansion later. |
| Employee–company relationship | Many-to-many via `profile_companies` join table. Employee selects primary company shown on card. |
| Company invite flow | Company admins can generate one-time-use invite links (`invitations` table). Employee can also self-register and link to a company by name. |
| Card designs vs card themes | Genuinely separate. Design = physical NFC card appearance (ordered, printed). Theme = digital card colour accent (set by user in profile). |
| Public company page | `ecotap.rw/[slug]` at the company level is reserved but not built yet. Schema supports it — `companies.slug` is indexed. |
| Admin notifications | Super Admin receives email on new pending approvals (companies + individuals). Uses Resend. Employees do not receive notifications. |
| Analytics & ML data | Captured from day one via `card_events` table. Never deleted. Used for future recommendation engine, churn prediction, and business intelligence. |

---

## Database design principles

### Never delete analytics data
The `card_events` table is append-only. No rows are ever deleted. This is the foundation of all future ML work. Every meaningful user action produces an event row.

### Separate concerns clearly
- `profiles` = identity and auth (who you are)
- `cards` = digital presentation (what the world sees)
- `card_orders` = physical fulfillment (what gets shipped)
- `card_events` = behavioural telemetry (what happens)
- `contact_exchanges` = relationship data (who connected with whom)

### Schema designed for analytics from day one
Every table that matters to the business has:
- `created_at` with timezone
- `updated_at` with timezone (where rows mutate)
- Enough foreign keys to join across the full user journey

---

## Database tables (Phase 8 schema)

### Core identity
| Table | Purpose |
|---|---|
| `profiles` | One row per auth user. Role, status, username, metadata. |
| `companies` | One row per registered company. Slug, branding, status. |
| `profile_companies` | Join table. An employee can be linked to multiple companies, with one marked primary. |
| `departments` | Belongs to a company. Used to group employees. |

### Cards
| Table | Purpose |
|---|---|
| `cards` | One card per profile. Digital presentation — slug, theme colour, bio, social links, job title, phone. |
| `card_designs` | Available physical card designs managed by Super Admin. |
| `card_orders` | A user orders N physical cards of a chosen design. Status-tracked. |

### Growth & analytics (ML-ready)
| Table | Purpose |
|---|---|
| `card_events` | Append-only telemetry. Every view, tap, scan, download, exchange. Never deleted. |
| `contact_exchanges` | Visitor submits their contact to a cardholder. Enriched with device/referrer metadata. |
| `daily_card_stats` | Pre-aggregated daily rollups per card. Computed nightly. Fast dashboard queries. |

### Platform operations
| Table | Purpose |
|---|---|
| `invitations` | One-time-use invite links generated by company admins. |
| `billing_plans` | Pricing plans managed by Super Admin. |
| `company_subscriptions` | Which plan a company is on, employee count, billing dates. |
| `notifications` | In-app and email notification log. Currently used for admin approval alerts. |

---

## card_events — the analytics foundation

This is the most important table for future ML. Every row is one discrete user action.

```sql
card_events (
  id            uuid primary key,
  card_id       uuid references cards(id),
  event_type    text,   -- 'view' | 'nfc_tap' | 'qr_scan' | 'vcf_download' | 'contact_exchange' | 'social_click' | 'share'
  session_id    uuid,   -- groups events from one visitor session
  visitor_id    uuid,   -- anonymous, persisted in cookie for return visit detection
  referrer      text,   -- where the visitor came from
  device_type   text,   -- 'mobile' | 'tablet' | 'desktop'
  os            text,   -- 'ios' | 'android' | 'windows' | 'macos' | 'other'
  browser       text,
  country       text,   -- from Vercel edge geo headers
  city          text,
  utm_source    text,   -- for tracking marketing campaigns
  utm_medium    text,
  utm_campaign  text,
  social_target text,   -- populated for social_click events (which link was clicked)
  duration_ms   int,    -- populated for 'view' events on session end
  created_at    timestamptz default now()
)
```

**What this enables over time:**
- Card performance over time (views, taps, downloads per day/week/month)
- NFC vs QR split — which delivery method drives more engagement
- Geographic reach — where are your card viewers coming from
- Device breakdown — iOS vs Android optimisation signals
- Referrer analysis — how people find cards (WhatsApp, LinkedIn, direct)
- Session depth — how long people spend on card pages
- Return visitor detection — are people coming back?
- Social link click-through rates per platform
- Campaign attribution via UTM params
- **ML inputs:** feature vectors for recommendation engine, churn prediction (low view counts), card performance scoring

---

## Styling

- Tailwind CSS v4 with `@theme` in `globals.css` — no `tailwind.config.ts` extensions needed for custom tokens
- Inline styles used for dynamic values (accent colours, brand colours computed at runtime)
- Static colours defined as utility classes in `globals.css`
- Color palette:
  ```
  emerald-deep:   #064E3B   (primary, sidebar backgrounds)
  emerald-mid:    #065F46   (hover states)
  emerald-bright: #059669   (CTAs, success states)
  emerald-light:  #D1FAE5   (light surfaces)
  emerald-pale:   #ECFDF5   (hover backgrounds)
  ivory:          #FEFCE8   (page background)
  cream:          #FEF9EF   (card backgrounds)
  cream-dark:     #F0E6D3   (borders, table headers)
  gold:           #92400E   (warnings, accent)
  gold-light:     #D97706   (badges, highlights)
  gold-pale:      #FEF3C7   (warning backgrounds)
  ink:            #1C1917   (body text)
  ink-mid:        #44403C   (secondary text)
  ink-light:      #78716C   (hints, labels, placeholders)
  ```
- Never use Tailwind's built-in `green-*` colours — always use the custom tokens above

---

## Server Actions

- All mutations are Server Actions defined in `src/app/actions/`
- One file per domain: `onboarding.actions.ts`, `cards.actions.ts`, `orders.actions.ts`, `contacts.actions.ts`, `admin.actions.ts`, `events.actions.ts`
- Server Actions call services only — never repositories directly
- Validate inputs with `zod` before calling any service
- Always return `{ success: boolean, data?: T, error?: string }`

---

## Event tracking pattern

Every public card page interaction fires an event. This is how:

```ts
// In a Server Action or API route:
await recordEvent({
  card_id:     card.id,
  event_type:  'view',
  session_id:  getOrCreateSessionId(request),
  visitor_id:  getOrCreateVisitorId(request),
  referrer:    request.headers.get('referer'),
  device_type: parseDeviceType(request.headers.get('user-agent')),
  country:     request.headers.get('x-vercel-ip-country'),
  city:        request.headers.get('x-vercel-ip-city'),
})
```

The `card_events` repo function is fire-and-forget — it never blocks the page render. Use `waitUntil` on Vercel edge if available, otherwise a non-awaited promise.

---

## Email notifications

- Provider: Resend (`resend` npm package)
- Only the Super Admin receives email notifications currently
- Trigger: new pending approval (company or individual)
- Template files live in `src/lib/email/templates/`
- Never send email from a repository or component — only from a service function

---

## Error handling

- Services throw typed errors: `throw new Error('COMPANY_NOT_FOUND')`
- Server Actions catch and return `{ success: false, error: string }`
- UI shows errors from the action result — never catches raw Supabase errors in components
- Analytics events must never throw — wrap in try/catch and fail silently

---

## Key decisions

| Decision | Rationale |
|---|---|
| App Router over Pages Router | Server Components reduce client JS; better for SEO on public card pages |
| Supabase over custom backend | Auth + DB + Storage in one; fast to ship |
| SSOT four-layer architecture | Prevents spaghetti; makes the codebase auditable and testable |
| Cloudflare R2 for images | Cheaper egress than Supabase Storage at scale |
| No ORM | Supabase client is typed enough; Prisma would add a fifth layer |
| Slug-based public URLs | Human-readable, NFC-friendly, SEO-friendly |
| Server Actions for mutations | Eliminates separate API route boilerplate; co-locates logic |
| card_events append-only | Historical data cannot be reconstructed — capture everything from day one |
| Resend for email | Best Next.js/Vercel integration; generous free tier |
| profile_companies join table | Supports multi-company employees without schema changes later |
| daily_card_stats rollup table | Pre-aggregated stats make dashboard queries instant at scale |