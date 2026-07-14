-- Community events (bike meets etc). This is shared/global data, not tied to
-- any one user — every rider sees the same events table, unlike bikes which
-- belong to a single owner.
--
-- Note: CLAUDE.md originally described this table with latitude/longitude,
-- matching the hotspots table. For now we're using a single plain text
-- `location` field instead (e.g. "Riverside car park, Glasgow") — much
-- simpler than geocoding every event, and there's no map view yet that would
-- actually need coordinates. Can be swapped for lat/lng later if a map gets
-- built.
CREATE TABLE IF NOT EXISTS events (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT DEFAULT NULL,
  event_date DATE NOT NULL,
  start_time TIME DEFAULT NULL,
  end_time TIME DEFAULT NULL,
  image_url VARCHAR(500) DEFAULT NULL,
  location VARCHAR(255) DEFAULT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- One placeholder event so the featured event card has something real to
-- show straight away, a few weeks out from when this migration was written.
INSERT INTO events (name, description, event_date, start_time, end_time, location)
VALUES (
  'Glasgow Green Bike Meet',
  'Casual monthly meet-up for local riders — grab a coffee, look at bikes, plan the next group ride.',
  '2026-08-02',
  '10:00:00',
  '13:00:00',
  'Riverside car park, Glasgow'
);
