import { rmSync } from 'node:fs';

// Чистый старт: файл БД с прошлого прогона (и WAL-соседи) удаляется до
// подъёма серверов — сценарии считают каталог и слоты пустыми.
export default function globalSetup(): void {
  for (const suffix of ['', '-wal', '-shm']) {
    rmSync(`/tmp/cal-e2e.db${suffix}`, { force: true });
  }
}
