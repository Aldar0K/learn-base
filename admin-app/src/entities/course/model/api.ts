import { baseApi } from "@/app/store";
import type { Course, CreateCourseDto, UpdateCourseDto } from "./types";

export const coursesApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getCourses: builder.query<Course[], void>({
      query: () => "/courses",
      providesTags: ["Course"],
    }),

    getMyCourses: builder.query<Course[], void>({
      query: () => "/courses/my",
      providesTags: ["Course"],
    }),

    getCourse: builder.query<Course, string>({
      query: (id) => `/courses/${id}`,
      providesTags: (_result, _error, id) => [{ type: "Course", id }],
    }),

    createCourse: builder.mutation<Course, CreateCourseDto>({
      query: (data) => ({
        url: "/courses",
        method: "POST",
        data,
      }),
      invalidatesTags: ["Course"],
    }),

    updateCourse: builder.mutation<
      Course,
      { id: string; data: UpdateCourseDto }
    >({
      query: ({ id, data }) => ({
        url: `/courses/${id}`,
        method: "PATCH",
        data,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: "Course", id },
        "Course",
      ],
    }),

    deleteCourse: builder.mutation<{ message: string }, string>({
      query: (id) => ({
        url: `/courses/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (_result, _error, id) => [
        { type: "Course", id },
        "Course",
      ],
    }),
  }),
});

export const {
  useGetCoursesQuery,
  useGetMyCoursesQuery,
  useGetCourseQuery,
  useCreateCourseMutation,
  useUpdateCourseMutation,
  useDeleteCourseMutation,
} = coursesApi;
