# Client Frontend Architecture (client-app)

Описание архитектуры клиентского фронтенда LearnBase (Next.js).

## Обзор

client-app — клиентская часть. Архитектура построена по FSD и использует RTK/RTK Query, Tailwind CSS, TypeScript.

## Структура

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
  features/         # FSD Features layer
    login/          # Фича логина
    register/       # Фича регистрации
    switch-theme/   # Фича переключения темы
  entities/         # FSD Entities layer
    auth/           # Сущность аутентификации (API, slice, context)
    user/           # Сущность пользователя (типы)
  shared/           # FSD Shared layer
    api/            # API клиент (axios instance)
    utils/          # Утилиты
    styles/         # Глобальные стили и темы
    ui/             # UI компоненты
  providers/        # Провайдеры (StoreProvider, ThemeProvider)
```

## Аутентификация (client-app)

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

// В layout.tsx
<AuthProvider>
  {/* приложение */}
</AuthProvider>

// В компонентах
const { user, login, logout, isAuthenticated } = useAuth();
```

## Роутинг

- Next.js App Router
- `/login`, `/register` — страницы авторизации
- `/` — главная страница (защищена)
- `middleware.ts` защищает приватные маршруты

## Защищенные маршруты

- Middleware редиректит гостей на `/login`
- При наличии `access_token` или `refresh_token` доступ на приватные страницы

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

## Чек-лист авторизации (client-app)

**Предусловия:**
- Backend и БД запущены.
- В `.env` клиента корректный `NEXT_PUBLIC_BACKEND_URL`.
- Есть валидный пользователь (например, админ из seed).

**1) Гость**
- `/` → редирект на `/login`.
- `/login` доступен.
- `/register` доступен.

**2) Login**
- Валидные креды → редирект на `/`.
- В cookies есть `access_token` и `refresh_token` (httpOnly).

**3) Защищённые маршруты**
- После логина `/` доступен.
- Переход на `/login` → редирект на `/`.

**4) /auth/me**
- После логина запрос `/auth/me` успешен, user в сторе.

**5) Logout**
- Logout → редирект на `/login`, cookies удалены.
- `/` снова редиректит на `/login`.

**6) Refresh‑flow**
- Удалить `access_token`, оставить `refresh_token` → при заходе на `/` сессия восстанавливается.
- Удалить оба токена → редирект на `/login`.

**7) Ошибки**
- Неверные креды → ошибка в форме.
- Протухший refresh → user сбрасывается, редирект на `/login`.

## State Management (Redux Toolkit)

**Архитектура:**
- **Redux Toolkit** - глобальное состояние
- **RTK Query** - API слой
- **Redux Slice** (`entities/auth/model/auth.slice.ts`) - auth состояние
