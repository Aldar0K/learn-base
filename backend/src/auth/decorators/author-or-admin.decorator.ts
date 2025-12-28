import { applyDecorators, UseGuards } from "@nestjs/common";
import { UserRole } from "@prisma/client";
import { JwtAuthGuard } from "../guards/jwt-auth.guard";
import { RolesGuard } from "../guards/roles.guard";
import { Roles } from "./roles.decorator";

/**
 * Декоратор для защиты endpoint для авторов и админов
 * Используется для создания и редактирования курсов
 */
export const AuthorOrAdmin = () => {
  return applyDecorators(
    UseGuards(JwtAuthGuard, RolesGuard),
    Roles(UserRole.author, UserRole.admin),
  );
};

