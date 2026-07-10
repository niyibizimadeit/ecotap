-- ============================================================
-- EcoTap Migration 017: Subscription Payment Flow
-- ============================================================
-- Adds payment tracking to company_subscriptions so the
-- subscription flow mirrors the card order flow:
--   Select plan → Pay (upload screenshot) → Admin verifies → Active
--
-- Also modifies the on_company_admin_activated trigger to NOT
-- auto-create subscriptions — subscription creation is now an
-- explicit user action through the new subscription flow.
-- ============================================================

-- 1. Add 'pending_approval' to subscription_status enum
--    The full status lifecycle is now:
--      pending_approval → active → inactive / cancelled
--    (existing rows keep their current status)
alter type subscription_status add value if not exists 'pending_approval';

-- 2. Add payment tracking columns to company_subscriptions
alter table company_subscriptions
  add column if not exists payment_status          text not null default 'unpaid',
  add column if not exists payment_screenshot_url  text,
  add column if not exists payment_amount          integer,
  add column if not exists payment_currency        text not null default 'RWF';

-- Add check constraint for payment_status values
do $$
begin
  if not exists (
    select 1 from pg_constraint
    where conname = 'chk_subscription_payment_status'
      and conrelid = 'company_subscriptions'::regclass
  ) then
    alter table company_subscriptions
      add constraint chk_subscription_payment_status
      check (payment_status in ('unpaid', 'paid', 'verified'));
  end if;
end $$;

comment on column company_subscriptions.payment_status         is 'unpaid → paid (screenshot uploaded) → verified (admin confirmed).';
comment on column company_subscriptions.payment_screenshot_url is 'R2 URL of the uploaded payment screenshot.';
comment on column company_subscriptions.payment_amount         is 'Amount paid, in the currency specified by payment_currency.';
comment on column company_subscriptions.payment_currency       is 'USD or RWF — chosen by the company admin at payment time.';

-- 3. Modify the on_company_admin_activated trigger:
--    Remove the auto-subscription creation. Subscriptions are now
--    created explicitly by the company admin through the new
--    subscription flow (with payment proof upload).
--    The trigger still creates the company + links the admin,
--    but no longer inserts into company_subscriptions.
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

-- Recreate the trigger (replace the old one)
drop trigger if exists on_company_admin_activated on profiles;
create trigger on_company_admin_activated
  after update of status on profiles
  for each row execute function handle_company_admin_activated();

-- 4. Add index for admin subscription queries
create index if not exists idx_subscriptions_status
  on company_subscriptions (status);
create index if not exists idx_subscriptions_payment_status
  on company_subscriptions (payment_status);

-- 5. Add RLS policy: company admins can insert subscriptions for their own company.
--    This is needed so the subscription flow doesn't require service-role bypass.
do $$
begin
  if not exists (
    select 1 from pg_policies
    where policyname = 'company_subscriptions: company admin insert'
      and tablename = 'company_subscriptions'
  ) then
    create policy "company_subscriptions: company admin insert"
      on company_subscriptions for insert
      with check (company_id = current_company_id());
  end if;

  if not exists (
    select 1 from pg_policies
    where policyname = 'company_subscriptions: company admin update own'
      and tablename = 'company_subscriptions'
  ) then
    create policy "company_subscriptions: company admin update own"
      on company_subscriptions for update
      using (company_id = current_company_id());
  end if;
end $$;
