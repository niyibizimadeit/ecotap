# EcoTap — Project Status

Read this alongside `Readme.md` (setup), `Instructions.md` (conventions), and `Roadmap.md` (designed-but-unwired). This file answers: **what actually works, and what is known to be broken?**

Last reviewed: 2026-09-25.

---

## Where to find things

| I want to… | Go to |
|---|---|
| Set up and run the app | `Readme.md` |
| Understand architecture and conventions | `Instructions.md` |
| Know what's designed but not built | `Roadmap.md` |
| See the full bug audit | `fixes.md` |
| See the original build plan (historical) | `Todo.md` |
| Log in as a test user | `Demo accounts.md` |

---

## Working today

Verified against the codebase as of the date above:

- **Auth** — email + password sign-in (`supabase.auth.signInWithPassword`), separate `/org/login` and `/login` flows, Supabase OTP for signup verification and password reset
- **Registration** — multi-step company (org) registration plus individual/employee registration, `zod`-validated
- **Approvals** — Super Admin approve/reject for companies and users
- **Dashboards** — admin (with read-only `country_rep` variant), company, and employee/individual
- **Public card pages** — `/[slug]` and `/[slug]/[employee]`, with vCard download via `src/app/api/vcf/[slug]/route.ts`
- **Card orders** — order flow with status tracking through to delivery
- **Invitations** — company admin generates one-time, 7-day invite links
- **Subscriptions** — manual Momo payment with screenshot upload and admin approval
- **Events** — any cardholder hosts a live event and runs the door from their own phone: NFC tap on Android (Web NFC), QR scan everywhere else. Entry/exit per visit, the 5-minute ambiguity prompt, auto-exit when the event closes, and XLSX attendance export for the host, their company admin, and the platform admin
- **Image uploads** — Cloudflare R2 via `src/lib/r2/upload.ts`
- **Middleware** — session refresh and role-based dashboard protection

---

## Known issues

### Events — documented behaviours, not defects

- **Deleting a host deletes their events and all attendance history.** `events.host_profile_id` cascades, matching how `cards` and `card_orders` already behave. If attendance must outlive its host, that needs a soft-delete path in `company.actions.ts` — separate work.
- **Attendance is snapshotted at check-in.** Name, phone, email, company, department and job title are copied onto the visit row when someone taps in. Later profile edits do not rewrite past attendance, and deleting an attendee's profile leaves the snapshot intact (`attendee_profile_id` goes null).
- **Exports never expire and are never stored.** The spreadsheet is generated on demand and streamed through an authenticated route, so there is no file to leak or reclaim. The original spec's 120-hour deletion was dropped deliberately: with nothing stored, a time limit would govern a file that never exists.
- **`country_rep` can view the event list but cannot export** — consistent with read-only everywhere else; export is data egress.
- **NFC requires Android Chrome.** Web NFC does not exist in iOS Safari or Firefox, so those hosts get camera scanning only. Android hosts are offered both.


### Security-relevant — read before exposing this app further

Re-checked on 2026-09-25. B4, B5 and H8 are **fixed**; the rest remain open. The 2026-09-25 audit in `fixes.md` adds new findings (`N1`…`N26`, `E1`…`E10`) — see its updated priority queue.

| ID | Status |
|---|---|
| **N15** | **OPEN — CRITICAL.** A fresh install cannot apply migration 022. `019` is empty, no SQL file creates `cards.whatsapp`, and `021` uses that column — so it aborts and the Events tables are never created. The documented setup path is broken. |
| **N1** | **OPEN.** A rejected subscription permanently blocks that company from ever subscribing again. |
| **N2** | **OPEN.** Account deletion swallows every error and is non-atomic — the likely cause of the "deleted user's email still exists" report. |
| **N6** | **OPEN.** `updateMyCard` can destroy a company, its departments and its subscription. |
| **B6** | Open — user enumeration, 3 vectors |
| **H5** | Open — no rate limiting anywhere |
| **H6** | Open — `/dev/components` is publicly reachable (E3) |
| **M10** | Open — raw Supabase error messages returned to clients |
| ~~B4~~ | **Fixed** — `resolveCompanyId` now role-checks (`src/lib/supabase/server.ts:79-84`) |
| ~~B5~~ | **Fixed** — all five listed endpoints verify ownership. A sixth member of the family remains open; see N6. |
| ~~H8~~ | **Fixed** — annual billing date now branches on `billing_cycle` |

**On H6 — confirmed directly:** `src/app/dev/components/page.tsx` is a live route in the deployed app. `src/middleware.ts` explicitly allows `/dev/` in `isPublicPath`, and its `config.matcher` only covers `/dashboard/:path*`, so middleware never runs for it at all. The page's own header says *"DELETE before Phase 15 (production launch)"*. It exposes a UI sandbox only — no user data — but it should not be public.

### Functional

`fixes.md` carries two audits. The first lists ~11 critical (B1–B11), 10 high (H1–H10) and 13 medium (M1–M13) findings; the 2026-09-25 audit adds 26 more (N1–N26) plus 10 environment findings (E1–E10). Highest-impact examples from the original list:

- **B1** Billing "Save changes" creates a duplicate plan instead of updating
- **B2** Billing deactivate/activate is cosmetic — never persisted
- **B7** Sign-in `redirect` param ignored — return-to-page flow is broken
- **B8** Password reset link flow is broken
- **H2** Subscription currency toggle stores an RWF amount as USD
- **H4** Client-supplied payment amounts are never validated server-side

Each audit ends with a **Priority Fix Queue**; the 2026-09-25 queue supersedes the earlier one. Read the queues with care — the first still lists B4 as open, and B4 is fixed.

### Type safety

`src/types/database.ts` exports `Database = any` — a deliberate stub so queries compile before the Supabase CLI is wired up. The file documents the intended replacement:

```bash
npx supabase gen types typescript --linked > src/types/supabase.ts
```

Note this is a real exception to `Instructions.md`'s "never use `any`" rule. There are 8 other `any`/`as any` sites in `src/`.

---

## Testing & CI

**There is no test framework and there is no CI.** No `vitest`/`jest`/`playwright` in `package.json`, no `.github/` directory, no `vercel.json`. Everything is verified manually.

This is the largest structural gap in the project: the bug list above exists precisely because there is no automated regression safety net. Adding E2E coverage for the critical flows (auth, registration, approvals, orders, payments) would be the highest-leverage investment available.

---

## Documentation drift

This set of docs was corrected on 2026-09-21. Previously, `Readme.md` and `Instructions.md` described several things that were not true of the code — among them a Next.js 14 stack (actually 16), passwordless-only auth (actually password-based), a Resend email integration (none), and a set of environment variable names that matched nothing. The unimplemented feature designs were moved out of `Instructions.md` into `Roadmap.md`.

**If you change how something works, update these documents in the same commit.** The failure mode this project already hit was aspirational design being read as current behaviour.

`Todo.md` remains stale by design — it is the original 15-phase plan and still references Next.js 14 and `tailwind.config.ts`. Treat it as history, not instructions.
