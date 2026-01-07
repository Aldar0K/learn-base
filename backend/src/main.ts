import { Logger, ValidationPipe } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { AppModule } from "./app.module";
import cookieParser from "cookie-parser";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix("api");

  // Cookie parser для работы с http-only cookies
  // Должен быть ДО CORS, чтобы cookies правильно обрабатывались
  app.use(cookieParser());

  // CORS настройка для работы с credentials (cookies)
  const allowedOrigins = [
    process.env.FRONTEND_URL || "http://localhost:3000",
    "http://localhost:3000", // admin-app
    "http://localhost:3002", // client-app
  ];

  app.enableCors({
    origin: (origin, callback) => {
      // Разрешаем запросы без origin (например, Postman, curl)
      if (!origin) {
        return callback(null, true);
      }
      // Проверяем, есть ли origin в списке разрешенных
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      // В dev режиме разрешаем все локальные origin'ы
      if (
        process.env.NODE_ENV === "development" &&
        origin.startsWith("http://localhost:")
      ) {
        return callback(null, true);
      }
      callback(new Error("Not allowed by CORS"));
    },
    credentials: true, // Разрешаем отправку cookies
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  });

  // Глобальная валидация
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Удаляет свойства, которых нет в DTO
      forbidNonWhitelisted: true, // Выбрасывает ошибку, если есть лишние свойства
      transform: true, // Автоматически преобразует типы
    })
  );

  // Swagger документация
  const config = new DocumentBuilder()
    .setTitle("LearnBase API")
    .setDescription("API для платформы обучения LearnBase")
    .setVersion("1.0")
    .addTag("auth", "Аутентификация и авторизация")
    .addTag("courses", "Управление курсами")
    .addCookieAuth("access_token", {
      type: "http",
      in: "Cookie",
      scheme: "Bearer",
    })
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("api/docs", app, document, {
    swaggerOptions: {
      persistAuthorization: true,
    },
  });

  const port = process.env.PORT || 3001;
  await app.listen(port);

  Logger.log(`Backend listening on http://localhost:${port}/api`);
  Logger.log(`Swagger docs: http://localhost:${port}/api/docs`);
  Logger.log(`Health check: http://localhost:${port}/api/health`);
  Logger.log(`Auth endpoints: http://localhost:${port}/api/auth`);
}

bootstrap();
