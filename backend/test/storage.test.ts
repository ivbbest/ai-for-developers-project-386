import { beforeEach, describe, expect, it } from 'vitest';
import { openDb, migrate, type Db } from '../src/db/connection.js';
import { seed } from '../src/db/seed.js';
import { listEventTypes, getEventType, insertEventType } from '../src/repositories/eventTypes.js';
import {
  findOverlaps,
  insertBooking,
  createBookingIfFree,
  listUpcoming,
  type BookingCreate,
} from '../src/repositories/bookings.js';
import type { Booking } from '../src/types.js';

function booking(partial: Partial<Booking> & Pick<Booking, 'start' | 'end'>): Booking {
  return {
    id: partial.id ?? crypto.randomUUID(),
    eventTypeId: partial.eventTypeId ?? 'meet-15',
    name: partial.name ?? 'Тест',
    email: partial.email ?? 't@example.com',
    createdAt: partial.createdAt ?? '2026-01-01T00:00:00.000Z',
    ...partial,
  };
}

describe('хранилище: схема, seed, репозитории', () => {
  let db: Db;
  beforeEach(() => {
    db = openDb(':memory:');
    migrate(db);
    seed(db);
  });

  it('seed идемпотентен: повторный seed не дублирует и не затирает', () => {
    insertEventType(db, { id: 'custom', title: 'Мой тип', durationMinutes: 45 });
    seed(db); // второй прогон — как рестарт на живом диске
    const ids = listEventTypes(db).map((e) => e.id);
    expect(ids).toEqual(['custom', 'meet-15', 'meet-30']); // без дублей
    expect(getEventType(db, 'custom')?.title).toBe('Мой тип'); // seed не трогает чужое
  });

  it('каталог отдаёт seed-типы с полями контракта', () => {
    const meet15 = getEventType(db, 'meet-15');
    expect(meet15).toMatchObject({ id: 'meet-15', durationMinutes: 15 });
    expect(meet15?.title).toBeTruthy();
  });

  it('getEventType: несуществующий id — undefined', () => {
    expect(getEventType(db, 'нет-такого')).toBeUndefined();
  });

  it('пересечение интервалов, а не равенство start (контрпример спеки)', () => {
    // 30-мин броня 09:00–09:30 блокирует 15-мин запрос на 09:15
    insertBooking(db, booking({ start: '2026-09-10T09:00:00.000Z', end: '2026-09-10T09:30:00.000Z' }));
    const overlaps = findOverlaps(db, '2026-09-10T09:15:00.000Z', '2026-09-10T09:30:00.000Z');
    expect(overlaps.length).toBe(1);
  });

  it('стык end == next.start конфликтом не считается', () => {
    insertBooking(db, booking({ start: '2026-09-10T09:00:00.000Z', end: '2026-09-10T09:30:00.000Z' }));
    expect(findOverlaps(db, '2026-09-10T09:30:00.000Z', '2026-09-10T10:00:00.000Z')).toHaveLength(0);
  });

  it('createBookingIfFree: конфликт — не вставляет, свободно — вставляет с uuid и now()', () => {
    insertBooking(db, booking({ start: '2026-09-10T09:00:00.000Z', end: '2026-09-10T09:30:00.000Z' }));
    const input: BookingCreate = {
      eventTypeId: 'meet-15', start: '2026-09-10T09:15:00.000Z', end: '2026-09-10T09:30:00.000Z',
      name: 'Гость', email: 'g@example.com',
    };
    const clash = createBookingIfFree(db, input, () => new Date('2026-01-01T00:00:00Z'));
    expect(clash.ok).toBe(false);
    if (!clash.ok) expect(clash.conflicts).toHaveLength(1);
    // конфликтующая вставка не оставила следов
    expect(db.prepare('SELECT COUNT(*) AS n FROM bookings').get()).toEqual({ n: 1 });

    const free: BookingCreate = { ...input, start: '2026-09-10T10:00:00.000Z', end: '2026-09-10T10:15:00.000Z' };
    const ok = createBookingIfFree(db, free, () => new Date('2026-01-02T03:04:05Z'));
    expect(ok.ok).toBe(true);
    if (ok.ok) {
      expect(ok.booking.id).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/);
      expect(ok.booking.createdAt).toBe('2026-01-02T03:04:05.000Z'); // now() прокинут в транзакцию
    }
  });

  it('неканонические метки времени нормализуются при записи и запросе', () => {
    // без канонизации лексикографическое сравнение TEXT врёт: '...:00Z' < '...:00.000Z'
    insertBooking(db, booking({ start: '2026-09-10T09:00:00Z', end: '2026-09-10T09:30:00Z' }));
    const stored = db.prepare('SELECT start, end FROM bookings').get();
    expect(stored).toEqual({ start: '2026-09-10T09:00:00.000Z', end: '2026-09-10T09:30:00.000Z' });
    // стык в канон-формате — не конфликт
    expect(findOverlaps(db, '2026-09-10T09:30:00.000Z', '2026-09-10T10:00:00.000Z')).toHaveLength(0);
    // offset-формат на входе запроса тоже сравнивается корректно: 12:15 MSK == 09:15Z — внутри брони
    expect(findOverlaps(db, '2026-09-10T12:15:00+03:00', '2026-09-10T12:30:00+03:00')).toHaveLength(1);
  });

  it('listUpcoming: фильтр start >= now и сортировка по start', () => {
    insertBooking(db, booking({ start: '2026-09-12T09:00:00.000Z', end: '2026-09-12T09:15:00.000Z' }));
    insertBooking(db, booking({ start: '2026-09-10T09:00:00.000Z', end: '2026-09-10T09:15:00.000Z' }));
    insertBooking(db, booking({ start: '2026-09-11T09:00:00.000Z', end: '2026-09-11T09:15:00.000Z' }));
    const upcoming = listUpcoming(db, '2026-09-11T00:00:00.000Z').map((b) => b.start);
    expect(upcoming).toEqual(['2026-09-11T09:00:00.000Z', '2026-09-12T09:00:00.000Z']);
  });
});
