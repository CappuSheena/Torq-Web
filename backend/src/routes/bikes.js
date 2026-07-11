import express from 'express';
import { query } from '../config/db.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();
router.use(authenticateToken);

function toBikeResponse(row) {
  const spec = row.spec_json
    ? typeof row.spec_json === 'string'
      ? JSON.parse(row.spec_json)
      : row.spec_json
    : null;

  return {
    id: row.id,
    make: row.make,
    model: row.model,
    nickname: row.nickname,
    year: row.year,
    mileage: row.mileage,
    lastServiceDate: row.last_service,
    lastServiceMileage: row.last_service_mileage,
    motDate: row.mot_expiry_date,
    taxDate: row.tax_expiry_date,
    insuranceDate: row.insurance_expiry_date,
    spec,
    lastSyncedAt: row.last_synced_at,
    createdAt: row.created_at,
  };
}

// Loads a bike by id and checks it belongs to the logged-in user, writing
// the appropriate 404/403 response itself. Returns null (response already
// sent) when the caller should stop.
async function getOwnedBikeOrRespond(req, res) {
  const bikeId = Number(req.params.id);

  if (!Number.isInteger(bikeId)) {
    res.status(400).json({ error: 'Invalid bike id.' });
    return null;
  }

  const [rows] = await query('SELECT * FROM bikes WHERE id = ?', [bikeId]);

  if (rows.length === 0) {
    res.status(404).json({ error: 'Bike not found.' });
    return null;
  }

  if (rows[0].user_id !== req.user.user_id) {
    res.status(403).json({ error: 'You do not have access to this bike.' });
    return null;
  }

  return rows[0];
}

// POST /api/bikes — creates a bike for the logged in user.
//
// Note on `spec`: this is NOT looked up again here. The frontend already
// called /api/motorcycles/spec earlier (see motorcycles.js) to search API
// Ninjas and let the user pick their exact bike — whatever object they
// picked just gets sent along in this request, and we save a copy of it as
// JSON text in the spec_json column below. That way we only ever call the
// outside API once per bike, instead of every time someone opens the app.
router.post('/', async (req, res, next) => {
  try {
    const { make, model, year, nickname, mot_date, tax_date, insurance_date, spec } = req.body || {};

    if (!make || !model || !year) {
      return res.status(400).json({ error: 'make, model, and year are required.' });
    }

    const userId = req.user.user_id;
    // spec_json is a JSON column, but it's still just stored as text under
    // the hood — JSON.stringify() turns the JS object into that text.
    // toBikeResponse() (below) does the reverse (JSON.parse) when we read
    // it back out. No spec picked = null, which is a perfectly valid bike.
    const specJson = spec ? JSON.stringify(spec) : null;
    const lastSyncedAt = spec ? new Date() : null;

    const [result] = await query(
      `INSERT INTO bikes
        (user_id, make, model, year, nickname, mot_expiry_date, tax_expiry_date, insurance_expiry_date, spec_json, last_synced_at, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
      [
        userId,
        make.trim(),
        model.trim(),
        year,
        nickname ? nickname.trim() : null,
        mot_date || null,
        tax_date || null,
        insurance_date || null,
        specJson,
        lastSyncedAt,
      ]
    );

    const [rows] = await query('SELECT * FROM bikes WHERE id = ?', [result.insertId]);
    res.status(201).json({ bike: toBikeResponse(rows[0]) });
  } catch (error) {
    next(error);
  }
});

// GET /api/bikes — every bike belonging to the logged in user, oldest first.
router.get('/', async (req, res, next) => {
  try {
    const [rows] = await query(
      'SELECT * FROM bikes WHERE user_id = ? ORDER BY created_at ASC',
      [req.user.user_id]
    );
    res.json({ bikes: rows.map(toBikeResponse) });
  } catch (error) {
    next(error);
  }
});

// GET /api/bikes/:id — a single bike, only if it belongs to the caller.
router.get('/:id', async (req, res, next) => {
  try {
    const bike = await getOwnedBikeOrRespond(req, res);
    if (!bike) return;
    res.json({ bike: toBikeResponse(bike) });
  } catch (error) {
    next(error);
  }
});

// PATCH /api/bikes/:id — mileage, last_service, key dates, and nickname
// only. make/model/year/spec are intentionally not editable here since
// changing them would need a fresh spec lookup.
router.patch('/:id', async (req, res, next) => {
  try {
    const bike = await getOwnedBikeOrRespond(req, res);
    if (!bike) return;

    const allowedFields = {
      mileage: 'mileage',
      last_service: 'last_service',
      last_service_mileage: 'last_service_mileage',
      mot_date: 'mot_expiry_date',
      tax_date: 'tax_expiry_date',
      insurance_date: 'insurance_expiry_date',
      nickname: 'nickname',
    };

    const body = req.body || {};
    const updates = [];
    const params = [];

    for (const [bodyKey, column] of Object.entries(allowedFields)) {
      if (bodyKey in body) {
        const value = body[bodyKey];
        updates.push(`${column} = ?`);
        params.push(typeof value === 'string' ? value.trim() || null : value);
      }
    }

    if (updates.length === 0) {
      return res.status(400).json({ error: 'No valid fields to update.' });
    }

    params.push(bike.id);
    await query(`UPDATE bikes SET ${updates.join(', ')}, updated_at = NOW() WHERE id = ?`, params);

    const [rows] = await query('SELECT * FROM bikes WHERE id = ?', [bike.id]);
    res.json({ bike: toBikeResponse(rows[0]) });
  } catch (error) {
    next(error);
  }
});

export default router;
