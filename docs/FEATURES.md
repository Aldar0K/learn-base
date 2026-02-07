# Feature Log

## 2026-02-07 - Client app SSR auth via Next route handlers

- Added route groups in `client-app` for public and protected sections.
- Implemented server-side guard in `app/(protected)/layout.tsx` via `getCurrentUser()`.
- Added auth proxy handlers under `client-app/src/app/api/auth/*` with `Set-Cookie` forwarding.
- Updated auth provider to use `initialUser` and explicit `router.refresh()` after auth mutations.
- Switched client API base URL to `"/api"` for cookie-safe same-origin auth requests.
- Added `BACKEND_URL` and `APP_URL` to client dev env examples and docker compose environment.
- Fixed backend `MeAuthGuard` refresh flow to run in `canActivate` (async) and set `request.user` explicitly after silent refresh.
- Added protected-layout client session sync call (`/api/auth/me`) to ensure refreshed `access_token` is written to browser cookies after SSR guard.
