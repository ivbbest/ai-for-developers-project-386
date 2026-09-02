import { existsSync } from 'node:fs';
import { join } from 'node:path';
import express, { type Express } from 'express';

// Прод-режим одним портом (решение §11.9): Express раздаёт сборку фронта,
// SPA-fallback — только на не-/api GET (E19: /api/* не должен проваливаться
// в index.html). Директория отсутствует (dev, сборка не делалась) — не монтируем.
export function mountStatic(app: Express, dir: string): boolean {
  const index = join(dir, 'index.html');
  if (!existsSync(index)) return false;
  app.use(express.static(dir));
  app.use((req, res, next) => {
    if (req.method !== 'GET' || req.path.startsWith('/api')) return next();
    // callback обязателен: гонка «файл удалили между проверкой и отдачей»
    // иначе улетает в error-handler как 500 вместо штатного 404
    res.sendFile(index, (err) => {
      if (err) next();
    });
  });
  return true;
}
