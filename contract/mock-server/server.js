// Стаб контракта (шаг 2.1b): in-memory реализация всех 5 ручек открытого
// контракта contract/dist/openapi.yaml. Вторичный источник правды — сверяется
// с контрактом; Prism для этого не годится (не хранит состояние — «бронь →
// Занято» не показать). Dev-инструмент этапа 2, в прод не попадает.
import crypto from 'node:crypto';
import express from 'express';

const MSK_OFFSET_MIN = 180; // Europe/Moscow фиксировано +03:00 (спека C2)
const WORK_START = 9 * 60;
const WORK_END = 18 * 60;
const WINDOW_DAYS = 14;

const error = (res, status, code, message) => res.status(status).json({ code, message });

const state = {
  eventTypes: [
    { id: 'meet-15', title: 'Встреча 15 минут', description: 'Короткий созвон на 15 минут', durationMinutes: 15 },
    { id: 'meet-30', title: 'Встреча 30 минут', description: 'Созвон на полчаса', durationMinutes: 30 },
  ],
  bookings: [],
};

const overlaps = (start, end) =>
  state.bookings.filter((b) => start < b.end && end > b.start); // пересечение, стык не конфликт

function mskDay(date) {
  return new Intl.DateTimeFormat('en-CA', { timeZone: 'Europe/Moscow', year: 'numeric', month: '2-digit', day: '2-digit' })
    .format(date);
}

function addDays(isoDay, days) {
  const [y, m, d] = isoDay.split('-').map(Number);
  return new Date(Date.UTC(y, m - 1, d + days)).toISOString().slice(0, 10);
}

const app = express();
app.use(express.json({ limit: '64kb' }));
app.use((err, _req, res, next) => {
  if (err?.type === 'entity.too.large') return error(res, 413, 'payload_too_large', 'Тело запроса слишком большое');
  return next(err);
});

app.get('/api/event-types', (_req, res) => res.json(state.eventTypes));

app.get('/api/event-types/:id/slots', (req, res) => {
  const type = state.eventTypes.find((t) => t.id === req.params.id);
  if (!type) return error(res, 404, 'not_found', `Тип события не найден: ${req.params.id}`);
  const date = req.query.date;
  if (typeof date !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return error(res, 400, 'validation', 'date обязателен и должен быть YYYY-MM-DD');
  }
  if (new Date(`${date}T00:00:00Z`).toISOString().slice(0, 10) !== date) {
    return error(res, 400, 'validation', `date не календарная дата: ${date}`);
  }
  const today = mskDay(new Date());
  if (date < today || date > addDays(today, WINDOW_DAYS - 1)) {
    return error(res, 400, 'slot_out_of_window', `дата вне окна записи (${WINDOW_DAYS} дней, MSK): ${date}`);
  }
  const now = new Date();
  const dayStart = Date.parse(`${date}T00:00:00Z`) - MSK_OFFSET_MIN * 60_000;
  const slots = [];
  for (let m = WORK_START; m + type.durationMinutes <= WORK_END; m += type.durationMinutes) {
    const start = new Date(dayStart + m * 60_000).toISOString();
    const end = new Date(dayStart + (m + type.durationMinutes) * 60_000).toISOString();
    if (new Date(start) < now) continue;
    slots.push({ start, end, status: overlaps(start, end).length > 0 ? 'booked' : 'available' });
  }
  res.json(slots);
});

app.post('/api/bookings', (req, res) => {
  const b = req.body ?? {};
  const type = state.eventTypes.find((t) => t.id === b.eventTypeId);
  if (!type) return error(res, 404, 'not_found', `Тип события не найден: ${b.eventTypeId}`);
  let start;
  if (
    typeof b.start !== 'string' || Number.isNaN((start = new Date(b.start)).getTime()) ||
    typeof b.name !== 'string' || b.name.trim() === '' || b.name.length > 120 ||
    typeof b.email !== 'string' || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(b.email) ||
    (b.notes !== undefined && (typeof b.notes !== 'string' || b.notes.length > 2000))
  ) {
    return error(res, 400, 'validation', 'name/email/start/notes не проходят валидацию контракта');
  }
  const startIso = start.toISOString();
  const endIso = new Date(start.getTime() + type.durationMinutes * 60_000).toISOString();
  if (overlaps(startIso, endIso).length > 0) {
    return error(res, 409, 'slot_conflict', 'Слот уже занят (пересечение интервалов)');
  }
  const booking = {
    id: crypto.randomUUID(),
    eventTypeId: type.id,
    start: startIso,
    end: endIso,
    name: b.name.trim(),
    email: b.email,
    ...(b.notes ? { notes: b.notes } : {}),
    createdAt: new Date().toISOString(),
  };
  state.bookings.push(booking);
  res.status(201).json(booking);
});

app.get('/api/bookings', (_req, res) => {
  const nowIso = new Date().toISOString();
  res.json(state.bookings.filter((b) => b.start >= nowIso).sort((a, b) => a.start.localeCompare(b.start)));
});

app.post('/api/event-types', (req, res) => {
  const t = req.body ?? {};
  if (
    typeof t.id !== 'string' || !/^[a-z0-9-]{1,40}$/.test(t.id) ||
    typeof t.title !== 'string' || t.title.length < 1 || t.title.length > 80 ||
    !Number.isInteger(t.durationMinutes) || t.durationMinutes < 5 || t.durationMinutes > 540 || t.durationMinutes % 5 !== 0
  ) {
    return error(res, 400, 'validation', 'id/title/durationMinutes не проходят валидацию контракта');
  }
  if (state.eventTypes.some((x) => x.id === t.id)) {
    return error(res, 409, 'duplicate_id', `id уже занят: ${t.id}`);
  }
  const type = {
    id: t.id,
    title: t.title,
    ...(typeof t.description === 'string' && t.description ? { description: t.description } : {}),
    durationMinutes: t.durationMinutes,
  };
  state.eventTypes.push(type);
  res.status(201).json(type);
});

// Неизвестный /api/* — тот же формат Error (E19), не html-заглушка Express
app.use('/api', (_req, res) => error(res, 404, 'not_found', 'Маршрут не найден'));

const port = Number(process.env.MOCK_PORT ?? 4020);
app.listen(port, () => console.log(`contract stub on :${port} (MOCK_PORT)`));
