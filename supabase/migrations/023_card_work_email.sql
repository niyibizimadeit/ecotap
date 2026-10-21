-- 023_card_work_email.sql
-- Adds an optional work email alongside the existing personal card email.
-- email_public stays the personal email; email_work is included in the vCard
-- export and the super-admin user detail view.

alter table cards add column if not exists email_work text;

comment on column cards.email_work is
  'Optional work email. Included in the vCard export and shown only in the super-admin user detail modal.';

-- Correct the live DB comment to match the relabel. No data change.
comment on column cards.email_public is
  'Personal email. Included in the vCard export; not rendered on the public card page.';
