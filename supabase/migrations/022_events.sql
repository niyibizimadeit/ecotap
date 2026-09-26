-- ============================================================
-- EcoTap Migration 022: Events (live check-in)
-- ============================================================
-- A cardholder hosts a live event and runs the door from their
-- own phone — tapping attendees' NFC cards (Android) or scanning
-- their profile QR codes (iPhone) — recording entry and exit,
-- then exporting attendance as a spreadsheet.
--
-- Design notes:
--   * One row per VISIT, not per person. A tap after a recorded
--     exit starts a brand new visit row.
--   * Attendee display fields are SNAPSHOT at entry time and
--     never mutated. Attendance is a historical record: a later
--     job-title change must not rewrite an earlier sheet, and
--     deleting a profile must not blank past attendance.
--   * No export artefact is stored anywhere. Spreadsheets are
--     generated on demand, so there is nothing to expire.
-- ============================================================

-- ----------------------------------------------------------
-- events
-- ----------------------------------------------------------
create table if not exists events (
  id                 uuid        primary key default uuid_generate_v4(),
  host_profile_id    uuid        not null references profiles(id) on delete cascade,
  title              text        not null,
  venue              text,
  scheduled_start_at timestamptz not null default now(),
  starts_at          timestamptz,
  ends_at            timestamptz,
  status             text        not null default 'scheduled',
  created_at         timestamptz not null default now(),
  updated_at         timestamptz not null default now(),

  constraint chk_events_status
    check (status in ('scheduled', 'live', 'closed', 'cancelled')),
  constraint chk_events_title_not_blank
    check (btrim(title) <> ''),
  constraint chk_events_ends_after_start
    check (ends_at is null or starts_at is null or ends_at >= starts_at)
);

comment on table  events is 'Live events hosted by a cardholder. At most one live event per host, enforced by a partial unique index.';
comment on column events.host_profile_id    is 'The cardholder running the door. Any active non-rep profile can host.';
comment on column events.status             is 'scheduled -> live -> closed | cancelled. Set only through the service layer.';
comment on column events.scheduled_start_at is 'Host-supplied date/time. Display label only — going live is always a manual action.';
comment on column events.starts_at          is 'Set when the host goes live. Null while scheduled.';
comment on column events.ends_at            is 'Set on close/cancel. Visits still open are stamped with this as their exit time.';
comment on column events.venue              is 'Optional free-text location, display only.';

-- One live event per host. This is the hard guarantee behind the
-- "starting a second event means closing the first" rule.
create unique index if not exists events_one_live_per_host
  on events (host_profile_id)
  where status = 'live';

create index if not exists idx_events_host_created
  on events (host_profile_id, created_at desc);

create index if not exists idx_events_status_created
  on events (status, created_at desc);

-- ----------------------------------------------------------
-- event_visits — one row per VISIT, not per person
-- ----------------------------------------------------------
create table if not exists event_visits (
  id                  uuid        primary key default uuid_generate_v4(),
  event_id            uuid        not null references events(id) on delete cascade,
  attendee_profile_id uuid        references profiles(id) on delete set null,
  attendee_card_id    uuid        references cards(id)    on delete set null,

  -- Snapshot taken at entry time. Never mutated afterwards.
  full_name           text        not null,
  phone               text,
  email               text,
  company_name        text,
  department          text,
  job_title           text,

  entry_at            timestamptz not null default now(),
  exit_at             timestamptz,
  exit_source         text,
  check_in_method     text,
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now(),

  constraint chk_event_visits_exit_after_entry
    check (exit_at is null or exit_at >= entry_at),
  constraint chk_event_visits_exit_source
    check (exit_source is null or exit_source in ('manual', 'auto_close', 'auto_cancel')),
  constraint chk_event_visits_method
    check (check_in_method is null or check_in_method in ('nfc', 'qr'))
);

comment on table  event_visits is 'One row per visit. Entry and exit are the same tap action; a tap after a recorded exit starts a new visit.';
comment on column event_visits.attendee_profile_id is 'Nullable and ON DELETE SET NULL — removing an attendee must never delete attendance history.';
comment on column event_visits.exit_at             is 'Null while the attendee is still inside. Stamped with the event end time on close/cancel.';
comment on column event_visits.exit_source         is 'manual (host confirmed or auto-past-5min), auto_close, auto_cancel.';
comment on column event_visits.company_name        is 'SNAPSHOT at entry. Always the attendee''s own primary company, cross-company included.';
comment on column event_visits.job_title           is 'SNAPSHOT. profile_companies.job_title, falling back to cards.job_title.';
comment on column event_visits.check_in_method     is 'nfc or qr — which reader recorded this visit.';

-- THE concurrency guard: at most one open visit per attendee per
-- event. A double-tap that races two requests makes the second
-- insert fail with 23505 instead of creating a duplicate entry.
create unique index if not exists event_visits_one_open_per_attendee
  on event_visits (event_id, attendee_profile_id)
  where exit_at is null and attendee_profile_id is not null;

-- "Who is inside right now" for the door screen.
create index if not exists idx_event_visits_event_open
  on event_visits (event_id, entry_at desc)
  where exit_at is null;

-- Export read path: all visits for one event, entry order.
create index if not exists idx_event_visits_event_entry
  on event_visits (event_id, entry_at asc);

-- ----------------------------------------------------------
-- updated_at triggers
-- ----------------------------------------------------------
drop trigger if exists events_updated_at on events;
create trigger events_updated_at
  before update on events
  for each row execute function set_updated_at();

drop trigger if exists event_visits_updated_at on event_visits;
create trigger event_visits_updated_at
  before update on event_visits
  for each row execute function set_updated_at();

-- ----------------------------------------------------------
-- Row Level Security
-- ----------------------------------------------------------
alter table events       enable row level security;
alter table event_visits enable row level security;

do $$
begin
  -- ── events ─────────────────────────────────────────────
  if not exists (select 1 from pg_policies
    where policyname = 'events: host read own' and tablename = 'events') then
    create policy "events: host read own" on events for select
      using (host_profile_id = auth.uid());
  end if;

  if not exists (select 1 from pg_policies
    where policyname = 'events: host insert own' and tablename = 'events') then
    create policy "events: host insert own" on events for insert
      with check (host_profile_id = auth.uid());
  end if;

  -- with check prevents a host reassigning host_profile_id to someone else
  if not exists (select 1 from pg_policies
    where policyname = 'events: host update own' and tablename = 'events') then
    create policy "events: host update own" on events for update
      using (host_profile_id = auth.uid())
      with check (host_profile_id = auth.uid());
  end if;

  -- Company admin reads events hosted by their PRIMARY-company members.
  -- The is_primary filter is load-bearing: any user may add any company
  -- to their card without approval, so scoping to non-primary links
  -- would let anyone expose their events to an arbitrary company admin.
  if not exists (select 1 from pg_policies
    where policyname = 'events: company admin read employees' and tablename = 'events') then
    create policy "events: company admin read employees" on events for select
      using (
        exists (
          select 1 from profile_companies pc
          where pc.profile_id = events.host_profile_id
            and pc.company_id = current_company_id()
            and pc.is_primary = true
        )
      );
  end if;

  if not exists (select 1 from pg_policies
    where policyname = 'events: admin read all' and tablename = 'events') then
    create policy "events: admin read all" on events for select
      using (is_admin_or_rep());
  end if;

  -- ── event_visits ───────────────────────────────────────
  if not exists (select 1 from pg_policies
    where policyname = 'event_visits: host manage own event' and tablename = 'event_visits') then
    create policy "event_visits: host manage own event" on event_visits for all
      using (exists (select 1 from events e
                     where e.id = event_visits.event_id and e.host_profile_id = auth.uid()))
      with check (exists (select 1 from events e
                     where e.id = event_visits.event_id and e.host_profile_id = auth.uid()));
  end if;

  if not exists (select 1 from pg_policies
    where policyname = 'event_visits: company admin read employees' and tablename = 'event_visits') then
    create policy "event_visits: company admin read employees" on event_visits for select
      using (
        exists (
          select 1 from events e
          join profile_companies pc on pc.profile_id = e.host_profile_id
          where e.id = event_visits.event_id
            and pc.company_id = current_company_id()
            and pc.is_primary = true
        )
      );
  end if;

  if not exists (select 1 from pg_policies
    where policyname = 'event_visits: admin read all' and tablename = 'event_visits') then
    create policy "event_visits: admin read all" on event_visits for select
      using (is_admin_or_rep());
  end if;
end $$;
