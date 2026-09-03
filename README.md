# Календарь звонков


[![hexlet-check](https://github.com/ivbbest/ai-for-developers-project-386/actions/workflows/hexlet-check.yml/badge.svg)](https://github.com/ivbbest/ai-for-developers-project-386/actions)

Разработайте совместно с ИИ сервис для бронирования календаря

Учебный проект Хекслета: https://ru.hexlet.io/programs/ai-for-developers
Как это должно работать: https://files.hexlet.app/a/2ipc5m

## Стек

- Контракт: TypeSpec → OpenAPI (`contract/`) — единый источник правды для фронта и бэка
- Фронтенд: Vite, React, TypeScript, Tailwind, shadcn/ui, react-router
- Бэкенд: Node.js 24, Express 5, zod, SQLite (better-sqlite3)
- Тесты: smoke контракта (Prism) и стаба, юнит-тесты бэкенда (vitest),
  сквозные e2e (Playwright), сверка ответов с OpenAPI через prism-proxy
- Окружение разработки: все команды — в контейнере `node:24` (`./scripts/dev.sh`)

## Установка

Нужен Docker (или Node.js 24 и npm локально).

```bash
git clone https://github.com/ivbbest/ai-for-developers-project-386.git
cd ai-for-developers-project-386
npm install
```

## Запуск

В WSL-окружении без Linux-`node` все команды идут через dev-обёртку:
`./scripts/dev.sh <команда>`. Переменные окружения (`PORT`, `MOCK_PORT`,
`VITE_API_TARGET`, `NOW`) обёртка прокидывает из хоста.

**Фронтенд без бэкенда — на стабе контракта** (in-memory, с состоянием:
бронь → слот «Занято» → повтор даёт 409):

```bash
./scripts/dev.sh npm run start -w @cal-com/mock-server   # стаб на :4020
./scripts/dev.sh npm run dev -w frontend                 # :5173, /api → :4020
```

Открыть http://localhost:5173 — каталог, выбор слота, бронь, админка.

**Сборка контракта и проверки:**

```bash
./scripts/dev.sh npm run compile -w @cal-com/contract             # → contract/dist/openapi.yaml
./scripts/dev.sh npm run smoke -w @cal-com/contract               # Prism-smoke по контракту
./scripts/dev.sh npm run smoke -w @cal-com/mock-server   # сценарий на стабе
```

Юнит-тесты и проверки бэкенда:

```bash
./scripts/dev.sh npm test -w backend                       # хранилище, слоты, API (vitest)
./scripts/dev.sh npm run contract:check -w backend         # ответы бэкенда против OpenAPI (prism proxy)
./scripts/e2e.sh                                           # Playwright: полный сценарий (первый запуск
                                                           # сам поставит зависимости и соберёт образ)
```

**Прод-режим одним портом** (без Docker):

```bash
./scripts/dev.sh sh -c 'cd frontend && npm run build'   # сборка в frontend/dist
./scripts/dev.sh sh -c 'cd backend && npm run build'    # компиляция в backend/dist
PORT=3001 ./scripts/dev.sh node backend/dist/server.js  # :3001 — и UI, и API
```

Бэкенд сам раздаёт `frontend/dist` + SPA-fallback на не-`/api`-маршруты;
каталог сборки ищется по `STATIC_DIR` (Docker-переопределение) или рядом с собой.

**Docker** (то же приложение одним контейнером, `PORT` из env, по умолчанию 3000):

```bash
docker build -t cal-com .
docker run -p 3000:3000 -e PORT=3000 -v ./data:/app/backend/data cal-com
```

## Как это работает

Гость: `/book` — каталог типов событий → `/book/:typeId` — календарь на 14 дней
и сетка слотов 09:00–18:00 МСК (шаг равен длительности типа, занятые помечены
«Занято») → форма Имя/Email/заметки → подтверждение. Конфликт слота при
бронировании возвращает 409, интерфейс показывает ошибку и обновляет сетку.

Владелец: `/admin` — предстоящие встречи, `/admin/new-type` — создание нового
типа события (читаемый id задаёт владелец). Авторизации нет по условию курса,
в демо используются только фиктивные данные.
