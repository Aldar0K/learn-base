import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Query,
} from "@nestjs/common";
import {
  ApiCookieAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from "@nestjs/swagger";
import { AdminOnly } from "../auth/decorators";
import { CreateUserDto, GetUsersDto } from "./dto";
import { UsersService } from "./users.service";

@ApiTags("users")
@Controller("users")
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @AdminOnly()
  @HttpCode(HttpStatus.CREATED)
  @ApiCookieAuth("access_token")
  @ApiOperation({ summary: "Создать нового пользователя (только для админов)" })
  @ApiResponse({
    status: 201,
    description: "Пользователь успешно создан",
    schema: {
      type: "object",
      properties: {
        user: {
          type: "object",
          properties: {
            id: { type: "string" },
            email: { type: "string" },
            name: { type: "string", nullable: true },
            role: { type: "string", enum: ["student", "author", "admin"] },
            createdAt: { type: "string" },
          },
        },
      },
    },
  })
  @ApiResponse({ status: 400, description: "Неверные данные" })
  @ApiResponse({ status: 401, description: "Не авторизован" })
  @ApiResponse({ status: 403, description: "Доступ запрещен" })
  @ApiResponse({ status: 409, description: "Пользователь уже существует" })
  async createUser(@Body() createUserDto: CreateUserDto) {
    return this.usersService.createUser(createUserDto);
  }

  @Get()
  @AdminOnly()
  @ApiCookieAuth("access_token")
  @ApiOperation({
    summary:
      "Получить список пользователей с пагинацией и фильтрацией (только для админов)",
  })
  @ApiResponse({
    status: 200,
    description: "Список пользователей",
    schema: {
      type: "object",
      properties: {
        users: {
          type: "array",
          items: {
            type: "object",
            properties: {
              id: { type: "string" },
              email: { type: "string" },
              name: { type: "string", nullable: true },
              role: { type: "string", enum: ["student", "author", "admin"] },
              createdAt: { type: "string" },
            },
          },
        },
        pagination: {
          type: "object",
          properties: {
            page: { type: "number" },
            itemsPerPage: { type: "number" },
            total: { type: "number" },
            totalPages: { type: "number" },
            hasNextPage: { type: "boolean" },
            hasPreviousPage: { type: "boolean" },
          },
        },
      },
    },
  })
  @ApiResponse({ status: 401, description: "Не авторизован" })
  @ApiResponse({ status: 403, description: "Доступ запрещен" })
  async getUsers(@Query() getUsersDto: GetUsersDto) {
    return this.usersService.getUsers(getUsersDto);
  }
}
