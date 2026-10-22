# Graph Report - ecotap  (2026-10-22)

## Corpus Check
- 192 files · ~149,478 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 1276 nodes · 2688 edges · 77 communities (60 shown, 17 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 9 edges (avg confidence: 0.63)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `627ea0fd`
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
- billing.repo.ts
- BrandLogo.tsx
- page.tsx
- 🟡 Testing Results — Medium Severity
- page.tsx
- page.tsx
- deleteProfileCascade
- page.tsx
- VerifyResetForm.tsx
- page.tsx
- InsideNowList.tsx
- Avatar.tsx
- ActionResult

## God Nodes (most connected - your core abstractions)
1. `getSupabase()` - 115 edges
2. `getServiceSupabase` - 86 edges
3. `Button()` - 49 edges
4. `cn()` - 43 edges
5. `PageHeader()` - 26 edges
6. `resolveCompanyId()` - 24 edges
7. `requireSuperAdmin()` - 21 edges
8. `getEventCapabilities()` - 21 edges
9. `ActionResult` - 20 edges
10. `Input` - 19 edges

## Surprising Connections (you probably didn't know these)
- `StepIndicator()` --calls--> `cn()`  [EXTRACTED]
  src/app/dashboard/company/orders/new/page.tsx → src/lib/utils/index.ts
- `StepIndicator()` --calls--> `cn()`  [EXTRACTED]
  src/app/dashboard/company/subscription/new/page.tsx → src/lib/utils/index.ts
- `StepIndicator()` --calls--> `cn()`  [EXTRACTED]
  src/app/dashboard/employee/orders/new/page.tsx → src/lib/utils/index.ts
- `FieldWrapper()` --calls--> `cn()`  [EXTRACTED]
  src/components/ui/Input.tsx → src/lib/utils/index.ts
- `PublicCardLayoutProps` --references--> `PublicCard`  [EXTRACTED]
  src/components/cards/PublicCardLayout.tsx → src/types/index.ts

## Import Cycles
- None detected.

## Communities (77 total, 17 thin omitted)

### Community 0 - "cn"
Cohesion: 0.18
Nodes (14): signOut(), AdminDashboardLayout(), buildAdminNav(), CompanySidebar(), NAV, Props, SignOutButton(), EmployeeSidebar() (+6 more)

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
Cohesion: 0.11
Nodes (18): acceptInvitationAction(), createInvitationAction(), getCompanyInvitationsAction(), revokeInvitationAction(), acceptInvite(), createInvite(), CreateInviteInput, InviteResult (+10 more)

### Community 10 - "getServiceSupabase"
Cohesion: 0.20
Nodes (14): Avatar(), AvatarProps, SIZE_CLASSES, Card(), CardContent(), CardDescription(), CardFooter(), CardHeader() (+6 more)

### Community 11 - "admin.actions.ts"
Cohesion: 0.09
Nodes (28): deleteCompanyAction(), fetchAllContactExchanges(), fetchContactExchangesCount(), fetchDesigns(), fetchPendingQueue(), fetchPlans(), fetchUserCardUrl(), fetchUserProfile() (+20 more)

### Community 13 - "analytics.service.ts"
Cohesion: 0.10
Nodes (8): calcMonthlyImpact(), ENV, generateMonthlyReport(), CardScore, DailyCardStat, EnvironmentalReport, ProfileActivity, RecordEventPayload

### Community 14 - "page.tsx"
Cohesion: 0.17
Nodes (7): validateInviteTokenAction(), AuthLayout(), AuthLayoutProps, InputProps, PasswordInput, IndividualRegisterData, individualRegisterSchema

### Community 15 - "compilerOptions"
Cohesion: 0.08
Nodes (21): TapActionResult, attendeeFromVisit(), closeEvent(), collectExportRows(), decorate(), durationOf(), formatExportTime(), getAdminEventSummaries() (+13 more)

### Community 16 - "BrandLogo.tsx"
Cohesion: 0.18
Nodes (10): Documentation drift, EcoTap — Project Status, Events — documented behaviours, not defects, Functional, Known issues, Security-relevant — read before exposing this app further, Testing & CI, Type safety (+2 more)

### Community 17 - "contacts.service.ts"
Cohesion: 0.15
Nodes (12): getCurrentProfileId(), getMyInbox(), updateContactExchange(), ContactsClient(), LEAD_LEVELS, Props, SortDir, SortField (+4 more)

### Community 18 - "DashboardShared.tsx"
Cohesion: 0.16
Nodes (20): RFC-5987, GET(), NOTE: this static `export` segment sits alongside the sibling dynamic, attachmentHeader(), EXPORT_ERROR_STATUS, exportError(), exportFilename(), NO_STORE (+12 more)

### Community 20 - "page.tsx"
Cohesion: 0.20
Nodes (18): AnyActionResult, approveCompany(), approveIndividual(), approveOrder(), createDesign(), deleteDesign(), deletePlan(), markOrderDelivered() (+10 more)

### Community 21 - "Input.tsx"
Cohesion: 0.08
Nodes (29): AdminUser, ALL_ROLES, metadata, ADMIN_ROLES, ADMIN_WRITE_ROLES, CARD_ORIGINAL_PRICES, CHECK_IN_METHOD_LABELS, COLORS (+21 more)

### Community 22 - "page.tsx"
Cohesion: 0.16
Nodes (20): closeEventAction(), createEventAction(), getAdminEventsAction(), getEventVisitsAction(), getLiveEventCountAction(), getMyEventsAction(), getOpenVisitsAction(), goLiveAction() (+12 more)

### Community 23 - "cards.actions.ts"
Cohesion: 0.25
Nodes (5): AdminQrPage(), BG_COLORS, FG_COLORS, UserMatch, SectionCard()

### Community 24 - "orders.service.ts"
Cohesion: 0.07
Nodes (42): getActiveDesigns(), getCurrentProfileId(), getMyOrders(), placeOrder(), linkPaymentToOrder(), CompanyNewOrderPage(), Currency, EMPTY_ADDRESS (+34 more)

### Community 25 - "InviteModal.tsx"
Cohesion: 0.14
Nodes (16): checkInTapAction(), DoorPage(), metadata, Props, Band, BAND_STYLE, ERROR_COPY, EventDoorScreen() (+8 more)

### Community 26 - "profiles.repo.ts"
Cohesion: 0.11
Nodes (18): createProfile(), deleteProfile(), deleteProfileService(), getAllPending(), getAllProfiles(), getPrimaryCompanyInfoService(), getProfileByEmail(), getProfileById() (+10 more)

### Community 27 - "contact_exchanges.repo.ts"
Cohesion: 0.20
Nodes (9): AdminExchangeOptions, createExchange(), deleteExchange(), getAllExchangesAdmin(), getExchangeById(), getExchangesByCardId(), getExchangesByProfileId(), getExchangesCount() (+1 more)

### Community 28 - "billing.repo.ts"
Cohesion: 0.17
Nodes (10): BrandIcon(), BrandIconProps, BrandLogo(), BrandLogoProps, ICON_SIZES, TEXT_COLORS, Footer(), FOOTER_LINKS (+2 more)

### Community 29 - "CompanySidebar.tsx"
Cohesion: 0.40
Nodes (4): Admin & Company, Demo Accounts, Notes, RDMC Employees

### Community 30 - "cards.actions.ts"
Cohesion: 0.18
Nodes (10): signIn(), age, email, fullName, LoginData, loginSchema, OrgRegisterData, orgRegisterSchema (+2 more)

### Community 31 - "middleware.ts"
Cohesion: 0.08
Nodes (39): activateEmployeeAction(), CompanyDashboardData, CompanyEmployee, deleteEmployeeAction(), getCompanyDashboardData, suspendEmployeeAction(), UpdateCompanyInput, updateMyCompany() (+31 more)

### Community 32 - "public.actions.ts"
Cohesion: 0.22
Nodes (9): Props, Props, EventListRow, Props, BulkExportPlan, EventSummary, EcoEvent, EcoEventWithHost (+1 more)

### Community 34 - "analytics.actions.ts"
Cohesion: 0.28
Nodes (6): EventsContent(), metadata, NewEventButton(), ANONYMOUS, getEventCapabilities(), EventCapabilities

### Community 35 - "companies.repo.ts"
Cohesion: 0.27
Nodes (9): RFC-6350, GET(), Props, SaveContactButton(), SaveContactButtonProps, downloadVcf(), foldLine(), generateVcf() (+1 more)

### Community 36 - "EcoTap — Architecture & Coding Conventions"
Cohesion: 0.07
Nodes (29): Analytics & ML, Architecture: SSOT (Single Source of Truth), Authentication, Billing & platform, Cards & orders, Company admin registration rules, Country representative rules, Database tables — complete list (+21 more)

### Community 38 - "Input.tsx"
Cohesion: 0.17
Nodes (10): submitContactExchange(), metadata, ContactExchangeForm(), ContactExchangeFormProps, FieldWrapper(), FieldWrapperProps, Input, SelectProps (+2 more)

### Community 39 - "middleware.ts"
Cohesion: 0.15
Nodes (16): PendingQueue, ABTestAssignment, AddCompanyForm, CardEvent, Company, CompanyWithRelations, CountryRep, EventType (+8 more)

### Community 41 - "EventActions.tsx"
Cohesion: 0.20
Nodes (9): fetchOrders(), AdminOrder, PAYMENT_COLORS, PAYMENT_LABELS, RawOrder, STATUS_COLORS, STATUS_NEXT, getAllOrdersAdmin() (+1 more)

### Community 53 - "CardPreview.tsx"
Cohesion: 0.19
Nodes (12): CardPreview(), CardPreviewProps, GroupPreviewEntry, SOCIAL_LABELS, PublicCardLayoutProps, SOCIAL_CONFIG, SocialIconRow(), SocialIconsProps (+4 more)

### Community 54 - "EcoTap (production)"
Cohesion: 0.13
Nodes (14): Database, Deployment, Documentation map, EcoTap (production), Environment variables, Getting started, Project structure, Seeding demo accounts (+6 more)

### Community 55 - "AuthLayout.tsx"
Cohesion: 0.15
Nodes (9): CompanyOverviewContent(), EmployeeOverviewContent(), EmptyState(), PageHeader(), PageHeaderProps, StatCard(), StatCardProps, StatCardSkeleton() (+1 more)

### Community 56 - "getPublicCard"
Cohesion: 0.17
Nodes (9): OrgRegisterPage(), Step3Review(), STEPS, Select, COMPANY_SIZES, OrgRegisterStep1Data, orgRegisterStep1Schema, OrgRegisterStep2Data (+1 more)

### Community 58 - "Modal.tsx"
Cohesion: 0.22
Nodes (12): getCurrentUser(), getSession(), getSupabaseServerAction(), requestPasswordReset(), resendOtp(), resetPassword(), resetPasswordWithOtp(), setNewPassword() (+4 more)

### Community 59 - "PublicCardLayout.tsx"
Cohesion: 0.33
Nodes (6): createCroppedImage(), ICON_SIZES, ImageUpload(), ImageUploadProps, loadImage(), SIZES

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
Cohesion: 0.05
Nodes (41): Areas verified clean, Audit — 2026-09-25, Audit — 2026-09-25 (second sweep: schema, config, dead code), Corrections to earlier framing (found while implementing), Corrections to the B/H/M list above, E10. Smaller consistency findings **[reported]**, E9. `creamDark` drift is worse than a wrong constant — the stale value is hardcoded in 10 files **[verified]**, Environment & consistency findings (+33 more)

### Community 64 - "billing.repo.ts"
Cohesion: 0.14
Nodes (13): cancelSubscription(), createSubscription(), deletePlan(), getActivePlans(), getAllPlans(), getAllSubscriptions(), getAllSubscriptionsEnriched(), getPlanById() (+5 more)

### Community 65 - "BrandLogo.tsx"
Cohesion: 0.15
Nodes (15): recordPageView(), getPublicCard, PublicCompanyData, PublicEmployee, resolveSlug, Props, EmployeeCardPage(), generateMetadata() (+7 more)

### Community 66 - "page.tsx"
Cohesion: 0.11
Nodes (15): InviteModal(), Props, Props, Props, Props, defaultStart(), NewEventModal(), Props (+7 more)

### Community 67 - "🟡 Testing Results — Medium Severity"
Cohesion: 0.04
Nodes (46): B10. Employee contacts: "Favorites First" sort is inverted, B11. Failed payment screenshot link is silent, success page lies, B1. Billing "Save changes" creates a DUPLICATE plan instead of updating, B2. Billing "Deactivate/Activate" is purely cosmetic — never persisted, B3. Designs "Save changes" reactivates inactive designs + overwrites pattern, B4. resolveCompanyId used WITHOUT role check — privilege escalation, B5. Service-role writes without ownership verification — 5 endpoints, B6. User enumeration confirmed — 3 vectors (+38 more)

### Community 68 - "page.tsx"
Cohesion: 0.23
Nodes (7): approveOrder(), canTransition(), markDelivered(), markShipped(), transitionOrderStatus(), uploadPaymentScreenshot(), VALID_TRANSITIONS

### Community 69 - "page.tsx"
Cohesion: 0.18
Nodes (11): EventsContent(), metadata, EventsContent(), metadata, BulkExportButton(), Props, EventList(), isExportable() (+3 more)

### Community 70 - "deleteProfileCascade"
Cohesion: 0.33
Nodes (6): deleteUserAction(), deleteOwnAccount(), deleteProfileCascade(), deleteUser(), getUserById(), deleteCompanyCascade()

### Community 71 - "page.tsx"
Cohesion: 0.33
Nodes (3): Design, INITIAL_DESIGNS, PRESET_COLORS

### Community 74 - "InsideNowList.tsx"
Cohesion: 0.50
Nodes (3): Spinner(), SPINNER_SIZES, SpinnerProps

### Community 76 - "Avatar.tsx"
Cohesion: 0.22
Nodes (9): createCompany(), deleteCompany(), getAllCompanies(), getAllPendingCompanies(), getCompanyById(), getCompanyBySlug(), updateCompany(), updateCompanySocialLinks() (+1 more)

### Community 79 - "ActionResult"
Cohesion: 0.16
Nodes (12): deleteMyAccount(), getMyCard(), updateMyCard(), EMPTY_FORM, EMPTY_GROUP, FormState, GroupEntry, getOwnCard() (+4 more)

## Knowledge Gaps
- **389 isolated node(s):** `ALL_ROLES`, `GroupEntry`, `FormState`, `EMPTY_GROUP`, `EMPTY_FORM` (+384 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **17 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `getSupabase()` connect `getSupabase` to `cn`, `page.tsx`, `billing.repo.ts`, `analytics.actions.ts`, `server.ts`, `deleteProfileCascade`, `admin.service.ts`, `CardPreview.tsx`, `page.tsx`, `admin.actions.ts`, `Avatar.tsx`, `contacts.service.ts`, `page.tsx`, `AuthLayout.tsx`, `orders.service.ts`, `profiles.repo.ts`, `contact_exchanges.repo.ts`, `middleware.ts`?**
  _High betweenness centrality (0.054) - this node is a cross-community bridge._
- **Why does `Button()` connect `page.tsx` to `page.tsx`, `getServiceSupabase`, `Button.tsx`, `page.tsx`, `Input.tsx`, `cards.actions.ts`, `orders.service.ts`, `InviteModal.tsx`, `billing.repo.ts`, `cards.actions.ts`, `middleware.ts`, `Input.tsx`, `EventActions.tsx`, `AuthLayout.tsx`, `getPublicCard`, `Modal.tsx`, `card_orders.repo.ts`, `page.tsx`, `VerifyResetForm.tsx`?**
  _High betweenness centrality (0.049) - this node is a cross-community bridge._
- **Why does `getServiceSupabase` connect `admin.service.ts` to `billing.repo.ts`, `BrandLogo.tsx`, `page.tsx`, `getSupabase`, `profiles.repo.ts`, `server.ts`, `deleteProfileCascade`, `CardPreview.tsx`, `Avatar.tsx`, `page.tsx`, `orders.service.ts`, `Modal.tsx`, `contact_exchanges.repo.ts`, `onboarding.service.ts`, `middleware.ts`?**
  _High betweenness centrality (0.034) - this node is a cross-community bridge._
- **What connects `ALL_ROLES`, `GroupEntry`, `FormState` to the rest of the system?**
  _391 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `page.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.06620209059233449 - nodes in this community are weakly interconnected._
- **Should `getSupabase` be split into smaller, more focused modules?**
  _Cohesion score 0.08710801393728224 - nodes in this community are weakly interconnected._
- **Should `PublicCardLayout.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.13538461538461538 - nodes in this community are weakly interconnected._