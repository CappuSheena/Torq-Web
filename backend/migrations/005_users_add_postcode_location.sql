-- Optional postcode + coordinates per user, for the weather feature
-- (see backend/src/routes/weather.js). Coordinates are cached here so the
-- postcode -> coordinates lookup only has to happen once per user, not on
-- every weather check.
ALTER TABLE users
  ADD COLUMN postcode VARCHAR(10) DEFAULT NULL,
  ADD COLUMN latitude DECIMAL(9,6) DEFAULT NULL,
  ADD COLUMN longitude DECIMAL(9,6) DEFAULT NULL;
