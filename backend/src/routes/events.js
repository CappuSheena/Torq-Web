// Community events (bike meets etc). Unlike bikes.js this data isn't tied to
// any one user — everyone sees the same events table — so there's no
// authenticateToken middleware here, same as motorcycles.js.
import express from 'express';
import { query } from '../config/db.js';

const router = express.Router();

// GET /api/events/featured — the single soonest upcoming event.
//
// "Featured" here just means "closest event_date that hasn't happened yet" —
// there's no admin panel to manually flag one as featured, so this is fully
// automatic. CURDATE() is today's date on the MySQL server; ORDER BY
// event_date ASC + LIMIT 1 picks whichever upcoming event is next.
//
// If nothing upcoming exists, we don't 404/error — we return { event: null }
// so the frontend can show a plain "no events yet" message instead of
// treating it as something having gone wrong.
//
// This is the only route in this file on purpose. There's no POST to create
// an event or PATCH to edit one yet — events currently only get added
// straight into the database (see migrations/007_create_events.sql). An
// admin/create flow is a separate future task.
router.get('/featured', async (req, res, next) => {
  try {
    const [rows] = await query(
      'SELECT * FROM events WHERE event_date >= CURDATE() ORDER BY event_date ASC LIMIT 1'
    );

    if (rows.length === 0) {
      return res.json({ event: null });
    }

    // MySQL columns are snake_case (event_date, image_url) but the rest of
    // the frontend uses camelCase, so this reshapes the row before sending
    // it back rather than making the frontend deal with both styles.
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

export default router;
