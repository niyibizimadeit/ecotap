# Graph Report - ecotap  (2026-08-09)

## Corpus Check
- 157 files · ~120,970 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 992 nodes · 1639 edges · 72 communities (53 shown, 19 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `ea980639`
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
- onboarding.service.ts
- card_orders.repo.ts
- page.tsx
- page.tsx
- page.tsx
- page.tsx
- page.tsx
- page.tsx
- page.tsx
- page.tsx

## God Nodes (most connected - your core abstractions)
1. `getSupabase()` - 102 edges
2. `getServiceSupabase` - 59 edges
3. `cn()` - 34 edges
4. `Button()` - 30 edges
5. `requireSuperAdmin()` - 20 edges
6. `EcoTap — Architecture & Coding Conventions` - 19 edges
7. `EcoTap — Project TODO` - 17 edges
8. `compilerOptions` - 16 edges
9. `🟡 Testing Results — Medium Severity` - 15 edges
10. `getSupabaseServerAction()` - 14 edges

## Surprising Connections (you probably didn't know these)
- `acceptInvitationAction()` --calls--> `getSupabase()`  [EXTRACTED]
  src/app/actions/invitations.actions.ts → src/lib/supabase/server.ts
- `deleteUpload()` --calls--> `getSupabase()`  [EXTRACTED]
  src/app/actions/uploads.actions.ts → src/lib/supabase/server.ts
- `StepIndicator()` --calls--> `cn()`  [EXTRACTED]
  src/app/dashboard/company/orders/new/page.tsx → src/lib/utils/index.ts
- `StepIndicator()` --calls--> `cn()`  [EXTRACTED]
  src/app/dashboard/employee/orders/new/page.tsx → src/lib/utils/index.ts
- `PublicCardLayoutProps` --references--> `PublicCard`  [EXTRACTED]
  src/components/cards/PublicCardLayout.tsx → src/types/index.ts

## Import Cycles
- None detected.

## Communities (72 total, 19 thin omitted)

### Community 0 - "cn"
Cohesion: 0.19
Nodes (15): Badge(), BadgeProps, badgeVariants, DOT_COLORS, Card(), CardContent(), CardDescription(), CardFooter() (+7 more)

### Community 1 - "page.tsx"
Cohesion: 0.16
Nodes (12): approveSubscriptionAction(), fetchAllSubscriptionsAdminAction(), getActivePlansAction(), rejectSubscriptionAction(), requireSuperAdmin(), subscribeAction(), verifySubscriptionPaymentAction(), Currency (+4 more)

### Community 2 - "getSupabase"
Cohesion: 0.11
Nodes (31): assignTestVariant(), createEnvironmentalReport(), getCardScores(), getDailyStats(), getEnvironmentalReports(), getEventCountByType(), getEventsByCardId(), getLatestCardScore() (+23 more)

### Community 3 - "PublicCardLayout.tsx"
Cohesion: 0.12
Nodes (15): ADMIN_ROLES, ADMIN_WRITE_ROLES, CARD_ORIGINAL_PRICES, COLORS, COMPANY_SOCIAL_LINKS, DASHBOARD_ROUTE, ENV, NOTIFICATION_LABELS (+7 more)

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
Cohesion: 0.19
Nodes (8): activateEmployeeAction(), CompanyDashboardData, CompanyEmployee, deleteEmployeeAction(), suspendEmployeeAction(), UpdateCompanyInput, Props, Props

### Community 8 - "uploads.actions.ts"
Cohesion: 0.17
Nodes (13): deleteFromR2(), generateKey(), getClient(), R2_ACCESS_KEY_ID, R2_BUCKET_NAME, R2_ENDPOINT, R2_PUBLIC_URL, R2_SECRET_ACCESS_KEY (+5 more)

### Community 9 - "CardPreview.tsx"
Cohesion: 0.16
Nodes (12): acceptInvitationAction(), createInvitationAction(), getCompanyInvitationsAction(), revokeInvitationAction(), acceptInvite(), createInvite(), CreateInviteInput, InviteResult (+4 more)

### Community 10 - "getServiceSupabase"
Cohesion: 0.10
Nodes (25): recordPageView(), PageViewTracker(), PageViewTrackerProps, createCard(), deleteCard(), deleteCardGroup(), deleteCardService(), getCardById() (+17 more)

### Community 11 - "admin.actions.ts"
Cohesion: 0.12
Nodes (32): AnyActionResult, approveCompany(), approveIndividual(), approveOrder(), createDesign(), deleteCompanyAction(), deleteDesign(), deletePlan() (+24 more)

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
Nodes (12): getCurrentProfileId(), getMyInbox(), submitContactExchange(), updateContactExchange(), ContactExchangeFormProps, Textarea, subscribe(), SubscribeInput (+4 more)

### Community 18 - "DashboardShared.tsx"
Cohesion: 0.15
Nodes (9): AdminContactsPage(), EmployeeOverviewContent(), EmptyState(), PageHeader(), PageHeaderProps, StatCard(), StatCardProps, StatCardSkeleton() (+1 more)

### Community 19 - "index.ts"
Cohesion: 0.07
Nodes (32): createDesign(), deleteDesign(), getActiveDesigns(), getAllDesigns(), getDesignById(), updateDesign(), ABTestAssignment, AddCompanyForm (+24 more)

### Community 20 - "page.tsx"
Cohesion: 0.19
Nodes (8): InviteModal(), Props, Modal(), ModalProps, SIZE_CLASSES, Spinner(), SPINNER_SIZES, SpinnerProps

### Community 21 - "Input.tsx"
Cohesion: 0.06
Nodes (38): RFC-6350, deleteMyAccount(), getMyCard(), getPublicCard, updateMyCard(), GET(), Props, EMPTY_FORM (+30 more)

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
Cohesion: 0.13
Nodes (15): createProfile(), deleteProfile(), deleteProfileService(), getAllPending(), getAllProfiles(), getProfileByEmail(), getProfileById(), getProfileByUsername() (+7 more)

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
Cohesion: 0.21
Nodes (6): PublicCardLayout(), PublicCardLayoutProps, Avatar(), AvatarProps, SIZE_CLASSES, getInitials()

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
Cohesion: 0.18
Nodes (7): getCompanyDashboardData, NAV, Props, CompanyDashboardLayout(), CompanyOverviewContent(), CompanySettingsPage(), SubscriptionContent()

### Community 35 - "companies.repo.ts"
Cohesion: 0.18
Nodes (11): createCompany(), deleteCompany(), deleteCompanyCascade(), getAllCompanies(), getAllPendingCompanies(), getCompanyById(), getCompanyBySlug(), updateCompany() (+3 more)

### Community 36 - "EcoTap — Architecture & Coding Conventions"
Cohesion: 0.05
Nodes (36): Analytics & ML, Analytics & ML data strategy, Architecture: SSOT (Single Source of Truth), Billing & platform, card_events — the core telemetry table, Cards & orders, Company admin registration rules, Country representative rules (+28 more)

### Community 38 - "Input.tsx"
Cohesion: 0.29
Nodes (6): FieldWrapper(), FieldWrapperProps, InputProps, Select, SelectProps, TextareaProps

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
Cohesion: 0.21
Nodes (9): ContactsClient(), LEAD_LEVELS, Props, SortDir, SortField, ContactsContent(), SectionCard(), ContactExchange (+1 more)

### Community 58 - "Demo Accounts"
Cohesion: 0.40
Nodes (4): Admin & Company, Demo Accounts, Notes, RDMC Employees

### Community 61 - "onboarding.service.ts"
Cohesion: 0.31
Nodes (7): approveCompany(), approveIndividual(), canTransition(), rejectCompany(), rejectUser(), suspendUser(), VALID_TRANSITIONS

### Community 62 - "card_orders.repo.ts"
Cohesion: 0.33
Nodes (3): PendingCompany, PendingIndividual, PendingItem

### Community 63 - "page.tsx"
Cohesion: 0.22
Nodes (6): AdminOrder, PAYMENT_COLORS, PAYMENT_LABELS, RawOrder, STATUS_COLORS, STATUS_NEXT

### Community 64 - "page.tsx"
Cohesion: 0.29
Nodes (7): BillingPage(), INITIAL_PLANS, PAYMENT_COLORS, PAYMENT_LABELS, Plan, PLAN_FEATURES, SubInfo

### Community 65 - "page.tsx"
Cohesion: 0.33
Nodes (5): updateMyCompany(), DEFAULT_FORM, FormState, PRESET_COLORS, INDUSTRIES

### Community 67 - "page.tsx"
Cohesion: 0.33
Nodes (3): Design, INITIAL_DESIGNS, PRESET_COLORS

### Community 68 - "page.tsx"
Cohesion: 0.33
Nodes (3): STATUS_BADGE, STATUS_STEP, OrderStatus

### Community 69 - "page.tsx"
Cohesion: 0.40
Nodes (4): AdminQrPage(), BG_COLORS, FG_COLORS, UserMatch

## Knowledge Gaps
- **317 isolated node(s):** `Plan`, `SubInfo`, `INITIAL_PLANS`, `PAYMENT_LABELS`, `PAYMENT_COLORS` (+312 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **19 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `getSupabase()` connect `getSupabase` to `companies.repo.ts`, `CardPreview.tsx`, `getServiceSupabase`, `contacts.service.ts`, `DashboardShared.tsx`, `index.ts`, `cards.actions.ts`, `AuthLayout.tsx`, `orders.service.ts`, `profiles.repo.ts`, `contact_exchanges.repo.ts`, `billing.repo.ts`, `CompanySidebar.tsx`?**
  _High betweenness centrality (0.075) - this node is a cross-community bridge._
- **Why does `getServiceSupabase` connect `getServiceSupabase` to `public.actions.ts`, `getSupabase`, `companies.repo.ts`, `CardPreview.tsx`, `page.tsx`, `contacts.service.ts`, `onboarding.service.ts`, `orders.service.ts`, `profiles.repo.ts`, `contact_exchanges.repo.ts`, `billing.repo.ts`, `CompanySidebar.tsx`?**
  _High betweenness centrality (0.047) - this node is a cross-community bridge._
- **Why does `Button()` connect `page.tsx` to `cn`, `page.tsx`, `page.tsx`, `page.tsx`, `BrandLogo.tsx`, `contacts.service.ts`, `DashboardShared.tsx`, `page.tsx`, `Input.tsx`, `page.tsx`, `InviteModal.tsx`?**
  _High betweenness centrality (0.033) - this node is a cross-community bridge._
- **What connects `Plan`, `SubInfo`, `INITIAL_PLANS` to the rest of the system?**
  _318 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `getSupabase` be split into smaller, more focused modules?**
  _Cohesion score 0.10873440285204991 - nodes in this community are weakly interconnected._
- **Should `PublicCardLayout.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.11764705882352941 - nodes in this community are weakly interconnected._
- **Should `dependencies` be split into smaller, more focused modules?**
  _Cohesion score 0.05555555555555555 - nodes in this community are weakly interconnected._