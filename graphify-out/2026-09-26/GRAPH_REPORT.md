# Graph Report - ecotap  (2026-09-26)

## Corpus Check
- 191 files · ~147,700 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 1267 nodes · 2735 edges · 79 communities (64 shown, 15 thin omitted)
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

## God Nodes (most connected - your core abstractions)
1. `getSupabase()` - 127 edges
2. `getServiceSupabase` - 95 edges
3. `Button()` - 51 edges
4. `cn()` - 43 edges
5. `PageHeader()` - 28 edges
6. `resolveCompanyId()` - 24 edges
7. `requireSuperAdmin()` - 21 edges
8. `Input` - 21 edges
9. `getEventCapabilities()` - 21 edges
10. `ActionResult` - 20 edges

## Surprising Connections (you probably didn't know these)
- `OrgRegisterPage()` --calls--> `signUpOrg()`  [EXTRACTED]
  src/app/(auth)/org/register/page.tsx → src/app/actions/auth.actions.ts
- `getAdminEventsAction()` --calls--> `getEventCapabilities()`  [EXTRACTED]
  src/app/actions/events.actions.ts → src/lib/supabase/event-access.ts
- `getLiveEventCountAction()` --calls--> `getEventCapabilities()`  [EXTRACTED]
  src/app/actions/events.actions.ts → src/lib/supabase/event-access.ts
- `acceptInvitationAction()` --calls--> `getSupabase()`  [EXTRACTED]
  src/app/actions/invitations.actions.ts → src/lib/supabase/server.ts
- `StepIndicator()` --calls--> `cn()`  [EXTRACTED]
  src/app/dashboard/company/orders/new/page.tsx → src/lib/utils/index.ts

## Import Cycles
- None detected.

## Communities (79 total, 15 thin omitted)

### Community 0 - "cn"
Cohesion: 0.19
Nodes (13): signOut(), AdminDashboardLayout(), buildAdminNav(), CompanySidebar(), NAV, Props, SignOutButton(), EmployeeSidebar() (+5 more)

### Community 1 - "page.tsx"
Cohesion: 0.07
Nodes (28): approveSubscriptionAction(), fetchAllSubscriptionsAdminAction(), getActivePlansAction(), rejectSubscriptionAction(), requireSuperAdmin(), subscribeAction(), verifySubscriptionPaymentAction(), BillingPage() (+20 more)

### Community 2 - "getSupabase"
Cohesion: 0.08
Nodes (39): ContactsContent(), assignTestVariant(), createEnvironmentalReport(), getCardScores(), getDailyStats(), getEnvironmentalReports(), getEventCountByType(), getEventsByCardId() (+31 more)

### Community 3 - "PublicCardLayout.tsx"
Cohesion: 0.18
Nodes (15): AdminEventDetailPage(), metadata, Props, CompanyEventDetailPage(), metadata, Props, DetailContent(), metadata (+7 more)

### Community 4 - "page.tsx"
Cohesion: 0.05
Nodes (38): dependencies, @aws-sdk/client-s3, class-variance-authority, clsx, fflate, @hookform/resolvers, lucide-react, next (+30 more)

### Community 5 - "dependencies"
Cohesion: 0.10
Nodes (19): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+11 more)

### Community 6 - "admin.service.ts"
Cohesion: 0.10
Nodes (32): closeAllOpenVisitsService(), closeVisitService(), countOpenVisitsService(), countVisitsByEventService(), countVisitsByEventsService(), getOpenVisitService(), getOpenVisitsService(), getVisitById() (+24 more)

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
Cohesion: 0.16
Nodes (11): ALL_ROLES, InviteButton(), InviteModal(), Props, Modal(), ModalProps, SIZE_CLASSES, Spinner() (+3 more)

### Community 11 - "admin.actions.ts"
Cohesion: 0.10
Nodes (19): deleteUserAction(), fetchContactExchangesCount(), fetchDesigns(), fetchUserProfile(), toggleUserStatusAction(), updateUserRoleAction(), AdminOverview, deleteOwnAccount() (+11 more)

### Community 13 - "analytics.service.ts"
Cohesion: 0.10
Nodes (8): calcMonthlyImpact(), generateMonthlyReport(), CardEvent, CardScore, DailyCardStat, EnvironmentalReport, ProfileActivity, RecordEventPayload

### Community 14 - "page.tsx"
Cohesion: 0.14
Nodes (8): validateInviteTokenAction(), AuthLayout(), AuthLayoutProps, PasswordInput, IndividualRegisterData, individualRegisterSchema, LoginData, loginSchema

### Community 15 - "compilerOptions"
Cohesion: 0.08
Nodes (21): TapActionResult, attendeeFromVisit(), closeEvent(), collectExportRows(), decorate(), durationOf(), formatExportTime(), getAdminEventSummaries() (+13 more)

### Community 16 - "BrandLogo.tsx"
Cohesion: 0.18
Nodes (10): Documentation drift, EcoTap — Project Status, Events — documented behaviours, not defects, Functional, Known issues, Security-relevant — read before exposing this app further, Testing & CI, Type safety (+2 more)

### Community 17 - "contacts.service.ts"
Cohesion: 0.15
Nodes (11): getCurrentProfileId(), getMyInbox(), updateContactExchange(), ContactsClient(), LEAD_LEVELS, Props, SortDir, SortField (+3 more)

### Community 18 - "DashboardShared.tsx"
Cohesion: 0.22
Nodes (14): RFC-5987, GET(), NOTE: this static `export` segment sits alongside the sibling dynamic, attachmentHeader(), EXPORT_ERROR_STATUS, exportError(), NO_STORE, GET() (+6 more)

### Community 19 - "index.ts"
Cohesion: 0.14
Nodes (13): createCard(), deleteCard(), deleteCardGroup(), deleteCardService(), getCardById(), getCardByProfileId(), getCardByProfileIdService(), getCardBySlug() (+5 more)

### Community 20 - "page.tsx"
Cohesion: 0.23
Nodes (12): AdminUser, DASHBOARD_ROUTE, UserFilters, AUTH_PAGES, config, isAccessAllowed(), isPublicPath(), middleware() (+4 more)

### Community 21 - "Input.tsx"
Cohesion: 0.10
Nodes (18): metadata, ADMIN_ROLES, ADMIN_WRITE_ROLES, CARD_ORIGINAL_PRICES, CHECK_IN_METHOD_LABELS, COLORS, COMPANY_SOCIAL_LINKS, ENV (+10 more)

### Community 22 - "page.tsx"
Cohesion: 0.16
Nodes (20): closeEventAction(), createEventAction(), getAdminEventsAction(), getEventVisitsAction(), getLiveEventCountAction(), getMyEventsAction(), getOpenVisitsAction(), goLiveAction() (+12 more)

### Community 23 - "cards.actions.ts"
Cohesion: 0.26
Nodes (11): Card(), CardContent(), CardDescription(), CardFooter(), CardHeader(), CardProps, CardTitle(), cardVariants (+3 more)

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
Cohesion: 0.13
Nodes (18): activateEmployeeAction(), CompanyDashboardData, CompanyEmployee, deleteEmployeeAction(), suspendEmployeeAction(), UpdateCompanyInput, updateMyCompany(), acceptInvitationAction() (+10 more)

### Community 32 - "public.actions.ts"
Cohesion: 0.11
Nodes (20): RFC-6350, recordPageView(), getPublicCard, PublicCompanyData, PublicEmployee, resolveSlug, GET(), Props (+12 more)

### Community 34 - "analytics.actions.ts"
Cohesion: 0.33
Nodes (6): createCroppedImage(), ICON_SIZES, ImageUpload(), ImageUploadProps, loadImage(), SIZES

### Community 35 - "companies.repo.ts"
Cohesion: 0.18
Nodes (20): AnyActionResult, approveCompany(), approveIndividual(), approveOrder(), createDesign(), deleteCompanyAction(), deleteDesign(), deletePlan() (+12 more)

### Community 36 - "EcoTap — Architecture & Coding Conventions"
Cohesion: 0.07
Nodes (29): Analytics & ML, Architecture: SSOT (Single Source of Truth), Authentication, Billing & platform, Cards & orders, Company admin registration rules, Country representative rules, Database tables — complete list (+21 more)

### Community 38 - "Input.tsx"
Cohesion: 0.09
Nodes (19): submitContactExchange(), Design, INITIAL_DESIGNS, PRESET_COLORS, DEFAULT_FORM, FormState, PRESET_COLORS, metadata (+11 more)

### Community 39 - "middleware.ts"
Cohesion: 0.17
Nodes (11): EVENT_EXPORT_COLUMNS, COLUMN_WIDTHS, AddCompanyForm, CountryRep, EventType, ExportRow, IndividualRegisterForm, InvitationStatus (+3 more)

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
Cohesion: 0.15
Nodes (7): EmployeeOverviewContent(), PageHeader(), PageHeaderProps, StatCard(), StatCardProps, StatCardSkeleton(), TableSkeleton()

### Community 56 - "getPublicCard"
Cohesion: 0.13
Nodes (15): OrgRegisterPage(), Step3Review(), STEPS, COMPANY_SIZES, age, email, fullName, OrgRegisterData (+7 more)

### Community 58 - "Modal.tsx"
Cohesion: 0.20
Nodes (13): getCurrentUser(), getSession(), getSupabaseServerAction(), requestPasswordReset(), resendOtp(), resetPassword(), resetPasswordWithOtp(), setNewPassword() (+5 more)

### Community 59 - "PublicCardLayout.tsx"
Cohesion: 0.33
Nodes (5): PublicCardLayoutProps, SaveContactButton(), SaveContactButtonProps, Card, PublicCard

### Community 60 - "web-nfc.d.ts"
Cohesion: 0.17
Nodes (8): decodeRecord(), NfcTapPanel(), Props, NDEFMessageLike, NDEFReader, NDEFReadingEventLike, NDEFRecordLike, Window

### Community 61 - "onboarding.service.ts"
Cohesion: 0.14
Nodes (15): approveCompany(), approveIndividual(), canTransition(), rejectCompany(), rejectUser(), suspendUser(), VALID_TRANSITIONS, createCompany() (+7 more)

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
Cohesion: 0.17
Nodes (10): BrandIcon(), BrandIconProps, BrandLogo(), BrandLogoProps, ICON_SIZES, TEXT_COLORS, Footer(), FOOTER_LINKS (+2 more)

### Community 66 - "page.tsx"
Cohesion: 0.12
Nodes (13): AdminQrPage(), BG_COLORS, FG_COLORS, UserMatch, Props, Props, NewEventButton(), defaultStart() (+5 more)

### Community 67 - "🟡 Testing Results — Medium Severity"
Cohesion: 0.13
Nodes (14): M10. Raw Supabase error messages returned to clients, M11. Settings page: no client-side required-name validation, M12. Design edit modal: color swatch buttons have no aria-labels, M13. Employee overview header "View my card" goes to profile editor, not public card, M14. Employee orders page has no error state distinction, M1. Overview "Active companies" stat counts ALL companies, M2. Admin users "Reactivate user" label is wrong for pending users, M3. Contacts stats "With email"/"This month" are per-page only (+6 more)

### Community 68 - "page.tsx"
Cohesion: 0.15
Nodes (13): getMyOrders(), CompanyOrdersPage(), STATUS_BADGE, STATUS_STEP, OrdersPage(), STATUS_BADGE, STATUS_STEP, SectionCard() (+5 more)

### Community 69 - "page.tsx"
Cohesion: 0.14
Nodes (15): EventsContent(), metadata, EventsContent(), metadata, EventsContent(), metadata, BulkExportButton(), Props (+7 more)

### Community 70 - "EmptyState"
Cohesion: 0.19
Nodes (7): getCompanyDashboardData, EmployeesContent(), CompanyDashboardLayout(), CompanyOverviewContent(), CompanySettingsPage(), SubscriptionContent(), EmptyState()

### Community 71 - "requireAdminAccess"
Cohesion: 0.15
Nodes (13): fetchAllContactExchanges(), fetchPendingQueue(), fetchPlans(), fetchUserCardUrl(), fetchUsers(), lookupUserForQR(), requireAdminAccess(), getAllContactExchangesAdmin() (+5 more)

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
Cohesion: 0.40
Nodes (5): PublicCardLayout(), Avatar(), AvatarProps, SIZE_CLASSES, getInitials()

### Community 77 - "Profile"
Cohesion: 0.33
Nodes (6): PendingQueue, Company, CompanyWithRelations, Profile, ProfileFull, ProfileWithCompanies

## Knowledge Gaps
- **382 isolated node(s):** `eslintConfig`, `nextConfig`, `name`, `version`, `private` (+377 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **15 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `getSupabase()` connect `getSupabase` to `cn`, `page.tsx`, `admin.service.ts`, `CardPreview.tsx`, `admin.actions.ts`, `contacts.service.ts`, `index.ts`, `orders.service.ts`, `profiles.repo.ts`, `contact_exchanges.repo.ts`, `billing.repo.ts`, `cards.actions.ts`, `middleware.ts`, `companies.repo.ts`, `server.ts`, `AuthLayout.tsx`, `onboarding.service.ts`, `page.tsx`, `requireAdminAccess`?**
  _High betweenness centrality (0.070) - this node is a cross-community bridge._
- **Why does `getServiceSupabase` connect `admin.service.ts` to `public.actions.ts`, `page.tsx`, `getSupabase`, `companies.repo.ts`, `profiles.repo.ts`, `server.ts`, `CardPreview.tsx`, `admin.actions.ts`, `index.ts`, `orders.service.ts`, `Modal.tsx`, `contact_exchanges.repo.ts`, `billing.repo.ts`, `onboarding.service.ts`, `cards.actions.ts`, `middleware.ts`?**
  _High betweenness centrality (0.054) - this node is a cross-community bridge._
- **Why does `Button()` connect `page.tsx` to `page.tsx`, `getServiceSupabase`, `Button.tsx`, `page.tsx`, `Input.tsx`, `page.tsx`, `cards.actions.ts`, `orders.service.ts`, `InviteModal.tsx`, `cards.actions.ts`, `Input.tsx`, `AuthLayout.tsx`, `getPublicCard`, `Modal.tsx`, `web-nfc.d.ts`, `card_orders.repo.ts`, `BrandLogo.tsx`, `page.tsx`, `EmptyState`, `page.tsx`, `VerifyResetForm.tsx`?**
  _High betweenness centrality (0.038) - this node is a cross-community bridge._
- **What connects `eslintConfig`, `nextConfig`, `name` to the rest of the system?**
  _384 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `page.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.07051282051282051 - nodes in this community are weakly interconnected._
- **Should `getSupabase` be split into smaller, more focused modules?**
  _Cohesion score 0.08416389811738649 - nodes in this community are weakly interconnected._
- **Should `page.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.05128205128205128 - nodes in this community are weakly interconnected._