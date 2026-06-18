-- ============================================================
-- EcoTap Migration 011: Card Groups (editable affiliations)
-- Each card can have up to 3 display groups, each with its
-- own toggle, job title, and social links.
-- ============================================================

-- 1. Create card_groups table
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

-- 2. Index for card page rendering
create index if not exists idx_card_groups_card on card_groups (card_id, sort_order);

-- 3. Trigger: maintain updated_at
drop trigger if exists card_groups_updated_at on card_groups;
create trigger card_groups_updated_at
  before update on card_groups
  for each row execute function set_updated_at();

-- 4. RLS policies for card_groups
alter table card_groups enable row level security;

-- Public: can read groups of public cards
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

-- Card owner: full CRUD on their own card's groups
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

-- Super admin: full access
drop policy if exists "card_groups: super admin all" on card_groups;
create policy "card_groups: super admin all"
  on card_groups for all
  using (is_super_admin());
