-- Shared/global events, not tied to a user. Plain text `location` instead of
-- lat/lng (simpler, no map view needs coordinates yet).
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

-- Placeholder event so the featured card has something to show.
INSERT INTO events (name, description, event_date, start_time, end_time, location)
VALUES (
  'Glasgow Green Bike Meet',
  'Casual monthly meet-up for local riders, grab a coffee, look at bikes, plan the next group ride.',
  '2026-08-02',
  '10:00:00',
  '13:00:00',
  'Riverside car park, Glasgow'
);
