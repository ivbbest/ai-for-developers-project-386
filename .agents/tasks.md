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
  `docs/archive/work-plan.md` «Git-workflow».
- **Тесты обязательны** слоем на этап (`docs/archive/work-plan.md` «Тесты»); задача =
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

> Исполняемый план с деталями и критериями готовности — `docs/archive/work-plan.md`
> (этапы 0–5). Ниже — статус-чек-лист; при расхождении приоритет у work-plan.md.

### Шаг 0 — Предварительный анализ (входные материалы)
- [x] Изучены `input/*.txt` (user-story, design-first, frontend, backend, docker)
- [x] Прочитаны все скриншоты `input/*.png` и `input/design/*.png` (OCR: tesseract rus+eng)
- [x] Проанализированы все ссылки из материалов (TypeSpec, Vite, shadcn, Mantine, Prism,
      Playwright MCP, CDP MCP, Conventional Commits, release-please, cal.com, Render/Railway)
- [x] Составлено предварительное понимание: `docs/project-understanding.md`
- [x] Создан SDD-lite каркас: `docs/archive/specs-TEMPLATE.md`, черновик `docs/specs/api-contract.md`
- [x] Зафиксированы стек-решение и структура (§5/§10/§11 в project-understanding.md)
- [x] Создан путеводитель по изучению проекта: `docs/archive/reading-guide.md`

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

### Шаг 2 — Фронтенд — ветка `feat/frontend` — влита в main (PR #11)

- [x] 2.1 каркас Vite+React+TS+shadcn (dev-сервер отдаёт роуты) — 4151ac5
- [x] 2.1b стаб контракта `contract/mock-server` (in-memory, 5 ручек, 409 по пересечению,
      MOCK_PORT=4020) — 653ef88; валидации по ревью и смоук из 41 проверки — 6c61684
- [x] 2.2 API-клиент по контракту + Vite-proxy `/api` (таргет — env `VITE_API_TARGET`) — 76f001e
- [x] 2.3 экраны: /, /book, /book/:typeId, confirm (409+рефреш), success, /admin, /admin/new-type
      — 204dd12; сверка с референсами §3 — 5a925b3; фиксы ревью — 7e20c7a; клик-проход — e2e этапа 4
- [x] 2.4 build зелёный, сверка с §3, README «Запуск» — f8f8624; host-сеть обёртки — da8b7ec;
      strict + гигиена зависимостей — adde6a6, 02c2608

### Шаг 3 — Бэкенд — ветки `feat/backend-db` → `feat/backend-api`

`feat/backend-db` (PR #10, ждёт мержа):
- [x] 3.1 каркас Express+TS+zod, константы TZ/часов/окна, `now()` (env `NOW`, инъекция),
      схема+репозитории, идемпотентный seed, GET каталога — 6745038
- [x] 3.2 сервис сетки слотов (09:00 MSK шаг=duration, end≤18:00, прошедшие вне,
      booked по пересечению со всеми бронями, окно сегодня..+13 MSK) — dcdc080
- [x] перепроверка ветки + 7 раундов ревью PR #10 (канонизация ISO, N+1, shutdown,
      CHECK-ограничения, InvalidDateError, boundary-тесты — 28 зелёные) — 611244b..8ebee40

`feat/backend-api` (влита в main, PR #12):
- [x] 3.3 POST /api/bookings (zod .strict, серверный end, транзакция, 409) + слоты-роут
      и единый JSON-хендлер — 35680b1
- [x] 3.4 POST /event-types (409 duplicate_id через changes==0) + GET /bookings (E16) +
      сверка ответов через prism proxy (`npm run contract:check -w backend`) — de3282e
- [x] 3.5 раздача сборки + SPA-fallback (E19), прод-режим одним портом и dev-связка
      с реальным бэком проверены живыми прогонами — 7dbd219; ревью-фиксы (E3-порядок,
      зона start, Violation-гейт) — 3a63abd; в контракт добавлен код server_error (500)

### Этап 4 — e2e и релизы — ветки `test/e2e`, `ci/release-please`

- [x] 4.1 Playwright: webServer поднимает бэк+фронт; полный сценарий + «слот стал Занято»,
      повторная запись → ошибка (409), создание типа — 4/4 зелёные, ./scripts/e2e.sh — 68a8b9f
- [x] 4.2 E2E-workflow (согласие 2026-09-03): backend-unit + Playwright в Actions; критерий
      доказан полным циклом зелёный → красный на сломанном сценарии → откат → зелёный. По ходу:
      mcr-образ негоден runner'у (CDN закрыт, нет make) → node:24+install-шаг; push-триггеры
      ограничены main (гонка двух ранов на общий workspace); concurrency-группы — PR #16
- [x] 4.3 release-please: фикс тега экшена @v5 (PR #15) + переключатель «Actions can create PR»
      включён — release-PR #18 смержен: тег **cal-com-v1.0.0**, CHANGELOG, GitHub Release

### Этап 5 — Docker и публичный деплой — ветка `build/docker`

- [x] 5.1 Dockerfile multi-stage (node:24 build → node:24-slim runtime) + .dockerignore;
      один порт, HEALTHCHECK по контрактной ручке; smoke образа: API/статика/SPA/404-JSON,
      броня переживает restart (volume), healthy, ~103 МБ — 875fdff
- [x] 5.2 Деплой на Render (вариант A): **https://cal-com-97sr.onrender.com** — Docker-сборка,
      PORT от платформы (:10000), Live; сценарий бронирования в браузере пройден; после
      Manual deploy → Refresh seed на месте (эфемерный диск free-таргета — ожидаемо по §11.10)
- [x] 5.3 Секция «Демо» в README (URL + оговорки тарифа), актуальные команды тестов/Docker;
      статусы плана закрыты — **все этапы 1–5 плана выполнены**

### Документация (итог курса)

- [x] Гид по проекту: контекст, архитектура, решения с альтернативами и ценой,
      запуск, аудиторский след (PR → доказательство) — `docs/decision-guide.md`
- [x] Архив выполненных planning-доков: `docs/archive/` (work-plan, reading-guide,
      specs-TEMPLATE); ссылки в AGENTS/спеках/разборе обновлены
- [x] Статусные шапки: project-understanding (реализовано полностью), api-contract
      (сверка через prism-proxy), deploy-global (вариант A реализован)

### Ревью 2026-09-03 (ветка `docs/review-recommendations`)

- [x] Два независимых ревью (recommendations + deep-analysis) объединены и сверены
      с кодом; документ `docs/review-recommendations.md` — финальный; 7 ложных
      тревог сняты, осознанные ограничения отделены от находок
- [x] Подтверждённые P1/P2 исправлены в ветке: union `server_error`, коды стаба
      (E3/404/зона), сброс стейта при смене типа, expired-ветка + a11y на confirm,
      таймаут клиента, NOW-warn, `USER node` (образ перепроверен), CI:
      contract-check + lint фронта + пины node + docker-build-smoke (`1ad1b3c..dfa2b5d`)
- [x] Мерж с main после #21 (`5a3f104`) + 4 раунда ревью-бота: фиксы `f7c7dc8`,
      `a5de0fb`, косметика отбита с причинами; **PR влит — 34f87c2, main 5/5 зелёные**
- [ ] Остаток по документу: e2e-доводка (2 сценария), email-длина (решение
      владельца), P3-полировка

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

### Ревью 2026-09-04, раунд 2 — ветка `docs/review-recommendations-2` (реализована в этой же ветке) — влита PR #25 (6a7f588)

- [x] Три независимых прохода (бэк; фронт; контракт + e2e + CI/CD + docs) + перепроверка
      чтением/пробами/фактическими прогонами; документ раунда удалён после реализации
- [x] P2×4 — Express 4xx→400 (`errors.ts`, тест URIError), `aliveRef`/StrictMode (рефреш 409
      в dev + e2e-ассерт), e2e-очистка БД в command webServer (воспроизведено: 2 прогона в
      одном контейнере), decision-guide `USER node` | bfc5330 a764296 d2ea9b9 34632ae
- [x] Пакет P3: строгость zod↔yaml (eventTypeId-паттерн, max-до-trim, root-issue RU, 413 на
      любом POST, предикат /api, x-powered-by), notes+raw-длины в стабе (+4 смоук → 46),
      non-root-ассерт в docker.yml, trace-artifact в e2e.yml, SHA-пины экшенов, .dockerignore,
      фронтовые гонки/a11y/empty-state/textarea/preview-proxy/exhaustive-deps, отставание доков
- [x] Остаток раунда 1: 2 e2e-сценария (протухший слот E3, дата вне окна E5), де-хардкод
      времени слота, детерминированный гейт вместо 800 мс, timeout в opencode*.yml,
      deploy-global откат + перечень env, мёртвая plain-ветка INSERT | d2ea9b9 e5a5730 34632ae
- [ ] Остаток для владельца (не код): решение по длине email (контракт не ограничивает,
      zod режет 254) и подтверждение `USER node` на Render после ближайшего деплоя
