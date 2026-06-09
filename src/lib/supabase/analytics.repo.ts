// ─────────────────────────────────────────────────────────────────────────────
// Analytics & ML repository — SSOT for all analytics/ML table queries.
// Covers: card_events, daily_card_stats, profile_activity, card_scores,
//         ab_test_assignments, environmental_reports.
// ─────────────────────────────────────────────────────────────────────────────

import { getSupabase } from "@/lib/supabase/server";
import type {
  CardEvent,
  DailyCardStat,
  ProfileActivity,
  CardScore,
  ABTestAssignment,
  EnvironmentalReport,
  RecordEventPayload,
} from "@/types";

// ── Card events (append-only telemetry) ──────────────────────────────────────

/**
 * Record a card event. Fire-and-forget — the API route should not
 * block the page render on this call. Errors are swallowed by design.
 */
export async function recordEvent(
  payload: RecordEventPayload
): Promise<CardEvent | null> {
  const supabase = await getSupabase();
  const { data } = await supabase
    .from("card_events")
    .insert({
      card_id:           payload.card_id,
      event_type:        payload.event_type,
      session_id:        payload.session_id ?? null,
      visitor_id:        payload.visitor_id ?? null,
      is_return_visitor: payload.is_return_visitor ?? false,
      source:            payload.source ?? null,
      referrer:          payload.referrer ?? null,
      device_type:       payload.device_type ?? "unknown",
      os:                payload.os ?? null,
      browser:           payload.browser ?? null,
      screen_resolution: payload.screen_resolution ?? null,
      country:           payload.country ?? null,
      city:              payload.city ?? null,
      utm_source:        payload.utm_source ?? null,
      utm_medium:        payload.utm_medium ?? null,
      utm_campaign:      payload.utm_campaign ?? null,
      social_target:     payload.social_target ?? null,
    })
    .select()
    .single();
  return data;
}

export async function getEventsByCardId(
  cardId: string,
  limit = 100
): Promise<CardEvent[]> {
  const supabase = await getSupabase();
  const { data } = await supabase
    .from("card_events")
    .select("*")
    .eq("card_id", cardId)
    .order("created_at", { ascending: false })
    .limit(limit);
  return data ?? [];
}

export async function getEventCountByType(
  cardId: string,
  since?: string
): Promise<Record<string, number>> {
  const supabase = await getSupabase();
  let query = supabase
    .from("card_events")
    .select("event_type, count")
    .eq("card_id", cardId);

  if (since) query = query.gte("created_at", since);

  const { data } = await query;
  const counts: Record<string, number> = {};
  for (const row of data ?? []) {
    counts[row.event_type] = Number(row.count);
  }
  return counts;
}

// ── Daily card stats (pre-aggregated rollups) ────────────────────────────────

export async function getDailyStats(
  cardId: string,
  days = 30
): Promise<DailyCardStat[]> {
  const supabase = await getSupabase();
  const { data } = await supabase
    .from("daily_card_stats")
    .select("*")
    .eq("card_id", cardId)
    .order("date", { ascending: false })
    .limit(days);
  return data ?? [];
}

export async function getStatsByDateRange(
  cardId: string,
  from: string,
  to: string
): Promise<DailyCardStat[]> {
  const supabase = await getSupabase();
  const { data } = await supabase
    .from("daily_card_stats")
    .select("*")
    .eq("card_id", cardId)
    .gte("date", from)
    .lte("date", to)
    .order("date", { ascending: false });
  return data ?? [];
}

// ── Profile activity (user lifecycle events) ─────────────────────────────────

export async function getProfileActivity(
  profileId: string,
  limit = 50
): Promise<ProfileActivity[]> {
  const supabase = await getSupabase();
  const { data } = await supabase
    .from("profile_activity")
    .select("*")
    .eq("profile_id", profileId)
    .order("created_at", { ascending: false })
    .limit(limit);
  return data ?? [];
}

export async function recordProfileActivity(activity: {
  profile_id: string;
  activity_type: string;
  description?: string;
  metadata?: Record<string, unknown>;
  ip_address?: string;
  user_agent?: string;
}): Promise<ProfileActivity | null> {
  const supabase = await getSupabase();
  const { data } = await supabase
    .from("profile_activity")
    .insert({
      profile_id:    activity.profile_id,
      activity_type: activity.activity_type,
      description:   activity.description ?? null,
      metadata:      activity.metadata ?? {},
      ip_address:    activity.ip_address ?? null,
      user_agent:    activity.user_agent ?? null,
    })
    .select()
    .single();
  return data;
}

/**
 * Get recent logins — count of 'login' events in the last N days.
 * Used by churn prediction models.
 */
export async function getRecentLoginCount(
  profileId: string,
  days = 30
): Promise<number> {
  const supabase = await getSupabase();
  const since = new Date(
    Date.now() - days * 24 * 60 * 60 * 1000
  ).toISOString();

  const { count } = await supabase
    .from("profile_activity")
    .select("*", { count: "exact", head: true })
    .eq("profile_id", profileId)
    .eq("activity_type", "login")
    .gte("created_at", since);

  return count ?? 0;
}

// ── Card scores (pre-computed ML scores) ─────────────────────────────────────

export async function getCardScores(
  cardId: string,
  version?: string
): Promise<CardScore[]> {
  const supabase = await getSupabase();
  let query = supabase
    .from("card_scores")
    .select("*")
    .eq("card_id", cardId)
    .order("computed_at", { ascending: false });

  if (version) query = query.eq("score_version", version);

  const { data } = await query;
  return data ?? [];
}

export async function getLatestCardScore(
  cardId: string
): Promise<CardScore | null> {
  const supabase = await getSupabase();
  const { data } = await supabase
    .from("card_scores")
    .select("*")
    .eq("card_id", cardId)
    .order("computed_at", { ascending: false })
    .limit(1)
    .single();
  return data;
}

export async function upsertCardScores(scores: {
  card_id: string;
  engagement_score?: number;
  quality_score?: number;
  churn_risk_score?: number;
  influence_score?: number;
  score_version?: string;
}): Promise<CardScore | null> {
  const supabase = await getSupabase();
  const { data } = await supabase
    .from("card_scores")
    .upsert({
      card_id:          scores.card_id,
      engagement_score: scores.engagement_score ?? null,
      quality_score:    scores.quality_score ?? null,
      churn_risk_score: scores.churn_risk_score ?? null,
      influence_score:  scores.influence_score ?? null,
      score_version:    scores.score_version ?? "v1",
      computed_at:      new Date().toISOString(),
    })
    .select()
    .single();
  return data;
}

// ── A/B test assignments ─────────────────────────────────────────────────────

export async function assignTestVariant(assignment: {
  test_id: string;
  variant: string;
  visitor_id?: string;
  profile_id?: string;
  card_id?: string;
  metadata?: Record<string, unknown>;
}): Promise<ABTestAssignment | null> {
  const supabase = await getSupabase();
  const { data } = await supabase
    .from("ab_test_assignments")
    .upsert(
      {
        test_id:    assignment.test_id,
        variant:    assignment.variant,
        visitor_id: assignment.visitor_id ?? null,
        profile_id: assignment.profile_id ?? null,
        card_id:    assignment.card_id ?? null,
        metadata:   assignment.metadata ?? {},
      },
      { onConflict: "test_id,visitor_id" }
    )
    .select()
    .single();
  return data;
}

export async function getTestAssignments(
  testId: string
): Promise<ABTestAssignment[]> {
  const supabase = await getSupabase();
  const { data } = await supabase
    .from("ab_test_assignments")
    .select("*")
    .eq("test_id", testId)
    .order("created_at", { ascending: false });
  return data ?? [];
}

export async function recordTestConversion(
  id: string,
  converted: boolean
): Promise<ABTestAssignment | null> {
  const supabase = await getSupabase();
  const { data } = await supabase
    .from("ab_test_assignments")
    .update({ converted })
    .eq("id", id)
    .select()
    .single();
  return data;
}

// ── Environmental reports ────────────────────────────────────────────────────

export async function getEnvironmentalReports(
  companyId: string,
  months = 12
): Promise<EnvironmentalReport[]> {
  const supabase = await getSupabase();
  const { data } = await supabase
    .from("environmental_reports")
    .select("*")
    .eq("company_id", companyId)
    .order("report_month", { ascending: false })
    .limit(months);
  return data ?? [];
}

export async function getLatestEnvironmentalReport(
  companyId: string
): Promise<EnvironmentalReport | null> {
  const supabase = await getSupabase();
  const { data } = await supabase
    .from("environmental_reports")
    .select("*")
    .eq("company_id", companyId)
    .order("report_month", { ascending: false })
    .limit(1)
    .single();
  return data;
}

export async function createEnvironmentalReport(report: {
  company_id: string;
  report_month: string;
  active_cards: number;
  cards_in_circulation?: number;
  paper_cards_avoided: number;
  co2_saved_grams: number;
  water_saved_litres: number;
  waste_avoided_grams: number;
  trees_saved: number;
  cumulative_co2_grams: number;
  cumulative_cards: number;
}): Promise<EnvironmentalReport | null> {
  const supabase = await getSupabase();
  const { data } = await supabase
    .from("environmental_reports")
    .upsert(
      {
        company_id:           report.company_id,
        report_month:         report.report_month,
        active_cards:         report.active_cards,
        cards_in_circulation: report.cards_in_circulation ?? 0,
        paper_cards_avoided:  report.paper_cards_avoided,
        co2_saved_grams:      report.co2_saved_grams,
        water_saved_litres:   report.water_saved_litres,
        waste_avoided_grams:  report.waste_avoided_grams,
        trees_saved:          report.trees_saved,
        cumulative_co2_grams: report.cumulative_co2_grams,
        cumulative_cards:     report.cumulative_cards,
      },
      { onConflict: "company_id,report_month" }
    )
    .select()
    .single();
  return data;
}
