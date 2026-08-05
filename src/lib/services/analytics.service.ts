// ─────────────────────────────────────────────────────────────────────────────
// Analytics service — ML scoring, environmental reports, event processing.
// Ties together the analytics repository functions into business operations.
// Calls repositories only — never queries Supabase directly.
// ─────────────────────────────────────────────────────────────────────────────

import * as analyticsRepo from "@/lib/supabase/analytics.repo";
import * as cardsRepo from "@/lib/supabase/cards.repo";
import { calcMonthlyImpact, ENV } from "@/constants";
import type {
  ActionResult,
  CardEvent,
  CardScore,
  DailyCardStat,
  EnvironmentalReport,
  ProfileActivity,
  RecordEventPayload,
} from "@/types";

// ── Event recording ──────────────────────────────────────────────────────────

/**
 * Record a card event with return-visitor detection.
 * Checks if this visitor_id has been seen before for this card and
 * sets is_return_visitor accordingly.
 */
export async function recordCardEvent(
  payload: RecordEventPayload
): Promise<ActionResult<CardEvent>> {
  // If visitor_id is provided, check if they've visited this card before
  let isReturnVisitor = payload.is_return_visitor ?? false;

  if (payload.visitor_id && !isReturnVisitor) {
    // Query specifically for this visitor_id on this card — not just the most recent event.
    const existing = await analyticsRepo.getEventsByCardId(
      payload.card_id,
      9999 // Fetch enough events to reliably detect return visitors
    );
    isReturnVisitor = existing.some(
      (e) => e.visitor_id === payload.visitor_id
    );
  }

  const event = await analyticsRepo.recordEvent({
    ...payload,
    is_return_visitor: isReturnVisitor,
  });

  if (!event) return { success: false, error: "Failed to record event." };

  return { success: true, data: event };
}

// ── Card event queries ───────────────────────────────────────────────────────

export async function getCardEvents(
  cardId: string,
  limit?: number
): Promise<ActionResult<CardEvent[]>> {
  const events = await analyticsRepo.getEventsByCardId(cardId, limit);
  return { success: true, data: events };
}

export async function getCardEventCounts(
  cardId: string,
  since?: string
): Promise<ActionResult<Record<string, number>>> {
  const counts = await analyticsRepo.getEventCountByType(cardId, since);
  return { success: true, data: counts };
}

// ── Daily stats ──────────────────────────────────────────────────────────────

export async function getCardStats(
  cardId: string,
  days?: number
): Promise<ActionResult<DailyCardStat[]>> {
  const stats = await analyticsRepo.getDailyStats(cardId, days);
  return { success: true, data: stats };
}

// ── ML Scores ────────────────────────────────────────────────────────────────

/**
 * Compute and store engagement scores for a card.
 * Uses a simple weighted model — in production, this would be a
 * scheduled batch job calling a Python/ML inference endpoint.
 */
export async function computeCardScores(
  cardId: string
): Promise<ActionResult<CardScore>> {
  const card = await cardsRepo.getCardById(cardId);
  if (!card) return { success: false, error: "Card not found." };

  // Gather input features
  const [events, stats, profileActivity] = await Promise.all([
    analyticsRepo.getEventsByCardId(cardId, 100),
    analyticsRepo.getDailyStats(cardId, 30),
    analyticsRepo.getRecentLoginCount(card.profile_id, 30),
  ]);

  // ── Engagement score (0–100) ───────────────────────────────────────────
  // Weighted: view frequency (30pts), tap rate (25pts), exchange rate (25pts), share rate (20pts)
  // Normalise against a 30-day window with expected baseline: 1 view/day, 0.5 taps/day, etc.
  const viewCount = events.filter((e) => e.event_type === "view").length;
  const tapCount = events.filter((e) =>
    ["nfc_tap", "qr_scan"].includes(e.event_type)
  ).length;
  const exchangeCount = events.filter(
    (e) => e.event_type === "contact_exchange"
  ).length;
  const shareCount = events.filter((e) => e.event_type === "share").length;

  const days = Math.max(1, stats.length || 30);
  const viewsPerDay = viewCount / days;
  const tapsPerDay = tapCount / days;
  const exchangesPerDay = exchangeCount / days;
  const sharesPerDay = shareCount / days;

  // Score each dimension: saturate at ~3x the expected daily baseline
  const viewScore = Math.min(30, Math.round((viewsPerDay / 1) * 10));
  const tapScore = Math.min(25, Math.round((tapsPerDay / 0.5) * 8.33));
  const exchangeScore = Math.min(25, Math.round((exchangesPerDay / 0.3) * 8.33));
  const shareScore = Math.min(20, Math.round((sharesPerDay / 0.2) * 6.67));

  const engagementScore = viewScore + tapScore + exchangeScore + shareScore;

  // ── Quality score (0–100) ──────────────────────────────────────────────
  // Profile completeness heuristic
  let qualityScore = 0;
  if (card.bio && card.bio.length > 20) qualityScore += 20;
  if (card.job_title) qualityScore += 15;
  if (card.phone) qualityScore += 10;
  if (card.email_public) qualityScore += 10;
  if (card.social_links && Object.keys(card.social_links).length >= 3)
    qualityScore += 20;
  if (card.theme_color && card.theme_color !== "#064E3B") qualityScore += 5;
  // Bonus for having profile photo (from profile)
  qualityScore += 20; // Base completeness
  qualityScore = Math.min(100, qualityScore);

  // ── Churn risk (0–100) ────────────────────────────────────────────────
  // Higher = more likely to churn. Low engagement + low logins = high risk.
  const recentLogins = profileActivity;
  const loginRisk = recentLogins === 0 ? 40 : recentLogins < 2 ? 20 : 0;
  const engagementRisk = Math.max(0, 50 - engagementScore / 2);
  const profileRisk = qualityScore < 40 ? 20 : 0;
  const churnRiskScore = Math.min(100, loginRisk + engagementRisk + profileRisk);

  // ── Influence score (0–100) ───────────────────────────────────────────
  // Based on unique visitors, geographic spread, and social shares
  const uniqueVisitors = stats.reduce(
    (sum, s) => sum + s.unique_visitors,
    0
  );
  const visitorScore = Math.min(30, uniqueVisitors * 2);
  const socialShareScore = Math.min(30, shareCount * 5);
  const geoScore = stats.some((s) => s.top_country) ? 20 : 0;
  const influenceScore = Math.min(100, visitorScore + socialShareScore + geoScore + 20);

  // Store scores
  const scores = await analyticsRepo.upsertCardScores({
    card_id:          cardId,
    engagement_score: engagementScore,
    quality_score:    qualityScore,
    churn_risk_score: churnRiskScore,
    influence_score:  influenceScore,
    score_version:    "v1",
  });

  if (!scores) return { success: false, error: "Failed to store card scores." };

  return { success: true, data: scores };
}

export async function getLatestCardScores(
  cardId: string
): Promise<ActionResult<CardScore>> {
  const scores = await analyticsRepo.getLatestCardScore(cardId);
  if (!scores) return { success: false, error: "No scores computed yet." };
  return { success: true, data: scores };
}

export async function getCardScoreHistory(
  cardId: string,
  version?: string
): Promise<ActionResult<CardScore[]>> {
  const scores = await analyticsRepo.getCardScores(cardId, version);
  return { success: true, data: scores };
}

// ── Profile activity ─────────────────────────────────────────────────────────

export async function getUserActivity(
  profileId: string,
  limit?: number
): Promise<ActionResult<ProfileActivity[]>> {
  const activity = await analyticsRepo.getProfileActivity(profileId, limit);
  return { success: true, data: activity };
}

export async function logUserActivity(activity: {
  profile_id: string;
  activity_type: string;
  description?: string;
  metadata?: Record<string, unknown>;
  ip_address?: string;
  user_agent?: string;
}): Promise<ActionResult<ProfileActivity>> {
  const result = await analyticsRepo.recordProfileActivity(activity);
  if (!result) return { success: false, error: "Failed to log activity." };
  return { success: true, data: result };
}

// ── Environmental reports ────────────────────────────────────────────────────

/**
 * Generate and store a monthly environmental report for a company.
 */
export async function generateMonthlyReport(
  companyId: string,
  reportMonth: string,
  activeCards: number,
  cardsInCirculation: number,
  previousCumulativeCo2: number,
  previousCumulativeCards: number
): Promise<ActionResult<EnvironmentalReport>> {
  const impact = calcMonthlyImpact(activeCards);

  const report = await analyticsRepo.createEnvironmentalReport({
    company_id:           companyId,
    report_month:         reportMonth,
    active_cards:         activeCards,
    cards_in_circulation: cardsInCirculation,
    paper_cards_avoided:  impact.paper_cards_avoided,
    co2_saved_grams:      impact.co2_saved_grams,
    water_saved_litres:   impact.water_saved_litres,
    waste_avoided_grams:  impact.waste_avoided_grams,
    trees_saved:          impact.trees_saved,
    cumulative_co2_grams: previousCumulativeCo2 + impact.co2_saved_grams,
    cumulative_cards:     previousCumulativeCards + impact.paper_cards_avoided,
  });

  if (!report) return { success: false, error: "Failed to create environmental report." };

  return { success: true, data: report };
}

export async function getCompanyReports(
  companyId: string,
  months?: number
): Promise<ActionResult<EnvironmentalReport[]>> {
  const reports = await analyticsRepo.getEnvironmentalReports(companyId, months);
  return { success: true, data: reports };
}

export async function getLatestCompanyReport(
  companyId: string
): Promise<ActionResult<EnvironmentalReport>> {
  const report = await analyticsRepo.getLatestEnvironmentalReport(companyId);
  if (!report) return { success: false, error: "No reports found." };
  return { success: true, data: report };
}

// ── A/B testing ──────────────────────────────────────────────────────────────

export async function assignVisitorToTest(data: {
  test_id: string;
  variant: string;
  visitor_id?: string;
  profile_id?: string;
  card_id?: string;
}): Promise<ActionResult<{ variant: string }>> {
  const assignment = await analyticsRepo.assignTestVariant({
    test_id:    data.test_id,
    variant:    data.variant,
    visitor_id: data.visitor_id,
    profile_id: data.profile_id,
    card_id:    data.card_id,
  });

  if (!assignment) return { success: false, error: "Failed to assign test variant." };

  return { success: true, data: { variant: assignment.variant } };
}

export async function getTestResults(testId: string) {
  const assignments = await analyticsRepo.getTestAssignments(testId);

  // Group by variant
  const byVariant: Record<string, { total: number; converted: number }> = {};
  for (const a of assignments) {
    if (!byVariant[a.variant]) byVariant[a.variant] = { total: 0, converted: 0 };
    byVariant[a.variant].total++;
    if (a.converted === true) byVariant[a.variant].converted++;
  }

  const results = Object.entries(byVariant).map(([variant, stats]) => ({
    variant,
    total:     stats.total,
    converted: stats.converted,
    rate:      stats.total > 0 ? Math.round((stats.converted / stats.total) * 10000) / 100 : 0,
  }));

  return { success: true, data: { test_id: testId, results } };
}
