-- ============================================================================
-- Migration 015: Organization debug helpers & RLS fixes
-- Adds functions to diagnose organization save issues and fixes any
-- remaining RLS gaps for individual users managing their card's org data.
-- ============================================================================

-- ----------------------------------------------------------
-- Helper: return all organization data for a given profile
-- Usage: SELECT * FROM debug_profile_org('profile-uuid-here');
-- ----------------------------------------------------------
create or replace function debug_profile_org(pid uuid)
returns table (
  section text,
  detail text,
  raw_data jsonb
)
language sql
security definer
stable
set search_path = public
as $$
  -- Card record
  select 'card', 'slug: ' || c.slug, to_jsonb(c)
  from cards c
  where c.profile_id = pid

  union all

  -- profile_companies links
  select 'profile_company', 'company: ' || coalesce(co.name, '?') || ' | is_primary: ' || pc.is_primary::text, to_jsonb(pc)
  from profile_companies pc
  left join companies co on co.id = pc.company_id
  where pc.profile_id = pid

  union all

  -- Companies linked to this profile
  select 'company', co.name || ' (status: ' || co.status || ')', to_jsonb(co)
  from companies co
  where exists (
    select 1 from profile_companies pc2
    where pc2.company_id = co.id and pc2.profile_id = pid
  )

  union all

  -- Card groups
  select 'card_group', cg.organization_name || ' (show: ' || cg.show_on_card::text || ')', to_jsonb(cg)
  from card_groups cg
  where exists (
    select 1 from cards c2
    where c2.id = cg.card_id and c2.profile_id = pid
  )
  order by 1, 2;
$$;

-- ----------------------------------------------------------
-- Ensure RLS is properly configured for all tables used in
-- organization save flow
-- ----------------------------------------------------------

-- departments: allow any authenticated user linked to a company to
-- read departments for that company (needed so the app can look up
-- existing departments before creating new ones)
drop policy if exists "departments: linked member read" on departments;
create policy "departments: linked member read"
  on departments for select
  using (
    exists (
      select 1 from profile_companies pc
      where pc.company_id = departments.company_id
        and pc.profile_id = auth.uid()
    )
  );

-- departments: allow members to insert departments for their own companies
-- (as a fallback for when the service role path isn't available)
drop policy if exists "departments: linked member insert" on departments;
create policy "departments: linked member insert"
  on departments for insert
  with check (
    exists (
      select 1 from profile_companies pc
      where pc.company_id = departments.company_id
        and pc.profile_id = auth.uid()
    )
  );

-- card_groups: ensure INSERT has explicit with check (in addition to using)
-- This duplicates the existing policy but makes the intent explicit.
-- The existing "card_groups: card owner manage" already handles this,
-- but we re-create with explicit with check for clarity.
drop policy if exists "card_groups: card owner manage" on card_groups;
create policy "card_groups: card owner manage"
  on card_groups for all
  using (
    exists (
      select 1 from cards
      where cards.id = card_groups.card_id
        and cards.profile_id = auth.uid()
    )
  )
  with check (
    exists (
      select 1 from cards
      where cards.id = card_groups.card_id
        and cards.profile_id = auth.uid()
    )
  );

-- Grant usage on the debug function to authenticated users
grant execute on function debug_profile_org(uuid) to authenticated;
