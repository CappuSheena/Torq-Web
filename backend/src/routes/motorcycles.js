import express from 'express';

const router = express.Router();
const API_NINJAS_BASE_URL = 'https://api.api-ninjas.com/v1/motorcycles';

// API Ninjas pads a lot of fields with trailing/leading whitespace
// (e.g. "CBR600RR ", "120/70-ZR17 ") i'll clean it up before it reaches the
// frontend or gets cached into bikes.spec_json.
function trimSpecValues(spec) {
  const trimmed = {};
  for (const [key, value] of Object.entries(spec)) {
    trimmed[key] = typeof value === 'string' ? value.trim() : value;
  }
  return trimmed;
}

// GET /api/motorcycles/spec?make=X&model=Y&year=Z (year optional — omit it
// to get every year API Ninjas has for that make/model, e.g. to build a
// year picker from the results).
router.get('/spec', async (req, res, next) => {
  try {
    const { make, model, year } = req.query;

    if (!make || !model) {
      return res.status(400).json({ error: 'make and model are required.' });
    }

    if (!process.env.API_NINJAS_KEY) {
      return res.status(500).json({ error: 'Motorcycle spec lookup is not configured.' });
    }

    const params = new URLSearchParams({ make, model, limit: '30' });
    if (year) params.set('year', year);

    const response = await fetch(`${API_NINJAS_BASE_URL}?${params.toString()}`, {
      headers: { 'X-Api-Key': process.env.API_NINJAS_KEY },
    });

    if (!response.ok) {
      const errorBody = await response.json().catch(() => ({}));
      return res.status(502).json({ error: errorBody.error || 'Motorcycle spec lookup failed.' });
    }

    const results = await response.json();
    res.json({ results: results.map(trimSpecValues) });
  } catch (error) {
    next(error);
  }
});

export default router;
