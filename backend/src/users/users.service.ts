import { ConflictException, Injectable } from "@nestjs/common";
import { Prisma } from "@prisma/client";
import * as bcrypt from "bcrypt";
import { PrismaService } from "../common/prisma";
import { CreateUserDto, GetUsersDto } from "./dto";

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async createUser(createUserDto: CreateUserDto) {
    const { email, password, role, name } = createUserDto;

    // Проверяем, существует ли пользователь
    const existingUser = await this.prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new ConflictException("User with this email already exists");
    }

    // Хешируем пароль
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    // Создаем пользователя с указанной ролью
    const user = await this.prisma.user.create({
      data: {
        email,
        name,
        passwordHash,
        role,
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
      },
    });

    return { user };
  }

  async getUsers(getUsersDto: GetUsersDto) {
    const { page = 1, itemsPerPage = 10, email, name, role } = getUsersDto;

    const skip = (page - 1) * itemsPerPage;
    const take = itemsPerPage;

    // Строим условия фильтрации
    const where: Prisma.UserWhereInput = {};

    if (email) {
      where.email = {
        contains: email,
        mode: "insensitive",
      };
    }

    if (name) {
      where.name = {
        contains: name,
        mode: "insensitive",
      };
    }

    if (role) {
      where.role = role;
    }

    // Получаем пользователей и общее количество
    const [users, total] = await Promise.all([
      this.prisma.user.findMany({
        where,
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          createdAt: true,
        },
        skip,
        take,
        orderBy: {
          createdAt: "desc",
        },
      }),
      this.prisma.user.count({ where }),
    ]);

    const totalPages = Math.ceil(total / itemsPerPage);

    return {
      users,
      pagination: {
        page,
        itemsPerPage,
        total,
        totalPages,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1,
      },
    };
  }
}
