import { baseApi } from "@/app/store";
import type { User, UserRole } from "@/entities/user";
import { authActions } from "./auth.slice";

export type LoginDto = {
  email: string;
  password: string;
};

export type CreateUserDto = {
  email: string;
  name?: string;
  password: string;
  role: UserRole;
};

export type AuthResponse = {
  user: User;
};

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<AuthResponse, LoginDto>({
      query: (data) => ({
        url: "/auth/login",
        method: "POST",
        data,
      }),
      transformResponse: (response: AuthResponse): AuthResponse => {
        // Admin-app доступен только авторам и админам
        if (response.user.role === "student") {
          throw new Error(
            "Access denied. Admin panel is available only for authors and admins."
          );
        }
        return response;
      },
      async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(authActions.setUser(data.user));
        } catch {
          // Игнорируем ошибки
        }
      },
    }),

    logout: builder.mutation<{ message: string }, void>({
      query: () => ({
        url: "/auth/logout",
        method: "POST",
      }),
      async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          dispatch(authActions.logout());
        } catch {
          dispatch(authActions.logout());
        }
      },
    }),

    getMe: builder.query<{ user: User }, void>({
      query: () => "/auth/me",
      providesTags: ["User"],
      transformResponse: (response: { user: User }): { user: User } => {
        // Admin-app доступен только авторам и админам
        if (response.user.role === "student") {
          throw new Error(
            "Access denied. Admin panel is available only for authors and admins."
          );
        }
        return response;
      },
      async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
        dispatch(authActions.setLoading(true));
        try {
          const { data } = await queryFulfilled;
          dispatch(authActions.setUser(data.user));
        } catch (error) {
          // Если ошибка 401 и refresh не помог - очищаем user
          // Логика refresh обрабатывается в baseQuery
          const err = error as { status?: number; message?: string };
          if (err.status === 401 || err.message?.includes("Access denied")) {
            dispatch(authActions.setUser(null));
          }
        } finally {
          dispatch(authActions.setLoading(false));
        }
      },
    }),

    refresh: builder.mutation<AuthResponse, void>({
      query: () => ({
        url: "/auth/refresh",
        method: "POST",
      }),
      transformResponse: (response: AuthResponse): AuthResponse => {
        // Admin-app доступен только авторам и админам
        if (response.user.role === "student") {
          throw new Error(
            "Access denied. Admin panel is available only for authors and admins."
          );
        }
        return response;
      },
      async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(authActions.setUser(data.user));
        } catch {
          // При ошибке refresh очищаем user
          dispatch(authActions.setUser(null));
        }
      },
    }),

    createUser: builder.mutation<{ user: User }, CreateUserDto>({
      query: (data) => ({
        url: "/auth/users",
        method: "POST",
        data,
      }),
      invalidatesTags: ["User"],
    }),
  }),
});

export const {
  useLoginMutation,
  useLogoutMutation,
  useGetMeQuery,
  useLazyGetMeQuery,
  useRefreshMutation,
  useCreateUserMutation,
} = authApi;
