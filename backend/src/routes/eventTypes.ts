import { Router } from 'express';
import { HttpError } from '../errors.js';
import type { Db } from '../db/connection.js';
import { getEventType, listEventTypes } from '../repositories/eventTypes.js';
import { buildSlots } from '../services/slots.js';
import { now, type NowFn } from '../services/now.js';

export function eventTypesRouter(db: Db, nowFn: NowFn = now): Router {
  const router = Router();

  router.get('/', (_req, res) => {
    res.json(listEventTypes(db));
  });

  // Сетка слотов дня. Порядок проверок по E6: тип (404) раньше валидации
  // даты; формат/окно/сетка — в сервисе (ValidationError/OutOfWindowError)
  router.get('/:id/slots', (req, res) => {
    const type = getEventType(db, req.params.id);
    if (!type) {
      throw new HttpError(404, 'not_found', `Тип события не найден: ${req.params.id}`);
    }
    const date = req.query.date;
    if (typeof date !== 'string' || date === '') {
      throw new HttpError(400, 'validation', 'date обязателен: ?date=YYYY-MM-DD (E20)');
    }
    res.json(buildSlots(db, type, date, nowFn));
  });

  return router;
}
