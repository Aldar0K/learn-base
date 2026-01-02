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

3) Примени миграции БД (один раз перед первым запуском):
   ```bash
   cd learnbase-config-dev
   docker compose run --rm backend yarn prisma:migrate
   # Опционально: заполнить тестовыми данными
   docker compose run --rm backend yarn prisma:seed
   ```

4) Запуск dev окружения (hot reload):
   ```bash
   cd learnbase-config-dev
   docker compose --env-file .env up --build
   ```
   
   Приложения будут доступны:
   - Backend: http://localhost:3001
   - Admin-app: http://localhost:3000
   - Client-app: http://localhost:3002
   - Prisma Studio: http://localhost:5555
   - Swagger API Docs: http://localhost:3001/api/docs

5) Проверка работоспособности:
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

2) Примени миграции БД (один раз перед первым запуском):
   ```bash
   cd learnbase-config-prod
   docker compose run --rm backend yarn prisma migrate deploy
   # Опционально: заполнить тестовыми данными
   docker compose run --rm backend yarn prisma:seed:prod
   ```

3) Сборка и запуск:
   ```bash
   cd learnbase-config-prod
   docker compose --env-file .env up --build -d
   ```
   Приложения соберутся и запустятся в фоновом режиме без hot reload.
   
   Приложения будут доступны:
   - Backend: http://localhost:3001
   - Admin-app: http://localhost:3000
   - Client-app: http://localhost:3002
   - Prisma Studio: http://localhost:5555

## Полезные команды

### Обновление зависимостей
- Backend: `docker compose run --rm backend yarn add <pkg>` / `yarn add -D <pkg>` / `yarn upgrade <pkg>`
- Admin/Client (npm): `docker compose run --rm admin-app npm install <pkg>` и т.п.
- После изменения `package.json`: переустанови зависимости через `docker compose run --rm <service> npm install` (или `yarn install` для backend)

### Работа с БД (Prisma)

**Dev окружение:**
- Миграции: `docker compose run --rm backend yarn prisma:migrate` (создает и применяет)
- Seed: `docker compose run --rm backend yarn prisma:seed` (TypeScript через ts-node)
- Prisma Studio: автоматически запускается с `docker compose up`, доступен на http://localhost:5555

**Prod окружение:**
- Миграции: `docker compose run --rm backend yarn prisma migrate deploy` (только применяет существующие)
- Seed: `docker compose run --rm backend yarn prisma:seed:prod` (скомпилированный JavaScript)
- Prisma Studio: автоматически запускается с `docker compose up`, доступен на http://localhost:5555

**Примечание:** Prisma Studio использует отдельный `Dockerfile.prisma-studio` для оптимизации сборки.

### Управление контейнерами
- Остановка: `docker compose down`
- Перезапуск сервиса: `docker compose restart <service>`
- Логи: `docker compose logs -f <service>`

## Аутентификация

Проект использует **http-only cookies** для безопасного хранения JWT токенов.

**Особенности:**
- Токены автоматически отправляются с каждым запросом
- Недоступны через JavaScript (защита от XSS)
- SameSite: lax (защита от CSRF)
- Secure в production (только HTTPS)

**Роли пользователей:**
- `student` - может проходить курсы
- `author` - может создавать и редактировать курсы
- `admin` - полный доступ ко всем операциям

**API endpoints:**
- `POST /api/auth/register` - регистрация
- `POST /api/auth/login` - вход
- `POST /api/auth/logout` - выход
- `GET /api/auth/me` - текущий пользователь

## Документация

- [`docs/architecture/backend.md`](./docs/architecture/backend.md) - архитектура бекенда
- [`docs/architecture/frontend.md`](./docs/architecture/frontend.md) - архитектура фронтенда
- [`docs/architecture/guards.md`](./docs/architecture/guards.md) - система авторизации
- [`docs/database/design.md`](./docs/database/design.md) - дизайн базы данных

## Замечания по секретам
- Не клади секреты в образы и не используйте `NEXT_PUBLIC_*` для чувствительных значений — всё с таким префиксом попадет в бандл.
- Бэкенд читает секреты из env при запуске контейнера; `.env.*` остаются вне образа и подключаются через `--env-file`.
