import { Router } from 'express';
import type { Db } from '../db/connection.js';
import { listEventTypes } from '../repositories/eventTypes.js';

export function eventTypesRouter(db: Db): Router {
  const router = Router();

  router.get('/', (_req, res) => {
    res.json(listEventTypes(db));
  });

  return router;
}
