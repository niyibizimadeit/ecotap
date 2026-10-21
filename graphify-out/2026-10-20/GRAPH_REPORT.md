# Graph Report - ecotap  (2026-10-20)

## Corpus Check
- 192 files · ~149,455 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 1276 nodes · 2749 edges · 73 communities (59 shown, 14 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 9 edges (avg confidence: 0.63)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `a2d23bc1`
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
- BrandLogo.tsx
- page.tsx
- 🟡 Testing Results — Medium Severity
- page.tsx
- page.tsx
- card_orders.repo.ts
- departments.repo.ts
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
9. `getEventCapabilities()` - 21 edges
10. `ActionResult` - 20 edges

## Surprising Connections (you probably didn't know these)
- `OrgRegisterPage()` --calls--> `signUpOrg()`  [EXTRACTED]
  src/app/(auth)/org/register/page.tsx → src/app/actions/auth.actions.ts
- `CompanyOverviewContent()` --calls--> `getCompanyDashboardData`  [EXTRACTED]
  src/app/dashboard/company/page.tsx → src/app/actions/company.actions.ts
- `getAdminEventsAction()` --calls--> `getEventCapabilities()`  [EXTRACTED]
  src/app/actions/events.actions.ts → src/lib/supabase/event-access.ts
- `getLiveEventCountAction()` --calls--> `getEventCapabilities()`  [EXTRACTED]
  src/app/actions/events.actions.ts → src/lib/supabase/event-access.ts
- `acceptInvitationAction()` --calls--> `getSupabase()`  [EXTRACTED]
  src/app/actions/invitations.actions.ts → src/lib/supabase/server.ts

## Import Cycles
- None detected.

## Communities (73 total, 14 thin omitted)

### Community 0 - "cn"
Cohesion: 0.11
Nodes (22): signOut(), AdminDashboardLayout(), buildAdminNav(), CompanySidebar(), NAV, Props, SignOutButton(), EmployeeSidebar() (+14 more)

### Community 1 - "page.tsx"
Cohesion: 0.07
Nodes (30): approveSubscriptionAction(), fetchAllSubscriptionsAdminAction(), getActivePlansAction(), getMySubscriptionAction(), rejectSubscriptionAction(), requireSuperAdmin(), subscribeAction(), uploadSubscriptionScreenshotAction() (+22 more)

### Community 2 - "getSupabase"
Cohesion: 0.09
Nodes (38): assignTestVariant(), createEnvironmentalReport(), getCardScores(), getDailyStats(), getEnvironmentalReports(), getEventCountByType(), getEventsByCardId(), getLatestCardScore() (+30 more)

### Community 3 - "PublicCardLayout.tsx"
Cohesion: 0.14
Nodes (20): AdminEventDetailPage(), metadata, Props, CompanyEventDetailPage(), metadata, Props, DetailContent(), metadata (+12 more)

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
Cohesion: 0.11
Nodes (24): NfcTapPanel(), Props, Avatar(), AvatarProps, SIZE_CLASSES, Badge(), BadgeProps, badgeVariants (+16 more)

### Community 11 - "admin.actions.ts"
Cohesion: 0.05
Nodes (61): AnyActionResult, approveCompany(), approveIndividual(), approveOrder(), createDesign(), deleteCompanyAction(), deleteDesign(), deletePlan() (+53 more)

### Community 13 - "analytics.service.ts"
Cohesion: 0.11
Nodes (6): calcMonthlyImpact(), generateMonthlyReport(), CardEvent, CardScore, EnvironmentalReport, RecordEventPayload

### Community 14 - "page.tsx"
Cohesion: 0.20
Nodes (6): AuthLayout(), AuthLayoutProps, InputProps, PasswordInput, LoginData, loginSchema

### Community 15 - "compilerOptions"
Cohesion: 0.09
Nodes (18): attendeeFromVisit(), closeEvent(), collectExportRows(), decorate(), durationOf(), formatExportTime(), getAdminEventSummaries(), getCompanyEventSummaries() (+10 more)

### Community 16 - "BrandLogo.tsx"
Cohesion: 0.18
Nodes (10): Documentation drift, EcoTap — Project Status, Events — documented behaviours, not defects, Functional, Known issues, Security-relevant — read before exposing this app further, Testing & CI, Type safety (+2 more)

### Community 17 - "contacts.service.ts"
Cohesion: 0.15
Nodes (11): getCurrentProfileId(), getMyInbox(), updateContactExchange(), ContactsClient(), LEAD_LEVELS, Props, SortDir, SortField (+3 more)

### Community 18 - "DashboardShared.tsx"
Cohesion: 0.16
Nodes (20): RFC-5987, GET(), NOTE: this static `export` segment sits alongside the sibling dynamic, attachmentHeader(), EXPORT_ERROR_STATUS, exportError(), exportFilename(), NO_STORE (+12 more)

### Community 19 - "index.ts"
Cohesion: 0.14
Nodes (13): createCard(), deleteCard(), deleteCardGroup(), deleteCardService(), getCardById(), getCardByProfileId(), getCardByProfileIdService(), getCardBySlug() (+5 more)

### Community 20 - "page.tsx"
Cohesion: 0.23
Nodes (12): AdminUser, DASHBOARD_ROUTE, UserFilters, AUTH_PAGES, config, isAccessAllowed(), isPublicPath(), middleware() (+4 more)

### Community 21 - "Input.tsx"
Cohesion: 0.12
Nodes (15): metadata, ADMIN_ROLES, ADMIN_WRITE_ROLES, CARD_ORIGINAL_PRICES, CHECK_IN_METHOD_LABELS, COLORS, COMPANY_SOCIAL_LINKS, ENV (+7 more)

### Community 22 - "page.tsx"
Cohesion: 0.14
Nodes (23): closeEventAction(), createEventAction(), getAdminEventsAction(), getEventVisitsAction(), getLiveEventCountAction(), getMyEventsAction(), getOpenVisitsAction(), goLiveAction() (+15 more)

### Community 23 - "cards.actions.ts"
Cohesion: 0.14
Nodes (9): getMyCard(), AdminQrPage(), BG_COLORS, FG_COLORS, UserMatch, ContactsContent(), PageHeader(), SectionCard() (+1 more)

### Community 24 - "orders.service.ts"
Cohesion: 0.08
Nodes (47): getActiveDesigns(), ALLOWED_TYPES, deleteUpload(), linkPaymentToOrder(), updateCompanyLogo(), updateProfilePhoto(), uploadDesignImage(), uploadPaymentScreenshot() (+39 more)

### Community 25 - "InviteModal.tsx"
Cohesion: 0.19
Nodes (13): checkInTapAction(), Props, Band, BAND_STYLE, ERROR_COPY, EventDoorScreen(), getNfcServerSnapshot(), getNfcSnapshot() (+5 more)

### Community 26 - "profiles.repo.ts"
Cohesion: 0.11
Nodes (18): createProfile(), deleteProfile(), deleteProfileService(), getAllPending(), getAllProfiles(), getPrimaryCompanyInfoService(), getProfileByEmail(), getProfileById() (+10 more)

### Community 27 - "contact_exchanges.repo.ts"
Cohesion: 0.20
Nodes (9): AdminExchangeOptions, createExchange(), deleteExchange(), getAllExchangesAdmin(), getExchangeById(), getExchangesByCardId(), getExchangesByProfileId(), getExchangesCount() (+1 more)

### Community 28 - "billing.repo.ts"
Cohesion: 0.27
Nodes (6): BrandIcon(), BrandIconProps, PublicCardLayoutProps, SaveContactButton(), SaveContactButtonProps, PublicCard

### Community 29 - "CompanySidebar.tsx"
Cohesion: 0.40
Nodes (4): Admin & Company, Demo Accounts, Notes, RDMC Employees

### Community 30 - "cards.actions.ts"
Cohesion: 0.22
Nodes (7): deleteMyAccount(), EMPTY_FORM, EMPTY_GROUP, FormState, GroupEntry, GROUP_SOCIAL_LINKS, SOCIAL_LINKS

### Community 31 - "middleware.ts"
Cohesion: 0.08
Nodes (32): activateEmployeeAction(), CompanyDashboardData, CompanyEmployee, deleteEmployeeAction(), getCompanyDashboardData, suspendEmployeeAction(), UpdateCompanyInput, updateMyCompany() (+24 more)

### Community 32 - "public.actions.ts"
Cohesion: 0.22
Nodes (9): Props, Props, EventListRow, Props, BulkExportPlan, EventSummary, EcoEvent, EcoEventWithHost (+1 more)

### Community 34 - "analytics.actions.ts"
Cohesion: 0.19
Nodes (10): EventsContent(), DoorPage(), metadata, Props, EventsContent(), metadata, NewEventButton(), ANONYMOUS (+2 more)

### Community 35 - "companies.repo.ts"
Cohesion: 0.39
Nodes (6): RFC-6350, GET(), Props, downloadVcf(), foldLine(), generateVcf()

### Community 36 - "EcoTap — Architecture & Coding Conventions"
Cohesion: 0.07
Nodes (29): Analytics & ML, Architecture: SSOT (Single Source of Truth), Authentication, Billing & platform, Cards & orders, Company admin registration rules, Country representative rules, Database tables — complete list (+21 more)

### Community 38 - "Input.tsx"
Cohesion: 0.12
Nodes (13): submitContactExchange(), Design, INITIAL_DESIGNS, PRESET_COLORS, metadata, ContactExchangeForm(), ContactExchangeFormProps, FieldWrapper() (+5 more)

### Community 39 - "middleware.ts"
Cohesion: 0.14
Nodes (17): PendingQueue, ABTestAssignment, AddCompanyForm, Company, CompanyWithRelations, CountryRep, DailyCardStat, EventType (+9 more)

### Community 41 - "EventActions.tsx"
Cohesion: 0.47
Nodes (3): PublicCompanyData, PublicEmployee, Props

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
Cohesion: 0.15
Nodes (14): getCurrentUser(), getSession(), getSupabaseServerAction(), requestPasswordReset(), resendOtp(), resetPassword(), resetPasswordWithOtp(), setNewPassword() (+6 more)

### Community 59 - "PublicCardLayout.tsx"
Cohesion: 0.60
Nodes (3): recordPageView(), PageViewTracker(), PageViewTrackerProps

### Community 60 - "web-nfc.d.ts"
Cohesion: 0.22
Nodes (6): decodeRecord(), NDEFMessageLike, NDEFReader, NDEFReadingEventLike, NDEFRecordLike, Window

### Community 61 - "onboarding.service.ts"
Cohesion: 0.31
Nodes (7): approveCompany(), approveIndividual(), canTransition(), rejectCompany(), rejectUser(), suspendUser(), VALID_TRANSITIONS

### Community 62 - "card_orders.repo.ts"
Cohesion: 0.33
Nodes (3): PendingCompany, PendingIndividual, PendingItem

### Community 63 - "generator.ts"
Cohesion: 0.05
Nodes (41): Areas verified clean, Audit — 2026-09-25, Audit — 2026-09-25 (second sweep: schema, config, dead code), Corrections to earlier framing (found while implementing), Corrections to the B/H/M list above, E10. Smaller consistency findings **[reported]**, E9. `creamDark` drift is worse than a wrong constant — the stale value is hardcoded in 10 files **[verified]**, Environment & consistency findings (+33 more)

### Community 65 - "BrandLogo.tsx"
Cohesion: 0.31
Nodes (9): getPublicCard, resolveSlug, EmployeeCardPage(), generateMetadata(), Props, generateMetadata(), Props, SlugPage() (+1 more)

### Community 66 - "page.tsx"
Cohesion: 0.11
Nodes (14): ALL_ROLES, InviteModal(), Props, Props, Props, defaultStart(), NewEventModal(), Props (+6 more)

### Community 67 - "🟡 Testing Results — Medium Severity"
Cohesion: 0.04
Nodes (46): B10. Employee contacts: "Favorites First" sort is inverted, B11. Failed payment screenshot link is silent, success page lies, B1. Billing "Save changes" creates a DUPLICATE plan instead of updating, B2. Billing "Deactivate/Activate" is purely cosmetic — never persisted, B3. Designs "Save changes" reactivates inactive designs + overwrites pattern, B4. resolveCompanyId used WITHOUT role check — privilege escalation, B5. Service-role writes without ownership verification — 5 endpoints, B6. User enumeration confirmed — 3 vectors (+38 more)

### Community 68 - "page.tsx"
Cohesion: 0.11
Nodes (19): getCurrentProfileId(), getMyOrders(), placeOrder(), CompanyOrdersPage(), STATUS_BADGE, STATUS_STEP, OrdersPage(), STATUS_BADGE (+11 more)

### Community 69 - "page.tsx"
Cohesion: 0.19
Nodes (10): metadata, EventsContent(), metadata, BulkExportButton(), Props, EventList(), isExportable(), Props (+2 more)

### Community 70 - "card_orders.repo.ts"
Cohesion: 0.25
Nodes (7): createOrder(), deleteOrder(), getAllOrders(), getOrderById(), getOrdersByProfileId(), updateOrderPayment(), updateOrderStatus()

### Community 73 - "departments.repo.ts"
Cohesion: 0.29
Nodes (6): createDepartment(), deleteDepartment(), getDepartmentById(), getDepartmentsByCompany(), updateDepartment(), Department

### Community 76 - "Avatar.tsx"
Cohesion: 0.25
Nodes (8): createCompany(), deleteCompany(), getAllCompanies(), getAllPendingCompanies(), getCompanyById(), getCompanyBySlug(), updateCompany(), updateCompanyStatus()

### Community 79 - "ActionResult"
Cohesion: 0.26
Nodes (8): updateMyCard(), getOwnCard(), getPublicCard(), syncCardGroups(), updateCompanySocialLinks(), ActionResult, Card, CardProfileForm

## Knowledge Gaps
- **387 isolated node(s):** `eslintConfig`, `nextConfig`, `name`, `version`, `private` (+382 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **14 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `getSupabase()` connect `getSupabase` to `cn`, `page.tsx`, `admin.service.ts`, `CardPreview.tsx`, `admin.actions.ts`, `contacts.service.ts`, `index.ts`, `cards.actions.ts`, `orders.service.ts`, `profiles.repo.ts`, `contact_exchanges.repo.ts`, `cards.actions.ts`, `middleware.ts`, `analytics.actions.ts`, `server.ts`, `AuthLayout.tsx`, `page.tsx`, `card_orders.repo.ts`, `departments.repo.ts`, `Avatar.tsx`, `ActionResult`?**
  _High betweenness centrality (0.075) - this node is a cross-community bridge._
- **Why does `getServiceSupabase` connect `admin.service.ts` to `page.tsx`, `getSupabase`, `profiles.repo.ts`, `page.tsx`, `server.ts`, `card_orders.repo.ts`, `contact_exchanges.repo.ts`, `EventActions.tsx`, `CardPreview.tsx`, `admin.actions.ts`, `Avatar.tsx`, `ActionResult`, `index.ts`, `orders.service.ts`, `Modal.tsx`, `PublicCardLayout.tsx`, `onboarding.service.ts`, `middleware.ts`?**
  _High betweenness centrality (0.046) - this node is a cross-community bridge._
- **Why does `Button()` connect `page.tsx` to `cn`, `page.tsx`, `page.tsx`, `Input.tsx`, `getServiceSupabase`, `admin.actions.ts`, `Button.tsx`, `page.tsx`, `cards.actions.ts`, `cards.actions.ts`, `Input.tsx`, `AuthLayout.tsx`, `getPublicCard`, `orders.service.ts`, `Modal.tsx`, `InviteModal.tsx`, `card_orders.repo.ts`, `middleware.ts`?**
  _High betweenness centrality (0.040) - this node is a cross-community bridge._
- **What connects `eslintConfig`, `nextConfig`, `name` to the rest of the system?**
  _389 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `cn` be split into smaller, more focused modules?**
  _Cohesion score 0.10752688172043011 - nodes in this community are weakly interconnected._
- **Should `page.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.06620209059233449 - nodes in this community are weakly interconnected._
- **Should `getSupabase` be split into smaller, more focused modules?**
  _Cohesion score 0.08780487804878048 - nodes in this community are weakly interconnected._