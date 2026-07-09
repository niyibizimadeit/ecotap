# EcoTap — Fixes & Improvements Plan

> Generated after a full repository audit on 2026-07-09.
> Each section describes the problem, the root cause, affected files, and the step-by-step fix.

---

## 1. Super Admin — Mobile Scrolling When a User is Clicked

### Problem
When the super admin taps a user row on mobile, the detail modal opens but the content overflows the viewport and cannot be scrolled. The page behind the modal also cannot be scrolled (by design), leaving the admin stuck.

### Root Cause
Two issues compound:

1. **Modal component** (`src/components/ui/Modal.tsx:45-57`) — The modal panel uses `items-center justify-center` on the overlay which vertically centers the panel, but there is no `overflow-y-auto` or `max-h` constraint on the panel content. On a small mobile screen, the User Detail modal (which has ~500+ lines of content: profile, card, companies, orders, actions) extends past the bottom and is unreachable.

2. **Admin layout** (`src/app/dashboard/admin/layout.tsx:180-183`) — The main content area does not use `overflow-y-auto` or a scrollable container at the page level. Combined with the modal's `body.style.overflow = "hidden"`, there is no scroll surface at all.

### Affected Files
| File | What needs to change |
|---|---|
| `src/components/ui/Modal.tsx` | Add `overflow-y-auto max-h-[90dvh]` to the panel content div |
| `src/app/dashboard/admin/layout.tsx` | Ensure the main area uses `overflow-y-auto` with a height constraint |
| `src/app/dashboard/admin/users/page.tsx` | The detail modal already uses `size="lg"` — ensure the content sections collapse gracefully on mobile |

### Step-by-Step Fix

**Step 1 — Fix the Modal component** (`src/components/ui/Modal.tsx`):
- On the panel `<div>` (line 54-59), add `max-h-[90dvh] overflow-y-auto` so the modal itself becomes scrollable when its content overflows.
- On the content wrapper (line 85), add `overflow-y-auto flex-1 min-h-0` so the body scrolls while the header stays sticky.
- Add `overscroll-behavior: contain` to prevent the background from scrolling when reaching the modal's scroll boundary.

**Step 2 — Fix the Admin layout** (`src/app/dashboard/admin/layout.tsx`):
- On the main content div (line 181), ensure `overflow-y-auto` is present and the container uses `min-h-screen` or `h-screen` so it establishes a scroll container.

**Step 3 — Fix mobile drawer behavior** (`src/app/dashboard/admin/layout.tsx`):
- The mobile nav drawer (line 129) uses `fixed inset-0` but the drawer itself at `absolute top-14 inset-x-0` has no max-height. If nav items grow, they overflow. Add `max-h-[80vh] overflow-y-auto` to the nav drawer.

---

## 2. Age Must Be 18 (Not 13)

### Problem
The current minimum age for registration is 13. The requirement is to raise it to 18.

### Root Cause
The age validation value `13` is hardcoded in three places: the Zod schema, the server action, and the UI hint text.

### Affected Files
| File | Line(s) | Current Value | New Value |
|---|---|---|---|
| `src/lib/validations/auth.ts` | 31 | `.min(13, ...)` | `.min(18, "You must be at least 18 years old")` |
| `src/app/actions/auth.actions.ts` | 58 | `age < 13` | `age < 18` |
| `src/app/actions/auth.actions.ts` | 124 | `age < 13` | `age < 18` |
| `src/app/(auth)/register/page.tsx` | 115 | `"You must be at least 13 years old"` | `"You must be at least 18 years old"` |
| `src/app/(auth)/org/register/page.tsx` | 266 | `"You must be at least 13 years old"` | `"You must be at least 18 years old"` |

### Step-by-Step Fix

1. **Update Zod validation** — In `src/lib/validations/auth.ts`, change the `age` schema's `.min(13, ...)` to `.min(18, "You must be at least 18 years old")` and update `.max(120, ...)` message if desired.

2. **Update server-side validation** — In `src/app/actions/auth.actions.ts`:
   - Line 58: Change `age < 13` to `age < 18`, update the error message to `"You must be at least 18 years old."`
   - Line 124: Same change for `signUpOrg`.

3. **Update UI hint text** — In both registration forms:
   - `src/app/(auth)/register/page.tsx` line 115
   - `src/app/(auth)/org/register/page.tsx` line 266

---

## 3. Username Taken — Show Clear Error

### Problem
When a user registers with a username that already exists, the error message is generic ("Registration failed. Please try again.") or a raw Supabase error. The user doesn't know the username is the problem.

### Root Cause
The `signUp` server action calls `supabase.auth.signUp()` which creates both an auth user and triggers the `on_auth_user_created` DB trigger to insert into `profiles`. If the username already exists, the `profiles.username` unique constraint is violated inside the trigger, and Supabase returns a generic error. The server action does not pre-check username uniqueness.

### Affected Files
| File | What needs to change |
|---|---|
| `src/app/actions/auth.actions.ts` | Add a pre-check for username uniqueness before calling `signUp` |
| `src/app/actions/auth.actions.ts` | Add a pre-check for email existence with clearer messaging |
| `src/app/(auth)/register/page.tsx` | Already displays `serverError` — no UI change needed, but the error will now be clearer |

### Step-by-Step Fix

**Step 1 — Add username uniqueness pre-check in `signUp`** (`src/app/actions/auth.actions.ts`):

Before the `supabase.auth.signUp()` call (around line 72), add:

```typescript
// Check if username is already taken
const serviceClient = getServiceSupabase();
const { data: existingUsername } = await serviceClient
  .from("profiles")
  .select("id")
  .eq("username", username)
  .maybeSingle();

if (existingUsername) {
  return {
    success: false,
    error: `The username "@${username}" is already taken. Please choose a different username.`,
  };
}
```

**Step 2 — Improve email duplicate detection** (already partially done):

The current code at line 96 checks `data.user?.identities?.length === 0` for duplicate emails. Keep this but also add a pre-check for clarity:

```typescript
// Check if email is already registered
const { data: existingEmail } = await serviceClient
  .from("profiles")
  .select("id")
  .eq("email", email)
  .maybeSingle();

if (existingEmail) {
  return {
    success: false,
    error: "An account with this email already exists. Please sign in instead, or use a different email.",
  };
}
```

**Step 3 — Apply the same checks to `signUpOrg`** for email uniqueness. (Org registration uses company name, not username, but the email check is still valuable.)

**Step 4 — Handle the specific Supabase error codes** as a fallback:

After the `supabase.auth.signUp()` call, inspect the error for known patterns:
- If the error message contains "duplicate" or "already exists", return a user-friendly message.
- The `identities?.length === 0` pattern (already present) should continue to work as a fallback.

---

## 4. Admin Deletes User — Full Deletion Including Email Reuse

### Problem
When a super admin deletes a user, some data is cleaned up but the Supabase Auth user may not be fully purged. This means:
- The email cannot be reused to create a new account.
- The email cannot be used for password recovery (but also shouldn't, since the account should be gone).
- Orphaned data may remain in related tables.

### Root Cause
In `deleteProfileCascade` (`src/lib/services/admin.service.ts:257-343`), the deletion order is:
1. Delete card
2. Delete profile_companies links + clean orphaned companies
3. Delete card_orders
4. Delete profile_activity
5. **Delete the profile row** (from `profiles` table)
6. **Delete the auth user** (via `supabase.auth.admin.deleteUser`)

There are several issues with this approach:

**Issue A — Race condition / order problem**: Step 5 deletes the profile, which has a foreign key `REFERENCES auth.users(id) ON DELETE CASCADE`. This FK means: "when auth.users row is deleted, cascade-delete profiles." It does NOT cascade the other way. However, if step 5 succeeds but step 6 fails (e.g., Supabase Auth admin API error), the profile is gone but the auth user remains — and the email is still locked in Supabase Auth.

**Issue B — Missing cleanup**: The `contact_exchanges` table references `cards(id) ON DELETE CASCADE`, and `cards` references `profiles(id) ON DELETE CASCADE`. So when the profile is deleted, cards cascade, which cascades to contact_exchanges. BUT: if step 1 already deleted the card explicitly, and step 5 deletes the profile... the cascade from profile→cards→contact_exchanges won't fire because the card is already gone. However, `card_events` also references `cards(id) ON DELETE CASCADE` — and if the card was already deleted in step 1, card_events should have been cascade-deleted. Actually wait — step 1 uses `deleteCardService` which deletes from `cards` table. The `ON DELETE CASCADE` on `card_events.card_id → cards.id` should have handled that. Let me verify... looking at the schema: `card_events.card_id uuid not null references cards(id) on delete cascade` — yes, this should cascade. So card_events are cleaned up.

But what about `daily_card_stats`? Same cascade: `card_id uuid not null references cards(id) on delete cascade`. Should be fine.

**Issue C — The REAL problem**: Supabase Auth's `admin.deleteUser()` should fully delete the user. But there's a subtlety: when the profiles row is already deleted (step 5), and then step 6 tries to delete the auth user, the cascade from `auth.users → profiles` tries to delete an already-deleted profiles row. This shouldn't fail... unless there's some referential integrity check.

Actually, looking at the schema more carefully: `profiles.id uuid primary key references auth.users(id) on delete cascade` — this means `profiles.id` IS the FK referencing `auth.users.id`. So when we try to delete from `auth.users`, it cascades to `profiles`. But if `profiles` row is ALREADY deleted, there's nothing to cascade to. The `auth.users` delete should still succeed because the FK is on the child side (profiles).

So why would the email not be reusable? The likely answer: **Supabase Auth soft-deletes users by default**, or the `admin.deleteUser` call is failing silently.

### Affected Files
| File | What needs to change |
|---|---|
| `src/lib/services/admin.service.ts` | Reorder `deleteProfileCascade` to delete auth user first (after removing restrict-FK data) |
| `src/lib/supabase/profiles.repo.ts` | Ensure `deleteProfileService` is robust |
| `src/app/actions/admin.actions.ts` | Add verification that deletion actually happened |

### Step-by-Step Fix

**Step 1 — Reorder `deleteProfileCascade` for reliability** (`src/lib/services/admin.service.ts`):

The safest order is:
1. Delete `card_orders` first (they have `ON DELETE RESTRICT` on `profiles`, which would block profile/auth deletion).
2. Delete `profile_companies` links (track linked company IDs for orphan cleanup).
3. Delete `profile_activity`.
4. **Delete the auth user** via `supabase.auth.admin.deleteUser(profileId)` — this cascades to `profiles`, which cascades to `cards`, which cascades to `card_events`, `contact_exchanges`, `daily_card_stats`, `card_scores`, `card_groups`.
5. Clean up orphaned companies (those with no remaining profile_companies links).
6. Verify the auth user is truly gone by attempting a lookup.

This order ensures:
- The auth user is deleted while the profile still exists (no "profile already deleted" edge case).
- The cascade handles all the card-related cleanup automatically.
- If the auth deletion fails, the profile is still intact and the operation can be retried.

**Step 2 — Add verification after deletion**:

After step 4 (auth user deletion), add:
```typescript
// Verify the auth user is truly deleted
const { data: verifyUser, error: verifyError } = await supabase.auth.admin.getUserById(profileId);
if (!verifyError && verifyUser?.user) {
  // User still exists — try once more with hard delete
  await supabase.auth.admin.deleteUser(profileId, { shouldSoftDelete: false });
}
```

**Step 3 — Add explicit contact_exchanges cleanup** (belt-and-suspenders):

Even though the cascade should handle it, add an explicit step to delete `contact_exchanges` for the user's card(s) before the cascade, to handle any edge cases where the cascade misses something.

**Step 4 — Update `deleteEmployeeAction` in `company.actions.ts`**:

The same `deleteProfileCascade` function is used when a company admin deletes an employee. Ensure it also benefits from the improved reliability.

---

## 5. Contacts Shared — Mobile UI Improvements

### Problem
On mobile, the contacts shared page (employee dashboard → Contacts) is hard to use:
- Contact email and phone are hidden (only visible on `md:` breakpoint and above).
- The contact cards feel cramped with too many elements competing for space.
- Group filter chips are tiny and easily missed.
- Touch targets (star, expand button) are too small.
- It's hard to quickly scan and find a specific contact.

### Root Cause
The `ContactsClient.tsx` component was designed desktop-first. Key contact actions (email, phone, lead level, date) are wrapped in `hidden md:flex` / `hidden md:block`, making them completely invisible on mobile. The mobile layout only shows name, star, and an expand toggle — users must tap into each contact to see details.

### Affected Files
| File | What needs to change |
|---|---|
| `src/app/dashboard/employee/contacts/ContactsClient.tsx` | Redesign the mobile contact card layout |

### Step-by-Step Fix

**Step 1 — Restructure the mobile contact card** (`ContactsClient.tsx`):

Replace the current two-layer approach (main row + mobile-only row) with a cleaner card layout:

```
┌──────────────────────────────────────────┐
│ ★  [AV]  Ntwali Frankie          [📝]   │
│           rdmc.rw                        │
│                                         │
│  📧 ntwali@example.com                  │
│  📞 +250 788 123 456                    │
│                                         │
│  [Hot ▾]            📅 09 Jul 2026     │
└──────────────────────────────────────────┘
```

- Show email and phone as tappable links (`mailto:` and `tel:`) on ALL screen sizes.
- Make the star button larger (min 44×44px touch target).
- Make the expand/notes button larger.
- Keep the lead level dropdown and date visible on mobile.

**Step 2 — Improve touch targets**:

- Star button: `p-2` instead of default, `min-w-[44px] min-h-[44px]`.
- Expand button: same treatment.
- Lead level select: `py-2` for easier tapping.

**Step 3 — Add swipe-to-reveal or quick actions** (nice-to-have):

If time allows, add horizontal swipe on a contact card to reveal quick actions (call, email, favorite).

**Step 4 — Improve group filter chips**:

- Make them `py-2 px-4` for larger touch targets.
- Add a scroll container with `overflow-x-auto` and `flex-nowrap` so chips don't wrap and take half the screen.
- Add a "Clear filter" chip when a filter is active.

**Step 5 — Add contact count to stat cards at mobile**:

The stat cards are already `grid-cols-2` on mobile, which is fine. Ensure they are tappable as quick filters (tap "Favorites" to filter by favorites, etc.).

---

## 6. Organization Dashboard — Invite Employees Button + Backend Logic

### Problem
In the Organization dashboard (Employees page), the "Invite employee" button is rendered but does nothing — it has no `onClick` handler, no link, no modal trigger. The entire invitation system (backend and frontend) is missing.

### Root Cause
The button in `src/app/dashboard/company/employees/page.tsx:26-32` has a `// TODO Phase 12: wire to invite flow (invitations.actions.ts)` comment. The `invitations` table exists in the database schema with the correct structure, but:
- No server action for creating/sending invitations (`invitations.actions.ts` does not exist).
- No API endpoint or email-sending logic for invitations.
- No invitation acceptance page (registration-with-token flow).
- The button itself is just a `<Button>` with no `onClick` or `href`.

### Affected Files
| File | What needs to change |
|---|---|
| `src/app/dashboard/company/employees/page.tsx` | Wire the invite button to open a modal or navigate to an invite page |
| **NEW** `src/app/actions/invitations.actions.ts` | Create server actions for invitation CRUD |
| **NEW** `src/lib/services/invitations.service.ts` | Business logic for creating, validating, accepting invitations |
| **NEW** `src/lib/supabase/invitations.repo.ts` | Repository for invitations table queries |
| `src/app/(auth)/register/page.tsx` | Support `?invite_token=xxx` to pre-fill and link to company |
| **NEW** `src/app/dashboard/company/employees/InviteModal.tsx` | Modal UI for creating an invitation |

### Step-by-Step Fix

**Step 1 — Create the invitations repository** (`src/lib/supabase/invitations.repo.ts`):

```typescript
// Functions needed:
- createInvitation(companyId, createdBy, email?) → Invitation
- getInvitationByToken(token) → Invitation | null
- acceptInvitation(token, profileId) → void (update status + accepted_by)
- getInvitationsByCompany(companyId) → Invitation[]
- expireInvitation(id) → void
```

The token is auto-generated by the DB default (`encode(gen_random_bytes(32), 'hex')`), so the insert just needs `company_id`, `created_by`, and optional `email`.

**Step 2 — Create the invitations service** (`src/lib/services/invitations.service.ts`):

Business logic:
- `createInvite`: Validate that the caller is a company admin, check employee count against subscription limits, create the invitation, return the invite URL.
- `validateToken`: Check token exists, status is 'pending', not expired. Return the company info for the registration form.
- `acceptInvite`: Mark invitation as accepted, link the new profile to the company via `profile_companies`.
- `getCompanyInvites`: List all invitations for a company.

**Step 3 — Create the server actions** (`src/app/actions/invitations.actions.ts`):

```typescript
export async function createInvitationAction(formData: FormData): Promise<ActionResult>
export async function validateInviteTokenAction(token: string): Promise<ActionResult>
export async function acceptInvitationAction(token: string): Promise<ActionResult>
export async function getCompanyInvitationsAction(): Promise<ActionResult>
export async function revokeInvitationAction(invitationId: string): Promise<ActionResult>
```

**Step 4 — Wire the "Invite employee" button** (`src/app/dashboard/company/employees/page.tsx`):

The button should open a modal (`InviteModal`) with:
- An email input (optional — can also just generate a link).
- A "Generate invite link" button.
- Display the generated link with a "Copy" button.
- Show existing pending invites with expiry times and revoke buttons.

Since the employees page is a Server Component (it uses `async function EmployeesContent()`), the modal needs to be a client component. Add the modal as a client component import.

**Step 5 — Create the InviteModal component** (`src/app/dashboard/company/employees/InviteModal.tsx`):

A client component with:
- Email input field (optional).
- "Generate invite link" button that calls `createInvitationAction`.
- Display the generated invite URL: `https://ecotap.rw/register?invite=<token>`.
- Copy-to-clipboard button.
- List of pending invites with expiry countdown and revoke button.

**Step 6 — Update the registration page** (`src/app/(auth)/register/page.tsx`):

Read `?invite=<token>` from the URL search params. If present:
- Validate the token server-side when the page loads.
- Show the company name the user is joining.
- Pre-fill the email if one was provided in the invitation.
- On successful registration, call `acceptInvitationAction(token)` to link the new user to the company.
- Hide the terms checkbox or pre-check it (they're joining a verified company).

**Step 7 — Add email notification for invitations** (nice-to-have):

When an invitation is created with an email address, send an email via Supabase's built-in email or Resend with the invite link. This can be done as a follow-up.

**Step 8 — Update the company employees page to show invite status**:

Add a section (or filter) showing pending invitations alongside active employees, so the admin can see who hasn't accepted yet.

---

## Summary of All Changes

| # | Issue | Files to Modify | Files to Create | Effort |
|---|---|---|---|---|
| 1 | Mobile scrolling (admin modal) | 2 | 0 | Small |
| 2 | Age 18 minimum | 4 | 0 | Tiny |
| 3 | Username taken error | 1 | 0 | Small |
| 4 | Full user deletion | 2 | 0 | Medium |
| 5 | Contacts mobile UI | 1 | 0 | Medium |
| 6 | Invite employees | 2 | 4 | Large |

### Recommended Implementation Order

1. **First**: #2 (Age 18) — simplest, purely value changes.
2. **Second**: #3 (Username taken error) — small server-action change.
3. **Third**: #1 (Mobile scrolling) — small CSS/layout fix, high user impact.
4. **Fourth**: #4 (Full user deletion) — critical data integrity fix.
5. **Fifth**: #5 (Contacts mobile UI) — UX improvement.
6. **Sixth**: #6 (Invite employees) — largest feature, depends on #4 being solid for the cascade.
