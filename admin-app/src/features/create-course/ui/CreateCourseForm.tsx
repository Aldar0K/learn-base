import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

import {
  useCreateCourseMutation,
  type CreateCourseDto,
} from "@/entities/course";
import { Button, Input, Label, Textarea } from "@/shared/ui";

export const CreateCourseForm = () => {
  const navigate = useNavigate();
  const [createCourse, { isLoading }] = useCreateCourseMutation();
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    setError: setFormError,
  } = useForm<CreateCourseDto>({
    defaultValues: {
      title: "",
      description: "",
    },
  });

  const titleValue = watch("title");

  const onSubmit = async (data: CreateCourseDto) => {
    try {
      const course = await createCourse({
        title: data.title.trim(),
        description: data.description?.trim() || undefined,
      }).unwrap();
      navigate(`/courses/${course.id}`);
    } catch (err: unknown) {
      const error = err as { data?: { message?: string }; status?: number };
      setFormError("root", {
        message:
          error?.data?.message ||
          (error?.status === 403
            ? "You don't have permission to create courses"
            : "Failed to create course"),
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
        <Label htmlFor="title">Title *</Label>
        <Input
          id="title"
          type="text"
          {...register("title", {
            required: "Title is required",
            maxLength: {
              value: 200,
              message: "Title must be less than 200 characters",
            },
          })}
          placeholder="Course title"
          className="mt-1"
        />
        {errors.title && (
          <p className="mt-1 text-xs text-destructive">
            {errors.title.message}
          </p>
        )}
        {!errors.title && (
          <p className="mt-1 text-xs text-muted-foreground">
            {titleValue?.length || 0}/200 characters
          </p>
        )}
      </div>

      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          {...register("description")}
          placeholder="Course description"
          className="mt-1"
          rows={6}
        />
      </div>

      <div className="flex gap-4">
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Creating..." : "Create Course"}
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
