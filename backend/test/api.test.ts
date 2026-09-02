import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { beforeAll, afterAll, beforeEach, describe, expect, it } from 'vitest';
import request from 'supertest';
import { openDb, migrate, type Db } from '../src/db/connection.js';
import { seed } from '../src/db/seed.js';
import { createApp } from '../src/app.js';
import { insertBooking } from '../src/repositories/bookings.js';

// Фиксированное «сейчас»: 2026-09-10 08:00 MSK — день 10-е в окне,
// рабочие слоты ещё не начались
const NOW = () => new Date('2026-09-10T05:00:00Z');

function makeDb(): Db {
  const db = openDb(':memory:');
  migrate(db);
  seed(db);
  return db;
}

const app = createApp(makeDb(), NOW);

function slotDate(offsetDays = 0): string {
  // «завтра» от NOW в MSK
  const base = Date.parse('2026-09-10T00:00:00Z') + offsetDays * 86_400_000;
  return new Date(base).toISOString().slice(0, 10);
}

describe('GET /api/event-types/:id/slots', () => {
  let db: Db;
  let api: ReturnType<typeof createApp>;
  beforeEach(() => {
    db = makeDb();
    api = createApp(db, NOW);
  });

  it('сетка дня: 36 слотов 15-мин, все available', async () => {
    const res = await request(api).get(`/api/event-types/meet-15/slots?date=${slotDate()}`);
    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(36);
    expect(res.body[0]).toEqual({
      start: '2026-09-10T06:00:00.000Z',
      end: '2026-09-10T06:15:00.000Z',
      status: 'available',
    });
  });

  it('E20: без date → 400 validation', async () => {
    const res = await request(api).get('/api/event-types/meet-15/slots');
    expect(res.status).toBe(400);
    expect(res.body.code).toBe('validation');
  });

  it('E4: 2026-02-30 → 400 validation', async () => {
    const res = await request(api).get('/api/event-types/meet-15/slots?date=2026-02-30');
    expect(res.status).toBe(400);
    expect(res.body.code).toBe('validation');
  });

  it('E5: вчера/+14 → 400 slot_out_of_window; +13 → 200', async () => {
    const y = await request(api).get(`/api/event-types/meet-15/slots?date=${slotDate(-1)}`);
    expect(y.status).toBe(400);
    expect(y.body.code).toBe('slot_out_of_window');
    const last = await request(api).get(`/api/event-types/meet-15/slots?date=${slotDate(13)}`);
    expect(last.status).toBe(200);
    const over = await request(api).get(`/api/event-types/meet-15/slots?date=${slotDate(14)}`);
    expect(over.status).toBe(400);
    expect(over.body.code).toBe('slot_out_of_window');
  });

  it('E6: неизвестный тип — 404 раньше валидации даты', async () => {
    const res = await request(api).get('/api/event-types/nope/slots');
    expect(res.status).toBe(404);
    expect(res.body.code).toBe('not_found');
  });

  it('занятый слот возвращается со статусом booked', async () => {
    insertBooking(db, {
      id: 'b1', eventTypeId: 'meet-30', name: 'Г', email: 'g@example.com',
      start: '2026-09-10T06:00:00.000Z', end: '2026-09-10T06:30:00.000Z',
      createdAt: '2026-09-01T00:00:00.000Z',
    });
    const res = await request(api).get(`/api/event-types/meet-15/slots?date=${slotDate()}`);
    expect(res.body.slice(0, 3).map((s: { status: string }) => s.status)).toEqual(['booked', 'booked', 'available']);
  });
});

describe('POST /api/bookings (3.3)', () => {
  let db: Db;
  let api: ReturnType<typeof createApp>;
  beforeEach(() => {
    db = makeDb();
    api = createApp(db, NOW);
  });

  const booking = (over: Record<string, unknown> = {}) => ({
    eventTypeId: 'meet-15',
    start: '2026-09-10T06:00:00.000Z',
    name: 'Иван Петров',
    email: 'ivan@example.com',
    ...over,
  });

  it('201: серверный end=start+duration, uuid id, createdAt из now()', async () => {
    const res = await request(api).post('/api/bookings').send(booking());
    expect(res.status).toBe(201);
    expect(res.body).toMatchObject({
      eventTypeId: 'meet-15',
      start: '2026-09-10T06:00:00.000Z',
      end: '2026-09-10T06:15:00.000Z',
      name: 'Иван Петров',
      email: 'ivan@example.com',
      createdAt: '2026-09-10T05:00:00.000Z',
    });
    expect(res.body.id).toMatch(/^[0-9a-f-]{36}$/);
  });

  it('критерий 3.3: 30-мин броня блокирует 15-мин запрос на 09:15; стык 09:30 свободен (E1)', async () => {
    const wide = await request(api).post('/api/bookings').send(booking({ eventTypeId: 'meet-30', start: '2026-09-10T06:00:00.000Z' }));
    expect(wide.status).toBe(201);
    const clash = await request(api).post('/api/bookings').send(booking({ start: '2026-09-10T06:15:00.000Z' }));
    expect(clash.status).toBe(409);
    expect(clash.body.code).toBe('slot_conflict');
    const edge = await request(api).post('/api/bookings').send(booking({ start: '2026-09-10T06:30:00.000Z' }));
    expect(edge.status).toBe(201);
  });

  it('E2: повтор того же start → 409', async () => {
    expect((await request(api).post('/api/bookings').send(booking())).status).toBe(201);
    const again = await request(api).post('/api/bookings').send(booking());
    expect(again.status).toBe(409);
    expect(again.body.code).toBe('slot_conflict');
  });

  it('E15: параллельные пересекающиеся POST — ровно один 201', async () => {
    const results = await Promise.all([
      request(api).post('/api/bookings').send(booking({ eventTypeId: 'meet-30' })), // 06:00–06:30
      request(api).post('/api/bookings').send(booking({ eventTypeId: 'meet-30' })), // тот же интервал
      request(api).post('/api/bookings').send(booking({ eventTypeId: 'meet-15', start: '2026-09-10T06:15:00.000Z' })), // 06:15–06:30
    ]);
    const ok = results.filter((r) => r.status === 201);
    expect(ok).toHaveLength(1);
    expect(results.filter((r) => r.status === 409)).toHaveLength(2);
  });

  it('E3: start в прошлом (дата в окне) → 400 slot_out_of_window с отдельным сообщением', async () => {
    const res = await request(api).post('/api/bookings').send(booking({ start: '2026-09-10T04:00:00.000Z' }));
    expect(res.status).toBe(400);
    expect(res.body.code).toBe('slot_out_of_window');
    expect(res.body.message).toBe('время слота уже прошло');
  });

  it('E7: start вне сетки (09:07) и до начала рабочего дня → 400 validation', async () => {
    const off = await request(api).post('/api/bookings').send(booking({ start: '2026-09-10T06:07:00.000Z' }));
    expect(off.status).toBe(400);
    expect(off.body.code).toBe('validation');
    const early = await request(api).post('/api/bookings').send(booking({ start: '2026-09-10T05:30:00.000Z' }));
    expect(early.status).toBe(400);
  });

  it('E8: неизвестное поле (включая end от клиента) → 400 validation', async () => {
    const res = await request(api).post('/api/bookings').send(booking({ end: '2026-09-10T07:00:00.000Z' }));
    expect(res.status).toBe(400);
    expect(res.body.code).toBe('validation');
  });

  it('E9: не-JSON → 400 validation; >64 КБ → 413 payload_too_large (E18)', async () => {
    const bad = await request(api).post('/api/bookings').set('Content-Type', 'application/json').send('{"oops');
    expect(bad.status).toBe(400);
    expect(bad.body.code).toBe('validation');
    const big = await request(api)
      .post('/api/bookings')
      .send(booking({ notes: 'x'.repeat(70_000) }));
    expect(big.status).toBe(413);
    expect(big.body.code).toBe('payload_too_large');
  });

  it('E10: name trim; пустой после trim — 400; кириллица/эмодзи проходят', async () => {
    const blank = await request(api).post('/api/bookings').send(booking({ name: '   ' }));
    expect(blank.status).toBe(400);
    const ok = await request(api).post('/api/bookings').send(booking({ name: '  Пётр 😊  ' }));
    expect(ok.status).toBe(201);
    expect(ok.body.name).toBe('Пётр 😊');
    const emptyNotes = await request(api).post('/api/bookings').send(booking({ notes: '   ' }));
    expect(emptyNotes.status).toBe(400);
  });

  it('E11: email — простой regex, регистр сохраняется', async () => {
    const ok = await request(api).post('/api/bookings').send(booking({ email: '  IVAN@Mail.RU ' }));
    expect(ok.status).toBe(201);
    expect(ok.body.email).toBe('IVAN@Mail.RU');
    const bad = await request(api).post('/api/bookings').send(booking({ email: 'не-почта' }));
    expect(bad.status).toBe(400);
    expect(bad.body.code).toBe('validation');
  });

  it('E6: неизвестный тип — 404 раньше валидации start', async () => {
    const res = await request(api).post('/api/bookings').send(booking({ eventTypeId: 'nope', start: 'не-дата' }));
    expect(res.status).toBe(404);
    expect(res.body.code).toBe('not_found');
  });

  it('кривой start (не парсится) → 400 validation', async () => {
    const res = await request(api).post('/api/bookings').send(booking({ start: 'вчера' }));
    expect(res.status).toBe(400);
    expect(res.body.code).toBe('validation');
  });
});

describe('E14: рестарт сервера на существующей БД', () => {
  let dir: string;
  let path: string;

  beforeAll(() => {
    dir = mkdtempSync(join(tmpdir(), 'cal-com-'));
    path = join(dir, 'app.db');
  });
  afterAll(() => rmSync(dir, { recursive: true, force: true }));

  it('seed не дублирует, брони остаются', async () => {
    const first = openDb(path);
    migrate(first);
    seed(first);
    void createApp(first, NOW); // приложение пересоздаётся как при рестарте процесса
    const res = await request(createApp(first, NOW)).post('/api/bookings').send({
      eventTypeId: 'meet-15',
      start: '2026-09-10T06:00:00.000Z',
      name: 'Г',
      email: 'g@example.com',
    });
    expect(res.status).toBe(201);
    first.close();

    const second = openDb(path);
    migrate(second);
    seed(second);
    const types = await request(createApp(second, NOW)).get('/api/event-types');
    expect(types.body).toHaveLength(2);
    // GET /bookings появится в 3.4 — до этого проверяем напрямую по БД
    const rows = second.prepare('SELECT COUNT(*) AS n FROM bookings').get() as { n: number };
    expect(rows.n).toBe(1);
    second.close();
  });
});
