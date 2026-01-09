import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

import {
  useGetCourseQuery,
  useUpdateCourseMutation,
  type UpdateCourseDto,
} from "@/entities/course";
import { Button, Input, Label, Textarea } from "@/shared/ui";

type EditCourseFormProps = {
  courseId: string;
};

export const EditCourseForm = ({ courseId }: EditCourseFormProps) => {
  const navigate = useNavigate();
  const { data: course, isLoading: isLoadingCourse } =
    useGetCourseQuery(courseId);
  const [updateCourse, { isLoading: isUpdating }] = useUpdateCourseMutation();
  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
    setError: setFormError,
  } = useForm<UpdateCourseDto>({
    defaultValues: {
      title: "",
      description: "",
      isPublished: false,
    },
  });

  const titleValue = watch("title");

  useEffect(() => {
    if (course) {
      reset({
        title: course.title,
        description: course.description || "",
        isPublished: course.isPublished,
      });
    }
  }, [course, reset]);

  const onSubmit = async (data: UpdateCourseDto) => {
    try {
      await updateCourse({
        id: courseId,
        data: {
          title: data.title?.trim(),
          description: data.description?.trim() || undefined,
          isPublished: data.isPublished,
        },
      }).unwrap();
      // Курс обновлен, остаемся на странице
    } catch (err: unknown) {
      const error = err as { data?: { message?: string }; status?: number };
      setFormError("root", {
        message:
          error?.data?.message ||
          (error?.status === 403
            ? "You don't have permission to edit this course"
            : error?.status === 404
              ? "Course not found"
              : "Failed to update course"),
      });
    }
  };

  if (isLoadingCourse) {
    return <div className="text-center py-8">Loading course...</div>;
  }

  if (!course) {
    return (
      <div className="text-center py-8">
        <p className="text-destructive">Course not found</p>
        <Button variant="outline" onClick={() => navigate(-1)} className="mt-4">
          Go back
        </Button>
      </div>
    );
  }

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

      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="isPublished"
          {...register("isPublished")}
          className="h-4 w-4 rounded border-gray-300"
        />
        <Label htmlFor="isPublished" className="cursor-pointer">
          Publish course
        </Label>
      </div>

      <div className="flex gap-4">
        <Button type="submit" disabled={isUpdating}>
          {isUpdating ? "Updating..." : "Update Course"}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => navigate(`/courses/${courseId}`)}
          disabled={isUpdating}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
};
