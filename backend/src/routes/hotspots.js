// Hotspots aren't tied to a user either, so no authenticateToken (same reasoning as events.js).
import express from 'express';
import { query } from '../config/db.js';

const router = express.Router();

// Every hotspot, no filtering. Same reshape-to-camelCase pattern as events.
router.get('/', async (req, res, next) => {
  try {
    const [rows] = await query('SELECT * FROM hotspots ORDER BY name ASC');

    res.json({
      hotspots: rows.map((row) => ({
        id: row.id,
        name: row.name,
        description: row.description,
        location: row.location,
        imageUrl: row.image_url,
      })),
    });
  } catch (error) {
    next(error);
  }
});

export default router;
