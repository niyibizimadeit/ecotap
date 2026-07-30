# Graph Report - ecotap  (2026-07-11)

## Corpus Check
- 152 files · ~115,661 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 962 nodes · 1947 edges · 54 communities (46 shown, 8 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 2 edges (avg confidence: 0.8)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `1aa1b00d`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- cn
- page.tsx
- getSupabase
- page.tsx
- dependencies
- admin.service.ts
- page.tsx
- uploads.actions.ts
- getServiceSupabase
- admin.actions.ts
- Button.tsx
- analytics.service.ts
- page.tsx
- compilerOptions
- contacts.service.ts
- DashboardShared.tsx
- index.ts
- Input.tsx
- orders.service.ts
- InviteModal.tsx
- profiles.repo.ts
- page.tsx
- billing.repo.ts
- cards.actions.ts
- contact_exchanges.repo.ts
- onboarding.service.ts
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
- Demo Accounts
- CLAUDE.md
- fetchOrders
- card_orders.repo.ts
- deleteProfileCascade
- VerifyResetForm.tsx

## God Nodes (most connected - your core abstractions)
1. `getSupabase()` - 106 edges
2. `getServiceSupabase` - 51 edges
3. `cn()` - 43 edges
4. `Button()` - 42 edges
5. `requireSuperAdmin()` - 29 edges
6. `PageHeader()` - 20 edges
7. `EcoTap — Architecture & Coding Conventions` - 19 edges
8. `Input` - 18 edges
9. `EcoTap — Project TODO` - 17 edges
10. `Badge()` - 16 edges

## Surprising Connections (you probably didn't know these)
- `OrgRegisterPage()` --calls--> `signUpOrg()`  [EXTRACTED]
  src/app/(auth)/org/register/page.tsx → src/app/actions/auth.actions.ts
- `acceptInvitationAction()` --calls--> `getSupabase()`  [EXTRACTED]
  src/app/actions/invitations.actions.ts → src/lib/supabase/server.ts
- `StepIndicator()` --calls--> `cn()`  [EXTRACTED]
  src/app/dashboard/company/orders/new/page.tsx → src/lib/utils/index.ts
- `StepIndicator()` --calls--> `cn()`  [EXTRACTED]
  src/app/dashboard/company/subscription/new/page.tsx → src/lib/utils/index.ts
- `ContactsContent()` --calls--> `getSupabase()`  [EXTRACTED]
  src/app/dashboard/employee/contacts/page.tsx → src/lib/supabase/server.ts

## Import Cycles
- None detected.

## Communities (54 total, 8 thin omitted)

### Community 0 - "cn"
Cohesion: 0.05
Nodes (46): signOut(), AdminDashboardLayout(), NAV, ALL_ROLES, ROLE_LABELS, CompanySidebar(), NAV, Props (+38 more)

### Community 1 - "page.tsx"
Cohesion: 0.07
Nodes (30): approveSubscriptionAction(), fetchAllSubscriptionsAdminAction(), getActivePlansAction(), getMySubscriptionAction(), rejectSubscriptionAction(), requireSuperAdmin(), resolveCompanyId(), subscribeAction() (+22 more)

### Community 2 - "getSupabase"
Cohesion: 0.11
Nodes (31): assignTestVariant(), createEnvironmentalReport(), getCardScores(), getDailyStats(), getEnvironmentalReports(), getEventCountByType(), getEventsByCardId(), getLatestCardScore() (+23 more)

### Community 4 - "page.tsx"
Cohesion: 0.06
Nodes (50): getActiveDesigns(), getCurrentProfileId(), placeOrder(), linkPaymentToOrder(), CompanyNewOrderPage(), Currency, EMPTY_ADDRESS, formatCurrency() (+42 more)

### Community 5 - "dependencies"
Cohesion: 0.06
Nodes (35): dependencies, @aws-sdk/client-s3, class-variance-authority, clsx, @hookform/resolvers, lucide-react, next, qrcode.react (+27 more)

### Community 6 - "admin.service.ts"
Cohesion: 0.10
Nodes (20): deleteCompanyAction(), fetchAllContactExchanges(), fetchContactExchangesCount(), fetchDesigns(), fetchUserCardUrl(), fetchUserProfile(), fetchUsers(), lookupUserForQR() (+12 more)

### Community 7 - "page.tsx"
Cohesion: 0.11
Nodes (21): activateEmployeeAction(), CompanyDashboardData, CompanyEmployee, deleteEmployeeAction(), getCompanyDashboardData, resolveCompanyId(), suspendEmployeeAction(), UpdateCompanyInput (+13 more)

### Community 8 - "uploads.actions.ts"
Cohesion: 0.16
Nodes (21): ALLOWED_TYPES, deleteUpload(), updateCompanyLogo(), updateProfilePhoto(), uploadDesignImage(), uploadPaymentScreenshot(), validateFile(), deleteFromR2() (+13 more)

### Community 10 - "getServiceSupabase"
Cohesion: 0.13
Nodes (21): createCard(), deleteCard(), deleteCardGroup(), deleteCardService(), getCardById(), getCardByProfileId(), getCardByProfileIdService(), getCardBySlug() (+13 more)

### Community 11 - "admin.actions.ts"
Cohesion: 0.18
Nodes (18): AnyActionResult, approveCompany(), approveIndividual(), createDesign(), deleteDesign(), deletePlan(), fetchPendingQueue(), fetchPlans() (+10 more)

### Community 12 - "Button.tsx"
Cohesion: 0.17
Nodes (5): Props, Props, Button(), ButtonProps, buttonVariants

### Community 13 - "analytics.service.ts"
Cohesion: 0.10
Nodes (7): calcMonthlyImpact(), generateMonthlyReport(), CardScore, DailyCardStat, EnvironmentalReport, ProfileActivity, RecordEventPayload

### Community 14 - "page.tsx"
Cohesion: 0.11
Nodes (18): OrgRegisterPage(), Step3Review(), STEPS, Select, COMPANY_SIZES, age, email, fullName (+10 more)

### Community 15 - "compilerOptions"
Cohesion: 0.10
Nodes (19): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+11 more)

### Community 17 - "contacts.service.ts"
Cohesion: 0.23
Nodes (5): getCurrentProfileId(), getMyInbox(), updateContactExchange(), ActionResult, DeviceType

### Community 18 - "DashboardShared.tsx"
Cohesion: 0.05
Nodes (38): getMyOrders(), PendingCompany, PendingIndividual, PendingItem, Design, INITIAL_DESIGNS, PRESET_COLORS, AdminQrPage() (+30 more)

### Community 19 - "index.ts"
Cohesion: 0.13
Nodes (18): PendingQueue, ABTestAssignment, AddCompanyForm, CardEvent, CardGroup, Company, CompanyWithRelations, CountryRep (+10 more)

### Community 21 - "Input.tsx"
Cohesion: 0.06
Nodes (43): RFC-6350, recordPageView(), deleteMyAccount(), getMyCard(), getPublicCard, updateMyCard(), PublicCompanyData, PublicEmployee (+35 more)

### Community 24 - "orders.service.ts"
Cohesion: 0.19
Nodes (9): approveOrder(), markOrderShipped(), approveOrder(), canTransition(), markDelivered(), markShipped(), transitionOrderStatus(), uploadPaymentScreenshot() (+1 more)

### Community 25 - "InviteModal.tsx"
Cohesion: 0.13
Nodes (11): acceptInvitationAction(), createInvitationAction(), getCompanyInvitationsAction(), resolveCompanyId(), revokeInvitationAction(), InviteModal(), Props, CreateInviteInput (+3 more)

### Community 26 - "profiles.repo.ts"
Cohesion: 0.14
Nodes (14): createProfile(), deleteProfile(), deleteProfileService(), getAllPending(), getAllProfiles(), getProfileByEmail(), getProfileById(), getProfileByUsername() (+6 more)

### Community 27 - "page.tsx"
Cohesion: 0.16
Nodes (11): fetchOrders(), markOrderDelivered(), verifyPayment(), AdminOrder, PAYMENT_COLORS, PAYMENT_LABELS, RawOrder, STATUS_COLORS (+3 more)

### Community 28 - "billing.repo.ts"
Cohesion: 0.14
Nodes (13): cancelSubscription(), createSubscription(), deletePlan(), getActivePlans(), getAllPlans(), getAllSubscriptions(), getAllSubscriptionsEnriched(), getPlanById() (+5 more)

### Community 30 - "cards.actions.ts"
Cohesion: 0.33
Nodes (4): getOwnCard(), getPublicCard(), Card, CardProfileForm

### Community 33 - "contact_exchanges.repo.ts"
Cohesion: 0.20
Nodes (9): AdminExchangeOptions, createExchange(), deleteExchange(), getAllExchangesAdmin(), getExchangeById(), getExchangesByCardId(), getExchangesByProfileId(), getExchangesCount() (+1 more)

### Community 34 - "onboarding.service.ts"
Cohesion: 0.33
Nodes (6): approveCompany(), approveIndividual(), canTransition(), rejectUser(), suspendUser(), VALID_TRANSITIONS

### Community 35 - "companies.repo.ts"
Cohesion: 0.22
Nodes (9): createCompany(), deleteCompany(), getAllCompanies(), getAllPendingCompanies(), getCompanyById(), getCompanyBySlug(), updateCompany(), updateCompanySocialLinks() (+1 more)

### Community 36 - "EcoTap — Architecture & Coding Conventions"
Cohesion: 0.05
Nodes (36): Analytics & ML, Analytics & ML data strategy, Architecture: SSOT (Single Source of Truth), Billing & platform, card_events — the core telemetry table, Cards & orders, Company admin registration rules, Country representative rules (+28 more)

### Community 38 - "Input.tsx"
Cohesion: 0.15
Nodes (12): submitContactExchange(), ContactExchangeForm(), ContactExchangeFormProps, FieldWrapper(), FieldWrapperProps, Input, InputProps, SelectProps (+4 more)

### Community 39 - "EcoTap — Fixes & Improvements Plan"
Cohesion: 0.06
Nodes (33): 1. Super Admin — Mobile Scrolling When a User is Clicked, 2. Age Must Be 18 (Not 13), 3. Username Taken — Show Clear Error, 4. Admin Deletes User — Full Deletion Including Email Reuse, 5. Contacts Shared — Mobile UI Improvements, 6. Organization Dashboard — Invite Employees Button + Backend Logic, Affected Files, Affected Files (+25 more)

### Community 53 - "EcoTap — Project TODO"
Cohesion: 0.11
Nodes (17): Build order summary, EcoTap — Project TODO, Phase 10 — Services layer (SSOT Layer 3), Phase 11 — Auth wiring & route protection, Phase 12 — Connect all dashboards to real data, Phase 13 — vCard, QR codes & image storage, Phase 14 — SEO, metadata & OG images, Phase 15 — Production launch (+9 more)

### Community 54 - "EcoTap (production)"
Cohesion: 0.18
Nodes (10): Database, Deployment, EcoTap (production), Environment variables, Getting started, Project structure, Tech stack, URL structure (+2 more)

### Community 55 - "AuthLayout.tsx"
Cohesion: 0.18
Nodes (3): AuthLayout(), AuthLayoutProps, PasswordInput

### Community 56 - "auth.actions.ts"
Cohesion: 0.24
Nodes (13): getCurrentUser(), getSession(), getSupabaseServerAction(), requestPasswordReset(), resendOtp(), resetPassword(), resetPasswordWithOtp(), setNewPassword() (+5 more)

### Community 58 - "Demo Accounts"
Cohesion: 0.40
Nodes (4): Admin & Company, Demo Accounts, Notes, RDMC Employees

### Community 61 - "fetchOrders"
Cohesion: 0.23
Nodes (12): AdminUser, UserFilters, AUTH_PAGES, config, DASHBOARD_BASE, isAccessAllowed(), isPublicPath(), middleware() (+4 more)

### Community 62 - "card_orders.repo.ts"
Cohesion: 0.22
Nodes (9): createOrder(), deleteOrder(), getAllOrders(), getOrderById(), getOrdersByProfileId(), updateOrderPayment(), updateOrderStatus(), CardOrder (+1 more)

### Community 63 - "deleteProfileCascade"
Cohesion: 0.33
Nodes (6): deleteUserAction(), deleteOwnAccount(), deleteProfileCascade(), deleteUser(), getUserById(), deleteCompanyCascade()

## Knowledge Gaps
- **282 isolated node(s):** `CompanyEmployee`, `CompanyDashboardData`, `UpdateCompanyInput`, `Props`, `GroupEntry` (+277 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **8 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `getSupabase()` connect `getSupabase` to `page.tsx`, `contact_exchanges.repo.ts`, `companies.repo.ts`, `page.tsx`, `server.ts`, `uploads.actions.ts`, `getServiceSupabase`, `admin.actions.ts`, `contacts.service.ts`, `DashboardShared.tsx`, `InviteModal.tsx`, `profiles.repo.ts`, `billing.repo.ts`, `card_orders.repo.ts`, `deleteProfileCascade`?**
  _High betweenness centrality (0.081) - this node is a cross-community bridge._
- **Why does `Button()` connect `Button.tsx` to `VerifyResetForm.tsx`, `page.tsx`, `cn`, `page.tsx`, `Input.tsx`, `page.tsx`, `page.tsx`, `DashboardShared.tsx`, `page.tsx`, `AuthLayout.tsx`, `InviteModal.tsx`, `page.tsx`?**
  _High betweenness centrality (0.060) - this node is a cross-community bridge._
- **Why does `cn()` connect `cn` to `page.tsx`, `page.tsx`, `Input.tsx`, `Button.tsx`, `DashboardShared.tsx`?**
  _High betweenness centrality (0.037) - this node is a cross-community bridge._
- **What connects `CompanyEmployee`, `CompanyDashboardData`, `UpdateCompanyInput` to the rest of the system?**
  _283 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `cn` be split into smaller, more focused modules?**
  _Cohesion score 0.054987212276214836 - nodes in this community are weakly interconnected._
- **Should `page.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.0664451827242525 - nodes in this community are weakly interconnected._
- **Should `getSupabase` be split into smaller, more focused modules?**
  _Cohesion score 0.10873440285204991 - nodes in this community are weakly interconnected._