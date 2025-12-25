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
    modules/          # Модули приложения
    common/           # Общие утилиты, guards, decorators
    config/           # Конфигурация
  prisma/
    schema.prisma     # Схема БД
    migrations/       # Миграции
    seed.ts           # Сиды
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

### Основные endpoints (планируемые)

**Аутентификация:**
- `POST /api/auth/register` - Регистрация
- `POST /api/auth/login` - Вход
- `POST /api/auth/logout` - Выход

**Курсы:**
- `GET /api/courses` - Список курсов
- `GET /api/courses/:id` - Детали курса
- `POST /api/courses` - Создание курса (author/admin)
- `PUT /api/courses/:id` - Обновление курса (author/admin)
- `DELETE /api/courses/:id` - Удаление курса (author/admin)

**Уроки:**
- `GET /api/courses/:courseId/lessons` - Список уроков курса
- `POST /api/courses/:courseId/lessons` - Создание урока (author/admin)

**Шаги:**
- `GET /api/lessons/:lessonId/steps` - Список шагов урока
- `POST /api/lessons/:lessonId/steps` - Создание шага (author/admin)

**Записи на курс:**
- `POST /api/courses/:courseId/enroll` - Записаться на курс
- `GET /api/users/me/enrollments` - Мои записи

**Ответы:**
- `POST /api/steps/:stepId/submit` - Отправить ответ
- `GET /api/steps/:stepId/submissions` - Мои ответы на шаг

## Модули

Планируемая структура модулей:

```
src/
  modules/
    auth/           # Аутентификация и авторизация
    users/          # Управление пользователями
    courses/        # Курсы
    lessons/        # Уроки
    steps/          # Шаги
    enrollments/    # Записи на курсы
    submissions/    # Ответы
  common/
    guards/         # Guards для авторизации
    decorators/     # Кастомные декораторы
    filters/        # Exception filters
    interceptors/  # Interceptors
  config/           # Конфигурация
```

## Аутентификация и авторизация

**Планируемая реализация:**
- JWT токены для аутентификации
- Роли: `student`, `author`, `admin`
- Guards для защиты endpoints
- Декораторы для проверки ролей

**Примеры:**
- `@Public()` - публичный endpoint
- `@Roles('author', 'admin')` - доступ только для авторов и админов
- `@CurrentUser()` - получение текущего пользователя

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

