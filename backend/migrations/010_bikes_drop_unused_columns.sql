-- vin, colour, and registration_number were in the original schema.sql
-- CREATE TABLE but never made it into any onboarding step, never got
-- returned by bikes.js, never got an edit field. Not part of CLAUDE.md's
-- documented bikes schema either. Dead since day one, dropping them.
ALTER TABLE bikes
  DROP COLUMN vin,
  DROP COLUMN colour,
  DROP COLUMN registration_number;
