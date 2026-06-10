# EcoTap — Remaining Fixes & Recommendations

> **Last updated:** 2026-06-10
> **Fixed:** 34 of 41 issues resolved | **Build:** ✅ Zero errors, zero warnings

---

## Remaining Items

### Before Production

| # | Issue | File | Fix |
|---|-------|------|-----|
| 1 | **Database type is `any`** | `src/types/database.ts` | Run `npx supabase gen types typescript --linked > src/types/supabase.ts` and replace the stub |
| 2 | **Rate limiting** | All server actions | Add `@upstash/ratelimit` with Vercel KV. Priority: `signIn`, `signUp`, `verifyOtp`, `submitContactExchange` |
| 3 | **Server-side zod validation** | All actions | Add zod schemas to every server action. Currently only password and phone are validated server-side |
| 4 | **Modal accessibility** | `src/components/ui/Modal.tsx` | Add focus trap, `role="dialog"`, `aria-modal`, `aria-labelledby`/`aria-describedby`. Consider `@radix-ui/react-dialog` |
| 5 | **Sensitive data in activity log** | `src/lib/services/cards.service.ts:83-88` | Filter/redact `phone`, `email_public`, `social_links` from activity metadata |

### Nice To Have

| # | Issue | File | Fix |
|---|-------|------|-----|
| 6 | **Hardcoded `#064E3B` color** | 10+ files | Use `COLORS.emerald.deep` from constants or CSS variable |
| 7 | **Navbar scroll throttle** | `src/components/layout/Navbar.tsx` | Use `requestAnimationFrame`-based throttling |
| 8 | **ImageUpload not keyboard accessible** | `src/components/ui/ImageUpload.tsx` | Add `role="button"`, `tabIndex`, `onKeyDown` to upload area |
| 9 | **Card edit form uses `updateProfileRole`** | `profiles.repo.ts` | The function uses authenticated client but RLS protects it — add application-layer guard for clarity |
| 10 | **Country rep dashboard** | — | DB tables + RLS exist but no country-rep-specific UI |

### Frontend Wiring (Backend Exists, Frontend Missing)

| Feature | Backend Status | What's Missing |
|---------|---------------|----------------|
| Environmental Reports | DB + repo + service | Dashboard page with charts |
| Daily Card Stats | DB + repo | Analytics chart on dashboards |
| Card Scores (ML) | DB + repo + service | Score display, quality indicator |
| A/B Test Assignments | DB + repo | Test management UI, results |
| Notifications | DB + RLS | Notification bell, center, email |
| Invitations (TODO in UI) | DB + functions | Invite creation, email, accept flow |
| Department Management | DB + repo | Create/edit/assign UI |
| Company Public Page | `CompanyPublicPage.tsx` | Fetch from DB (currently uses props only) |

---

## ✅ Already Fixed (34 issues)

<details>
<summary>Click to expand full list of resolved issues</summary>

1. ✅ Privilege escalation — roles hardcoded server-side, DB trigger rejects elevated roles
2. ✅ Middleware dead code — `proxy.ts` renamed to `src/middleware.ts`
3. ✅ User creates active companies — now creates with `status: "pending"`
4. ✅ `getEventCountByType` — fixed broken query
5. ✅ Environmental report upsert — documented cumulative preservation
6. ✅ Error boundaries — added to `dashboard/` and `(auth)/`
7. ✅ ContactExchangeForm — checks server response, shows error
8. ✅ `/api/test` route — deleted
9. ✅ Password validation — server-side min 8 chars
10. ✅ Employee order history — wired to `getMyOrders()`
11. ✅ Design gallery — fetches from DB, MOCK_DESIGNS as fallback
12. ✅ Order success page — receives real order ID
13. ✅ VCF domain — uses `NEXT_PUBLIC_SITE_URL`
14. ✅ `formatDate` locale — accepts parameter
15. ✅ R2 env var guards — added `requireEnv()`
16. ✅ Duplicate `deletePlanAction` — removed
17. ✅ Input label association — `htmlFor`/`id` with `useId()`
18. ✅ `rejectUser` transition — added `canTransition` guard
19. ✅ signUpOrg company creation — DB trigger added
20. ✅ `slugify` — collapses consecutive hyphens
21. ✅ `generateKey` — uses `crypto.randomUUID()`
22. ✅ Button `aria-busy` — added with spinner `aria-hidden`
23. ✅ Duplicate Avatar — removed from Spinner.tsx, standalone file has all sizes
24. ✅ Skeleton — moved to own file
25. ✅ Phone number — made required in registration (client + server)
26. ✅ `markShipped` — uses shared `transitionOrderStatus` helper
27. ✅ Company dashboard — `React.cache()` deduplicates 5→1 Supabase calls
28. ✅ File validation — type + size checks on uploads
29. ✅ SaveContactButton — `setTimeout` cleanup on unmount
30. ✅ ImageUpload — `URL.revokeObjectURL` cleanup
31. ✅ Middleware cookie options — fixed forwarding
32. ✅ VCF N field — properly extracts last name
33. ✅ Spinner — added `role="status"` and `aria-label`
34. ✅ `formatDate` — configurable locale parameter

</details>
