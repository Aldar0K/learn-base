# Backend Architecture

Описание архитектуры бекенда LearnBase.

## Обзор

Backend построен на NestJS с использованием Prisma ORM для работы с PostgreSQL. Архитектура следует принципам модульности и разделения ответственности.

**Основные принципы:**
- RESTful API для взаимодействия с фронтендом
- Модульная структура по доменам
- Использование DTO для валидации данных
- Централизованная обработка ошибок

## Технологический стек

- **Framework**: NestJS
- **ORM**: Prisma
- **Database**: PostgreSQL
- **Language**: TypeScript

## Структура проекта

```
backend/
  src/
    auth/             # Модуль аутентификации и авторизации
      dto/            # DTO для регистрации и входа
      guards/         # JWT и Role guards
      decorators/     # Декораторы (@CurrentUser, @Roles, @Authenticated и т.д.)
      strategies/     # JWT стратегия для Passport
    courses/          # Модуль курсов
      dto/            # DTO для создания и обновления курсов
    common/           # Общие утилиты
      prisma/         # Prisma Service
    app.module.ts     # Корневой модуль
    main.ts           # Точка входа
  prisma/
    schema.prisma     # Схема БД
    migrations/       # Миграции
    seed.ts           # Сиды (TypeScript)
    seed.js           # Скомпилированный seed для prod (генерируется при сборке)
  Dockerfile.dev      # Dockerfile для разработки
  Dockerfile.prod     # Dockerfile для продакшена (multi-stage)
  Dockerfile.prisma-studio  # Dockerfile для Prisma Studio
```

## Структура данных

База данных состоит из 6 основных сущностей:

1. **User** - Пользователи системы (student, author, admin)
2. **Course** - Курсы, созданные авторами
3. **Lesson** - Уроки внутри курсов
4. **Step** - Шаги уроков (quiz, text, code)
5. **Enrollment** - Записи пользователей на курсы
6. **Submission** - Ответы пользователей на шаги

Подробное описание схемы БД: [`../database/design.md`](../database/design.md)

## API Design

### Реализованные endpoints

**Аутентификация:**
- `POST /api/auth/register` - Регистрация нового пользователя (устанавливает http-only cookies для access и refresh токенов)
- `POST /api/auth/login` - Вход пользователя (устанавливает http-only cookies для access и refresh токенов)
- `POST /api/auth/logout` - Выход (очищает cookies, требует аутентификации)
- `POST /api/auth/refresh` - Обновление access token через refresh token (устанавливает новые cookies)
- `GET /api/auth/me` - Получение текущего пользователя (требует аутентификации)
- `GET /api/auth/admin-only` - Пример endpoint только для админов

**Курсы:**
- `GET /api/courses` - Список опубликованных курсов (доступно всем)
- `GET /api/courses/my` - Мои курсы, включая неопубликованные (author/admin)
- `GET /api/courses/:id` - Детали курса (требует аутентификации)
- `POST /api/courses` - Создание курса (author/admin)
- `PATCH /api/courses/:id` - Обновление курса (автор курса или admin)
- `DELETE /api/courses/:id` - Удаление курса (автор курса или admin)

**Уроки:** (планируется)
- `GET /api/courses/:courseId/lessons` - Список уроков курса
- `POST /api/courses/:courseId/lessons` - Создание урока (author/admin)

**Шаги:** (планируется)
- `GET /api/lessons/:lessonId/steps` - Список шагов урока
- `POST /api/lessons/:lessonId/steps` - Создание шага (author/admin)

**Записи на курс:** (планируется)
- `POST /api/courses/:courseId/enroll` - Записаться на курс
- `GET /api/users/me/enrollments` - Мои записи

**Ответы:** (планируется)
- `POST /api/steps/:stepId/submit` - Отправить ответ
- `GET /api/steps/:stepId/submissions` - Мои ответы на шаг

## Модули

### Реализованные модули

**AuthModule** (`src/auth/`)
- Регистрация и вход пользователей
- JWT аутентификация через http-only cookies
- Role-based авторизация
- Guards и декораторы для защиты endpoints

**CoursesModule** (`src/courses/`)
- CRUD операции для курсов
- Проверка прав доступа (автор курса или admin)
- Фильтрация опубликованных/неопубликованных курсов

**PrismaModule** (`src/common/prisma/`)
- PrismaService для работы с БД
- Автоматическое подключение/отключение

### Планируемые модули

- **LessonsModule** - управление уроками
- **StepsModule** - управление шагами уроков
- **EnrollmentsModule** - записи на курсы
- **SubmissionsModule** - ответы пользователей

## Аутентификация и авторизация

**Реализовано:**
- JWT токены для аутентификации (access token + refresh token)
- **Http-only cookies** для безопасного хранения токенов
- Автоматическое обновление access token через refresh token
- Роли: `student`, `author`, `admin` с иерархией прав
- Guards для защиты endpoints
- Декораторы для удобной проверки ролей

**Безопасность:**
- Токены хранятся в http-only cookies (защита от XSS)
- SameSite: lax (защита от CSRF)
- Secure flag в production (только HTTPS)
- CORS настроен для работы с credentials

**Декораторы:**
- `@Authenticated()` - для всех авторизованных пользователей
- `@AuthorOrAdmin()` - для авторов и админов
- `@AdminOnly()` - только для админов
- `@Roles(...roles)` - гибкий декоратор для конкретных ролей
- `@CurrentUser()` - получение текущего пользователя

Подробнее: [`guards.md`](./guards.md)

## Обработка ошибок

**Централизованная обработка:**
- Глобальный exception filter
- Стандартизированные коды ошибок
- Валидационные ошибки через class-validator

**Типы ошибок:**
- `400 Bad Request` - невалидные данные
- `401 Unauthorized` - не авторизован
- `403 Forbidden` - нет доступа
- `404 Not Found` - ресурс не найден
- `500 Internal Server Error` - серверная ошибка

## Валидация

**Использование:**
- `class-validator` для валидации DTO
- `class-transformer` для трансформации данных
- Кастомные валидаторы для бизнес-логики

**Примеры:**
- Валидация email, пароля при регистрации
- Валидация JSONB content для шагов
- Валидация позиций уроков и шагов

## Работа с базой данных

### Prisma ORM

**Миграции:**
- **Dev**: `yarn prisma:migrate` (создает и применяет миграции)
- **Prod**: `yarn prisma migrate deploy` (только применяет существующие миграции)

**Seed (тестовые данные):**
- **Dev**: `yarn prisma:seed` (запускает TypeScript файл через ts-node)
- **Prod**: `yarn prisma:seed:prod` (запускает скомпилированный JavaScript файл)
- Seed компилируется при сборке prod образа из `seed.ts` в `seed.js`

**Prisma Studio:**
- Визуальный редактор базы данных
- Доступен в обоих окружениях (dev и prod) на порту 5555
- Использует отдельный `Dockerfile.prisma-studio` для оптимизации
- **Важно**: В продакшене ограничьте доступ к Prisma Studio (VPN, firewall)

**Структура Dockerfile'ов:**
- `Dockerfile.dev` - для разработки с hot-reload
- `Dockerfile.prod` - оптимизированный для продакшена (multi-stage build)
- `Dockerfile.prisma-studio` - отдельный образ для Prisma Studio (включает dev зависимости для Prisma CLI)

## API Документация (Swagger)

**Доступ:**
- Swagger UI: `http://localhost:3001/api/docs`
- Доступен в обоих окружениях (dev и prod)

**Функциональность:**
- Интерактивная документация всех API endpoints
- Автоматическая генерация схем из DTO
- Возможность тестирования API прямо из браузера
- Поддержка cookie-based аутентификации (http-only cookies)

**Использование:**
1. Откройте `http://localhost:3001/api/docs` в браузере
2. Для тестирования защищенных endpoints:
   - Сначала выполните `/auth/login` или `/auth/register`
   - Cookie будет установлена автоматически
   - Нажмите кнопку "Authorize" в Swagger UI
   - Введите `access_token` в поле (или оставьте пустым, если cookie уже установлена)
   - Теперь можно тестировать защищенные endpoints

**Декораторы Swagger:**
- `@ApiTags()` - группировка endpoints по тегам
- `@ApiOperation()` - описание операции
- `@ApiResponse()` - описание возможных ответов
- `@ApiProperty()` - описание полей DTO
- `@ApiCookieAuth()` - указание на использование cookie аутентификации

