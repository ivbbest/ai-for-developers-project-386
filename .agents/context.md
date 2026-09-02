# Контекст проекта «Календарь звонков»

Локальный журнал и рабочая память (`.agents/` — в git, публичная и курируемая:
без секретов и PII; см. AGENTS.md «Что в git»).

## Что за проект
Учебный проект Хекслета «ai-for-developers»: сервис бронирования календаря,
разработка совместно с ИИ. Репозиторий `ivbbest/ai-for-developers-project-386`
(публичный). Стек и структура **финализированы 2026-09-01** (ревью + аудит,
`docs/architecture-audit.md`; детали — `docs/project-understanding.md` §5/§10/§11,
контракт — `docs/specs/api-contract.md`).

## Окружение
- Локальная папка = клонированный репозиторий (`/mnt/e/hexlet/cal-com`).
- git identity и `gh` настроены (данные — у пользователя, в память не пишутся: PII).
- Git-workflow (решение 2026-09-01): агент ведёт ветки от `main`, коммитит чекпоинтами;
  push, открытие PR и слияние в `main` — только пользователь (AGENTS.md «Границы»).

## Скиллы (`.opencode/skills/`)
- `ru-text` — качество русского текста (типографика, стоп-слова).
- `supabase-postgres-best-practices` — Postgres/SQL.
- `grill-me` — стресс-тест планов/решений вопросами перед реализацией.

## Ключевые правила
Память в файлах; коррекции «в моменте»; секреты — только пользователь;
в git — только публичная часть (AGENTS.md, tasks.md, README, workflows).

## Что сделано (журнал вех)
- 2026-08-30 | Клонирован репозиторий (папка = репо), git-история 3 коммита,
  hexlet-check.yml не тронут. | —
- 2026-08-30 | Созданы .gitignore, AGENTS.md, tasks.md (в git-рабочее дерево,
  не закоммичены), локальная память `.agents/` (context.md, mem/MEMORY.md). | —
- 2026-08-30 | Скиллы: ru-text и supabase-postgres-best-practices скопированы
  в `.opencode/skills/`; grill-me установлен `npx skills add`
  (--agent opencode -y, скопирован в `.opencode/skills/`), CLI-дубликат
  `.agents/skills/` удалён, skills-lock.json оставлен (gitignored) | —
- 2026-08-30 | Проверка: `git status --porcelain` = 3 untracked (AGENTS.md,
  tasks.md, .gitignore); .agents/.opencode/skills-lock.json в check-ignore. | —
- 2026-08-30 | Ожидает пользователя: (1) коммит трёх файлов, (2) перезапуск
  opencode для скиллов, (3) GitHub-интеграция (шаг 8). | —
- 2026-08-30 | **Возобновление после перезапуска**: статус — tasks.md; полная
  инструкция шага 8 — топик `mem/github-integration.md`; индекс — mem/MEMORY.md. | —
- 2026-08-30 | Коррекции пользователя: (1) в тексте коммитов не использовать
  слова/паттерны «ИИ»/«AI» и подобного (агент может предлагать названия);
  (2) не упоминать чужие проекты/репо. Правила → AGENTS.md + MEMORY.md. | —
- 2026-08-30 | Шаг 8 (GitHub-интеграция): коммит трёх файлов 3f04edd; `opencode
  github install` создал .github/workflows/opencode.yml; поставлено
  `share: false`; секрет OPENCODE_API_KEY добавлен пользователем; commit+push
  «Add GitHub workflow and project rules»; тест `/oc summarize` в issue #1 —
  бот ответил (run 33316614793), hexlet-check success. **Шаг 8 выполнен.** | —
- 2026-08-30 | По предпочтению пользователя (`я раньше подобное оформлял в
  .agents`) реестр задач перенесён из корня git в `.agents/tasks.md`
  (локально); ссылки в AGENTS.md и context.md обновлены; из git файл удаляется
  коммитом пользователя. Публичные задачи курса — в GitHub Issues. | —
- 2026-08-30 | Best practice (agents.md, opencode docs): коммитится AGENTS.md
  (инструкции), память-сырьё (.agents) — нет. Решение: .agents остаётся
  локальной; коммит подготовки (AGENTS.md + удаление tasks.md) — за
  пользователем. | —
- 2026-08-30 | Внедрена структура памяти: `mem/learnings.md` (уроки, append-only)
  + ритуал конца сессии в tasks.md + дисциплина скиллов и чек-лист закрытия
  в AGENTS.md + карта памяти в context.md. Лимиты — правилами, без
  opencode.json; маскировка не применяется (публичный курс). | —
- 2026-08-30 | Решение по SDD: лайт-SDD, каркас (`docs/specs/` + шаблон) — с
  первой dev-задачи курса. Зафиксировано: MEMORY.md, строка в AGENTS.md. | —
- 2026-09-01 | Аудит безопасности GitHub-интеграции: ключи только через Secrets ✅
  (opencode.yml), минимальные permissions (id-token/contents/pull-requests/issues
  = read) ✅, но контроль доступа к вызову агента отсутствовал ❌. Fix: в `if`
  добавлена проверка автора комментария `github.event.comment.user.login ==
  'ivbbest'` (только владелец может запускать /oc, /opencode; защита от расхода
  ключей посторонними в публичном репо). Коммит 28df6ea. | 28df6ea
- 2026-09-01 | По явному запросу пользователя `.agents` убран из `.gitignore` и
  закоммичен в репозиторий (публичная видимость памяти сессии). Проверено: в
  `.agents` нет секретов. Коммит 51be0c8. Осталась незакоммиченная правка
  AGENTS.md (SDD-заметка, из прошлой сессии) — не моя, не трогаю. | 51be0c8
- 2026-09-01 | Расширена GitHub-интеграция opencode до 4 workflow-файлов (по
  сценариям, как в доках opencode): `opencode.yml` (интерактив /oc, фильтр
  владельца ivbbest), `opencode-triage.yml` (автотриаж issues, анти-спам по
  возрасту аккаунта >= 30 дней), `opencode-review.yml` (авторевью PR),
  `opencode-schedule.yml` (schedule пн 09:00 UTC + workflow_dispatch, write-права).
  Ключ/модель оставлены: `OPENCODE_API_KEY` + `opencode/big-pickle`, `share: false`.
  YAML всех файлов валиден. Изменения в рабочем дереве, не закоммичено. | —
- 2026-09-01 | Обновлена документация: runbook `.agents/mem/github-integration.md`
  (раздел «Карта файлов»), AGENTS.md («Дополнительные workflow */opencode*.yml»).
  Память: context.md, MEMORY.md, learnings.md, tasks.md. | —
- 2026-09-01 | **Шаг 0 — предварительный анализ входных материалов**: изучены
  `input/*.txt`, все скриншоты прочитаны через OCR (tesseract rus+eng, модель без
  vision), проанализированы все ссылки (subagents), составлено
  `docs/project-understanding.md`, создан SDD-lite каркас `docs/specs/TEMPLATE.md`
  + черновик спеки `docs/specs/api-contract.md`. Обновлены tasks.md, MEMORY.md,
  learnings.md. | —
- 2026-09-01 | **Решения зафиксированы (только документация, без внедрения/коммитов)**:
  стек (фронт Vite+React+TS+shadcn, бэк Node+Express+TS+zod, SQLite), структура
  монорепо (`contract/ frontend/ backend/ e2e/` + корневой NPM workspaces),
  openapi.yaml коммитим (CI-проверка синхронизации), e2e — отдельная папка,
  SQLite-файл в gitignore. Всё — в `docs/project-understanding.md` (§5/§10/§11)
  и `tasks.md`. Финальное утверждение стека — шаг 1 (Issue/спека). | —
- 2026-09-01 | **Создан `docs/reading-guide.md`** — путеводитель по изучению проекта
  (блоки «было до агента / входные материалы / добавил агент / память», порядок
  чтения, минимальный путь). Обновлены tasks.md, MEMORY.md. | —
- 2026-09-01 | **Архитектурное ревью шага 0 + корректировки**. Найдено и закрыто в
  контракте: К1 слоты со `status` (UI «Свободно/Занято»), К2 занятость = пересечение
  интервалов (не равенство; UNIQUE(start) недостаточен), К3 `?date=` вместо from&to,
  К4 TZ=MSK константой, К5 BookingCreate+Error+201, К6 slug/DELETE убраны, К7 префикс
  `/api`+Vite-proxy. Решения пользователя: `.agents` публична (PII вычищен), dev-команды
  в контейнере `node:24`, SQLite+seed (эфемерность Render принята). Обновлены:
  api-contract.md (переписан), project-understanding.md (§4/5/8/9/10/11),
  reading-guide.md, AGENTS.md (статус `.agents`), память. Эмпирически проверено:
  `node` — command not found, `npm` — Windows-обёртка, `docker` 29.4.3 есть;
  `input/` исключён через `.git/info/exclude`. | —
- 2026-09-01 | **Финализирован исполняемый план**: `docs/work-plan.md` (этапы 0–5,
  шаги со ссылками на детали и критериями готовности; самодостаточен — решения
  приняты в спеке/§11, на шагах только кодить и проверять). Ссылки добавлены в
  `reading-guide.md` (C3) и `tasks.md`. Коррекция пользователя: не вешать на задачи
  ярлыки «junior/middle» — зафиксировано в MEMORY.md «feedback». | —
- 2026-09-01 | **Git-workflow утверждён** (ветки `<тип>/<тема>`, коммит-чекпоинты,
  push/PR/merge — только пользователь; тесты обязательны слоем на этап; публичные
  артефакты без ИИ-формулировок и ссылок на AGENTS/.agents). Правки: AGENTS.md
  «Границы», work-plan (workflow/тесты/запуск/дробность), §11 решения 13–14.
  Добавлены: `docs/deploy-global.md` (площадки, VPS, домен, HTTPS),
  `docs/retrospective.md` (классы расхождений, E1–E17 в спеку, доп. e2e-сценарии),
  крайние случаи E1–E17 + правило занятого порта в `api-contract.md`. | —
- 2026-09-01 | **Правки ревью закоммичены** в ветку `docs/review-finalization` цепочкой
  атомарных коммитов (от 7587641; правила → спека → анализ → план/гайды → индекс →
  память → уточнения). PR #2 влит в `main` (92ff6f3) после двух раундов ревью-бота:
  закрыты владение push/PR (промах из-за переноса строки в grep — урок записан),
  порт-канон 3000, путь БД, E5, локальные ссылки. | 92ff6f3
- 2026-09-01 | **ru-text-проход по своей документации**: исправлены неудачные
  формулировки («полдня» → критерии атомарности дробления, «живучи», «консюмят»,
  «big docs», «лечится не внимательнее», «проверить фактом»), типографика (NBSP после
  однопоз. предлогов вне кода, «т. д.»); контроль: 0 NBSP внутри code-блоков, таблицы
  целы. В `reading-guide.md` добавлены: маршрут ревью ветки по коммитам, цикл
  исполнения задачи, маршрут изучения проекта для нового человека (9 шагов с
  контролем понимания). | —
- 2026-09-01 | **Аудит закрыт, правки A1–A5 внесены, стек финализирован** (ветка
  `docs/audit-fixes` от `docs/audit` dbaad61). Верификация по исходникам: N7 — ложная
  тревога (`--warn-as-error` есть у `tsp compile`, @typespec/compiler@1.15.0); N1 —
  уточнён (Prism: `Prefer: code=NNN` даёт заготовленные 404/409 — критерий 1.6 спасён;
  stateful-сценарий невозможен — стаб 2.1b); N4 — Owner фиксится прозой спеки + `@doc`
  (unreferenced-модель не попадает в openapi.yaml). Правки: api-contract.md (C7 +
  `payload_too_large`, E18–E20, сплит E3, раздел Owner, `date` required, N6),
  work-plan.md (2.1b стаб :4020, критерии 1.6/2.2/2.3/3.5, e2e-время: unit `now()` /
  e2e `NOW`-env, таблицы тестов), project-understanding.md (§4/§5/§8/§9/§10/§11,
  решения 15–16), reading-guide.md (C7, E1–E20, 16 решений), tasks.md. Стек финально:
  Express (не Fastify), shadcn/ui (не Mantine), TanStack Query не берём, мок этапа 2 —
  стаб контракта. Решения владельца: Q1 — стаб, Q2 — расширенная модель ошибок. | —
- 2026-09-02 | Аудиты дня зафиксированы в docs: `architecture-audit.md` §9 (N10–N14,
  план A6–A10), `work-plan-audit.md` (F1–F7, план правок), `status-audit.md`
  (готовность к этапу 1). Перепроверка: находки F1–F7 подтверждены; в самих
  аудитах исправлены неточные ссылки (docker.txt:12,14; project-understanding
  :147/220-221; tip-ы веток вместо merge-коммитов) и опасная команда
  `git branch -d docs/audit-fixes` (tip не предок main, патч дублирует c1a81ce —
  нужен -D). Правки F1.1–F7.1 / A6–A8 внесены в work-plan.md и tasks.md до старта
  этапа 1: корневой package.json workspaces — в шаг 1.3; 3.5 — зависима от мержа
  этапа 2; @example 404/409 — шаг 1.5; better-sqlite3-проверка — шаг 1.2;
  пересечение пакетов — в Git-workflow. | ветка docs/plan-fixes
- 2026-09-02 | Аудитные документы (architecture-audit, retrospective, work-plan-audit,
  status-audit) перенесены из docs/ в локальный архив .agents/archive/ (gitignore),
  из репозитория удалены, содержимое доступно в git-истории; ссылки на них из
  публичных доков пока битые — решение за владельцем | b518b5b
- 2026-09-02 | Закрыты замечания трёх проходов перепроверки (ветка docs/review-fixes):
  ссылки на архивированные аудиты помечены «архив: .agents/archive/» во всех публичных
  доках; AGENTS.md — таблица (retrospective убран, добавлены specs/TEMPLATE и строка
  opencode*.yml); .gitignore — backend/data/*.db (PII); workflows: review — только PR
  владельца, schedule — минимальные права (contents: read + issues: write), экшен
  запиннен на SHA v1.4.9; план — 2.1b все 5 ручек, 2.2/3.5 VITE_API_TARGET, 3.1 сервис
  now()+NOW, 4.1 браузеры Playwright; три review-findings-дока перенесены в архив | ветка docs/review-fixes

- 2026-09-02 | Шаг 0.2: перепроверено утверждение §6 «у Render/Railway официальных MCP
  нет» — неверно: у Render официальный сервер render-oss/render-mcp-server
  (render.com/docs/mcp-server), у Railway MCP встроен в CLI (`railway mcp`, отдельный
  репозиторий заархивирован в мае 2026); §6/§8/§9 исправлены, 0.2 закрыт в плане | ветка docs/mcp-claim-check 614d83e
- 2026-09-02 | Этап 1 (контракт) готов в ветке: issue #6; обёртка node:24 (v24.20.0,
  better-sqlite3 13.0.3 из prebuild); монорепо workspaces; contract/ TypeSpec 1.15
  (models/routes, @opExample для 404/409); dist/openapi.yaml коммитится; Prism-smoke
  29 проверок зелёный; по ревью добавлены: код duplicate_id (409 «id занят») со синхронизацией спеки и issue, @multipleOf(5) через @typespec/json-schema, seal-object-schemas
  (E8), 413 на POST (E18); спека → «готово» | ветка feat/api-contract b53c267..a48da84

## Карта памяти (.agents)

| Файл | Роль |
|---|---|
| `.agents/context.md` | Журнал вех + эта карта (старт сессии) |
| `.agents/tasks.md` | Реестр задач/чек-лист (процесс, перезаписывается) |
| `.agents/mem/MEMORY.md` | Индекс фактов по категориям (читать первым) |
| `.agents/mem/learnings.md` | Уроки сессий, append-only (ритуал конца сессии) |
| `.agents/mem/<topic>.md` | Топики-инструкции, напр. `github-integration.md` |
| `.opencode/skills/*/SKILL.md` | Скиллы (метаданные до востребования) |

## Задачи
Актуальный список — `.agents/tasks.md`. Подробности и факты — `mem/MEMORY.md`.