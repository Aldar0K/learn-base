import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Res,
  UnauthorizedException,
} from "@nestjs/common";
import {
  ApiCookieAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from "@nestjs/swagger";
import { Request, Response } from "express";
import { AuthService } from "./auth.service";
import { AdminOnly, Authenticated, CurrentUser } from "./decorators";
import { LoginDto, RegisterDto } from "./dto";

@ApiTags("auth")
@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("register")
  @ApiOperation({ summary: "Регистрация нового пользователя" })
  @ApiResponse({
    status: 201,
    description: "Пользователь успешно зарегистрирован",
    schema: {
      type: "object",
      properties: {
        user: {
          type: "object",
          properties: {
            id: { type: "string" },
            email: { type: "string" },
            role: { type: "string", enum: ["student", "author", "admin"] },
          },
        },
      },
    },
  })
  @ApiResponse({ status: 400, description: "Неверные данные" })
  @ApiResponse({ status: 409, description: "Пользователь уже существует" })
  async register(
    @Body() registerDto: RegisterDto,
    @Res({ passthrough: true }) res: Response
  ) {
    const result = await this.authService.register(registerDto);

    // Устанавливаем http-only cookies с токенами
    const accessTokenMaxAge = 15 * 60 * 1000; // 15 минут
    const refreshTokenMaxAge = 7 * 24 * 60 * 60 * 1000; // 7 дней

    res.cookie("access_token", result.accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: accessTokenMaxAge,
      path: "/",
    });

    res.cookie("refresh_token", result.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: refreshTokenMaxAge,
      path: "/",
    });

    // Возвращаем только пользователя, без токенов
    return {
      user: result.user,
    };
  }

  @Post("login")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Вход в систему" })
  @ApiResponse({
    status: 200,
    description: "Успешный вход",
    schema: {
      type: "object",
      properties: {
        user: {
          type: "object",
          properties: {
            id: { type: "string" },
            email: { type: "string" },
            role: { type: "string", enum: ["student", "author", "admin"] },
          },
        },
      },
    },
  })
  @ApiResponse({ status: 401, description: "Неверный email или пароль" })
  async login(
    @Body() loginDto: LoginDto,
    @Res({ passthrough: true }) res: Response
  ) {
    const result = await this.authService.login(loginDto);

    // Устанавливаем http-only cookies с токенами
    const accessTokenMaxAge = 15 * 60 * 1000; // 15 минут
    const refreshTokenMaxAge = 7 * 24 * 60 * 60 * 1000; // 7 дней

    res.cookie("access_token", result.accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: accessTokenMaxAge,
      path: "/",
    });

    res.cookie("refresh_token", result.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: refreshTokenMaxAge,
      path: "/",
    });

    // Возвращаем только пользователя, без токенов
    return {
      user: result.user,
    };
  }

  @Post("logout")
  @HttpCode(HttpStatus.OK)
  @Authenticated()
  @ApiCookieAuth("access_token")
  @ApiOperation({ summary: "Выход из системы" })
  @ApiResponse({
    status: 200,
    description: "Успешный выход",
    schema: {
      type: "object",
      properties: {
        message: { type: "string", example: "Logged out successfully" },
      },
    },
  })
  @ApiResponse({ status: 401, description: "Не авторизован" })
  async logout(@Res({ passthrough: true }) res: Response) {
    // Очищаем cookies с токенами
    res.clearCookie("access_token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
    });

    res.clearCookie("refresh_token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
    });

    return { message: "Logged out successfully" };
  }

  @Post("refresh")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Обновить access token" })
  @ApiResponse({
    status: 200,
    description: "Токен успешно обновлен",
    schema: {
      type: "object",
      properties: {
        user: {
          type: "object",
          properties: {
            id: { type: "string" },
            email: { type: "string" },
            role: { type: "string", enum: ["student", "author", "admin"] },
          },
        },
      },
    },
  })
  @ApiResponse({ status: 401, description: "Неверный refresh token" })
  async refresh(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
    @Body() body?: { refreshToken?: string }
  ) {
    // Получаем refresh token из cookie или body
    const refreshToken = body?.refreshToken || req.cookies?.refresh_token;

    if (!refreshToken) {
      // Логируем для отладки
      console.log("Refresh token not found. Cookies:", req.cookies);
      console.log("Request headers:", req.headers.cookie);
      throw new UnauthorizedException("Refresh token not provided");
    }

    const result = await this.authService.refreshToken(refreshToken);

    // Устанавливаем новый access token в cookie
    const accessTokenMaxAge = 15 * 60 * 1000; // 15 минут

    res.cookie("access_token", result.accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: accessTokenMaxAge,
      path: "/",
    });

    // Возвращаем только пользователя, без токена
    return {
      user: result.user,
    };
  }

  @Get("me")
  @Authenticated()
  @ApiCookieAuth("access_token")
  @ApiOperation({ summary: "Получить информацию о текущем пользователе" })
  @ApiResponse({
    status: 200,
    description: "Информация о пользователе",
    schema: {
      type: "object",
      properties: {
        user: {
          type: "object",
          properties: {
            id: { type: "string" },
            email: { type: "string" },
            role: { type: "string", enum: ["student", "author", "admin"] },
          },
        },
      },
    },
  })
  @ApiResponse({ status: 401, description: "Не авторизован" })
  async getMe(
    @CurrentUser() user: { id: string; email: string; role: string }
  ) {
    return { user };
  }

  @Get("admin-only")
  @AdminOnly()
  @ApiCookieAuth("access_token")
  @ApiOperation({ summary: "Пример endpoint только для админов" })
  @ApiResponse({
    status: 200,
    description: "Доступ разрешен",
  })
  @ApiResponse({ status: 401, description: "Не авторизован" })
  @ApiResponse({ status: 403, description: "Доступ запрещен" })
  async adminOnly(
    @CurrentUser() user: { id: string; email: string; role: string }
  ) {
    return { message: "This is admin only endpoint", user };
  }
}
