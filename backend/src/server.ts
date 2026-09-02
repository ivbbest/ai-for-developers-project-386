import { openDb, migrate } from './db/connection.js';
import { seed } from './db/seed.js';
import { createApp } from './app.js';

// PORT — обязательная env (§11 решение 13): без неё внятная ошибка, а не молчаливый 0.
const port = Number(process.env.PORT);
if (!Number.isInteger(port) || port <= 0 || port > 65535) {
  console.error('PORT не задан или некорректен (пример: PORT=3001)');
  process.exit(1);
}

const db = openDb();
migrate(db);
seed(db);

const server = createApp(db).listen(port, () => {
  console.log(`cal-com API listening on :${port}`);
});

server.on('error', (err: NodeJS.ErrnoException) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`порт ${port} уже занят — укажите другой PORT`);
  } else {
    console.error(err);
  }
  process.exit(1);
});

// SIGTERM/SIGINT (Docker/Render stopping a container): дождаться текущих
// запросов, закрыть БД (WAL чекпоинтится на close) и выйти детерминированно
function shutdown(signal: string): void {
  console.log(`received ${signal}, shutting down`);
  server.close(() => {
    db.close();
    process.exit(0);
  });
}
process.on('SIGINT', () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));
