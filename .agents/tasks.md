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
  поведение + тест + коммит (`docs/retrospective.md` §4).
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
- [x] **Аудит второго прохода** (N1–N9) зафиксирован: `docs/architecture-audit.md`
      (ветка `docs/audit`, dbaad61); верификация по исходникам: N7 — ложная тревога
      (`--warn-as-error` есть у `tsp compile`), N1 — уточнён (Prism `Prefer: code=`
      для 404/409; stateful-сценарий — нет), N4 — фикс через прозу спеки + `@doc`
- [x] **Правки A1–A5 внесены** (ветка `docs/audit-fixes`): спека (модель ошибок +
      `payload_too_large`, E18–E20, сплит E3, `Owner`, `date` обязателен), план
      (стаб 2.1b, критерии 1.6/2.2/2.3/3.5, e2e-время N5, порт стаба 4020),
      понимание (§4/§5/§8/§9/§10/§11, решения 15–16), путеводитель (C7, E1–E20)
- [x] **Стек финализирован 2026-09-01** (решения владельца по аудиту: Q1 — стаб,
      Q2 — расширение `Error`): см. секцию «Стек проекта» ниже и §5/§11 понимания

### Шаг 1 — Проектирование приложения (Design First / TypeSpec)
Детали каждой подзадачи — `docs/project-understanding.md` §9 «Шаг 1» и спека
`docs/specs/api-contract.md` (модели/ручки/коды уже зафиксированы — кодеру не решать).

- [ ] GitHub Issue «API-контракт» (текст — из спеки)
- [ ] Обёртка dev-окружения: скрипт/compose `node:24` (volume на проект) — §11 решение 7
- [ ] Каркас `contract/`: `package.json` (пин `@typespec/*`), `tspconfig.yaml`
      (emitter openapi3, `output-file-type: yaml`, вывод `dist/`), `main.tsp` (`@server /api`)
- [ ] `models.tsp` по спеке: EventType, Slot(+status), Booking, BookingCreate, Error
      (`Owner` — не модель, а `@doc`: в openapi.yaml unreferenced-модели не попадают)
- [ ] `routes.tsp` по спеке: 5 ручек, коды 200/201/400/404/409, `date` — required `@query`
- [ ] `npx tsp compile . --warn-as-error` → `contract/dist/openapi.yaml` (коммитим)
- [ ] Smoke через Prism: `curl` по всем ручкам; 404/409 — заголовок `Prefer: code=NNN`
      (Prism без состояния; stateful-сценарий — стаб на этапе 2, 2.1b)
- [ ] (после явного «да» пользователя) CI-проверка синхронизации openapi.yaml (compile → diff)
- [ ] `docs/specs/api-contract.md` → статус «готово»; ритуал закрытия сессии

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

### Стек проекта (финализирован 2026-09-01: ревью + аудит, `docs/architecture-audit.md`; см. `docs/project-understanding.md` §5/§11)
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
