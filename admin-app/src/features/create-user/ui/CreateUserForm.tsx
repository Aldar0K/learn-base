import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

import {
  useCreateUserMutation,
  type CreateUserDto,
} from "@/entities/auth";
import type { UserRole } from "@/entities/user";
import { Button, Input, Label } from "@/shared/ui";

export const CreateUserForm = () => {
  const navigate = useNavigate();
  const [createUser, { isLoading }] = useCreateUserMutation();
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError: setFormError,
  } = useForm<CreateUserDto>({
    defaultValues: {
      email: "",
      password: "",
      role: "student",
    },
  });

  const onSubmit = async (data: CreateUserDto) => {
    try {
      await createUser({
        email: data.email.trim(),
        password: data.password,
        role: data.role,
      }).unwrap();
      navigate("/");
    } catch (err: unknown) {
      const error = err as { data?: { message?: string }; status?: number };
      setFormError("root", {
        message:
          error?.data?.message ||
          (error?.status === 403
            ? "You don't have permission to create users"
            : "Failed to create user"),
      });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {errors.root && (
        <div className="bg-destructive/10 text-destructive px-4 py-3 text-sm rounded-md">
          {errors.root.message}
        </div>
      )}

      <div>
        <Label htmlFor="email">Email *</Label>
        <Input
          id="email"
          type="email"
          {...register("email", {
            required: "Email is required",
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              message: "Invalid email address",
            },
          })}
          placeholder="user@example.com"
          className="mt-1"
        />
        {errors.email && (
          <p className="mt-1 text-xs text-destructive">{errors.email.message}</p>
        )}
      </div>

      <div>
        <Label htmlFor="password">Password *</Label>
        <Input
          id="password"
          type="password"
          {...register("password", {
            required: "Password is required",
            minLength: {
              value: 6,
              message: "Password must be at least 6 characters",
            },
          })}
          placeholder="••••••••"
          className="mt-1"
        />
        {errors.password && (
          <p className="mt-1 text-xs text-destructive">
            {errors.password.message}
          </p>
        )}
        <p className="mt-1 text-xs text-muted-foreground">
          Minimum 6 characters
        </p>
      </div>

      <div>
        <Label htmlFor="role">Role *</Label>
        <select
          id="role"
          {...register("role", { required: "Role is required" })}
          className="mt-1 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        >
          <option value="student">Student</option>
          <option value="author">Author</option>
          <option value="admin">Admin</option>
        </select>
        {errors.role && (
          <p className="mt-1 text-xs text-destructive">{errors.role.message}</p>
        )}
      </div>

      <div className="flex gap-4">
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Creating..." : "Create User"}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => navigate(-1)}
          disabled={isLoading}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
};

