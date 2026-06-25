-- ============================================================================
-- Migration 012: Contact Exchange Enrichment
-- Adds lead management fields to contact_exchanges table.
-- ============================================================================

-- Add lead management columns
ALTER TABLE contact_exchanges
  ADD COLUMN IF NOT EXISTS is_favorite BOOLEAN DEFAULT false;

ALTER TABLE contact_exchanges
  ADD COLUMN IF NOT EXISTS lead_level TEXT DEFAULT 'normal';

ALTER TABLE contact_exchanges
  ADD COLUMN IF NOT EXISTS owner_notes TEXT;

ALTER TABLE contact_exchanges
  ADD COLUMN IF NOT EXISTS lead_group TEXT;

-- Add index for sorting by favorites
CREATE INDEX IF NOT EXISTS idx_contact_exchanges_is_favorite
  ON contact_exchanges(is_favorite);

-- Add index for sorting by lead level
CREATE INDEX IF NOT EXISTS idx_contact_exchanges_lead_level
  ON contact_exchanges(lead_level);

-- Add index for grouping
CREATE INDEX IF NOT EXISTS idx_contact_exchanges_lead_group
  ON contact_exchanges(lead_group);
