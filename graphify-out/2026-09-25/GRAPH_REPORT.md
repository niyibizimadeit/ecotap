# Graph Report - ecotap  (2026-09-24)

## Corpus Check
- 191 files · ~141,336 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 1230 nodes · 2701 edges · 67 communities (53 shown, 14 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 9 edges (avg confidence: 0.63)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `71b24e32`
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
- page.tsx
- page.tsx
- page.tsx

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
- `getAdminEventsAction()` --calls--> `getEventCapabilities()`  [EXTRACTED]
  src/app/actions/events.actions.ts → src/lib/supabase/event-access.ts
- `getLiveEventCountAction()` --calls--> `getEventCapabilities()`  [EXTRACTED]
  src/app/actions/events.actions.ts → src/lib/supabase/event-access.ts
- `acceptInvitationAction()` --calls--> `getSupabase()`  [EXTRACTED]
  src/app/actions/invitations.actions.ts → src/lib/supabase/server.ts
- `getMySubscriptionAction()` --calls--> `resolveCompanyId()`  [EXTRACTED]
  src/app/actions/subscription.actions.ts → src/lib/supabase/server.ts
- `StepIndicator()` --calls--> `cn()`  [EXTRACTED]
  src/app/dashboard/company/orders/new/page.tsx → src/lib/utils/index.ts

## Import Cycles
- None detected.

## Communities (67 total, 14 thin omitted)

### Community 0 - "cn"
Cohesion: 0.10
Nodes (24): signOut(), AdminDashboardLayout(), buildAdminNav(), CompanySidebar(), NAV, Props, SignOutButton(), EmployeeSidebar() (+16 more)

### Community 1 - "page.tsx"
Cohesion: 0.07
Nodes (30): approveSubscriptionAction(), fetchAllSubscriptionsAdminAction(), getActivePlansAction(), getMySubscriptionAction(), rejectSubscriptionAction(), requireSuperAdmin(), subscribeAction(), uploadSubscriptionScreenshotAction() (+22 more)

### Community 2 - "getSupabase"
Cohesion: 0.08
Nodes (39): ContactsContent(), assignTestVariant(), createEnvironmentalReport(), getCardScores(), getDailyStats(), getEnvironmentalReports(), getEventCountByType(), getEventsByCardId() (+31 more)

### Community 3 - "PublicCardLayout.tsx"
Cohesion: 0.04
Nodes (46): B10. Employee contacts: "Favorites First" sort is inverted, B11. Failed payment screenshot link is silent, success page lies, B1. Billing "Save changes" creates a DUPLICATE plan instead of updating, B2. Billing "Deactivate/Activate" is purely cosmetic — never persisted, B3. Designs "Save changes" reactivates inactive designs + overwrites pattern, B4. resolveCompanyId used WITHOUT role check — privilege escalation, B5. Service-role writes without ownership verification — 5 endpoints, B6. User enumeration confirmed — 3 vectors (+38 more)

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
Cohesion: 0.10
Nodes (22): acceptInvitationAction(), createInvitationAction(), getCompanyInvitationsAction(), revokeInvitationAction(), InviteButton(), InviteModal(), Props, acceptInvite() (+14 more)

### Community 10 - "getServiceSupabase"
Cohesion: 0.14
Nodes (13): createCard(), deleteCard(), deleteCardGroup(), deleteCardService(), getCardById(), getCardByProfileId(), getCardByProfileIdService(), getCardBySlug() (+5 more)

### Community 11 - "admin.actions.ts"
Cohesion: 0.06
Nodes (60): AnyActionResult, approveCompany(), approveIndividual(), approveOrder(), createDesign(), deleteCompanyAction(), deleteDesign(), deletePlan() (+52 more)

### Community 13 - "analytics.service.ts"
Cohesion: 0.10
Nodes (7): calcMonthlyImpact(), ENV, generateMonthlyReport(), CardEvent, CardScore, DailyCardStat, EnvironmentalReport

### Community 14 - "page.tsx"
Cohesion: 0.06
Nodes (39): getCurrentUser(), getSession(), getSupabaseServerAction(), requestPasswordReset(), resendOtp(), resetPassword(), resetPasswordWithOtp(), setNewPassword() (+31 more)

### Community 15 - "compilerOptions"
Cohesion: 0.10
Nodes (19): attendeeFromVisit(), closeEvent(), collectExportRows(), decorate(), durationOf(), formatExportTime(), getAdminEventSummaries(), getCompanyEventSummaries() (+11 more)

### Community 16 - "BrandLogo.tsx"
Cohesion: 0.18
Nodes (10): Documentation drift, EcoTap — Project Status, Events — documented behaviours, not defects, Functional, Known issues, Security-relevant — read before exposing this app further, Testing & CI, Type safety (+2 more)

### Community 17 - "contacts.service.ts"
Cohesion: 0.23
Nodes (5): getCurrentProfileId(), getMyInbox(), updateContactExchange(), ActionResult, DeviceType

### Community 18 - "DashboardShared.tsx"
Cohesion: 0.17
Nodes (17): RFC-5987, GET(), NOTE: this static `export` segment sits alongside the sibling dynamic, attachmentHeader(), EXPORT_ERROR_STATUS, exportError(), NO_STORE, GET() (+9 more)

### Community 19 - "index.ts"
Cohesion: 0.14
Nodes (17): PendingQueue, ABTestAssignment, AddCompanyForm, Company, CompanyWithRelations, CountryRep, EventType, IndividualRegisterForm (+9 more)

### Community 20 - "page.tsx"
Cohesion: 0.24
Nodes (6): ALL_ROLES, NfcTapPanel(), Props, Spinner(), SPINNER_SIZES, SpinnerProps

### Community 21 - "Input.tsx"
Cohesion: 0.11
Nodes (17): metadata, ADMIN_ROLES, ADMIN_WRITE_ROLES, CARD_ORIGINAL_PRICES, CHECK_IN_METHOD_LABELS, COLORS, COMPANY_SOCIAL_LINKS, EVENT_STATUS_LABELS (+9 more)

### Community 22 - "page.tsx"
Cohesion: 0.15
Nodes (20): checkInTapAction(), createEventAction(), getAdminEventsAction(), getEventVisitsAction(), getLiveEventCountAction(), getMyEventsAction(), getOpenVisitsAction(), recordManualExitAction() (+12 more)

### Community 23 - "cards.actions.ts"
Cohesion: 0.20
Nodes (14): Avatar(), AvatarProps, SIZE_CLASSES, Card(), CardContent(), CardDescription(), CardFooter(), CardHeader() (+6 more)

### Community 24 - "orders.service.ts"
Cohesion: 0.08
Nodes (47): getActiveDesigns(), ALLOWED_TYPES, deleteUpload(), linkPaymentToOrder(), updateCompanyLogo(), updateProfilePhoto(), uploadDesignImage(), uploadPaymentScreenshot() (+39 more)

### Community 25 - "InviteModal.tsx"
Cohesion: 0.15
Nodes (17): ConfirmExitPrompt(), Props, Band, BAND_STYLE, BandContent(), ERROR_COPY, EventDoorScreen(), getNfcServerSnapshot() (+9 more)

### Community 26 - "profiles.repo.ts"
Cohesion: 0.12
Nodes (17): createProfile(), deleteProfile(), deleteProfileService(), getAllPending(), getAllProfiles(), getPrimaryCompanyInfoService(), getProfileByEmail(), getProfileById() (+9 more)

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
Cohesion: 0.18
Nodes (11): activateEmployeeAction(), CompanyDashboardData, CompanyEmployee, deleteEmployeeAction(), suspendEmployeeAction(), UpdateCompanyInput, updateMyCompany(), DeleteEmployeeButton() (+3 more)

### Community 32 - "public.actions.ts"
Cohesion: 0.29
Nodes (7): PublicCompanyData, PublicEmployee, resolveSlug, Props, generateMetadata(), Props, SlugPage()

### Community 34 - "analytics.actions.ts"
Cohesion: 0.20
Nodes (10): DEFAULT_FORM, FormState, PRESET_COLORS, createCroppedImage(), ICON_SIZES, ImageUpload(), ImageUploadProps, loadImage() (+2 more)

### Community 35 - "companies.repo.ts"
Cohesion: 0.22
Nodes (9): createCompany(), deleteCompany(), deleteCompanyCascade(), getAllCompanies(), getAllPendingCompanies(), getCompanyById(), getCompanyBySlug(), updateCompany() (+1 more)

### Community 36 - "EcoTap — Architecture & Coding Conventions"
Cohesion: 0.07
Nodes (29): Analytics & ML, Architecture: SSOT (Single Source of Truth), Authentication, Billing & platform, Cards & orders, Company admin registration rules, Country representative rules, Database tables — complete list (+21 more)

### Community 38 - "Input.tsx"
Cohesion: 0.13
Nodes (14): submitContactExchange(), AdminQrPage(), BG_COLORS, FG_COLORS, UserMatch, metadata, ContactExchangeForm(), ContactExchangeFormProps (+6 more)

### Community 39 - "middleware.ts"
Cohesion: 0.23
Nodes (12): AdminUser, DASHBOARD_ROUTE, UserFilters, AUTH_PAGES, config, isAccessAllowed(), isPublicPath(), middleware() (+4 more)

### Community 41 - "EventActions.tsx"
Cohesion: 0.23
Nodes (10): closeEventAction(), goLiveAction(), revalidateEvents(), EventActions(), Props, EventListRow, BulkExportPlan, EventSummary (+2 more)

### Community 53 - "CardPreview.tsx"
Cohesion: 0.26
Nodes (10): CardPreview(), CardPreviewProps, GroupPreviewEntry, SOCIAL_LABELS, SOCIAL_CONFIG, SocialIconRow(), SocialIconsProps, contrastColor() (+2 more)

### Community 54 - "EcoTap (production)"
Cohesion: 0.13
Nodes (14): Database, Deployment, Documentation map, EcoTap (production), Environment variables, Getting started, Project structure, Seeding demo accounts (+6 more)

### Community 55 - "AuthLayout.tsx"
Cohesion: 0.32
Nodes (7): ContactsClient(), LEAD_LEVELS, Props, SortDir, SortField, ContactExchange, ContactExchangeWithOwner

### Community 56 - "getPublicCard"
Cohesion: 0.31
Nodes (7): recordPageView(), getPublicCard, EmployeeCardPage(), generateMetadata(), Props, PageViewTracker(), PageViewTrackerProps

### Community 58 - "Modal.tsx"
Cohesion: 0.22
Nodes (6): Design, INITIAL_DESIGNS, PRESET_COLORS, Modal(), ModalProps, SIZE_CLASSES

### Community 59 - "PublicCardLayout.tsx"
Cohesion: 0.31
Nodes (6): PublicCardLayout(), PublicCardLayoutProps, SaveContactButton(), SaveContactButtonProps, getInitials(), PublicCard

### Community 60 - "web-nfc.d.ts"
Cohesion: 0.22
Nodes (6): decodeRecord(), NDEFMessageLike, NDEFReader, NDEFReadingEventLike, NDEFRecordLike, Window

### Community 61 - "onboarding.service.ts"
Cohesion: 0.31
Nodes (7): approveCompany(), approveIndividual(), canTransition(), rejectCompany(), rejectUser(), suspendUser(), VALID_TRANSITIONS

### Community 62 - "card_orders.repo.ts"
Cohesion: 0.21
Nodes (7): PendingCompany, PendingIndividual, PendingItem, Badge(), BadgeProps, badgeVariants, DOT_COLORS

### Community 63 - "generator.ts"
Cohesion: 0.39
Nodes (6): RFC-6350, GET(), Props, downloadVcf(), foldLine(), generateVcf()

### Community 66 - "page.tsx"
Cohesion: 0.15
Nodes (9): Props, Props, NewEventButton(), defaultStart(), NewEventModal(), Props, Button(), ButtonProps (+1 more)

### Community 68 - "page.tsx"
Cohesion: 0.11
Nodes (19): getCurrentProfileId(), getMyOrders(), placeOrder(), CompanyOrdersPage(), STATUS_BADGE, STATUS_STEP, OrdersPage(), STATUS_BADGE (+11 more)

### Community 69 - "page.tsx"
Cohesion: 0.05
Nodes (50): getCompanyDashboardData, AdminEventDetailPage(), metadata, Props, EventsContent(), metadata, EmployeesContent(), CompanyEventDetailPage() (+42 more)

## Knowledge Gaps
- **349 isolated node(s):** `eslintConfig`, `nextConfig`, `name`, `version`, `private` (+344 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **14 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `getSupabase()` connect `getSupabase` to `cn`, `page.tsx`, `companies.repo.ts`, `page.tsx`, `page.tsx`, `admin.service.ts`, `server.ts`, `CardPreview.tsx`, `getServiceSupabase`, `admin.actions.ts`, `contacts.service.ts`, `orders.service.ts`, `profiles.repo.ts`, `contact_exchanges.repo.ts`, `billing.repo.ts`, `cards.actions.ts`, `middleware.ts`?**
  _High betweenness centrality (0.067) - this node is a cross-community bridge._
- **Why does `getServiceSupabase` connect `admin.service.ts` to `page.tsx`, `getSupabase`, `CardPreview.tsx`, `getServiceSupabase`, `admin.actions.ts`, `page.tsx`, `orders.service.ts`, `profiles.repo.ts`, `contact_exchanges.repo.ts`, `billing.repo.ts`, `cards.actions.ts`, `middleware.ts`, `public.actions.ts`, `companies.repo.ts`, `server.ts`, `getPublicCard`, `onboarding.service.ts`, `page.tsx`, `page.tsx`?**
  _High betweenness centrality (0.067) - this node is a cross-community bridge._
- **Why does `Button()` connect `page.tsx` to `cn`, `page.tsx`, `CardPreview.tsx`, `admin.actions.ts`, `Button.tsx`, `page.tsx`, `page.tsx`, `Input.tsx`, `cards.actions.ts`, `orders.service.ts`, `InviteModal.tsx`, `cards.actions.ts`, `analytics.actions.ts`, `Input.tsx`, `EventActions.tsx`, `Modal.tsx`, `card_orders.repo.ts`, `page.tsx`, `page.tsx`?**
  _High betweenness centrality (0.043) - this node is a cross-community bridge._
- **What connects `eslintConfig`, `nextConfig`, `name` to the rest of the system?**
  _351 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `cn` be split into smaller, more focused modules?**
  _Cohesion score 0.0962566844919786 - nodes in this community are weakly interconnected._
- **Should `page.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.06620209059233449 - nodes in this community are weakly interconnected._
- **Should `getSupabase` be split into smaller, more focused modules?**
  _Cohesion score 0.08416389811738649 - nodes in this community are weakly interconnected._