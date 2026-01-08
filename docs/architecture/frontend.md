# Frontend Architecture

Описание архитектуры фронтенда LearnBase.

## Обзор

Проект использует два фронтенд приложения:
- **admin-app** - React + Vite для административной панели
- **client-app** - Next.js для клиентской части

Оба приложения используют:
- **Feature-Sliced Design (FSD)** - архитектурная методология
- **Redux Toolkit (RTK)** - для управления состоянием
- **RTK Query** - для работы с API (кэширование, автоматический refetch)
- **Tailwind CSS** - для стилизации
- **TypeScript** - для типобезопасности
- **Axios** - для HTTP запросов (используется внутри RTK Query через `axiosBaseQuery`)

## Структура admin-app

```
admin-app/src/
  app/              # Next.js App Router (роутинг, провайдеры)
  pages/            # FSD Pages layer (страницы)
  widgets/          # FSD Widgets layer (крупные UI блоки)
  features/         # FSD Features layer (бизнес-фичи)
    login/          # Фича логина
    register/       # Фича регистрации
    switch-theme/   # Фича переключения темы
  entities/         # FSD Entities layer (бизнес-сущности)
    auth/           # Сущность аутентификации
      api/          # RTK Query endpoints (login, register, logout, getMe, refresh)
      model/        # Redux slice, контекст и хуки (AuthProvider, useAuth)
    user/           # Сущность пользователя (только типы)
      model/        # Типы User и UserRole
  shared/           # FSD Shared layer (общие утилиты)
    api/            # API клиент (axios instance)
    utils/          # Утилиты (cn для классов)
    styles/         # Глобальные стили и темы
```

## Структура client-app

```
client-app/src/
  app/              # Next.js App Router
    layout.tsx      # Корневой layout с провайдерами
    page.tsx        # Главная страница
    login/          # Страница логина
    register/       # Страница регистрации
    providers.tsx   # Провайдеры (ThemeProvider, StoreProvider)
    store.ts        # RTK Query baseApi и store конфигурация
    store-config.ts # makeStore для SSR/ISR поддержки
  middleware.ts     # Next.js middleware для защиты маршрутов
  pages/            # FSD Pages layer (если используется)
  widgets/          # FSD Widgets layer
    header/         # Виджет хедера
  features/         # FSD Features layer
    login/          # Фича логина
    register/       # Фича регистрации
    switch-theme/   # Фича переключения темы
  entities/         # FSD Entities layer
    auth/           # Сущность аутентификации (API, slice, context)
    user/           # Сущность пользователя (только типы)
  shared/           # FSD Shared layer
    api/            # API клиент (axios instance)
    utils/          # Утилиты
    styles/         # Глобальные стили и темы
    ui/             # UI компоненты
  providers/        # Провайдеры (StoreProvider, ThemeProvider)
```

## Аутентификация

### Реализация в admin-app и client-app

**Архитектура:**
- **RTK Query** (`entities/auth/api/auth.api.ts`) - API endpoints (login, register, logout, getMe, refresh)
- **Redux Slice** (`entities/auth/model/auth.slice.ts`) - состояние пользователя и loading
- **React Context** (`entities/auth/model/auth-context.tsx`) - провайдер для удобного доступа к auth
- **Хук** (`entities/auth/model/use-auth.ts`) - хук для доступа к контексту
- **Типы** (`entities/user/model/types.ts`) - типы User и UserRole

**Refresh Token механизм:**
- Автоматическое обновление access token при получении 401 ошибки
- Логика реализована в `axiosBaseQuery` (в `app/store.ts`)
- Предотвращение множественных одновременных refresh запросов
- Очистка состояния пользователя при невалидном refresh token

**Фичи:**
- `features/login/` - Форма логина
- `features/register/` - Форма регистрации

**Использование:**
```typescript
import { useAuth, AuthProvider } from "@/entities/auth";

// В App.tsx или layout.tsx
<AuthProvider>
  {/* приложение */}
</AuthProvider>

// В компонентах
const { user, login, logout, isAuthenticated } = useAuth();
```

### Безопасность

- **Http-only cookies** - токены автоматически отправляются с каждым запросом
- **Axios с credentials** - `withCredentials: true` для отправки cookies
- **CORS** - настроен на бекенде для работы с credentials
- **Автоматический refresh** - access token обновляется прозрачно для пользователя

## Темызация

Оба приложения используют единую систему тем через Tailwind CSS переменные:

**Файлы:**
- `shared/styles/themes.scss` - CSS переменные для light/dark тем
- `shared/styles/main.scss` - глобальные стили

**Библиотека:**
- `next-themes` - для управления темами
- Поддержка только light/dark (без system theme)

**Использование:**
```typescript
import { ThemeSwitch } from "@/features/switch-theme";

<ThemeSwitch />
```

## API клиент и RTK Query

**Настройка Axios** (`shared/api/api-client.ts`):
```typescript
export const apiClient = axios.create({
  baseURL: `${API_URL}/api`,
  withCredentials: true, // Критически важно для cookies
});
```

**RTK Query Base API** (`app/store.ts`):
- Использует `axiosBaseQuery` для интеграции Axios с RTK Query
- Автоматическая обработка 401 ошибок и refresh token
- Кэширование запросов и автоматический refetch
- Интеграция с Redux для управления состоянием

**Использование RTK Query:**
```typescript
import { authApi } from "@/entities/auth";

// В компонентах
const { data, isLoading } = authApi.useGetMeQuery();
const [loginMutation] = authApi.useLoginMutation();
```

**Прямое использование Axios** (для случаев вне RTK Query):
```typescript
import { apiClient } from "@/shared/api";

const response = await apiClient.get("/courses");
```

## Роутинг

**admin-app:**
- React Router v6
- `/login` - страница входа
- `/register` - страница регистрации
- `/` - главная страница (защищена)

**client-app:**
- Next.js App Router (15.x)
- Файловая система роутинга
- Middleware для защиты маршрутов (`middleware.ts`)
- Поддержка SSR/ISR через `makeStore` паттерн
- `/login` - страница входа
- `/register` - страница регистрации
- `/` - главная страница

## Защищенные маршруты

**admin-app:**
- Использует `AuthProvider` с автоматической навигацией
- Проверка аутентификации через `useGetMeQuery` и Redux slice
- Автоматический редирект на `/login` для неавторизованных пользователей

**client-app:**
- Использует Next.js middleware (`middleware.ts`) для защиты маршрутов на уровне сервера
- `AuthProvider` для управления состоянием на клиенте
- Комбинация SSR проверки (middleware) и клиентской навигации

## State Management (Redux Toolkit)

**Архитектура:**
- **Redux Toolkit** - для управления глобальным состоянием
- **RTK Query** - для работы с API (кэширование, автоматический refetch)
- **Redux Slice** (`entities/auth/model/auth.slice.ts`) - состояние аутентификации

**Store конфигурация:**
- `app/store.ts` - baseApi (RTK Query) и root reducer
- `app/store-config.ts` - `makeStore` функция для SSR/ISR (client-app)
- `app/providers/StoreProvider.tsx` - провайдер Redux store

**SSR/ISR поддержка (client-app):**
- `makeStore` паттерн для создания store на сервере и клиенте
- `extractRehydrationInfo` для восстановления состояния на клиенте
- Поддержка preloaded state для SSR страниц

## Стилизация

- **Tailwind CSS** - utility-first подход
- **CSS переменные** - для тем (HSL формат)
- **Плоский дизайн** - минималистичный UI без теней и границ
- **Адаптивность** - через Tailwind responsive классы

