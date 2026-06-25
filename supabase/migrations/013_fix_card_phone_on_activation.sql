-- ============================================================================
-- Migration 013: Populate card phone on activation
-- Fix: When a card is auto-created on profile activation, copy the user's
-- phone number from auth metadata into the card. This ensures the "My Card"
-- section shows the phone they provided during registration instead of blank.
-- ============================================================================

-- Drop the existing trigger first
drop trigger if exists on_profile_activated on profiles;

-- Updated function: copies phone from auth.users metadata into the new card
create or replace function handle_profile_activated()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  _phone text;
begin
  -- Only fire when status transitions to 'active'
  if old.status != 'active' and new.status = 'active' then
    -- Fetch phone from auth user metadata
    select raw_user_meta_data->>'phone'
    into _phone
    from auth.users
    where id = new.id;

    -- Create the card with all available registration data
    insert into cards (profile_id, slug, theme_color, email_public, phone)
    values (
      new.id,
      new.username,           -- Slug = username by default
      '#064E3B',              -- Default emerald theme
      new.email,
      _phone                  -- Phone from registration
    )
    on conflict (profile_id) do update set
      phone = coalesce(cards.phone, excluded.phone);
  end if;
  return new;
end;
$$;

-- Re-create the trigger
create trigger on_profile_activated
  after update of status on profiles
  for each row execute function handle_profile_activated();

-- ============================================================================
-- Backfill: Populate phone for all existing cards that are missing it.
-- Run this once to fix cards that were created before this migration.
-- ============================================================================
update cards c
set phone = (
  select raw_user_meta_data->>'phone'
  from auth.users u
  where u.id = c.profile_id
)
where c.phone is null
  and exists (
    select 1 from auth.users u
    where u.id = c.profile_id
      and u.raw_user_meta_data->>'phone' is not null
  );
