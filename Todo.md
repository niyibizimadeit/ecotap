# EcoTap — Project TODO

15 phases from first pixel to production. Each phase has one clear goal — finish it completely before moving to the next.

---

## Phase 1 — Project scaffold & design system

**Goal:** A clean Next.js project with all design tokens, fonts, and primitive UI components ready. Nothing is built twice from this point — everything uses these primitives.

- [ ] Init Next.js 14 project with TypeScript, Tailwind CSS, ESLint, Prettier
- [ ] Configure custom Tailwind tokens in `tailwind.config.ts`:
  - `emerald-deep: #064E3B`, `emerald-mid: #065F46`, `emerald-bright: #059669`
  - `emerald-light: #D1FAE5`, `emerald-pale: #ECFDF5`
  - `ivory: #FEFCE8`, `cream: #FEF9EF`, `cream-dark: #F5EDD8`
  - `gold: #92400E`, `gold-light: #D97706`, `gold-pale: #FEF3C7`
- [ ] Install Cormorant Garamond + DM Sans via Google Fonts (next/font)
- [ ] Set up folder structure: `app/`, `components/ui/`, `lib/`, `types/`, `hooks/`, `constants/`
- [ ] Write all global TypeScript interfaces in `src/types/`:
  - `Profile`, `Company`, `Department`, `Card`, `CardDesign`, `CardOrder`, `ContactExchange`, `BillingPlan`
- [ ] Define role, status, and route constants in `src/constants/`
- [ ] Build primitive UI components in `components/ui/`:
  - `Button` — variants: primary, secondary, ghost, danger; sizes: sm, md, lg
  - `Input`, `Textarea`, `Select` — with label and error state
  - `Badge` — variants: pending, active, suspended, shipped, delivered
  - `Card` — surface wrapper with optional padding and border
  - `Modal` — accessible dialog with overlay
  - `Spinner` — loading indicator
  - `Avatar` — circular image with initials fallback
- [ ] Build a `/dev/components` sandbox page to visually verify all primitives

**Done when:** Every primitive renders correctly in the sandbox. No TypeScript errors. Custom tokens resolve in the browser.

---

## Phase 2 — Home page & auth pages

**Goal:** The public-facing entry points. A visitor landing on ecotap.rw understands what it is and can register or log in. No Supabase wired yet — forms submit to nowhere, data goes to state only.

**Home page**
- [ ] Build `app/(marketing)/page.tsx`:
  - Hero: headline, subheadline, two CTA buttons — "For organisations" and "For individuals"
  - How it works: 3-step visual (Register → Get your card → Tap & share)
  - Features: NFC + QR, custom branding, contact exchange, physical card fulfillment
  - Pricing teaser: "Flexible plans — contact us" (no exact figures)
  - Footer: logo, nav links, tagline, "Built in Rwanda"
- [ ] Build `components/layout/Navbar.tsx` — sticky, transparent-on-scroll, logo + links + CTA
- [ ] Build `components/layout/Footer.tsx`

**Auth pages**
- [ ] Build shared `components/auth/AuthLayout.tsx` — split-screen layout reused by all auth pages
- [ ] Build `app/(auth)/org/register/page.tsx` — multi-step company registration:
  - Step 1: Company info (name, industry, size, website)
  - Step 2: Admin account (name, email, password)
  - Step 3: Review & submit → redirects to `/pending`
- [ ] Build `app/(auth)/org/login/page.tsx` — organisation login
- [ ] Build `app/(auth)/register/page.tsx` — individual / employee register (name, email, password, optional company info)
- [ ] Build `app/(auth)/login/page.tsx` — individual / employee login
- [ ] Build `app/(auth)/pending/page.tsx` — "Your account is under review" holding page
- [ ] Add `react-hook-form` + `zod` validation to all forms

**Done when:** Home page looks polished at 375px, 768px, and 1280px. All auth forms validate correctly. Multi-step org register navigates cleanly. Lighthouse performance ≥ 90 on desktop.

---

## Phase 3 — Public card pages

**Goal:** The page a visitor sees the moment they tap an NFC chip or scan a QR code. This is EcoTap's most important page — it must be fast, beautiful, and work perfectly on mobile. Built early so you can test with real NFC chips before the backend is wired.

- [ ] Build `components/cards/PublicCardLayout.tsx` — shared layout for all public cards:
  - Profile photo, full name, job title, company name + logo
  - Bio section
  - Social links row: LinkedIn, Twitter/X, WhatsApp, Instagram, website (icons, open in new tab)
  - "Save contact" button — downloads a `.vcf` file (mock data for now)
  - Visitor contact exchange form: name, email, phone (all optional, submits to state for now)
  - "Powered by EcoTap" footer
- [ ] Build `app/[company]/[employee]/page.tsx` — company employee card (uses mock data)
- [ ] Build `app/[username]/page.tsx` — individual / freelancer card (uses mock data)
- [ ] Build card theme rendering — layout adapts to selected design + brand accent color
- [ ] Build `app/[company]/[employee]/not-found.tsx` and `app/[username]/not-found.tsx` — clean 404s

**Done when:** Both card variants render correctly on a real phone. "Save contact" downloads a valid `.vcf`. Layout holds with a long bio, many social links, and no photo. 404 pages look intentional, not broken.

---

## Phase 4 — Employee & individual dashboard

**Goal:** The full dashboard for employees and freelancers — the place where they manage their card. Uses static mock data throughout; no backend yet.

- [ ] Build `app/dashboard/employee/layout.tsx` — sidebar navigation (collapses to bottom bar on mobile)
- [ ] Build `app/dashboard/employee/page.tsx` — overview: card views count, contacts received, card status badge
- [ ] Build `app/dashboard/employee/profile/page.tsx` — profile editor:
  - Full name, job title, department, company (read-only if linked to a company), phone, email, bio, website
  - Social links: LinkedIn, Twitter/X, WhatsApp, Instagram
  - Profile photo upload UI (upload UI only — no storage wired yet)
- [ ] Build `components/cards/CardPreview.tsx` — live card preview that updates as the user types in the profile editor
- [ ] Build `app/dashboard/employee/qr/page.tsx` — displays QR code + download as PNG button
- [ ] Build `app/dashboard/employee/contacts/page.tsx` — inbox table of visitors who submitted their info (mock rows)
- [ ] Build `app/dashboard/employee/orders/page.tsx` — links to order flow (Phase 5)

**Done when:** Sidebar works on mobile. `CardPreview` updates reactively when any profile field changes. QR renders correctly with a mock URL. Tables paginate with mock data.

---

## Phase 5 — Card ordering flow

**Goal:** The complete flow for ordering a physical NFC card — from choosing a design to tracking delivery. Lives inside the employee dashboard. Static/mock data.

- [ ] Build `components/orders/DesignGallery.tsx` — card design grid with preview images, names, and a selected state
- [ ] Build `app/dashboard/employee/orders/new/page.tsx` — 3-step order flow:
  - Step 1: Choose design from gallery
  - Step 2: Quantity (1–100) + shipping address form
  - Step 3: Order summary + "Place order" button
- [ ] Build `app/dashboard/employee/orders/success/page.tsx` — confirmation page with order reference
- [ ] Build `app/dashboard/employee/orders/history/page.tsx` — order history list:
  - Columns: date, design, quantity, status badge, estimated delivery
  - Status badges: pending, approved, shipped, delivered

**Done when:** Full 3-step order flow navigates correctly. Quantity validates (min 1, max 100). Order history renders mock orders with correct status badges.

---

## Phase 6 — Company admin dashboard

**Goal:** The full dashboard for company administrators — managing employees, branding, departments, and subscription. Static/mock data.

- [ ] Build `app/dashboard/company/layout.tsx` — sidebar layout
- [ ] Build `app/dashboard/company/page.tsx` — overview: employee count, active cards, pending orders, subscription status
- [ ] Build `app/dashboard/company/employees/page.tsx` — employee table:
  - Columns: name, department, card URL, status badge, actions (view, suspend)
  - Search + filter by department and status
- [ ] Build `app/dashboard/company/departments/page.tsx` — create, rename, delete departments; drag-assign employees
- [ ] Build `app/dashboard/company/settings/page.tsx` — company branding:
  - Company name, slug (read-only after set), industry, website
  - Logo upload UI
  - Brand accent color picker with live preview on a card mockup
- [ ] Build `app/dashboard/company/subscription/page.tsx` — current plan, employee count, billing cycle, next billing date

**Done when:** Employee table searches and filters correctly with mock data. Color picker updates the card mockup preview live. All pages work on mobile.

---

## Phase 7 — Super admin panel

**Goal:** The internal control panel for managing the entire platform. Desktop-first. Static/mock data.

- [ ] Build `app/dashboard/admin/layout.tsx` — sidebar with distinct admin styling
- [ ] Build `app/dashboard/admin/page.tsx` — overview: pending approvals, active users, orders this week, revenue indicator
- [ ] Build `app/dashboard/admin/approvals/page.tsx` — pending queue:
  - Two tabs: Companies and Individuals
  - Each row: name, type, registered date, "Approve" and "Reject" buttons (UI only for now)
- [ ] Build `app/dashboard/admin/orders/page.tsx` — all card orders table:
  - Columns: user, design, quantity, shipping address, status, date
  - Inline status update actions: approve → mark shipped → mark delivered
- [ ] Build `app/dashboard/admin/designs/page.tsx` — card designs management:
  - Upload new design (name + preview image)
  - Activate / deactivate existing designs
- [ ] Build `app/dashboard/admin/users/page.tsx` — all users table:
  - Columns: name, email, role, status, joined date
  - Search by name/email; filter by role and status
- [ ] Build `app/dashboard/admin/billing/page.tsx` — billing plans:
  - List of monthly and annual plans
  - Create / edit plan (name, billing cycle, price per employee, active toggle)

**Done when:** All tables render with mock data. Approve/reject buttons update status badges correctly in local state. All management flows are clear and navigable.

---

## Phase 8 — Database schema & Supabase setup

**Goal:** The Supabase project is live, all 9 tables exist, RLS is configured, and the schema matches every TypeScript interface defined in Phase 1.

- [ ] Create Supabase project and add credentials to `.env.local`
- [ ] Configure `@supabase/ssr` client helpers:
  - `lib/supabase/client.ts` — browser client (singleton)
  - `lib/supabase/server.ts` — server component client
  - `lib/supabase/middleware.ts` — middleware client
- [ ] Write and apply migrations in `supabase/migrations/`:
  - `profiles` — id, role enum (`super_admin | company_admin | employee | individual`), status enum (`pending | active | suspended`), username, company_id FK, created_at
  - `companies` — id, name, slug, logo_url, brand_color, status, created_at
  - `departments` — id, company_id FK, name
  - `cards` — id, profile_id FK, slug, theme, accent_color, bio, social_links (jsonb), qr_url, is_public
  - `card_designs` — id, name, preview_url, is_active
  - `card_orders` — id, profile_id FK, design_id FK, quantity, shipping_address (jsonb), status enum (`pending | approved | shipped | delivered`), created_at
  - `contact_exchanges` — id, card_id FK, visitor_name, visitor_email, visitor_phone, created_at
  - `billing_plans` — id, name, billing_cycle enum (`monthly | annual`), price_per_employee, is_active
  - `company_subscriptions` — id, company_id FK, plan_id FK, status, employee_count, next_billing_date
- [ ] Configure Row Level Security (RLS) policies on all tables
- [ ] Add DB trigger: auto-insert a `profiles` row when a new `auth.users` row is created
- [ ] Add indexes on: `profiles.username`, `companies.slug`, `cards.slug`
- [ ] Seed: one super admin account, two card designs, one billing plan (monthly), one billing plan (annual)

**Done when:** `supabase db push` runs with zero errors. RLS blocks cross-user reads in the Supabase dashboard. Trigger creates a profiles row on new user signup. Seed data exists.

---

## Phase 9 — Repositories layer (SSOT Layer 2)

**Goal:** Every database query in the codebase lives in a repository file. No component or service ever writes a Supabase query directly.

- [ ] Write `lib/supabase/profiles.repo.ts`:
  - `getProfileById`, `getProfileByUsername`, `createProfile`, `updateProfile`, `updateStatus`, `getAllPending`
- [ ] Write `lib/supabase/companies.repo.ts`:
  - `getCompanyById`, `getCompanyBySlug`, `createCompany`, `updateCompany`, `updateStatus`, `getAllPending`
- [ ] Write `lib/supabase/departments.repo.ts`:
  - `getDepartmentsByCompany`, `createDepartment`, `updateDepartment`, `deleteDepartment`
- [ ] Write `lib/supabase/cards.repo.ts`:
  - `getCardBySlug`, `getCardByProfileId`, `createCard`, `updateCard`
- [ ] Write `lib/supabase/card_designs.repo.ts`:
  - `getActiveDesigns`, `getAllDesigns`, `createDesign`, `updateDesign`
- [ ] Write `lib/supabase/card_orders.repo.ts`:
  - `createOrder`, `getOrdersByProfileId`, `getAllOrders`, `updateOrderStatus`
- [ ] Write `lib/supabase/contact_exchanges.repo.ts`:
  - `createExchange`, `getExchangesByCardId`
- [ ] Write `lib/supabase/billing.repo.ts`:
  - `getActivePlans`, `getAllPlans`, `upsertPlan`

**Done when:** Every function has a return type matching the interfaces in `src/types/`. No `any`. A test script calling each function returns the expected seeded data.

---

## Phase 10 — Services layer (SSOT Layer 3)

**Goal:** All business logic — status transitions, validations, cross-table operations — lives in service files. Services call repositories only; they never query Supabase directly.

- [ ] Write `lib/services/onboarding.service.ts`:
  - `registerCompany(data)` — creates company + admin profile, both status = `pending`
  - `registerIndividual(data)` — creates profile, status = `pending`
  - `approveCompany(id)` — validates `pending → active` transition, errors if already active
  - `approveIndividual(id)` — same guard
  - `rejectUser(id)` — sets status to `suspended`
- [ ] Write `lib/services/cards.service.ts`:
  - `createCardForProfile(profileId)` — creates a card row with an auto-generated slug
  - `updateCard(profileId, data)` — updates card fields
  - `getPublicCard(slug)` — returns card + profile data for a public page
- [ ] Write `lib/services/orders.service.ts`:
  - `placeOrder(profileId, data)` — validates profile is active, creates order
  - `approveOrder(orderId)`, `markShipped(orderId)`, `markDelivered(orderId)` — guarded transitions
- [ ] Write `lib/services/contacts.service.ts`:
  - `recordExchange(cardId, visitorData)` — stores a visitor's contact submission
  - `getInbox(profileId)` — returns all exchanges for a card owner
- [ ] Write `lib/services/admin.service.ts`:
  - `getPendingQueue()` — returns all pending companies and individuals
  - `getAllOrders(filters)`, `getAllUsers(filters)`

**Done when:** Every status transition guard throws the correct error when violated. A dev-only `/api/test` route exercises each service function successfully. Route is deleted before Phase 15.

---

## Phase 11 — Auth wiring & route protection

**Goal:** Supabase Auth is live. Users can actually register and log in. Every dashboard route is protected by role.

- [ ] Wire Supabase Auth to all auth forms from Phase 2:
  - Org register → creates `auth.users` entry → trigger creates `profiles` row → redirects to `/pending`
  - Individual register → same flow
  - Org login → session established → redirects to `/dashboard/company`
  - Individual login → redirects to `/dashboard/employee`
  - Logout → clears session → redirects to home
- [ ] Write `middleware.ts`:
  - Unauthenticated users accessing any `/dashboard/*` route → redirect to `/login`
  - `company_admin` accessing `/dashboard/admin/*` → redirect to `/dashboard/company`
  - `employee` or `individual` accessing `/dashboard/company/*` or `/dashboard/admin/*` → redirect to `/dashboard/employee`
  - `pending` users accessing any dashboard → redirect to `/pending`
- [ ] Wire the "Approve" and "Reject" actions in the super admin approvals panel to real service calls

**Done when:** Full registration → pending → approval → dashboard access flow works end-to-end. A `company_admin` cannot reach the admin panel. A `pending` user cannot reach any dashboard.

---

## Phase 12 — Connect all dashboards to real data

**Goal:** Every page that currently shows mock data now shows real Supabase data. Server Components fetch from services; mutations go through Server Actions.

- [ ] Write all Server Actions in `app/actions/`:
  - `onboarding.actions.ts` — register org, register individual
  - `cards.actions.ts` — update card profile, change design
  - `orders.actions.ts` — place order, admin status updates
  - `contacts.actions.ts` — visitor submits exchange
  - `admin.actions.ts` — approve/reject users, manage designs, manage billing plans
- [ ] Replace mock data in employee dashboard with real Server Component fetches
- [ ] Replace mock data in company admin dashboard with real Server Component fetches
- [ ] Replace mock data in super admin panel with real Server Component fetches
- [ ] Replace mock data on public card pages with real data fetched by slug
- [ ] Add loading states (Suspense boundaries + skeleton components) to all data-fetching pages
- [ ] Add empty states to all tables and lists (zero data handled gracefully)

**Done when:** A full end-to-end user journey works with real data — register → pending → approve → edit card profile → visitor taps → sees real card → submits contact → appears in employee inbox.

---

## Phase 13 — vCard, QR codes & image storage

**Goal:** The three core technical features that make EcoTap work: downloadable contacts, scannable QR codes, and persistent images.

**vCard**
- [ ] Build `lib/vcf/generator.ts` — generates a `.vcf` string from a card profile object
- [ ] Build `app/api/vcf/[slug]/route.ts` — serves `.vcf` as a file download for any card slug
- [ ] Wire "Save contact" button on public card pages to this route

**QR codes**
- [ ] Install `qrcode.react` and wire it on the public card page and employee QR tab
- [ ] Implement QR PNG download via canvas `toDataURL` + programmatic click

**Image storage (Cloudflare R2)**
- [ ] Configure R2 bucket and add env credentials
- [ ] Build `lib/r2/upload.ts` — accepts a file buffer, uploads to R2, returns public CDN URL
- [ ] Wire profile photo upload in employee dashboard profile editor
- [ ] Wire company logo upload in company admin settings
- [ ] Wire card design image upload in super admin designs panel

**Done when:** Downloading a `.vcf` and importing it into iOS Contacts and Google Contacts shows all fields correctly. QR code scanned on a real phone opens the correct card URL. Uploaded images persist across page reloads.

---

## Phase 14 — SEO, metadata & OG images

**Goal:** Public card pages are discoverable, shareable, and preview correctly when pasted into WhatsApp, Twitter, or LinkedIn — which is how EcoTap users will share their cards.

- [ ] Add `generateMetadata()` to `app/[username]/page.tsx` — title: `[Name] — [Title] on EcoTap`, description from bio, canonical URL
- [ ] Add `generateMetadata()` to `app/[company]/[employee]/page.tsx`
- [ ] Build `app/[username]/opengraph-image.tsx` — OG image via Next.js `ImageResponse`:
  - Profile photo (or initials), name, title, company, EcoTap logo
- [ ] Build `app/[company]/[employee]/opengraph-image.tsx`
- [ ] Add `app/sitemap.ts` — generates entries for all `is_public = true` cards
- [ ] Add `app/robots.ts` — allow public card pages and `/`; disallow all `/dashboard/*`
- [ ] Add structured data (JSON-LD `Person` schema) to public card pages

**Done when:** Pasting a card URL into [opengraph.xyz](https://opengraph.xyz) shows the correct OG image, title, and description. Sitemap lists all active public cards. `/dashboard/admin` is blocked in robots.txt.

---

## Phase 15 — Production launch

**Goal:** Live on ecotap.rw. All systems verified. NFC chips programmed and working.

- [ ] Connect `niyibizimadeit/ecotap` repo to a Vercel project
- [ ] Set all environment variables in Vercel dashboard
- [ ] Configure `ecotap.rw` custom domain on Vercel with SSL
- [ ] Run `supabase db push` against the production Supabase project
- [ ] Seed production: super admin account, two card designs, two billing plans
- [ ] Set Supabase Auth site URL to `https://ecotap.rw` and whitelist redirect URLs
- [ ] Delete dev-only routes: `/dev/components`, `/api/test`
- [ ] Full end-to-end QA:
  - [ ] Register company → pending page → super admin approves → company admin accesses dashboard → creates employee card → employee edits profile → visitor taps → saves contact
  - [ ] Register individual → pending → approve → edit card → visitor taps → saves `.vcf`
  - [ ] Place card order → super admin approves → marks shipped → marks delivered
- [ ] Test NFC chip: write `https://ecotap.rw/[slug]` to a physical chip → tap on iPhone and Android → card page opens
- [ ] Lighthouse audit on home page and one public card page — fix anything below 90
- [ ] Launch 🎉

---

## Build order summary

```
Phase 1   → Foundation (must be first)
Phase 2   → Public pages: home + auth
Phase 3   → Public pages: card pages (test NFC early)
Phase 4   → Dashboard: employee UI
Phase 5   → Dashboard: card ordering UI
Phase 6   → Dashboard: company admin UI
Phase 7   → Dashboard: super admin UI
Phase 8   → Backend: database schema
Phase 9   → Backend: repositories
Phase 10  → Backend: services
Phase 11  → Backend: auth + route protection
Phase 12  → Integration: connect all UI to real data
Phase 13  → Features: vCard, QR, image uploads
Phase 14  → Polish: SEO, metadata, OG images
Phase 15  → Launch
```