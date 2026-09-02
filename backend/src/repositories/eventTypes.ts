import type { Db } from '../db/connection.js';
import type { EventType } from '../types.js';

interface EventTypeRow {
  id: string;
  title: string;
  description: string | null;
  duration_minutes: number;
}

function toEventType(row: EventTypeRow): EventType {
  return {
    id: row.id,
    title: row.title,
    ...(row.description !== null ? { description: row.description } : {}),
    durationMinutes: row.duration_minutes,
  };
}

export function listEventTypes(db: Db): EventType[] {
  const rows = db
    .prepare('SELECT id, title, description, duration_minutes FROM event_types ORDER BY id')
    .all() as EventTypeRow[];
  return rows.map(toEventType);
}

export function getEventType(db: Db, id: string): EventType | undefined {
  const row = db
    .prepare('SELECT id, title, description, duration_minutes FROM event_types WHERE id = ?')
    .get(id) as EventTypeRow | undefined;
  return row ? toEventType(row) : undefined;
}

// ignore=true — идемпотентный seed; false — обычный вставочный путь (POST /event-types, 3.4)
export function insertEventType(db: Db, et: EventType, opts: { ignore?: boolean } = {}): void {
  const verb = opts.ignore ? 'INSERT OR IGNORE' : 'INSERT';
  db.prepare(
    `${verb} INTO event_types (id, title, description, duration_minutes)
     VALUES (@id, @title, @description, @durationMinutes)`,
  ).run({
    id: et.id,
    title: et.title,
    description: et.description ?? null,
    durationMinutes: et.durationMinutes,
  });
}
