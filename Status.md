# EcoTap — Project Status

Read this alongside `Readme.md` (setup), `Instructions.md` (conventions), and `Roadmap.md` (designed-but-unwired). This file answers: **what actually works, and what is known to be broken?**

Last reviewed: 2026-09-21.

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
- **Image uploads** — Cloudflare R2 via `src/lib/r2/upload.ts`
- **Middleware** — session refresh and role-based dashboard protection

---

## Known issues

### Security-relevant — read before exposing this app further

These come from the `fixes.md` audit and are **not** independently re-verified here. Treat the severity as reported there.

| ID | Issue |
|---|---|
| **B4** | `resolveCompanyId` used without a role check — privilege escalation path |
| **B5** | Service-role writes without ownership verification — 5 endpoints |
| **B6** | User enumeration — 3 vectors |
| **H5** | No rate limiting anywhere in the app |
| **H6** | `/dev/components` is publicly reachable |
| **M10** | Raw Supabase error messages returned to clients |

**On H6 — confirmed directly:** `src/app/dev/components/page.tsx` is a live route in the deployed app. `src/middleware.ts` explicitly allows `/dev/` in `isPublicPath`, and its `config.matcher` only covers `/dashboard/:path*`, so middleware never runs for it at all. The page's own header says *"DELETE before Phase 15 (production launch)"*. It exposes a UI sandbox only — no user data — but it should not be public.

### Functional

`fixes.md` carries the full list: ~11 critical (B1–B11), 10 high (H1–H10) and 13 medium (M1–M13) findings, each with a described reproduction. Highest-impact examples:

- **B1** Billing "Save changes" creates a duplicate plan instead of updating
- **B2** Billing deactivate/activate is cosmetic — never persisted
- **B7** Sign-in `redirect` param ignored — return-to-page flow is broken
- **B8** Password reset link flow is broken
- **H2** Subscription currency toggle stores an RWF amount as USD
- **H4** Client-supplied payment amounts are never validated server-side

`fixes.md` ends with a 25-item **Priority Fix Queue** ordered by suggested sequence. Nothing in that queue is marked done.

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
