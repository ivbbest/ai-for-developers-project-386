#!/usr/bin/env bash
# Прогон e2e в браузерном контейнере (образ e2e/Dockerfile: node:24 + Chromium).
# Сборка образа — первый запуск (~2 мин, потом кэш). Аргументы — playwright'у:
#   ./scripts/e2e.sh                    # весь набор
#   ./scripts/e2e.sh booking.spec.ts    # один файл
#   ./scripts/e2e.sh --ui / --headed не нужны: CI-headless достаточно
set -euo pipefail
cd "$(dirname "$0")/.."
exec docker compose -f docker-compose.dev.yml run --rm e2e npx playwright test "$@"
