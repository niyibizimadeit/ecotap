# Dashboard Audit — Logic, Backend & UX Flaws

> Compiled from a full review of `src/app/dashboard/company/**` and `src/app/dashboard/employee/**`, their server actions, services, and middleware.

---

## 🔴 Critical (Logic / Backend)

### 1. Employee overview crashes when no card row exists
**File:** `src/app/dashboard/employee/OverviewContent.tsx:31-35`
```ts
const { data: card } = await supabase
  .from("cards")
  .select("id, is_public")
  .eq("profile_id", profileId)
  .single();
```
Supabase `.single()` throws a PostgREST error (code `PGRST116`) when zero rows match — it does not return `{ data: null }`. New employees whose card hasn't been created yet (e.g., still pending activation) will crash the entire overview page with an unhandled promise rejection.  
**Fix:** Use `.maybeSingle()` instead, and handle `null` gracefully.

### 2. `computeCardScores` engagement score is always 100 (math bug)
**File:** `src/lib/services/analytics.service.ts:115-124`
```ts
const engagementScore = Math.min(100, Math.round(
  ((viewCount / Math.max(totalEvents, 1)) * 30 +
   (tapCount / Math.max(totalEvents, 1)) * 25 +
   (exchangeCount / Math.max(totalEvents, 1)) * 25 +
   (shareCount / Math.max(totalEvents, 1)) * 20) *
  3.33
));
```
Since `viewCount + tapCount + exchangeCount + shareCount === totalEvents`, the four ratios always sum to **1.0**. So the inner expression is always `(30+25+25+20) = 100`, multiplied by `3.33 = 333`, clamped to 100. **Every card with ≥1 event scores 100.** The ratio weighting is completely nullified — the score carries no signal.  
**Fix:** Rewrite the formula to use absolute event counts normalized against a benchmark (e.g., events per day), not against themselves.

### 3. `recordCardEvent` return-visitor detection is broken
**File:** `src/lib/services/analytics.service.ts:33-43`
```ts
const existing = await analyticsRepo.getEventsByCardId(payload.card_id, 1);
isReturnVisitor = existing.some(e => e.visitor_id === payload.visitor_id);
```
Fetches only the **single most recent event** (limit=1) and checks if it matches the current visitor. A returning visitor whose last visit wasn't literally the most recent event is misclassified as new. This makes the `is_return_visitor` column meaningless for any card with >1 unique visitor.  
**Fix:** Add a dedicated repo function `hasVisitorVisitedBefore(cardId, visitorId)` that queries by visitor_id directly.

### 4. Contacts optimistic updates never roll back on failure
**File:** `src/app/dashboard/employee/contacts/ContactsClient.tsx:33-54`
```ts
async function toggleFavorite(c: ContactExchange) {
  const newVal = !c.is_favorite;
  setContacts(prev => prev.map(x => (x.id === c.id ? { ...x, is_favorite: newVal } : x)));
  await updateContactExchange(c.id, { is_favorite: newVal });  // 🔥 no try/catch, no rollback
}
```
All four mutation functions (`toggleFavorite`, `setLeadLevel`, `saveNotes`, `saveGroup`) optimistically update state but **never catch errors**. If the server call fails, the UI stays optimistically changed while the database is unchanged — a silent data-desync. The page must be refreshed to see the real state.  
**Fix:** Wrap each `await` in try/catch; revert to the previous value on failure. Show a toast instead of silently swallowing.

### 5. `updateMyCard` — employees can overwrite admin-assigned job titles
**File:** `src/app/actions/cards.actions.ts:143-148`
```ts
if (data.job_title !== undefined) {
  await serviceClient
    .from("profile_companies")
    .update({ job_title: data.job_title || null })
    .eq("profile_id", user.id);
}
```
When an employee edits their profile, the new job title is written to **all** their `profile_companies` links, including the one managed by their company admin. There is no guard preventing an employee from overwriting the job title their admin assigned. The company lock only applies to the company name, not the job title.  
**Fix:** Either prevent employees from editing `job_title` entirely (same as the company lock), or scope the update to only non-primary company links.

---

## 🟠 High (Data Integrity / UX)

### 6. "Active cards" stat actually counts active employee profiles
**File:** `src/app/dashboard/company/page.tsx:129-133` + `src/app/actions/company.actions.ts:153-158`
```ts
active: employees.filter((e) => e.status === "active").length,
```
The company dashboard stat is labeled "Active cards" with subtitle "Employees with live cards," but the count is `employees.filter(status === "active").length` — it counts employees whose **profile** is active, not whether they have a published card. An active employee whose card is private or doesn't exist yet is still counted.  
**Fix:** Either rename to "Active employees" or join against the `cards` table to check `is_public = true`.

### 7. Employee orders list shows raw design UUID instead of design name
**File:** `src/app/dashboard/employee/orders/page.tsx:119`
```tsx
<p className="text-sm font-medium text-ink">{order.design_id.slice(0, 8)}</p>
```
The `getMyOrders` action returns `CardOrder[]` which has no joined design data. Users see `a1b2c3d4` instead of, e.g., "Emerald Standard." The admin orders page uses `CardOrderWithDesign` which includes the design name — the employee page should too.  
**Fix:** Use `getAllOrders` (which returns `CardOrderWithDesign`) or enrich `getUserOrders` with design names.

### 8. `resolveCompanyId` is copy-pasted across 3 action files
**Files:**
- `src/app/actions/company.actions.ts:64-84`
- `src/app/actions/invitations.actions.ts:15-34`
- `src/app/actions/subscription.actions.ts:15-32`

Three identical ~20-line functions. Any bug fix requires editing all three. Already diverging slightly (error handling differs).  
**Fix:** Extract to a shared helper in `@/lib/utils/server` or `@/lib/services`.

### 9. Subscription payment amount is per-employee price, not total
**File:** `src/app/dashboard/company/subscription/new/page.tsx:112`
```ts
formData.append("payment_amount", String(selectedPlan.price_per_employee));
```
The subscription flow doesn't ask for employee count — it submits the **per-employee** rate as the payment amount. The actual billing amount should be `price_per_employee × employee_count`, but `employee_count` is never captured during subscription.  
**Fix:** Add an employee count field to the subscription form, or default to 1 and make it editable before submit.

### 10. Payment screenshots from subscription flow are uploaded to `orders/pending` path
**File:** `src/app/actions/uploads.actions.ts:140`
```ts
const result = await uploadToR2(buffer, file!.name, file!.type, "orders/pending");
```
The `uploadPaymentScreenshot` action hardcodes `"orders/pending"` as the R2 prefix. When called from the subscription payment flow, company subscription screenshots are incorrectly stored under the orders directory.  
**Fix:** Accept an optional `folder` parameter or create a separate `uploadSubscriptionScreenshot` action.

### 11. Company settings doesn't check slug uniqueness
**File:** `src/app/actions/company.actions.ts:241-243`
```ts
if (!/^[a-z0-9][a-z0-9\-]{1,48}[a-z0-9]$/.test(input.slug)) {
  return { success: false, error: "INVALID_SLUG_FORMAT" };
}
```
Only validates format — never checks if another company already uses this slug. Two companies with the same slug would cause public page collisions at `ecotap.rw/{slug}`.  
**Fix:** Add a uniqueness check against the `companies` table before updating.

### 12. Subscription page "Subscribe now" button always visible
**File:** `src/app/dashboard/company/subscription/page.tsx:18-24`
```tsx
action={
  <Link href="/dashboard/company/subscription/new">
    <Button variant="primary" size="sm" ...>Subscribe now</Button>
  </Link>
}
```
The PageHeader action is **unconditional** — it renders "Subscribe now" even when the user is already viewing their active subscription details. This is confusing: "Am I subscribed or not?"  
**Fix:** Make the button conditional — hide it or change to "Change plan" when an active subscription exists.

### 13. Subscription "Estimated monthly cost" label is wrong for annual plans
**File:** `src/app/dashboard/company/subscription/page.tsx:159`
```tsx
<p className="text-xs text-ink-light mb-1">Estimated monthly cost</p>
```
Always says "monthly" regardless of the plan's `billing_cycle`. For annual plans, the displayed amount (employee_count × price_per_employee) should be labeled "Estimated annual cost" or the math should divide by 12.  
**Fix:** Make the label dynamic based on `subscription.billing_cycle` or `plan.billing_cycle`.

### 14. No order pagination — fetches all orders unconditionally
**File:** `src/app/dashboard/employee/orders/page.tsx:21`
```ts
const result = await getMyOrders();
```
Fetches every order for the user with no limit or pagination. For power users who order frequently, this grows unboundedly and the page renders everything in a single list.  
**Fix:** Add server-side pagination to `getUserOrders` / `getMyOrders`.

### 15. `deleteEmployeeAction` uses inline dynamic imports unnecessarily
**File:** `src/app/actions/company.actions.ts:292,308`
```ts
const { data: employeeLink } = await (await import("@/lib/supabase/server")).getServiceSupabase()...
const { deleteProfileCascade } = await import("@/lib/services/admin.service");
```
Two separate dynamic `await import()` calls inside the same function. Both modules are already available — the top of the file imports `getServiceSupabase`. The dynamic imports add latency and make the code harder to follow.  
**Fix:** Import both at the top of the file like all other dependencies.

---

## 🟡 Medium (UX / Consistency)

### 16. Employee dashboard layout fetches user data client-side (waterfall + flash)
**File:** `src/app/dashboard/employee/layout.tsx:28-40`
```tsx
useEffect(() => {
  async function load() {
    const result = await getMyCard();
    if (result.success && result.data) { setUserData(...); }
  }
  load();
}, []);
```
The employee layout is a `"use client"` component that fetches user identity in a `useEffect`. This causes:
- A loading flash where the sidebar shows "—" for name/role.
- A client-server waterfall: the page renders, then the client fetches, then re-renders.

The **company layout** already uses the correct pattern — a server component that fetches data once and passes it as props.  
**Fix:** Convert the employee layout to a server component (or wrap it in one) that fetches the user's name/role/username server-side.

### 17. "View my card" link can point to `/you` (404)
**File:** `src/app/dashboard/employee/layout.tsx:98`
```tsx
<a href={`/${userData.username || "you"}`} ...>
```
If the `useEffect` hasn't resolved yet, `userData.username` is `""` (empty string), and the link becomes `/you` — a 404 page. The same pattern repeats in the mobile drawer at line 156.  
**Fix:** Default to `#` or hide the link until `username` is loaded.

### 18. Employee actions (suspend/activate/delete) use `alert()` for error feedback
**Files:**
- `src/app/dashboard/company/employees/ToggleEmployeeStatusButton.tsx:33`
- `src/app/dashboard/company/employees/DeleteEmployeeButton.tsx:25`

```ts
alert(result.error ?? "Failed.");
```
Native `alert()` dialogs are a poor UX pattern — they block the page, look unstyled, and can't be dismissed. The rest of the app uses inline error messages (red banners).  
**Fix:** Use inline error state + a small error message below the button, consistent with the settings and profile pages.

### 19. Employee overview "Pending" stat uses a custom ClockIcon instead of lucide-react
**File:** `src/app/dashboard/company/page.tsx:219-231`
```tsx
function ClockIcon() { return (<svg ...>...</svg>); }
```
A 12-line inline SVG component defined at the bottom of the file. Lucide-react is already a dependency and has `Clock` — the custom SVG is unnecessary and inconsistent.  
**Fix:** Replace with `import { Clock } from "lucide-react"`.

### 20. No sign-out confirmation
**Files:**
- `src/app/dashboard/company/_components/CompanySidebar.tsx:136`
- `src/app/dashboard/employee/layout.tsx:106`

Both sign-out buttons call `signOut()` immediately. Accidental clicks log the user out with no chance to cancel.  
**Fix:** Add a one-click confirmation step ("Click again to sign out" or a confirm dialog).

### 21. Company overview employee list has no status filter
**File:** `src/app/dashboard/company/page.tsx:189`
```tsx
{employees.slice(0, 5).map((emp) => (...))}
```
Shows the first 5 employees regardless of status. Pending and suspended employees are mixed in with active ones. A company with many pending invites sees those at the top instead of active team members.  
**Fix:** Sort active employees first, or add a status filter/tab.

### 22. Employee overview "Card order" stat shows capitalized raw status
**File:** `src/app/dashboard/employee/OverviewContent.tsx:101`
```tsx
value={latestOrder ? (latestOrder.status ?? "None").charAt(0).toUpperCase() + (latestOrder.status ?? "none").slice(1) : "None"}
```
Manual string capitalization. If the status is `pending_approval` (for subscriptions), it'll display as `Pending_approval`. There's no mapping to a user-friendly label.  
**Fix:** Use a lookup map like `ORDER_STATUS_LABELS` from constants.

### 23. Employee contacts "With email" / "With phone" stats are raw integers without context
**File:** `src/app/dashboard/employee/contacts/ContactsClient.tsx:87-89`
```tsx
const withEmail = contacts.filter((c) => c.visitor_email).length;
const withPhone = contacts.filter((c) => c.visitor_phone).length;
```
These are simple counts. They'd be more useful as percentages or shown alongside the total. Currently they're just raw integers with no context.  
**Fix:** Add percentage labels or use a format like "12/20 (60%)".

### 24. Order success page timeline is hardcoded and never dynamic
**File:** `src/app/dashboard/employee/orders/success/page.tsx:61-103`
The timeline is hardcoded — it always says "within 24 hours" regardless of when the order was actually placed. For USD/bank transfers that require manual coordination, the timeline is misleading.  
**Fix:** Make the timeline dynamic or at least differentiate between MoMo (faster) and bank transfer (slower) timelines.

### 25. QR code PNG download renders at 512×512 from a 200×200 SVG (blurry)
**File:** `src/app/dashboard/employee/qr/page.tsx:53-54`
```ts
canvas.width = 512;
canvas.height = 512;
ctx.drawImage(img, 0, 0, 512, 512);
```
The QR code SVG is rendered at 200×200 via `<QRCodeSVG size={200}>`, then upscaled to 512×512 in the canvas. The result is a blurry, upscaled PNG.  
**Fix:** Either render the QR at 512×512 directly, or use a higher source resolution.

---

## 🟢 Low (Code Quality / Maintainability)

### 26. Unused/duplicate import: `getServiceSupabase` in `deleteEmployeeAction`
**File:** `src/app/actions/company.actions.ts:292`  
The function dynamically imports `getServiceSupabase` even though it's already imported at the top of the file (line 4). The dynamic import is redundant and adds latency.

### 27. `EmptyState` icon prop inconsistency — sometimes emoji strings, sometimes JSX
In `CompanyOverviewContent` the `EmptyState` receives `icon="🏢"` (emoji string), but `EmployeeOverviewContent` passes `icon={<User .../>}` (JSX). Both work but the inconsistency is confusing for contributors.  
**Fix:** Standardize on one approach — prefer JSX for consistency with the design system.

### 28. Inline styles proliferation
Nearly every component uses inline `style={{}}` objects mixed with Tailwind classes. This makes it hard to maintain a consistent design system. Brand colors (`#064E3B`, `#FEF9EF`, etc.) are repeated as magic strings in dozens of files instead of referencing CSS variables or Tailwind config tokens.  
**Fix:** Extend the Tailwind theme with the brand palette and use semantic utility classes (e.g., `bg-emerald-deep`, `text-cream`).

### 29. Mock designs fallback hides real data issues
**File:** `src/app/dashboard/employee/orders/new/page.tsx:61`
```ts
const [designs, setDesigns] = useState<CardDesignOption[]>(MOCK_DESIGNS);
```
The design gallery initializes with `MOCK_DESIGNS` and only replaces them when the server fetch succeeds. If the fetch fails silently, users see mock designs and can place orders with fake design IDs that don't exist in the database.  
**Fix:** Initialize with an empty array and show a loading skeleton; only render the gallery when real data is available.

### 30. `updateMyCard` — empty company name can create orphaned companies
**File:** `src/app/actions/cards.actions.ts:169-186`  
When a user types a company name, the code does an `ilike` search and creates a new company if none matches. If the user types a typo, submits, then corrects it, two companies are created. There's no cleanup of the orphaned one.  
**Fix:** Add a debounce to the company search, or show existing matches as suggestions instead of auto-creating.

---

## 📊 Summary

| Severity | Count | Area |
|----------|-------|------|
| 🔴 Critical | 5 | Logic bugs, crashes, silent data corruption |
| 🟠 High | 10 | Misleading stats, broken UX, data issues |
| 🟡 Medium | 10 | UX polish, consistency, edge cases |
| 🟢 Low | 5 | Code quality, maintainability |

**Key themes:**
1. **Error handling is inconsistent** — some places use `.single()` (throws), some `.maybeSingle()` (returns null), some catch errors, some don't.
2. **Optimistic updates without rollback** — the contacts page is the worst offender.
3. **Unvalidated assumptions** — employee has a card, design IDs are fetchable, slugs are unique, scores are meaningful.
4. **Server/client data fetching split** — company dashboard uses server components correctly; employee dashboard does not.
