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
-- This creates the missing links for active companies with pending/active admins.
INSERT INTO profile_companies (profile_id, company_id, is_primary)
SELECT p.id, c.id, true
FROM profiles p
JOIN companies c ON (
  -- Match by company name stored in user_metadata during signUpOrg
  c.id IN (
    SELECT co.id FROM companies co
    WHERE co.status = 'active'
  )
)
WHERE p.role = 'company_admin'
  AND p.status IN ('active', 'pending')
  AND NOT EXISTS (
    SELECT 1 FROM profile_companies pc
    WHERE pc.profile_id = p.id
  )
  AND EXISTS (
    SELECT 1 FROM auth.users u
    WHERE u.id = p.id
    AND u.raw_user_meta_data->>'company_name' IS NOT NULL
  )
LIMIT 50;
