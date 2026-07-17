-- Unused, no route ever reads/writes it. "Last service" lives on bikes
-- instead (see 003_bikes_add_last_service_mileage.sql).
DROP TABLE IF EXISTS maintenance_records;
