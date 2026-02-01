# Admin Frontend Architecture (admin-app)

Описание архитектуры административного фронтенда LearnBase (React + Vite).

## Обзор

admin-app — административная панель. Архитектура построена по FSD и использует RTK/RTK Query, Tailwind CSS, TypeScript.

## Структура

```
admin-app/src/
  app/              # React Router, провайдеры, store
  pages/            # FSD Pages layer (страницы)
  widgets/          # FSD Widgets layer (крупные UI блоки)
  features/         # FSD Features layer (бизнес-фичи)
    login/          # Фича логина
    register/       # Фича регистрации
    switch-theme/   # Фича переключения темы
  entities/         # FSD Entities layer (бизнес-сущности)
    auth/           # Аутентификация
      api/          # RTK Query endpoints (login, register, logout, getMe, refresh)
      model/        # Redux slice, контекст и хуки (AuthProvider, useAuth)
    user/           # Сущность пользователя (типы, API)
  shared/           # FSD Shared layer (общие утилиты)
    api/            # API клиент (axios instance)
    utils/          # Утилиты (cn для классов)
    styles/         # Глобальные стили и темы
```

## Аутентификация (admin-app)

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

// В App.tsx
<AuthProvider>
  {/* приложение */}
</AuthProvider>

// В компонентах
const { user, login, logout, isAuthenticated } = useAuth();
```

## Роутинг

- React Router v6
- `/login`, `/register` — страницы авторизации
- `/` — главная страница (защищена)

## Защищенные маршруты

- Используется `AuthProvider` + `useGetMeQuery`
- Неавторизованные пользователи редиректятся на `/login`

## Темызация

- Tailwind CSS переменные (`shared/styles/themes.scss`, `shared/styles/main.scss`)
- `next-themes` для управления темой (light/dark)

## API клиент и RTK Query

**Axios** (`shared/api/api-client.ts`):
```typescript
export const apiClient = axios.create({
  baseURL: `${API_URL}/api`,
  withCredentials: true,
});
```

**RTK Query** (`app/store.ts`):
- `axiosBaseQuery`
- обработка 401 + refresh
- кэширование и refetch

## State Management (Redux Toolkit)

**Архитектура:**
- **Redux Toolkit** - глобальное состояние
- **RTK Query** - API слой
- **Redux Slice** (`entities/auth/model/auth.slice.ts`) - auth состояние
