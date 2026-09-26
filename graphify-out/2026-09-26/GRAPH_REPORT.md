# Graph Report - ecotap  (2026-09-26)

## Corpus Check
- 191 files · ~145,780 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 1267 nodes · 2595 edges · 81 communities (65 shown, 16 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 9 edges (avg confidence: 0.63)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `b3e9a6c7`
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
- middleware.ts
- public.actions.ts
- ImageUpload.tsx
- analytics.actions.ts
- companies.repo.ts
- EcoTap — Architecture & Coding Conventions
- server.ts
- Input.tsx
- middleware.ts
- seed-demo-users.ts
- EventActions.tsx
- layout.tsx
- page.tsx
- page.tsx
- eslint.config.mjs
- next.config.ts
- postcss.config.mjs
- layout.tsx
- page.tsx
- page.tsx
- CardPreview.tsx
- EcoTap (production)
- AuthLayout.tsx
- getPublicCard
- page.tsx
- Modal.tsx
- PublicCardLayout.tsx
- web-nfc.d.ts
- onboarding.service.ts
- card_orders.repo.ts
- generator.ts
- Audit — 2026-09-25 (second sweep: schema, config, dead code)
- BrandLogo.tsx
- page.tsx
- 🟡 Testing Results — Medium Severity
- page.tsx
- page.tsx
- EmptyState
- requireAdminAccess
- 🔴 Testing Results — Critical Bugs Found
- page.tsx
- 🟠 Testing Results — High Severity
- EcoTap — Fixes & Testing Report
- Avatar.tsx
- Profile
- VerifyResetForm.tsx
- page.tsx

## God Nodes (most connected - your core abstractions)
1. `getSupabase()` - 108 edges
2. `getServiceSupabase` - 63 edges
3. `Button()` - 44 edges
4. `cn()` - 43 edges
5. `PageHeader()` - 22 edges
6. `requireSuperAdmin()` - 21 edges
7. `ActionResult` - 20 edges
8. `Input` - 20 edges
9. `getEventCapabilities()` - 19 edges
10. `EcoTap — Architecture & Coding Conventions` - 18 edges

## Surprising Connections (you probably didn't know these)
- `EventsContent()` --indirect_call--> `toListRow()`  [INFERRED]
  src/app/dashboard/company/events/page.tsx → src/components/events/EventList.tsx
- `Props` --references--> `EcoEvent`  [EXTRACTED]
  src/components/events/EventActions.tsx → src/types/index.ts
- `StepIndicator()` --calls--> `cn()`  [EXTRACTED]
  src/app/dashboard/company/orders/new/page.tsx → src/lib/utils/index.ts
- `StepIndicator()` --calls--> `cn()`  [EXTRACTED]
  src/app/dashboard/company/subscription/new/page.tsx → src/lib/utils/index.ts
- `StepIndicator()` --calls--> `cn()`  [EXTRACTED]
  src/app/dashboard/employee/orders/new/page.tsx → src/lib/utils/index.ts

## Import Cycles
- None detected.

## Communities (81 total, 16 thin omitted)

### Community 0 - "cn"
Cohesion: 0.15
Nodes (11): AdminDashboardLayout(), buildAdminNav(), CompanySidebar(), NAV, Props, EmployeeSidebar(), NAV, Props (+3 more)

### Community 1 - "page.tsx"
Cohesion: 0.10
Nodes (18): approveSubscriptionAction(), fetchAllSubscriptionsAdminAction(), rejectSubscriptionAction(), requireSuperAdmin(), verifySubscriptionPaymentAction(), BillingPage(), INITIAL_PLANS, PAYMENT_COLORS (+10 more)

### Community 2 - "getSupabase"
Cohesion: 0.10
Nodes (33): ContactsContent(), assignTestVariant(), createEnvironmentalReport(), getCardScores(), getDailyStats(), getEnvironmentalReports(), getEventCountByType(), getEventsByCardId() (+25 more)

### Community 3 - "PublicCardLayout.tsx"
Cohesion: 0.16
Nodes (14): AdminEventDetailPage(), metadata, Props, CompanyEventDetailPage(), metadata, Props, metadata, Props (+6 more)

### Community 4 - "page.tsx"
Cohesion: 0.05
Nodes (38): dependencies, @aws-sdk/client-s3, class-variance-authority, clsx, fflate, @hookform/resolvers, lucide-react, next (+30 more)

### Community 5 - "dependencies"
Cohesion: 0.10
Nodes (19): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+11 more)

### Community 6 - "admin.service.ts"
Cohesion: 0.10
Nodes (6): EventListRow, BulkExportPlan, EventSummary, EcoEvent, EcoEventWithHost, ExportScope

### Community 7 - "page.tsx"
Cohesion: 0.11
Nodes (17): Build order summary, EcoTap — Project TODO, Phase 10 — Services layer (SSOT Layer 3), Phase 11 — Auth wiring & route protection, Phase 12 — Connect all dashboards to real data, Phase 13 — vCard, QR codes & image storage, Phase 14 — SEO, metadata & OG images, Phase 15 — Production launch (+9 more)

### Community 8 - "uploads.actions.ts"
Cohesion: 0.12
Nodes (16): 1. Analytics & ML data strategy, 2. Environmental impact report, 3. Notifications & email, 4. Other built-but-unwired surfaces, `card_events` — the intended core telemetry table, Current state: **calculation built, delivery missing**, Current state: **not implemented**, Current state: **schema and services built, telemetry not wired** (+8 more)

### Community 9 - "CardPreview.tsx"
Cohesion: 0.10
Nodes (28): acceptInvite(), createInvite(), CreateInviteInput, InviteResult, ValidatedInvite, validateInviteToken(), createCard(), deleteCard() (+20 more)

### Community 10 - "getServiceSupabase"
Cohesion: 0.13
Nodes (15): getAdminEventsAction(), getLiveEventCountAction(), DoorPage(), metadata, Props, DetailContent(), EventsContent(), metadata (+7 more)

### Community 11 - "admin.actions.ts"
Cohesion: 0.10
Nodes (19): deleteCompanyAction(), deleteUserAction(), fetchPlans(), fetchUsers(), lookupUserForQR(), toggleUserStatusAction(), AdminOverview, deleteCompany() (+11 more)

### Community 13 - "analytics.service.ts"
Cohesion: 0.08
Nodes (16): calcMonthlyImpact(), generateMonthlyReport(), AddCompanyForm, CardEvent, CardScore, CountryRep, DailyCardStat, EnvironmentalReport (+8 more)

### Community 14 - "page.tsx"
Cohesion: 0.19
Nodes (5): AuthLayout(), AuthLayoutProps, PasswordInput, LoginData, loginSchema

### Community 15 - "compilerOptions"
Cohesion: 0.09
Nodes (20): TapActionResult, attendeeFromVisit(), closeEvent(), collectExportRows(), decorate(), durationOf(), formatExportTime(), getAdminEventSummaries() (+12 more)

### Community 16 - "BrandLogo.tsx"
Cohesion: 0.18
Nodes (10): Documentation drift, EcoTap — Project Status, Events — documented behaviours, not defects, Functional, Known issues, Security-relevant — read before exposing this app further, Testing & CI, Type safety (+2 more)

### Community 17 - "contacts.service.ts"
Cohesion: 0.15
Nodes (11): getCurrentProfileId(), getMyInbox(), updateContactExchange(), ContactsClient(), LEAD_LEVELS, Props, SortDir, SortField (+3 more)

### Community 18 - "DashboardShared.tsx"
Cohesion: 0.17
Nodes (17): RFC-5987, GET(), NOTE: this static `export` segment sits alongside the sibling dynamic, attachmentHeader(), EXPORT_ERROR_STATUS, exportError(), NO_STORE, GET() (+9 more)

### Community 19 - "index.ts"
Cohesion: 0.23
Nodes (18): ALLOWED_TYPES, deleteUpload(), linkPaymentToOrder(), updateCompanyLogo(), updateProfilePhoto(), uploadDesignImage(), uploadPaymentScreenshot(), validateFile() (+10 more)

### Community 20 - "page.tsx"
Cohesion: 0.16
Nodes (13): getCurrentProfileId(), placeOrder(), approveOrder(), canTransition(), markDelivered(), markShipped(), transitionOrderStatus(), uploadPaymentScreenshot() (+5 more)

### Community 21 - "Input.tsx"
Cohesion: 0.11
Nodes (17): metadata, ADMIN_ROLES, ADMIN_WRITE_ROLES, CARD_ORIGINAL_PRICES, CHECK_IN_METHOD_LABELS, COLORS, COMPANY_SOCIAL_LINKS, ENV (+9 more)

### Community 22 - "page.tsx"
Cohesion: 0.17
Nodes (19): closeEventAction(), createEventAction(), getEventVisitsAction(), getMyEventsAction(), getOpenVisitsAction(), goLiveAction(), recordManualExitAction(), requireHost() (+11 more)

### Community 23 - "cards.actions.ts"
Cohesion: 0.15
Nodes (18): ALL_ROLES, Card(), CardContent(), CardDescription(), CardFooter(), CardHeader(), CardProps, CardTitle() (+10 more)

### Community 24 - "orders.service.ts"
Cohesion: 0.10
Nodes (29): getActiveDesigns(), CompanyNewOrderPage(), Currency, EMPTY_ADDRESS, formatCurrency(), getPricePerCard(), OrderForm, Step (+21 more)

### Community 25 - "InviteModal.tsx"
Cohesion: 0.12
Nodes (22): checkInTapAction(), ConfirmExitPrompt(), Props, Band, BAND_STYLE, BandContent(), ERROR_COPY, EventDoorScreen() (+14 more)

### Community 26 - "profiles.repo.ts"
Cohesion: 0.06
Nodes (22): AdminUser, DASHBOARD_ROUTE, UserFilters, approveCompany(), approveIndividual(), canTransition(), rejectCompany(), rejectUser() (+14 more)

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
Cohesion: 0.14
Nodes (15): deleteMyAccount(), getMyCard(), updateMyCard(), EMPTY_FORM, EMPTY_GROUP, FormState, GroupEntry, GROUP_SOCIAL_LINKS (+7 more)

### Community 31 - "middleware.ts"
Cohesion: 0.12
Nodes (20): activateEmployeeAction(), CompanyDashboardData, CompanyEmployee, deleteEmployeeAction(), suspendEmployeeAction(), UpdateCompanyInput, updateMyCompany(), acceptInvitationAction() (+12 more)

### Community 32 - "public.actions.ts"
Cohesion: 0.16
Nodes (14): recordPageView(), getPublicCard, PublicCompanyData, PublicEmployee, resolveSlug, Props, EmployeeCardPage(), generateMetadata() (+6 more)

### Community 34 - "analytics.actions.ts"
Cohesion: 0.18
Nodes (11): CompanySettingsPage(), DEFAULT_FORM, FormState, PRESET_COLORS, createCroppedImage(), ICON_SIZES, ImageUpload(), ImageUploadProps (+3 more)

### Community 35 - "companies.repo.ts"
Cohesion: 0.16
Nodes (21): AnyActionResult, approveCompany(), approveIndividual(), approveOrder(), createDesign(), deleteDesign(), deletePlan(), markOrderDelivered() (+13 more)

### Community 36 - "EcoTap — Architecture & Coding Conventions"
Cohesion: 0.07
Nodes (29): Analytics & ML, Architecture: SSOT (Single Source of Truth), Authentication, Billing & platform, Cards & orders, Company admin registration rules, Country representative rules, Database tables — complete list (+21 more)

### Community 38 - "Input.tsx"
Cohesion: 0.16
Nodes (12): submitContactExchange(), metadata, ContactExchangeForm(), ContactExchangeFormProps, FieldWrapper(), FieldWrapperProps, Input, InputProps (+4 more)

### Community 39 - "middleware.ts"
Cohesion: 0.13
Nodes (3): InsertVisitInput, CheckInMethod, VisitExitSource

### Community 41 - "EventActions.tsx"
Cohesion: 0.20
Nodes (9): getActivePlansAction(), Currency, NewSubscriptionPage(), Step, StepIndicator(), STEPS, SubscriptionForm, MOMO_PAY (+1 more)

### Community 53 - "CardPreview.tsx"
Cohesion: 0.16
Nodes (15): CardPreview(), CardPreviewProps, GroupPreviewEntry, SOCIAL_LABELS, PublicCardLayout(), SOCIAL_CONFIG, SocialIconRow(), SocialIconsProps (+7 more)

### Community 54 - "EcoTap (production)"
Cohesion: 0.13
Nodes (14): Database, Deployment, Documentation map, EcoTap (production), Environment variables, Getting started, Project structure, Seeding demo accounts (+6 more)

### Community 55 - "AuthLayout.tsx"
Cohesion: 0.27
Nodes (3): EmployeeOverviewContent(), StatCard(), StatCardSkeleton()

### Community 56 - "getPublicCard"
Cohesion: 0.13
Nodes (15): OrgRegisterPage(), Step3Review(), STEPS, COMPANY_SIZES, age, email, fullName, OrgRegisterData (+7 more)

### Community 58 - "Modal.tsx"
Cohesion: 0.25
Nodes (14): getCurrentUser(), getSession(), getSupabaseServerAction(), requestPasswordReset(), resendOtp(), resetPassword(), resetPasswordWithOtp(), setNewPassword() (+6 more)

### Community 59 - "PublicCardLayout.tsx"
Cohesion: 0.19
Nodes (11): RFC-6350, GET(), Props, PublicCardLayoutProps, SaveContactButton(), SaveContactButtonProps, downloadVcf(), foldLine() (+3 more)

### Community 60 - "web-nfc.d.ts"
Cohesion: 0.22
Nodes (6): decodeRecord(), NDEFMessageLike, NDEFReader, NDEFReadingEventLike, NDEFRecordLike, Window

### Community 61 - "onboarding.service.ts"
Cohesion: 0.25
Nodes (8): createCompany(), deleteCompany(), getAllCompanies(), getAllPendingCompanies(), getCompanyById(), getCompanyBySlug(), updateCompany(), updateCompanyStatus()

### Community 62 - "card_orders.repo.ts"
Cohesion: 0.14
Nodes (10): PendingCompany, PendingIndividual, PendingItem, Design, INITIAL_DESIGNS, PRESET_COLORS, Badge(), BadgeProps (+2 more)

### Community 63 - "generator.ts"
Cohesion: 0.11
Nodes (18): Audit — 2026-09-25, Corrections to the B/H/M list above, Environment & consistency findings, N10. Deleting a host destroys other people's attendance records — MEDIUM **[verified]**, N11. `updateMyCard` commits partial writes and can destroy card groups — MEDIUM **[reported]**, N12. `recordPageView` is an unauthenticated, unvalidated service-role write — MEDIUM **[verified]**, N13. `deleteExchange` always reports success and never deletes — LOW **[reported]**, N14. Self-delete has no last-super-admin guard — LOW **[reported]** (+10 more)

### Community 64 - "Audit — 2026-09-25 (second sweep: schema, config, dead code)"
Cohesion: 0.12
Nodes (17): Areas verified clean, Audit — 2026-09-25 (second sweep: schema, config, dead code), E10. Smaller consistency findings **[reported]**, E9. `creamDark` drift is worse than a wrong constant — the stale value is hardcoded in 10 files **[verified]**, N15. A fresh install cannot apply migration 022 — the documented setup path is broken — CRITICAL **[verified]**, N16. `FULL_SCHEMA.sql` omits all four of migration 012's contact-enrichment columns — HIGH **[reported]**, N17. `FULL_SCHEMA.sql` omits migration 014 — the RLS policy it exists to add — HIGH **[reported]**, N18. `FULL_SCHEMA.sql` omits migration 015's objects — LOW **[reported]** (+9 more)

### Community 65 - "BrandLogo.tsx"
Cohesion: 0.17
Nodes (10): BrandIcon(), BrandIconProps, BrandLogo(), BrandLogoProps, ICON_SIZES, TEXT_COLORS, Footer(), FOOTER_LINKS (+2 more)

### Community 66 - "page.tsx"
Cohesion: 0.17
Nodes (7): InviteModal(), Props, Props, Props, Button(), ButtonProps, buttonVariants

### Community 67 - "🟡 Testing Results — Medium Severity"
Cohesion: 0.13
Nodes (14): M10. Raw Supabase error messages returned to clients, M11. Settings page: no client-side required-name validation, M12. Design edit modal: color swatch buttons have no aria-labels, M13. Employee overview header "View my card" goes to profile editor, not public card, M14. Employee orders page has no error state distinction, M1. Overview "Active companies" stat counts ALL companies, M2. Admin users "Reactivate user" label is wrong for pending users, M3. Contacts stats "With email"/"This month" are per-page only (+6 more)

### Community 68 - "page.tsx"
Cohesion: 0.12
Nodes (16): getMyOrders(), BG_COLORS, FG_COLORS, UserMatch, CompanyOrdersPage(), STATUS_BADGE, STATUS_STEP, OrdersPage() (+8 more)

### Community 69 - "page.tsx"
Cohesion: 0.18
Nodes (11): EventsContent(), metadata, EventsContent(), metadata, BulkExportButton(), Props, EventList(), isExportable() (+3 more)

### Community 70 - "EmptyState"
Cohesion: 0.19
Nodes (6): getCompanyDashboardData, InviteButton(), EmployeesContent(), CompanyDashboardLayout(), CompanyOverviewContent(), SubscriptionContent()

### Community 71 - "requireAdminAccess"
Cohesion: 0.15
Nodes (13): fetchAllContactExchanges(), fetchContactExchangesCount(), fetchDesigns(), fetchPendingQueue(), fetchUserCardUrl(), fetchUserProfile(), requireAdminAccess(), getAllContactExchangesAdmin() (+5 more)

### Community 72 - "🔴 Testing Results — Critical Bugs Found"
Cohesion: 0.17
Nodes (12): B10. Employee contacts: "Favorites First" sort is inverted, B11. Failed payment screenshot link is silent, success page lies, B1. Billing "Save changes" creates a DUPLICATE plan instead of updating, B2. Billing "Deactivate/Activate" is purely cosmetic — never persisted, B3. Designs "Save changes" reactivates inactive designs + overwrites pattern, B4. resolveCompanyId used WITHOUT role check — privilege escalation, B5. Service-role writes without ownership verification — 5 endpoints, B6. User enumeration confirmed — 3 vectors (+4 more)

### Community 73 - "page.tsx"
Cohesion: 0.20
Nodes (9): fetchOrders(), AdminOrder, PAYMENT_COLORS, PAYMENT_LABELS, RawOrder, STATUS_COLORS, STATUS_NEXT, getAllOrdersAdmin() (+1 more)

### Community 74 - "🟠 Testing Results — High Severity"
Cohesion: 0.18
Nodes (11): H10. QR search "by name" doesn't search names, H1. Delete/Toggle employee error messages are invisible, H2. Subscription currency toggle: RWF amount stored as USD, H3. "Company card orders" page shows only admin's personal orders, H4. Client-supplied payment amounts never validated server-side, H5. No rate limiting anywhere, H6. `/dev/components` is publicly accessible, H7. `country_rep` middleware access contradicts server action guards (+3 more)

### Community 75 - "EcoTap — Fixes & Testing Report"
Cohesion: 0.20
Nodes (9): EcoTap — Fixes & Testing Report, ✅ Fixes Applied (from previous review), Immediate (this session), Medium-term, 🆕 New Features Added, Priority Fix Queue, Short-term, SQL Migration Applied (+1 more)

### Community 76 - "Avatar.tsx"
Cohesion: 0.29
Nodes (6): createDepartment(), deleteDepartment(), getDepartmentById(), getDepartmentsByCompany(), updateDepartment(), Department

### Community 77 - "Profile"
Cohesion: 0.33
Nodes (6): PendingQueue, Company, CompanyWithRelations, Profile, ProfileFull, ProfileWithCompanies

## Knowledge Gaps
- **382 isolated node(s):** `Layer 1 — Migrations`, `Layer 2 — Repositories (`src/lib/supabase/`)`, `Layer 3 — Services (`src/lib/services/`)`, `Layer 4 — UI`, `Folder conventions` (+377 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **16 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `getSupabase()` connect `getSupabase` to `cn`, `page.tsx`, `companies.repo.ts`, `page.tsx`, `server.ts`, `requireAdminAccess`, `CardPreview.tsx`, `admin.actions.ts`, `Avatar.tsx`, `contacts.service.ts`, `index.ts`, `page.tsx`, `AuthLayout.tsx`, `contact_exchanges.repo.ts`, `billing.repo.ts`, `onboarding.service.ts`, `cards.actions.ts`, `middleware.ts`?**
  _High betweenness centrality (0.041) - this node is a cross-community bridge._
- **Why does `getServiceSupabase` connect `CardPreview.tsx` to `public.actions.ts`, `page.tsx`, `getSupabase`, `companies.repo.ts`, `profiles.repo.ts`, `server.ts`, `admin.actions.ts`, `index.ts`, `page.tsx`, `orders.service.ts`, `Modal.tsx`, `contact_exchanges.repo.ts`, `billing.repo.ts`, `onboarding.service.ts`, `cards.actions.ts`, `middleware.ts`?**
  _High betweenness centrality (0.029) - this node is a cross-community bridge._
- **Why does `Button()` connect `page.tsx` to `page.tsx`, `Button.tsx`, `page.tsx`, `Input.tsx`, `cards.actions.ts`, `orders.service.ts`, `cards.actions.ts`, `analytics.actions.ts`, `Input.tsx`, `EventActions.tsx`, `AuthLayout.tsx`, `getPublicCard`, `Modal.tsx`, `card_orders.repo.ts`, `BrandLogo.tsx`, `page.tsx`, `EmptyState`, `page.tsx`, `VerifyResetForm.tsx`, `page.tsx`?**
  _High betweenness centrality (0.024) - this node is a cross-community bridge._
- **What connects `Layer 1 — Migrations`, `Layer 2 — Repositories (`src/lib/supabase/`)`, `Layer 3 — Services (`src/lib/services/`)` to the rest of the system?**
  _384 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `page.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.10317460317460317 - nodes in this community are weakly interconnected._
- **Should `getSupabase` be split into smaller, more focused modules?**
  _Cohesion score 0.10158730158730159 - nodes in this community are weakly interconnected._
- **Should `page.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.05128205128205128 - nodes in this community are weakly interconnected._