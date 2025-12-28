# Frontend Architecture

Описание архитектуры фронтенда LearnBase.

## Обзор

Проект использует два фронтенд приложения:
- **admin-app** - React + Vite для административной панели
- **client-app** - Next.js для клиентской части

Оба приложения используют:
- **Feature-Sliced Design (FSD)** - архитектурная методология
- **Tailwind CSS** - для стилизации
- **TypeScript** - для типобезопасности
- **Axios** - для HTTP запросов

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
    user/           # Сущность пользователя
      api/          # API для работы с пользователем
      model/        # Контекст и хуки (AuthProvider, useAuth)
      types.ts      # Типы User и UserRole
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
    providers.tsx   # Провайдеры (ThemeProvider)
  pages/            # FSD Pages layer
  widgets/          # FSD Widgets layer
  features/         # FSD Features layer
  entities/         # FSD Entities layer
  shared/           # FSD Shared layer
```

## Аутентификация

### Реализация в admin-app

**Сущность пользователя** (`entities/user/`):
- `api/auth.api.ts` - API методы (login, register, logout, getMe)
- `model/auth-context.tsx` - React Context для состояния аутентификации
- `model/use-auth.ts` - Хук для доступа к контексту
- `types.ts` - Типы User и UserRole

**Фичи:**
- `features/login/` - Форма логина
- `features/register/` - Форма регистрации

**Использование:**
```typescript
import { useAuth, AuthProvider } from "@/entities/user";

// В App.tsx
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

## API клиент

**Настройка** (`shared/api/api-client.ts`):
```typescript
export const apiClient = axios.create({
  baseURL: `${API_URL}/api`,
  withCredentials: true, // Критически важно для cookies
});
```

**Использование:**
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
- Next.js App Router
- Файловая система роутинга

## Защищенные маршруты

**admin-app:**
```typescript
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();
  
  if (isLoading) return <Loading />;
  if (!isAuthenticated) return <Navigate to="/login" />;
  
  return <>{children}</>;
};
```

## Стилизация

- **Tailwind CSS** - utility-first подход
- **CSS переменные** - для тем (HSL формат)
- **Плоский дизайн** - минималистичный UI без теней и границ
- **Адаптивность** - через Tailwind responsive классы

