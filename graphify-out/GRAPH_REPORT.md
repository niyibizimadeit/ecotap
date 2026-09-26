# Graph Report - ecotap  (2026-09-26)

## Corpus Check
- 191 files · ~148,662 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 1273 nodes · 2630 edges · 84 communities (68 shown, 16 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 9 edges (avg confidence: 0.63)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `797fedac`
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
- ActionResult
- invitations.repo.ts
- Fix pass — 2026-09-26
- deleteProfileCascade

## God Nodes (most connected - your core abstractions)
1. `getSupabase()` - 96 edges
2. `getServiceSupabase` - 77 edges
3. `Button()` - 51 edges
4. `cn()` - 43 edges
5. `PageHeader()` - 28 edges
6. `requireSuperAdmin()` - 21 edges
7. `Input` - 21 edges
8. `getEventCapabilities()` - 21 edges
9. `Audit — 2026-09-25` - 18 edges
10. `EmptyState()` - 18 edges

## Surprising Connections (you probably didn't know these)
- `CompanyOverviewContent()` --calls--> `getCompanyDashboardData`  [EXTRACTED]
  src/app/dashboard/company/page.tsx → src/app/actions/company.actions.ts
- `OrgRegisterPage()` --calls--> `signUpOrg()`  [EXTRACTED]
  src/app/(auth)/org/register/page.tsx → src/app/actions/auth.actions.ts
- `getAdminEventsAction()` --calls--> `getEventCapabilities()`  [EXTRACTED]
  src/app/actions/events.actions.ts → src/lib/supabase/event-access.ts
- `getLiveEventCountAction()` --calls--> `getEventCapabilities()`  [EXTRACTED]
  src/app/actions/events.actions.ts → src/lib/supabase/event-access.ts
- `acceptInvitationAction()` --calls--> `getSupabase()`  [EXTRACTED]
  src/app/actions/invitations.actions.ts → src/lib/supabase/server.ts

## Import Cycles
- None detected.

## Communities (84 total, 16 thin omitted)

### Community 0 - "cn"
Cohesion: 0.05
Nodes (52): signOut(), AdminDashboardLayout(), buildAdminNav(), CompanySidebar(), NAV, Props, SignOutButton(), EmployeeSidebar() (+44 more)

### Community 1 - "page.tsx"
Cohesion: 0.17
Nodes (3): getAdminOverview(), SubscribeInput, SubscriptionEnriched

### Community 2 - "getSupabase"
Cohesion: 0.10
Nodes (32): ContactsContent(), assignTestVariant(), createEnvironmentalReport(), getCardScores(), getDailyStats(), getEnvironmentalReports(), getEventCountByType(), getEventsByCardId() (+24 more)

### Community 3 - "PublicCardLayout.tsx"
Cohesion: 0.16
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
Cohesion: 0.14
Nodes (16): acceptInvitationAction(), createInvitationAction(), getCompanyInvitationsAction(), revokeInvitationAction(), validateInviteTokenAction(), InviteButton(), InviteModal(), Props (+8 more)

### Community 10 - "getServiceSupabase"
Cohesion: 0.47
Nodes (4): AdminUser, ALL_ROLES, UserRole, UserStatus

### Community 11 - "admin.actions.ts"
Cohesion: 0.09
Nodes (29): deleteCompanyAction(), fetchAllContactExchanges(), fetchContactExchangesCount(), fetchDesigns(), fetchPendingQueue(), fetchPlans(), fetchUserCardUrl(), fetchUserProfile() (+21 more)

### Community 13 - "analytics.service.ts"
Cohesion: 0.10
Nodes (8): calcMonthlyImpact(), generateMonthlyReport(), CardEvent, CardScore, DailyCardStat, EnvironmentalReport, ProfileActivity, RecordEventPayload

### Community 14 - "page.tsx"
Cohesion: 0.22
Nodes (5): AuthLayout(), AuthLayoutProps, PasswordInput, LoginData, loginSchema

### Community 15 - "compilerOptions"
Cohesion: 0.08
Nodes (22): TapActionResult, attendeeFromVisit(), closeEvent(), collectExportRows(), decorate(), durationOf(), formatExportTime(), getAdminEventSummaries() (+14 more)

### Community 16 - "BrandLogo.tsx"
Cohesion: 0.18
Nodes (10): Documentation drift, EcoTap — Project Status, Events — documented behaviours, not defects, Functional, Known issues, Security-relevant — read before exposing this app further, Testing & CI, Type safety (+2 more)

### Community 17 - "contacts.service.ts"
Cohesion: 0.17
Nodes (8): getCurrentProfileId(), getMyInbox(), submitContactExchange(), updateContactExchange(), Props, ContactExchange, ContactExchangeWithOwner, DeviceType

### Community 18 - "DashboardShared.tsx"
Cohesion: 0.17
Nodes (17): RFC-5987, GET(), NOTE: this static `export` segment sits alongside the sibling dynamic, attachmentHeader(), EXPORT_ERROR_STATUS, exportError(), NO_STORE, GET() (+9 more)

### Community 19 - "index.ts"
Cohesion: 0.13
Nodes (14): createCard(), deleteCard(), deleteCardGroup(), deleteCardService(), getCardById(), getCardByProfileId(), getCardByProfileIdService(), getCardBySlug() (+6 more)

### Community 20 - "page.tsx"
Cohesion: 0.33
Nodes (8): DASHBOARD_ROUTE, AUTH_PAGES, config, isAccessAllowed(), isPublicPath(), middleware(), PUBLIC_CARD_PATTERNS, NOTE: This file must be at src/middleware.ts for Next.js to execute it.

### Community 21 - "Input.tsx"
Cohesion: 0.10
Nodes (18): metadata, ADMIN_ROLES, ADMIN_WRITE_ROLES, CARD_ORIGINAL_PRICES, CHECK_IN_METHOD_LABELS, COLORS, COMPANY_SOCIAL_LINKS, ENV (+10 more)

### Community 22 - "page.tsx"
Cohesion: 0.16
Nodes (20): closeEventAction(), createEventAction(), getAdminEventsAction(), getEventVisitsAction(), getLiveEventCountAction(), getMyEventsAction(), getOpenVisitsAction(), goLiveAction() (+12 more)

### Community 23 - "cards.actions.ts"
Cohesion: 0.18
Nodes (7): ContactsClient(), LEAD_LEVELS, SortDir, SortField, EventsContent(), metadata, TableSkeleton()

### Community 24 - "orders.service.ts"
Cohesion: 0.05
Nodes (60): getActiveDesigns(), getCurrentProfileId(), placeOrder(), ALLOWED_TYPES, deleteUpload(), linkPaymentToOrder(), updateCompanyLogo(), updateProfilePhoto() (+52 more)

### Community 25 - "InviteModal.tsx"
Cohesion: 0.13
Nodes (18): checkInTapAction(), DoorPage(), metadata, Props, ConfirmExitPrompt(), Props, Band, BAND_STYLE (+10 more)

### Community 26 - "profiles.repo.ts"
Cohesion: 0.11
Nodes (18): createProfile(), deleteProfile(), deleteProfileService(), getAllPending(), getAllProfiles(), getPrimaryCompanyInfoService(), getProfileByEmail(), getProfileById() (+10 more)

### Community 27 - "contact_exchanges.repo.ts"
Cohesion: 0.20
Nodes (9): AdminExchangeOptions, createExchange(), deleteExchange(), getAllExchangesAdmin(), getExchangeById(), getExchangesByCardId(), getExchangesByProfileId(), getExchangesCount() (+1 more)

### Community 29 - "CompanySidebar.tsx"
Cohesion: 0.40
Nodes (4): Admin & Company, Demo Accounts, Notes, RDMC Employees

### Community 30 - "cards.actions.ts"
Cohesion: 0.21
Nodes (10): deleteMyAccount(), getMyCard(), updateMyCard(), EMPTY_FORM, EMPTY_GROUP, FormState, GroupEntry, GROUP_SOCIAL_LINKS (+2 more)

### Community 31 - "middleware.ts"
Cohesion: 0.11
Nodes (20): activateEmployeeAction(), CompanyDashboardData, CompanyEmployee, deleteEmployeeAction(), getCompanyDashboardData, suspendEmployeeAction(), UpdateCompanyInput, updateMyCompany() (+12 more)

### Community 32 - "public.actions.ts"
Cohesion: 0.29
Nodes (7): PublicCompanyData, PublicEmployee, resolveSlug, Props, generateMetadata(), Props, SlugPage()

### Community 34 - "analytics.actions.ts"
Cohesion: 0.25
Nodes (10): approveSubscriptionAction(), fetchAllSubscriptionsAdminAction(), getMySubscriptionAction(), rejectSubscriptionAction(), requireSuperAdmin(), subscribeAction(), uploadSubscriptionScreenshotAction(), verifySubscriptionPaymentAction() (+2 more)

### Community 35 - "companies.repo.ts"
Cohesion: 0.20
Nodes (18): AnyActionResult, approveCompany(), approveIndividual(), approveOrder(), createDesign(), deleteDesign(), deletePlan(), markOrderDelivered() (+10 more)

### Community 36 - "EcoTap — Architecture & Coding Conventions"
Cohesion: 0.07
Nodes (29): Analytics & ML, Architecture: SSOT (Single Source of Truth), Authentication, Billing & platform, Cards & orders, Company admin registration rules, Country representative rules, Database tables — complete list (+21 more)

### Community 38 - "Input.tsx"
Cohesion: 0.10
Nodes (15): Design, INITIAL_DESIGNS, PRESET_COLORS, AdminQrPage(), BG_COLORS, FG_COLORS, UserMatch, metadata (+7 more)

### Community 39 - "middleware.ts"
Cohesion: 0.14
Nodes (16): ABTestAssignment, AddCompanyForm, Company, CompanyWithRelations, CountryRep, EventType, IndividualRegisterForm, InvitationStatus (+8 more)

### Community 41 - "EventActions.tsx"
Cohesion: 0.22
Nodes (9): Props, Props, EventListRow, Props, BulkExportPlan, EventSummary, EcoEvent, EcoEventWithHost (+1 more)

### Community 53 - "CardPreview.tsx"
Cohesion: 0.26
Nodes (10): CardPreview(), CardPreviewProps, GroupPreviewEntry, SOCIAL_LABELS, SOCIAL_CONFIG, SocialIconRow(), SocialIconsProps, contrastColor() (+2 more)

### Community 54 - "EcoTap (production)"
Cohesion: 0.13
Nodes (14): Database, Deployment, Documentation map, EcoTap (production), Environment variables, Getting started, Project structure, Seeding demo accounts (+6 more)

### Community 55 - "AuthLayout.tsx"
Cohesion: 0.16
Nodes (7): CompanyOverviewContent(), EmployeeOverviewContent(), PageHeader(), PageHeaderProps, StatCard(), StatCardProps, StatCardSkeleton()

### Community 56 - "getPublicCard"
Cohesion: 0.10
Nodes (18): OrgRegisterPage(), Step3Review(), STEPS, Select, COMPANY_SIZES, age, email, fullName (+10 more)

### Community 58 - "Modal.tsx"
Cohesion: 0.20
Nodes (13): getCurrentUser(), getSession(), getSupabaseServerAction(), requestPasswordReset(), resendOtp(), resetPassword(), resetPasswordWithOtp(), setNewPassword() (+5 more)

### Community 59 - "PublicCardLayout.tsx"
Cohesion: 0.29
Nodes (6): ContactExchangeForm(), PublicCardLayout(), PublicCardLayoutProps, SaveContactButton(), SaveContactButtonProps, PublicCard

### Community 60 - "web-nfc.d.ts"
Cohesion: 0.17
Nodes (8): decodeRecord(), NfcTapPanel(), Props, NDEFMessageLike, NDEFReader, NDEFReadingEventLike, NDEFRecordLike, Window

### Community 61 - "onboarding.service.ts"
Cohesion: 0.31
Nodes (7): approveCompany(), approveIndividual(), canTransition(), rejectCompany(), rejectUser(), suspendUser(), VALID_TRANSITIONS

### Community 62 - "card_orders.repo.ts"
Cohesion: 0.33
Nodes (3): PendingCompany, PendingIndividual, PendingItem

### Community 63 - "generator.ts"
Cohesion: 0.11
Nodes (18): Audit — 2026-09-25, Corrections to the B/H/M list above, Environment & consistency findings, N10. Deleting a host destroys other people's attendance records — MEDIUM **[verified]**, N11. `updateMyCard` commits partial writes and can destroy card groups — MEDIUM **[reported]**, N12. `recordPageView` is an unauthenticated, unvalidated service-role write — MEDIUM **[verified]**, N13. `deleteExchange` always reports success and never deletes — LOW **[reported]**, N14. Self-delete has no last-super-admin guard — LOW **[reported]** (+10 more)

### Community 64 - "Audit — 2026-09-25 (second sweep: schema, config, dead code)"
Cohesion: 0.12
Nodes (17): Areas verified clean, Audit — 2026-09-25 (second sweep: schema, config, dead code), E10. Smaller consistency findings **[reported]**, E9. `creamDark` drift is worse than a wrong constant — the stale value is hardcoded in 10 files **[verified]**, N15. A fresh install cannot apply migration 022 — the documented setup path is broken — CRITICAL **[verified]**, N16. `FULL_SCHEMA.sql` omits all four of migration 012's contact-enrichment columns — HIGH **[reported]**, N17. `FULL_SCHEMA.sql` omits migration 014 — the RLS policy it exists to add — HIGH **[reported]**, N18. `FULL_SCHEMA.sql` omits migration 015's objects — LOW **[reported]** (+9 more)

### Community 65 - "BrandLogo.tsx"
Cohesion: 0.31
Nodes (7): recordPageView(), getPublicCard, EmployeeCardPage(), generateMetadata(), Props, PageViewTracker(), PageViewTrackerProps

### Community 66 - "page.tsx"
Cohesion: 0.15
Nodes (9): Props, Props, NewEventButton(), defaultStart(), NewEventModal(), Props, Button(), ButtonProps (+1 more)

### Community 67 - "🟡 Testing Results — Medium Severity"
Cohesion: 0.13
Nodes (14): M10. Raw Supabase error messages returned to clients, M11. Settings page: no client-side required-name validation, M12. Design edit modal: color swatch buttons have no aria-labels, M13. Employee overview header "View my card" goes to profile editor, not public card, M14. Employee orders page has no error state distinction, M1. Overview "Active companies" stat counts ALL companies, M2. Admin users "Reactivate user" label is wrong for pending users, M3. Contacts stats "With email"/"This month" are per-page only (+6 more)

### Community 68 - "page.tsx"
Cohesion: 0.16
Nodes (13): getMyOrders(), CompanyOrdersPage(), STATUS_BADGE, STATUS_STEP, OrdersPage(), STATUS_BADGE, STATUS_STEP, EmptyState() (+5 more)

### Community 69 - "page.tsx"
Cohesion: 0.18
Nodes (11): EventsContent(), metadata, EventsContent(), metadata, BulkExportButton(), Props, EventList(), isExportable() (+3 more)

### Community 70 - "EmptyState"
Cohesion: 0.22
Nodes (8): getActivePlansAction(), Currency, NewSubscriptionPage(), Step, StepIndicator(), STEPS, SubscriptionForm, MOMO_PAY

### Community 71 - "requireAdminAccess"
Cohesion: 0.28
Nodes (8): BillingPage(), INITIAL_PLANS, PAYMENT_COLORS, PAYMENT_LABELS, Plan, PLAN_FEATURES, SubInfo, BillingCycle

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
Cohesion: 0.22
Nodes (9): EcoTap — Fixes & Testing Report, ✅ Fixes Applied (from previous review), Immediate (this session), Medium-term, 🆕 New Features Added, Priority Fix Queue, Short-term, SQL Migration Applied (+1 more)

### Community 77 - "Profile"
Cohesion: 0.39
Nodes (6): RFC-6350, GET(), Props, downloadVcf(), foldLine(), generateVcf()

### Community 79 - "ActionResult"
Cohesion: 0.29
Nodes (5): getOwnCard(), getPublicCard(), ActionResult, Card, CardProfileForm

### Community 80 - "invitations.repo.ts"
Cohesion: 0.25
Nodes (7): acceptInvitation(), createInvitation(), deleteInvitation(), getInvitationByToken(), getInvitationsByCompany(), getPendingInvitationsByCompany(), revokeInvitation()

### Community 81 - "Fix pass — 2026-09-26"
Cohesion: 0.29
Nodes (6): Corrections to earlier framing (found while implementing), Fix pass — 2026-09-26, Fixed, New finding (not fixed — deferred), Root cause worth remembering (N2, and the same class as N2's siblings), Still open

### Community 83 - "deleteProfileCascade"
Cohesion: 0.33
Nodes (6): deleteUserAction(), deleteOwnAccount(), deleteProfileCascade(), deleteUser(), getUserById(), deleteCompanyCascade()

## Knowledge Gaps
- **392 isolated node(s):** `✅ Fixes Applied (from previous review)`, `🆕 New Features Added`, `B1. Billing "Save changes" creates a DUPLICATE plan instead of updating`, `B2. Billing "Deactivate/Activate" is purely cosmetic — never persisted`, `B3. Designs "Save changes" reactivates inactive designs + overwrites pattern` (+387 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **16 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `getSupabase()` connect `getSupabase` to `cn`, `analytics.actions.ts`, `companies.repo.ts`, `PublicCardLayout.tsx`, `server.ts`, `admin.service.ts`, `CardPreview.tsx`, `admin.actions.ts`, `invitations.repo.ts`, `contacts.service.ts`, `deleteProfileCascade`, `index.ts`, `AuthLayout.tsx`, `cards.actions.ts`, `orders.service.ts`, `profiles.repo.ts`, `contact_exchanges.repo.ts`?**
  _High betweenness centrality (0.058) - this node is a cross-community bridge._
- **Why does `Button()` connect `page.tsx` to `cn`, `CardPreview.tsx`, `getServiceSupabase`, `Button.tsx`, `page.tsx`, `Input.tsx`, `page.tsx`, `orders.service.ts`, `InviteModal.tsx`, `cards.actions.ts`, `middleware.ts`, `Input.tsx`, `AuthLayout.tsx`, `getPublicCard`, `Modal.tsx`, `web-nfc.d.ts`, `card_orders.repo.ts`, `page.tsx`, `EmptyState`, `requireAdminAccess`, `page.tsx`, `VerifyResetForm.tsx`?**
  _High betweenness centrality (0.035) - this node is a cross-community bridge._
- **Why does `getServiceSupabase` connect `admin.service.ts` to `public.actions.ts`, `BrandLogo.tsx`, `analytics.actions.ts`, `companies.repo.ts`, `getSupabase`, `profiles.repo.ts`, `server.ts`, `CardPreview.tsx`, `invitations.repo.ts`, `index.ts`, `orders.service.ts`, `Modal.tsx`, `contact_exchanges.repo.ts`, `onboarding.service.ts`?**
  _High betweenness centrality (0.026) - this node is a cross-community bridge._
- **What connects `✅ Fixes Applied (from previous review)`, `🆕 New Features Added`, `B1. Billing "Save changes" creates a DUPLICATE plan instead of updating` to the rest of the system?**
  _394 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `cn` be split into smaller, more focused modules?**
  _Cohesion score 0.053313587560162905 - nodes in this community are weakly interconnected._
- **Should `getSupabase` be split into smaller, more focused modules?**
  _Cohesion score 0.10420168067226891 - nodes in this community are weakly interconnected._
- **Should `page.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.05128205128205128 - nodes in this community are weakly interconnected._