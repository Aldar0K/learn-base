import { baseApi } from "@/app/store";
import type { User, UserRole } from "../model/types";

export type GetUsersParams = {
  page?: number;
  itemsPerPage?: number;
  email?: string;
  name?: string;
  role?: UserRole;
};

export type CreateUserDto = {
  email: string;
  name?: string;
  password: string;
  role: UserRole;
};

export type UsersResponse = {
  users: User[];
  pagination: {
    page: number;
    itemsPerPage: number;
    total: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
};

export const usersApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getUsers: builder.query<UsersResponse, GetUsersParams>({
      query: (params) => ({
        url: "/users",
        method: "GET",
        params,
      }),
      providesTags: ["User"],
    }),

    createUser: builder.mutation<{ user: User }, CreateUserDto>({
      query: (data) => ({
        url: "/users",
        method: "POST",
        data,
      }),
      invalidatesTags: ["User"],
    }),
  }),
});

export const { useGetUsersQuery, useCreateUserMutation } = usersApi;

