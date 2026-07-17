-- Nickname was dropped from the UI a while back (bike titles show Make,
-- Model, Year instead), and nothing in the frontend has sent or read it
-- since. Dropping the column now that it's confirmed dead.
ALTER TABLE bikes
  DROP COLUMN nickname;
