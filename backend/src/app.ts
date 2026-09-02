import express, { type Express } from 'express';
import type { Db } from './db/connection.js';
import { eventTypesRouter } from './routes/eventTypes.js';

export function createApp(db: Db): Express {
  const app = express();
  app.use(express.json({ limit: '64kb' }));
  app.use('/api/event-types', eventTypesRouter(db));
  return app;
}
