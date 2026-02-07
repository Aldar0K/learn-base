# Client Frontend Architecture (client-app)

Описание архитектуры клиентского фронтенда LearnBase (Next.js App Router).

## Обзор

`client-app` — клиентское приложение на Next.js с FSD-структурой, RTK Query и серверной проверкой авторизации для protected-разделов.

## Структура (ключевые точки)

```text
client-app/src/
  app/
    layout.tsx                 # Корневой layout (общие providers)
    providers.tsx              # StoreProvider + ThemeProvider
    (public)/
      layout.tsx               # AuthProvider(initialUser=null)
      login/page.tsx
      register/page.tsx
    (protected)/
      layout.tsx               # Server guard через getCurrentUser()
      page.tsx
    api/auth/
      _utils.ts                # Proxy + forward Set-Cookie
      me/route.ts
      login/route.ts
      register/route.ts
      logout/route.ts
      refresh/route.ts
  lib/
    auth.ts                    # Server helper getCurrentUser()
  entities/auth/
    api/auth.api.ts
    model/auth-context.tsx
  shared/api/
    api-client.ts              # baseURL=/api
```

## Авторизация

### Backend assumptions

- Backend ставит `HttpOnly` cookies (`access_token`, `refresh_token`).
- `GET /api/auth/me` при истекшем access может сделать silent refresh по `refresh_token` и вернуть новый `Set-Cookie`.

### Client flow

1. `app/(protected)/layout.tsx` на сервере вызывает `getCurrentUser()`.
2. `getCurrentUser()` запрашивает только `GET /api/auth/me` (через Next route handler).
3. Если пользователь не получен, layout делает `redirect("/login")` до рендера страницы.
4. Если пользователь получен, он передается в `AuthProvider` как `initialUser`.
5. На protected layout дополнительно выполняется client-side sync вызов `/api/auth/me` для применения `Set-Cookie` в браузере после SSR-проверки.

Итог:
- нет client-side мигания защищенной страницы;
- корректный SSR-guard;
- единая точка чтения сессии.
- silent refresh корректно обновляет browser cookies даже при первом server-side рендере protected страницы.

## Proxy auth handlers (`app/api/auth/*`)

Route handlers проксируют запросы в backend и форвардят `Set-Cookie` обратно в ответ Next.

Это обязательно для сценария silent refresh: backend обновил access cookie на `/me`, браузер получил обновленный cookie от Next response.

Поддерживаются:
- `GET /api/auth/me`
- `POST /api/auth/login`
- `POST /api/auth/register`
- `POST /api/auth/logout`
- `POST /api/auth/refresh`

## AuthProvider

`AuthProvider` в `entities/auth/model/auth-context.tsx`:
- получает `initialUser`;
- не делает обязательный `/me` на mount;
- предоставляет `login/register/logout`;
- после login/register/logout вызывает `router.refresh()` для синхронизации серверного состояния.

## API слой

`shared/api/api-client.ts` использует `baseURL: "/api"` и `withCredentials: true`.

Это исключает прямые browser-запросы в backend и централизует cookie-логику в Next route handlers.

## Environment variables

Минимум для server-side auth в client-app:

- `BACKEND_URL` — URL backend для Next route handlers (server-only).
- `APP_URL` — URL текущего Next приложения для server fetch в `getCurrentUser()`.
- `NEXT_PUBLIC_BACKEND_URL` — опционально; для текущей auth-схемы не обязателен.

## Middleware

`middleware.ts` выполняет только ранний редирект гостей на `/login`, если нет обоих cookies (`access_token` и `refresh_token`).

Финальная авторизационная проверка остается в `app/(protected)/layout.tsx`.
