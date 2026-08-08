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
