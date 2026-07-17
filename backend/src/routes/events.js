// Events aren't tied to a user, so no authenticateToken here (same as motorcycles.js).
import express from 'express';
import { query } from '../config/db.js';

const router = express.Router();

// Soonest event that hasn't happened yet, no admin flag, fully automatic.
// Returns { event: null } instead of an error when nothing's upcoming.
router.get('/featured', async (req, res, next) => {
  try {
    const [rows] = await query(
      'SELECT * FROM events WHERE event_date >= CURDATE() ORDER BY event_date ASC LIMIT 1'
    );

    if (rows.length === 0) {
      return res.json({ event: null });
    }

    // Reshape snake_case columns to camelCase for the frontend.
    const row = rows[0];
    res.json({
      event: {
        id: row.id,
        name: row.name,
        description: row.description,
        eventDate: row.event_date,
        startTime: row.start_time,
        endTime: row.end_time,
        imageUrl: row.image_url,
        location: row.location,
      },
    });
  } catch (error) {
    next(error);
  }
});

// All future events, soonest first. Same "reshape to camelCase" as above, just multiple rows instead of one.
router.get('/upcoming', async (req, res, next) => {
  try {
    const [rows] = await query(
      'SELECT * FROM events WHERE event_date >= CURDATE() ORDER BY event_date ASC'
    );

    res.json({
      events: rows.map((row) => ({
        id: row.id,
        name: row.name,
        description: row.description,
        eventDate: row.event_date,
        startTime: row.start_time,
        endTime: row.end_time,
        imageUrl: row.image_url,
        location: row.location,
      })),
    });
  } catch (error) {
    next(error);
  }
});

export default router;
