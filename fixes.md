# EcoTap — Fixes & Testing Report

## ✅ Fixes Applied (from previous review)

- ~~Fix #1: Company rejection broken~~ — Added `rejectCompany` to onboarding service + admin action + approvals page
- ~~Fix #2: Employee profile save broken~~ — Employee company lock now only rejects when value differs from current primary company
- ~~Fix #9: Middleware dot-bypass~~ — Reordered `isPublicPath` checks; dashboard guard runs before dot-file check
- ~~Fix #10: Modal backdrop click~~ — Moved onClick to backdrop div; added `role="dialog" aria-modal="true"`
- ~~Fix #38: revokeInvitationAction always reports success~~ — Wrapped in try/catch, returns error on failure
- ~~Fix #43: error.tsx leaking raw error messages~~ — Generic message + console.error logging
- ~~Fix #46: Deduplicate ROLE_LABELS~~ — Users page imports from @/constants
- ~~Fix #47: Deduplicate DASHBOARD_BASE~~ — Middleware imports DASHBOARD_ROUTE from @/constants
- ~~Fix #57: getInitials whitespace handling~~ — Uses `.split(/\s+/)` + `.filter(Boolean)`
- ~~Fix #58: formatDate error handling~~ — Guards against invalid dates, returns "—"
- ~~Fix #60: Default type="button" on Button~~ — Added `type="button"` default prop
- ~~Fix #65: PasswordInput tabIndex={-1} removed~~ — Toggle now keyboard-accessible
- ~~Fix #82: handleResend DOM manipulation~~ — Replaced with React state + aria-live

## 🆕 New Features Added

- **Employee lock controls** — Company admin can lock org, job titles, groups per employee
- **Separate WhatsApp field** — Separate from phone with "Same as phone" auto-fill checkbox
- **Org toggle now fully hides org info** — When "Show organization" is off, company name, job title, and org badge are all hidden
- **SQL migration** — `supabase/migrations/019_employee_locks_and_whatsapp.sql`

---

## 🔴 Testing Results — Critical Bugs Found

### B1. Billing "Save changes" creates a DUPLICATE plan instead of updating
**File:** `admin/billing/page.tsx:149-176` + `billing.repo.ts:39-59`
**What happens:** The save function does NOT include the plan's `id` in the FormData/upsert call. Supabase `.upsert()` with no `id` INSERTs a brand-new row. The UI patches the local card, so it looks correct until page refresh — then duplicates appear.
**Fix:** Pass the plan's `id` in the upsert call when editing. Add `fd.set("id", editPlan.id)`.

### B2. Billing "Deactivate/Activate" is purely cosmetic — never persisted
**File:** `admin/billing/page.tsx:178-180`
**What happens:** `toggleActive()` only flips local React state. No server call. Refreshing reverts.
**Fix:** Add an `updatePlanActive(id, isActive)` server action and call it from toggleActive.

### B3. Designs "Save changes" reactivates inactive designs + overwrites pattern
**File:** `admin/designs/page.tsx:59-83`
**What happens:** `fd.set("is_active", "on")` and `fd.set("pattern", "dots")` are unconditional. Editing any design silently reactivates it and resets its pattern to "dots". Also, the result of createDesign/updateDesign is completely ignored — no error handling, no loading state.
**Fix:** Preserve the existing `is_active` state when editing. Don't overwrite pattern. Handle errors from the server actions.

### B4. resolveCompanyId used WITHOUT role check — privilege escalation
**Files:** `lib/supabase/server.ts:resolveCompanyId`, all `company.actions.ts`, `invitations.actions.ts`, `subscription.actions.ts`
**What happens:** `resolveCompanyId` returns the company for ANY authenticated user with `is_primary: true` — never checks `role === "company_admin"`. Invited employees get `is_primary: true`. Any employee can delete/suspend coworkers, rename the company, change its slug, toggle locks, create/revoke invites, and subscribe — all actions that should be company_admin only.
**Fix:** Add `role === "company_admin"` check inside `resolveCompanyId()` or in every protected server action.

### B5. Service-role writes without ownership verification — 5 endpoints
**Files:**
- `uploads.actions.ts:updateCompanyLogo(companyId)` — any user can overwrite any company's logo
- `uploads.actions.ts:linkPaymentToOrder` — any user can mark any order as paid
- `subscription.actions.ts:uploadSubscriptionScreenshotAction` — any user can mark any subscription as paid
- `uploads.actions.ts:uploadDesignImage` — any authenticated user can upload design images (no super_admin guard)
- `uploads.actions.ts:deleteUpload(url)` — any user can delete any R2 file by URL

**Fix:** Add ownership verification before each service-role write:
- `updateCompanyLogo`: verify `resolveCompanyId() === companyId`
- `linkPaymentToOrder`: verify `order.profile_id === currentUser.id`
- `uploadSubscriptionScreenshot`: verify subscription belongs to caller's company
- `uploadDesignImage`: add `requireSuperAdmin()` guard
- `deleteUpload`: verify the URL belongs to the caller's resources

### B6. User enumeration confirmed — 3 vectors
**Files:** `auth.actions.ts`, `forgot-password/page.tsx`
- `requestPasswordReset` returns `"NO_ACCOUNT"` → page renders "We couldn't find an account with {email}"
- `signUp` returns distinct "username already taken" / "account with this email already exists"
- `createInvite` returns "A user with this email is already a member of your company"
**Fix:** Return uniform responses: "If an account exists, a code has been sent."

### B7. Sign-in redirect param completely ignored — return-to-page flow broken
**Files:** `middleware.ts:94`, `auth.actions.ts:signIn`, `login/page.tsx`, `org/login/page.tsx`
**What happens:** Middleware sets `?redirect=<pathname>`, org login sends `redirect=/dashboard/company` as FormData — but `signIn` never reads either. Users always land on their role dashboard.
**Fix:** Read `redirect` from FormData or searchParams in signIn, redirect there after login (validate it starts with `/` to prevent open redirect).

### B8. Password reset link flow is broken
**Files:** `auth.actions.ts:resetPasswordForEmail`, `reset-password/page.tsx`
**What happens:** `resetPasswordForEmail` is called without a `redirectTo` param. There is no `/auth/` route to handle the recovery token. The `/reset-password` page calls `updateUser` which requires a session that the recovery link never creates.
**Fix:** Either set a proper `redirectTo` to a callback route, or remove the link-based flow (OTP flow via `/forgot-password` → `/verify-reset` → `/new-password` works).

### B9. Employee orders: `momo_phone` stores the USSD dial code, not a phone number
**File:** `employee/orders/new/page.tsx:173` + `company/orders/new/page.tsx`
**What happens:** `MOMO_PAY.code` (`"*182*8*1*04404#"`) is stored in the `momo_phone` database column. The payer's actual phone number is never collected anywhere in the flow. Admin views show a USSD code in the phone field.
**Fix:** Add a phone number input for the payer's MoMo number. Display the USSD code in the UI but store the actual phone number.

### B10. Employee contacts: "Favorites First" sort is inverted
**File:** `employee/contacts/ContactsClient.tsx:109`
**What happens:** `((b.is_favorite ? 1 : 0) - (a.is_favorite ? 1 : 0)) * dir` with default `sortDir = "desc"` puts non-favorites first. Selecting "Favorites First" shows non-favorites at the top; user must flip the direction toggle to asc.
**Fix:** Reverse the subtraction: `(a.is_favorite ? 1 : 0) - (b.is_favorite ? 1 : 0)`.

### B11. Failed payment screenshot link is silent, success page lies
**File:** `employee/orders/new/page.tsx:177-181` + `company/orders/new/page.tsx`
**What happens:** After `placeOrder` succeeds, if `linkPaymentToOrder` fails, only `console.error` is called. The user is still redirected to the success page which states "Your payment screenshot has been submitted." The order exists but is unpaid with no screenshot, and the uploaded file is orphaned in R2.
**Fix:** Await the result and show an error on failure. Do not redirect to success page if the link fails.

---

## 🟠 Testing Results — High Severity

### H1. Delete/Toggle employee error messages are invisible
**Files:** `company/employees/DeleteEmployeeButton.tsx`, `ToggleEmployeeStatusButton.tsx`
**What happens:** On failure, the code calls `setError(...)` then immediately `setConfirm(false)`. The error element only renders inside the confirm branch — it disappears before the user sees it. The button silently does nothing on error.
**Fix:** Keep the confirm mode open on failure, or render the error outside the confirm branch.

### H2. Subscription currency toggle: RWF amount stored as USD
**File:** `company/subscription/new/page.tsx`
**What happens:** USD mode shows "RWF" prices and sends RWF amounts tagged as `payment_currency: "USD"`. No conversion exists.
**Fix:** Add `usdToRwf` conversion, or remove the non-functional USD toggle.

### H3. "Company card orders" page shows only admin's personal orders
**File:** `company/orders/page.tsx`
**What happens:** `getMyOrders()` filters by `profile_id = current user`. The page says "Company card orders" but shows only orders placed by the admin personally. Employees' orders are invisible.
**Fix:** Either add a company-scoped order query, or rename the page to "My orders".

### H4. Client-supplied payment amounts never validated server-side
**Files:** `orders.service.ts:placeOrder`, `subscription.service.ts:subscribe`
**What happens:** Both store `payment_amount`/`payment_currency` directly from the client without recomputing against `CARD_PRICES`/`billing_plans.price_per_employee`. An attacker can submit any amount.
**Fix:** Recompute amounts server-side from the authoritative price constants or DB values.

### H5. No rate limiting anywhere
**Files:** All auth actions, contact exchange endpoint, VCF route, page view tracker
**What happens:** Zero rate limiting, throttling, captcha, or honeypot code exists. Login, signup, OTP verify, OTP resend, contact submission, and page views are all unbounded.
**Fix:** Add rate limiting middleware or per-action rate checks. Consider Supabase's built-in rate limits or a Redis-based solution.

### H6. `/dev/components` is publicly accessible
**File:** `middleware.ts:21` whitelists `/dev/`; the page itself says "DELETE this page before production"
**Fix:** Remove the `/dev/` whitelist from middleware, or delete the dev page.

### H7. `country_rep` middleware access contradicts server action guards
**Files:** `middleware.ts:40-43`, all `admin.actions.ts`
**What happens:** Middleware allows `country_rep` into `/dashboard/admin`, but every admin server action requires `super_admin`. Result: country_reps see a dashboard where every fetch fails with "Unauthorized." The Overview RSC (which has no guard) leaks real platform stats.
**Fix:** Either remove `country_rep` from admin dashboard access in middleware, or add `country_rep` support to admin actions with read-only permissions.

### H8. `approveSubscription` always sets next billing to +1 month
**File:** `subscription.service.ts:132-135`
**What happens:** Annual plans get monthly next-billing dates.
**Fix:** Check `plan.billing_cycle`: if `"annual"`, add 12 months instead of 1.

### H9. Designs page "0 orders placed" is hardcoded — never fetched
**File:** `admin/designs/page.tsx`
**What happens:** `orders: 0` is hardcoded in both data mappings. The design card always shows "0 orders placed" regardless of reality.
**Fix:** Fetch order counts per design from the server, or remove the misleading stat.

### H10. QR search "by name" doesn't search names
**File:** `profiles.repo.ts:searchProfilesByQuery`
**What happens:** Only `ilike`s `email` and `username`. Placeholder says "Search by name, email, or username" but name search returns nothing.
**Fix:** Add `full_name` ilike to the search query.

---

## 🟡 Testing Results — Medium Severity

### M1. Overview "Active companies" stat counts ALL companies
**File:** `admin/page.tsx:87` + `admin.service.ts:getAdminOverview`
**What happens:** Labeled "Active companies" but `totalCompanies` includes pending and suspended. Should filter by status or rename.
**Fix:** Filter `companies.filter(c => c.status === "active").length` or rename to "Companies on platform."

### M2. Admin users "Reactivate user" label is wrong for pending users
**File:** `admin/users/page.tsx:493-501`
**What happens:** For a pending user, the button says "Reactivate user" but the action actually activates them (pending→active, valid transition). The label implies they were previously active.
**Fix:** Show "Activate user" when status is `pending`, "Reactivate user" when status is `suspended`.

### M3. Contacts stats "With email"/"This month" are per-page only
**File:** `admin/contacts/page.tsx:55-60`
**What happens:** Computed from the current 25 rows, displayed as platform totals alongside server-total "Total received." Numbers are wrong with >1 page.
**Fix:** Fetch separate count queries, or compute from the full dataset.

### M4. `/rdmc/{slug}` hardcoded link in users page
**File:** `admin/users/page.tsx:290-299`
**What happens:** Employee cards linked to `/rdmc/{slug}` — works only accidentally because `[slug]/[employee]` resolves by username. Gives employees a wrong URL.
**Fix:** Store company slug in `AdminUser` and build the real URL: `/${companySlug}/${username}`.

### M5. Admin users page has no loading state
**File:** `admin/users/page.tsx`
**What happens:** Shows "No users match your search" until fetch completes. No error state on failure.
**Fix:** Add a loading skeleton and error banner with retry.

### M6. Admin orders page has no loading state + uses alert()
**File:** `admin/orders/page.tsx`
**What happens:** Shows "No pending orders" until fetch completes. Uses `alert()` for action errors.
**Fix:** Add a loading skeleton. Replace alert() with toast or inline error banner.

### M7. Design save has no error handling or loading state
**File:** `admin/designs/page.tsx:59-83`
**What happens:** Server action results are completely ignored. Modal closes regardless of success/failure. No loading spinner.
**Fix:** Add loading state, check server action results, show errors, only close modal on success.

### M8. Dashboard error.tsx renders raw error.message to users
**File:** `app/dashboard/error.tsx:23`
**What happens:** Unlike the auth error boundary (fixed), the dashboard error boundary still renders `error.message` directly.
**Fix:** Apply the same fix as the auth error boundary — generic message + console.error.

### M9. Invite revocation has no loading/error state in UI
**File:** `company/employees/InviteModal.tsx:handleRevoke`
**What happens:** No spinner, no error feedback. Button silently does nothing on failure (even though the server action now correctly returns errors — the UI doesn't display them).
**Fix:** Add loading state to the revoke button, show errors from the action result.

### M10. Raw Supabase error messages returned to clients
**Files:** `auth.actions.ts`, `company.actions.ts:updateMyCompany`
**What happens:** `error.message` from Supabase is returned verbatim in action results. Can leak table names, constraint details.
**Fix:** Map Supabase errors to user-friendly messages. Log the real error server-side.

### M11. Settings page: no client-side required-name validation
**File:** `company/settings/page.tsx`
**What happens:** The `name` field has no required check. A company admin can clear the name and save — the server accepts empty names (only slug and color are validated). The sidebar initials break.
**Fix:** Add required validation for company name. Add server-side check in `updateMyCompany`.

### M12. Design edit modal: color swatch buttons have no aria-labels
**File:** `admin/designs/page.tsx` + `admin/qr-codes/page.tsx`
**What happens:** Color preset buttons have no `aria-label` or `aria-pressed`, making them invisible to screen readers.
**Fix:** Add `aria-label={`Select color ${color}`}` and `aria-pressed={selected}`.

### M13. Employee overview header "View my card" goes to profile editor, not public card
**File:** `employee/page.tsx:15`
**What happens:** Links to `/dashboard/employee/profile` (the edit form). The sidebar link with the SAME label goes to the public card. Two links labeled identically go to different places.
**Fix:** Change the header link label to "Edit my card" or change the destination to the public card URL.

### M14. Employee orders page has no error state distinction
**File:** `employee/orders/page.tsx:21-23`
**What happens:** If `getMyOrders()` fails, `orders = []` and the page shows "No orders yet" — indistinguishable from a new user. Same issue in `OverviewContent.tsx` (order stat shows "None" on failure).
**Fix:** Distinguish empty vs error: check `result.success` and show an error banner on failure.

---

## 🔵 Testing Results — Low Severity / Code Quality

- **"Add employee" quick action** navigates to the list page instead of opening the invite modal directly
- **"Volume discounts for 100+ cards"** is marketing copy with no backing code logic
- **Settings says "PNG or SVG"** but ImageUpload rejects SVG client-side
- **Designs "X orders placed"** always shows 0
- **Fake "QR code" in design card preview** shows NFC ripple, not a QR code — purely cosmetic
- **Employee sidebar mobile drawer** lacks Escape-to-close and focus trap
- **Order quantity +/- buttons** and range slider lack aria-labels
- **Step indicators** (orders/new, subscription/new) lack aria-current/step semantics
- **Support email inconsistency**: `support@ecotap.rw` (pending page) vs `ecotap@rdmc.rw` (contact page)
- **Employee profile: no way to remove photo** — `onRemove` is not passed to ImageUpload; only replacement is possible
- **Employee groups: no blur-to-save on group name edit** — clicking away from the group input leaves it in edit mode with unsaved changes
- **Employee QR: hardcoded `https://ecotap.rw`** domain — breaks in dev/staging
- **Employee QR failure mislabeled** — server error shows "No card found. Set up your profile first." which is wrong guidance
- **Company sidebar active link**: exact `pathname === href` match misses sub-routes (`/orders/new`, `/orders/success`)
- **Settings slug hint** says `ecotap.rw/{slug}/employee` but real URL is `/{slug}/{username}`
- **Grain overlay z-index: 9999** sits above all modals on public pages
- **No `prefers-reduced-motion`** handling anywhere (WCAG 2.3.3)
- **`Database = any`** in types/database.ts — root cause of pervasive unsafe casts

---

## SQL Migration Applied

```sql
-- 019_employee_locks_and_whatsapp.sql
ALTER TABLE companies ADD COLUMN IF NOT EXISTS org_locked boolean NOT NULL DEFAULT false;
ALTER TABLE companies ADD COLUMN IF NOT EXISTS job_title_locked boolean NOT NULL DEFAULT false;
ALTER TABLE companies ADD COLUMN IF NOT EXISTS groups_locked boolean NOT NULL DEFAULT false;
ALTER TABLE cards ADD COLUMN IF NOT EXISTS whatsapp text;
```

---

## Priority Fix Queue

### Immediate (this session)
1. Fix B1 (billing save creates duplicate plan)
2. Fix B2 (billing deactivate/activate cosmetic only)
3. Fix B4 (resolveCompanyId role check)
4. Fix B5 (service-role ownership verification — 5 endpoints)
5. Fix H1 (delete/toggle error invisible)
6. Fix H2 (subscription currency RWF-as-USD)
7. Fix M8 (dashboard error.tsx raw error.message)

### Short-term
8. Fix B3 (designs save reactivates + overwrites pattern)
9. Fix B6 (user enumeration)
10. Fix B7 (sign-in redirect)
11. Fix B8 (password reset link flow)
12. Fix H3 (company orders scope)
13. Fix H4 (client-supplied amounts)
14. Fix H5 (rate limiting)
15. Fix H6 (remove /dev/ from middleware)
16. Fix H7 (country_rep middleware vs actions mismatch)
17. Fix H8 (annual subscription billing date)
18. Fix H9 (designs 0 orders hardcoded)
19. Fix H10 (QR search by name)

### Medium-term
20. Fix M1-M12 (label mismatches, loading states, aria labels)
21. Migrate `Database = any` to generated Supabase types
22. Add E2E tests for critical flows
23. RLS policy audit on all Supabase tables
24. Fix `prefers-reduced-motion` in globals.css
25. Extract inline styles to CSS variables/Tailwind tokens

---
---

# Audit — 2026-09-25

A second pass over the whole repo, prompted by a report that a deleted user's email could not be re-registered.

**How to read this.** Entries marked **[verified]** were reproduced or proven while writing this — by running code, querying the schema, or reading the exact call chain. Entries marked **[reported]** come from a systematic sweep and have a file:line and a described mechanism, but were not independently reproduced. Treat **[reported]** as "worth checking", not "confirmed".

Numbering `N1…` is separate from the `B/H/M` numbering above, which is left intact.

---

## N1. A rejected subscription permanently blocks the company from ever subscribing — CRITICAL **[verified]**

**Files:** `src/lib/services/subscription.service.ts:155-171` (reject), `:44-71` (subscribe guard), `src/lib/supabase/billing.repo.ts:154` (insert), `supabase/FULL_SCHEMA.sql:600` (constraint)

The chain, verified link by link:

1. Super admin rejects a payment → `rejectSubscription` sets `status: "cancelled"`
2. Company admin uploads a correct screenshot and clicks Subscribe
3. `subscribe()` only refuses when an existing row is `active` or `pending_approval` — a `cancelled` row does **not** match, so it proceeds
4. `createSubscription` does a plain `.insert()` — but `company_subscriptions.company_id` is `not null unique`
5. The insert hits a unique violation, `.single()` returns `data: null`, and the user sees `"Failed to create subscription."`

**Consequence:** a company whose payment is ever rejected can never subscribe again. Every retry fails identically, the message names no cause, and no code path resets the row to `pending_approval`. This is a business-blocking dead end, not a cosmetic bug.

**Likely fix:** make rejection reuse the existing row (`update` to `pending_approval` with the new screenshot) rather than leaving a tombstone that blocks a fresh insert — or upsert on `company_id`.

---

## N2. Account deletion is non-atomic and fails in the unrecoverable direction — CRITICAL **[verified]**

**Files:** `src/lib/services/admin.service.ts:277-392`

`deleteProfileCascade` removes the account's data **first** (steps 1–4: `card_orders`, `profile_companies`, `profile_activity`, `contact_exchanges`, `invitations`, `notifications`) and deletes the identity **last** (step 5: `auth.users`, which cascades to `profiles`).

If step 5 fails, the person is left half-deleted: their records are gone, but `auth.users` still holds the email, so re-registration returns *"already exists"* while the account itself is unusable. Nothing retries and nothing reconciles.

**This is the likely mechanism behind the reported "deleted user's email still exists" symptom.** Two contributing defects:

**2a — every guard in the function is dead code.** Supabase's client does not reject; PostgREST errors come back as a *resolved* `{ error }`. Proven directly, against this project's own client:

```
did it THROW?       false
did it RETURN err?  {"error":{"code":"PGRST205", ...}}
```

So all seven `try { await supabase.from(X).delete() } catch {...}` blocks can never fire. Steps 1–4 fail silently, `errors[]` stays empty, and the function proceeds to step 5 with its cleanup incomplete — which is how step 5 then fails on a foreign key. Only the `auth.admin.deleteUser` step checks its result. Nothing is logged either.

**2b — `invitations.created_by` and `invitations.accepted_by` are `references profiles(id)` with no `on delete` clause** (`supabase/FULL_SCHEMA.sql:250,255`), which Postgres treats as `NO ACTION` — effectively RESTRICT. Step 4b exists specifically to clear those rows, and is exactly the kind of step whose failure is invisible under 2a.

**Same root cause, second location:** `src/lib/supabase/companies.repo.ts:123-146` (`deleteCompanyCascade`) — `errors` can never be non-empty, so company deletion always reports a clean success.

**Also feeds N10 (events):** `deleteProfileCascade` never touches `events`, and `events.host_profile_id` cascades — so deleting a host silently destroys other people's attendance.

---

## N3. Deleting a card design or a billing plan "succeeds" and does nothing — HIGH **[verified]**

**Files:** `src/lib/services/admin.service.ts:117-120` (`deleteDesign`), `:137-140` (`deletePlan`)

Both discard the repository result and return `{ success: true }` unconditionally:

```ts
export async function deleteDesign(id: string): Promise<ActionResult<void>> {
  await designsRepo.deleteDesign(id);
  return { success: true };
}
```

The rows are FK-protected (`card_orders.design_id … on delete restrict`, `company_subscriptions.plan_id … on delete restrict`), so any design that has ever been ordered — and any plan a company is on — cannot be deleted. The delete is rejected, the error is dropped, the UI shows no error, and after a refresh the row is still there.

There is no soft-delete path either: `card_designs.is_active` exists but `deleteDesign` never uses it, so designs cannot be retired at all.

---

## N4. Event server actions read service-role data without ownership checks — FIXED 2026-09-25 **[verified]**

**Files:** `src/app/actions/events.actions.ts:171-181` (as originally written)

`getOpenVisitsAction(eventId)` proved only that the caller was *a* host, never that they hosted *that* event, and called a service-role read — so it would return the full "inside now" roster (names, emails, phones) for any event on the platform given its id. `getAdminEventsAction()` checked only `caps.authenticated`, returning every event platform-wide with host details.

Neither was imported by a client component, so the action IDs were not in the client bundle — a defence-in-depth gap rather than an open door. But B4/B5 exist precisely because "unreachable" server actions are still callable.

**Fixed:** added host-scoped service reads (`getOpenVisitsForHost`, `getEventVisitsForHost`) that verify the caller hosts the event, and a platform-admin/country-rep role check on `getAdminEventsAction`. Verified: `tsc` and `npm run build` clean.

---

## N5. Admin billing shows the wrong plan and price per subscription — HIGH **[reported]**

**File:** `src/lib/supabase/billing.repo.ts:132`

```ts
const planMap = new Map((plans ?? []).map((p, i) => [planIds[i], p]));
```

An **index-based** join against `.in("id", planIds)` with no `order` clause. Postgres does not guarantee that result order matches request order.

**Consequence:** with several companies on different plans, each subscription row can be rendered with another company's plan name, cycle and `price_per_employee` (`src/app/dashboard/admin/billing/page.tsx:396,416`). The super admin verifies payments against those numbers. **Fix:** key the map by `p.id`.

---

## N6. `updateMyCard` can delete another company, its departments and its subscription — HIGH **[reported]**

**File:** `src/app/actions/cards.actions.ts:275-307, 379-382, 387-418`

Company lookup uses raw user input with unescaped LIKE wildcards (`.ilike("name", companyName)`), and on a later edit the code deletes any company with no `profile_companies` rows and `status === "active"` — with no check that the caller is that company's admin.

**Consequence:** an individual types an approved company's name onto their card (permitted by design, no approval needed), later changes it, and that company row plus its `departments` and `company_subscriptions` are silently destroyed. Separately, `:380-381` lets that user overwrite the company's `social_links` — a **sixth** member of the B5 family that B5 does not list.

---

## N7. `approveCompany` reactivates individually suspended members — MEDIUM **[reported]**

**File:** `src/lib/services/onboarding.service.ts:120-134`

It loops over every `profile_companies` row and calls `updateProfileStatus(profileId, "active")` with no transition check, bypassing `VALID_TRANSITIONS`.

**Consequence:** a member suspended on their own merits is silently reactivated — regaining dashboard and card access — the next time the company is approved.

---

## N8. `country_rep` scoping does not exist — MEDIUM **[verified]**

**Files:** `src/app/actions/admin.actions.ts:30-42`, `supabase/FULL_SCHEMA.sql:1130-1140`, `src/types/index.ts:98`

`country_reps` exists to scope representatives to a country, but a grep for `country_code`/`country_reps` across `src/` returns exactly one hit — a type field. No query filters by country. Every admin fetch (`fetchUsers`, `fetchOrders`, `fetchAllContactExchanges`, `fetchUserProfile`, `lookupUserForQR`) grants reps platform-wide read of every profile, order, contact exchange and subscription.

H7 covers the middleware-vs-action mismatch. This is the separate fact that **even where reps are permitted, the country filter was never implemented.**

---

## N9. Suspended users keep a live public card and VCF — MEDIUM **[reported]**

**Files:** `src/lib/supabase/cards.repo.ts:51-88`, `src/app/api/vcf/[slug]/route.ts:11`, `src/app/[slug]/[employee]/page.tsx:13`

`resolveSlug` filters `status = "active"`, so `/{username}` 404s for a suspended user — but the VCF route and the two-segment `/{company}/{username}` route call `getPublicCard` directly, which never selects `status`, and still serve the card, phone and `email_public`. Middleware signs suspended users out immediately, so suspension is clearly meant to remove public access; it currently removes one of three routes.

---

## N10. Deleting a host destroys other people's attendance records — MEDIUM **[verified]**

**Files:** `supabase/migrations/022_events.sql:25,68`; `src/lib/services/admin.service.ts:277`

The migration's own design note is that attendance is a historical record and that deleting a profile must not blank past attendance — which is why `attendee_profile_id` is `on delete set null`. That holds for an **attendee**. When a **host** is deleted, `events` cascades and every `event_visits` row for it goes with it: other people's attendance, the company admin's sheets, and the data behind every past export vanish with no audit trail. `deleteProfileCascade` never touches `events`, so nothing warns the operator.

This was accepted deliberately during design (see `Status.md`), but the blast radius includes attendees who are not the deleted user — worth revisiting.

---

## N11. `updateMyCard` commits partial writes and can destroy card groups — MEDIUM **[reported]**

**Files:** `src/app/actions/cards.actions.ts:215-257, 424-435`, `src/lib/supabase/cards.repo.ts:305-334`

Profile/card/`profile_companies` writes are applied first and never rolled back. `syncCardGroups` is documented as "Replace all groups for a card atomically" but is a plain delete-then-insert with no transaction: if the insert fails, the existing groups are already gone, and the action returns `"Groups not saved: …"` *after* the rest of the edit committed. The user's mental model ("nothing saved") and the database state disagree.

---

## N12. `recordPageView` is an unauthenticated, unvalidated service-role write — MEDIUM **[verified]**

**Files:** `src/app/actions/analytics.actions.ts:9-20`, `src/components/analytics/PageViewTracker.tsx:18`

No auth, no check that `cardId` exists or is public, and it inserts with the service role (bypassing the `card_events` RLS insert policy). The `catch` only covers a thrown error, which — per N2a — never happens, so failures are not even logged.

Any anonymous visitor can loop this to inflate any card's view counts, and those numbers feed the dashboards and the `card_scores` feature. H5 lists "no rate limiting"; this is the concrete data-integrity consequence for the one endpoint that writes with the service role from an unauthenticated context.

---

## N13. `deleteExchange` always reports success and never deletes — LOW **[reported]**

**Files:** `src/lib/services/contacts.service.ts:88-93`, `src/lib/supabase/contact_exchanges.repo.ts:95-98`

No ownership check, and `contact_exchanges` has no `for delete` RLS policy (only insert + three selects). The user-scoped client deletes 0 rows, returns no error, and the service returns `{ success: true }`. Currently unreachable — no action exports it — so it is a trap rather than a live bug.

---

## N14. Self-delete has no last-super-admin guard — LOW **[reported]**

**File:** `src/lib/services/admin.service.ts:427-441`

`deleteUser` refuses to delete the last super admin (`:407-414`); `deleteOwnAccount` has no such check. Reached from `src/app/dashboard/employee/profile/page.tsx:215`, and middleware keeps `super_admin` out of `/dashboard/employee` — but the action itself enforces nothing, so the guard exists on one delete path and not the other.

---

## Corrections to the B/H/M list above

These were re-checked during this audit and are **no longer open**:

| ID | Status |
|---|---|
| **B4** | **Fixed** — `src/lib/supabase/server.ts:82` now rejects any role that is not `company_admin`/`super_admin`. |
| **B5** | **Fixed** — all five listed endpoints now verify ownership or role (`uploads.actions.ts:66-69, 104-113, 180-190, 207-216`; `subscription.actions.ts:57-70`). Note the family has a **sixth** member still open — see N6. |
| **H8** | **Fixed** — `subscription.service.ts:132-140` now branches on `billing_cycle === "annual"`. |
| **H7** | **Needs restating** — rep read access is granted deliberately, but no country filter exists anywhere (see N8). `getEventCapabilities` denies reps event *export* while the admin events page still shows them every event. |

---

## Environment & consistency findings

**E1. `supabase/migrations/019_employee_locks_and_whatsapp.sql` is 1 byte — empty. [verified]**
`companies.org_locked`, `job_title_locked`, `groups_locked` and `cards.whatsapp` exist in `src/types/index.ts` and are read in `src/app/actions/company.actions.ts`, but appear **in no SQL file**. They exist only in the live database. A database rebuilt from this repo would be missing them. Same class of drift as `022` was written to avoid.

**E2. `COLORS.creamDark` disagrees with `globals.css`. [verified]**
`src/constants/index.ts` declares `creamDark: "#F0E6D3"` under a comment reading "mirror globals.css", while `src/styles/globals.css:14` defines `--color-cream-dark: #F5EDD8`. Whichever is wrong, the file's own stated contract is broken.

**E3. `/dev/components` is publicly reachable in production. [verified]**
`src/app/dev/components/page.tsx` builds as a static route. `src/middleware.ts` permits `/dev/` in `isPublicPath`, and its matcher covers only `/dashboard/:path*`, so middleware never runs for it. The page's own header says it should have been deleted at launch. Already logged as H6; restated because it is still open and now confirmed in a production build.

**E4. Sign-out throws a visible runtime error. [verified]**
`signOut()` (`src/app/actions/auth.actions.ts`) ends with `redirect("/")`. Called as `onClick={() => signOut()}` from all three sidebars, the resulting 303 produces `Error: An unexpected response was received from the server` as an unhandled rejection. **Sign-out itself works** — the session does clear and the user does land on `/`. It is a noisy client error over a working feature. Pre-existing; unrelated to Events.

**E5. Admin "view card" links 404 for some users. [verified — cause not determined]**
Clicking through the admin users list produced `GET /masterjerb 404` and `GET /yuhiabia 404` while others resolved 200. The link is built from `user.slug` (`src/app/dashboard/admin/users/page.tsx:69,306`), which is `profiles.username`. Likely causes: no `cards` row, `is_public = false`, or a non-active profile. Not investigated further.

**E6. Dead code and unused surface. [reported]**
`deleteProfile` / `deleteProfileService` (`src/lib/supabase/profiles.repo.ts`) have no callers. The whole analytics service (`src/lib/services/analytics.service.ts`) and the `recordCardEvent` path are exported but unwired — already described in `Roadmap.md`.

**E7. Hardcoded `/rdmc/` in the admin users list.** `src/app/dashboard/admin/users/page.tsx:306` builds `/rdmc/${user.slug}` for any employee. Already logged as **M4**. It happens to still resolve because `[slug]/[employee]/page.tsx` ignores the company segment — but it publicly displays "rdmc" for every tenant and breaks if that route ever honours the segment.

**E8. Subscriber-facing placeholders use a real customer's name.** `src/app/(auth)/org/register/page.tsx:173,199,247` and `org/login/page.tsx:81` use `e.g., RDMC Ltd` / `ntwali@rdmc.rw`. RDMC is a real EcoTap partner, so every other tenant registering sees a competitor's name as the example. The same issue in the Events modal was fixed on 2026-09-25.

---

## Priority queue for this audit

**Immediate — user-blocking or data-destroying**
1. **N1** rejected subscription dead end (blocks revenue)
2. **N2** account deletion: fix the swallowed errors and the non-atomic order
3. **N6** `updateMyCard` destroying companies and subscriptions

**Short-term**
4. **N3** delete design/plan silently no-ops
5. **N5** billing index-based plan join shows wrong prices
6. **N9** suspended users still serve public cards + VCF
7. **N12** unauthenticated service-role analytics write
8. **E1** empty `019` migration — reconcile the schema

**Medium-term**
9. **N7, N8, N10, N11, N13, N14**
10. **E2, E3, E4, E5, E7, E8**

**Fixed during this audit:** N4 (event action ownership checks).


---

# Audit — 2026-09-25 (second sweep: schema, config, dead code)

Continues the numbering from above. Same convention: **[verified]** = reproduced or proven during this audit; **[reported]** = mechanism and file:line identified, not independently reproduced.

---

## N15. A fresh install cannot apply migration 022 — the documented setup path is broken — CRITICAL **[verified]**

**Files:** `supabase/migrations/019_employee_locks_and_whatsapp.sql` (1 byte), `supabase/migrations/021_backfill_employee_cards.sql:69-77`

`019` is **empty**. No SQL file anywhere creates `cards.whatsapp` — the only `whatsapp` references in `supabase/` are a JSONB comment and an unrelated `utm_source` example. But `021` does:

```sql
-- 6. Set whatsapp = phone for employees whose whatsapp is empty
UPDATE cards c SET whatsapp = c.phone FROM profile_companies pc
WHERE ... AND (c.whatsapp IS NULL OR c.whatsapp = '')
```

On a database built the way `Readme.md` documents — `FULL_SCHEMA.sql`, then `supabase db push` for `011`→`022` — this statement fails with `column "whatsapp" of relation "cards" does not exist` and **aborts the migration run**:

- `021` step 7 (activating invited employees) never executes
- **`022_events.sql` never applies, so the Events feature has no tables at all**

The existing `fixes.md` entry reports the empty `019` as a curiosity and even reproduces its intended SQL. It never notes that a *later* migration depends on those columns and dies without them.

The live database works only because those columns were applied by hand at some point — consistent with `company.actions.ts:174-176` reading `org_locked`/`job_title_locked`/`groups_locked` through `as Record<string, unknown>` casts, and `cards.whatsapp` being present in `src/types/index.ts` but in no migration.

**This is the single highest-value fix in this audit**: without it, the repo cannot rebuild its own database, and anyone following `Readme.md` gets a partially-migrated schema plus a silently missing feature. The fix is to write the real `019` body (idempotent `add column if not exists`), which is a no-op against the live database.

---

## N16. `FULL_SCHEMA.sql` omits all four of migration 012's contact-enrichment columns — HIGH **[reported]**

**Files:** `supabase/FULL_SCHEMA.sql:437-462` vs `supabase/migrations/012_contact_enrichment.sql:7-17`

`is_favorite`, `lead_level`, `owner_notes`, `lead_group` exist only in `012`. `FULL_SCHEMA.sql` presents itself as the complete, run-from-scratch schema, and both `Readme.md` and `Instructions.md` call it the only complete definition of the base schema.

A database built from it lacks the whole lead-management feature. `ContactsClient.tsx:41-84` reads and writes all four, so every favourite / lead level / note / group edit fails and surfaces only as a generic error.

---

## N17. `FULL_SCHEMA.sql` omits migration 014 — the RLS policy it exists to add — HIGH **[reported]**

**Files:** `supabase/FULL_SCHEMA.sql:1462-1490` vs `supabase/migrations/014_contact_exchanges_update_policy.sql:1-5`

Migration 014 exists solely to add `contact_exchanges: card owner update`. FULL_SCHEMA defines only insert + three selects. 014's own header says: *"Without this, the app's updates are silently blocked by RLS."*

On a FULL_SCHEMA-only database, `updateContactExchange` fails silently — the same failure 014 was written to fix.

---

## N18. `FULL_SCHEMA.sql` omits migration 015's objects — LOW **[reported]**

`debug_profile_org(pid uuid)` and `departments: linked member insert` are absent. The latter is moot today because `departments.repo.ts` is entirely dead (N21). Verified that `departments: linked member read` duplicates FULL_SCHEMA's existing `departments: member read` byte-for-byte, so that one is redundancy rather than drift.

---

## N19. Migration 020 silently caps its repair at 50 rows — MEDIUM **[reported]**

**File:** `supabase/migrations/020_activate_self_serve_companies.sql:36`

```sql
INSERT INTO profile_companies (...) SELECT ... LIMIT 50;
```

No `ORDER BY`, and migrations run once. If more than 50 company admins are missing their `profile_companies` link, the rest are never repaired by anything and keep hitting `NO_COMPANY_LINKED` from `resolveCompanyId()`. `LIMIT 50` reads like a safety valve left in from testing.

---

## N20. `updateMyCompany` overwrites omitted fields — it is not the partial update its type promises — MEDIUM **[reported]**

**File:** `src/app/actions/company.actions.ts:202-213` (type), `:244-257` (implementation)

```ts
industry:     input.industry     ?? null,
website:      input.website      ?? null,
description:  input.description  ?? null,
brand_color:  input.brand_color  ?? "#064E3B",
theme_locked: input.theme_locked ?? false,
org_locked:   input.org_locked   ?? false,
```

`UpdateCompanyInput` marks everything except `name`/`slug` optional, so the type advertises a patch while the implementation performs a full overwrite. A caller passing `{ name, slug, org_locked: true }` wipes `industry`, `website` and `description`, resets the brand colour, and **unlocks `theme_locked`** — re-enabling employee theme edits.

Latent today (the settings page always sends the full form), but one line from silently destroying a company's branding. Related: `:279-280` revalidates only the two company dashboard paths, never the public company page or employee cards, which render company name, brand colour and slug.

---

## N21. `departments.repo.ts` is an entirely dead module — MEDIUM **[reported]**

All five exports (`getDepartmentsByCompany`, `getDepartmentById`, `createDepartment`, `updateDepartment`, `deleteDepartment`) have zero callers. It is the only repo with no importers. Anyone adding department CRUD will write a second, divergent implementation.

---

## N22. `supabase/client.ts` and `supabase/middleware-client.ts` are dead — and the latter is a live trap — MEDIUM **[reported]**

Both have zero importers. `middleware-client.ts:16-44` (`updateSession`) is a near-verbatim copy of the cookie-refresh block now inlined in `src/middleware.ts:78-101` — but it knows nothing about the role checks, the pending/suspended redirects, or fix #9's `isPublicPath` ordering.

`Instructions.md` lists `lib/supabase/` as containing "middleware helpers", so a developer is invited to wire up the stale one. `client.ts:11-12` also reads env vars at module load and throws, contradicting the deliberate lazy-read pattern documented in `r2/upload.ts:5-8`.

---

## N23. vCard generator: field injection, wrong folding units, folding applied to one field — MEDIUM **[reported]**

**File:** `src/lib/vcf/generator.ts:12-16, 28-33, 50-60`

Three distinct defects:

- **No escaping.** `full_name`, `company.name`, `bio`, `job_title` and social URLs are interpolated raw; only `bio` escapes `\n`, and nothing escapes `\r`, `;` or `,`. A user whose `full_name` is `X\r\nURL:https://evil.example` injects arbitrary vCard properties into **every contact file other people download from their card**.
- **`foldLine` counts UTF-16 code units, not octets.** The comment says 75 octets per RFC 6350; the code uses `line.length`. Accented or emoji text exceeds the limit and gets folded mid-character.
- **Folding is applied only to `NOTE`.** `FN`, `N`, `ORG`, `TITLE`, `URL` are pushed unfolded despite routinely exceeding 75 octets.

---

## N24. Services query Supabase directly; types live outside `src/types/index.ts` — MEDIUM **[reported]**

`Instructions.md` says services call repositories only, never Supabase directly. Actual direct `.from()` counts inside `src/lib/services/`: `admin.service.ts` 10, `invitations.service.ts` 10, `subscription.service.ts` 1, `onboarding.service.ts` 1 — all via `getServiceSupabase()`.

This is the structural root of the B5 class: when the query bypasses the repo layer, ownership verification has nowhere natural to live.

Interfaces declared outside `src/types/index.ts`: `company.actions.ts:11,21,202`, `public.actions.ts:8,16`, `events.actions.ts:101`, plus Input types in `event_visits.repo.ts:117`, `contact_exchanges.repo.ts:121`, `profiles.repo.ts:283`, `subscription.service.ts:13,22`, `invitations.service.ts:11,17,97`, and `export/zip.ts:11`.

---

## N25. Dead exports, including the constants that encode the country_rep policy — LOW-MEDIUM **[reported]**

Zero importers anywhere in `src/`:

- `ROLES`, `ADMIN_ROLES`, `ADMIN_WRITE_ROLES`, `COLORS` (`src/constants/index.ts:8,25,28,230`)
- `CountryRep` (`src/types/index.ts:95`) — the `country_reps` table it models also has zero references in `src/`, so table and type are both dead
- `OrgRegisterForm`, `IndividualRegisterForm`, `AddCompanyForm` (`src/types/index.ts:484,494,512`)
- `slugify` (`src/lib/utils/index.ts:8`)

`ADMIN_ROLES` / `ADMIN_WRITE_ROLES` are the consequential ones: they encode the intended country_rep read-only policy that the code does not follow (see N8, H7).

---

## N26. Diverging duplicated palettes — LOW-MEDIUM **[reported]**

Two different constants both named `PRESET_COLORS`: `admin/designs/page.tsx:22` has 10 values, `company/settings/page.tsx:19-27` has 8 — a brand colour selectable in one context is unpickable in the other. `PAYMENT_COLORS` is copied verbatim in `admin/orders/page.tsx:88-92` and `admin/billing/page.tsx:175-178`. `ALL_ROLES` (`admin/users/page.tsx:29`) re-lists all five roles instead of using the exported `ROLES`.

---

## E9. `creamDark` drift is worse than a wrong constant — the stale value is hardcoded in 10 files **[verified]**

`src/constants/index.ts:230` has `#F0E6D3`; `src/styles/globals.css:14` has `#F5EDD8`; `Instructions.md:355` documents `#F5EDD8`, so the CSS token is authoritative. Only `creamDark` has rotted — every other `COLORS` value matches.

The reason it matters: `#F0E6D3` is hardcoded as an inline `backgroundColor` in `admin/users/page.tsx:244,286`, `admin/contacts/page.tsx:142`, `admin/approvals/page.tsx:198`, `admin/billing/page.tsx:242`, `employee/orders/new/page.tsx:732,748`, `employee/orders/page.tsx:151,166`, `employee/orders/success/page.tsx:90` — each sitting next to Tailwind `border-cream-dark` classes rendering `#F5EDD8`. Visible two-tone mismatch on step dots, progress bars and inactive pills. `COLORS` has zero importers, so nothing enforces the "mirror globals.css" comment.

---

## E10. Smaller consistency findings **[reported]**

- **`fixes.md` / `Status.md` still list B4 as open** — it is fixed (`server.ts:79-84`). The priority queue sends a developer to redo finished work.
- **`loginSchema` reuses registration's password rules** (`src/lib/validations/auth.ts:12-14,96-99`), so a legacy short password can never be entered and the user sees *"Password must be at least 8 characters"* instead of wrong credentials.
- **`createEventSchema` accepts past dates** (`src/lib/validations/events.ts:14-18`) — `Date.parse` validity only. *(Found in code I wrote this session.)*
- **`updateMyCompany` leaks internal codes** — `NO_COMPANY_LINKED`, `INVALID_SLUG_FORMAT`, `UNEXPECTED_ERROR` returned at `company.actions.ts:220,224,283` and rendered verbatim by `settings/page.tsx:114`, while line 236 in the same function returns a proper sentence. Same class as M10.
- **`downloadVcf` revokes the blob URL synchronously** (`src/lib/vcf/generator.ts:82`) right after `a.click()` — Firefox and Safari can abort the download.
- **`.env.example:15` promises a sitemap** used for "vCard links, canonical metadata, sitemap" — there is no `src/app/sitemap.ts` or `robots.ts`. *(`.env.example` was written this session; the claim was inherited from the old docs.)*
- **`foldLine` and `getInitials` disagree on splitting**: `generator.ts:16` uses `.split(" ")`, `utils/index.ts:30` uses `.split(/\s+/)` (fix #57). A double space produces a trailing-space `N:` field.
- **`tsconfig.json` has `noUnusedLocals`/`noUnusedParameters` off**, which is part of why the dead exports in N21–N25 are never caught by `npm run build`.

---

## Areas verified clean

- **Environment variables** — only five `process.env` reads in `src/`, all documented in `.env.example`. The `R2_*` names that look missing under a naive grep are read correctly through `requireEnv(key)`.
- **`next.config.ts` `remotePatterns`** matches `R2_PUBLIC_URL`, and the only `next/image` usage references local assets.
- **The Events schema itself** — `022_events.sql` and its block in `FULL_SCHEMA.sql` agree exactly on columns, constraints, partial unique indexes and RLS policies.
- **`tsconfig.json`** — `strict: true`, correct paths, no stale options.
- **Fixes #57 and #58** are genuinely present in `src/lib/utils/index.ts`.

---

## Updated priority queue

This supersedes the queue above.

**Immediate — install-breaking or data-destroying**
1. **N15** write the real `019` migration so `021` and `022` can apply (fresh installs are broken today)
2. **N2** account deletion: fix the swallowed errors, then the non-atomic ordering
3. **N1** rejected subscription permanently blocks the company
4. **N6** `updateMyCard` destroying companies and subscriptions

**Short-term**
5. **N16, N17** bring `FULL_SCHEMA.sql` up to date with migrations 012 and 014
6. **N3** delete design/plan silently no-ops
7. **N5** billing index-based plan join shows wrong prices
8. **N9** suspended users still serve public cards and VCF
9. **N12** unauthenticated service-role analytics write
10. **N19** migration 020's `LIMIT 50`

**Medium-term**
11. **N7, N8, N10, N11, N13, N14, N20–N24**
12. **E2, E3, E4, E5, E7, E8, E9, E10**

**Fixed during this audit (2026-09-25)**
- **N4** — event actions now verify host ownership and admin role
- A repository import inside `dashboard/company/events/[id]/page.tsx` (noted in N24) — replaced with a service-level gate
- The Events modal placeholder that used a real customer's name (E8)

