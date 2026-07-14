// This file talks to TWO outside APIs, one after the other, because neither
// one alone can turn a postcode into a weather reading:
//   1. postcodes.io knows UK postcodes, but knows nothing about weather.
//   2. Open-Meteo knows weather, but only understands latitude/longitude,
//      not postcodes.
// So the chain is: postcode -> (postcodes.io) -> coordinates ->
// (Open-Meteo) -> weather. Both are free and need no API key/account, which
// is exactly why we picked them.
import express from 'express';
import { query } from '../config/db.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();
// Same one-line pattern bikes.js uses — every route below needs to know
// who's asking (so it can read/save that user's postcode).
router.use(authenticateToken);

// STEP A of the chain: postcode -> { latitude, longitude }.
// postcodes.io is a free lookup, no API key needed. If the postcode doesn't
// exist it replies with a 404 — we catch that here and just return `null`
// instead of letting it blow up, so the route below can turn it into a
// friendly error message ("that doesn't look like a valid postcode") rather
// than a crash.
async function postcodeToCoords(postcode) {
  // encodeURIComponent makes sure spaces etc. in the postcode (e.g. "G1 1XQ")
  // don't break the URL.
  const url = `https://api.postcodes.io/postcodes/${encodeURIComponent(postcode)}`;
  const response = await fetch(url);

  if (!response.ok) {
    // 404 = postcode not recognised. Any other failure, we also just treat
    // as "couldn't look this up" for simplicity.
    return null;
  }

  const data = await response.json();
  return {
    latitude: data.result.latitude,
    longitude: data.result.longitude,
  };
}

// A short lookup table turning Open-Meteo's numeric "weather code" (a
// standard WMO code) into plain English. Not every possible code is listed —
// just the ones actually likely to show up — anything else falls back to a
// generic label further down.
const WEATHER_CODE_TEXT = {
  0: 'Clear sky',
  1: 'Mainly clear',
  2: 'Partly cloudy',
  3: 'Overcast',
  45: 'Fog',
  48: 'Fog',
  51: 'Light drizzle',
  53: 'Drizzle',
  55: 'Heavy drizzle',
  61: 'Light rain',
  63: 'Rain',
  65: 'Heavy rain',
  71: 'Light snow',
  73: 'Snow',
  75: 'Heavy snow',
  80: 'Rain showers',
  81: 'Rain showers',
  82: 'Heavy rain showers',
  95: 'Thunderstorm',
};

// STEP B of the chain: { latitude, longitude } -> current weather.
// Open-Meteo is completely free, no API key or account at all. We only ask
// for the handful of fields the dashboard actually shows (temperature, wind,
// precipitation, weather code) rather than the whole forecast.
async function coordsToWeather(latitude, longitude) {
  const url =
    `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}` +
    `&current=temperature_2m,precipitation,wind_speed_10m,weather_code`;

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error('Weather lookup failed.');
  }

  const data = await response.json();
  const current = data.current;

  // STEP C: repackage Open-Meteo's response into the small, simple shape
  // the frontend actually wants, instead of forwarding its whole payload.
  return {
    temperature: current.temperature_2m,
    windSpeed: current.wind_speed_10m,
    precipitation: current.precipitation,
    conditionText: WEATHER_CODE_TEXT[current.weather_code] || 'Unknown conditions',
  };
}

// GET /api/weather            -> weather for the signed-in user's saved postcode
// GET /api/weather?postcode=X -> weather for that exact postcode instead
//
// The `?postcode=` version always does the full postcode -> coordinates ->
// weather chain (steps A, B, C above) — handy for testing, e.g.
// /api/weather?postcode=G459AU, or for looking up somewhere other than the
// user's own saved address.
//
// The no-postcode version is what the dashboard actually calls day to day.
// It's the "small helper" bit: if this user already has latitude/longitude
// saved (because we looked their postcode up before), we skip step A
// completely and go straight to step B. If they only have a postcode saved
// and no coordinates yet, we do step A ONCE now and save the result, so
// every future request from now on can take the fast path above.
router.get('/', async (req, res, next) => {
  try {
    const queryPostcode = req.query.postcode;
    let latitude;
    let longitude;

    if (queryPostcode) {
      // --- Explicit postcode given in the URL: always look it up fresh ---
      const coords = await postcodeToCoords(queryPostcode);
      if (!coords) {
        return res.status(400).json({ error: "That doesn't look like a valid postcode." });
      }
      latitude = coords.latitude;
      longitude = coords.longitude;
    } else {
      // --- No postcode given: use whatever this user already has saved ---
      const [rows] = await query('SELECT postcode, latitude, longitude FROM users WHERE id = ?', [
        req.user.user_id,
      ]);
      const user = rows[0];

      if (user.latitude !== null && user.longitude !== null) {
        // Already looked this up before — skip postcodes.io entirely.
        latitude = user.latitude;
        longitude = user.longitude;
      } else if (user.postcode) {
        // Postcode saved, but never converted to coordinates yet — do it
        // once now, then cache the result on the user for next time.
        const coords = await postcodeToCoords(user.postcode);
        if (!coords) {
          return res.status(400).json({ error: "That doesn't look like a valid postcode." });
        }
        latitude = coords.latitude;
        longitude = coords.longitude;
        await query('UPDATE users SET latitude = ?, longitude = ? WHERE id = ?', [
          latitude,
          longitude,
          req.user.user_id,
        ]);
      } else {
        // Nothing saved at all — nothing we can look weather up for.
        return res.status(400).json({ error: 'Add a postcode to your profile to see local weather.' });
      }
    }

    const weather = await coordsToWeather(latitude, longitude);
    res.json(weather);
  } catch (error) {
    next(error);
  }
});

export default router;
