import type { UserRole } from "@/entities/user";

export type Course = {
  id: string;
  title: string;
  description: string | null;
  authorId: string;
  isPublished: boolean;
  createdAt: string;
  author: {
    id: string;
    email: string;
    role: UserRole;
  };
  lessons?: Lesson[];
};

export type Lesson = {
  id: string;
  courseId: string;
  title: string;
  position: number;
};

export type CreateCourseDto = {
  title: string;
  description?: string;
};

export type UpdateCourseDto = {
  title?: string;
  description?: string;
  isPublished?: boolean;
};
