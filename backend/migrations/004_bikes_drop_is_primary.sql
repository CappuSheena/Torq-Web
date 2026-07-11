-- The "primary bike" concept was removed — each bike card now has its own
-- calendar, so there's no longer a single primary bike per user.

ALTER TABLE bikes
  DROP COLUMN is_primary;
