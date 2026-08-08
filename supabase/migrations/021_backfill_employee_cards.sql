-- Migration: 021_backfill_employee_cards.sql
-- Description: Pre-fill existing employee cards with their company's info.
-- Cards for invited/accepted employees should show the company and inherit
-- the company's brand color (if locked) and social links.
-- Date: 2026-08-08

-- 1. Make all employee cards public and show organization
UPDATE cards c
SET is_public = true,
    show_organization = true
FROM profile_companies pc
WHERE c.profile_id = pc.profile_id
  AND pc.is_primary = true
  AND (c.is_public = false OR c.show_organization = false);

-- 2. Copy company social links to employee cards (overwrites only if current is empty/no links)
UPDATE cards c
SET social_links = co.social_links
FROM profile_companies pc
JOIN companies co ON co.id = pc.company_id
WHERE c.profile_id = pc.profile_id
  AND pc.is_primary = true
  AND co.social_links IS NOT NULL
  AND co.social_links::text <> '{}'::text
  AND (
    c.social_links IS NULL
    OR c.social_links::text = '{}'::text
    OR (c.social_links->>'linkedin') IS NULL AND (c.social_links->>'twitter') IS NULL
      AND (c.social_links->>'website') IS NULL AND (c.social_links->>'whatsapp') IS NULL
      AND (c.social_links->>'instagram') IS NULL
  );

-- 3. Set theme_color to company brand_color for employees whose company has theme_locked
UPDATE cards c
SET theme_color = co.brand_color
FROM profile_companies pc
JOIN companies co ON co.id = pc.company_id
WHERE c.profile_id = pc.profile_id
  AND pc.is_primary = true
  AND co.theme_locked = true
  AND co.brand_color IS NOT NULL
  AND c.theme_color <> co.brand_color;

-- 4. Pre-fill employee cards with phone from auth.users metadata (collected at registration)
UPDATE cards c
SET phone = au.raw_user_meta_data->>'phone'
FROM profiles p
JOIN auth.users au ON au.id = p.id
WHERE c.profile_id = p.id
  AND EXISTS (
    SELECT 1 FROM profile_companies pc
    WHERE pc.profile_id = p.id AND pc.is_primary = true
  )
  AND (c.phone IS NULL OR c.phone = '')
  AND au.raw_user_meta_data->>'phone' IS NOT NULL
  AND au.raw_user_meta_data->>'phone' <> '';

-- 5. Pre-fill employee cards with email from profiles
UPDATE cards c
SET email_public = p.email
FROM profiles p
WHERE c.profile_id = p.id
  AND EXISTS (
    SELECT 1 FROM profile_companies pc
    WHERE pc.profile_id = p.id AND pc.is_primary = true
  )
  AND (c.email_public IS NULL OR c.email_public = '');

-- 6. Set whatsapp = phone for employees whose whatsapp is empty
UPDATE cards c
SET whatsapp = c.phone
FROM profile_companies pc
WHERE c.profile_id = pc.profile_id
  AND pc.is_primary = true
  AND (c.whatsapp IS NULL OR c.whatsapp = '')
  AND c.phone IS NOT NULL
  AND c.phone <> '';

-- 7. Activate any still-pending employee profiles that were invited and accepted
UPDATE profiles p
SET status = 'active'
FROM profile_companies pc
WHERE p.id = pc.profile_id
  AND p.status = 'pending'
  AND p.role = 'employee';
