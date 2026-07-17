-- Riding hotspots for the Community page. Global data, no FK to users,
-- same pattern as events. Plain text `location`, no category, no lat/lng
-- (simpler, matches the approach already taken for events).
CREATE TABLE IF NOT EXISTS hotspots (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT DEFAULT NULL,
  location VARCHAR(255) DEFAULT NULL,
  image_url VARCHAR(500) DEFAULT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Trossachs trail has no image_url on purpose, so the "no image" case
-- actually renders somewhere real, not just tested by hand. The other two
-- carry a real image_url so the "image present" case is real too.
INSERT INTO hotspots (name, description, location, image_url)
VALUES
  (
    'Loch Lomond loop',
    'A classic scenic loop hugging the loch shore, with sweeping bends and plenty of spots to stop for photos. Busy in summer weekends, so an early start is worth it.',
    'Loch Lomond, G83',
    'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80'
  ),
  (
    'Trossachs trail',
    'Twisty forest roads through the Trossachs with a real mix of tight corners and open straights. Surface can get greasy after rain, so worth taking it steady.',
    'The Trossachs, FK17',
    NULL
  ),
  (
    'Clyde coast run',
    'A relaxed coastal run along the Firth of Clyde, good for an easy evening ride with sea views most of the way. Several harbour towns along the route for a coffee stop.',
    'Clyde coast, PA13',
    'https://images.unsplash.com/photo-1494783367193-149034c05e8f?w=800&q=80'
  );
