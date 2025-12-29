import { applyDecorators, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "../guards/jwt-auth.guard";

/**
 * Декоратор для защиты endpoint для всех авторизованных пользователей
 * Любая роль (student, author, admin) может получить доступ
 */
export const Authenticated = () => {
  return applyDecorators(UseGuards(JwtAuthGuard));
};
