// Схема SQLite. id Booking — uuid строка; время — TEXT в ISO UTC
// (лексикографически сортируется как хронология).
export const SCHEMA_SQL = `
CREATE TABLE IF NOT EXISTS event_types (
  id                TEXT PRIMARY KEY,
  title             TEXT NOT NULL,
  description       TEXT,
  duration_minutes  INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS bookings (
  id             TEXT PRIMARY KEY,
  event_type_id  TEXT NOT NULL REFERENCES event_types(id),
  start          TEXT NOT NULL,
  end            TEXT NOT NULL,
  name           TEXT NOT NULL,
  email          TEXT NOT NULL,
  notes          TEXT,
  created_at     TEXT NOT NULL
);

-- пересечения ищутся по интервалу: индекс по start сужает скан
CREATE INDEX IF NOT EXISTS bookings_start_idx ON bookings(start);
`;
