// Seed файл для тестовых данных
// Запуск: npm run prisma:seed или yarn prisma:seed

import { PrismaClient } from "@prisma/client";
import * as bcrypt from "bcrypt";

const prisma = new PrismaClient();

// Пароли из переменных окружения с fallback значениями
const ADMIN_PASSWORD = process.env.SEED_ADMIN_PASSWORD || "password123";
const AUTHOR_PASSWORD = process.env.SEED_AUTHOR_PASSWORD || "password123";
const STUDENT_PASSWORD = process.env.SEED_STUDENT_PASSWORD || "password123";

async function main() {
  console.log("🌱 Seeding database...");

  // Хешируем пароли для каждого пользователя отдельно
  const saltRounds = 10;
  const adminPasswordHash = await bcrypt.hash(ADMIN_PASSWORD, saltRounds);
  const authorPasswordHash = await bcrypt.hash(AUTHOR_PASSWORD, saltRounds);
  const studentPasswordHash = await bcrypt.hash(STUDENT_PASSWORD, saltRounds);

  // Создаем тестовых пользователей
  const admin = await prisma.user.upsert({
    where: { email: "admin@learnbase.com" },
    update: {},
    create: {
      email: "admin@learnbase.com",
      passwordHash: adminPasswordHash,
      role: "admin",
    },
  });

  const author = await prisma.user.upsert({
    where: { email: "author@learnbase.com" },
    update: {},
    create: {
      email: "author@learnbase.com",
      passwordHash: authorPasswordHash,
      role: "author",
    },
  });

  const student = await prisma.user.upsert({
    where: { email: "student@learnbase.com" },
    update: {},
    create: {
      email: "student@learnbase.com",
      passwordHash: studentPasswordHash,
      role: "student",
    },
  });

  console.log("✅ Users created");
  console.log("\n📋 Test accounts:");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log(`Admin:   ${admin.email} / ${ADMIN_PASSWORD}`);
  console.log(`Author:  ${author.email} / ${AUTHOR_PASSWORD}`);
  console.log(`Student: ${student.email} / ${STUDENT_PASSWORD}`);
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");

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

