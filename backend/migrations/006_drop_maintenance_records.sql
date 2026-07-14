-- maintenance_records was created in the original schema but never actually
-- used anywhere — no route reads or writes it, and "last service"/mileage
-- ended up living directly on bikes instead (see 003_bikes_add_last_service_mileage.sql).
-- Dropping the dead table rather than leaving it lying around unused.

DROP TABLE IF EXISTS maintenance_records;
