import { randomUUID } from 'node:crypto';
import type { Db } from '../db/connection.js';
import type { Booking } from '../types.js';
import { now, type NowFn } from '../services/now.js';

interface BookingRow {
  id: string;
  event_type_id: string;
  start: string;
  end: string;
  name: string;
  email: string;
  notes: string | null;
  created_at: string;
}

function toBooking(row: BookingRow): Booking {
  return {
    id: row.id,
    eventTypeId: row.event_type_id,
    start: row.start,
    end: row.end,
    name: row.name,
    email: row.email,
    ...(row.notes !== null ? { notes: row.notes } : {}),
    createdAt: row.created_at,
  };
}

// Правило занятости (спека, ядро 1): пересечение интервалов по ВСЕМ броням,
// тип не учитывается; стык end == next.start конфликтом не считается.
const OVERLAP_WHERE = 'start < @end AND end > @start';

export function findOverlaps(db: Db, start: string, end: string): Booking[] {
  const rows = db
    .prepare(
      `SELECT id, event_type_id, start, end, name, email, notes, created_at
       FROM bookings WHERE ${OVERLAP_WHERE} ORDER BY start`,
    )
    .all({ start, end }) as BookingRow[];
  return rows.map(toBooking);
}

export function insertBooking(db: Db, b: Booking): void {
  db.prepare(
    `INSERT INTO bookings (id, event_type_id, start, end, name, email, notes, created_at)
     VALUES (@id, @eventTypeId, @start, @end, @name, @email, @notes, @createdAt)`,
  ).run({
    id: b.id,
    eventTypeId: b.eventTypeId,
    start: b.start,
    end: b.end,
    name: b.name,
    email: b.email,
    notes: b.notes ?? null,
    createdAt: b.createdAt,
  });
}

export type BookingCreate = Omit<Booking, 'id' | 'createdAt'>;

// Проверка пересечений и вставка — в одной транзакции (спека, ядро 2):
// better-sqlite3 синхронный, один процесс — гонка параллельных POST закрыта.
export function createBookingIfFree(
  db: Db,
  input: BookingCreate,
  nowFn: NowFn = now,
): { ok: true; booking: Booking } | { ok: false; conflicts: Booking[] } {
  const tx = db.transaction((): { ok: true; booking: Booking } | { ok: false; conflicts: Booking[] } => {
    const conflicts = findOverlaps(db, input.start, input.end);
    if (conflicts.length > 0) return { ok: false, conflicts };
    const booking: Booking = { ...input, id: randomUUID(), createdAt: nowFn().toISOString() };
    insertBooking(db, booking);
    return { ok: true, booking };
  });
  return tx();
}

export function listUpcoming(db: Db, fromIso: string): Booking[] {
  const rows = db
    .prepare(
      `SELECT id, event_type_id, start, end, name, email, notes, created_at
       FROM bookings WHERE start >= ? ORDER BY start`,
    )
    .all(fromIso) as BookingRow[];
  return rows.map(toBooking);
}
