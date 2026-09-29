# Graph Report - ecotap  (2026-09-29)

## Corpus Check
- 191 files · ~149,186 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 1276 nodes · 2735 edges · 77 communities (63 shown, 14 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 9 edges (avg confidence: 0.63)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `2e19179f`
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
- EcoTap — Fixes & Testing Report
- BrandLogo.tsx
- page.tsx
- 🟡 Testing Results — Medium Severity
- page.tsx
- page.tsx
- card_orders.repo.ts
- Fix pass — 2026-09-26
- ImageUpload.tsx
- departments.repo.ts
- resolveCompanyId
- Avatar.tsx
- ActionResult

## God Nodes (most connected - your core abstractions)
1. `getSupabase()` - 127 edges
2. `getServiceSupabase` - 95 edges
3. `Button()` - 51 edges
4. `cn()` - 43 edges
5. `PageHeader()` - 28 edges
6. `resolveCompanyId()` - 24 edges
7. `requireSuperAdmin()` - 21 edges
8. `Input` - 21 edges
9. `ActionResult` - 20 edges
10. `EmptyState()` - 18 edges

## Surprising Connections (you probably didn't know these)
- `OrgRegisterPage()` --calls--> `signUpOrg()`  [EXTRACTED]
  src/app/(auth)/org/register/page.tsx → src/app/actions/auth.actions.ts
- `CompanyOverviewContent()` --calls--> `getCompanyDashboardData`  [EXTRACTED]
  src/app/dashboard/company/page.tsx → src/app/actions/company.actions.ts
- `acceptInvitationAction()` --calls--> `getSupabase()`  [EXTRACTED]
  src/app/actions/invitations.actions.ts → src/lib/supabase/server.ts
- `getMySubscriptionAction()` --calls--> `resolveCompanyId()`  [EXTRACTED]
  src/app/actions/subscription.actions.ts → src/lib/supabase/server.ts
- `StepIndicator()` --calls--> `cn()`  [EXTRACTED]
  src/app/dashboard/company/orders/new/page.tsx → src/lib/utils/index.ts

## Import Cycles
- None detected.

## Communities (77 total, 14 thin omitted)

### Community 0 - "cn"
Cohesion: 0.10
Nodes (24): signOut(), AdminDashboardLayout(), buildAdminNav(), CompanySidebar(), NAV, Props, SignOutButton(), EmployeeSidebar() (+16 more)

### Community 1 - "page.tsx"
Cohesion: 0.07
Nodes (30): approveSubscriptionAction(), fetchAllSubscriptionsAdminAction(), getActivePlansAction(), getMySubscriptionAction(), rejectSubscriptionAction(), requireSuperAdmin(), subscribeAction(), uploadSubscriptionScreenshotAction() (+22 more)

### Community 2 - "getSupabase"
Cohesion: 0.09
Nodes (38): assignTestVariant(), createEnvironmentalReport(), getCardScores(), getDailyStats(), getEnvironmentalReports(), getEventCountByType(), getEventsByCardId(), getLatestCardScore() (+30 more)

### Community 3 - "PublicCardLayout.tsx"
Cohesion: 0.13
Nodes (18): AdminEventDetailPage(), metadata, Props, CompanyEventDetailPage(), metadata, Props, DetailContent(), metadata (+10 more)

### Community 4 - "page.tsx"
Cohesion: 0.05
Nodes (38): dependencies, @aws-sdk/client-s3, class-variance-authority, clsx, fflate, @hookform/resolvers, lucide-react, next (+30 more)

### Community 5 - "dependencies"
Cohesion: 0.10
Nodes (19): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+11 more)

### Community 6 - "admin.service.ts"
Cohesion: 0.10
Nodes (31): closeAllOpenVisitsService(), closeVisitService(), countOpenVisitsService(), countVisitsByEventService(), countVisitsByEventsService(), getOpenVisitService(), getOpenVisitsService(), getVisitById() (+23 more)

### Community 7 - "page.tsx"
Cohesion: 0.11
Nodes (17): Build order summary, EcoTap — Project TODO, Phase 10 — Services layer (SSOT Layer 3), Phase 11 — Auth wiring & route protection, Phase 12 — Connect all dashboards to real data, Phase 13 — vCard, QR codes & image storage, Phase 14 — SEO, metadata & OG images, Phase 15 — Production launch (+9 more)

### Community 8 - "uploads.actions.ts"
Cohesion: 0.12
Nodes (16): 1. Analytics & ML data strategy, 2. Environmental impact report, 3. Notifications & email, 4. Other built-but-unwired surfaces, `card_events` — the intended core telemetry table, Current state: **calculation built, delivery missing**, Current state: **not implemented**, Current state: **schema and services built, telemetry not wired** (+8 more)

### Community 9 - "CardPreview.tsx"
Cohesion: 0.13
Nodes (14): acceptInvite(), createInvite(), CreateInviteInput, InviteResult, ValidatedInvite, validateInviteToken(), acceptInvitation(), createInvitation() (+6 more)

### Community 10 - "getServiceSupabase"
Cohesion: 0.13
Nodes (20): NfcTapPanel(), Props, Avatar(), AvatarProps, SIZE_CLASSES, Card(), CardContent(), CardDescription() (+12 more)

### Community 11 - "admin.actions.ts"
Cohesion: 0.05
Nodes (61): AnyActionResult, approveCompany(), approveIndividual(), approveOrder(), createDesign(), deleteCompanyAction(), deleteDesign(), deletePlan() (+53 more)

### Community 13 - "analytics.service.ts"
Cohesion: 0.11
Nodes (6): calcMonthlyImpact(), ENV, generateMonthlyReport(), CardEvent, EnvironmentalReport, RecordEventPayload

### Community 14 - "page.tsx"
Cohesion: 0.13
Nodes (6): AuthLayout(), AuthLayoutProps, InputProps, PasswordInput, LoginData, loginSchema

### Community 15 - "compilerOptions"
Cohesion: 0.08
Nodes (20): attendeeFromVisit(), closeEvent(), collectExportRows(), decorate(), durationOf(), ExportDenial, formatExportTime(), getAdminEventSummaries() (+12 more)

### Community 16 - "BrandLogo.tsx"
Cohesion: 0.18
Nodes (10): Documentation drift, EcoTap — Project Status, Events — documented behaviours, not defects, Functional, Known issues, Security-relevant — read before exposing this app further, Testing & CI, Type safety (+2 more)

### Community 17 - "contacts.service.ts"
Cohesion: 0.19
Nodes (7): getCurrentProfileId(), getMyInbox(), updateContactExchange(), Props, ContactExchange, ContactExchangeWithOwner, DeviceType

### Community 18 - "DashboardShared.tsx"
Cohesion: 0.19
Nodes (17): RFC-5987, GET(), NOTE: this static `export` segment sits alongside the sibling dynamic, attachmentHeader(), EXPORT_ERROR_STATUS, exportError(), exportFilename(), NO_STORE (+9 more)

### Community 19 - "index.ts"
Cohesion: 0.14
Nodes (13): createCard(), deleteCard(), deleteCardGroup(), deleteCardService(), getCardById(), getCardByProfileId(), getCardByProfileIdService(), getCardBySlug() (+5 more)

### Community 20 - "page.tsx"
Cohesion: 0.23
Nodes (12): AdminUser, DASHBOARD_ROUTE, UserFilters, AUTH_PAGES, config, isAccessAllowed(), isPublicPath(), middleware() (+4 more)

### Community 21 - "Input.tsx"
Cohesion: 0.12
Nodes (15): metadata, ADMIN_ROLES, ADMIN_WRITE_ROLES, CARD_ORIGINAL_PRICES, CHECK_IN_METHOD_LABELS, COLORS, COMPANY_SOCIAL_LINKS, EVENT_EXPORT_COLUMNS (+7 more)

### Community 22 - "page.tsx"
Cohesion: 0.16
Nodes (21): closeEventAction(), createEventAction(), getEventVisitsAction(), getMyEventsAction(), getOpenVisitsAction(), goLiveAction(), recordManualExitAction(), requireHost() (+13 more)

### Community 23 - "cards.actions.ts"
Cohesion: 0.22
Nodes (6): getMyCard(), AdminQrPage(), BG_COLORS, FG_COLORS, UserMatch, PageHeader()

### Community 24 - "orders.service.ts"
Cohesion: 0.06
Nodes (59): getActiveDesigns(), getCurrentProfileId(), placeOrder(), ALLOWED_TYPES, deleteUpload(), linkPaymentToOrder(), updateCompanyLogo(), updateProfilePhoto() (+51 more)

### Community 25 - "InviteModal.tsx"
Cohesion: 0.13
Nodes (20): checkInTapAction(), metadata, Props, Props, Band, BAND_STYLE, ERROR_COPY, EventDoorScreen() (+12 more)

### Community 26 - "profiles.repo.ts"
Cohesion: 0.11
Nodes (18): createProfile(), deleteProfile(), deleteProfileService(), getAllPending(), getAllProfiles(), getPrimaryCompanyInfoService(), getProfileByEmail(), getProfileById() (+10 more)

### Community 27 - "contact_exchanges.repo.ts"
Cohesion: 0.20
Nodes (9): AdminExchangeOptions, createExchange(), deleteExchange(), getAllExchangesAdmin(), getExchangeById(), getExchangesByCardId(), getExchangesByProfileId(), getExchangesCount() (+1 more)

### Community 28 - "billing.repo.ts"
Cohesion: 0.12
Nodes (17): Areas verified clean, Audit — 2026-09-25 (second sweep: schema, config, dead code), E10. Smaller consistency findings **[reported]**, E9. `creamDark` drift is worse than a wrong constant — the stale value is hardcoded in 10 files **[verified]**, N15. A fresh install cannot apply migration 022 — the documented setup path is broken — CRITICAL **[verified]**, N16. `FULL_SCHEMA.sql` omits all four of migration 012's contact-enrichment columns — HIGH **[reported]**, N17. `FULL_SCHEMA.sql` omits migration 014 — the RLS policy it exists to add — HIGH **[reported]**, N18. `FULL_SCHEMA.sql` omits migration 015's objects — LOW **[reported]** (+9 more)

### Community 29 - "CompanySidebar.tsx"
Cohesion: 0.40
Nodes (4): Admin & Company, Demo Accounts, Notes, RDMC Employees

### Community 30 - "cards.actions.ts"
Cohesion: 0.21
Nodes (10): deleteMyAccount(), updateMyCard(), EMPTY_FORM, EMPTY_GROUP, FormState, GroupEntry, GROUP_SOCIAL_LINKS, SOCIAL_LINKS (+2 more)

### Community 31 - "middleware.ts"
Cohesion: 0.18
Nodes (11): activateEmployeeAction(), CompanyDashboardData, CompanyEmployee, deleteEmployeeAction(), suspendEmployeeAction(), UpdateCompanyInput, DeleteEmployeeButton(), Props (+3 more)

### Community 32 - "public.actions.ts"
Cohesion: 0.18
Nodes (10): getCompanyDashboardData, updateMyCompany(), EmployeesContent(), CompanyDashboardLayout(), CompanySettingsPage(), DEFAULT_FORM, FormState, PRESET_COLORS (+2 more)

### Community 34 - "analytics.actions.ts"
Cohesion: 0.20
Nodes (9): getAdminEventsAction(), getLiveEventCountAction(), DoorPage(), EventsContent(), metadata, NewEventButton(), ANONYMOUS, getEventCapabilities() (+1 more)

### Community 35 - "companies.repo.ts"
Cohesion: 0.17
Nodes (12): B10. Employee contacts: "Favorites First" sort is inverted, B11. Failed payment screenshot link is silent, success page lies, B1. Billing "Save changes" creates a DUPLICATE plan instead of updating, B2. Billing "Deactivate/Activate" is purely cosmetic — never persisted, B3. Designs "Save changes" reactivates inactive designs + overwrites pattern, B4. resolveCompanyId used WITHOUT role check — privilege escalation, B5. Service-role writes without ownership verification — 5 endpoints, B6. User enumeration confirmed — 3 vectors (+4 more)

### Community 36 - "EcoTap — Architecture & Coding Conventions"
Cohesion: 0.07
Nodes (29): Analytics & ML, Architecture: SSOT (Single Source of Truth), Authentication, Billing & platform, Cards & orders, Company admin registration rules, Country representative rules, Database tables — complete list (+21 more)

### Community 38 - "Input.tsx"
Cohesion: 0.19
Nodes (10): submitContactExchange(), metadata, ContactExchangeForm(), ContactExchangeFormProps, FieldWrapper(), FieldWrapperProps, Input, SelectProps (+2 more)

### Community 39 - "middleware.ts"
Cohesion: 0.13
Nodes (18): PendingQueue, ABTestAssignment, AddCompanyForm, CardScore, Company, CompanyWithRelations, CountryRep, DailyCardStat (+10 more)

### Community 41 - "EventActions.tsx"
Cohesion: 0.18
Nodes (11): H10. QR search "by name" doesn't search names, H1. Delete/Toggle employee error messages are invisible, H2. Subscription currency toggle: RWF amount stored as USD, H3. "Company card orders" page shows only admin's personal orders, H4. Client-supplied payment amounts never validated server-side, H5. No rate limiting anywhere, H6. `/dev/components` is publicly accessible, H7. `country_rep` middleware access contradicts server action guards (+3 more)

### Community 53 - "CardPreview.tsx"
Cohesion: 0.26
Nodes (10): CardPreview(), CardPreviewProps, GroupPreviewEntry, SOCIAL_LABELS, SOCIAL_CONFIG, SocialIconRow(), SocialIconsProps, contrastColor() (+2 more)

### Community 54 - "EcoTap (production)"
Cohesion: 0.13
Nodes (14): Database, Deployment, Documentation map, EcoTap (production), Environment variables, Getting started, Project structure, Seeding demo accounts (+6 more)

### Community 55 - "AuthLayout.tsx"
Cohesion: 0.16
Nodes (8): CompanyOverviewContent(), EmployeeOverviewContent(), EmptyState(), PageHeaderProps, StatCard(), StatCardProps, StatCardSkeleton(), ORDER_STATUS_LABELS

### Community 56 - "getPublicCard"
Cohesion: 0.09
Nodes (19): validateInviteTokenAction(), OrgRegisterPage(), Step3Review(), STEPS, Select, COMPANY_SIZES, age, email (+11 more)

### Community 58 - "Modal.tsx"
Cohesion: 0.20
Nodes (14): getCurrentUser(), getSession(), getSupabaseServerAction(), requestPasswordReset(), resendOtp(), resetPassword(), resetPasswordWithOtp(), setNewPassword() (+6 more)

### Community 59 - "PublicCardLayout.tsx"
Cohesion: 0.27
Nodes (6): ContactsClient(), LEAD_LEVELS, SortDir, SortField, ContactsContent(), SectionCard()

### Community 60 - "web-nfc.d.ts"
Cohesion: 0.22
Nodes (6): decodeRecord(), NDEFMessageLike, NDEFReader, NDEFReadingEventLike, NDEFRecordLike, Window

### Community 61 - "onboarding.service.ts"
Cohesion: 0.31
Nodes (7): approveCompany(), approveIndividual(), canTransition(), rejectCompany(), rejectUser(), suspendUser(), VALID_TRANSITIONS

### Community 62 - "card_orders.repo.ts"
Cohesion: 0.14
Nodes (10): PendingCompany, PendingIndividual, PendingItem, Design, INITIAL_DESIGNS, PRESET_COLORS, Badge(), BadgeProps (+2 more)

### Community 63 - "generator.ts"
Cohesion: 0.11
Nodes (18): Audit — 2026-09-25, Corrections to the B/H/M list above, Environment & consistency findings, N10. Deleting a host destroys other people's attendance records — MEDIUM **[verified]**, N11. `updateMyCard` commits partial writes and can destroy card groups — MEDIUM **[reported]**, N12. `recordPageView` is an unauthenticated, unvalidated service-role write — MEDIUM **[verified]**, N13. `deleteExchange` always reports success and never deletes — LOW **[reported]**, N14. Self-delete has no last-super-admin guard — LOW **[reported]** (+10 more)

### Community 64 - "EcoTap — Fixes & Testing Report"
Cohesion: 0.22
Nodes (9): EcoTap — Fixes & Testing Report, ✅ Fixes Applied (from previous review), Immediate (this session), Medium-term, 🆕 New Features Added, Priority Fix Queue, Short-term, SQL Migration Applied (+1 more)

### Community 65 - "BrandLogo.tsx"
Cohesion: 0.09
Nodes (26): RFC-6350, recordPageView(), getPublicCard, PublicCompanyData, PublicEmployee, resolveSlug, GET(), Props (+18 more)

### Community 66 - "page.tsx"
Cohesion: 0.11
Nodes (14): ALL_ROLES, InviteModal(), Props, Props, Props, defaultStart(), NewEventModal(), Props (+6 more)

### Community 67 - "🟡 Testing Results — Medium Severity"
Cohesion: 0.13
Nodes (14): M10. Raw Supabase error messages returned to clients, M11. Settings page: no client-side required-name validation, M12. Design edit modal: color swatch buttons have no aria-labels, M13. Employee overview header "View my card" goes to profile editor, not public card, M14. Employee orders page has no error state distinction, M1. Overview "Active companies" stat counts ALL companies, M2. Admin users "Reactivate user" label is wrong for pending users, M3. Contacts stats "With email"/"This month" are per-page only (+6 more)

### Community 68 - "page.tsx"
Cohesion: 0.22
Nodes (7): getMyOrders(), CompanyOrdersPage(), STATUS_BADGE, STATUS_STEP, OrdersPage(), STATUS_BADGE, STATUS_STEP

### Community 69 - "page.tsx"
Cohesion: 0.13
Nodes (18): EventsContent(), metadata, EventsContent(), metadata, TableSkeleton(), BulkExportButton(), Props, Props (+10 more)

### Community 70 - "card_orders.repo.ts"
Cohesion: 0.25
Nodes (7): createOrder(), deleteOrder(), getAllOrders(), getOrderById(), getOrdersByProfileId(), updateOrderPayment(), updateOrderStatus()

### Community 71 - "Fix pass — 2026-09-26"
Cohesion: 0.29
Nodes (6): Corrections to earlier framing (found while implementing), Fix pass — 2026-09-26, Fixed, New finding (not fixed — deferred), Root cause worth remembering (N2, and the same class as N2's siblings), Still open

### Community 72 - "ImageUpload.tsx"
Cohesion: 0.33
Nodes (6): createCroppedImage(), ICON_SIZES, ImageUpload(), ImageUploadProps, loadImage(), SIZES

### Community 73 - "departments.repo.ts"
Cohesion: 0.29
Nodes (6): createDepartment(), deleteDepartment(), getDepartmentById(), getDepartmentsByCompany(), updateDepartment(), Department

### Community 74 - "resolveCompanyId"
Cohesion: 0.53
Nodes (5): acceptInvitationAction(), createInvitationAction(), getCompanyInvitationsAction(), revokeInvitationAction(), resolveCompanyId()

### Community 76 - "Avatar.tsx"
Cohesion: 0.25
Nodes (8): createCompany(), deleteCompany(), getAllCompanies(), getAllPendingCompanies(), getCompanyById(), getCompanyBySlug(), updateCompany(), updateCompanyStatus()

### Community 79 - "ActionResult"
Cohesion: 0.33
Nodes (4): getOwnCard(), getPublicCard(), ActionResult, CardProfileForm

## Knowledge Gaps
- **389 isolated node(s):** `Props`, `EXPORT_ERROR_STATUS`, `RFC-5987`, `COLUMN_WIDTHS`, `ZipStreamWriter` (+384 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **14 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `getSupabase()` connect `getSupabase` to `cn`, `page.tsx`, `admin.service.ts`, `CardPreview.tsx`, `admin.actions.ts`, `contacts.service.ts`, `index.ts`, `cards.actions.ts`, `orders.service.ts`, `profiles.repo.ts`, `contact_exchanges.repo.ts`, `cards.actions.ts`, `middleware.ts`, `analytics.actions.ts`, `server.ts`, `AuthLayout.tsx`, `PublicCardLayout.tsx`, `card_orders.repo.ts`, `departments.repo.ts`, `resolveCompanyId`, `Avatar.tsx`?**
  _High betweenness centrality (0.077) - this node is a cross-community bridge._
- **Why does `Button()` connect `page.tsx` to `public.actions.ts`, `page.tsx`, `cn`, `page.tsx`, `Input.tsx`, `getServiceSupabase`, `admin.actions.ts`, `Button.tsx`, `page.tsx`, `cards.actions.ts`, `cards.actions.ts`, `Input.tsx`, `AuthLayout.tsx`, `getPublicCard`, `orders.service.ts`, `Modal.tsx`, `InviteModal.tsx`, `card_orders.repo.ts`?**
  _High betweenness centrality (0.039) - this node is a cross-community bridge._
- **Why does `getServiceSupabase` connect `admin.service.ts` to `public.actions.ts`, `BrandLogo.tsx`, `page.tsx`, `getSupabase`, `profiles.repo.ts`, `server.ts`, `card_orders.repo.ts`, `CardPreview.tsx`, `resolveCompanyId`, `admin.actions.ts`, `Avatar.tsx`, `index.ts`, `orders.service.ts`, `Modal.tsx`, `contact_exchanges.repo.ts`, `onboarding.service.ts`, `cards.actions.ts`, `middleware.ts`?**
  _High betweenness centrality (0.035) - this node is a cross-community bridge._
- **What connects `Props`, `EXPORT_ERROR_STATUS`, `RFC-5987` to the rest of the system?**
  _391 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `cn` be split into smaller, more focused modules?**
  _Cohesion score 0.0962566844919786 - nodes in this community are weakly interconnected._
- **Should `page.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.06620209059233449 - nodes in this community are weakly interconnected._
- **Should `getSupabase` be split into smaller, more focused modules?**
  _Cohesion score 0.08780487804878048 - nodes in this community are weakly interconnected._