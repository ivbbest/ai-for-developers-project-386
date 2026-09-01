# MEMORY.md — индекс фактов

1 строка на запись. Категории: `user` (пользователь) · `feedback` (коррекции)
· `project` (факты проекта) · `reference` (справочно). Детали — топиками (файлы
ряда), формат `YYYY-MM-DD | запись`.

## user
- 2026-08-30 | user | GitHub-репозиторий публичный, git commit/push — только пользователь | AGENTS.md «Границы действий»
- 2026-08-30 | user | Секреты/.env — только пользователь; в git только публичная часть | AGENTS.md «Секреты»
- 2026-08-30 | user | AGENTS.md и tasks.md коммитятся, .agents/ и .opencode/ — локально | выбор при настройке
- 2026-08-30 | user | github install выполняется пользователем интерактивно; share: false | шаг 8 (tasks.md)
- 2026-08-30 | user | Сообщения коммитов — только слова пользователя; агент не предлагает формулировки (в т.ч. «в стиле ИИ») | AGENTS.md «Границы действий»
- 2026-08-30 | user | В сообщениях коммитов не использовать слова/паттерны «ИИ»/«AI» и подобного; коммиты нейтральные. Агент может предлагать названия | AGENTS.md «Границы действий»
- 2026-08-30 | user | Не упоминать другие проекты/репозитории; только /mnt/e/hexlet/cal-com | AGENTS.md «Остальное»

## feedback
- 2026-08-30 | feedback | Сообщения коммитов — только слова пользователя; агент не предлагает формулировки (в т.ч. «в стиле ИИ») | 2026-08-30
- 2026-08-30 | feedback | Коррекция (уточнение): правило — в тексте коммита нет слов/паттернов «ИИ»/«AI» и подобного; агент может придумывать названия | 2026-08-30
- 2026-08-30 | feedback | Решение: .agents остаётся локальной (best practice — в git только выверенное: AGENTS.md/README/workflows, память-сырьё не публиковать); при «открытии» позже — курировать, а не всю папку | 2026-08-30
- 2026-08-30 | feedback | Не упоминать другие проекты/репозитории; только /mnt/e/hexlet/cal-com | 2026-08-30

## project
- 2026-08-30 | project | Проект: «Календарь звонков» (Хекслет ai-for-developers), репо ivbbest/ai-for-developers-project-386 | AGENTS.md
- 2026-08-30 | project | Стек не определён («Разное»); hexlet-check.yml не трогать | tasks.md
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