# Реестр задач проекта «Календарь звонков»

Файл в git (`.agents/` — публичная курируемая память, см. AGENTS.md «Что в git»):
без секретов и PII. Перенесён из корня репо 2026-08-30, с 2026-09-01 (51be0c8)
отслеживается. Публичные задачи курса — также в GitHub Issues.

## Правила ведения

- **Git-workflow (решение пользователя 2026-09-01).** Ветка `<тип>/<тема>` от `main`
  на каждую существенную разработку; коммит-чекпоинт на каждое изменение;
  **push, открытие PR и слияние в `main` — только пользователь** (push агенту закрыт
  правилами окружения). Зависимая работа — на паузе до мержа
  зависимости; независимые — параллельные ветки. Детали и ветки этапов —
  `docs/work-plan.md` «Git-workflow».
- **Тесты обязательны** слоем на этап (`docs/work-plan.md` «Тесты»); задача =
  поведение + тест + коммит (`retrospective.md` (архив: `.agents/archive/`) §4).
- **Публичная гигиена**: в коде/коммитах/PR/README и docs приложения — без
  ИИ-формулировок и ссылок на `AGENTS.md`/`.agents` (исключение — planning-доки курса).
- **Статусы:** `[ ]` todo · `[~]` in_progress · `[x]` done (с датой/SHA, где есть).
- Стабильные ID не перенумеровывать; закрытые строки не перезаписывать.
- Обновление после заметной задачи; итоги — в `.agents/context.md` (журнал).
- **Ритуал конца сессии:** извлечённые уроки (особенности кода, грабли, решения)
  добавить **в конец** `.agents/mem/learnings.md` (append-only), чтобы новый чат
  не переоткрыл закрытый вопрос.

## Настройка проекта (выполнено при старте)

- [x] Склонирован репозиторий `ivbbest/ai-for-developers-project-386` (папка = репозиторий)
- [x] Созданы `AGENTS.md`, `.gitignore`, `tasks.md`
- [x] Настроена локальная память `.agents/` (context.md, mem/MEMORY.md)
- [x] Установлены скиллы: ru-text, supabase-postgres-best-practices, grill-me (`npx skills add`)
- [x] Проверено: `.agents/`, `.opencode/`, `skills-lock.json` в git-игноре; в коммит идут 3 файла
- [x] **Закоммитить** AGENTS.md / tasks.md / .gitignore (шаг пользователя) — коммит 3f04edd
- [x] **Перезапустить opencode**, чтобы скиллы подхватились (грузится при старте) — перезапуск был, скиллы активны

## GitHub-интеграция opencode (шаги пользователя)

> **Полная пошаговая инструкция — `.agents/mem/github-integration.md`** (локально,
> для возобновления после перезапуска). Итог фиксируется в этом чек-листе.

- [x] `opencode github install` в корне репозитория (мастер: GitHub App, создание workflow) — workflow создан 2026-08-30
- [x] Выставить `share: false` в `.github/workflows/opencode.yml` — сделано
- [x] Добавить API-ключ в GitHub Actions secrets (только пользователь) — секрет OPENCODE_API_KEY добавлен 2026-08-30
- [x] Закоммитить/запушить `opencode.yml`; проверить `/opencode ping` в Issues — issue #1, `/oc summarize` ответил бот (run 33316614793)
- [x] Security-аудит: контроль доступа — фильтр владельца `ivbbest` в `opencode.yml`; минимальные permissions (read) — коммит 28df6ea
- [x] Расширить до 4 workflow-файлов по сценариям (2026-09-01, см. github-integration.md «Карта файлов»): triage/review/schedule. Изменения в рабочем дереве.

## Разработка (задачи курса)

> Исполняемый план с деталями и критериями готовности — `docs/work-plan.md`
> (этапы 0–5). Ниже — статус-чек-лист; при расхождении приоритет у work-plan.md.

### Шаг 0 — Предварительный анализ (входные материалы)
- [x] Изучены `input/*.txt` (user-story, design-first, frontend, backend, docker)
- [x] Прочитаны все скриншоты `input/*.png` и `input/design/*.png` (OCR: tesseract rus+eng)
- [x] Проанализированы все ссылки из материалов (TypeSpec, Vite, shadcn, Mantine, Prism,
      Playwright MCP, CDP MCP, Conventional Commits, release-please, cal.com, Render/Railway)
- [x] Составлено предварительное понимание: `docs/project-understanding.md`
- [x] Создан SDD-lite каркас: `docs/specs/TEMPLATE.md`, черновик `docs/specs/api-contract.md`
- [x] Зафиксированы стек-решение и структура (§5/§10/§11 в project-understanding.md)
- [x] Создан путеводитель по изучению проекта: `docs/reading-guide.md`

### Шаг 0.5 — Архитектурное ревью плана и контракта
- [x] Ревью артефактов шага 0 (контракт ↔ UI ↔ план, перекрёстная сверка со скринами)
- [x] Находки К1–К7 закрыты решениями в `docs/specs/api-contract.md` (C1–C7) и
      `docs/project-understanding.md` §11 (решения 7–12)
- [x] Решения пользователя: `.agents` — публичная память без PII; dev-команды —
      контейнер `node:24`; хранение — SQLite + идемпотентный seed (эфемерность Render принята)
- [x] Опечатки/статусы в docs и памяти синхронизированы (docs/, AGENTS.md, .agents/*)
- [x] **Коммит** обновлённых `docs/`, `AGENTS.md`, `.agents/` — ветка `docs/review-finalization`,
      цепочка атомарных коммитов (от 7587641); PR #2 влит в main (92ff6f3)
- [x] **Аудит второго прохода** (N1–N9) зафиксирован: `architecture-audit.md` (архив: `.agents/archive/`)
      (ветка `docs/audit`, dbaad61); верификация по исходникам: N7 — ложная тревога
      (`--warn-as-error` есть у `tsp compile`), N1 — уточнён (Prism `Prefer: code=`
      для 404/409; stateful-сценарий — нет), N4 — фикс через прозу спеки + `@doc`
- [x] **Правки A1–A5 внесены** (ветка `docs/audit-fixes`): спека (модель ошибок +
      `payload_too_large`, E18–E20, сплит E3, `Owner`, `date` обязателен), план
      (стаб 2.1b, критерии 1.6/2.2/2.3/3.5, e2e-время N5, порт стаба 4020),
      понимание (§4/§5/§8/§9/§10/§11, решения 15–16), путеводитель (C7, E1–E20)
- [x] **Стек финализирован 2026-09-01** (решения владельца по аудиту: Q1 — стаб,
      Q2 — расширение `Error`): см. секцию «Стек проекта» ниже и §5/§11 понимания
- [x] **Перепроверка 2026-09-02**: аудиты `architecture-audit.md` (архив: `.agents/archive/`) §9 (N10–N14),
      `work-plan-audit.md` (архив: `.agents/archive/`) (F1–F7) и `status-audit.md` (архив: `.agents/archive/`) (готовность);
      cross-ссылки и команды очистки веток в аудитах исправлены при верификации;
      правки F1.1–F7.1 / A6–A8 внесены в план и этот реестр (ветка `docs/plan-fixes`)

### Шаг 1 — Проектирование приложения (Design First / TypeSpec) — ветка `feat/api-contract`, issue #6
Детали каждой подзадачи — `docs/project-understanding.md` §9 «Шаг 1» и спека
`docs/specs/api-contract.md` (модели/ручки/коды уже зафиксированы — кодеру не решать).

- [x] GitHub Issue «API-контракт» (текст — из спеки) — issue #6, ссылка в шапке спеки (b53c267)
- [x] Обёртка dev-окружения: `docker-compose.dev.yml` + `scripts/dev.sh` (node:24, volume на
      проект) — проверено: node v24.20.0, better-sqlite3 13.0.3 из prebuild за ~4 с без тулчейна (e34ebc0)
- [x] Корневой `package.json` монорепо: NPM workspaces `contract`, `frontend`, `backend`
      (`e2e` — не включать); `npm ci`/compile из корня работают (4bf7f03)
- [x] Каркас `contract/`: `package.json` (пин @typespec 1.15.0/rest 0.85.0 + json-schema),
      `tspconfig.yaml` (yaml в `{project-root}/dist`, `seal-object-schemas`), `main.tsp` (`@server /api`)
- [x] `models.tsp` по спеке: EventType, Slot(+status), Booking, BookingCreate, Error;
      `Owner` — `@doc` на админ-интерфейсе; `@multipleOf(5)` через @typespec/json-schema (c6942de, dba2c29)
- [x] `routes.tsp` по спеке: 5 ручек, коды 200/201/400/404/409 (+413 на POST, E18),
      `date` — required `@query`; 404/409 — `@opExample` тел `Error`; код `duplicate_id`
      добавлен в C7 (409 «id занят») со синхронизацией спеки (def5343, 2cdd657)
- [x] `tsp compile . --warn-as-error` чистый → `contract/dist/openapi.yaml` закоммичен (756a25e)
- [x] Smoke через Prism (`contract/smoke.sh`, `npm run smoke -w contract`): 29 проверок —
      все ручки/коды, E8/E12/E20; префикс /api по yaml (Prism игнорирует относительный servers.url)
- [x] (согласие владельца 2026-09-02) CI-проверка синхронизации openapi.yaml
      (compile → diff) — workflow `contract-sync.yml`, зелёный/красный проверены локально
- [x] `docs/specs/api-contract.md` → статус «готово», критерии отмечены; ритуал закрытия —
      этим обновлением памяти; CI-проверка синхронизации (1.7) — ждёт явного согласия владельца

### Дальнейшие шаги (по ходу курса)
- Шаг 2: Фронтенд (`frontend/`, Vite+React+TS+shadcn/ui, страницы по §3/§9/§10;
  + `/admin/new-type` — форма создания типа; время форматировать в MSK; Vite-proxy `/api`;
  мок разработки — стаб контракта `contract/mock-server` (2.1b), не Prism — он без состояния)
- Шаг 3: Бэкенд (`backend/`, Node+Express+TS+zod+SQLite, по §9/§10; пересечения
  интервалов в транзакции; единый JSON-хендлер ошибок `/api/*` (E18–E19);
  `express.static(frontend/dist)` + SPA-fallback на `PORT`; здесь — проверка
  «отдельно запущенного бэка» (3.5))
- Шаг 4: e2e (`e2e/` Playwright; время — env `NOW` или динамический расчёт в MSK)
  + CI (`e2e.yml`) + Conventional Commits + release-please
- Шаг 5: Docker (multi-stage, PORT, единое приложение) + деплой (Render/Railway) + публичная ссылка

### Шаг 2 — Фронтенд — ветка `feat/frontend` (после мержа этапа 1)

- [ ] 2.1 каркас Vite+React+TS+shadcn (dev-сервер отдаёт роуты)
- [ ] 2.1b стаб контракта `contract/mock-server` (in-memory, 5 ручек, 409 по пересечению, MOCK_PORT=4020)
- [ ] 2.2 API-клиент по контракту + Vite-proxy `/api` (таргет — env `VITE_API_TARGET`)
- [ ] 2.3 экраны: /, /book, /book/:typeId, confirm (409+рефреш), success, /admin, /admin/new-type
- [ ] 2.4 build зелёный, сверка с §3, README «Запуск»

### Шаг 3 — Бэкенд — ветки `feat/backend-db` → `feat/backend-api`

`feat/backend-db` (готов, ждёт пуш/PR):
- [x] 3.1 каркас Express+TS+zod, константы TZ/часов/окна, `now()` (env `NOW`, инъекция),
      схема+репозитории, идемпотентный seed, GET каталога — 6745038
- [x] 3.2 сервис сетки слотов (09:00 MSK шаг=duration, end≤18:00, прошедшие вне,
      booked по пересечению со всеми бронями, окно сегодня..+13 MSK) — dcdc080
- [x] перепроверка ветки: npm ci → typecheck/build/test (24 зелёные), ревью
      свежим взглядом, фиксы (канонизация ISO-меток в хранении — major) — 611244b

`feat/backend-api` (на паузе до мержа backend-db):
- [ ] 3.3 POST /api/bookings (валидация zod, серверный end, транзакция, 409)
- [ ] 3.4 POST /event-types + GET /bookings + глобальный JSON-хендлер ошибок (E18–E20),
      сверка с контрактом через prism proxy
- [ ] 3.5 раздача фронта + SPA-fallback + dev-связка с реальным бэком (VITE_API_TARGET)

### Стек проекта (финализирован 2026-09-01: ревью + аудит, `architecture-audit.md` (архив: `.agents/archive/`); см. `docs/project-understanding.md` §5/§11)
- Фронт: TypeScript + Vite + React + shadcn/ui; мок разработки — стаб контракта
  (Prism — smoke по схеме и proxy-валидация).
- Контракт: TypeSpec → OpenAPI (единый источник правды); префикс `/api`.
- Бэк: Node + Express + TypeScript + zod; хранение SQLite (better-sqlite3) + seed при старте.
- e2e: Playwright (`e2e/`); релизы: Conventional Commits + release-please-action v4.
- Деплой: Docker (PORT, один контейнер: API + статика) → Render / Railway.
- Структура: монорепо `contract/ + frontend/ + backend/ + e2e/`, корневой NPM workspaces.
- Окружение: WSL2, `node` на PATH нет, npm — Windows-обёртка; **все dev-команды через
  контейнер `node:24`** (решение §11 7); Docker 29.x доступен нативно.
- Отклонено (финально): Fastify (взяли Express), Mantine (взяли shadcn/ui),
  TanStack Query (тонкий fetch-клиент); Prism как мок этапа 2 (взяли стаб контракта).
