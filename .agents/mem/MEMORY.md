# MEMORY.md — индекс фактов

1 строка на запись. Категории: `user` (пользователь) · `feedback` (коррекции)
· `project` (факты проекта) · `reference` (справочно). Детали — топиками (файлы
ряда), формат `YYYY-MM-DD | запись`.

## user
- 2026-08-30 | user | GitHub-репозиторий публичный, git commit/push — только пользователь | AGENTS.md «Границы действий» (уточнено 2026-09-01: агент коммитит в рабочие ветки; push/PR/merge — пользователь)
- 2026-09-01 | user | Git-workflow: ветка `<тип>/<тема>` на каждую существенную разработку; коммит-чекпоинт на изменение; push и открытие PR — пользователь; мержит в main только пользователь; зависимая работа — на паузе до мержа | коррекция 2026-09-01
- 2026-09-01 | project | Ограничение окружения: `git push`/`fetch`/`pull` агенту запрещены (permission deny) — агент коммитит в ветку локально, push+PR делает пользователь | learnings 2026-09-01
- 2026-09-01 | user | Тесты обязательны на каждом слое (контракт/бэк-unit/фронт-сборка/e2e); изменение без тестов не готово; слои — `AGENTS.md` «Тесты обязательны» (work-plan удалён из репо 2026-09-05) | коррекция 2026-09-01
- 2026-09-01 | user | В продукте и git-истории (код, коммиты, PR, README, docs приложения) — без ИИ-формулировок и ссылок на AGENTS.md/.agents; planning-доки курса — исключение | коррекция 2026-09-01
- 2026-08-30 | user | Секреты/.env — только пользователь; в git только публичная часть | AGENTS.md «Секреты»
- 2026-08-30 | user | AGENTS.md и tasks.md коммитятся, .agents/ и .opencode/ — локально | выбор при настройке (устарело 2026-09-01: `.agents/` — в git, публичная курируемая память без PII; `.opencode/` локально; см. AGENTS.md «Что в git»)
- 2026-08-30 | user | github install выполняется пользователем интерактивно; share: false | шаг 8 (tasks.md)
- 2026-08-30 | user | Сообщения коммитов — только слова пользователя; агент не предлагает формулировки (в т.ч. «в стиле ИИ») | AGENTS.md «Границы действий»
- 2026-08-30 | user | В сообщениях коммитов не использовать слова/паттерны «ИИ»/«AI» и подобного; коммиты нейтральные. Агент может предлагать названия | AGENTS.md «Границы действий»
- 2026-08-30 | user | Не упоминать другие проекты/репозитории; только /mnt/e/hexlet/cal-com | AGENTS.md «Остальное»

## feedback
- 2026-08-30 | feedback | Сообщения коммитов — только слова пользователя; агент не предлагает формулировки (в т.ч. «в стиле ИИ») | 2026-08-30
- 2026-08-30 | feedback | Коррекция (уточнение): правило — в тексте коммита нет слов/паттернов «ИИ»/«AI» и подобного; агент может придумывать названия | 2026-08-30
- 2026-08-30 | feedback | Решение: .agents остаётся локальной (best practice — в git только выверенное: AGENTS.md/README/workflows, память-сырьё не публиковать); при «открытии» позже — курировать, а не всю папку | 2026-08-30
- 2026-08-30 | feedback | Не упоминать другие проекты/репозитории; только /mnt/e/hexlet/cal-com | 2026-08-30
- 2026-09-01 | feedback | Не вешать на задачи ярлыки «junior/middle» — план просто должен быть настолько дробным и самодостаточным, чтобы подошёл любому; упоминание «самых младших» — только про следствия, не как маркировку | 2026-09-01
- 2026-09-02 | feedback | **Сопровождение PR — инициатива агента**: от пуша ветки до мержа/закрытия сам поллить проверки (`gh pr view --json statusCheckRollup`), красные — разбирать по gh-fix-ci, ревью-замечания — триажить каждое (коммит или аргумент в комментарии), после коммитов звать на пуш; молча не бросать; пуш/мерж — владелец | просьба владельца, правило в AGENTS.md

## project
- 2026-08-30 | project | Проект: «Календарь звонков» (Хекслет ai-for-developers), репо ivbbest/ai-for-developers-project-386 | AGENTS.md
- 2026-08-30 | project | Стек не определён («Разное»); hexlet-check.yml не трогать | tasks.md (устарело 2026-09-01: стек-решение в §5/§11 project-understanding.md)
- 2026-08-30 | project | Скиллы установлены: ru-text, supabase-postgres-best-practices, grill-me (`npx skills add`) → .opencode/skills/ | context.md
- 2026-08-30 | project | skills-lock.json создан CLI (gitignored), дубликат .agents/skills удалён | context.md
- 2026-08-30 | project | Проверка итога: git untracked = AGENTS.md, tasks.md, .gitignore; .agents/.opencode игнорируются | context.md
- 2026-08-30 | project | Структура памяти: tasks.md (чек-лист, локально) + mem/ (MEMORY-индекс, learnings, топики); лимиты контекста — правилами в AGENTS.md, без opencode.json; Learnings — отдельным файлом | контекст-инжиниринг 2026-08-30
- 2026-08-30 | project | Решение: лайт-SDD; каркас (docs/specs/ + шаблон) — с первой dev-задачей курса, не раньше | план 2026-08-30
- 2026-09-02 | project | **Этап 1 (контракт) готов, ветка `feat/api-contract` ждёт мержа**: TypeSpec 1.15 → `contract/dist/openapi.yaml` (коммитится), Prism-smoke 29 проверок (`npm run smoke -w contract`); в C7 добавлен код `duplicate_id` (409 «id занят», E13); E8 закрыт `seal-object-schemas`; `durationMinutes` — `@multipleOf(5)` | issue #6
- 2026-09-02 | project | Шаг 0.2 закрыт (ветка `docs/mcp-claim-check`): официальный MCP есть у обеих площадок — Render `render-oss/render-mcp-server`, Railway в CLI (`railway mcp`); §6/§8/§9 исправлены; деплой этапа 5 — по-прежнему CLI/UI | 614d83e
- 2026-09-02 | project | **Этап 2 (фронт) влит в main (PR #11)**: экраны по референсам §3, стаб mock-server (41 проверок), клиент+proxy (`VITE_API_TARGET`), README «Запуск»; 7 раундов ревью отработаны | work-plan этап 2
- 2026-09-02 | project | Этап 3a готов: ветка `feat/backend-db` (3.1+3.2, 28 тестов) ждёт мержа PR #10; до него 3.3–3.5 (`feat/backend-api`) на паузе | work-plan 3.1/3.2
- 2026-09-03 | project | **Этап 3 влит в main (PR #10, #12)**: контракт+фронт+бэк+раздача одним портом; следующий — этап 4 (Playwright e2e, release-please по согласию). Облачный review-агент умеет коммитить в ветку PR — его коммиты проверять на соответствие сообщению (был lock-регрессив без обещанного теста) | f913fa8
- 2026-09-02 | project | **Этап 3b готов, ветка `feat/backend-api` ждёт пуш/PR**: весь API + раздача фронта одним портом, 60 тестов, prism-proxy-сверка; третий пробел контракта закрыт кодом `server_error` (500, синхронизирован со спекой) | work-plan 3.3–3.5
- 2026-09-03 | project | Этап 4 в main; 5.1 (Docker) готов в ветке `build/docker` (smoke зелёный). Для 4.3 владельцу включить «Allow GitHub Actions to create and approve pull requests» в настройках репо + rerun; для 5.2 нужен аккаунт Render | work-plan этап 5
- 2026-09-03 | project | **Все этапы 1–5 плана выполнены**: контракт, фронт, бэк, e2e+CI, Docker, релиз v1.0.0, демо на Render (cal-com-97sr.onrender.com). Наблюдения: USER node в образе (free-тариф работает от root — решать при смене площадки/тарифа), IP-фронт Render может быть недоступен из рабочей сети — публичные проверки за браузером владельца | work-plan
- 2026-09-03 | project | Ветка `docs/review-recommendations` — единый проверенный документ двух ревью + фиксы P1/P2 (union, стаб-коды, стейт-сброс, expired-ветка, a11y, таймаут, NOW-warn, USER node, CI-гигиена); остаток: e2e-доводка, email-длина, P3 | 1ad1b3c..dfa2b5d
- 2026-09-04 | project | **PR #22 влит (34f87c2)**: ревью-документ + фиксы, 4 раунда ревью-бота отработаны (2 коммита фиксов, косметика отбита с причинами); на main после мержа 5/5 прогонов зелёные; остаток: e2e-доводка, email-длина, P3 | 34f87c2
- 2026-09-04 | project | **Ревью-раунд 2**: `docs/review-recommendations-2.md` (ветка docs/review-recommendations-2) — 4 P2 (Express 4xx→500; aliveRef/StrictMode — рефреш 409 мёртв в dev; e2e-cleanup после старта webServer; decision-guide про root-контейнер устарел), пакет P3, статус-чек остатка раунда 1; код не менялся | 687db8f

## reference
- 2026-09-03 | reference | docs/decision-guide.md — точка входа для аудита/ревью: контекст+решения+аудит-след; выполненные planning-доки удалены из репо 2026-09-05 (история в git) | ветка docs/decision-guide
- 2026-08-30 | reference | opencode GitHub-интеграция: https://opencode.ai/docs/github/ | шаг 8
- 2026-09-01 | reference | 4 workflow-файла opencode: opencode.yml (интерактив /oc, ivbbest), opencode-triage.yml (issues), opencode-review.yml (PR), opencode-schedule.yml (schedule+dispatch). Ключ OPENCODE_API_KEY, модель opencode/big-pickle, share:false. Runbook — github-integration.md | 2026-09-01
- 2026-09-01 | project | Автосценарии opencode: триаж — анти-спам по возрасту аккаунта>=30дней (github-script), ревью — read-права, schedule — write-права (нет юзер-контекста). Докзы https://opencode.ai/docs/en/github/ | 2026-09-01
- 2026-08-30 | reference | Runbook шага 8 (github-integration.md) — статус «выполнено»; тест `/oc summarize` в issue #1 прошёл | топик
- 2026-08-30 | reference | **Learnings (уроки сессий): .agents/mem/learnings.md — append-only, ритуал конца сессии** | топик
- 2026-08-30 | reference | Паттерн лайт-SDD: docs/specs/<feature>.md (Цель / Критерии приёмки hexlet-check / Ограничения / Заметки / Статус); цикл Issue → спека → план (grill-me) → код → проверка → обновить специю | план 2026-08-30
- 2026-09-01 | project | Шаг 0 (анализ входных материалов) выполнен: скриншоты прочитаны OCR (модель без vision), ссылки проанализированы, `docs/project-understanding.md` + SDD-lite каркас `docs/specs/` (TEMPLATE.md, api-contract.md). Актуальный шаг — 1 (Design First / TypeSpec) | 2026-09-01
- 2026-09-01 | project | Стек-решение (docs/project-understanding.md §5/§11): фронт Vite+React+TS+shadcn/ui; контракт TypeSpec→OpenAPI; бэк Node+Express+TS+zod; SQLite (better-sqlite3); e2e Playwright (e2e/); release-please; деплой Docker→Render/Railway. Структура: монорепо contract/+frontend/+backend/+e2e/, корневой NPM workspaces. openapi.yaml коммитим. **Финальное утверждение — на шаге 1 (Issue/спека) до кода** | 2026-09-01
- 2026-09-01 | project | Путеводитель по изучению проекта — `reading-guide.md` (удалён из репо 2026-09-05, история в git; блоки A-D: было до агента / входные материалы / что добавил агент / память; порядок чтения, минимальный путь, split-по ролям) | 2026-09-01
- 2026-09-01 | project | **Стек финализирован (ревью + аудит)**: Express (не Fastify), shadcn/ui (не Mantine), TanStack Query не берём; мок этапа 2 — стаб контракта `contract/mock-server` (Prism без состояния: остаётся для smoke через `Prefer: code=NNN` и proxy); все ответы `/api/*` — модель `Error` (`payload_too_large`→413, E18–E19); `date` обязателен (E20); Owner — документационная сущность (`@doc`, не модель: unreferenced не попадает в openapi.yaml). Решения владельца Q1 — стаб, Q2 — расширение `Error`. Details: §11 15–16, `architecture-audit.md` §7–8 | 2026-09-01
- 2026-09-02 | project | **План актуализирован по аудитам 2026-09-02** (ветка `docs/plan-fixes`): корневой `package.json` (workspaces contract/frontend/backend, без e2e) — в шаг 1.3; шаг 3.5 зависит от мержа этапа 2; `@example` для 404/409 — шаг 1.5; проверка `better-sqlite3` под Node 24 — критерий 1.2; пересечение пакетов ветками 2/3 — правило в Git-workflow. Аудиты: `docs/work-plan-audit.md`, `docs/status-audit.md`, `architecture-audit.md` §9 | 2026-09-02
- 2026-09-02 | project | Аудиты/ретроспектива вне репозитория: лежат локально в .agents/archive/ (gitignore); в публичных доках ссылки на docs/architecture-audit.md и docs/retrospective.md остались историческими (контент в git-истории) | b518b5b
- 2026-09-02 | project | **Замечания перепроверки закрыты** (ветка `docs/review-fixes`): ссылки на архивные аудиты помечены «архив: `.agents/archive/`»; `.gitignore` += `backend/data/*.db`; workflow: review — только PR владельца, schedule — contents: read + issues: write, экшен запиннен на SHA (v1.4.9); план: 2.1b — все 5 ручек стаба, 2.2/3.5 — `VITE_API_TARGET`, 3.1 — сервис `now()`/env `NOW` (владение), 4.1 — браузеры Playwright; склейки строк памяти исправлены; review-findings-доки перенесены в архив | ветка docs/review-fixes

## Решения ревью 2026-09-01 (детали — api-contract.md C1–C7, project-understanding.md §11 7–16)
- 2026-09-01 | user | `.agents/` — публичная курируемая память (в git с 51be0c8): без секретов и PII (email/ФИО не писать); правила синхронизированы в AGENTS.md/памяти | решение пользователя
- 2026-09-01 | user | Dev-команды (tsp/vite/better-sqlite3/тесты) — в контейнере `node:24` (volume на проект), не через Windows-npm | решение пользователя; §11 7
- 2026-09-01 | project | Хранение: SQLite + идемпотентный seed при старте; эфемерность диска Render принята осознанно; Postgres — отдельная задача (контракт не зависит) | §11 10
- 2026-09-01 | project | Контракт: префикс `/api`; TZ сервиса = `Europe/Moscow` константой (API в UTC, фронт не локализует); слоты со `status` available/booked; занятость = пересечение интервалов (не равенство); окно сегодня+13; id типа задаёт владелец (паттерн), slug/DELETE/GET-by-id убраны; BookingCreate без end; Error {code,message} | api-contract.md
- 2026-09-01 | project | Прод = один контейнер: Express раздаёт API + `frontend/dist` + SPA-fallback на `PORT`; dev-связь фронта с бэком — Vite-proxy `/api` (CORS не нужен) | §11 9
- 2026-09-01 | project | В UI добавлен экран `/admin/new-type` (форма создания типа) — требование курса, которого не было в скриншотах/плане | §9 шаг 2
- 2026-09-01 | project | `input/` исключён из git через `.git/info/exclude` (не «чинить», не коммитить) | факт окружения
- 2026-09-03 | project | Ревью 2026-09-03 (ветка docs/review-recommendations, коммит 1f0605d): рекомендации тремя приоритетами: P1 — мерж PR#21, lint-фронта не в CI, 2 e2e-сценария из плана не покрыты (протухшая вкладка, дата вне окна), USER node в Dockerfile, stale-сетка при смене typeId, нет таймаута в API-клиенте; P2 — contract-check не в CI, стаб vs бэк в кодах ошибок, плавающий node:24 в CI, NOW в проде, гонка без UNIQUE, prod-образ не собирается в CI, a11y формы, дрейф ручных зеркал типов; P3 — гигиена. Ограничения сознательные (rate-limit, авторизация, CORS, hexlet-check) | 1f0605d- 2026-09-04 | project | **Ревью-раунд 2 реализован** в ветке docs/review-recommendations-2 (P2×4, P3-пакет, остаток раунда 1); документ удалён; за владельцем: длина email, подтверждение non-root на Render | bfc5330..519f5d1
- 2026-09-04 | project | **PR #25 влит (6a7f588)**: ревью-раунд 2 полностью; ревью-бот дал 6 раундов (r1 8 замечаний → r6 0 новых, Approve), триажи в комментариях PR, 4 коммита фиксов по находкам бота; main после мержа зелёный (hexlet-check, sync, docker, e2e, release); release-please открыл PR #26 (1.0.2) — за владельцем | 6a7f588
- 2026-09-04 | project | **PR #26 влит (cec0160), тег cal-com-v1.0.2**: релиз-автоматизация отработала end-to-end (release-please → PR → мерж → тег), main после релиза 6/6 зелёные; репозиторий зачищен: на remote только main + ветка release-please, локально только main. Остаток за владельцем: длина email, `USER node` на Render после деплоя; локальный main отстаёт от cec0160 — забрать через rebase и запушить журнал | cec0160
