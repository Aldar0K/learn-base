# Role-based Guards

Документация по системе авторизации и guards в LearnBase.

## Иерархия ролей

```
admin > author > student
```

- **admin**: Может все (полный доступ ко всем операциям)
- **author**: Может создавать и редактировать курсы + все что может student
- **student**: Может только проходить курсы (читать, записываться, отправлять ответы)

## Guards и декораторы

### 1. `JwtAuthGuard`
Проверяет наличие валидного JWT токена. Токен может быть в:
- **Http-only cookie** (`access_token`) - основной способ, используется по умолчанию
- Authorization header (`Bearer <token>`) - для обратной совместимости

**Безопасность:**
- Токены хранятся в http-only cookies, недоступны через JavaScript
- SameSite: lax для защиты от CSRF
- Secure flag в production (только HTTPS)

### 2. `RolesGuard`
Проверяет роль пользователя с учетом иерархии. Если пользователь имеет роль `admin`, он автоматически имеет доступ ко всем операциям, доступным для `author` и `student`.

### 3. Декораторы для удобства

#### `@Authenticated()`
Защищает endpoint для всех авторизованных пользователей (любая роль).

```typescript
@Get("profile")
@Authenticated()
async getProfile(@CurrentUser() user) {
  return user;
}
```

#### `@AuthorOrAdmin()`
Защищает endpoint для авторов и админов. Используется для создания и редактирования курсов.

```typescript
@Post("courses")
@AuthorOrAdmin()
async createCourse(@Body() dto: CreateCourseDto, @CurrentUser() user) {
  return this.coursesService.create(dto, user.id);
}
```

#### `@AdminOnly()`
Защищает endpoint только для админов.

```typescript
@Delete("users/:id")
@AdminOnly()
async deleteUser(@Param("id") id: string) {
  // Только админ может удалять пользователей
}
```

#### `@Roles(...roles)`
Гибкий декоратор для указания конкретных ролей.

```typescript
@Get("admin-stats")
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.admin, UserRole.author)
async getStats() {
  // Доступ для admin и author
}
```

## Примеры использования

### Курсы

```typescript
@Controller("courses")
export class CoursesController {
  // Создание - только author и admin
  @Post()
  @AuthorOrAdmin()
  async create(@Body() dto: CreateCourseDto, @CurrentUser() user) {
    return this.coursesService.create(dto, user.id);
  }

  // Просмотр всех опубликованных - доступно всем (включая неавторизованных)
  @Get()
  async findAll() {
    return this.coursesService.findAll();
  }

  // Просмотр конкретного курса - только авторизованные
  @Get(":id")
  @Authenticated()
  async findOne(@Param("id") id: string) {
    return this.coursesService.findOne(id);
  }

  // Редактирование - только author курса или admin
  @Patch(":id")
  @AuthorOrAdmin()
  async update(@Param("id") id: string, @Body() dto: UpdateCourseDto, @CurrentUser() user) {
    return this.coursesService.update(id, dto, user.id, user.role);
  }
}
```

### Дополнительная проверка в сервисе

Для более сложной логики (например, проверка, что пользователь является автором курса) используется проверка в сервисе:

```typescript
async update(id: string, dto: UpdateCourseDto, userId: string, userRole: string) {
  const course = await this.findOne(id);

  // Проверяем права: только автор курса или админ могут редактировать
  if (course.authorId !== userId && userRole !== "admin") {
    throw new ForbiddenException("You don't have permission to edit this course");
  }

  return this.prisma.course.update({ where: { id }, data: dto });
}
```

## Права доступа по ролям

### Student (ученик)
- ✅ Просмотр опубликованных курсов
- ✅ Просмотр конкретного курса
- ✅ Запись на курс (enrollment)
- ✅ Отправка ответов (submissions)
- ❌ Создание курсов
- ❌ Редактирование курсов
- ❌ Удаление курсов

### Author (учитель)
- ✅ Все права student
- ✅ Создание курсов
- ✅ Редактирование своих курсов
- ✅ Удаление своих курсов
- ✅ Просмотр своих неопубликованных курсов
- ❌ Редактирование чужих курсов (кроме admin)
- ❌ Удаление чужих курсов (кроме admin)

### Admin (администратор)
- ✅ Все права author
- ✅ Редактирование любых курсов
- ✅ Удаление любых курсов
- ✅ Управление пользователями
- ✅ Просмотр всех курсов (включая неопубликованные)

