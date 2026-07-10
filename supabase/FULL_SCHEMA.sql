-- ================================================================
-- EcoTap — Complete Database Schema
-- Generated from individual migration files in supabase/migrations/
--
-- HOW TO USE:
--   Paste this entire file into the Supabase SQL Editor and run it.
--   It is safe to run from scratch on an empty database.
--   For incremental changes, use the individual migration files.
--
-- MIGRATIONS ORDER:
--   001 — Extensions
--   002 — Enums
--   003 — Identity tables (profiles, companies, departments, etc.)
--   004 — Cards & orders
--   005 — Analytics & ML tables (card_events, contact_exchanges, daily_card_stats,
--         profile_activity, card_scores, ab_test_assignments)
--   006 — Billing, notifications, environmental reports
--   007 — Indexes
--   008 — Triggers & functions
--   009 — Row Level Security policies
--   010 — Seed data
-- ================================================================


-- ============================================================
-- EcoTap Migration 001: Extensions
-- Run first. Enables UUID generation and pg_stat_statements.
-- ============================================================

-- UUID generation for all primary keys
create extension if not exists "uuid-ossp";

-- For future query performance analysis
create extension if not exists "pg_stat_statements";


-- ============================================================
-- EcoTap Migration 002: Enums
-- All custom enum types used across the schema.
-- ============================================================

-- User roles
create type user_role as enum (
  'super_admin',    -- Platform owner, full access
  'country_rep',    -- Regional rep, read-only admin dashboard
  'company_admin',  -- Legal rep of a company (CEO or HR)
  'employee',       -- Under a company subscription
  'individual'      -- Self-paying, full card control
);

-- General status used on profiles, companies, subscriptions
create type user_status as enum (
  'pending',
  'active',
  'suspended'
);

-- Physical card order lifecycle
create type order_status as enum (
  'pending',
  'approved',
  'shipped',
  'delivered'
);

-- Billing plan cycles
create type billing_cycle as enum (
  'monthly',
  'annual'
);

-- Company subscription state
create type subscription_status as enum (
  'active',
  'inactive',
  'cancelled',
  'pending_approval'
);

-- Invite link lifecycle
create type invitation_status as enum (
  'pending',
  'accepted',
  'expired'
);

-- Device type for analytics
create type device_type as enum (
  'mobile',
  'tablet',
  'desktop',
  'unknown'
);

-- Card event types for analytics (append-only telemetry)
create type card_event_type as enum (
  'view',             -- Card page opened
  'nfc_tap',          -- Arrived via NFC (?source=nfc)
  'qr_scan',          -- Arrived via QR (?source=qr)
  'vcf_download',     -- Save contact clicked
  'contact_exchange', -- Visitor submitted contact details
  'social_click',     -- Social link clicked
  'share'             -- Card shared (future)
);

-- Notification types
create type notification_type as enum (
  'pending_approval_company',
  'pending_approval_individual',
  'card_order_placed',
  'order_status_update'
);


-- ============================================================
-- EcoTap Migration 003: Core Identity Tables
-- profiles, companies, country_reps, departments
-- ============================================================

-- ----------------------------------------------------------
-- profiles
-- One row per Supabase auth user.
-- Created automatically by trigger on auth.users insert.
-- ----------------------------------------------------------
create table profiles (
  id            uuid primary key references auth.users(id) on delete cascade,
  role          user_role    not null default 'individual',
  status        user_status  not null default 'pending',
  username      text         not null unique,
  full_name     text         not null,
  email         text         not null unique,
  avatar_url    text,
  created_at    timestamptz  not null default now(),
  updated_at    timestamptz  not null default now(),

  constraint username_format check (username ~ '^[a-z0-9][a-z0-9\-]{1,48}[a-z0-9]$')
);

comment on table  profiles                is 'One row per auth user. Role and status drive all access control.';
comment on column profiles.role           is 'Determines dashboard access and theme control rights.';
comment on column profiles.status         is 'pending → active → suspended. Only active users can log in to dashboards.';
comment on column profiles.username       is 'Used in public card URLs. Lowercase alphanumeric + hyphens, 3–50 chars.';

-- ----------------------------------------------------------
-- companies
-- One row per registered company.
-- ----------------------------------------------------------
create table companies (
  id                   uuid        primary key default uuid_generate_v4(),
  name                 text        not null,
  slug                 text        not null unique,
  logo_url             text,
  brand_color          text        not null default '#064E3B',
  industry             text,
  website              text,
  size                 text,
  description          text,
  status               user_status not null default 'pending',

  -- Theme control: if true, employees cannot change their card theme_color
  theme_locked         boolean     not null default false,

  -- Legal rep confirmation captured at registration
  legal_rep_confirmed  boolean     not null default false,

  created_at           timestamptz not null default now(),
  updated_at           timestamptz not null default now(),

  constraint slug_format check (slug ~ '^[a-z0-9][a-z0-9\-]{1,48}[a-z0-9]$'),
  constraint brand_color_format check (brand_color ~ '^#[0-9a-fA-F]{6}$')
);

comment on table  companies                  is 'One per registered company. slug is used in public card URLs.';
comment on column companies.theme_locked     is 'If true, employees under this subscription cannot edit their card theme_color.';
comment on column companies.legal_rep_confirmed is 'Confirmed at registration. Legal declaration that the registrant is authorised.';

-- Migration 003b: Company social links
alter table companies add column if not exists social_links jsonb default '{}';
comment on column companies.social_links is 'Optional company-level social links (linkedin, twitter, website, etc.). Shared across all employees of this company.';

-- ----------------------------------------------------------
-- country_reps
-- Links a profile (country_rep role) to a country.
-- A country rep can only view users/companies in their country.
-- Cannot approve, reject, or modify anything.
-- ----------------------------------------------------------
create table country_reps (
  id           uuid        primary key default uuid_generate_v4(),
  profile_id   uuid        not null unique references profiles(id) on delete cascade,
  country_code text        not null,   -- ISO 3166-1 alpha-2 e.g. 'RW', 'UG', 'KE'
  country_name text        not null,
  created_at   timestamptz not null default now(),

  constraint country_code_format check (country_code ~ '^[A-Z]{2}$')
);

comment on table country_reps is 'One per country rep. Grants read-only access to admin dashboard filtered by country.';

-- ----------------------------------------------------------
-- departments
-- Groups employees within a company.
-- ----------------------------------------------------------
create table departments (
  id          uuid        primary key default uuid_generate_v4(),
  company_id  uuid        not null references companies(id) on delete cascade,
  name        text        not null,
  color       text,
  created_at  timestamptz not null default now(),

  unique (company_id, name)
);

comment on table departments is 'Organises employees within a company. Used for dashboard filtering.';

-- ----------------------------------------------------------
-- profile_companies (join table)
-- Many-to-many: a user can be linked to multiple companies.
-- is_primary = true → this company shows in the card top-right badge.
-- Any user can link to any company — no company approval required.
-- Company only controls the card if the employee is under their subscription.
-- ----------------------------------------------------------
create table profile_companies (
  id            uuid        primary key default uuid_generate_v4(),
  profile_id    uuid        not null references profiles(id) on delete cascade,
  company_id    uuid        not null references companies(id) on delete cascade,
  department_id uuid        references departments(id) on delete set null,
  job_title     text,
  is_primary    boolean     not null default false,
  created_at    timestamptz not null default now(),

  unique (profile_id, company_id)
);

comment on table  profile_companies            is 'Many-to-many between profiles and companies. is_primary drives the card badge.';
comment on column profile_companies.is_primary is 'The primary company shows in the top-right of the card. Only one per profile.';

-- Ensure only one primary company per profile
create unique index profile_companies_primary_unique
  on profile_companies (profile_id)
  where is_primary = true;

-- ----------------------------------------------------------
-- invitations
-- One-time-use invite links generated by company admins.
-- Token expires after 7 days and can only be used once.
-- ----------------------------------------------------------
create table invitations (
  id          uuid              primary key default uuid_generate_v4(),
  company_id  uuid              not null references companies(id) on delete cascade,
  created_by  uuid              not null references profiles(id),
  email       text,             -- Optional pre-fill for the registration form
  token       text              not null unique default encode(gen_random_bytes(32), 'hex'),
  status      invitation_status not null default 'pending',
  expires_at  timestamptz       not null default (now() + interval '7 days'),
  accepted_by uuid              references profiles(id),
  created_at  timestamptz       not null default now()
);

comment on table  invitations             is 'One-time invite links. Token is single-use and expires in 7 days.';
comment on column invitations.token       is 'Unique hex token included in the invite URL. 32 bytes = 64 hex chars.';
comment on column invitations.accepted_by is 'Set when an employee uses the link to register.';


-- ============================================================
-- EcoTap Migration 004: Cards & Orders
-- cards, card_designs, card_orders
-- ============================================================

-- ----------------------------------------------------------
-- card_designs
-- Physical NFC card designs — managed by Super Admin.
-- Separate from theme_color (which is the digital accent).
-- ----------------------------------------------------------
create table card_designs (
  id           uuid        primary key default uuid_generate_v4(),
  name         text        not null unique,
  description  text,
  preview_url  text,
  accent_color text        not null default '#064E3B',
  pattern      text        not null default 'dots',
  is_active    boolean     not null default true,
  created_at   timestamptz not null default now(),

  constraint accent_color_format check (accent_color ~ '^#[0-9a-fA-F]{6}$')
);

comment on table  card_designs           is 'Physical NFC card designs managed by Super Admin. Users choose one when ordering.';
comment on column card_designs.is_active is 'Only active designs are visible to users in the ordering flow.';

-- ----------------------------------------------------------
-- cards
-- One digital card per profile.
-- theme_color = digital accent (independent of physical design).
-- If primary company has theme_locked = true, theme_color cannot be edited.
-- ----------------------------------------------------------
create table cards (
  id           uuid        primary key default uuid_generate_v4(),
  profile_id   uuid        not null unique references profiles(id) on delete cascade,
  slug         text        not null unique,
  theme_color  text        not null default '#064E3B',
  bio          text,
  job_title    text,        -- Fallback if no primary company job_title
  phone        text,
  email_public text,        -- Shown on card; may differ from auth email
  social_links jsonb        not null default '{}',
  qr_url       text,
  is_public    boolean      not null default true,
  created_at   timestamptz  not null default now(),
  updated_at   timestamptz  not null default now(),

  constraint slug_format       check (slug ~ '^[a-z0-9][a-z0-9\-]{1,48}[a-z0-9]$'),
  constraint theme_color_format check (theme_color ~ '^#[0-9a-fA-F]{6}$')
);

comment on table  cards              is 'One digital card per profile. Slug = public URL segment.';
comment on column cards.theme_color  is 'Digital card accent colour. Editable unless primary company has theme_locked = true.';
comment on column cards.social_links is 'JSONB: {linkedin, twitter, whatsapp, instagram, website}. Validated in application layer.';
comment on column cards.email_public is 'The email shown on the public card page. May differ from auth email.';

-- Migration 004c: Organization display toggle
alter table cards add column if not exists show_organization boolean not null default false;
comment on column cards.show_organization is 'If true, the card shows the employee''s company, department, job title, and company social links.';

-- ----------------------------------------------------------
-- card_orders
-- A user orders physical NFC cards. Status is tracked to delivery.
-- Super Admin receives email notification on each new order.
-- ----------------------------------------------------------
create table card_orders (
  id               uuid         primary key default uuid_generate_v4(),
  profile_id       uuid         not null references profiles(id) on delete restrict,
  design_id        uuid         not null references card_designs(id) on delete restrict,
  quantity         int          not null check (quantity between 1 and 100),
  shipping_address jsonb        not null,
  status           order_status not null default 'pending',
  tracking_info    text,
  admin_notes      text,
  created_at       timestamptz  not null default now(),
  updated_at       timestamptz  not null default now()
);

comment on table  card_orders                 is 'Physical NFC card orders. Admin approves → ships → delivers.';
comment on column card_orders.shipping_address is 'JSONB: {street, city, country, postal_code?, notes?}.';
comment on column card_orders.admin_notes      is 'Internal notes added by Super Admin during processing.';

-- Migration 004b: Payment fields for MoMo Pay integration
alter table card_orders add column if not exists payment_screenshot_url text;
alter table card_orders add column if not exists payment_status         text not null default 'unpaid';
alter table card_orders add column if not exists payment_amount         integer;
alter table card_orders add column if not exists payment_currency       text not null default 'USD';
alter table card_orders add column if not exists momo_phone             text;

comment on column card_orders.payment_screenshot_url is 'R2 URL of the uploaded MoMo Pay / bank transfer screenshot.';
comment on column card_orders.payment_status         is 'unpaid → paid (screenshot uploaded) → verified (admin confirmed).';
comment on column card_orders.payment_amount         is 'Amount paid, in the currency specified by payment_currency.';
comment on column card_orders.payment_currency       is 'USD or RWF — chosen by the user at payment time.';
comment on column card_orders.momo_phone             is 'Phone number used for MoMo payment, if paid in RWF.';


-- ============================================================
-- EcoTap Migration 005: Analytics & ML Tables
-- card_events (append-only), contact_exchanges, daily_card_stats,
-- profile_activity, card_scores, ab_test_assignments
--
-- These tables are the foundation of all future analytics
-- and machine learning work. card_events is NEVER deleted.
-- ============================================================

-- ----------------------------------------------------------
-- card_events (append-only telemetry)
-- Every meaningful visitor action on a card page.
-- Fire-and-forget from the API — never blocks a page render.
-- NEVER delete rows from this table.
--
-- ML use cases enabled:
--   - Card performance over time (views, taps, downloads)
--   - NFC vs QR engagement split
--   - Geographic reach mapping
--   - Device and OS breakdown for UX decisions
--   - Referrer analysis (WhatsApp, LinkedIn, direct)
--   - Session depth and time on page
--   - Return visitor detection (visitor_id cookie)
--   - Social link click-through rates per platform
--   - Campaign attribution (UTM params)
--   - Feature vectors for recommendation engine
--   - Churn prediction (low engagement signals)
-- ----------------------------------------------------------
create table card_events (
  id             uuid            primary key default uuid_generate_v4(),
  card_id        uuid            not null references cards(id) on delete cascade,
  event_type     card_event_type not null,

  -- Session & visitor identification
  session_id        uuid,           -- Groups events from one visitor session
  visitor_id        uuid,           -- Anonymous, from cookie — enables return visit detection
  is_return_visitor boolean   not null default false,  -- Computed: true if visitor_id seen before for this card

  -- Traffic source
  source          text,           -- 'nfc' | 'qr' | 'direct' — clean source column for ML, orthogonal to event_type
  referrer       text,           -- HTTP Referer header
  utm_source     text,           -- e.g. 'whatsapp', 'linkedin'
  utm_medium     text,           -- e.g. 'social', 'qr'
  utm_campaign   text,           -- Campaign name for marketing attribution

  -- Device & browser
  device_type    device_type     not null default 'unknown',
  os             text,           -- 'ios' | 'android' | 'windows' | 'macos' | 'other'
  browser        text,           -- 'chrome' | 'safari' | 'firefox' | 'other'
  screen_resolution text,        -- e.g. '390x844', '1920x1080' — for device profiling and UX decisions

  -- Geo (from Vercel edge headers)
  country        text,           -- ISO 3166-1 alpha-2 e.g. 'RW'
  city           text,

  -- Event-specific data
  social_target  text,           -- For social_click: which platform was clicked
  duration_ms    int,            -- For view: time on page in milliseconds

  -- Immutable timestamp
  created_at     timestamptz     not null default now()
);

comment on table  card_events             is 'Append-only telemetry. Every visitor action on a card page. NEVER delete rows.';
comment on column card_events.session_id  is 'Groups events from one visitor session. Generated client-side or at API level.';
comment on column card_events.visitor_id         is 'Anonymous persistent ID from cookie. Enables return visitor detection across sessions.';
comment on column card_events.is_return_visitor  is 'Computed flag: true if this visitor_id has been seen before for this card. Set by application layer.';
comment on column card_events.source             is 'Clean source channel: nfc, qr, or direct. Orthogonal to event_type for ML feature engineering.';
comment on column card_events.screen_resolution  is 'Device screen dimensions e.g. 390x844. For device profiling and responsive design decisions.';
comment on column card_events.duration_ms        is 'Time on page in ms. Populated by a follow-up beacon event when the session ends.';

-- ----------------------------------------------------------
-- contact_exchanges
-- A visitor submits their contact details on a card page.
-- Includes optional message field for short notes.
-- Enriched with device and referrer metadata for ML feature engineering.
-- ----------------------------------------------------------
create table contact_exchanges (
  id             uuid        primary key default uuid_generate_v4(),
  card_id        uuid        not null references cards(id) on delete cascade,
  visitor_name   text        not null,
  visitor_email  text,
  visitor_phone  text,
  message        text,           -- Optional short note from the visitor
  event_id       uuid        references card_events(id) on delete set null,
  device_type    device_type not null default 'unknown',
  referrer       text,
  country        text,
  created_at     timestamptz not null default now(),

  constraint chk_has_contact_info check (
    visitor_email is not null or visitor_phone is not null
  )
);

comment on table  contact_exchanges           is 'Visitor contact submissions from public card pages.';
comment on column contact_exchanges.event_id  is 'Links to the card_events row for this session — enables full session context.';
comment on column contact_exchanges.message   is 'Optional short note left by the visitor (e.g. "Great meeting you at the conference!").';

-- Migration 005b: Visitor organization
alter table contact_exchanges add column if not exists visitor_organization text;
comment on column contact_exchanges.visitor_organization is 'Optional organization/company name provided by the visitor.';
comment on constraint chk_has_contact_info on contact_exchanges is 'Must have at least one of email or phone.';

-- ----------------------------------------------------------
-- daily_card_stats
-- Pre-aggregated daily rollups per card.
-- Computed nightly by a scheduled job (pg_cron or Supabase Edge Function).
-- Dashboard queries read from this table — never from raw card_events.
-- This keeps dashboards instant regardless of event volume.
-- ----------------------------------------------------------
create table daily_card_stats (
  id              uuid        primary key default uuid_generate_v4(),
  card_id         uuid        not null references cards(id) on delete cascade,
  date            date        not null,

  -- Event counts
  views           int         not null default 0,
  nfc_taps        int         not null default 0,
  qr_scans        int         not null default 0,
  vcf_downloads   int         not null default 0,
  exchanges       int         not null default 0,
  social_clicks   int         not null default 0,

  -- Derived metrics
  unique_visitors int         not null default 0,
  avg_duration_ms int,        -- Null if no duration data for the day
  top_country     text,       -- Most frequent visitor country that day

  created_at      timestamptz not null default now(),

  unique (card_id, date)
);

comment on table daily_card_stats is 'Nightly rollups per card per day. Read by dashboards. Never delete.';

-- ----------------------------------------------------------
-- profile_activity
-- Tracks user lifecycle events — logins, profile updates,
-- settings changes. Critical for churn prediction and
-- engagement scoring in ML models.
-- ----------------------------------------------------------
create table profile_activity (
  id            uuid        primary key default uuid_generate_v4(),
  profile_id    uuid        not null references profiles(id) on delete cascade,
  activity_type text        not null,  -- 'login' | 'profile_update' | 'settings_change' | 'card_edit' | 'order_placed'
  description   text,                  -- Human-readable summary e.g. 'Updated theme_color from #064E3B to #FF6B35'
  metadata      jsonb       not null default '{}',  -- Changed fields, previous values, context
  ip_address    text,                   -- For security auditing and geo-analysis
  user_agent    text,                   -- Browser/client info
  created_at    timestamptz not null default now()
);

comment on table  profile_activity               is 'User lifecycle events: logins, profile updates, settings changes. Foundation for churn prediction.';
comment on column profile_activity.activity_type is 'Event category: login, profile_update, settings_change, card_edit, order_placed.';
comment on column profile_activity.metadata      is 'Structured payload: changed fields, old/new values, session context.';

-- ----------------------------------------------------------
-- card_scores
-- Pre-computed ML scores per card. Updated periodically
-- by batch jobs — dashboards and recommendation engines
-- read from here instead of re-computing every time.
-- ----------------------------------------------------------
create table card_scores (
  id                uuid        primary key default uuid_generate_v4(),
  card_id           uuid        not null references cards(id) on delete cascade,
  engagement_score  numeric(5,2),          -- 0.00–100.00 composite score from views, taps, exchanges, shares
  quality_score     numeric(5,2),          -- 0.00–100.00 profile completeness, link validity, photo quality
  churn_risk_score  numeric(5,2),          -- 0.00–100.00 probability of disengagement in next 30 days
  influence_score   numeric(5,2),          -- 0.00–100.00 reach and virality score
  score_version     text        not null default 'v1',  -- Model version that produced these scores
  computed_at       timestamptz not null default now(),
  created_at        timestamptz not null default now(),

  unique (card_id, score_version)          -- One score row per model version per card
);

comment on table  card_scores                  is 'Pre-computed ML scores per card. Updated by batch jobs, read by dashboards.';
comment on column card_scores.engagement_score is 'Composite 0–100: weighted blend of view frequency, tap rate, exchange rate, share rate.';
comment on column card_scores.quality_score    is 'Composite 0–100: profile completeness, photo presence, link validity, bio length.';
comment on column card_scores.churn_risk_score is 'Probability 0–100 that the card owner will disengage within 30 days.';
comment on column card_scores.influence_score  is 'Reach and virality 0–100: unique visitors, geographic spread, shares.';
comment on column card_scores.score_version    is 'Model version identifier. Allows A/B comparison of scoring algorithms.';

-- ----------------------------------------------------------
-- ab_test_assignments
-- Tracks which A/B test variant each visitor saw.
-- Supports experiments on card designs, features, and CTAs.
-- ----------------------------------------------------------
create table ab_test_assignments (
  id            uuid        primary key default uuid_generate_v4(),
  test_id       text        not null,              -- Unique test identifier e.g. 'card_design_v2'
  variant       text        not null,              -- Variant name e.g. 'control', 'emerald_bg', 'rounded_corners'
  visitor_id    uuid,                              -- Anonymous visitor cookie ID (links to card_events.visitor_id)
  profile_id    uuid        references profiles(id) on delete cascade,  -- Null for anonymous visitors
  card_id       uuid        references cards(id) on delete cascade,     -- The card that was viewed
  metadata      jsonb       not null default '{}', -- Extra context: device, referrer, etc.
  converted     boolean,                           -- Did this visitor convert? (null = not yet known)
  created_at    timestamptz not null default now(),

  unique (test_id, visitor_id)                    -- One assignment per visitor per test
);

comment on table  ab_test_assignments           is 'A/B test variant assignments. Tracks which variant each visitor saw for each test.';
comment on column ab_test_assignments.test_id   is 'Unique test slug e.g. card_design_v2, cta_color_test.';
comment on column ab_test_assignments.variant   is 'Variant identifier: control, treatment_a, emerald_bg, etc.';
comment on column ab_test_assignments.converted is 'Conversion flag. Null = pending, true = converted, false = did not convert.';


-- ============================================================
-- EcoTap Migration 006: Billing, Notifications, Environmental Reports
-- billing_plans, company_subscriptions, notifications, environmental_reports
-- ============================================================

-- ----------------------------------------------------------
-- billing_plans
-- Pricing plans managed by Super Admin.
-- Price is in RWF (Rwandan Francs).
-- ----------------------------------------------------------
create table billing_plans (
  id                  uuid          primary key default uuid_generate_v4(),
  name                text          not null unique,
  billing_cycle       billing_cycle not null,
  price_per_employee  int           not null check (price_per_employee >= 0),
  is_active           boolean       not null default true,
  created_at          timestamptz   not null default now()
);

comment on table  billing_plans                    is 'Pricing plans in RWF. Managed by Super Admin.';
comment on column billing_plans.price_per_employee is 'Price per employee per billing cycle in RWF.';

-- ----------------------------------------------------------
-- company_subscriptions
-- Which plan a company is on and their current employee count.
-- employee_count drives billing calculations.
-- Subscriptions are created by company admins through the subscription flow
-- (with payment proof upload) and must be approved by a super admin.
-- ----------------------------------------------------------
create table company_subscriptions (
  id                     uuid                not null primary key default uuid_generate_v4(),
  company_id             uuid                not null unique references companies(id) on delete cascade,
  plan_id                uuid                not null references billing_plans(id) on delete restrict,
  status                 subscription_status not null default 'pending_approval',
  started_at             timestamptz         not null default now(),  -- Tenure start — critical for churn modeling
  employee_count         int                 not null default 0 check (employee_count >= 0),
  next_billing_date      date,

  -- Payment tracking (mirrors card_orders payment flow)
  payment_status         text                not null default 'unpaid',
  payment_screenshot_url text,
  payment_amount         integer,
  payment_currency       text                not null default 'RWF',

  created_at             timestamptz         not null default now(),
  updated_at             timestamptz         not null default now(),

  constraint chk_subscription_payment_status check (payment_status in ('unpaid', 'paid', 'verified'))
);

comment on table  company_subscriptions              is 'One subscription per company. employee_count drives billing.';
comment on column company_subscriptions.started_at   is 'When the subscription began. Used with current date to calculate tenure for churn prediction.';

-- ----------------------------------------------------------
-- notifications
-- Log of all notifications sent. Currently used for Super Admin email alerts.
-- Tracks both in-app read state and email delivery.
-- ----------------------------------------------------------
create table notifications (
  id          uuid              primary key default uuid_generate_v4(),
  profile_id  uuid              not null references profiles(id) on delete cascade,
  type        notification_type not null,
  title       text              not null,
  body        text              not null,
  is_read     boolean           not null default false,
  email_sent  boolean           not null default false,
  metadata    jsonb             not null default '{}',
  created_at  timestamptz       not null default now()
);

comment on table  notifications          is 'Notification log. Currently used for Super Admin approval and order alerts.';
comment on column notifications.metadata is 'Type-specific data e.g. {company_id, company_name} for approval notifications.';

-- ----------------------------------------------------------
-- environmental_reports
-- Monthly CO₂/water/waste calculations per company.
-- Stored permanently — not recomputed retroactively.
-- Email sent monthly via Resend.
--
-- Calculation constants (from INSTRUCTIONS.md):
--   paper_cards_avoided   = active_cards × (30 / 7 / 12)  ≈ 0.357 per card per month
--   co2_saved_grams       = paper_cards_avoided × 9
--   water_saved_litres    = (paper_cards_avoided × 0.00135) × 324
--   waste_avoided_grams   = paper_cards_avoided × 1.35
--   trees_saved           = paper_cards_avoided × 0.004
-- ----------------------------------------------------------
create table environmental_reports (
  id                    uuid        primary key default uuid_generate_v4(),
  company_id            uuid        not null references companies(id) on delete cascade,
  report_month          text        not null,  -- Format: YYYY-MM

  -- Inputs
  active_cards          int         not null default 0,
  cards_in_circulation  int         not null default 0,  -- Total physical cards ever ordered, not just active digital

  -- Monthly calculated values
  paper_cards_avoided   numeric(10,4) not null default 0,
  co2_saved_grams       numeric(10,2) not null default 0,
  water_saved_litres    numeric(10,2) not null default 0,
  waste_avoided_grams   numeric(10,4) not null default 0,
  trees_saved           numeric(10,6) not null default 0,

  -- Cumulative totals since the company joined EcoTap
  cumulative_co2_grams  numeric(12,2) not null default 0,
  cumulative_cards      numeric(10,2) not null default 0,

  -- Delivery tracking
  email_sent            boolean     not null default false,
  email_sent_at         timestamptz,
  created_at            timestamptz not null default now(),

  unique (company_id, report_month),
  constraint report_month_format check (report_month ~ '^\d{4}-(0[1-9]|1[0-2])$')
);

comment on table  environmental_reports                       is 'Monthly environmental impact per company. Stored permanently for trend analysis.';
comment on column environmental_reports.report_month          is 'YYYY-MM format. One row per company per month.';
comment on column environmental_reports.cards_in_circulation  is 'Total physical cards ever ordered across the platform. Tracks the full lifecycle, not just active digital cards.';
comment on column environmental_reports.cumulative_co2_grams  is 'Running total CO₂ saved since company joined. Used in the report email.';


-- ============================================================
-- EcoTap Migration 007: Indexes
-- Performance indexes for all frequently queried columns.
-- Run after all tables are created.
-- ============================================================

-- ----------------------------------------------------------
-- profiles
-- ----------------------------------------------------------
create index idx_profiles_username    on profiles (username);
create index idx_profiles_email       on profiles (email);
create index idx_profiles_role        on profiles (role);
create index idx_profiles_status      on profiles (status);
create index idx_profiles_role_status on profiles (role, status);

-- ----------------------------------------------------------
-- companies
-- ----------------------------------------------------------
create index idx_companies_slug       on companies (slug);
create index idx_companies_status     on companies (status);

-- ----------------------------------------------------------
-- profile_companies
-- ----------------------------------------------------------
create index idx_profile_companies_profile  on profile_companies (profile_id);
create index idx_profile_companies_company  on profile_companies (company_id);
create index idx_profile_companies_primary  on profile_companies (profile_id, is_primary);

-- ----------------------------------------------------------
-- cards
-- ----------------------------------------------------------
create index idx_cards_profile_id     on cards (profile_id);
create index idx_cards_slug           on cards (slug);
create index idx_cards_is_public      on cards (is_public);

-- ----------------------------------------------------------
-- card_orders
-- ----------------------------------------------------------
create index idx_card_orders_profile  on card_orders (profile_id);
create index idx_card_orders_status   on card_orders (status);
create index idx_card_orders_created  on card_orders (created_at desc);

-- ----------------------------------------------------------
-- card_events (high volume — needs careful indexing)
-- Do NOT add too many indexes — each one slows inserts.
-- These are the minimum needed for dashboard queries.
-- ----------------------------------------------------------
create index idx_card_events_card_id      on card_events (card_id);
create index idx_card_events_event_type   on card_events (event_type);
create index idx_card_events_created_at   on card_events (created_at desc);
create index idx_card_events_card_created on card_events (card_id, created_at desc);
create index idx_card_events_session      on card_events (session_id) where session_id is not null;
create index idx_card_events_visitor      on card_events (visitor_id) where visitor_id is not null;
create index idx_card_events_country      on card_events (country)    where country is not null;

-- ----------------------------------------------------------
-- daily_card_stats
-- ----------------------------------------------------------
create index idx_daily_stats_card_date on daily_card_stats (card_id, date desc);
create index idx_daily_stats_date      on daily_card_stats (date desc);

-- ----------------------------------------------------------
-- contact_exchanges
-- ----------------------------------------------------------
create index idx_exchanges_card_id    on contact_exchanges (card_id);
create index idx_exchanges_created    on contact_exchanges (created_at desc);

-- ----------------------------------------------------------
-- invitations
-- ----------------------------------------------------------
create index idx_invitations_token    on invitations (token);
create index idx_invitations_company  on invitations (company_id);
create index idx_invitations_status   on invitations (status);

-- ----------------------------------------------------------
-- notifications
-- ----------------------------------------------------------
create index idx_notifications_profile  on notifications (profile_id);
create index idx_notifications_unread   on notifications (profile_id, is_read) where is_read = false;

-- ----------------------------------------------------------
-- environmental_reports
-- ----------------------------------------------------------
create index idx_env_reports_company on environmental_reports (company_id);
create index idx_env_reports_month   on environmental_reports (report_month desc);

-- ----------------------------------------------------------
-- card_events (additional indexes for new columns)
-- ----------------------------------------------------------
create index idx_card_events_source     on card_events (source)     where source is not null;
create index idx_card_events_returning  on card_events (visitor_id, card_id) where is_return_visitor = true;

-- ----------------------------------------------------------
-- profile_activity
-- ----------------------------------------------------------
create index idx_profile_activity_profile     on profile_activity (profile_id);
create index idx_profile_activity_type        on profile_activity (activity_type);
create index idx_profile_activity_created     on profile_activity (created_at desc);
create index idx_profile_activity_profile_act on profile_activity (profile_id, activity_type, created_at desc);

-- ----------------------------------------------------------
-- card_scores
-- ----------------------------------------------------------
create index idx_card_scores_card         on card_scores (card_id);
create index idx_card_scores_engagement   on card_scores (engagement_score desc);
create index idx_card_scores_churn_risk   on card_scores (churn_risk_score desc);

-- ----------------------------------------------------------
-- ab_test_assignments
-- ----------------------------------------------------------
create index idx_ab_assignments_test      on ab_test_assignments (test_id);
create index idx_ab_assignments_visitor   on ab_test_assignments (visitor_id) where visitor_id is not null;
create index idx_ab_assignments_profile   on ab_test_assignments (profile_id) where profile_id is not null;
create index idx_ab_assignments_card      on ab_test_assignments (card_id);


-- ============================================================
-- EcoTap Migration 008: Triggers & Functions
-- Auto-created profile on signup, updated_at maintenance,
-- invitation expiry, and employee count sync.
-- ============================================================

-- ----------------------------------------------------------
-- Function: auto-create profiles row on auth.users insert
-- Fires when Supabase Auth creates a new user.
-- Role and username come from raw_user_meta_data set
-- during the registration server action.
-- ----------------------------------------------------------
create or replace function handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  _role text;
begin
  -- Sanitize role: only allow user-facing roles from signup metadata.
  -- super_admin and country_rep must be set manually by an existing super_admin.
  _role := coalesce(new.raw_user_meta_data->>'role', 'individual');
  if _role not in ('individual', 'employee', 'company_admin') then
    _role := 'individual';
  end if;

  insert into profiles (id, email, full_name, username, role, status)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', 'Unknown'),
    coalesce(new.raw_user_meta_data->>'username',  new.id::text),
    _role::user_role,
    'pending'  -- All new users start as pending
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function handle_new_user();

-- ----------------------------------------------------------
-- Function: maintain updated_at timestamps
-- Called by triggers on any table with an updated_at column.
-- ----------------------------------------------------------
create or replace function set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- Apply to profiles
create trigger profiles_updated_at
  before update on profiles
  for each row execute function set_updated_at();

-- Apply to companies
create trigger companies_updated_at
  before update on companies
  for each row execute function set_updated_at();

-- Apply to cards
create trigger cards_updated_at
  before update on cards
  for each row execute function set_updated_at();

-- Apply to card_orders
create trigger card_orders_updated_at
  before update on card_orders
  for each row execute function set_updated_at();

-- Apply to company_subscriptions
create trigger company_subscriptions_updated_at
  before update on company_subscriptions
  for each row execute function set_updated_at();

-- ----------------------------------------------------------
-- Function: auto-create card row when a profile goes active
-- Fires when profiles.status changes to 'active'.
-- Generates the slug from the profile username.
-- ----------------------------------------------------------
create or replace function handle_profile_activated()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  -- Only fire when status transitions to 'active'
  if old.status != 'active' and new.status = 'active' then
    -- Create the card if it doesn't already exist
    insert into cards (profile_id, slug, theme_color, email_public)
    values (
      new.id,
      new.username,           -- Slug = username by default
      '#064E3B',              -- Default emerald theme
      new.email
    )
    on conflict (profile_id) do nothing;
  end if;
  return new;
end;
$$;

create trigger on_profile_activated
  after update of status on profiles
  for each row execute function handle_profile_activated();

-- ----------------------------------------------------------
-- Function: create company when a company_admin is activated
-- Reads company metadata from auth.users raw_user_meta_data
-- and creates the company + subscription automatically.
-- ----------------------------------------------------------
create or replace function handle_company_admin_activated()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  _meta        jsonb;
  _company_name text;
  _slug        text;
  _industry    text;
  _size        text;
  _website     text;
  _company_id  uuid;
begin
  -- Only fire for company_admin role becoming active
  if new.role != 'company_admin' then
    return new;
  end if;
  if old.status != 'active' and new.status = 'active' then
    -- Read company metadata from auth.users
    select raw_user_meta_data into _meta
    from auth.users
    where id = new.id;

    _company_name := _meta->>'company_name';
    if _company_name is null or _company_name = '' then
      return new;  -- No company data stored; skip
    end if;

    -- Generate slug from company name
    _slug := lower(regexp_replace(_company_name, '[^a-zA-Z0-9]+', '-', 'g'));
    _slug := regexp_replace(_slug, '(^-|-$)', '', 'g');
    _slug := coalesce(nullif(_slug, ''), 'company-' || replace(new.id::text, '-', ''));

    _industry := _meta->>'industry';
    _size     := _meta->>'size';
    _website  := _meta->>'website';

    -- Create the company if it doesn't already exist (by name)
    insert into companies (name, slug, industry, size, website, status, legal_rep_confirmed)
    values (
      _company_name, _slug,
      nullif(_industry, ''),
      nullif(_size, ''),
      nullif(_website, ''),
      'active',  -- Auto-approved since admin already approved the profile
      coalesce((_meta->>'legal_rep_confirmed')::boolean, false)
    )
    on conflict (slug) do update
      set status = 'active'
      where companies.status = 'pending'
    returning id into _company_id;

    -- Link the admin to the company as primary
    if _company_id is not null then
      insert into profile_companies (profile_id, company_id, is_primary)
      values (new.id, _company_id, true)
      on conflict (profile_id, company_id) do nothing;

      -- NOTE: Subscription is NO LONGER auto-created here.
      -- The company admin must explicitly subscribe through the
      -- subscription flow at /dashboard/company/subscription/new
      -- with payment proof upload and admin verification.
    end if;
  end if;
  return new;
end;
$$;

create trigger on_company_admin_activated
  after update of status on profiles
  for each row execute function handle_company_admin_activated();

-- ----------------------------------------------------------
-- Function: expire invitations past their expiry date
-- Called periodically. Can be called from a Supabase Edge Function
-- on a cron schedule, or triggered manually.
-- ----------------------------------------------------------
create or replace function expire_invitations()
returns int
language plpgsql
security definer
set search_path = public
as $$
declare
  expired_count int;
begin
  update invitations
  set    status = 'expired'
  where  status = 'pending'
    and  expires_at < now();

  get diagnostics expired_count = row_count;
  return expired_count;
end;
$$;

-- ----------------------------------------------------------
-- Function: sync employee_count on company_subscriptions
-- Fires when a profile_companies row is inserted or deleted.
-- Keeps employee_count accurate for billing purposes.
-- ----------------------------------------------------------
create or replace function sync_employee_count()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  target_company_id uuid;
  active_count      int;
begin
  target_company_id := coalesce(new.company_id, old.company_id);

  -- Count active profiles linked to this company
  select count(*)
  into   active_count
  from   profile_companies pc
  join   profiles p on p.id = pc.profile_id
  where  pc.company_id = target_company_id
    and  p.status = 'active';

  -- Update the subscription employee count
  update company_subscriptions
  set    employee_count = active_count,
         updated_at     = now()
  where  company_id = target_company_id;

  return coalesce(new, old);
end;
$$;

create trigger sync_employee_count_on_insert
  after insert on profile_companies
  for each row execute function sync_employee_count();

create trigger sync_employee_count_on_delete
  after delete on profile_companies
  for each row execute function sync_employee_count();

-- ----------------------------------------------------------
-- Function: enforce single primary company per profile
-- Ensures only one profile_companies row has is_primary = true.
-- When a new primary is set, clears the old one first.
-- ----------------------------------------------------------
create or replace function enforce_single_primary_company()
returns trigger
language plpgsql
as $$
begin
  if new.is_primary = true then
    update profile_companies
    set    is_primary = false
    where  profile_id = new.profile_id
      and  id != new.id
      and  is_primary = true;
  end if;
  return new;
end;
$$;

create trigger enforce_primary_company_insert
  before insert on profile_companies
  for each row
  when (new.is_primary = true)
  execute function enforce_single_primary_company();

create trigger enforce_primary_company_update
  before update of is_primary on profile_companies
  for each row
  when (new.is_primary = true)
  execute function enforce_single_primary_company();


-- ============================================================
-- EcoTap Migration 009: Row Level Security (RLS)
-- Enables RLS on all tables and defines access policies.
-- All policies use auth.uid() and the profiles.role column.
-- ============================================================

-- ----------------------------------------------------------
-- Helper function: get current user's role
-- Used in RLS policies to avoid repeated subqueries.
-- ----------------------------------------------------------
create or replace function current_user_role()
returns user_role
language sql
security definer
stable
set search_path = public
as $$
  select role from profiles where id = auth.uid()
$$;

-- Helper: check if current user is super_admin
create or replace function is_super_admin()
returns boolean
language sql
security definer
stable
set search_path = public
as $$
  select exists (
    select 1 from profiles
    where id = auth.uid() and role = 'super_admin'
  )
$$;

-- Helper: check if current user is super_admin or country_rep
create or replace function is_admin_or_rep()
returns boolean
language sql
security definer
stable
set search_path = public
as $$
  select exists (
    select 1 from profiles
    where id = auth.uid() and role in ('super_admin', 'country_rep')
  )
$$;

-- Helper: get the company_id that the current user is admin of
create or replace function current_company_id()
returns uuid
language sql
security definer
stable
set search_path = public
as $$
  select pc.company_id
  from   profile_companies pc
  join   profiles p on p.id = pc.profile_id
  where  p.id = auth.uid()
    and  p.role = 'company_admin'
  limit 1
$$;

-- ----------------------------------------------------------
-- Enable RLS on all tables
-- ----------------------------------------------------------
alter table profiles               enable row level security;
alter table companies              enable row level security;
alter table country_reps           enable row level security;
alter table departments            enable row level security;
alter table profile_companies      enable row level security;
alter table invitations            enable row level security;
alter table cards                  enable row level security;
alter table card_designs           enable row level security;
alter table card_orders            enable row level security;
alter table card_events            enable row level security;
alter table contact_exchanges      enable row level security;
alter table daily_card_stats       enable row level security;
alter table billing_plans          enable row level security;
alter table company_subscriptions  enable row level security;
alter table notifications          enable row level security;
alter table environmental_reports  enable row level security;
alter table profile_activity       enable row level security;
alter table card_scores            enable row level security;
alter table ab_test_assignments    enable row level security;

-- ----------------------------------------------------------
-- profiles policies
-- ----------------------------------------------------------

-- Users can read their own profile
create policy "profiles: own read"
  on profiles for select
  using (auth.uid() = id);

-- Super admin and country reps can read all profiles
create policy "profiles: admin read all"
  on profiles for select
  using (is_admin_or_rep());

-- Company admins can read profiles of their employees
create policy "profiles: company admin read employees"
  on profiles for select
  using (
    exists (
      select 1 from profile_companies pc
      where  pc.company_id = current_company_id()
        and  pc.profile_id = profiles.id
    )
  );

-- Users can update their own profile (limited fields)
create policy "profiles: own update"
  on profiles for update
  using (auth.uid() = id)
  with check (
    -- Cannot change role or status via self-update
    role   = (select role   from profiles where id = auth.uid()) and
    status = (select status from profiles where id = auth.uid())
  );

-- Super admin can update any profile
create policy "profiles: super admin update"
  on profiles for update
  using (is_super_admin());

-- ----------------------------------------------------------
-- companies policies
-- ----------------------------------------------------------

-- Public: anyone can read active companies (for card display)
create policy "companies: public read active"
  on companies for select
  using (status = 'active');

-- Admins and reps read all companies
create policy "companies: admin read all"
  on companies for select
  using (is_admin_or_rep());

-- Company admins can read their own company
create policy "companies: own read"
  on companies for select
  using (id = current_company_id());

-- Company admins can update their own company (not status)
create policy "companies: own update"
  on companies for update
  using (id = current_company_id())
  with check (
    status = (select status from companies where id = current_company_id())
  );

-- Super admin can do everything on companies
create policy "companies: super admin all"
  on companies for all
  using (is_super_admin());

-- ----------------------------------------------------------
-- country_reps policies
-- ----------------------------------------------------------
create policy "country_reps: super admin all"
  on country_reps for all
  using (is_super_admin());

create policy "country_reps: own read"
  on country_reps for select
  using (profile_id = auth.uid());

-- ----------------------------------------------------------
-- departments policies
-- ----------------------------------------------------------
create policy "departments: company admin manage"
  on departments for all
  using (company_id = current_company_id());

create policy "departments: super admin all"
  on departments for all
  using (is_super_admin());

create policy "departments: member read"
  on departments for select
  using (
    exists (
      select 1 from profile_companies pc
      where  pc.company_id = departments.company_id
        and  pc.profile_id = auth.uid()
    )
  );

-- ----------------------------------------------------------
-- profile_companies policies
-- ----------------------------------------------------------

-- Users manage their own company associations
create policy "profile_companies: own manage"
  on profile_companies for all
  using (profile_id = auth.uid());

-- Company admins can read associations for their company
create policy "profile_companies: company admin read"
  on profile_companies for select
  using (company_id = current_company_id());

-- Company admins can delete associations for their employees
create policy "profile_companies: company admin delete"
  on profile_companies for delete
  using (company_id = current_company_id());

-- Super admin all access
create policy "profile_companies: super admin all"
  on profile_companies for all
  using (is_super_admin());

-- ----------------------------------------------------------
-- invitations policies
-- ----------------------------------------------------------
create policy "invitations: company admin manage"
  on invitations for all
  using (company_id = current_company_id());

create policy "invitations: public read by token"
  on invitations for select
  using (true);  -- Token validation done in application layer

create policy "invitations: super admin all"
  on invitations for all
  using (is_super_admin());

-- ----------------------------------------------------------
-- cards policies
-- ----------------------------------------------------------

-- Public: read any public card (for card page rendering)
create policy "cards: public read"
  on cards for select
  using (is_public = true);

-- Users manage their own card
create policy "cards: own manage"
  on cards for all
  using (profile_id = auth.uid());

-- Admins and reps can read all cards
create policy "cards: admin read all"
  on cards for select
  using (is_admin_or_rep());

-- Super admin full access
create policy "cards: super admin all"
  on cards for all
  using (is_super_admin());

-- ----------------------------------------------------------
-- card_designs policies
-- ----------------------------------------------------------

-- Anyone can read active designs (shown in order flow)
create policy "card_designs: public read active"
  on card_designs for select
  using (is_active = true);

-- Super admin manages all designs
create policy "card_designs: super admin all"
  on card_designs for all
  using (is_super_admin());

-- ----------------------------------------------------------
-- card_orders policies
-- ----------------------------------------------------------

-- Users see their own orders
create policy "card_orders: own read"
  on card_orders for select
  using (profile_id = auth.uid());

-- Users create their own orders
create policy "card_orders: own insert"
  on card_orders for insert
  with check (profile_id = auth.uid());

-- Users can update their own orders (e.g. attach payment screenshot)
create policy "card_orders: own update"
  on card_orders for update
  using (profile_id = auth.uid());

-- Super admin manages all orders
create policy "card_orders: super admin all"
  on card_orders for all
  using (is_super_admin());

-- Admins and reps can read all orders
create policy "card_orders: admin read"
  on card_orders for select
  using (is_admin_or_rep());

-- ----------------------------------------------------------
-- card_events policies
-- ----------------------------------------------------------

-- Public insert (fire-and-forget from API route — no auth required)
create policy "card_events: public insert"
  on card_events for insert
  with check (true);

-- Card owners can read events for their own cards
create policy "card_events: card owner read"
  on card_events for select
  using (
    exists (
      select 1 from cards
      where  cards.id = card_events.card_id
        and  cards.profile_id = auth.uid()
    )
  );

-- Admins and reps can read all events
create policy "card_events: admin read"
  on card_events for select
  using (is_admin_or_rep());

-- No delete, no update — append only
-- (Enforced by not creating those policies)

-- ----------------------------------------------------------
-- contact_exchanges policies
-- ----------------------------------------------------------

-- Public insert
create policy "contact_exchanges: public insert"
  on contact_exchanges for insert
  with check (true);

-- Card owners read exchanges for their cards
create policy "contact_exchanges: card owner read"
  on contact_exchanges for select
  using (
    exists (
      select 1 from cards
      where  cards.id = contact_exchanges.card_id
        and  cards.profile_id = auth.uid()
    )
  );

-- Company admins read exchanges for their employees' cards
create policy "contact_exchanges: company admin read"
  on contact_exchanges for select
  using (
    exists (
      select 1 from cards c
      join   profile_companies pc on pc.profile_id = c.profile_id
      where  c.id = contact_exchanges.card_id
        and  pc.company_id = current_company_id()
    )
  );

-- Admins and reps read all
create policy "contact_exchanges: admin read"
  on contact_exchanges for select
  using (is_admin_or_rep());

-- ----------------------------------------------------------
-- daily_card_stats policies
-- ----------------------------------------------------------
create policy "daily_card_stats: card owner read"
  on daily_card_stats for select
  using (
    exists (
      select 1 from cards
      where  cards.id = daily_card_stats.card_id
        and  cards.profile_id = auth.uid()
    )
  );

create policy "daily_card_stats: admin read"
  on daily_card_stats for select
  using (is_admin_or_rep());

create policy "daily_card_stats: super admin all"
  on daily_card_stats for all
  using (is_super_admin());

-- ----------------------------------------------------------
-- billing_plans policies
-- ----------------------------------------------------------
create policy "billing_plans: public read active"
  on billing_plans for select
  using (is_active = true);

create policy "billing_plans: admin read all"
  on billing_plans for select
  using (is_admin_or_rep());

create policy "billing_plans: super admin all"
  on billing_plans for all
  using (is_super_admin());

-- ----------------------------------------------------------
-- company_subscriptions policies
-- ----------------------------------------------------------
create policy "company_subscriptions: own read"
  on company_subscriptions for select
  using (company_id = current_company_id());

create policy "company_subscriptions: admin read all"
  on company_subscriptions for select
  using (is_admin_or_rep());

create policy "company_subscriptions: super admin all"
  on company_subscriptions for all
  using (is_super_admin());

-- ----------------------------------------------------------
-- notifications policies
-- ----------------------------------------------------------
create policy "notifications: own read"
  on notifications for select
  using (profile_id = auth.uid());

create policy "notifications: own update"
  on notifications for update
  using (profile_id = auth.uid());

create policy "notifications: super admin all"
  on notifications for all
  using (is_super_admin());

-- ----------------------------------------------------------
-- environmental_reports policies
-- ----------------------------------------------------------
create policy "environmental_reports: company read own"
  on environmental_reports for select
  using (company_id = current_company_id());

create policy "environmental_reports: admin read all"
  on environmental_reports for select
  using (is_admin_or_rep());

create policy "environmental_reports: super admin all"
  on environmental_reports for all
  using (is_super_admin());

-- ----------------------------------------------------------
-- profile_activity policies
-- ----------------------------------------------------------

-- Users can read their own activity
create policy "profile_activity: own read"
  on profile_activity for select
  using (profile_id = auth.uid());

-- Users can insert their own activity
create policy "profile_activity: own insert"
  on profile_activity for insert
  with check (profile_id = auth.uid());

-- Admins and reps can read all activity
create policy "profile_activity: admin read"
  on profile_activity for select
  using (is_admin_or_rep());

-- Super admin full access
create policy "profile_activity: super admin all"
  on profile_activity for all
  using (is_super_admin());

-- ----------------------------------------------------------
-- card_scores policies
-- ----------------------------------------------------------

-- Card owners can read their own scores
create policy "card_scores: card owner read"
  on card_scores for select
  using (
    exists (
      select 1 from cards
      where  cards.id = card_scores.card_id
        and  cards.profile_id = auth.uid()
    )
  );

-- Admins and reps can read all scores
create policy "card_scores: admin read"
  on card_scores for select
  using (is_admin_or_rep());

-- Super admin full access (including insert/update for batch score jobs)
create policy "card_scores: super admin all"
  on card_scores for all
  using (is_super_admin());

-- ----------------------------------------------------------
-- ab_test_assignments policies
-- ----------------------------------------------------------

-- Public insert (test assignment happens when visitor loads card — no auth required)
create policy "ab_test_assignments: public insert"
  on ab_test_assignments for insert
  with check (true);

-- Card owners can read test assignments for their own cards
create policy "ab_test_assignments: card owner read"
  on ab_test_assignments for select
  using (
    exists (
      select 1 from cards
      where  cards.id = ab_test_assignments.card_id
        and  cards.profile_id = auth.uid()
    )
  );

-- Admins and reps can read all test assignments
create policy "ab_test_assignments: admin read"
  on ab_test_assignments for select
  using (is_admin_or_rep());

-- Super admin full access
create policy "ab_test_assignments: super admin all"
  on ab_test_assignments for all
  using (is_super_admin());


-- ============================================================
-- EcoTap Migration 010: Seed Data
-- Initial data required for the platform to function.
-- Run after all other migrations.
-- DO NOT run in production without reviewing each insert.
-- ============================================================

-- ----------------------------------------------------------
-- Card designs (6 initial designs)
-- ----------------------------------------------------------
insert into card_designs (id, name, description, accent_color, pattern, is_active) values
  (
    'a1000000-0000-0000-0000-000000000001',
    'Classic Emerald',
    'Clean and professional. The signature EcoTap look.',
    '#064E3B', 'dots', true
  ),
  (
    'a1000000-0000-0000-0000-000000000002',
    'Midnight Dark',
    'Deep charcoal with subtle texture. Bold and modern.',
    '#1a1a2e', 'grid', true
  ),
  (
    'a1000000-0000-0000-0000-000000000003',
    'Royal Navy',
    'Deep navy with gold undertones. Confident and sharp.',
    '#1e3a5f', 'lines', true
  ),
  (
    'a1000000-0000-0000-0000-000000000004',
    'Terracotta',
    'Warm earthy tones. Stands out in the right way.',
    '#7c2d12', 'waves', true
  ),
  (
    'a1000000-0000-0000-0000-000000000005',
    'Sage & Stone',
    'Muted sage with warm cream. Calm and refined.',
    '#3d6b4f', 'minimal', false
  ),
  (
    'a1000000-0000-0000-0000-000000000006',
    'Obsidian',
    'Pure black with clean lines. Maximum impact.',
    '#0f0f0f', 'bold', false
  );

-- ----------------------------------------------------------
-- Billing plans (2 initial plans — prices in RWF)
-- ----------------------------------------------------------
insert into billing_plans (id, name, billing_cycle, price_per_employee, is_active) values
  (
    'b1000000-0000-0000-0000-000000000001',
    'Monthly Standard',
    'monthly',
    5000,    -- 5,000 RWF per employee per month
    true
  ),
  (
    'b1000000-0000-0000-0000-000000000002',
    'Annual Standard',
    'annual',
    50000,   -- 50,000 RWF per employee per year (~4,167/month — saves ~1 month)
    true
  );

-- ----------------------------------------------------------
-- Note on Super Admin account
-- ----------------------------------------------------------
-- The Super Admin account cannot be seeded here because it
-- requires a Supabase Auth user to exist first (the trigger
-- creates the profiles row from auth.users).
--
-- To create the Super Admin:
--   1. Register via the /register page or Supabase Auth dashboard
--   2. Manually update the profile role in the Supabase SQL editor:
--
--      update profiles
--      set role = 'super_admin', status = 'active'
--      where email = 'your-admin-email@ecotap.rw';
--
-- After that the admin can log in at /login and access /dashboard/admin
-- ----------------------------------------------------------

-- ============================================================
-- Migration 011: Card Groups (editable affiliations)
-- ============================================================

create table if not exists card_groups (
  id                uuid        primary key default uuid_generate_v4(),
  card_id           uuid        not null references cards(id) on delete cascade,
  organization_name text        not null,
  job_title         text,
  social_links      jsonb       not null default '{}'::jsonb,
  show_on_card      boolean     not null default true,
  sort_order        int         not null default 0,
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now(),

  unique (card_id, sort_order)
);

comment on table  card_groups                is 'Editable affiliation groups displayed on a card. Max 3 per card (enforced by application).';
comment on column card_groups.organization_name is 'The organization/affiliation name shown on the card.';
comment on column card_groups.job_title       is 'Role or position at this organization.';
comment on column card_groups.social_links    is 'JSONB: {linkedin, twitter, website}. Per-user social links for this group.';
comment on column card_groups.show_on_card    is 'Per-group toggle: show or hide this group on the card.';
comment on column card_groups.sort_order      is 'Display order: 0 = first group, 1-2 = additional groups.';

create index if not exists idx_card_groups_card on card_groups (card_id, sort_order);

drop trigger if exists card_groups_updated_at on card_groups;
create trigger card_groups_updated_at
  before update on card_groups
  for each row execute function set_updated_at();

alter table card_groups enable row level security;

drop policy if exists "card_groups: public read" on card_groups;
create policy "card_groups: public read"
  on card_groups for select
  using (
    exists (
      select 1 from cards
      where cards.id = card_groups.card_id
        and cards.is_public = true
    )
  );

drop policy if exists "card_groups: card owner manage" on card_groups;
create policy "card_groups: card owner manage"
  on card_groups for all
  using (
    exists (
      select 1 from cards
      where cards.id = card_groups.card_id
        and cards.profile_id = auth.uid()
    )
  );

drop policy if exists "card_groups: super admin all" on card_groups;
create policy "card_groups: super admin all"
  on card_groups for all
  using (is_super_admin());
-- ----------------------------------------------------------