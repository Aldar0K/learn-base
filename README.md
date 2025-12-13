# LearnBase

Монорепо с тремя приложениями: `backend` (Nest.js), `client-app` (Next.js), `admin-app` (React/Vite). Запуск через Docker, раздельные конфиги для dev/prod в `learnbase-config-dev/` и `learnbase-config-prod/`.

## Структура
- `backend/`, `client-app/`, `admin-app/` — код приложений и их `.env.example`
- `learnbase-config-dev/` — dev Dockerfile'ы, `docker-compose.yml`, `.env.example`
- `learnbase-config-prod/` — prod Dockerfile'ы, `docker-compose.yml`, `.env.example`

## Быстрый старт
1) Скопируй переменные:
   - Dev: `cd learnbase-config-dev && cp .env.example .env`
   - Prod: `cd learnbase-config-prod && cp .env.example .env`
   - И скопируй `.env.example` внутри каждого приложения.
2) Dev (hot reload):  
   ```
   cd learnbase-config-dev
   docker compose --env-file .env up --build
   ```
3) Prod (билд и запуск без вотчеров):  
   ```
   cd learnbase-config-prod
   docker compose --env-file .env up --build -d
   ```
4) Smoke-check: `curl http://localhost:3001/api/health` → ожидается `{ "status": "ok", "db": "ok" }` (при поднятой базе).

## Замечания по секретам
- Не клади секреты в образы и не используйте `NEXT_PUBLIC_*` для чувствительных значений — всё с таким префиксом попадет в бандл.
- Бэкенд читает секреты из env при запуске контейнера; `.env.*` остаются вне образа и подключаются через `--env-file`.
