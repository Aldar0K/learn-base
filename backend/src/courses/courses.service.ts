import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from "@nestjs/common";
import { PrismaService } from "../common/prisma";
import { CreateCourseDto, UpdateCourseDto } from "./dto";

@Injectable()
export class CoursesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createCourseDto: CreateCourseDto, authorId: string) {
    return this.prisma.course.create({
      data: {
        ...createCourseDto,
        authorId,
      },
      include: {
        author: {
          select: {
            id: true,
            email: true,
            role: true,
          },
        },
      },
    });
  }

  async findAll() {
    return this.prisma.course.findMany({
      where: {
        isPublished: true, // Показываем только опубликованные курсы
      },
      include: {
        author: {
          select: {
            id: true,
            email: true,
            role: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  }

  async findOne(id: string) {
    const course = await this.prisma.course.findUnique({
      where: { id },
      include: {
        author: {
          select: {
            id: true,
            email: true,
            role: true,
          },
        },
        lessons: {
          orderBy: {
            position: "asc",
          },
        },
      },
    });

    if (!course) {
      throw new NotFoundException("Course not found");
    }

    return course;
  }

  async update(
    id: string,
    updateCourseDto: UpdateCourseDto,
    userId: string,
    userRole: string
  ) {
    const course = await this.findOne(id);

    // Проверяем права: только автор курса или админ могут редактировать
    if (course.authorId !== userId && userRole !== "admin") {
      throw new ForbiddenException(
        "You don't have permission to edit this course"
      );
    }

    return this.prisma.course.update({
      where: { id },
      data: updateCourseDto,
      include: {
        author: {
          select: {
            id: true,
            email: true,
            role: true,
          },
        },
      },
    });
  }

  async remove(id: string, userId: string, userRole: string) {
    const course = await this.findOne(id);

    // Проверяем права: только автор курса или админ могут удалять
    if (course.authorId !== userId && userRole !== "admin") {
      throw new ForbiddenException(
        "You don't have permission to delete this course"
      );
    }

    return this.prisma.course.delete({
      where: { id },
    });
  }

  // Метод для получения всех курсов (включая неопубликованные) - только для авторов и админов
  async findAllForAuthor(authorId: string, userRole: string) {
    // Админ видит все курсы
    if (userRole === "admin") {
      return this.prisma.course.findMany({
        include: {
          author: {
            select: {
              id: true,
              email: true,
              role: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      });
    }

    // Автор видит только свои курсы
    return this.prisma.course.findMany({
      where: {
        authorId,
      },
      include: {
        author: {
          select: {
            id: true,
            email: true,
            role: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  }
}
