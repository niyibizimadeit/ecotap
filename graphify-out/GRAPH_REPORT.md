# Graph Report - ecotap  (2026-08-08)

## Corpus Check
- 157 files · ~120,612 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 992 nodes · 1689 edges · 63 communities (45 shown, 18 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `898b8345`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- cn
- page.tsx
- getSupabase
- PublicCardLayout.tsx
- page.tsx
- dependencies
- admin.service.ts
- page.tsx
- uploads.actions.ts
- CardPreview.tsx
- getServiceSupabase
- admin.actions.ts
- Button.tsx
- page.tsx
- compilerOptions
- BrandLogo.tsx
- contacts.service.ts
- DashboardShared.tsx
- index.ts
- page.tsx
- Input.tsx
- page.tsx
- cards.actions.ts
- orders.service.ts
- InviteModal.tsx
- profiles.repo.ts
- contact_exchanges.repo.ts
- billing.repo.ts
- CompanySidebar.tsx
- cards.actions.ts
- middleware.ts
- public.actions.ts
- ImageUpload.tsx
- analytics.actions.ts
- companies.repo.ts
- EcoTap — Architecture & Coding Conventions
- server.ts
- Input.tsx
- EcoTap — Fixes & Improvements Plan
- seed-demo-users.ts
- page.tsx
- layout.tsx
- page.tsx
- page.tsx
- eslint.config.mjs
- next.config.ts
- postcss.config.mjs
- layout.tsx
- page.tsx
- page.tsx
- EcoTap — Project TODO
- EcoTap (production)
- AuthLayout.tsx
- auth.actions.ts
- page.tsx
- Demo Accounts
- page.tsx
- CLAUDE.md
- card_orders.repo.ts
- page.tsx

## God Nodes (most connected - your core abstractions)
1. `getSupabase()` - 102 edges
2. `getServiceSupabase` - 59 edges
3. `Button()` - 34 edges
4. `cn()` - 34 edges
5. `requireSuperAdmin()` - 20 edges
6. `EcoTap — Architecture & Coding Conventions` - 19 edges
7. `EcoTap — Project TODO` - 17 edges
8. `PageHeader()` - 16 edges
9. `compilerOptions` - 16 edges
10. `🟡 Testing Results — Medium Severity` - 15 edges

## Surprising Connections (you probably didn't know these)
- `CompanyOverviewContent()` --calls--> `getCompanyDashboardData`  [EXTRACTED]
  src/app/dashboard/company/page.tsx → src/app/actions/company.actions.ts
- `acceptInvitationAction()` --calls--> `getSupabase()`  [EXTRACTED]
  src/app/actions/invitations.actions.ts → src/lib/supabase/server.ts
- `deleteUpload()` --calls--> `getSupabase()`  [EXTRACTED]
  src/app/actions/uploads.actions.ts → src/lib/supabase/server.ts
- `StepIndicator()` --calls--> `cn()`  [EXTRACTED]
  src/app/dashboard/company/orders/new/page.tsx → src/lib/utils/index.ts
- `StepIndicator()` --calls--> `cn()`  [EXTRACTED]
  src/app/dashboard/employee/orders/new/page.tsx → src/lib/utils/index.ts

## Import Cycles
- None detected.

## Communities (63 total, 18 thin omitted)

### Community 0 - "cn"
Cohesion: 0.26
Nodes (11): Card(), CardContent(), CardDescription(), CardFooter(), CardHeader(), CardProps, CardTitle(), cardVariants (+3 more)

### Community 1 - "page.tsx"
Cohesion: 0.16
Nodes (12): approveSubscriptionAction(), fetchAllSubscriptionsAdminAction(), getActivePlansAction(), rejectSubscriptionAction(), requireSuperAdmin(), subscribeAction(), verifySubscriptionPaymentAction(), Currency (+4 more)

### Community 2 - "getSupabase"
Cohesion: 0.09
Nodes (38): assignTestVariant(), createEnvironmentalReport(), getCardScores(), getDailyStats(), getEnvironmentalReports(), getEventCountByType(), getEventsByCardId(), getLatestCardScore() (+30 more)

### Community 3 - "PublicCardLayout.tsx"
Cohesion: 0.11
Nodes (19): AdminUser, ALL_ROLES, ADMIN_ROLES, ADMIN_WRITE_ROLES, CARD_ORIGINAL_PRICES, COLORS, COMPANY_SOCIAL_LINKS, DASHBOARD_ROUTE (+11 more)

### Community 4 - "page.tsx"
Cohesion: 0.19
Nodes (7): OrderForm, OrderForm, CardDesignOption, DesignGalleryProps, MOCK_DESIGNS, OrderSummaryProps, ShippingAddress

### Community 5 - "dependencies"
Cohesion: 0.06
Nodes (35): dependencies, @aws-sdk/client-s3, class-variance-authority, clsx, @hookform/resolvers, lucide-react, next, qrcode.react (+27 more)

### Community 6 - "admin.service.ts"
Cohesion: 0.08
Nodes (8): AdminOverview, deleteOwnAccount(), deleteProfileCascade(), deleteUser(), getUserById(), PendingQueue, UserFilters, VALID_TRANSITIONS

### Community 7 - "page.tsx"
Cohesion: 0.08
Nodes (21): activateEmployeeAction(), CompanyDashboardData, CompanyEmployee, deleteEmployeeAction(), getCompanyDashboardData, suspendEmployeeAction(), UpdateCompanyInput, updateMyCompany() (+13 more)

### Community 8 - "uploads.actions.ts"
Cohesion: 0.17
Nodes (13): deleteFromR2(), generateKey(), getClient(), R2_ACCESS_KEY_ID, R2_BUCKET_NAME, R2_ENDPOINT, R2_PUBLIC_URL, R2_SECRET_ACCESS_KEY (+5 more)

### Community 9 - "CardPreview.tsx"
Cohesion: 0.16
Nodes (12): acceptInvitationAction(), createInvitationAction(), getCompanyInvitationsAction(), revokeInvitationAction(), acceptInvite(), createInvite(), CreateInviteInput, InviteResult (+4 more)

### Community 10 - "getServiceSupabase"
Cohesion: 0.12
Nodes (22): createCard(), deleteCard(), deleteCardGroup(), deleteCardService(), getCardById(), getCardByProfileId(), getCardByProfileIdService(), getCardBySlug() (+14 more)

### Community 11 - "admin.actions.ts"
Cohesion: 0.09
Nodes (39): AnyActionResult, approveCompany(), approveIndividual(), approveOrder(), createDesign(), deleteCompanyAction(), deleteDesign(), deletePlan() (+31 more)

### Community 14 - "page.tsx"
Cohesion: 0.05
Nodes (42): getCurrentUser(), getSession(), getSupabaseServerAction(), requestPasswordReset(), resendOtp(), resetPassword(), resetPasswordWithOtp(), setNewPassword() (+34 more)

### Community 15 - "compilerOptions"
Cohesion: 0.10
Nodes (19): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+11 more)

### Community 16 - "BrandLogo.tsx"
Cohesion: 0.17
Nodes (10): BrandIcon(), BrandIconProps, BrandLogo(), BrandLogoProps, ICON_SIZES, TEXT_COLORS, Footer(), FOOTER_LINKS (+2 more)

### Community 17 - "contacts.service.ts"
Cohesion: 0.08
Nodes (16): getCurrentProfileId(), getMyInbox(), updateContactExchange(), approveCompany(), approveIndividual(), canTransition(), rejectCompany(), rejectUser() (+8 more)

### Community 18 - "DashboardShared.tsx"
Cohesion: 0.05
Nodes (36): BillingPage(), INITIAL_PLANS, PAYMENT_COLORS, PAYMENT_LABELS, Plan, PLAN_FEATURES, SubInfo, AdminContactsPage() (+28 more)

### Community 19 - "index.ts"
Cohesion: 0.09
Nodes (24): ABTestAssignment, AddCompanyForm, CardEvent, CardOrder, CardOrderWithDesign, CardScore, Company, CompanyWithRelations (+16 more)

### Community 20 - "page.tsx"
Cohesion: 0.19
Nodes (8): InviteModal(), Props, Modal(), ModalProps, SIZE_CLASSES, Spinner(), SPINNER_SIZES, SpinnerProps

### Community 21 - "Input.tsx"
Cohesion: 0.05
Nodes (40): RFC-6350, deleteMyAccount(), getMyCard(), getPublicCard, updateMyCard(), GET(), Props, EMPTY_FORM (+32 more)

### Community 22 - "page.tsx"
Cohesion: 0.21
Nodes (10): Currency, EMPTY_ADDRESS, formatCurrency(), getPricePerCard(), NewOrderPage(), Step, StepIndicator(), STEPS (+2 more)

### Community 23 - "cards.actions.ts"
Cohesion: 0.33
Nodes (4): EmployeeSidebar(), NAV, Props, EmployeeDashboardLayout()

### Community 24 - "orders.service.ts"
Cohesion: 0.13
Nodes (13): getActiveDesigns(), getCurrentProfileId(), getMyOrders(), placeOrder(), OrdersPage(), STATUS_BADGE, STATUS_STEP, approveOrder() (+5 more)

### Community 25 - "InviteModal.tsx"
Cohesion: 0.22
Nodes (9): CompanyNewOrderPage(), Currency, EMPTY_ADDRESS, formatCurrency(), getPricePerCard(), Step, StepIndicator(), STEPS (+1 more)

### Community 26 - "profiles.repo.ts"
Cohesion: 0.14
Nodes (14): createProfile(), deleteProfile(), deleteProfileService(), getAllPending(), getAllProfiles(), getProfileByEmail(), getProfileById(), getProfileByUsername() (+6 more)

### Community 27 - "contact_exchanges.repo.ts"
Cohesion: 0.20
Nodes (9): AdminExchangeOptions, createExchange(), deleteExchange(), getAllExchangesAdmin(), getExchangeById(), getExchangesByCardId(), getExchangesByProfileId(), getExchangesCount() (+1 more)

### Community 28 - "billing.repo.ts"
Cohesion: 0.13
Nodes (14): cancelSubscription(), createSubscription(), deletePlan(), getActivePlans(), getAllPlans(), getAllSubscriptions(), getAllSubscriptionsEnriched(), getPlanById() (+6 more)

### Community 29 - "CompanySidebar.tsx"
Cohesion: 0.33
Nodes (8): ALLOWED_TYPES, deleteUpload(), linkPaymentToOrder(), updateCompanyLogo(), updateProfilePhoto(), uploadDesignImage(), uploadPaymentScreenshot(), validateFile()

### Community 30 - "cards.actions.ts"
Cohesion: 0.32
Nodes (4): Avatar(), AvatarProps, SIZE_CLASSES, getInitials()

### Community 31 - "middleware.ts"
Cohesion: 0.39
Nodes (7): AUTH_PAGES, config, isAccessAllowed(), isPublicPath(), middleware(), PUBLIC_CARD_PATTERNS, NOTE: This file must be at src/middleware.ts for Next.js to execute it.

### Community 32 - "public.actions.ts"
Cohesion: 0.38
Nodes (4): PublicCompanyData, PublicEmployee, resolveSlug, Props

### Community 33 - "ImageUpload.tsx"
Cohesion: 0.33
Nodes (6): createCroppedImage(), ICON_SIZES, ImageUpload(), ImageUploadProps, loadImage(), SIZES

### Community 34 - "analytics.actions.ts"
Cohesion: 0.60
Nodes (3): recordPageView(), PageViewTracker(), PageViewTrackerProps

### Community 35 - "companies.repo.ts"
Cohesion: 0.20
Nodes (10): createCompany(), deleteCompany(), deleteCompanyCascade(), getAllCompanies(), getAllPendingCompanies(), getCompanyById(), getCompanyBySlug(), updateCompany() (+2 more)

### Community 36 - "EcoTap — Architecture & Coding Conventions"
Cohesion: 0.05
Nodes (36): Analytics & ML, Analytics & ML data strategy, Architecture: SSOT (Single Source of Truth), Billing & platform, card_events — the core telemetry table, Cards & orders, Company admin registration rules, Country representative rules (+28 more)

### Community 38 - "Input.tsx"
Cohesion: 0.18
Nodes (9): submitContactExchange(), ContactExchangeFormProps, FieldWrapper(), FieldWrapperProps, InputProps, Select, SelectProps, Textarea (+1 more)

### Community 39 - "EcoTap — Fixes & Improvements Plan"
Cohesion: 0.04
Nodes (46): B10. Employee contacts: "Favorites First" sort is inverted, B11. Failed payment screenshot link is silent, success page lies, B1. Billing "Save changes" creates a DUPLICATE plan instead of updating, B2. Billing "Deactivate/Activate" is purely cosmetic — never persisted, B3. Designs "Save changes" reactivates inactive designs + overwrites pattern, B4. resolveCompanyId used WITHOUT role check — privilege escalation, B5. Service-role writes without ownership verification — 5 endpoints, B6. User enumeration confirmed — 3 vectors (+38 more)

### Community 53 - "EcoTap — Project TODO"
Cohesion: 0.11
Nodes (17): Build order summary, EcoTap — Project TODO, Phase 10 — Services layer (SSOT Layer 3), Phase 11 — Auth wiring & route protection, Phase 12 — Connect all dashboards to real data, Phase 13 — vCard, QR codes & image storage, Phase 14 — SEO, metadata & OG images, Phase 15 — Production launch (+9 more)

### Community 54 - "EcoTap (production)"
Cohesion: 0.18
Nodes (10): Database, Deployment, EcoTap (production), Environment variables, Getting started, Project structure, Tech stack, URL structure (+2 more)

### Community 55 - "AuthLayout.tsx"
Cohesion: 0.50
Nodes (4): Badge(), BadgeProps, badgeVariants, DOT_COLORS

### Community 58 - "Demo Accounts"
Cohesion: 0.40
Nodes (4): Admin & Company, Demo Accounts, Notes, RDMC Employees

### Community 62 - "card_orders.repo.ts"
Cohesion: 0.33
Nodes (3): PendingCompany, PendingIndividual, PendingItem

## Knowledge Gaps
- **311 isolated node(s):** `metadata`, `metadata`, `metadata`, `metadata`, `metadata` (+306 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **18 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `getSupabase()` connect `getSupabase` to `companies.repo.ts`, `CardPreview.tsx`, `getServiceSupabase`, `contacts.service.ts`, `DashboardShared.tsx`, `cards.actions.ts`, `orders.service.ts`, `profiles.repo.ts`, `contact_exchanges.repo.ts`, `billing.repo.ts`, `CompanySidebar.tsx`?**
  _High betweenness centrality (0.076) - this node is a cross-community bridge._
- **Why does `getServiceSupabase` connect `getServiceSupabase` to `public.actions.ts`, `analytics.actions.ts`, `getSupabase`, `companies.repo.ts`, `CardPreview.tsx`, `page.tsx`, `contacts.service.ts`, `orders.service.ts`, `profiles.repo.ts`, `contact_exchanges.repo.ts`, `billing.repo.ts`, `CompanySidebar.tsx`?**
  _High betweenness centrality (0.047) - this node is a cross-community bridge._
- **Why does `Button()` connect `page.tsx` to `cn`, `PublicCardLayout.tsx`, `Input.tsx`, `page.tsx`, `admin.actions.ts`, `BrandLogo.tsx`, `DashboardShared.tsx`, `page.tsx`, `Input.tsx`, `page.tsx`, `InviteModal.tsx`?**
  _High betweenness centrality (0.039) - this node is a cross-community bridge._
- **What connects `metadata`, `metadata`, `metadata` to the rest of the system?**
  _312 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `getSupabase` be split into smaller, more focused modules?**
  _Cohesion score 0.08710801393728224 - nodes in this community are weakly interconnected._
- **Should `PublicCardLayout.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.1067193675889328 - nodes in this community are weakly interconnected._
- **Should `dependencies` be split into smaller, more focused modules?**
  _Cohesion score 0.05555555555555555 - nodes in this community are weakly interconnected._