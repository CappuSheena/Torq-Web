-- Adds a mileage-based alternative to last_service (DATE) so the onboarding
-- maintenance step can record "last serviced at X miles" instead of a date.

ALTER TABLE bikes
  ADD COLUMN last_service_mileage INT DEFAULT NULL AFTER last_service;
