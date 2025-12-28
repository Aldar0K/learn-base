import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseUUIDPipe,
} from "@nestjs/common";
import { CoursesService } from "./courses.service";
import { CreateCourseDto, UpdateCourseDto } from "./dto";
import { CurrentUser, Authenticated, AuthorOrAdmin, AdminOnly } from "../auth/decorators";

@Controller("courses")
export class CoursesController {
  constructor(private readonly coursesService: CoursesService) {}

  // Создание курса - только для авторов и админов
  @Post()
  @AuthorOrAdmin()
  async create(
    @Body() createCourseDto: CreateCourseDto,
    @CurrentUser() user: { id: string; role: string },
  ) {
    return this.coursesService.create(createCourseDto, user.id);
  }

  // Получение всех опубликованных курсов - доступно всем (включая неавторизованных)
  @Get()
  async findAll() {
    return this.coursesService.findAll();
  }

  // Получение всех курсов (включая неопубликованные) - только для авторов и админов
  @Get("my")
  @AuthorOrAdmin()
  async findMyCourses(@CurrentUser() user: { id: string; role: string }) {
    return this.coursesService.findAllForAuthor(user.id, user.role);
  }

  // Получение конкретного курса - доступно всем авторизованным
  @Get(":id")
  @Authenticated()
  async findOne(@Param("id", ParseUUIDPipe) id: string) {
    return this.coursesService.findOne(id);
  }

  // Обновление курса - только автор курса или админ
  @Patch(":id")
  @AuthorOrAdmin()
  async update(
    @Param("id", ParseUUIDPipe) id: string,
    @Body() updateCourseDto: UpdateCourseDto,
    @CurrentUser() user: { id: string; role: string },
  ) {
    return this.coursesService.update(id, updateCourseDto, user.id, user.role);
  }

  // Удаление курса - только автор курса или админ
  @Delete(":id")
  @AuthorOrAdmin()
  async remove(
    @Param("id", ParseUUIDPipe) id: string,
    @CurrentUser() user: { id: string; role: string },
  ) {
    return this.coursesService.remove(id, user.id, user.role);
  }
}

