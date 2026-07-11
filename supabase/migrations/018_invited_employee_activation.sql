-- Migration 018: Auto-activate invited employees
-- When a user signs up with role='employee' and a valid invite_token,
-- set their status to 'active' immediately (bypass admin approval).
-- This triggers handle_profile_activated() which auto-creates their card.

create or replace function handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  _role text;
  _invite_token text;
  _invitation_record record;
begin
  -- Sanitize role: only allow user-facing roles from signup metadata.
  -- super_admin and country_rep must be set manually by an existing super_admin.
  _role := coalesce(new.raw_user_meta_data->>'role', 'individual');
  if _role not in ('individual', 'employee', 'company_admin') then
    _role := 'individual';
  end if;

  -- Check if user was invited: look for the invite token in metadata
  _invite_token := new.raw_user_meta_data->>'invite_token';

  if _invite_token is not null and _role = 'employee' then
    -- Validate the invite token exists and is still pending
    select * into _invitation_record
    from invitations
    where token = _invite_token
      and status = 'pending'
      and expires_at > now();

    if found then
      -- Invited employee: activate immediately, no admin approval needed.
      -- This fires handle_profile_activated() which creates the cards row.
      insert into profiles (id, email, full_name, username, role, status)
      values (
        new.id,
        new.email,
        coalesce(new.raw_user_meta_data->>'full_name', 'Unknown'),
        coalesce(new.raw_user_meta_data->>'username',  new.id::text),
        _role::user_role,
        'active'
      );
      return new;
    end if;
  end if;

  -- Default: pending status for non-invited users
  insert into profiles (id, email, full_name, username, role, status)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', 'Unknown'),
    coalesce(new.raw_user_meta_data->>'username',  new.id::text),
    _role::user_role,
    'pending'
  );
  return new;
end;
$$;
