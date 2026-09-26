-- Migration: 019_employee_locks_and_whatsapp.sql
-- Description: Adds the per-company employee card locks (organization, job title,
-- card groups) and the separate WhatsApp number on cards. These four columns were
-- applied by hand to the live database and were missing from every SQL file in the
-- repo, which made 021 (SET whatsapp = c.phone) fail with
-- 'column "whatsapp" of relation "cards" does not exist' and abort the 011 -> 022 run.
-- This file was committed empty; it is reconstructed here.
-- Idempotent: a no-op against a database that already has the columns.
-- Date: 2026-08-08

-- 1. Company-level employee locks. theme_locked already exists; these three complete
--    the set that updateMyCard enforces and that updateMyCompany writes.
alter table companies
  add column if not exists org_locked       boolean not null default false,
  add column if not exists job_title_locked boolean not null default false,
  add column if not exists groups_locked    boolean not null default false;

comment on column companies.org_locked       is 'If true, employees cannot change their primary organization.';
comment on column companies.job_title_locked is 'If true, employees cannot change their job title.';
comment on column companies.groups_locked    is 'If true, employees cannot add or remove card affiliation groups.';

-- 2. Card WhatsApp number - separate from phone, falls back to phone when empty.
--    Backfilled by 021 step 6 (whatsapp = phone where empty).
alter table cards
  add column if not exists whatsapp text;

comment on column cards.whatsapp is 'Separate WhatsApp number. Falls back to phone when empty.';
