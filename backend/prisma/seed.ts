// Seed файл для тестовых данных
// Запуск: npm run prisma:seed или yarn prisma:seed

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // Создаем тестовых пользователей
  const admin = await prisma.user.upsert({
    where: { email: "admin@learnbase.com" },
    update: {},
    create: {
      email: "admin@learnbase.com",
      passwordHash: "$2b$10$example", // В реальности - хеш пароля
      role: "admin",
    },
  });

  const author = await prisma.user.upsert({
    where: { email: "author@learnbase.com" },
    update: {},
    create: {
      email: "author@learnbase.com",
      passwordHash: "$2b$10$example",
      role: "author",
    },
  });

  const student = await prisma.user.upsert({
    where: { email: "student@learnbase.com" },
    update: {},
    create: {
      email: "student@learnbase.com",
      passwordHash: "$2b$10$example",
      role: "student",
    },
  });

  console.log("✅ Users created");

  // Создаем тестовый курс
  const course = await prisma.course.create({
    data: {
      title: "Введение в программирование",
      description: "Базовый курс по программированию для начинающих",
      authorId: author.id,
      isPublished: true,
      lessons: {
        create: [
          {
            title: "Урок 1: Основы",
            position: 1,
            steps: {
              create: [
                {
                  type: "text",
                  position: 1,
                  content: {
                    text: "Добро пожаловать в курс программирования!",
                  },
                },
                {
                  type: "quiz",
                  position: 2,
                  content: {
                    question: "2 + 2 = ?",
                    options: [2, 3, 4, 5],
                    correct: [4],
                  },
                },
                {
                  type: "code",
                  position: 3,
                  content: {
                    language: "python",
                    tests: [{ input: "2", output: "4" }],
                  },
                },
              ],
            },
          },
        ],
      },
    },
  });

  console.log("✅ Course created");

  // Записываем студента на курс
  await prisma.enrollment.create({
    data: {
      userId: student.id,
      courseId: course.id,
    },
  });

  console.log("✅ Enrollment created");

  console.log("🎉 Seeding completed!");
}

main()
  .catch((e) => {
    console.error("❌ Seeding failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

