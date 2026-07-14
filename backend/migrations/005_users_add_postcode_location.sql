-- Adds an optional postcode + coordinates to each user, for the weather
-- feature (see backend/src/routes/weather.js).
--
-- Why save latitude/longitude AND the postcode, instead of just the
-- postcode? A weather API has no idea what a postcode is — it only
-- understands latitude/longitude. So turning a postcode into a weather
-- reading is actually two API calls chained together: postcode -> coordinates
-- (via postcodes.io), then coordinates -> weather (via Open-Meteo). The
-- postcode -> coordinates step is the "slow"/unnecessary-to-repeat one, so we
-- save its result (latitude/longitude) the first time we do it. Every
-- weather check after that can skip straight to the coordinates -> weather
-- step using the saved numbers, instead of asking postcodes.io again.
ALTER TABLE users
  ADD COLUMN postcode VARCHAR(10) DEFAULT NULL,
  ADD COLUMN latitude DECIMAL(9,6) DEFAULT NULL,
  ADD COLUMN longitude DECIMAL(9,6) DEFAULT NULL;
