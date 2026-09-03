import { defineConfig } from '@playwright/test';
import { BACKEND_PORT, DB_PATH } from './env.js';

// webServer поднимает РЕАЛЬНЫЕ бэкенд (tsx, порт 3001) и фронт (vite, :5173) —
// ровно dev-связку из README; стаб контракта в e2e не участвует.
// workers: 1 — сценарии делят одну БД (/tmp/cal-e2e.db) и идут последовательно.
export default defineConfig({
  testDir: './tests',
  fullyParallel: false,
  workers: 1,
  reporter: [['list']],
  use: {
    baseURL: 'http://localhost:5173',
    trace: 'retain-on-failure',
    navigationTimeout: 60_000,
  },
  globalSetup: './global-setup.ts',
  webServer: [
    {
      command: 'npx tsx src/server.ts',
      cwd: '../backend',
      url: `http://localhost:${BACKEND_PORT}/api/event-types`,
      env: { PORT: String(BACKEND_PORT), DATABASE_PATH: DB_PATH },
      timeout: 60_000,
      reuseExistingServer: false,
    },
    {
      command: 'npm run dev',
      cwd: '../frontend',
      url: 'http://localhost:5173',
      env: { VITE_API_TARGET: `http://localhost:${BACKEND_PORT}` },
      timeout: 120_000,
      reuseExistingServer: false,
    },
  ],
});
