import express, { type Express } from 'express';
import type { Db } from './db/connection.js';
import { apiErrorHandler } from './middleware/errors.js';
import { HttpError } from './errors.js';
import { eventTypesRouter } from './routes/eventTypes.js';
import { bookingsRouter } from './routes/bookings.js';
import { now, type NowFn } from './services/now.js';

export function createApp(db: Db, nowFn: NowFn = now): Express {
  const app = express();
  app.use(express.json({ limit: '64kb' }));
  app.use('/api/event-types', eventTypesRouter(db, nowFn));
  app.use('/api/bookings', bookingsRouter(db, nowFn));
  // E19: неизвестный /api/* → 404 Error (не html, не провал в SPA-fallback).
  // Ставится после всех api-маршрутов.
  app.use('/api', (_req, _res, next) =>
    next(new HttpError(404, 'not_found', 'Маршрут не найден')),
  );
  // единый JSON-хендлер ошибок — последним (C7, E18–E19)
  app.use(apiErrorHandler);
  return app;
}
