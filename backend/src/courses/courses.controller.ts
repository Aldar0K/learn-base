import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
} from "@nestjs/common";
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiCookieAuth,
  ApiParam,
} from "@nestjs/swagger";
import { Authenticated, AuthorOrAdmin, CurrentUser } from "../auth/decorators";
import { CoursesService } from "./courses.service";
import { CreateCourseDto, UpdateCourseDto } from "./dto";

@ApiTags("courses")
@Controller("courses")
export class CoursesController {
  constructor(private readonly coursesService: CoursesService) {}

  @Post()
  @AuthorOrAdmin()
  @ApiCookieAuth("access_token")
  @ApiOperation({ summary: "Создать новый курс" })
  @ApiResponse({ status: 201, description: "Курс успешно создан" })
  @ApiResponse({ status: 401, description: "Не авторизован" })
  @ApiResponse({
    status: 403,
    description: "Доступ запрещен (только для авторов и админов)",
  })
  async create(
    @Body() createCourseDto: CreateCourseDto,
    @CurrentUser() user: { id: string; role: string }
  ) {
    return this.coursesService.create(createCourseDto, user.id);
  }

  @Get()
  @ApiOperation({ summary: "Получить все опубликованные курсы" })
  @ApiResponse({ status: 200, description: "Список опубликованных курсов" })
  async findAll() {
    return this.coursesService.findAll();
  }

  @Get("my")
  @AuthorOrAdmin()
  @ApiCookieAuth("access_token")
  @ApiOperation({
    summary: "Получить все мои курсы (включая неопубликованные)",
  })
  @ApiResponse({ status: 200, description: "Список курсов пользователя" })
  @ApiResponse({ status: 401, description: "Не авторизован" })
  @ApiResponse({
    status: 403,
    description: "Доступ запрещен (только для авторов и админов)",
  })
  async findMyCourses(@CurrentUser() user: { id: string; role: string }) {
    return this.coursesService.findAllForAuthor(user.id, user.role);
  }

  @Get(":id")
  @Authenticated()
  @ApiCookieAuth("access_token")
  @ApiOperation({ summary: "Получить курс по ID" })
  @ApiParam({ name: "id", description: "UUID курса" })
  @ApiResponse({ status: 200, description: "Информация о курсе" })
  @ApiResponse({ status: 401, description: "Не авторизован" })
  @ApiResponse({ status: 404, description: "Курс не найден" })
  async findOne(@Param("id", ParseUUIDPipe) id: string) {
    return this.coursesService.findOne(id);
  }

  @Patch(":id")
  @AuthorOrAdmin()
  @ApiCookieAuth("access_token")
  @ApiOperation({ summary: "Обновить курс" })
  @ApiParam({ name: "id", description: "UUID курса" })
  @ApiResponse({ status: 200, description: "Курс успешно обновлен" })
  @ApiResponse({ status: 401, description: "Не авторизован" })
  @ApiResponse({
    status: 403,
    description: "Доступ запрещен (только автор курса или админ)",
  })
  @ApiResponse({ status: 404, description: "Курс не найден" })
  async update(
    @Param("id", ParseUUIDPipe) id: string,
    @Body() updateCourseDto: UpdateCourseDto,
    @CurrentUser() user: { id: string; role: string }
  ) {
    return this.coursesService.update(id, updateCourseDto, user.id, user.role);
  }

  @Delete(":id")
  @AuthorOrAdmin()
  @ApiCookieAuth("access_token")
  @ApiOperation({ summary: "Удалить курс" })
  @ApiParam({ name: "id", description: "UUID курса" })
  @ApiResponse({ status: 200, description: "Курс успешно удален" })
  @ApiResponse({ status: 401, description: "Не авторизован" })
  @ApiResponse({
    status: 403,
    description: "Доступ запрещен (только автор курса или админ)",
  })
  @ApiResponse({ status: 404, description: "Курс не найден" })
  async remove(
    @Param("id", ParseUUIDPipe) id: string,
    @CurrentUser() user: { id: string; role: string }
  ) {
    return this.coursesService.remove(id, user.id, user.role);
  }
}
