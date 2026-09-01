# Контекст проекта «Календарь звонков»

Локальный журнал и рабочая память (`.agents/` — в git, публичная и курируемая:
без секретов и PII; см. AGENTS.md «Что в git»).

## Что за проект
Учебный проект Хекслета «ai-for-developers»: сервис бронирования календаря,
разработка совместно с ИИ. Репозиторий `ivbbest/ai-for-developers-project-386`
(публичный). Стек и структура **утверждены ревью 2026-09-01**
(`docs/project-understanding.md` §5/§10/§11; контракт — `docs/specs/api-contract.md`).

## Окружение
- Локальная папка = клонированный репозиторий (`/mnt/e/hexlet/cal-com`).
- git identity и `gh` настроены (данные — у пользователя, в память не пишутся: PII).
- Git-workflow (решение 2026-09-01): агент ведёт ветки от `main`, коммитит чекпоинтами,
  пушит и открывает PR; слияние в `main` — только пользователь (AGENTS.md «Границы»).

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
  PR — агент, merge — только пользователь; тесты обязательны слоем на этап; публичные
  артефакты без ИИ-формулировок и ссылок на AGENTS/.agents). Правки: AGENTS.md
  «Границы», work-plan (workflow/тесты/запуск/дробность), §11 решения 13–14.
  Добавлены: `docs/deploy-global.md` (площадки, VPS, домен, HTTPS),
  `docs/retrospective.md` (классы расхождений, E1–E17 в спеку, доп. e2e-сценарии),
  крайние случаи E1–E17 + правило занятого порта в `api-contract.md`. | —
- 2026-09-01 | **Правки ревью закоммичены** в ветку `docs/review-finalization` цепочкой
  атомарных коммитов (от 7587641; правила → спека → анализ → план/гайды → индекс →
  память → уточнения). Push/PR — за пользователем (push агенту закрыт правилами). | от 7587641

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