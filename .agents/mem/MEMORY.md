# MEMORY.md — индекс фактов

1 строка на запись. Категории: `user` (пользователь) · `feedback` (коррекции)
· `project` (факты проекта) · `reference` (справочно). Детали — топиками (файлы
ряда), формат `YYYY-MM-DD | запись`.

## user
- 2026-08-30 | user | GitHub-репозиторий публичный, git commit/push — только пользователь | AGENTS.md «Границы действий» (уточнено 2026-09-01: агент коммитит в рабочие ветки; push/PR/merge — пользователь)
- 2026-09-01 | user | Git-workflow: ветка `<тип>/<тема>` на каждую существенную разработку; коммит-чекпоинт на изменение; push и открытие PR — пользователь; мержит в main только пользователь; зависимая работа — на паузе до мержа | коррекция 2026-09-01
- 2026-09-01 | project | Ограничение окружения: `git push`/`fetch`/`pull` агенту запрещены (permission deny) — агент коммитит в ветку локально, push+PR делает пользователь | learnings 2026-09-01
- 2026-09-01 | user | Тесты обязательны на каждом слое (контракт/бэк-unit/фронт-сборка/e2e); изменение без тестов не готово; слои — docs/work-plan.md «Тесты» | коррекция 2026-09-01
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

## project
- 2026-08-30 | project | Проект: «Календарь звонков» (Хекслет ai-for-developers), репо ivbbest/ai-for-developers-project-386 | AGENTS.md
- 2026-08-30 | project | Стек не определён («Разное»); hexlet-check.yml не трогать | tasks.md (устарело 2026-09-01: стек-решение в §5/§11 project-understanding.md)
- 2026-08-30 | project | Скиллы установлены: ru-text, supabase-postgres-best-practices, grill-me (`npx skills add`) → .opencode/skills/ | context.md
- 2026-08-30 | project | skills-lock.json создан CLI (gitignored), дубликат .agents/skills удалён | context.md
- 2026-08-30 | project | Проверка итога: git untracked = AGENTS.md, tasks.md, .gitignore; .agents/.opencode игнорируются | context.md
- 2026-08-30 | project | Структура памяти: tasks.md (чек-лист, локально) + mem/ (MEMORY-индекс, learnings, топики); лимиты контекста — правилами в AGENTS.md, без opencode.json; Learnings — отдельным файлом | контекст-инжиниринг 2026-08-30
- 2026-08-30 | project | Решение: лайт-SDD; каркас (docs/specs/ + шаблон) — с первой dev-задачей курса, не раньше | план 2026-08-30

## reference
- 2026-08-30 | reference | opencode GitHub-интеграция: https://opencode.ai/docs/github/ | шаг 8
- 2026-09-01 | reference | 4 workflow-файла opencode: opencode.yml (интерактив /oc, ivbbest), opencode-triage.yml (issues), opencode-review.yml (PR), opencode-schedule.yml (schedule+dispatch). Ключ OPENCODE_API_KEY, модель opencode/big-pickle, share:false. Runbook — github-integration.md | 2026-09-01
- 2026-09-01 | project | Автосценарии opencode: триаж — анти-спам по возрасту аккаунта>=30дней (github-script), ревью — read-права, schedule — write-права (нет юзер-контекста). Докзы https://opencode.ai/docs/en/github/ | 2026-09-01
- 2026-08-30 | reference | Runbook шага 8 (github-integration.md) — статус «выполнено»; тест `/oc summarize` в issue #1 прошёл | топик
- 2026-08-30 | reference | **Learnings (уроки сессий): .agents/mem/learnings.md — append-only, ритуал конца сессии** | топик
- 2026-08-30 | reference | Паттерн лайт-SDD: docs/specs/<feature>.md (Цель / Критерии приёмки hexlet-check / Ограничения / Заметки / Статус); цикл Issue → спека → план (grill-me) → код → проверка → обновить специю | план 2026-08-30
- 2026-09-01 | project | Шаг 0 (анализ входных материалов) выполнен: скриншоты прочитаны OCR (модель без vision), ссылки проанализированы, `docs/project-understanding.md` + SDD-lite каркас `docs/specs/` (TEMPLATE.md, api-contract.md). Актуальный шаг — 1 (Design First / TypeSpec) | 2026-09-01
- 2026-09-01 | project | Стек-решение (docs/project-understanding.md §5/§11): фронт Vite+React+TS+shadcn/ui; контракт TypeSpec→OpenAPI; бэк Node+Express+TS+zod; SQLite (better-sqlite3); e2e Playwright (e2e/); release-please; деплой Docker→Render/Railway. Структура: монорепо contract/+frontend/+backend/+e2e/, корневой NPM workspaces. openapi.yaml коммитим. **Финальное утверждение — на шаге 1 (Issue/спека) до кода** | 2026-09-01
- 2026-09-01 | project | Путеводитель по изучению проекта — `docs/reading-guide.md` (блоки A-D: было до агента / входные материалы / что добавил агент / память; порядок чтения, минимальный путь, split-по ролям) | 2026-09-01

## Решения ревью 2026-09-01 (детали — api-contract.md C1–C7, project-understanding.md §11 7–12)
- 2026-09-01 | user | `.agents/` — публичная курируемая память (в git с 51be0c8): без секретов и PII (email/ФИО не писать); правила синхронизированы в AGENTS.md/памяти | решение пользователя
- 2026-09-01 | user | Dev-команды (tsp/vite/better-sqlite3/тесты) — в контейнере `node:24` (volume на проект), не через Windows-npm | решение пользователя; §11 7
- 2026-09-01 | project | Хранение: SQLite + идемпотентный seed при старте; эфемерность диска Render принята осознанно; Postgres — отдельная задача (контракт не зависит) | §11 10
- 2026-09-01 | project | Контракт: префикс `/api`; TZ сервиса = `Europe/Moscow` константой (API в UTC, фронт не локализует); слоты со `status` available/booked; занятость = пересечение интервалов (не равенство); окно сегодня+13; id типа задаёт владелец (паттерн), slug/DELETE/GET-by-id убраны; BookingCreate без end; Error {code,message} | api-contract.md
- 2026-09-01 | project | Прод = один контейнер: Express раздаёт API + `frontend/dist` + SPA-fallback на `PORT`; dev-связь фронта с бэком — Vite-proxy `/api` (CORS не нужен) | §11 9
- 2026-09-01 | project | В UI добавлен экран `/admin/new-type` (форма создания типа) — требование курса, которого не было в скриншотах/плане | §9 шаг 2
- 2026-09-01 | project | `input/` исключён из git через `.git/info/exclude` (не «чинить», не коммитить) | факт окружения