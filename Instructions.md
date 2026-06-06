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
  lib/
    supabase/            # Repositories + Supabase client helpers
    services/            # Business logic services
    vcf/                 # vCard generator
    qr/                  # QR code utilities
    utils/               # Generic helpers (slugify, formatDate, etc.)
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
  // src/types/profile.ts
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
  [username]/            # Public individual card — no auth
  [company]/[employee]/  # Public company card — no auth
```

Route protection is handled in `middleware.ts` using Supabase session + role check. Never protect routes inside components.

---

## Authentication

- Use Supabase Auth for all authentication
- On signup, a `profiles` row is created via a Supabase database trigger (not in application code)
- Role is set during the registration form submission via a service function
- Session is accessed server-side via `createServerClient` from `@supabase/ssr`

---

## Status state machine

All user-facing entities follow this status flow. Never set status directly in the UI — always go through the service layer.

```
profiles:   pending → active → suspended
companies:  pending → active → suspended
card_orders: pending → approved → shipped → delivered
```

---

## Styling

- Tailwind CSS only — no inline styles, no CSS modules
- Design tokens are defined in `tailwind.config.ts` under `theme.extend`
- Color palette:
  ```
  emerald-deep:  #064E3B   (primary)
  emerald-mid:   #065F46   (hover states)
  emerald-light: #D1FAE5   (surfaces, backgrounds)
  ivory:         #FEFCE8   (page background)
  cream:         #FEF9EF   (card backgrounds)
  gold:          #B45309   (accent, CTAs)
  ```
- Component variants live in the component file using `cva` (class-variance-authority)
- Never use Tailwind's `text-green-*` — always use the custom tokens above

---

## Server Actions

- All mutations are Server Actions defined in `src/app/actions/`
- One file per domain: `onboarding.actions.ts`, `cards.actions.ts`, etc.
- Server Actions call services only — never repositories directly
- Validate inputs with `zod` before calling any service

---

## Error handling

- Services throw typed errors: `throw new Error('COMPANY_NOT_FOUND')`
- Server Actions catch and return `{ success: false, error: string }`
- UI shows errors from the action result — never catches raw Supabase errors in components

---

## Key decisions

| Decision | Rationale |
|---|---|
| App Router over Pages Router | Server Components reduce client JS; better for SEO on public card pages |
| Supabase over custom backend | Auth + DB + Storage in one; fast to ship |
| SSOT four-layer architecture | Prevents spaghetti; makes the codebase auditable and testable |
| Cloudflare R2 for images | Cheaper egress than Supabase Storage at scale |
| No ORM | Supabase client is typed enough; adding Prisma would create a fifth layer |
| Slug-based public URLs | Human-readable, NFC-friendly, SEO-friendly |
| Server Actions for mutations | Eliminates separate API route boilerplate; co-locates logic |