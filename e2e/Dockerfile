# Браузерный раннер e2e: тот же node:24, что dev-обёртка (нативные модули
# бэкенда в общем volume совпадают по ABI), плюс Chromium с системными
# зависимостями. Проект монтируется volume'ом — здесь только браузеры.
FROM node:24

RUN npx -y playwright@1.62.1 install --with-deps chromium
