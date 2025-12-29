import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { UserRole } from "@prisma/client";
import { ROLES_KEY } from "../decorators/roles.decorator";

/**
 * Иерархия ролей:
 * - admin: может все
 * - author: может создавать/редактировать курсы + все что может student
 * - student: может только проходить курсы (читать, записываться, отправлять ответы)
 */
const ROLE_HIERARCHY: Record<UserRole, UserRole[]> = {
  [UserRole.admin]: [UserRole.admin, UserRole.author, UserRole.student],
  [UserRole.author]: [UserRole.author, UserRole.student],
  [UserRole.student]: [UserRole.student],
};

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()]
    );

    if (!requiredRoles || requiredRoles.length === 0) {
      return true; // Если роли не указаны, разрешаем доступ
    }

    const { user } = context.switchToHttp().getRequest();

    if (!user) {
      return false;
    }

    const userRole = user.role as UserRole;
    const allowedRoles = ROLE_HIERARCHY[userRole] || [];

    // Проверяем, есть ли хотя бы одна требуемая роль в списке разрешенных для пользователя
    return requiredRoles.some((role) => allowedRoles.includes(role));
  }
}
