import { mkdirSync } from 'node:fs';
import { dirname } from 'node:path';
import Database from 'better-sqlite3';
import { SCHEMA_SQL } from './schema.js';

export type Db = Database.Database;

// Путь к файлу БД: DATABASE_PATH (прод/Docker), по умолчанию backend/data/app.db.
// ':memory:' — для юнит-тестов.
export function defaultDbPath(): string {
  return process.env.DATABASE_PATH ?? new URL('../../data/app.db', import.meta.url).pathname;
}

export function openDb(path: string = defaultDbPath()): Db {
  if (path !== ':memory:') {
    mkdirSync(dirname(path), { recursive: true });
  }
  const db = new Database(path);
  // WAL — штатный режим better-sqlite3; FK включаем явно: SQLite по умолчанию их не проверяет
  db.pragma('journal_mode = WAL');
  db.pragma('foreign_keys = ON');
  return db;
}

export function migrate(db: Db): void {
  db.exec(SCHEMA_SQL);
}
