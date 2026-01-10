export type UserRole = "student" | "author" | "admin";

export type User = {
  id: string;
  email: string;
  name: string | null;
  role: UserRole;
};
