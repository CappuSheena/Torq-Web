// This whole file is a "middleman" (usually called a proxy) between our app
// and a website called API Ninjas, which has a database of real motorcycle
// specs (engine, power, weight, etc). We never let the browser talk to API
// Ninjas directly — two reasons:
//   1. It needs a secret API key, and anything sent from the browser can be
//      seen by anyone (open dev tools, look at Network tab). Keeping the key
//      here on the server means it never leaves our machine.
//   2. Websites usually block browsers from calling other random websites
//      directly (this is called CORS) — but servers can call other servers
//      just fine.
// So the flow is: React app -> our Express server (this file) -> API Ninjas
// -> back to our server -> back to the React app.
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
//
// Step by step, this is what happens when the frontend calls this route:
//   1. Read make/model/year out of the URL's query string (?make=...&model=...).
//   2. Make sure make and model were actually given — can't search without them.
//   3. Make sure we actually have a secret key saved in the .env file.
//   4. Build the URL we're going to ask API Ninjas, e.g.
//      "https://api.../motorcycles?make=Honda&model=cbf&limit=30".
//   5. Send that request, using the secret key in a header so API Ninjas
//      knows we're allowed to ask.
//   6. If API Ninjas says no (bad key, rate limit, etc), pass a friendly
//      error back instead of crashing.
//   7. If it worked, tidy up the results (trim whitespace) and send them
//      back to whoever called this route (the React app).
router.get('/spec', async (req, res, next) => {
  try {
    const { make, model, year } = req.query;

    if (!make || !model) {
      return res.status(400).json({ error: 'make and model are required.' });
    }

    if (!process.env.API_NINJAS_KEY) {
      return res.status(500).json({ error: 'Motorcycle spec lookup is not configured.' });
    }

    // URLSearchParams just builds a "?make=Honda&model=cbf&limit=30" style
    // string for us, safely (handles spaces/special characters).
    const params = new URLSearchParams({ make, model, limit: '30' });
    if (year) params.set('year', year);

    // This is the actual network call out to API Ninjas' website.
    const response = await fetch(`${API_NINJAS_BASE_URL}?${params.toString()}`, {
      headers: { 'X-Api-Key': process.env.API_NINJAS_KEY },
    });

    if (!response.ok) {
      const errorBody = await response.json().catch(() => ({}));
      return res.status(502).json({ error: errorBody.error || 'Motorcycle spec lookup failed.' });
    }

    // API Ninjas gives back a plain array of matching bikes (could be empty
    // if nothing matched). We clean each one up, then wrap it in
    // { results: [...] } before sending it on to the frontend.
    const results = await response.json();
    res.json({ results: results.map(trimSpecValues) });
  } catch (error) {
    next(error);
  }
});

export default router;
