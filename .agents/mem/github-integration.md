# Runbook: GitHub-интеграция opencode (шаг 8)

> Статус: **выполнено** (2026-08-30). Коммит трёх файлов (3f04edd), workflow
> `opencode.yml` создан мастером, `share: false`, секрет `OPENCODE_API_KEY`
> добавлен. Коммит «Add GitHub workflow and project rules» запушен; тест
> `/oc summarize` в issue #1 — бот ответил (run 33316614793), hexlet-check зелёный.

Выполняется **пользователем** (агент не делает: OAuth/браузер, секреты, git push).
Время ~10–15 минут. Требуется: браузер, аккаунт `ivbbest`, API-ключ модели.

## 1. Коммит настроек (шаг пользователя)
```
git add AGENTS.md tasks.md .gitignore
git commit -m "Add project context (AGENTS.md, tasks.md, .gitignore)"
git push origin main
```

## 2. Запуск мастера (обычный терминал, не через агента)
```
cd /mnt/e/hexlet/cal-com
opencode github install
```

## 3. Авторизация и GitHub App
- Браузер: войти как **ivbbest**, подтвердить OAuth opencode.
- Установить App **opencode-agent**: Only select repositories →
  `ivbbest/ai-for-developers-project-386`, права contents/pull-requests/issues → Install.
- Вернуться в терминал.

## 4. Workflow
- Согласиться на создание `.github/workflows/opencode.yml`.
- Если мастер спросит про share → **false** (иначе правим файл в п. 5).

## 5. API-ключ (секреты GitHub, только пользователь)
- В мастере вставить ключ модели (например `ANTHROPIC_API_KEY`), уйдёт в Actions secrets.
- Либо вручную: GitHub → Settings → Secrets and variables → Actions →
  New repository secret → имя + значение → Add secret.

## 6. Проверка workflow
`.github/workflows/opencode.yml`:
- `model:` = `провайдер/модель` (напр. `anthropic/claude-sonnet-4-5`);
- `env:` c секретом, напр. `ANTHROPIC_API_KEY: ${{ secrets.ANTHROPIC_API_KEY }}`;
- **`share: false`**.

Эталонный YAML:
```yaml
name: opencode
on:
  issue_comment:
    types: [created]
  pull_request_review_comment:
    types: [created]
jobs:
  opencode:
    if: contains(github.event.comment.body, '/oc') || contains(github.event.comment.body, '/opencode')
    runs-on: ubuntu-latest
    permissions:
      id-token: write
    steps:
      - uses: actions/checkout@v6
        with:
          fetch-depth: 1
          persist-credentials: false
      - uses: anomalyco/opencode/github@latest
        env:
          ANTHROPIC_API_KEY: ${{ secrets.ANTHROPIC_API_KEY }}
        with:
          model: anthropic/claude-sonnet-4-5
          share: false
```

## 7. Коммит workflow
```
git add .github/workflows/opencode.yml
git commit -m "Add opencode GitHub integration workflow"
git push origin main
```
`hexlet-check.yml` не трогать.

## 8. Проверка
- GitHub → Actions — без ошибок синтаксиса.
- Тест: комментарий `/opencode ping` в Issues/PR → дождаться ответа в комментарии.

## Риски
- Публичный репо → обязательно `share: false`.
- Первый прогон в runner дольше (установка окружения, сеть).
- Джоба падает на модели/ключе → проверить секрет и строку `model`.