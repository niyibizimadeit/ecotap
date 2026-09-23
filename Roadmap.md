# EcoTap — Roadmap (designed, not yet wired up)

Features that are **designed and partly built but not connected to anything running**. Nothing in this document should be treated as describing current behaviour — see `Status.md` for what actually works today.

The distinction matters, so each section below states its real state.

---

## 1. Analytics & ML data strategy

### Current state: **schema and services built, telemetry not wired**

What exists:
- Tables `card_events`, `daily_card_stats`, `profile_activity`, `card_scores`, `ab_test_assignments` are all created by `FULL_SCHEMA.sql`
- `src/lib/supabase/analytics.repo.ts` — full read/write repository
- `src/lib/services/analytics.service.ts` — `recordCardEvent`, `getCardEvents`, `getCardEventCounts`, `getCardStats`, `computeCardScores`, `getCardScores{,History}`, `getUserActivity`, `logUserActivity`, `assignVisitorToTest`, `getTestResults`
- `src/types/index.ts` — all matching types

What does **not** exist:
- **No call sites.** `recordCardEvent` and every function above are referenced nowhere outside their own definitions.
- The only wired telemetry is `recordPageView` (`src/app/actions/analytics.actions.ts`), fired from `src/components/analytics/PageViewTracker.tsx`. It writes `event_type: "view"` with **hardcoded** `source: "direct"` and `device_type: "unknown"`.
- No `?source=nfc` / `?source=qr` parsing — so NFC vs QR attribution is not captured.
- No `vcf_download`, `social_click`, or `contact_exchange` events are emitted anywhere.
- No session/visitor cookies, no `x-vercel-ip-country` / `x-vercel-ip-city` geo capture, no user-agent parsing.
- **No nightly rollup job.** There is no `vercel.json`, no cron entry, and no API route that writes to `daily_card_stats` — the table is only ever read.

### Philosophy: capture everything from day one
Historical event data cannot be reconstructed. `card_events` is append-only and never deleted. Every meaningful visitor action on a card page should produce one row. As the business grows, this table becomes the foundation for:
- Card performance dashboards
- NFC vs QR split analysis
- Geographic reach mapping
- Recommendation engine (which card features drive the most exchanges)
- Churn prediction (companies with low card engagement)
- A/B testing card designs

### `card_events` — the intended core telemetry table

Every row is one discrete user action, captured server-side.

```sql
event_type values:
  'view'             -- card page opened
  'nfc_tap'          -- arrived via NFC (?source=nfc in URL)
  'qr_scan'          -- arrived via QR (?source=qr in URL)
  'vcf_download'     -- Save contact clicked
  'contact_exchange' -- visitor submitted their contact details
  'social_click'     -- a social link icon was clicked
  'share'            -- card share action (future)
```

### `daily_card_stats` — intended pre-aggregated rollups
A nightly job should compute daily totals per card and write to `daily_card_stats`. Dashboard queries then read from this table rather than the raw events table, keeping dashboards fast at any scale. **This job does not exist yet.**

### Intended event tracking pattern
Events are fire-and-forget — they must never block a page render or user action:

```ts
// Non-blocking — called but not awaited
recordCardEvent({
  card_id:     card.id,
  event_type:  'view',
  referrer:    headers().get('referer'),
  country:     headers().get('x-vercel-ip-country'),
  city:        headers().get('x-vercel-ip-city'),
  device_type: parseDevice(headers().get('user-agent')),
  // session_id and visitor_id come from cookies
}).catch(() => {}) // silently ignore — never surface to user
```

---

## 2. Environmental impact report

### Current state: **calculation built, delivery missing**

What exists:
- `ENV` constants and `calcMonthlyImpact()` in `src/constants/index.ts`
- `generateMonthlyReport`, `getCompanyReports`, `getLatestCompanyReport` in `src/lib/services/analytics.service.ts`
- `environmental_reports` table + repository methods
- The public marketing page at `/impact` (static figures, separate from the per-company calculation)

What does **not** exist:
- **No call sites** for `generateMonthlyReport` or `calcMonthlyImpact` — nothing triggers a report.
- **No scheduler.** No monthly job, cron, or queue runs the report per company.
- **No email delivery.** The intent was a monthly email per company; no email is sent by this system at all (see §3).
- No UI surfaces a company's own report.

### Industry-standard numbers used in calculations

| Metric | Value | Source |
|---|---|---|
| Weight of one paper business card | 1.35g | HiHello / Statistic Brain |
| CO₂ per paper card (full lifecycle) | 9g CO₂e | NexaLink industry analysis |
| Water to produce 1kg of paper | 324 litres | ShareEcard / EPA data |
| % of paper cards thrown away within 1 week | 88% | Multiple sources |
| % of paper cards ending up in landfill | 90% | ShareEcard |
| EcoTap recycled PVC NFC card lifespan | 7 years | Industry conservative estimate |
| Paper cards replaced per NFC card (lifespan) | ~30 reprints per person over 7 years | Cardynale / TapiLink research |
| Carbon footprint: 1 NFC card vs equivalent paper | 10× lower over lifetime | Industry research |

### How the report is calculated per company

For a company with N active employee cards, over the reporting month:

```
paper_cards_avoided   = N × (reprints_per_year / 12)
                      = N × (30 / 7 / 12)   ← ~0.36 per employee per month

co2_saved_kg          = paper_cards_avoided × 9g / 1000
water_saved_litres    = paper_cards_avoided × 1.35g / 1000 × 324
waste_avoided_grams   = paper_cards_avoided × 1.35g
trees_saved           = paper_cards_avoided × 0.004  ← industry: 1 tree per 250 cards
```

Report should also include:
- Cumulative totals since company joined EcoTap
- Year-to-date totals
- Equivalent comparisons ("equivalent to X cups of water", "X km driven in a car")

### Stored in `environmental_reports`
Every monthly report is persisted with the calculated values — not recomputed retroactively. This gives a historical record for trend analysis and ML.

---

## 3. Notifications & email

### Current state: **not implemented**

The application sends **no email of its own**. There is no `resend` dependency, no mail helper, and no email templates directory in `src/`.

What does exist is **Supabase Auth's built-in mailer**, used for signup verification codes and password resets. Its templates are checked in at `supabase/email-templates/*.html` (`confirm-signup.html`, `reset-password.html`) and are configured in the Supabase dashboard, not by application code.

### Intended notification triggers

| Trigger | Recipient | Channel |
|---|---|---|
| New company registration (pending) | Super Admin | Email |
| New individual registration (pending) | Super Admin | Email |
| New card order placed | Super Admin | Email |

Employees were not intended to receive notifications. Any future implementation needs both a provider decision and a sending path — note that Supabase Auth's mailer can only send auth-related mail, so transactional notifications require a separate provider.

---

## 4. Other built-but-unwired surfaces

These have full service/repo implementations and no call sites:

| Feature | Where it lives |
|---|---|
| Card scoring (`computeCardScores`, `getCardScores`) | `src/lib/services/analytics.service.ts` |
| A/B test assignment (`assignVisitorToTest`, `getTestResults`) | `src/lib/services/analytics.service.ts` |
| Visitor activity log (`getUserActivity`, `logUserActivity`) | `src/lib/services/analytics.service.ts` |

Before building any of these out, check the implementation first — much of the work is already done and just needs connecting.
