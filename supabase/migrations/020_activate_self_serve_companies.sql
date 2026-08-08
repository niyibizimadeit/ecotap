-- Migration: 020_activate_self_serve_companies.sql
-- Description: Activate companies that were created by individuals/employees
-- via the profile editor (not via org registration). These have no company_admin
-- to approve them and don't need approval — they are just display labels.
-- Date: 2026-08-08

-- Activate pending companies that have no company_admin profile linked.
-- Only org-registered companies (via signUpOrg) have a linked company_admin.
UPDATE companies
SET status = 'active'
WHERE status = 'pending'
  AND id NOT IN (
    SELECT DISTINCT pc.company_id
    FROM profile_companies pc
    JOIN profiles p ON p.id = pc.profile_id
    WHERE p.role = 'company_admin'
  );

-- Also fix: company admins whose profile_companies link failed due to
-- trigger timing race (profile row not created yet when insert ran).
-- This creates the missing links by matching the company_name from
-- the admin's signUpOrg user_metadata to the actual company record.
INSERT INTO profile_companies (profile_id, company_id, is_primary)
SELECT p.id, c.id, true
FROM profiles p
JOIN auth.users u ON u.id = p.id
JOIN companies c ON LOWER(c.name) = LOWER(u.raw_user_meta_data->>'company_name')
WHERE p.role = 'company_admin'
  AND p.status IN ('active', 'pending')
  AND c.status = 'active'
  AND u.raw_user_meta_data->>'company_name' IS NOT NULL
  AND NOT EXISTS (
    SELECT 1 FROM profile_companies pc
    WHERE pc.profile_id = p.id
  )
LIMIT 50;
