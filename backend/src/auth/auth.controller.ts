import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  Get,
  Res,
} from "@nestjs/common";
import { Response } from "express";
import { AuthService } from "./auth.service";
import { RegisterDto, LoginDto } from "./dto";
import { CurrentUser, Authenticated, AdminOnly } from "./decorators";

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("register")
  async register(@Body() registerDto: RegisterDto, @Res({ passthrough: true }) res: Response) {
    const result = await this.authService.register(registerDto);

    // Устанавливаем http-only cookie с токеном
    res.cookie("access_token", result.accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // HTTPS только в production
      sameSite: "lax", // Защита от CSRF
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 дней
      path: "/",
    });

    // Возвращаем только пользователя, без токена
    return {
      user: result.user,
    };
  }

  @Post("login")
  @HttpCode(HttpStatus.OK)
  async login(@Body() loginDto: LoginDto, @Res({ passthrough: true }) res: Response) {
    const result = await this.authService.login(loginDto);

    // Устанавливаем http-only cookie с токеном
    res.cookie("access_token", result.accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // HTTPS только в production
      sameSite: "lax", // Защита от CSRF
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 дней
      path: "/",
    });

    // Возвращаем только пользователя, без токена
    return {
      user: result.user,
    };
  }

  @Post("logout")
  @HttpCode(HttpStatus.OK)
  @Authenticated()
  async logout(@Res({ passthrough: true }) res: Response) {
    // Очищаем cookie
    res.clearCookie("access_token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
    });

    return { message: "Logged out successfully" };
  }

  @Get("me")
  @Authenticated()
  async getMe(@CurrentUser() user: { id: string; email: string; role: string }) {
    return { user };
  }

  // Пример защищенного endpoint только для админов
  @Get("admin-only")
  @AdminOnly()
  async adminOnly(@CurrentUser() user: { id: string; email: string; role: string }) {
    return { message: "This is admin only endpoint", user };
  }
}

