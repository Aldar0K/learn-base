import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

// Маршруты, которые требуют авторизации
const protectedRoutes = ["/"];

// Маршруты, которые доступны только неавторизованным пользователям
const authRoutes = ["/login", "/register"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Проверяем наличие cookies с токенами
  const accessToken = request.cookies.get("access_token");
  const refreshToken = request.cookies.get("refresh_token");

  // Если пользователь пытается зайти на защищенный маршрут без токенов
  if (protectedRoutes.includes(pathname) && !accessToken && !refreshToken) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("from", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Если пользователь с токенами пытается зайти на страницы авторизации
  if (authRoutes.includes(pathname) && (accessToken || refreshToken)) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
