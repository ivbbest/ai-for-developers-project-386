# Контекст проекта «Календарь звонков»

Локальный журнал и рабочая память (`.agents/` в git не попадает).

## Что за проект
Учебный проект Хекслета «ai-for-developers»: сервис бронирования календаря,
разработка совместно с ИИ. Репозиторий `ivbbest/ai-for-developers-project-386`
(публичный). Стек — «Разное», определится на первых задачах (см. `tasks.md`).

## Окружение
- Локальная папка = клонированный репозиторий (`/mnt/e/hexlet/cal-com`).
- git identity: Irkhin Vladimir <ivb1989@yandex.ru>; `gh` авторизован (HTTPS).
- git commit/push — только пользователь (правило AGENTS.md).

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