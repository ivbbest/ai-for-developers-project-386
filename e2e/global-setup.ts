import { rmSync } from 'node:fs';
import { DB_PATH } from './env.js';

// Чистый старт: файл БД с прошлого прогона (и WAL-соседи) удаляется до
// подъёма серверов — сценарии считают каталог и слоты пустыми.
export default function globalSetup(): void {
  for (const suffix of ['', '-wal', '-shm']) {
    rmSync(`${DB_PATH}${suffix}`, { force: true });
  }
}
