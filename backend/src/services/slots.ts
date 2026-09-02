import type { Db } from '../db/connection.js';
import { findOverlaps } from '../repositories/bookings.js';
import { now, type NowFn } from './now.js';
import {
  MSK_OFFSET_MINUTES,
  SERVICE_TZ,
  WINDOW_DAYS,
  WORK_END_MINUTE,
  WORK_START_MINUTE,
} from '../config.js';
import type { EventType, Slot } from '../types.js';

// Ошибки слоя — типизированы; маппинг в HTTP (400 validation / 400
// slot_out_of_window) делает маршрут (3.4), чтобы сервис не знал про Express.
export class ValidationError extends Error {}
export class OutOfWindowError extends Error {}

// ISO-календарный день (YYYY-MM-DD) момента в TZ сервиса — через Intl,
// без ручной арифметики дат: «сегодня» считается по MSK, не по UTC/браузеру.
export function mskDay(moment: Date): string {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: SERVICE_TZ,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(moment);
  const get = (type: Intl.DateTimeFormatPartTypes) => parts.find((p) => p.type === type)?.value;
  return `${get('year')}-${get('month')}-${get('day')}`;
}

function addDays(isoDay: string, days: number): string {
  const [y, m, d] = isoDay.split('-').map(Number) as [number, number, number];
  return new Date(Date.UTC(y, m - 1, d + days)).toISOString().slice(0, 10);
}

export function isDateInWindow(dateStr: string, nowFn: NowFn): boolean {
  const today = mskDay(nowFn());
  return dateStr >= today && dateStr <= addDays(today, WINDOW_DAYS - 1);
}

// Проверка формата и календарной реальности (E4: «2026-02-30», «2026-9-5» — 400).
export function assertValidDate(dateStr: string): void {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
    throw new ValidationError(`date должен быть YYYY-MM-DD, получено: ${dateStr}`);
  }
  const ms = Date.parse(`${dateStr}T00:00:00Z`);
  if (Number.isNaN(ms) || new Date(ms).toISOString().slice(0, 10) !== dateStr) {
    throw new ValidationError(`date не календарная дата: ${dateStr}`);
  }
}

// Сетка дня (спека «Доменные сущности», Slot): от 09:00 MSK с шагом
// durationMinutes, пока end <= 18:00 MSK; прошедшие слоты (start < now)
// исключены; занятые — со статусом booked (пересечение с ЛЮБОЙ бронью).
export function buildSlots(db: Db, type: EventType, dateStr: string, nowFn: NowFn = now): Slot[] {
  assertValidDate(dateStr);
  // Сервис может получить любую строку из БД; шаг <= 0 зациклил бы сетку.
  // Валидация форматов на границе HTTP — задача маршрутов (3.4).
  if (type.durationMinutes <= 0 || !Number.isInteger(type.durationMinutes)) {
    throw new ValidationError(`durationMinutes должен быть положительным целым: ${type.durationMinutes}`);
  }
  // Один момент «сейчас» на запрос: окно и отсечка прошедших сверяются
  // с одними и теми же часами.
  const t = nowFn();
  if (!isDateInWindow(dateStr, () => t)) {
    throw new OutOfWindowError(`дата вне окна записи (${WINDOW_DAYS} дней, MSK): ${dateStr}`);
  }

  const nowMs = t.getTime();
  // MSK-минута дня → абсолютный UTC-момент: день начинается в 00:00 MSK,
  // это на MSK_OFFSET_MINUTES раньше, чем 00:00 того же UTC-дня.
  const dayStartUtc = Date.parse(`${dateStr}T00:00:00Z`) - MSK_OFFSET_MINUTES * 60_000;
  const at = (minuteOfDay: number) => new Date(dayStartUtc + minuteOfDay * 60_000);

  const slots: Slot[] = [];
  for (let m = WORK_START_MINUTE; m + type.durationMinutes <= WORK_END_MINUTE; m += type.durationMinutes) {
    const start = at(m);
    const end = at(m + type.durationMinutes);
    if (start.getTime() < nowMs) continue;
    const startIso = start.toISOString();
    const endIso = end.toISOString();
    const status = findOverlaps(db, startIso, endIso).length > 0 ? 'booked' : 'available';
    slots.push({ start: startIso, end: endIso, status });
  }
  return slots;
}
