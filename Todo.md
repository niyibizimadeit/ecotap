# EcoTap — Project TODO

15 phases from first pixel to production. Phases marked **[concurrent]** can run in parallel with the phase above.

---

## Phase 1 — Design system & project scaffold

**Goal:** Clean Next.js project with all tokens, fonts, and primitive UI components in place. No pages yet — just the foundation every other phase builds on.

- [ ] Init Next.js 14 project with TypeScript, Tailwind CSS, ESLint
- [ ] Configure custom Tailwind tokens in `tailwind.config.ts`:
  - `emerald-deep: #064E3B`, `emerald-mid: #065F46`, `emerald-bright: #059669`
  - `emerald-light: #D1FAE5`, `emerald-pale: #ECFDF5`
  - `ivory: #FEFCE8`, `cream: #FEF9EF`, `cream-dark: #F5EDD8`
  - `gold: #92400E`, `gold-light: #D97706`, `gold-pale: #FEF3C7`
- [ ] Install and configure Cormorant Garamond + DM Sans fonts (Google Fonts)
- [ ] Set up folder structure: `app/`, `components/ui/`, `lib/`, `types/`, `hooks/`, `constants/`
- [ ] Build primitive UI components in `components/ui/`:
  - `Button` (variants: primary, secondary, ghost, danger)
  - `Input`, `Textarea`, `Select`
  - `Badge` (variants: pending, active, suspended, shipped)
  - `Card`, `Modal`, `Spinner`, `Avatar`
- [ ] Set up `src/types/index.ts` with all global TypeScript interfaces
- [ ] Set up `src/constants/` with roles, statuses, and route constants
- [ ] Configure `tailwind.config.ts` typography plugin for prose content

**Testing:**
- [ ] Visually verify all UI primitives render correctly in a `/dev/components` sandbox page
- [ ] Confirm Tailwind custom tokens resolve in the browser

---

## Phase 2 — Home page (marketing)

**Goal:** A polished, premium home page that communicates what EcoTap does and drives signups. No auth wired yet — just UI.

- [ ] Build `app/(marketing)/page.tsx` home page with:
  - Hero section: headline, subheadline, two CTAs ("For organisations" / "For individuals")
  - How it works section: 3-step visual (register → get card → tap & share)
  - Features section: NFC + QR, custom branding, contact exchange, physical card fulfillment
  - Pricing teaser section: "Flexible plans — contact us for pricing" (no exact figures)
  - Footer: logo, links, tagline, built in Rwanda
- [ ] Build `components/layout/Navbar.tsx` — sticky, transparent on scroll, logo + nav links + CTA
- [ ] Build `components/layout/Footer.tsx`
- [ ] Ensure full mobile responsiveness

**Testing:**
- [ ] Test on mobile (375px), tablet (768px), and desktop (1280px)
- [ ] Verify all CTA buttons link to correct auth routes (even if pages don't exist yet)
- [ ] Check lighthouse score — aim for 90+ performance on desktop

---

## Phase 3 — Authentication pages [concurrent with Phase 2]

**Goal:** All login and register pages designed and functional in UI. No Supabase wired yet — just form shells with validation UI.

- [ ] Build `app/(auth)/org/login/page.tsx` — organisation login
- [ ] Build `app/(auth)/org/register/page.tsx` — organisation registration (multi-step):
  - Step 1: Company info (name, industry, size, website)
  - Step 2: Admin account (name, email, password)
  - Step 3: Review & submit
- [ ] Build `app/(auth)/login/page.tsx` — individual / employee login
- [ ] Build `app/(auth)/register/page.tsx` — individual / employee register (name, email, password, company info optional)
- [ ] Build `app/(auth)/pending/page.tsx` — "Your account is pending approval" holding page shown after any signup
- [ ] Add form validation with `react-hook-form` + `zod` schemas on all forms
- [ ] Build shared `components/auth/AuthLayout.tsx` wrapper (split-screen or centered card)

**Testing:**
- [ ] Verify all zod validation messages display correctly
- [ ] Verify multi-step org register form navigates between steps correctly
- [ ] Confirm redirect to `/pending` page works after submit

---

## Phase 4 — Employee / individual dashboard UI [concurrent with Phase 3]

**Goal:** Full employee dashboard designed. No real data yet — use mock/static data.

- [ ] Build `app/dashboard/employee/layout.tsx` — sidebar navigation layout
- [ ] Build `app/dashboard/employee/page.tsx` — overview with stats (card views, contacts received)
- [ ] Build `app/dashboard/employee/profile/page.tsx` — profile editor:
  - Fields: full name, job title, company, phone, email, bio, website
  - Social links: LinkedIn, Twitter/X, WhatsApp, Instagram
  - Profile photo upload UI
- [ ] Build `components/cards/CardPreview.tsx` — live card preview that updates as user types
- [ ] Build `app/dashboard/employee/qr/page.tsx` — QR code display + download button
- [ ] Build `app/dashboard/employee/contacts/page.tsx` — inbox of visitors who submitted their info
- [ ] Build `app/dashboard/employee/order/page.tsx` — card ordering UI (see Phase 6)

**Testing:**
- [ ] Verify sidebar navigation works on mobile (collapses to bottom bar or hamburger)
- [ ] Verify CardPreview updates reactively when form fields change
- [ ] Verify QR code renders correctly with a mock URL

---

## Phase 5 — Company admin dashboard UI [concurrent with Phase 4]

**Goal:** Full company admin dashboard designed. Static/mock data.

- [ ] Build `app/dashboard/company/layout.tsx` — sidebar layout
- [ ] Build `app/dashboard/company/page.tsx` — overview: employee count, active cards, pending orders
- [ ] Build `app/dashboard/company/employees/page.tsx` — employee table with name, status badge, card URL, actions
- [ ] Build `app/dashboard/company/settings/page.tsx` — company branding (logo upload, brand color picker, company name/slug)
- [ ] Build `app/dashboard/company/departments/page.tsx` — create, edit, delete departments; assign employees
- [ ] Build `app/dashboard/company/subscription/page.tsx` — plan name, employee count, billing cycle, status

**Testing:**
- [ ] Verify employee table renders, filters, and paginates correctly with mock data
- [ ] Verify color picker updates a live preview of how brand color will appear on cards
- [ ] Test on mobile breakpoints

---

## Phase 6 — Card ordering UI [concurrent with Phase 4]

**Goal:** Complete card ordering flow designed and navigable. No backend yet.

- [ ] Build `components/orders/DesignGallery.tsx` — grid of available card designs with preview images and names
- [ ] Build `app/dashboard/employee/order/page.tsx` — full order flow:
  - Step 1: Choose design from gallery
  - Step 2: Quantity selector (1–100) + shipping address form
  - Step 3: Order summary + "Place order" button
- [ ] Build `app/dashboard/employee/order/success/page.tsx` — order confirmation page
- [ ] Build `app/dashboard/employee/order/history/page.tsx` — order history list with status badges (pending, approved, shipped, delivered)

**Testing:**
- [ ] Verify full order flow navigates correctly step by step
- [ ] Verify quantity input validation (min 1, max 100)
- [ ] Verify order history renders mock orders with correct status badges

---

## Phase 7 — Public card pages UI

**Goal:** The pages a visitor sees when they tap an NFC chip. Fast, beautiful, no login required.

- [ ] Build `app/[username]/page.tsx` — individual / freelancer public card
- [ ] Build `app/[company]/[employee]/page.tsx` — company employee public card
- [ ] Build `components/cards/PublicCardLayout.tsx` — shared layout for both public card types:
  - Profile photo, name, title, company
  - Bio section
  - Social links row (icons, opens in new tab)
  - "Save contact" button (downloads .vcf)
  - Visitor contact exchange form (name, email, phone — optional)
  - Powered by EcoTap footer link
- [ ] Build card theme rendering — apply selected design + brand color to the layout
- [ ] Build `app/[username]/not-found.tsx` and `app/[company]/[employee]/not-found.tsx` — clean 404 pages

**Testing:**
- [ ] Test with mock data for both individual and company employee variants
- [ ] Test on mobile (this page is primarily tapped on a phone)
- [ ] Verify "Save contact" downloads a correctly formatted .vcf file (mock data)
- [ ] Test with a long bio and many social links to verify layout holds

---

## Phase 8 — Super admin panel UI [concurrent with Phase 7]

**Goal:** Full super admin interface designed. All management views.

- [ ] Build `app/dashboard/admin/layout.tsx` — admin sidebar layout
- [ ] Build `app/dashboard/admin/page.tsx` — overview: pending approvals count, active users, recent orders
- [ ] Build `app/dashboard/admin/approvals/page.tsx` — pending queue with approve / reject actions for:
  - Companies
  - Individual users
- [ ] Build `app/dashboard/admin/orders/page.tsx` — all card orders table with status update actions (approve, mark shipped, mark delivered)
- [ ] Build `app/dashboard/admin/designs/page.tsx` — card designs management (upload design image, name, activate/deactivate)
- [ ] Build `app/dashboard/admin/users/page.tsx` — all users table (filter by role, status, search by name/email)
- [ ] Build `app/dashboard/admin/billing/page.tsx` — billing plans list (create/edit monthly and annual plans with per-employee pricing)

**Testing:**
- [ ] Verify all tables render correctly with mock data
- [ ] Verify approve/reject actions update status badges correctly (UI only for now)
- [ ] Test all admin pages on desktop (admin panel is desktop-first)

---

## Phase 9 — Database schema & migrations

**Goal:** Complete Supabase schema, all tables created, RLS in place.

- [ ] Set up Supabase project, get credentials, configure `.env.local`
- [ ] Configure `@supabase/ssr` client helpers in `lib/supabase/`:
  - `client.ts` — browser client
  - `server.ts` — server component client
  - `middleware.ts` — middleware client
- [ ] Write and apply migrations (in `supabase/migrations/`):
  - `profiles` — id, role enum, status enum, username, company_id FK, created_at
  - `companies` — id, name, slug, logo_url, brand_color, status, created_at
  - `departments` — id, company_id FK, name
  - `cards` — id, profile_id FK, slug, theme, accent_color, bio, social_links (jsonb), qr_url, is_public
  - `card_designs` — id, name, preview_url, is_active
  - `card_orders` — id, profile_id FK, design_id FK, quantity, shipping_address (jsonb), status enum, created_at
  - `contact_exchanges` — id, card_id FK, visitor_name, visitor_email, visitor_phone, created_at
  - `billing_plans` — id, name, billing_cycle enum, price_per_employee, is_active
  - `company_subscriptions` — id, company_id FK, plan_id FK, status, employee_count, next_billing_date
- [ ] Configure Row Level Security (RLS) policies on all tables
- [ ] Add DB trigger: auto-insert `profiles` row when a new `auth.users` row is created
- [ ] Add indexes on frequently queried columns: `profiles.username`, `companies.slug`, `cards.slug`

**Testing:**
- [ ] Run `supabase db push` with zero errors
- [ ] Verify RLS policies block cross-user data access in Supabase dashboard
- [ ] Verify trigger creates a profiles row on new user signup

---

## Phase 10 — Repositories layer (SSOT Layer 2)

**Goal:** All raw DB access functions. No business logic here — queries only.

- [ ] Write `lib/supabase/profiles.repo.ts`:
  - `getProfileById`, `getProfileByUsername`, `updateProfile`, `updateStatus`, `getAllPending`
- [ ] Write `lib/supabase/companies.repo.ts`:
  - `getCompanyById`, `getCompanyBySlug`, `createCompany`, `updateCompany`, `updateStatus`, `getAllPending`
- [ ] Write `lib/supabase/cards.repo.ts`:
  - `getCardBySlug`, `getCardByProfileId`, `createCard`, `updateCard`
- [ ] Write `lib/supabase/card_orders.repo.ts`:
  - `createOrder`, `getOrdersByProfileId`, `getAllOrders`, `updateOrderStatus`
- [ ] Write `lib/supabase/contact_exchanges.repo.ts`:
  - `createExchange`, `getExchangesByCardId`
- [ ] Write `lib/supabase/card_designs.repo.ts`:
  - `getActiveDesigns`, `getAllDesigns`, `createDesign`, `updateDesign`
- [ ] Write `lib/supabase/billing.repo.ts`:
  - `getActivePlans`, `getAllPlans`, `upsertPlan`

**Testing:**
- [ ] Write a simple test script that calls each repo function and logs the result
- [ ] Confirm TypeScript types match actual DB column types (no `any`)

---

## Phase 11 — Services layer (SSOT Layer 3)

**Goal:** All business logic — status transitions, cross-table operations, validations.

- [ ] Write `lib/services/onboarding.service.ts`:
  - `registerCompany` — create company + admin profile, status = pending
  - `registerIndividual` — create profile, status = pending
  - `approveCompany(id)` — validates pending → active transition
  - `approveIndividual(id)` — validates pending → active transition
  - `rejectUser(id, reason)` — sets status to suspended
- [ ] Write `lib/services/cards.service.ts`:
  - `createCardForProfile(profileId)` — creates card row with auto-generated slug
  - `updateCardProfile(profileId, data)` — updates card fields
  - `getPublicCard(slug)` — fetches card + profile for public page
- [ ] Write `lib/services/orders.service.ts`:
  - `placeOrder(profileId, data)` — validates and creates order
  - `approveOrder(orderId)` — admin approves
  - `markShipped(orderId, trackingInfo)`, `markDelivered(orderId)`
- [ ] Write `lib/services/contacts.service.ts`:
  - `recordExchange(cardId, visitorData)` — visitor submits contact
  - `getInbox(profileId)` — returns all exchanges for a card owner
- [ ] Write `lib/services/admin.service.ts`:
  - `getPendingQueue()` — all pending companies + individuals
  - `getAllOrders()`, `getAllUsers(filters)`

**Testing:**
- [ ] Test each service function manually via a test route `/api/test` (dev only, delete before launch)
- [ ] Verify status transition guards throw correctly (e.g. approving an already-active company errors)

---

## Phase 12 — Server Actions & auth wiring (SSOT Layer 4 connection)

**Goal:** Connect all UI forms to the backend. Full auth flow live.

- [ ] Wire Supabase Auth — email/password signup, login, logout, session refresh
- [ ] Write `middleware.ts` — protect dashboard routes by role; redirect unauthenticated users to login
- [ ] Write `app/actions/onboarding.actions.ts` — register org, register individual (call services, return `{ success, error }`)
- [ ] Write `app/actions/cards.actions.ts` — update profile, change design
- [ ] Write `app/actions/orders.actions.ts` — place order, admin status updates
- [ ] Write `app/actions/contacts.actions.ts` — visitor submits exchange
- [ ] Write `app/actions/admin.actions.ts` — approve/reject company, approve/reject individual
- [ ] Replace all mock/static data in dashboards with real Supabase data via Server Components

**Testing:**
- [ ] End-to-end: register as a company → see pending page → super admin approves → company admin can access dashboard
- [ ] End-to-end: register as individual → pending → approve → access employee dashboard
- [ ] Verify unauthenticated users are redirected from all dashboard routes
- [ ] Verify a `company_admin` cannot access `/dashboard/admin` routes

---

## Phase 13 — vCard, QR generation & image storage

**Goal:** Downloadable .vcf contacts, working QR codes, and all image uploads live.

- [ ] Build `lib/vcf/generator.ts` — generate a `.vcf` string from a card profile object
- [ ] Build `app/api/vcf/[slug]/route.ts` — serves the `.vcf` file download for any public card slug
- [ ] Wire `qrcode.react` on the public card page and employee dashboard QR tab
- [ ] Add QR PNG download (canvas `toDataURL` → trigger download)
- [ ] Configure Cloudflare R2 bucket and env credentials
- [ ] Build `lib/r2/upload.ts` — upload buffer, return public CDN URL
- [ ] Wire profile photo upload in employee dashboard
- [ ] Wire company logo upload in company admin settings
- [ ] Wire card design image upload in super admin designs panel

**Testing:**
- [ ] Download a .vcf and import it into both iOS Contacts and Google Contacts — verify all fields appear
- [ ] Scan the generated QR code with a phone — verify it opens the correct public card URL
- [ ] Upload a profile photo, reload page — verify it persists and displays correctly
- [ ] Test R2 upload with a large image (5MB+) to confirm no timeout

---

## Phase 14 — SEO, metadata & OG images

**Goal:** Public card pages are shareable, discoverable, and correctly previewed when linked.

- [ ] Add `generateMetadata()` to `app/[username]/page.tsx` — title, description, canonical URL
- [ ] Add `generateMetadata()` to `app/[company]/[employee]/page.tsx`
- [ ] Build `app/[username]/opengraph-image.tsx` — OG image using Next.js `ImageResponse` (name, title, photo, EcoTap branding)
- [ ] Build `app/[company]/[employee]/opengraph-image.tsx`
- [ ] Add `app/sitemap.ts` — generate sitemap entries for all public cards
- [ ] Add `app/robots.ts` — allow public card pages and home; disallow all dashboard routes

**Testing:**
- [ ] Use [opengraph.xyz](https://opengraph.xyz) to preview OG image for a test card — verify it renders
- [ ] Check sitemap.xml in browser — verify all active cards appear
- [ ] Check robots.txt — verify `/dashboard` is disallowed

---

## Phase 15 — Production launch

**Goal:** Live on ecotap.rw, all systems verified end-to-end.

- [ ] Connect GitHub repo (`niyibizimadeit/ecotap`) to Vercel project
- [ ] Set all environment variables in Vercel dashboard
- [ ] Configure `ecotap.rw` custom domain on Vercel with SSL
- [ ] Run `supabase db push` against production Supabase project
- [ ] Seed super admin account in production DB
- [ ] Set Supabase Auth site URL to `https://ecotap.rw` and add redirect URLs
- [ ] Full end-to-end QA run:
  - [ ] Register company → see pending page → super admin approves → company admin creates employee profile → employee edits card → visitor taps → saves contact
  - [ ] Register individual → pending → approve → edit card → visitor taps → saves .vcf
  - [ ] Place card order → super admin approves → marks shipped → marks delivered
- [ ] Test NFC chip programming: write `ecotap.rw/[slug]` URL to a physical NFC chip → tap with a phone → card page opens
- [ ] Run Lighthouse audit on home page and one public card page — fix any issues below 90
- [ ] Remove any dev-only routes (`/dev/components`, `/api/test`, etc.)
- [ ] Launch 🎉

---

## Phase concurrency map

| Phase | Depends on | Can run concurrently with |
|---|---|---|
| 1 | — | — |
| 2 | 1 | — |
| 3 | 1 | 2 |
| 4 | 1, 3 | 2, 5, 6 |
| 5 | 1, 3 | 2, 4, 6 |
| 6 | 1, 3 | 4, 5 |
| 7 | 1 | 8 |
| 8 | 1 | 7 |
| 9 | — | 7, 8 |
| 10 | 9 | 11 (partially) |
| 11 | 10 | — |
| 12 | 2–8, 11 | 13 |
| 13 | 9, 12 | — |
| 14 | 7, 12 | — |
| 15 | 1–14 | — |