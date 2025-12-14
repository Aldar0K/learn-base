# LearnBase

Монорепо с тремя приложениями: `backend` (Nest.js), `client-app` (Next.js), `admin-app` (React/Vite). Запуск через Docker, раздельные конфиги для dev/prod в `learnbase-config-dev/` и `learnbase-config-prod/`.

## Структура
- `backend/`, `client-app/`, `admin-app/` — код приложений, `.env.example`, Dockerfile.dev/Dockerfile.prod
- `learnbase-config-dev/` — `docker-compose.yml`, `.env.example` (dev)
- `learnbase-config-prod/` — `docker-compose.yml`, `.env.example` (prod)

## Быстрый старт
1) Скопируй переменные:
   - Dev: `cd learnbase-config-dev && cp .env.example .env`
   - Prod: `cd learnbase-config-prod && cp .env.example .env`
   - И скопируй `.env.example` внутри каждого приложения.
2) Установи зависимости через контейнер (node_modules складываются в хостовые папки):
   - Backend: `docker compose run --rm backend yarn install` (из `learnbase-config-dev`)
   - Фронты по аналогии: `docker compose run --rm admin-app npm install`, `docker compose run --rm client-app npm install`
3) Dev (hot reload):  
   ```
   cd learnbase-config-dev
   docker compose --env-file .env up --build
   ```
4) Prod (билд и запуск без вотчеров):  
   ```
   cd learnbase-config-prod
   docker compose --env-file .env up --build -d
   ```
5) Smoke-check: `curl http://localhost:3001/api/health` → ожидается `{ "status": "ok", "db": "ok" }` (при поднятой базе).

## Обновление зависимостей
- Backend: `docker compose run --rm backend yarn add <pkg>` / `yarn add -D <pkg>` / `yarn upgrade <pkg>`
- Admin/Client (npm): `docker compose run --rm admin-app npm install <pkg>` и т.п.
- `node_modules` монтируются из хоста (bind), IDE видит типы, запуск остаётся внутри Docker.

## Замечания по секретам
- Не клади секреты в образы и не используйте `NEXT_PUBLIC_*` для чувствительных значений — всё с таким префиксом попадет в бандл.
- Бэкенд читает секреты из env при запуске контейнера; `.env.*` остаются вне образа и подключаются через `--env-file`.
