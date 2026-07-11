# Graph Report - ecotap  (2026-07-11)

## Corpus Check
- 150 files · ~114,193 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 956 nodes · 2006 edges · 57 communities (49 shown, 8 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 2 edges (avg confidence: 0.8)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `f8026933`
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
- page.tsx
- getServiceSupabase
- admin.actions.ts
- Button.tsx
- analytics.service.ts
- page.tsx
- compilerOptions
- auth.actions.ts
- contacts.service.ts
- DashboardShared.tsx
- index.ts
- index.ts
- Input.tsx
- Badge.tsx
- orders.service.ts
- InviteModal.tsx
- profiles.repo.ts
- page.tsx
- billing.repo.ts
- middleware.ts
- cards.actions.ts
- page.tsx
- page.tsx
- contact_exchanges.repo.ts
- onboarding.service.ts
- companies.repo.ts
- EcoTap — Architecture & Coding Conventions
- server.ts
- EcoTap — Fixes & Improvements Plan
- seed-demo-users.ts
- layout.tsx
- eslint.config.mjs
- next.config.ts
- postcss.config.mjs
- EcoTap — Project TODO
- EcoTap (production)
- departments.repo.ts
- Demo Accounts
- CLAUDE.md
- fetchOrders

## God Nodes (most connected - your core abstractions)
1. `getSupabase()` - 113 edges
2. `getServiceSupabase` - 55 edges
3. `Button()` - 44 edges
4. `cn()` - 43 edges
5. `requireSuperAdmin()` - 29 edges
6. `PageHeader()` - 22 edges
7. `Input` - 20 edges
8. `EcoTap — Architecture & Coding Conventions` - 19 edges
9. `Badge()` - 17 edges
10. `EcoTap — Project TODO` - 17 edges

## Surprising Connections (you probably didn't know these)
- `SubscriptionContent()` --calls--> `getCompanyDashboardData`  [EXTRACTED]
  src/app/dashboard/company/subscription/page.tsx → src/app/actions/company.actions.ts
- `StepIndicator()` --calls--> `cn()`  [EXTRACTED]
  src/app/dashboard/company/orders/new/page.tsx → src/lib/utils/index.ts
- `StepIndicator()` --calls--> `cn()`  [EXTRACTED]
  src/app/dashboard/company/subscription/new/page.tsx → src/lib/utils/index.ts
- `ContactsContent()` --calls--> `getSupabase()`  [EXTRACTED]
  src/app/dashboard/employee/contacts/page.tsx → src/lib/supabase/server.ts
- `StepIndicator()` --calls--> `cn()`  [EXTRACTED]
  src/app/dashboard/employee/orders/new/page.tsx → src/lib/utils/index.ts

## Import Cycles
- None detected.

## Communities (57 total, 8 thin omitted)

### Community 0 - "cn"
Cohesion: 0.06
Nodes (46): signOut(), AdminDashboardLayout(), NAV, CompanySidebar(), NAV, Props, EmployeeDashboardLayout(), NAV (+38 more)

### Community 1 - "page.tsx"
Cohesion: 0.07
Nodes (30): approveSubscriptionAction(), fetchAllSubscriptionsAdminAction(), getActivePlansAction(), getMySubscriptionAction(), rejectSubscriptionAction(), requireSuperAdmin(), resolveCompanyId(), subscribeAction() (+22 more)

### Community 2 - "getSupabase"
Cohesion: 0.11
Nodes (32): assignTestVariant(), createEnvironmentalReport(), getCardScores(), getDailyStats(), getEnvironmentalReports(), getEventCountByType(), getEventsByCardId(), getLatestCardScore() (+24 more)

### Community 3 - "PublicCardLayout.tsx"
Cohesion: 0.20
Nodes (12): getPublicCard, PublicCompanyData, PublicEmployee, resolveSlug, Props, EmployeeCardPage(), generateMetadata(), Props (+4 more)

### Community 4 - "page.tsx"
Cohesion: 0.10
Nodes (33): getActiveDesigns(), getCurrentProfileId(), placeOrder(), linkPaymentToOrder(), CompanyNewOrderPage(), Currency, EMPTY_ADDRESS, formatCurrency() (+25 more)

### Community 5 - "dependencies"
Cohesion: 0.06
Nodes (35): dependencies, @aws-sdk/client-s3, class-variance-authority, clsx, @hookform/resolvers, lucide-react, next, qrcode.react (+27 more)

### Community 6 - "admin.service.ts"
Cohesion: 0.10
Nodes (22): deleteCompanyAction(), deleteUserAction(), fetchAllContactExchanges(), fetchDesigns(), fetchPendingQueue(), fetchUserCardUrl(), fetchUsers(), toggleUserStatusAction() (+14 more)

### Community 7 - "page.tsx"
Cohesion: 0.14
Nodes (17): CompanyDashboardData, CompanyEmployee, deleteEmployeeAction(), getCompanyDashboardData, resolveCompanyId(), UpdateCompanyInput, updateMyCompany(), DeleteEmployeeButton() (+9 more)

### Community 8 - "uploads.actions.ts"
Cohesion: 0.16
Nodes (21): ALLOWED_TYPES, deleteUpload(), updateCompanyLogo(), updateProfilePhoto(), uploadDesignImage(), uploadPaymentScreenshot(), validateFile(), deleteFromR2() (+13 more)

### Community 9 - "page.tsx"
Cohesion: 0.22
Nodes (7): ContactsClient(), LEAD_LEVELS, Props, SortDir, SortField, ContactsContent(), TableSkeleton()

### Community 10 - "getServiceSupabase"
Cohesion: 0.12
Nodes (23): updateMyCard(), createCard(), deleteCard(), deleteCardGroup(), deleteCardService(), getCardById(), getCardByProfileId(), getCardByProfileIdService() (+15 more)

### Community 11 - "admin.actions.ts"
Cohesion: 0.15
Nodes (21): AnyActionResult, approveCompany(), approveIndividual(), createDesign(), deleteDesign(), deletePlan(), fetchContactExchangesCount(), fetchPlans() (+13 more)

### Community 12 - "Button.tsx"
Cohesion: 0.16
Nodes (5): Props, Props, Button(), ButtonProps, buttonVariants

### Community 13 - "analytics.service.ts"
Cohesion: 0.10
Nodes (8): calcMonthlyImpact(), generateMonthlyReport(), CardEvent, CardScore, DailyCardStat, EnvironmentalReport, ProfileActivity, RecordEventPayload

### Community 14 - "page.tsx"
Cohesion: 0.06
Nodes (45): getCurrentUser(), getSession(), getSupabaseServerAction(), requestPasswordReset(), resendOtp(), resetPassword(), resetPasswordWithOtp(), setNewPassword() (+37 more)

### Community 15 - "compilerOptions"
Cohesion: 0.10
Nodes (19): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+11 more)

### Community 16 - "auth.actions.ts"
Cohesion: 0.39
Nodes (6): RFC-6350, GET(), Props, downloadVcf(), foldLine(), generateVcf()

### Community 17 - "contacts.service.ts"
Cohesion: 0.21
Nodes (6): getCurrentProfileId(), getMyInbox(), updateContactExchange(), ContactExchange, ContactExchangeWithOwner, DeviceType

### Community 18 - "DashboardShared.tsx"
Cohesion: 0.17
Nodes (10): getMyCard(), AdminContactsPage(), AdminQrPage(), BG_COLORS, FG_COLORS, UserMatch, SubscriptionContent(), EmptyState() (+2 more)

### Community 19 - "index.ts"
Cohesion: 0.14
Nodes (17): PendingQueue, ABTestAssignment, AddCompanyForm, CardGroup, Company, CompanyWithRelations, CountryRep, EventType (+9 more)

### Community 20 - "index.ts"
Cohesion: 0.05
Nodes (43): deleteMyAccount(), AdminUser, EMPTY_FORM, EMPTY_GROUP, FormState, GroupEntry, CardPreviewProps, GroupPreviewEntry (+35 more)

### Community 21 - "Input.tsx"
Cohesion: 0.24
Nodes (8): submitContactExchange(), ContactExchangeForm(), ContactExchangeFormProps, PublicCardLayoutProps, SaveContactButton(), SaveContactButtonProps, Textarea, PublicCard

### Community 23 - "Badge.tsx"
Cohesion: 0.11
Nodes (12): PendingCompany, PendingIndividual, PendingItem, Design, INITIAL_DESIGNS, PRESET_COLORS, ALL_ROLES, ROLE_LABELS (+4 more)

### Community 24 - "orders.service.ts"
Cohesion: 0.20
Nodes (9): approveOrder(), canTransition(), markDelivered(), markShipped(), transitionOrderStatus(), uploadPaymentScreenshot(), VALID_TRANSITIONS, CardOrder (+1 more)

### Community 25 - "InviteModal.tsx"
Cohesion: 0.15
Nodes (11): createInvitationAction(), getCompanyInvitationsAction(), resolveCompanyId(), revokeInvitationAction(), InviteButton(), InviteModal(), Props, CreateInviteInput (+3 more)

### Community 26 - "profiles.repo.ts"
Cohesion: 0.14
Nodes (14): createProfile(), deleteProfile(), deleteProfileService(), getAllPending(), getAllProfiles(), getProfileByEmail(), getProfileById(), getProfileByUsername() (+6 more)

### Community 27 - "page.tsx"
Cohesion: 0.16
Nodes (11): approveOrder(), markOrderDelivered(), markOrderShipped(), verifyPayment(), AdminOrder, PAYMENT_COLORS, PAYMENT_LABELS, RawOrder (+3 more)

### Community 28 - "billing.repo.ts"
Cohesion: 0.14
Nodes (13): cancelSubscription(), createSubscription(), deletePlan(), getActivePlans(), getAllPlans(), getAllSubscriptions(), getAllSubscriptionsEnriched(), getPlanById() (+5 more)

### Community 29 - "middleware.ts"
Cohesion: 0.60
Nodes (3): recordPageView(), PageViewTracker(), PageViewTrackerProps

### Community 30 - "cards.actions.ts"
Cohesion: 0.33
Nodes (5): getOwnCard(), getPublicCard(), ActionResult, Card, CardProfileForm

### Community 31 - "page.tsx"
Cohesion: 0.22
Nodes (7): getMyOrders(), CompanyOrdersPage(), STATUS_BADGE, STATUS_STEP, OrdersPage(), STATUS_BADGE, STATUS_STEP

### Community 32 - "page.tsx"
Cohesion: 0.17
Nodes (5): EmployeeOverviewContent(), PageHeaderProps, StatCard(), StatCardProps, StatCardSkeleton()

### Community 33 - "contact_exchanges.repo.ts"
Cohesion: 0.20
Nodes (9): AdminExchangeOptions, createExchange(), deleteExchange(), getAllExchangesAdmin(), getExchangeById(), getExchangesByCardId(), getExchangesByProfileId(), getExchangesCount() (+1 more)

### Community 34 - "onboarding.service.ts"
Cohesion: 0.33
Nodes (6): approveCompany(), approveIndividual(), canTransition(), rejectUser(), suspendUser(), VALID_TRANSITIONS

### Community 35 - "companies.repo.ts"
Cohesion: 0.25
Nodes (8): createCompany(), deleteCompany(), getAllCompanies(), getAllPendingCompanies(), getCompanyById(), getCompanyBySlug(), updateCompany(), updateCompanyStatus()

### Community 36 - "EcoTap — Architecture & Coding Conventions"
Cohesion: 0.05
Nodes (36): Analytics & ML, Analytics & ML data strategy, Architecture: SSOT (Single Source of Truth), Billing & platform, card_events — the core telemetry table, Cards & orders, Company admin registration rules, Country representative rules (+28 more)

### Community 39 - "EcoTap — Fixes & Improvements Plan"
Cohesion: 0.06
Nodes (33): 1. Super Admin — Mobile Scrolling When a User is Clicked, 2. Age Must Be 18 (Not 13), 3. Username Taken — Show Clear Error, 4. Admin Deletes User — Full Deletion Including Email Reuse, 5. Contacts Shared — Mobile UI Improvements, 6. Organization Dashboard — Invite Employees Button + Backend Logic, Affected Files, Affected Files (+25 more)

### Community 53 - "EcoTap — Project TODO"
Cohesion: 0.11
Nodes (17): Build order summary, EcoTap — Project TODO, Phase 10 — Services layer (SSOT Layer 3), Phase 11 — Auth wiring & route protection, Phase 12 — Connect all dashboards to real data, Phase 13 — vCard, QR codes & image storage, Phase 14 — SEO, metadata & OG images, Phase 15 — Production launch (+9 more)

### Community 54 - "EcoTap (production)"
Cohesion: 0.18
Nodes (10): Database, Deployment, EcoTap (production), Environment variables, Getting started, Project structure, Tech stack, URL structure (+2 more)

### Community 57 - "departments.repo.ts"
Cohesion: 0.29
Nodes (6): createDepartment(), deleteDepartment(), getDepartmentById(), getDepartmentsByCompany(), updateDepartment(), Department

### Community 58 - "Demo Accounts"
Cohesion: 0.40
Nodes (4): Admin & Company, Demo Accounts, Notes, RDMC Employees

## Knowledge Gaps
- **277 isolated node(s):** `CreateInviteInput`, `InviteResult`, `ValidatedInvite`, `SortField`, `SortDir` (+272 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **8 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `getSupabase()` connect `getSupabase` to `page.tsx`, `page.tsx`, `admin.service.ts`, `page.tsx`, `uploads.actions.ts`, `page.tsx`, `getServiceSupabase`, `admin.actions.ts`, `page.tsx`, `contacts.service.ts`, `DashboardShared.tsx`, `index.ts`, `InviteModal.tsx`, `profiles.repo.ts`, `billing.repo.ts`, `cards.actions.ts`, `page.tsx`, `contact_exchanges.repo.ts`, `companies.repo.ts`, `server.ts`, `departments.repo.ts`?**
  _High betweenness centrality (0.097) - this node is a cross-community bridge._
- **Why does `Button()` connect `Button.tsx` to `page.tsx`, `page.tsx`, `cn`, `page.tsx`, `page.tsx`, `page.tsx`, `DashboardShared.tsx`, `index.ts`, `Input.tsx`, `page.tsx`, `Badge.tsx`, `InviteModal.tsx`, `page.tsx`, `page.tsx`?**
  _High betweenness centrality (0.055) - this node is a cross-community bridge._
- **Why does `getServiceSupabase` connect `getServiceSupabase` to `page.tsx`, `onboarding.service.ts`, `PublicCardLayout.tsx`, `page.tsx`, `getSupabase`, `companies.repo.ts`, `page.tsx`, `uploads.actions.ts`, `admin.service.ts`, `contact_exchanges.repo.ts`, `admin.actions.ts`, `server.ts`, `InviteModal.tsx`, `profiles.repo.ts`, `billing.repo.ts`, `middleware.ts`, `cards.actions.ts`?**
  _High betweenness centrality (0.035) - this node is a cross-community bridge._
- **What connects `CreateInviteInput`, `InviteResult`, `ValidatedInvite` to the rest of the system?**
  _278 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `cn` be split into smaller, more focused modules?**
  _Cohesion score 0.05698778833107191 - nodes in this community are weakly interconnected._
- **Should `page.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.0664451827242525 - nodes in this community are weakly interconnected._
- **Should `getSupabase` be split into smaller, more focused modules?**
  _Cohesion score 0.10588235294117647 - nodes in this community are weakly interconnected._