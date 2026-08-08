# Graph Report - ecotap  (2026-08-05)

## Corpus Check
- 153 files · ~116,025 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 967 nodes · 1763 edges · 67 communities (57 shown, 10 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 2 edges (avg confidence: 0.8)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `65cc6d51`
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
- cards.actions.ts
- orders.service.ts
- InviteModal.tsx
- profiles.repo.ts
- page.tsx
- billing.repo.ts
- CompanySidebar.tsx
- cards.actions.ts
- index.ts
- ImageUpload.tsx
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
- page.tsx
- Demo Accounts
- uploads.actions.ts
- CLAUDE.md
- fetchOrders
- card_orders.repo.ts
- page.tsx
- VerifyResetForm.tsx
- deleteUserAction
- page.tsx

## God Nodes (most connected - your core abstractions)
1. `getSupabase()` - 115 edges
2. `getServiceSupabase` - 58 edges
3. `Button()` - 33 edges
4. `cn()` - 31 edges
5. `requireSuperAdmin()` - 29 edges
6. `EcoTap — Architecture & Coding Conventions` - 19 edges
7. `Input` - 17 edges
8. `EcoTap — Project TODO` - 17 edges
9. `compilerOptions` - 16 edges
10. `resolveCompanyId()` - 15 edges

## Surprising Connections (you probably didn't know these)
- `acceptInvitationAction()` --calls--> `getSupabase()`  [EXTRACTED]
  src/app/actions/invitations.actions.ts → src/lib/supabase/server.ts
- `getMySubscriptionAction()` --calls--> `resolveCompanyId()`  [EXTRACTED]
  src/app/actions/subscription.actions.ts → src/lib/supabase/server.ts
- `deleteUpload()` --calls--> `getSupabase()`  [EXTRACTED]
  src/app/actions/uploads.actions.ts → src/lib/supabase/server.ts
- `EmployeeDashboardLayout()` --calls--> `getSupabase()`  [EXTRACTED]
  src/app/dashboard/employee/layout.tsx → src/lib/supabase/server.ts
- `NewOrderPage()` --indirect_call--> `dbDesignToOption()`  [INFERRED]
  src/app/dashboard/employee/orders/new/page.tsx → src/components/orders/DesignGallery.tsx

## Import Cycles
- None detected.

## Communities (67 total, 10 thin omitted)

### Community 0 - "cn"
Cohesion: 0.20
Nodes (14): Card(), CardContent(), CardDescription(), CardFooter(), CardHeader(), CardProps, CardTitle(), cardVariants (+6 more)

### Community 1 - "page.tsx"
Cohesion: 0.07
Nodes (24): approveSubscriptionAction(), fetchAllSubscriptionsAdminAction(), getActivePlansAction(), getMySubscriptionAction(), rejectSubscriptionAction(), requireSuperAdmin(), subscribeAction(), verifySubscriptionPaymentAction() (+16 more)

### Community 2 - "getSupabase"
Cohesion: 0.09
Nodes (38): assignTestVariant(), createEnvironmentalReport(), getCardScores(), getDailyStats(), getEnvironmentalReports(), getEventCountByType(), getEventsByCardId(), getLatestCardScore() (+30 more)

### Community 3 - "PublicCardLayout.tsx"
Cohesion: 0.11
Nodes (17): ADMIN_ROLES, ADMIN_WRITE_ROLES, CARD_ORIGINAL_PRICES, COLORS, COMPANY_SOCIAL_LINKS, DASHBOARD_ROUTE, ENV, GROUP_SOCIAL_LINKS (+9 more)

### Community 4 - "page.tsx"
Cohesion: 0.13
Nodes (20): CompanyNewOrderPage(), Currency, EMPTY_ADDRESS, formatCurrency(), getPricePerCard(), OrderForm, Step, StepIndicator() (+12 more)

### Community 5 - "dependencies"
Cohesion: 0.06
Nodes (35): dependencies, @aws-sdk/client-s3, class-variance-authority, clsx, @hookform/resolvers, lucide-react, next, qrcode.react (+27 more)

### Community 6 - "admin.service.ts"
Cohesion: 0.09
Nodes (20): deleteCompanyAction(), fetchAllContactExchanges(), fetchDesigns(), fetchPendingQueue(), fetchUserCardUrl(), lookupUserForQR(), toggleUserStatusAction(), updateUserRoleAction() (+12 more)

### Community 7 - "page.tsx"
Cohesion: 0.05
Nodes (35): activateEmployeeAction(), CompanyDashboardData, CompanyEmployee, deleteEmployeeAction(), getCompanyDashboardData, suspendEmployeeAction(), UpdateCompanyInput, updateMyCompany() (+27 more)

### Community 8 - "uploads.actions.ts"
Cohesion: 0.17
Nodes (13): deleteFromR2(), generateKey(), getClient(), R2_ACCESS_KEY_ID, R2_BUCKET_NAME, R2_ENDPOINT, R2_PUBLIC_URL, R2_SECRET_ACCESS_KEY (+5 more)

### Community 9 - "CardPreview.tsx"
Cohesion: 0.24
Nodes (10): CardPreview(), CardPreviewProps, GroupPreviewEntry, SOCIAL_LABELS, contrastColor(), getLuminance(), SOCIAL_CONFIG, SocialIconRow() (+2 more)

### Community 10 - "getServiceSupabase"
Cohesion: 0.12
Nodes (23): createCard(), deleteCard(), deleteCardGroup(), deleteCardService(), getCardById(), getCardByProfileId(), getCardByProfileIdService(), getCardBySlug() (+15 more)

### Community 11 - "admin.actions.ts"
Cohesion: 0.16
Nodes (20): AnyActionResult, approveCompany(), approveIndividual(), createDesign(), deleteDesign(), deletePlan(), fetchContactExchangesCount(), fetchPlans() (+12 more)

### Community 12 - "Button.tsx"
Cohesion: 0.24
Nodes (4): Props, Button(), ButtonProps, buttonVariants

### Community 14 - "page.tsx"
Cohesion: 0.11
Nodes (18): OrgRegisterPage(), Step3Review(), STEPS, COMPANY_SIZES, INDUSTRIES, age, email, fullName (+10 more)

### Community 15 - "compilerOptions"
Cohesion: 0.10
Nodes (19): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+11 more)

### Community 16 - "BrandLogo.tsx"
Cohesion: 0.14
Nodes (13): signOut(), AdminDashboardLayout(), NAV, BrandIcon(), BrandIconProps, BrandLogo(), BrandLogoProps, ICON_SIZES (+5 more)

### Community 17 - "contacts.service.ts"
Cohesion: 0.11
Nodes (15): getCurrentProfileId(), getMyInbox(), updateContactExchange(), AdminExchangeOptions, createExchange(), deleteExchange(), getAllExchangesAdmin(), getExchangeById() (+7 more)

### Community 18 - "DashboardShared.tsx"
Cohesion: 0.19
Nodes (6): EmployeeOverviewContent(), EmptyState(), PageHeaderProps, StatCard(), StatCardProps, StatCardSkeleton()

### Community 19 - "index.ts"
Cohesion: 0.09
Nodes (24): ABTestAssignment, AddCompanyForm, CardEvent, CardOrder, CardOrderWithDesign, CardScore, Company, CompanyWithRelations (+16 more)

### Community 20 - "page.tsx"
Cohesion: 0.14
Nodes (12): Design, INITIAL_DESIGNS, PRESET_COLORS, ALL_ROLES, ROLE_LABELS, Badge(), BadgeProps, badgeVariants (+4 more)

### Community 21 - "Input.tsx"
Cohesion: 0.06
Nodes (36): RFC-6350, recordPageView(), deleteMyAccount(), getMyCard(), getPublicCard, updateMyCard(), submitContactExchange(), PublicCompanyData (+28 more)

### Community 23 - "cards.actions.ts"
Cohesion: 0.33
Nodes (4): EmployeeSidebar(), NAV, Props, EmployeeDashboardLayout()

### Community 24 - "orders.service.ts"
Cohesion: 0.19
Nodes (9): markOrderDelivered(), verifyPayment(), approveOrder(), canTransition(), markDelivered(), markShipped(), transitionOrderStatus(), uploadPaymentScreenshot() (+1 more)

### Community 25 - "InviteModal.tsx"
Cohesion: 0.25
Nodes (3): CreateInviteInput, InviteResult, ValidatedInvite

### Community 26 - "profiles.repo.ts"
Cohesion: 0.14
Nodes (14): createProfile(), deleteProfile(), deleteProfileService(), getAllPending(), getAllProfiles(), getProfileByEmail(), getProfileById(), getProfileByUsername() (+6 more)

### Community 27 - "page.tsx"
Cohesion: 0.16
Nodes (11): approveOrder(), fetchOrders(), markOrderShipped(), AdminOrder, PAYMENT_COLORS, PAYMENT_LABELS, RawOrder, STATUS_COLORS (+3 more)

### Community 28 - "billing.repo.ts"
Cohesion: 0.12
Nodes (15): cancelSubscription(), createSubscription(), deletePlan(), getActivePlans(), getAllPlans(), getAllSubscriptions(), getAllSubscriptionsEnriched(), getPlanById() (+7 more)

### Community 29 - "CompanySidebar.tsx"
Cohesion: 0.21
Nodes (9): getCurrentProfileId(), getMyOrders(), placeOrder(), CompanyOrdersPage(), STATUS_BADGE, STATUS_STEP, OrdersPage(), STATUS_BADGE (+1 more)

### Community 30 - "cards.actions.ts"
Cohesion: 0.33
Nodes (4): getOwnCard(), getPublicCard(), ActionResult, CardProfileForm

### Community 31 - "index.ts"
Cohesion: 0.32
Nodes (4): Avatar(), AvatarProps, SIZE_CLASSES, getInitials()

### Community 32 - "ImageUpload.tsx"
Cohesion: 0.21
Nodes (9): getActiveDesigns(), Currency, EMPTY_ADDRESS, formatCurrency(), getPricePerCard(), NewOrderPage(), OrderForm, Step (+1 more)

### Community 33 - "contact_exchanges.repo.ts"
Cohesion: 0.26
Nodes (3): PasswordInput, LoginData, loginSchema

### Community 34 - "onboarding.service.ts"
Cohesion: 0.33
Nodes (6): approveCompany(), approveIndividual(), canTransition(), rejectUser(), suspendUser(), VALID_TRANSITIONS

### Community 35 - "companies.repo.ts"
Cohesion: 0.20
Nodes (10): createCompany(), deleteCompany(), deleteCompanyCascade(), getAllCompanies(), getAllPendingCompanies(), getCompanyById(), getCompanyBySlug(), updateCompany() (+2 more)

### Community 36 - "EcoTap — Architecture & Coding Conventions"
Cohesion: 0.05
Nodes (36): Analytics & ML, Analytics & ML data strategy, Architecture: SSOT (Single Source of Truth), Billing & platform, card_events — the core telemetry table, Cards & orders, Company admin registration rules, Country representative rules (+28 more)

### Community 38 - "Input.tsx"
Cohesion: 0.22
Nodes (8): FieldWrapper(), FieldWrapperProps, Input, InputProps, Select, SelectProps, Textarea, TextareaProps

### Community 39 - "EcoTap — Fixes & Improvements Plan"
Cohesion: 0.05
Nodes (36): 10. Payment screenshots from subscription flow are uploaded to `orders/pending` path, 11. Company settings doesn't check slug uniqueness, 12. Subscription page "Subscribe now" button always visible, 13. Subscription "Estimated monthly cost" label is wrong for annual plans, 14. No order pagination — fetches all orders unconditionally, 15. `deleteEmployeeAction` uses inline dynamic imports unnecessarily, 16. Employee dashboard layout fetches user data client-side (waterfall + flash), 17. "View my card" link can point to `/you` (404) (+28 more)

### Community 53 - "EcoTap — Project TODO"
Cohesion: 0.11
Nodes (17): Build order summary, EcoTap — Project TODO, Phase 10 — Services layer (SSOT Layer 3), Phase 11 — Auth wiring & route protection, Phase 12 — Connect all dashboards to real data, Phase 13 — vCard, QR codes & image storage, Phase 14 — SEO, metadata & OG images, Phase 15 — Production launch (+9 more)

### Community 54 - "EcoTap (production)"
Cohesion: 0.18
Nodes (10): Database, Deployment, EcoTap (production), Environment variables, Getting started, Project structure, Tech stack, URL structure (+2 more)

### Community 56 - "auth.actions.ts"
Cohesion: 0.24
Nodes (13): getCurrentUser(), getSession(), getSupabaseServerAction(), requestPasswordReset(), resendOtp(), resetPassword(), resetPasswordWithOtp(), setNewPassword() (+5 more)

### Community 57 - "page.tsx"
Cohesion: 0.22
Nodes (7): ContactsClient(), LEAD_LEVELS, Props, SortDir, SortField, ContactsContent(), TableSkeleton()

### Community 58 - "Demo Accounts"
Cohesion: 0.40
Nodes (4): Admin & Company, Demo Accounts, Notes, RDMC Employees

### Community 59 - "uploads.actions.ts"
Cohesion: 0.36
Nodes (7): ALLOWED_TYPES, deleteUpload(), linkPaymentToOrder(), updateProfilePhoto(), uploadDesignImage(), uploadPaymentScreenshot(), validateFile()

### Community 61 - "fetchOrders"
Cohesion: 0.24
Nodes (11): AdminUser, AUTH_PAGES, config, DASHBOARD_BASE, isAccessAllowed(), isPublicPath(), middleware(), PUBLIC_CARD_PATTERNS (+3 more)

### Community 62 - "card_orders.repo.ts"
Cohesion: 0.29
Nodes (4): PendingCompany, PendingIndividual, PendingItem, PageHeader()

### Community 63 - "page.tsx"
Cohesion: 0.33
Nodes (5): AdminQrPage(), BG_COLORS, FG_COLORS, UserMatch, SectionCard()

### Community 65 - "deleteUserAction"
Cohesion: 0.40
Nodes (5): deleteUserAction(), deleteOwnAccount(), deleteProfileCascade(), deleteUser(), getUserById()

## Knowledge Gaps
- **298 isolated node(s):** `1. Employee overview crashes when no card row exists`, `2. `computeCardScores` engagement score is always 100 (math bug)`, `3. `recordCardEvent` return-visitor detection is broken`, `4. Contacts optimistic updates never roll back on failure`, `5. `updateMyCard` — employees can overwrite admin-assigned job titles` (+293 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **10 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `getSupabase()` connect `getSupabase` to `deleteUserAction`, `page.tsx`, `companies.repo.ts`, `page.tsx`, `getServiceSupabase`, `admin.actions.ts`, `contacts.service.ts`, `DashboardShared.tsx`, `Input.tsx`, `cards.actions.ts`, `page.tsx`, `profiles.repo.ts`, `uploads.actions.ts`, `billing.repo.ts`, `CompanySidebar.tsx`?**
  _High betweenness centrality (0.127) - this node is a cross-community bridge._
- **Why does `Button()` connect `Button.tsx` to `VerifyResetForm.tsx`, `contact_exchanges.repo.ts`, `page.tsx`, `cn`, `page.tsx`, `Input.tsx`, `page.tsx`, `page.tsx`, `BrandLogo.tsx`, `DashboardShared.tsx`, `page.tsx`, `Input.tsx`, `page.tsx`, `AuthLayout.tsx`, `page.tsx`, `card_orders.repo.ts`, `page.tsx`?**
  _High betweenness centrality (0.053) - this node is a cross-community bridge._
- **Why does `getServiceSupabase` connect `getServiceSupabase` to `ImageUpload.tsx`, `page.tsx`, `onboarding.service.ts`, `getSupabase`, `companies.repo.ts`, `page.tsx`, `admin.actions.ts`, `contacts.service.ts`, `Input.tsx`, `profiles.repo.ts`, `uploads.actions.ts`, `billing.repo.ts`, `CompanySidebar.tsx`?**
  _High betweenness centrality (0.041) - this node is a cross-community bridge._
- **What connects `1. Employee overview crashes when no card row exists`, `2. `computeCardScores` engagement score is always 100 (math bug)`, `3. `recordCardEvent` return-visitor detection is broken` to the rest of the system?**
  _299 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `page.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.07112375533428165 - nodes in this community are weakly interconnected._
- **Should `getSupabase` be split into smaller, more focused modules?**
  _Cohesion score 0.08710801393728224 - nodes in this community are weakly interconnected._
- **Should `PublicCardLayout.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.10526315789473684 - nodes in this community are weakly interconnected._