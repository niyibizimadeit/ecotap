-- ============================================================================
-- Migration 014: Add UPDATE policy for contact_exchanges
-- Fix: Card owners can update their own contact exchanges (lead level, notes,
-- favorites, group). Without this, the app's updates are silently blocked by RLS.
-- ============================================================================

create policy "contact_exchanges: card owner update"
  on contact_exchanges for update
  using (
    exists (
      select 1 from cards
      where  cards.id = contact_exchanges.card_id
        and  cards.profile_id = auth.uid()
    )
  )
  with check (
    exists (
      select 1 from cards
      where  cards.id = contact_exchanges.card_id
        and  cards.profile_id = auth.uid()
    )
  );
