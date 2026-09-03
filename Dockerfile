# syntax=docker/dockerfile:1
# Одно приложение одним портом (§11 решение 9): сборка фронта, компиляция бэка,
# рантайм — node раздаёт и API, и статику (STATIC_DIR ищется рядом с dist).

FROM node:24 AS build
WORKDIR /app
# слои зависимостей: манифесты раньше исходников — npm ci кэшируется
COPY package.json package-lock.json ./
COPY contract/package.json contract/
COPY backend/package.json backend/
COPY frontend/package.json frontend/
RUN npm ci
COPY . .
RUN npm run build -w frontend \
 && npm run build -w backend \
 && npm prune --omit=dev

FROM node:24-slim
ENV NODE_ENV=production \
    PORT=3000
WORKDIR /app
COPY --from=build /app ./
EXPOSE 3000
# /api/event-types — контрактная GET-ручка (лишних health-эндпоинтов не заводим:
# контракт = ровно 5 ручек); у node 24 есть global fetch
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD node -e "fetch('http://127.0.0.1:'+(process.env.PORT||3000)+'/api/event-types').then(r=>process.exit(r.ok?0:1)).catch(()=>process.exit(1))"
CMD ["node", "backend/dist/server.js"]
