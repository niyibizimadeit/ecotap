-- ============================================================================
-- Migration 016: Company admin activation trigger
-- When a company_admin profile is activated (pending → active), automatically:
--   1. Create the company from metadata stored on the auth user
--   2. Link the admin as primary member via profile_companies
--   3. Create a default "Monthly Standard" subscription
-- ============================================================================

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

    -- Create the company if it doesn't already exist (by name/slug).
    -- If the company was already created by signUpOrg() with status 'pending',
    -- this ON CONFLICT updates it to 'active'.
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

    -- Link the admin to the company as primary (if not already linked)
    if _company_id is not null then
      insert into profile_companies (profile_id, company_id, is_primary)
      values (new.id, _company_id, true)
      on conflict (profile_id, company_id) do nothing;

      -- Create default subscription (monthly standard plan)
      insert into company_subscriptions (company_id, plan_id, status)
      select _company_id, id, 'active'
      from billing_plans
      where name = 'Monthly Standard' and is_active = true
      limit 1;
    end if;
  end if;
  return new;
end;
$$;

-- ----------------------------------------------------------
-- Trigger: on_company_admin_activated
-- Fires after a profile's status is updated to 'active'
-- ----------------------------------------------------------
drop trigger if exists on_company_admin_activated on profiles;
create trigger on_company_admin_activated
  after update of status on profiles
  for each row execute function handle_company_admin_activated();
