# Graph Report - ecotap  (2026-08-08)

## Corpus Check
- 156 files · ~119,620 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 980 nodes · 1765 edges · 59 communities (49 shown, 10 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `7c2d3161`
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
- profiles.repo.ts
- billing.repo.ts
- CompanySidebar.tsx
- cards.actions.ts
- companies.repo.ts
- EcoTap — Architecture & Coding Conventions
- server.ts
- Input.tsx
- EcoTap — Fixes & Improvements Plan
- seed-demo-users.ts
- layout.tsx
- eslint.config.mjs
- next.config.ts
- postcss.config.mjs
- EcoTap — Project TODO
- EcoTap (production)
- AuthLayout.tsx
- auth.actions.ts
- page.tsx
- Demo Accounts
- CLAUDE.md
- card_orders.repo.ts
- page.tsx
- VerifyResetForm.tsx
- page.tsx

## God Nodes (most connected - your core abstractions)
1. `getSupabase()` - 115 edges
2. `getServiceSupabase` - 67 edges
3. `Button()` - 37 edges
4. `cn()` - 34 edges
5. `requireSuperAdmin()` - 31 edges
6. `EcoTap — Architecture & Coding Conventions` - 19 edges
7. `PageHeader()` - 17 edges
8. `resolveCompanyId()` - 17 edges
9. `EcoTap — Project TODO` - 17 edges
10. `compilerOptions` - 16 edges

## Surprising Connections (you probably didn't know these)
- `OrgRegisterPage()` --calls--> `signUpOrg()`  [EXTRACTED]
  src/app/(auth)/org/register/page.tsx → src/app/actions/auth.actions.ts
- `CompanyOverviewContent()` --calls--> `getCompanyDashboardData`  [EXTRACTED]
  src/app/dashboard/company/page.tsx → src/app/actions/company.actions.ts
- `acceptInvitationAction()` --calls--> `getSupabase()`  [EXTRACTED]
  src/app/actions/invitations.actions.ts → src/lib/supabase/server.ts
- `deleteUpload()` --calls--> `getSupabase()`  [EXTRACTED]
  src/app/actions/uploads.actions.ts → src/lib/supabase/server.ts
- `StepIndicator()` --calls--> `cn()`  [EXTRACTED]
  src/app/dashboard/company/orders/new/page.tsx → src/lib/utils/index.ts

## Import Cycles
- None detected.

## Communities (59 total, 10 thin omitted)

### Community 0 - "cn"
Cohesion: 0.06
Nodes (41): BrandIcon(), BrandIconProps, BrandLogo(), BrandLogoProps, ICON_SIZES, TEXT_COLORS, Footer(), FOOTER_LINKS (+33 more)

### Community 1 - "page.tsx"
Cohesion: 0.09
Nodes (17): approveSubscriptionAction(), fetchAllSubscriptionsAdminAction(), getActivePlansAction(), getMySubscriptionAction(), rejectSubscriptionAction(), requireSuperAdmin(), subscribeAction(), verifySubscriptionPaymentAction() (+9 more)

### Community 2 - "getSupabase"
Cohesion: 0.09
Nodes (38): assignTestVariant(), createEnvironmentalReport(), getCardScores(), getDailyStats(), getEnvironmentalReports(), getEventCountByType(), getEventsByCardId(), getLatestCardScore() (+30 more)

### Community 3 - "PublicCardLayout.tsx"
Cohesion: 0.07
Nodes (33): AdminUser, ALL_ROLES, ADMIN_ROLES, ADMIN_WRITE_ROLES, CARD_ORIGINAL_PRICES, COLORS, COMPANY_SOCIAL_LINKS, DASHBOARD_ROUTE (+25 more)

### Community 4 - "page.tsx"
Cohesion: 0.07
Nodes (34): ALLOWED_TYPES, deleteUpload(), linkPaymentToOrder(), updateCompanyLogo(), updateProfilePhoto(), uploadDesignImage(), uploadPaymentScreenshot(), validateFile() (+26 more)

### Community 5 - "dependencies"
Cohesion: 0.06
Nodes (35): dependencies, @aws-sdk/client-s3, class-variance-authority, clsx, @hookform/resolvers, lucide-react, next, qrcode.react (+27 more)

### Community 6 - "admin.service.ts"
Cohesion: 0.08
Nodes (8): AdminOverview, deleteOwnAccount(), deleteProfileCascade(), deleteUser(), getUserById(), PendingQueue, UserFilters, VALID_TRANSITIONS

### Community 7 - "page.tsx"
Cohesion: 0.06
Nodes (35): activateEmployeeAction(), CompanyDashboardData, CompanyEmployee, deleteEmployeeAction(), getCompanyDashboardData, suspendEmployeeAction(), UpdateCompanyInput, updateMyCompany() (+27 more)

### Community 8 - "uploads.actions.ts"
Cohesion: 0.17
Nodes (13): deleteFromR2(), generateKey(), getClient(), R2_ACCESS_KEY_ID, R2_BUCKET_NAME, R2_ENDPOINT, R2_PUBLIC_URL, R2_SECRET_ACCESS_KEY (+5 more)

### Community 9 - "CardPreview.tsx"
Cohesion: 0.13
Nodes (17): deleteMyAccount(), EMPTY_FORM, EMPTY_GROUP, FormState, GroupEntry, CardPreview(), CardPreviewProps, GroupPreviewEntry (+9 more)

### Community 10 - "getServiceSupabase"
Cohesion: 0.13
Nodes (21): createCard(), deleteCard(), deleteCardGroup(), deleteCardService(), getCardById(), getCardByProfileId(), getCardByProfileIdService(), getCardBySlug() (+13 more)

### Community 11 - "admin.actions.ts"
Cohesion: 0.09
Nodes (38): AnyActionResult, approveCompany(), approveIndividual(), approveOrder(), createDesign(), deleteCompanyAction(), deleteDesign(), deletePlan() (+30 more)

### Community 12 - "Button.tsx"
Cohesion: 0.14
Nodes (4): Props, Button(), ButtonProps, buttonVariants

### Community 14 - "page.tsx"
Cohesion: 0.12
Nodes (15): age, email, fullName, IndividualRegisterData, individualRegisterSchema, LoginData, loginSchema, OrgRegisterData (+7 more)

### Community 15 - "compilerOptions"
Cohesion: 0.10
Nodes (19): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+11 more)

### Community 16 - "BrandLogo.tsx"
Cohesion: 0.28
Nodes (8): BillingPage(), INITIAL_PLANS, PAYMENT_COLORS, PAYMENT_LABELS, Plan, PLAN_FEATURES, SubInfo, BillingCycle

### Community 17 - "contacts.service.ts"
Cohesion: 0.10
Nodes (17): getCurrentProfileId(), getMyInbox(), updateContactExchange(), Props, AdminExchangeOptions, createExchange(), deleteExchange(), getAllExchangesAdmin() (+9 more)

### Community 18 - "DashboardShared.tsx"
Cohesion: 0.18
Nodes (4): CompanyOverviewContent(), EmployeeOverviewContent(), StatCard(), StatCardSkeleton()

### Community 19 - "index.ts"
Cohesion: 0.09
Nodes (24): ABTestAssignment, AddCompanyForm, CardEvent, CardOrder, CardOrderWithDesign, CardScore, Company, CompanyWithRelations (+16 more)

### Community 20 - "page.tsx"
Cohesion: 0.33
Nodes (3): Design, INITIAL_DESIGNS, PRESET_COLORS

### Community 21 - "Input.tsx"
Cohesion: 0.09
Nodes (23): RFC-6350, recordPageView(), getPublicCard, PublicCompanyData, PublicEmployee, resolveSlug, GET(), Props (+15 more)

### Community 22 - "page.tsx"
Cohesion: 0.33
Nodes (4): AdminContactsPage(), EmptyState(), PageHeaderProps, StatCardProps

### Community 23 - "cards.actions.ts"
Cohesion: 0.33
Nodes (4): EmployeeSidebar(), NAV, Props, EmployeeDashboardLayout()

### Community 24 - "orders.service.ts"
Cohesion: 0.13
Nodes (13): getActiveDesigns(), getCurrentProfileId(), getMyOrders(), placeOrder(), OrdersPage(), STATUS_BADGE, STATUS_STEP, approveOrder() (+5 more)

### Community 26 - "profiles.repo.ts"
Cohesion: 0.14
Nodes (14): createProfile(), deleteProfile(), deleteProfileService(), getAllPending(), getAllProfiles(), getProfileByEmail(), getProfileById(), getProfileByUsername() (+6 more)

### Community 28 - "billing.repo.ts"
Cohesion: 0.13
Nodes (14): cancelSubscription(), createSubscription(), deletePlan(), getActivePlans(), getAllPlans(), getAllSubscriptions(), getAllSubscriptionsEnriched(), getPlanById() (+6 more)

### Community 30 - "cards.actions.ts"
Cohesion: 0.22
Nodes (8): getMyCard(), updateMyCard(), getOwnCard(), getPublicCard(), syncCardGroups(), Card, CardProfileForm, PublicCard

### Community 35 - "companies.repo.ts"
Cohesion: 0.20
Nodes (10): createCompany(), deleteCompany(), deleteCompanyCascade(), getAllCompanies(), getAllPendingCompanies(), getCompanyById(), getCompanyBySlug(), updateCompany() (+2 more)

### Community 36 - "EcoTap — Architecture & Coding Conventions"
Cohesion: 0.05
Nodes (36): Analytics & ML, Analytics & ML data strategy, Architecture: SSOT (Single Source of Truth), Billing & platform, card_events — the core telemetry table, Cards & orders, Company admin registration rules, Country representative rules (+28 more)

### Community 38 - "Input.tsx"
Cohesion: 0.11
Nodes (14): submitContactExchange(), OrgRegisterPage(), Step3Review(), STEPS, ContactExchangeFormProps, FieldWrapper(), FieldWrapperProps, Input (+6 more)

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
Cohesion: 0.24
Nodes (3): AuthLayout(), AuthLayoutProps, PasswordInput

### Community 56 - "auth.actions.ts"
Cohesion: 0.17
Nodes (16): getCurrentUser(), getSession(), getSupabaseServerAction(), requestPasswordReset(), resendOtp(), resetPassword(), resetPasswordWithOtp(), setNewPassword() (+8 more)

### Community 57 - "page.tsx"
Cohesion: 0.24
Nodes (7): ContactsClient(), LEAD_LEVELS, SortDir, SortField, ContactsContent(), SectionCard(), TableSkeleton()

### Community 58 - "Demo Accounts"
Cohesion: 0.40
Nodes (4): Admin & Company, Demo Accounts, Notes, RDMC Employees

### Community 62 - "card_orders.repo.ts"
Cohesion: 0.29
Nodes (4): PendingCompany, PendingIndividual, PendingItem, PageHeader()

### Community 63 - "page.tsx"
Cohesion: 0.40
Nodes (4): AdminQrPage(), BG_COLORS, FG_COLORS, UserMatch

## Knowledge Gaps
- **300 isolated node(s):** `✅ Fixes Applied (from previous review)`, `🆕 New Features Added`, `B1. Billing "Save changes" creates a DUPLICATE plan instead of updating`, `B2. Billing "Deactivate/Activate" is purely cosmetic — never persisted`, `B3. Designs "Save changes" reactivates inactive designs + overwrites pattern` (+295 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **10 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `getSupabase()` connect `getSupabase` to `page.tsx`, `companies.repo.ts`, `page.tsx`, `page.tsx`, `CardPreview.tsx`, `getServiceSupabase`, `admin.actions.ts`, `contacts.service.ts`, `DashboardShared.tsx`, `cards.actions.ts`, `orders.service.ts`, `page.tsx`, `profiles.repo.ts`, `billing.repo.ts`, `cards.actions.ts`?**
  _High betweenness centrality (0.103) - this node is a cross-community bridge._
- **Why does `getServiceSupabase` connect `getServiceSupabase` to `page.tsx`, `getSupabase`, `PublicCardLayout.tsx`, `page.tsx`, `companies.repo.ts`, `page.tsx`, `admin.actions.ts`, `contacts.service.ts`, `Input.tsx`, `auth.actions.ts`, `orders.service.ts`, `profiles.repo.ts`, `billing.repo.ts`, `cards.actions.ts`?**
  _High betweenness centrality (0.052) - this node is a cross-community bridge._
- **Why does `Button()` connect `Button.tsx` to `VerifyResetForm.tsx`, `cn`, `PublicCardLayout.tsx`, `page.tsx`, `Input.tsx`, `page.tsx`, `CardPreview.tsx`, `admin.actions.ts`, `page.tsx`, `BrandLogo.tsx`, `DashboardShared.tsx`, `page.tsx`, `page.tsx`, `AuthLayout.tsx`, `auth.actions.ts`, `CompanySidebar.tsx`, `card_orders.repo.ts`, `page.tsx`?**
  _High betweenness centrality (0.040) - this node is a cross-community bridge._
- **What connects `✅ Fixes Applied (from previous review)`, `🆕 New Features Added`, `B1. Billing "Save changes" creates a DUPLICATE plan instead of updating` to the rest of the system?**
  _301 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `cn` be split into smaller, more focused modules?**
  _Cohesion score 0.062146892655367235 - nodes in this community are weakly interconnected._
- **Should `page.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.08505747126436781 - nodes in this community are weakly interconnected._
- **Should `getSupabase` be split into smaller, more focused modules?**
  _Cohesion score 0.08710801393728224 - nodes in this community are weakly interconnected._