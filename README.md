# LearnBase

Монорепо с тремя приложениями: `backend` (Nest.js), `client-app` (Next.js), `admin-app` (React/Vite). Запуск через Docker, раздельные конфиги для dev/prod в `learnbase-config-dev/` и `learnbase-config-prod/`.

## Структура
- `backend/`, `client-app/`, `admin-app/` — код приложений, `.env.example`, Dockerfile.dev/Dockerfile.prod
- `learnbase-config-dev/` — `docker-compose.yml`, `.env.example` (dev)
- `learnbase-config-prod/` — `docker-compose.yml`, `.env.example` (prod)

## Быстрый старт

### Dev среда (разработка)

1) Скопируй переменные окружения:
   ```bash
   cd learnbase-config-dev
   cp .env.example .env
   # И скопируй .env.example внутри каждого приложения (backend, admin-app, client-app)
   ```

2) Установи зависимости через контейнер (один раз перед первым запуском):
   ```bash
   cd learnbase-config-dev
   # Backend
   docker compose run --rm backend yarn install
   # Frontend приложения
   docker compose run --rm admin-app npm install
   docker compose run --rm client-app npm install
   ```
   **Важно:** Зависимости установятся в контейнере и будут смонтированы на ваш ПК (в папки `node_modules`), чтобы IDE видела типы и автодополнение работало.

3) Запуск dev окружения (hot reload):
   ```bash
   cd learnbase-config-dev
   docker compose --env-file .env up --build
   ```
   
   Приложения будут доступны:
   - Backend: http://localhost:3001
   - Admin-app: http://localhost:3000
   - Client-app: http://localhost:3002

4) Проверка работоспособности:
   ```bash
   curl http://localhost:3001/api/health
   # Ожидается: { "status": "ok", "db": "ok" }
   ```

### Prod среда (продакшн)

1) Скопируй переменные окружения:
   ```bash
   cd learnbase-config-prod
   cp .env.example .env
   # И скопируй .env.example внутри каждого приложения
   ```

2) Сборка и запуск:
   ```bash
   cd learnbase-config-prod
   docker compose --env-file .env up --build -d
   ```
   Приложения соберутся и запустятся в фоновом режиме без hot reload.

## Обновление зависимостей
- Backend: `docker compose run --rm backend yarn add <pkg>` / `yarn add -D <pkg>` / `yarn upgrade <pkg>`
- Admin/Client (npm): `docker compose run --rm admin-app npm install <pkg>` и т.п.
- `node_modules` монтируются из хоста (bind), IDE видит типы, запуск остаётся внутри Docker.

## Замечания по секретам
- Не клади секреты в образы и не используйте `NEXT_PUBLIC_*` для чувствительных значений — всё с таким префиксом попадет в бандл.
- Бэкенд читает секреты из env при запуске контейнера; `.env.*` остаются вне образа и подключаются через `--env-file`.
