-- Adds columns needed for bike CRUD + cached motorcycle spec data.
-- schema.sql's CREATE TABLE IF NOT EXISTS won't touch an already-existing
-- bikes table, so this runs as a separate additive migration.

ALTER TABLE bikes
  ADD COLUMN nickname VARCHAR(100) DEFAULT NULL AFTER model,
  ADD COLUMN last_service DATE DEFAULT NULL AFTER mileage,
  ADD COLUMN spec_json JSON DEFAULT NULL AFTER insurance_expiry_date,
  ADD COLUMN is_primary TINYINT(1) NOT NULL DEFAULT 0 AFTER spec_json,
  ADD COLUMN last_synced_at TIMESTAMP NULL DEFAULT NULL AFTER is_primary;
