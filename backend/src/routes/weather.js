// Chain: postcode -> (postcodes.io) -> coordinates -> (Open-Meteo) -> weather.
// Neither API alone can go straight from postcode to weather, and both are free with no API key, which is why we picked them.
import express from 'express';
import { query } from '../config/db.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();
router.use(authenticateToken);

// postcode -> { latitude, longitude }. Returns null on an unrecognised postcode (postcodes.io 404s) instead of throwing.
async function postcodeToCoords(postcode) {
  const url = `https://api.postcodes.io/postcodes/${encodeURIComponent(postcode)}`;
  const response = await fetch(url);

  if (!response.ok) {
    return null;
  }

  const data = await response.json();
  return {
    latitude: data.result.latitude,
    longitude: data.result.longitude,
  };
}

// Open-Meteo's numeric WMO weather codes, translated to plain English.
// Anything not listed falls back to "Unknown conditions" below.
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

// { latitude, longitude } -> current weather. Only asks for the fields the dashboard actually shows, not the whole forecast.
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

  return {
    temperature: current.temperature_2m,
    windSpeed: current.wind_speed_10m,
    precipitation: current.precipitation,
    conditionText: WEATHER_CODE_TEXT[current.weather_code] || 'Unknown conditions',
  };
}

// GET /api/weather            -> weather for the signed-in user's saved postcode
// GET /api/weather?postcode=X -> weather for that exact postcode instead

// The no-postcode version is what the dashboard actually uses day to day, it reuses cached lat/lng when we have them, only hitting postcodes.io the first time, then saving the result for next time.
router.get('/', async (req, res, next) => {
  try {
    const queryPostcode = req.query.postcode;
    let latitude;
    let longitude;

    if (queryPostcode) {
      const coords = await postcodeToCoords(queryPostcode);
      if (!coords) {
        return res.status(400).json({ error: "That doesn't look like a valid postcode." });
      }
      latitude = coords.latitude;
      longitude = coords.longitude;
    } else {
      const [rows] = await query('SELECT postcode, latitude, longitude FROM users WHERE id = ?', [
        req.user.user_id,
      ]);
      const user = rows[0];

      if (user.latitude !== null && user.longitude !== null) {
        latitude = user.latitude;
        longitude = user.longitude;
      } else if (user.postcode) {
        // First lookup for this user, cache the result for next time.
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
