# Graph Report - ecotap  (2026-09-21)

## Corpus Check
- 159 files · ~123,717 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 1010 nodes · 2121 edges · 59 communities (43 shown, 16 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 2 edges (avg confidence: 0.8)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `d5f8b16f`
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
- analytics.service.ts
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
- public.actions.ts
- ImageUpload.tsx
- analytics.actions.ts
- companies.repo.ts
- EcoTap — Architecture & Coding Conventions
- server.ts
- Input.tsx
- seed-demo-users.ts
- layout.tsx
- page.tsx
- page.tsx
- eslint.config.mjs
- next.config.ts
- postcss.config.mjs
- layout.tsx
- page.tsx
- page.tsx
- EcoTap (production)
- AuthLayout.tsx
- page.tsx
- onboarding.service.ts
- card_orders.repo.ts
- page.tsx
- page.tsx
- page.tsx

## God Nodes (most connected - your core abstractions)
1. `getSupabase()` - 117 edges
2. `getServiceSupabase` - 69 edges
3. `Button()` - 44 edges
4. `cn()` - 43 edges
5. `PageHeader()` - 22 edges
6. `requireSuperAdmin()` - 21 edges
7. `Input` - 20 edges
8. `resolveCompanyId()` - 18 edges
9. `ActionResult` - 18 edges
10. `EcoTap — Architecture & Coding Conventions` - 18 edges

## Surprising Connections (you probably didn't know these)
- `OrgRegisterPage()` --calls--> `signUpOrg()`  [EXTRACTED]
  src/app/(auth)/org/register/page.tsx → src/app/actions/auth.actions.ts
- `CompanyOverviewContent()` --calls--> `getCompanyDashboardData`  [EXTRACTED]
  src/app/dashboard/company/page.tsx → src/app/actions/company.actions.ts
- `acceptInvitationAction()` --calls--> `getSupabase()`  [EXTRACTED]
  src/app/actions/invitations.actions.ts → src/lib/supabase/server.ts
- `StepIndicator()` --calls--> `cn()`  [EXTRACTED]
  src/app/dashboard/company/orders/new/page.tsx → src/lib/utils/index.ts
- `StepIndicator()` --calls--> `cn()`  [EXTRACTED]
  src/app/dashboard/company/subscription/new/page.tsx → src/lib/utils/index.ts

## Import Cycles
- None detected.

## Communities (59 total, 16 thin omitted)

### Community 0 - "cn"
Cohesion: 0.05
Nodes (47): signOut(), AdminDashboardLayout(), NAV, CompanySidebar(), NAV, Props, SignOutButton(), EmployeeSidebar() (+39 more)

### Community 1 - "page.tsx"
Cohesion: 0.07
Nodes (29): approveSubscriptionAction(), fetchAllSubscriptionsAdminAction(), getActivePlansAction(), rejectSubscriptionAction(), requireSuperAdmin(), subscribeAction(), uploadSubscriptionScreenshotAction(), verifySubscriptionPaymentAction() (+21 more)

### Community 2 - "getSupabase"
Cohesion: 0.13
Nodes (26): ContactsContent(), assignTestVariant(), createEnvironmentalReport(), getCardScores(), getDailyStats(), getEnvironmentalReports(), getEventCountByType(), getEventsByCardId() (+18 more)

### Community 3 - "PublicCardLayout.tsx"
Cohesion: 0.04
Nodes (46): B10. Employee contacts: "Favorites First" sort is inverted, B11. Failed payment screenshot link is silent, success page lies, B1. Billing "Save changes" creates a DUPLICATE plan instead of updating, B2. Billing "Deactivate/Activate" is purely cosmetic — never persisted, B3. Designs "Save changes" reactivates inactive designs + overwrites pattern, B4. resolveCompanyId used WITHOUT role check — privilege escalation, B5. Service-role writes without ownership verification — 5 endpoints, B6. User enumeration confirmed — 3 vectors (+38 more)

### Community 4 - "page.tsx"
Cohesion: 0.06
Nodes (35): dependencies, @aws-sdk/client-s3, class-variance-authority, clsx, @hookform/resolvers, lucide-react, next, qrcode.react (+27 more)

### Community 5 - "dependencies"
Cohesion: 0.10
Nodes (19): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+11 more)

### Community 6 - "admin.service.ts"
Cohesion: 0.19
Nodes (5): AuthLayout(), AuthLayoutProps, PasswordInput, LoginData, loginSchema

### Community 7 - "page.tsx"
Cohesion: 0.11
Nodes (17): Build order summary, EcoTap — Project TODO, Phase 10 — Services layer (SSOT Layer 3), Phase 11 — Auth wiring & route protection, Phase 12 — Connect all dashboards to real data, Phase 13 — vCard, QR codes & image storage, Phase 14 — SEO, metadata & OG images, Phase 15 — Production launch (+9 more)

### Community 8 - "uploads.actions.ts"
Cohesion: 0.12
Nodes (16): 1. Analytics & ML data strategy, 2. Environmental impact report, 3. Notifications & email, 4. Other built-but-unwired surfaces, `card_events` — the intended core telemetry table, Current state: **calculation built, delivery missing**, Current state: **not implemented**, Current state: **schema and services built, telemetry not wired** (+8 more)

### Community 9 - "CardPreview.tsx"
Cohesion: 0.09
Nodes (26): activateEmployeeAction(), CompanyDashboardData, CompanyEmployee, deleteEmployeeAction(), suspendEmployeeAction(), UpdateCompanyInput, updateMyCompany(), acceptInvitationAction() (+18 more)

### Community 10 - "getServiceSupabase"
Cohesion: 0.14
Nodes (20): createCard(), deleteCard(), deleteCardGroup(), deleteCardService(), getCardById(), getCardByProfileId(), getCardByProfileIdService(), getCardBySlug() (+12 more)

### Community 11 - "admin.actions.ts"
Cohesion: 0.05
Nodes (62): AnyActionResult, approveCompany(), approveIndividual(), approveOrder(), createDesign(), deleteCompanyAction(), deleteDesign(), deletePlan() (+54 more)

### Community 13 - "analytics.service.ts"
Cohesion: 0.10
Nodes (7): calcMonthlyImpact(), generateMonthlyReport(), CardScore, DailyCardStat, EnvironmentalReport, ProfileActivity, RecordEventPayload

### Community 14 - "page.tsx"
Cohesion: 0.13
Nodes (15): OrgRegisterPage(), Step3Review(), STEPS, COMPANY_SIZES, age, email, fullName, OrgRegisterData (+7 more)

### Community 15 - "compilerOptions"
Cohesion: 0.27
Nodes (13): getCurrentUser(), getSession(), getSupabaseServerAction(), requestPasswordReset(), resendOtp(), resetPassword(), resetPasswordWithOtp(), setNewPassword() (+5 more)

### Community 16 - "BrandLogo.tsx"
Cohesion: 0.20
Nodes (9): Documentation drift, EcoTap — Project Status, Functional, Known issues, Security-relevant — read before exposing this app further, Testing & CI, Type safety, Where to find things (+1 more)

### Community 18 - "DashboardShared.tsx"
Cohesion: 0.19
Nodes (4): CompanyOverviewContent(), EmployeeOverviewContent(), StatCard(), StatCardSkeleton()

### Community 19 - "index.ts"
Cohesion: 0.14
Nodes (17): PendingQueue, ABTestAssignment, AddCompanyForm, CardEvent, CardGroup, Company, CompanyWithRelations, CountryRep (+9 more)

### Community 20 - "page.tsx"
Cohesion: 0.22
Nodes (6): validateInviteTokenAction(), Spinner(), SPINNER_SIZES, SpinnerProps, IndividualRegisterData, individualRegisterSchema

### Community 21 - "Input.tsx"
Cohesion: 0.05
Nodes (44): getMyCard(), AdminUser, ALL_ROLES, EMPTY_FORM, EMPTY_GROUP, FormState, GroupEntry, metadata (+36 more)

### Community 22 - "page.tsx"
Cohesion: 0.25
Nodes (7): createOrder(), deleteOrder(), getAllOrders(), getOrderById(), getOrdersByProfileId(), updateOrderPayment(), updateOrderStatus()

### Community 23 - "cards.actions.ts"
Cohesion: 0.29
Nodes (6): createDepartment(), deleteDepartment(), getDepartmentById(), getDepartmentsByCompany(), updateDepartment(), Department

### Community 24 - "orders.service.ts"
Cohesion: 0.06
Nodes (59): getActiveDesigns(), getCurrentProfileId(), placeOrder(), ALLOWED_TYPES, deleteUpload(), linkPaymentToOrder(), updateCompanyLogo(), updateProfilePhoto() (+51 more)

### Community 26 - "profiles.repo.ts"
Cohesion: 0.14
Nodes (14): createProfile(), deleteProfile(), deleteProfileService(), getAllPending(), getAllProfiles(), getProfileByEmail(), getProfileById(), getProfileByUsername() (+6 more)

### Community 27 - "contact_exchanges.repo.ts"
Cohesion: 0.20
Nodes (9): AdminExchangeOptions, createExchange(), deleteExchange(), getAllExchangesAdmin(), getExchangeById(), getExchangesByCardId(), getExchangesByProfileId(), getExchangesCount() (+1 more)

### Community 28 - "billing.repo.ts"
Cohesion: 0.14
Nodes (13): cancelSubscription(), createSubscription(), deletePlan(), getActivePlans(), getAllPlans(), getAllSubscriptions(), getAllSubscriptionsEnriched(), getPlanById() (+5 more)

### Community 29 - "CompanySidebar.tsx"
Cohesion: 0.40
Nodes (4): Admin & Company, Demo Accounts, Notes, RDMC Employees

### Community 30 - "cards.actions.ts"
Cohesion: 0.19
Nodes (9): PublicCardLayoutProps, SaveContactButton(), SaveContactButtonProps, getOwnCard(), getPublicCard(), ActionResult, Card, CardProfileForm (+1 more)

### Community 32 - "public.actions.ts"
Cohesion: 0.11
Nodes (21): RFC-6350, recordPageView(), getPublicCard, PublicCompanyData, PublicEmployee, resolveSlug, GET(), Props (+13 more)

### Community 34 - "analytics.actions.ts"
Cohesion: 0.19
Nodes (9): getCompanyDashboardData, EmployeesContent(), CompanyDashboardLayout(), CompanySettingsPage(), DEFAULT_FORM, FormState, PRESET_COLORS, SubscriptionContent() (+1 more)

### Community 35 - "companies.repo.ts"
Cohesion: 0.19
Nodes (12): deleteMyAccount(), updateMyCard(), syncCardGroups(), createCompany(), deleteCompany(), getAllCompanies(), getAllPendingCompanies(), getCompanyById() (+4 more)

### Community 36 - "EcoTap — Architecture & Coding Conventions"
Cohesion: 0.07
Nodes (28): Analytics & ML, Architecture: SSOT (Single Source of Truth), Authentication, Billing & platform, Cards & orders, Company admin registration rules, Country representative rules, Database tables — complete list (+20 more)

### Community 38 - "Input.tsx"
Cohesion: 0.16
Nodes (12): submitContactExchange(), metadata, ContactExchangeForm(), ContactExchangeFormProps, FieldWrapper(), FieldWrapperProps, Input, InputProps (+4 more)

### Community 54 - "EcoTap (production)"
Cohesion: 0.13
Nodes (14): Database, Deployment, Documentation map, EcoTap (production), Environment variables, Getting started, Project structure, Seeding demo accounts (+6 more)

### Community 55 - "AuthLayout.tsx"
Cohesion: 0.26
Nodes (10): getCurrentProfileId(), getMyInbox(), updateContactExchange(), ContactsClient(), LEAD_LEVELS, Props, SortDir, SortField (+2 more)

### Community 61 - "onboarding.service.ts"
Cohesion: 0.31
Nodes (7): approveCompany(), approveIndividual(), canTransition(), rejectCompany(), rejectUser(), suspendUser(), VALID_TRANSITIONS

### Community 62 - "card_orders.repo.ts"
Cohesion: 0.14
Nodes (10): PendingCompany, PendingIndividual, PendingItem, Design, INITIAL_DESIGNS, PRESET_COLORS, Badge(), BadgeProps (+2 more)

### Community 66 - "page.tsx"
Cohesion: 0.19
Nodes (5): Props, Props, Button(), ButtonProps, buttonVariants

### Community 68 - "page.tsx"
Cohesion: 0.22
Nodes (7): getMyOrders(), CompanyOrdersPage(), STATUS_BADGE, STATUS_STEP, OrdersPage(), STATUS_BADGE, STATUS_STEP

### Community 69 - "page.tsx"
Cohesion: 0.16
Nodes (10): BG_COLORS, FG_COLORS, UserMatch, InviteButton(), EmptyState(), PageHeader(), PageHeaderProps, SectionCard() (+2 more)

## Knowledge Gaps
- **309 isolated node(s):** `eslintConfig`, `nextConfig`, `name`, `version`, `private` (+304 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **16 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `getSupabase()` connect `getSupabase` to `cn`, `page.tsx`, `companies.repo.ts`, `page.tsx`, `server.ts`, `CardPreview.tsx`, `getServiceSupabase`, `admin.actions.ts`, `DashboardShared.tsx`, `cards.actions.ts`, `Input.tsx`, `page.tsx`, `AuthLayout.tsx`, `orders.service.ts`, `profiles.repo.ts`, `contact_exchanges.repo.ts`, `billing.repo.ts`?**
  _High betweenness centrality (0.094) - this node is a cross-community bridge._
- **Why does `Button()` connect `page.tsx` to `cn`, `page.tsx`, `analytics.actions.ts`, `page.tsx`, `page.tsx`, `admin.service.ts`, `Input.tsx`, `CardPreview.tsx`, `admin.actions.ts`, `Button.tsx`, `page.tsx`, `compilerOptions`, `DashboardShared.tsx`, `page.tsx`, `Input.tsx`, `orders.service.ts`, `InviteModal.tsx`, `card_orders.repo.ts`?**
  _High betweenness centrality (0.048) - this node is a cross-community bridge._
- **Why does `getServiceSupabase` connect `getServiceSupabase` to `public.actions.ts`, `page.tsx`, `companies.repo.ts`, `server.ts`, `CardPreview.tsx`, `admin.actions.ts`, `compilerOptions`, `page.tsx`, `orders.service.ts`, `profiles.repo.ts`, `contact_exchanges.repo.ts`, `billing.repo.ts`, `onboarding.service.ts`?**
  _High betweenness centrality (0.045) - this node is a cross-community bridge._
- **What connects `eslintConfig`, `nextConfig`, `name` to the rest of the system?**
  _310 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `cn` be split into smaller, more focused modules?**
  _Cohesion score 0.052313883299798795 - nodes in this community are weakly interconnected._
- **Should `page.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.06829268292682927 - nodes in this community are weakly interconnected._
- **Should `getSupabase` be split into smaller, more focused modules?**
  _Cohesion score 0.13227513227513227 - nodes in this community are weakly interconnected._